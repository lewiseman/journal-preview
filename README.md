# Journal · marketing site

The landing page for [Journal](https://github.com/lewiseman/journal): a scroll-driven
tour of the app built from its own artwork (cover, onboarding spreads, mascot and
stationery icons), with React, GSAP, Lenis and Tailwind.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## What's on the page

| Section | File | What it does |
| --- | --- | --- |
| Hero | `src/components/Hero.jsx` | Night sky (canvas stars + the diary header art), J waves and reacts to taps and the pointer, the painted sun grows into the book scene on scroll |
| Book | `src/components/Book.jsx`, `BookPages.jsx`, `BookFaces.jsx` | Pinned page-turning book. Write your name on the cover; the contents page and the chapter rail jump to any spread |
| Inside the app | `src/components/Screens.jsx` | Coverflow of real app screens in phone frames: click, drag/swipe or arrow keys |
| Features | `src/components/Features.jsx` | Ruled index of features, each with a small live demo (photo prints, scan, recall search, Flow, voice, theme picker) |

## Links

All outbound links live in `src/site.js`. The APK button points at

```
https://github.com/lewiseman/journal/releases/latest/download/journal.apk
```

so it works once a GitHub release has an asset named **`journal.apk`** (for example
the `app-release.apk` from `flutter build apk --release`, renamed). Update
`APK.size` there if the build size changes.

## Artwork

Everything in `public/art/` is copied from the app (`journal/assets/images`, plus the
desktop icon). `night.jpg` is `diary_top_bg.png` re-encoded as JPEG. Fonts in
`public/fonts/` are the app's bundled Lora and Caveat (SIL OFL).

## Screenshots

`public/shots/` holds real screens rendered by the app's own widget tests, using
their sample content (no status bar, no debug banner). To refresh them, run the
captures in the `journal` app, which write PNGs to `/tmp`:

```sh
cd ../journal
flutter test test/flow_page_test.dart test/diary_photos_page_test.dart test/diary_search_page_test.dart test/diary_notebook_test.dart test/notes_assistant_test.dart test/diary_assistant_test.dart \
  --dart-define=FLOW_CAPTURES=true --dart-define=DIARY_PHOTO_CAPTURES=true --dart-define=SEARCH_CAPTURES=true --dart-define=NOTEBOOK_CAPTURES=true --dart-define=QVAC_CAPTURES=true
```

Then convert them to 600 × 1300 JPEGs:

| Shot | Source capture |
| --- | --- |
| `diary.jpg` | `/tmp/journal-notebook-light.png`, top 780 × 1688 |
| `photo-story.jpg` | `/tmp/journal-photos-review.png` |
| `flow.jpg` | `/tmp/journal-flow-collection.png` |
| `note-tools.jpg` | `/tmp/journal-qvac-note-menu.png` |
| `talk.jpg` | `/tmp/journal-qvac-diary-menu-today.png` |
| `ask.jpg` | `/tmp/journal-search-light-results.png` |
