import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Shared shell for legal/static pages (Privacy Policy, Terms, Disclaimer, Contact).
 * Keeps the same emerald/stone design language as the main SPA, with a sticky
 * footer and full-height flex layout.
 */
export function LegalPageShell({
  title,
  description,
  updatedAt = "23 September 2025",
  children,
}: {
  title: string;
  description: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-stone-950">
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-950/95 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to StudySetu
          </Link>
          <Link href="/" className="font-bold text-stone-900 dark:text-stone-50">
            Study<span className="text-emerald-600 dark:text-emerald-400">Setu</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-50">{title}</h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{description}</p>
          <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">Last updated: {updatedAt}</p>

          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-stone-600 dark:text-stone-300 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h2]:dark:text-stone-50 [&_h2]:mt-8 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-emerald-700 [&_a]:dark:text-emerald-400 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-stone-800 [&_strong]:dark:text-stone-100">
            {children}
          </div>

          <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap gap-3 text-sm">
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
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-4xl px-4 py-5 text-center">
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            © {new Date().getFullYear()} StudySetu · Made for Indian students · All content is original
          </p>
          <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-500">
            StudySetu is an independent study platform and is not affiliated with any school or education board.
          </p>
        </div>
      </footer>
    </div>
  );
}
