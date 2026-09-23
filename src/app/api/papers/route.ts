import { NextRequest, NextResponse } from "next/server";
import { getPapers } from "@/content";

/** GET /api/papers?board=CBSE&grade=10&subjectId=xxx — PYQ/sample paper metadata (static content) */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const board = sp.get("board") || "";
  const grade = Number(sp.get("grade") || 0);
  const subjectId = sp.get("subjectId") || "";

  if (!["CBSE", "HBSE", "BSEB", "KERALA"].includes(board)) {
    return NextResponse.json({ ok: false, error: "board must be CBSE|HBSE|BSEB|KERALA" }, { status: 400 });
  }

  const rows = getPapers(board, grade || undefined, subjectId || undefined);

  return NextResponse.json({
    ok: true,
    papers: rows.map((p) => ({
      id: p.id,
      title: p.title,
      year: p.year,
      kind: p.kind,
      officialUrl: p.officialUrl,
      note: p.note,
      subject: { name: p.subjectName },
      class: { grade: p.grade },
      board: { code: p.boardCode, name: p.boardCode },
    })),
  });
}
