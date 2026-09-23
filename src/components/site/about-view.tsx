"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Clock3,
  Info,
  Loader2,
  Mail,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { AutomationDto } from "@/lib/types";
import { SITE } from "@/config/site";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function AboutView() {
  const [auto, setAuto] = useState<AutomationDto | null>(null);
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  const load = () =>
    fetch("/api/automation")
      .then((r) => r.json())
      .then((d: AutomationDto) => setAuto(d))
      .catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const runNow = async () => {
    setRunning(true);
    try {
      const r = await fetch("/api/cron/daily?force=1&trigger=manual", { method: "POST" });
      const d = await r.json();
      toast({
        title: d.skipped ? "Already up to date today" : d.ok ? "Update complete!" : "Update ran with issues",
        description: d.detail || d.message || "",
      });
      await load();
    } catch {
      toast({ title: "Could not trigger update", variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const coverage = auto ? Math.round((auto.coverage.chaptersWithNotes / Math.max(1, auto.coverage.totalChapters)) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-50">About StudySetu</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Free, fair and fully automatic study help for Class 9-12 students across India.
        </p>
      </div>

      {/* automation status */}
      <Card className="border-emerald-200 dark:border-emerald-900/60">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-emerald-600" aria-hidden />
            Self-Maintenance Engine
            {auto && (
              <Badge
                variant="secondary"
                className={`ml-auto border-0 text-[10px] ${
                  auto.ranToday
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                }`}
              >
                {auto.ranToday ? "ran today ✓" : "scheduled"}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!auto ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-2.5 text-sm">
                <div className="rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 px-3.5 py-3">
                  <div className="flex items-center gap-1.5 text-stone-400 text-xs uppercase tracking-wide">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden /> Schedule
                  </div>
                  <div className="mt-1 font-medium text-stone-800 dark:text-stone-100">{auto.schedule}</div>
                </div>
                <div className="rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 px-3.5 py-3">
                  <div className="flex items-center gap-1.5 text-stone-400 text-xs uppercase tracking-wide">
                    <RefreshCcw className="h-3.5 w-3.5" aria-hidden /> Next run
                  </div>
                  <div className="mt-1 font-medium text-stone-800 dark:text-stone-100">
                    {auto.nextRun
                      ? new Date(auto.nextRun).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 px-3.5 py-3">
                  <div className="flex items-center gap-1.5 text-stone-400 text-xs uppercase tracking-wide">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Note coverage
                  </div>
                  <div className="mt-1 font-medium text-stone-800 dark:text-stone-100">
                    {auto.coverage.chaptersWithNotes}/{auto.coverage.totalChapters} chapters
                  </div>
                  <Progress value={coverage} className="h-1 mt-1.5 bg-stone-200 dark:bg-stone-800 [&>div]:bg-emerald-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Recent runs</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 rounded-full text-xs border-emerald-300 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    onClick={runNow}
                    disabled={running}
                  >
                    {running ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" aria-hidden /> : <RefreshCcw className="h-3.5 w-3.5 mr-1.5" aria-hidden />}
                    {running ? "Updating…" : "Run update now"}
                  </Button>
                </div>
                <div className="max-h-60 overflow-y-auto setu-scroll space-y-1.5 pr-1">
                  {auto.logs.length === 0 && <p className="text-xs text-stone-400">No runs yet — first run happens automatically.</p>}
                  {auto.logs.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-start gap-2 rounded-lg border border-stone-100 dark:border-stone-800 px-3 py-2 text-xs"
                    >
                      {l.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0" aria-hidden />
                      ) : l.status === "partial" ? (
                        <RefreshCcw className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" aria-hidden />
                      ) : (
                        <XCircle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" aria-hidden />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-stone-700 dark:text-stone-200 capitalize">{l.jobName}</span>
                        <span className="text-stone-400"> · {timeAgo(l.ranAt)}</span>
                        <div className="text-stone-500 dark:text-stone-400 mt-0.5 break-words">{l.detail}</div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[10px] border-0 bg-stone-100 dark:bg-stone-800"
                      >
                        +{l.notesCreated}n +{l.questionsCreated}q
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* copyright & content policy */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden /> Copyright & Content Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-stone-600 dark:text-stone-300 space-y-3 leading-relaxed">
          <p>
            <span className="font-semibold text-stone-800 dark:text-stone-100">100% original content.</span> Every
            revision note, key point and practice question on StudySetu is written in original wording by our AI study
            engine. We do not copy, reproduce or store NCERT textbook text, guide books, coaching material or board
            question papers.
          </p>
          <p>
            <span className="font-semibold text-stone-800 dark:text-stone-100">PYQs — link, don&apos;t host.</span> For
            previous year papers we only show metadata (board, class, subject, year) and link to the boards&apos; own
            official portals — CBSE, BSEH Haryana, BSEB Bihar and DHSE Kerala — where the papers are published free by
            the boards themselves. All rights remain with the respective boards.
          </p>
          <p>
            <span className="font-semibold text-stone-800 dark:text-stone-100">Chapter names &amp; facts.</span> Syllabus
            chapter names and curriculum facts are used under fair use for navigation; the explanations and notes are
            entirely our own writing.
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            Found something that shouldn&apos;t be here? Write to{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-emerald-700 dark:text-emerald-400 underline underline-offset-2">
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
            <h3 className="font-semibold text-stone-800 dark:text-stone-100 text-sm">Contact & advertising</h3>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Business and content queries:{" "}
              <a href={`mailto:${SITE.contactEmail}`} className="text-emerald-700 dark:text-emerald-400 underline underline-offset-2">
                {SITE.contactEmail}
              </a>
              . This site runs non-intrusive Google AdSense ads — your support keeps everything free.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
