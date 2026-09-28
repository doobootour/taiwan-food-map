// 블로그 RSS 피드(rss.xml)를 만든다. 항목 순서는 js/blog-content.js의 BLOG_LIST,
// pubDate는 글 파일(blog-<slug>.html)이 처음 커밋된 시각(Asia/Taipei 커밋 시각)이다.
// 블로그 목록·글 head에 RSS autodiscovery 링크가 없으면 넣는다. 반복 실행해도 한 번만 들어간다.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { loadFileHistory, blogDates } = require("./lib/git-dates");

const root = path.join(__dirname, "..");
const SITE = "https://taiwanbite.com";
const RSS_LINK = '<link rel="alternate" type="application/rss+xml" title="나만 알고 싶은 대만 맛집 블로그" href="/rss.xml" />\n';

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

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function injectRssLink(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const before = fs.readFileSync(filePath, "utf8");
  if (before.includes('type="application/rss+xml"')) return false;
  let out = before;
  if (before.includes("<head>\r\n")) out = before.replace("<head>\r\n", "<head>\r\n" + RSS_LINK);
  else if (before.includes("<head>\n")) out = before.replace("<head>\n", "<head>\n" + RSS_LINK);
  else if (before.includes("<head>")) out = before.replace("<head>", "<head>\n" + RSS_LINK);
  else return false;
  if (out === before) return false;
  fs.writeFileSync(filePath, out);
  return true;
}

const { BLOG_LIST } = loadGlobals(["js/blog-content.js"]);
const history = loadFileHistory();

const items = [];
for (const post of BLOG_LIST) {
  const ko = post.ko;
  if (!ko || !ko.title) continue;
  const file = `blog-${post.slug}.html`;
  if (!fs.existsSync(path.join(root, file))) continue;
  const dates = blogDates(file, history);
  items.push({
    title: ko.title,
    description: ko.desc || ko.title,
    link: `${SITE}/blog-${post.slug}`,
    pubDate: new Date(dates.published).toUTCString(),
    publishedMs: new Date(dates.published).getTime(),
  });
}

const lastBuild = items.length
  ? new Date(Math.max(...items.map(item => item.publishedMs))).toUTCString()
  : new Date().toUTCString();

const itemXml = items.map(item => `    <item>
      <title>${xmlEscape(item.title)}</title>
      <link>${xmlEscape(item.link)}</link>
      <guid isPermaLink="true">${xmlEscape(item.link)}</guid>
      <description>${xmlEscape(item.description)}</description>
      <pubDate>${xmlEscape(item.pubDate)}</pubDate>
    </item>`).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>나만 알고 싶은 대만 맛집 블로그</title>
    <link>${SITE}/blog</link>
    <description>대만 여행 맛집·일정 가이드. 타이베이와 다른 도시의 먹을 곳과 동선을 정리합니다.</description>
    <language>ko</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${itemXml}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(root, "rss.xml"), xml);

let linked = 0;
const linkTargets = [
  path.join(root, "blog.html"),
  ...BLOG_LIST.map(post => path.join(root, `blog-${post.slug}.html`)),
];
for (const filePath of linkTargets) {
  if (injectRssLink(filePath)) linked++;
}

console.log(`rss.xml ${items.length}개 항목 생성, autodiscovery 링크 ${linked}개 파일에 추가`);
