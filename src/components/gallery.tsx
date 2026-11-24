"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Photo } from "@/content/site";

type Ctx = { open: (index: number) => void };
const GalleryContext = createContext<Ctx | null>(null);

/** Wraps the album and renders one shared lightbox. */
export function GalleryProvider({ photos, children }: { photos: Photo[]; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);

  const open = useCallback((i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  }, []);
  const step = useCallback((d: number) => setIndex((i) => (i + d + photos.length) % photos.length), [photos.length]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.open) return;
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  // swipe left/right on touch screens
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) step(dx < 0 ? 1 : -1);
    else if (dy > 110 && Math.abs(dy) > Math.abs(dx) * 1.5) dialog.current?.close(); // swipe down to close
  };

  const photo = photos[index];

  return (
    <GalleryContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialog}
        aria-label="Photo viewer"
        className="lightbox"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {/* prev · photo · next sit together, so the arrows hug the photo on wide screens */}
        <div
          className="lb-stage"
          onClick={(e) => {
            if (e.target === e.currentTarget) dialog.current?.close();
          }}
        >
          <button type="button" className="lb-btn lb-prev" onClick={() => step(-1)} aria-label="Previous photo">
            <Icon d="M15 5l-7 7 7 7" />
          </button>
          <div className="lb-photo">
            <figure className="lightbox-figure">
              <Image key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 900px) 90vw, 860px" loading="eager" className="lightbox-img" />
              <figcaption className="sr-only">{photo.alt}</figcaption>
            </figure>
            {/* close sits on the photo's top-right corner (screen corner on phones) */}
            <button type="button" className="lb-btn lb-close" onClick={() => dialog.current?.close()} aria-label="Close" autoFocus>
              <Icon d="M6 6l12 12M18 6L6 18" />
            </button>
          </div>
          <button type="button" className="lb-btn lb-next" onClick={() => step(1)} aria-label="Next photo">
            <Icon d="M9 5l7 7-7 7" />
          </button>
        </div>
        <p className="lb-count" aria-live="polite">
          {index + 1} / {photos.length}
          <span className="lb-hint"> · swipe</span>
        </p>
      </dialog>
    </GalleryContext.Provider>
  );
}

/** Clickable area that opens the lightbox at a photo. */
export function PhotoButton({
  index,
  label,
  className = "",
  style,
  tabIndex,
  children,
}: {
  index: number;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  tabIndex?: number;
  children?: ReactNode;
}) {
  const ctx = useContext(GalleryContext);
  return (
    <button type="button" aria-label={label} tabIndex={tabIndex} onClick={() => ctx?.open(index)} className={`photo-btn ${className}`} style={style}>
      {children}
    </button>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
