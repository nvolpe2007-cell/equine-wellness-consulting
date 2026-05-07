import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { timingSafeEqual } from "node:crypto";
import { desc } from "drizzle-orm";
import { db, pvSurveyResponsesTable } from "@workspace/db";

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
    const rows = await db
      .select()
      .from(pvSurveyResponsesTable)
      .orderBy(desc(pvSurveyResponsesTable.submittedAt));
    return res.json({ ok: true, responses: rows, total: rows.length });
  } catch (err) {
    req.log?.error({ err }, "survey admin responses failed");
    return next(err);
  }
});

export default router;
