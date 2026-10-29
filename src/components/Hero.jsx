import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMG =
  "https://lumiere-a.akamaihd.net/v1/images/sa_pixar_virtualbg_coco_16x9_9ccd7110.jpeg";

// Where the dot of the "?" sits inside the glyph's bounding box (tweak per font)
const DOT_X = 0.54;
const DOT_Y = 0.73;

export default function Hero() {
  const section = useRef(null);
  const title = useRef(null);
  const sub = useRef(null);
  const mark = useRef(null);
  const dot = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(dot.current, {
        width: "142vmax", // big enough to cover every corner
        height: "142vmax",
        xPercent: -50,
        yPercent: -50,
        top: "50%",
        left: "50%",
      });

      // Start position of the dot = the dot of the "?", relative to section centre
      const origin = (axis) => () => {
        const m = mark.current.getBoundingClientRect();
        const s = section.current.getBoundingClientRect();
        return axis === "x"
          ? m.left - s.left + m.width * DOT_X - s.width / 2
          : m.top - s.top + m.height * DOT_Y - s.height / 2;
      };

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        })
        .to([title.current, sub.current], { opacity: 1, stagger: 0.1 })
        .fromTo(
          dot.current,
          { scale: 0, x: origin("x"), y: origin("y") },
          { scale: 1, x: 0, y: 0, ease: "power3.in" },
        );
    }, section);

    // "?" position depends on the font, so re-measure once fonts are in
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={section}>
      <img className="hero__bg" src={HERO_IMG} alt="" />
      <div className="hero__shade" />

      <h1 ref={title} className="hero__title">
        What did today teach you
        <span ref={mark}>?</span>
      </h1>
      <p ref={sub} className="hero__sub">
        A journal that thinks offline. It turns your days into summaries, and
        your summaries into goals you actually keep.
      </p>

      <span className="hero__hint">Scroll</span>
      <div ref={dot} className="hero__dot" />
    </section>
  );
}
