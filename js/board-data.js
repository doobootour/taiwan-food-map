const BOARD_CATEGORIES = [
  { id: "free", ko: "자유" },
  { id: "question", ko: "질문" },
  { id: "info", ko: "정보공유" },
  { id: "companion", ko: "동행" },
  { id: "review", ko: "후기" },
];

function boardCatLabel(id) {
  const c = BOARD_CATEGORIES.find(c => c.id === id);
  return c ? c.ko : "자유";
}

function boardFormatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}시간 전`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}일 전`;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function boardDisplayName(nickname, reporterId, myId) {
  if (nickname) return nickname + (reporterId === myId ? " (나)" : "");
  return reporterId === myId ? "나" : "익명" + reporterId.slice(-4);
}
