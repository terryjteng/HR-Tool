-- HR Tool storage: actions (shared with EA), signing documents, onboarding
-- sessions, and small settings (collection 'kv'). Run once in the Supabase SQL
-- editor of the project the Scheduler uses.
--
-- RLS is on with no policies, so only the service role key (server-side, in
-- the HR Tool's Vercel env) can read or write these rows.

create table if not exists public.hr_records (
  collection text        not null,
  id         text        not null,
  token      text,
  data       jsonb       not null,
  created_at timestamptz not null default now(),
  primary key (collection, id)
);

create unique index if not exists hr_records_token_idx
  on public.hr_records (collection, token) where token is not null;

create index if not exists hr_records_created_idx
  on public.hr_records (collection, created_at desc);

alter table public.hr_records enable row level security;
