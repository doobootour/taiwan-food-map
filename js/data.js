// 카테고리 데이터 — 홈 화면 카드 이미지는 assets/images/categories/{id}.jpeg
// icon은 assets/icons/categories/{icon}.svg 모노라인 아이콘 파일명 (id와 다를 수 있음).
// 화면에는 항상 catIconHtml(cat)으로 넣는다 — 칩/핀/팝업/검색결과/지역·홈 정적 HTML 공통.
const CATEGORIES = [
  { id: "beef_noodle",  ko: "우육면",      en: "Beef Noodle",  icon: "beef-noodle" },
  { id: "noodle",       ko: "국수",        en: "Noodles",      icon: "noodles" },
  { id: "japanese",     ko: "일식",        en: "Japanese",     icon: "japanese" },
  { id: "seafood",      ko: "해산물",      en: "Seafood",      icon: "seafood" },
  { id: "ramen",        ko: "라멘",        en: "Ramen",        icon: "ramen" },
  { id: "hotpot",       ko: "훠궈",        en: "Hot Pot",      icon: "hotpot" },
  { id: "breakfast",    ko: "조식",        en: "Breakfast",    icon: "breakfast" },
  { id: "brunch",       ko: "브런치",      en: "Brunch",       icon: "brunch" },
  { id: "cafe",         ko: "카페",        en: "Café",         icon: "cafe" },
  { id: "shaved_ice",   ko: "빙수",        en: "Shaved Ice",   icon: "shaved-ice" },
  { id: "korean",       ko: "한식",        en: "Korean",       icon: "korean" },
  { id: "pasta",        ko: "파스타",      en: "Pasta",        icon: "pasta" },
  { id: "bbq",          ko: "BBQ",         en: "BBQ",          icon: "bbq" },
  { id: "steak",        ko: "스테이크",    en: "Steak",        icon: "steak" },
  { id: "dimsum",       ko: "딤섬",        en: "Dim Sum",      icon: "dimsum" },
  { id: "chinese",      ko: "중식",        en: "Chinese",      icon: "chinese" },
  { id: "goose",        ko: "거위",        en: "Goose",        icon: "goose" },
  { id: "street_food",  ko: "노점",        en: "Street Food",  icon: "street-stall" },
  { id: "mart",         ko: "마트",        en: "Mart",         icon: "mart" },
  { id: "fruit",        ko: "과일",        en: "Fruit",        icon: "fruit" },
  { id: "thai",         ko: "태국",        en: "Thai",         icon: "thai" },
  { id: "vietnamese",   ko: "베트남",      en: "Vietnamese",   icon: "vietnamese" },
  { id: "indian",       ko: "인도",        en: "Indian",       icon: "indian" },
  { id: "taiwanese",    ko: "대만식",      en: "Taiwanese",    icon: "taiwanese" },
  { id: "pizza",        ko: "피자",        en: "Pizza",        icon: "pizza" },
  { id: "stinky_tofu",  ko: "취두부",      en: "Stinky Tofu",  icon: "stinky-tofu" },
  { id: "bakery",       ko: "베이커리",    en: "Bakery",       icon: "bakery" },
  { id: "bar",          ko: "바/펍",       en: "Bar",          icon: "bar" },
  { id: "gift_shop",    ko: "소품가게",    en: "Gift Shop",    icon: "gift-shop" },
  { id: "attraction",   ko: "체험/관광지", en: "Experience",   icon: "attraction" },
  { id: "shopping",     ko: "쇼핑",        en: "Shopping",     icon: "shopping" },
  { id: "liquor_shop",  ko: "주류샵",      en: "Liquor Shop",  icon: "liquor" },
];

// 카테고리 아이콘 마크업. CSS mask + background-color: currentColor 라서 글자색을 그대로 따라간다
// (선택된 필터칩에서는 흰색, 홈 칩에서는 테라코타). cat이 없으면 기본 핀 이모지.
function catIconHtml(cat) {
  if (!cat || !cat.icon) return "📍";
  return `<span class="cat-ico" style="--cat-ico:url(/assets/icons/categories/${cat.icon}.svg)" aria-hidden="true"></span>`;
}

// 카테고리 목록을 화면 언어 기준으로 정렬한 사본 (원본 CATEGORIES 순서는 그대로 둔다).
// 한국어는 ㄱㄴㄷ, 영어는 A–Z — 홈 칩·지도 필터·지역 페이지 그룹·등록 폼 select가 모두 이 규칙을 쓴다.
function sortedCategories(lang) {
  const l = lang === "en" ? "en" : "ko";
  return [...CATEGORIES].sort((a, b) => a[l].localeCompare(b[l], l));
}

