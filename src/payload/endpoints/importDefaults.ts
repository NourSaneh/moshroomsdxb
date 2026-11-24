import type { Endpoint, PayloadRequest } from "payload";
import { album as defaultAlbum, photos as defaultPhotos, site } from "@/content/site";

const DEFAULT_VIDEO = { src: "/video/hero-vertical.mp4", alt: "Mosh Rooms event recap video", mime: "video/mp4" };
const DEFAULT_POSTER = { src: "/video/hero-vertical-poster.jpg", alt: "Mosh Rooms video cover", mime: "image/jpeg" };

async function download(origin: string, src: string) {
  const res = await fetch(new URL(src, origin));
  if (!res.ok) throw new Error(`Could not fetch ${src} (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

async function upload(req: PayloadRequest, origin: string, src: string, alt: string, mimetype: string) {
  const data = await download(origin, src);
  const name = src.split("/").pop() || "file";
  const doc = await req.payload.create({ collection: "media", data: { alt }, file: { data, mimetype, name, size: data.length }, req });
  return doc.id;
}

/**
 * POST /api/import-defaults — one-time copy of the site's built-in photos, video and text into the dashboard.
 * Logged-in users only; refuses if anything has already been uploaded.
 */
export const importDefaults: Endpoint = {
  path: "/import-defaults",
  method: "post",
  handler: async (req) => {
    if (!req.user) return Response.json({ error: "Please log in first." }, { status: 401 });

    const existing = await req.payload.count({ collection: "media", req });
    if (existing.totalDocs > 0) {
      return Response.json({ error: "Photos have already been imported or uploaded — nothing was changed." }, { status: 409 });
    }

    const origin = req.url ? new URL(req.url).origin : process.env.NEXT_PUBLIC_SITE_URL || "";

    // photos (in lightbox order)
    const ids: (number | string)[] = [];
    for (const p of defaultPhotos) ids.push(await upload(req, origin, p.src, p.alt, "image/jpeg"));

    // video + cover
    const videoId = await upload(req, origin, DEFAULT_VIDEO.src, DEFAULT_VIDEO.alt, DEFAULT_VIDEO.mime);
    const posterId = await upload(req, origin, DEFAULT_POSTER.src, DEFAULT_POSTER.alt, DEFAULT_POSTER.mime);

    // the strip: each photo once, in the current order
    const stripOrder = [...new Set(defaultAlbum.strip)];

    await req.payload.updateGlobal({
      slug: "album",
      data: {
        leftFrame: ids[defaultAlbum.leftFrame],
        middleFrame: ids[defaultAlbum.middleFrame],
        chainsawFrame: ids[defaultAlbum.chainsawFrame],
        strip: stripOrder.map((i) => ({ photo: ids[i] })),
      },
      req,
    });
    await req.payload.updateGlobal({ slug: "hero", data: { video: videoId, poster: posterId }, req });
    await req.payload.updateGlobal({
      slug: "site-text",
      data: {
        tagline: site.tagline,
        venueName: site.venue.name,
        venueArea: site.venue.area,
        nextDate: "Dates, line-ups and tickets drop on Instagram first.",
        instagramUrl: site.instagram,
        instagramHandle: site.instagramHandle,
      },
      req,
    });

    return Response.json({ ok: true, photos: ids.length });
  },
};
