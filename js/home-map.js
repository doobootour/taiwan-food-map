/* =========================================================================
   홈 화면에 임베드된 "무엇을 먹어볼까요?" 지도
   맛집 등록(FAB)은 없고, 카테고리 필터 + 핀 열람 + 추천/비추천 투표만 지원.
   전체 화면 지도(등록 포함)는 map.html 에서.
   ========================================================================= */
(function () {
  const mapEl = document.getElementById("homeMap");
  if (!mapEl) return; // 이 페이지에 임베디드 지도가 없으면 스킵

  let activeCats = new Set(CATEGORIES.map(c => c.id));
  let spots = [];
  let votedIds = new Set(JSON.parse(localStorage.getItem("tfm_voted_ids") || "[]"));

  // region.html에서 ?region=xxx 로 들어오면 그 지역을 초기 중심으로 사용
  const embeddedMapParams = new URLSearchParams(location.search);
  const embeddedRegion = embeddedMapParams.get("region");
  const embeddedStartView = (embeddedRegion && REGION_VIEWS[embeddedRegion]) || DEFAULT_VIEW;

  // scrollWheelZoom을 꺼서 페이지 스크롤 중 지도가 갑자기 확대/축소되지 않게 함
  const map = L.map("homeMap", { zoomControl: false, scrollWheelZoom: false }).setView(embeddedStartView.center, embeddedStartView.zoom);
  map.on("click", () => { map.scrollWheelZoom.enable(); filterPanel.classList.remove("expanded"); });
  map.on("mouseout", () => map.scrollWheelZoom.disable());
  L.control.zoom({ position: "bottomleft" }).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // 핀이 겹칠 때 자동으로 묶어서 "몇 개 있는지" 숫자 뱃지로 보여주는 클러스터 레이어
  let markerLayer = L.markerClusterGroup({
    // 축소된(전국) 화면에서는 반경을 좁혀 타이베이·이란처럼 멀리 떨어진 지역이 한 뭉치로 묶이지 않게 함
    maxClusterRadius: (zoom) => (zoom <= 9 ? 40 : 50),
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount();
      const size = count < 10 ? "small" : count < 50 ? "medium" : "large";
      cluster.setZIndexOffset(count); // 숫자 큰 클러스터가 작은 클러스터/핀 위로 오도록
      return L.divIcon({
        html: `<div class="spot-cluster ${size}">${count}</div>`,
        className: "",
        iconSize: null,
      });
    },
  }).addTo(map);

  function catById(id) { return CATEGORIES.find(c => c.id === id); }

  const NEW_SPOT_WINDOW_MS = 1000 * 60 * 60 * 72; // 최근 등록 뱃지 노출 기간(72시간)
  function isNewSpot(spot) {
    return !!spot.created_at && (Date.now() - new Date(spot.created_at).getTime()) < NEW_SPOT_WINDOW_MS;
  }

  function pinIcon(spot) {
    const cat = catById(spot.category);
    const verified = spot.recommend_count >= VERIFIED_THRESHOLD;
    const html = `
      <div class="spot-pin ${verified ? "verified" : ""}">
        <span class="pin-ico">${cat ? cat.icon : "📍"}</span>
        ${verified ? '<span class="verified-badge">✓</span>' : ''}
        ${isNewSpot(spot) ? '<span class="new-badge">NEW</span>' : ''}
      </div>`;
    return L.divIcon({ html, className: "", iconSize: [34, 34], iconAnchor: [17, 32], popupAnchor: [0, -28] });
  }

  function popupHtml(spot) {
    const cat = catById(spot.category);
    const lang = getLang();
    const catLabel = cat ? cat[lang] : "";
    const verified = spot.recommend_count >= VERIFIED_THRESHOLD;
    const voted = votedIds.has(spot.id);
    return `
      <div class="popup-card">
        <div class="popup-head">
          <div class="popup-ico">${cat ? cat.icon : "📍"}</div>
          <div class="cat-line">
            <span class="popup-name">${spot.name || catLabel || t("popup_fallback_name")}</span>
            <span class="popup-sub">${catLabel}${verified ? `<span class="verified-tag">${t("popup_verified")}</span>` : ''}</span>
          </div>
        </div>
        ${spot.address ? `<p class="popup-address">📍 ${spot.address}</p>` : ''}
        ${spot.review ? `<p class="review">${spot.review}</p>` : ''}
        ${spot.link ? `<a class="popup-link" href="${spot.link}" target="_blank" rel="noopener">${t("popup_link")}</a>` : ''}
        <div class="vote-row">
          <button class="vote-btn up" data-id="${spot.id}" data-vote="recommend" ${voted ? "disabled" : ""}>${t("popup_vote_up")}</button>
          <button class="vote-btn down" data-id="${spot.id}" data-vote="not_suited" ${voted ? "disabled" : ""}>${t("popup_vote_down")}</button>
        </div>
        <div class="vote-counts"><span>${t("popup_recommend_count", { n: spot.recommend_count })}</span><span>${t("popup_not_suited_count", { n: spot.not_suited_count })}</span></div>
        ${spot.nickname ? `<p class="popup-contributor">${t("popup_registered_by", { name: spot.nickname })}</p>` : ''}
      </div>`;
  }

  async function castVote(spot, type, marker) {
    if (votedIds.has(spot.id)) { showToast(t("toast_already_confirmed")); return; }

    const { error: insertErr } = await sb.from("eats_confirmations").insert({
      spot_id: spot.id, user_id: tfmUid(), vote: type,
    });
    if (insertErr) {
      if (insertErr.code === "23505") { showToast(t("toast_already_confirmed")); }
      else { showToast(t("toast_vote_error")); console.error(insertErr); }
      return;
    }

    const field = type === "recommend" ? "recommend_count" : "not_suited_count";
    spot[field] = (spot[field] || 0) + 1;
    const { error: updateErr } = await sb.from("eats").update({ [field]: spot[field] }).eq("id", spot.id);
    if (updateErr) console.error(updateErr);

    votedIds.add(spot.id);
    localStorage.setItem("tfm_voted_ids", JSON.stringify([...votedIds]));

    showToast(t("toast_vote_thanks"));
    marker.setIcon(pinIcon(spot));
    marker.setPopupContent(popupHtml(spot));
  }

  function renderMarkers() {
    markerLayer.clearLayers();
    const filtered = spots.filter(s => activeCats.has(s.category));
    const emptyNote = document.getElementById("homeEmptyNote");
    if (emptyNote) emptyNote.style.display = (spots.length > 0 && filtered.length === 0) ? "flex" : "none";
    filtered.forEach(spot => {
      const marker = L.marker([spot.lat, spot.lng], { icon: pinIcon(spot) });
      marker.bindPopup(popupHtml(spot));
      marker.on("popupopen", () => {
        filterPanel.classList.remove("expanded");
        document.querySelectorAll(".vote-btn").forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            castVote(spot, btn.dataset.vote, marker);
          };
        });
      });
      markerLayer.addLayer(marker);
    });
  }

  async function loadSpots() {
    const loadingPill = document.getElementById("homeMapLoading");
    const { data, error } = await sb.from("eats").select("*").order("created_at", { ascending: false });
    if (loadingPill) loadingPill.style.display = "none";
    if (error) { console.error(error); return; }
    spots = data || [];
    renderMarkers();
    // region.html에서 특정 지역으로 들어온 경우엔 그 지역 줌을 유지하고,
    // 홈 화면의 전체 지도일 때만 등록된 핀 전체가 보이도록 범위를 맞춘다
    if (!embeddedRegion && spots.length) {
      const bounds = L.latLngBounds(spots.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  }

  const filterBar = document.getElementById("homeFilterBar");
  const filterCountEl = document.getElementById("homeFilterCount");
  const filterPanel = document.getElementById("homeFilterPanel");
  const filterToggleBtn = document.getElementById("homeFilterToggleBtn");

  filterToggleBtn.addEventListener("click", () => {
    filterPanel.classList.toggle("expanded");
  });

  function renderFilterBar() {
    const lang = getLang();
    filterBar.innerHTML = CATEGORIES.map(c => `
      <button class="filter-chip ${activeCats.has(c.id) ? "active" : ""}" data-cat="${c.id}">
        <span class="chip-ico">${c.icon}</span>${c[lang]}
      </button>
    `).join("");
    filterBar.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const id = chip.dataset.cat;
        if (activeCats.has(id)) activeCats.delete(id); else activeCats.add(id);
        renderFilterBar();
        renderMarkers();
      });
    });
    if (filterCountEl) {
      filterCountEl.textContent = activeCats.size === CATEGORIES.length ? t("filter_all") : t("filter_selected_count", { n: activeCats.size });
    }
  }

  document.getElementById("homeSelectAllBtn").addEventListener("click", () => {
    activeCats = new Set(CATEGORIES.map(c => c.id));
    renderFilterBar();
    renderMarkers();
  });
  document.getElementById("homeClearAllBtn").addEventListener("click", () => {
    activeCats = new Set();
    renderFilterBar();
    renderMarkers();
  });

  renderFilterBar();
  loadSpots();

  // ===================== FAB: 내 위치 / 맛집 추가 =====================
  document.getElementById("homeLocateBtn").addEventListener("click", () => {
    if (!navigator.geolocation) { showToast(t("toast_no_geolocation")); return; }
    navigator.geolocation.getCurrentPosition(
      pos => map.setView([pos.coords.latitude, pos.coords.longitude], 15),
      () => showToast(t("toast_check_permission"))
    );
  });

  // 등록 폼은 map.html에만 있으므로, 현재 지도 중심 좌표를 들고 전체 화면 지도로 이동해 자동으로 등록 시트를 연다
  document.getElementById("homeAddFab").addEventListener("click", () => {
    const c = map.getCenter();
    location.href = `map.html?add=1&lat=${c.lat.toFixed(6)}&lng=${c.lng.toFixed(6)}`;
  });

  // 언어가 바뀌면 필터 칩/핀 팝업을 다시 그린다
  document.addEventListener("tfm:langchange", () => {
    renderFilterBar();
    renderMarkers();
  });
})();
