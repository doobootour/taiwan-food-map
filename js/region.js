(function () {
  const params = new URLSearchParams(location.search);
  // region-taipei.html처럼 정적으로 미리 구운 페이지는 쿼리스트링 없이 파일명으로 지역을 구분한다
  const pathMatch = location.pathname.match(/region-([a-z0-9_]+)/i);
  const regionId = params.get("region") || (pathMatch && pathMatch[1]) || "taipei";
  const region = REGIONS.find(r => r.id === regionId) || REGIONS[0];
  const contentByLang = REGION_CONTENT[region.id];

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function renderRegionPage() {
    const lang = getLang();
    const name = lang === "en" ? region.en : region.ko;
    const tag = lang === "en" ? region.tagEn : region.tagKo;
    const sub = lang === "en" ? region.subEn : region.subKo;
    const content = contentByLang && (contentByLang[lang] || contentByLang.ko);

    document.title = lang === "en" ? `${name} Travel Guide · My Secret Taiwan Eats` : `${name} 여행 가이드 · 나만 알고 싶은 대만 맛집`;
    const descEl = document.getElementById("pageDescription");
    if (descEl) descEl.setAttribute("content", lang === "en" ? `${name} travel guide and food map — ${sub}` : `${name} 여행 정보와 맛집 지도 — ${sub}`);

    document.getElementById("regionHeroImg").src = region.image;
    document.getElementById("regionHeroImg").alt = name;
    document.getElementById("regionEyebrow").textContent = tag;
    document.getElementById("regionTitle").innerHTML = lang === "en" ? `${name} Travel Guide` : `${name} 여행 가이드`;
    document.getElementById("regionTagline").textContent = sub;
    document.getElementById("regionFullMapLink").href = `/map?region=${region.id}`;

    if (content) {
      document.getElementById("regionIntro").textContent = content.intro;

      document.getElementById("regionHighlights").innerHTML = content.highlights.map((h, i) => `
        <div class="region-highlight-card reveal in" style="--i:${i}">
          <span class="num">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3>${h.title}</h3>
            <p>${h.desc}</p>
          </div>
        </div>
      `).join("");

      document.getElementById("regionActivities").innerHTML = content.activities.map(a => `
        <li><span class="check">✓</span>${a}</li>
      `).join("");
    }

    if (window.registerReveal) window.registerReveal(document);
  }

  renderRegionPage();

  /* ===================== 이 지역에 실제 등록된 맛집 (카테고리별) ===================== */
  let cachedSpots = null;

  // 카테고리 순서대로 묶어서 렌더링할 스팟 목록 HTML을 만든다
  function renderCategoryGroups(spots, lang) {
    const grouped = {};
    spots.forEach(spot => {
      if (!grouped[spot.category]) grouped[spot.category] = [];
      grouped[spot.category].push(spot);
    });

    return CATEGORIES
      .filter(c => grouped[c.id] && grouped[c.id].length)
      .map(c => `
        <div class="region-spots-group reveal in">
          <div class="region-spots-group-head"><span class="ico">${c.icon}</span><span>${c[lang]}</span></div>
          ${grouped[c.id].map(spot => `
            <div class="region-spot-card">
              <span class="name">${escapeHtml(spot.name || c[lang])}</span>
              <span class="region-spot-links">
                <a class="view-link google-link" href="https://www.google.com/maps/search/?api=1&query=${spot.lat}%2C${spot.lng}" target="_blank" rel="noopener">${t("view_on_google_maps")}</a>
                <a class="view-link" href="/map?lat=${spot.lat}&lng=${spot.lng}">${t("view_on_map")}</a>
              </span>
            </div>
          `).join("")}
        </div>
      `).join("");
  }

  function distSq(a, b) {
    const dLat = a[0] - b[0], dLng = a[1] - b[1];
    return dLat * dLat + dLng * dLng;
  }

  function renderRegionSpots() {
    const listEl = document.getElementById("regionSpotsList");
    const lang = getLang();
    const name = lang === "en" ? region.en : region.ko;

    if (cachedSpots === null) return; // 아직 로드 전
    if (!cachedSpots.length) {
      listEl.innerHTML = `<div class="board-empty">${t("region_spots_none", { region: name })}</div>`;
      return;
    }

    const subAreas = REGION_SUB_AREAS[region.id];

    if (subAreas) {
      // 하위 권역(예: 아리산 vs 일월담)별로 가장 가까운 곳에 배정한 뒤 카테고리로 묶는다
      const bySubArea = {};
      subAreas.forEach(sa => { bySubArea[sa.id] = []; });
      cachedSpots.forEach(spot => {
        let best = subAreas[0];
        let bestDist = Infinity;
        subAreas.forEach(sa => {
          const d = distSq([spot.lat, spot.lng], sa.center);
          if (d < bestDist) { bestDist = d; best = sa; }
        });
        bySubArea[best.id].push(spot);
      });

      listEl.innerHTML = subAreas
        .filter(sa => bySubArea[sa.id].length)
        .map(sa => `
          <div class="region-spots-subarea reveal in">
            <h3 class="region-spots-subarea-head">${sa[lang]}</h3>
            ${renderCategoryGroups(bySubArea[sa.id], lang)}
          </div>
        `).join("");
    } else {
      listEl.innerHTML = renderCategoryGroups(cachedSpots, lang);
    }

    if (window.registerReveal) window.registerReveal(listEl);
  }

  async function loadRegionSpots() {
    const listEl = document.getElementById("regionSpotsList");
    const { data, error } = await sb.from("eats").select("*").eq("region", region.id).order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      listEl.innerHTML = `<div class="board-empty">${t("region_spots_error")}</div>`;
      return;
    }

    cachedSpots = data || [];
    renderRegionSpots();
  }

  loadRegionSpots();

  document.addEventListener("tfm:langchange", () => {
    renderRegionPage();
    renderRegionSpots();
  });
})();
