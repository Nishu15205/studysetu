/**
 * One-time content generation script (runs in the dev sandbox only).
 * Generates an ORIGINAL note for every chapter missing one, and tops up
 * every subject's question bank to >= 12 original MCQs.
 *
 * The generated content is written to the local SQLite DB, then exported
 * to a static JSON module (scripts/export-content.ts) which ships to
 * production — so the deployed site needs NO AI, NO database.
 *
 * Run: DATABASE_URL="file:./db/custom.db?connection_limit=1" bun scripts/generate-content.ts
 */
import { PrismaClient } from "@prisma/client";
import ZAI from "z-ai-web-dev-sdk";

const db = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL || "file:./db/custom.db?connection_limit=1" } },
});

const NOTE_SYSTEM = `You are an expert Indian school teacher writing ORIGINAL revision notes for students of classes 9-12 (CBSE / HBSE / BSEB / Kerala board level).
STRICT RULES:
- Write everything in your own words. Never reproduce text from NCERT books, guides, or any copyrighted source.
- Explain concepts simply, like teaching a bright 14-18 year old.
- Output clean Markdown: use ## for section headings, bullet lists, **bold** for key terms.
- Keep it between 600-900 words.
Structure:
## Introduction (2-3 sentences: why this chapter matters in exams)
## Key Concepts (4-6 concepts, each a ### subheading with 2-4 sentence explanation)
## Example (1 short worked example or application; skip for languages)
## Quick Revision (6-8 one-line bullets)
## Exam Tips (4-5 practical tips: common mistakes, marks weightage strategy)`;

function extractJsonArray(raw: string): unknown[] {
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) throw new Error("No JSON array found in AI response");
  return JSON.parse(raw.slice(start, end + 1));
}

let lastCallAt = 0;
const MIN_GAP_MS = 12000; // sustainable pacing — stay under the platform rate limit
async function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const wait = lastCallAt + MIN_GAP_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastCallAt = Date.now();
  return fn();
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 10): Promise<T> {
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await throttled(fn);
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      const is429 = msg.includes("429") || msg.toLowerCase().includes("too many requests");
      if (i < attempts) {
        const delay = is429 ? 45000 : 5000 * i;
        await new Promise((r) => setTimeout(r, Math.min(delay, 90000)));
      }
    }
  }
  throw lastErr;
}

async function generateNote(p: { grade: number; subject: string; chapterName: string; chapterNumber: number }) {
  const zai = await ZAI.create();
  const userPrompt = `Write an ORIGINAL revision note for:
Class: ${p.grade}
Subject: ${p.subject}
Chapter ${p.chapterNumber}: ${p.chapterName}

Remember: original wording only, clean Markdown, follow the structure given in the system prompt.
Then AFTER the note, on the last line, output exactly one JSON object: {"readMins": <integer 4-12>}`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: "assistant", content: NOTE_SYSTEM },
      { role: "user", content: userPrompt },
    ],
    thinking: { type: "disabled" },
  });

  const raw = completion.choices[0]?.message?.content || "";
  if (raw.trim().length < 300) throw new Error("Note too short");

  let readMins = 6;
  const metaMatch = raw.match(/\{"readMins"\s*:\s*(\d+)\}/);
  if (metaMatch) readMins = Math.min(15, Math.max(3, parseInt(metaMatch[1], 10) || 6));
  const content = raw.replace(/\{"readMins"\s*:\s*\d+\}\s*$/, "").trim();

  let keyPoints: string[] = [];
  const revMatch = content.match(/##\s*Quick Revision[\s\S]*?(?=\n##\s|$)/);
  if (revMatch) {
    keyPoints = revMatch[0]
      .split("\n")
      .filter((l) => l.trim().startsWith("-") || l.trim().startsWith("*"))
      .map((l) => l.replace(/^[\s\-\*]+/, "").trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : `${p.chapterName} — Revision Notes`;
  return { title, content, keyPoints, readMins };
}

async function generateQuestions(p: { grade: number; subject: string; count: number }) {
  const zai = await ZAI.create();
  const userPrompt = `Create ${p.count} ORIGINAL practice MCQ questions for:
Class: ${p.grade}
Subject: ${p.subject}
Board pattern: CBSE-style

Rules:
- 100% original questions written by you (no copied/remembered exam questions, no textbook lines).
- Mix difficulty: ~30% EASY, 50% MEDIUM, 20% HARD.
- Each question: exactly 4 options, one correct answer, a 1-2 sentence explanation, and marks 1.
- Base them on the standard syllabus concepts of this class/subject.

Respond with ONLY a JSON array, no other text:
[{"text":"...","options":["A) ...","B) ...","C) ...","D) ..."],"answer":"A) ...","explanation":"...","difficulty":"EASY|MEDIUM|HARD","marks":1,"chapterName":"..."}]`;

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: "assistant",
        content:
          "You are an expert exam-paper setter for Indian school boards. You only output valid JSON arrays. All questions are your own original creations.",
      },
      { role: "user", content: userPrompt },
    ],
    thinking: { type: "disabled" },
  });

  const arr = extractJsonArray(completion.choices[0]?.message?.content || "");
  const cleaned: Array<{
    text: string;
    options: string[];
    answer: string;
    explanation: string;
    difficulty: string;
    marks: number;
    chapterName: string | null;
  }> = [];
  for (const item of arr) {
    const q = item as Record<string, unknown>;
    const text = typeof q.text === "string" ? q.text.trim() : "";
    const options = Array.isArray(q.options) ? q.options.map((o) => String(o).trim()).slice(0, 4) : [];
    const answer = typeof q.answer === "string" ? q.answer.trim() : "";
    if (!text || options.length !== 4 || !answer || !options.includes(answer)) continue;
    cleaned.push({
      text,
      options,
      answer,
      explanation: typeof q.explanation === "string" ? q.explanation.trim() : "",
      difficulty: ["EASY", "MEDIUM", "HARD"].includes(String(q.difficulty)) ? String(q.difficulty) : "MEDIUM",
      marks: 1,
      chapterName: typeof q.chapterName === "string" && q.chapterName.trim() ? q.chapterName.trim() : null,
    });
  }
  if (cleaned.length === 0) throw new Error("No valid questions parsed");
  return cleaned;
}

