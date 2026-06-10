-- ============================================================
-- Portfolio — Storage bucket policies
-- Run AFTER you create the bucket in the dashboard
-- (Storage → New bucket): a single bucket named `images`,
-- set to PUBLIC so images load on the public site.
--
-- Inside the bucket we organise files into folders by prefix:
--   images/projects/...      project screenshots
--   images/certificates/...  certificate images
--
-- This file adds the access policies on storage.objects:
--   - anyone can READ (public images)
--   - only authenticated admin can UPLOAD / UPDATE / DELETE
-- ============================================================

drop policy if exists "images public read" on storage.objects;
create policy "images public read"
  on storage.objects for select
  using (bucket_id = 'images');

drop policy if exists "images admin write" on storage.objects;
create policy "images admin write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'images')
  with check (bucket_id = 'images');
