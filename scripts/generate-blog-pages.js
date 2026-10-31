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
const { EN_BLOG_SLUGS } = require("../js/blog-en");
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
    // Only rewrite top-level declarations. A global \blet\b replace also rewrote
    // English body text ("trains let you tap in" → "trains var you tap in").
    .replace(/^(?:const|let) /gm, "var ");
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
  const href = lang === "en" && EN_SET.has(post.slug) ? `/en/blog-${post.slug}` : `/blog-${post.slug}`;
  return `        <a class="blog-card" href="${href}">
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

function ensureBlogEnScript(html) {
  if (html.includes("js/blog-en.js")) return html;
  const match = html.match(/<script src="(\/?)js\/blog-order\.js\?v=(\d+)"><\/script>/);
  if (!match) return html;
  return html.replace(match[0], `<script src="${match[1]}js/blog-en.js?v=${match[2]}"></script>\n${match[0]}`);
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
  const source = lang === "en" ? BLOG_LIST.filter(post => EN_SET.has(post.slug) && fs.existsSync(enPostFile(post.slug))) : BLOG_LIST;
  const sorted = sortBlogPosts(source, publishedBySlug);
  const cards = sorted.map(post => cardHtml(post, lang)).filter(Boolean).map(card => (lang === "en" ? rootAbsoluteLocalAssets(card) : card));
  const datesForClient = {};
  sorted.forEach(post => {
    const raw = publishRaw(post, publishedBySlug);
    if (raw && Number.isFinite(Date.parse(raw))) datesForClient[post.slug] = raw;
  });
  const before = html;
  html = replaceBlogGrid(html, cards);
  html = upsertPublishedDates(html, datesForClient);
  html = ensureBlogOrderScript(html);
  if (lang === "en") html = ensureBlogEnScript(html);
  if (html === before) return false;
  fs.writeFileSync(filePath, html);
  return true;
}

// ===================== English pages (/en/blog, /en/blog-<slug>) =====================
// A post gets an English page when its slug is in js/blog-en.js and it has `en` content.
// Same approach as the /en region/category pages: a separate static file under en/,
// self canonical, ko/en/x-default(=ko) hreflang on both versions. No worker routing change.
const EN_SET = new Set(EN_BLOG_SLUGS.filter(slug => BLOG_POSTS[slug] && BLOG_POSTS[slug].en && BLOG_LIST.some(p => p.slug === slug && p.en)));
EN_BLOG_SLUGS.filter(slug => !EN_SET.has(slug)).forEach(slug => console.warn(`skip en: ${slug} (en 본문 또는 목록 항목 없음)`));
const EN_DICT = loadEnglishDict();
const EN_AUTHOR_NAME = "My Secret Taiwan Eats Editorial";
const PAIRED_HUB_RE = /href="\/((?:region|category)-[a-z0-9_]+)"/g;

function enPostFile(slug) {
  return path.join(root, "en", `blog-${slug}.html`);
}

function stripTags(s) {
  return String(s).replace(/<[^>]*>/g, "");
}

// Links inside English bodies: posts with an English page and paired hubs stay on /en.
// Klook affiliate targets switch from the Korean to the English storefront.
function englishBodyLinks(html) {
  return html
    .replace(/href="\/blog-([a-z0-9-]+)"/g, (m, slug) => (EN_SET.has(slug) ? `href="/en/blog-${slug}"` : m))
    .replace(PAIRED_HUB_RE, (m, rest) => (fs.existsSync(path.join(root, "en", `${rest}.html`)) ? `href="/en/${rest}"` : m))
    .replace(/(k_site=https%3A%2F%2Fwww\.klook\.com)%2Fko%2F/g, "$1%2Fen-US%2F");
}

function englishDateParagraph(dates) {
  const publishedLabel = formatTaipeiDot(dates.published);
  const modifiedLabel = formatTaipeiDot(dates.modified);
  const published = `Published <time datetime="${dates.published}">${publishedLabel}</time>`;
  if (publishedLabel === modifiedLabel) return `<p class="blog-post-date">${published}</p>`;
  return `<p class="blog-post-date">${published} · Updated <time datetime="${dates.modified}">${modifiedLabel}</time></p>`;
}

function setMeta(html, re, value) {
  return html.replace(re, (m, pre, post) => `${pre}${escapeHtml(value)}${post}`);
}

function englishHead(html, { title, description, url, ogTitle, ogType }) {
  let out = html.replace('<html lang="ko">', '<html lang="en">');
  out = out.replace(/<link rel="alternate" type="application\/rss\+xml"[^>]*\/>\n/, "");
  out = out.replace(/(<title id="pageTitle">)[\s\S]*?(<\/title>)/, (m, a, b) => `${a}${escapeHtml(title)}${b}`);
  out = out.replace(/<link rel="canonical"( id="canonicalLink")? href="[^"]*" \/>/, (m, id) => `<link rel="canonical"${id || ""} href="${url}" />`);
  out = setMeta(out, /(<meta id="pageDescription" name="description" content=")[^"]*(" \/>)/, description);
  out = out.replace(/<meta name="keywords" content="[^"]*" \/>\n/, "");
  out = setMeta(out, /(<meta property="og:url" content=")[^"]*(" \/>)/, url);
  out = out.replace('<meta property="og:locale" content="ko_KR" />', '<meta property="og:locale" content="en_US" />');
  out = setMeta(out, /(<meta (?:id="ogTitle" )?property="og:title" content=")[^"]*(" \/>)/, ogTitle || title);
  out = setMeta(out, /(<meta (?:id="ogDescription" )?property="og:description" content=")[^"]*(" \/>)/, description);
  return out;
}

function englishShell(html, koPath, enPath) {
  let out = ensureHreflang(html, `${SITE}${koPath}`, `${SITE}${enPath}`);
  out = englishSiteNav(out, "blog");
  out = pointHubLinksAtEnglish(out);
  out = applyLangSwitcher(out, koPath, enPath, "en");
  out = bakeEnglishCopy(out, EN_DICT);
  out = out.replace('aria-label="블로그 페이지 이동"', 'aria-label="Blog pages"');
  return rootAbsoluteLocalAssets(out);
}

function englishPostPage(koHtml, listItem, data, slug, dates) {
  const en = data.en;
  const url = `${SITE}/en/blog-${slug}`;
  const headline = stripTags(en.title);
  let out = englishHead(koHtml, { title: en.pageTitle, description: en.metaDescription, url, ogTitle: en.ogTitle });
  out = out.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (full, json) => {
    let ld;
    try { ld = JSON.parse(json); } catch { return full; }
    (ld["@graph"] || []).forEach(node => {
      if (node["@type"] === "BreadcrumbList") {
        node.itemListElement = [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/en` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/en/blog` },
          { "@type": "ListItem", position: 3, name: headline, item: url },
        ];
      }
      if (node["@type"] === "Article") {
        node.headline = headline;
        node.description = en.metaDescription;
        if (node.publisher) node.publisher.name = SITE_NAME_EN;
        node.author = { "@type": "Organization", name: EN_AUTHOR_NAME, url: `${SITE}/en`, description: AUTHOR_DESCRIPTION.en };
        node.mainEntityOfPage = url;
        node.inLanguage = "en";
        node.datePublished = dates.published;
        node.dateModified = dates.modified;
      }
    });
    return `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
  });
  out = out.replace(/(<span class="eyebrow" id="blogHeroEyebrow">)[\s\S]*?(<\/span>)/, (m, a, b) => `${a}${escapeHtml(en.eyebrow)}${b}`);
  out = out.replace(/(<h1 class="blog-post-title" id="blogHeroTitle">)[\s\S]*?(<\/h1>)/, (m, a, b) => `${a}${en.title}${b}`);
  out = out.replace(/(<p class="blog-post-dek" id="blogHeroDek">)[\s\S]*?(<\/p>)/, (m, a, b) => `${a}${escapeHtml(en.dek)}${b}`);
  out = out.replace(/<p class="blog-post-date">[\s\S]*?<\/p>/, englishDateParagraph(dates));
  out = upsertAuthorBlurb(out, "en");
  out = out.replace(
    /<div class="wrap region-article" id="blogArticle">[\s\S]*?<\/div>\s*<\/section>/,
    () => `<div class="wrap region-article" id="blogArticle">${englishBodyLinks(articleHtml(en))}</div>\n  </section>`
  );
  return englishShell(out, `/blog-${slug}`, `/en/blog-${slug}`);
}

