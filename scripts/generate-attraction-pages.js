// '꼭 가볼 곳' 페이지(<region>-attractions.html)와 지역 페이지의 '꼭 가볼 곳' 칸을 만든다.
// 데이터: js/attractions.js. 근처 맛집은 Supabase eats에서 좌표 거리로 매번 다시 고른다.
// generate-region-pages.js 다음에 실행해야 한다(그 스크립트가 region-*.html을 새로 쓰기 때문).
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { slugForSpot } = require("./lib/spot-slug");

const root = path.join(__dirname, "..");

function loadGlobals(files) {
  const code = files
    .map(f => fs.readFileSync(path.join(root, f), "utf8"))
    .join("\n")
    .replace(/\bconst\b/g, "var")
    .replace(/\blet\b/g, "var");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox;
}

const { REGIONS, CATEGORIES } = loadGlobals(["js/data.js"]);
const { ATTRACTIONS } = loadGlobals(["js/attractions.js"]);

const cfg = fs.readFileSync(path.join(root, "js/supabase-config.js"), "utf8");
const SUPABASE_URL = cfg.match(/SUPABASE_URL\s*=\s*"([^"]+)"/)[1];
const SUPABASE_ANON_KEY = cfg.match(/SUPABASE_ANON_KEY\s*=\s*"([^"]+)"/)[1];

// 맛집이 아닌 카테고리는 근처 맛집에서 뺀다
const NON_FOOD = new Set(["attraction", "mart", "liquor_shop", "shopping", "gift_shop"]);
const NEARBY_MAX = 5;
const NEARBY_MIN = 3;

