/**
 * Static study content — the single source of truth for the production site.
 *
 * All notes, questions and paper metadata are pre-generated (original,
 * copyright-safe AI content, human-reviewed) and baked into study-data.json
 * at build time. The site needs NO database and NO AI at runtime, so it runs
 * perfectly on serverless hosting (Vercel) with zero maintenance.
 */
import raw from "./study-data.json";

// ---------- Shapes ----------
export interface StaticBoard {
  id: string;
  code: string;
  name: string;
  fullName: string;
  region: string;
  website: string | null;
}

export interface StaticChapter {
  id: string;
  number: number;
  name: string;
  hasNote: boolean;
  readMins: number;
  noteUpdatedAt: string | null;
}

export interface StaticSubject {
  id: string;
  name: string;
  slug: string;
  questionCount: number;
  chapters: StaticChapter[];
}

export interface StaticClass {
  id: string;
  grade: number;
  label: string;
  subjects: StaticSubject[];
}

export interface StaticNote {
  id: string;
  chapterId: string;
  title: string;
  content: string;
  keyPoints: string[];
  readMins: number;
  updatedAt: string;
}

export interface StaticPaper {
  id: string;
  title: string;
  year: number;
  kind: string;
  officialUrl: string | null;
  note: string | null;
  boardCode: string;
  grade: number;
  subjectId: string;
  subjectName: string;
}

export interface StaticQuestion {
  id: string;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: string;
  chapterName: string | null;
  subjectId: string;
  subjectName: string;
  grade: number;
  createdAt: string;
}

interface StudyData {
  generatedAt: string;
  boards: StaticBoard[];
  classes: StaticClass[];
  notes: StaticNote[];
  papers: StaticPaper[];
  questions: StaticQuestion[];
}

export const DATA = raw as unknown as StudyData;

// ---------- Indexes (built once per process) ----------
const notesByChapter = new Map<string, StaticNote>();
for (const n of DATA.notes) notesByChapter.set(n.chapterId, n);

const chaptersById = new Map<string, { chapter: StaticChapter; subject: StaticSubject; cls: StaticClass }>();
for (const c of DATA.classes) {
  for (const s of c.subjects) {
    for (const ch of s.chapters) chaptersById.set(ch.id, { chapter: ch, subject: s, cls: c });
  }
}

const questionsBySubject = new Map<string, StaticQuestion[]>();
for (const q of DATA.questions) {
  const list = questionsBySubject.get(q.subjectId);
  if (list) list.push(q);
  else questionsBySubject.set(q.subjectId, [q]);
}

const classByGrade = new Map<number, StaticClass>(DATA.classes.map((c) => [c.grade, c]));

const latestNotes = [...DATA.notes]
  .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  .slice(0, 6)
  .map((n) => {
    const ctx = chaptersById.get(n.chapterId);
    return {
      id: n.id,
      title: n.title,
      chapterId: n.chapterId,
      chapterName: ctx?.chapter.name ?? "",
      subject: ctx?.subject.name ?? "",
      grade: ctx?.cls.grade ?? 9,
      updatedAt: n.updatedAt,
    };
  });

const latestQuestions = [...DATA.questions]
  .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  .slice(0, 8)
  .map((q) => ({
    id: q.id,
    text: q.text.slice(0, 100) + (q.text.length > 100 ? "…" : ""),
    subject: q.subjectName,
    grade: q.grade,
    createdAt: q.createdAt,
  }));

// ---------- Public helpers ----------
export const TOTALS = {
  notes: DATA.notes.length,
  questions: DATA.questions.length,
  papers: DATA.papers.length,
  chapters: chaptersById.size,
};

export function getBoards(): StaticBoard[] {
  return DATA.boards;
}

export function getClasses(): StaticClass[] {
  return DATA.classes;
}

export function getClassByGrade(grade: number): StaticClass | undefined {
  return classByGrade.get(grade);
}

export function getSubjectsForGrade(grade: number): StaticSubject[] | null {
  return classByGrade.get(grade)?.subjects ?? null;
}

export function getNoteForChapter(chapterId: string): {
  chapter: StaticChapter;
  subject: StaticSubject;
  cls: StaticClass;
  note: StaticNote | null;
} | null {
  const ctx = chaptersById.get(chapterId);
  if (!ctx) return null;
  return { ...ctx, note: notesByChapter.get(chapterId) ?? null };
}

export function getSubjectContext(subjectId: string): { subject: StaticSubject; cls: StaticClass } | null {
  for (const c of DATA.classes) {
    const s = c.subjects.find((x) => x.id === subjectId);
    if (s) return { subject: s, cls: c };
  }
  return null;
}

export function getQuestionsForSubject(subjectId: string): StaticQuestion[] {
  return questionsBySubject.get(subjectId) ?? [];
}

export function getPapers(boardCode: string, grade?: number, subjectId?: string): StaticPaper[] {
  return DATA.papers.filter(
    (p) => p.boardCode === boardCode && (!grade || p.grade === grade) && (!subjectId || p.subjectId === subjectId)
  );
}

export function getStatsSnapshot() {
  return { totals: TOTALS, latestNotes, latestQuestions };
}

/** Deterministic Question of the Day — rotates daily without any storage. */
export function getQuestionOfTheDay(): StaticQuestion | null {
  const pool = DATA.questions;
  if (pool.length === 0) return null;
  const now = new Date();
  const dayIndex = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000
  );
  return pool[dayIndex % pool.length];
}

export interface SearchHit {
  kind: "note" | "chapter" | "question";
  id: string;
  title: string;
  grade: number;
  subject: string;
  chapterId?: string;
  hasNote?: boolean;
}

/** Lightweight in-memory search across notes, chapters and questions. */
export function searchContent(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  const hits: SearchHit[] = [];

  for (const n of DATA.notes) {
    if (hits.length >= 8) break;
    const ctx = chaptersById.get(n.chapterId);
    if (!ctx) continue;
    if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
      hits.push({
        kind: "note",
        id: n.id,
        title: n.title,
        grade: ctx.cls.grade,
        subject: ctx.subject.name,
        chapterId: n.chapterId,
      });
    }
  }

  for (const [id, ctx] of chaptersById) {
    if (hits.length >= 18) break;
    if (ctx.chapter.name.toLowerCase().includes(q) && !hits.some((h) => h.chapterId === id)) {
      hits.push({
        kind: "chapter",
        id,
        title: ctx.chapter.name,
        grade: ctx.cls.grade,
        subject: ctx.subject.name,
        hasNote: ctx.chapter.hasNote,
      });
    }
  }

  for (const question of DATA.questions) {
    if (hits.length >= 26) break;
    if (question.text.toLowerCase().includes(q)) {
      hits.push({
        kind: "question",
        id: question.id,
        title: question.text.slice(0, 120) + (question.text.length > 120 ? "…" : ""),
        grade: question.grade,
        subject: question.subjectName,
      });
    }
  }

  return hits;
}
