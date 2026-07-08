create table if not exists public.content_pages (
  page_key text primary key check (page_key in (
    'useful-websites',
    'prompt-collection',
    'skill-workflow',
    'photography',
    'agent-guide'
  )),
  title text not null,
  intro text not null default '',
  layout_type text not null default 'grid',
  settings jsonb not null default '{}'::jsonb,
  is_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  page_key text not null references public.content_pages(page_key) on delete cascade,
  item_type text not null default 'card',
  title text not null,
  summary text not null default '',
  cover_url text,
  link_url text,
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  layout_variant text not null default 'normal',
  is_published boolean not null default true,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists content_pages_set_updated_at on public.content_pages;
create trigger content_pages_set_updated_at
before update on public.content_pages
for each row execute function public.set_updated_at();

drop trigger if exists content_items_set_updated_at on public.content_items;
create trigger content_items_set_updated_at
before update on public.content_items
for each row execute function public.set_updated_at();

create index if not exists content_items_page_order_idx
on public.content_items(page_key, is_published, sort_order, created_at);

alter table public.content_pages enable row level security;
alter table public.content_items enable row level security;

drop policy if exists "public can read content pages" on public.content_pages;
create policy "public can read content pages"
on public.content_pages
for select
to anon, authenticated
using (is_enabled = true);

drop policy if exists "admins can manage content pages" on public.content_pages;
create policy "admins can manage content pages"
on public.content_pages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read published content items" on public.content_items;
create policy "public can read published content items"
on public.content_items
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "admins can manage content items" on public.content_items;
create policy "admins can manage content items"
on public.content_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.content_pages to anon, authenticated;
grant insert, update, delete on public.content_pages to authenticated;
grant select on public.content_items to anon, authenticated;
grant insert, update, delete on public.content_items to authenticated;

insert into public.content_pages (page_key, title, intro, layout_type, settings)
values
  ('useful-websites', '超级链接宇宙', '数字世界的浩瀚星河里，我们为你打捞那些真正闪光的岛屿。', 'grid', '{"label":"CURATED LINKS"}'::jsonb),
  ('prompt-collection', '提示词宇宙', '收藏文生图、文生视频与图生图提示词。', 'grid', '{"label":"PROMPT COLLECTION"}'::jsonb),
  ('skill-workflow', 'Skill 工具箱', '收藏常用 Skill 与组合工作流。', 'grid', '{"label":"SKILL / WORKFLOW"}'::jsonb),
  ('photography', 'Scenes Held By Light', '一份关于静默画面的私人索引。', 'photo-showcase', '{"label":"PHOTOGRAPHY / PERSONAL WORKS"}'::jsonb),
  ('agent-guide', 'Agent 工具安装教程库', '每张卡片都是一个 Agent 工具入口。', 'paginated-guide', '{"label":"AGENT INSTALL GUIDE","page_size":8}'::jsonb)
on conflict (page_key) do nothing;
