/**
 * Next.js instrumentation — runs once when the server process boots.
 * Starts the in-process daily scheduler for automatic AI content refresh.
 * On Vercel serverless, in-process cron is skipped (instances sleep) —
 * vercel.json schedules /api/cron/daily daily at 21:35 UTC (03:05 IST) instead.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && !process.env.VERCEL) {
    const { startScheduler } = await import("@/lib/scheduler");
    startScheduler();
  }
}
