import { useEffect, useRef, useState } from "react";
import { useReveal } from "../hooks";
import { reducedMotion } from "../scroll";

/* ───────────────────────────────────────────────────────────────────────
   Screens.jsx: real screens from the app, in a coverflow of phones.
   The images are rendered by the app's own widget tests (sample content,
   no status bar), see README. Click a phone, drag or swipe, or use the
   arrow keys; it also turns on its own until someone touches it.
─────────────────────────────────────────────────────────────────────── */

const SHOTS = [
  {
    src: "diary.jpg",
    label: "Diary",
    title: "A page for every day.",
    text: "Write, add photos and pick a mood. Your days stack up like a real notebook.",
  },
  {
    src: "photo-story.jpg",
    label: "Photo stories",
    title: "Photos become stories.",
    text: "Answer a few gentle questions about each photo and keep the moment as a scrapbook page.",
  },
  {
    src: "flow.jpg",
    label: "Flow",
    title: "Catch loose thoughts.",
    text: "Little clouds of thought, saved the moment you have them, even offline.",
  },
  {
    src: "note-tools.jpg",
    label: "Notes",
    title: "Notes that help themselves.",
    text: "Improve, shorten, title and tag a note, or turn a photographed page into text.",
  },
  {
    src: "talk.jpg",
    label: "Voice",
    title: "Talk through your day.",
    text: "Tap the mic and just talk. With your Mac paired, it becomes an entry you can edit.",
  },
  {
    src: "ask.jpg",
    label: "Ask",
    title: "Ask your journal.",
    text: "Search by what you remember, not exact words, and jump back to that day.",
  },
];

const N = SHOTS.length;
const AUTOPLAY_MS = 4800;

// Shortest signed distance from the front phone, so the ring wraps around.
const offsetOf = (i, active) => ((i - active + N + Math.floor(N / 2)) % N) - Math.floor(N / 2);

function pose(o, fanned) {
  if (!fanned) {
    // stacked in a neat pile before the section scrolls in
    return { transform: `translateX(0) translateZ(${-Math.abs(o) * 30}px) rotateZ(${o * 2.5}deg) scale(0.9)`, opacity: Math.abs(o) > 2 ? 0 : 1 };
  }
  const a = Math.abs(o);
  return {
    transform: `translateX(calc(${o} * var(--spread))) translateZ(${-a * 140}px) rotateY(${-o * 24}deg) scale(${1 - Math.min(a, 3) * 0.1})`,
    opacity: a >= 3 ? 0 : 1,
  };
}

export default function Screens() {
  const root = useReveal();
  // the front phone, and the one before it (to spot phones wrapping round)
  const [{ active, last }, setPos] = useState({ active: 0, last: 0 });
  const [fanned, setFanned] = useState(reducedMotion);
  const [auto, setAuto] = useState(!reducedMotion);
  const [drag, setDrag] = useState(0);
  const start = useRef(null);
  const moved = useRef(0); // live drag distance, read on release

  const go = (d) => setPos((p) => ({ active: (p.active + d + N) % N, last: p.active }));
  const pick = (i) => {
    setAuto(false);
    setPos((p) => ({ active: i, last: p.active }));
  };

  // fan out when the section comes into view
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setFanned(true), { threshold: 0.35 });
    io.observe(root.current);
    return () => io.disconnect();
  }, [root]);

  // turn on its own while visible, until someone interacts
  useEffect(() => {
    if (!auto || !fanned) return;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [auto, fanned]);


  const onDown = (e) => {
    start.current = e.clientX;
    moved.current = 0;
  };
  const onMove = (e) => {
    if (start.current === null) return;
    moved.current = e.clientX - start.current;
    setDrag(moved.current);
  };
  const onUp = () => {
    if (start.current === null) return;
    if (Math.abs(moved.current) > 40) {
      setAuto(false);
      go(moved.current < 0 ? 1 : -1);
    }
    start.current = null;
    setDrag(0);
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight") {
      setAuto(false);
      go(1);
    } else if (e.key === "ArrowLeft") {
      setAuto(false);
      go(-1);
    }
  };

  const s = SHOTS[active];

  return (
    <section id="inside" ref={root} className="section section--paper" aria-label="Screens from the app">
      <div className="wrap">
        <p className="inside__eyebrow reveal">Inside the app</p>

        <div
          className="inside__stage"
          style={{ "--drag": `${drag * 0.5}px` }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onUp}
          onKeyDown={onKey}
          onMouseEnter={() => setAuto(false)}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="App screens, use the arrow keys to browse"
        >
          {SHOTS.map((shot, i) => {
            const o = offsetOf(i, active);
            // a phone wrapping round the back of the ring jumps instead of flying across
            const jumped = Math.abs(o - offsetOf(i, last)) > N / 2 - 0.5;
            return (
              <button
                key={shot.src}
                className={`phone ${o === 0 ? "phone--front" : ""}`}
                style={{
                  ...pose(o, fanned),
                  zIndex: 10 - Math.abs(o),
                  transition: jumped ? "none" : undefined,
                  transitionDelay: fanned && !jumped ? `${Math.abs(o) * 40}ms` : undefined,
                }}
                onClick={() => o !== 0 && Math.abs(moved.current) < 5 && pick(i)}
                tabIndex={-1}
                aria-hidden={o !== 0}
                aria-label={o === 0 ? undefined : `Show ${shot.label}`}
              >
                <span className="phone__screen">
                  <img src={`/shots/${shot.src}`} alt={o === 0 ? `${shot.label} screen in Journal` : ""} loading="lazy" draggable="false" />
                </span>
              </button>
            );
          })}
        </div>

        <div className="inside__caption" aria-live="polite">
          <div key={s.src} className="caption-in">
            <h3 className="display">{s.title}</h3>
            <p>{s.text}</p>
          </div>
        </div>

        <div className="inside__tabs" role="tablist" aria-label="Choose a screen">
          <button className="inside__arrow" onClick={() => (setAuto(false), go(-1))} aria-label="Previous screen">
            ←
          </button>
          {SHOTS.map((shot, i) => (
            <button key={shot.src} role="tab" aria-selected={i === active} onClick={() => pick(i)}>
              {shot.label}
            </button>
          ))}
          <button className="inside__arrow" onClick={() => (setAuto(false), go(1))} aria-label="Next screen">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
