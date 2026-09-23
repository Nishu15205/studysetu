/**
 * Next.js instrumentation — runs once when the server process boots.
 * Starts the in-process daily scheduler for automatic AI content refresh.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startScheduler } = await import("@/lib/scheduler");
    startScheduler();
  }
}
