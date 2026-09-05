// 지역 페이지(region-*.html)와 홈 화면의 지역 카드를 정적 HTML로 미리 구워주는 스크립트.
// region-content.js / data.js 내용을 바꾼 뒤에는 `node scripts/generate-region-pages.js`를 다시 실행해야
// 검색엔진(특히 자바스크립트를 거의 실행하지 않는 네이버 크롤러)이 보는 내용도 함께 최신화된다.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");

function loadGlobals(files) {
  // const/let 선언은 vm 컨텍스트의 sandbox 객체에 프로퍼티로 붙지 않으므로 var로 바꿔서 실행한다
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

const { REGIONS, REGION_CONTENT, CATEGORIES, REGION_SUB_AREAS } = loadGlobals(["js/data.js", "js/region-content.js"]);

const supabaseConfigSrc = fs.readFileSync(path.join(root, "js/supabase-config.js"), "utf8");
const SUPABASE_URL = supabaseConfigSrc.match(/SUPABASE_URL\s*=\s*"([^"]+)"/)[1];
const SUPABASE_ANON_KEY = supabaseConfigSrc.match(/SUPABASE_ANON_KEY\s*=\s*"([^"]+)"/)[1];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 지역에 실제 등록된 맛집을 Supabase에서 가져와 region.js의 renderRegionSpots()와 동일한 마크업으로 미리 구운다
async function fetchRegionSpots(regionId) {
  const url = `${SUPABASE_URL}/rest/v1/eats?select=*&region=eq.${regionId}&order=created_at.desc`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase fetch failed for region=${regionId}: ${res.status}`);
  return res.json();
}

function distSq(a, b) {
  const dLat = a[0] - b[0], dLng = a[1] - b[1];
  return dLat * dLat + dLng * dLng;
}

// 좌표만으로 검색하면 구글맵이 업체 정보 없이 좌표 핀만 띄우는 경우가 많아서,
// 가게 이름 + 좌표 뷰포트(@lat,lng,zoom)로 검색해 실제 정보 페이지로 연결되게 한다
function googleMapsUrl(spot, fallbackLabel) {
  const query = encodeURIComponent(spot.name || fallbackLabel || "");
  return `https://www.google.com/maps/search/${query}/@${spot.lat},${spot.lng},17z`;
}

function categoryGroupsHtml(spots) {
  const grouped = {};
  spots.forEach(spot => {
    if (!grouped[spot.category]) grouped[spot.category] = [];
    grouped[spot.category].push(spot);
  });

  return CATEGORIES
    .filter(c => grouped[c.id] && grouped[c.id].length)
    .map(c => `
        <div class="region-spots-group reveal in">
          <div class="region-spots-group-head"><span class="ico">${c.icon}</span><span>${c.ko}</span></div>
          ${grouped[c.id].map(spot => `
            <div class="region-spot-card">
              <span class="name">${escapeHtml(spot.name || c.ko)}</span>
              <span class="region-spot-links">
                <a class="view-link google-link" href="${googleMapsUrl(spot, c.ko)}" target="_blank" rel="noopener">구글맵에서 보기</a>
                <a class="view-link" href="/map?lat=${spot.lat}&lng=${spot.lng}">지도에서 보기 →</a>
              </span>
            </div>`).join("")}
        </div>`).join("");
}

function regionSpotsListHtml(region, spots) {
  if (!spots.length) {
    return `<div class="board-empty">아직 ${escapeHtml(region.ko)}에 등록된 맛집이 없어요. 첫 발견자가 되어보세요! 🤫</div>`;
  }

  const subAreas = REGION_SUB_AREAS[region.id];
  if (!subAreas) return categoryGroupsHtml(spots);

  const bySubArea = {};
  subAreas.forEach(sa => { bySubArea[sa.id] = []; });
  spots.forEach(spot => {
    let best = subAreas[0];
    let bestDist = Infinity;
    subAreas.forEach(sa => {
      const d = distSq([spot.lat, spot.lng], sa.center);
      if (d < bestDist) { bestDist = d; best = sa; }
    });
    bySubArea[best.id].push(spot);
  });

  return subAreas
    .filter(sa => bySubArea[sa.id].length)
    .map(sa => `
        <div class="region-spots-subarea reveal in">
          <h3 class="region-spots-subarea-head">${sa.ko}</h3>
          ${categoryGroupsHtml(bySubArea[sa.id])}
        </div>`).join("");
}

function highlightsHtml(highlights) {
  return highlights.map((h, i) => `
        <div class="region-highlight-card reveal in" style="--i:${i}">
          <span class="num">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3>${h.title}</h3>
            <p>${h.desc}</p>
          </div>
        </div>`).join("");
}

function activitiesHtml(activities) {
  return activities.map(a => `
        <li><span class="check">✓</span>${a}</li>`).join("");
}

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/* ===================== region-<id>.html 생성 ===================== */
const template = fs.readFileSync(path.join(root, "region.html"), "utf8");
let generatedCount = 0;

