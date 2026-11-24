"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The dancing ghost (transparent video).
 * - Chrome / Edge / Firefox / Android: VP9 WebM with alpha (small, smooth).
 * - Safari & every iOS browser (WebKit can't play WebM alpha): animated WebP, which keeps transparency.
 * - Reduced motion: a still frame.
 * Renders the still on the server, then swaps in the right animated version after mount.
 */
export function GhostDance({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<"still" | "webm" | "webp">("still");
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ua = navigator.userAgent;
    const iOS = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
    const desktopSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox|Android/.test(ua);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser detection must run after hydration
    setMode(iOS || desktopSafari ? "webp" : "webm");
  }, []);

  // play the video only while it's on screen
  useEffect(() => {
    const v = video.current;
    if (mode !== "webm" || !v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, [mode]);

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "540/480" }}>
      {mode === "webm" ? (
        <video ref={video} className="absolute inset-0 h-full w-full object-contain" src="/video/ghost-dance.webm" poster="/images/ghost-dance-poster.webp" muted loop playsInline preload="none" aria-hidden disablePictureInPicture />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- animated WebP must not go through the image optimizer (it would drop the animation)
        <img
          className="absolute inset-0 h-full w-full object-contain"
          src={mode === "webp" ? "/images/ghost-dance.webp" : "/images/ghost-dance-poster.webp"}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}
    </div>
  );
}
