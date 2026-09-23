import { NextRequest, NextResponse } from "next/server";
import { getSubjectsForGrade } from "@/content";

/** GET /api/subjects?grade=10 — subjects of a class with chapters (static content) */
export async function GET(req: NextRequest) {
  const grade = Number(req.nextUrl.searchParams.get("grade") || 0);
  if (![9, 10, 11, 12].includes(grade)) {
    return NextResponse.json({ ok: false, error: "grade must be 9-12" }, { status: 400 });
  }
  const subjects = getSubjectsForGrade(grade);
  if (!subjects) return NextResponse.json({ ok: false, error: "Class not found" }, { status: 404 });

  return NextResponse.json({
    ok: true,
    grade,
    subjects: subjects.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      chapters: s.chapters.map((c) => ({
        id: c.id,
        number: c.number,
        name: c.name,
        hasNote: c.hasNote,
        readMins: c.readMins,
        noteUpdatedAt: c.noteUpdatedAt,
      })),
    })),
  });
}
