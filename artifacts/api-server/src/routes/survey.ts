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

export default router;
