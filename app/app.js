// Leonida Trophy Guide — bootstrap. Loads the official trophy list, the guides and
// the roadmap, merges them by trophy id, and wires the tracker controls.
// Deep links: ?kind=story&grade=silver&stage=2&open=17&spoilers=1&earned=2,3,4
// (?earned only ticks trophies in memory for a preview; it never saves.)
import { loadProgress, saveProgress, exportProgress, parseImport } from './tracker.js';
import { GRADE_LABELS, renderRoadmap, renderList, renderDetail, renderSources } from './views.js';

const params = new URLSearchParams(location.search);
if (params.get('compact') === '1') document.body.classList.add('compact');
const state = {
  earned: loadProgress(),
  search: '',
  kind: params.get('kind') ?? 'all',
  grade: params.get('grade') ?? 'all',
  spoilers: params.get('spoilers') === '1',
  hideEarned: false,
  stage: params.get('stage') ? Number(params.get('stage')) : null,
  demo: false,
};
const demoEarned = params.get('earned');
if (demoEarned) {
  state.demo = true;
  for (const n of demoEarned.split(',').map(Number)) {
    if (Number.isInteger(n)) state.earned.add(n);
  }
}

const [trophyDoc, guideDoc, roadmapDoc] = await Promise.all([
  fetch('data/trophies.json').then((r) => r.json()),
  fetch('data/guides.json').then((r) => r.json()),
  fetch('data/roadmap.json').then((r) => r.json()),
]);
const guidesById = new Map(guideDoc.guides.map((g) => [g.id, g]));
const trophies = trophyDoc.trophies.map((t) => ({ ...t, ...(guidesById.get(t.id) ?? {}) }));

const $ = (id) => document.getElementById(id);
const listEl = $('list');
const detailEl = $('detail');

function visible(t) {
  if (state.stage && t.stage !== state.stage) return false;
  if (state.kind === 'missable') {
    if (!t.missable) return false;
  } else if (state.kind !== 'all' && !t.kinds.includes(state.kind)) {
    return false;
  }
  if (state.grade !== 'all' && t.grade !== state.grade) return false;
  if (state.hideEarned && state.earned.has(t.id)) return false;
  if (state.search) {
    const q = state.search.toLowerCase();
    const hay = `${t.name} ${t.description} ${t.guide} ${t.source}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function render() {
  const shown = trophies.filter(visible);
  $('countLine').textContent = `Showing ${shown.length} of ${trophies.length} trophies` +
    (state.stage ? ` · roadmap stage ${state.stage}` : '') +
    (state.kind !== 'all' ? ` · ${state.kind}` : '') +
    (state.grade !== 'all' ? ` · ${GRADE_LABELS[state.grade]}` : '');
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const id of state.earned) {
    const t = trophies.find((x) => x.id === id);
    if (t) counts[t.grade] = (counts[t.grade] ?? 0) + 1;
  }
  $('ringText').textContent = `${state.earned.size}/${trophies.length}`;
  $('progressText').textContent = `${state.earned.size} of ${trophies.length} earned · ${Math.round((state.earned.size / trophies.length) * 100)}%`;
  $('gradeText').textContent = `${counts.platinum} platinum · ${counts.gold} gold · ${counts.silver} silver · ${counts.bronze} bronze`;
  renderRoadmap($('roadmapIntro'), $('roadmapStages'), roadmapDoc, state.stage, (stage) => {
    state.stage = stage;
    render();
  });
  renderList(listEl, shown, {
    earned: state.earned,
    spoilers: state.spoilers,
    onToggle: (id, checked) => {
      if (checked) state.earned.add(id);
      else state.earned.delete(id);
      if (!state.demo) saveProgress(state.earned);
      render();
    },
    onOpen: (id) => openDetail(id),
  });
}

function openDetail(id) {
  const t = trophies.find((x) => x.id === id);
  if (!t) return;
  renderDetail($('detailBody'), t, roadmapDoc);
  detailEl.hidden = false;
}

$('search').addEventListener('input', (e) => { state.search = e.target.value.trim(); render(); });
$('kind').value = state.kind;
$('kind').addEventListener('change', (e) => { state.kind = e.target.value; render(); });
$('grade').value = state.grade;
$('grade').addEventListener('change', (e) => { state.grade = e.target.value; render(); });
$('spoilers').checked = state.spoilers;
$('spoilers').addEventListener('change', (e) => { state.spoilers = e.target.checked; render(); });
$('hideEarned').addEventListener('change', (e) => { state.hideEarned = e.target.checked; render(); });
$('export').addEventListener('click', () => exportProgress(state.earned));
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    state.earned = parseImport(await file.text());
    if (!state.demo) saveProgress(state.earned);
    render();
  } catch {
    alert('That file is not a trophy progress export.');
  }
});
$('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies?')) return;
  state.earned = new Set();
  if (!state.demo) saveProgress(state.earned);
  render();
});
$('detailClose').addEventListener('click', () => { detailEl.hidden = true; });

renderSources($('sourceList'), guideDoc.sources);
render();
if (params.get('open')) openDetail(Number(params.get('open')));
