-- ============================================================
-- Add visitor enrichment columns to `analytics` for bot-vs-human analysis.
-- Run in: Supabase dashboard → SQL Editor → New query → Run.
-- Existing rows just get NULLs for the new columns.
-- ============================================================

alter table public.analytics add column if not exists user_agent text;
alter table public.analytics add column if not exists ip         text;
alter table public.analytics add column if not exists country    text;
alter table public.analytics add column if not exists isp        text;
