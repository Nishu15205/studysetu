import "server-only";
import cron from "node-cron";
import { runDailyJob, hasRunToday } from "@/lib/daily-job";

/**
 * In-process scheduler (server singleton).
 * - Schedules the daily AI refresh at 03:05 IST every day.
 * - On server start, if today's job hasn't run yet, runs a catch-up after a short delay.
 * Started from src/instrumentation.ts (runs once per server process).
 */

const globalForSched = globalThis as unknown as {
  __studysetuCronStarted?: boolean;
  __studysetuNextRun?: Date | null;
};

export function getNextRun(): Date | null {
  return globalForSched.__studysetuNextRun ?? null;
}

export function startScheduler() {
  if (globalForSched.__studysetuCronStarted) return;
  globalForSched.__studysetuCronStarted = true;

  try {
    // 03:05 every day, IST (Asia/Kolkata)
    cron.schedule("5 3 * * *", async () => {
      globalForSched.__studysetuNextRun = nextOccurrence(3, 5);
      console.log("[scheduler] running daily AI refresh (cron)");
      await runDailyJob("cron");
    }, { timezone: "Asia/Kolkata" });

    globalForSched.__studysetuNextRun = nextOccurrence(3, 5);
    console.log("[scheduler] daily AI refresh scheduled at 03:05 IST, next:", globalForSched.__studysetuNextRun?.toISOString());

    // Catch-up: if today's job hasn't run (e.g. server restarted overnight), run soon after boot.
    setTimeout(async () => {
      try {
        if (!(await hasRunToday())) {
          console.log("[scheduler] catch-up: today's refresh not found, running now");
          await runDailyJob("catch-up");
          globalForSched.__studysetuNextRun = nextOccurrence(3, 5);
        } else {
          console.log("[scheduler] today's refresh already done ✓");
        }
      } catch (e) {
        console.error("[scheduler] catch-up failed:", e);
      }
    }, 15_000);
  } catch (e) {
    console.error("[scheduler] failed to start:", e);
  }
}

function nextOccurrence(hour: number, minute: number): Date {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  // Compare in IST: shift by IST offset (+5:30) so scheduling intent stays aligned with Asia/Kolkata
  const istNow = new Date(now.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60_000);
  const istNext = new Date(next.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60_000);
  if (istNext <= istNow) next.setDate(next.getDate() + 1);
  return next;
}
