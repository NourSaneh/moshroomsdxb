import Image from "next/image";
import Link from "next/link";
import { Layer, RotLayer, StageSection } from "./stage";
import { box, sizes } from "@/lib/stage";
import { frames } from "@/lib/frames";
import { FramedHeroVideo, HeroVideo } from "./hero-video";
import type { HeroVideoContent } from "@/lib/content";

type HeroProps = { tagline: string; video: HeroVideoContent };

/** Wireframe 1 — hero poster. Tablet/desktop: the Figma stage. Phones: a full-screen portrait poster. */
export function Hero(props: HeroProps) {
  return (
    <div id="top">
      <HeroDesktop {...props} />
      <HeroMobile {...props} />
    </div>
  );
}

function HeroDesktop({ tagline, video }: HeroProps) {
  return (
    <StageSection
      id="hero-stage"
      label="Mosh Rooms"
      className="hero hidden bg-[#101215] md:block"
      background={
        <>
          <Image src="/images/hero-bg.jpg" alt="" fill preload sizes="100vw" className="hero-bg object-cover" />
          <Image src="/images/hero-bg-wink.jpg" alt="" fill sizes="100vw" className="hero-bg hero-bg-wink object-cover" />
        </>
      }
    >
      {/* thin gold rules */}
      <div className="absolute h-px bg-rule" style={box(70, 35, 1300.833, 1)} />
      <div className="v-rule absolute" style={box(1402, 69, 10, 854)} />
      <div className="v-rule absolute" style={box(29, 69, 10, 854)} />

      <RotLayer src="/images/high-so.png" alt={`High SØ`} x={1141.8} y={161.62} w={261.601} h={775.081} iw={252} ih={772} deg={0.71} />
      <h1 className="absolute m-0" style={box(552, 51, 294, 196)}>
        <Link href="/" className="logo-link relative block h-full w-full" aria-label="Mosh Rooms — home">
          <Image src="/images/mosh-rooms-logo.png" alt="Mosh Rooms" fill preload sizes="(min-width:1440px) 294px, 21vw" className="object-cover" />
        </Link>
      </h1>

      <nav aria-label="Main">
        <a href="#album" className="nav-link absolute" style={{ left: `${(1081 / 1440) * 100}%`, top: `${(90 / 1024) * 100}%` }}>
          ALBUM
        </a>
        <a href="#events" className="nav-link absolute" style={{ left: `${(143 / 1440) * 100}%`, top: `${(87 / 1024) * 100}%` }}>
          EVENTS
        </a>
      </nav>

      <RotLayer src="/images/figure-white.png" x={1216} y={51} w={216.677} h={208.212} iw={152} ih={169} deg={65.62} className="anim-bob" />
      <Layer src="/images/black-red-scribble.png" x={1142} y={892} w={140} h={103} />
      {/* frame with the looping event video in its window */}
      <div className="hero-frame anim-sway absolute" style={box(123, 168, 1128, 635)}>
        <HeroVideo src={video.desktop.src} poster={video.desktop.poster} blurFill={video.custom}>
          <Image src="/images/hero-frame.png" alt="" fill preload sizes={sizes(1128)} className="pointer-events-none select-none object-cover" draggable={false} />
        </HeroVideo>
      </div>

      {/* tagline under the video frame */}
      <p className="hero-tagline absolute text-center" style={box(123, 818, 1128, 60)}>
        {tagline.replace(/\.$/, "")}.
      </p>
    </StageSection>
  );
}

/** Phone hero: fills the screen. Logo + nav up top, the vertical video in a hanging frame, HIGH SØ down the side. */
function HeroMobile({ tagline, video }: HeroProps) {
  const geo = frames.left;
  return (
    <section aria-label="Mosh Rooms" className="hero hero-mobile relative flex h-svh min-h-[580px] flex-col overflow-hidden bg-[#101215] md:hidden">
      <Image src="/images/hero-bg.jpg" alt="" fill preload sizes="100vw" className="hero-bg object-cover object-[62%_50%]" />
      <Image src="/images/hero-bg-wink.jpg" alt="" fill sizes="100vw" className="hero-bg hero-bg-wink auto-wink object-cover object-[62%_50%]" />

      <div className="relative mx-4 mt-3 h-px bg-rule" />
      <nav aria-label="Main" className="relative flex items-start justify-between px-5 pt-2">
        <a href="#events" className="nav-link-m">
          EVENTS
        </a>
        <a href="#album" className="nav-link-m">
          ALBUM
        </a>
      </nav>
      <h1 className="relative mx-auto -mt-9 aspect-[3/2] w-[46vw] max-w-[240px]">
        <Link href="/" className="logo-link relative block h-full w-full" aria-label="Mosh Rooms — home">
          <Image src="/images/mosh-rooms-logo.png" alt="Mosh Rooms" fill preload sizes="46vw" className="object-contain" />
        </Link>
      </h1>

      <div className="relative min-h-0 flex-1">
        {/* hanging frame with the vertical event video */}
        <div className="hero-m-frame anim-swing absolute left-[2%]" style={{ transformOrigin: `${geo.pivot[0]}% 0` }}>
          <FramedHeroVideo geo={geo} src={video.mobile.src} poster={video.mobile.poster}>
            <Image src="/images/frame-left-solo.png" alt="" fill sizes="80vw" className="pointer-events-none select-none object-cover" draggable={false} />
          </FramedHeroVideo>
        </div>

        <div className="absolute right-[1%] top-[13%] h-[70%]" style={{ aspectRatio: "252/772" }}>
          <Image src="/images/high-so.png" alt="High SØ" fill sizes="25vw" className="object-contain" />
        </div>
        <div className="anim-bob absolute right-[3%] top-[1%] w-[15vw]" style={{ aspectRatio: "152/169", rotate: "65deg" }}>
          <Image src="/images/figure-white.png" alt="" fill sizes="17vw" className="object-contain" />
        </div>
        <div className="absolute bottom-[1%] right-[5%] w-[26vw]" style={{ aspectRatio: "140/103" }}>
          <Image src="/images/black-red-scribble.png" alt="" fill sizes="26vw" className="object-contain" />
        </div>
      </div>

      <p className="relative px-6 pb-5 pt-2 text-center text-[13px] leading-snug text-bone/85">{tagline}</p>
    </section>
  );
}
