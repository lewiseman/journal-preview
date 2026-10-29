import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reducedMotion } from "./scroll";

gsap.registerPlugin(ScrollTrigger);

export const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Buttons that lean toward the pointer. */
export function useMagnet(strength = 0.3) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer || reducedMotion) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * strength,
        y: (e.clientY - r.top - r.height / 2) * strength,
        duration: 0.4,
        ease: "power3.out",
      });
    };
    const leave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return ref;
}

/* Fades `.reveal` children up as the section scrolls into view. */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".reveal");
      if (reducedMotion) return gsap.set(items, { opacity: 1, y: 0 });
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          }),
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
}
