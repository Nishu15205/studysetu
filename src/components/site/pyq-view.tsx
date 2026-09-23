"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, FileText, Filter, Info, ListChecks, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdSlot } from "@/components/site/ad-slot";
import type { PaperDto, StructureDto } from "@/lib/types";
import type { ViewKey } from "@/config/site";
import { SITE } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const BOARD_META = [
  { code: "CBSE" as const, sub: "Delhi · Noida · UP", color: "bg-emerald-600" },
  { code: "HBSE" as const, sub: "Haryana (BSEH)", color: "bg-amber-500" },
  { code: "BSEB" as const, sub: "Bihar", color: "bg-rose-500" },
  { code: "KERALA" as const, sub: "DHSE / SCERT Kerala", color: "bg-teal-600" },
];

export function PyqView({ onNavigate }: { onNavigate: (v: ViewKey, opts?: { grade?: number }) => void }) {
  const [board, setBoard] = useState<(typeof BOARD_META)[number]["code"]>("CBSE");
  const [grade, setGrade] = useState<number | 0>(0); // 0 = all
  const [structure, setStructure] = useState<StructureDto | null>(null);
  const [papers, setPapers] = useState<PaperDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/structure")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: StructureDto | null) => d && setStructure(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let alive = true;
    const url = `/api/papers?board=${board}${grade ? `&grade=${grade}` : ""}`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive) setPapers(d?.ok ? d.papers : []);
      })
      .catch(() => alive && toast({ title: "Failed to load papers", variant: "destructive" }))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [board, grade, toast]);

  const switchBoard = (code: (typeof BOARD_META)[number]["code"]) => {
    setLoading(true);
    setBoard(code);
  };

  const switchGrade = (g: number | 0) => {
    setLoading(true);
    setGrade(g);
  };

  // group rows by class → subject
  const grouped = useMemo(() => {
    if (!papers) return [];
    const map = new Map<number, Map<string, PaperDto[]>>();
    for (const p of papers) {
      const g = p.class.grade;
      const s = p.subject.name;
      if (!map.has(g)) map.set(g, new Map());
      if (!map.get(g)!.has(s)) map.get(g)!.set(s, []);
      map.get(g)!.get(s)!.push(p);
    }
    return [...map.entries()].map(([g, subjects]) => ({ grade: g, subjects: [...subjects.entries()] }));
  }, [papers]);

  const activeBoard = BOARD_META.find((b) => b.code === board)!;
  const officialSite = SITE.boards[activeBoard.code].website;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-600" aria-hidden /> Previous Year Questions
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Official paper links for 2021-2025, board-wise. Plus original practice sets to test yourself.
        </p>
      </div>

      {/* copyright note */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 px-4 py-3 flex items-start gap-2.5 text-[13px] text-amber-900 dark:text-amber-200">
        <Info className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
        <p>
          We never host or copy board question papers — they belong to the boards. We link you to the{" "}
          <span className="font-semibold">official portals</span> where papers are published free by the boards
          themselves. Our own original model-practice questions are marked{" "}
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-0 bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
            PRACTICE
          </Badge>{" "}
          and are safe to use anywhere.
        </p>
      </div>

      {/* board cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {BOARD_META.map((b) => (
          <button
            key={b.code}
            onClick={() => switchBoard(b.code)}
            aria-pressed={board === b.code}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all",
              board === b.code
                ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm"
                : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-300 dark:hover:border-emerald-700"
            )}
          >
            <span className={cn("block h-1.5 w-10 rounded-full mb-3", b.color)} />
            <span className="block font-bold text-stone-900 dark:text-stone-50">{b.code}</span>
            <span className="block text-xs text-stone-500 dark:text-stone-400 mt-0.5">{b.sub}</span>
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-stone-400 flex items-center gap-1.5 uppercase tracking-wide">
          <Filter className="h-3.5 w-3.5" aria-hidden /> Class
        </span>
        {[0, 9, 10, 11, 12].map((g) => (
          <Button
            key={g}
            size="sm"
            variant={grade === g ? "default" : "outline"}
            className={cn(
              "rounded-full",
              grade === g
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400"
            )}
            onClick={() => switchGrade(g)}
          >
            {g === 0 ? "All" : `Class ${g}`}
          </Button>
        ))}
        <a
          href={officialSite}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-emerald-700 dark:text-emerald-400 underline underline-offset-2 hover:text-emerald-800 dark:hover:text-emerald-300 inline-flex items-center gap-1"
        >
          {activeBoard.code} official site <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      </div>

      <AdSlot slot="pyq-mid" minHeight={100} />

      {/* papers */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-10">No papers found for this filter yet.</p>
      ) : (
        <div className="space-y-5">
          {grouped.map((g) => (
            <div key={g.grade}>
              <h2 className="text-base font-bold text-stone-800 dark:text-stone-100 mb-2.5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 text-sm font-extrabold">
                  {g.grade}
                </span>
                Class {g.grade}
              </h2>
              <div className="grid md:grid-cols-2 gap-2.5">
                {g.subjects.map(([subjectName, rows]) => (
                  <motion.div
                    key={subjectName}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">{subjectName}</h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 rounded-full text-[11px] text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                            onClick={() => onNavigate("practice", { grade: g.grade })}
                          >
                            <ListChecks className="h-3.5 w-3.5 mr-1" aria-hidden /> Practice
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {rows
                            .slice()
                            .sort((a, b) => b.year - a.year)
                            .map((p) => (
                              <a
                                key={p.id}
                                href={p.officialUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={p.note || "Official board source"}
                                className={cn(
                                  "group inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                                  p.kind === "SAMPLE"
                                    ? "border-amber-300 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                                    : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400"
                                )}
                              >
                                {p.year}
                                <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" aria-hidden />
                              </a>
                            ))}
                        </div>
                        <p className="mt-2.5 text-[11px] text-stone-400 leading-relaxed">
                          {rows[0]?.note}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AdSlot slot="pyq-bottom" minHeight={100} />
    </div>
  );
}
