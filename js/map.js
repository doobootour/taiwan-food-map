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
function isAdmin() { return !!(window.tfmAdmin && window.tfmAdmin.isUnlocked()); }

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
      <a class="popup-link" href="${googleMapsUrl(spot, catLabel)}" target="_blank" rel="noopener">${t("popup_link")}</a>
      <div class="vote-row">
        <button class="vote-btn up" data-id="${spot.id}" data-vote="recommend" ${voted ? "disabled" : ""}>${t("popup_vote_up")}</button>
        <button class="vote-btn down" data-id="${spot.id}" data-vote="not_suited" ${voted ? "disabled" : ""}>${t("popup_vote_down")}</button>
      </div>
      <div class="vote-counts"><span>${t("popup_recommend_count", { n: spot.recommend_count })}</span><span>${t("popup_not_suited_count", { n: spot.not_suited_count })}</span></div>
      ${spot.nickname ? `<p class="popup-contributor">${t("popup_registered_by", { name: spot.nickname })}</p>` : ''}
      ${isAdmin() ? `
      <div class="admin-spot-actions">
        <button class="admin-edit-btn" data-id="${spot.id}">${t("admin_edit_btn")}</button>
        <button class="admin-delete-btn" data-id="${spot.id}">${t("admin_delete_btn")}</button>
      </div>` : ''}
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

  // 투표 카운트 증가는 (일반 사용자가 남의 글은 못 고치도록 막은) RLS를 우회해야 하므로
  // 전용 RPC로 처리한다 — 직접 update()를 호출하면 owner가 아닌 이상 조용히 0행 반영된다
  const field = type === "recommend" ? "recommend_count" : "not_suited_count";
  const { error: rpcErr } = await sb.rpc("cast_vote", { p_spot_id: spot.id, p_vote: type });
  if (rpcErr) { console.error(rpcErr); }
  else { spot[field] = (spot[field] || 0) + 1; }

  votedIds.add(spot.id);
  localStorage.setItem("tfm_voted_ids", JSON.stringify([...votedIds]));

  showToast(t("toast_vote_thanks"));
  marker.setIcon(pinIcon(spot));
  marker.setPopupContent(popupHtml(spot));
}

// 관리자 전용 삭제 — RLS는 본인이 올린 글만 삭제하도록 막혀 있어서, 비밀번호를 서버(Edge
// Function)에서 다시 확인한 뒤 service role 권한으로 실제 삭제를 수행한다.
async function deleteSpot(spot) {
  if (!confirm(t("admin_delete_confirm", { name: spot.name || t("popup_fallback_name") }))) return;

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-delete-spot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ id: spot.id, password: window.tfmAdmin ? window.tfmAdmin.getPassword() : "" }),
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      console.error(result.error || res.statusText);
      showToast(t("toast_delete_error"));
      return;
    }
  } catch (err) {
    console.error(err);
    showToast(t("toast_delete_error"));
    return;
  }

  spots = spots.filter(s => s.id !== spot.id);
  map.closePopup();
  renderMarkers();
  showToast(t("toast_delete_success"));
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
      document.querySelectorAll(".admin-edit-btn").forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          map.closePopup();
          openEditSheet(spot);
        };
      });
      document.querySelectorAll(".admin-delete-btn").forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          deleteSpot(spot);
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

/* ===================== Hualien tour promo ===================== */
// 화롄 근처를 보고 있을 때(진입 경로와 무관하게, 지도를 팬/줌해서 들어와도) 항상 뜨도록
// 지도 중심이 화롄 좌표에서 일정 거리 이내인지를 이동할 때마다 체크한다.
const tourPromoEl = document.getElementById("mapTourPromo");
const [HUALIEN_LAT, HUALIEN_LNG] = REGION_VIEWS.hualien.center;
let popupIsOpen = false; // 배너가 지도 상단에 고정되어 있어 열린 팝업과 겹칠 수 있으므로 팝업이 떠 있는 동안은 숨긴다
function isViewingHualien() {
  if (map.getZoom() < 10) return false; // 전국 축소 화면에서는 우연히 중심이 겹쳐도 노출하지 않음
  const c = map.getCenter();
  const dLat = c.lat - HUALIEN_LAT;
  const dLng = (c.lng - HUALIEN_LNG) * Math.cos(HUALIEN_LAT * Math.PI / 180);
  const distKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
  return distKm < 30; // 화롄 시내~타이루거~해안 도로를 넉넉히 포함하는 반경
}
function updateTourPromoVisibility() {
  if (sessionStorage.getItem("tfm_hualien_promo_dismissed")) { tourPromoEl.hidden = true; return; }
  tourPromoEl.hidden = popupIsOpen || !isViewingHualien();
}
map.on("moveend", updateTourPromoVisibility);
map.on("popupopen", () => { popupIsOpen = true; updateTourPromoVisibility(); });
map.on("popupclose", () => { popupIsOpen = false; updateTourPromoVisibility(); });
updateTourPromoVisibility();
document.getElementById("mapTourPromoClose").addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  tourPromoEl.hidden = true;
  sessionStorage.setItem("tfm_hualien_promo_dismissed", "1");
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
let editingSpotId = null; // null이면 신규 등록, 값이 있으면 해당 id를 수정 중

