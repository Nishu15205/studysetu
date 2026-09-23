import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/notes?chapterId=xxx — original note content for a chapter */
export async function GET(req: NextRequest) {
  try {
    const chapterId = req.nextUrl.searchParams.get("chapterId");
    if (!chapterId) return NextResponse.json({ ok: false, error: "chapterId required" }, { status: 400 });

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
      include: {
        note: true,
        subject: { include: { class: true } },
      },
    });
    if (!chapter) return NextResponse.json({ ok: false, error: "Chapter not found" }, { status: 404 });

    let keyPoints: string[] = [];
    if (chapter.note?.keyPoints) {
      try {
        keyPoints = JSON.parse(chapter.note.keyPoints);
      } catch {
        keyPoints = [];
      }
    }

    return NextResponse.json({
      ok: true,
      chapter: { id: chapter.id, number: chapter.number, name: chapter.name },
      subject: chapter.subject.name,
      grade: chapter.subject.class.grade,
      note: chapter.note
        ? {
            id: chapter.note.id,
            title: chapter.note.title,
            content: chapter.note.content,
            keyPoints,
            readMins: chapter.note.readMins,
            origin: chapter.note.origin,
            updatedAt: chapter.note.updatedAt,
          }
        : null,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
