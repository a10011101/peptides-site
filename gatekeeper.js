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

  // CSS
  var css = ''
    + '#pep-gate-overlay{position:fixed;inset:0;background:rgba(15,15,30,.92);'
    + 'backdrop-filter:blur(6px);z-index:2147483647;display:flex;align-items:center;'
    + 'justify-content:center;padding:16px;font-family:"Atkinson Hyperlegible",system-ui,sans-serif;color:#1E1B4B}'
    + '#pep-gate-modal{background:#fff;max-width:560px;width:100%;border-radius:16px;'
    + 'padding:32px;box-shadow:0 25px 50px -12px rgba(0,0,0,.4);border:2px solid #EA580C}'
    + '#pep-gate-modal h2{font-family:"Crimson Pro",serif;font-size:1.6rem;margin:0 0 8px;color:#EA580C;line-height:1.2}'
    + '#pep-gate-modal .pep-lead{margin:0 0 20px;font-size:.98rem;line-height:1.55;color:#3f3d5c}'
    + '#pep-gate-modal .pep-warn{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;'
    + 'padding:12px 14px;margin:0 0 20px;font-size:.9rem;color:#9a3412;line-height:1.5}'
    + '#pep-gate-modal label{display:flex;gap:10px;align-items:flex-start;margin:0 0 12px;'
    + 'padding:12px;background:#f5f6fb;border:1px solid #e5e7f2;border-radius:8px;cursor:pointer;'
    + 'font-size:.92rem;line-height:1.45;transition:background .15s}'
    + '#pep-gate-modal label:hover{background:#eef0fa}'
    + '#pep-gate-modal input[type=checkbox]{margin-top:3px;width:18px;height:18px;flex:0 0 auto;accent-color:#EA580C;cursor:pointer}'
    + '#pep-gate-buttons{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap}'
    + '#pep-gate-accept{flex:1;min-width:180px;background:#EA580C;color:#fff;border:0;'
    + 'padding:14px 20px;border-radius:10px;font-weight:700;font-size:1rem;cursor:pointer;'
    + 'font-family:inherit;transition:background .15s,opacity .15s}'
    + '#pep-gate-accept:hover:not(:disabled){background:#c2410c}'
    + '#pep-gate-accept:disabled{background:#c7c9d5;cursor:not-allowed;opacity:.7}'
    + '#pep-gate-reject{background:#fff;color:#4F46E5;border:1.5px solid #4F46E5;'
    + 'padding:14px 20px;border-radius:10px;font-weight:600;font-size:.95rem;cursor:pointer;font-family:inherit}'
    + '#pep-gate-reject:hover{background:#EEF2FF}'
    + '#pep-gate-modal .pep-foot{margin-top:16px;font-size:.75rem;color:#6b6b85;text-align:center;line-height:1.5}'
    + '#pep-persistent-bar{position:fixed;bottom:0;left:0;right:0;z-index:2147483646;'
    + 'background:#7f1d1d;color:#fff;padding:8px 16px;text-align:center;font-size:.82rem;'
    + 'font-family:"Atkinson Hyperlegible",system-ui,sans-serif;line-height:1.4;'
    + 'border-top:2px solid #EA580C;box-shadow:0 -2px 12px rgba(0,0,0,.15)}'
    + '#pep-persistent-bar strong{color:#fed7aa}'
    + '#pep-persistent-bar a{color:#fed7aa;text-decoration:underline}'
    + '@media (max-width:520px){#pep-gate-modal{padding:24px 20px}#pep-gate-modal h2{font-size:1.35rem}#pep-persistent-bar{font-size:.75rem;padding:6px 12px}}';

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

  function boot() {
    inject();
    injectPersistentBar();
  }

  if (document.body) {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
