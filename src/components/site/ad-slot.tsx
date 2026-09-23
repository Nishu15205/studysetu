"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Google AdSense slot. Set NEXT_PUBLIC_ADSENSE_CLIENT_ID (ca-pub-…) in .env to
 * activate real ads. Until then it renders a neutral reserved space, so the
 * layout never shifts when ads go live (good Core Web Vitals for AdSense).
 */
export function AdSlot({
  slot = "auto",
  format = "auto",
  className,
  label = "Advertisement",
  minHeight = 100,
}: {
  slot?: string;
  format?: string;
  className?: string;
  label?: string;
  minHeight?: number;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (SITE.adsenseClientId && !pushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // ad blockers etc.
      }
    }
  }, []);

  if (SITE.adsenseClientId) {
    return (
      <div className={cn("w-full overflow-hidden", className)} aria-label={label}>
        <ins
          className="adsbygoogle block"
          style={{ display: "block", minHeight }}
          data-ad-client={SITE.adsenseClientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Placeholder until the publisher id is configured
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40 flex items-center justify-center",
        className
      )}
      style={{ minHeight }}
      role="complementary"
      aria-label="Advertisement space"
    >
      <span className="text-[11px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 select-none">
        {label} space
      </span>
    </div>
  );
}
