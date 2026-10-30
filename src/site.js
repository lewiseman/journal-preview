import release from "./release.json";
import { BOOK_PAPERS } from "./book-papers";

/* ───────────────────────────────────────────────────────────────────────
   site.js: every outbound link and the copy that repeats across sections.
   Change a link here and it updates everywhere.
─────────────────────────────────────────────────────────────────────── */

export const LINKS = {
  // The release script selects the current architecture's permanent download.
  apk: release.downloadUrl,
  github: "https://github.com/lewiseman/qvac_hack",
  releases: "https://github.com/lewiseman/qvac_hack/releases/latest",
};

export const APK = {
  size: `${(release.sizeBytes / 1_000_000).toFixed(1)} MB`,
  platform: "Android",
  version: release.version,
  requirements: "Android 10+ · ARM64",
};

export const art = (name) => `/art/${name}`;

// One entry per spread of the book, in order (cover, then each open spread).
// Keep in step with BookPages.jsx: n pages make n chapters.
export const CHAPTERS = [
  {
    id: "cover",
    label: "Cover",
    title: "A journal that's yours alone.",
    text: "Write your name on the cover. Your cover name stays in this browser. Then scroll to explore the app.",
  },
  {
    id: "contents",
    label: "Contents",
    title: "Seven chapters. One quiet place.",
    text: "Notes, diary, optional local AI, Flow, friends, appearance and Google Drive text sync. Tap a chapter to explore.",
  },
  ...BOOK_PAPERS,
  {
    id: "more",
    label: "And more",
    title: "Start your first page.",
    text: "Free, open source and private by design. Download the APK or read every line on GitHub.",
  },
];
