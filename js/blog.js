(function () {
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

  let activeRegion = "all";

  function renderRegionFilter(lang) {
    const bar = document.getElementById("blogRegionFilter");
    if (!bar) return;
    const usedIds = [...new Set(BLOG_LIST.flatMap(post => post.regions || []))];
    if (usedIds.length < 2) { bar.innerHTML = ""; return; }
    const usedRegions = (typeof REGIONS !== "undefined" ? REGIONS : []).filter(r => usedIds.includes(r.id));
    const allLabel = lang === "en" ? "All" : "전체";
    const chips = [{ id: "all", label: allLabel }, ...usedRegions.map(r => ({ id: r.id, label: r[lang] || r.ko }))];
    bar.innerHTML = chips.map(c => `<button type="button" class="filter-chip${c.id === activeRegion ? " active" : ""}" data-region="${c.id}">${c.label}</button>`).join("");
    bar.querySelectorAll(".filter-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        activeRegion = btn.dataset.region;
        renderList();
      });
    });
  }

  function renderList() {
    const grid = document.getElementById("blogListGrid");
    if (!grid) return false;
    const lang = getLang();
    const titleEl = document.getElementById("pageTitle");
    if (titleEl) titleEl.textContent = lang === "en" ? "Blog · My Secret Taiwan Eats" : "블로그 · 나만 알고 싶은 대만 맛집";
    renderRegionFilter(lang);
    const posts = activeRegion === "all" ? BLOG_LIST : BLOG_LIST.filter(post => (post.regions || []).includes(activeRegion));
    grid.innerHTML = posts.map(post => {
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

    const heroEyebrowEl = document.getElementById("blogHeroEyebrow");
    if (heroEyebrowEl) heroEyebrowEl.textContent = c.eyebrow;
    const heroTitleEl = document.getElementById("blogHeroTitle");
    if (heroTitleEl) heroTitleEl.innerHTML = c.title;
    const heroDekEl = document.getElementById("blogHeroDek");
    if (heroDekEl) heroDekEl.textContent = c.dek;

    root.innerHTML = `
      <div class="blog-post-meta">
        <span>${c.metaAuthor}</span><span class="dot"></span><span>${c.metaTopic}</span>
      </div>

      <p class="region-intro">${c.intro}</p>

      ${c.blocks.map(blockHtml).join("")}
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
