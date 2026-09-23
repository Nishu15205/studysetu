"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  ChevronRight,
  Clock,
  FileText,
  ListChecks,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteMarkdown } from "@/components/site/markdown";
import { AdSlot } from "@/components/site/ad-slot";
import type { NoteResponseDto, SearchResultsDto, SubjectsDto } from "@/lib/types";
import type { ViewKey } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Props = {
  initialGrade?: number;
  initialQuery?: string;
  onNavigate: (v: ViewKey) => void;
};

export function StudyView({ initialGrade, initialQuery, onNavigate }: Props) {
  const [grade, setGrade] = useState<number>(initialGrade ?? 10);
  const [data, setData] = useState<SubjectsDto | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [note, setNote] = useState<NoteResponseDto | null>(null);
  const [noteLoading, setNoteLoading] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultsDto | null>(null);
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialGrade) setGrade(initialGrade);
  }, [initialGrade]);

  // sitelinks SearchAction (?s=…) — pre-fill search on mount
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) setSearch(initialQuery.trim());
  }, [initialQuery]);

  useEffect(() => {
    let alive = true;
    setData(null);
    setSubjectId(null);
    setChapterId(null);
    setNote(null);
    fetch(`/api/subjects?grade=${grade}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: SubjectsDto | null) => alive && d && setData(d))
      .catch(() => alive && toast({ title: "Failed to load subjects", variant: "destructive" }));
    return () => {
      alive = false;
    };
  }, [grade, toast]);

  const subject = useMemo(() => data?.subjects.find((s) => s.id === subjectId) ?? null, [data, subjectId]);

  const loadNote = useCallback(
    async (chId: string, silent = false) => {
      setChapterId(chId);
      setNoteLoading(true);
      try {
        const r = await fetch(`/api/notes?chapterId=${chId}`);
        const d: NoteResponseDto | null = r.ok ? await r.json() : null;
        setNote(d && d.note && d.chapter ? d : null);
      } catch {
        if (!silent) toast({ title: "Could not load note", variant: "destructive" });
      } finally {
        setNoteLoading(false);
      }
    },
    [toast]
  );

  // open chapter from initial param (e.g. from search/home)
  useEffect(() => {
    // when subject changes, clear chapter + note
    setChapterId(null);
    setNote(null);
  }, [subjectId]);

  const generateFor = async (chId: string) => {
    setGenerating(chId);
    try {
      const r = await fetch("/api/notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId: chId }),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || "Generation failed");
      toast({ title: "Note ready!", description: "Fresh original note generated just for you." });
      await loadNote(chId);
    } catch (e) {
      toast({
        title: "Generation failed",
        description: e instanceof Error ? e.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setGenerating(null);
    }
  };

  // debounced search
  useEffect(() => {
    if (search.trim().length < 3) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(search.trim())}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d: SearchResultsDto | null) => setSearchResults(d && Array.isArray(d.results) ? d : null))
        .catch(() => {})
        .finally(() => setSearching(false));
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const openSearchHit = (hit: SearchResultsDto["results"][number]) => {
    setGrade(hit.grade);
    setSearch("");
    if (hit.kind === "note" && hit.chapterId) {
      // wait for subject list, then open chapter via note endpoint (chapterId is enough)
      setTimeout(() => loadNote(hit.chapterId!), 50);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
            <BookOpenCheck className="h-6 w-6 text-emerald-600" aria-hidden /> Study Material
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Original chapter-wise revision notes with key points and exam tips
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, chapters, questions…"
            className="pl-9 pr-8 bg-white dark:bg-stone-900"
            aria-label="Search study material"
          />
          {search && (
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* search results */}
      {searchResults && searchResults.results.length > 0 && (
        <Card className="border-emerald-200 dark:border-emerald-900/60">
          <CardContent className="p-3 max-h-72 overflow-y-auto setu-scroll space-y-1.5">
            {searchResults.results.map((hit) => (
              <button
                key={`${hit.kind}-${hit.id}`}
                onClick={() => openSearchHit(hit)}
                className="w-full text-left rounded-lg px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] border-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                  >
                    {hit.kind}
                  </Badge>
                  <span className="text-sm font-medium text-stone-800 dark:text-stone-100 line-clamp-1">{hit.title}</span>
                </div>
                <div className="text-xs text-stone-400 mt-0.5">
                  Class {hit.grade} · {hit.subject}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
      {searchResults && searchResults.results.length === 0 && search.trim().length >= 3 && (
        <p className="text-sm text-stone-400 px-1">No matches for “{search}”. Try another keyword.</p>
      )}
      {searching && <p className="text-xs text-stone-400 px-1">Searching…</p>}

      {/* class tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Class selector">
        {[9, 10, 11, 12].map((g) => (
          <Button
            key={g}
            role="tab"
            aria-selected={grade === g}
            variant={grade === g ? "default" : "outline"}
            className={cn(
              "shrink-0 rounded-full",
              grade === g
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400"
            )}
            onClick={() => setGrade(g)}
          >
            Class {g}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
        {/* left: subjects + chapters */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {!data ? (
            <div className="grid grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {data.subjects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubjectId(s.id)}
                  aria-pressed={subjectId === s.id}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left transition-all",
                    subjectId === s.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm"
                      : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-300 dark:hover:border-emerald-700"
                  )}
                >
                  <div className="text-sm font-semibold text-stone-800 dark:text-stone-100 flex items-center justify-between gap-1">
                    {s.name}
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-all",
                        subjectId === s.id ? "text-emerald-600 translate-x-0.5" : "text-stone-300"
                      )}
                      aria-hidden
                    />
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    {s.chapters.length} chapters · {s.chapters.filter((c) => c.hasNote).length} notes ready
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* chapter list */}
          {subject && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {subject.name}
                  <Badge variant="secondary" className="bg-stone-100 dark:bg-stone-800 border-0 text-[10px]">
                    Class {data?.grade}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pb-2">
                <ScrollArea className="h-[420px] px-3">
                  <ol className="space-y-1.5 pb-3">
                    {subject.chapters.map((c) => (
                      <li key={c.id}>
                        <div
                          className={cn(
                            "group rounded-lg border px-3 py-2.5 transition-all",
                            chapterId === c.id
                              ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40"
                              : "border-stone-100 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => (c.hasNote ? loadNote(c.id) : toast({ title: "No note yet", description: "Tap 'Generate with AI' to create one now." }))}
                              className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                            >
                              <span
                                className={cn(
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                                  c.hasNote
                                    ? "bg-emerald-600 text-white"
                                    : "bg-stone-100 dark:bg-stone-800 text-stone-400"
                                )}
                              >
                                {c.number}
                              </span>
                              <span className="text-sm text-stone-800 dark:text-stone-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                {c.name}
                              </span>
                            </button>
                            {c.hasNote ? (
                              <span className="shrink-0 text-[10px] text-stone-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" aria-hidden /> {c.readMins}m
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 shrink-0 rounded-full text-[11px] px-2.5 border-amber-300 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                                disabled={generating === c.id}
                                onClick={() => generateFor(c.id)}
                              >
                                {generating === c.id ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" aria-hidden />
                                ) : (
                                  <Sparkles className="h-3 w-3 mr-1" aria-hidden />
                                )}
                                {generating === c.id ? "Writing…" : "Generate"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        {/* right: note reader */}
        <div className="lg:col-span-3">
          <Card className="min-h-[520px] sticky top-20">
            {noteLoading ? (
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            ) : note?.note ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <CardHeader className="pb-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
                    <Badge className="bg-emerald-600 text-white border-0 hover:bg-emerald-600">Class {note.grade}</Badge>
                    <span>{note.subject}</span>
                    <span>·</span>
                    <span>
                      Ch {note.chapter.number}: {note.chapter.name}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden /> {note.note.readMins} min read
                    </span>
                    <Badge variant="secondary" className="ml-auto bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-[10px]">
                      <ShieldIcon /> original content
                    </Badge>
                  </div>
                  <CardTitle className="text-xl md:text-2xl leading-snug">{note.note.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2 max-h-[68vh] overflow-y-auto setu-scroll">
                  {/* strip the leading H1 — the card title already shows it */}
                  <NoteMarkdown content={note.note.content.replace(/^#\s+.+\n+/, "")} />
                  <AdSlot slot="study-in-content" minHeight={100} className="mt-6" />
                </CardContent>
              </motion.div>
            ) : note && !note.note ? (
              <CardContent className="p-8 text-center flex flex-col items-center gap-3">
                <FileText className="h-10 w-10 text-stone-300" aria-hidden />
                <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm">
                  A note for <span className="font-medium text-stone-700 dark:text-stone-200">{note.chapter.name}</span> is on
                  the way — our daily engine will write it automatically at 03:05 AM. Can’t wait?
                </p>
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => generateFor(note.chapter.id)}
                  disabled={generating === note.chapter.id}
                >
                  {generating === note.chapter.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" aria-hidden />
                  )}
                  Generate with AI now
                </Button>
              </CardContent>
            ) : (
              <CardContent className="p-8 text-center flex flex-col items-center justify-center gap-3 min-h-[480px]">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/50">
                  <BookOpenCheck className="h-7 w-7 text-emerald-600 dark:text-emerald-400" aria-hidden />
                </span>
                <h3 className="font-semibold text-stone-800 dark:text-stone-100">Pick a subject, then a chapter</h3>
                <p className="text-sm text-stone-400 max-w-xs">
                  Your clean, exam-ready note appears here — with key concepts, quick revision bullets and exam tips.
                </p>
                <Button variant="outline" className="mt-1" onClick={() => onNavigate("practice")}>
                  <ListChecks className="h-4 w-4 mr-2" aria-hidden /> Or practice questions
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return <Sparkles className="h-3 w-3 mr-1" aria-hidden />;
}
