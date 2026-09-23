import { NextRequest, NextResponse } from "next/server";
import { getNoteForChapter } from "@/content";

/** GET /api/notes?chapterId=xxx — original note content for a chapter (static content) */
export async function GET(req: NextRequest) {
  const chapterId = req.nextUrl.searchParams.get("chapterId");
  if (!chapterId) return NextResponse.json({ ok: false, error: "chapterId required" }, { status: 400 });

  const ctx = getNoteForChapter(chapterId);
  if (!ctx) return NextResponse.json({ ok: false, error: "Chapter not found" }, { status: 404 });

  return NextResponse.json({
    ok: true,
    chapter: { id: ctx.chapter.id, number: ctx.chapter.number, name: ctx.chapter.name },
    subject: ctx.subject.name,
    grade: ctx.cls.grade,
    note: ctx.note
      ? {
          id: ctx.note.id,
          title: ctx.note.title,
          content: ctx.note.content,
          keyPoints: Array.isArray(ctx.note.keyPoints) ? ctx.note.keyPoints : [],
          readMins: ctx.note.readMins,
          origin: "original-ai",
          updatedAt: ctx.note.updatedAt,
        }
      : null,
  });
}
