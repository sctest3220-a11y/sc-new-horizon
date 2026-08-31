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

For AI-generated reports, add provider secrets only as server-side environment variables:

```bash
OPENAI_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
```

Browser code should never read these secret keys. Report generation should be handled by API routes or server actions.

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

