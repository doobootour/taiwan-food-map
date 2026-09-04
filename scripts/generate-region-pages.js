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

const { REGIONS, REGION_CONTENT } = loadGlobals(["js/data.js", "js/region-content.js"]);

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
