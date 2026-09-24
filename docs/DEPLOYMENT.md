# Deployment Notes

## Localhost Auth Testing

Google Auth can be tested on localhost through Supabase.

In Google Cloud Console, add the Supabase callback URL:

```text
https://YOUR_PROJECT.supabase.co/auth/v1/callback
```

In Supabase Authentication URL Configuration, allow:

```text
http://localhost:3000
http://localhost:3000/
```

Then add `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Restart the local server after changing env vars.

## Vercel

Add the same Supabase public variables in Vercel project settings. Add the Vercel production and preview URLs to Supabase redirect allow-list.

Example:

```text
https://YOUR-VERCEL-PROJECT.vercel.app
https://YOUR-VERCEL-PROJECT.vercel.app/
```

The MVP generated report is local and does not require provider secrets. For production AI-generated reports, prompt each app user or tenant to connect or enter their chosen provider key, then store secrets only as server-side environment variables or approved secret records:

```bash
OPENAI_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
```

Browser code should never read these secret keys. Report generation should be handled by API routes or server actions.

The MVP Agent Ops screen is local and deterministic. It demonstrates orchestrator delegation, assessment blueprint review, AI concept scouting, AI Watch drafting, training/course discovery, assessment-item generation, stimulus/artifact improvement, feedback analysis, psychometric monitoring, data-quality monitoring, localization QA, report UX review, framework alignment, reviewer/QA gates, activity reports, and a safety cut for repeated draft loops. Production agent workflows should move behind server-side routes, scheduled jobs, durable queues, persisted run state, retry counts, draft artifacts, rejected outputs, source records, course freshness checks, cost telemetry, promotion states, and admin approvals before any content is published.

Production agent proposal states should be:

```text
draft -> reviewed -> pilot-ready -> pilot-tested -> approved -> published -> monitored
```

The local `pnpm crawl:training` command is the first real Playwright crawler prototype for the Training and Course Scout. It writes review reports to `.agent-drafts/` and should remain an operator/admin testing command until production source policies, robots/terms review, database persistence, and approval workflows are implemented.

## Database Setup

Run `supabase-schema.sql` in Supabase SQL editor for the MVP tables:

- `user_profiles`
- `assessment_sessions`

The schema includes basic user-owned RLS policies. Before production, add admin-role policies, tenant scoping, audit events, and anonymized analytics views.

The target identity and tenant model is defined in [B2C, B2B, and User Administration Specification](B2C_B2B_USER_ADMINISTRATION.md). Production deployment must support personal workspaces, organizations, memberships, granular permissions, teams, invitations, campaigns, result-sharing consent, seats/entitlements, support-access grants, and append-only audit events. RLS tests must prove that personal results are not automatically exposed after organization membership and that cross-tenant identifiers fail closed.

The legal go-live gate is defined in [Legal, Privacy, PDPA, and Terms Requirements](LEGAL_PRIVACY_PDPA_TERMS.md). Deployment must not enable public multi-user processing until reviewed Thai/English notices and Terms, policy acceptance, cookie blocking/preferences, rights and deletion workflows, retention jobs, DPA/controller mapping, subprocessor and transfer controls, breach response, and legal-document versioning are operational.

Translation workloads must also pass the [Translation and Routing Go-live Checklist](TRANSLATION_ROUTING_GO_LIVE_CHECKLIST.md). Production routing runs server-side through a deterministic, versioned policy service with approved providers, fallbacks, cache isolation, budgets, audit reason codes, quality evidence, and human-review gates. Browser page translation and uncontracted research APIs are not production routes.

## Admin Dashboard

The current admin dashboard reads local MVP logs and includes a preview gate. Production requirements:

- Supabase Auth admin role claims
- RLS-protected admin analytics views
- organization/tenant scoping
- privacy-preserving aggregate reporting
- audit logging for report access and exports

## Production Analytics Checklist

The MVP already captures useful local telemetry, but production analysis should not depend on one browser/device. Before launch, implement:

- Server-side event tables for assessment starts, question views, question answers, per-question feedback, artifact opens/zooms, mandatory completion, continuation choices, report views, report-interest clicks, end-of-assessment survey responses, score logs, profile signals, and supervised agent decisions.
- Anonymized aggregate views for item performance, distractor selection, time spent, hesitation, artifact readability, unclear/useful feedback, competency coverage, domain coverage, persona routing, score distribution, cohort benchmarks, leaderboard eligibility, abandonment, continuation conversion, and report engagement.
- Question/rubric/artifact/scoring version IDs on every answer record so later analysis can explain which content and scoring model produced each score.
- Data governance controls: consent copy, privacy-safe identifiers, separation of identity from response evidence, retention windows, deletion/export workflows, tenant isolation, row-level security, admin audit logs, and dashboard access review.
- Calibration jobs that estimate difficulty, discrimination, guessing, partial-credit behavior, SEM, confidence, and score-band thresholds from pilot data before scores are used for certification, hiring, promotion, or other high-stakes decisions.
- Human-in-the-loop approval for every agent proposal that changes scored questions, artifacts, answer keys, rubrics, scoring parameters, profile ontology, survey wording, learning recommendations, or framework mappings.
