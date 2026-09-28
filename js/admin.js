/* =========================================================================
   관리자 모드 — 헤더 좌측 로고를 3번 연속 클릭하면 비밀번호 입력창이 뜨고,
   맞으면 잠금 해제되어 data-i18n / data-i18n-html 텍스트를 클릭해서 바로
   수정할 수 있다. 저장한 내용은 이 브라우저(localStorage)에만 적용된다 —
   방문자 전체에게 반영하려면 Supabase 테이블 연동이 필요하다 (아직 미연동).
   비밀번호는 클라이언트 코드에 두지 않는다 — Supabase Edge Function 시크릿
   ADMIN_PASSWORD 에만 저장되어 있고, 로그인할 때 admin-verify 함수로 서버에서
   확인한다. 변경은 `supabase secrets set ADMIN_PASSWORD=...` 로 한다. 입력한
   비밀번호는 sessionStorage(tfm_admin_pw)에 보관되어 수정/삭제 함수가 매번 다시 확인한다.
   ========================================================================= */
(function () {
  const STORAGE_KEY = "tfm_content_overrides"; // { [lang]: { [key]: value } }
  const SESSION_KEY = "tfm_admin_unlocked";
  const PASSWORD_SESSION_KEY = "tfm_admin_pw"; // 지도 관리자 기능(삭제 등)이 서버에 재확인시킬 때 사용

  // 다른 스크립트(예: map.js)가 관리자 잠금 여부/비밀번호를 확인할 수 있게 노출
  window.tfmAdmin = {
    isUnlocked: () => sessionStorage.getItem(SESSION_KEY) === "1",
    getPassword: () => sessionStorage.getItem(PASSWORD_SESSION_KEY) || "",
  };

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
  const UNLOCK_WINDOW_MS = 600; // 트리플 클릭 판정용 — index.html이 아닌 페이지들은 로고가
  // 실제로 다른 주소(href="/")로 이동하므로, 매 클릭마다 기본 이동을 막았다가 이 시간
  // 안에 3번이 채워지지 않으면 원래 목적지로 이동시켜 평소처럼 "로고 클릭 = 홈으로" 동작을 유지한다

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

  // 서버(admin-verify Edge Function)에 비밀번호 확인 — true(일치) / false(불일치) / null(확인 불가)
  async function verifyPasswordOnServer(pw) {
    if (typeof SUPABASE_URL === "undefined" || typeof SUPABASE_ANON_KEY === "undefined") return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ password: pw }),
      });
      if (res.status === 401) return false;
      if (!res.ok) return null;
      const result = await res.json().catch(() => ({}));
      return result.success === true;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  let verifying = false;

  async function unlockAndStartEditing() {
    if (sessionStorage.getItem(SESSION_KEY) !== "1") {
      if (verifying) return;
      const pw = prompt("관리자 비밀번호를 입력하세요");
      if (pw === null) return;
      verifying = true;
      let ok;
      try { ok = await verifyPasswordOnServer(pw); }
      finally { verifying = false; }
      if (ok === null) { alert("서버에 연결할 수 없어 비밀번호를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요."); return; }
      if (!ok) { alert("비밀번호가 올바르지 않습니다."); return; }
      sessionStorage.setItem(SESSION_KEY, "1");
      sessionStorage.setItem(PASSWORD_SESSION_KEY, pw);
      document.dispatchEvent(new CustomEvent("tfm:adminchange", { detail: { unlocked: true } }));
    }
    startEditing();
  }

  const brandLink = document.querySelector("#site-header .brand");
  if (brandLink) {
    let clickCount = 0;
    let resetTimer = null;
    brandLink.addEventListener("click", (e) => {
      if (editing) return;
      e.preventDefault(); // 기본 이동은 잠시 막아두고, 아래에서 직접 판단해서 처리한다
      clickCount++;

      if (clickCount >= UNLOCK_CLICKS) {
        clearTimeout(resetTimer);
        clickCount = 0;
        unlockAndStartEditing();
        return;
      }

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        clickCount = 0;
        location.href = brandLink.href; // 시간 안에 3번 못 채웠으면 평소처럼 홈으로 이동
      }, UNLOCK_WINDOW_MS);
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
