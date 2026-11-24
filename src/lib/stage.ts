import type { CSSProperties } from "react";

/** The Figma wireframes are 1440 × 1024. Everything is positioned in those units, as percentages. */
export const STAGE_W = 1440;
export const STAGE_H = 1024;

const pct = (n: number) => `${+n.toFixed(4)}%`;

/** Absolute box in Figma pixels → percentage style relative to the stage. */
export function box(x: number, y: number, w: number, h: number): CSSProperties {
  return { left: pct((x / STAGE_W) * 100), top: pct((y / STAGE_H) * 100), width: pct((w / STAGE_W) * 100), height: pct((h / STAGE_H) * 100) };
}

/** Rotated child inside a Figma bounding box (outer w/h) → size + rotation. */
export function inner(ow: number, oh: number, iw: number, ih: number, deg: number): CSSProperties {
  return { width: pct((iw / ow) * 100), height: pct((ih / oh) * 100), rotate: `${deg}deg` };
}

/** `sizes` attribute for next/image: the element is `w` Figma px wide when the stage is 1440px. */
export function sizes(w: number) {
  const vw = +((w / STAGE_W) * 100).toFixed(2);
  return `(min-width: 1440px) ${Math.ceil(w)}px, ${vw}vw`;
}
