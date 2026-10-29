import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { art } from "../site";
import { finePointer } from "../hooks";
import { reducedMotion } from "../scroll";
import { useOwner } from "../owner";
import Stars from "./Stars";

gsap.registerPlugin(ScrollTrigger);

// The sun in night.jpg (natural pixels). The sky is drawn with
// object-fit: cover at object-position 50% 38%, see .hero__sky.
const SKY = { w: 941, h: 1672, posY: 0.38, sunX: 673, sunY: 587, sunR: 56 };

// Starts like ease-in (stays on the painted sun while the disc is small) but
// ends with zero speed, so whatever rides the sun's centre arrives at rest.
const settle = (t) => t ** 4 * (5 - 4 * t);

// Must match the closed book's starting pose in Book.jsx (buildTimeline).
const BOOK_START = { scale: 0.62, rotation: -4 };

// Where the closed book sits when its section reaches the top of the screen,
// relative to the centre of the screen (offsets ignore transforms).
function bookAtStart() {
  const book = document.querySelector("#book .book");
  const section = document.querySelector("#book");
  if (!book || !section) return { x: 0, y: 0, w: 0 };
  let x = 0;
  let y = 0;
  for (let n = book; n && n !== section; n = n.offsetParent) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return {
    x: x + book.offsetWidth / 2 - section.offsetWidth / 2,
    y: y + book.offsetHeight / 2 - section.offsetHeight / 2,
    w: book.offsetWidth,
  };
}

// Where the sun lands inside the hero, in CSS pixels.
function sunOnScreen(box) {
  const s = Math.max(box.width / SKY.w, box.height / SKY.h);
  const ox = (box.width - SKY.w * s) * 0.5;
  const oy = (box.height - SKY.h * s) * SKY.posY;
  return { x: ox + SKY.sunX * s, y: oy + SKY.sunY * s, r: SKY.sunR * s, s };
}

// The app's own stationery, floating around J. z = parallax depth.
const FLOATS = [
  { src: "notes.png", x: 10, y: 22, s: 21, z: 1.3, r: -8, d: 6.5 },
  { src: "flow.png", x: 88, y: 20, s: 20, z: 0.9, r: 6, d: 7.2 },
  { src: "diary.png", x: 8, y: 76, s: 19, z: 1.6, r: 5, d: 5.8 },
  { src: "more_local_qvac.png", x: 90, y: 74, s: 23, z: 1.1, r: -5, d: 6.8 },
  { src: "theme_light.png", x: 32, y: 3, s: 13, z: 0.5, r: 0, d: 8 },
  { src: "theme_dark.png", x: 66, y: 98, s: 13, z: 0.7, r: -10, d: 7.6 },
];

const BODY =
  "Write a little tonight. Journal reads it back to you as a summary, one good question and a goal worth keeping. Quietly, on your phone. Never in the cloud.";

const LINES = [
  "Hi, I'm J!",
  "Your secrets stay with me.",
  "No cloud. Pinky promise.",
  "I work in airplane mode too.",
  "What made you smile today?",
  "Keep scrolling, I'll show you.",
];

