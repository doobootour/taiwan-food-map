// 블로그 포스트(blog-*.html) 본문을 정적 HTML로 미리 구워주는 스크립트.
// js/blog-content.js 내용을 바꾼 뒤에는 `node scripts/generate-blog-pages.js`를 다시 실행해야
// 검색엔진(특히 자바스크립트를 거의 실행하지 않는 네이버 크롤러)이 보는 본문도 함께 최신화된다.
//
// 이전에는 blog-<slug>.html의 <div id="blogArticle"></div>가 빈 채로 배포되어,
// 실제 글 본문은 js/blog.js가 브라우저에서 렌더링해야만 보였다(크롤러가 보는 raw HTML은 비어 있었음).
// 이 스크립트는 js/blog.js의 renderPost()/blockHtml()과 동일한 마크업을 빌드 시점에 만들어 그 자리에 심는다.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { loadFileHistory, blogDates, formatTaipeiDot } = require("./lib/git-dates");
const { sortBlogPosts, publishRaw } = require("../js/blog-order");

const root = path.join(__dirname, "..");
const SITE = "https://taiwanbite.com";
const AUTHOR_NAME = "나만 알고 싶은 대만 맛집 편집팀";
const AUTHOR_DESCRIPTION = {
  ko: "대만에서 20년 산 현지인이 한국 여행자들의 실제 후기를 모으고 골라 정리한 대만 맛집.",
  en: "Taiwan restaurant picks gathered and curated from real reviews by Korean travelers, by a local who has lived in Taiwan for 20 years.",
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

const { BLOG_LIST, BLOG_POSTS } = loadGlobals(["js/blog-content.js"]);

// js/blog.js의 blockHtml()과 동일하게 유지할 것 — 저 파일을 바꾸면 여기도 함께 바꿔야 한다.
function blockHtml(block) {
  switch (block.type) {
    case "p":
      return `<p>${block.html}</p>`;
    case "h2":
      return `<h2 class="region-h2">${block.text}</h2>`;
    case "compareTable": {
      const valueCount = block.rows[0] && Array.isArray(block.rows[0].values) ? block.rows[0].values.length : block.cities.length;
      const cornerIsHeader = block.cities.length === valueCount + 1;
      const corner = cornerIsHeader ? block.cities[0] : "";
      const headers = cornerIsHeader ? block.cities.slice(1) : block.cities;
      return `
          <div class="blog-compare-table-wrap">
            <table class="blog-compare-table">
              <thead><tr><th>${corner}</th>${headers.map(c => `<th>${c}</th>`).join("")}</tr></thead>
              <tbody>
                ${block.rows.map(row => `<tr><td>${row.label}</td>${row.values.map(v => `<td>${v}</td>`).join("")}</tr>`).join("")}
              </tbody>
            </table>
          </div>`;
    }
    case "cityGrid":
      return `
          <div class="blog-city-grid">
            ${block.items.map(item => `
              <div class="blog-city-card">
                <img src="${item.img}" alt="${item.name}" loading="lazy" />
                <div class="body">
                  <span class="tag">${item.tag}</span>
                  <h3 class="name">${item.name}</h3>
                  <p>${item.desc}</p>
                </div>
              </div>`).join("")}
          </div>`;
    case "figureGrid":
      return `
          <div class="blog-figure-grid">
            ${block.items.map(item => `<img src="${item.img}" alt="${item.caption || ""}" loading="lazy" />`).join("")}
          </div>`;
    case "figure":
      return `
          <figure class="blog-figure">
            <img src="${block.img}" alt="${block.caption || ""}" loading="lazy" />
            ${block.caption ? `<figcaption>${block.caption}</figcaption>` : ""}
          </figure>`;
    case "quote":
      return `<blockquote class="blog-quote">${block.text}</blockquote>`;
    case "tipList":
      return `
          <div class="blog-tip-list">
            ${block.items.map(tip => `<div class="blog-tip"><span class="mark">${tip.mark}</span><p><b>${tip.b}</b> ${tip.desc}</p></div>`).join("")}
          </div>`;
    case "cta":
      return `
          <div class="blog-cta">
            <div><h3>${block.title}</h3><p>${block.desc}</p></div>
            <a class="blog-cta-btn" href="${block.href}">${block.btn}</a>
          </div>`;
    case "note":
      return `<footer class="blog-sources">${block.text}</footer>`;
    default:
      return "";
  }
}

// js/blog.js의 renderPost()와 동일한 마크업
function articleHtml(c) {
  return `
      <div class="blog-post-meta">
        <span>${c.metaAuthor}</span><span class="dot"></span><span>${c.metaTopic}</span>
      </div>

      <p class="region-intro">${c.intro}</p>

      ${c.blocks.map(blockHtml).join("")}
    `;
}

function dateParagraph(dates) {
  const publishedLabel = formatTaipeiDot(dates.published);
  const modifiedLabel = formatTaipeiDot(dates.modified);
  const published = `<time datetime="${dates.published}">${publishedLabel}</time> 게시`;
  if (publishedLabel === modifiedLabel) {
    return `<p class="blog-post-date">${published}</p>`;
  }
  return `<p class="blog-post-date">${published} · <time datetime="${dates.modified}">${modifiedLabel}</time> 수정</p>`;
}

function upsertArticleMeta(html, dates) {
  const block = `<meta property="article:published_time" content="${dates.published}" />\n<meta property="article:modified_time" content="${dates.modified}" />\n`;
  if (html.includes('property="article:published_time"')) {
    return html.replace(
      /<meta property="article:published_time" content="[^"]*" \/>\n<meta property="article:modified_time" content="[^"]*" \/>\n/,
      block
    );
  }
  const marker = '<meta property="og:type" content="article" />\n';
  if (!html.includes(marker)) return html;
  return html.replace(marker, marker + block);
}

function upsertJsonLd(html, slug, dates, lang = "ko") {
  const description = AUTHOR_DESCRIPTION[lang] || AUTHOR_DESCRIPTION.ko;
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (full, json) => {
    let data;
    try {
      data = JSON.parse(json);
    } catch {
      return full;
    }
    const graph = Array.isArray(data["@graph"]) ? data["@graph"] : null;
    if (!graph) return full;
    const article = graph.find(node => node["@type"] === "Article");
    if (!article) return full;
    article.datePublished = dates.published;
    article.dateModified = dates.modified;
    const author = article.author && typeof article.author === "object" ? article.author : {};
    article.author = {
      "@type": author["@type"] || "Organization",
      name: author.name || AUTHOR_NAME,
      ...(author.url ? { url: author.url } : { url: `${SITE}/` }),
      description,
    };
    article.mainEntityOfPage = `${SITE}/blog-${slug}`;
    article.inLanguage = lang === "en" ? "en" : "ko";
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });
}

