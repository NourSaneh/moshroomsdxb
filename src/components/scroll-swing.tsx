"use client";

import { useEffect } from "react";

/**
 * Hanging things swing a little when you scroll — like real photos on chains.
 *
 * Any element with `data-swing` takes part:
 *   data-swing="1"          strength (1 = normal, 0.3 = heavy / hung from two chains)
 *   data-swing-period="1.5" natural period in seconds (light frames swing faster)
 *   data-swing-dir="-1"     push direction, so neighbours swing against each other
 *
 * Each element is a damped pendulum: scroll speed changes kick it, it overshoots, then settles in 2–3 swings.
 * The result is written to the CSS variable `--swing` (used in `rotate:`), so it stacks on top of any tilt
 * or idle sway already on the element. One shared loop; it sleeps when everything is still.
 */
export function ScrollSwing() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type Body = { el: HTMLElement; k: number; c: number; gain: number; angle: number; vel: number };
    const MAX = 4; // degrees
    const ZETA = 0.3; // damping ratio — each swing ~60% smaller: 2–3 visible swings, then still

    let bodies: Body[] = [];
    const collect = () => {
      bodies = [...document.querySelectorAll<HTMLElement>("[data-swing]")].map((el) => {
        const period = parseFloat(el.dataset.swingPeriod || "1.5");
        const w = (2 * Math.PI) / period; // natural angular frequency
        const strength = parseFloat(el.dataset.swing || "1");
        const dir = parseFloat(el.dataset.swingDir || "1");
        return { el, k: w * w, c: 2 * ZETA * w, gain: strength * dir, angle: 0, vel: 0 };
      });
    };
    collect();

    let lastY = window.scrollY; // position at the previous frame (or where the page was when the loop went to sleep)
    let lastSpeed = 0;
    let raf = 0;
    let prev = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = Math.min(0.05, prev ? (now - prev) / 1000 : 1 / 60);
      prev = now;

      // scroll speed in px/s; a CHANGE in speed (starting, stopping, flicking) is what kicks a pendulum
      const y = window.scrollY;
      const speed = (y - lastY) / dt;
      const accel = (speed - lastSpeed) / dt;
      lastY = y;
      lastSpeed = speed;
      const push = Math.max(-1, Math.min(1, accel / 60000)); // normalise a typical flick to ~±1

      let moving = Math.abs(speed) > 1;
      for (const b of bodies) {
        // spring back to rest + damping + the scroll kick
        const a = -b.k * b.angle - b.c * b.vel + push * b.gain * 380;
        b.vel += a * dt;
        b.angle = Math.max(-MAX, Math.min(MAX, b.angle + b.vel * dt));
        if (Math.abs(b.angle) > 0.02 || Math.abs(b.vel) > 0.05) moving = true;
        b.el.style.setProperty("--swing", `${b.angle.toFixed(3)}deg`);
      }

      if (moving) raf = requestAnimationFrame(tick);
      else {
        running = false; // everything is still → sleep until the next scroll (lastY keeps the resting position)
        for (const b of bodies) b.el.style.setProperty("--swing", "0deg");
      }
    };

    const wake = () => {
      if (running || document.hidden) return;
      running = true;
      prev = 0; // first frame measures the jump from the resting position → that's the kick
      lastSpeed = 0;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", collect);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", collect);
    };
  }, []);

  return null;
}
