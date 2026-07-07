# Supabase Setup

## Create Project

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/migrations/202607080001_initial_content.sql`.
4. Run `supabase/storage-policies.sql`.

## Create Admin User

1. In Supabase Auth, create one user with your admin email.
2. Copy that user's `id`.
3. Run:

```sql
insert into public.admin_users (user_id, email)
values ('YOUR_AUTH_USER_ID', 'YOUR_ADMIN_EMAIL')
on conflict (user_id) do update set email = excluded.email;
```

Only users listed in `public.admin_users` can write content or upload media.

## Storage Bucket

The setup SQL creates a public bucket named `site-media`.

Upload the large videos using these exact object keys:

```text
assets/custom/photo-hero-234.mp4
assets/custom/work-card-prompt-web.mp4
assets/custom/work-card-skill-web.mp4
assets/custom/work-card-agent-small-web.mp4
assets/custom/home-hero-user-video.mp4
assets/framerusercontent.com/assets/raU02RTJ8fj9IFxmN9SKwzHCGo.mp4
assets/framerusercontent.com/assets/8A1rHrUjomCRzLZTKOfW0iXe0E0.mp4
assets/custom/work-card-photo-web.mp4
```

The public media base URL will be:

```text
https://YOUR_PROJECT.supabase.co/storage/v1/object/public/site-media
```

## Local Environment

Copy `.env.example` to `.env.local` when real values are available:

```bash
cp .env.example .env.local
```

Cloudflare Pages production variables:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
MEDIA_BASE_URL
```

## Deploy Build

After uploading media:

```bash
MEDIA_BASE_URL="https://YOUR_PROJECT.supabase.co/storage/v1/object/public/site-media" npm run build
npm run deploy:check
```

`deploy:check` should pass only after the large videos are no longer included in `dist/`.

