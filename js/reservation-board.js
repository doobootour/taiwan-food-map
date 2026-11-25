/* 식당 예약대행 게시판 — 두부골프 예약게시판과 같은 방식 (edge function taiwanbite-board).
   목록은 요약(날짜·식당명·인원·상태·이름 마스킹)만. 신청 내용·답변은 신청할 때 정한 숫자 4자리 비밀번호로만 열린다.
   답변 메일의 '예약게시판에서 보기' 링크(#p=글 id)로 들어오면 해당 카드로 이동해 비밀번호 입력칸에 포커스한다. */
const RB_FN_URL = "https://arjwkdbwzcxbffahopvs.supabase.co/functions/v1/taiwanbite-board";
const RB_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyandrZGJ3emN4YmZmYWhvcHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4OTM3MDcsImV4cCI6MjA5ODQ2OTcwN30.SiZlnjW5H3ATduqAUcnxeJXRN9VPLKBdR9oO9Z9udHI";
(function () {
  const MSG_MAX = 2000, PAGE_SIZE = 10;
  const resultEl = document.getElementById("rbResult");
  const listEl = document.getElementById("rbList");
  const pagerEl = document.getElementById("rbPager");
  const listWrapEl = document.getElementById("rbListWrap");

  // #p=<id> 를 바로 지우고 메모리에만 보관
  let linkId = "";
  try {
    const m = /^#p=([0-9a-f-]{36})$/i.exec(location.hash);
    if (m) { linkId = m[1]; history.replaceState(null, "", location.pathname + location.search); }
  } catch (_) { /* ignore */ }

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
  const fmtDate = (d) => { const t = new Date(d + "T00:00:00"); return `${d} (${DAYS[t.getDay()]})`; };
  const fmtDateTime = (d) => new Date(d).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });

  async function call(body) {
    let res;
    try {
      res = await fetch(RB_FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RB_ANON_KEY}`, apikey: RB_ANON_KEY },
        body: JSON.stringify(body),
      });
    } catch (_) { return { status: 0, data: {} }; }
    let data = {};
    try { data = await res.json(); } catch (_) { /* ignore */ }
    return { status: res.status, data };
  }

  function errorText(status, data) {
    if (status === 403 && data && data.error === "wrong_password") return "비밀번호가 맞지 않아요.";
    if (status === 404) return "일치하는 신청이 없어요.";
    if (status === 429) return "시도가 너무 많아요. 잠시 후 다시 해 주세요.";
    if (data && data.error === "too_long") return `추가 문의는 ${MSG_MAX.toLocaleString("ko-KR")}자 이내로 적어 주세요.`;
    if (data && data.error === "empty") return "추가 문의 내용을 입력해 주세요.";
    return "불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  const pill = (answered) => `<span class="rb-pill ${answered ? "answered" : "pending"}">${answered ? "답변완료" : "접수"}</span>`;

  function render(data, creds) {
    const r = data.request;
    const answered = r.status === "answered";
    const thread = (data.messages || []).map((m) => {
      const mine = m.author === "customer";
      return `<div class="rb-msg ${mine ? "mine" : "staff"}"><span class="rb-msg-label">${mine ? "내 추가 문의" : "담당자 답변"} · ${fmtDateTime(m.created_at)}</span>${esc(m.message).replace(/\n/g, "<br>")}</div>`;
    }).join("");
    const times = `1순위 ${esc(r.time_first)}${r.time_second ? ` / 2순위 ${esc(r.time_second)}` : ""}`;
    resultEl.innerHTML = `
      <div class="rb-item rb-detail">
        <div class="rb-item-head">
          <div><div class="rb-title">${esc(r.place)}</div>
          <div class="rb-sub">${fmtDate(r.preferred_date)} · ${times} · 성인 ${esc(r.adults)}명${r.children ? ` · 아이 ${esc(r.children)}명` : ""}</div>
          <div class="rb-sub">예약자 ${esc(r.name)} · 접수 ${fmtDateTime(r.created_at)}</div></div>
          ${pill(answered)}
        </div>
        <div class="rb-sub">시간이 안 될 때: ${esc(r.if_unavailable)}${r.requests ? `<br>요청사항: ${esc(r.requests).replace(/\n/g, "<br>")}` : ""}</div>
        ${thread || `<div class="rb-msg empty">아직 답변이 없어요. 신청 후 24시간 이내에 안내드려요.</div>`}
        <form class="rb-thread-form" id="rbThreadForm">
          <label for="rbThreadInput">추가 문의 남기기</label>
          <textarea id="rbThreadInput" maxlength="${MSG_MAX}" placeholder="궁금한 점이나 변경 요청을 남겨 주세요. 담당자에게만 전달돼요." required></textarea>
          <div class="rb-msgline" id="rbThreadMsg"></div>
          <button type="submit" class="btn primary" id="rbThreadBtn">문의 남기기</button>
        </form>
        <button type="button" class="rb-link" id="rbBack">← 목록으로</button>
      </div>`;
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("rbBack").addEventListener("click", () => { resultEl.hidden = true; resultEl.innerHTML = ""; });
    document.getElementById("rbThreadForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = document.getElementById("rbThreadInput"), line = document.getElementById("rbThreadMsg"), btn = document.getElementById("rbThreadBtn");
      const message = input.value.trim();
      if (!message) return;
      btn.disabled = true; btn.textContent = "등록 중...";
      const { status, data: d } = await call({ action: "post", ...creds, message });
      if (status === 200 && d.request) {
        render(d, creds);
        const m = document.getElementById("rbThreadMsg");
        m.className = "rb-msgline show ok"; m.textContent = "추가 문의를 담당자에게 전달했어요. 답변은 이메일로 알려 드려요.";
      } else {
        line.className = "rb-msgline show err"; line.textContent = errorText(status, d);
        btn.disabled = false; btn.textContent = "문의 남기기";
      }
    });
  }

  // ---- 목록 ----
  let allItems = [], currentPage = 1;
  const totalPages = () => Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));
  function pageNumbers(cur, total) {
    if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
    const list = [...new Set([1, total, cur, cur - 1, cur + 1, cur - 2, cur + 2])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const out = [];
    for (const n of list) { if (out.length && n - out[out.length - 1] > 1) out.push("…"); out.push(n); }
    return out;
  }
  function renderPager() {
    if (allItems.length <= PAGE_SIZE) { pagerEl.hidden = true; pagerEl.innerHTML = ""; return; }
    const total = totalPages(), cur = currentPage;
    pagerEl.hidden = false;
    const nums = pageNumbers(cur, total).map((n) => n === "…" ? `<span class="rb-pager-gap" aria-hidden="true">…</span>`
      : `<button type="button" class="rb-pager-num" data-page="${n}"${n === cur ? ' aria-current="page"' : ""}>${n}</button>`).join("");
    pagerEl.innerHTML = `<button type="button" class="rb-pager-nav" data-page="${cur - 1}"${cur <= 1 ? " disabled" : ""}>이전</button>${nums}<button type="button" class="rb-pager-nav" data-page="${cur + 1}"${cur >= total ? " disabled" : ""}>다음</button>`;
  }
  function showPage(page, scroll = true) {
    currentPage = Math.min(Math.max(1, page), totalPages());
    renderList(); renderPager();
    if (scroll) listWrapEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderList() {
    if (!allItems.length) { listEl.innerHTML = `<p class="rb-hint">아직 등록된 신청이 없어요.</p>`; return; }
    const slice = allItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    listEl.innerHTML = slice.map((it) => {
      const answered = it.status === "answered";
      const head = `<div class="rb-item-head"><div>
          <div class="rb-title">${it.locked ? "🔒 " : ""}${esc(it.place)}</div>
          <div class="rb-sub">${fmtDate(it.preferred_date)} · ${esc(it.people)}명 · 접수 ${fmtDateTime(it.created_at)}</div>
          <div class="rb-sub">예약자 ${esc(it.booker)}</div></div>${pill(answered)}</div>`;
      if (!it.locked) {
        return `<div class="rb-item">${head}<div class="rb-sub">예전에 접수된 신청이에요. 신청 내용과 답변은 게시판에 표시되지 않고, 답변은 이메일로 보내 드려요.</div></div>`;
      }
      return `<div class="rb-item rb-locked" data-id="${esc(it.id)}">${head}
        <div class="rb-sub">비밀글이에요. 신청할 때 정한 비밀번호(숫자 4자리)로 열 수 있어요.</div>
        <form class="rb-pw-form">
          <input type="password" class="rb-pw-input" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" placeholder="비밀번호 4자리" required aria-label="비밀번호" />
          <button type="submit" class="btn primary">열기</button>
        </form>
        <div class="rb-msgline rb-pw-msg"></div></div>`;
    }).join("");
    listEl.querySelectorAll(".rb-locked").forEach((el) => {
      const f = el.querySelector(".rb-pw-form"), m = el.querySelector(".rb-pw-msg");
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const password = f.querySelector(".rb-pw-input").value.trim();
        if (!/^\d{4}$/.test(password)) { m.className = "rb-msgline rb-pw-msg show err"; m.textContent = "비밀번호는 숫자 4자리예요."; return; }
        const b = f.querySelector("button"); b.disabled = true;
        const { status, data } = await call({ action: "view", id: el.dataset.id, password });
        b.disabled = false;
        if (status === 200 && data.request) {
          m.className = "rb-msgline rb-pw-msg"; m.textContent = ""; f.querySelector(".rb-pw-input").value = "";
          render(data, { id: el.dataset.id, password });
        } else { m.className = "rb-msgline rb-pw-msg show err"; m.textContent = errorText(status, data); }
      });
    });
  }

  pagerEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-page]");
    if (!b || b.disabled) return;
    const p = Number(b.dataset.page);
    if (p && p !== currentPage) showPage(p);
  });

  (async function load() {
    const { status, data } = await call({ action: "list" });
    if (status === 200 && Array.isArray(data.items)) {
      allItems = data.items; showPage(1, false);
      if (linkId) {
        const idx = allItems.findIndex((x) => x.id === linkId);
        if (idx >= 0) {
          showPage(Math.floor(idx / PAGE_SIZE) + 1, false);
          const card = listEl.querySelector(`.rb-locked[data-id="${CSS.escape(linkId)}"]`);
          if (card) { card.scrollIntoView({ behavior: "smooth", block: "center" }); const i = card.querySelector(".rb-pw-input"); if (i) i.focus({ preventScroll: true }); }
        }
      }
    } else {
      listEl.innerHTML = `<p class="rb-hint">목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>`;
      pagerEl.hidden = true;
    }
  })();
})();