/** Simple concurrency pool */
async function pool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item === undefined) break;
      await fn(item);
    }
  });
  await Promise.all(workers);
}

async function main() {
  const started = Date.now();
  const zai = await ZAI.create().catch(() => null);
  if (!zai) throw new Error("ZAI SDK unavailable in this environment");
  console.log(`[gen] starting at ${new Date().toISOString()}`);

  // ---------- 1. NOTES for every chapter missing one ----------
  const chapters = await db.chapter.findMany({
    where: { note: null },
    include: { subject: { include: { class: true } } },
    orderBy: [{ subject: { class: { grade: "asc" } } }, { subject: { name: "asc" } }, { number: "asc" }],
  });
  console.log(`[gen] chapters needing notes: ${chapters.length}`);

  let notesDone = 0;
  let notesFailed = 0;
  await pool(chapters, 1, async (ch) => {
    try {
      const note = await withRetry(() =>
        generateNote({
          grade: ch.subject.class.grade,
          subject: ch.subject.name,
          chapterName: ch.name,
          chapterNumber: ch.number,
        })
      );
      await db.note.create({
        data: {
          title: note.title,
          content: note.content,
          keyPoints: JSON.stringify(note.keyPoints),
          readMins: note.readMins,
          chapterId: ch.id,
          origin: "original-ai",
        },
      });
      notesDone++;
      console.log(`[gen] note ok (${notesDone}/${chapters.length}) ch=${ch.number} "${ch.name}" +${Math.round((Date.now() - started) / 1000)}s`);
    } catch (e) {
      notesFailed++;
      console.error(`[gen] NOTE FAILED ch=${ch.id} "${ch.name}": ${e instanceof Error ? e.message : e}`);
    }
  });
  console.log(`[gen] notes complete: ok=${notesDone} failed=${notesFailed}`);

  // ---------- 2. QUESTION top-up to >= 12 per subject ----------
  const subjects = await db.subject.findMany({
    include: { class: true, _count: { select: { questions: true } } },
    orderBy: [{ class: { grade: "asc" } }, { name: "asc" }],
  });
  const jobs: Array<{ subjectId: string; name: string; grade: number; batches: number; existing: number }> = [];
  for (const s of subjects) {
    const deficit = 12 - s._count.questions;
    if (deficit > 0) {
      jobs.push({
        subjectId: s.id,
        name: s.name,
        grade: s.class.grade,
        batches: Math.min(2, Math.ceil(deficit / 10)),
        existing: s._count.questions,
      });
    }
  }
  const totalBatches = jobs.reduce((a, j) => a + j.batches, 0);
  console.log(`[gen] subjects needing questions: ${jobs.length}, batches: ${totalBatches}`);

  let batchesDone = 0;
  let questionsCreated = 0;
  await pool(jobs, 1, async (job) => {
    for (let b = 0; b < job.batches; b++) {
      try {
        const qs = await withRetry(() => generateQuestions({ grade: job.grade, subject: job.name, count: 10 }));
        await db.question.createMany({
          data: qs.map((q) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            answer: q.answer,
            explanation: q.explanation,
            difficulty: q.difficulty,
            marks: q.marks,
            subjectId: job.subjectId,
            chapterName: q.chapterName,
            origin: "original-ai",
          })),
        });
        questionsCreated += qs.length;
      } catch (e) {
        console.error(`[gen] QUESTION FAILED subject=${job.name} class=${job.grade}: ${e instanceof Error ? e.message : e}`);
      }
      batchesDone++;
      if (batchesDone % 5 === 0) {
        console.log(`[gen] q-batches ${batchesDone}/${totalBatches} (+${questionsCreated} questions)`);
      }
    }
  });
  console.log(`[gen] questions complete: +${questionsCreated}`);

  const [notes, questions] = await Promise.all([db.note.count(), db.question.count()]);
  console.log(`[gen] FINAL totals — notes: ${notes}, questions: ${questions}`);
  console.log(`[gen] done in ${Math.round((Date.now() - started) / 1000)}s`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error("[gen] FATAL:", e);
  process.exit(1);
});
