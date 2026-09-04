/* ===================== Load activity from Supabase ===================== */
let cachedProfileData = null;

async function loadProfile() {
  const myId = tfmUid();

  const [{ data: myEats }, { data: myVotes }, { data: allEats }, { data: allVotes }] = await Promise.all([
    sb.from("eats").select("id").eq("reporter_id", myId),
    sb.from("eats_confirmations").select("id").eq("user_id", myId),
    sb.from("eats").select("reporter_id, nickname"),
    sb.from("eats_confirmations").select("user_id"),
  ]);

  const submissions = myEats ? myEats.length : 0;
  const votes = myVotes ? myVotes.length : 0;
  const points = submissions * 2 + votes;

  cachedProfileData = { myId, submissions, votes, points, allEats: allEats || [], allVotes: allVotes || [] };
  renderProfile();
}

function renderProfile() {
  if (!cachedProfileData) return;
  const { myId, submissions, votes, points, allEats, allVotes } = cachedProfileData;

  document.getElementById("uidDisplay").textContent = myId;
  document.getElementById("statSubmissions").textContent = submissions;
  document.getElementById("statVotes").textContent = votes;

  renderLevel(points);
  renderLeaderboard(allEats, allVotes, myId, points);
}

/* ===================== Level system ===================== */
const LEVEL_KEYS = ["level_new", "level_explorer", "level_local", "level_master"];
const LEVEL_MINS = [0, 1, 5, 15];
function levelIndex(pts) {
  let idx = 0;
  LEVEL_MINS.forEach((min, i) => { if (pts >= min) idx = i; });
  return idx;
}
function renderLevel(points) {
  const lvIdx = levelIndex(points);
  document.getElementById("levelPill").textContent = t(LEVEL_KEYS[lvIdx]);

  const stopPositions = [0, 33.3, 66.6, 100];
  let fillPct;
  if (lvIdx >= LEVEL_MINS.length - 1) {
    fillPct = 100;
  } else {
    const curMin = LEVEL_MINS[lvIdx], nextMin = LEVEL_MINS[lvIdx + 1];
    const span = nextMin - curMin;
    const within = Math.min(1, (points - curMin) / span);
    fillPct = stopPositions[lvIdx] + (stopPositions[lvIdx + 1] - stopPositions[lvIdx]) * within;
  }
  document.getElementById("levelFill").style.width = fillPct + "%";

  const noteEl = document.getElementById("levelNote");
  if (lvIdx >= LEVEL_MINS.length - 1) {
    noteEl.textContent = t("level_note_master");
  } else {
    const remain = Math.max(1, LEVEL_MINS[lvIdx + 1] - points);
    noteEl.textContent = t("level_note_next", { remain, next: t(LEVEL_KEYS[lvIdx + 1]) });
  }
}

/* ===================== Leaderboard (실데이터 집계) ===================== */
function renderLeaderboard(allEats, allVotes, myId, myPoints) {
  const tally = {};
  const nicknameByReporter = {};
  allEats.forEach(row => {
    tally[row.reporter_id] = (tally[row.reporter_id] || 0) + 2;
    if (row.nickname) nicknameByReporter[row.reporter_id] = row.nickname;
  });
  allVotes.forEach(row => { tally[row.user_id] = (tally[row.user_id] || 0) + 1; });
  if (!(myId in tally) && myPoints > 0) tally[myId] = myPoints;

  const myNickname = localStorage.getItem("tfm_nickname");
  if (myNickname) nicknameByReporter[myId] = myNickname;

  const rows = Object.entries(tally)
    .map(([id, pts]) => {
      let label;
      if (nicknameByReporter[id]) label = nicknameByReporter[id] + (id === myId ? t("me_suffix") : "");
      else if (id === "seed") label = t("seed_label");
      else label = id === myId ? t("me_label", { id }) : id;
      return { id, pts, me: id === myId, label };
    })
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 6);

  const medals = ["🥇", "🥈", "🥉"];
  document.getElementById("leaderboardList").innerHTML = rows.map((row, i) => `
    <div class="lb-row ${row.me ? "me" : ""}">
      <div class="lb-rank">${medals[i] || (i + 1)}</div>
      <div class="lb-avatar">${row.me ? "🙂" : "🧑"}</div>
      <div class="lb-name">${row.label}</div>
      <div class="lb-pts">${t("lb_pts", { n: row.pts })}</div>
    </div>
  `).join("") || `<div class="empty-note" style="text-align:center;color:var(--ink-faint);font-size:13px;padding:20px 0;">${t("leaderboard_empty")}</div>`;
}

/* ===================== Language grid ===================== */
function renderLangGridProfile() {
  const lang = getLang();
  const LANGS = [
    { code: "ko", label: "한국어" },
    { code: "en", label: "English" },
  ];
  const grid = document.getElementById("langGridProfile");
  grid.innerHTML = LANGS.map(l => `
    <button class="lang-opt ${l.code === lang ? "active" : ""}" data-lang="${l.code}">${l.label}</button>
  `).join("");
  grid.querySelectorAll(".lang-opt").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}
renderLangGridProfile();

document.addEventListener("tfm:langchange", () => {
  renderLangGridProfile();
  renderProfile();
});

loadProfile();
