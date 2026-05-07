import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { timingSafeEqual } from "node:crypto";
import { desc, isNotNull, max } from "drizzle-orm";
import { db, pvSurveyResponsesTable, pvSurveyFollowupsTable } from "@workspace/db";
import { getUncachableResendClient } from "../lib/resend";

const router: IRouter = Router();

const surveySchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(320)
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email")
    .optional(),
  yearsInvolved: z.string().max(40).optional(),
  qualityRating: z.number().int().min(1).max(5).optional().nullable(),
  valuedAspects: z.string().max(3000).optional(),
  challenges: z.string().max(2000).optional(),
  futureConcernLevel: z.number().int().min(1).max(5).optional().nullable(),
  preservationIdeas: z.string().max(3000).optional(),
  memberOfOrg: z.string().max(10).optional(),
  comments: z.string().max(3000).optional(),
});

const ipHits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
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

router.post("/survey/pv-horse-keeping", async (req, res, next) => {
  try {
    const ip = String(req.ip ?? req.socket.remoteAddress ?? "unknown");
    if (rateLimited(ip)) {
      res.status(429).json({ ok: false, error: "Too many requests. Please try again later." });
      return;
    }

    const parsed = surveySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Please check your responses and try again." });
      return;
    }

    const d = parsed.data;
    await db.insert(pvSurveyResponsesTable).values({
      name: d.name || null,
      email: d.email || null,
      yearsInvolved: d.yearsInvolved || null,
      qualityRating: d.qualityRating ?? null,
      valuedAspects: d.valuedAspects || null,
      challenges: d.challenges || null,
      futureConcernLevel: d.futureConcernLevel ?? null,
      preservationIdeas: d.preservationIdeas || null,
      memberOfOrg: d.memberOfOrg || null,
      comments: d.comments || null,
    });

    req.log.info({ ip }, "pv survey response submitted");
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Admin endpoints ---------------------------------------------------------

router.get("/survey/admin/responses", requireAdmin, async (req, res, next) => {
  try {
    const [rows, followupRows] = await Promise.all([
      db
        .select()
        .from(pvSurveyResponsesTable)
        .orderBy(desc(pvSurveyResponsesTable.submittedAt)),
      db
        .select({
          email: pvSurveyFollowupsTable.email,
          lastFollowupAt: max(pvSurveyFollowupsTable.sentAt),
        })
        .from(pvSurveyFollowupsTable)
        .groupBy(pvSurveyFollowupsTable.email),
    ]);

    const lastContactMap = new Map<string, string>();
    for (const f of followupRows) {
      if (f.email && f.lastFollowupAt) {
        lastContactMap.set(f.email.toLowerCase().trim(), f.lastFollowupAt.toISOString());
      }
    }

    const responses = rows.map((r) => ({
      ...r,
      lastFollowupAt: r.email ? (lastContactMap.get(r.email.toLowerCase().trim()) ?? null) : null,
    }));

    return res.json({ ok: true, responses, total: responses.length });
  } catch (err) {
    req.log?.error({ err }, "survey admin responses failed");
    return next(err);
  }
});

router.get("/survey/admin/stats", requireAdmin, async (req, res, next) => {
  try {
    const rows = await db
      .select({
        qualityRating: pvSurveyResponsesTable.qualityRating,
        futureConcernLevel: pvSurveyResponsesTable.futureConcernLevel,
        challenges: pvSurveyResponsesTable.challenges,
        submittedAt: pvSurveyResponsesTable.submittedAt,
      })
      .from(pvSurveyResponsesTable)
      .orderBy(pvSurveyResponsesTable.submittedAt);

    const total = rows.length;

    const qualityRatings = rows
      .map((r) => r.qualityRating)
      .filter((v): v is number => v != null);
    const avgQuality =
      qualityRatings.length > 0
        ? Math.round((qualityRatings.reduce((a, b) => a + b, 0) / qualityRatings.length) * 10) / 10
        : null;

    const concernLevels = rows
      .map((r) => r.futureConcernLevel)
      .filter((v): v is number => v != null);
    const avgConcern =
      concernLevels.length > 0
        ? Math.round((concernLevels.reduce((a, b) => a + b, 0) / concernLevels.length) * 10) / 10
        : null;

    const challengeFreq: Record<string, number> = {};
    for (const row of rows) {
      if (!row.challenges) continue;
      let parsed: unknown;
      try {
        parsed = JSON.parse(row.challenges);
      } catch {
        continue;
      }
      if (!Array.isArray(parsed)) continue;
      for (const item of parsed) {
        if (typeof item !== "string" || !item) continue;
        challengeFreq[item] = (challengeFreq[item] ?? 0) + 1;
      }
    }
    const challenges = Object.entries(challengeFreq)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    const weeklyMap: Record<string, number> = {};
    for (const row of rows) {
      const d = new Date(row.submittedAt);
      const day = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((day + 6) % 7));
      monday.setHours(0, 0, 0, 0);
      const key = monday.toISOString().slice(0, 10);
      weeklyMap[key] = (weeklyMap[key] ?? 0) + 1;
    }
    const weeklySubmissions = Object.entries(weeklyMap)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => a.week.localeCompare(b.week));

    return res.json({
      ok: true,
      total,
      avgQuality,
      avgConcern,
      challenges,
      weeklySubmissions,
    });
  } catch (err) {
    req.log?.error({ err }, "survey admin stats failed");
    return next(err);
  }
});

