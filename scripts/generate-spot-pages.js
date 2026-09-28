// Supabase eats 테이블에 실제로 등록된 맛집 하나하나에 대해 개별 상세 페이지(<region>-<category>-<name>-<id>.html)를,
// 그리고 "지역 × 메뉴" 조합(예: 화롄 우육면)마다 롱테일 랜딩 페이지(<region>-<category>.html, 등록 3곳 이상인 조합만)를
// 정적 HTML로 생성하는 스크립트.
//
// region-*.html / category-*.html은 이미 등록 맛집을 나열하지만 "개별 페이지"가 없어서, 검색엔진이 색인할 수 있는
// 페이지 수 자체가 적었다. 이 스크립트가 그 빈틈을 메운다.
//
// 새로 등록되는 맛집을 반영하려면 재실행해야 한다: `node scripts/generate-spot-pages.js`
// (생성된 파일 목록이 바뀌면 scripts/generate-sitemap.js도 함께 재실행해서 sitemap.xml에 반영할 것)
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { slugForSpot, comboSlug } = require("./lib/spot-slug");

const root = path.join(__dirname, "..");
const SITE = "https://taiwanbite.com";
const ASSET_V = "1790588220";
const MIN_COMBO_SPOTS = 3;

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

const { REGIONS, CATEGORIES, REGION_CONTENT } = loadGlobals(["js/data.js", "js/region-content.js"]);
const { CATEGORY_CONTENT } = loadGlobals(["js/data.js", "js/category-content.js"]);

const REGION_BY_ID = Object.fromEntries(REGIONS.map(r => [r.id, r]));
const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

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

async function fetchAllSpots() {
  const url = `${SUPABASE_URL}/rest/v1/eats?select=id,lat,lng,category,region,review,name,address,nickname&order=id.asc`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
  return res.json();
}

// 좌표만으로 검색하면 구글맵이 업체 정보 없이 좌표 핀만 띄우는 경우가 많아서,
// 가게 이름 + 좌표 뷰포트(@lat,lng,zoom)로 검색해 실제 정보 페이지로 연결되게 한다
function googleMapsUrl(spot, fallbackLabel) {
  const query = encodeURIComponent(spot.name || fallbackLabel || "");
  return `https://www.google.com/maps/search/${query}/@${spot.lat},${spot.lng},17z`;
}

