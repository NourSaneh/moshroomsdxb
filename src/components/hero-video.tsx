"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Transparent window of hero-frame.png, as % of the frame (measured from its alpha), with a little bleed under the border. */
const WIN = { left: 7.536 - 0.6, top: 22.848 - 0.8, width: 86.124 + 1.2, height: 61.318 + 1.6 };

/**
 * Looping event video inside the hero frame.
 * Starts muted (browsers only allow muted autoplay); the sound button turns audio on/off.
 * Pauses when scrolled off screen; doesn't autoplay for reduced-motion users.
 */
/** `children` (the frame artwork) renders between the video and the controls, so the frame border overlaps the video. */
export function HeroVideo({ children }: { children?: ReactNode }) {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) userPaused.current = true;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) {
          v.play().catch(() => {
            // autoplay with sound blocked → fall back to muted
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

  return (
    <>
      <div className="hero-video absolute overflow-hidden" style={{ left: `${WIN.left}%`, top: `${WIN.top}%`, width: `${WIN.width}%`, height: `${WIN.height}%` }}>
        <video
          ref={video}
          className="h-full w-full object-cover"
          src="/video/hero.mp4"
          poster="/video/hero-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Mosh Rooms event recap video"
          disablePictureInPicture
        />
      </div>

      {children}

      <div className="hero-video-controls absolute flex gap-[0.6cqw]" style={{ right: `${100 - WIN.left - WIN.width + 3}%`, bottom: `${100 - WIN.top - WIN.height + 5}%` }}>
        <button type="button" onClick={togglePlay} className="video-btn" aria-label={playing ? "Pause video" : "Play video"} aria-pressed={!playing}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" onClick={toggleSound} className="video-btn video-btn-sound" aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted}>
          {muted ? <MutedIcon /> : <SoundIcon />}
          <span>{muted ? "Sound off" : "Sound on"}</span>
        </button>
      </div>
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
