/**
 * Centralized layout: Navbar and Footer.
 * Wrap page content between the two placeholders; Layout injects nav + footer.
 * Single source for the Blog URL (separate repo/site).
 */
(function () {
  var LAYOUT_CONFIG = {
    blogUrl: 'https://blog.peeledonion.in/',
    favicon: 'images/fabicon.svg'
  };

  /** When not file://, set base so relative links resolve from site root (works on subpages and production). */
  function ensureBaseForLinks() {
    if (location.protocol === 'file:') return;
    var existing = document.querySelector('base[href]');
    if (existing) return;
    var base = document.createElement('base');
    base.href = '/';
    document.head.insertBefore(base, document.head.firstChild);
  }

  function injectFavicon() {
    var href = LAYOUT_CONFIG.favicon;
    var existing = document.querySelector('link[rel="icon"]');
    if (existing) {
      existing.href = href;
      existing.type = 'image/svg+xml';
    } else {
      var link = document.createElement('link');
      link.rel = 'icon';
      link.href = href;
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    }
  }

  /** Mockup HTML in one place so each page's HTML file stays small (no duplicated <picture>). */
  var MOCKUP_HTML =
    '<picture>' +
    '<source type="image/avif" srcset="images/pos-mockup.avif">' +
    '<source type="image/webp" srcset="images/pos-mockup.webp">' +
    '<img src="images/pos-mockup.avif" alt="PeeledOnion restaurant billing and POS software dashboard showing orders, menu items, and bill details" loading="lazy" decoding="async" width="1200" height="800" class="hero__preview-img">' +
    '</picture>';

  function getNavHTML() {
    var blogUrl = LAYOUT_CONFIG.blogUrl;
    return (
      '<header class="navbar" role="banner">' +
      '<div class="container navbar__inner">' +
      '<a href="index.html" class="navbar__logo" aria-label="PeeledOnion Home"><img src="images/logo.png" alt="PeeledOnion" class="navbar__logo-img" width="160" height="36"></a>' +
      '<button type="button" class="navbar__toggle" aria-label="Open menu" aria-expanded="false" aria-controls="navbar__menu">' +
      '<span class="icon icon-menu icon--lg" aria-hidden="true"></span></button>' +
      '<nav id="navbar__menu" class="navbar__menu" role="navigation" aria-label="Main navigation">' +
      '<ul class="navbar__links">' +
      '<li><a href="features.html" class="navbar__link">Features</a></li>' +
      '<li><a href="pricing.html" class="navbar__link">Pricing</a></li>' +
      '<li><a href="' + blogUrl + '" class="navbar__link" target="_blank" rel="noopener noreferrer">Blogs</a></li>' +
      '</ul>' +
      '<div class="navbar__cta navbar__cta--mobile">' +
      '<a href="https://peeledonion.in/app/login" class="navbar__link" target="_blank" rel="noopener noreferrer">Login</a>' +
      '<a href="https://peeledonion.in/app/signup" class="btn btn--primary btn--w-full" target="_blank" rel="noopener noreferrer">Get started</a>' +
      '</div>' +
      '</nav>' +
      '<div class="navbar__cta navbar__cta--desktop">' +
      '<a href="https://peeledonion.in/app/login" class="navbar__link" target="_blank" rel="noopener noreferrer">Login</a>' +
      '<a href="https://peeledonion.in/app/signup" class="btn btn--primary" target="_blank" rel="noopener noreferrer">Get started</a>' +
      '</div>' +
      '</div>' +
      '</header>'
    );
  }

  function getFooterHTML() {
    var blogUrl = LAYOUT_CONFIG.blogUrl;
    return (
      '<footer class="footer" role="contentinfo">' +
      '<div class="container">' +
      '<div class="footer__grid">' +
      '<div class="footer__brand">' +
      '<img src="images/logo.png" alt="PeeledOnion" class="footer__logo-img" width="140" height="32" loading="lazy">' +
      '<p>Free, cloud-based restaurant billing and POS software for Indian restaurants, cafes, bakeries, cloud kitchens and QSRs.</p>' +
      '<p>📍 India · <a href="mailto:support@peeledonion.in">support@peeledonion.in</a></p>' +
      '</div>' +
      '<div>' +
      '<p class="footer__heading">Product</p>' +
      '<ul class="footer__links">' +
      '<li><a href="features.html">Features</a></li>' +
      '<li><a href="pricing.html">Pricing</a></li>' +
      '<li><a href="' + blogUrl + '" target="_blank" rel="noopener noreferrer">Blogs</a></li>' +
      '<li><a href="about.html">About</a></li>' +
      '</ul>' +
      '</div>' +
      '<div>' +
      '<p class="footer__heading">Support &amp; Legal</p>' +
      '<ul class="footer__links">' +
      '<li><a href="contact.html">Contact</a></li>' +
      '<li><a href="mailto:support@peeledonion.in">Email support</a></li>' +
      '<li><a href="privacy-policy.html">Privacy Policy</a></li>' +
      '<li><a href="terms.html">Terms</a></li>' +
      '</ul>' +
      '</div>' +
      '<div>' +
      '<p class="footer__heading">Resources</p>' +
      '<ul class="footer__links">' +
      '<li><a href="restaurant-billing-software.html">Restaurant Billing Software</a></li>' +
      '<li><a href="restaurant-pos-billing.html">Restaurant POS Billing</a></li>' +
      '<li><a href="gst-billing-software.html">GST Billing Software</a></li>' +
      '<li><a href="inventory-management.html">Inventory Management</a></li>' +
      '<li><a href="mobile-restaurant-billing-software.html">Mobile Restaurant Billing Software</a></li>' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '<div class="footer__bottom">' +
      '<span>© <span id="current-year"></span> PeeledOnion. All rights reserved.</span>' +
      '<span>Made in India</span>' +
      '</div>' +
      '</div>' +
      '</footer>'
    );
  }

  function attachMenuToggle(container) {
    if (!container) return;
    var btn = container.querySelector('.navbar__toggle');
    var menu = document.getElementById('navbar__menu');
    var backdrop = container.querySelector('.navbar__backdrop');
    if (!btn || !menu) return;
    function setMenuOpen(isOpen) {
      menu.classList.toggle('is-open', isOpen);
      if (container) container.classList.toggle('is-menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      btn.setAttribute('aria-expanded', isOpen);
      var iconEl = btn.querySelector('.icon');
      if (iconEl) iconEl.className = 'icon icon--lg ' + (isOpen ? 'icon-close' : 'icon-menu');
      btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }
    btn.addEventListener('click', function () {
      setMenuOpen(!menu.classList.contains('is-open'));
    });
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setMenuOpen(false);
      });
    }
  }

  function injectMockup() {
    var previews = document.querySelectorAll('.hero__preview');
    for (var i = 0; i < previews.length; i++) {
      if (!previews[i].querySelector('picture')) previews[i].innerHTML = MOCKUP_HTML;
    }
  }

  function renderLayout() {
    ensureBaseForLinks();
    injectFavicon();
    var navEl = document.getElementById('layout-nav');
    var footerEl = document.getElementById('layout-footer');
    if (navEl) {
      navEl.innerHTML = getNavHTML();
      var backdrop = document.createElement('div');
      backdrop.className = 'navbar__backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      navEl.appendChild(backdrop);
      attachMenuToggle(navEl);
    }
    if (footerEl) footerEl.innerHTML = getFooterHTML();
    injectMockup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderLayout);
  } else {
    renderLayout();
  }
})();
