(() => {
  const FACEBOOK_PROFILE = 'https://www.facebook.com/profile.php?id=61562686006736';
  const FACEBOOK_PHOTOS = 'https://www.facebook.com/profile.php?id=61562686006736&sk=photos';
  const FACEBOOK_REELS = 'https://www.facebook.com/profile.php?id=61562686006736&sk=reels_tab';

  function fallbackMarkup(label, url) {
    return `
      <div class="home-social-fallback">
        <div>
          <i class="ti ti-brand-facebook"></i>
          <strong>${label}</strong>
          <p>Facebook will load this embedded viewer when permissions allow it. If the viewer is blocked, open the profile directly.</p>
          <a class="home-social-btn" href="${url}" target="_blank" rel="noopener noreferrer">Open ${label} <i class="ti ti-external-link"></i></a>
        </div>
      </div>`;
  }

  function facebookViewer(containerId, url, label) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const iframe = document.createElement('iframe');
    iframe.className = 'home-social-facebook-frame';
    iframe.title = `Primetime Facebook ${label}`;
    iframe.loading = 'lazy';
    iframe.src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK_PROFILE)}&tabs=timeline&width=500&height=560&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
    iframe.setAttribute('allowfullscreen', 'true');

    container.innerHTML = fallbackMarkup(label, url);
    container.prepend(iframe);
  }

  facebookViewer('primetime-facebook-photos-embed', FACEBOOK_PHOTOS, 'Photos');
  facebookViewer('primetime-facebook-reels-embed', FACEBOOK_REELS, 'Reels');
})();
