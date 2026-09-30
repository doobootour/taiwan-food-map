// Shared head/nav/switcher transforms for English URL split stage 2.
// Korean pages keep their canonicals. English pages are separate files under en/.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE_NAME_EN = "My Secret Taiwan Eats";
const HOME_KO_URL = "https://taiwanbite.com/";
const HOME_EN_URL = "https://taiwanbite.com/en";

function hreflangBlock(koUrl, enUrl) {
  return (
    `\n<link rel="alternate" hreflang="ko" href="${koUrl}" />` +
    `\n<link rel="alternate" hreflang="en" href="${enUrl}" />` +
    `\n<link rel="alternate" hreflang="x-default" href="${koUrl}" />`
  );
}

function ensureHreflang(html, koUrl, enUrl) {
  const block = hreflangBlock(koUrl, enUrl);
  const existing = /\n<link rel="alternate" hreflang="ko" href="[^"]*" \/>\n<link rel="alternate" hreflang="en" href="[^"]*" \/>\n<link rel="alternate" hreflang="x-default" href="[^"]*" \/>/;
  if (existing.test(html)) return html.replace(existing, block);
  return html.replace(/<link rel="canonical" href="[^"]*" \/>/, match => `${match}${block}`);
}

function applyLangSwitcher(html, koHref, enHref, activeLang) {
  const koActive = activeLang === "ko" ? ' class="active"' : "";
  const enActive = activeLang === "en" ? ' class="active"' : "";
  const footerKo = activeLang === "ko" ? "footer-lang-btn active" : "footer-lang-btn";
  const footerEn = activeLang === "en" ? "footer-lang-btn active" : "footer-lang-btn";
  const header =
    `          <a href="${koHref}" data-lang="ko"${koActive}>한국어</a>\n` +
    `          <a href="${enHref}" data-lang="en"${enActive}>English</a>`;
  const footer =
    `          <li><a class="${footerKo}" href="${koHref}" data-lang="ko">한국어</a></li>\n` +
    `          <li><a class="${footerEn}" href="${enHref}" data-lang="en">English</a></li>`;
  let out = html.replace(
    /[ \t]*<(?:button|a)\b[^>]*\bdata-lang="ko"[^>]*>한국어<\/(?:button|a)>\s*<(?:button|a)\b[^>]*\bdata-lang="en"[^>]*>English<\/(?:button|a)>/,
    header
  );
  out = out.replace(
    /[ \t]*<li><(?:button|a)\b[^>]*\bdata-lang="ko"[^>]*>한국어<\/(?:button|a)><\/li>\s*<li><(?:button|a)\b[^>]*\bdata-lang="en"[^>]*>English<\/(?:button|a)><\/li>/,
    footer
  );
  const langBtn = activeLang === "en" ? "EN ▾" : "KO ▾";
  out = out.replace(
    /<button class="lang-btn" id="langBtn">(?:KO|EN) ▾<\/button>/,
    `<button class="lang-btn" id="langBtn">${langBtn}</button>`
  );
  return out;
}

function englishSiteNav(html, active) {
  const items = [
    ["home", "/en", "nav_home", "Home"],
    ["categories", "/en#categories", "nav_categories", "Find Spots"],
    ["regions", "/en#regions", "nav_regions", "Explore by Region"],
    ["map", "/map", "nav_map", "View Map"],
    ["blog", "/blog", "nav_blog", "Blog"],
  ];
  const links = items.map(([id, href, key, label]) => {
    const cls = id === active ? ' class="active"' : "";
    return `      <a href="${href}"${cls} data-i18n="${key}">${label}</a>`;
  }).join("\n");
  return html.replace(/<nav id="site-nav">[\s\S]*?<\/nav>/, `<nav id="site-nav">\n${links}\n    </nav>`);
}

// Hub anchors on English pages must stay on /en. Spot, map, about, and blog hrefs are left alone.
function pointHubLinksAtEnglish(html) {
  return html
    .replace(/href="\/#categories"/g, 'href="/en#categories"')
    .replace(/href="\/#regions"/g, 'href="/en#regions"')
    .replace(/href="#categories"/g, 'href="/en#categories"')
    .replace(/href="#regions"/g, 'href="/en#regions"')
    .replace(/href="#home"/g, 'href="/en"')
    .replace(/<a href="\/" class="brand">/g, '<a href="/en" class="brand">');
}

function escapeText(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(s) {
  return escapeText(s).replace(/"/g, "&quot;");
}

function loadEnglishDict() {
  const file = path.join(__dirname, "..", "..", "js", "i18n.js");
  const code = fs.readFileSync(file, "utf8").replace(/\bconst\b/g, "var").replace(/\blet\b/g, "var");
  const sandbox = {
    document: {
      documentElement: {},
      querySelectorAll() { return []; },
    },
    localStorage: { getItem() { return null; }, setItem() {} },
    navigator: { language: "en", languages: ["en"] },
    location: { pathname: "/en" },
    CustomEvent: function CustomEvent() {},
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.I18N.en;
}

function bakeEnglishCopy(html, dict) {
  let out = html.replace(/data-i18n="([^"]+)">[^<]*</g, (m, key) => {
    if (dict[key] == null) return m;
    return `data-i18n="${key}">${escapeText(dict[key])}<`;
  });
  out = out.replace(/data-i18n-html="([^"]+)">[\s\S]*?<\/(h1|span)>/g, (m, key, tag) => {
    if (dict[key] == null) return m;
    return `data-i18n-html="${key}">${dict[key]}</${tag}>`;
  });
  out = out.replace(/data-i18n-alt="([^"]+)"([^>]*?)alt="[^"]*"/g, (m, key, mid) => {
    if (dict[key] == null) return m;
    return `data-i18n-alt="${key}"${mid}alt="${escapeAttr(dict[key])}"`;
  });
  out = out.replace(/data-i18n-title="([^"]+)"([^>]*?)title="[^"]*"/g, (m, key, mid) => {
    if (dict[key] == null) return m;
    return `data-i18n-title="${key}"${mid}title="${escapeAttr(dict[key])}"`;
  });
  out = out.replace('aria-label="메뉴"', 'aria-label="Menu"');
  out = out.replace(
    '<meta property="og:site_name" content="나만 알고 싶은 대만 맛집" />',
    `<meta property="og:site_name" content="${SITE_NAME_EN}" />`
  );
  return out;
}

// Nested /en/* URLs must not resolve js/ css/ assets/ under /en/.
function rootAbsoluteLocalAssets(html) {
  return html.replace(/(href|src)="(?!\/|https?:|#|mailto:)([^"]+)"/g, '$1="/$2"');
}

module.exports = {
  SITE_NAME_EN,
  HOME_KO_URL,
  HOME_EN_URL,
  hreflangBlock,
  ensureHreflang,
  applyLangSwitcher,
  englishSiteNav,
  pointHubLinksAtEnglish,
  loadEnglishDict,
  bakeEnglishCopy,
  rootAbsoluteLocalAssets,
};
