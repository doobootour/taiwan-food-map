/* =========================================================================
   지도 페이지 로직 — Supabase(eats / eats_confirmations) 실연동
   ========================================================================= */

/* ===================== URL params ===================== */
const params = new URLSearchParams(location.search);
const initialCat = params.get("cat");
const initialRegion = params.get("region");
const initialAdd = params.get("add") === "1";
const initialLat = parseFloat(params.get("lat"));
const initialLng = parseFloat(params.get("lng"));
const hasInitialLatLng = !isNaN(initialLat) && !isNaN(initialLng);
// 다중 선택 카테고리 필터 — 기본은 전체 선택, ?cat=xxx로 들어오면 그 카테고리만 선택
let activeCats = new Set(initialCat ? [initialCat] : CATEGORIES.map(c => c.id));

/* ===================== Map init ===================== */
const startView = hasInitialLatLng
  ? { center: [initialLat, initialLng], zoom: 15 }
  : (initialRegion && REGION_VIEWS[initialRegion]) || DEFAULT_VIEW;
const map = L.map("map", { zoomControl: false }).setView(startView.center, startView.zoom);
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
    const px = size === "small" ? 38 : size === "medium" ? 46 : 56;
    cluster.setZIndexOffset(count); // 숫자 큰 클러스터가 작은 클러스터/핀 위로 오도록
    return L.divIcon({
      html: `<div class="spot-cluster ${size}">${count}</div>`,
      className: "",
      iconSize: [px, px],
      iconAnchor: [px / 2, px / 2],
    });
  },
}).addTo(map);
let spots = []; // Supabase eats 테이블 캐시
let votedIds = new Set(JSON.parse(localStorage.getItem("tfm_voted_ids") || "[]"));

function catById(id) { return CATEGORIES.find(c => c.id === id); }

const NEW_SPOT_WINDOW_MS = 1000 * 60 * 60 * 72; // 최근 등록 뱃지 노출 기간(72시간)
function isNewSpot(spot) {
  return !!spot.created_at && (Date.now() - new Date(spot.created_at).getTime()) < NEW_SPOT_WINDOW_MS;
}

function pinIcon(spot, opts = {}) {
  const cat = catById(spot.category);
  const verified = spot.recommend_count >= VERIFIED_THRESHOLD;
  const html = `
    <div class="spot-pin ${verified ? "verified" : ""} ${opts.highlight ? "highlight" : ""}">
      <span class="pin-ico">${cat ? cat.icon : "📍"}</span>
      ${verified ? '<span class="verified-badge">✓</span>' : ''}
      ${isNewSpot(spot) ? '<span class="new-badge">NEW</span>' : ''}
    </div>`;
  return L.divIcon({ html, className: "", iconSize: [36, 36], iconAnchor: [18, 34], popupAnchor: [0, -30] });
}

// 지역 페이지의 "지도에서 보기" 링크(?lat=&lng=)로 들어왔을 때, 클러스터 속에서도
// 어떤 핀인지 바로 알 수 있도록 해당 핀을 한 번 강조하고 팝업을 열어줌
let didFocusInitialSpot = false;
function findInitialSpot(list) {
  if (!hasInitialLatLng) return null;
  const TOL = 0.0002; // 약 20m 이내 오차는 같은 핀으로 간주
  return list.find(s => Math.abs(s.lat - initialLat) < TOL && Math.abs(s.lng - initialLng) < TOL) || null;
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
  const emptyNote = document.getElementById("emptyNote");
  if (emptyNote) emptyNote.style.display = (spots.length > 0 && filtered.length === 0) ? "flex" : "none";
  const initialSpot = didFocusInitialSpot ? null : findInitialSpot(filtered);
  let initialMarker = null;
  filtered.forEach(spot => {
    const isInitial = spot === initialSpot;
    const marker = L.marker([spot.lat, spot.lng], { icon: pinIcon(spot, { highlight: isInitial }) });
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
    if (isInitial) initialMarker = marker;
  });
  if (initialMarker) {
    didFocusInitialSpot = true;
    markerLayer.zoomToShowLayer(initialMarker, () => initialMarker.openPopup());
  }
}

/* ===================== Load spots from Supabase ===================== */
async function loadSpots() {
  const loadingPill = document.getElementById("mapLoading");
  const { data, error } = await sb.from("eats").select("*").order("created_at", { ascending: false });
  if (loadingPill) loadingPill.style.display = "none";
  if (error) {
    console.error(error);
    showToast(t("toast_load_error"));
    return;
  }
  spots = data || [];
  renderMarkers();
}

