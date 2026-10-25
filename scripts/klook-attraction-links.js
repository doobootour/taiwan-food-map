// 관광지별 관련 Klook 상품 (Chris 제휴 aid=42148). 가격은 바뀌므로 넣지 않는다.
// 화롄(타이루거·칠성담·청수단애)은 두부투어와 겹치는 경쟁 상품이라 넣지 않는다.
const P = {
  t101: ["타이베이 101 전망대 입장권", "1659-taipei-101-taipei"],
  npm: ["국립고궁박물원 입장권", "10136-national-palace-museum-ticket-package-taipei"],
  tpeDay: ["타이베이 데이 투어", "158353-ultimate-taipei-day-tour"],
  shilin: ["타이베이 스린 야시장 푸드 투어", "22392-shilin-night-market-walking-tour-taipei"],
  ysj: ["지우펀 & 스펀 & 예류 일일 투어 (한국어 가이드)", "3521-jiufen-full-day-tour-taipei"],
  ysjBus: ["대만 예스폭진지 일일 버스투어 (한국인 가이드)", "27672-bus-day-tour-taipei-korean-guide"],
  tcA: ["타이중 출발 일월담 & 무지개마을 & 가오메이습지 일일투어 (한국어)", "137776-explore-sun-moon-lake-gaomei-wetlands-day-tour-from-taichung"],
  tcB: ["타이중 왕복 버스투어 일월담 페리 · 무지개마을 · 고미습지 일몰 (한국어 가이드)", "219233-taichung-full-day-sun-moon-lake-wetlands-tour"],
  tainan: ["타이난: 치메이 박물관 & 츠칸러우 & 안핑 일일 투어", "88044-taiwan-tainan-anping-old-fort-chikanlou-tainan-confucius-temple-join-one-day-tour"],
  khh: ["가오슝 클래식 일일 투어 (불광산 · 연지담 · 보얼)", "79807-kaohsiung-city-day-tour-experience"],
  guishan: ["이란: 구이산섬 상륙 & 고래와 돌고래 관찰", "114011-guishan-island-tour-in-yilan"],
  guishanDay: ["구이산섬 고래 관찰 & 카발란 위스키 양조장 & 전통예술센터 일일 투어", "113318-yilan-guishan-island-cruise-animal-farm-whisky-tasting-from-taipei"],
  taiping: ["타이핑산 국가삼림유락구 일일 투어", "80638-yilan-taiping-mountain-one-day-tour"],
  nmmba: ["국립해양생물관 & 수족관 입장권", "4738-national-museum-marine-biology-aquarium-ticket-kenting"],
  kenting: ["핑둥: 해양생물박물관 & 어롼비 & 룽판 공원 일일 투어 (가오슝 출발)", "13631-kenting-classic-attractions-day-tour-kenting"],
};
const MAP = {
  "taipei-101": ["t101"], "palace-museum": ["npm"], "cks-memorial": ["tpeDay"], "shilin-night-market": ["shilin", "tpeDay"],
  jiufen: ["ysj", "ysjBus"], shifen: ["ysj", "ysjBus"], yehliu: ["ysj", "ysjBus"], jinguashi: ["ysj", "ysjBus"],
  "gaomei-wetland": ["tcA", "tcB"], "rainbow-village": ["tcA", "tcB"], "sun-moon-lake": ["tcA", "tcB"],
  "anping-fort": ["tainan"], "chihkan-tower": ["tainan"], "chimei-museum": ["tainan"],
  pier2: ["khh"], "lotus-pond": ["khh"], "fo-guang-shan": ["khh"],
  "guishan-island": ["guishan", "guishanDay"], "traditional-arts": ["guishanDay"], taipingshan: ["taiping"],
  nmmba: ["nmmba", "kenting"], eluanbi: ["kenting"], longpan: ["kenting"],
};
function klookLinks(id) {
  return (MAP[id] || []).map(k => {
    const [title, slug] = P[k];
    const site = `https://www.klook.com/ko/activity/${slug}/`;
    return { title, url: `https://affiliate.klook.com/redirect?aid=42148&k_site=${encodeURIComponent(site)}` };
  });
}
module.exports = { klookLinks };
