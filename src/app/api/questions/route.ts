import { NextRequest, NextResponse } from "next/server";
import { getQuestionsForSubject, getSubjectContext } from "@/content";

/**
 * GET /api/questions?subjectId=xxx&count=10
 * Original practice questions for the quiz (static content, shuffled per request).
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const subjectId = sp.get("subjectId") || "";
  const count = Math.min(20, Math.max(3, Number(sp.get("count") || 10)));

  if (!subjectId) return NextResponse.json({ ok: false, error: "subjectId required" }, { status: 400 });

  const ctx = getSubjectContext(subjectId);
  if (!ctx) return NextResponse.json({ ok: false, error: "Subject not found" }, { status: 404 });

  const all = getQuestionsForSubject(subjectId);
  // shuffle and slice so every attempt feels fresh
  const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, count);

  return NextResponse.json({
    ok: true,
    questions: shuffled.map((q) => ({
      id: q.id,
      text: q.text,
      options: Array.isArray(q.options) ? q.options : [],
      answer: q.answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      chapterName: q.chapterName,
      grade: ctx.cls.grade,
      subject: ctx.subject.name,
    })),
    available: all.length,
  });
}
