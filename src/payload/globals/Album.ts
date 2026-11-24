import type { GlobalConfig } from "payload";
import { revalidateHome } from "../hooks/revalidate";

const imageOnly = { mimeType: { contains: "image" } };

export const Album: GlobalConfig = {
  slug: "album",
  label: "Album",
  admin: {
    group: "Content",
    description: "Choose which photos hang in the frames and which run through the chainsaw-chain strip. Empty = keep the current photo.",
  },
  access: { read: () => true },
  fields: [
    {
      type: "row",
      fields: [
        { name: "leftFrame", label: "Left hanging frame", type: "upload", relationTo: "media", filterOptions: imageOnly, admin: { width: "33%" } },
        { name: "middleFrame", label: "Middle hanging frame", type: "upload", relationTo: "media", filterOptions: imageOnly, admin: { width: "33%" } },
        { name: "chainsawFrame", label: "Frame on the chainsaw", type: "upload", relationTo: "media", filterOptions: imageOnly, admin: { width: "33%" } },
      ],
    },
    {
      name: "strip",
      label: "Chainsaw-chain photo strip",
      type: "array",
      labels: { singular: "Photo", plural: "Photos" },
      admin: {
        description: "Photos that run through the chain at the bottom (loops forever). Drag to reorder. Portrait photos look best.",
        initCollapsed: true,
      },
      fields: [{ name: "photo", type: "upload", relationTo: "media", filterOptions: imageOnly, required: true }],
    },
  ],
  hooks: { afterChange: [() => revalidateHome()] },
};
