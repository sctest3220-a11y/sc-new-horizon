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
AI_PROVIDER=
OPENAI_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
```

The current report flow is mostly rule-based in the client MVP. Production AI-generated reports should run in server-side routes only, using secret Vercel environment variables. Do not expose LLM API keys in browser code.

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
```

## Current MVP Limitations

- Psychometric/IRT scoring is seeded and demonstrative, not yet calibrated from a large pilot sample
- Admin auth is a preview surface until Supabase role claims and RLS policies are finalized
- Local browser storage is still used as the primary MVP demo store when Supabase is not configured
- AI Watch is a curated/static MVP feed until the scheduled trend-refresh agent is backed by persistent content storage
- AI-generated premium reports should be moved to server routes before production use

