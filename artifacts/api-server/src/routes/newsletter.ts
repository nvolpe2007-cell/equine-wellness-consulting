import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, subscribersTable } from "@workspace/db";

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
    const result = await db
      .insert(subscribersTable)
      .values({ name, email, source: source ?? "news_page" })
      .onConflictDoNothing({ target: subscribersTable.email })
      .returning({ id: subscribersTable.id });

    const alreadySubscribed = result.length === 0;
    return res.json({ ok: true, alreadySubscribed });
  } catch (err) {
    req.log?.error({ err }, "newsletter subscribe failed");
    return res
      .status(500)
      .json({ ok: false, error: "Something went wrong. Please try again." });
  }
});

export default router;
