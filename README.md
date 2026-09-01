# SC Horizon / New Horizon

Adaptive AI readiness assessment MVP for practical AI literacy, role/function diagnostics, executive assessment, learning paths, and AI trend awareness.

## What It Includes

- Public landing page for the New Horizon assessment platform
- Free, premium, executive, and function-aware assessment flows
- Adaptive question routing with visible difficulty and psychometric/IRT-style indicators
- Multimodal and artifact-based question bank with realistic screenshots, invoices, dashboards, logs, source excerpts, workflows, and fraud/media-review tasks
- Domain and competency scoring across D1-D6
- Radar graph with user, group average, and target profile comparison
- Domain drilldown into competency scores
- Continue-assessment option after mandatory 12/20-question routes when confidence or coverage is weak
- User profile builder and signal logging
- Registered user dashboard with profile, progress, recommendations, learning paths, and personalized AI Watch
- Admin dashboard preview for cohort, function, role, domain, competency, difficulty, item-format, and trend analysis
- Admin Agent Ops preview with supervised multi-agent workflow simulation, activity reports, draft outputs, and safety-cut handling for repeated loops
- Learn by Doing labs for prompt repair, proof check, media check, workflow lab, trust room, task ownership, and next action
- Supabase schema draft for user profiles and assessment sessions

## Tech Stack

- Vinext / Next-style React app
- React 19
- TypeScript
- CSS modules through `app/globals.css`
- Supabase Auth/Postgres planned for persistence
- Vercel-compatible deployment path

## Local Development

```bash
pnpm install
pnpm dev
```

Production-style local run:

```bash
pnpm build
pnpm start
```

Open:

```text
http://localhost:3000/
```

## Google and Email Auth

The MVP includes a browser-side Supabase auth bridge for Google OAuth and email magic links. Add these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

In Supabase:

- Enable Google provider under Authentication providers
- Add Google OAuth client id/secret
- Add local and deployed URLs to Supabase redirect allow-list
- Run `supabase-schema.sql` in the Supabase SQL editor

Google login seeds basic identity only: Supabase user id, email, display name, avatar URL, provider, and provider id. New Horizon still collects role, function, tools, AI usage, learning interests, and assessment behavior through its own profile builder.

## Vercel Deployment

Recommended Vercel environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The MVP report flow now includes a generated detailed report panel, but it is still produced locally from assessment scores, competency evidence, learning catalogs, and profile signals. It does not require an API key and does not call an external AI provider from browser code.

The MVP Agent Ops flow is also local and deterministic. It simulates an orchestrator, AI concepts scout, AI newsfeed agent, training and course scout, assessment item generator, and reviewer/QA agent. The simulation demonstrates manual runs, activity logs, rejected duplicate output, admin-review queues, learning-catalog recommendations, and a safety cut when a draft loop repeats. It does not crawl the internet, publish content, or call an external AI provider.

Production AI-generated reports should run in server-side routes only. At that stage, prompt each app user or tenant to connect or enter their chosen AI provider key, and store secrets only in approved server-side infrastructure. Do not expose LLM API keys in browser code.

## Supabase Tables

See:

- `supabase-schema.sql`

Draft tables:

- `user_profiles`
- `assessment_sessions`

Production should add:

- item responses
- theta estimates
- profile signals
- learning path events
- admin role claims
- tenant/organization tables
- anonymized analytics views

## Scripts

```bash
pnpm lint
pnpm build
pnpm start
pnpm crawl:training
```

`pnpm crawl:training` runs the local Playwright Training and Course Scout against an allow-list of public AI learning sources and writes JSON/Markdown review reports to `.agent-drafts/`. It is intended for admin review testing only; nothing is published automatically.

## Current MVP Limitations

- Psychometric/IRT scoring is seeded and demonstrative, not yet calibrated from a large pilot sample
- Admin auth is a preview surface until Supabase role claims and RLS policies are finalized
- Local browser storage is still used as the primary MVP demo store when Supabase is not configured
- AI Watch is a curated/static MVP feed until the scheduled trend-refresh agent is backed by persistent content storage
- MVP generated reports are local score/profile summaries; production AI-generated reports should move to server routes and ask users or tenants for their provider API key
- MVP Agent Ops is a deterministic workflow simulation, except the optional `pnpm crawl:training` command can run a real Playwright crawl for admin review; production agents need durable cloud jobs, source connectors, persisted run state, retry limits, audit logs, course/source freshness checks, robots/terms review, and human approval gates
