import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/subjects?grade=10 — subjects of a class with chapters (and note availability) */
export async function GET(req: NextRequest) {
  try {
    const grade = Number(req.nextUrl.searchParams.get("grade") || 0);
    if (![9, 10, 11, 12].includes(grade)) {
      return NextResponse.json({ ok: false, error: "grade must be 9-12" }, { status: 400 });
    }
    const cls = await db.classLevel.findUnique({
      where: { grade },
      include: {
        subjects: {
          orderBy: { name: "asc" },
          include: {
            chapters: {
              orderBy: { number: "asc" },
              include: { note: { select: { id: true, readMins: true, updatedAt: true } } },
            },
          },
        },
      },
    });
    if (!cls) return NextResponse.json({ ok: false, error: "Class not found" }, { status: 404 });

    return NextResponse.json({
      ok: true,
      grade,
      subjects: cls.subjects.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        chapters: s.chapters.map((c) => ({
          id: c.id,
          number: c.number,
          name: c.name,
          hasNote: !!c.note,
          readMins: c.note?.readMins ?? 0,
          noteUpdatedAt: c.note?.updatedAt ?? null,
        })),
      })),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
