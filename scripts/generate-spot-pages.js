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
const { googleMapsUrl, googleMapsLinkLabel } = require("./lib/google-maps-url");
const { isIndexableSpot } = require("./lib/indexable");

const root = path.join(__dirname, "..");
const SITE = "https://taiwanbite.com";
const ASSET_V = "1794023100";
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

/* 타이베이 인기 맛집 보강 데이터(주소·영업시간·휴무일·MRT·대표메뉴·가격대·정보형 소개).
   출처: 이미 확인된 정확한 구글맵 업체 정보 + 출처가 확인된 항목만. 없는 칸은 비워 둔다.
   선정 기준·출처는 scripts/data/spot-enrichment.json 의 meta 참고. */
const ENRICHMENT_PATH = path.join(__dirname, "data/spot-enrichment.json");
const ENRICHMENT = fs.existsSync(ENRICHMENT_PATH) ? JSON.parse(fs.readFileSync(ENRICHMENT_PATH, "utf8")) : { meta: {}, spots: {} };
const ENRICH_BY_ID = ENRICHMENT.spots || {};
/* 카테고리와 실제 업종이 다른 것으로 확인된 스팟(예: BBQ로 등록된 미국식 체인) — '근처 다른 ○○ 맛집'에서 뺀다. */
const CATEGORY_MISMATCH = new Set((ENRICHMENT.category_mismatch || []).map(x => Number(x.id)));

const NEAR_RADIUS_KM = 2;
const WIDE_RADIUS_KM = 5;
const MAX_SIBLINGS = 6;

function distanceKm(a, b) {
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/* '근처 다른 ○○ 맛집' 후보: 같은 지역 + 같은 카테고리 + 업종 불일치 제외 + 좌표 거리순.
   2km 안에 있으면 '근처', 없으면 5km 안을 '같은 지역'으로, 그것도 없으면 상자를 숨긴다. */
function pickSiblings(spot, sameRegionCategory) {
  if (CATEGORY_MISMATCH.has(Number(spot.id))) return { mode: "none", list: [] };
  const valid = n => typeof n === "number" && Number.isFinite(n);
  if (!valid(spot.lat) || !valid(spot.lng)) return { mode: "none", list: [] };
  const ranked = sameRegionCategory
    .filter(s => s.id !== spot.id && !CATEGORY_MISMATCH.has(Number(s.id)) && valid(s.lat) && valid(s.lng))
    .map(s => ({ ...s, _km: distanceKm(spot, s) }))
    .sort((a, b) => a._km - b._km);
  const near = ranked.filter(s => s._km <= NEAR_RADIUS_KM).slice(0, MAX_SIBLINGS);
  if (near.length) return { mode: "near", list: near };
  const wide = ranked.filter(s => s._km <= WIDE_RADIUS_KM).slice(0, MAX_SIBLINGS);
  if (wide.length) return { mode: "wide", list: wide };
  return { mode: "none", list: [] };
}

function formatKm(km) {
  return km < 1 ? `${Math.max(100, Math.round((km * 1000) / 100) * 100)}m` : `${km.toFixed(1)}km`;
}

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
  const pageSize = 1000;
  const select = "id,lat,lng,category,region,review,name,address,nickname,link";
  const all = [];
  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const url = `${SUPABASE_URL}/rest/v1/eats?select=${select}&order=id.asc`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Range: `${from}-${to}`,
        Prefer: "count=exact",
      },
    });
    if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
    const chunk = await res.json();
    all.push(...chunk);
    if (chunk.length < pageSize) break;
  }
  return all;
}