function englishBlogIndex(koHtml) {
  const url = `${SITE}/en/blog`;
  const title = "Taiwan Travel Blog: Transport, Sights & Food Tips · My Secret Taiwan Eats";
  const description = "Practical Taiwan travel guides in English: getting around by MRT, train and bus, entry prep, sights and where to eat nearby, checked against official sources.";
  let out = englishHead(koHtml, { title, description, url, ogTitle: "Taiwan Travel Blog · My Secret Taiwan Eats" });
  out = out.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/en` },
        { "@type": "ListItem", position: 2, name: "Blog", item: url },
      ] },
      { "@type": "Blog", name: `${SITE_NAME_EN} Blog`, url, inLanguage: "en" },
    ],
  })}</script>`);
  out = out.replace('alt="대만 여행 풍경"', 'alt="Taiwan travel scenery"');
  return englishShell(out, "/blog", "/en/blog");
}

const history = loadFileHistory();
let generatedCount = 0;
let enCount = 0;
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

  if (EN_SET.has(slug)) {
    out = ensureHreflang(out, `${SITE}/blog-${slug}`, `${SITE}/en/blog-${slug}`);
    out = applyLangSwitcher(out, `/blog-${slug}`, `/en/blog-${slug}`, "ko");
    const listItem = BLOG_LIST.find(p => p.slug === slug);
    const enHtml = englishPostPage(out, listItem, data, slug, dates);
    fs.mkdirSync(path.join(root, "en"), { recursive: true });
    const enFile = enPostFile(slug);
    if (!fs.existsSync(enFile) || fs.readFileSync(enFile, "utf8") !== enHtml) {
      fs.writeFileSync(enFile, enHtml);
      enCount++;
    }
  } else {
    // Korean blog URLs no longer switch language in place; English goes to /en/blog.
    out = applyLangSwitcher(out, `/blog-${slug}`, "/en/blog", "ko");
  }

  if (out === before) continue;

  fs.writeFileSync(filePath, out);
  generatedCount++;
}

