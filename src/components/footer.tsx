import Image from "next/image";
import Link from "next/link";
import type { SiteText } from "@/lib/content";


/** Footer in the same horror-punk collage language: hanging sign, chains, torn tape, stars, ghost. */
export function Footer({ text }: { text: SiteText }) {
  const links = [
    { href: "#album", label: "Album" },
    { href: "#events", label: "Events" },
    { href: text.instagram, label: "Instagram", external: true },
  ];
  return (
    <footer className="site-footer relative overflow-hidden bg-black">
      <Image src="/images/gallery-bg.jpg" alt="" fill sizes="100vw" className="object-cover opacity-45" />
      <div className="top-chain" aria-hidden />

      {/* scattered stickers */}
      <Deco src="/images/black-grunge-star.png" className="right-[6%] top-[12%] w-10 rotate-12 md:right-[33%] md:top-[30%] md:w-12" ratio="253/243" />
      <Deco src="/images/red-scribble.png" className="bottom-[16%] right-[7%] hidden w-14 md:block" ratio="103/192" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-10 pt-24 md:grid-cols-[1fr_1.2fr_1fr] md:items-start md:px-12 md:pt-20">
        {/* hanging sign */}
        <div className="-mt-14 flex flex-col items-center md:col-start-2 md:row-start-1 md:-mt-12">
          <div className="anim-swing flex flex-col items-center" style={{ transformOrigin: "50% 0" }}>
            <div className="flex w-56 justify-between px-6 md:w-72">
              <ChainDrop />
              <ChainDrop />
            </div>
            <Link href="/" aria-label="Mosh Rooms — home" className="footer-sign relative -mt-1 block w-56 md:w-72" style={{ aspectRatio: "3/2" }}>
              <Image src="/images/mosh-rooms-logo.png" alt="Mosh Rooms" fill sizes="288px" className="object-contain p-4" />
            </Link>
          </div>
          <div className="torn-tape relative -mt-3 w-64 rotate-[-2deg] md:w-80">
            <Image src="/images/torn-strip.png" alt="" fill sizes="320px" className="object-fill opacity-25 mix-blend-multiply" />
            <p className="relative px-7 py-3 text-center text-[13px] leading-snug text-[#1a1212] md:text-sm">{text.tagline}</p>
          </div>
        </div>

        {/* links */}
        <nav aria-label="Footer" className="text-center md:col-start-1 md:row-start-1 md:pt-16 md:text-left">
          <h2 className="label-red">Enter the room</h2>
          <ul className="mt-3 space-y-1">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="footer-link font-display inline-flex min-h-11 items-center gap-3 text-4xl text-bone md:text-5xl"
                >
                  <span className="footer-star" aria-hidden />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* venue + next date */}
        <div className="text-center md:col-start-3 md:row-start-1 md:pt-16 md:text-right">
          <h2 className="label-red">Find us</h2>
          <p className="mt-3 text-lg text-bone">
            {text.venueName}
            <br />
            {text.venueArea}
          </p>
          <a href={text.instagram} target="_blank" rel="noopener noreferrer" className="cta mt-5 text-[1.6rem]">
            Follow the pit <span aria-hidden>→</span>
          </a>
          <p className="mt-3 text-sm text-bone/70">{text.instagramHandle}</p>
        </div>
      </div>

      {/* bottom strip */}
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 border-t border-white/10 px-6 py-6 md:flex-row md:justify-between md:px-12">
        <div className="flex items-center gap-4">
          <div className="relative h-9 w-14 opacity-80" style={{ rotate: "-4deg" }}>
            <Image src="/images/barcode.png" alt="" fill sizes="56px" className="object-contain" />
          </div>
          <p className="text-xs text-bone/60">© Mosh Rooms · Dubai, UAE</p>
        </div>
        <a href="#top" className="footer-top group flex items-center gap-2 text-bone/80">
          <span className="font-display text-2xl group-hover:text-blood">Back to the top</span>
          <span className="anim-bob relative block h-12 w-8">
            <Image src="/images/ghost-small.png" alt="" fill sizes="32px" className="object-contain" />
          </span>
        </a>
      </div>
    </footer>
  );
}

function ChainDrop() {
  return (
    <span className="relative block h-28 w-3 md:h-32" aria-hidden>
      <Image src="/images/vertical-chain.png" alt="" fill sizes="12px" className="object-cover" />
    </span>
  );
}

function Deco({ src, className, ratio }: { src: string; className: string; ratio: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ aspectRatio: ratio }} aria-hidden>
      <Image src={src} alt="" fill sizes="80px" className="object-contain" />
    </div>
  );
}
