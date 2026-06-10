-- ============================================================
-- Portfolio — Profile (singleton) table
-- Holds ONE row of editable site content for the home hero
-- (and, optionally, the header contact links).
-- Run in: Supabase dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run.
-- ============================================================

create table if not exists public.profile (
  id           smallint primary key default 1,
  name         text not null default '',
  title        text not null default '',   -- e.g. "Full-Stack Developer"
  bio          text not null default '',   -- the welcome message
  email        text,
  linkedin_url text,
  github_url   text,
  updated_at   timestamptz not null default now(),
  -- Enforce a single row: id can only ever be 1.
  constraint profile_singleton check (id = 1)
);

alter table public.profile enable row level security;

-- Anyone can read the profile (it's public site content).
drop policy if exists "profile public read" on public.profile;
create policy "profile public read"
  on public.profile for select
  using (true);

-- Only the logged-in admin can edit it.
drop policy if exists "profile admin write" on public.profile;
create policy "profile admin write"
  on public.profile for all
  to authenticated
  using (true) with check (true);

-- Make sure the single row exists so the editor always has something to update.
insert into public.profile (id) values (1) on conflict (id) do nothing;
