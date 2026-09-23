import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getNextRun } from "@/lib/scheduler";
import { hasRunToday } from "@/lib/daily-job";

export const dynamic = "force-dynamic";

/** GET /api/automation — shows the self-maintenance status (logs, next run, coverage) */
export async function GET() {
  try {
    const [logs, nextRun, ranToday, chaptersWithoutNotes, totalChapters] = await Promise.all([
      db.genLog.findMany({ orderBy: { ranAt: "desc" }, take: 10 }),
      Promise.resolve(getNextRun()),
      hasRunToday(),
      db.chapter.count({ where: { note: null } }),
      db.chapter.count(),
    ]);

    return NextResponse.json({
      ok: true,
      schedule: "Daily at 03:05 IST (Asia/Kolkata)",
      ranToday,
      nextRun,
      coverage: { chaptersWithNotes: totalChapters - chaptersWithoutNotes, totalChapters },
      logs,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