const QUICK_PICK_IDS = ["beef_noodle", "dimsum", "shaved_ice", "street_food", "hotpot", "bakery"];

// 홈 "무엇을 먹어볼까요?" 칩: 추천 QUICK_PICK_IDS를 큐레이션 순서대로 먼저 보여 주고,
// 나머지는 sortedCategories(lang) 순서(ko ㄱㄴㄷ / en A–Z, 영문 전용 라벨은 맨 뒤)로 뒤에 둔다.
// 숨긴 칩도 HTML에는 그대로 두어 크롤러가 category 페이지 링크를 따라갈 수 있다.
// '더 보기'/'접기'는 칩 그리드 밖(아래 줄)에 둔다 — 칸을 차지해 열 정렬을 깨지 않게.
// 접힌 기본값(추천 6개 + 버튼)은 모바일(<721px)만. 데스크톱(≥721px)은 CSS로 32개를
// 모두 보이고 토글을 숨긴다. 창을 좁히면 접힌 기본값으로 돌아가며, 그 세션에서
// 모바일로 이미 펼쳤다면 .expanded를 유지한다.
// hrefFor(c) → 링크, esc(s) → 텍스트 이스케이프 (브라우저 렌더와 빌드 스크립트가 같은 마크업을 쓴다).
function homeCategoryChipParts(lang, hrefFor, esc) {
  const l = lang === "en" ? "en" : "ko";
  const e = esc || (s => s);
  const byId = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
  const quick = QUICK_PICK_IDS.map(id => byId[id]).filter(Boolean);
  const quickIds = new Set(quick.map(c => c.id));
  const rest = sortedCategories(l).filter(c => !quickIds.has(c.id));
  const label = (text) => e(text).replace(/\//g, "/<wbr>");
  const chip = (c, extra) => `
    <a class="category-link-chip${extra ? " is-extra" : ""}" href="${hrefFor(c)}">${catIconHtml(c)}<span class="category-link-label">${label(c[l])}</span></a>`;
  const moreLabel = l === "en" ? `More (+${rest.length})` : `더 보기 (+${rest.length})`;
  const lessLabel = l === "en" ? "Show less" : "접기";
  const button = rest.length ? `
        <button type="button" class="category-more-btn" aria-expanded="false" data-more="${moreLabel}" data-less="${lessLabel}">${moreLabel}</button>` : "";
  const chips = quick.map(c => chip(c, false)).join("") + rest.map(c => chip(c, true)).join("");
  return { chips, button };
}

// 구운 홈 마크업: #categoryLinkRow 그리드 + 그 다음 줄의 펼침 버튼.
function homeCategoryLinksMarkup(lang, hrefFor, esc) {
  const { chips, button } = homeCategoryChipParts(lang, hrefFor, esc);
  return `<div class="category-link-row" id="categoryLinkRow">${chips}\n        </div>${button}`;
}

const REGIONS = [
  {
    id: "taipei",
    ko: "타이베이", en: "Taipei",
    tagKo: "미식의 성지", tagEn: "Foodie Mecca",
    subKo: "노포부터 미쉐린까지, 대만 미식이 다 모이는 수도", subEn: "From century-old eateries to Michelin stars, the capital where all of Taiwan's food comes together",
    image: "assets/images/regions/taipei.webp",
  },
  {
    id: "jiufen",
    ko: "타이페이 근교 (예류·스펀·스펀폭포·진과스·지우펀)", en: "Taipei Suburbs (Yehliu, Shifen, Shifen Waterfall, Jinguashi, Jiufen)",
    shortKo: "타이페이 근교", shortEn: "Taipei Suburbs",
    tagKo: "예류·스펀 북동부 해안 탐험", tagEn: "Yehliu & Shifen Coastal Trail",
    subKo: "기암괴석 해안부터 붉은 등불 골목까지", subEn: "From dramatic rock coastlines to lantern-lit alleys",
    image: "assets/images/regions/jiufen.webp",
  },
  {
    id: "kaohsiung",
    ko: "가오슝", en: "Kaohsiung",
    tagKo: "항구 도시의 활기", tagEn: "Harbor City Energy",
    subKo: "리우허 야시장과 항구의 정취가 어우러진 화끈한 남부 미식", subEn: "Fiery southern flavors where the Liuhe Night Market meets harbor charm",
    image: "assets/images/regions/kaohsiung.webp",
  },
  {
    id: "taichung",
    ko: "타이중", en: "Taichung",
    tagKo: "버블티의 고향", tagEn: "Birthplace of Bubble Tea",
    subKo: "여유로운 카페와 디저트의 도시", subEn: "A laid-back city of cafés and desserts",
    image: "assets/images/regions/taichung.webp",
  },
  {
    id: "tainan",
    ko: "타이난", en: "Tainan",
    tagKo: "옛 수도의 손맛", tagEn: "Old Capital Flavors",
    subKo: "대만 미식의 뿌리", subEn: "The roots of Taiwanese cuisine",
    image: "assets/images/regions/tainan.webp",
  },
  {
    id: "hualien",
    ko: "화롄", en: "Hualien",
    tagKo: "타로코 맛집 탐험", tagEn: "Taroko Gorge Eats",
    subKo: "가장 화려한 미식의 도시", subEn: "The most vibrant food city",
    image: "assets/images/regions/hualien.webp",
  },
  {
    id: "yilan",
    ko: "이란", en: "Yilan",
    tagKo: "뤄동 야시장 & 온천", tagEn: "Luodong Market & Hot Springs",
    subKo: "대파 향 가득한 로컬 맛의 도시", subEn: "A local flavor town scented with scallions",
    image: "assets/images/regions/yilan.webp",
  },
  {
    id: "taitung",
    ko: "타이동", en: "Taitung",
    tagKo: "열기구와 슬로우 라이프", tagEn: "Hot Air Balloons & Slow Life",
    subKo: "동부 해안의 여유로운 초록빛 고원", subEn: "A laid-back green highland on the east coast",
    image: "assets/images/regions/taitung.webp",
  },
  {
    id: "alishan",
    ko: "아리산/일월담", en: "Alishan / Sun Moon Lake",
    tagKo: "구름 위 일출과 삼림열차", tagEn: "Sunrise Above the Clouds",
    subKo: "아리산과 일월담을 잇는 고산 여행지", subEn: "A mountain escape linking Alishan and Sun Moon Lake",
    image: "assets/images/regions/alishan.webp",
  },
];

// 지역 안에서 맛집 목록을 하위 권역으로 더 나눠서 보여줄 때 사용 (예: 아리산 vs 일월담).
// 정의되지 않은 지역은 기존처럼 카테고리로만 묶어서 보여준다.
const REGION_SUB_AREAS = {
  alishan: [
    { id: "alishan", ko: "아리산 근처 맛집", en: "Near Alishan", center: [23.5080, 120.8030] },
    { id: "sunmoonlake", ko: "일월담 근처 맛집", en: "Near Sun Moon Lake", center: [23.8510, 120.9160] },
  ],
  jiufen: [
    { id: "yehliu",   ko: "예류 근처 맛집",   en: "Near Yehliu",         center: [25.2058, 121.6900] },
    { id: "shifen",   ko: "스펀 근처 맛집",   en: "Near Shifen",         center: [25.0402, 121.7768] },
    { id: "shifenfalls", ko: "스펀폭포 근처 맛집", en: "Near Shifen Waterfall", center: [25.0339, 121.7817] },
    { id: "jinguashi", ko: "진과스 근처 맛집", en: "Near Jinguashi",      center: [25.1085, 121.8589] },
    { id: "jiufen",   ko: "지우펀 근처 맛집", en: "Near Jiufen",         center: [25.1093, 121.8446] },
  ],
};

// 지도 초기 위치/줌
const REGION_VIEWS = {
  taipei:    { center: [25.0330, 121.5654], zoom: 13 },
  kaohsiung: { center: [22.6273, 120.3014], zoom: 13 },
  taichung:  { center: [24.1477, 120.6736], zoom: 13 },
  tainan:    { center: [22.9997, 120.2270], zoom: 13 },
  hualien:   { center: [23.9871, 121.6015], zoom: 13 },
  yilan:     { center: [24.7021, 121.7377], zoom: 13 },
  jiufen:    { center: [25.1093, 121.8446], zoom: 13 },
  taitung:   { center: [22.7583, 121.1444], zoom: 12 },
  alishan:   { center: [23.6800, 120.8600], zoom: 10 },
};
const DEFAULT_VIEW = { center: [24.5, 121.2], zoom: 8 };

