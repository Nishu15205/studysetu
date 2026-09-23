import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/structure — boards, classes with subject/chapter/note counts */
export async function GET(_req: NextRequest) {
  try {
    const [boards, classes, stats] = await Promise.all([
      db.board.findMany({ orderBy: { code: "asc" } }),
      db.classLevel.findMany({
        orderBy: { grade: "asc" },
        include: { subjects: { include: { _count: { select: { chapters: true, questions: true } } } } },
      }),
      Promise.all([db.note.count(), db.question.count(), db.paper.count(), db.chapter.count()]),
    ]);

    return NextResponse.json({
      ok: true,
      boards,
      classes: classes.map((c) => ({
        id: c.id,
        grade: c.grade,
        label: c.label,
        subjects: c.subjects.map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          chapterCount: s._count.chapters,
          questionCount: s._count.questions,
        })),
      })),
      totals: { notes: stats[0], questions: stats[1], papers: stats[2], chapters: stats[3] },
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
