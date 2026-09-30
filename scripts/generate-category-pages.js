// 카테고리 페이지(category-*.html)를 정적 HTML로 미리 구워주는 스크립트.
// category-content.js / data.js 내용을 바꾼 뒤에는 `node scripts/generate-category-pages.js`를 다시
// 실행해야 검색엔진(특히 자바스크립트를 거의 실행하지 않는 네이버 크롤러)이 보는 내용도 최신화된다.
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

const { REGIONS, CATEGORIES, CATEGORY_CONTENT } = loadGlobals(["js/data.js", "js/category-content.js"]);
const { slugForSpot } = require("./lib/spot-slug");
const {
  SITE_NAME_EN,
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

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

// 카테고리에 실제 등록된 맛집을 Supabase에서 가져와 category.js의 renderCategorySpots()와 동일한 마크업으로 미리 구운다
async function fetchCategorySpots(categoryId) {
  const url = `${SUPABASE_URL}/rest/v1/eats?select=*&category=eq.${categoryId}&order=created_at.desc`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase fetch failed for category=${categoryId}: ${res.status}`);
  return stableSpots(await res.json());
}

function stableSpots(spots) {
  return spots.slice().sort((a, b) => {
    const ta = a.created_at || "";
    const tb = b.created_at || "";
    if (ta !== tb) return ta < tb ? 1 : -1;
    return String(b.id).localeCompare(String(a.id), "en", { numeric: true });
  });
}

// 좌표만으로 검색하면 구글맵이 업체 정보 없이 좌표 핀만 띄우는 경우가 많아서,
// 가게 이름 + 좌표 뷰포트(@lat,lng,zoom)로 검색해 실제 정보 페이지로 연결되게 한다
function googleMapsUrl(spot, fallbackLabel) {
  const query = encodeURIComponent(spot.name || fallbackLabel || "");
  return `https://www.google.com/maps/search/${query}/@${spot.lat},${spot.lng},17z`;
}

function spotCardsHtml(spots, category, lang = "ko") {
  const fallback = lang === "en" ? category.en : category.ko;
  const detail = lang === "en" ? "View Details →" : "상세 보기 →";
  const google = lang === "en" ? "View on Google Maps" : "구글맵에서 보기";
  const map = lang === "en" ? "View on Map →" : "지도에서 보기 →";
  return spots.map(spot => `
            <div class="region-spot-card">
              <span class="name">${escapeHtml(spot.name || fallback)}</span>
              <span class="region-spot-links">
                <a class="view-link" href="/${slugForSpot(spot)}">${detail}</a>
                <a class="view-link google-link" href="${googleMapsUrl(spot, fallback)}" target="_blank" rel="noopener">${google}</a>
                <a class="view-link" href="/map?lat=${spot.lat}&lng=${spot.lng}">${map}</a>
              </span>
            </div>`).join("");
}

function categorySpotsListHtml(category, spots, lang = "ko") {
  if (!spots.length) {
    if (lang === "en") {
      return `<div class="board-empty">No spots added in ${escapeHtml(category.en)} yet. Be the first to discover one! 🤫</div>`;
    }
    return `<div class="board-empty">아직 ${escapeHtml(category.ko)} 카테고리에 등록된 맛집이 없어요. 첫 발견자가 되어보세요! 🤫</div>`;
  }

  const grouped = {};
  spots.forEach(spot => {
    const key = spot.region || "taipei";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(spot);
  });

  return REGIONS
    .filter(r => grouped[r.id] && grouped[r.id].length)
    .map(r => `
        <div class="region-spots-group reveal in">
          <div class="region-spots-group-head"><span class="ico">📍</span><span>${lang === "en" ? r.en : r.ko}</span></div>
          ${spotCardsHtml(grouped[r.id], category, lang)}
        </div>`).join("");
}

function tipsHtml(tips) {
  return tips.map((h, i) => `
        <div class="region-highlight-card reveal in" style="--i:${i}">
          <span class="num">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3>${h.title}</h3>
            <p>${h.desc}</p>
          </div>
        </div>`).join("");
}

function checklistHtml(items) {
  return items.map(a => `
        <li><span class="check">✓</span>${a}</li>`).join("");
}

function englishCategoryPage(category, content, spots) {
  const en = content.en;
  const title = `${category.en} in Taiwan · ${SITE_NAME_EN}`;
  const description = `${category.en} in Taiwan — ${en.sub}`;
  const canonicalUrl = `https://taiwanbite.com/en/category-${category.id}`;
  const koUrl = `https://taiwanbite.com/category-${category.id}`;
  const ogImage = `https://taiwanbite.com/assets/images/categories/${category.id}.webp`;
  let out = template;

  out = out.replace("<html lang=\"ko\">", "<html lang=\"en\">");
  out = out.replace(
    '<title id="pageTitle">카테고리 가이드 · 나만 알고 싶은 대만 맛집</title>',
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
    `<meta id="ogImage" property="og:image" content="${ogImage}" />`
  );

  const graph = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://taiwanbite.com/en" },
        { "@type": "ListItem", "position": 2, "name": "Find Spots", "item": "https://taiwanbite.com/en#categories" },
        { "@type": "ListItem", "position": 3, "name": `${category.en} in Taiwan`, "item": canonicalUrl },
      ],
    },
    {
      "@type": "CollectionPage",
      "name": `${category.en} in Taiwan`,
      "description": description,
      "url": canonicalUrl,
      "image": ogImage,
    },
  ];
  if (spots.length) {
    graph.push({
      "@type": "ItemList",
      "name": `${category.en} in Taiwan`,
      "numberOfItems": spots.length,
      "itemListElement": spots.map((spot, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": spot.name || category.en,
          ...(spot.address ? { "address": spot.address } : {}),
          "geo": { "@type": "GeoCoordinates", "latitude": spot.lat, "longitude": spot.lng },
        },
      })),
    });
  }
  const ldJson = { "@context": "https://schema.org", "@graph": graph };
  out = out.replace(
    /<script type="application\/ld\+json" id="ldJson">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="ldJson">${JSON.stringify(ldJson)}</script>`
  );
  out = out.replace(
    '<img class="hero-img" id="categoryHeroImg" src="" alt="" />',
    `<img class="hero-img" id="categoryHeroImg" src="assets/images/categories/${category.id}.webp" alt="${escAttr(category.en)}" />`
  );
  out = out.replace(
    '<span class="eyebrow" id="categoryEyebrow">Taiwan Food Guide</span>',
    `<span class="eyebrow" id="categoryEyebrow">${escAttr(content.tagEn)}</span>`
  );
  out = out.replace(
    '<h1 id="categoryTitle">&nbsp;</h1>',
    `<h1 id="categoryTitle">${escAttr(category.en)} in Taiwan</h1>`
  );
  out = out.replace(
    '<p id="categoryTagline">&nbsp;</p>',
    `<p id="categoryTagline">${escAttr(en.sub)}</p>`
  );
  out = out.replace(
    '<button class="lang-btn" id="langBtn">KO ▾</button>',
    '<button class="lang-btn" id="langBtn">EN ▾</button>'
  );
  out = out.replace(
    'id="categoryFullMapLink" href="/map"',
    `id="categoryFullMapLink" href="/map?cat=${category.id}"`
  );
  out = out.replace(
    '<p class="region-intro" id="categoryIntro"></p>',
    `<p class="region-intro" id="categoryIntro">${en.intro}</p>`
  );
  out = out.replace(
    '<div class="region-highlight-grid" id="categoryTips"></div>',
    `<div class="region-highlight-grid" id="categoryTips">${tipsHtml(en.tips)}</div>`
  );
  out = out.replace(
    '<ul class="region-activity-list" id="categoryChecklist"></ul>',
    `<ul class="region-activity-list" id="categoryChecklist">${checklistHtml(en.checklist)}</ul>`
  );
  out = out.replace(
    /<div id="categorySpotsList">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
    `<div id="categorySpotsList">${categorySpotsListHtml(category, spots, "en")}</div>\n      </div>\n    </div>\n  </section>`
  );

  out = ensureHreflang(out, koUrl, canonicalUrl);
  out = englishSiteNav(out, "categories");
  out = pointHubLinksAtEnglish(out);
  out = applyLangSwitcher(out, `/category-${category.id}`, `/en/category-${category.id}`, "en");
  out = bakeEnglishCopy(out, loadEnglishDict());
  return rootAbsoluteLocalAssets(out);
}

/* ===================== category-<id>.html 생성 ===================== */
const template = fs.readFileSync(path.join(root, "category.html"), "utf8");
let generatedCount = 0;

async function main() {
for (const category of CATEGORIES) {
  const content = CATEGORY_CONTENT[category.id];
  if (!content || !content.ko) continue;
  const ko = content.ko;

  const title = `대만 ${category.ko} 맛집 가이드 · 나만 알고 싶은 대만 맛집`;
  const description = `대만 ${category.ko} 맛집 정보 — ${ko.sub}`;
  const canonicalUrl = `https://taiwanbite.com/category-${category.id}`;
  const enUrl = `https://taiwanbite.com/en/category-${category.id}`;
  const hasEnglish = !!(content.en && content.en.intro && content.en.tips && content.en.checklist);
  const ogImage = `https://taiwanbite.com/assets/images/categories/${category.id}.webp`;

  let out = template;

  out = out.replace(
    '<title id="pageTitle">카테고리 가이드 · 나만 알고 싶은 대만 맛집</title>',
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
  out = out.replace(
    /<meta id="ogImage" property="og:image" content="[^"]*" \/>/,
    `<meta id="ogImage" property="og:image" content="${ogImage}" />`
  );

  const spots = await fetchCategorySpots(category.id);

  const graph = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://taiwanbite.com/" },
        { "@type": "ListItem", "position": 2, "name": "카테고리", "item": "https://taiwanbite.com/#categories" },
        { "@type": "ListItem", "position": 3, "name": `${category.ko} 맛집 가이드`, "item": canonicalUrl },
      ],
    },
    {
      "@type": "CollectionPage",
      "name": `${category.ko} 맛집 가이드`,
      "description": description,
      "url": canonicalUrl,
      "image": ogImage,
    },
  ];
  if (spots.length) {
    graph.push({
      "@type": "ItemList",
      "name": `대만에 등록된 ${category.ko} 맛집`,
      "numberOfItems": spots.length,
      "itemListElement": spots.map((spot, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": spot.name || category.ko,
          ...(spot.address ? { "address": spot.address } : {}),
          "geo": { "@type": "GeoCoordinates", "latitude": spot.lat, "longitude": spot.lng },
        },
      })),
    });
  }
  const ldJson = { "@context": "https://schema.org", "@graph": graph };
  out = out.replace(
    /<script type="application\/ld\+json" id="ldJson">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="ldJson">${JSON.stringify(ldJson)}</script>`
  );
  out = out.replace(
    '<img class="hero-img" id="categoryHeroImg" src="" alt="" />',
    `<img class="hero-img" id="categoryHeroImg" src="assets/images/categories/${category.id}.webp" alt="${escAttr(category.ko)}" />`
  );
  out = out.replace(
    '<span class="eyebrow" id="categoryEyebrow">Taiwan Food Guide</span>',
    `<span class="eyebrow" id="categoryEyebrow">${escAttr(content.tagKo)}</span>`
  );
  out = out.replace(
    '<h1 id="categoryTitle">&nbsp;</h1>',
    `<h1 id="categoryTitle">대만 ${escAttr(category.ko)} 맛집 가이드</h1>`
  );
  out = out.replace(
    '<p id="categoryTagline">&nbsp;</p>',
    `<p id="categoryTagline">${escAttr(ko.sub)}</p>`
  );
  out = out.replace(
    'id="categoryFullMapLink" href="/map"',
    `id="categoryFullMapLink" href="/map?cat=${category.id}"`
  );
  out = out.replace(
    '<p class="region-intro" id="categoryIntro"></p>',
    `<p class="region-intro" id="categoryIntro">${ko.intro}</p>`
  );
  out = out.replace(
    '<div class="region-highlight-grid" id="categoryTips"></div>',
    `<div class="region-highlight-grid" id="categoryTips">${tipsHtml(ko.tips)}</div>`
  );
  out = out.replace(
    '<ul class="region-activity-list" id="categoryChecklist"></ul>',
    `<ul class="region-activity-list" id="categoryChecklist">${checklistHtml(ko.checklist)}</ul>`
  );

  out = out.replace(
    /<div id="categorySpotsList">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
    `<div id="categorySpotsList">${categorySpotsListHtml(category, spots)}</div>\n      </div>\n    </div>\n  </section>`
  );

  if (hasEnglish) {
    out = ensureHreflang(out, canonicalUrl, enUrl);
    out = applyLangSwitcher(out, `/category-${category.id}`, `/en/category-${category.id}`, "ko");
  }

  fs.writeFileSync(path.join(root, `category-${category.id}.html`), out);
  generatedCount++;

  if (hasEnglish) {
    fs.mkdirSync(path.join(root, "en"), { recursive: true });
    fs.writeFileSync(path.join(root, "en", `category-${category.id}.html`), englishCategoryPage(category, content, spots));
  }
}

console.log(`category-*.html ${generatedCount}개 + en/category-*.html 생성 완료`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
