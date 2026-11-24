import Image from "next/image";
import { site } from "@/content/site";
import { GhostDance } from "./ghost-dance";

/** Info + call to action. The EVENTS nav link lands here. */
export function Events() {
  return (
    <section id="events" aria-labelledby="events-title" className="events relative overflow-hidden bg-ink px-6 py-20 md:py-28">
      <div className="neon-bar left-[4%] hidden md:block" aria-hidden />
      <div className="neon-bar right-[4%] hidden md:block" aria-hidden />
      <div className="relative mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 id="events-title" className="font-display text-6xl leading-none text-bone md:text-8xl">
            Events
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-bone/85">{site.tagline}.</p>
          <dl className="mt-8 grid gap-1 text-bone/85">
            <dt className="label-red">Where</dt>
            <dd>
              {site.venue.name}, {site.venue.area}
            </dd>
            <dt className="label-red mt-4">Next date</dt>
            <dd>Dates, line-ups and tickets drop on Instagram first.</dd>
          </dl>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="cta mt-10">
            Get the next date
            <span aria-hidden> →</span>
          </a>
          <p className="mt-4 text-bone/70">
            Follow{" "}
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-bone underline decoration-blood underline-offset-4 hover:text-blood">
              {site.instagramHandle}
            </a>
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <GhostDance className="w-full scale-125 md:scale-150" />
          <div className="absolute -top-4 right-0 w-1/4" style={{ aspectRatio: "145/140" }}>
            <Image src="/images/red-star-small.png" alt="" fill sizes="128px" className="anim-spin object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
