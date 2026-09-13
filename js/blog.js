(function () {
  function spotCardHtml(spot) {
    const tag = spot.tag ? `<span class="spot-card-tag">${spot.tag}</span>` : "";
    const link = spot.link ? `<a class="spot-card-link" href="${spot.link}" target="_blank" rel="noopener">${spot.linkLabel}</a>` : "";
    return `
      <div class="spot-card">
        <div class="spot-card-head"><span class="spot-card-name">${spot.name}</span>${tag}</div>
        <p>${spot.html}</p>
        ${link}
      </div>`;
  }

  function renderList() {
    const grid = document.getElementById("blogListGrid");
    if (!grid) return false;
    const lang = getLang();
    const titleEl = document.getElementById("pageTitle");
    if (titleEl) titleEl.textContent = lang === "en" ? "Blog · My Secret Taiwan Eats" : "블로그 · 나만 알고 싶은 대만 맛집";
    grid.innerHTML = BLOG_LIST.map(post => {
      const c = post[lang] || post.ko;
      return `
        <a class="blog-card" href="/blog-${post.slug}">
          <img class="blog-card-img" src="${post.image}" alt="${c.title}" />
          <div class="blog-card-body">
            <span class="blog-card-eyebrow">${c.eyebrow}</span>
            <h3>${c.title}</h3>
            <p>${c.desc}</p>
            <span class="blog-card-meta">${c.meta}</span>
          </div>
        </a>`;
    }).join("");
    return true;
  }

  function renderPost() {
    const root = document.getElementById("blogArticle");
    if (!root) return false;
    const pathMatch = location.pathname.match(/blog-([a-z0-9-]+)/i);
    const slug = pathMatch && pathMatch[1];
    const post = BLOG_POSTS[slug];
    if (!post) return false;
    const lang = getLang();
    const c = post[lang] || post.ko;

    document.title = c.pageTitle;
    const descEl = document.getElementById("pageDescription");
    if (descEl) descEl.setAttribute("content", c.metaDescription);
    const ogTitleEl = document.getElementById("ogTitle");
    if (ogTitleEl) ogTitleEl.setAttribute("content", c.ogTitle);
    const ogDescEl = document.getElementById("ogDescription");
    if (ogDescEl) ogDescEl.setAttribute("content", c.metaDescription);

    const heroImgEl = document.getElementById("blogHeroImg");
    if (heroImgEl) { heroImgEl.src = post.heroImage; heroImgEl.alt = c.title.replace(/<[^>]+>/g, ""); }
    const heroEyebrowEl = document.getElementById("blogHeroEyebrow");
    if (heroEyebrowEl) heroEyebrowEl.textContent = c.eyebrow;
    const heroTitleEl = document.getElementById("blogHeroTitle");
    if (heroTitleEl) heroTitleEl.innerHTML = c.title;
    const heroDekEl = document.getElementById("blogHeroDek");
    if (heroDekEl) heroDekEl.textContent = c.dek;

    root.innerHTML = `
      <div class="blog-post-meta">
        <span>${c.metaAuthor}</span><span class="dot"></span><span>${c.metaTopic}</span><span class="dot"></span><span>${c.metaReadTime}</span>
      </div>

      <p class="region-intro">${c.intro}</p>

      <h2 class="region-h2">${c.h2_1}</h2>
      <div class="blog-timeline">
        ${c.timeline.map(item => `
          <div class="item">
            <div class="year">${item.year}</div>
            <div class="desc">${item.desc}</div>
          </div>`).join("")}
      </div>

      <figure class="blog-figure">
        <img src="${post.heroImage.replace('bowl-1', 'bowl-2')}" alt="${c.figure1Caption}" loading="lazy" />
        <figcaption>${c.figure1Caption}</figcaption>
      </figure>

      <p>${c.afterTimeline}</p>

      <h2 class="region-h2">${c.h2_2}</h2>
      <p>${c.reasonsIntro}</p>
      <div class="blog-reason-grid">
        ${c.reasons.map(r => `
          <div class="blog-reason-card">
            <span class="ico">${r.ico}</span>
            <h3>${r.title}</h3>
            <p>${r.desc}</p>
          </div>`).join("")}
      </div>

      <blockquote class="blog-quote">${c.quote}</blockquote>

      <h2 class="region-h2">${c.h2_3}</h2>
      <p>${c.spotsIntro}</p>
      <div class="spot-list">
        ${c.spots.map(spotCardHtml).join("")}
      </div>

      <figure class="blog-figure">
        <img src="${post.heroImage.replace('bowl-1', 'bowl-3')}" alt="${c.figure2Caption}" loading="lazy" />
        <figcaption>${c.figure2Caption}</figcaption>
      </figure>

      <h2 class="region-h2">${c.h2_4}</h2>
      <div class="blog-tip-list">
        ${c.tips.map(tip => `
          <div class="blog-tip"><span class="mark">${tip.mark}</span><p><b>${tip.b}</b> ${tip.desc}</p></div>`).join("")}
      </div>

      <div class="blog-cta">
        <div>
          <h3>${c.ctaTitle}</h3>
          <p>${c.ctaDesc}</p>
        </div>
        <a class="blog-cta-btn" href="/map?region=taipei&cat=beef_noodle">${c.ctaBtn}</a>
      </div>

      <footer class="blog-sources">
        ${c.sourcesPrefix} <a href="https://food.ltn.com.tw/article/2347" target="_blank" rel="noopener">自由電子報 食譜自由配</a>, <a href="https://www.gvm.com.tw/article/74836" target="_blank" rel="noopener">遠見雜誌</a>, <a href="https://zh.wikipedia.org/zh-tw/%E5%8F%B0%E7%81%A3%E7%89%9B%E8%82%89%E9%BA%B5" target="_blank" rel="noopener">維基百科 — 臺灣牛肉麵</a>. ${c.sourcesSuffix}
      </footer>
    `;

    if (window.registerReveal) window.registerReveal(document);
    return true;
  }

  function renderAll() {
    renderList();
    renderPost();
  }

  renderAll();
  document.addEventListener("tfm:langchange", renderAll);
})();
