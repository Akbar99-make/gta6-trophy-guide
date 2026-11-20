// Leonida Trophy Guide — entrypoint.
//
// Hands the guide in: copies the static app and its screenshots into the
// output directory, then writes the dossier that buildDossier computes
// from those copied files.
//
// Run it from the repository root, for example:
//   MAKEFUN_OUTPUT_DIR=out node main.ts
// With MAKEFUN_OUTPUT_DIR unset the output goes to /output.

import { buildDossier } from './vendor/makefun-frontend.ts';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

// Fresh output: make the directory, then replace the two trees the
// dossier is built from, so a stale file can never leak into the entry.
mkdirSync(outDir, { recursive: true });
for (const tree of ['app', 'screenshots']) {
  const dest = join(outDir, tree);
  rmSync(dest, { recursive: true, force: true });
  cpSync(join(here, tree), dest, { recursive: true });
}

// The caps are the competition's gate: the text is capped at 163,840
// UTF-8 bytes, at most 4 screenshots of 256 KiB each, app/ at most
// 993 entries and 48 MiB, paths at most 1,000 bytes. Only the text cap
// shapes the dossier's bytes; the rest only refuse over-limit input.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 48 * 1024 * 1024,
  app_path_max_bytes: 1000,
});

writeFileSync(join(outDir, 'dossier.json'), dossier);
