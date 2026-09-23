"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  CheckCircle2,
  Info,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE } from "@/config/site";
import type { StatsDto } from "@/lib/types";

export function AboutView() {
  const [totals, setTotals] = useState<StatsDto["totals"] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: StatsDto | null) => alive && d && setTotals(d.totals))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-50">About StudySetu</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Free, fair and original study help for Class 9-12 students across India.
        </p>
      </div>

      {/* mission */}
      <Card className="border-emerald-200 dark:border-emerald-900/60">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-emerald-600" aria-hidden /> Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-stone-600 dark:text-stone-300 space-y-3 leading-relaxed">
          <p>
            StudySetu was built with one simple belief: <span className="font-semibold text-stone-800 dark:text-stone-100">every Indian student deserves free, high-quality revision material</span> —
            whether they study in a Delhi private school, a Haryana government school, a Patna board school or a
            Kerala school. No sign-up, no paywall, no distraction — just open the site and start revising.
          </p>
          <p>
            Today the platform covers <span className="font-semibold">{totals ? `${totals.chapters} chapters` : "every chapter"}</span> across
            Classes 9-12 with <span className="font-semibold">{totals ? totals.notes : "hundreds of"} original revision notes</span>,{" "}
            <span className="font-semibold">{totals ? totals.questions : "hundreds of"} practice questions</span> and a complete previous-year
            paper guide (<span className="font-semibold">{totals ? totals.papers : "500"} paper links</span>) for four boards.
          </p>
          <p>
            Everything is available without any login or account. We run non-intrusive Google AdSense ads to keep the
            platform free forever — that&apos;s the only &quot;price&quot; you pay.
          </p>
        </CardContent>
      </Card>

      {/* what you get */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpenCheck className="h-5 w-5 text-emerald-600" aria-hidden /> What you get here
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-stone-600 dark:text-stone-300">
          <ul className="grid sm:grid-cols-2 gap-2">
            {[
              "Chapter-wise original revision notes (600-900 words each)",
              "Quick Revision bullets + Exam Tips in every note",
              "Original MCQ practice sets with instant checking & explanations",
              "A new Daily Challenge question every day",
              "PYQ guide for 2021-2025 with official board links",
              "Coverage of 100+ schools across Noida, Delhi, Haryana, Kerala & Bihar",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* copyright & content policy */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden /> Copyright &amp; Content Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-stone-600 dark:text-stone-300 space-y-3 leading-relaxed">
          <p>
            <span className="font-semibold text-stone-800 dark:text-stone-100">100% original content.</span> Every
            revision note, key point and practice question on StudySetu is written in original wording by our AI study
            engine and reviewed before publishing. We do not copy, reproduce or store NCERT textbook text, guide
            books, coaching material or board question papers.
          </p>
          <p>
            <span className="font-semibold text-stone-800 dark:text-stone-100">PYQs — link, don&apos;t host.</span>{" "}
            For previous year papers we only show metadata (board, class, subject, year) and link to the boards&apos;
            own official portals — CBSE, BSEH Haryana, BSEB Bihar and DHSE Kerala — where the papers are published
            free by the boards themselves. All rights remain with the respective boards.
          </p>
          <p>
            <span className="font-semibold text-stone-800 dark:text-stone-100">Chapter names &amp; facts.</span>{" "}
            Syllabus chapter names and curriculum facts are used under fair use for navigation; the explanations and
            notes are entirely our own writing. School names are used only to describe which regions/boards we serve —
            StudySetu is not affiliated with, endorsed by or officially connected to any school or board.
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            Found something that shouldn&apos;t be here? Write to{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-emerald-700 dark:text-emerald-400 underline underline-offset-2"
            >
              {SITE.contactEmail}
            </a>{" "}
            and we&apos;ll review within 48 hours.
          </p>
        </CardContent>
      </Card>

      {/* info cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-5">
            <Info className="h-5 w-5 text-emerald-600 mb-2" aria-hidden />
            <h3 className="font-semibold text-stone-800 dark:text-stone-100 text-sm">Boards we serve</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-stone-500 dark:text-stone-400">
              <li>CBSE — Delhi, Noida &amp; UP region schools</li>
              <li>HBSE / BSEH — all Haryana schools</li>
              <li>BSEB — all Bihar schools</li>
              <li>DHSE / SCERT — Kerala schools</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Mail className="h-5 w-5 text-emerald-600 mb-2" aria-hidden />
            <h3 className="font-semibold text-stone-800 dark:text-stone-100 text-sm">Contact &amp; advertising</h3>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Business and content queries:{" "}
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="text-emerald-700 dark:text-emerald-400 underline underline-offset-2"
              >
                {SITE.contactEmail}
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="text-emerald-700 dark:text-emerald-400 underline underline-offset-2">
                contact page
              </Link>
              . This site runs non-intrusive Google AdSense ads — your support keeps everything free.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* policies */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Policies</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/privacy-policy"
            className="rounded-full border border-stone-200 dark:border-stone-700 px-3.5 py-1.5 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="rounded-full border border-stone-200 dark:border-stone-700 px-3.5 py-1.5 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/disclaimer"
            className="rounded-full border border-stone-200 dark:border-stone-700 px-3.5 py-1.5 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            Disclaimer
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-stone-200 dark:border-stone-700 px-3.5 py-1.5 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            Contact Us
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
