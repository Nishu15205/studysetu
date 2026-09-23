import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/questions?grade=10&subjectId=xxx&count=10&difficulty=MEDIUM
 * Original practice questions for the quiz. Options come as JSON string.
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const grade = Number(sp.get("grade") || 0);
    const subjectId = sp.get("subjectId") || "";
    const count = Math.min(20, Math.max(3, Number(sp.get("count") || 10)));

    if (!subjectId) return NextResponse.json({ ok: false, error: "subjectId required" }, { status: 400 });
    if (grade && ![9, 10, 11, 12].includes(grade)) {
      return NextResponse.json({ ok: false, error: "grade must be 9-12" }, { status: 400 });
    }

    const subject = await db.subject.findUnique({
      where: { id: subjectId },
      include: { class: true },
    });
    if (!subject) return NextResponse.json({ ok: false, error: "Subject not found" }, { status: 404 });

    const all = await db.question.findMany({
      where: { subjectId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // shuffle and slice so every attempt feels fresh
    const shuffled = all.sort(() => Math.random() - 0.5).slice(0, count);

    const questions = shuffled.map((q) => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options || "[]") as string[],
      answer: q.answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      chapterName: q.chapterName,
      grade: subject.class.grade,
      subject: subject.name,
    }));

    return NextResponse.json({ ok: true, questions, available: all.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