let indexCount = 0;
// Korean list: hreflang pair with /en/blog and real switcher links.
{
  const koIndex = path.join(root, "blog.html");
  let html = fs.readFileSync(koIndex, "utf8");
  const before = html;
  if (EN_SET.size) {
    html = ensureHreflang(html, `${SITE}/blog`, `${SITE}/en/blog`);
    html = applyLangSwitcher(html, "/blog", "/en/blog", "ko");
  }
  if (html !== before) fs.writeFileSync(koIndex, html);
  // English list shell is rebuilt from the Korean template each run; cards are filled below.
  if (EN_SET.size) {
    const enIndex = path.join(root, "en", "blog.html");
    const shell = englishBlogIndex(html);
    const prev = fs.existsSync(enIndex) ? fs.readFileSync(enIndex, "utf8") : null;
    // Write the fresh shell, then let syncBlogIndex fill the newest-first cards.
    fs.mkdirSync(path.join(root, "en"), { recursive: true });
    fs.writeFileSync(enIndex, shell);
    syncBlogIndex(enIndex, "en", publishedBySlug);
    if (fs.readFileSync(enIndex, "utf8") !== prev) indexCount++;
  }
}
if (syncBlogIndex(path.join(root, "blog.html"), "ko", publishedBySlug)) indexCount++;

const sortedForLog = sortBlogPosts(BLOG_LIST, publishedBySlug);
const top = sortedForLog.slice(0, 3).map(post => `${post.slug} ${publishRaw(post, publishedBySlug)}`).join(" | ");
console.log(`blog-*.html ${generatedCount}개 본문 정적화 완료, en/blog-*.html ${enCount}개 갱신(영어판 ${EN_SET.size}개), 목록 ${indexCount}개 정렬 (${top})`);