// --- Survey follow-up email --------------------------------------------------

function escHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildFollowUpEmail(opts: {
  subject: string;
  body: string;
  recipientName: string | null;
}): { subject: string; html: string; text: string } {
  const safeName = opts.recipientName ? escHtml(opts.recipientName) : null;
  const greeting = safeName ? `Hi ${safeName},` : "Hi there,";
  const bodyHtml = escHtml(opts.body)
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 16px;">${p.replace(/\n/g, "<br />")}</p>`)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escHtml(opts.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f1ea;font-family:Georgia,'Times New Roman',serif;color:#2b2522;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1ea;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
            <tr>
              <td style="padding:28px 32px;background:#5b3a29;color:#fff;">
                <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;opacity:0.85;">Equine Bodywork &amp; Wellness</div>
                <div style="font-size:20px;margin-top:6px;font-style:italic;">PV Horse Keeping Survey — Follow-up</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-size:16px;line-height:1.65;color:#2b2522;">
                <p style="margin:0 0 16px;">${greeting}</p>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px;border-top:1px solid #ece4d9;font-size:12px;color:#6e6359;text-align:center;line-height:1.6;">
                You are receiving this because you left your email address on the PV Horse Keeping survey.<br />
                If you have questions, simply reply to this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textGreeting = opts.recipientName ? `Hi ${opts.recipientName},\n\n` : "Hi there,\n\n";
  const text = textGreeting + opts.body + "\n\n---\nYou received this because you left your email on the PV Horse Keeping survey.";

  return { subject: opts.subject, html, text };
}

const followupSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(180),
  body: z.string().trim().min(1, "Body is required").max(20_000),
  testEmail: z.string().trim().toLowerCase().email().optional(),
});

router.post("/survey/admin/followup", requireAdmin, async (req, res, next) => {
  const parsed = followupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" });
  }
  const { subject, body, testEmail } = parsed.data;

  let resend;
  try {
    resend = await getUncachableResendClient();
  } catch (err) {
    req.log?.error({ err }, "resend client unavailable");
    return res.status(503).json({ ok: false, error: "Email service is not connected." });
  }

  if (testEmail) {
    const found = await db
      .select({ name: pvSurveyResponsesTable.name })
      .from(pvSurveyResponsesTable)
      .where(isNotNull(pvSurveyResponsesTable.email))
      .limit(1);
    const name = found[0]?.name ?? null;
    const email = buildFollowUpEmail({ subject, body, recipientName: name });
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
    return res.json({ ok: true, mode: "test", sent: 1, failed: 0, total: 1 });
  }

  try {
    const rows = await db
      .select({
        email: pvSurveyResponsesTable.email,
        name: pvSurveyResponsesTable.name,
      })
      .from(pvSurveyResponsesTable)
      .where(isNotNull(pvSurveyResponsesTable.email));

    // Deduplicate by normalized email — keep the first name seen for each address.
    const seen = new Map<string, string | null>();
    for (const r of rows) {
      if (!r.email) continue;
      const key = r.email.toLowerCase().trim();
      if (!seen.has(key)) seen.set(key, r.name);
    }
    const recipients = Array.from(seen.entries()).map(([email, name]) => ({ email, name }));

    let sent = 0;
    let failed = 0;
    const followupRecords: { email: string; subject: string }[] = [];

    for (const r of recipients) {
      if (!r.email) continue;
      const emailMsg = buildFollowUpEmail({ subject, body, recipientName: r.name });
      try {
        const result = await resend.client.emails.send({
          from: resend.fromEmail,
          to: r.email,
          subject: emailMsg.subject,
          html: emailMsg.html,
          text: emailMsg.text,
        });
        if (result.error) {
          failed += 1;
          req.log?.error({ err: result.error, email: r.email }, "survey followup send failed");
        } else {
          sent += 1;
          followupRecords.push({ email: r.email, subject });
        }
      } catch (err) {
        failed += 1;
        req.log?.error({ err, email: r.email }, "survey followup send threw");
      }
      await new Promise((resolve) => setTimeout(resolve, 60));
    }

    // Record all successful sends in the followups table.
    if (followupRecords.length > 0) {
      await db.insert(pvSurveyFollowupsTable).values(followupRecords);
    }

    req.log?.info({ sent, failed, total: recipients.length }, "survey followup dispatch complete");
    return res.json({ ok: true, mode: "broadcast", sent, failed, total: recipients.length });
  } catch (err) {
    return next(err);
  }
});

export default router;
