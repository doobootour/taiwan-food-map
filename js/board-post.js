(function () {
  const params = new URLSearchParams(location.search);
  const postId = parseInt(params.get("id"), 10);
  const myId = tfmUid();

  const postCard = document.getElementById("postCard");
  const commentSection = document.getElementById("commentSection");
  const commentList = document.getElementById("commentList");
  const commentCountLabel = document.getElementById("commentCountLabel");

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  let post = null;

  async function loadPost() {
    if (!postId) {
      postCard.innerHTML = `<div class="board-empty">잘못된 글 주소예요.</div>`;
      return;
    }
    const { data, error } = await sb.from("board_posts").select("*").eq("id", postId).single();
    if (error || !data) {
      postCard.innerHTML = `<div class="board-empty">글을 찾을 수 없어요. 삭제되었거나 잘못된 주소예요.</div>`;
      return;
    }
    post = data;
    document.getElementById("pageTitle").textContent = `${post.title} · 나만 알고 싶은 대만 맛집`;

    postCard.innerHTML = `
      <span class="board-cat-tag">${boardCatLabel(post.category)}</span>
      <h1 class="post-detail-title">${escapeHtml(post.title)}</h1>
      <div class="post-detail-meta">
        <span>${boardDisplayName(post.nickname, post.reporter_id, myId)}</span>
        <span class="dot-sep">${boardFormatDate(post.created_at)}</span>
        <span class="dot-sep">조회 ${post.view_count + 1}</span>
      </div>
      <div class="post-detail-content">${escapeHtml(post.content)}</div>
    `;
    commentSection.style.display = "block";

    // 조회수 +1 (베스트에포트, 실패해도 무시)
    sb.from("board_posts").update({ view_count: post.view_count + 1 }).eq("id", post.id).then(() => {});
  }

  function commentHtml(c) {
    return `
      <div class="comment-item">
        <div class="comment-meta">
          <span>${boardDisplayName(c.nickname, c.reporter_id, myId)}</span>
          <span class="date">${boardFormatDate(c.created_at)}</span>
        </div>
        <div class="comment-body">${escapeHtml(c.content)}</div>
      </div>
    `;
  }

  async function loadComments() {
    const { data, error } = await sb.from("board_comments").select("*").eq("post_id", postId).order("created_at", { ascending: true });
    if (error) { console.error(error); return; }
    commentCountLabel.textContent = data.length;
    commentList.innerHTML = data.length
      ? data.map(commentHtml).join("")
      : `<div class="board-empty" style="padding:24px 0;">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</div>`;
  }

  const nicknameInput = document.getElementById("commentNicknameInput");
  const savedNickname = localStorage.getItem("tfm_nickname");
  if (savedNickname) nicknameInput.value = savedNickname;

  document.getElementById("commentSubmitBtn").addEventListener("click", async () => {
    const contentInput = document.getElementById("commentContentInput");
    const content = contentInput.value.trim();
    if (!content) { showToast("댓글 내용을 입력해주세요"); return; }

    const btn = document.getElementById("commentSubmitBtn");
    btn.disabled = true;

    const nickname = nicknameInput.value.trim();
    const { error } = await sb.from("board_comments").insert({
      post_id: postId,
      content,
      nickname: nickname || null,
      reporter_id: myId,
    });

    if (error) {
      console.error(error);
      showToast("댓글 등록 중 오류가 발생했어요");
      btn.disabled = false;
      return;
    }

    if (nickname) localStorage.setItem("tfm_nickname", nickname);
    if (post) {
      post.comment_count = (post.comment_count || 0) + 1;
      sb.from("board_posts").update({ comment_count: post.comment_count }).eq("id", post.id).then(() => {});
    }

    contentInput.value = "";
    btn.disabled = false;
    showToast("댓글이 등록되었습니다!");
    loadComments();
  });

  loadPost();
  if (postId) loadComments();
})();
