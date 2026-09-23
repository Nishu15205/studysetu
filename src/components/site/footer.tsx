"use client";

import Link from "next/link";
import { GraduationCap, ShieldCheck, RefreshCcw } from "lucide-react";
import type { ViewKey } from "@/config/site";
import { SITE } from "@/config/site";

const BOARD_LINKS: Array<{ label: string; region: string; url: string }> = [
  { label: "CBSE", region: "Delhi · Noida", url: SITE.boards.CBSE.website },
  { label: "HBSE", region: "Haryana", url: SITE.boards.HBSE.website },
  { label: "BSEB", region: "Bihar", url: SITE.boards.BSEB.website },
  { label: "Kerala DHSE", region: "Kerala", url: SITE.boards.KERALA.website },
];

export function SiteFooter({ onNavigate }: { onNavigate: (v: ViewKey) => void }) {
  return (
    <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <GraduationCap className="h-4 w-4" aria-hidden />
              </span>
              <span className="font-bold text-stone-900 dark:text-stone-50">
                Study<span className="text-emerald-600 dark:text-emerald-400">Setu</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Free, original study notes and practice questions for Class 9-12 across CBSE, HBSE, BSEB and Kerala
              boards.
            </p>
            <p className="mt-2 text-[11px] text-stone-400 dark:text-stone-500 leading-relaxed">
              Serving students in Noida · Greater Noida · Delhi · Gurugram · Faridabad · Sonipat · Patna · Gaya ·
              Muzaffarpur · Thiruvananthapuram · Kochi · Kozhikode · across India.
            </p>
            <p className="mt-2 text-[11px] text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
              100% original content · copyright-safe
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
              Explore
            </h3>
            <ul className="space-y-1.5 text-sm">
              {([
                { v: "study" as ViewKey, label: "Study Material" },
                { v: "pyq" as ViewKey, label: "Previous Year Papers" },
                { v: "practice" as ViewKey, label: "Practice Questions" },
                { v: "about" as ViewKey, label: "About & Policies" },
              ]).map((item) => (
                <li key={item.v}>
                  <button
                    className="text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                    onClick={() => onNavigate(item.v)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <a href="/#classes" className="text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Class 9-12 Notes
                </a>
              </li>
              <li>
                <a href="/#schools" className="text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Schools We Cover
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
              Official Board Sites
            </h3>
            <ul className="space-y-1.5 text-sm">
              {BOARD_LINKS.map((b) => (
                <li key={b.label}>
                  <Link
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    {b.label} <span className="text-stone-400 text-xs">· {b.region}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
              Always Fresh
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed flex items-start gap-1.5">
              <RefreshCcw className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" aria-hidden />
              New notes and practice questions are generated automatically every day at 03:05 AM IST — no manual
              updates needed.
            </p>
          </div>
        </div>

        <div className="mt-7 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            © {new Date().getFullYear()} StudySetu · Made for Indian students · All content is original
          </p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            Board question papers belong to their respective boards; we only link to official sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
