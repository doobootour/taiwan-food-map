// sitemap.xml을 데이터 파일(js/data.js, js/blog-content.js) 기준으로 미리 구워주는 스크립트.
// 지역/카테고리/블로그 글이 추가되거나 정적 페이지 내용이 바뀌면 `node scripts/generate-sitemap.js`를
// 다시 실행해서 <lastmod>를 최신화하고 새 URL을 반영해야 한다.
//
// <lastmod>는 실행일이 아니라 각 URL에 대응하는 HTML 파일의 마지막 '내용' 커밋 날짜다
// (캐시 버스터 ?v= 교체, 분석 스크립트 위치, Article/RSS 메타, 공유 푸터 문장만 바꾼 커밋은 제외).
// 이번 실행에서 그 파일의 내용이 작업 트리에 있으면 오늘(Asia/Taipei)을 쓴다.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { loadFileHistory, dirtyContentFiles, lastmodDay } = require("./lib/git-dates");

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
const { BLOG_LIST } = loadGlobals(["js/blog-content.js"]);
const { slugForSpot, comboSlug } = require("./lib/spot-slug");
const { isIndexableSpot } = require("./lib/indexable");

const REGION_IDS = new Set(REGIONS.map(r => r.id));
const CATEGORY_IDS = new Set(CATEGORIES.map(c => c.id));

const supabaseConfigSrc = fs.readFileSync(path.join(root, "js/supabase-config.js"), "utf8");
const SUPABASE_URL = supabaseConfigSrc.match(/SUPABASE_URL\s*=\s*"([^"]+)"/)[1];
const SUPABASE_ANON_KEY = supabaseConfigSrc.match(/SUPABASE_ANON_KEY\s*=\s*"([^"]+)"/)[1];
const MIN_COMBO_SPOTS = 3;

async function fetchAllSpots() {
  // name을 빼먹으면 slugForSpot()이 항상 "이름 slug 없음" 상태로 취급해서, 실제 파일명(이름 포함)과
  // 다른 id-only URL을 사이트맵에 적어넣는 버그가 생긴다 — generate-spot-pages.js가 만드는 실제
  // 파일명과 똑같은 필드를 select해야 한다.
  const url = `${SUPABASE_URL}/rest/v1/eats?select=id,name,category,region,review,address&order=id.asc`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
  return res.json();
}

function fileForLoc(loc) {
  const pathname = new URL(loc).pathname;
  if (pathname === "/" || pathname === "") return "index.html";
  // /en/region-taipei → en/region-taipei.html (git lastmod of that file)
  const slug = pathname.replace(/^\//, "").replace(/\/$/, "");
  return `${slug}.html`;
}

const TAIPEI_KO = "https://taiwanbite.com/region-taipei";
const TAIPEI_EN = "https://taiwanbite.com/en/region-taipei";

function xhtmlAlternates(loc) {
  if (loc !== TAIPEI_KO && loc !== TAIPEI_EN) return "";
  return (
    `<xhtml:link rel="alternate" hreflang="ko" href="${TAIPEI_KO}"/>` +
    `<xhtml:link rel="alternate" hreflang="en" href="${TAIPEI_EN}"/>` +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${TAIPEI_KO}"/>`
  );
}

async function main() {
  const history = loadFileHistory();
  const dirty = dirtyContentFiles();
  const spots = (await fetchAllSpots()).filter(s => REGION_IDS.has(s.region) && CATEGORY_IDS.has(s.category));
  const indexableSpots = spots.filter(isIndexableSpot);

  const byRegionCategory = {};
  spots.forEach(s => {
    const key = `${s.region}|${s.category}`;
    (byRegionCategory[key] = byRegionCategory[key] || []).push(s);
  });
  const comboKeys = Object.keys(byRegionCategory).filter(k => byRegionCategory[k].length >= MIN_COMBO_SPOTS);

  const urls = [
    { loc: "https://taiwanbite.com/", changefreq: "weekly", priority: "1.0" },
    { loc: "https://taiwanbite.com/map", changefreq: "daily", priority: "0.9" },
    ...REGIONS.flatMap(r => {
      const ko = { loc: `https://taiwanbite.com/region-${r.id}`, changefreq: "weekly", priority: "0.8" };
      if (r.id !== "taipei") return [ko];
      return [ko, { loc: TAIPEI_EN, changefreq: "weekly", priority: "0.8" }];
    }),
    ...CATEGORIES.map(c => ({ loc: `https://taiwanbite.com/category-${c.id}`, changefreq: "weekly", priority: "0.7" })),
    ...comboKeys.map(k => {
      const [regionId, categoryId] = k.split("|");
      return { loc: `https://taiwanbite.com/${comboSlug(regionId, categoryId)}`, changefreq: "weekly", priority: "0.65" };
    }),
    { loc: "https://taiwanbite.com/blog", changefreq: "weekly", priority: "0.7" },
    ...BLOG_LIST.map(p => ({ loc: `https://taiwanbite.com/blog-${p.slug}`, changefreq: "monthly", priority: "0.6" })),
    ...indexableSpots.map(s => ({ loc: `https://taiwanbite.com/${slugForSpot(s)}`, changefreq: "monthly", priority: "0.5" })),
    { loc: "https://taiwanbite.com/board", changefreq: "daily", priority: "0.6" },
    { loc: "https://taiwanbite.com/about", changefreq: "monthly", priority: "0.4" },
    { loc: "https://taiwanbite.com/privacy", changefreq: "yearly", priority: "0.3" },
  ];

  const dated = urls.map(u => ({ ...u, lastmod: lastmodDay(fileForLoc(u.loc), history, dirty) }));
  const body = dated
    .map(u => `  <url><loc>${u.loc}</loc>${xhtmlAlternates(u.loc)}<lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`;

  fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
  const uniqueDays = new Set(dated.map(u => u.lastmod));
  console.log(`sitemap.xml ${dated.length}개 URL(색인 스팟 ${indexableSpots.length}개, noindex로 제외 ${spots.length - indexableSpots.length}개, 조합 ${comboKeys.length}개 포함), lastmod ${uniqueDays.size}개 날짜(${[...uniqueDays].sort().join(", ")})로 생성 완료`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
