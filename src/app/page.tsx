import { Album } from "@/components/album";
import { Events } from "@/components/events";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon.png`,
  description: site.description,
  sameAs: [site.instagram],
  location: {
    "@type": "Place",
    name: site.venue.name,
    address: { "@type": "PostalAddress", addressLocality: "Dubai", addressRegion: "Al Barsha", addressCountry: "AE" },
  },
};

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Album />
        <Events />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
