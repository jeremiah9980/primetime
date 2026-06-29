const currentPath = window.location.pathname;
const currentFile = currentPath.split('/').pop() || 'index.html';
const isHomePage = currentFile === 'index.html' || currentFile === '';
const isPlayerPage = currentPath.includes('/players/');
const anchorPrefix = isPlayerPage ? '../index.html' : (isHomePage ? '' : 'index.html');

const NAV_LINKS = [
  ['HOME', 'home'],
  ['Team Info', 'team-info'],
  ['Roster', 'roster'],
  ['Schedule', 'schedule'],
  ['NCS Tourn Tracker', 'ncs-tourn-tracker'],
  ['Fundraising', 'fundraising'],
];

const NAV_HTML = `
<nav>
  <div class="nav-inner">
    <a class="nav-brand" href="${anchorPrefix}#home">
      <span style="font-size:22px;line-height:1;color:#D4A017;">★</span>
      Primetime <span>FASTPITCH</span>
    </a>
    <div class="nav-links">
      ${NAV_LINKS.map(([label, id]) => `<a href="${anchorPrefix}#${id}" data-anchor-id="${id}">${label}</a>`).join('')}
    </div>
  </div>
</nav>`;

function setActiveAnchor() {
  const activeId = isPlayerPage ? 'roster' : (window.location.hash || '#home').replace('#', '');
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.anchorId === activeId);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  setActiveAnchor();
  window.addEventListener('hashchange', setActiveAnchor);
});
