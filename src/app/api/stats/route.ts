import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/stats — homepage counters, latest additions and question-of-the-day */
export async function GET() {
  try {
    const [notes, questions, papers, chapters, latestNotes, latestQuestions, qotdRaw, lastLog] = await Promise.all([
      db.note.count(),
      db.question.count(),
      db.paper.count(),
      db.chapter.count(),
      db.note.findMany({
        orderBy: { updatedAt: "desc" },
        take: 6,
        include: { chapter: { include: { subject: { include: { class: true } } } } },
      }),
      db.question.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { subject: { include: { class: true } } },
      }),
      db.siteStat.findUnique({ where: { key: "qotd" } }),
      db.genLog.findFirst({ orderBy: { ranAt: "desc" } }),
    ]);

    let qotd: {
      id: string;
      text: string;
      options: string[];
      answer: string;
      explanation: string;
      subject: string;
      grade: number;
    } | null = null;
    if (qotdRaw) {
      const q = await db.question.findUnique({
        where: { id: qotdRaw.value },
        include: { subject: { include: { class: true } } },
      });
      if (q) {
        qotd = {
          id: q.id,
          text: q.text,
          options: JSON.parse(q.options || "[]"),
          answer: q.answer,
          explanation: q.explanation || "",
          subject: q.subject.name,
          grade: q.subject.class.grade,
        };
      }
    }

    return NextResponse.json({
      ok: true,
      totals: { notes, questions, papers, chapters },
      latestNotes: latestNotes.map((n) => ({
        id: n.id,
        title: n.title,
        chapterId: n.chapter.id,
        chapterName: n.chapter.name,
        subject: n.chapter.subject.name,
        grade: n.chapter.subject.class.grade,
        updatedAt: n.updatedAt,
      })),
      latestQuestions: latestQuestions.map((q) => ({
        id: q.id,
        text: q.text.slice(0, 100) + (q.text.length > 100 ? "…" : ""),
        subject: q.subject.name,
        grade: q.subject.class.grade,
        createdAt: q.createdAt,
      })),
      qotd,
      lastUpdate: lastLog,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