/* ===================== Filter chips (다중 선택) ===================== */
const filterBar = document.getElementById("mapFilterBar");
const filterCountEl = document.getElementById("filterCount");
const filterPanel = document.getElementById("mapFilterPanel");
const filterToggleBtn = document.getElementById("filterToggleBtn");

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
    filterCountEl.textContent = activeCats.size === CATEGORIES.length
      ? t("filter_all")
      : t("filter_selected_count", { n: activeCats.size });
  }
}

document.getElementById("selectAllBtn").addEventListener("click", () => {
  activeCats = new Set(CATEGORIES.map(c => c.id));
  renderFilterBar();
  renderMarkers();
});
document.getElementById("clearAllBtn").addEventListener("click", () => {
  activeCats = new Set();
  renderFilterBar();
  renderMarkers();
});

renderFilterBar();
loadSpots();

if (initialRegion) {
  const r = REGIONS.find(r => r.id === initialRegion);
  if (r) showToast(t("toast_moved_to_region", { region: getLang() === "en" ? r.en : r.ko }));
}

/* ===================== Locate ===================== */
document.getElementById("locateBtn").addEventListener("click", () => {
  if (!navigator.geolocation) { showToast(t("toast_no_geolocation")); return; }
  navigator.geolocation.getCurrentPosition(
    pos => map.setView([pos.coords.latitude, pos.coords.longitude], 15),
    () => showToast(t("toast_check_permission"))
  );
});

/* ===================== Add-spot sheet ===================== */
const sheetOverlay = document.getElementById("sheetOverlay");
const sheetCatSelect = document.getElementById("sheetCatSelect");
const nameInput = document.getElementById("nameInput");
const nicknameInput = document.getElementById("nicknameInput");
const reviewInput = document.getElementById("reviewInput");
const linkInput = document.getElementById("linkInput");
const gmapLinkInput = document.getElementById("gmapLinkInput");
const submitBtn = document.getElementById("submitBtn");
const mapHint = document.getElementById("mapHint");

let pickedLatLng = null;
let selectedCat = null;

function renderSheetCatSelect() {
  const lang = getLang();
  const prevValue = sheetCatSelect.value;
  sheetCatSelect.innerHTML = `<option value="" disabled ${prevValue ? "" : "selected"}>${t("cat_select_default")}</option>` +
    [...CATEGORIES].sort((a, b) => a[lang].localeCompare(b[lang], lang)).map(c => `<option value="${c.id}">${c.icon} ${c[lang]}</option>`).join("");
  if (prevValue) sheetCatSelect.value = prevValue;
}
renderSheetCatSelect();

// 한 번 입력한 닉네임은 이 브라우저에 저장해뒀다가 다음 등록 때도 자동으로 채워준다
const savedNickname = localStorage.getItem("tfm_nickname");
if (savedNickname) nicknameInput.value = savedNickname;

function updateSubmitState() {
  submitBtn.disabled = !(pickedLatLng && selectedCat && nameInput.value.trim().length > 0);
}

sheetCatSelect.addEventListener("change", () => {
  selectedCat = sheetCatSelect.value || null;
  updateSubmitState();
});
nameInput.addEventListener("input", updateSubmitState);

const draftIcon = L.divIcon({
  html: `<div class="draft-pin"><span class="draft-pin-pulse"></span><span class="draft-pin-dot">📍</span></div>`,
  className: "", iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -36],
});
let draftMarker = null;

function setPickedLatLng(lat, lng) {
  pickedLatLng = L.latLng(lat, lng);
  updateSubmitState();

  if (draftMarker) {
    draftMarker.setLatLng(pickedLatLng);
  } else {
    draftMarker = L.marker(pickedLatLng, { icon: draftIcon, interactive: false, zIndexOffset: 1000 }).addTo(map);
  }
}

function clearDraftMarker() {
  if (draftMarker) { map.removeLayer(draftMarker); draftMarker = null; }
}

// 구글맵 링크에서 좌표 추출
// 1) 전체 데스크톱 링크(.../@25.033,121.565,17z 등)는 그 자리에서 바로 파싱
// 2) maps.app.goo.gl 같은 단축 링크는 좌표가 URL에 없으므로, 서버(Edge Function)에서
//    리다이렉트를 따라가 실제 좌표를 찾아온다
function extractLatLngFromText(text) {
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  }
  return null;
}

