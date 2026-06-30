const ROSTER_DATA_PATH = '../assets/data/primetime-players.json';
const PLAYER_ASSET_ROOT = '../assets/players/';

function rosterEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function imagePathFor(player) {
  return `${PLAYER_ASSET_ROOT}${player.image}`;
}

function buildPlayerCard(player) {
  const card = rosterEl('article', 'player-card');
  const profilePath = player.slug === 'romina-alexandra-trevino'
    ? '../players/romina-trevino.html'
    : `../players/${player.slug}.html`;

  const s = player.stats || {};
  const hasStats = s.AVG !== undefined;

  const statTiles = hasStats ? `
    <div class="player-stat-label">Season 2026 Batting</div>
    <div class="player-stat-grid">
      <div class="player-stat"><strong>${s.AVG ?? '—'}</strong><span>AVG</span></div>
      <div class="player-stat"><strong>${s.OBP ?? '—'}</strong><span>OBP</span></div>
      <div class="player-stat"><strong>${s.OPS ?? '—'}</strong><span>OPS</span></div>
      <div class="player-stat"><strong>${s.SB ?? '—'}</strong><span>SB</span></div>
    </div>
    <p class="player-note">${s.GP ?? '—'} GP &bull; ${s.H ?? '—'} H &bull; ${s.RBI ?? '—'} RBI &bull; ${s.R ?? '—'} R</p>` : '';

  card.innerHTML = `
    <div class="player-photo">
      <span class="player-watermark">${player.number}</span>
      <img src="${imagePathFor(player)}" alt="${player.name}" class="player-photo-img" loading="lazy">
      <i class="ti ti-user-circle"></i>
      <span class="player-photo-coming">Player Image Coming Soon</span>
      <div class="jersey-badge">#${player.number}</div>
    </div>
    <div class="player-body">
      <h3 class="player-name">${player.name}</h3>
      <div class="player-status"><span class="status-dot"></span> Active Roster</div>
      ${statTiles}
      <div class="player-divider" style="margin-top:16px;"></div>
      <a href="${profilePath}" class="player-profile-link"><i class="ti ti-id"></i> View Player Profile</a>
    </div>`;

  const img = card.querySelector('img.player-photo-img');
  img.addEventListener('load', () => img.closest('.player-photo').classList.add('has-player-image'));
  img.addEventListener('error', () => img.remove());
  return card;
}

async function loadRoster() {
  const root = document.querySelector('[data-roster-grid]');
  if (!root) return;
  const response = await fetch(`${ROSTER_DATA_PATH}?v=${Date.now()}`, { cache: 'no-store' });
  const players = await response.json();
  root.replaceChildren(...players.map(buildPlayerCard));
  window.dispatchEvent(new CustomEvent('primetime-roster-rendered'));
}

document.addEventListener('DOMContentLoaded', loadRoster);
