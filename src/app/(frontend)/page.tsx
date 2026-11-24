import { Album } from "@/components/album";
import { Events } from "@/components/events";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { ScrollSwing } from "@/components/scroll-swing";
import { site } from "@/content/site";
import { getContent } from "@/lib/content";

// Static page, rebuilt automatically whenever something is saved in the dashboard (see src/payload/hooks/revalidate.ts).
export default async function Home() {
  const { text, photos, album, hero } = await getContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.png`,
    description: site.description,
    sameAs: [text.instagram],
    location: {
      "@type": "Place",
      name: text.venueName,
      address: { "@type": "PostalAddress", addressLocality: "Dubai", addressRegion: text.venueArea, addressCountry: "AE" },
    },
  };

  return (
    <>
      <main>
        <Hero tagline={text.tagline} video={hero} />
        <Intro text={text} />
        <Album photos={photos} album={album} />
        <Events text={text} />
      </main>
      <Footer text={text} />
      <ScrollSwing />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