const esc = s => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function km(a, b) {
  const R = 6371, toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function fetchRegionSpots(regionId) {
  const url = `${SUPABASE_URL}/rest/v1/eats?select=id,name,category,region,lat,lng&region=eq.${regionId}&order=id.asc`;
  const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
  if (!res.ok) throw new Error(`Supabase fetch failed for region=${regionId}: ${res.status}`);
  return res.json();
}

function nearbySpots(item, spots) {
  // 가까운 순. 5km 안에서 최대 5곳, 그 안에 3곳이 안 되면 가장 가까운 3곳
  const ranked = spots
    .filter(s => s.name && String(s.name).trim() && !NON_FOOD.has(s.category) && isFinite(s.lat) && isFinite(s.lng))
    .map(s => ({ s, d: km(item, s) }))
    .sort((a, b) => a.d - b.d || String(a.s.id).localeCompare(String(b.s.id), "en", { numeric: true }));
  const within = ranked.filter(r => r.d <= 5).slice(0, NEARBY_MAX);
  return within.length >= NEARBY_MIN ? within : ranked.slice(0, NEARBY_MIN);
}

const fmtKm = d => (d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`);
const fmtDate = iso => { const [y, m, d] = iso.split("-"); return `${y}년 ${Number(m)}월 ${Number(d)}일`; };
const mapsUrl = item => `https://www.google.com/maps/search/${encodeURIComponent(item.zh)}/@${item.lat},${item.lng},15z`;

function attractionCard(item, nearby, data, idx) {
  const catOf = id => CATEGORIES.find(c => c.id === id);
  const foods = nearby.map(({ s, d }) => {
    const c = catOf(s.category);
    return `<li><a href="/${slugForSpot(s)}">${esc(s.name)}</a> <span class="att-meta">${c ? `${c.icon} ${esc(c.ko)} · ` : ""}약 ${fmtKm(d)}</span></li>`;
  }).join("");
  const sources = item.sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(" · ");
  const tour = item.doobootour
    ? `<p class="att-tour">화롄에서 한국어 투어로 편하게 다녀오고 싶다면 <a href="${esc(data.doobootourUrl)}" target="_blank" rel="noopener">두부투어</a>를 참고해 보세요.</p>`
    : "";
  return `
    <article class="att-card" id="${esc(item.id)}">
      <h2><span class="att-num" aria-hidden="true">⭐</span>${esc(item.ko)} <small>${esc(item.zh)}</small></h2>
      <p>${esc(item.intro)}</p>
      <h3>가는 방법</h3>
      <p>${esc(item.access)}</p>
      <h3>운영·통제 상황</h3>
      <p>${esc(item.status)}</p>
      <p class="att-src">${fmtDate(item.checked)} 확인 · 출처: ${sources}</p>
      <p><a class="att-map" href="${mapsUrl(item)}" target="_blank" rel="noopener">구글맵에서 위치 보기 →</a></p>
      <h3>근처 맛집 ${nearby.length}곳</h3>
      ${nearby[nearby.length - 1].d > 5 ? `<p class="att-src">바로 옆에 등록된 맛집이 아직 없어서, 거리가 가장 가까운 곳을 골랐어요.</p>` : ""}
      <ul class="att-foods">${foods}</ul>
      ${tour}
    </article>`;
}

const STYLE = `<style>
  .policy-wrap { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }
  .policy-wrap h1 { font-size: 28px; margin-bottom: 6px; }
  .policy-updated { color: var(--ink-faint); font-size: 13px; margin-bottom: 20px; }
  .policy-wrap p, .policy-wrap li { color: var(--ink-soft); font-size: 14.5px; line-height: 1.8; }
  .policy-wrap a { color: var(--terracotta-dark); font-weight: 600; }
  .att-notice { background: var(--cream, #fbf5ec); border-left: 4px solid var(--terracotta-dark, #a8562c); padding: 12px 16px; border-radius: 8px; margin: 16px 0 8px; }
  .att-toc { list-style: none; padding-left: 0; margin: 12px 0 8px; }
  .att-card { border-top: 1px solid rgba(0,0,0,.08); padding-top: 28px; margin-top: 32px; }
  .att-card h2 { font-size: 21px; margin: 0 0 10px; color: var(--ink); }
  .att-card h2 small { font-size: 14px; color: var(--ink-faint); font-weight: 500; margin-left: 4px; }
  .att-num { color: var(--terracotta-dark, #a8562c); margin-right: 10px; font-family: Fraunces, serif; }
  .att-card h3 { font-size: 15px; margin: 18px 0 4px; color: var(--ink); }
  .att-src { font-size: 12.5px !important; color: var(--ink-faint) !important; }
  .att-foods { padding-left: 20px; margin: 6px 0; }
  .att-meta { color: var(--ink-faint); font-size: 12.5px; }
  .att-tour { margin-top: 12px; }
</style>`;

function buildPage(region, data, cards) {
  const tpl = fs.readFileSync(path.join(root, "about.html"), "utf8");
  const slug = `${region.id}-attractions`;
  const url = `https://taiwanbite.com/${slug}`;
  const title = `${data.title} · 근처 맛집까지 · 나만 알고 싶은 대만 맛집`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://taiwanbite.com/" },
        { "@type": "ListItem", "position": 2, "name": `${region.ko} 여행 가이드`, "item": `https://taiwanbite.com/region-${region.id}` },
        { "@type": "ListItem", "position": 3, "name": data.title, "item": url },
      ] },
      { "@type": "ItemList", "name": data.title, "url": url, "numberOfItems": data.items.length,
        "itemListElement": data.items.map((it, i) => ({
          "@type": "ListItem", "position": i + 1, "url": `${url}#${it.id}`,
          "item": { "@type": "TouristAttraction", "name": `${it.ko} (${it.zh})`, "description": it.intro,
            "geo": { "@type": "GeoCoordinates", "latitude": it.lat, "longitude": it.lng } },
        })) },
    ],
  };
  let out = tpl;
  const r = (re, s) => { const before = out; out = out.replace(re, s); if (before === out) throw new Error(`template anchor not found: ${re}`); };
  r(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  r(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(data.description)}" />`);
  r(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  r(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  r(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`);
  r(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(data.description)}" />`);
  r(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="https://taiwanbite.com/assets/images/regions/${region.id}-og.jpg" />`);
  r(/<style>[\s\S]*?<\/style>/, `${STYLE}\n<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
  const toc = data.items.map(it => `<li>⭐ <a href="#${esc(it.id)}">${esc(it.ko)} ${esc(it.zh)}</a></li>`).join("");
  r(/<main>[\s\S]*?<\/main>/, `<main>
  <div class="policy-wrap">
    <p class="policy-updated"><a href="/region-${region.id}">← ${esc(region.ko)} 여행 가이드</a></p>
    <h1>${esc(data.title)}</h1>
    <p class="policy-updated">관광지 + 근처 맛집 · 나만 알고 싶은 대만 맛집</p>
    <p>${esc(data.intro)}</p>
    <p class="att-notice">${esc(data.notice)}</p>
    <ul class="att-toc">${toc}</ul>
${cards}
    <p style="margin-top:40px;"><a href="/region-${region.id}">${esc(region.ko)} 맛집 전체 보기 →</a> · <a href="/map?region=${region.id}">지도에서 보기 →</a></p>
  </div>
</main>`);
  fs.writeFileSync(path.join(root, `${slug}.html`), out);
  return slug;
}

const BLOCK_RE = /\n?\s*<!-- ATTRACTIONS:START -->[\s\S]*?<!-- ATTRACTIONS:END -->/;

function injectRegionTeaser(region, data, slug) {
  const file = path.join(root, `region-${region.id}.html`);
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, "utf8").replace(BLOCK_RE, "");
  const list = data.items.map(it => `<li><span class="check" aria-hidden="true">⭐</span><a href="/${slug}#${esc(it.id)}">${esc(it.ko)} ${esc(it.zh)}</a></li>`).join("");
  const block = `
      <!-- ATTRACTIONS:START -->
      <h2 class="region-h2">꼭 가볼 곳</h2>
      <p class="region-intro">대표 관광지 ${data.items.length}곳의 가는 방법, 현재 통제 상황, 근처 맛집을 정리했어요.</p>
      <ul class="region-activity-list">${list}</ul>
      <p><a class="view-link" href="/${slug}">${esc(data.title)} 전체 보기 →</a></p>
      <!-- ATTRACTIONS:END -->`;
  const anchor = /(<ul class="region-activity-list" id="regionActivities">[\s\S]*?<\/ul>)/;
  if (!anchor.test(html)) throw new Error(`regionActivities anchor missing in ${file}`);
  html = html.replace(anchor, `$1${block}`);
  fs.writeFileSync(file, html);
}

async function main() {
  for (const [regionId, data] of Object.entries(ATTRACTIONS)) {
    const region = REGIONS.find(r => r.id === regionId);
    if (!region) throw new Error(`unknown region ${regionId}`);
    const spots = await fetchRegionSpots(regionId);
    const counts = [];
    const cards = data.items.map((item, i) => {
      const nearby = nearbySpots(item, spots);
      counts.push(`${item.ko} ${nearby.length}곳(최대 ${fmtKm(nearby[nearby.length - 1].d)})`);
      return attractionCard(item, nearby, data, i);
    }).join("\n");
    const slug = buildPage(region, data, cards);
    injectRegionTeaser(region, data, slug);
    console.log(`${slug}.html 생성: ${counts.join(", ")}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
