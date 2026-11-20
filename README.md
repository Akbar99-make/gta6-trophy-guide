# Leonida Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Akbar99-make/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Akbar99-make/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that tracks every one of the 55 PlayStation 5 trophies in GTA VI, with a step-by-step roadmap to the platinum, clear flags for trophies that can be missed, and a short guide with cited sources for each trophy. Everything runs locally in the browser — no account, no network, no tracking.

## What it covers

- All 55 trophies: 1 platinum, 2 gold, 6 silver, and 46 bronze, with their official names, descriptions, and grades.
- A checklist that remembers your progress in the browser (localStorage), with export and import so you can move it between devices.
- Filters by story, missable, collectibles, activities, and online, plus search and grade filters.
- A spoiler setting that hides story trophies until you earn them.
- A six-stage roadmap to the platinum, from the story through side content to the final cleanup.
- 12 trophies flagged as easy to miss, with a note on when each one can slip past you.
- Every guide cites its sources, so you can check the original write-up yourself.

## How to run it

```sh
cd gta6-trophy-guide
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. The app works fully offline once it is loaded.

To rebuild the screenshots and the submission dossier, run `node render-shots.mjs` and `MAKEFUN_OUTPUT_DIR=out node main.ts`.

## Sources

Trophy names, descriptions, and grades follow the official list shipped with the entry. Guide notes were written from scratch and cite community references such as PowerPyx, PSNProfiles, Exophase, and TrueTrophies — each guide shows its source beside it.

## Bounty

Built for the make.fun bounty "Build the best GTA 6 trophy guide": https://make.fun/bounty/gta6-trophy-guide-01

## License

MIT — see LICENSE.
