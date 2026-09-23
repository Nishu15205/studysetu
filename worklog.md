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
