import type { GlobalConfig } from "payload";
import { revalidateHome } from "../hooks/revalidate";

export const SiteText: GlobalConfig = {
  slug: "site-text",
  label: "Text & links",
  admin: { group: "Content", description: "Words and links shown on the site. Empty = keep the current text." },
  access: { read: () => true },
  fields: [
    { name: "tagline", type: "text", admin: { description: "Shown under the hero video and in the Events section." } },
    {
      type: "row",
      fields: [
        { name: "venueName", label: "Venue", type: "text", admin: { width: "50%", placeholder: "High SØ" } },
        { name: "venueArea", label: "Area", type: "text", admin: { width: "50%", placeholder: "Al Barsha, Dubai" } },
      ],
    },
    { name: "nextDate", label: "Next date text", type: "text", admin: { description: "Under “Next date” in Events, e.g. “Sat 14 Dec — tickets on Instagram”." } },
    {
      type: "row",
      fields: [
        { name: "instagramUrl", label: "Instagram link", type: "text", admin: { width: "50%" } },
        { name: "instagramHandle", label: "Instagram handle", type: "text", admin: { width: "50%", placeholder: "@moshroomsdxb" } },
      ],
    },
  ],
  hooks: { afterChange: [() => revalidateHome()] },
};