export default function Hero() {
  const section = useRef(null);
  const dot = useRef(null);
  const mascot = useRef(null);
  const stage = useRef(null);
  const bubbleRef = useRef(null);
  const [line, setLine] = useState(0);
  const owner = useOwner();

  useLayoutEffect(() => {
    let onMove = null;
    let onRefresh = null;
    const host = section.current;
    const ctx = gsap.context(() => {
      /* ── intro ─────────────────────────────────────────── */
      if (!reducedMotion) {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(mascot.current.querySelector("img"), { scale: 0.2, opacity: 0, rotate: -25, duration: 1.4, ease: "elastic.out(1, 0.55)" }, 0.35)
          .from(".float__p", { scale: 0, opacity: 0, stagger: 0.07, duration: 1, ease: "back.out(2)" }, 0.6)
          .from(bubbleRef.current, { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(3)" }, 1.4);
      }

      /* ── pointer parallax ──────────────────────────────── */
      if (finePointer && !reducedMotion) {
        const layers = gsap.utils.toArray(".float__p").map((el) => ({
          z: +el.dataset.z,
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
        }));
        // the note leans a little toward the cursor
        const note = host.querySelector(".note");
        const nx = gsap.quickTo(note, "rotationY", { duration: 1.2, ease: "power3.out" });
        const ny = gsap.quickTo(note, "rotationX", { duration: 1.2, ease: "power3.out" });
        const mx = gsap.quickTo(mascot.current, "x", { duration: 1, ease: "power3.out" });
        const my = gsap.quickTo(mascot.current, "y", { duration: 1, ease: "power3.out" });
        const mr = gsap.quickTo(mascot.current, "rotation", { duration: 1, ease: "power3.out" });
        onMove = (e) => {
          const px = e.clientX / window.innerWidth - 0.5;
          const py = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(px * 60 * l.z);
            l.y(py * 40 * l.z);
          });
          nx(px * 10);
          ny(-py * 8);
          mx(px * 24);
          my(py * 18);
          mr(px * 10);
        };
        host.addEventListener("pointermove", onMove);
      }

      /* ── scroll: everything drifts away, the sun rises into the book ── */
      // The disc is drawn at its final size (it covers the screen at scale 1)
      // and its texture is the sky image, lined up so the sun fills it exactly.
      const sun = dot.current.querySelector(".hero__sun");
      const fit = () => {
        const box = section.current.getBoundingClientRect();
        const D = Math.hypot(box.width, box.height) * 1.05;
        const k = D / (SKY.sunR * 2);
        gsap.set(dot.current, { width: D, height: D, xPercent: -50, yPercent: -50, top: "50%", left: "50%" });
        gsap.set(sun, {
          backgroundSize: `${SKY.w * k}px ${SKY.h * k}px`,
          backgroundPosition: `${D / 2 - SKY.sunX * k}px ${D / 2 - SKY.sunY * k}px`,
        });
        const p = sunOnScreen(box);
        return { D, x: p.x - box.width / 2, y: p.y - box.height / 2, scale: (p.r * 2) / D };
      };
      let geo = fit();

      // re-measure the sun whenever the layout changes
      // the closed book that comes out of the sun, and where it has to land
      const sunbook = section.current.querySelector(".sunbook");
      const sunbody = sunbook.querySelector(".sunbook__body");
      const place = () => {
        const b = bookAtStart();
        gsap.set(sunbook, { width: b.w, xPercent: -50, yPercent: -50, top: "50%", left: "50%" });
        return b;
      };
      let landing = place();

      onRefresh = () => {
        geo = fit();
        landing = place();
      };
      ScrollTrigger.addEventListener("refreshInit", onRefresh);

      /* ── the app bar logo starts large over the sky, settles into the bar ── */
      const navLogo = document.querySelector(".nav__brand img");
      // as large as fits beside the GitHub and APK buttons
      const bigLogo = () => (window.innerWidth < 420 ? 1.35 : window.innerWidth < 900 ? 1.6 : 2.5);
      gsap.set(navLogo, { transformOrigin: "0% 0%" });

      const out = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=110%",
          // tied straight to the scroll (Lenis already smooths it), so this
          // scene and the book's are always in step at the hand-over
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      out
        .fromTo(navLogo, { scale: bigLogo }, { scale: 1, ease: "power2.inOut", duration: 0.25 }, 0)
        // the note comes unpinned and falls away
        .to(".note__pin", { y: -24, rotation: 30, opacity: 0, duration: 0.12 }, 0.02)
        .to(".note-wrap", { y: 260, rotation: 10, opacity: 0, ease: "power1.in", duration: 0.4 }, 0.04)
        .to(stage.current, { opacity: 0, duration: 0.4 }, 0.15)
        .to(".float", {
          x: (i) => (FLOATS[i].x < 50 ? -1 : 1) * window.innerWidth * 0.45,
          y: (i) => (FLOATS[i].y < 50 ? -1 : 1) * window.innerHeight * 0.3,
          rotation: (i) => (i % 2 ? 40 : -40),
          opacity: 0,
          duration: 0.6,
        }, 0)
        .to(mascot.current, { scale: 0.5, yPercent: -30, duration: 0.45 }, 0.1)
        // the sun swells, and its centre drifts to the middle and settles
        // (so the book riding it arrives at rest, like the real one)
        .fromTo(dot.current, { x: () => geo.x, y: () => geo.y }, { x: 0, y: 0, ease: settle, duration: 0.8 }, 0.2)
        .fromTo(dot.current, { scale: () => geo.scale }, { scale: 1, ease: "power3.in", duration: 0.8 }, 0.2)
        // hidden at rest (the painted sun shows through), fades in once scrolling starts
        .fromTo(dot.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.06)
        .fromTo(".hero__glow", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.25)
        .fromTo(".hero__day", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7)
        // the book rides the sun's centre, slides to its own spot, and only
        // grows once the light is big enough to hold it
        .fromTo(sunbook, { x: () => geo.x, y: () => geo.y }, { x: 0, y: 0, ease: settle, duration: 0.8 }, 0.2)
        .fromTo(sunbody, { x: 0, y: 0 }, { x: () => landing.x, y: () => landing.y, ease: "sine.inOut", duration: 0.4 }, 0.6)
        .fromTo(
          sunbody,
          { scale: 0.05, rotation: -14, opacity: 0 },
          // steady growth that matches the real book's opening speed at the hand-over
          { scale: BOOK_START.scale, rotation: BOOK_START.rotation, opacity: 1, ease: "none", duration: 0.33 },
          0.67,
        )
        .fromTo(".sunbook__halo", { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.75)
        // hand over: the real book is right underneath, identical
        .set(section.current, { autoAlpha: 0 }, 1);
    }, section);


    return () => {
      if (onMove) host.removeEventListener("pointermove", onMove);
      ScrollTrigger.removeEventListener("refreshInit", onRefresh);
      ctx.revert();
    };
  }, []);

  const poke = () => {
    setLine((l) => (l + 1) % LINES.length);
    const img = mascot.current.querySelector("img");
    if (!reducedMotion) {
      gsap
        .timeline()
        .to(img, { scaleX: 1.15, scaleY: 0.85, duration: 0.12, ease: "power2.out" })
        .to(img, { scaleX: 0.92, scaleY: 1.12, y: -26, duration: 0.2, ease: "power2.out" })
        .to(img, { scaleX: 1, scaleY: 1, y: 0, duration: 0.7, ease: "elastic.out(1.2, 0.35)" });
      gsap.fromTo(bubbleRef.current, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
      burst();
    }
  };

  const burst = () => {
    const host = stage.current;
    // little scraps of the app's paper colours
    const colors = ["#f4ead4", "#cfaa62", "#8c9b81", "#d98a7a", "#a796bd"];
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      s.style.background = colors[i % colors.length];
      host.appendChild(s);
      const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const d = 90 + Math.random() * 90;
      gsap.fromTo(
        s,
        { x: 0, y: 0, scale: 0.4, opacity: 1 },
        {
          x: Math.cos(a) * d,
          y: Math.sin(a) * d - 30,
          scale: 0.8 + Math.random(),
          rotation: Math.random() * 360,
          opacity: 0,
          duration: 0.9 + Math.random() * 0.5,
          ease: "power3.out",
          onComplete: () => s.remove(),
        },
      );
    }
  };

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <section id="hero" ref={section}>
      <img className="hero__sky" src={art("night.jpg")} alt="" fetchPriority="high" />
      <Stars className="hero__stars" />
      <div className="hero__shade" />

      <div className="hero__inner wrap">
        <div className="hero__copy">
          <div className="note-wrap">
            <div className="note-bend">
              <article className="note">
                <span className="note__tape" aria-hidden="true" />
                <img className="note__pin" src={art("diary_calendar_pin.png")} alt="" />
                <p className="note__date">{today}</p>
                <h1 className="note__title display">
                  Every day
                  <br />
                  deserves a page.
                </h1>
                <p className="note__body hand">{BODY}</p>
                <p className="note__ps hand">
                  p.s. scroll and watch the sun rise
                  <svg viewBox="0 0 60 70" aria-hidden="true">
                    <path d="M8 6c18 2 34 12 36 28 1 9-4 16-12 16-7 0-9-8-3-11 9-4 20 4 21 18" />
                    <path d="M42 50l9 7 4-11" />
                  </svg>
                </p>
              </article>
            </div>
          </div>
        </div>

        <div className="hero__stage" ref={stage}>
          {FLOATS.map((f, i) => (
            <div
              key={f.src}
              className="float"
              style={{ "--x": `${f.x}%`, "--y": `${f.y}%`, "--s": `${f.s}%`, "--r": `${f.r}deg`, "--d": `${f.d}s`, "--delay": `${-i * 0.9}s` }}
            >
              <div className="float__p" data-z={f.z}>
                <img src={art(f.src)} alt="" />
              </div>
            </div>
          ))}

          <button ref={mascot} className="mascot" onClick={poke} aria-label="Say hello to J, the Journal mascot">
            <span className="mascot__glow" />
            <img src={art("j.png")} alt="" width="638" height="617" />
          </button>

          <div ref={bubbleRef} className="bubble" aria-live="polite">
            {LINES[line]}
          </div>
        </div>
      </div>

      <div className="sunbook" aria-hidden="true">
        <div className="sunbook__body">
          <span className="sunbook__halo" />
          <span className="sunbook__shadow" />
          <div className="sunbook__cover">
            <div className="cover-art" />
            {owner && <span className="cover-name">{owner}</span>}
          </div>
        </div>
      </div>
      <div ref={dot} className="hero__dot" aria-hidden="true">
        <span className="hero__sun" />
        <span className="hero__glow" />
        <span className="hero__day" />
      </div>
    </section>
  );
}
