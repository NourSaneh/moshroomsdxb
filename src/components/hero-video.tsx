"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { FrameGeo } from "@/lib/frames";

/**
 * Looping event video logic shared by the desktop and phone heroes.
 * Starts muted (browsers only allow muted autoplay); a button turns sound on/off.
 * Pauses when scrolled off screen; no autoplay for reduced-motion users.
 */
function useLoopVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) userPaused.current = true;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    // only plays while visible — the hidden (desktop/phone) copy never loads
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) {
          v.play().catch(() => {
            v.muted = true;
            setMuted(true);
            v.play().catch(() => {});
          });
        } else if (!e.isIntersecting) {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    v.volume = 0.85;
    setMuted(next);
    if (!next && v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    }
  };
  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return { video, muted, playing, toggleSound, togglePlay };
}

type ControlProps = { muted: boolean; playing: boolean; toggleSound: () => void; togglePlay: () => void; className?: string; style?: CSSProperties };

function Controls({ muted, playing, toggleSound, togglePlay, className = "", style }: ControlProps) {
  return (
    <div className={`hero-video-controls absolute flex gap-2 ${className}`} style={style}>
      <button type="button" onClick={togglePlay} className="video-btn" aria-label={playing ? "Pause video" : "Play video"} aria-pressed={!playing}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button type="button" onClick={toggleSound} className="video-btn video-btn-sound" aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted}>
        {muted ? <MutedIcon /> : <SoundIcon />}
        <span>{muted ? "Sound off" : "Sound on"}</span>
      </button>
    </div>
  );
}

/** Transparent window of hero-frame.png, as % of the frame (measured from its alpha), with a little bleed under the border. */
const WIN = { left: 7.536 - 0.6, top: 22.848 - 0.8, width: 86.124 + 1.2, height: 61.318 + 1.6 };

/** Desktop: wide video inside the hero frame. `children` (the frame art) renders between video and controls. */
export function HeroVideo({ children }: { children?: ReactNode }) {
  const { video, ...ctl } = useLoopVideo();
  return (
    <>
      <div className="hero-video absolute overflow-hidden" style={{ left: `${WIN.left}%`, top: `${WIN.top}%`, width: `${WIN.width}%`, height: `${WIN.height}%` }}>
        <video ref={video} className="h-full w-full object-cover" src="/video/hero.mp4" poster="/video/hero-poster.jpg" muted loop playsInline preload="none" aria-label="Mosh Rooms event recap video" disablePictureInPicture />
      </div>
      {children}
      <Controls {...ctl} style={{ right: `${100 - WIN.left - WIN.width + 3}%`, bottom: `${100 - WIN.top - WIN.height + 5}%` }} />
    </>
  );
}

/** Phone: the original vertical video inside a hanging photo frame, clipped to the frame's window. */
export function FramedHeroVideo({ geo, children }: { geo: FrameGeo; children?: ReactNode }) {
  const { video, ...ctl } = useLoopVideo();
  const [bx, by, bw, bh] = geo.box;
  const [cx, cy, rw, rh] = geo.rect;
  const mask = `url(${geo.mask})`;
  return (
    <>
      <div className="hero-video absolute" style={{ left: `${bx}%`, top: `${by}%`, width: `${bw}%`, height: `${bh}%`, maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}>
        <div className="absolute" style={{ left: `${cx - rw / 2}%`, top: `${cy - rh / 2}%`, width: `${rw}%`, height: `${rh}%`, rotate: `${geo.angle}deg` }}>
          <video ref={video} className="h-full w-full object-cover" src="/video/hero-vertical.mp4" poster="/video/hero-vertical-poster.jpg" muted loop playsInline preload="none" aria-label="Mosh Rooms event recap video" disablePictureInPicture />
        </div>
      </div>
      {children}
      <Controls {...ctl} className="bottom-[3%] left-1/2 -translate-x-1/2" />
    </>
  );
}

const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
function SoundIcon() {
  return (
    <svg {...svg}>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}
function MutedIcon() {
  return (
    <svg {...svg}>
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M17 9.5l5 5M22 9.5l-5 5" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg {...svg}>
      <path d="M7 5l12 7-12 7z" fill="currentColor" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg {...svg}>
      <path d="M8 5v14M16 5v14" strokeWidth={3.4} />
    </svg>
  );
}
