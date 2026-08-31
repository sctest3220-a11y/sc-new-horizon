-- New Horizon MVP auth/profile persistence draft.
-- Run in Supabase SQL editor after enabling Google and email auth.

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  provider text,
  provider_id text,
  local_profile_id text,
  profile_context text,
  profile_tags text[] not null default '{}',
  profile_survey jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_sessions (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  group_key text not null,
  group_label text not null,
  mode text not null,
  audience text,
  function_track text,
  industry_track text,
  executive_role text,
  domain_scores jsonb not null default '{}'::jsonb,
  competency_scores jsonb not null default '{}'::jsonb,
  evidence_mode_scores jsonb not null default '{}'::jsonb,
  overall integer not null,
  profile_tags text[] not null default '{}',
  question_signals jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.assessment_sessions enable row level security;

create policy "Users can read own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can upsert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can read own assessment sessions"
  on public.assessment_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own assessment sessions"
  on public.assessment_sessions for insert
  with check (auth.uid() = user_id);

-- Production admin analytics should use dedicated admin role claims,
-- tenant scoping, anonymized views, and audited server-side access.
