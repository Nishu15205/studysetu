"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ListChecks,
  Loader2,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AdSlot } from "@/components/site/ad-slot";
import type { QuizQuestionDto, StructureDto } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Props = { initialGrade?: number };

type Phase = "pick" | "quiz" | "result";

export function PracticeView({ initialGrade }: Props) {
  const [structure, setStructure] = useState<StructureDto | null>(null);
  const [grade, setGrade] = useState<number>(initialGrade ?? 10);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("pick");
  const [questions, setQuestions] = useState<QuizQuestionDto[]>([]);
  const [available, setAvailable] = useState(0);
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<Array<{ q: QuizQuestionDto; picked: string; correct: boolean }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/structure")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: StructureDto | null) => d && setStructure(d))
      .catch(() => {});
  }, []);

  const subjects = useMemo(() => structure?.classes.find((c) => c.grade === grade)?.subjects ?? [], [structure, grade]);
  const subjectName = useMemo(() => subjects.find((s) => s.id === subjectId)?.name ?? "", [subjects, subjectId]);

  const startQuiz = async (subId: string) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/questions?subjectId=${subId}&count=10`);
      const d = await r.json();
      if (!d.ok) throw new Error(d.error);
      setAvailable(d.available ?? d.questions.length);
      if (d.questions.length === 0) {
        setSubjectId(subId);
        toast({
          title: "Questions coming soon",
          description: "Our question bank for this subject is being prepared. Try another subject meanwhile.",
        });
        setLoading(false);
        return;
      }
      setQuestions(d.questions);
      setIdx(0);
      setScore(0);
      setPicked(null);
      setAnswered([]);
      setPhase("quiz");
    } catch {
      toast({ title: "Could not load questions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const correct = opt === q.answer;
    if (correct) setScore((s) => s + 1);
    setAnswered((a) => [...a, { q, picked: opt, correct }]);
  };

  const next = () => {
    if (isLast) {
      setPhase("result");
    } else {
      setIdx((i) => i + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setPhase("pick");
    setQuestions([]);
    setPicked(null);
    setAnswered([]);
    setScore(0);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-emerald-600" aria-hidden /> Practice Zone
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Instant-check MCQs with explanations. Every question is originally written for this syllabus.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "pick" && (
          <motion.div key="pick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Class selector">
              {[9, 10, 11, 12].map((g) => (
                <Button
                  key={g}
                  role="tab"
                  aria-selected={grade === g}
                  variant={grade === g ? "default" : "outline"}
                  className={cn(
                    "shrink-0 rounded-full",
                    grade === g ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "hover:border-emerald-400"
                  )}
                  onClick={() => {
                    setGrade(g);
                    setSubjectId(null);
                  }}
                >
                  Class {g}
                </Button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSubjectId(s.id);
                    startQuiz(s.id);
                  }}
                  disabled={loading}
                  className={cn(
                    "text-left rounded-2xl border p-4 transition-all bg-white dark:bg-stone-900",
                    subjectId === s.id
                      ? "border-emerald-500 shadow-sm"
                      : "border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800 dark:text-stone-100">{s.name}</span>
                    {loading && subjectId === s.id ? (
                      <Loader2 className="h-4 w-4 text-emerald-600 animate-spin" aria-hidden />
                    ) : (
                      <Badge
                        variant="secondary"
                        className="border-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px]"
                      >
                        {s.questionCount} Qs
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    {s.chapterCount} chapters · tap to start a 10-question set
                  </div>
                </button>
              ))}
            </div>

            {subjectId && available === 0 && !loading && (
              <Card className="border-amber-300 dark:border-amber-800">
                <CardContent className="p-5 text-center flex flex-col items-center gap-2.5">
                  <ListChecks className="h-7 w-7 text-amber-500" aria-hidden />
                  <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md">
                    Practice questions for <span className="font-semibold">{subjectName}</span> are being prepared and
                    will appear here soon. Try another subject meanwhile — there are plenty to choose from.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {phase === "quiz" && q && (
          <motion.div key={`quiz-${idx}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <Card>
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <Badge variant="secondary" className="border-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px]">
                      Class {q.grade} · {q.subject}
                    </Badge>
                    {q.chapterName && <span className="hidden sm:inline">{q.chapterName}</span>}
                  </div>
                  <span className="text-xs font-semibold text-stone-500 tabular-nums">
                    {idx + 1} / {questions.length}
                  </span>
                </div>
                <Progress value={((idx + (picked ? 1 : 0)) / questions.length) * 100} className="h-1.5 mb-5 bg-stone-100 dark:bg-stone-800 [&>div]:bg-emerald-500" />

                <p className="text-base md:text-lg font-medium text-stone-900 dark:text-stone-50 leading-relaxed">{q.text}</p>

                <div className="mt-4 grid gap-2">
                  {q.options.map((opt) => {
                    const isPicked = picked === opt;
                    const isAnswer = opt === q.answer;
                    const reveal = picked !== null;
                    return (
                      <button
                        key={opt}
                        onClick={() => choose(opt)}
                        disabled={reveal}
                        className={cn(
                          "flex items-center justify-between text-left rounded-xl border px-4 py-3 text-sm transition-all",
                          !reveal &&
                            "border-stone-200 dark:border-stone-700 hover:border-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30",
                          reveal && isAnswer && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 font-semibold",
                          reveal && isPicked && !isAnswer && "border-red-300 bg-red-50 dark:bg-red-950/30",
                          reveal && !isPicked && !isAnswer && "border-stone-100 dark:border-stone-800 opacity-50"
                        )}
                      >
                        {opt}
                        {reveal && isAnswer && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden />}
                        {reveal && isPicked && !isAnswer && <XCircle className="h-5 w-5 text-red-500 shrink-0" aria-hidden />}
                      </button>
                    );
                  })}
                </div>

                {picked && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                    <div
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm",
                        picked === q.answer
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                          : "bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200"
                      )}
                    >
                      <span className="font-bold">{picked === q.answer ? "Correct! " : "Answer: "}</span>
                      {q.explanation}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={next}>
                        {isLast ? "See result" : "Next question"} <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
            <AdSlot slot="practice-mid" minHeight={90} className="mt-4" />
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-8 text-center text-white">
                <Trophy className="h-10 w-10 mx-auto mb-2" aria-hidden />
                <div className="text-4xl font-extrabold tabular-nums">
                  {score}/{questions.length}
                </div>
                <p className="mt-1 text-sm opacity-90">
                  {score === questions.length
                    ? "Perfect score! You're unstoppable 🏆"
                    : score >= questions.length * 0.7
                      ? "Great job! A little polish and you're there."
                      : "Good attempt — revise the explanations below and retry."}
                </p>
              </div>
              <CardContent className="p-4 md:p-6">
                <h3 className="font-semibold text-stone-800 dark:text-stone-100 mb-3">Review your answers</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto setu-scroll pr-1">
                  {answered.map((a, i) => (
                    <div
                      key={`${a.q.id}-${i}`}
                      className={cn(
                        "rounded-xl border px-3.5 py-3",
                        a.correct ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-red-200 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {a.correct ? (
                          <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0" aria-hidden />
                        ) : (
                          <XCircle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" aria-hidden />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{a.q.text}</p>
                          {!a.correct && (
                            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                              You: {a.picked} · Correct: <span className="font-semibold">{a.q.answer}</span>
                            </p>
                          )}
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{a.q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={restart}>
                    <RotateCcw className="h-4 w-4 mr-2" aria-hidden /> New quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
