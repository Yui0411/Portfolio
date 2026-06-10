-- ============================================================
-- Migration: certificates no longer require a date.
-- Run once in: Supabase dashboard → SQL Editor → New query → Run.
-- Makes issued_date optional so certificates can be saved without one.
-- ============================================================

alter table public.certificates
  alter column issued_date drop not null;
