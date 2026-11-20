// Rendering for the trophy list, the roadmap and the detail panel. These functions
// only build DOM; all state lives in app.js.
export const GRADE_LABELS = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
export const KIND_LABELS = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' };

function badge(text, cls) {
  const s = document.createElement('span');
  s.className = `badge ${cls}`;
  s.textContent = text;
  return s;
}

function isHidden(t, spoilers, earned) {
  return spoilers && t.kinds.includes('story') && !earned.has(t.id);
}

export function renderRoadmap(introEl, stagesEl, roadmap, activeStage, onStage) {
  introEl.textContent = roadmap.intro;
  stagesEl.replaceChildren();
  for (const stage of roadmap.stages) {
    const li = document.createElement('li');
    if (stage.stage === activeStage) li.classList.add('active');
    const h = document.createElement('h3');
    h.textContent = `Stage ${stage.stage} — ${stage.title}`;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const c = document.createElement('p');
    c.className = 'stageCount';
    c.textContent = `${stage.trophyIds.length} trophies`;
    li.append(h, p, c);
    li.addEventListener('click', () => onStage(stage.stage === activeStage ? null : stage.stage));
    stagesEl.append(li);
  }
}

export function renderList(listEl, trophies, { earned, spoilers, onToggle, onOpen }) {
  listEl.replaceChildren();
  for (const t of trophies) {
    const hidden = isHidden(t, spoilers, earned);
    const card = document.createElement('article');
    card.className = 'card' + (earned.has(t.id) ? ' earned' : '');
    const badges = document.createElement('div');
    badges.className = 'badges';
    badges.append(badge(GRADE_LABELS[t.grade] ?? t.grade, t.grade));
    for (const k of t.kinds) badges.append(badge(KIND_LABELS[k] ?? k, 'kind'));
    if (t.missable) badges.append(badge('Easy to miss', 'missable'));
    const h = document.createElement('h3');
    h.textContent = hidden ? 'Hidden story trophy' : t.name;
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = hidden ? 'Hidden until earned — tick it off to reveal.' : t.description;
    const guide = document.createElement('p');
    guide.className = 'guide';
    guide.textContent = hidden ? '' : (t.guide.length > 160 ? t.guide.slice(0, 157) + '…' : t.guide);
    const meta = document.createElement('div');
    meta.className = 'meta';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', (e) => { e.stopPropagation(); onToggle(t.id, box.checked); });
    const link = document.createElement('span');
    link.textContent = hidden ? 'Guide hidden until earned' : `Guide · Source: ${t.source}`;
    meta.append(box, link);
    card.append(badges, h, desc, guide, meta);
    card.addEventListener('click', (e) => { if (e.target !== box) onOpen(t.id); });
    listEl.append(card);
  }
}

export function renderDetail(bodyEl, t, roadmap) {
  bodyEl.replaceChildren();
  const stage = roadmap.stages.find((s) => s.stage === t.stage);
  const h = document.createElement('h2');
  h.textContent = t.name;
  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(badge(GRADE_LABELS[t.grade] ?? t.grade, t.grade));
  for (const k of t.kinds) badges.append(badge(KIND_LABELS[k] ?? k, 'kind'));
  if (t.missable) badges.append(badge('Easy to miss', 'missable'));
  const official = document.createElement('div');
  const oh = document.createElement('h3');
  oh.textContent = 'Official description';
  const op = document.createElement('p');
  op.textContent = t.description;
  official.append(oh, op);
  const guide = document.createElement('div');
  const gh = document.createElement('h3');
  gh.textContent = 'Guide';
  const gp = document.createElement('p');
  gp.textContent = t.guide;
  guide.append(gh, gp);
  if (t.count) {
    const cp = document.createElement('p');
    cp.textContent = `Target: ${t.count.toLocaleString('en-US')}.`;
    guide.append(cp);
  }
  if (t.missable && t.missableNote) {
    const warn = document.createElement('p');
    warn.className = 'warnBox';
    warn.textContent = t.missableNote;
    guide.append(warn);
  }
  const src = document.createElement('p');
  src.className = 'source';
  src.textContent = 'Source: ';
  const a = document.createElement('a');
  a.textContent = t.source;
  a.href = sourceUrl(t.source);
  a.target = '_blank';
  a.rel = 'noopener';
  src.append(a);
  if (stage) {
    const sp = document.createElement('p');
    sp.textContent = `Roadmap: Stage ${stage.stage} — ${stage.title}.`;
    bodyEl.append(h, badges, official, guide, src, sp);
  } else {
    bodyEl.append(h, badges, official, guide, src);
  }
}

export function sourceUrl(sourceName) {
  if (sourceName.startsWith('PowerPyx')) return 'https://www.powerpyx.com/';
  if (sourceName.startsWith('PSNProfiles')) return 'https://psnprofiles.com/';
  if (sourceName.startsWith('Exophase')) return 'https://www.exophase.com/';
  if (sourceName.startsWith('TrueTrophies')) return 'https://www.truetrophies.com/';
  return 'https://www.powerpyx.com/';
}

export function renderSources(listEl, sources) {
  listEl.replaceChildren();
  for (const s of sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = s.name;
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    li.append(a);
    listEl.append(li);
  }
}
