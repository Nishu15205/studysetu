import "server-only";
import { db } from "@/lib/db";
import { generateNote, generateQuestions } from "@/lib/ai";

/**
 * Daily self-maintenance job — keeps the site fresh with zero manual work.
 * Runs via node-cron (server start) and can also be triggered by an external
 * cron service hitting /api/cron/daily (so it keeps working in production).
 */

const globalForJob = globalThis as unknown as { __studysetuJobRunning?: boolean };

export type JobResult = {
  ok: boolean;
  notesCreated: number;
  questionsCreated: number;
  detail: string;
};

async function createMissingNotes(limit: number): Promise<number> {
  // Find chapters without notes (prefer lower classes = highest traffic first)
  const chapters = await db.chapter.findMany({
    where: { note: null },
    include: { subject: { include: { class: true } } },
    orderBy: [{ subject: { class: { grade: "asc" } } }, { subject: { name: "asc" } }, { number: "asc" }],
    take: 40,
  });
  if (chapters.length === 0) return 0;

  // Spread across different subjects for variety
  const picked: typeof chapters = [];
  const seen = new Set<string>();
  for (const ch of chapters) {
    if (picked.length >= limit) break;
    const key = ch.subjectId;
    if (seen.has(key) && picked.length < limit && seen.size < 6) {
      seen.add(key);
    }
    if (![...picked].some((p) => p.subjectId === key) || picked.length >= limit) {
      picked.push(ch);
      seen.add(key);
    }
  }
  // fallback fill
  for (const ch of chapters) {
    if (picked.length >= limit) break;
    if (!picked.includes(ch)) picked.push(ch);
  }

  let created = 0;
  for (const ch of picked.slice(0, limit)) {
    try {
      const note = await generateNote({
        grade: ch.subject.class.grade,
        subject: ch.subject.name,
        chapterName: ch.name,
        chapterNumber: ch.number,
      });
      await db.note.create({
        data: {
          title: note.title,
          content: note.content,
          keyPoints: JSON.stringify(note.keyPoints),
          readMins: note.readMins,
          chapterId: ch.id,
        },
      });
      created++;
    } catch (e) {
      console.error(`[daily-job] note failed for chapter ${ch.name}:`, e instanceof Error ? e.message : e);
    }
  }
  return created;
}

async function createFreshQuestions(): Promise<number> {
  // Pick the subject with the fewest questions in classes 11-12 (they need the most practice),
  // fallback to any subject if empty.
  const subjects = await db.subject.findMany({
    include: { _count: { select: { questions: true } }, class: true },
  });
  if (subjects.length === 0) return 0;
  const sorted = subjects.sort((a, b) => a._count.questions - b._count.questions);
  const target = sorted[Math.floor(Math.random() * Math.min(8, sorted.length))];

  try {
    const gen = await generateQuestions({
      grade: target.class.grade,
      subject: target.name,
      count: 10,
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
        subjectId: target.id,
        chapterName: q.chapterName ?? null,
        origin: "original-ai",
      })),
    });
    return gen.length;
  } catch (e) {
    console.error("[daily-job] questions failed:", e instanceof Error ? e.message : e);
    return 0;
  }
}

async function refreshQuestionOfTheDay(): Promise<boolean> {
  const ids = await db.question.findMany({ select: { id: true } });
  if (ids.length === 0) return false;
  const pick = ids[Math.floor(Math.random() * ids.length)];
  await db.siteStat.upsert({
    where: { key: "qotd" },
    create: { key: "qotd", value: pick.id },
    update: { value: pick.id },
  });
  return true;
}

export async function runDailyJob(trigger: "cron" | "catch-up" | "manual" = "cron"): Promise<JobResult> {
  if (globalForJob.__studysetuJobRunning) {
    return { ok: false, notesCreated: 0, questionsCreated: 0, detail: "Job already running" };
  }
  globalForJob.__studysetuJobRunning = true;
  const startedAt = Date.now();

  let notesCreated = 0;
  let questionsCreated = 0;
  const problems: string[] = [];

  try {
    notesCreated = await createMissingNotes(3);
  } catch (e) {
    problems.push(`notes: ${e instanceof Error ? e.message : String(e)}`);
  }
  try {
    questionsCreated = await createFreshQuestions();
  } catch (e) {
    problems.push(`questions: ${e instanceof Error ? e.message : String(e)}`);
  }
  try {
    await refreshQuestionOfTheDay();
  } catch (e) {
    problems.push(`qotd: ${e instanceof Error ? e.message : String(e)}`);
  }

  const secs = ((Date.now() - startedAt) / 1000).toFixed(1);
  const status = problems.length === 0 ? "success" : notesCreated + questionsCreated > 0 ? "partial" : "failed";
  const detail = `${trigger} · ${secs}s · +${notesCreated} notes, +${questionsCreated} questions${
    problems.length ? ` · issues: ${problems.join("; ")}` : ""
  }`;

  try {
    await db.genLog.create({
      data: { jobName: trigger === "cron" ? "daily-refresh" : trigger, status, notesCreated, questionsCreated, detail },
    });
  } catch (e) {
    console.error("[daily-job] failed to write log:", e);
  }

  globalForJob.__studysetuJobRunning = false;
  return { ok: status !== "failed", notesCreated, questionsCreated, detail };
}

/** true if the daily job already ran today */
export async function hasRunToday(): Promise<boolean> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const count = await db.genLog.count({
    where: { ranAt: { gte: start }, status: { in: ["success", "partial"] } },
  });
  return count > 0;
}
