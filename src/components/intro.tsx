import Image from "next/image";
import type { SiteText } from "@/lib/content";

/** Editorial bridge between the hero and the album: kicker · headline · tagline · closing line (all editable in the dashboard). */
export function Intro({ text }: { text: SiteText }) {
  return (
    <section id="intro" aria-labelledby="intro-title" className="intro relative overflow-hidden px-6 py-16 text-center md:py-24">
      <div className="intro-grain" aria-hidden />
      <div className="relative mx-auto max-w-3xl">
        <p className="intro-kicker">
          <span aria-hidden className="intro-kicker-rule" />
          {text.introKicker}
          <span aria-hidden className="intro-kicker-rule" />
        </p>

        <h2 id="intro-title" className="intro-headline mt-6">
          {text.introHeadline}
        </h2>

        {/* the tagline already sits under the video on desktop */}
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-bone/80 md:hidden">{text.tagline}</p>

        <div className="relative mx-auto mt-8 inline-block">
          <p className="intro-outro">{text.introOutro}</p>
          <div className="pointer-events-none absolute -right-9 -top-6 w-9" style={{ aspectRatio: "145/140" }} aria-hidden>
            <Image src="/images/red-star-small.png" alt="" fill sizes="36px" className="anim-spin object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