function authorBlurbHtml(lang) {
  const text = AUTHOR_DESCRIPTION[lang] || AUTHOR_DESCRIPTION.ko;
  return `<p class="blog-post-author" id="blogAuthorBlurb" data-ko="${escapeHtml(AUTHOR_DESCRIPTION.ko)}" data-en="${escapeHtml(AUTHOR_DESCRIPTION.en)}">${escapeHtml(text)}</p>`;
}

function upsertAuthorBlurb(html, lang = "ko") {
  const paragraph = authorBlurbHtml(lang);
  if (html.includes('id="blogAuthorBlurb"')) {
    return html.replace(/<p class="blog-post-author" id="blogAuthorBlurb"[\s\S]*?<\/p>/, paragraph);
  }
  if (!html.includes('class="blog-post-date"')) return html;
  return html.replace(/<p class="blog-post-date">[\s\S]*?<\/p>/, match => `${match}\n      ${paragraph}`);
}

function upsertVisibleDate(html, dates) {
  const paragraph = dateParagraph(dates);
  if (html.includes('class="blog-post-date"')) {
    return html.replace(/<p class="blog-post-date">[\s\S]*?<\/p>/, paragraph);
  }
  return html.replace(
    /(<p class="blog-post-dek" id="blogHeroDek">[\s\S]*?<\/p>)/,
    `$1\n      ${paragraph}`
  );
}

function cardHtml(post, lang) {
  const c = (lang === "en" ? post.en : post.ko) || post.ko;
  if (!c) return "";
  return `        <a class="blog-card" href="/blog-${post.slug}">
          <img class="blog-card-img" src="${escapeHtml(post.image || "")}" alt="${escapeHtml(c.title || "")}" />
          <div class="blog-card-body">
            <span class="blog-card-eyebrow">${escapeHtml(c.eyebrow || "")}</span>
            <h3>${escapeHtml(c.title || "")}</h3>
            <p>${escapeHtml(c.desc || "")}</p>
            <span class="blog-card-meta">${escapeHtml(c.meta || "")}</span>
          </div>
        </a>`;
}

function replaceBlogGrid(html, cards) {
  const startMarker = '<div class="blog-card-grid" id="blogListGrid">';
  const start = html.indexOf(startMarker);
  if (start < 0) return html;
  const navAt = html.indexOf('<nav class="blog-pagination"', start);
  if (navAt < 0) return html;
  const close = html.lastIndexOf("</div>", navAt);
  if (close < start) return html;
  return `${html.slice(0, start + startMarker.length)}\n${cards.join("\n")}\n      ${html.slice(close)}`;
}

function upsertPublishedDates(html, datesBySlug) {
  const tag = `<script type="application/json" id="blogPublishedDates">${JSON.stringify(datesBySlug)}</script>\n`;
  if (html.includes('id="blogPublishedDates"')) {
    return html.replace(/<script type="application\/json" id="blogPublishedDates">[\s\S]*?<\/script>\n?/, tag);
  }
  const marker = '<script src="js/blog-content.js';
  if (!html.includes(marker)) return html;
  return html.replace(marker, tag + marker);
}

