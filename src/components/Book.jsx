import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PAGES } from "./BookPages";

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────────────────────────────────────────────────────
   Book.jsx: page shell + scroll engine. You rarely need to edit this file;
   pages live in BookPages.jsx, their content in BookFaces.jsx.
─────────────────────────────────────────────────────────────────────── */

const DEBUG = false; // true → shows ScrollTrigger start/end markers
const OPEN = 1; // timeline units spent scaling the book in before the cover opens
const HOLD = 0.6; // units to rest on the last spread
const SCROLL_PER_UNIT = 0.8; // viewport heights of scroll per unit (1 unit = 1 page turn)

const COVER_CLASS = {
  "cover-front": "book__cover book__cover--front",
  "cover-back": "book__cover book__cover--back",
};

/* ── markup ──────────────────────────────────────────────────────────── */

function Page({ def, index }) {
  const isCover = !!def.type;
  const n = (index - 1) * 2; // folio base for ruled pages

  return (
    <div
      className={`page book__page ${COVER_CLASS[def.type] ?? ""}`}
      data-page={def.id}
      style={{ "--page-index": index + 1 }}
    >
      <div className="page__half page__half--front">
        <div className="page__content">
          {def.front}
          {!isCover && <span className="page__number">{n + 1}</span>}
        </div>
      </div>
      <div className="page__half page__half--back">
        <div className="page__content">
          {def.back}
          {!isCover && <span className="page__number">{n + 2}</span>}
        </div>
      </div>
    </div>
  );
}

/* ── timeline ────────────────────────────────────────────────────────── */

// Adds one page's reveal + flip to the master timeline.
function addPage(master, el, i, last) {
  const def = PAGES[i];
  const parts = {
    page: el,
    front: el.querySelector(".page__half--front"),
    back: el.querySelector(".page__half--back"),
    q: gsap.utils.selector(el),
  };

  const restZ = i === 0 ? 13 : -i; // stack depth while closed
  gsap.set(el, { z: restZ });

  // front uncovered while the previous page turns
  if (def.onReveal && i > 0) {
    const reveal = gsap.timeline({ defaults: { ease: "none" } });
    def.onReveal(reveal, parts);
    master.add(reveal, OPEN + i - 1);
  }

  if (i === last) return; // back cover stays put

  const flip = gsap
    .timeline({ defaults: { ease: "none" } })
    .fromTo(el, { rotateY: 0 }, { rotateY: -(180 - i / 2), duration: 1 }, 0)
    .fromTo(el, { z: restZ }, { z: i === 0 ? -13 : i, duration: 0.5 }, 0);

  // keep the open spread centred on screen
  if (i === 0)
    flip.fromTo(".book", { xPercent: 0 }, { xPercent: 50, duration: 1 }, 0);

  def.onFlip?.(flip, parts);
  master.add(flip, OPEN + i);
}

// Must run inside gsap.context so '.book' / '.book__page' are scoped to this section.
function buildTimeline() {
  const els = gsap.utils.toArray(".book__page");
  const master = gsap.timeline({ paused: true, defaults: { ease: "none" } });

  master.fromTo(".book", { scale: 0.55 }, { scale: 1, duration: OPEN }, 0);
  els.forEach((el, i) => addPage(master, el, i, els.length - 1));
  master.to({}, { duration: HOLD });

  return master;
}

/* ── component ───────────────────────────────────────────────────────── */

export default function Book() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const master = buildTimeline();

      ScrollTrigger.create({
        animation: master,
        trigger: root.current,
        start: "top top",
        end: () =>
          `+=${master.duration() * window.innerHeight * SCROLL_PER_UNIT}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        markers: DEBUG,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="book" ref={root}>
      <div className="book">
        <div className="book__spine" />
        {PAGES.map((def, i) => (
          <Page key={def.id} def={def} index={i} />
        ))}
      </div>
    </section>
  );
}
