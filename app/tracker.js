// Progress state for the Leonida trophy tracker: the earned trophy ids live in
// localStorage, and can be exported to a file and imported back.
const KEY = 'leonida-trophy-progress-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw);
    return new Set(Array.isArray(ids) ? ids.filter((n) => Number.isInteger(n)) : []);
  } catch {
    return new Set();
  }
}

export function saveProgress(earned) {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function exportProgress(earned) {
  const payload = { game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export function parseImport(text) {
  const data = JSON.parse(text);
  const ids = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(ids)) throw new Error('not a progress file');
  return new Set(ids.filter((n) => Number.isInteger(n)));
}