async function main() {
for (const region of REGIONS) {
  const content = REGION_CONTENT[region.id];
  if (!content || !content.ko) continue;
  const ko = content.ko;

  const title = `${region.ko} 여행 가이드 · 나만 알고 싶은 대만 맛집`;
  const description = `${region.ko} 여행 정보와 맛집 지도 — ${region.subKo}`;
  const canonicalUrl = `https://taiwanbite.com/region-${region.id}`;

  let out = template;

  out = out.replace(
    '<title id="pageTitle">지역 가이드 · 나만 알고 싶은 대만 맛집</title>',
    `<title id="pageTitle">${escAttr(title)}</title>\n<link rel="canonical" href="${canonicalUrl}" />`
  );
  out = out.replace(
    /<meta id="pageDescription" name="description" content="[^"]*" \/>/,
    `<meta id="pageDescription" name="description" content="${escAttr(description)}" />`
  );
  out = out.replace(
    /<meta id="ogUrl" property="og:url" content="[^"]*" \/>/,
    `<meta id="ogUrl" property="og:url" content="${canonicalUrl}" />`
  );
  out = out.replace(
    /<meta id="ogTitle" property="og:title" content="[^"]*" \/>/,
    `<meta id="ogTitle" property="og:title" content="${escAttr(title)}" />`
  );
  out = out.replace(
    /<meta id="ogDescription" property="og:description" content="[^"]*" \/>/,
    `<meta id="ogDescription" property="og:description" content="${escAttr(description)}" />`
  );
  // 소셜 공유 미리보기는 일부 플랫폼이 webp를 못 읽는 경우가 있어 jpg 버전을 따로 사용한다
  out = out.replace(
    /<meta id="ogImage" property="og:image" content="[^"]*" \/>/,
    `<meta id="ogImage" property="og:image" content="https://taiwanbite.com/assets/images/regions/${region.id}-og.jpg" />`
  );
  const spots = await fetchRegionSpots(region.id);

  const graph = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://taiwanbite.com/" },
        { "@type": "ListItem", "position": 2, "name": "지역", "item": "https://taiwanbite.com/#regions" },
        { "@type": "ListItem", "position": 3, "name": `${region.ko} 여행 가이드`, "item": canonicalUrl },
      ],
    },
    {
      "@type": "TouristDestination",
      "name": region.ko,
      "description": description,
      "url": canonicalUrl,
      "image": `https://taiwanbite.com/assets/images/regions/${region.id}-og.jpg`,
    },
  ];
  if (spots.length) {
    graph.push({
      "@type": "ItemList",
      "name": `${region.ko}에 등록된 맛집`,
      "numberOfItems": spots.length,
      "itemListElement": spots.map((spot, i) => {
        const cat = CATEGORIES.find(c => c.id === spot.category);
        return {
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "LocalBusiness",
            "name": spot.name || (cat ? cat.ko : region.ko),
            ...(spot.address ? { "address": spot.address } : {}),
            "geo": { "@type": "GeoCoordinates", "latitude": spot.lat, "longitude": spot.lng },
          },
        };
      }),
    });
  }
  const ldJson = { "@context": "https://schema.org", "@graph": graph };
  out = out.replace(
    /<script type="application\/ld\+json" id="ldJson">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="ldJson">${JSON.stringify(ldJson)}</script>`
  );
  out = out.replace(
    '<img class="hero-img" id="regionHeroImg" src="" alt="" />',
    `<img class="hero-img" id="regionHeroImg" src="${region.image}" alt="${escAttr(region.ko)}" />`
  );
  out = out.replace(
    '<span class="eyebrow" id="regionEyebrow">Explore Taiwan</span>',
    `<span class="eyebrow" id="regionEyebrow">${escAttr(region.tagKo)}</span>`
  );
  out = out.replace(
    '<h1 id="regionTitle">&nbsp;</h1>',
    `<h1 id="regionTitle">${escAttr(region.ko)} 여행 가이드</h1>`
  );
  out = out.replace(
    '<p id="regionTagline">&nbsp;</p>',
    `<p id="regionTagline">${escAttr(region.subKo)}</p>`
  );
  out = out.replace(
    'id="regionFullMapLink" href="/map"',
    `id="regionFullMapLink" href="/map?region=${region.id}"`
  );
  out = out.replace(
    '<p class="region-intro" id="regionIntro"></p>',
    `<p class="region-intro" id="regionIntro">${ko.intro}</p>`
  );
  out = out.replace(
    '<div class="region-highlight-grid" id="regionHighlights"></div>',
    `<div class="region-highlight-grid" id="regionHighlights">${highlightsHtml(ko.highlights)}</div>`
  );
  out = out.replace(
    '<ul class="region-activity-list" id="regionActivities"></ul>',
    `<ul class="region-activity-list" id="regionActivities">${activitiesHtml(ko.activities)}</ul>`
  );

  out = out.replace(
    /<div id="regionSpotsList">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
    `<div id="regionSpotsList">${regionSpotsListHtml(region, spots)}</div>\n      </div>\n    </div>\n  </section>`
  );

  fs.writeFileSync(path.join(root, `region-${region.id}.html`), out);
  generatedCount++;
}

/* ===================== index.html 지역 카드 정적화 ===================== */
const indexPath = path.join(root, "index.html");
let indexHtml = fs.readFileSync(indexPath, "utf8");

const regionCardsHtml = REGIONS.map((r, i) => `
    <a class="region-card reveal" style="--i:${i}" href="region-${r.id}">
      <img src="${r.image}" alt="${escAttr(r.ko)}" loading="lazy" />
      <span class="tag">${escAttr(r.tagKo)}</span>
      <div class="info">
        <div class="name">${escAttr(r.ko)}</div>
        <div class="sub">${escAttr(r.subKo)}</div>
      </div>
    </a>`).join("");

// 이전 실행에서 이미 채워져 있어도 다시 실행할 수 있도록 내용과 무관하게 매칭한다
indexHtml = indexHtml.replace(
  /<div class="region-grid" id="regionGrid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
  `<div class="region-grid" id="regionGrid">${regionCardsHtml}\n    </div>\n  </div>\n</section>`
);
fs.writeFileSync(indexPath, indexHtml);

console.log(`region-*.html ${generatedCount}개 생성 완료, index.html 지역 카드 정적화 완료`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
