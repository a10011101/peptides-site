/*!
 * Peptides.site gatekeeper — age gate + research-only disclaimer
 * Version key: peptides_gate_v1
 * Sets localStorage on accept. Redirects to google.com on reject.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'peptides_gate_v1';
  var REJECT_URL = 'https://www.google.com/';

  // Skip on the lead magnet cheatsheet (private link)
  if (/\/lead-magnets\//i.test(location.pathname)) return;

  try {
    if (localStorage.getItem(STORAGE_KEY) === 'accepted') return;
  } catch (e) {
    // localStorage blocked → still show gate every time
  }

  // CSS — mobile-first, then scaled up for desktop
  var css = ''
    // Overlay: full viewport, allow inner scroll on short mobile screens
    + '#pep-gate-overlay{position:fixed;inset:0;background:rgba(15,15,30,.92);'
    + '-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);z-index:2147483647;'
    + 'display:flex;align-items:center;justify-content:center;padding:12px;'
    + 'font-family:"Atkinson Hyperlegible",system-ui,-apple-system,sans-serif;color:#1E1B4B;'
    + 'overflow-y:auto;-webkit-overflow-scrolling:touch}'
    // Modal: mobile-first sizing
    + '#pep-gate-modal{background:#fff;width:100%;max-width:560px;border-radius:14px;'
    + 'padding:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,.4);border:2px solid #EA580C;'
    + 'max-height:calc(100vh - 24px);overflow-y:auto;-webkit-overflow-scrolling:touch;'
    + 'margin:auto}'
    // Headline
    + '#pep-gate-modal h2{font-family:"Crimson Pro",serif;font-size:1.25rem;margin:0 0 8px;color:#EA580C;line-height:1.2}'
    // Lead text
    + '#pep-gate-modal .pep-lead{margin:0 0 14px;font-size:.9rem;line-height:1.5;color:#3f3d5c}'
    // Warning callout
    + '#pep-gate-modal .pep-warn{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;'
    + 'padding:10px 12px;margin:0 0 16px;font-size:.82rem;color:#9a3412;line-height:1.45}'
    // Checkbox labels — big tap targets on mobile
    + '#pep-gate-modal label{display:flex;gap:10px;align-items:flex-start;margin:0 0 10px;'
    + 'padding:14px 12px;background:#f5f6fb;border:1px solid #e5e7f2;border-radius:10px;cursor:pointer;'
    + 'font-size:.88rem;line-height:1.4;transition:background .15s;min-height:44px;'
    + '-webkit-tap-highlight-color:transparent}'
    + '#pep-gate-modal label:active{background:#e5e7f2}'
    + '#pep-gate-modal label:hover{background:#eef0fa}'
    // Checkbox — larger for finger taps
    + '#pep-gate-modal input[type=checkbox]{margin-top:2px;width:22px;height:22px;flex:0 0 auto;'
    + 'accent-color:#EA580C;cursor:pointer}'
    // Button row: stack on mobile, side-by-side on wider
    + '#pep-gate-buttons{display:flex;flex-direction:column;gap:8px;margin-top:16px}'
    // Accept: big touch target, min 48px height
    + '#pep-gate-accept{background:#EA580C;color:#fff;border:0;padding:14px 20px;border-radius:10px;'
    + 'font-weight:700;font-size:1rem;cursor:pointer;font-family:inherit;'
    + 'transition:background .15s,opacity .15s;min-height:48px;width:100%;'
    + '-webkit-tap-highlight-color:transparent}'
    + '#pep-gate-accept:active:not(:disabled){background:#9a3412}'
    + '#pep-gate-accept:hover:not(:disabled){background:#c2410c}'
    + '#pep-gate-accept:disabled{background:#c7c9d5;cursor:not-allowed;opacity:.7}'
    // Reject: same treatment
    + '#pep-gate-reject{background:#fff;color:#4F46E5;border:1.5px solid #4F46E5;'
    + 'padding:12px 20px;border-radius:10px;font-weight:600;font-size:.92rem;cursor:pointer;'
    + 'font-family:inherit;min-height:44px;width:100%;-webkit-tap-highlight-color:transparent}'
    + '#pep-gate-reject:active{background:#e0e7ff}'
    + '#pep-gate-reject:hover{background:#EEF2FF}'
    // Footer link
    + '#pep-gate-modal .pep-foot{margin-top:14px;font-size:.72rem;color:#6b6b85;text-align:center;line-height:1.5}'
    // Cookie consent banner (sits above persistent bar when shown)
    + '#pep-cookie-banner{position:fixed;left:0;right:0;z-index:2147483645;'
    + 'background:#1E1B4B;color:#fff;padding:14px 16px;'
    + 'font-family:"Atkinson Hyperlegible",system-ui,-apple-system,sans-serif;font-size:.85rem;'
    + 'line-height:1.5;border-top:2px solid #4F46E5;box-shadow:0 -4px 20px rgba(0,0,0,.25);'
    + 'display:flex;flex-direction:column;gap:12px;'
    + 'bottom:calc(env(safe-area-inset-bottom,0px) + 34px)}'
    + '#pep-cookie-banner .pep-cb-text{max-width:900px;margin:0 auto;text-align:center}'
    + '#pep-cookie-banner .pep-cb-text a{color:#c7d2fe;text-decoration:underline}'
    + '#pep-cookie-banner .pep-cb-btns{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}'
    + '#pep-cookie-banner button{border:0;padding:11px 22px;border-radius:8px;font-weight:600;'
    + 'font-size:.9rem;cursor:pointer;font-family:inherit;min-height:44px;min-width:110px;'
    + '-webkit-tap-highlight-color:transparent;transition:background .15s}'
    + '#pep-cookie-banner .pep-cb-accept{background:#4F46E5;color:#fff}'
    + '#pep-cookie-banner .pep-cb-accept:hover{background:#3730a3}'
    + '#pep-cookie-banner .pep-cb-reject{background:transparent;color:#fff;border:1.5px solid #c7d2fe}'
    + '#pep-cookie-banner .pep-cb-reject:hover{background:rgba(199,210,254,.15)}'
    + '@media (min-width:720px){#pep-cookie-banner{flex-direction:row;align-items:center;padding:14px 24px}#pep-cookie-banner .pep-cb-text{text-align:left;flex:1}#pep-cookie-banner .pep-cb-btns{flex-shrink:0}}'
    // Persistent bottom bar — mobile-friendly padding
    + '#pep-persistent-bar{position:fixed;bottom:0;left:0;right:0;z-index:2147483646;'
    + 'background:#7f1d1d;color:#fff;padding:8px 12px;text-align:center;font-size:.75rem;'
    + 'font-family:"Atkinson Hyperlegible",system-ui,-apple-system,sans-serif;line-height:1.4;'
    + 'border-top:2px solid #EA580C;box-shadow:0 -2px 12px rgba(0,0,0,.15);'
    + 'padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}'
    + '#pep-persistent-bar strong{color:#fed7aa}'
    + '#pep-persistent-bar a{color:#fed7aa;text-decoration:underline}'
    // Desktop scaling — 600px+
    + '@media (min-width:600px){'
    + '#pep-gate-overlay{padding:20px}'
    + '#pep-gate-modal{padding:32px;border-radius:16px}'
    + '#pep-gate-modal h2{font-size:1.6rem;margin-bottom:10px}'
    + '#pep-gate-modal .pep-lead{font-size:.98rem;margin-bottom:20px}'
    + '#pep-gate-modal .pep-warn{font-size:.9rem;padding:12px 14px;margin-bottom:20px}'
    + '#pep-gate-modal label{font-size:.92rem;padding:12px}'
    + '#pep-gate-modal input[type=checkbox]{width:18px;height:18px}'
    + '#pep-gate-buttons{flex-direction:row;gap:10px;margin-top:20px}'
    + '#pep-gate-accept{flex:1;width:auto}'
    + '#pep-gate-reject{width:auto}'
    + '#pep-persistent-bar{font-size:.85rem;padding:8px 16px}'
    + '}'
    // Very short viewports (landscape phones)
    + '@media (max-height:520px){'
    + '#pep-gate-overlay{align-items:flex-start;padding:8px}'
    + '#pep-gate-modal{max-height:calc(100vh - 16px)}'
    + '#pep-gate-modal h2{font-size:1.1rem}'
    + '#pep-gate-modal .pep-lead{font-size:.85rem;margin-bottom:10px}'
    + '#pep-gate-modal .pep-warn{font-size:.78rem;padding:8px 10px;margin-bottom:10px}'
    + '#pep-gate-modal label{padding:10px;margin-bottom:8px}'
    + '}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // Modal HTML
  var overlay = document.createElement('div');
  overlay.id = 'pep-gate-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'pep-gate-title');
  overlay.innerHTML = ''
    + '<div id="pep-gate-modal">'
    + '<h2 id="pep-gate-title">⚠️ Age & Research Use Confirmation</h2>'
    + '<p class="pep-lead">Peptides.site publishes information about research peptides for '
    + '<strong>educational and laboratory research purposes only</strong>. Nothing on this site is '
    + 'medical advice, a prescription, or a recommendation for human consumption.</p>'
    + '<div class="pep-warn"><strong>⚠ FOR RESEARCH USE ONLY.</strong> The compounds discussed are '
    + 'not approved medicines. They are not for human or veterinary use. Any diagnosis, treatment, '
    + 'or dosing decision must be made by a qualified medical professional.</div>'
    + '<label><input type="checkbox" id="pep-gate-c1"><span>I confirm I am <strong>at least 21 years of age</strong>.</span></label>'
    + '<label><input type="checkbox" id="pep-gate-c2"><span>I understand this content is for <strong>research purposes only</strong> and is <strong>not intended for human consumption</strong>.</span></label>'
    + '<div id="pep-gate-buttons">'
    + '<button id="pep-gate-accept" type="button" disabled>Enter Site</button>'
    + '<button id="pep-gate-reject" type="button">Leave</button>'
    + '</div>'
    + '<div class="pep-foot">By entering, you accept these terms. Consult our <a href="/legal/" style="color:#4F46E5">disclaimer</a> for details.</div>'
    + '</div>';

  function inject() {
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var c1 = overlay.querySelector('#pep-gate-c1');
    var c2 = overlay.querySelector('#pep-gate-c2');
    var accept = overlay.querySelector('#pep-gate-accept');
    var reject = overlay.querySelector('#pep-gate-reject');

    function toggle() {
      accept.disabled = !(c1.checked && c2.checked);
    }
    c1.addEventListener('change', toggle);
    c2.addEventListener('change', toggle);

    accept.addEventListener('click', function () {
      if (accept.disabled) return;
      try { localStorage.setItem(STORAGE_KEY, 'accepted'); } catch (e) {}
      overlay.remove();
      document.body.style.overflow = '';
      // Chain into cookie banner after age gate accepted
      if (typeof window.pepShowCookieBanner === 'function') window.pepShowCookieBanner();
    });

    reject.addEventListener('click', function () {
      location.href = REJECT_URL;
    });
  }

  // Persistent bottom disclaimer (always visible, on every page)
  function injectPersistentBar() {
    if (document.getElementById('pep-persistent-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'pep-persistent-bar';
    bar.setAttribute('role', 'note');
    bar.innerHTML = '⚠️ <strong>FOR RESEARCH USE ONLY.</strong> Not for human consumption. Must be 21+. '
      + '<a href="/legal/">Full disclaimer</a>';
    document.body.appendChild(bar);
    // Pad body so bar doesn't cover footer content
    var h = bar.offsetHeight;
    if (h) document.body.style.paddingBottom = (h + 8) + 'px';
  }

  // Cookie / analytics consent banner (GDPR / ePrivacy)
  function injectCookieBanner() {
    if (!window.pepConsent) return;
    if (window.pepConsent.status() === 'granted' || window.pepConsent.status() === 'denied') return;
    if (document.getElementById('pep-cookie-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'pep-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = ''
      + '<div class="pep-cb-text">'
      + '<strong>🍪 Cookies &amp; analytics.</strong> We use Google Analytics to understand how visitors use the site. '
      + 'No advertising or personalisation. See our <a href="/privacy/">Privacy Policy</a>. '
      + 'Can we set analytics cookies?'
      + '</div>'
      + '<div class="pep-cb-btns">'
      + '<button type="button" class="pep-cb-reject">Reject</button>'
      + '<button type="button" class="pep-cb-accept">Accept</button>'
      + '</div>';
    document.body.appendChild(banner);

    // Re-pad body so persistent bar + banner don't overlap footer
    setTimeout(function () {
      var pb = document.getElementById('pep-persistent-bar');
      var cb = document.getElementById('pep-cookie-banner');
      var total = (pb ? pb.offsetHeight : 0) + (cb ? cb.offsetHeight : 0) + 12;
      document.body.style.paddingBottom = total + 'px';
    }, 50);

    banner.querySelector('.pep-cb-accept').addEventListener('click', function () {
      window.pepConsent.grant();
      banner.remove();
      var pb = document.getElementById('pep-persistent-bar');
      document.body.style.paddingBottom = (pb ? pb.offsetHeight + 8 : 0) + 'px';
    });
    banner.querySelector('.pep-cb-reject').addEventListener('click', function () {
      window.pepConsent.deny();
      banner.remove();
      var pb = document.getElementById('pep-persistent-bar');
      document.body.style.paddingBottom = (pb ? pb.offsetHeight + 8 : 0) + 'px';
    });
  }

  function boot() {
    inject();
    injectPersistentBar();
    // Cookie banner disabled: GA analytics is opt-out (via /privacy/) rather than opt-in
    // The banner code remains for later re-enablement if consent-mode is restored.
  }

  // No-op — cookie banner suppressed. Kept for age-gate accept handler compat.
  window.pepShowCookieBanner = function () {};

  if (document.body) {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
