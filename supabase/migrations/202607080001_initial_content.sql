create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  page_key text not null check (page_key in (
    'useful-websites',
    'prompt-collection',
    'skill-workflow',
    'photography',
    'agent-guide'
  )),
  title text not null,
  description text not null default '',
  cover_url text,
  link_url text,
  category text,
  tags text[] not null default '{}',
  extra jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile (
  id boolean primary key default true check (id = true),
  nickname text not null default '丰胖子',
  avatar_url text,
  real_photo_url text,
  intro text not null default '',
  email text,
  contacts jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists recommendations_set_updated_at on public.recommendations;
create trigger recommendations_set_updated_at
before update on public.recommendations
for each row execute function public.set_updated_at();

drop trigger if exists profile_set_updated_at on public.profile;
create trigger profile_set_updated_at
before update on public.profile
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create index if not exists recommendations_page_order_idx
on public.recommendations(page_key, is_published, sort_order, created_at);

alter table public.admin_users enable row level security;
alter table public.recommendations enable row level security;
alter table public.profile enable row level security;
alter table public.site_settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

drop policy if exists "admin users can read self" on public.admin_users;
create policy "admin users can read self"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "public can read published recommendations" on public.recommendations;
create policy "public can read published recommendations"
on public.recommendations
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "admins can manage recommendations" on public.recommendations;
create policy "admins can manage recommendations"
on public.recommendations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read profile" on public.profile;
create policy "public can read profile"
on public.profile
for select
to anon, authenticated
using (true);

drop policy if exists "admins can manage profile" on public.profile;
create policy "admins can manage profile"
on public.profile
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "admins can manage site settings" on public.site_settings;
create policy "admins can manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.profile (id, nickname, intro, email, contacts, social_links)
values (
  true,
  '丰胖子',
  'FY Digital Life profile.',
  'fengyudashuaige@outlook.com',
  '[]'::jsonb,
  '[]'::jsonb
)
on conflict (id) do nothing;

insert into public.site_settings (key, value)
values
  ('site', '{"title":"FY Digital Life"}'::jsonb),
  ('storage', '{"bucket":"site-media"}'::jsonb)
on conflict (key) do nothing;

