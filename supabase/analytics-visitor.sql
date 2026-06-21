-- ============================================================
-- Repurpose `analytics` for unique-visitor counting.
-- One row per unique visitor_id (deduped by a unique constraint).
-- Run in: Supabase dashboard → SQL Editor → New query → Run.
-- ============================================================

-- project_id is no longer used (we count site visits, not project views).
alter table public.analytics drop column if exists project_id;

-- visitor_id: a random id the browser generates per session.
alter table public.analytics add column if not exists visitor_id text;

-- Uniqueness is what makes "insert-or-ignore" dedupe duplicate check-ins.
create unique index if not exists analytics_visitor_id_key
  on public.analytics (visitor_id);
