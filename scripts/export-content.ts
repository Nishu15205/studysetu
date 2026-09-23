/**
 * One-time export script — dumps the fully generated SQLite content into a
 * static JSON module that ships with the app. After this, the site runs with
 * NO database and NO AI at runtime (perfect for Vercel serverless).
 *
 * Run: DATABASE_URL="file:./db/custom.db?connection_limit=1" bun scripts/export-content.ts
 */
import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

const db = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL || "file:./db/custom.db?connection_limit=1" } },
});

async function main() {
  const [boards, classes, notes, papers, questions] = await Promise.all([
    db.board.findMany({ orderBy: { code: "asc" } }),
    db.classLevel.findMany({
      orderBy: { grade: "asc" },
      include: {
        subjects: {
          orderBy: { name: "asc" },
          include: {
            chapters: { orderBy: { number: "asc" }, include: { note: { select: { readMins: true, updatedAt: true } } } },
            _count: { select: { questions: true } },
          },
        },
      },
    }),
    db.note.findMany({ orderBy: { updatedAt: "desc" } }),
    db.paper.findMany({
      orderBy: [{ class: { grade: "asc" } }, { subject: { name: "asc" } }, { year: "desc" }],
      include: {
        subject: { select: { name: true } },
        class: { select: { grade: true } },
        board: { select: { code: true } },
      },
    }),
    db.question.findMany({
      orderBy: { createdAt: "desc" },
      include: { subject: { select: { name: true, class: { select: { grade: true } } } } },
    }),
  ]);

  const noteByChapter = new Map(notes.map((n) => [n.chapterId, n]));

  const data = {
    generatedAt: new Date().toISOString(),
    boards: boards.map((b) => ({
      id: b.id,
      code: b.code,
      name: b.name,
      fullName: b.fullName,
      region: b.region,
      website: b.website,
    })),
    classes: classes.map((c) => ({
      id: c.id,
      grade: c.grade,
      label: c.label,
      subjects: c.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        questionCount: s._count.questions,
        chapters: s.chapters.map((ch) => ({
          id: ch.id,
          number: ch.number,
          name: ch.name,
          hasNote: noteByChapter.has(ch.id),
          readMins: noteByChapter.get(ch.id)?.readMins ?? 0,
          noteUpdatedAt: noteByChapter.get(ch.id)?.updatedAt.toISOString() ?? null,
        })),
      })),
    })),
    notes: notes.map((n) => ({
      id: n.id,
      chapterId: n.chapterId,
      title: n.title,
      content: n.content,
      keyPoints: JSON.parse(n.keyPoints || "[]"),
      readMins: n.readMins,
      updatedAt: n.updatedAt.toISOString(),
    })),
    papers: papers.map((p) => ({
      id: p.id,
      title: p.title,
      year: p.year,
      kind: p.kind,
      officialUrl: p.officialUrl,
      note: p.note,
      boardCode: p.board.code,
      grade: p.class.grade,
      subjectId: p.subjectId,
      subjectName: p.subject.name,
    })),
    questions: questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options || "[]"),
      answer: q.answer,
      explanation: q.explanation || "",
      difficulty: q.difficulty,
      chapterName: q.chapterName,
      subjectId: q.subjectId,
      subjectName: q.subject.name,
      grade: q.subject.class.grade,
      createdAt: q.createdAt.toISOString(),
    })),
  };

  const outDir = path.join(process.cwd(), "src", "content");
  mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "study-data.json");
  writeFileSync(out, JSON.stringify(data), "utf-8");
  const kb = Math.round(JSON.stringify(data).length / 1024);
  console.log(`[export] wrote ${out} (${kb} KB)`);
  console.log(
    `[export] boards=${data.boards.length} classes=${data.classes.length} notes=${data.notes.length} papers=${data.papers.length} questions=${data.questions.length}`
  );
  await db.$disconnect();
}

main().catch((e) => {
  console.error("[export] FATAL:", e);
  process.exit(1);
});
