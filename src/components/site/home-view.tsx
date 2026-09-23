"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  FileText,
  LibraryBig,
  ListChecks,
  Sparkles,
  Timer,
  Trophy,
  BadgeCheck,
  ShieldCheck,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdSlot } from "@/components/site/ad-slot";
import type { ClassDto, StatsDto } from "@/lib/types";
import type { ViewKey } from "@/config/site";
import { useToast } from "@/hooks/use-toast";

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function HomeView({
  onNavigate,
  onOpenClass,
}: {
  onNavigate: (v: ViewKey, opts?: { grade?: number }) => void;
  onOpenClass: (grade: number) => void;
}) {
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [structure, setStructure] = useState<ClassDto[]>([]);
  const [qotdChoice, setQotdChoice] = useState<string | null>(null);
  const [qotdChecked, setQotdChecked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let alive = true;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d: StatsDto) => alive && setStats(d))
      .catch(() => toast({ title: "Could not load stats", variant: "destructive" }));
    fetch("/api/structure")
      .then((r) => r.json())
      .then((d) => alive && setStructure(d.classes ?? []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [toast]);

  const q = stats?.qotd ?? null;
  const qCorrect = qotdChoice !== null && qotdChoice === q?.answer;

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-emerald-950/40 dark:via-stone-950 dark:to-amber-950/30 border border-emerald-100/70 dark:border-emerald-900/40">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 md:py-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border-0 hover:bg-emerald-100">
                <Sparkles className="h-3 w-3 mr-1" aria-hidden /> Updated daily · automatically
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
                Free Study Notes & PYQs for{" "}
                <span className="text-emerald-600 dark:text-emerald-400">Class 9-12</span>
              </h1>
              <p className="mt-4 text-stone-600 dark:text-stone-300 text-base md:text-lg leading-relaxed">
                Original, easy-to-revise notes and fresh practice questions for CBSE (Delhi · Noida), HBSE Haryana,
                BSEB Bihar and Kerala board students. Every day, new content appears on its own — you just study.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  onClick={() => onNavigate("study")}
                >
                  <BookOpenCheck className="h-4.5 w-4.5 mr-2" aria-hidden /> Start Reading
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-400 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                  onClick={() => onNavigate("pyq")}
                >
                  <FileText className="h-4.5 w-4.5 mr-2" aria-hidden /> Browse PYQs
                </Button>
              </div>
              {/* live counters */}
              <div className="mt-7 grid grid-cols-4 max-w-md gap-2">
                {[
                  { icon: BookOpenCheck, label: "Notes", val: stats?.totals.notes },
                  { icon: ListChecks, label: "Questions", val: stats?.totals.questions },
                  { icon: FileText, label: "Papers", val: stats?.totals.papers },
                  { icon: LibraryBig, label: "Chapters", val: stats?.totals.chapters },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 px-2.5 py-2 text-center">
                    <s.icon className="h-4 w-4 mx-auto text-emerald-600 dark:text-emerald-400" aria-hidden />
                    <div className="mt-1 text-base md:text-lg font-bold text-stone-900 dark:text-stone-50 tabular-nums">
                      {s.val ?? <Skeleton className="h-5 w-8 mx-auto" />}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-stone-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative aspect-[7/4] overflow-hidden rounded-2xl shadow-xl ring-1 ring-stone-900/5"
            >
              <Image
                src="/hero-students.png"
                alt="Indian school students studying together with books and laptops"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Class picker */}
      <section aria-label="Choose your class">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-50">Choose Your Class</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">Notes chapter-wise for every subject</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[9, 10, 11, 12].map((grade, i) => {
            const cls = structure.find((c) => c.grade === grade);
            const subjectCount = cls?.subjects.length ?? 0;
            const noteHint = grade >= 11 ? "Board level" : grade === 10 ? "Board year" : "Foundation";
            return (
              <motion.button
                key={grade}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                onClick={() => onOpenClass(grade)}
                className="group text-left rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 md:p-5 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all"
                aria-label={`Open Class ${grade} study material`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl md:text-4xl font-extrabold text-emerald-600/90 dark:text-emerald-400/90 group-hover:scale-105 transition-transform">
                    {grade}
                  </span>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-0 text-[10px]">
                    {noteHint}
                  </Badge>
                </div>
                <div className="mt-3 text-sm text-stone-500 dark:text-stone-400">
                  {cls ? `${subjectCount} subjects · ${cls.subjects.reduce((a, s) => a + s.chapterCount, 0)} chapters` : "Loading…"}
                </div>
                <div className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center">
                  Open material <ChevronRight className="h-3.5 w-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <AdSlot slot="home-top" minHeight={110} />

      {/* Daily challenge + boards */}
      <section className="grid lg:grid-cols-5 gap-4 md:gap-6">
        {/* Question of the day */}
        <Card className="lg:col-span-3 border-emerald-200/70 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-stone-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-amber-500" aria-hidden />
              Daily Challenge
              <Badge variant="secondary" className="ml-auto bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-0 text-[10px]">
                <RefreshCcw className="h-3 w-3 mr-1" aria-hidden /> changes every day
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!q ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div>
                <p className="text-sm font-medium text-stone-800 dark:text-stone-100">
                  {q.grade > 0 && <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Class {q.grade} · {q.subject} · </span>}
                  {q.text}
                </p>
                <div className="mt-3 grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const chosen = qotdChoice === opt;
                    const isAnswer = opt === q.answer;
                    return (
                      <button
                        key={opt}
                        disabled={!!qotdChoice}
                        onClick={() => {
                          setQotdChoice(opt);
                          setQotdChecked(true);
                          if (opt === q.answer) toast({ title: "Correct! 🎉", description: "Great job, keep it up!" });
                          else toast({ title: "Not quite!", description: "Check the explanation below." });
                        }}
                        className={`text-left text-sm rounded-xl border px-3.5 py-2.5 transition-all disabled:cursor-default ${
                          !qotdChoice
                            ? "border-stone-200 dark:border-stone-700 hover:border-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30"
                            : isAnswer
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 font-semibold"
                              : chosen
                                ? "border-red-300 bg-red-50 dark:bg-red-950/30 line-through opacity-80"
                                : "border-stone-200 dark:border-stone-800 opacity-60"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {qotdChecked && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl bg-white/80 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 p-3 text-sm text-stone-600 dark:text-stone-300">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Answer: </span>
                    {q.answer}. {q.explanation}
                    <Button
                      size="sm"
                      variant="link"
                      className="ml-1 p-0 h-auto text-emerald-700 dark:text-emerald-400"
                      onClick={() => onNavigate("practice")}
                    >
                      Practice more →
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Boards */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BadgeCheck className="h-5 w-5 text-emerald-600" aria-hidden /> Your Board
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {[
              { code: "CBSE" as const, name: "CBSE", sub: "Delhi · Noida · UP schools" },
              { code: "HBSE" as const, name: "HBSE / BSEH", sub: "Haryana schools" },
              { code: "BSEB" as const, name: "BSEB", sub: "Bihar schools" },
              { code: "KERALA" as const, name: "Kerala DHSE", sub: "Kerala state board" },
            ].map((b) => (
              <button
                key={b.code}
                onClick={() => onNavigate("pyq", { grade: undefined })}
                className="flex items-center justify-between rounded-xl border border-stone-200 dark:border-stone-800 px-3.5 py-2.5 text-left hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all group"
              >
                <span>
                  <span className="block text-sm font-semibold text-stone-800 dark:text-stone-100">{b.name}</span>
                  <span className="block text-xs text-stone-500 dark:text-stone-400">{b.sub}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" aria-hidden />
              </button>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Latest additions */}
      <section aria-label="Latest updates">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-50">Fresh This Week</h2>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-0 text-[10px]">
            auto-added
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-3 md:gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <BookOpenCheck className="h-4 w-4 text-emerald-600" aria-hidden /> Latest Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 max-h-64 overflow-y-auto space-y-2 setu-scroll">
              {stats
                ? stats.latestNotes.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => onNavigate("study", { grade: n.grade })}
                      className="w-full text-left rounded-lg border border-stone-100 dark:border-stone-800 px-3 py-2 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                    >
                      <div className="text-sm font-medium text-stone-800 dark:text-stone-100 line-clamp-1">{n.title}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        Class {n.grade} · {n.subject} · {n.chapterName} · {fmtDate(n.updatedAt)}
                      </div>
                    </button>
                  ))
                : [...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-emerald-600" aria-hidden /> New Practice Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 max-h-64 overflow-y-auto space-y-2 setu-scroll">
              {stats
                ? stats.latestQuestions.map((n) => (
                    <div key={n.id} className="rounded-lg border border-stone-100 dark:border-stone-800 px-3 py-2">
                      <div className="text-sm font-medium text-stone-800 dark:text-stone-100 line-clamp-1">{n.text}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        Class {n.grade} · {n.subject} · {fmtDate(n.createdAt)}
                      </div>
                    </div>
                  ))
                : [...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why us */}
      <section aria-label="Features">
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4">Why Students Pick StudySetu</h2>
        <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
          {[
            {
              icon: ShieldCheck,
              title: "Copyright-safe by design",
              body: "Every note and question is written in original words by our AI study engine — we never copy NCERT text, guides or board papers. PYQs link straight to official board sites.",
            },
            {
              icon: RefreshCcw,
              title: "Zero-maintenance freshness",
              body: "An automated engine adds new notes and practice sets every night at 03:05 IST. What you see is always up to date — no waiting, no stale content.",
            },
            {
              icon: Timer,
              title: "Built for revision speed",
              body: "Short notes, key-point bullets, exam tips and instant-check MCQs — everything designed to help you revise a full chapter in minutes, not hours.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 mb-3">
                    <f.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-semibold text-stone-900 dark:text-stone-50">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{f.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <AdSlot slot="home-bottom" minHeight={110} />

      {/* FAQ — helpful for AdSense approval */}
      <section aria-label="Frequently asked questions">
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4">
          {[
            {
              q: "Is StudySetu free?",
              a: "Yes. All notes, PYQ guides and practice questions are completely free. The site is supported by non-intrusive ads.",
            },
            {
              q: "Is the content copyright-safe?",
              a: "Absolutely. Every note and question on StudySetu is originally written — we do not reproduce textbook chapters, guide books or board question papers. For previous year papers, we provide direct links to the official board portals (CBSE, HBSE, BSEB, Kerala DHSE) where the boards themselves publish them for free.",
            },
            {
              q: "How often is new content added?",
              a: "Automatically, every single day at 03:05 AM IST. New revision notes, fresh MCQ sets and a new Daily Challenge question appear without any manual work.",
            },
            {
              q: "Which boards and classes are covered?",
              a: "Classes 9 to 12 for CBSE (Delhi/Noida/UP), HBSE Haryana, BSEB Bihar and Kerala board students. The NCERT-based syllabus is shared by CBSE, HBSE and BSEB, and Kerala students can use the same concept notes alongside their SCERT materials.",
            },
            {
              q: "Can I rely on these notes for board exams?",
              a: "The notes are designed for fast revision and concept clarity. Always cross-check with your prescribed textbook and use official board sample papers (linked in the PYQ section) for the exact exam pattern.",
            },
          ].map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-stone-100 dark:border-stone-800">
              <AccordionTrigger className="text-sm md:text-base font-medium text-stone-800 dark:text-stone-100 hover:text-emerald-700 dark:hover:text-emerald-400 hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
