import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PAGES } from "./BookPages";
import { CHAPTERS } from "../site";
import { finePointer } from "../hooks";
import { reducedMotion, scrollTo } from "../scroll";

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────────────────────────────────────────────────────
   Book.jsx: page shell + scroll engine. You rarely need to edit this file;
   pages live in BookPages.jsx, their content in BookFaces.jsx and the
   captions in site.js.
─────────────────────────────────────────────────────────────────────── */

const DEBUG = false; // true → shows ScrollTrigger start/end markers
const OPEN = 1; // timeline units spent scaling the book in before the cover opens
const HOLD = 0.8; // units to rest on the last spread
const SCROLL_PER_UNIT = 0.75; // viewport heights of scroll per unit (1 unit = 1 page turn)

const COVER_CLASS = {
  "cover-front": "book__cover book__cover--front",
  "cover-back": "book__cover book__cover--back",
};

// Timeline position where chapter `i` sits fully open.
const chapterTime = (i) => (i === 0 ? OPEN * 0.85 : OPEN + i);
const chapterAt = (t) =>
  t < OPEN + 0.5 ? 0 : Math.min(CHAPTERS.length - 1, Math.floor(t - OPEN + 0.5));

/* ── markup ──────────────────────────────────────────────────────────── */

function Page({ def, index, chapter }) {
  return (
    <div
      className={`page book__page ${COVER_CLASS[def.type] ?? ""}`}
      data-page={def.id}
      style={{ "--page-index": index + 1 }}
    >
      <div className="page__half page__half--front" inert={chapter !== index}>
        <div className="page__content">{def.front}</div>
        <span className="page__light" />
      </div>
      <div className="page__half page__half--back" inert={chapter !== index + 1}>
        <div className="page__content">{def.back}</div>
        <span className="page__light" />
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

  const [frontLight, backLight] = [parts.front, parts.back].map((f) =>
    f.querySelector(".page__light"),
  );

  const flip = gsap
    .timeline({ defaults: { ease: "none" } })
    .fromTo(el, { rotateY: 0 }, { rotateY: -(180 - i / 2), duration: 1, ease: "power1.inOut" }, 0)
    .fromTo(el, { z: restZ }, { z: i === 0 ? -13 : i, duration: 0.5 }, 0)
    // the page darkens as it lifts away, then catches the light as it lands
    .fromTo(frontLight, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
    .fromTo(backLight, { opacity: 0.9 }, { opacity: 0, duration: 0.5 }, 0.5);

  // keep the open spread centred on screen
  if (i === 0)
    flip.fromTo(".book", { xPercent: 0 }, { xPercent: 50, duration: 1, ease: "power1.inOut" }, 0);

  def.onFlip?.(flip, parts);
  master.add(flip, OPEN + i);
}

// Must run inside gsap.context so '.book' / '.book__page' are scoped to this section.
function buildTimeline() {
  const els = gsap.utils.toArray(".book__page");
  const master = gsap.timeline({ paused: true, defaults: { ease: "none" } });

  master.fromTo(".book", { scale: 0.62, rotateZ: -4 }, { scale: 1, rotateZ: 0, duration: OPEN, ease: "power2.out" }, 0);
  els.forEach((el, i) => addPage(master, el, i, els.length - 1));
  master.to({}, { duration: HOLD });

  return master;
}

/* ── component ───────────────────────────────────────────────────────── */

export default function Book() {
  const root = useRef(null);
  const tilt = useRef(null);
  const trigger = useRef(null);
  const [chapter, setChapter] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const master = buildTimeline();
      let current = 0;
      master.eventCallback("onUpdate", () => {
        const c = chapterAt(master.time());
        if (c !== current) setChapter((current = c));
      });

      trigger.current = ScrollTrigger.create({
        animation: master,
        trigger: root.current,
        start: "top top",
        end: () => `+=${master.duration() * window.innerHeight * SCROLL_PER_UNIT}`,
        pin: true,
        // no extra lag: the hero hands its sun-born cover over to this
        // book's first frame, and both must be at the same scroll position
        scrub: true,
        invalidateOnRefresh: true,
        markers: DEBUG,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // jump to a chapter (rail buttons + the contents page)
  useEffect(() => {
    const go = (e) => {
      const st = trigger.current;
      if (!st) return;
      const master = st.animation;
      const p = chapterTime(e.detail) / master.duration();
      scrollTo(st.start + p * (st.end - st.start) + 2);
    };
    window.addEventListener("book:goto", go);
    return () => window.removeEventListener("book:goto", go);
  }, []);

  // the whole book leans gently toward the pointer
  useEffect(() => {
    const el = root.current;
    if (!finePointer || reducedMotion) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.current.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
      const cover = el.querySelector(".cover-art");
      cover?.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
      cover?.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
    };
    const leave = () => (tilt.current.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const c = CHAPTERS[chapter];
  const goto = (i) => window.dispatchEvent(new CustomEvent("book:goto", { detail: i }));

  return (
    <section id="book" ref={root} aria-label="A tour of Journal, as a book">
      <div className="book-stage">
        <div className="book-tilt" ref={tilt}>
          <div className="book">
            <div className="book__shadow" />
            <div className="book__spine" />
            {PAGES.map((def, i) => (
              <Page key={def.id} def={def} index={i} chapter={chapter} />
            ))}
          </div>
        </div>
      </div>

      <div className="book__caption" aria-live="polite">
        <div key={c.id} className="caption-in">
          <span className="eyebrow">
            {chapter > 1 ? `Chapter ${String(chapter - 1).padStart(2, "0")} · ` : ""}
            {c.label}
          </span>
          <h3 className="display">{c.title}</h3>
          <p>{c.text}</p>
        </div>
      </div>

      <nav className="book__rail" aria-label="Jump to a chapter">
        {CHAPTERS.map((ch, i) => (
          <button key={ch.id} aria-current={i === chapter} onClick={() => goto(i)}>
            {ch.label}
          </button>
        ))}
      </nav>
    </section>
  );
}
