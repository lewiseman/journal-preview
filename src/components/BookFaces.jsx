/* ───────────────────────────────────────────────────────────────────────
   BookFaces.jsx: the content of every page side. Pure JSX, no animation.
   Sizes use `cqw` (1% of the page width) so each face scales with the book.
   Illustrated leaves are halves of the app's onboarding spreads.
─────────────────────────────────────────────────────────────────────── */

import { art, CHAPTERS, LINKS, APK } from "../site";
import { setOwner, useOwner } from "../owner";
import { Android, GitHub } from "./Icons";

const Sheet = ({ className = "", children }) => (
  <div className={`page__inner ${className}`}>{children}</div>
);

const goto = (i) => (e) => {
  e.preventDefault();
  window.dispatchEvent(new CustomEvent("book:goto", { detail: i }));
};

/* ── illustrated leaves ──────────────────────────────────────────────── */

export const Leaf = ({ name, side }) => (
  <div
    className={`leaf leaf--${side}`}
    style={{ backgroundImage: `url(${art(`${name}.webp`)})` }}
    role="img"
    aria-label={`${name} chapter, ${side === "L" ? "left" : "right"} page`}
  />
);

/* ── front cover ─────────────────────────────────────────────────────── */

export const CoverFront = () => {
  const owner = useOwner();
  return (
    <>
      <div className="cover-art" />
      <input
        className="cover-name"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        placeholder="write your name"
        aria-label="Write your name on the cover"
        maxLength={24}
        spellCheck={false}
        autoComplete="off"
      />
    </>
  );
};

export const CoverInside = () => {
  const owner = useOwner();
  return (
    <Sheet className="items-center justify-center gap-[3cqw] text-center">
      <p className="font-serif text-[3cqw] uppercase tracking-[0.4em] opacity-60">Ex libris</p>
      <img src={art("j.png")} alt="" className="w-[34cqw]" />
      <p className="font-serif text-[4.2cqw] opacity-75">This journal belongs to</p>
      <p className="hand -mt-[1cqw] min-h-[12cqw] text-[11cqw] leading-none text-[#4b2f4f]">
        {owner || "you"}
      </p>
      <span className="h-px w-[40%] bg-[#2a1b2f]/25" />
      <p className="max-w-[78%] text-[3.4cqw] leading-snug opacity-60">
        Everything written here stays on this device. Keep scrolling to turn the page.
      </p>
    </Sheet>
  );
};

/* ── contents ────────────────────────────────────────────────────────── */

const TOC = CHAPTERS.slice(2, 8).map((c, i) => ({ ...c, n: i + 2, page: i * 2 + 1 }));

export const Contents = () => (
  <Sheet className="gap-[1cqw]">
    <p className="font-serif text-[3cqw] uppercase tracking-[0.35em] opacity-60">Journal</p>
    <h3 className="display mt-[2cqw] mb-[4cqw] text-[11cqw]">Contents</h3>
    <nav className="toc" aria-label="Book chapters">
      {TOC.map((c, i) => (
        <a key={c.id} href={`#${c.id}`} onClick={goto(c.n)}>
          <span>
            <em>0{i + 1}</em>
            {c.label}
          </span>
          <b>{c.page}</b>
        </a>
      ))}
      <a href="#more" onClick={goto(8)}>
        <span>
          <em>07</em>And more
        </span>
        <b>13</b>
      </a>
    </nav>
    <p className="hand mt-auto text-[6.5cqw] text-[#6b3fa0]">tap a chapter, or just keep scrolling →</p>
  </Sheet>
);

/* ── and more ────────────────────────────────────────────────────────── */

const MORE = [
  ["Flow", "Loose thoughts, saved instantly. Ask for a one-line reflection when you want one."],
  ["Photo stories", "Gentle questions about each photo, kept as a scrapbook page."],
  ["Scan a page", "Handwritten notes become editable text."],
  ["Ask your journal", "Search by meaning: “when did I last feel this calm?”"],
];

export const MoreBack = () => (
  <Sheet className="gap-[2cqw]">
    <p className="font-serif text-[3cqw] uppercase tracking-[0.35em] opacity-60">Chapter 07</p>
    <h3 className="display text-[9cqw]">
      And so
      <br />
      much more.
    </h3>
    <ul className="mt-[2cqw] flex flex-col gap-[2.8cqw]">
      {MORE.map(([t, d]) => (
        <li key={t} className="flex gap-[2.5cqw]">
          <span className="mt-[2.2cqw] size-[1.6cqw] shrink-0 rounded-full bg-[#cfaa62]" />
          <span>
            <b className="block font-serif text-[4.4cqw] font-medium">{t}</b>
            <span className="block text-[3.3cqw] leading-snug opacity-70">{d}</span>
          </span>
        </li>
      ))}
    </ul>
    <p className="hand mt-auto text-[5.6cqw] opacity-60">a place for you</p>
  </Sheet>
);

/* ── back cover (inside) ─────────────────────────────────────────────── */

export const EndFront = () => {
  const owner = useOwner();
  return (
    <Sheet className="items-center justify-center gap-[3.5cqw] text-center">
      <img src={art("j.png")} alt="" className="w-[30cqw]" />
      <h3 className="display text-[9.5cqw]">
        Start your
        <br />
        first page{owner ? `, ${owner}` : ""}.
      </h3>
      <a
        href={LINKS.apk}
        download
        className="inline-flex items-center gap-[2cqw] rounded-full bg-[#161658] px-[6cqw] py-[3cqw] text-[4.2cqw] font-extrabold text-[#fbf6ea] [&_svg]:size-[5cqw]"
      >
        <Android /> Download APK
      </a>
      <a
        href={LINKS.github}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-[1.5cqw] text-[3.6cqw] font-bold opacity-70 [&_svg]:size-[4cqw] hover:opacity-100"
      >
        <GitHub /> Read every line on GitHub
      </a>
      <p className="text-[3cqw] opacity-50">
        Free · {APK.platform} · {APK.size}
      </p>
    </Sheet>
  );
};
