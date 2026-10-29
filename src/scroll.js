import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Smooth scrolling, driven by GSAP's ticker so pinned scenes stay in sync.
   Skipped entirely for people who prefer reduced motion. */

export const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

let lenis = null;

export function startSmoothScroll() {
  if (reducedMotion || lenis) return () => {};
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

// Scroll to a pixel offset or a selector.
export function scrollTo(target, { immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, duration: 1.4 });
    return;
  }
  const top =
    typeof target === "number"
      ? target
      : document.querySelector(target)?.getBoundingClientRect().top +
        window.scrollY;
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}
