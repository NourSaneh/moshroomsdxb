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

  const photo = photos[index];

  return (
    <GalleryContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialog}
        aria-label="Photo viewer"
        className="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <figure className="lightbox-figure">
          <Image key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 900px) 90vw, 860px" className="lightbox-img" />
          <figcaption className="sr-only">{photo.alt}</figcaption>
        </figure>
        <button type="button" className="lb-btn lb-close" onClick={() => dialog.current?.close()} aria-label="Close" autoFocus>
          ✕
        </button>
        <button type="button" className="lb-btn lb-prev" onClick={() => step(-1)} aria-label="Previous photo">
          ‹
        </button>
        <button type="button" className="lb-btn lb-next" onClick={() => step(1)} aria-label="Next photo">
          ›
        </button>
        <p className="lb-count" aria-live="polite">
          {index + 1} / {photos.length}
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
