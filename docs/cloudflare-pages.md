# Cloudflare Pages Deployment

## Build Settings

- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: `20`
- Production environment variable: `MEDIA_BASE_URL`

## Preflight Check

Run this before deploying locally:

```bash
MEDIA_BASE_URL="https://wwobcjkakedxyruxulfj.supabase.co/storage/v1/object/public/site-media" npm run build
npm run deploy:check
```

The deploy check fails when `dist/` contains files over 25 MiB. The current large videos have already been uploaded to Supabase Storage, so Cloudflare Pages must build with `MEDIA_BASE_URL` set.

Cloudflare Pages production environment variable:

```text
MEDIA_BASE_URL=https://wwobcjkakedxyruxulfj.supabase.co/storage/v1/object/public/site-media
```

The uploaded object keys must match the local paths below, for example:

```text
site-media/assets/custom/photo-hero-234.mp4
```

When `MEDIA_BASE_URL` is set, the build rewrites video references in `dist/` and removes the local oversized files from `dist/`. Local development still uses `public/` and remains unchanged.

## Uploaded External Media

The current site uses Supabase `site-media` for large videos during production builds.

See `docs/supabase-setup.md` for the database, Auth, and Storage setup steps.

Uploaded object keys:

- `assets/custom/photo-hero-234.mp4`
- `assets/custom/work-card-prompt-web.mp4`
- `assets/custom/work-card-skill-web.mp4`
- `assets/custom/work-card-agent-small-web.mp4` (45.6 MiB)
- `assets/custom/home-hero-user-video.mp4` (39.5 MiB)
- `assets/framerusercontent.com/assets/raU02RTJ8fj9IFxmN9SKwzHCGo.mp4` (34.3 MiB)
- `assets/framerusercontent.com/assets/8A1rHrUjomCRzLZTKOfW0iXe0E0.mp4` (30.2 MiB)
- `assets/custom/work-card-photo-web.mp4` (29.0 MiB)

## Custom Domain Prep

Use Cloudflare as DNS after buying the domain. Bind the domain in Cloudflare Pages, then point the DNS record to the Pages project as instructed by Cloudflare.
