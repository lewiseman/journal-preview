import {
  CoverFront,
  CoverInside,
  WriteFront,
  OfflineBack,
  SummaryFront,
  WeekBack,
  GoalsFront,
  LifeBack,
  EndFront,
} from "./BookFaces";

/* ───────────────────────────────────────────────────────────────────────
   BookPages.jsx: the page list. Order = book order.
   To add a page: add an object. To remove one: delete it.

   id        unique; also rendered as data-page="<id>" for CSS targeting
   type      'cover-front' | 'cover-back' | omit for a normal ruled page
   front     face on the right-hand side (visible first)
   back      face on the left-hand side (revealed after the turn)

   Optional scrubbed animation hooks. `tl` runs 0 → 1 across one page turn,
   so keep positions inside 0–1. ctx = { q, page, front, back } and
   q('.x') is a selector scoped to this page only.

   onReveal(tl, ctx)  runs while the PREVIOUS page turns (this front is uncovered)
   onFlip(tl, ctx)    runs while THIS page turns (front leaves, back lands left)
─────────────────────────────────────────────────────────────────────── */

export const PAGES = [
  {
    id: "cover",
    type: "cover-front",
    front: <CoverFront />,
    back: <CoverInside />,
    onFlip: (tl, { q }) =>
      tl.from(
        q(".fx"),
        { opacity: 0, y: 16, stagger: 0.15, duration: 0.3 },
        0.55,
      ),
  },
  {
    id: "write",
    front: <WriteFront />,
    back: <OfflineBack />,
    onReveal: (tl, { q }) =>
      tl.from(
        q(".fx"),
        { opacity: 0, y: 14, stagger: 0.18, duration: 0.3 },
        0.3,
      ),
    onFlip: (tl, { q }) =>
      tl.from(
        q(".lock"),
        { scale: 0.5, rotate: -25, opacity: 0, duration: 0.4 },
        0.55,
      ),
  },
  {
    id: "summary",
    front: <SummaryFront />,
    back: <WeekBack />,
    onReveal: (tl, { q }) =>
      tl.from(q(".chip"), { scale: 0, stagger: 0.1, duration: 0.3 }, 0.4),
    onFlip: (tl, { q }) =>
      tl.from(q(".bar"), { scaleY: 0, stagger: 0.03, duration: 0.2 }, 0.55),
  },
  {
    id: "goals",
    front: <GoalsFront />,
    back: <LifeBack />,
    onReveal: (tl, { q }) =>
      tl.from(
        q(".goal__fill"),
        { scaleX: 0, stagger: 0.12, duration: 0.4 },
        0.3,
      ),
    onFlip: (tl, { q }) =>
      tl.from(q(".check"), { scale: 0, stagger: 0.06, duration: 0.2 }, 0.55),
  },
  {
    id: "end",
    type: "cover-back",
    front: <EndFront />,
    back: null,
    onReveal: (tl, { q }) =>
      tl.from(
        q(".cta"),
        { y: 30, opacity: 0, stagger: 0.1, duration: 0.3 },
        0.4,
      ),
  },
];
