import { getPayload } from "payload";
import config from "@payload-config";
import { album as defaultAlbum, photos as defaultPhotos, site, type Photo } from "@/content/site";

export type SiteText = {
  tagline: string;
  introKicker: string;
  introHeadline: string;
  introOutro: string;
  venueName: string;
  venueArea: string;
  nextDate: string;
  instagram: string;
  instagramHandle: string;
};

export type HeroVideoContent = {
  /** true = uploaded in the dashboard (raw phone video); false = the bundled, pre-rendered defaults */
  custom: boolean;
  desktop: { src: string; poster?: string };
  mobile: { src: string; poster?: string };
};

export type SiteContent = {
  text: SiteText;
  /** every photo, in lightbox order */
  photos: Photo[];
  /** indexes into `photos` */
  album: { leftFrame: number; middleFrame: number; chainsawFrame: number; strip: number[] };
  hero: HeroVideoContent;
};

const DEFAULT_TEXT: SiteText = {
  tagline: site.tagline,
  introKicker: "Dubai · Underground culture",
  introHeadline: "Not made for everyone.",
  introOutro: "Find your people.",
  venueName: site.venue.name,
  venueArea: site.venue.area,
  nextDate: "Dates, line-ups and tickets drop on Instagram first.",
  instagram: site.instagram,
  instagramHandle: site.instagramHandle,
};

const DEFAULT_HERO: HeroVideoContent = {
  custom: false,
  desktop: { src: "/video/hero.mp4", poster: "/video/hero-poster.jpg" },
  mobile: { src: "/video/hero-vertical.mp4", poster: "/video/hero-vertical-poster.jpg" },
};

type MediaDoc = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null; mimeType?: string | null };

function toPhoto(m: unknown): Photo | null {
  if (!m || typeof m !== "object") return null;
  const d = m as MediaDoc;
  if (!d.url || !d.mimeType?.startsWith("image/")) return null;
  return { src: d.url, alt: d.alt || "Mosh Rooms", width: d.width || 1200, height: d.height || 1500 };
}

const pick = (v: unknown, fallback: string) => (typeof v === "string" && v.trim() ? v.trim() : fallback);

/**
 * Everything the home page shows: dashboard content where it's been set, defaults everywhere else.
 * If the database isn't reachable (e.g. not configured yet) the site still renders with the defaults.
 */
export async function getContent(): Promise<SiteContent> {
  let albumDoc: Record<string, unknown> = {};
  let heroDoc: Record<string, unknown> = {};
  let textDoc: Record<string, unknown> = {};
  try {
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      const payload = await getPayload({ config });
      [albumDoc, heroDoc, textDoc] = (await Promise.all([
        payload.findGlobal({ slug: "album", depth: 1 }),
        payload.findGlobal({ slug: "hero", depth: 1 }),
        payload.findGlobal({ slug: "site-text", depth: 0 }),
      ])) as unknown as Record<string, unknown>[];
    }
  } catch (err) {
    console.error("[content] dashboard content unavailable, using defaults:", err);
  }

  // ---- photos: frames + strip, deduplicated into one lightbox list
  const framePhoto = (key: "leftFrame" | "middleFrame" | "chainsawFrame") => toPhoto(albumDoc[key]) ?? defaultPhotos[defaultAlbum[key]];
  const frames = { leftFrame: framePhoto("leftFrame"), middleFrame: framePhoto("middleFrame"), chainsawFrame: framePhoto("chainsawFrame") };

  const cmsStrip = Array.isArray(albumDoc.strip)
    ? (albumDoc.strip as { photo?: unknown }[]).map((r) => toPhoto(r?.photo)).filter((p): p is Photo => Boolean(p))
    : [];
  const strip = cmsStrip.length ? cmsStrip : defaultAlbum.strip.map((i) => defaultPhotos[i]);

  const list: Photo[] = [];
  const indexOf = (p: Photo) => {
    let i = list.findIndex((x) => x.src === p.src);
    if (i < 0) i = list.push(p) - 1;
    return i;
  };
  const stripIdx = strip.map(indexOf);
  const albumIdx = {
    leftFrame: indexOf(frames.leftFrame),
    middleFrame: indexOf(frames.middleFrame),
    chainsawFrame: indexOf(frames.chainsawFrame),
    strip: stripIdx,
  };

  // ---- hero video
  const video = heroDoc.video as MediaDoc | undefined;
  const poster = heroDoc.poster as MediaDoc | undefined;
  const hero: HeroVideoContent =
    video?.url && video.mimeType?.startsWith("video/")
      ? { custom: true, desktop: { src: video.url, poster: poster?.url || undefined }, mobile: { src: video.url, poster: poster?.url || undefined } }
      : DEFAULT_HERO;

  return {
    text: {
      tagline: pick(textDoc.tagline, DEFAULT_TEXT.tagline),
      introKicker: pick(textDoc.introKicker, DEFAULT_TEXT.introKicker),
      introHeadline: pick(textDoc.introHeadline, DEFAULT_TEXT.introHeadline),
      introOutro: pick(textDoc.introOutro, DEFAULT_TEXT.introOutro),
      venueName: pick(textDoc.venueName, DEFAULT_TEXT.venueName),
      venueArea: pick(textDoc.venueArea, DEFAULT_TEXT.venueArea),
      nextDate: pick(textDoc.nextDate, DEFAULT_TEXT.nextDate),
      instagram: pick(textDoc.instagramUrl, DEFAULT_TEXT.instagram),
      instagramHandle: pick(textDoc.instagramHandle, DEFAULT_TEXT.instagramHandle),
    },
    photos: list,
    album: albumIdx,
    hero,
  };
}
