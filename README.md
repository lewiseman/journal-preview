# Journal · marketing site

The landing page for [Journal](https://github.com/lewiseman/qvac_hack): a scroll-driven
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

Outbound links live in `src/site.js`; the APK URL comes from generated
`src/release.json`. The download button points at

```
https://github.com/lewiseman/qvac_hack/releases/latest/download/journal-arm64-v8a.apk
```

Every app release publishes the signed split APK as **`journal-arm64-v8a.apk`**, so the download
buttons always resolve to the latest build. The footer links to the latest
release's installation instructions. Downloads support **Android 10+ / ARM64**.
Native libraries are compressed to reduce the download; Android extracts them
on installation. ARM32 and x86_64 are unsupported by the current AI runtime.
An identical `journal.apk` asset preserves older download links.

Download size and version come from `src/release.json`, generated from the actual
verified APK by the app's release script:

```sh
cd ../journal
python3 scripts/release_android.py --publish
cd ../bookflip
npm run build
```

The app source must be committed and pushed before `--publish`. After publishing,
commit and push this website's generated metadata and page changes using the
existing hosting setup. The stable download URL needs no edits for future
versions. See the app's release guide (`docs/android-release.md`) for
signing, OAuth, version increments and build-only previews.

## Artwork

Everything in `public/art/` is copied from the app (`journal/assets/images`, plus the
desktop icon). `night.jpg` is `diary_top_bg.png` re-encoded as JPEG. Fonts in
`public/fonts/` are the app's bundled Lora and Caveat (SIL OFL).

The book uses the phone's seven current papers: Notes, Diary, AI, Flow, People,
Appearance and Sync. Their filenames, order and accessible descriptions live in
`src/book-papers.js`; the contents and chapter rail follow that list. Copy updated
papers from `journal/assets/images/onboarding/` into `public/art/` without changing
their filenames.

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
