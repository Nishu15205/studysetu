import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateNote } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/notes/generate  { chapterId }
 * On-demand AI generation of an ORIGINAL revision note for a chapter.
 * Content is written fresh in original wording — copyright-safe by design.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const chapterId: string | undefined = body?.chapterId;
    if (!chapterId) return NextResponse.json({ ok: false, error: "chapterId required" }, { status: 400 });

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
      include: { note: true, subject: { include: { class: true } } },
    });
    if (!chapter) return NextResponse.json({ ok: false, error: "Chapter not found" }, { status: 404 });
    if (chapter.note) {
      return NextResponse.json({ ok: true, alreadyExists: true, noteId: chapter.note.id });
    }

    const note = await generateNote({
      grade: chapter.subject.class.grade,
      subject: chapter.subject.name,
      chapterName: chapter.name,
      chapterNumber: chapter.number,
    });

    const created = await db.note.create({
      data: {
        title: note.title,
        content: note.content,
        keyPoints: JSON.stringify(note.keyPoints),
        readMins: note.readMins,
        chapterId: chapter.id,
        origin: "original-ai",
      },
    });

    return NextResponse.json({ ok: true, created: true, noteId: created.id });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Generation failed" },
      { status: 500 }
    );
  }
}
