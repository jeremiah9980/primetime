const PROFILE_DATA_PATH = '../assets/data/primetime-players.json';

const CURRENT_FIELDS = ['AVG', 'OBP', 'SLG', 'OPS', 'H', 'RBI', 'SB', 'SB%'];
const ALL_TIME_FIELDS = ['GP', 'PA', 'AB', 'AVG', 'OBP', 'SLG', 'OPS', 'H', '1B', '2B', '3B', 'HR', 'RBI', 'R', 'BB', 'SO', 'HBP', 'SB', 'SB%', 'CS'];
const CLIP_TAGS = ['GAME CLIP', 'HITS', 'DEFENSE', 'TOP PLAY', 'GAME CLIP', 'HOME RUN', 'TOP PLAY', 'GAME CLIP'];

function profileEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function placeholderStats(fields) {
  return Object.fromEntries(fields.map(field => [field, '—']));
}

function buildHero(player) {
  const hero = profileEl('section', 'profile-hero');
  hero.innerHTML = `
    <div class="profile-kicker">Primetime Fastpitch · Central Texas · 2026</div>
    <h1><span>#${player.number}</span> ${player.name}</h1>
    <div class="profile-role">Rostered Athlete</div>
    <div class="profile-hero-rule"></div>
    <p>${player.name}'s player profile, current GameChanger snapshot, character profile, all-time stats, and highlight clip wall are shown below.</p>`;
  return hero;
}

function buildPhotoCard(player) {
  const card = profileEl('article', 'profile-photo-card');
  card.innerHTML = `
    <span class="profile-photo-watermark">${player.number}</span>
    <i class="ti ti-user-circle"></i>
    <div class="profile-photo-label">
      <strong>Player Image Coming Soon</strong>
      <span class="profile-number-badge">#${player.number}</span>
    </div>`;
  return card;
}

function buildSnapshotPanel(player) {
  const stats = player.stats || placeholderStats(CURRENT_FIELDS);
  const panel = profileEl('article', 'profile-panel');
  const label = profileEl('div', 'profile-section-label', `${player.name.split(' ')[0]} · Player Profile`);
  const h2 = profileEl('h2', '', 'GameChanger Snapshot');
  const p = profileEl('p', '', `Season stats from GameChanger — ${stats.GP || '—'} games played.`);
  const grid = profileEl('div', 'stat-grid');

  CURRENT_FIELDS.forEach(field => {
    const tile = profileEl('div', 'stat-tile');
    tile.innerHTML = `<strong>${stats[field] || '—'}</strong><span>${field}</span>`;
    grid.appendChild(tile);
  });

  panel.append(label, h2, p, grid);
  return panel;
}

function buildCharacter(player) {
  const block = profileEl('section', 'profile-block character-block');
  const inner = profileEl('div', 'profile-block-inner');
  inner.innerHTML = `
    <div class="profile-section-label">Coach Notes</div>
    <h2>Character Profile</h2>
    <div class="character-grid">
      <div class="coach-quote">
        “Coach notes and character profile details for ${player.name} will be added here.”
        <span>Primetime coach profile</span>
      </div>
      <ul class="character-list">
        <li>Coachability notes and player strengths can be added here.</li>
        <li>Team-first habits, effort, and practice notes can be tracked here.</li>
        <li>Development focus and leadership moments can be captured here.</li>
      </ul>
    </div>`;
  block.appendChild(inner);
  return block;
}

function buildAllTimeStats(player) {
  const stats = player.stats || placeholderStats(ALL_TIME_FIELDS);
  const block = profileEl('section', 'profile-block');
  const inner = profileEl('div', 'profile-block-inner');
  const table = profileEl('table', 'stats-table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  thead.innerHTML = `<tr>${ALL_TIME_FIELDS.map(field => `<th>${field}</th>`).join('')}</tr>`;
  tbody.innerHTML = `<tr>${ALL_TIME_FIELDS.map(field => `<td>${stats[field] || '—'}</td>`).join('')}</tr>`;
  table.append(thead, tbody);

  const wrap = profileEl('div', 'stats-table-wrap');
  wrap.appendChild(table);
  inner.innerHTML = `<div class="profile-section-label">Performance</div><h2>All-Time Stats</h2>`;
  inner.appendChild(wrap);
  block.appendChild(inner);
  return block;
}

function buildFilmRoom(player) {
  const block = profileEl('section', 'profile-block film-block');
  const inner = profileEl('div', 'profile-block-inner');
  inner.innerHTML = `
    <div class="film-head">
      <div>
        <div class="profile-section-label">Film Room</div>
        <h2>At The Plate</h2>
        <p>Highlight reel wall for game clips, swings, defensive plays, and player development moments.</p>
      </div>
      <a class="full-folder-link" href="#"><i class="ti ti-folder"></i> Full Folder</a>
    </div>
    <div class="film-filters">
      <button type="button">All</button>
      <button type="button">Home Runs</button>
      <button type="button">Hits</button>
      <button type="button">Doubles</button>
      <button type="button">Defense</button>
    </div>`;

  const clips = profileEl('div', 'clip-grid');
  CLIP_TAGS.forEach((tag, index) => {
    const clip = profileEl('article', 'clip-card');
    clip.innerHTML = `
      <div class="play-dot"><i class="ti ti-player-play-filled"></i></div>
      <div>
        <span class="clip-tag">${tag}</span>
        <h3>Game Clip ${String(index + 1).padStart(2, '0')}</h3>
        <p>${player.name} · Primetime Fastpitch</p>
      </div>`;
    clips.appendChild(clip);
  });

  inner.appendChild(clips);
  block.appendChild(inner);
  return block;
}

function buildFooter() {
  const footer = profileEl('footer', 'profile-footer');
  footer.innerHTML = `
    <h2>Primetime Fastpitch</h2>
    <div class="profile-hero-rule"></div>
    <p>Central Texas · Select Fastpitch Softball · 2026</p>`;
  return footer;
}

async function renderPlayerProfile() {
  const root = document.getElementById('player-profile-root');
  if (!root) return;

  const slug = document.body.dataset.playerSlug;
  const response = await fetch(`${PROFILE_DATA_PATH}?v=${Date.now()}`, { cache: 'no-store' });
  const players = await response.json();
  const player = players.find(item => item.slug === slug) || players[0];

  document.title = `#${player.number} ${player.name} · Primetime Fastpitch`;

  const shell = profileEl('div', 'player-profile-shell');
  shell.appendChild(buildHero(player));

  const main = profileEl('main', 'profile-main');
  const top = profileEl('div', 'profile-top-grid');
  top.append(buildPhotoCard(player), buildSnapshotPanel(player));
  main.append(top, buildCharacter(player), buildAllTimeStats(player), buildFilmRoom(player));

  const back = profileEl('a', 'back-roster', '← Back to Roster');
  back.href = '../index.html#roster';
  main.appendChild(back);

  shell.append(main, buildFooter());
  root.appendChild(shell);
  window.dispatchEvent(new CustomEvent('primetime-player-profile-rendered', { detail: { slug: player.slug } }));
}

document.addEventListener('DOMContentLoaded', renderPlayerProfile);
