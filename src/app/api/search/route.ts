import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/search?q=trigonometry — searches original notes, chapters and practice questions */
export async function GET(req: NextRequest) {
  try {
    const q = (req.nextUrl.searchParams.get("q") || "").trim();
    if (q.length < 3) return NextResponse.json({ ok: true, results: [], message: "Type at least 3 characters" });

    const [notes, chapters, questions] = await Promise.all([
      db.note.findMany({
        where: { OR: [{ title: { contains: q } }, { content: { contains: q } }] },
        include: { chapter: { include: { subject: { include: { class: true } } } } },
        take: 8,
      }),
      db.chapter.findMany({
        where: { name: { contains: q } },
        include: { subject: { include: { class: true } }, note: { select: { id: true } } },
        take: 10,
      }),
      db.question.findMany({
        where: { text: { contains: q } },
        include: { subject: { include: { class: true } } },
        take: 8,
      }),
    ]);

    const results = [
      ...notes.map((n) => ({
        kind: "note" as const,
        id: n.id,
        title: n.title,
        grade: n.chapter.subject.class.grade,
        subject: n.chapter.subject.name,
        chapterId: n.chapter.id,
        chapterName: n.chapter.name,
      })),
      ...chapters.map((c) => ({
        kind: "chapter" as const,
        id: c.id,
        title: c.name,
        grade: c.subject.class.grade,
        subject: c.subject.name,
        hasNote: !!c.note,
      })),
      ...questions.map((qq) => ({
        kind: "question" as const,
        id: qq.id,
        title: qq.text.slice(0, 120) + (qq.text.length > 120 ? "…" : ""),
        grade: qq.subject.class.grade,
        subject: qq.subject.name,
      })),
    ];

    return NextResponse.json({ ok: true, results });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
