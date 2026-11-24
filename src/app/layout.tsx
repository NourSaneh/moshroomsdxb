import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import "./globals.css";

// Self-hosted (SIL OFL / Apache 2.0) — no runtime dependency on Google Fonts.
const jolly = localFont({ src: "../fonts/jolly-lodger-latin-400-normal.woff2", variable: "--font-jolly", display: "swap", weight: "400" });
const elite = localFont({ src: "../fonts/special-elite-latin-400-normal.woff2", variable: "--font-elite", display: "swap", weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Alt hip-hop, emo rap & cloud rap in Dubai`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["Mosh Rooms", "Dubai events", "emo rap Dubai", "cloud rap", "alternative hip-hop", "High SO Dubai", "Al Barsha nightlife", "underground music Dubai"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jolly.variable} ${elite.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
