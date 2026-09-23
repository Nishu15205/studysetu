"use client";

import { useCallback, useState } from "react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { HomeView } from "@/components/site/home-view";
import { StudyView } from "@/components/site/study-view";
import { PyqView } from "@/components/site/pyq-view";
import { PracticeView } from "@/components/site/practice-view";
import { AboutView } from "@/components/site/about-view";
import type { ViewKey } from "@/config/site";

export default function Page() {
  const [view, setView] = useState<ViewKey>("home");
  const [studyGrade, setStudyGrade] = useState<number | undefined>(undefined);
  const [practiceGrade, setPracticeGrade] = useState<number | undefined>(undefined);
  const [studyKey, setStudyKey] = useState(0);
  const [practiceKey, setPracticeKey] = useState(0);

  const navigate = useCallback(
    (v: ViewKey, opts?: { grade?: number }) => {
      setView(v);
      if (v === "study") {
        if (opts?.grade !== undefined) setStudyGrade(opts.grade);
        setStudyKey((k) => k + 1);
      }
      if (v === "practice") {
        if (opts?.grade !== undefined) setPracticeGrade(opts.grade);
        setPracticeKey((k) => k + 1);
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    []
  );

  const openClass = useCallback(
    (grade: number) => {
      setStudyGrade(grade);
      setStudyKey((k) => k + 1);
      setView("study");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-stone-950">
      <SiteHeader view={view} onNavigate={(v) => navigate(v)} />

      <main className="flex-1 w-full">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8 w-full">
          {view === "home" && <HomeView onNavigate={navigate} onOpenClass={openClass} />}
          {view === "study" && <StudyView key={studyKey} initialGrade={studyGrade} onNavigate={(v) => navigate(v)} />}
          {view === "pyq" && <PyqView onNavigate={navigate} />}
          {view === "practice" && <PracticeView key={practiceKey} initialGrade={practiceGrade} />}
          {view === "about" && <AboutView />}
        </div>
      </main>

      <SiteFooter onNavigate={(v) => navigate(v)} />
    </div>
  );
}
