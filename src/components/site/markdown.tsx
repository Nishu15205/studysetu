"use client";

import ReactMarkdown from "react-markdown";

/** Styled markdown renderer for study notes */
export function NoteMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl md:text-2xl font-semibold text-emerald-800 dark:text-emerald-300 mt-7 mb-3 pb-1.5 border-b border-emerald-100 dark:border-emerald-900/60">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base md:text-lg font-semibold text-foreground mt-5 mb-2">{children}</h3>
        ),
        p: ({ children }) => <p className="text-[15px] leading-relaxed text-foreground/90 my-3">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 my-3 space-y-1.5 text-[15px] text-foreground/90">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 my-3 space-y-1.5 text-[15px] text-foreground/90">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-emerald-900 dark:text-emerald-200">{children}</strong>,
        em: ({ children }) => <em className="text-foreground/80">{children}</em>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-950/30 pl-4 pr-3 py-2 my-4 rounded-r-lg text-[15px] italic">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-stone-100 dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded text-[13px] font-mono">
            {children}
          </code>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 px-3 py-2 text-left font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-stone-100 dark:border-stone-800 px-3 py-2">{children}</td>
        ),
        a: ({ children, href }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-emerald-400 underline underline-offset-2 hover:text-emerald-900 dark:hover:text-emerald-300">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
