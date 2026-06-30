(() => {
  const nestedPage = /\/(players|roster)\//.test(window.location.pathname);
  const logoSrc = `${nestedPage ? '../' : ''}assets/primetime-logo.svg`;
  const STYLE_ID = 'primetime-logo-global-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .primetime-page .nav-brand { display:inline-flex; align-items:center; }
      .primetime-nav-logo {
        width:44px;
        height:44px;
        object-fit:contain;
        display:inline-block;
        margin-right:9px;
        filter:drop-shadow(0 5px 14px rgba(212,160,23,.38));
      }
      .primetime-hero-logo {
        display:block;
        width:min(300px,64vw);
        height:auto;
        object-fit:contain;
        margin:0 auto 18px;
        filter:drop-shadow(0 18px 46px rgba(212,160,23,.48));
      }
      .primetime-footer-logo {
        display:block;
        width:72px;
        height:72px;
        object-fit:contain;
        margin:0 auto 10px;
        filter:drop-shadow(0 10px 26px rgba(212,160,23,.38));
      }
      .primetime-page .hero-inner > div:first-child:not(.hero-kicker):not(.profile-kicker),
      .primetime-page .hero-inner > div:first-child[style*="font-size:56px"] {
        display:none !important;
      }
      @media(max-width:560px){
        .primetime-nav-logo{width:35px;height:35px;margin-right:6px;}
        .primetime-hero-logo{width:min(245px,76vw);}
        .primetime-footer-logo{width:60px;height:60px;}
      }
    `;
    document.head.appendChild(style);
  }

  function makeLogo(className, alt = 'Primetime Fastpitch logo') {
    const img = document.createElement('img');
    img.src = logoSrc;
    img.alt = alt;
    img.className = className;
    return img;
  }

  function applyNavLogo() {
    document.querySelectorAll('.nav-brand').forEach(brand => {
      if (brand.querySelector('.primetime-nav-logo')) return;
      const star = Array.from(brand.children).find(child => child.textContent && child.textContent.trim() === '★');
      const logo = makeLogo('primetime-nav-logo', 'Primetime Fastpitch');
      if (star) star.replaceWith(logo);
      else brand.prepend(logo);
    });
  }

  function applyHeroLogo() {
    document.querySelectorAll('.hero-inner, .profile-hero').forEach(hero => {
      if (hero.querySelector('.primetime-hero-logo')) return;
      hero.prepend(makeLogo('primetime-hero-logo'));
    });
  }

  function applyFooterLogo() {
    document.querySelectorAll('.footer-brand').forEach(footerBrand => {
      if (footerBrand.querySelector('.primetime-footer-logo')) return;
      footerBrand.prepend(makeLogo('primetime-footer-logo'));
      footerBrand.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace('★', '').trimStart();
      });
    });
  }

  function applyPrimetimeLogo() {
    injectStyles();
    applyNavLogo();
    applyHeroLogo();
    applyFooterLogo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPrimetimeLogo);
  } else {
    applyPrimetimeLogo();
  }

  window.addEventListener('primetime-player-profile-rendered', applyPrimetimeLogo);
  window.addEventListener('primetime-roster-rendered', applyPrimetimeLogo);
})();
