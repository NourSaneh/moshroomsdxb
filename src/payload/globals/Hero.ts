import type { GlobalConfig } from "payload";
import { revalidateHome } from "../hooks/revalidate";

export const Hero: GlobalConfig = {
  slug: "hero",
  label: "Hero video",
  admin: {
    group: "Content",
    description: "The looping video inside the frame at the top of the site. Upload a vertical phone video (MP4, under 50 MB). Empty = keep the current video.",
  },
  access: { read: () => true },
  fields: [
    {
      name: "video",
      label: "Video",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "video" } },
      admin: { description: "Plays muted on loop; visitors can turn the sound on. On computers, the sides of the frame are filled with a blurred copy automatically." },
    },
    {
      name: "poster",
      label: "Cover image (optional)",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "image" } },
      admin: { description: "Shown while the video loads. Leave empty to use the video's first frame." },
    },
  ],
  hooks: { afterChange: [() => revalidateHome()] },
};