/* ===================== 중복 등록 감지 ===================== */
// 두 단계로 판단한다:
// 1) 아주 가까운 거리(CLOSE_RADIUS)면 이름이 어느 정도만 비슷해도 같은 곳으로 의심
// 2) 거리가 좀 떨어져 있어도(WIDE_RADIUS, 링크 자동입력 오차 등) 이름이 거의 똑같으면 의심
const DUP_CLOSE_RADIUS_M = 50;
const DUP_CLOSE_NAME_SIM = 0.5;
const DUP_WIDE_RADIUS_M = 250;
const DUP_WIDE_NAME_SIM = 0.8;

function normalizeSpotName(name) {
  return (name || "").toLowerCase().replace(/[\s()（）\-_·・.,'"!?？！]/g, "");
}

// 편집 거리(Levenshtein) 기반 유사도 — 0(완전 다름)~1(완전 동일)
function nameSimilarity(a, b) {
  const na = normalizeSpotName(a), nb = normalizeSpotName(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.9;

  const dp = Array.from({ length: na.length + 1 }, () => new Array(nb.length + 1).fill(0));
  for (let i = 0; i <= na.length; i++) dp[i][0] = i;
  for (let j = 0; j <= nb.length; j++) dp[0][j] = j;
  for (let i = 1; i <= na.length; i++) {
    for (let j = 1; j <= nb.length; j++) {
      dp[i][j] = na[i - 1] === nb[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]);
    }
  }
  return 1 - dp[na.length][nb.length] / Math.max(na.length, nb.length);
}

// 후보 좌표/이름과 가장 의심되는 기존 맛집을 찾는다 (없으면 null)
function findPossibleDuplicate(latlng, name) {
  if (!latlng || !name || !name.trim()) return null;
  let best = null;
  for (const spot of spots) {
    if (editingSpotId && spot.id === editingSpotId) continue; // 수정 중인 자기 자신은 제외
    const dist = latlng.distanceTo(L.latLng(spot.lat, spot.lng));
    if (dist > DUP_WIDE_RADIUS_M) continue;
    const sim = nameSimilarity(name, spot.name);
    const isMatch = (dist <= DUP_CLOSE_RADIUS_M && sim >= DUP_CLOSE_NAME_SIM) || sim >= DUP_WIDE_NAME_SIM;
    if (isMatch && (!best || dist < best.dist)) best = { spot, dist };
  }
  return best;
}

const dupWarning = document.getElementById("dupWarning");
const dupWarningText = document.getElementById("dupWarningText");
const dupWarningViewBtn = document.getElementById("dupWarningViewBtn");
let dupWarningSpot = null;

function updateDuplicateWarning() {
  const found = findPossibleDuplicate(pickedLatLng, nameInput.value);
  dupWarningSpot = found ? found.spot : null;
  if (!found) { dupWarning.hidden = true; return; }
  dupWarningText.textContent = t("dup_warning_text", {
    name: found.spot.name || t("popup_fallback_name"),
    distance: Math.round(found.dist),
  });
  dupWarning.hidden = false;
}

dupWarningViewBtn.addEventListener("click", () => {
  if (!dupWarningSpot) return;
  const spot = dupWarningSpot;
  closeSheet();
  map.panTo([spot.lat, spot.lng]);
  const marker = markerLayer.getLayers().find(m => m.getLatLng().lat === spot.lat && m.getLatLng().lng === spot.lng);
  if (marker) markerLayer.zoomToShowLayer(marker, () => marker.openPopup());
});

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
  updateDuplicateWarning();
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

const sheetIntro = document.getElementById("sheetIntro");

function setSheetMode(isEdit) {
  if (sheetIntro) sheetIntro.style.display = isEdit ? "none" : "";
  submitBtn.textContent = isEdit ? t("btn_update") : t("btn_submit");
}

function openSheet(latlng) {
  setPickedLatLng(latlng.lat, latlng.lng);
  sheetOverlay.classList.add("open");
}

// FAB/등록 버튼 전용 진입점 — 직전에 다른 맛집을 수정하다 만 상태(입력값 포함)가 남아있지
// 않도록 새 등록 폼으로 확실히 초기화한다
function startAddFlow(latlng) {
  editingSpotId = null;
  setSheetMode(false);
  nameInput.value = "";
  reviewInput.value = "";
  linkInput.value = "";
  sheetCatSelect.selectedIndex = 0;
  selectedCat = null;
  openSheet(latlng);
}

// 관리자 팝업의 "수정" 버튼 — 기존 값으로 시트를 채우고 수정 모드로 연다
function openEditSheet(spot) {
  editingSpotId = spot.id;
  setSheetMode(true);
  openSheet({ lat: spot.lat, lng: spot.lng });
  map.panTo([spot.lat, spot.lng]);
  selectedCat = spot.category || null;
  sheetCatSelect.value = spot.category || "";
  nameInput.value = spot.name || "";
  nicknameInput.value = spot.nickname || "";
  reviewInput.value = spot.review || "";
  linkInput.value = spot.link || "";
  updateSubmitState();
}

function closeSheet() {
  sheetOverlay.classList.remove("open");
  clearDraftMarker();
  pickedLatLng = null;
  selectedCat = null;
  editingSpotId = null;
  nameInput.value = "";
  reviewInput.value = "";
  linkInput.value = "";
  gmapLinkInput.value = "";
  sheetCatSelect.selectedIndex = 0;
  submitBtn.disabled = true;
  setSheetMode(false);
  dupWarning.hidden = true;
  dupWarningSpot = null;
}

document.getElementById("addFab").addEventListener("click", () => startAddFlow(map.getCenter()));
document.getElementById("registerBtn").addEventListener("click", () => startAddFlow(map.getCenter()));
document.getElementById("cancelBtn").addEventListener("click", closeSheet);
// 지도를 클릭하면 (등록이든 수정이든) 현재 열려 있는 핀 위치만 옮긴다 — 모드 자체는 건드리지 않음
map.on("click", (e) => { filterPanel.classList.remove("expanded"); openSheet(e.latlng); });

// 다른 페이지의 "추가하기" 버튼에서 ?add=1 로 넘어온 경우 자동으로 등록 시트 열기
if (initialAdd) startAddFlow(map.getCenter());

submitBtn.addEventListener("click", async () => {
  const isEdit = editingSpotId !== null;
  submitBtn.disabled = true;
  submitBtn.textContent = isEdit ? t("btn_updating") : t("btn_submitting");

  const nickname = nicknameInput.value.trim();
  const fields = {
    lat: pickedLatLng.lat,
    lng: pickedLatLng.lng,
    category: selectedCat,
    name: nameInput.value.trim(),
    nickname: nickname || null,
    review: reviewInput.value.trim() || null,
    link: linkInput.value.trim() || null,
  };

  let data, error;
  if (isEdit) {
    // 관리자는 남의 글도 고칠 수 있어야 하는데, RLS는 본인 글만 수정 가능하도록 막혀
    // 있으므로 삭제와 마찬가지로 비밀번호를 서버에서 재확인하는 edge function을 거친다
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-update-spot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ id: editingSpotId, fields, password: window.tfmAdmin ? window.tfmAdmin.getPassword() : "" }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) { error = result.error || res.statusText; }
      else { data = result.data; }
    } catch (err) {
      error = err;
    }
  } else {
    ({ data, error } = await sb.from("eats").insert({ ...fields, region: initialRegion || "taipei", reporter_id: tfmUid() }).select().single());
  }

  if (error) {
    console.error(error);
    showToast(isEdit ? t("toast_update_error") : t("toast_submit_error"));
    submitBtn.disabled = false;
    submitBtn.textContent = isEdit ? t("btn_update") : t("btn_submit");
    return;
  }

  if (nickname) localStorage.setItem("tfm_nickname", nickname);

  if (isEdit) {
    const idx = spots.findIndex(s => s.id === editingSpotId);
    if (idx !== -1) spots[idx] = data;
  } else {
    spots.unshift(data);
  }
  renderMarkers();
  closeSheet();
  showToast(isEdit ? t("toast_update_success") : t("toast_submit_success"));
  map.panTo([data.lat, data.lng]);
});

// 관리자 잠금이 해제되면(로고 3번 클릭 + 비밀번호) 이미 그려둔 핀 팝업에도
// 바로 수정/삭제 버튼이 보이도록 다시 렌더링한다
document.addEventListener("tfm:adminchange", () => renderMarkers());

// 지도를 처음 움직이면 힌트 살짝 숨기기
map.on("movestart", () => { mapHint.style.opacity = "0"; }, { once: true });

// 언어가 바뀌면 지도 위 동적 콘텐츠(칩/드롭다운/핀 팝업)를 다시 그린다
document.addEventListener("tfm:langchange", () => {
  renderFilterBar();
  renderMarkers();
  renderSheetCatSelect();
  setSheetMode(editingSpotId !== null);
});
