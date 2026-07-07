insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  209715200,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read site media" on storage.objects;
create policy "public can read site media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-media');

drop policy if exists "admins can upload site media" on storage.objects;
create policy "admins can upload site media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "admins can update site media" on storage.objects;
create policy "admins can update site media"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "admins can delete site media" on storage.objects;
create policy "admins can delete site media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-media' and public.is_admin());

