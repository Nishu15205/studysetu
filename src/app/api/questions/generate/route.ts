import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateQuestions } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/questions/generate  { subjectId, count? }
 * Generates a fresh set of ORIGINAL practice MCQs (copyright-safe) and stores them.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const subjectId: string | undefined = body?.subjectId;
    const count = Math.min(15, Math.max(5, Number(body?.count) || 10));
    if (!subjectId) return NextResponse.json({ ok: false, error: "subjectId required" }, { status: 400 });

    const subject = await db.subject.findUnique({ where: { id: subjectId }, include: { class: true } });
    if (!subject) return NextResponse.json({ ok: false, error: "Subject not found" }, { status: 404 });

    const existingCount = await db.question.count({ where: { subjectId } });
    if (existingCount >= 30) {
      // enough banked questions — don't waste generations
      return NextResponse.json({ ok: true, created: 0, existingCount });
    }

    const gen = await generateQuestions({
      grade: subject.class.grade,
      subject: subject.name,
      count,
      boardCode: "CBSE",
    });

    await db.question.createMany({
      data: gen.map((q) => ({
        text: q.text,
        options: JSON.stringify(q.options),
        answer: q.answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        marks: q.marks,
        subjectId,
        chapterName: q.chapterName ?? null,
        origin: "original-ai",
      })),
    });

    return NextResponse.json({ ok: true, created: gen.length });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Generation failed" },
      { status: 500 }
    );
  }
}
