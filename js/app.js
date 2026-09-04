// ===================== Toast (여러 페이지 공용) =====================
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ===================== Render: regions =====================
const regionGrid = document.getElementById("regionGrid");
function renderRegionGrid() {
  if (!regionGrid) return;
  const lang = getLang();
  regionGrid.innerHTML = REGIONS.map((r, i) => `
    <a class="region-card reveal" style="--i:${i}" href="region-${r.id}">
      <img src="${r.image}" alt="${lang === "en" ? r.en : r.ko}" loading="lazy" />
      <span class="tag">${lang === "en" ? r.tagEn : r.tagKo}</span>
      <div class="info">
        <div class="name">${lang === "en" ? r.en : r.ko}</div>
        <div class="sub">${lang === "en" ? r.subEn : r.subKo}</div>
      </div>
    </a>
  `).join("");
}
renderRegionGrid();

// ===================== Recent contributors banner =====================
function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}
async function loadRecentContributors() {
  const banner = document.getElementById("recentBanner");
  const trackEl = document.getElementById("recentBannerNames");
  if (!banner || typeof sb === "undefined") return;
  const { data, error } = await sb.from("eats").select("nickname, region, created_at").not("nickname", "is", null).order("created_at", { ascending: false }).limit(30);
  if (error || !data) return;
  const lang = getLang();
  const seen = new Set();
  const items = [];
  for (const row of data) {
    if (row.nickname && !seen.has(row.nickname)) {
      seen.add(row.nickname);
      const region = REGIONS.find(r => r.id === row.region);
      items.push({ nickname: row.nickname, regionName: region ? (lang === "en" ? region.en : region.ko) : "" });
    }
    if (items.length >= 8) break;
  }
  if (!items.length) return;
  const chipsHtml = items.map(it => `<span class="name-chip">${escapeHtml(it.nickname)}${it.regionName ? ` · ${escapeHtml(it.regionName)}` : ''}</span>`).join("");
  // 끊김 없이 무한 루프되도록 목록을 두 번 이어붙인다
  trackEl.innerHTML = chipsHtml + chipsHtml;
  banner.style.display = "flex";
}
loadRecentContributors();

// ===================== Header scroll state =====================
const header = document.getElementById("site-header");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ===================== Language switching =====================
function syncLangUI(lang) {
  document.querySelectorAll(".lang-menu button, .footer-lang-btn, .lang-opt").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = lang.toUpperCase() + " ▾";
}
syncLangUI(getLang());

const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");
if (langBtn && langMenu) {
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu.classList.toggle("open");
  });
  document.addEventListener("click", () => langMenu.classList.remove("open"));
}
document.querySelectorAll(".lang-menu button, .footer-lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    setLang(btn.dataset.lang);
    if (langMenu) langMenu.classList.remove("open");
  });
});
document.addEventListener("tfm:langchange", (e) => {
  syncLangUI(e.detail.lang);
  renderRegionGrid();
  registerReveal(document);
});

// ===================== Mobile nav toggle =====================
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("site-nav");
if (menuToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove("mobile-open");
    menuToggle.classList.remove("open");
  };
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    siteNav.classList.toggle("mobile-open");
    menuToggle.classList.toggle("open");
  });
  siteNav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => {
    if (!siteNav.contains(e.target) && e.target !== menuToggle) closeMenu();
  });
}

// ===================== Scroll reveal =====================
// .reveal 요소를 옵저버에 등록. 페이지 로드 시 존재하는 요소는 자동으로 등록되고,
// region.js 등에서 나중에 동적으로 삽입한 .reveal 요소는 registerReveal()을 직접 호출해서 등록한다.
const revealIO = ("IntersectionObserver" in window)
  ? new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

function registerReveal(root = document) {
  const els = root.querySelectorAll ? root.querySelectorAll(".reveal") : [];
  els.forEach(el => {
    if (el.classList.contains("in")) return;
    if (revealIO) revealIO.observe(el);
    else el.classList.add("in");
  });
}
window.registerReveal = registerReveal;

registerReveal(document);
