/* =========================================================================
   관리자 모드 — 헤더 좌측 로고를 3번 연속 클릭하면 비밀번호 입력창이 뜨고,
   맞으면 잠금 해제되어 data-i18n / data-i18n-html 텍스트를 클릭해서 바로
   수정할 수 있다. 저장한 내용은 이 브라우저(localStorage)에만 적용된다 —
   방문자 전체에게 반영하려면 Supabase 테이블 연동이 필요하다 (아직 미연동).
   비밀번호는 아래 ADMIN_PASSWORD 상수를 바꿔서 언제든 변경 가능. 클라이언트
   코드에 그대로 노출되므로 강력한 보안 수단은 아니고, 가벼운 잠금 정도로만 사용할 것.
   ========================================================================= */
(function () {
  const ADMIN_PASSWORD = "taiwan2026";
  const STORAGE_KEY = "tfm_content_overrides"; // { [lang]: { [key]: value } }
  const SESSION_KEY = "tfm_admin_unlocked";

  function loadOverrides() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
  }
  function saveOverrides(overrides) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }
  function applyOverridesToI18N() {
    const overrides = loadOverrides();
    Object.keys(overrides).forEach(lang => {
      if (!I18N[lang]) return;
      Object.keys(overrides[lang]).forEach(key => {
        I18N[lang][key] = overrides[lang][key];
      });
    });
  }

  // 다른 스크립트가 렌더링을 시작하기 전에 I18N을 먼저 덮어쓴다
  applyOverridesToI18N();
  applyI18n(document);

  const UNLOCK_CLICKS = 3;
  const UNLOCK_WINDOW_MS = 1500;

  let editing = false;
  let pendingCount = 0;

  const panel = document.createElement("div");
  panel.className = "tfm-admin-panel";
  panel.innerHTML = `
    <div class="tfm-admin-panel-head">관리자 모드</div>
    <p class="tfm-admin-panel-hint">점선 표시된 텍스트를 클릭해서 수정하세요.</p>
    <div class="tfm-admin-panel-count" id="tfmAdminCount">수정된 항목: 0개</div>
    <div class="tfm-admin-panel-actions">
      <button type="button" class="tfm-admin-save" id="tfmAdminSave">저장</button>
      <button type="button" class="tfm-admin-exit" id="tfmAdminExit">종료</button>
    </div>
  `;
  document.body.appendChild(panel);

  function updateCount() {
    const el = document.getElementById("tfmAdminCount");
    if (el) el.textContent = `수정된 항목: ${pendingCount}개`;
  }

  function setEditable(on) {
    document.querySelectorAll("[data-i18n], [data-i18n-html]").forEach(el => {
      if (el.closest(".tfm-admin-panel")) return;
      el.classList.toggle("tfm-admin-editable", on);
      el.contentEditable = on ? "true" : "false";
    });
  }

  function stageEdit(el) {
    const lang = getLang();
    const key = el.getAttribute("data-i18n") || el.getAttribute("data-i18n-html");
    if (!key) return;
    const isHtml = el.hasAttribute("data-i18n-html");
    const newValue = isHtml ? el.innerHTML.trim() : el.textContent.trim();
    const oldValue = I18N[lang][key];
    if (newValue === oldValue) return;

    const overrides = loadOverrides();
    if (!overrides[lang]) overrides[lang] = {};
    overrides[lang][key] = newValue;
    saveOverrides(overrides);
    I18N[lang][key] = newValue;

    pendingCount++;
    updateCount();
    el.classList.add("tfm-admin-dirty");
    showToast && showToast("수정 반영 (이 브라우저에 저장됨)");
  }

  function startEditing() {
    editing = true;
    document.body.classList.add("tfm-admin-editing");
    panel.classList.add("open");
    setEditable(true);
    document.querySelectorAll("[data-i18n], [data-i18n-html]").forEach(el => {
      if (el.closest(".tfm-admin-panel")) return;
      el.addEventListener("blur", () => stageEdit(el));
    });
  }

  function stopEditing() {
    editing = false;
    document.body.classList.remove("tfm-admin-editing");
    panel.classList.remove("open");
    setEditable(false);
  }

  function unlockAndStartEditing() {
    if (sessionStorage.getItem(SESSION_KEY) !== "1") {
      const pw = prompt("관리자 비밀번호를 입력하세요");
      if (pw === null) return;
      if (pw !== ADMIN_PASSWORD) { alert("비밀번호가 올바르지 않습니다."); return; }
      sessionStorage.setItem(SESSION_KEY, "1");
    }
    startEditing();
  }

  const brandLink = document.querySelector("#site-header .brand");
  if (brandLink) {
    let clickCount = 0;
    let resetTimer = null;
    brandLink.addEventListener("click", () => {
      if (editing) return;
      clickCount++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { clickCount = 0; }, UNLOCK_WINDOW_MS);
      if (clickCount >= UNLOCK_CLICKS) {
        clickCount = 0;
        clearTimeout(resetTimer);
        unlockAndStartEditing();
      }
    });
  }

  document.getElementById("tfmAdminExit").addEventListener("click", stopEditing);
  document.getElementById("tfmAdminSave").addEventListener("click", () => {
    stopEditing();
    pendingCount = 0;
    updateCount();
    document.querySelectorAll(".tfm-admin-dirty").forEach(el => el.classList.remove("tfm-admin-dirty"));
    showToast && showToast("저장 완료! 이 브라우저에서 계속 반영됩니다.");
  });
})();
