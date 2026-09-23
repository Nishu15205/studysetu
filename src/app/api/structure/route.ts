import { NextResponse } from "next/server";
import { getBoards, getClasses, TOTALS } from "@/content";

/** GET /api/structure — boards, classes with subject/chapter/note counts (static content) */
export async function GET() {
  return NextResponse.json({
    ok: true,
    boards: getBoards(),
    classes: getClasses().map((c) => ({
      id: c.id,
      grade: c.grade,
      label: c.label,
      subjects: c.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        chapterCount: s.chapters.length,
        questionCount: s.questionCount,
      })),
    })),
    totals: TOTALS,
  });
}
