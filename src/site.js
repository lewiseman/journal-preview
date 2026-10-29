/* ───────────────────────────────────────────────────────────────────────
   site.js: every outbound link and the copy that repeats across sections.
   Change a link here and it updates everywhere.
─────────────────────────────────────────────────────────────────────── */

export const LINKS = {
  // Attach the APK to a GitHub release as `journal.apk` and this always
  // points at the newest one.
  apk: "https://github.com/lewiseman/journal/releases/latest/download/journal.apk",
  github: "https://github.com/lewiseman/journal",
};

export const APK = { size: "41 MB", platform: "Android" };

export const art = (name) => `/art/${name}`;

// One entry per spread of the book, in order (cover, then each open spread).
// Keep in step with BookPages.jsx: n pages make n chapters.
export const CHAPTERS = [
  {
    id: "cover",
    label: "Cover",
    title: "A journal that's yours alone.",
    text: "Tap the cover and write your name on it. It stays on this device, like everything you put inside. Then scroll to open the book.",
  },
  {
    id: "contents",
    label: "Contents",
    title: "Six chapters. One quiet place.",
    text: "Notes, a diary, an AI that helps you think, tasks, birthdays and movie nights. Tap a chapter to jump to it.",
  },
  {
    id: "notes",
    label: "Notes",
    title: "Catch a thought.",
    text: "Quick notes that summarise, tag and suggest ideas for themselves. Scan a handwritten page and it becomes editable text.",
  },
  {
    id: "diary",
    label: "Diary",
    title: "Keep the moments.",
    text: "A diary with pages you actually turn. Add photos, answer gentle questions about each one, and keep the story as a scrapbook page.",
  },
  {
    id: "ai",
    label: "AI",
    title: "Find your next thought.",
    text: "Daily questions, reflections and suggestions, written on your phone or on your own Mac. Never on someone else's server.",
  },
  {
    id: "tasks",
    label: "Tasks",
    title: "Make room for what matters.",
    text: "A gentler to-do list. Small steps, a little more clarity, one thing at a time.",
  },
  {
    id: "birthdays",
    label: "Birthdays",
    title: "Remember your people.",
    text: "Their special days, held close, with a nudge before each one so you can make a little magic.",
  },
  {
    id: "movies",
    label: "Movies",
    title: "Save your next movie night.",
    text: "Stories to get lost in, all in one place. The film you meant to watch is waiting when you are ready.",
  },
  {
    id: "more",
    label: "And more",
    title: "Start your first page.",
    text: "Free, open source and private by design. Download the APK or read every line on GitHub.",
  },
];
