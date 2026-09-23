"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { REGIONS } from "@/config/seo";

/**
 * SEO directory — every region + school is real, crawlable text content.
 * Descriptive use only: "students of these schools follow the syllabus our
 * notes are based on". Not affiliated with any school or board.
 */
export function SchoolsSection() {
  const [active, setActive] = useState<string>(REGIONS[0].id);
  const [filter, setFilter] = useState("");

  const region = useMemo(() => REGIONS.find((r) => r.id === active) ?? REGIONS[0], [active]);

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return region.schools;
    return region.schools.filter((s) => s.toLowerCase().includes(f));
  }, [region, filter]);

  return (
    <section id="schools" aria-label="Schools and regions covered" className="scroll-mt-24">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-50">
          100+ Schools Across Noida, Delhi, Haryana, Kerala &amp; Bihar — Covered
        </h2>
        <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-3xl">
          Whether you study at <strong>DPS Noida</strong>, <strong>Amity International</strong>,{" "}
          <strong>DPS R.K. Puram</strong>, <strong>The Shri Ram School Gurugram</strong>,{" "}
          <strong>Loyola Trivandrum</strong> or <strong>Don Bosco Academy Patna</strong> — your syllabus
          is the same NCERT / state-board pattern our chapter-wise notes follow. Find your school below.
        </p>
      </div>

      {/* Region tabs */}
      <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Choose a region">
        {REGIONS.map((r) => (
          <button
            key={r.id}
            role="tab"
            aria-selected={active === r.id}
            onClick={() => {
              setActive(r.id);
              setFilter("");
            }}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all min-h-[40px] ${
              active === r.id
                ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                : "border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400"
            }`}
          >
            <MapPin className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" aria-hidden />
            {r.name}
            <span className={`ml-1.5 text-[10px] ${active === r.id ? "text-emerald-100" : "text-stone-400"}`}>
              {r.schools.length}
            </span>
          </button>
        ))}
      </div>

      <motion.div
        key={region.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 md:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">
              Schools in {region.name}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {region.area} · {region.boardLine}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden />
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search your school…"
              aria-label={`Search schools in ${region.name}`}
              className="w-full rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 pl-9 pr-3 py-2 text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
            />
          </div>
        </div>

        <ul className="flex flex-wrap gap-2 max-h-72 overflow-y-auto setu-scroll pr-1" aria-label={`Schools covered in ${region.name}`}>
          {filtered.map((s) => (
            <li key={s}>
              <Badge
                variant="secondary"
                className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors font-normal"
              >
                {s}
              </Badge>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="text-sm text-stone-400 py-2">
              No match here — but don&apos;t worry! Our notes follow the same NCERT / board syllabus, so they
              work for every school in this region.
            </li>
          )}
        </ul>
      </motion.div>

      <p className="mt-3 text-[11px] text-stone-400 dark:text-stone-500 flex items-start gap-1.5 leading-relaxed">
        <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" aria-hidden />
        School names are used only to describe the syllabus our original notes follow. StudySetu is an
        independent platform — not affiliated with, endorsed by, or connected to any school or board.
      </p>
    </section>
  );
}
