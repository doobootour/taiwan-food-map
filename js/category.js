(function () {
  const params = new URLSearchParams(location.search);
  // category-beef_noodle.html처럼 정적으로 미리 구운 페이지는 쿼리스트링 없이 파일명으로 카테고리를 구분한다
  const pathMatch = location.pathname.match(/category-([a-z0-9_]+)/i);
  const categoryId = params.get("cat") || (pathMatch && pathMatch[1]) || CATEGORIES[0].id;
  const category = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  const contentByLang = CATEGORY_CONTENT[category.id];

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  // 좌표만으로 검색하면 구글맵이 업체 정보 없이 좌표 핀만 띄우는 경우가 많아서,
  // 가게 이름 + 좌표 뷰포트(@lat,lng,zoom)로 검색해 실제 정보 페이지로 연결되게 한다
  function googleMapsUrl(spot, fallbackLabel) {
    const query = encodeURIComponent(spot.name || fallbackLabel || "");
    return `https://www.google.com/maps/search/${query}/@${spot.lat},${spot.lng},17z`;
  }

  function renderCategoryPage() {
    const lang = getLang();
    const name = category[lang];
    const content = contentByLang && (contentByLang[lang] || contentByLang.ko);
    const tag = contentByLang ? (lang === "en" ? contentByLang.tagEn : contentByLang.tagKo) : "";
    const sub = content ? content.sub : "";

    document.title = lang === "en" ? `${name} in Taiwan · My Secret Taiwan Eats` : `대만 ${name} 맛집 가이드 · 나만 알고 싶은 대만 맛집`;
    const descEl = document.getElementById("pageDescription");
    if (descEl) descEl.setAttribute("content", lang === "en" ? `${name} in Taiwan — ${sub}` : `대만 ${name} 맛집 정보 — ${sub}`);

    document.getElementById("categoryHeroImg").src = `assets/images/categories/${category.id}.webp`;
    document.getElementById("categoryHeroImg").alt = name;
    document.getElementById("categoryEyebrow").textContent = tag;
    document.getElementById("categoryTitle").innerHTML = lang === "en" ? `${name} in Taiwan` : `대만 ${name} 맛집 가이드`;
    document.getElementById("categoryTagline").textContent = sub;
    document.getElementById("categoryFullMapLink").href = `/map?cat=${category.id}`;

    if (content) {
      document.getElementById("categoryIntro").textContent = content.intro;

      document.getElementById("categoryTips").innerHTML = content.tips.map((h, i) => `
        <div class="region-highlight-card reveal in" style="--i:${i}">
          <span class="num">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3>${h.title}</h3>
            <p>${h.desc}</p>
          </div>
        </div>
      `).join("");

      document.getElementById("categoryChecklist").innerHTML = content.checklist.map(a => `
        <li><span class="check">✓</span>${a}</li>
      `).join("");
    }

    if (window.registerReveal) window.registerReveal(document);
  }

  renderCategoryPage();

  /* ===================== 이 카테고리에 실제 등록된 맛집 (지역별) ===================== */
  let cachedSpots = null;

  function renderSpotCards(spots, lang) {
    return spots.map(spot => `
      <div class="region-spot-card">
        <span class="name">${escapeHtml(spot.name || category[lang])}</span>
        <span class="region-spot-links">
          <a class="view-link google-link" href="${googleMapsUrl(spot, category[lang])}" target="_blank" rel="noopener">${t("view_on_google_maps")}</a>
          <a class="view-link" href="/map?lat=${spot.lat}&lng=${spot.lng}">${t("view_on_map")}</a>
        </span>
      </div>
    `).join("");
  }

  function renderCategorySpots() {
    const listEl = document.getElementById("categorySpotsList");
    const lang = getLang();
    const name = category[lang];

    if (cachedSpots === null) return; // 아직 로드 전
    if (!cachedSpots.length) {
      listEl.innerHTML = `<div class="board-empty">${t("category_spots_none", { category: name })}</div>`;
      return;
    }

    const grouped = {};
    cachedSpots.forEach(spot => {
      const key = spot.region || "taipei";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(spot);
    });

    listEl.innerHTML = REGIONS
      .filter(r => grouped[r.id] && grouped[r.id].length)
      .map(r => `
        <div class="region-spots-group reveal in">
          <div class="region-spots-group-head"><span class="ico">📍</span><span>${lang === "en" ? r.en : r.ko}</span></div>
          ${renderSpotCards(grouped[r.id], lang)}
        </div>
      `).join("");

    if (window.registerReveal) window.registerReveal(listEl);
  }

  async function loadCategorySpots() {
    const listEl = document.getElementById("categorySpotsList");
    const { data, error } = await sb.from("eats").select("*").eq("category", category.id).order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      listEl.innerHTML = `<div class="board-empty">${t("category_spots_error")}</div>`;
      return;
    }

    cachedSpots = data || [];
    renderCategorySpots();
  }

  loadCategorySpots();

  document.addEventListener("tfm:langchange", () => {
    renderCategoryPage();
    renderCategorySpots();
  });
})();
