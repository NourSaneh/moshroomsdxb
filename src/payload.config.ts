import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { migrations } from "./migrations";
import { importDefaults } from "./payload/endpoints/importDefaults";
import { Media } from "./payload/collections/Media";
import { Users } from "./payload/collections/Users";
import { Album } from "./payload/globals/Album";
import { Hero } from "./payload/globals/Hero";
import { SiteText } from "./payload/globals/SiteText";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Vercel Blob token — normally BLOB_READ_WRITE_TOKEN, but accept a custom prefix (e.g. MOSHROOMS_READ_WRITE_TOKEN) too
const blobToken =
  process.env.BLOB_READ_WRITE_TOKEN ||
  Object.entries(process.env).find(([key, value]) => key.endsWith("_READ_WRITE_TOKEN") && value?.startsWith("vercel_blob_rw_"))?.[1];

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " · Mosh Rooms dashboard",
      icons: [{ rel: "icon", type: "image/png", url: "/icon.png" }],
    },
    components: {
      graphics: {
        Logo: "./payload/components/Logo",
        Icon: "./payload/components/Icon",
      },
      beforeDashboard: ["./payload/components/ImportDefaults"],
    },
    theme: "dark",
  },
  collections: [Media, Users],
  endpoints: [importDefaults],
  globals: [Album, Hero, SiteText],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    // Neon (via Vercel) sets DATABASE_URL / POSTGRES_URL automatically
    pool: { connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || "" },
    // in production, run any pending migrations when the server starts
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      // Locally without a token, uploads fall back to ./media on disk.
      enabled: Boolean(blobToken),
      token: blobToken,
      // serve files straight from Blob's CDN instead of proxying through the server
      collections: { media: { disablePayloadAccessControl: true } },
      // upload straight from the browser to Blob — avoids Vercel's ~4.5 MB request limit (videos!)
      clientUploads: true,
      addRandomSuffix: true,
      // same database columns locally (no Blob) and in production (Blob) — keeps migrations in sync
      alwaysInsertFields: true,
    }),
  ],
  upload: { limits: { fileSize: 50_000_000 } },
});
