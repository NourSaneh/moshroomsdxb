import Image from "next/image";
import { Layer, RotLayer, StageSection } from "./stage";
import { box } from "@/lib/stage";

/** Wireframe 1 — hero poster. */
export function Hero() {
  return (
    <StageSection
      id="top"
      label="Mosh Rooms"
      className="hero bg-[#101215]"
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
        <Image src="/images/mosh-rooms-logo.png" alt="Mosh Rooms" fill preload sizes="(min-width:1440px) 294px, 21vw" className="object-cover" />
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
      <RotLayer src="/images/curved-chain.png" x={853} y={751} w={196.738} h={207.727} iw={166.581} ih={147.894} deg={69.57} />
      <Layer src="/images/black-red-scribble.png" x={1142} y={892} w={140} h={103} />
      <Layer src="/images/hero-frame.png" x={123} y={168} w={1128} h={635} preload className="hero-frame anim-sway" />

      <p className="sr-only">Dubai&apos;s first alternative hip-hop, emo rap and cloud rap event.</p>
    </StageSection>
  );
}
