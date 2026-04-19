import { and, eq, lte } from "drizzle-orm";
import { db, dispatchesTable } from "@workspace/db";
import { sendDispatch } from "./send-dispatch";
import { logger } from "./logger";

const POLL_INTERVAL_MS = 60_000;
let timer: NodeJS.Timeout | null = null;
let running = false;

async function tick(): Promise<void> {
  if (running) return;
  running = true;
  try {
    const due = await db
      .select({ id: dispatchesTable.id })
      .from(dispatchesTable)
      .where(
        and(
          eq(dispatchesTable.status, "scheduled"),
          lte(dispatchesTable.scheduledFor, new Date()),
        ),
      );

    for (const row of due) {
      logger.info({ dispatchId: row.id }, "scheduler: sending due dispatch");
      try {
        const result = await sendDispatch(row.id);
        logger.info({ dispatchId: row.id, ...result }, "scheduler: dispatch finished");
      } catch (err) {
        logger.error({ err, dispatchId: row.id }, "scheduler: dispatch threw");
      }
    }
  } catch (err) {
    logger.error({ err }, "scheduler: poll failed");
  } finally {
    running = false;
  }
}

export function startDispatchScheduler(): void {
  if (timer) return;
  // First tick shortly after boot so a recently-due dispatch isn't delayed a minute.
  setTimeout(() => void tick(), 5_000);
  timer = setInterval(() => void tick(), POLL_INTERVAL_MS);
  logger.info({ intervalMs: POLL_INTERVAL_MS }, "dispatch scheduler started");
}
