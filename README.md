# Mosh Rooms

Website for **Mosh Rooms**, Dubai's first alternative hip-hop, emo rap & cloud rap night.

**Live:** [moshroomsdxb.vercel.app](https://moshroomsdxb.vercel.app) · **Dashboard:** `/admin`

## Stack

- **Next.js 16** (App Router) + **Tailwind CSS 4** + TypeScript
- **Payload CMS 3**: dashboard at `/admin`
- **Neon Postgres**: content and logins
- **Vercel Blob**: uploaded photos and videos
- Hosted on **Vercel**

## Run locally

```bash
npm install
npm run db:local   # local Postgres (first run downloads it)
npm run dev        # http://localhost:3000
```

`.env.local`:

```
DATABASE_URL=postgres://mosh:mosh@localhost:54329/moshrooms
PAYLOAD_SECRET=any-long-random-string
```

Without a Blob token, uploads are saved to `./media`.

## Environment variables (Vercel)

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store (must be **public**) |
| `PAYLOAD_SECRET` | Long random string, signs logins |
| `NEXT_PUBLIC_SITE_URL` | Optional, final domain for SEO |

## Dashboard

The venue edits the site at `/admin` with no code and no redeploy.

| Section | Controls |
| --- | --- |
| Photos & videos | Upload library |
| Album | Photos in the 3 frames and the chain strip |
| Hero video | The looping video in the top frame |
| Text & links | Tagline, intro, venue, next date, Instagram |

- First visit creates the admin account. Then click **Import current website content** once.
- Saving rebuilds the home page in seconds.
- Anything left empty falls back to the defaults in `src/content/site.ts`.

## Project structure

```
src/
  app/(frontend)/    site pages + globals.css
  app/(payload)/     dashboard routes
  components/        hero, intro, album, events, footer
  content/site.ts    default text and photos
  payload/           collections, globals, hooks
  migrations/        database migrations
public/              images and video
```


