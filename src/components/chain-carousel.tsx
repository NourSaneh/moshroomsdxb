"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Photo } from "@/content/site";
import { PhotoButton } from "./gallery";

/**
 * Geometry of the chainsaw-chain loop, measured on the original 2172×724 artwork.
 * The two straight runs are seamless tiles that move; the curved ends are fixed.
 */
const G = { w: 2172, h: 724, capL: 250, capR: 1922, top: { y: 95, h: 140, tile: 143 }, bot: { y: 465, h: 135, tile: 145 } };
const pct = (n: number, of: number) => `${(n / of) * 100}%`;

const SPEED = 38; // autoplay, px per second (in stage px)

type Item = { index: number; photo: Photo };

/**
 * Infinite photo track inside the chainsaw chain.
 * Scroll (wheel / trackpad / swipe / drag / arrows / keyboard) and the chain runs around the loop:
 * top run moves with the photos, bottom run moves the opposite way — like a real chainsaw.
 */
export function ChainCarousel({ items, className = "", style }: { items: Item[]; className?: string; style?: React.CSSProperties }) {
  const scroller = useRef<HTMLDivElement>(null);
  const topRun = useRef<HTMLDivElement>(null);
  const botRun = useRef<HTMLDivElement>(null);
  const api = useRef<{ step: (dir: number) => void }>({ step: () => {} });

  useEffect(() => {
    const el = scroller.current;
    const top = topRun.current;
    const bot = botRun.current;
    if (!el || !top || !bot) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let setW = 0; // width of one copy of the photo set
    let pos = 0; // float scroll position we drive
    let last = 0; // last seen scrollLeft
    let travel = 0; // total distance the chain has run
    let hovering = false;
    let focused = false;
    let visible = false;
    let holdUntil = 0; // pause autoplay briefly after the user interacts
    let tween: { from: number; to: number; t0: number } | null = null;
    let raf = 0;
    let prev = performance.now();

    const paint = () => {
      top.style.backgroundPositionX = `${-travel}px`;
      bot.style.backgroundPositionX = `${travel}px`;
    };
    const wrap = (x: number) => {
      if (setW <= 0) return x;
      if (x < setW * 0.5) return x + setW;
      if (x > setW * 1.5) return x - setW;
      return x;
    };
    const go = (x: number) => {
      const w = wrap(x);
      if (w !== x && tween) {
        tween.from += w - x;
        tween.to += w - x;
      }
      pos = w;
      el.scrollLeft = w;
    };
    const measure = () => {
      const ratio = setW ? (pos - setW) / setW : 0;
      setW = el.scrollWidth / 3;
      go(setW + ratio * setW);
      last = el.scrollLeft;
    };
    const hold = (ms = 2500) => (holdUntil = performance.now() + ms);

    const onScroll = () => {
      const x = el.scrollLeft;
      const d = x - last;
      // ignore the jump when we wrap around
      if (Math.abs(d) < setW * 0.4) travel += d;
      last = x;
      if (Math.abs(x - pos) > 2) {
        pos = x; // user scrolled natively (swipe / trackpad)
        hold();
      }
      if (x < setW * 0.5 || x > setW * 1.5) {
        go(x);
        last = el.scrollLeft;
      }
      paint();
    };

    const itemStep = () => {
      const first = el.querySelector<HTMLElement>("[data-chain-item]");
      if (!first) return 120;
      return first.offsetWidth + parseFloat(getComputedStyle(first).marginRight || "0");
    };
    api.current.step = (dir: number) => {
      hold(3500);
      const from = pos;
      const base = tween ? tween.to : pos;
      tween = { from, to: base + dir * itemStep(), t0: performance.now() };
    };

    const loop = (now: number) => {
      const dt = Math.min(64, now - prev) / 1000;
      prev = now;
      if (tween) {
        const k = Math.min(1, (now - tween.t0) / 450);
        const e = 1 - Math.pow(1 - k, 3);
        go(tween.from + (tween.to - tween.from) * e);
        if (k >= 1) tween = null;
      } else if (!reduce && visible && !hovering && !focused && now > holdUntil) {
        const scale = el.clientHeight / 180; // keep speed proportional to the strip's size
        go(pos + SPEED * Math.max(scale, 0.35) * dt);
      }
      raf = requestAnimationFrame(loop);
    };

    // wheel → sideways: scrolling over the chain feeds more photos through it
    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!d) return;
      e.preventDefault();
      tween = null;
      hold();
      go(pos + d * (e.deltaMode === 1 ? 30 : 1));
    };

    // mouse drag
    let drag: { x: number; start: number; moved: boolean } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, start: pos, moved: false };
      tween = null;
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      if (drag.moved) {
        el.classList.add("is-dragging");
        hold();
        go(drag.start - dx);
      }
    };
    const onUp = () => {
      setTimeout(() => {
        drag = null;
        el.classList.remove("is-dragging");
      }, 0);
    };
    const onClickCapture = (e: MouseEvent) => {
      if (drag?.moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        api.current.step(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        api.current.step(-1);
      }
    };

    const enter = () => (hovering = true);
    const leave = () => (hovering = false);
    const fin = () => (focused = true);
    const fout = () => (focused = false);

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    paint();

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("keydown", onKey);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", fin);
    el.addEventListener("focusout", fout);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", fin);
      el.removeEventListener("focusout", fout);
    };
  }, [items.length]);

  const copies = [0, 1, 2];

  return (
    <div className={`chain-carousel ${className}`} style={style}>
      {/* photo track sits under the chain so the teeth overlap the prints */}
      <div
        ref={scroller}
        className="chain-track"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Event photos — scroll, drag or use the arrow keys"
      >
        {copies.map((c) =>
          items.map((it, i) => (
            <div key={`${c}-${i}`} data-chain-item className="chain-item" aria-hidden={c !== 1} style={{ rotate: `${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg` }}>
              <PhotoButton index={it.index} label={`Open photo: ${it.photo.alt}`} className="thumb relative block h-full w-full" tabIndex={c === 1 ? 0 : -1}>
                <Image src={it.photo.src} alt={c === 1 ? it.photo.alt : ""} fill sizes="(min-width: 768px) 140px, 30vw" className="object-cover" draggable={false} />
              </PhotoButton>
            </div>
          )),
        )}
      </div>

      <Image src="/images/chain-caps.png" alt="" fill sizes="(min-width: 1440px) 1234px, 86vw" className="pointer-events-none select-none object-cover" draggable={false} />
      <div
        ref={topRun}
        className="chain-run"
        aria-hidden
        style={{ left: pct(G.capL, G.w), width: pct(G.capR - G.capL, G.w), top: pct(G.top.y, G.h), height: pct(G.top.h, G.h), backgroundImage: "url(/images/chain-top-tile.png)" }}
      />
      <div
        ref={botRun}
        className="chain-run"
        aria-hidden
        style={{ left: pct(G.capL, G.w), width: pct(G.capR - G.capL, G.w), top: pct(G.bot.y, G.h), height: pct(G.bot.h, G.h), backgroundImage: "url(/images/chain-bottom-tile.png)" }}
      />

      <button type="button" className="chain-arrow left-[1.5%]" aria-label="Previous photos" onClick={() => api.current.step(-1)}>
        ‹
      </button>
      <button type="button" className="chain-arrow right-[1.5%]" aria-label="Next photos" onClick={() => api.current.step(1)}>
        ›
      </button>
    </div>
  );
}
