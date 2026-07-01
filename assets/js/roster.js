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
  attachImageFallback(img);
  return card;
}

// Wire a single player-photo <img> so a broken/missing photo hides the img and
// reveals the "coming soon" placeholder, while a successful load flags the
// wrapper with `has-player-image`. Works for both static and dynamic cards.
function attachImageFallback(img) {
  if (!img) return;
  if (img.complete && img.naturalWidth === 0) {
    img.remove();
    return;
  }
  img.addEventListener('load', () => {
    const wrap = img.closest('.player-photo');
    if (wrap) wrap.classList.add('has-player-image');
  }, { once: true });
  img.addEventListener('error', () => img.remove(), { once: true });
}

async function loadRoster() {
  const root = document.querySelector('[data-roster-grid]');
  if (!root) return;

  // Static-first: if the page shipped pre-rendered cards, wire their images now
  // so photos fall back gracefully even if the JSON fetch never resolves.
  const hasStatic = !!root.querySelector('.player-card');
  if (hasStatic) {
    root.querySelectorAll('.player-card img.player-photo-img').forEach(attachImageFallback);
  }

  try {
    const response = await fetch(`${ROSTER_DATA_PATH}?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const players = await response.json();
    // JSON stays authoritative when it loads cleanly, so future JSON edits show.
    if (!Array.isArray(players) || players.length === 0) {
      throw new Error('Empty or invalid roster data');
    }
    root.replaceChildren(...players.map(buildPlayerCard));
    window.dispatchEvent(new CustomEvent('primetime-roster-rendered'));
  } catch (err) {
    // On any failure, keep static cards if present; only show the error tile
    // when there was nothing pre-rendered to fall back to.
    if (hasStatic) return;
    root.innerHTML = `<div class="doc-item">
      <div class="doc-icon"><i class="ti ti-alert-circle"></i></div>
      <div class="doc-info">
        <div class="doc-name">Could not load roster</div>
        <div class="doc-desc">${err.message || 'Unknown error'}</div>
      </div>
    </div>`;
  }
}

document.addEventListener('DOMContentLoaded', loadRoster);
