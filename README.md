# Mosh Rooms

Website for **Mosh Rooms** — Dubai's first alternative hip-hop, emo rap & cloud rap night.
Built from the Figma wireframes with **Next.js 16 (App Router) + Tailwind CSS 4 + TypeScript**, with a **Payload CMS** dashboard at `/admin` (Neon Postgres + Vercel Blob).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the build
npm run lint
```

## Dashboard (Payload CMS) — `/admin`

The venue edits the site at **`/admin`** — no code, no redeploy. Built with [Payload](https://payloadcms.com) 3, living inside this Next.js app.

| Section | What it controls |
| --- | --- |
| **Photos & videos** | Upload library (stored in Vercel Blob). Each photo needs a short description. |
| **Album** | Which photo hangs in each of the 3 frames, and the photos in the chainsaw-chain strip (drag to reorder). |
| **Hero video** | The looping video in the top frame. Upload a vertical phone video (MP4, < 50 MB) — on computers the sides are filled with a blurred copy automatically. |
| **Text & links** | Tagline, venue, "next date" text, Instagram link + handle. |
| **Team** | Who can log in. |

- Saving anything rebuilds the home page within seconds (`revalidatePath` hooks in `src/payload/hooks/revalidate.ts`).
- Anything left empty falls back to the built-in defaults in `src/content/site.ts`, and if the database is unreachable the site still renders with those defaults.
- First visit to `/admin` on a fresh database asks you to **create the first account** — do this right after the first deploy. Then click **“Import current website content”** on the dashboard home once, to copy the current photos, video and text in.
- Uploads go **directly from the browser to Blob** (`clientUploads`), so big files skip Vercel's request-size limit; files are served straight from Blob's CDN.

### Services / environment variables (Vercel)

| Variable | Set by |
| --- | --- |
| `DATABASE_URL` (or `POSTGRES_URL`) | Neon integration (Vercel → Storage) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store connected to the project |
| `PAYLOAD_SECRET` | You — a long random string (signs logins) |
| `NEXT_PUBLIC_SITE_URL` | Optional — final domain, for SEO/sitemap |

Database tables are created/updated automatically on deploy (`prodMigrations`, migrations in `src/migrations/`). After changing collections/globals, create a new migration locally (`npm run migrate:create`) and commit it.

### Local development

```bash
npm run db:local            # local Postgres on :54329 (first run downloads it)
# .env.local:
#   DATABASE_URL=postgres://mosh:mosh@localhost:54329/moshrooms
#   PAYLOAD_SECRET=any-long-random-string
npm run dev                 # site: http://localhost:3000, dashboard: /admin
```
Without `BLOB_READ_WRITE_TOKEN`, uploads are saved to `./media` locally.

## Edit content (no coding needed)

Day to day, use the dashboard above. **`src/content/site.ts`** holds the *defaults* (used for anything not set in the dashboard):

| What | Where |
| --- | --- |
| Name, tagline, description (SEO) | `site.name`, `site.tagline`, `site.description` |
| Venue | `site.venue` |
| Instagram profile (Events section, footer, SEO) | `site.instagram`, `site.instagramHandle` |
| Photos + alt text | `photos` array — drop files in `public/images/photos/` |
| Which photo sits in each hanging frame | `album.leftFrame`, `album.middleFrame`, `album.chainsawFrame` |
| Photos in the chainsaw-chain carousel | `album.strip` (currently a **test set**: every photo twice) |

Use photos at least **800px tall** for the big frames.

## How it works

- **Sections fit one screen.** The hero and album are the 1440×1024 Figma frames, positioned in percentages on a "stage" that scales to fit *both* the screen's width and height (`.stage-section` / `.stage` in `globals.css`). The background fills any leftover space.
- **Photos inside frames.** The frames' black windows were cut out, and each photo sits *behind* its frame, tilted to match it and clipped to the window's exact shape with a CSS mask (`src/lib/frames.ts`, `public/images/masks/`). The torn borders overlap the photo like a real print.
- **Chainsaw-chain carousel** (`src/components/chain-carousel.tsx`). Infinite photo loop inside the chain. The straight runs of the chain are seamless tiles that move as it scrolls — top run with the photos, bottom run the other way. It auto-runs; scroll wheel, trackpad, swipe, drag, the arrow buttons and keyboard arrows all move it. Pauses on hover/focus; stops for reduced-motion users.
- **Hero video** (`src/components/hero-video.tsx`, `public/video/hero.mp4`). Loops inside the hero frame, behind the frame border. Starts muted (browsers block autoplay with sound); the *Sound on/off* button toggles audio and there's a pause button. Pauses when scrolled off screen; no autoplay for reduced-motion users. The vertical phone clip was re-rendered to the frame's wide shape — full clip in the centre over a blurred copy of itself. To swap it, replace `hero.mp4` + `hero-poster.jpg` (ideally re-render the same way).
- **Dancing ghost** (Events section, `src/components/ghost-dance.tsx`). Transparent video in two formats because browsers differ: VP9 WebM with alpha (`public/video/ghost-dance.webm`) for Chrome/Edge/Firefox/Android, animated WebP (`public/images/ghost-dance.webp`) for Safari and all iOS browsers, which can't play WebM transparency. Reduced-motion users get a still frame.
- **Lightbox.** Every photo opens in a full-screen viewer (native `<dialog>`, arrow keys, Esc).
- **Phones** (< 768px) get their own layouts instead of the scaled-down collage: a full-screen portrait hero (logo + nav, the *vertical* video `hero-vertical.mp4` in a hanging frame, HIGH SØ down the side) and a stacked album. The lightbox supports swipe left/right (and swipe down to close) with large thumb-height arrows.

## SEO / production

- Metadata, Open Graph + Twitter images (`src/app/opengraph-image.jpg`), favicon/app icons, web manifest
- `robots.txt` and `sitemap.xml` (with image sitemap) generated from `src/app/robots.ts` / `sitemap.ts`
- JSON-LD organisation data, custom 404, security headers, `next/image` (AVIF/WebP, responsive sizes)
- Self-hosted fonts (Jolly Lodger — SIL OFL, Special Elite — Apache 2.0) in `src/fonts/`
- Accessible: semantic sections, alt text, keyboard support, visible focus, `prefers-reduced-motion`

## Deploy (Vercel)

1. Import this repo at [vercel.com/new](https://vercel.com/new) — framework is detected automatically.
2. Add env var **`NEXT_PUBLIC_SITE_URL`** = the final domain (e.g. `https://moshrooms.ae`). It's used for canonical URLs, Open Graph, sitemap and robots.
3. Add the custom domain under *Project → Settings → Domains*.

## Project structure

```
src/
  app/            layout, page, metadata routes (robots, sitemap, manifest, icons, OG), 404, globals.css
  components/     hero, album, chain-carousel, framed-photo, gallery (lightbox), events, footer, stage helpers
  content/site.ts all editable content
  lib/            stage + frame geometry
  fonts/          self-hosted fonts
public/images/    artwork, frames, masks, photos
```
