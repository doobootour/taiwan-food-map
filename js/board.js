(function () {
  const listEl = document.getElementById("boardList");
  const tabsEl = document.getElementById("boardTabs");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const myId = tfmUid();

  const PAGE_SIZE = 20;
  let activeCat = "all";
  let offset = 0;
  let reachedEnd = false;

  function renderTabs() {
    const tabs = [{ id: "all", ko: "전체" }, ...BOARD_CATEGORIES];
    tabsEl.innerHTML = tabs.map(t => `
      <button class="board-tab ${activeCat === t.id ? "active" : ""}" data-cat="${t.id}">${t.ko}</button>
    `).join("");
    tabsEl.querySelectorAll(".board-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        activeCat = btn.dataset.cat;
        offset = 0;
        reachedEnd = false;
        renderTabs();
        loadPosts(true);
      });
    });
  }

  function rowHtml(post) {
    return `
      <a class="board-row" href="/board-post?id=${post.id}">
        <span class="board-cat-tag">${boardCatLabel(post.category)}</span>
        <div class="board-main">
          <div class="board-title">${escapeHtml(post.title)}</div>
          <div class="board-meta">${boardDisplayName(post.nickname, post.reporter_id, myId)} · ${boardFormatDate(post.created_at)}</div>
        </div>
        <span class="board-comment-count">💬 ${post.comment_count || 0}</span>
      </a>
    `;
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  async function loadPosts(reset) {
    if (reset) listEl.innerHTML = `<div class="board-loading">불러오는 중...</div>`;

    let query = sb.from("board_posts").select("*").order("created_at", { ascending: false }).range(offset, offset + PAGE_SIZE - 1);
    if (activeCat !== "all") query = query.eq("category", activeCat);

    const { data, error } = await query;
    if (error) {
      console.error(error);
      listEl.innerHTML = `<div class="board-empty">글을 불러오지 못했어요.</div>`;
      return;
    }

    if (reset) listEl.innerHTML = "";

    if (offset === 0 && (!data || data.length === 0)) {
      listEl.innerHTML = `<div class="board-empty">아직 글이 없어요. 첫 글을 남겨보세요! ✏️</div>`;
      loadMoreBtn.style.display = "none";
      return;
    }

    listEl.insertAdjacentHTML("beforeend", data.map(rowHtml).join(""));
    offset += data.length;
    reachedEnd = data.length < PAGE_SIZE;
    loadMoreBtn.style.display = reachedEnd ? "none" : "block";
  }

  loadMoreBtn.addEventListener("click", () => loadPosts(false));

  renderTabs();
  loadPosts(true);

  /* ===================== Write sheet ===================== */
  const sheetOverlay = document.getElementById("sheetOverlay");
  const catSelect = document.getElementById("writeCatSelect");
  const titleInput = document.getElementById("writeTitleInput");
  const contentInput = document.getElementById("writeContentInput");
  const nicknameInput = document.getElementById("writeNicknameInput");
  const submitBtn = document.getElementById("writeSubmitBtn");

  catSelect.innerHTML = BOARD_CATEGORIES.map(c => `<option value="${c.id}">${c.ko}</option>`).join("");

  const savedNickname = localStorage.getItem("tfm_nickname");
  if (savedNickname) nicknameInput.value = savedNickname;

  function updateSubmitState() {
    submitBtn.disabled = !(titleInput.value.trim() && contentInput.value.trim());
  }
  titleInput.addEventListener("input", updateSubmitState);
  contentInput.addEventListener("input", updateSubmitState);

  function openSheet() { sheetOverlay.classList.add("open"); }
  function closeSheet() {
    sheetOverlay.classList.remove("open");
    titleInput.value = "";
    contentInput.value = "";
    catSelect.selectedIndex = 0;
    submitBtn.disabled = true;
    submitBtn.textContent = "등록하기";
  }

  document.getElementById("writeBtn").addEventListener("click", openSheet);
  document.getElementById("writeCancelBtn").addEventListener("click", closeSheet);

  submitBtn.addEventListener("click", async () => {
    submitBtn.disabled = true;
    submitBtn.textContent = "등록 중...";

    const nickname = nicknameInput.value.trim();
    const { data, error } = await sb.from("board_posts").insert({
      category: catSelect.value,
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      nickname: nickname || null,
      reporter_id: myId,
    }).select().single();

    if (error) {
      console.error(error);
      showToast("등록 중 오류가 발생했어요");
      submitBtn.disabled = false;
      submitBtn.textContent = "등록하기";
      return;
    }

    if (nickname) localStorage.setItem("tfm_nickname", nickname);
    closeSheet();
    location.href = `/board-post?id=${data.id}`;
  });
})();
