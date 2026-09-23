import { NextRequest, NextResponse } from "next/server";
import { runDailyJob, hasRunToday } from "@/lib/daily-job";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Daily self-maintenance endpoint.
 * GET/POST /api/cron/daily?secret=CRON_SECRET
 *
 * The in-process node-cron scheduler already runs this at 03:05 IST every day.
 * This endpoint exists so an EXTERNAL cron service (cron-job.org, GitHub Actions,
 * Vercel cron, etc.) can also trigger it — making automation survive any deploy.
 *
 * Set CRON_SECRET in .env and pass it as ?secret= or Authorization: Bearer.
 * If CRON_SECRET is not set, the endpoint is open (fine for local/dev).
 */
async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const provided =
      req.nextUrl.searchParams.get("secret") ||
      req.headers.get("authorization")?.replace("Bearer ", "") ||
      "";
    if (provided !== secret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const force = req.nextUrl.searchParams.get("force") === "1";
  const trigger = req.nextUrl.searchParams.get("trigger") === "manual" ? "manual" : "cron";

  if (!force && (await hasRunToday())) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      message: "Daily refresh already completed today. Use ?force=1 to re-run.",
    });
  }

  const result = await runDailyJob(trigger);
  return NextResponse.json({ ok: result.ok, ...result });
}

export const GET = handle;
export const POST = handle;
