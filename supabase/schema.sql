-- ============================================================
-- Portfolio — Database schema
-- Run this in the Supabase dashboard: SQL Editor → New query → paste → Run
-- Safe to re-run (idempotent).
-- ============================================================

-- ---------- Tables ----------

create table if not exists public.experience (
  id            uuid primary key default gen_random_uuid(),
  company       text not null,
  role          text not null,
  start_date    date not null,
  end_date      date,                       -- null = current job
  description   text not null default '',
  tech_stack    text[] not null default '{}',
  display_order int  not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  summary       text not null default '',   -- short label for the timeline dot
  description   text not null default '',   -- full detail-panel text
  image_url     text,                       -- Supabase Storage public URL
  tech_stack    text[] not null default '{}',
  live_url      text,
  github_url    text,
  display_order int  not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists public.certificates (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  issuer        text not null,
  issued_date   date,                       -- optional; not shown on the site
  image_url     text,                       -- Supabase Storage public URL
  verify_url    text,
  display_order int  not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.analytics (
  id          bigint generated always as identity primary key,
  project_id  uuid references public.projects(id) on delete set null,
  referrer    text,
  created_at  timestamptz not null default now()
);

-- ---------- Helpful indexes (timeline ordering) ----------

create index if not exists experience_order_idx   on public.experience   (display_order);
create index if not exists projects_order_idx      on public.projects      (display_order);
create index if not exists certificates_order_idx  on public.certificates  (display_order);
create index if not exists analytics_project_idx   on public.analytics     (project_id, created_at);

-- ---------- Row Level Security ----------
-- Public site uses the ANON key → read-only.
-- Admin CMS uses an AUTHENTICATED session → full CRUD.
-- Lambda visit-tracker uses the SERVICE ROLE key → bypasses RLS entirely.

alter table public.experience   enable row level security;
alter table public.projects     enable row level security;
alter table public.certificates enable row level security;
alter table public.analytics    enable row level security;

-- experience: anyone can read; only logged-in admin can write
drop policy if exists "experience public read" on public.experience;
create policy "experience public read"
  on public.experience for select
  using (true);

drop policy if exists "experience admin write" on public.experience;
create policy "experience admin write"
  on public.experience for all
  to authenticated
  using (true) with check (true);

-- projects: public can read ONLY visible rows; admin sees/writes everything
drop policy if exists "projects public read" on public.projects;
create policy "projects public read"
  on public.projects for select
  using (is_visible = true);

drop policy if exists "projects admin all" on public.projects;
create policy "projects admin all"
  on public.projects for all
  to authenticated
  using (true) with check (true);

-- certificates: anyone can read; only admin can write
drop policy if exists "certificates public read" on public.certificates;
create policy "certificates public read"
  on public.certificates for select
  using (true);

drop policy if exists "certificates admin write" on public.certificates;
create policy "certificates admin write"
  on public.certificates for all
  to authenticated
  using (true) with check (true);

-- analytics: no anon access. Writes come from Lambda via service role (bypasses RLS).
-- Admin may read aggregate data.
drop policy if exists "analytics admin read" on public.analytics;
create policy "analytics admin read"
  on public.analytics for select
  to authenticated
  using (true);

-- ---------- Profile (singleton) ----------
-- One row of editable site content (home hero + optional header contact).
-- Also defined standalone in profile.sql.

create table if not exists public.profile (
  id           smallint primary key default 1,
  name         text not null default '',
  title        text not null default '',
  bio          text not null default '',
  email        text,
  linkedin_url text,
  github_url   text,
  updated_at   timestamptz not null default now(),
  constraint profile_singleton check (id = 1)
);

alter table public.profile enable row level security;

drop policy if exists "profile public read" on public.profile;
create policy "profile public read"
  on public.profile for select
  using (true);

drop policy if exists "profile admin write" on public.profile;
create policy "profile admin write"
  on public.profile for all
  to authenticated
  using (true) with check (true);

insert into public.profile (id) values (1) on conflict (id) do nothing;
