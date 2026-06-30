const currentPath = window.location.pathname;
const currentFile = currentPath.split('/').pop() || 'index.html';
const isHomePage = currentFile === 'index.html' || currentFile === '';
const isPlayerPage = currentPath.includes('/players/');
const isRosterPage = currentPath.includes('/roster/');
const sitePrefix = isPlayerPage || isRosterPage ? '../' : '';
const assetPrefix = sitePrefix;

const NAV_LINKS = [
  ['HOME', `${sitePrefix}index.html#home`, 'home'],
  ['Team Info', `${sitePrefix}index.html#team-info`, 'team-info'],
  ['Roster', `${sitePrefix}roster/`, 'roster'],
  ['Schedule', `${sitePrefix}index.html#schedule`, 'schedule'],
  ['NCS Dashboard', `${sitePrefix}ncs-tracker/`, 'ncs-dashboard'],
  ['Fundraising', `${sitePrefix}index.html#fundraising`, 'fundraising'],
];

const NAV_HTML = `
<nav>
  <div class="nav-inner">
    <a class="nav-brand" href="${sitePrefix}index.html#home">
      <span style="font-size:22px;line-height:1;color:#D4A017;">★</span>
      Primetime <span>FASTPITCH</span>
    </a>
    <div class="nav-links">
      ${NAV_LINKS.map(([label, href, id]) => `<a href="${href}" data-anchor-id="${id}">${label}</a>`).join('')}
    </div>
  </div>
</nav>`;

function setActiveAnchor() {
  const activeId = isRosterPage || isPlayerPage ? 'roster' : (window.location.hash || '#home').replace('#', '');
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.anchorId === activeId);
  });
}

function loadScriptOnce(src, datasetKey) {
  if (document.querySelector(`script[data-${datasetKey}]`)) return;
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  script.dataset[datasetKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = 'true';
  document.head.appendChild(script);
}

function loadPlayerImageData() {
  loadScriptOnce(`${assetPrefix}assets/js/player-image-data.js`, 'primetime-player-images');
}

function loadPrimetimeLogo() {
  loadScriptOnce(`${assetPrefix}assets/js/primetime-logo.js`, 'primetime-logo');
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  setActiveAnchor();
  loadPlayerImageData();
  loadPrimetimeLogo();
  window.addEventListener('hashchange', setActiveAnchor);
});
