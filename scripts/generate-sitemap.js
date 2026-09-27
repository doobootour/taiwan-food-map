// sitemap.xml을 데이터 파일(js/data.js, js/blog-content.js) 기준으로 미리 구워주는 스크립트.
// 지역/카테고리/블로그 글이 추가되거나 정적 페이지 내용이 바뀌면 `node scripts/generate-sitemap.js`를
// 다시 실행해서 <lastmod>를 최신화하고 새 URL을 반영해야 한다.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

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

const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: "https://taiwanbite.com/", changefreq: "weekly", priority: "1.0" },
  { loc: "https://taiwanbite.com/map", changefreq: "daily", priority: "0.9" },
  ...REGIONS.map(r => ({ loc: `https://taiwanbite.com/region-${r.id}`, changefreq: "weekly", priority: "0.8" })),
  ...CATEGORIES.map(c => ({ loc: `https://taiwanbite.com/category-${c.id}`, changefreq: "weekly", priority: "0.7" })),
  { loc: "https://taiwanbite.com/blog", changefreq: "weekly", priority: "0.7" },
  ...BLOG_LIST.map(p => ({ loc: `https://taiwanbite.com/blog-${p.slug}`, changefreq: "monthly", priority: "0.6" })),
  { loc: "https://taiwanbite.com/board", changefreq: "daily", priority: "0.6" },
  { loc: "https://taiwanbite.com/about", changefreq: "monthly", priority: "0.4" },
  { loc: "https://taiwanbite.com/privacy", changefreq: "yearly", priority: "0.3" },
];

const body = urls
  .map(u => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

fs.writeFileSync(path.join(root, "sitemap.xml"), xml);
console.log(`sitemap.xml ${urls.length}개 URL, lastmod=${today}로 생성 완료`);
