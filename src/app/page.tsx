"use client";

import { useCallback, useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { HomeView } from "@/components/site/home-view";
import { StudyView } from "@/components/site/study-view";
import { PyqView } from "@/components/site/pyq-view";
import { PracticeView } from "@/components/site/practice-view";
import { AboutView } from "@/components/site/about-view";
import type { ViewKey } from "@/config/site";
import { SITE } from "@/config/site";
import { SCHOOL_COUNT } from "@/config/seo";

export default function Page() {
  const [view, setView] = useState<ViewKey>("home");
  const [studyGrade, setStudyGrade] = useState<number | undefined>(undefined);
  const [practiceGrade, setPracticeGrade] = useState<number | undefined>(undefined);
  const [studyQuery, setStudyQuery] = useState<string | undefined>(undefined);
  const [studyKey, setStudyKey] = useState(0);
  const [practiceKey, setPracticeKey] = useState(0);

  // Sitelinks SearchAction support: /?s=trigonometry opens Study Material pre-searched
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("s");
    if (!s || !s.trim()) return;
    const id = requestAnimationFrame(() => {
      setStudyQuery(s.trim());
      setStudyGrade(undefined);
      setStudyKey((k) => k + 1);
      setView("study");
    });
    return () => cancelAnimationFrame(id);
  }, []);

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
          {view === "study" && (
            <StudyView key={studyKey} initialGrade={studyGrade} initialQuery={studyQuery} onNavigate={(v) => navigate(v)} />
          )}
          {view === "pyq" && <PyqView onNavigate={navigate} />}
          {view === "practice" && <PracticeView key={practiceKey} initialGrade={practiceGrade} />}
          {view === "about" && <AboutView />}
        </div>
      </main>

      <SiteFooter onNavigate={(v) => navigate(v)} />

      {/* Crawlable fallback for no-JS user agents */}
      <noscript>
        <div style={{ padding: 16 }}>
          <h2>StudySetu — Free Study Material &amp; Previous Year Questions for Class 9-12</h2>
          <p>
            Free chapter-wise original revision notes, PYQ guides and MCQ practice for students of CBSE schools in
            Noida, Greater Noida and Delhi, CBSE and HBSE schools in Haryana, CBSE and BSEB schools in Bihar, and
            CBSE / DHSE Kerala schools. Based on the NCERT syllabus. Updated automatically every day.
          </p>
          <ul>
            <li><a href="/#classes">Class 9, 10, 11 &amp; 12 study material</a></li>
            <li><a href="/#schools">Schools covered in Noida, Delhi, Haryana, Kerala and Bihar</a></li>
            <li><a href="/#faq">Frequently asked questions</a></li>
            <li><a href={SITE.url}>{SITE.name} home</a></li>
            <li>Site map: <a href="/sitemap.xml">/sitemap.xml</a> ({SCHOOL_COUNT}+ schools covered)</li>
          </ul>
          <p>StudySetu is an independent platform and is not affiliated with any school or education board.</p>
        </div>
      </noscript>
    </div>
  );
}
