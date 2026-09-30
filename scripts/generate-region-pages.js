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
const { slugForSpot } = require("./lib/spot-slug");
const {
  SITE_NAME_EN,
  HOME_KO_URL,
  HOME_EN_URL,
  ensureHreflang,
  applyLangSwitcher,
  englishSiteNav,
  pointHubLinksAtEnglish,
  loadEnglishDict,
  bakeEnglishCopy,
  rootAbsoluteLocalAssets,
} = require("./lib/en-shell");

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
  return stableSpots(await res.json());
}

// created_at ties come back in an unstable order from PostgREST. A tie-break
// keeps the daily regenerate job from rewriting the same pages every run.
function stableSpots(spots) {
  return spots.slice().sort((a, b) => {
    const ta = a.created_at || "";
    const tb = b.created_at || "";
    if (ta !== tb) return ta < tb ? 1 : -1;
    return String(b.id).localeCompare(String(a.id), "en", { numeric: true });
  });
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

function categoryGroupsHtml(spots, lang = "ko") {
  const grouped = {};
  spots.forEach(spot => {
    if (!grouped[spot.category]) grouped[spot.category] = [];
    grouped[spot.category].push(spot);
  });
  const detailLabel = lang === "en" ? "View Details →" : "상세 보기 →";
  const googleLabel = lang === "en" ? "View on Google Maps" : "구글맵에서 보기";
  const mapLabel = lang === "en" ? "View on Map →" : "지도에서 보기 →";

  return CATEGORIES
    .filter(c => grouped[c.id] && grouped[c.id].length)
    .map(c => {
      const catName = lang === "en" ? c.en : c.ko;
      return `
        <div class="region-spots-group reveal in">
          <div class="region-spots-group-head"><span class="ico">${c.icon}</span><span>${catName}</span></div>
          ${grouped[c.id].map(spot => `
            <div class="region-spot-card">
              <span class="name">${escapeHtml(spot.name || catName)}</span>
              <span class="region-spot-links">
                <a class="view-link" href="/${slugForSpot(spot)}">${detailLabel}</a>
                <a class="view-link google-link" href="${googleMapsUrl(spot, catName)}" target="_blank" rel="noopener">${googleLabel}</a>
                <a class="view-link" href="/map?lat=${spot.lat}&lng=${spot.lng}">${mapLabel}</a>
              </span>
            </div>`).join("")}
        </div>`;
    }).join("");
}

function regionSpotsListHtml(region, spots, lang = "ko") {
  if (!spots.length) {
    if (lang === "en") {
      return `<div class="board-empty">No spots added in ${escapeHtml(region.en)} yet. Be the first to discover one! 🤫</div>`;
    }
    return `<div class="board-empty">아직 ${escapeHtml(region.ko)}에 등록된 맛집이 없어요. 첫 발견자가 되어보세요! 🤫</div>`;
  }

  const subAreas = REGION_SUB_AREAS[region.id];
  if (!subAreas) return categoryGroupsHtml(spots, lang);

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
          <h3 class="region-spots-subarea-head">${lang === "en" ? (sa.en || sa.ko) : sa.ko}</h3>
          ${categoryGroupsHtml(bySubArea[sa.id], lang)}
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

function englishRegionPage(region, en, spots) {
  const title = `${region.en} Travel Guide · ${SITE_NAME_EN}`;
  const description = `${region.en} travel guide and food map — ${region.subEn}`;
  const canonicalUrl = `https://taiwanbite.com/en/region-${region.id}`;
  const koUrl = `https://taiwanbite.com/region-${region.id}`;
  let out = template;

  out = out.replace("<html lang=\"ko\">", "<html lang=\"en\">");
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
    '<meta property="og:locale" content="ko_KR" />',
    '<meta property="og:locale" content="en_US" />'
  );
  out = out.replace(
    /<meta id="ogTitle" property="og:title" content="[^"]*" \/>/,
    `<meta id="ogTitle" property="og:title" content="${escAttr(title)}" />`
  );
  out = out.replace(
    /<meta id="ogDescription" property="og:description" content="[^"]*" \/>/,
    `<meta id="ogDescription" property="og:description" content="${escAttr(description)}" />`
  );
  out = out.replace(
    /<meta id="ogImage" property="og:image" content="[^"]*" \/>/,
    `<meta id="ogImage" property="og:image" content="https://taiwanbite.com/assets/images/regions/${region.id}-og.jpg" />`
  );

  const graph = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://taiwanbite.com/en" },
        { "@type": "ListItem", "position": 2, "name": "Regions", "item": "https://taiwanbite.com/en#regions" },
        { "@type": "ListItem", "position": 3, "name": `${region.en} Travel Guide`, "item": canonicalUrl },
      ],
    },
    {
      "@type": "TouristDestination",
      "name": region.en,
      "headline": `${region.en} Travel Guide`,
      "description": description,
      "url": canonicalUrl,
      "image": `https://taiwanbite.com/assets/images/regions/${region.id}-og.jpg`,
    },
  ];
  if (spots.length) {
    graph.push({
      "@type": "ItemList",
      "name": `Restaurants in ${region.en}`,
      "numberOfItems": spots.length,
      "itemListElement": spots.map((spot, i) => {
        const cat = CATEGORIES.find(c => c.id === spot.category);
        return {
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "LocalBusiness",
            "name": spot.name || (cat ? cat.en : region.en),
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
    `<img class="hero-img" id="regionHeroImg" src="${region.image}" alt="${escAttr(region.en)}" />`
  );
  out = out.replace(
    '<span class="eyebrow" id="regionEyebrow">Explore Taiwan</span>',
    `<span class="eyebrow" id="regionEyebrow">${escAttr(region.tagEn)}</span>`
  );
  out = out.replace(
    '<h1 id="regionTitle">&nbsp;</h1>',
    `<h1 id="regionTitle">${escAttr(region.en)} Travel Guide</h1>`
  );
  out = out.replace(
    '<p id="regionTagline">&nbsp;</p>',
    `<p id="regionTagline">${escAttr(region.subEn)}</p>`
  );
  out = out.replace(
    '<button class="lang-btn" id="langBtn">KO ▾</button>',
    '<button class="lang-btn" id="langBtn">EN ▾</button>'
  );
  out = out.replace(
    '<p class="region-intro" id="regionIntro"></p>',
    `<p class="region-intro" id="regionIntro">${en.intro}</p>`
  );
  out = out.replace(
    '<div class="region-highlight-grid" id="regionHighlights"></div>',
    `<div class="region-highlight-grid" id="regionHighlights">${highlightsHtml(en.highlights)}</div>`
  );
  out = out.replace(
    '<ul class="region-activity-list" id="regionActivities"></ul>',
    `<ul class="region-activity-list" id="regionActivities">${activitiesHtml(en.activities)}</ul>`
  );
  out = out.replace(
    'id="regionFullMapLink" href="/map"',
    `id="regionFullMapLink" href="/map?region=${region.id}"`
  );
  out = out.replace(
    /<div id="regionSpotsList">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
    `<div id="regionSpotsList">${regionSpotsListHtml(region, spots, "en")}</div>\n      </div>\n    </div>\n  </section>`
  );

  out = ensureHreflang(out, koUrl, canonicalUrl);
  out = englishSiteNav(out, "regions");
  out = pointHubLinksAtEnglish(out);
  out = applyLangSwitcher(out, `/region-${region.id}`, `/en/region-${region.id}`, "en");
  out = bakeEnglishCopy(out, loadEnglishDict());
  return rootAbsoluteLocalAssets(out);
}

const EN_HOME_DESC = "A Taiwan food map picked from real reviews by Korean travelers. Browse beef noodles, dim sum, shaved ice, and street food by category, then pin your own spots on the map.";

function writeEnglishHome(koHtml) {
  let out = koHtml.replace("<html lang=\"ko\">", "<html lang=\"en\">");
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${SITE_NAME_EN}</title>`);
  out = out.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${HOME_EN_URL}" />`
  );
  out = ensureHreflang(out, HOME_KO_URL, HOME_EN_URL);
  out = out.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escAttr(EN_HOME_DESC)}" />`
  );
  out = out.replace(
    /<meta name="keywords" content="[^"]*" \/>/,
    `<meta name="keywords" content="Taiwan food, Taiwan travel, Taiwan food map, Taipei food, Hualien food, beef noodle, night market, TaiwanBite" />`
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${HOME_EN_URL}" />`
  );
  out = out.replace(
    '<meta property="og:locale" content="ko_KR" />',
    '<meta property="og:locale" content="en_US" />'
  );
  out = out.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${SITE_NAME_EN}" />`
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escAttr(EN_HOME_DESC)}" />`
  );
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "name": SITE_NAME_EN, "alternateName": "Taiwan Food Map", "url": HOME_EN_URL },
      { "@type": "Organization", "name": SITE_NAME_EN, "url": HOME_EN_URL, "logo": "https://taiwanbite.com/assets/images/logo.webp" },
    ],
  };
  out = out.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`
  );
  out = englishSiteNav(out, "home");
  out = pointHubLinksAtEnglish(out);
  out = applyLangSwitcher(out, "/", "/en", "en");
  out = bakeEnglishCopy(out, loadEnglishDict());
  out = out.replace(
    /<img class="hero-img" src="assets\/images\/hero\/flatlay_2.webp" alt="[^"]*" \/>/,
    `<img class="hero-img" src="assets/images/hero/flatlay_2.webp" alt="Signature Taiwan dishes laid over a map of Taiwan" />`
  );

  const enRegionCards = REGIONS.map((r, i) => `
    <a class="region-card reveal" style="--i:${i}" href="/en/region-${r.id}">
      <img src="${r.image}" alt="${escAttr(r.en)}" loading="lazy" />
      <span class="tag">${escAttr(r.tagEn)}</span>
      <div class="info">
        <div class="name">${escAttr(r.en)}</div>
        <div class="sub">${escAttr(r.subEn)}</div>
      </div>
    </a>`).join("");
  out = out.replace(
    /<div class="region-grid" id="regionGrid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
    `<div class="region-grid" id="regionGrid">${enRegionCards}\n    </div>\n  </div>\n</section>`
  );
  const enCategoryLinks = CATEGORIES.map(c => `
    <a class="category-link-chip" href="/en/category-${c.id}"><span>${c.icon}</span>${escAttr(c.en)}</a>`).join("");
  out = out.replace(
    /<div class="category-link-row" id="categoryLinkRow">[\s\S]*?<\/div>/,
    `<div class="category-link-row" id="categoryLinkRow">${enCategoryLinks}\n      </div>`
  );

  fs.mkdirSync(path.join(root, "en"), { recursive: true });
  // /en/ is a directory URL on Cloudflare until the worker canonicalizes it.
  // Relative css/ js/ assets/ would resolve under /en/ and 404, so match region pages.
  fs.writeFileSync(path.join(root, "en", "index.html"), rootAbsoluteLocalAssets(out));
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
  const enUrl = `https://taiwanbite.com/en/region-${region.id}`;
  const hasEnglish = !!(content.en && content.en.intro);

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

  if (hasEnglish) {
    out = ensureHreflang(out, canonicalUrl, enUrl);
    out = applyLangSwitcher(out, `/region-${region.id}`, `/en/region-${region.id}`, "ko");
  }

  fs.writeFileSync(path.join(root, `region-${region.id}.html`), out);
  generatedCount++;

  if (hasEnglish) {
    fs.mkdirSync(path.join(root, "en"), { recursive: true });
    fs.writeFileSync(path.join(root, "en", `region-${region.id}.html`), englishRegionPage(region, content.en, spots));
  }
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

/* ===================== index.html 카테고리 링크 정적화 =====================
 * js/app.js의 renderCategoryLinks()가 브라우저에서만 채우던 #categoryLinkRow를
 * 빌드 시점에 미리 구워서, 자바스크립트를 거의 실행하지 않는 크롤러도
 * category-*.html(31개) 페이지로 가는 링크를 홈에서 바로 찾을 수 있게 한다. */
const categoryLinksHtml = CATEGORIES.map(c => `
    <a class="category-link-chip" href="category-${c.id}"><span>${c.icon}</span>${escAttr(c.ko)}</a>`).join("");

indexHtml = indexHtml.replace(
  /<div class="category-link-row" id="categoryLinkRow">[\s\S]*?<\/div>/,
  `<div class="category-link-row" id="categoryLinkRow">${categoryLinksHtml}\n      </div>`
);

indexHtml = ensureHreflang(indexHtml, HOME_KO_URL, HOME_EN_URL);
indexHtml = applyLangSwitcher(indexHtml, "/", "/en", "ko");
fs.writeFileSync(indexPath, indexHtml);
writeEnglishHome(indexHtml);

console.log(`region-*.html ${generatedCount}개 + en/region-*.html, en/index.html 생성 완료. index.html 한국어 카드 유지`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
