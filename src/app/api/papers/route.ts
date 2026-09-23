import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/papers?board=CBSE&grade=10&subjectId=xxx — PYQ/sample paper metadata (official links only) */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const board = sp.get("board") || "";
    const grade = Number(sp.get("grade") || 0);
    const subjectId = sp.get("subjectId") || "";

    if (!["CBSE", "HBSE", "BSEB", "KERALA"].includes(board)) {
      return NextResponse.json({ ok: false, error: "board must be CBSE|HBSE|BSEB|KERALA" }, { status: 400 });
    }

    const papers = await db.paper.findMany({
      where: {
        board: { code: board },
        ...(grade ? { class: { grade } } : {}),
        ...(subjectId ? { subjectId } : {}),
      },
      include: {
        subject: { select: { name: true } },
        class: { select: { grade: true } },
        board: { select: { code: true, name: true } },
      },
      orderBy: [{ class: { grade: "asc" } }, { subject: { name: "asc" } }, { year: "desc" }],
    });

    return NextResponse.json({ ok: true, papers });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
