/**
 * All editable site content lives here.
 * Change text, links or photos in this file — no need to touch the components.
 */

export const site = {
  name: "Mosh Rooms",
  shortName: "Mosh Rooms",
  tagline: "Dubai's first alternative hip-hop, emo rap & cloud rap night",
  description:
    "Mosh Rooms is Dubai's first alternative hip-hop, emo rap and cloud rap event — live DJs, mosh pits and the city's alt scene under one roof at High SØ.",
  /** Set NEXT_PUBLIC_SITE_URL in Vercel to the real domain (e.g. https://moshrooms.ae). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://moshroomsdxb.vercel.app",
  venue: {
    name: "High SØ",
    area: "Al Barsha, Dubai",
  },
  /** Instagram profile — used by the EVENTS section CTA, the footer and SEO (sameAs). */
  instagram: "https://www.instagram.com/moshroomsdxb/",
  instagramHandle: "@moshroomsdxb",
  genres: ["Alternative hip-hop", "Emo rap", "Cloud rap"],
} as const;

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Every photo in the album, in lightbox order. */
export const photos: Photo[] = [
  { src: "/images/photos/866433472.jpg", alt: "Mosh Rooms artists and crowd collage", width: 1200, height: 1500 },
  { src: "/images/photos/867744357.jpg", alt: "The crowd going off at Mosh Rooms", width: 1200, height: 1500 },
  { src: "/images/photos/870767760.jpg", alt: "Performers on stage at Mosh Rooms", width: 640, height: 800 },
  { src: "/images/photos/865437070.jpg", alt: "Crowd and guests at Mosh Rooms", width: 960, height: 1200 },
  { src: "/images/photos/868415240.jpg", alt: "DJ set under the Mosh Rooms logo", width: 960, height: 1200 },
  { src: "/images/photos/856770593.jpg", alt: "Guest throwing horns in the crowd", width: 1080, height: 1409 },
  { src: "/images/photos/858981310.jpg", alt: "Heart hands in front of the Mosh Rooms projection", width: 1080, height: 1409 },
  { src: "/images/photos/861628282.jpg", alt: "Inside the pit at Mosh Rooms", width: 1080, height: 1409 },
  { src: "/images/photos/859316123.jpg", alt: "Guest in costume at Mosh Rooms", width: 1080, height: 1409 },
];

/** Which photo (index into `photos`) goes in each hanging frame, and the thumbnail strip. */
export const album = {
  leftFrame: 4,
  middleFrame: 6,
  chainsawFrame: 5,
  /**
   * Photos that run through the chainsaw-chain carousel (loops forever).
   * TEST SET: every photo twice — replace with the real album when it's ready.
   */
  strip: [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8],
};
