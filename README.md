# Mosh Rooms

Website for **Mosh Rooms**, Dubai's first alternative hip-hop, emo rap & cloud rap night.

**Live:** [moshroomsdxb.vercel.app](https://moshroomsdxb.vercel.app) · **Dashboard:** `/admin`

## Stack

- **Next.js 16** (App Router) + **Tailwind CSS 4** + TypeScript
- **Payload CMS 3**: dashboard at `/admin`
- **Neon Postgres**: content and logins
- **Vercel Blob**: uploaded photos and videos
- Hosted on **Vercel**


## Dashboard

The venue edits the site at `/admin` with no code and no redeploy.

| Section | Controls |
| --- | --- |
| Photos & videos | Upload library |
| Album | Photos in the 3 frames and the chain strip |
| Hero video | The looping video in the top frame |
| Text & links | Tagline, intro, venue, next date, Instagram |

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


