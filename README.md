# Leonida Trophy Guide — Grand Theft Auto VI

An offline web app that is the best guide and tracker for the 55 PlayStation 5
trophies of Grand Theft Auto VI: every trophy with its official name, description
and grade, a guide in our own words that cites its source, a checklist saved in
the browser (with export and import), filters by kind and grade, a spoiler setting
that hides story trophies until they are earned, and a six-stage roadmap to the
platinum with the missable trophies flagged.

## Run it

```sh
node serve.ts            # http://localhost:8080
node render-shots.mjs    # render screenshots/ (headless Chromium)
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # build the dossier
```

No build step, no network at run time: every file the app loads lives under
`app/`, and it fetches only its own data files (`app/data/trophies.json`,
`app/data/guides.json`, `app/data/roadmap.json`).

## Layout

- `app/index.html` — page shell: header with progress, controls, roadmap, list, detail panel, sources.
- `app/style.css` — the look: a sunset header, grade colours, cards.
- `app/app.js` — bootstrap: loads the three data files, merges them by trophy id, wires the controls and deep links (`?kind=`, `?grade=`, `?stage=`, `?open=`, `?spoilers=`, `?earned=`, `?compact=1` for a checklist-only view).
- `app/tracker.js` — progress state in localStorage, plus export to a file and import back.
- `app/views.js` — rendering for the roadmap, the trophy list and the detail panel.
- `app/data/trophies.json` — the official 55 trophies from the kit's starter (names, descriptions, grades exactly as PlayStation publishes them).
- `app/data/guides.json` — the guides: one per trophy, in our own words, each naming the published guide its facts draw on, with its kind, missable flag, roadmap stage and count target.
- `app/data/roadmap.json` — the six-stage road to the platinum.
- `main.ts` — hands the guide in: copies `app/` and `screenshots/` to `/output` and writes `dossier.json` with the vendored make.fun library.
- `render-shots.mjs` — renders `screenshots/` from `shots.json` with headless Chromium.

## Sources

Guides are written in our own words for this guide. Each one names the published
guide its facts draw on — a source is cited, never copied:

- PowerPyx — GTA 6 Trophy Guide
- PSNProfiles — GTA VI Trophy Guide
- Exophase — GTA VI Trophies
- TrueTrophies — GTA VI Trophy Guide

Trophy names, descriptions and grades are the official PlayStation list. An
unofficial fan guide, not affiliated with Rockstar Games or PlayStation; no
Rockstar logo or official artwork is used.

## License

MIT — see LICENSE.
