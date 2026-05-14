import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { and, isNull, eq, desc } from "drizzle-orm";
import {
  db,
  subscribersTable,
  dispatchesTable,
  type Subscriber,
} from "@workspace/db";
import { getUncachableResendClient } from "../lib/resend";
import {
  buildWelcomeEmail,
  buildDispatchEmail,
  buildUnsubscribeConfirmationPage,
} from "../lib/newsletter-emails";
import { draftNewsletter } from "../lib/draft-newsletter";
import { sendDispatch } from "../lib/send-dispatch";

const router: IRouter = Router();

const subscribeSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  source: z.string().max(60).optional(),
});

const ipHits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 8;
const WINDOW_MS = 60_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function newToken(): string {
  return randomBytes(24).toString("hex");
}

async function sendWelcomeEmail(sub: Subscriber, log?: Request["log"]): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    const { subject, html, text } = buildWelcomeEmail(sub.name, sub.unsubscribeToken);
    const result = await client.emails.send({
      from: fromEmail,
      to: sub.email,
      subject,
      html,
      text,
    });
    if (result.error) {
      log?.error({ err: result.error, email: sub.email }, "welcome email failed");
    } else {
      log?.info({ id: result.data?.id, email: sub.email }, "welcome email sent");
    }
  } catch (err) {
    log?.error({ err, email: sub.email }, "welcome email threw");
  }
}

router.post("/newsletter/subscribe", async (req, res) => {
  const ip = (req.ip ?? req.socket.remoteAddress ?? "unknown").toString();
  if (rateLimited(ip)) {
    return res
      .status(429)
      .json({ ok: false, error: "Too many attempts. Please try again in a moment." });
  }

  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }

  const { name, email, source } = parsed.data;

  try {
    const inserted = await db
      .insert(subscribersTable)
      .values({
        name,
        email,
        source: source ?? "news_page",
        unsubscribeToken: newToken(),
      })
      .onConflictDoNothing({ target: subscribersTable.email })
      .returning();

    if (inserted.length === 0) {
      // Already subscribed (or previously unsubscribed). If they had unsubscribed,
      // re-activate them and resend a welcome.
      const existing = await db
        .select()
        .from(subscribersTable)
        .where(eq(subscribersTable.email, email))
        .limit(1);
      const row = existing[0];
      if (row && row.unsubscribedAt) {
        const reactivated = await db
          .update(subscribersTable)
          .set({ unsubscribedAt: null, name })
          .where(eq(subscribersTable.id, row.id))
          .returning();
        if (reactivated[0]) {
          void sendWelcomeEmail(reactivated[0], req.log);
        }
        return res.json({ ok: true, alreadySubscribed: false });
      }
      return res.json({ ok: true, alreadySubscribed: true });
    }

    void sendWelcomeEmail(inserted[0]!, req.log);
    return res.json({ ok: true, alreadySubscribed: false });
  } catch (err) {
    req.log?.error({ err }, "newsletter subscribe failed");
    return res
      .status(500)
      .json({ ok: false, error: "Something went wrong. Please try again." });
  }
});

router.get("/newsletter/unsubscribe", async (req, res) => {
  const tokenRaw = typeof req.query["token"] === "string" ? req.query["token"] : "";
  const token = tokenRaw.trim();
  if (!token || token.length > 128) {
    return res
      .status(400)
      .type("html")
      .send(buildUnsubscribeConfirmationPage(false));
  }
  try {
    const updated = await db
      .update(subscribersTable)
      .set({ unsubscribedAt: new Date() })
      .where(
        and(
          eq(subscribersTable.unsubscribeToken, token),
          isNull(subscribersTable.unsubscribedAt),
        ),
      )
      .returning({ id: subscribersTable.id });
    return res
      .status(200)
      .type("html")
      .send(buildUnsubscribeConfirmationPage(updated.length > 0));
  } catch (err) {
    req.log?.error({ err }, "newsletter unsubscribe failed");
    return res
      .status(500)
      .type("html")
      .send(buildUnsubscribeConfirmationPage(false));
  }
});

// --- Admin endpoints ---------------------------------------------------------

