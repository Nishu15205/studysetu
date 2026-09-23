import { NextRequest, NextResponse } from "next/server";
import { searchContent } from "@/content";

/** GET /api/search?q=trigonometry — searches original notes, chapters and practice questions */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 3) {
    return NextResponse.json({ ok: true, results: [], message: "Type at least 3 characters" });
  }
  return NextResponse.json({ ok: true, results: searchContent(q) });
}
