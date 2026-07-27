/**
 * Site Configuration
 * ==================
 * Edit the values below. All legal pages and the header drawer pull from this file.
 * The site URL is derived automatically from the browser so subdomains work without any changes.
 */

window.SiteConfig = {
  // ── Brand ─────────────────────────────────────────────────────────────────
  siteName:     "5 Minutes Quiz",          // shown as the platform/product name
  companyName:  "Transcodezy It Solutions Private Limited",       // legal entity name (e.g. "Acme Pvt Ltd")
  contactEmail: "support@himexams.com",          // support / legal contact email

  // ── URL helpers (auto-derived — do NOT change) ────────────────────────────
  get siteHost() { return window.location.hostname; },      // "530-quiz.fiveminutesgames.com"
  get siteUrl()  { return window.location.origin; },        // "https://530-quiz.fiveminutesgames.com"
  get mailtoLink(){ return "mailto:" + this.contactEmail; },

  // ── Policy dates ─────────────────────────────────────────────────────────
  privacyDate:  "July 25, 2025",
  termsDate:    "July 25, 2025",
  cookieDate:   "July 25, 2025",
  contestDate:  "July 25, 2025",

  // ── Analytics ─────────────────────────────────────────────────────────────
  gaId: "G-B8YGFQP4DE",
};

/**
 * Auto-fills every element that has a data-cfg="<key>" attribute with the
 * matching SiteConfig value, and updates href on elements with data-cfg-href="<key>".
 */
document.addEventListener("DOMContentLoaded", function () {
  var cfg = window.SiteConfig;

  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    if (cfg[key] !== undefined) el.textContent = cfg[key];
  });

  document.querySelectorAll("[data-cfg-href]").forEach(function (el) {
    var key = el.getAttribute("data-cfg-href");
    if (cfg[key] !== undefined) el.setAttribute("href", cfg[key]);
  });
});
