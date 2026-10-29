/* ───────────────────────────────────────────────────────────────────────
   BookFaces.jsx: the content of every page side. Pure JSX, no animation.
   Sizes use `cqw` (1% of the page width) so each face scales with the book.
   Add a class (e.g. `.fx`) here, then target it from BookPages.jsx.
─────────────────────────────────────────────────────────────────────── */

export const APP_NAME = "Kumbuka"; // placeholder, rename freely

const Sheet = ({ className = "", children }) => (
  <div className={`page__inner ${className}`}>{children}</div>
);

const H = "font-play text-[7cqw] leading-tight";
const P = "text-[4.2cqw] leading-relaxed";

/* ── front cover ─────────────────────────────────────────────────────── */

export const CoverFront = () => (
  <Sheet className="items-center justify-center gap-[4cqw] text-center text-white">
    <h2 className="font-play text-[13cqw] font-bold leading-none">
      {APP_NAME}
    </h2>
    <p className="text-[4.2cqw] text-white/80">
      Your private journal.
      <br />
      An AI that never leaves your device.
    </p>
  </Sheet>
);

export const CoverInside = () => (
  <Sheet className="items-center justify-center gap-[3cqw] text-center">
    <p className="fx font-play text-[7cqw]">Hello, you.</p>
    <p className="fx max-w-[75%] text-[4cqw] leading-snug">
      This book listens, remembers and summarises. Keep scrolling to turn the
      page.
    </p>
  </Sheet>
);

/* ── writing + offline ───────────────────────────────────────────────── */

export const WriteFront = () => (
  <Sheet className="gap-[3.5cqw]">
    <p className="font-play text-[3.6cqw] text-purple">Wednesday, 28 October</p>
    <h3 className={H}>Write it down.</h3>
    <p className={`fx ${P}`}>
      Shipped the big thing today. Tired, but proud of it.
    </p>
    <p className={`fx ${P}`}>Call Mum. Long walk tomorrow?</p>
    <p className={`fx ${P} text-dark/40`}>{APP_NAME} is listening…</p>
  </Sheet>
);

export const OfflineBack = () => (
  <Sheet className="items-center justify-center gap-[4cqw] text-center">
    <svg
      className="lock w-[22cqw] text-purple"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
    <h3 className={H}>Offline by design.</h3>
    <p className="max-w-[80%] text-[4cqw] leading-snug">
      The AI runs on your device. No account, no cloud, nobody reading over your
      shoulder.
    </p>
  </Sheet>
);

/* ── summaries ───────────────────────────────────────────────────────── */

const TAGS = ["#win", "#family", "#rest"];

export const SummaryFront = () => (
  <Sheet className="gap-[3.5cqw]">
    <h3 className={H}>Your day, distilled.</h3>
    <p className={P}>
      You shipped a milestone, felt proud, and want to reconnect with family.
    </p>
    <ul className="mt-auto flex flex-wrap gap-[2cqw] text-[3.4cqw]">
      {TAGS.map((t) => (
        <li
          key={t}
          className="chip rounded-full bg-purple px-[3cqw] py-[1cqw] text-white"
        >
          {t}
        </li>
      ))}
    </ul>
  </Sheet>
);

const WEEK = [40, 65, 50, 80, 60, 90, 70];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export const WeekBack = () => (
  <Sheet className="gap-[3.5cqw]">
    <h3 className={H}>Your week at a glance.</h3>
    <div className="mt-auto flex h-[38%] items-end gap-[2.5cqw]">
      {WEEK.map((h, i) => (
        <div
          key={i}
          className="bar flex-1 origin-bottom rounded-t-sm bg-purple/80"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
    <div className="flex justify-between text-[3cqw] text-dark/60">
      {DAYS.map((d, i) => (
        <span key={i}>{d}</span>
      ))}
    </div>
  </Sheet>
);

/* ── goals ───────────────────────────────────────────────────────────── */

const GOALS = [
  ["Daily", 80],
  ["Weekly", 55],
  ["Life", 20],
];

export const GoalsFront = () => (
  <Sheet className="gap-[4cqw]">
    <h3 className={H}>Small steps, big arcs.</h3>
    {GOALS.map(([label, v]) => (
      <div key={label}>
        <div className="mb-[1.2cqw] flex justify-between text-[3.8cqw]">
          <span>{label}</span>
          <span>{v}%</span>
        </div>
        <div className="h-[2.4cqw] rounded-full bg-dark/10">
          <div
            className="goal__fill h-full origin-left rounded-full bg-purple"
            style={{ width: `${v}%` }}
          />
        </div>
      </div>
    ))}
  </Sheet>
);

const LIFE = [
  "Run a half marathon",
  "Read 24 books",
  "Learn to sail",
  "Write every single day",
];

export const LifeBack = () => (
  <Sheet className="gap-[4cqw]">
    <h3 className={H}>Things worth chasing.</h3>
    <ul className="flex flex-col gap-[3cqw] text-[4cqw]">
      {LIFE.map((g) => (
        <li key={g} className="flex items-center gap-[3cqw]">
          <span className="check grid size-[6cqw] shrink-0 place-items-center rounded-full bg-purple text-[3.4cqw] text-white">
            ✓
          </span>
          {g}
        </li>
      ))}
    </ul>
  </Sheet>
);

/* ── back cover ──────────────────────────────────────────────────────── */

export const EndFront = () => (
  <Sheet className="items-center justify-center gap-[4cqw] text-center">
    <h3 className={`cta ${H} text-[8cqw]`}>Start your first page.</h3>
    <a
      href="#download"
      className="cta rounded-full bg-purple px-[7cqw] py-[3cqw] text-[4.2cqw] font-bold text-white"
    >
      Get {APP_NAME}
    </a>
    <p className="cta text-[3.2cqw] text-dark/60">
      Free, private, and it works offline.
    </p>
  </Sheet>
);
