import type { CollectionConfig } from "payload";
import { revalidateHome } from "../hooks/revalidate";

/** Every photo and video uploaded to the site. Stored in Vercel Blob (or ./media locally). */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Photo / video", plural: "Photos & videos" },
  admin: {
    group: "Content",
    description: "Upload event photos and videos here, then choose where they appear under Album and Hero video.",
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "mimeType", "updatedAt"],
  },
  access: { read: () => true },
  upload: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/quicktime", "video/webm"],
    focalPoint: true,
    crop: false,
    adminThumbnail: ({ doc }) => (typeof doc?.mimeType === "string" && doc.mimeType.startsWith("image/") ? (doc.url as string) : null),
  },
  fields: [
    {
      name: "alt",
      label: "Description",
      type: "text",
      required: true,
      admin: { description: "Short description of what's in the photo (for screen readers and Google), e.g. “DJ set under the Mosh Rooms logo”." },
    },
  ],
  hooks: {
    afterChange: [() => revalidateHome()],
    afterDelete: [() => revalidateHome()],
  },
};