function pageShell({ title, description, canonicalPath, ogImage, ldJson, activeNav, bodyHtml }) {
  const canonicalUrl = `${SITE}${canonicalPath}`;
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R4BQHKRWZE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-R4BQHKRWZE');
</script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="#c2703f" />
<link rel="icon" type="image/png" href="assets/favicon.png" />
<title>${escapeHtml(title)}</title>
<link rel="canonical" href="${canonicalUrl}" />
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:site_name" content="나만 알고 싶은 대만 맛집" />
<meta property="og:locale" content="ko_KR" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${ogImage}" />
<meta name="twitter:card" content="summary_large_image" />
<script type="application/ld+json">${JSON.stringify(ldJson)}</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Pretendard:wght@400;500;600;700&display=swap" rel="stylesheet">

<link rel="stylesheet" href="css/styles.css?v=${ASSET_V}" />
</head>
<body>

<header id="site-header">
  <div class="wrap">
    <a href="/" class="brand">
      <img class="mark" src="assets/images/logo.webp" data-i18n-alt="brand_name" alt="나만 알고 싶은 대만 맛집" />
      <div class="name"><span data-i18n="brand_name">나만 알고 싶은 대만 맛집</span><small data-i18n="brand_tagline">My Secret Taiwan Eats</small></div>
    </a>

    <nav id="site-nav">
      <a href="/" data-i18n="nav_home">홈</a>
      <a href="/#categories" data-i18n="nav_categories">카테고리</a>
      <a href="/#regions"${activeNav === "regions" ? ' class="active"' : ""} data-i18n="nav_regions">지역</a>
      <a href="/map" data-i18n="nav_map">지도</a>
      <a href="/blog" data-i18n="nav_blog">블로그</a>
    </nav>

    <div class="header-right">
      <div class="lang-switch">
        <button class="lang-btn" id="langBtn">KO ▾</button>
        <div class="lang-menu" id="langMenu">
          <button data-lang="ko" class="active">한국어</button>
          <button data-lang="en">English</button>
        </div>
      </div>
      <a href="/map" class="btn primary" style="padding:10px 20px;font-size:13px;" data-i18n="btn_register">맛집 등록하기</a>
      <button class="menu-toggle" id="menuToggle" aria-label="메뉴"><span></span></button>
    </div>
  </div>
</header>

<main>
${bodyHtml}
</main>

<footer>
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="brand">
          <img class="mark" src="assets/images/logo.webp" data-i18n-alt="brand_name" alt="나만 알고 싶은 대만 맛집" />
          <div class="name"><span data-i18n="brand_name">나만 알고 싶은 대만 맛집</span><small data-i18n="brand_tagline">My Secret Taiwan Eats</small></div>
        </div>
        <p class="desc" data-i18n="footer_desc">한국인을 비롯한 전 세계 여행자들이 직접 찾고 검증하는 대만 맛집 지도. 함께 만들어가는 진짜 로컬 가이드입니다.</p>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer_explore">둘러보기</h4>
        <ul>
          <li><a href="/#categories" data-i18n="footer_categories">카테고리</a></li>
          <li><a href="/#regions" data-i18n="footer_regions">지역별 탐험</a></li>
          <li><a href="/map" data-i18n="footer_map">지도</a></li>
          <li><a href="/blog" data-i18n="footer_blog">블로그</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer_join">참여하기</h4>
        <ul>
          <li><a href="/map" data-i18n="footer_register">맛집 등록하기</a></li>
          <li><a href="/profile" data-i18n="footer_mypage">마이페이지</a></li>
          <li><a href="/about" data-i18n="footer_about">소개</a></li>
          <li><a href="/privacy" data-i18n="footer_privacy">개인정보처리방침</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 data-i18n="footer_lang">언어</h4>
        <ul>
          <li><button class="footer-lang-btn active" data-lang="ko">한국어</button></li>
          <li><button class="footer-lang-btn" data-lang="en">English</button></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span data-i18n="footer_copyright">© 2026 나만 알고 싶은 대만 맛집</span>
      <span>Made for travelers, by travelers</span>
    </div>
  </div>
</footer>

<div class="toast" id="toast"></div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/data.js?v=${ASSET_V}"></script>
<script src="js/i18n.js?v=${ASSET_V}"></script>
<script src="js/supabase-config.js?v=${ASSET_V}"></script>
<script src="js/admin.js?v=${ASSET_V}"></script>
<script src="js/app.js?v=${ASSET_V}"></script>
<!-- Naver Analytics -->
<script type="text/javascript" src="//wcs.pstatic.net/wcslog.js"></script>
<script type="text/javascript">
if(!wcs_add) var wcs_add = {};
wcs_add["wa"] = "1c1c692e90a9a80";
if(window.wcs) {
  wcs_do();
}
</script>
</body>
</html>
`;
}

function ctaBandHtml() {
  return `
  <section class="section tight">
    <div class="cta-band reveal">
      <div>
        <span class="eyebrow" style="color:rgba(255,255,255,0.85)">Join the map</span>
        <h2 data-i18n="cta_title">나만의 맛집을 공유해주세요 🤫</h2>
        <p data-i18n="cta_desc">여러분의 발견이 다른 여행자들에게 진짜 대만을 경험하게 해줍니다.</p>
      </div>
      <a href="/map" class="btn ghost" style="border-color:#fff;" data-i18n="cta_btn">지금 등록하기 →</a>
    </div>
  </section>`;
}

function siblingSpotCardHtml(spot, category) {
  return `
            <div class="region-spot-card">
              <span class="name">${escapeHtml(spot.name || category.ko)}</span>
              <span class="region-spot-links">
                <a class="view-link" href="/${slugForSpot(spot)}">상세 보기 →</a>
                <a class="view-link google-link" href="${googleMapsUrl(spot, category.ko)}" target="_blank" rel="noopener">구글맵에서 보기</a>
              </span>
            </div>`;
}

/* ===================== 개별 스팟 페이지 ===================== */
function buildSpotPage(spot, region, category, siblings, hasCombo) {
  const slug = slugForSpot(spot);
  const name = spot.name || `${region.ko} ${category.ko} 맛집`;
  const title = `${name} · ${region.ko} ${category.ko} 맛집 · 나만 알고 싶은 대만 맛집`;
  const reviewSnippet = spot.review && spot.review.trim() ? spot.review.trim() : "";
  const description = reviewSnippet
    ? `${reviewSnippet}`.slice(0, 90)
    : `여행자가 직접 등록한 ${region.ko}의 ${category.ko} 맛집, ${name}. 위치와 구글맵 링크를 확인해보세요.`;
  const ogImage = `${SITE}/assets/images/regions/${region.id}-og.jpg`;
  const mapsUrl = googleMapsUrl(spot, category.ko);

  const graph = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: `${region.ko} 여행 가이드`, item: `${SITE}/region-${region.id}` },
        { "@type": "ListItem", position: 3, name: `${category.ko} 맛집 가이드`, item: `${SITE}/category-${category.id}` },
        { "@type": "ListItem", position: 4, name, item: `${SITE}/${slug}` },
      ],
    },
    {
      "@type": "LocalBusiness",
      name,
      ...(spot.address ? { address: spot.address } : {}),
      geo: { "@type": "GeoCoordinates", latitude: spot.lat, longitude: spot.lng },
      url: `${SITE}/${slug}`,
    },
  ];

  const introHtml = reviewSnippet
    ? `<blockquote class="blog-quote">"${escapeHtml(reviewSnippet)}"</blockquote>`
    : `<p class="region-intro">여행자들이 직접 찾아가 등록한 ${escapeHtml(region.ko)}의 ${escapeHtml(category.ko)} 맛집이에요. 구글맵 링크와 좌표로 위치를 확인하고, 실제 지도에서 주변 맛집도 함께 둘러보세요.</p>`;

  const infoLines = [
    `<li><span class="check">✓</span>지역 — <a href="/region-${region.id}">${escapeHtml(region.ko)}</a></li>`,
    `<li><span class="check">✓</span>카테고리 — <a href="/category-${category.id}">${escapeHtml(category.ko)}</a></li>`,
  ];
  if (spot.address) infoLines.push(`<li><span class="check">✓</span>주소 — ${escapeHtml(spot.address)}</li>`);
  if (spot.nickname) infoLines.push(`<li><span class="check">✓</span>등록 — ${escapeHtml(spot.nickname)}님</li>`);

  const comboLinkHtml = hasCombo
    ? `<p style="margin:0 0 32px;"><a class="link-all" href="/${comboSlug(region.id, category.id)}">${escapeHtml(region.ko)} ${escapeHtml(category.ko)} 맛집 더보기 →</a></p>`
    : "";

  const siblingsHtml = siblings.length
    ? `
      <h2 class="region-h2">근처 다른 ${escapeHtml(category.ko)} 맛집</h2>
      <div class="region-spots-group">${siblings.map(s => siblingSpotCardHtml(s, category)).join("")}</div>`
    : "";

  const bodyHtml = `
  <!-- ================= HERO ================= -->
  <section class="hero region-hero">
    <img class="hero-img" src="${region.image}" alt="${escapeHtml(region.ko)}" />
    <div class="hero-scrim"></div>
    <div class="hero-content reveal">
      <span class="eyebrow">${escapeHtml(region.ko)} · ${escapeHtml(category.ko)} 맛집</span>
      <h1>${escapeHtml(name)}</h1>
      <p>여행자가 직접 등록한 ${escapeHtml(region.ko)}의 ${escapeHtml(category.ko)} 맛집이에요.</p>
    </div>
  </section>

  <!-- ================= ARTICLE ================= -->
  <section class="section">
    <div class="wrap region-article">
      <p class="region-intro" style="font-size:14px;">
        <a href="/">홈</a> › <a href="/region-${region.id}">${escapeHtml(region.ko)}</a> › <a href="/category-${category.id}">${escapeHtml(category.ko)}</a> › ${escapeHtml(name)}
      </p>

      ${introHtml}

      <h2 class="region-h2">맛집 정보</h2>
      <ul class="region-activity-list">
        ${infoLines.join("\n        ")}
      </ul>

      <div class="hero-actions" style="margin:8px 0 32px;">
        <a class="btn primary" href="${mapsUrl}" target="_blank" rel="noopener">구글맵에서 보기</a>
        <a class="btn outline" href="/map?lat=${spot.lat}&lng=${spot.lng}">지도에서 보기 →</a>
      </div>

      ${comboLinkHtml}
      ${siblingsHtml}
    </div>
  </section>
${ctaBandHtml()}`;

  return pageShell({ title, description, canonicalPath: `/${slug}`, ogImage, ldJson: { "@context": "https://schema.org", "@graph": graph }, bodyHtml });
}

/* ===================== 지역 × 메뉴 조합 페이지 ===================== */
function buildComboPage(region, category, spots) {
  const slug = comboSlug(region.id, category.id);
  const title = `${region.ko} ${category.ko} 맛집 · 나만 알고 싶은 대만 맛집`;
  const regionIntro = (REGION_CONTENT[region.id] && REGION_CONTENT[region.id].ko && REGION_CONTENT[region.id].ko.intro) || "";
  const categoryIntro = (CATEGORY_CONTENT[category.id] && CATEGORY_CONTENT[category.id].ko && CATEGORY_CONTENT[category.id].ko.intro) || "";
  const description = `여행자들이 직접 등록한 ${region.ko}의 ${category.ko} 맛집 ${spots.length}곳. 위치, 구글맵 링크와 함께 한눈에 모아봤어요.`;
  const ogImage = `${SITE}/assets/images/regions/${region.id}-og.jpg`;

  const graph = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: `${region.ko} 여행 가이드`, item: `${SITE}/region-${region.id}` },
        { "@type": "ListItem", position: 3, name: `${region.ko} ${category.ko} 맛집`, item: `${SITE}/${slug}` },
      ],
    },
    {
      "@type": "CollectionPage",
      name: `${region.ko} ${category.ko} 맛집`,
      description,
      url: `${SITE}/${slug}`,
      image: ogImage,
    },
    {
      "@type": "ItemList",
      name: `${region.ko}에 등록된 ${category.ko} 맛집`,
      numberOfItems: spots.length,
      itemListElement: spots.map((spot, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "LocalBusiness",
          name: spot.name || category.ko,
          ...(spot.address ? { address: spot.address } : {}),
          geo: { "@type": "GeoCoordinates", latitude: spot.lat, longitude: spot.lng },
          url: `${SITE}/${slugForSpot(spot)}`,
        },
      })),
    },
  ];

  const introParas = [
    `<p class="region-intro">${escapeHtml(region.ko)}에서 여행자들이 직접 찾아가 등록한 ${escapeHtml(category.ko)} 맛집 ${spots.length}곳을 모았어요. 이름을 눌러 상세 페이지에서 위치와 구글맵 링크를 바로 확인해보세요.</p>`,
  ];
  if (regionIntro) introParas.push(`<p class="region-intro">${regionIntro}</p>`);
  if (categoryIntro) introParas.push(`<p class="region-intro">${categoryIntro}</p>`);

  const spotsHtml = spots.map(s => siblingSpotCardHtml(s, category)).join("");

  const bodyHtml = `
  <!-- ================= HERO ================= -->
  <section class="hero region-hero">
    <img class="hero-img" src="${region.image}" alt="${escapeHtml(region.ko)}" />
    <div class="hero-scrim"></div>
    <div class="hero-content reveal">
      <span class="eyebrow">Taiwan Food Map</span>
      <h1>${escapeHtml(region.ko)} ${escapeHtml(category.ko)} 맛집</h1>
      <p>여행자들이 직접 등록한 ${escapeHtml(region.ko)}의 ${escapeHtml(category.ko)} 맛집 ${spots.length}곳</p>
      <div class="hero-actions">
        <a href="/region-${region.id}" class="btn primary">${escapeHtml(region.ko)} 여행 가이드 보기 →</a>
        <a href="/category-${category.id}" class="btn ghost">${escapeHtml(category.ko)} 맛집 가이드 보기 →</a>
      </div>
    </div>
  </section>

  <!-- ================= ARTICLE ================= -->
  <section class="section">
    <div class="wrap region-article">
      <p class="region-intro" style="font-size:14px;">
        <a href="/">홈</a> › <a href="/region-${region.id}">${escapeHtml(region.ko)}</a> › ${escapeHtml(region.ko)} ${escapeHtml(category.ko)} 맛집
      </p>

      ${introParas.join("\n      ")}

      <h2 class="region-h2">${escapeHtml(region.ko)} ${escapeHtml(category.ko)} 맛집 목록</h2>
      <div class="region-spots-group">${spotsHtml}</div>
    </div>
  </section>
${ctaBandHtml()}`;

  return pageShell({ title, description, canonicalPath: `/${slug}`, ogImage, ldJson: { "@context": "https://schema.org", "@graph": graph }, bodyHtml });
}

async function main() {
  const spots = (await fetchAllSpots()).filter(s => REGION_BY_ID[s.region] && CATEGORY_BY_ID[s.category]);

  const byRegionCategory = {};
  spots.forEach(s => {
    const key = `${s.region}|${s.category}`;
    (byRegionCategory[key] = byRegionCategory[key] || []).push(s);
  });

  const comboKeys = new Set(Object.keys(byRegionCategory).filter(k => byRegionCategory[k].length >= MIN_COMBO_SPOTS));

  let spotCount = 0;
  for (const spot of spots) {
    const region = REGION_BY_ID[spot.region];
    const category = CATEGORY_BY_ID[spot.category];
    const key = `${spot.region}|${spot.category}`;
    const siblings = byRegionCategory[key].filter(s => s.id !== spot.id).slice(0, 6);
    const html = buildSpotPage(spot, region, category, siblings, comboKeys.has(key));
    fs.writeFileSync(path.join(root, `${slugForSpot(spot)}.html`), html);
    spotCount++;
  }

  let comboCount = 0;
  for (const key of comboKeys) {
    const [regionId, categoryId] = key.split("|");
    const region = REGION_BY_ID[regionId];
    const category = CATEGORY_BY_ID[categoryId];
    const html = buildComboPage(region, category, byRegionCategory[key]);
    fs.writeFileSync(path.join(root, `${comboSlug(regionId, categoryId)}.html`), html);
    comboCount++;
  }

  console.log(`스팟 상세 페이지 ${spotCount}개, 지역×메뉴 조합 페이지 ${comboCount}개 생성 완료`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