function pageShell({ title, description, canonicalPath, ogImage, ldJson, activeNav, bodyHtml, robots }) {
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
${robots ? `<meta name="robots" content="${robots}" />\n` : ""}<meta property="og:type" content="article" />
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
        <p class="desc" data-i18n="footer_desc">한국 여행자들의 실제 후기를 모아 고른 대만 맛집 지도. 함께 만들어가는 진짜 로컬 가이드입니다.</p>
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
              <span class="name">${escapeHtml(spot.name || category.ko)}${typeof spot._km === "number" ? ` <small style="color:var(--ink-soft,#7a6a5d);font-weight:500;">· 약 ${formatKm(spot._km)}</small>` : ""}</span>
              <span class="region-spot-links">
                <a class="view-link" href="/${slugForSpot(spot)}">상세 보기 →</a>
                <a class="view-link google-link" href="${googleMapsUrl(spot)}" target="_blank" rel="noopener">${googleMapsLinkLabel(spot, "ko")}</a>
              </span>
            </div>`;
}

/* 식당 예약대행(/reservation) 신청 링크 — 예약이 의미 있는 음식점 카테고리에만 붙인다.
   식당 이름과 (정확한 업체) 구글맵 링크를 신청 양식에 미리 채워 넘긴다. */
const NO_RESERVATION_CATEGORIES = new Set(["mart", "fruit", "gift_shop", "attraction", "shopping", "liquor_shop", "street_food", "bakery"]);
function reservationLinkHtml(spot, category, name, mapsHref) {
  if (NO_RESERVATION_CATEGORIES.has(category.id)) return "";
  const rawMaps = String(mapsHref || "").replace(/&amp;/g, "&");
  const params = new URLSearchParams({ name });
  if (/^https:\/\//.test(rawMaps)) params.set("map", rawMaps);
  const href = `/reservation?${params.toString()}`.replace(/&/g, "&amp;");
  return `<p style="margin:-14px 0 32px;"><a class="link-all" href="${href}">📞 이 식당 예약대행 신청 →</a></p>`;
}

/* ===================== 개별 스팟 페이지 ===================== */
function enrichmentInfoLines(e) {
  const lines = [];
  const li = (label, html) => `<li><span class="check">✓</span><span>${label} — ${html}</span></li>`;
  if (e.address_zh) lines.push(li("주소", `${escapeHtml(e.address_zh)}${e.address_en ? `<br><small style="color:var(--ink-soft,#7a6a5d);">${escapeHtml(e.address_en)}</small>` : ""}`));
  if (e.hours_summary && e.hours_summary.length) lines.push(li("영업시간", e.hours_summary.map(h => escapeHtml(h)).join("<br>")));
  if (e.closed_days) lines.push(li("휴무일", escapeHtml(e.closed_days)));
  if (e.mrt) lines.push(li("가까운 MRT역", `${escapeHtml(e.mrt.label)} · 직선 약 ${escapeHtml(e.mrt.distance)}`));
  if (e.menu && e.menu.length) lines.push(li("대표 메뉴", e.menu.map(m => escapeHtml(m.price ? `${m.name} ${m.price}` : m.name)).join(" · ")));
  if (e.price_range) lines.push(li("가격대", escapeHtml(e.price_range)));
  return lines;
}

function buildSpotPage(spot, region, category, siblingPick, hasCombo) {
  const siblings = siblingPick.list;
  const enrich = ENRICH_BY_ID[String(spot.id)] || null;
  const slug = slugForSpot(spot);
  const name = spot.name || `${region.ko} ${category.ko} 맛집`;
  const title = `${name} · ${region.ko} ${category.ko} 맛집 · 나만 알고 싶은 대만 맛집`;
  const reviewSnippet = spot.review && spot.review.trim() ? spot.review.trim() : "";
  const description = enrich && enrich.intro
    ? `${enrich.intro}`.slice(0, 110)
    : reviewSnippet
    ? `${reviewSnippet}`.slice(0, 90)
    : `여행자가 직접 등록한 ${region.ko}의 ${category.ko} 맛집, ${name}. 위치와 구글맵 링크를 확인해보세요.`;
  const ogImage = `${SITE}/assets/images/regions/${region.id}-og.jpg`;
  const mapsUrl = googleMapsUrl(spot);
  const mapsLabel = googleMapsLinkLabel(spot, "ko");

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
      ...(enrich && enrich.address_zh ? { address: enrich.address_zh } : spot.address ? { address: spot.address } : {}),
      ...(enrich && enrich.price_range_schema ? { priceRange: enrich.price_range_schema } : {}),
      geo: { "@type": "GeoCoordinates", latitude: spot.lat, longitude: spot.lng },
      url: `${SITE}/${slug}`,
    },
  ];

  const introHtml = reviewSnippet
    ? `<blockquote class="blog-quote">"${escapeHtml(reviewSnippet)}"</blockquote>`
    : enrich && enrich.intro
    ? ""
    : `<p class="region-intro">여행자들이 직접 찾아가 등록한 ${escapeHtml(region.ko)}의 ${escapeHtml(category.ko)} 맛집이에요. 구글맵 링크와 좌표로 위치를 확인하고, 실제 지도에서 주변 맛집도 함께 둘러보세요.</p>`;

  const infoLines = [
    `<li><span class="check">✓</span>지역 — <a href="/region-${region.id}">${escapeHtml(region.ko)}</a></li>`,
    `<li><span class="check">✓</span>카테고리 — <a href="/category-${category.id}">${escapeHtml(category.ko)}</a></li>`,
  ];
  if (enrich) infoLines.push(...enrichmentInfoLines(enrich));
  else if (spot.address) infoLines.push(`<li><span class="check">✓</span>주소 — ${escapeHtml(spot.address)}</li>`);
  if (spot.nickname) infoLines.push(`<li><span class="check">✓</span>등록 — ${escapeHtml(spot.nickname)}님</li>`);

  const comboLinkHtml = hasCombo
    ? `<p style="margin:0 0 32px;"><a class="link-all" href="/${comboSlug(region.id, category.id)}">${escapeHtml(region.ko)} ${escapeHtml(category.ko)} 맛집 더보기 →</a></p>`
    : "";

  const enrichIntroHtml = enrich && enrich.intro
    ? `<p class="region-intro">${escapeHtml(enrich.intro)}</p>`
    : "";
  const enrichNoteHtml = enrich
    ? `<p class="region-intro" style="font-size:13px;margin:-4px 0 24px;">주소·영업시간·휴무일은 구글 지도 업체 정보 기준(${escapeHtml(enrich.checked_at || "")} 확인)이에요. 명절·임시 휴무로 바뀔 수 있으니 출발 전 구글맵에서 한 번 더 확인해 주세요.</p>`
    : "";
  const siblingHeading = siblingPick.mode === "near"
    ? `근처 다른 ${escapeHtml(category.ko)} 맛집 <small style="font-size:14px;font-weight:500;">(${NEAR_RADIUS_KM}km 이내)</small>`
    : `같은 지역 다른 ${escapeHtml(category.ko)} 맛집 <small style="font-size:14px;font-weight:500;">(${WIDE_RADIUS_KM}km 이내)</small>`;
  const siblingsHtml = siblings.length
    ? `
      <h2 class="region-h2">${siblingHeading}</h2>
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
      ${enrichIntroHtml}

      <h2 class="region-h2">맛집 정보</h2>
      <ul class="region-activity-list">
        ${infoLines.join("\n        ")}
      </ul>
      ${enrichNoteHtml}

      <div class="hero-actions" style="margin:8px 0 32px;">
        <a class="btn primary" href="${mapsUrl}" target="_blank" rel="noopener">${mapsLabel}</a>
        <a class="btn outline" href="/map?lat=${spot.lat}&lng=${spot.lng}">지도에서 보기 →</a>
      </div>

      ${reservationLinkHtml(spot, category, name, mapsUrl)}
      ${comboLinkHtml}
      ${region.id === "hualien" ? `<p class="region-intro" style="margin:0 0 32px;">화롄 여행이라면 현지 여행사 두부투어의 화롄 맛집 지도와 타이루거 투어도 함께 참고해 보세요. <a class="link-all" href="https://doobootour.com/" target="_blank" rel="noopener">두부투어 화롄 맛집 지도 보기 →</a></p>` : ""}
      ${siblingsHtml}
    </div>
  </section>
${ctaBandHtml()}`;

  return pageShell({
    title,
    description,
    canonicalPath: `/${slug}`,
    ogImage,
    ldJson: { "@context": "https://schema.org", "@graph": graph },
    bodyHtml,
    robots: isIndexableSpot(spot) ? "" : "noindex,follow",
  });
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
  let indexableCount = 0;
  for (const spot of spots) {
    const region = REGION_BY_ID[spot.region];
    const category = CATEGORY_BY_ID[spot.category];
    const key = `${spot.region}|${spot.category}`;
    const siblingPick = pickSiblings(spot, byRegionCategory[key]);
    const html = buildSpotPage(spot, region, category, siblingPick, comboKeys.has(key));
    fs.writeFileSync(path.join(root, `${slugForSpot(spot)}.html`), html);
    spotCount++;
    if (isIndexableSpot(spot)) indexableCount++;
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

  console.log(`스팟 상세 페이지 ${spotCount}개 (색인 ${indexableCount}, noindex ${spotCount - indexableCount}), 지역×메뉴 조합 페이지 ${comboCount}개 생성 완료`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
