import { NextResponse } from "next/server";
import { getQuestionOfTheDay, getStatsSnapshot } from "@/content";

/** GET /api/stats — homepage counters, featured additions and question-of-the-day (static content) */
export async function GET() {
  const { totals, latestNotes, latestQuestions } = getStatsSnapshot();
  const q = getQuestionOfTheDay();

  return NextResponse.json({
    ok: true,
    totals,
    latestNotes,
    latestQuestions,
    qotd: q
      ? {
          id: q.id,
          text: q.text,
          options: Array.isArray(q.options) ? q.options : [],
          answer: q.answer,
          explanation: q.explanation,
          subject: q.subjectName,
          grade: q.grade,
        }
      : null,
  });
}
