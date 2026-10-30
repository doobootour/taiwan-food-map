// 클룩 액티비티: attraction-stars.js가 관광지와 같은 별 마커로 지도에 얹는다.
const ACTIVITIES = [
 {
  "id": "1659",
  "ko": "타이베이 101 전망대 입장권",
  "region": "타이베이",
  "lat": 25.033835,
  "lng": 121.564499,
  "line": "타이베이 대표 야경을 89층 전망대에서",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F1659-taipei-101-taipei%2F",
  "blog": "/blog-taipei-101-observatory-ticket-nearby-eats"
 },
 {
  "id": "10136",
  "ko": "국립고궁박물원 입장권",
  "region": "타이베이",
  "lat": 25.101574,
  "lng": 121.548862,
  "line": "중국 황실 보물을 모은 대만 대표 박물관",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F10136-national-palace-museum-ticket-package-taipei%2F"
 },
 {
  "id": "83266",
  "ko": "베이터우 온천·양명산 일일투어",
  "region": "타이베이",
  "lat": 25.13805,
  "lng": 121.511806,
  "line": "화산 지형 양명산과 베이터우 온천 마을을 하루에",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F83266-beitou-yangmingshan-day-tour-taipei%2F"
 },
 {
  "id": "10737",
  "ko": "구이산섬 고래관찰 반일투어",
  "region": "이란",
  "lat": 24.87066,
  "lng": 121.835885,
  "line": "우스항에서 배 타고 돌고래 보고 구이산섬 한 바퀴",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F10737-turtle-island-whale-watching-tour-yilan%2F",
  "blog": "/blog-yilan-guishan-island-whale-watching-wushi-eats"
 },
 {
  "id": "4698",
  "ko": "국립전통예술센터 입장권",
  "region": "이란",
  "lat": 24.685456,
  "lng": 121.823746,
  "line": "옛 거리 재현과 공예 체험이 있는 전통문화 공원",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F4698-national-center-for-traditional-arts-ticket-yilan%2F"
 },
 {
  "id": "40635",
  "ko": "타이핑산 국가삼림유락구 입장권",
  "region": "이란",
  "lat": 24.524241,
  "lng": 121.622889,
  "line": "해발 2,000m 숲길과 운해의 산림공원",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F40635-taipingshan-national-forest-recreation-area-ticket-yilan%2F"
 },
 {
  "id": "12080",
  "ko": "리바오랜드(麗寶樂園) 입장권",
  "region": "타이중",
  "lat": 24.323518,
  "lng": 120.695946,
  "line": "대관람차·워터파크가 있는 타이중 대형 테마파크",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F12080-lihpao-land-theme-park-combo-ticket-taichung%2F"
 },
 {
  "id": "102390",
  "ko": "가오메이 습지·궁원안과·무지개마을 타이중 일일투어",
  "region": "타이중",
  "lat": 24.30252,
  "lng": 120.54643,
  "line": "타이베이 출발, 가오메이 습지 노을까지 보는 타이중 투어",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F102390-taichung-day-tour-from-taipei%2F"
 },
 {
  "id": "99549",
  "ko": "일월담·칭징농장 일일투어 (유람선 포함)",
  "region": "난터우",
  "lat": 23.852328,
  "lng": 120.928607,
  "line": "타이중 출발, 칭징농장 양 떼와 일월담 유람선",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F99549-nantou-sunmoonlake-cingjingfarm-daytour%2F"
 },
 {
  "id": "86344",
  "ko": "아리산 일일투어 (타이중·자이·가오슝 출발)",
  "region": "자이",
  "lat": 23.53245,
  "lng": 120.805053,
  "line": "거목 숲길과 펀치후 옛 거리를 도는 아리산 투어",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F86344-alishan-day-tour-from-taichung-chiayi-kaohsiung%2F"
 },
 {
  "id": "8875",
  "ko": "치메이 박물관 입장권",
  "region": "타이난",
  "lat": 22.934459,
  "lng": 120.226462,
  "line": "유럽 궁전풍 건물의 서양 미술·악기 박물관",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F8875-chimei-museum-permanent-exhibition-ticket-tainan%2F"
 },
 {
  "id": "27309",
  "ko": "스구(十鼓) 문화촌 입장권",
  "region": "타이난",
  "lat": 22.93898,
  "lng": 120.230947,
  "line": "옛 제당공장에서 보는 북 공연과 체험",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F27309-ten-drum-cultural-village-ticket-tainan%2F"
 },
 {
  "id": "53210",
  "ko": "쓰차오 녹색터널 대나무 뗏목 승선권",
  "region": "타이난",
  "lat": 23.020902,
  "lng": 120.134818,
  "line": "맹그로브 숲 터널을 대나무 뗏목으로 지나는 코스",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F53210-sicao-green-tunnel-tainan%2F"
 },
 {
  "id": "3911",
  "ko": "이다(E-DA) 테마파크 입장권",
  "region": "가오슝",
  "lat": 22.73087,
  "lng": 120.408988,
  "line": "그리스 마을 콘셉트의 가오슝 대표 놀이공원",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F3911-e-da-theme-park-ticket-kaohsiung%2F"
 },
 {
  "id": "46975",
  "ko": "아이허(愛河) 러브보트 승선권",
  "region": "가오슝",
  "lat": 22.624326,
  "lng": 120.290329,
  "line": "저녁에 타기 좋은 아이허 강 야경 유람선",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F46975-love-river-boat-cruise-kaohsiung%2F"
 },
 {
  "id": "85862",
  "ko": "서우산 동물원 입장권",
  "region": "가오슝",
  "lat": 22.634005,
  "lng": 120.276212,
  "line": "가오슝 시내 산 위에 있는 동물원",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F85862-kaohsiung-shoushan-zoo%2F"
 },
 {
  "id": "4738",
  "ko": "국립해양생물박물관 입장권",
  "region": "컨딩(핑둥)",
  "lat": 22.045753,
  "lng": 120.699334,
  "line": "컨딩 가는 길의 대만 최대 아쿠아리움",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F4738-national-museum-marine-biology-aquarium-ticket-kenting%2F"
 },
 {
  "id": "13631",
  "ko": "컨딩 클래식 일일투어 (가오슝 출발)",
  "region": "컨딩(핑둥)",
  "lat": 21.902234,
  "lng": 120.852659,
  "line": "가오슝 출발, 어롼비 등대·난완 등 컨딩 명소 한 번에",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F13631-kenting-classic-attractions-day-tour-kenting%2F"
 },
 {
  "id": "697",
  "ko": "화롄 고래관찰 투어 (Turumoan)",
  "region": "화롄",
  "lat": 23.994212,
  "lng": 121.635772,
  "line": "화롄항에서 출발하는 2시간 반 고래·돌고래 관찰",
  "url": "https://affiliate.klook.com/redirect?aid=42148&k_site=https%3A%2F%2Fwww.klook.com%2Fko%2Factivity%2F697-hualien-whale-watching-rafting-hualien%2F"
 }
];
