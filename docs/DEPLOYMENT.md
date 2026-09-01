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

The MVP Agent Ops screen is local and deterministic. It demonstrates orchestrator delegation, AI concept scouting, AI Watch drafting, training/course discovery, assessment-item generation, reviewer/QA gates, activity reports, and a safety cut for repeated draft loops. Production agent workflows should move behind server-side routes, scheduled jobs, durable queues, persisted run state, retry counts, draft artifacts, rejected outputs, source records, course freshness checks, cost telemetry, and admin approvals before any content is published.

The local `pnpm crawl:training` command is the first real Playwright crawler prototype for the Training and Course Scout. It writes review reports to `.agent-drafts/` and should remain an operator/admin testing command until production source policies, robots/terms review, database persistence, and approval workflows are implemented.

## Database Setup

Run `supabase-schema.sql` in Supabase SQL editor for the MVP tables:

- `user_profiles`
- `assessment_sessions`

The schema includes basic user-owned RLS policies. Before production, add admin-role policies, tenant scoping, audit events, and anonymized analytics views.

## Admin Dashboard

The current admin dashboard reads local MVP logs and includes a preview gate. Production requirements:

- Supabase Auth admin role claims
- RLS-protected admin analytics views
- organization/tenant scoping
- privacy-preserving aggregate reporting
- audit logging for report access and exports
