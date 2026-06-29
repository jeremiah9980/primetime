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

function loadPlayerImageData() {
  if (document.querySelector('script[data-primetime-player-images]')) return;
  const script = document.createElement('script');
  script.src = `${assetPrefix}assets/js/player-image-data.js`;
  script.defer = true;
  script.dataset.primetimePlayerImages = 'true';
  document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  setActiveAnchor();
  loadPlayerImageData();
  window.addEventListener('hashchange', setActiveAnchor);
});
