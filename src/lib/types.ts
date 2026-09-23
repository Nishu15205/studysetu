// Shared client types matching the API responses

export type BoardDto = {
  id: string;
  code: "CBSE" | "HBSE" | "BSEB" | "KERALA";
  name: string;
  fullName: string;
  region: string;
  website: string | null;
};

export type SubjectSummaryDto = {
  id: string;
  name: string;
  slug: string;
  chapterCount: number;
  questionCount: number;
};

export type ClassDto = {
  id: string;
  grade: number;
  label: string;
  subjects: SubjectSummaryDto[];
};

export type StructureDto = {
  ok: boolean;
  boards: BoardDto[];
  classes: ClassDto[];
  totals: { notes: number; questions: number; papers: number; chapters: number };
  error?: string;
};

export type ChapterDto = {
  id: string;
  number: number;
  name: string;
  hasNote: boolean;
  readMins: number;
  noteUpdatedAt: string | null;
};

export type SubjectDetailDto = {
  id: string;
  name: string;
  slug: string;
  chapters: ChapterDto[];
};

export type SubjectsDto = {
  ok: boolean;
  grade: number;
  subjects: SubjectDetailDto[];
  error?: string;
};

export type NoteDto = {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  readMins: number;
  origin: string;
  updatedAt: string;
};

export type NoteResponseDto = {
  ok: boolean;
  chapter: { id: string; number: number; name: string };
  subject: string;
  grade: number;
  note: NoteDto | null;
  error?: string;
};

export type PaperDto = {
  id: string;
  title: string;
  year: number;
  kind: "PYQ" | "SAMPLE" | "MODEL_SET";
  officialUrl: string | null;
  note: string | null;
  subject: { name: string };
  class: { grade: number };
  board: { code: string; name: string };
};

export type QuizQuestionDto = {
  id: string;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: string;
  chapterName: string | null;
  grade: number;
  subject: string;
};

export type StatsDto = {
  ok: boolean;
  totals: { notes: number; questions: number; papers: number; chapters: number };
  latestNotes: Array<{
    id: string;
    title: string;
    chapterId: string;
    chapterName: string;
    subject: string;
    grade: number;
    updatedAt: string;
  }>;
  latestQuestions: Array<{ id: string; text: string; subject: string; grade: number; createdAt: string }>;
  qotd: {
    id: string;
    text: string;
    options: string[];
    answer: string;
    explanation: string;
    subject: string;
    grade: number;
  } | null;
  lastUpdate: { jobName: string; status: string; notesCreated: number; questionsCreated: number; detail: string | null; ranAt: string } | null;
  error?: string;
};

export type SearchResultsDto = {
  ok: boolean;
  results: Array<{
    kind: "note" | "chapter" | "question";
    id: string;
    title: string;
    grade: number;
    subject: string;
    chapterId?: string;
    hasNote?: boolean;
  }>;
  message?: string;
};

export type AutomationDto = {
  ok: boolean;
  schedule: string;
  ranToday: boolean;
  nextRun: string | null;
  coverage: { chaptersWithNotes: number; totalChapters: number };
  logs: Array<{
    id: string;
    jobName: string;
    status: string;
    notesCreated: number;
    questionsCreated: number;
    detail: string | null;
    ranAt: string;
  }>;
  error?: string;
};
