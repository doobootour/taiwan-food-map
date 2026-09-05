// 카테고리 데이터 — 홈 화면 카드 이미지는 assets/images/categories/{id}.jpeg
// icon은 지도 페이지의 필터칩/핀/등록폼에서 사진 대신 사용하는 아이콘
const CATEGORIES = [
  { id: "beef_noodle",  ko: "우육면",      en: "Beef Noodle",  icon: "🍜" },
  { id: "noodle",       ko: "국수",        en: "Noodles",      icon: "🍝" },
  { id: "japanese",     ko: "일식",        en: "Japanese",     icon: "🍣" },
  { id: "seafood",      ko: "해산물",      en: "Seafood",      icon: "🦐" },
  { id: "ramen",        ko: "라멘",        en: "Ramen",        icon: "🍥" },
  { id: "hotpot",       ko: "훠궈",        en: "Hot Pot",      icon: "🍲" },
  { id: "breakfast",    ko: "조식",        en: "Breakfast",    icon: "🍳" },
  { id: "brunch",       ko: "브런치",      en: "Brunch",       icon: "🥞" },
  { id: "cafe",         ko: "카페",        en: "Café",         icon: "☕" },
  { id: "shaved_ice",   ko: "빙수",        en: "Shaved Ice",   icon: "🍧" },
  { id: "korean",       ko: "한식",        en: "Korean",       icon: "🍚" },
  { id: "pasta",        ko: "파스타",      en: "Pasta",        icon: "🍝" },
  { id: "bbq",          ko: "BBQ",         en: "BBQ",          icon: "🍖" },
  { id: "steak",        ko: "스테이크",    en: "Steak",        icon: "🥩" },
  { id: "dimsum",       ko: "딤섬",        en: "Dim Sum",      icon: "🥟" },
  { id: "goose",        ko: "거위",        en: "Goose",        icon: "🦢" },
  { id: "street_food",  ko: "노점",        en: "Street Food",  icon: "🥙" },
  { id: "mart",         ko: "마트",        en: "Mart",         icon: "🛒" },
  { id: "fruit",        ko: "과일",        en: "Fruit",        icon: "🍉" },
  { id: "thai",         ko: "태국",        en: "Thai",         icon: "🌶️" },
  { id: "vietnamese",   ko: "베트남",      en: "Vietnamese",   icon: "🥖" },
  { id: "indian",       ko: "인도",        en: "Indian",       icon: "🍛" },
  { id: "taiwanese",    ko: "대만식",      en: "Taiwanese",    icon: "🍗" },
  { id: "pizza",        ko: "피자",        en: "Pizza",        icon: "🍕" },
  { id: "stinky_tofu",  ko: "취두부",      en: "Stinky Tofu",  icon: "🧇" },
  { id: "bakery",       ko: "베이커리",    en: "Bakery",       icon: "🥐" },
  { id: "bar",          ko: "바/펍",       en: "Bar",          icon: "🍸" },
  { id: "gift_shop",    ko: "소품가게",    en: "Gift Shop",    icon: "🎁" },
  { id: "attraction",   ko: "체험/관광지", en: "Experience",   icon: "🎡" },
  { id: "shopping",     ko: "쇼핑",        en: "Shopping",     icon: "🛍️" },
  { id: "liquor_shop",  ko: "주류샵",      en: "Liquor Shop",  icon: "🍾" },
];

const QUICK_PICK_IDS = ["beef_noodle", "dimsum", "shaved_ice", "street_food", "hotpot", "bakery"];

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
    ko: "타이베이 근교 (예류·스펀·스펀폭포·진과스·지우펀)", en: "Taipei Suburbs (Yehliu, Shifen, Shifen Waterfall, Jinguashi, Jiufen)",
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
    tagKo: "타이로거 맛집 탐험", tagEn: "Taroko Gorge Eats",
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

