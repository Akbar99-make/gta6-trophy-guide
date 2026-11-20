// Render screenshots/ from app/ with headless Chromium, as shots.json lists them:
//   node render-shots.mjs
// Serves app/ on a local port, screenshots each listed view, then stops the server.
// Reads CHROME from the environment, else /opt/meta-chromium/chrome, else chromium.
import { spawn, execFile } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const shots = JSON.parse(readFileSync(join(here, 'shots.json'), 'utf8'));
const chrome = process.env.CHROME ?? (existsSync('/opt/meta-chromium/chrome') ? '/opt/meta-chromium/chrome' : 'chromium');
const port = 8901;

const server = spawn(process.execPath, ['serve.ts', '--port', String(port)], { cwd: here, stdio: 'ignore' });

async function waitForServer(tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/index.html`);
      if (res.ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('server did not start');
}

function shot(file, url, width, height) {
  return new Promise((resolve, reject) => {
    execFile(chrome, [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      `--window-size=${width},${height}`,
      `--screenshot=${join(here, 'screenshots', file)}`,
      '--virtual-time-budget=8000',
      url,
    ], (err, stdout, stderr) => (err ? reject(new Error(stderr || err.message)) : resolve(stdout)));
  });
}

try {
  await waitForServer();
  for (const s of shots) {
    const url = `http://127.0.0.1:${port}${s.path}`;
    await shot(s.file, url, s.viewport.width, s.viewport.height);
    console.log('shot', s.file, url);
  }
} finally {
  server.kill();
}