function ensureBlogOrderScript(html) {
  if (html.includes("js/blog-order.js")) return html;
  const match = html.match(/<script src="js\/blog\.js\?v=\d+"><\/script>/);
  if (!match) return html;
  const v = match[0].match(/\?v=(\d+)/)[1];
  return html.replace(match[0], `<script src="js/blog-order.js?v=${v}"></script>\n${match[0]}`);
}

// 목록(blog.html, 그리고 en/blog.html이 있으면 그쪽도)을 게시일 내림차순으로 다시 심는다.
// 발행 봇은 카드를 BLOG_LIST 순서로 덧붙이기만 하므로, 이 스크립트를 돌리는 발행 파이프라인이
// 다음 글도 맨 위에 오도록 유지한다. 날짜 맵은 각 글의 article:published_time과 같은 값이다.
function syncBlogIndex(filePath, lang, publishedBySlug) {
  if (!fs.existsSync(filePath)) return false;
  let html = fs.readFileSync(filePath, "utf8");
  if (!html.includes('id="blogListGrid"')) return false;
  const sorted = sortBlogPosts(BLOG_LIST, publishedBySlug);
  const cards = sorted.map(post => cardHtml(post, lang)).filter(Boolean);
  const datesForClient = {};
  sorted.forEach(post => {
    const raw = publishRaw(post, publishedBySlug);
    if (raw && Number.isFinite(Date.parse(raw))) datesForClient[post.slug] = raw;
  });
  const before = html;
  html = replaceBlogGrid(html, cards);
  html = upsertPublishedDates(html, datesForClient);
  html = ensureBlogOrderScript(html);
  if (html === before) return false;
  fs.writeFileSync(filePath, html);
  return true;
}

const history = loadFileHistory();
let generatedCount = 0;
const publishedBySlug = {};

for (const post of BLOG_LIST) {
  const slug = post.slug;
  const data = BLOG_POSTS[slug];
  if (!data || !data.ko) continue;

  const filePath = path.join(root, `blog-${slug}.html`);
  if (!fs.existsSync(filePath)) {
    console.warn(`skip: ${filePath} 없음`);
    continue;
  }

  let out = fs.readFileSync(filePath, "utf8");
  const body = articleHtml(data.ko);
  const before = out;
  const articleRe = /<div class="wrap region-article" id="blogArticle">[\s\S]*?<\/div>\s*<\/section>/;

  if (!articleRe.test(out)) {
    console.warn(`no match, 본문을 심지 못함: ${filePath}`);
  } else {
    out = out.replace(
      articleRe,
      `<div class="wrap region-article" id="blogArticle">${body}</div>\n  </section>`
    );
  }

  // 게시일 = 이 경로가 처음 생긴 커밋, 수정일 = 본문이 마지막으로 바뀐 커밋.
  // 봇이 기존 글 HTML을 복사해 새 글을 넣어도 날짜 칸을 직접 쓰지 않아도 된다.
  const dates = blogDates(`blog-${slug}.html`, history);
  // git %cI is sometimes "Z" and sometimes "+00:00" for the same instant.
  // Keep the publish-date string already on the page when the instant matches,
  // so this run does not rewrite article dates just to change the suffix.
  const existingPublished = (out.match(/property="article:published_time" content="([^"]*)"/) || [])[1];
  const existingModified = (out.match(/property="article:modified_time" content="([^"]*)"/) || [])[1];
  if (existingPublished && Date.parse(existingPublished) === Date.parse(dates.published)) {
    dates.published = existingPublished;
  }
  if (existingModified && Date.parse(existingModified) === Date.parse(dates.modified)) {
    dates.modified = existingModified;
  }
  publishedBySlug[slug] = dates.published;
  out = upsertArticleMeta(out, dates);
  out = upsertJsonLd(out, slug, dates, "ko");
  out = upsertVisibleDate(out, dates);
  out = upsertAuthorBlurb(out, "ko");

  if (out === before) continue;

  fs.writeFileSync(filePath, out);
  generatedCount++;
}

let indexCount = 0;
if (syncBlogIndex(path.join(root, "blog.html"), "ko", publishedBySlug)) indexCount++;
if (syncBlogIndex(path.join(root, "en", "blog.html"), "en", publishedBySlug)) indexCount++;

const sortedForLog = sortBlogPosts(BLOG_LIST, publishedBySlug);
const top = sortedForLog.slice(0, 3).map(post => `${post.slug} ${publishRaw(post, publishedBySlug)}`).join(" | ");
console.log(`blog-*.html ${generatedCount}개 본문 정적화 완료, 목록 ${indexCount}개 정렬 (${top})`);
