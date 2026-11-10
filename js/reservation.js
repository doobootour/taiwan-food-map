/* 식당 예약대행 신청 — 두부소프트 주문 페이지와 같은 방식: 서버 저장 없이
   양식 내용을 복사해서 카카오톡 상담창에 붙여넣어 보낸다. */
(function () {
  const $ = (id) => document.getElementById(id);
  const FIELDS = [
    ["fName", "식당 이름"], ["fBranch", "지점 또는 구글맵 링크"], ["fDate", "희망 날짜"],
    ["fTime1", "희망 시간(1순위)"], ["fAdults", "성인 인원"], ["fBooker", "예약자 이름(영문)"], ["fContact", "연락처"],
  ];
  const NOTES = ["※ 예약대행료 5,000원", "※ 예약 완료 후 환불 불가", "※ 날짜 또는 시간 변경 1회 가능", "※ 신청 후 24시간 이내에 카톡으로 안내드려요"];
  const v = (id) => ($(id) ? $(id).value.trim() : "");
  const fallbackValue = () => { const c = document.querySelector('input[name="fFallback"]:checked'); return c ? c.value : ""; };

  // 상세 페이지의 "이 식당 예약대행 신청" 링크에서 넘어온 값 미리 채우기
  const qs = new URLSearchParams(location.search);
  if (qs.get("name") && $("fName")) $("fName").value = qs.get("name").slice(0, 120);
  if (qs.get("map") && $("fBranch") && /^https:\/\//.test(qs.get("map"))) $("fBranch").value = qs.get("map").slice(0, 500);
  if ($("fDate")) {
    const t = new Date(); const p = (n) => String(n).padStart(2, "0");
    $("fDate").min = `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
  }

  const blankText = [
    "[대만 식당 예약대행 신청]",
    "1. 식당 이름:",
    "2. 지점 또는 구글맵 링크:",
    "3. 희망 날짜:",
    "4. 희망 시간: 1순위 __ / 2순위 __",
    "5. 인원: 성인 __명 / 아이 __명",
    "6. 예약자 이름(영문):",
    "7. 연락처(카톡 ID 또는 전화번호):",
    "8. 원하는 시간이 안 될 때: 다른 시간 가능 / 다른 날짜 가능 / 취소",
    "9. 요청사항(창가 자리, 아기 의자, 생일, 알레르기 등):",
    "",
    ...NOTES,
  ].join("\n");
  if ($("blankTpl")) $("blankTpl").textContent = blankText;

  function fmtDate(s) {
    if (!s) return "";
    const d = new Date(s + "T00:00:00");
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${s} (${days[d.getDay()]})`;
  }

  function validate() {
    document.querySelectorAll(".rsv-form .invalid").forEach((el) => el.classList.remove("invalid"));
    for (const [id, label] of FIELDS) {
      if (!v(id)) { $(id).classList.add("invalid"); $(id).focus(); return `${label}을(를) 입력해 주세요.`; }
    }
    if (!(parseInt(v("fAdults"), 10) >= 1)) { $("fAdults").classList.add("invalid"); $("fAdults").focus(); return "성인 인원을 1명 이상 입력해 주세요."; }
    if (!fallbackValue()) { document.querySelector(".chips").classList.add("invalid"); document.querySelector(".chips input").focus(); return "원하는 시간이 안 될 때 어떻게 할지 골라 주세요."; }
    return "";
  }

  function buildText() {
    return [
      "[대만 식당 예약대행 신청]",
      `1. 식당 이름: ${v("fName")}`,
      `2. 지점 또는 구글맵 링크: ${v("fBranch")}`,
      `3. 희망 날짜: ${fmtDate(v("fDate"))}`,
      `4. 희망 시간: 1순위 ${v("fTime1")} / 2순위 ${v("fTime2") || "없음"}`,
      `5. 인원: 성인 ${parseInt(v("fAdults"), 10)}명 / 아이 ${parseInt(v("fKids"), 10) || 0}명`,
      `6. 예약자 이름(영문): ${v("fBooker").toUpperCase()}`,
      `7. 연락처(카톡 ID 또는 전화번호): ${v("fContact")}`,
      `8. 원하는 시간이 안 될 때: ${fallbackValue()}`,
      `9. 요청사항: ${v("fReq") || "없음"}`,
      "",
      ...NOTES,
    ].join("\n");
  }

  function legacyCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px;";
    document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, text.length);
    let ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta); return ok;
  }

  // 사용자 클릭 안에서 곧바로 복사한다(모바일 사파리는 비동기 지연 후 복사를 막음).
  function copyText(text) {
    const ok = legacyCopy(text);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(() => {});
    return ok || !!(navigator.clipboard && navigator.clipboard.writeText);
  }

  function done(btn, label) {
    $("copyStatus").classList.add("show");
    if (btn) { btn.textContent = "복사 완료 ✓"; setTimeout(() => { btn.textContent = label; }, 2000); }
    if (typeof gtag === "function") gtag("event", "reservation_copy");
  }

  $("copyBtn").addEventListener("click", () => {
    const err = validate(); if (err) { alert(err); return; }
    if (copyText(buildText())) done($("copyBtn"), "복사하기");
    else alert("복사에 실패했어요. 아래 빈 양식을 직접 복사해 주세요.");
  });

  // 링크 기본 동작(카카오톡 상담창 열기)은 그대로 두고, 열기 직전에 복사만 한다.
  $("kakaoBtn").addEventListener("click", (e) => {
    const err = validate(); if (err) { e.preventDefault(); alert(err); return; }
    copyText(buildText());
    done(null);
    if (typeof gtag === "function") gtag("event", "reservation_kakao_open");
  });

  document.querySelectorAll('input[name="fFallback"]').forEach((r) => r.addEventListener("change", () => document.querySelector(".chips").classList.remove("invalid")));

  if ($("copyBlankBtn")) $("copyBlankBtn").addEventListener("click", () => {
    if (copyText(blankText)) { $("copyBlankBtn").textContent = "복사 완료 ✓"; setTimeout(() => { $("copyBlankBtn").textContent = "신청 양식 복사"; }, 2000); }
  });
})();
