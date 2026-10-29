import { CoverFront, CoverInside, Contents, Leaf, MoreBack, EndFront } from "./BookFaces";

/* ───────────────────────────────────────────────────────────────────────
   BookPages.jsx: the page list. Order = book order.
   To add a page: add an object. To remove one: delete it (and its chapter
   in site.js, so captions stay in step).

   id        unique; also rendered as data-page="<id>" for CSS targeting
   type      'cover-front' | 'cover-back' | omit for a normal page
   front     face on the right-hand side (visible first)
   back      face on the left-hand side (revealed after the turn)

   Optional scrubbed animation hooks. `tl` runs 0 → 1 across one page turn,
   so keep positions inside 0–1. ctx = { q, page, front, back } and
   q('.x') is a selector scoped to this page only.

   onReveal(tl, ctx)  runs while the PREVIOUS page turns (this front is uncovered)
   onFlip(tl, ctx)    runs while THIS page turns (front leaves, back lands left)

   A spread is (page n back | page n+1 front), so each onboarding spread is
   split across two consecutive pages.
─────────────────────────────────────────────────────────────────────── */

const SPREADS = ["notes", "diary", "ai", "tasks", "birthdays", "movies"];

const pop = (tl, { q }) =>
  tl.from(q(".toc a"), { opacity: 0, x: 12, stagger: 0.05, duration: 0.25 }, 0.45);

export const PAGES = [
  { id: "cover", type: "cover-front", front: <CoverFront />, back: <CoverInside /> },
  { id: "contents", front: <Contents />, back: <Leaf name={SPREADS[0]} side="L" />, onReveal: pop },
  ...SPREADS.map((name, i) => ({
    id: name,
    front: <Leaf name={name} side="R" />,
    back: SPREADS[i + 1] ? <Leaf name={SPREADS[i + 1]} side="L" /> : <MoreBack />,
  })),
  { id: "end", type: "cover-back", front: <EndFront />, back: null },
];
