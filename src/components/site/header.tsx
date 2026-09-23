"use client";

import { GraduationCap, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import type { ViewKey } from "@/config/site";

const NAV: Array<{ key: ViewKey; label: string }> = [
  { key: "home", label: "Home" },
  { key: "study", label: "Study Material" },
  { key: "pyq", label: "PYQs" },
  { key: "practice", label: "Practice" },
  { key: "about", label: "About" },
];

function NavButtons({
  view,
  onNavigate,
  onPick,
  className,
}: {
  view: ViewKey;
  onNavigate: (v: ViewKey) => void;
  onPick?: () => void;
  className?: string;
}) {
  return (
    <>
      {NAV.map((item) => (
        <Button
          key={item.key}
          variant={view === item.key ? "default" : "ghost"}
          size="sm"
          className={
            (className ?? "") +
            (view === item.key
              ? " bg-emerald-600 hover:bg-emerald-700 text-white"
              : " text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400")
          }
          onClick={() => {
            onNavigate(item.key);
            onPick?.();
          }}
        >
          {item.label}
        </Button>
      ))}
    </>
  );
}

export function SiteHeader({ view, onNavigate }: { view: ViewKey; onNavigate: (v: ViewKey) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/70 dark:border-stone-800 bg-white/85 dark:bg-stone-950/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-stone-950/70">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3">
        <button
          className="flex items-center gap-2.5 group"
          onClick={() => onNavigate("home")}
          aria-label="StudySetu home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">
              Study<span className="text-emerald-600 dark:text-emerald-400">Setu</span>
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-wide">
              Class 9-12 · Notes · PYQs
            </span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          <NavButtons view={view} onNavigate={onNavigate} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="flex items-center gap-2 text-stone-900 dark:text-stone-50">
                <GraduationCap className="h-5 w-5 text-emerald-600" aria-hidden /> StudySetu
              </SheetTitle>
              <div className="mt-4 flex flex-col gap-1.5">
                <NavButtons view={view} onNavigate={onNavigate} onPick={() => setOpen(false)} className="justify-start" />
                <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
                  <span>Content refreshes automatically every day at 3:05 AM.</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
