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

const { BLOG_LIST, BLOG_POSTS } = loadGlobals(["js/blog-content.js"]);

// js/blog.js의 blockHtml()과 동일하게 유지할 것 — 저 파일을 바꾸면 여기도 함께 바꿔야 한다.
function blockHtml(block) {
  switch (block.type) {
    case "p":
      return `<p>${block.html}</p>`;
    case "h2":
      return `<h2 class="region-h2">${block.text}</h2>`;
    case "compareTable":
      return `
          <div class="blog-compare-table-wrap">
            <table class="blog-compare-table">
              <thead><tr><th></th>${block.cities.map(c => `<th>${c}</th>`).join("")}</tr></thead>
              <tbody>
                ${block.rows.map(row => `<tr><td>${row.label}</td>${row.values.map(v => `<td>${v}</td>`).join("")}</tr>`).join("")}
              </tbody>
            </table>
          </div>`;
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

let generatedCount = 0;

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
  out = out.replace(
    /<div class="wrap region-article" id="blogArticle">[\s\S]*?<\/div>\s*<\/section>/,
    `<div class="wrap region-article" id="blogArticle">${body}</div>\n  </section>`
  );

  if (out === before) {
    console.warn(`no match, 본문을 심지 못함: ${filePath}`);
    continue;
  }

  fs.writeFileSync(filePath, out);
  generatedCount++;
}

console.log(`blog-*.html ${generatedCount}개 본문 정적화 완료`);
