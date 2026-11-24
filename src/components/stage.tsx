import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { box, inner, sizes } from "@/lib/stage";

/**
 * A full-screen section holding a 1440×1024 "stage".
 * The stage is scaled to fit BOTH the screen width and height (like object-fit: contain),
 * so the whole composition is visible on first load; the background fills the rest.
 */
export function StageSection({
  id,
  label,
  background,
  children,
  className = "",
}: {
  id: string;
  label: string;
  background?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-label={label} className={`stage-section ${className}`}>
      {background}
      <div className="stage">{children}</div>
    </section>
  );
}

type LayerProps = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  preload?: boolean;
};

/** An image placed at Figma coordinates. */
export function Layer({ src, x, y, w, h, alt = "", className = "", style, preload }: LayerProps) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ ...box(x, y, w, h), ...style }}>
      <Image src={src} alt={alt} fill sizes={sizes(w)} preload={preload} className="pointer-events-none select-none object-cover" draggable={false} />
    </div>
  );
}

/** An image rotated inside a Figma bounding box (Figma exports rotated layers this way). */
export function RotLayer({
  src,
  x,
  y,
  w,
  h,
  iw,
  ih,
  deg,
  alt = "",
  className = "",
  preload,
}: LayerProps & { iw: number; ih: number; deg: number }) {
  return (
    <div className={`pointer-events-none absolute flex items-center justify-center ${className}`} style={box(x, y, w, h)}>
      <div className="relative flex-none" style={inner(w, h, iw, ih, deg)}>
        <Image src={src} alt={alt} fill sizes={sizes(iw)} preload={preload} className="pointer-events-none select-none object-cover" draggable={false} />
      </div>
    </div>
  );
}
