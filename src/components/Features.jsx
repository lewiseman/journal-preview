import { useEffect, useState } from "react";
import { art } from "../site";
import { useReveal } from "../hooks";
import { reducedMotion } from "../scroll";
import { Search } from "./Icons";
import TornEdge from "./TornEdge";

// One entry in the ruled index: label, illustration over an ink wash,
// heading, a line of copy and its little live demo.
function Feature({ n, label, icon, wash, title, children, demo }) {
  return (
    <article className="feature reveal">
      <div className="feature__top">
        <span className="feature__label">
          {String(n).padStart(2, "0")} · {label}
        </span>
        <span className="feature__art" style={{ "--wash": wash }}>
          <img src={art(icon)} alt="" />
        </span>
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
      <div className="feature__demo">{demo}</div>
    </article>
  );
}

/* ── little live bits inside the cards ───────────────────────────────── */

const PRINTS = [
  { name: "ai", r: -8, fx: "-80px", cap: "lavender", pos: "74% 30%" },
  { name: "movies", r: 6, fx: "80px", cap: "film night", pos: "76% 42%" },
  { name: "diary", r: -1, fx: "0px", cap: "sunday", pos: "60% 38%" },
];

function Prints() {
  return (
    <div className="prints" aria-hidden="true">
      {PRINTS.map((p) => (
        <figure key={p.name} style={{ "--r": `${p.r}deg`, "--fx": p.fx }}>
          <div style={{ backgroundImage: `url(${art(`${p.name}.webp`)})`, backgroundPosition: p.pos }} />
          <figcaption>{p.cap}</figcaption>
        </figure>
      ))}
    </div>
  );
}

const ASKS = [
  "When did I last feel this calm?",
  "What did I promise Mum in June?",
  "Which books did I love this year?",
  "Why was last Tuesday so good?",
];

function Ask() {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(reducedMotion ? ASKS[0] : "");
  useEffect(() => {
    if (reducedMotion) return;
    const full = ASKS[i];
    let n = 0;
    let hold = 0;
    const t = setInterval(() => {
      if (n <= full.length) setShown(full.slice(0, n++));
      else if (++hold > 40) {
        clearInterval(t);
        setI((v) => (v + 1) % ASKS.length);
      }
    }, 45);
    return () => clearInterval(t);
  }, [i]);
  return (
    <div className="ask" aria-hidden="true">
      <Search />
      <span>
        {shown}
        <span className="demo__caret" />
      </span>
    </div>
  );
}

function ScanDemo() {
  return (
    <div className="scan" aria-hidden="true">
      <div className="scan__page">
        <p className="hand">buy flowers for maya</p>
        <p className="hand">call the plumber (tues)</p>
        <p className="hand">start the novel</p>
        <i className="scan__beam" />
      </div>
      <div className="scan__text">
        <p>Buy flowers for Maya</p>
        <p>Call the plumber (Tues)</p>
        <p>Start the novel</p>
      </div>
    </div>
  );
}

const THOUGHTS = ["what if the café opened earlier?", "call Sam back", "the light at 6pm, again", "a book about rivers"];

function Drift() {
  return (
    <div className="drift" aria-hidden="true">
      {THOUGHTS.map((t, i) => (
        <span key={t} className="hand" style={{ animationDelay: `${i * -2.2}s`, "--x": `${[6, 38, 14, 44][i]}%` }}>
          {t}
        </span>
      ))}
    </div>
  );
}

function Wave() {
  return (
    <div className="wave" aria-hidden="true">
      {Array.from({ length: 34 }, (_, i) => (
        <i
          key={i}
          style={{
            "--h": `${30 + Math.abs(Math.sin(i * 1.7)) * 70}%`,
            animationDelay: `${-i * 0.07}s`,
            backgroundPosition: `${(i / 34) * 100}% 0`,
          }}
        />
      ))}
    </div>
  );
}

const ACCENTS = [
  ["Indigo", "#161658"],
  ["Plum", "#6b3fa0"],
  ["Sage", "#6f8a68"],
  ["Rose", "#c0606f"],
  ["Amber", "#c98a2c"],
];

function Appearance() {
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState(ACCENTS[0][1]);
  return (
    <>
      <div className="swatches" role="group" aria-label="Accent colour">
        {ACCENTS.map(([n, c]) => (
          <button key={n} aria-label={n} aria-pressed={accent === c} style={{ "--c": c }} onClick={() => setAccent(c)} />
        ))}
        <button
          className="ml-auto !w-auto rounded-full !border-0 px-3 text-xs font-extrabold"
          style={{ "--c": dark ? "#f4ead4" : "#17151d", color: dark ? "#17151d" : "#f4ead4" }}
          onClick={() => setDark((d) => !d)}
        >
          {dark ? "Light" : "Dark"}
        </button>
      </div>
      <div
        className="theme-demo"
        style={{ "--td-bg": dark ? "#17151d" : "#faf8fc", "--td-fg": dark ? "#f4ead4" : "#2a1b2f", "--accent": dark && accent === "#161658" ? "#8f8fff" : accent }}
      >
        <img src={art(dark ? "theme_dark.png" : "theme_light.png")} alt="" />
        <div className="flex-1">
          <b>Thursday, 29 October</b>
          <span>Today felt like sunshine.</span>
          <div className="bar" />
        </div>
      </div>
    </>
  );
}

/* ── section ─────────────────────────────────────────────────────────── */

export default function Features() {
  const root = useReveal();
  return (
    <section id="features" ref={root} className="section section--paper">
      <div className="wrap">
        <div className="features">
          <Feature n={1} label="Diary" icon="diary.png" wash="#d98a7a" title="Photo stories" demo={<Prints />}>
            Pick a few photos and get gentle questions about each one. Your answers become a
            scrapbook page.
          </Feature>

          <Feature n={2} label="Notes" icon="notes.png" wash="#8c9b81" title="Notes that tidy themselves" demo={<ScanDemo />}>
            Summaries, tags and next ideas, written on-device. Photograph a handwritten page and it
            becomes text you can edit.
          </Feature>

          <Feature n={3} label="Recall" icon="more_local_qvac.png" wash="#a796bd" title="Ask your journal" demo={<Ask />}>
            Search by meaning, not keywords. Your entries are indexed on the device.
          </Feature>

          <Feature n={4} label="Flow" icon="flow.png" wash="#a796bd" title="Thoughts, caught mid-air" demo={<Drift />}>
            Loose thoughts are saved the moment you have them, even offline. Ask for a one-line
            reflection only when you want one.
          </Feature>

          <Feature n={5} label="Voice" icon="notes_add.png" wash="#cfaa62" title="Talk it out" demo={<Wave />}>
            A hands-free diary conversation with your paired Mac. Speak, pause, and your draft is
            ready to review.
          </Feature>

          <Feature n={6} label="Appearance" icon="more_appearance.png" wash="#8c9b81" title="Yours, down to the ink" demo={<Appearance />}>
            Light, dark or system, with your own accent and font. Try it here.
          </Feature>
        </div>
      </div>
      <TornEdge />
    </section>
  );
}
