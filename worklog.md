# Project Worklog

---
Task ID: 1
Agent: Z.ai Code (main)
Task: Build "StudySetu" — free study material + PYQ website for Indian school students (Class 9-12) covering CBSE (Delhi/Noida/UP), HBSE Haryana, BSEB Bihar and Kerala DHSE boards. Requirements: original copyright-safe content, zero-maintenance daily auto-updates, Google AdSense monetization-ready.

Work Log:
- Designed copyright-safe content model: all notes/questions are ORIGINAL (AI-written from scratch + hand-written seed content); board PYQ papers are only METADATA + links to official board portals (cbse.gov.in, bseh.org.in, biharboardonline.bihar.gov.in, dhsekerala.gov.in) — no copyrighted files stored or copied.
- Prisma schema (prisma/schema.prisma): Board, ClassLevel, Subject, Chapter, Note, Paper, Question, GenLog, SiteStat. Pushed to SQLite via `bun run db:push`.
- Seeded (prisma/seed.ts): 4 boards, 4 classes, 22 subjects, 238 chapters (real NCERT chapter names), 8 hand-written original revision notes, 41 original MCQs, 492 paper metadata entries (2021-2025 × 4 boards × all subjects + CBSE official sample papers).
- Built `src/lib/ai.ts` (backend-only, z-ai-web-dev-sdk): generateNote() and generateQuestions() with strict "original wording only" system prompts, JSON extraction + validation + retry. Never used on client.
- Built automation engine:
  - `src/lib/daily-job.ts`: runDailyJob() — creates up to 3 missing chapter notes, 10 fresh MCQs for a rotating subject, refreshes Question-of-the-Day, logs to GenLog. Guarded against double-run.
  - `src/lib/scheduler.ts` + `src/instrumentation.ts`: node-cron job at 03:05 IST daily (timezone Asia/Kolkata) + catch-up on server boot if today's run missing.
  - `POST/GET /api/cron/daily` endpoint for external cron services (supports CRON_SECRET, ?force=1).
- API routes: /api/structure, /api/subjects, /api/notes, /api/notes/generate (on-demand AI note), /api/papers, /api/questions, /api/questions/generate (on-demand AI quiz), /api/search, /api/stats, /api/automation (live self-maintenance status).
- Frontend (single-page, client-side views on / route): Home (hero with AI-generated illustration, live counters, Daily Challenge QOTD, board cards, Fresh This Week, features, FAQ), Study Material (class→subject→chapter→markdown note reader with styled renderer, search, per-chapter "Generate with AI" button), PYQs (board cards, class filters, year pills linking to official portals, copyright notice banner), Practice (quiz engine: instant check, explanation, progress, score screen + answer review, on-demand AI question generation for empty subjects), About (live Self-Maintenance Engine dashboard with logs/coverage/"Run update now", Copyright & Content Policy).
- AdSense readiness: src/config/site.ts (NEXT_PUBLIC_ADSENSE_CLIENT_ID / ADSENSE_PUB_ID), AdSlot component (real <ins class="adsbygoogle"> when configured, reserved-space placeholder otherwise to avoid CLS), conditional AdSense script in layout, /ads.txt route, SEO metadata (keywords, OG, twitter, robots), robots.txt.
- UI: emerald/amber palette (no blue/indigo), shadcn/ui components, framer-motion transitions, mobile-first responsive (hamburger Sheet nav, 390px verified), sticky footer (min-h-screen flex + mt-auto verified in DOM), custom scrollbar (.setu-scroll), 44px+ touch targets.
- Verification (Agent Browser): home render + counters, Daily Challenge answer flow (toast + explanation), class→subject→chapter→note flow, note markdown rendering (fixed duplicate H1 title), search ("trigonometry" hits), PYQ board cards + year links, full quiz flow (start→answer→feedback→result screen 2/5 + review), About automation card ("ran today ✓, +3 notes +10 questions, 67s"), on-demand AI note generation (12.2s, 200), mobile viewport 390px, console/page errors = zero, footer layout contract verified.
- Automation confirmed live: catch-up job ran on boot, created +3 AI notes +10 AI questions (GenLog success); totals grew from 8→12 notes, 41→51 questions automatically.
- Lint clean (bun run lint), dev server 200 on all routes.

