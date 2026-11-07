#!/usr/bin/env node
// Scoped static map-button patch from the saved eats snapshot.
// Rewrites hrefs/labels only — does not regenerate page bodies or attraction content.
const fs = require("fs");
const path = require("path");
const {
  googleMapsUrl,
  hasExactPlaceLink,
  escapeHtmlAttr,
} = require("./lib/google-maps-url");

const root = path.join(__dirname, "..");
const snapshotPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, "data/eats-map-link-snapshot.json");
const ASSET_V = "1794023100";
const SCRIPT_BUMPS = [
  [/js\/app\.js\?v=\d+/g, `js/app.js?v=${ASSET_V}`],
  [/js\/region\.js\?v=\d+/g, `js/region.js?v=${ASSET_V}`],
  [/js\/category\.js\?v=\d+/g, `js/category.js?v=${ASSET_V}`],
  [/js\/map\.js\?v=\d+/g, `js/map.js?v=${ASSET_V}`],
  [/js\/home-map\.js\?v=\d+/g, `js/home-map.js?v=${ASSET_V}`],
];

function walkHtmlFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".git" || ent.name === "scripts") continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtmlFiles(full, out);
    else if (ent.isFile() && ent.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function variants(url) {
  if (!url) return [];
  return [...new Set([url, escapeHtmlAttr(url)])];
}

function flipCoordinateLabels(html) {
  return html.replace(
    /(<a\b[^>]*\b(?:google-link|btn primary)\b[^>]*href=")(https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?)("[^>]*>)(\s*)(구글맵에서 보기|구글맵 업체 보기|View on Google Maps)(\s*)(<\/a>)/g,
    (_, a, href, b, ws1, label, ws2, close) => {
      const isEn = /View on Google Maps/.test(label);
      return `${a}${href}${b}${ws1}${isEn ? "View location" : "위치 보기"}${ws2}${close}`;
    },
  );
}

const spots = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
if (!Array.isArray(spots) || spots.length < 1001) {
  throw new Error(`Expected >=1001 snapshot rows, got ${spots?.length}`);
}
if (spots.some((s) => Number(s.id) === 816)) {
  throw new Error("Snapshot unexpectedly includes removed venue 816");
}

const byLL = new Map();
for (const s of spots) {
  if (!Number.isFinite(Number(s.lat)) || !Number.isFinite(Number(s.lng))) continue;
  const key = `${Number(s.lat)},${Number(s.lng)}`;
  if (!byLL.has(key)) byLL.set(key, []);
  byLL.get(key).push(s);
}

const replacements = [];
let placeExact = 0;
let coordinateFallback = 0;
let alreadyOk = 0;

for (const spot of spots) {
  const targetRaw = googleMapsUrl(spot, { html: false });
  if (!targetRaw) continue;
  const targetHtml = googleMapsUrl(spot, { html: true });
  const current = (spot.current_button || "").trim();
  const exact = hasExactPlaceLink(spot);
  if (exact) placeExact += 1;
  else coordinateFallback += 1;
  if (current && (current === targetRaw || current === targetHtml)) alreadyOk += 1;

  const froms = new Set();
  for (const v of variants(current)) if (v) froms.add(v);
  if (spot.name && Number.isFinite(Number(spot.lat)) && Number.isFinite(Number(spot.lng))) {
    const legacy = `https://www.google.com/maps/search/${encodeURIComponent(spot.name)}/@${spot.lat},${spot.lng},17z`;
    for (const v of variants(legacy)) froms.add(v);
  }
  for (const from of froms) {
    if (!from || from === targetRaw || from === targetHtml) continue;
    replacements.push({ from, toHtml: targetHtml, exact, id: spot.id });
  }
}

const files = walkHtmlFiles(root);
let filesChanged = 0;
let hrefReplacements = 0;
let llPassReplacements = 0;
const touchedPlaceIds = new Set();
const touchedCoordinateIds = new Set();
const nameSearchAtRe = /https:\/\/www\.google\.com\/maps\/search\/[^"\s<>]+\/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),17z/g;

for (const file of files) {
  let html = fs.readFileSync(file, "utf8");
  const original = html;
  for (const [re, to] of SCRIPT_BUMPS) html = html.replace(re, to);

  for (const rep of replacements) {
    if (!html.includes(rep.from)) continue;
    const parts = html.split(rep.from);
    const count = parts.length - 1;
    if (count <= 0) continue;
    html = parts.join(rep.toHtml);
    hrefReplacements += count;
    if (rep.exact) touchedPlaceIds.add(rep.id);
    else touchedCoordinateIds.add(rep.id);
  }

  // Second pass: related cards that used a shortened/alternate name with same coordinates.
  html = html.replace(nameSearchAtRe, (match, lat, lng) => {
    const key = `${Number(lat)},${Number(lng)}`;
    const cands = byLL.get(key) || [];
    if (!cands.length) return match;
    const spot = cands.find(hasExactPlaceLink) || cands[0];
    const to = googleMapsUrl(spot, { html: true });
    if (!to || to === match) return match;
    llPassReplacements += 1;
    if (hasExactPlaceLink(spot)) touchedPlaceIds.add(spot.id);
    else touchedCoordinateIds.add(spot.id);
    return to;
  });

  html = flipCoordinateLabels(html);

  if (html !== original) {
    fs.writeFileSync(file, html);
    filesChanged += 1;
  }
}

const summary = {
  snapshotRows: spots.length,
  placeExactCandidates: placeExact,
  coordinateFallbackCandidates: coordinateFallback,
  alreadyMatchingButton: alreadyOk,
  filesChanged,
  hrefReplacements,
  llPassReplacements,
  uniquePlacesWithExactLinkTouched: touchedPlaceIds.size,
  uniquePlacesWithCoordinateFallbackTouched: touchedCoordinateIds.size,
  replacementRules: replacements.length,
};
fs.writeFileSync(
  path.join(__dirname, "data/map-button-patch-summary.json"),
  JSON.stringify(summary, null, 2) + "\n",
);
console.log(JSON.stringify(summary, null, 2));