function constantTimeEquals(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env["NEWSLETTER_ADMIN_TOKEN"];
  if (!expected) {
    res
      .status(503)
      .json({ ok: false, error: "Admin not configured. Set NEWSLETTER_ADMIN_TOKEN." });
    return;
  }
  const header = req.header("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!provided || !constantTimeEquals(provided, expected)) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/newsletter/admin/draft", requireAdmin, async (req, res) => {
  try {
    const draft = await draftNewsletter();
    return res.json({ ok: true, draft });
  } catch (err) {
    req.log?.error({ err }, "newsletter AI draft failed");
    const message = err instanceof Error ? err.message : "Draft failed";
    return res.status(502).json({ ok: false, error: message });
  }
});

router.get("/newsletter/admin/stats", requireAdmin, async (_req, res) => {
  const all = await db.select().from(subscribersTable);
  const active = all.filter((s: Subscriber) => !s.unsubscribedAt).length;
  return res.json({
    ok: true,
    total: all.length,
    active,
    unsubscribed: all.length - active,
  });
});

const dispatchSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(180),
  body: z.string().trim().min(1, "Body is required").max(50_000),
  preheader: z.string().trim().max(180).optional(),
  testEmail: z.string().trim().toLowerCase().email().optional(),
});

router.post("/newsletter/admin/dispatch", requireAdmin, async (req, res) => {
  const parsed = dispatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { subject, body, preheader, testEmail } = parsed.data;

  let resend;
  try {
    resend = await getUncachableResendClient();
  } catch (err) {
    req.log?.error({ err }, "resend client unavailable");
    return res
      .status(503)
      .json({ ok: false, error: "Email service is not connected." });
  }

  // Test send: only to the provided address, but generate a real token if known.
  if (testEmail) {
    const found = await db
      .select()
      .from(subscribersTable)
      .where(eq(subscribersTable.email, testEmail))
      .limit(1);
    const token = found[0]?.unsubscribeToken ?? newToken();
    const recipientName = found[0]?.name ?? "friend";
    const email = buildDispatchEmail({
      subject,
      bodyMarkdown: body,
      recipientName,
      token,
      preheader,
    });
    const result = await resend.client.emails.send({
      from: resend.fromEmail,
      to: testEmail,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    if (result.error) {
      return res
        .status(502)
        .json({ ok: false, error: `Test send failed: ${result.error.message ?? "unknown"}` });
    }
    return res.json({ ok: true, mode: "test", sent: 1 });
  }

  const recipients = await db
    .select()
    .from(subscribersTable)
    .where(isNull(subscribersTable.unsubscribedAt));

  let sent = 0;
  let failed = 0;
  let firstError: string | null = null;
  for (const sub of recipients) {
    const email = buildDispatchEmail({
      subject,
      bodyMarkdown: body,
      recipientName: sub.name,
      token: sub.unsubscribeToken,
      preheader,
    });
    try {
      const result = await resend.client.emails.send({
        from: resend.fromEmail,
        to: sub.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
      if (result.error) {
        failed += 1;
        if (!firstError) firstError = result.error.message ?? "unknown";
        req.log?.error({ err: result.error, email: sub.email }, "dispatch send failed");
      } else {
        sent += 1;
      }
    } catch (err) {
      failed += 1;
      if (!firstError) firstError = err instanceof Error ? err.message : "unknown";
      req.log?.error({ err, email: sub.email }, "dispatch send threw");
    }
    // Light pacing to stay under provider rate limits.
    await new Promise((r) => setTimeout(r, 60));
  }

  return res.json({
    ok: true,
    mode: "broadcast",
    sent,
    failed,
    total: recipients.length,
    ...(firstError ? { firstError } : {}),
  });
});

// --- Persisted dispatches (drafts, scheduled, history) -----------------------

const dispatchBodySchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(180),
  body: z.string().trim().min(1, "Body is required").max(50_000),
  preheader: z.string().trim().max(180).optional().or(z.literal("")),
  status: z.enum(["draft", "scheduled"]),
  scheduledFor: z.string().datetime().optional().nullable(),
});

function normalizePreheader(v: string | undefined | null): string | null {
  if (!v) return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

router.get("/newsletter/admin/dispatches", requireAdmin, async (_req, res) => {
  const rows = await db
    .select()
    .from(dispatchesTable)
    .orderBy(desc(dispatchesTable.createdAt));
  return res.json({ ok: true, dispatches: rows });
});

router.post("/newsletter/admin/dispatches", requireAdmin, async (req, res) => {
  const parsed = dispatchBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { subject, body, preheader, status, scheduledFor } = parsed.data;

  let scheduledAt: Date | null = null;
  if (status === "scheduled") {
    if (!scheduledFor) {
      return res
        .status(400)
        .json({ ok: false, error: "A send date is required for scheduled dispatches." });
    }
    scheduledAt = new Date(scheduledFor);
    if (Number.isNaN(scheduledAt.getTime())) {
      return res.status(400).json({ ok: false, error: "Invalid send date." });
    }
  }

  const inserted = await db
    .insert(dispatchesTable)
    .values({
      subject: subject.trim(),
      body,
      preheader: normalizePreheader(preheader),
      status,
      scheduledFor: scheduledAt,
    })
    .returning();
  return res.json({ ok: true, dispatch: inserted[0] });
});

router.patch("/newsletter/admin/dispatches/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ ok: false, error: "Invalid id" });
  }
  const existingRows = await db
    .select()
    .from(dispatchesTable)
    .where(eq(dispatchesTable.id, id))
    .limit(1);
  const existing = existingRows[0];
  if (!existing) return res.status(404).json({ ok: false, error: "Not found" });
  if (existing.status === "sent" || existing.status === "sending") {
    return res
      .status(409)
      .json({ ok: false, error: "Already sent or sending — can't edit." });
  }

  const parsed = dispatchBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { subject, body, preheader, status, scheduledFor } = parsed.data;

  let scheduledAt: Date | null = null;
  if (status === "scheduled") {
    if (!scheduledFor) {
      return res
        .status(400)
        .json({ ok: false, error: "A send date is required for scheduled dispatches." });
    }
    scheduledAt = new Date(scheduledFor);
    if (Number.isNaN(scheduledAt.getTime())) {
      return res.status(400).json({ ok: false, error: "Invalid send date." });
    }
  }

  const updated = await db
    .update(dispatchesTable)
    .set({
      subject: subject.trim(),
      body,
      preheader: normalizePreheader(preheader),
      status,
      scheduledFor: scheduledAt,
      errorMessage: null,
      updatedAt: new Date(),
    })
    .where(eq(dispatchesTable.id, id))
    .returning();
  return res.json({ ok: true, dispatch: updated[0] });
});

router.delete("/newsletter/admin/dispatches/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ ok: false, error: "Invalid id" });
  }
  const existingRows = await db
    .select()
    .from(dispatchesTable)
    .where(eq(dispatchesTable.id, id))
    .limit(1);
  const existing = existingRows[0];
  if (!existing) return res.status(404).json({ ok: false, error: "Not found" });
  if (existing.status === "sending") {
    return res.status(409).json({ ok: false, error: "Currently sending — can't delete." });
  }
  await db.delete(dispatchesTable).where(eq(dispatchesTable.id, id));
  return res.json({ ok: true });
});

router.post("/newsletter/admin/dispatches/:id/send", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ ok: false, error: "Invalid id" });
  }
  const existingRows = await db
    .select()
    .from(dispatchesTable)
    .where(eq(dispatchesTable.id, id))
    .limit(1);
  const existing = existingRows[0];
  if (!existing) return res.status(404).json({ ok: false, error: "Not found" });
  if (existing.status === "sent" || existing.status === "sending") {
    return res
      .status(409)
      .json({ ok: false, error: "Already sent or sending." });
  }

  const result = await sendDispatch(id);
  if (!result.ok) {
    return res.status(502).json({
      ok: false,
      error: result.error ?? "Send failed",
      sent: result.sent,
      failed: result.failed,
      total: result.total,
    });
  }
  return res.json({
    ok: true,
    sent: result.sent,
    failed: result.failed,
    total: result.total,
  });
});

export default router;