Stage Summary:
- A production-ready, AdSense-monetizable, copyright-safe study site is live on / with zero manual maintenance: 3 new AI notes + 10 new MCQs appear daily at 03:05 IST automatically (and on every server boot if the day's run is missing; also triggerable via /api/cron/daily for external cron or the "Run update now" button).
- To go live in production, owner only needs to: set NEXT_PUBLIC_ADSENSE_CLIENT_ID + ADSENSE_PUB_ID in .env after AdSense approval, update SITE.url/contactEmail in src/config/site.ts, and (optionally) point an external cron (e.g. cron-job.org) at /api/cron/daily with CRON_SECRET for redundancy.
- Artifacts: prisma/schema.prisma, prisma/seed.ts, src/lib/{ai,daily-job,scheduler,types,db}.ts, src/instrumentation.ts, src/config/site.ts, 11 API route files, 8 site components, src/app/{page,layout}.tsx, /ads.txt, public/hero-students.png (AI-generated), public/robots.txt.

---
Task ID: 2
Agent: Z.ai Code (main)
Task: Full SEO upgrade — best-in-class SEO, school names of Noida/Delhi/Haryana/Kerala/Bihar schools as keywords, complete SEO-friendliness.

Work Log:
- Created src/config/seo.ts: SEO engine with REGIONS database — 103 real school names across 5 regions (Noida & Greater Noida 22, Delhi 24, Haryana 20, Kerala 19, Bihar 18), master SEO_KEYWORDS list (160 entries: class/pyq/board/region generics + all school names + long-tail combos), FAQS shared array, buildJsonLd() structured-data builder.
- layout.tsx: full metadata overhaul — keyword-rich title/description with school names, 160-keyword meta, canonical + hreflang (en-IN), OpenGraph with hero image + countryName + locale en_IN, Twitter large card, robots with googleBot max-image-preview:large / max-snippet:-1, appleWebApp, geo.region/geo.placename meta, optional google-site-verification via env, html lang="en-IN", JSON-LD <script> in head.
- JSON-LD @graph (8 nodes, validated): EducationalOrganization (areaServed: Noida/Greater Noida/New Delhi/Haryana/Bihar/Kerala, knowsAbout, sameAs → board sites), WebSite + SearchAction (?s={query}), WebPage, FAQPage (6 Q/A matching visible FAQ exactly), 4× Course (Class 9-12, isAccessibleForFree, provider).
- New app/robots.ts (absolute sitemap URL, Host, /api/ disallowed; deleted static public/robots.txt), app/sitemap.xml (daily changefreq, priority 1), app/manifest.webmanifest (education category, en-IN, logo icon).
- New visible SEO section: src/components/site/schools-section.tsx — "100+ Schools Across Noida, Delhi, Haryana, Kerala & Bihar — Covered" with 5 region tabs (counts), live school search filter, school name badges (crawlable text), scroll area, non-affiliation disclaimer. Added to homepage between features and FAQ.
- home-view.tsx: FAQ now renders shared FAQS from config (visible text ≡ FAQPage schema), anchor ids (top/classes/features/faq) with scroll-mt-24.
- header.tsx: added "Schools" nav item → home + smooth-scroll to #schools.
- footer.tsx: keyword-rich "Serving students in Noida · Greater Noida · Delhi · Gurugram · Faridabad · Sonipat · Patna · Gaya · Muzaffarpur · Thiruvananthapuram · Kochi · Kozhikode" line + anchor links /#classes /#schools /#faq.
- page.tsx: SearchAction support — /?s=<query> opens Study Material with pre-filled search (rAF-based to satisfy react-hooks lint); SEO-rich <noscript> fallback with core content + anchors for no-JS crawlers.
- study-view.tsx: new initialQuery prop for ?s= flow.
- Verification: lint clean; curl-validated robots.txt/sitemap.xml/manifest.webmanifest; JSON-LD parses (8 graph nodes); 160 keywords (110 school-related) in meta; canonical present. Agent Browser: title ✓, zero page errors, Schools section render ✓, Delhi tab 24 schools + DPS R.K. Puram ✓, search "dps" → 4 DPS schools ✓, Kerala KV Pattom ✓, Bihar Don Bosco ✓, /?s=trigonometry → study view pre-searched + /api/search 200 ✓, header Schools nav scroll ✓, footer anchor ✓, mobile 390px footer/hero ✓, desktop screenshot ✓, sticky footer ✓.

Stage Summary:
- Site is now fully SEO-optimized: 160 keywords (incl. 103 real school names), complete JSON-LD graph (rich-result eligible), dynamic sitemap/robots/manifest, canonical, geo signals, crawlable school directory content, SearchAction site-search flow, noscript fallback.
- After deployment: set NEXT_PUBLIC_SITE_URL to the real domain (robots/sitemap/canonical/JSON-LD all derive from it), optionally add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION for Search Console, then submit /sitemap.xml.
- Artifacts: src/config/seo.ts, src/components/site/schools-section.tsx, src/app/{robots,sitemap,manifest}.ts, updated layout/page/home-view/study-view/header/footer.
