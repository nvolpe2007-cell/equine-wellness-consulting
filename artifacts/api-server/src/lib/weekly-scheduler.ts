import { runWeeklyNewsletter } from "./weekly-newsletter";
import { logger } from "./logger";

let scheduled = false;
let lastRunDate: string | null = null;

function getPacificDateString(d: Date): string {
  return d.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Return the next Date (in UTC) that corresponds to Monday 08:00:00.000
 * in America/Los_Angeles, accounting for DST correctly.
 */
function getNextMondayAt8AMPacificUTC(after: Date = new Date()): Date {
  for (let attempt = 0; attempt <= 8; attempt++) {
    const candidate = new Date(after.getTime() + attempt * 24 * 60 * 60 * 1000);

    const dayName = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      weekday: "long",
    }).format(candidate);
    if (dayName !== "Monday") continue;

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(candidate);
    const year = Number(parts.find((p) => p.type === "year")!.value);
    const month = Number(parts.find((p) => p.type === "month")!.value) - 1;
    const day = Number(parts.find((p) => p.type === "day")!.value);

    for (const utcHour of [15, 16]) {
      const probe = new Date(Date.UTC(year, month, day, utcHour, 0, 0, 0));
      const pacificHour = Number(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "numeric",
          hour12: false,
        }).format(probe),
      );
      if (pacificHour === 8 && probe > after) {
        return probe;
      }
    }
  }
  return new Date(after.getTime() + 7 * 24 * 60 * 60 * 1000);
}

async function runAndReschedule(): Promise<void> {
  const today = getPacificDateString(new Date());
  if (lastRunDate === today) {
    logger.warn("weekly-scheduler: skipping duplicate run for today");
  } else {
    lastRunDate = today;
    logger.info({ date: today }, "weekly-scheduler: firing weekly newsletter run");
    try {
      const result = await runWeeklyNewsletter();
      if (result.ok) {
        logger.info(result, "weekly-scheduler: run succeeded");
      } else {
        logger.error(result, "weekly-scheduler: run returned not-ok");
      }
    } catch (err) {
      logger.error({ err }, "weekly-scheduler: run threw unexpectedly");
    }
  }

  scheduleNext();
}

function scheduleNext(): void {
  const nextRun = getNextMondayAt8AMPacificUTC();
  const delayMs = nextRun.getTime() - Date.now();
  logger.info(
    { nextRun: nextRun.toISOString(), delayMs },
    "weekly-scheduler: next run scheduled",
  );
  setTimeout(() => void runAndReschedule(), delayMs);
}

export function startWeeklyScheduler(): void {
  if (scheduled) return;
  scheduled = true;
  scheduleNext();
  logger.info("weekly-scheduler: started (fires Monday 08:00 America/Los_Angeles)");
}
