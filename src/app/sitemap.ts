import type { MetadataRoute } from "next";
import { photos, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      changeFrequency: "weekly",
      priority: 1,
      images: photos.map((p) => `${site.url}${p.src}`),
    },
  ];
}
