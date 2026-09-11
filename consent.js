/*!
 * Peptides.site consent gate for Google Analytics
 * Google Consent Mode v2 — defaults DENIED, updated only on explicit user grant.
 * Must load BEFORE the gtag.js library.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'pep_cookie_consent_v1';

  // Initialise dataLayer + gtag stub (must exist before gtag.js loads)
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  // Analytics granted by default; ads still denied (no ad networks in use)
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });

  // If user previously denied, honour that (undo via Privacy page reset link)
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'denied') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  } catch (e) { /* localStorage blocked */ }

  // Expose grant/deny helpers for the banner UI (gatekeeper.js calls these)
  window.pepConsent = {
    grant: function () {
      try { localStorage.setItem(STORAGE_KEY, 'granted'); } catch (e) {}
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted'
      });
    },
    deny: function () {
      try { localStorage.setItem(STORAGE_KEY, 'denied'); } catch (e) {}
      // No update call — defaults already denied
    },
    status: function () {
      try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    },
    reset: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }
  };
})();
