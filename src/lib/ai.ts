import "server-only";
import ZAI from "z-ai-web-dev-sdk";

/**
 * Backend-only AI content engine.
 * Every piece of content is generated fresh in original wording — nothing is
 * copied from textbooks, guides or board papers, keeping the site copyright-safe.
 */

export type GeneratedNote = {
  title: string;
  content: string; // markdown
  keyPoints: string[]; // 5-8 revision bullets
  readMins: number;
};

export type GeneratedQuestion = {
  text: string;
  options: string[];
  answer: string; // must match one of the options
  explanation: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  marks: number;
  chapterName?: string;
};

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
  // Find the outermost JSON array in the response text
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) throw new Error("No JSON array found in AI response");
  return JSON.parse(raw.slice(start, end + 1));
}

function extractJsonObject(raw: string): Record<string, unknown> {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("No JSON object found in AI response");
  return JSON.parse(raw.slice(start, end + 1));
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts) await new Promise((r) => setTimeout(r, 800 * i));
    }
  }
  throw lastErr;
}

/** Generate an original revision note for a chapter */
export async function generateNote(params: {
  grade: number;
  subject: string;
  chapterName: string;
  chapterNumber: number;
}): Promise<GeneratedNote> {
  const zai = await ZAI.create();
  const userPrompt = `Write an ORIGINAL revision note for:
Class: ${params.grade}
Subject: ${params.subject}
Chapter ${params.chapterNumber}: ${params.chapterName}

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
  if (raw.trim().length < 300) throw new Error("Note too short — regenerating needed");

  let readMins = 6;
  const metaMatch = raw.match(/\{"readMins"\s*:\s*(\d+)\}/);
  if (metaMatch) readMins = Math.min(15, Math.max(3, parseInt(metaMatch[1], 10) || 6));
  const content = raw.replace(/\{"readMins"\s*:\s*\d+\}\s*$/, "").trim();

  // Extract Quick Revision bullets as keyPoints if present
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
  const title = titleMatch ? titleMatch[1].trim() : `${params.chapterName} — Revision Notes`;

  return { title, content, keyPoints, readMins };
}

/** Generate original practice MCQ questions for a subject */
export async function generateQuestions(params: {
  grade: number;
  subject: string;
  count?: number;
  chapterName?: string | null;
  boardCode?: string;
}): Promise<GeneratedQuestion[]> {
  const count = params.count ?? 10;
  const zai = await ZAI.create();

  const userPrompt = `Create ${count} ORIGINAL practice MCQ questions for:
Class: ${params.grade}
Subject: ${params.subject}${params.chapterName ? `\nChapter focus: ${params.chapterName}` : ""}
${params.boardCode ? `Board pattern: ${params.boardCode}` : "Board pattern: CBSE-style"}

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

  const raw = completion.choices[0]?.message?.content || "";
  const arr = extractJsonArray(raw);

  const cleaned: GeneratedQuestion[] = [];
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
      difficulty: (["EASY", "MEDIUM", "HARD"].includes(String(q.difficulty)) ? q.difficulty : "MEDIUM") as GeneratedQuestion["difficulty"],
      marks: 1,
      chapterName: typeof q.chapterName === "string" ? q.chapterName.trim() : undefined,
    });
  }
  if (cleaned.length === 0) throw new Error("No valid questions parsed from AI response");
  return cleaned;
}

/** Pick the "Question of the Day" — used by the daily automation */
export async function pickQuestionOfTheDay(candidateIds: string[]): Promise<string | null> {
  if (candidateIds.length === 0) return null;
  const pick = candidateIds[Math.floor(Math.random() * candidateIds.length)];
  return pick;
}

export const aiParseHelpers = { extractJsonArray, extractJsonObject, withRetry };