// URL의 /maps/place/<가게이름>/ 구간에서 가게 이름 추출 (네트워크 요청 없이 즉시 처리)
function extractNameFromUrl(text) {
  const m = text.match(/\/maps\/place\/([^/@]+)/);
  if (!m) return null;
  try {
    const name = decodeURIComponent(m[1].replace(/\+/g, " ")).trim();
    if (!name || /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(name)) return null;
    return name;
  } catch {
    return null;
  }
}

const autofillBtn = document.getElementById("autofillBtn");
autofillBtn.addEventListener("click", async () => {
  const val = gmapLinkInput.value.trim();
  if (!val) { showToast(t("toast_paste_link_first")); return; }

  const applyResult = (lat, lng, name) => {
    setPickedLatLng(lat, lng);
    map.panTo([lat, lng]);
    if (!linkInput.value.trim()) linkInput.value = val;
    if (name && !nameInput.value.trim()) nameInput.value = name;
    updateSubmitState();
  };

  const localCoords = extractLatLngFromText(val);
  if (localCoords) {
    const localName = extractNameFromUrl(val);
    applyResult(localCoords.lat, localCoords.lng, localName);
    showToast(localName ? t("toast_found_loc_name") : t("toast_found_loc"));
    return;
  }

  // 단축 링크 — 서버에서 리다이렉트를 따라가 좌표/이름 확인
  autofillBtn.disabled = true;
  autofillBtn.textContent = t("autofill_btn_loading");
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/resolve-maps-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ url: val }),
    });
    const data = await res.json();
    if (!res.ok || typeof data.lat !== "number") {
      showToast(t("toast_link_no_coords"));
      return;
    }
    applyResult(data.lat, data.lng, data.name);
    showToast(data.name ? t("toast_found_loc_name") : t("toast_found_loc"));
  } catch (err) {
    console.error(err);
    showToast(t("toast_link_error"));
  } finally {
    autofillBtn.disabled = false;
    autofillBtn.textContent = t("autofill_btn");
  }
});

function openSheet(latlng) {
  setPickedLatLng(latlng.lat, latlng.lng);
  sheetOverlay.classList.add("open");
}
function closeSheet() {
  sheetOverlay.classList.remove("open");
  clearDraftMarker();
  pickedLatLng = null;
  selectedCat = null;
  nameInput.value = "";
  reviewInput.value = "";
  linkInput.value = "";
  gmapLinkInput.value = "";
  sheetCatSelect.selectedIndex = 0;
  submitBtn.disabled = true;
  submitBtn.textContent = t("btn_submit");
}

document.getElementById("addFab").addEventListener("click", () => openSheet(map.getCenter()));
document.getElementById("registerBtn").addEventListener("click", () => openSheet(map.getCenter()));
document.getElementById("cancelBtn").addEventListener("click", closeSheet);
map.on("click", (e) => { filterPanel.classList.remove("expanded"); openSheet(e.latlng); });

// 다른 페이지의 "추가하기" 버튼에서 ?add=1 로 넘어온 경우 자동으로 등록 시트 열기
if (initialAdd) openSheet(map.getCenter());

submitBtn.addEventListener("click", async () => {
  submitBtn.disabled = true;
  submitBtn.textContent = t("btn_submitting");

  const nickname = nicknameInput.value.trim();

  const { data, error } = await sb.from("eats").insert({
    lat: pickedLatLng.lat,
    lng: pickedLatLng.lng,
    category: selectedCat,
    name: nameInput.value.trim(),
    nickname: nickname || null,
    review: reviewInput.value.trim() || null,
    link: linkInput.value.trim() || null,
    region: initialRegion || "taipei",
    reporter_id: tfmUid(),
  }).select().single();

  if (error) {
    console.error(error);
    showToast(t("toast_submit_error"));
    submitBtn.disabled = false;
    submitBtn.textContent = t("btn_submit");
    return;
  }

  if (nickname) localStorage.setItem("tfm_nickname", nickname);

  spots.unshift(data);
  renderMarkers();
  closeSheet();
  showToast(t("toast_submit_success"));
  map.panTo([data.lat, data.lng]);
});

// 지도를 처음 움직이면 힌트 살짝 숨기기
map.on("movestart", () => { mapHint.style.opacity = "0"; }, { once: true });

// 언어가 바뀌면 지도 위 동적 콘텐츠(칩/드롭다운/핀 팝업)를 다시 그린다
document.addEventListener("tfm:langchange", () => {
  renderFilterBar();
  renderMarkers();
  renderSheetCatSelect();
});
