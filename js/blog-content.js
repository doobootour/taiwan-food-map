// 블로그 콘텐츠 — blog.html(목록) / blog-*.html(포스트)에서 사용. region-content.js와 동일하게
// 언어별(ko/en) 콘텐츠를 데이터로 분리해두고, js/blog.js가 getLang()에 맞춰 렌더링한다.
//
// 포스트 본문은 post[lang].blocks 배열(정보형 가이드용 범용 스키마)로 구성한다. 지원하는 block.type:
//   "p"            { html }                                              — 문단
//   "h2"           { text }                                              — 소제목
//   "compareTable" { cities: [string,...], rows: [{ label, values: [...] }] } — 비교 표
//   "cityGrid"     { items: [{ img, name, tag, desc }] }                 — 도시별 이미지 카드
//   "figure"       { img, caption }                                     — 본문 중간에 넣는 이미지 한 장(예전 히어로 사진 등)
//   "figureGrid"   { items: [{ img, caption }] }                         — 이미지 여러 장
//   "quote"        { text }                                              — 인용구
//   "tipList"      { items: [{ mark, b, desc }] }                        — 마크+제목+설명 리스트
//   "cta"          { title, desc, btn, href }                            — 지도 유도 CTA
//   "note"         { text }                                              — 하단 안내 문구(출처 등)
//
// BLOG_LIST 항목의 regions: [...]는 js/data.js의 REGIONS id(taipei, taichung, kaohsiung, tainan, ...)를 그대로 쓴다.
// blog.js가 이 값으로 목록 페이지의 지역 필터 탭을 만든다. 여러 지역을 다루는 글이면 배열에 모두 적는다.

const BLOG_LIST = [
  {
    slug: "taipei-taichung-kaohsiung-with-mom",
    image: "assets/images/regions/taipei.webp",
    regions: ["taipei", "taichung", "kaohsiung"],
    ko: {
      eyebrow: "대만 여행 가이드 · 도시 선택",
      title: "타이베이·타이중·가오슝, 엄마와 가는 첫 대만 여행 어디가 편할까",
      desc: "이동 난이도, 관광 밀도, 부모님 동선까지 — 세 도시를 비교해서 첫 대만 여행지를 골라봤습니다.",
      meta: "대만 여행 · 도시 비교",
    },
    en: {
      eyebrow: "Taiwan Travel Guide · Choosing a City",
      title: "Taipei vs. Taichung vs. Kaohsiung: Best First City for a Trip with Mom",
      desc: "Comparing transit difficulty, sightseeing density, and how easy the walking is — to help pick a first Taiwan destination with a parent.",
      meta: "Taiwan Travel · City Comparison",
    },
  },
  {
    slug: "taipei-easycard-transport-guide",
    image: "assets/images/blog/taipei-taxi-night-market.jpg",
    regions: ["taipei"],
    ko: {
      eyebrow: "타이베이 여행 가이드 · 교통",
      title: "타이베이 첫 여행 3박4일, 이지카드만으로 충분할까?",
      desc: "이지카드, 신용카드 컨택리스 결제, 버스, 택시(우버)까지 — 첫 타이베이 여행자를 위한 교통수단 총정리.",
      meta: "타이베이 · 교통 가이드",
    },
    en: {
      eyebrow: "Taipei Travel Guide · Transportation",
      title: "Taipei First Trip, 4 Days 3 Nights: Is an EasyCard Enough?",
      desc: "EasyCard, contactless credit cards, buses, and taxis (Uber) — a complete transportation rundown for first-time Taipei visitors.",
      meta: "Taipei · Transportation Guide",
    },
  },
  {
    slug: "taipei-souvenir-gift-guide",
    image: "assets/images/blog/taiwan-pineapple-tart.jpg",
    regions: ["taipei"],
    ko: {
      eyebrow: "타이베이 여행 가이드 · 선물",
      title: "대만 여행 선물 추천 — 뻔한 간식 말고 뭘 사올까?",
      desc: "펑리수·누가크래커는 다들 사 오는 국룰이죠. 그래도 새로운 선물을 찾는다면, 브랜드별 비교와 가성비 팁까지 정리했어요.",
      meta: "타이베이 · 선물 가이드",
    },
    en: {
      eyebrow: "Taipei Travel Guide · Souvenirs",
      title: "Taiwan Souvenir Guide: What to Bring Home Besides the Usual Snacks",
      desc: "Pineapple cake and nougat crackers are the classic picks. Here's a brand comparison and budget tips for when you want something different.",
      meta: "Taipei · Souvenir Guide",
    },
  },
  {
    slug: "taipei-overnight-red-eye-flight-last-day",
    image: "assets/images/blog/taipei-chiang-kai-shek-hall-night.jpg",
    regions: ["taipei"],
    ko: {
      eyebrow: "타이베이 여행 가이드 · 일정 팁",
      title: "타이베이 마지막 날, 숙박 없이 새벽 비행기 타도 될까?",
      desc: "마지막 날 밤 숙소를 잡지 않고 새벽 비행기를 타는 '무박' 일정. 실제 여행자들의 경험을 바탕으로 장단점과 시간 활용법을 정리했어요.",
      meta: "타이베이 · 일정 가이드",
    },
    en: {
      eyebrow: "Taipei Travel Guide · Itinerary Tips",
      title: "Taipei Last Day: Can You Skip the Hotel and Catch a Red-Eye Flight?",
      desc: "Checking out and spending the whole last day out before a 2-3am flight, no extra hotel night. Real traveler experiences on the pros, cons, and how to spend the time.",
      meta: "Taipei · Itinerary Guide",
    },
  },
];

const BLOG_POSTS = {
  "taipei-taichung-kaohsiung-with-mom": {
    heroImage: "assets/images/regions/taipei.webp",
    ko: {
      pageTitle: "타이베이·타이중·가오슝 비교 — 엄마와 가는 첫 대만 여행지 고르기 · 나만 알고 싶은 대만 맛집",
      metaDescription: "부모님과 함께하는 첫 대만 여행, 어느 도시가 좋을까요? 이동 난이도·관광 밀도·부모님 동선 관점에서 타이베이·타이중·가오슝을 비교했습니다.",
      ogTitle: "타이베이·타이중·가오슝, 엄마와 가는 첫 대만 여행 어디가 편할까",
      eyebrow: "대만 여행 가이드 · 도시 선택",
      title: "타이베이·타이중·가오슝, 엄마와 가는 첫 대만 여행 어디가 편할까",
      dek: "이동 수단, 볼거리 밀도, 그리고 무엇보다 부모님이 걷기 편한 동선까지 — 세 도시를 나란히 비교해서 첫 대만 여행지를 골라봤습니다.",
      metaAuthor: "나만 알고 싶은 대만 맛집 편집팀",
      metaTopic: "대만 여행 · 도시 비교",
      intro: "부모님을 모시고 떠나는 첫 대만 여행이라면 도시 선택부터 고민이 깊어집니다. <strong>타이베이</strong>는 두말할 것 없이 기본값이지만, 일정이 며칠 더 남는다면 <strong>타이중</strong>과 <strong>가오슝</strong> 중 어디를 더할지가 관건이에요. 이동 난이도, 관광 밀도, 그리고 무엇보다 부모님이 걷고 이동하기에 편한 동선까지 — 세 가지 기준으로 비교해봤습니다.",
      blocks: [
        { type: "h2", text: "01 · 세 도시, 한눈에 비교하기" },
        {
          type: "compareTable",
          cities: ["타이베이", "타이중", "가오슝"],
          rows: [
            { label: "이동 난이도", values: ["MRT 노선이 촘촘해서 도보 이동이 거의 없습니다", "버스 의존도가 높고 MRT가 주요 관광지를 비껴가는 구간이 많아요", "MRT와 경전철(LRT)로 주요 명소를 대부분 커버합니다"] },
            { label: "관광 밀도", values: ["도보 반경 안에 명소가 밀집해 있습니다", "명소보다는 카페·맛집 위주로 넓게 퍼져 있어요", "바닷가·야시장 등 명소가 적당한 간격으로 분산돼 있어요"] },
            { label: "부모님 동선", values: ["역에서 도보 5~10분 이내 명소가 많아 무난해요", "걷는 구간이 길어지기 쉬워 택시 이용을 고려해야 합니다", "역 인근으로 동선을 짜기가 비교적 쉬워요"] },
            { label: "근교 확장성", values: ["타오위안, 이란 방면", "일월담·칭징농장·허환산으로 가는 전초기지로 좋습니다", "타이난·컨딩·소류구를 묶는 남부투어가 가능해요"] },
          ],
        },
        { type: "figure", img: "assets/images/regions/taipei.webp", caption: "안개 낀 산 사이로 보이는 타이베이 시내 전경." },
        { type: "h2", text: "02 · 타이베이 — 고민 없는 기본값" },
        { type: "p", html: "타이베이는 대만 여행의 정답에 가깝습니다. 지하철(MRT) 노선이 시내 전역을 촘촘히 연결하고, 역에서 내려 조금만 걸으면 고궁박물원, 스린 야시장, 융캉제 같은 대표 명소에 닿아요. 부모님과 함께라면 이동 스트레스가 적다는 것만으로도 큰 장점입니다. 처음 대만을 찾는다면, 혹은 일정이 나흘 이하로 짧다면 타이베이 한 도시에만 집중하는 편이 오히려 여행을 편안하게 만들어요." },
        { type: "h2", text: "03 · 가오슝 — 타이베이 다음으로 가장 무난한 선택" },
        { type: "p", html: "가오슝은 한국으로 치면 부산에 가깝습니다. 서울(타이베이) 다음으로 부산(가오슝)을 찾는 것처럼, 대만 여행에서도 타이베이 다음 도시로 가장 많이 떠올리는 곳이에요. MRT와 경전철(LRT)이 주요 명소 대부분을 커버하고, 바닷가와 야시장이 가까이 있어 동선을 짜기 쉽습니다. 일정이 길다면 타이난, 컨딩, 소류구까지 묶어 남부 투어로 확장할 수 있는 거점이기도 해요." },
        { type: "h2", text: "04 · 타이중 — 미식·도시 감성은 좋지만 동선은 고려해야" },
        { type: "p", html: "타이중은 관광지보다는 '그냥 도시'에 가까운 매력이 있습니다. 미슐랭 맛집이 곳곳에 있고, 박물관·미술관·오페라하우스를 돌아보며 도시 감성을 느끼기 좋아요. 다만 버스는 배차나 정류장 위치가 여행자에게 낯설 수 있고, MRT는 정작 관광지를 비껴가는 구간이 많아 걷는 거리가 길어지기 쉽습니다. 대전과 자주 비교되는 이유이기도 해요 — 딱히 관광명소가 몰려 있진 않지만 맛집 투어로는 훌륭한 도시라는 점에서요. 부모님과 함께라면 택시나 차량 이동을 적극적으로 활용하는 게 좋습니다." },
        { type: "h2", text: "05 · 엄마와 함께라면, 이렇게 골라보세요" },
        {
          type: "tipList",
          items: [
            { mark: "첫", b: "첫 대만 여행 + 일정 4일 이하", desc: "타이베이 한 도시에 집중하는 게 가장 편합니다. 이동 스트레스가 없어야 부모님도 여행을 온전히 즐길 수 있어요." },
            { mark: "남", b: "타이베이 + 도시 하나 추가, 이동 편의가 우선", desc: "가오슝을 추천합니다. MRT·LRT로 동선이 짧고, 타이난·컨딩 등 근교 일정도 짜기 쉬워요." },
            { mark: "미", b: "미식 여행 + 며칠 여유, 도보는 어느 정도 괜찮음", desc: "타이중을 더해보세요. 미슐랭 맛집과 한적한 도시 분위기를 느낄 수 있지만, 택시 이동을 적극 활용하는 게 좋습니다." },
          ],
        },
        { type: "quote", text: "\"타이중이 대전이라면, 가오슝은 부산.\" — 여행자들 사이에서 자주 나오는 비유입니다. 목적에 맞게 고르면 후회가 없어요." },
        { type: "cta", title: "지도에서 도시별 맛집도 함께 준비하세요", desc: "타이베이·타이중·가오슝 맛집을 지역별로 지도에서 바로 확인해보세요.", btn: "지도 열기 →", href: "/map" },
        { type: "note", text: "이 글은 여행자들 사이에서 공유되는 각 도시의 대중교통 여건과 여행 경험을 바탕으로 정리했습니다. 실제 대중교통 노선과 운행 정보는 방문 전 현지 교통 앱으로 다시 확인하는 것을 추천해요." },
      ],
    },
    en: {
      pageTitle: "Taipei vs. Taichung vs. Kaohsiung — Best First City for a Trip with Mom · My Secret Taiwan Eats",
      metaDescription: "Which city is best for a first Taiwan trip with a parent? Comparing Taipei, Taichung, and Kaohsiung by transit difficulty, sightseeing density, and how walkable each is.",
      ogTitle: "Taipei vs. Taichung vs. Kaohsiung: Best First City for a Trip with Mom",
      eyebrow: "Taiwan Travel Guide · Choosing a City",
      title: "Taipei vs. Taichung vs. Kaohsiung: Best First City for a Trip with Mom",
      dek: "Transit options, sightseeing density, and — most importantly — how easy the walking is for a parent. We compared all three cities side by side to help pick a first Taiwan destination.",
      metaAuthor: "My Secret Taiwan Eats Editorial",
      metaTopic: "Taiwan Travel · City Comparison",
      intro: "Planning a first Taiwan trip with a parent makes choosing a city a bigger decision than usual. <strong>Taipei</strong> is the obvious default, but if you have a few extra days, the real question is whether to add <strong>Taichung</strong> or <strong>Kaohsiung</strong>. We compared all three on transit difficulty, sightseeing density, and — above all — how easy the walking routes are for a parent.",
      blocks: [
        { type: "h2", text: "01 · The Three Cities at a Glance" },
        {
          type: "compareTable",
          cities: ["Taipei", "Taichung", "Kaohsiung"],
          rows: [
            { label: "Transit difficulty", values: ["A dense MRT network means almost no long walks", "Relies heavily on buses; the MRT skips many tourist areas", "MRT plus a light rail (LRT) covers most major sights"] },
            { label: "Sightseeing density", values: ["Landmarks are packed within walking distance of each other", "Spread out and centered more on cafes and restaurants than sights", "Sights like the waterfront and night markets are spaced conveniently"] },
            { label: "Parent-friendly routes", values: ["Most sights are 5–10 min walk from a station", "Walking distances add up quickly; plan for taxis", "Relatively easy to build a route around stations"] },
            { label: "Day-trip potential", values: ["Taoyuan, Yilan area", "A good base for Sun Moon Lake, Cingjing Farm, Hehuanshan", "Can be combined with Tainan, Kenting, Xiaoliuqiu for a southern-Taiwan tour"] },
          ],
        },
        { type: "figure", img: "assets/images/regions/taipei.webp", caption: "The Taipei skyline seen through a mountain haze." },
        { type: "h2", text: "02 · Taipei — The Easy Default" },
        { type: "p", html: "Taipei is about as close to a sure bet as Taiwan travel gets. The MRT network blankets the city, and a short walk from any station gets you to major sights like the National Palace Museum, Shilin Night Market, or Yongkang Street. Traveling with a parent, low transit stress alone is a real advantage. If it's your first time in Taiwan, or your trip is four days or shorter, focusing on Taipei alone tends to make the whole trip more relaxed." },
        { type: "h2", text: "03 · Kaohsiung — The Easiest Second City" },
        { type: "p", html: "Kaohsiung plays a role similar to Busan in Korea — just as Busan is usually the second city travelers pick after Seoul, Kaohsiung is often the second city travelers add after Taipei. Its MRT and light rail (LRT) cover most major sights, and the waterfront and night markets are close together, making routes easy to plan. With more time, it's also a great base for extending south to Tainan, Kenting, and Xiaoliuqiu." },
        { type: "h2", text: "04 · Taichung — Great for Food and City Vibes, but Plan Around Transit" },
        { type: "p", html: "Taichung feels less like a tourist destination and more like \"just a city\" — in a good way. Michelin-listed restaurants are everywhere, and it's a great place to soak up museums, galleries, and an opera house at a relaxed pace. That said, bus schedules and stops can be confusing for visitors, and the MRT skips many of the areas travelers actually want to see, so walking distances add up. It's often compared to Daejeon in Korea for the same reason — not packed with landmarks, but excellent for a food-focused trip. Traveling with a parent, lean on taxis or a car rather than walking everything." },
        { type: "h2", text: "05 · Picking a City When You're Traveling with Mom" },
        {
          type: "tipList",
          items: [
            { mark: "1", b: "First trip to Taiwan, 4 days or fewer", desc: "Stick to Taipei alone. Keeping transit stress low is what lets a parent actually enjoy the trip." },
            { mark: "2", b: "Taipei plus one more city, prioritizing easy transit", desc: "Add Kaohsiung. MRT and LRT keep routes short, and it's easy to extend to Tainan or Kenting." },
            { mark: "3", b: "A food-focused trip with a few extra days, some walking is fine", desc: "Add Taichung. You'll get Michelin restaurants and a relaxed city feel — just lean on taxis to get around." },
          ],
        },
        { type: "quote", text: "\"If Taichung is Daejeon, Kaohsiung is Busan.\" — A comparison travelers bring up often. Pick based on what you're actually there for, and you won't regret it." },
        { type: "cta", title: "Find Restaurants in Each City on the Map", desc: "Browse restaurants in Taipei, Taichung, and Kaohsiung by region, right on the map.", btn: "Open Map →", href: "/map" },
        { type: "note", text: "This guide was put together from transit conditions and travel experiences commonly shared among travelers. Double-check current routes and schedules in a local transit app before you go." },
      ],
    },
  },
  "taipei-easycard-transport-guide": {
    heroImage: "assets/images/blog/taipei-taxi-night-market.jpg",
    ko: {
      pageTitle: "타이베이 이지카드로 충분할까 — 첫 여행 3박4일 교통 가이드 · 나만 알고 싶은 대만 맛집",
      metaDescription: "타이베이 첫 여행, 이지카드만으로 충분할까요? 신용카드 컨택리스 결제, 버스, 택시(우버)는 언제 타야 하는지까지 — 실제 여행자들의 경험을 바탕으로 정리했습니다.",
      ogTitle: "타이베이 첫 여행 3박4일, 이지카드만으로 충분할까?",
      eyebrow: "타이베이 여행 가이드 · 교통",
      title: "타이베이 첫 여행 3박4일, 이지카드만으로 충분할까?",
      dek: "이지카드 하나로 지하철·버스·편의점까지 다 되는지, 신용카드는 어디까지 되는지, 택시는 언제 타야 하는지 — 첫 타이베이 여행자들이 가장 많이 묻는 교통 고민을 정리했습니다.",
      metaAuthor: "나만 알고 싶은 대만 맛집 편집팀",
      metaTopic: "타이베이 · 교통 가이드",
      intro: "타이베이 여행을 준비하다 보면 꼭 한 번은 마주치는 질문이 있습니다. \"이지카드 하나로 충분할까? 신용카드도 되나? 택시는 언제 타야 하지?\" 대중교통이 촘촘한 타이베이는 사실 복잡하게 고민할 필요가 없는 도시예요. 실제 여행자들의 경험을 바탕으로 <strong>이지카드·신용카드·택시(우버)</strong>의 사용 범위를 한 번에 정리해봤습니다.",
      blocks: [
        { type: "h2", text: "01 · 이지카드 vs 신용카드, 어디까지 될까" },
        {
          type: "compareTable",
          cities: ["이지카드(EasyCard)", "신용카드(컨택리스)", "우버 / 택시"],
          rows: [
            { label: "지하철(MRT)", values: ["가능 — 공항철도 포함 전 노선", "가능 — 카드 뒷면에 컨택리스 결제 아이콘이 있어야 합니다", "필요할 때만 이용"] },
            { label: "버스", values: ["가능", "아직 지원 안 됨", "필요할 때만 이용"] },
            { label: "편의점 · 마트", values: ["가능 — 충전 잔액으로 바로 결제", "가능", "해당 없음"] },
            { label: "충전 · 준비", values: ["공항·지하철역·편의점에서 구매 및 충전", "기존에 쓰던 카드 그대로 사용, 별도 발급 불필요", "출국 전 앱 설치 및 카드 등록"] },
            { label: "첫 여행자 추천도", values: ["대중교통 위주라면 필수", "카드 결제를 선호한다면 보조 수단으로 좋습니다", "체력이 떨어지거나 짐이 많을 때, 혹은 편하게 이동하고 싶을 때 좋아요"] },
          ],
        },
        { type: "figure", img: "assets/images/blog/taipei-taxi-night-market.jpg", caption: "대만 택시는 전부 노란색이라 멀리서도 눈에 잘 띄어요." },
        { type: "h2", text: "02 · 유명 관광지는 거의 다 지하철·버스로 닿아요" },
        { type: "p", html: "타이베이는 유명 관광지 대부분이 MRT 노선과 버스 노선으로 커버됩니다. 고궁박물원, 스린 야시장, 융캉제, 시먼딩처럼 여행자들이 많이 찾는 코스는 이지카드 한 장이면 충분히 다닐 수 있어요. 구글 지도로 경로를 검색하면 지하철·버스 환승 정보는 물론 버스 하차 알림까지 챙겨주기 때문에, 초행길이라도 크게 헤맬 일이 없습니다." },
        { type: "h2", text: "03 · 택시(우버)는 언제 타야 할까" },
        {
          type: "tipList",
          items: [
            { mark: "1", b: "체력이 떨어졌을 때", desc: "하루 종일 걸어다닌 뒤 숙소로 돌아갈 때는, 무리해서 대중교통을 갈아타기보다 택시가 훨씬 편합니다." },
            { mark: "2", b: "쇼핑으로 짐이 많아질 때", desc: "양손 가득 짐을 들고 환승하기보다, 숙소까지 바로 이동하는 편이 나아요." },
            { mark: "3", b: "대중교통 환승이 애매할 때", desc: "노선이 꼬이거나 도보 이동이 길어지는 구간이라면, 택시가 시간과 체력을 아껴줍니다." },
            { mark: "4", b: "말이 잘 안 통하거나 깔끔한 차량을 원할 때", desc: "길거리에서 택시를 잡으면 목적지를 설명하기 애매하거나 차량 상태가 제각각일 수 있어요. 우버는 앱에 주소만 입력하면 되고 요금도 미리 확인할 수 있는 데다, 차량이 깨끗하고 기사님 서비스도 좋은 경우가 많아서 오히려 우버를 더 선호하는 여행자도 꽤 있습니다." },
          ],
        },
        { type: "h2", text: "04 · 3박4일, 실제로는 이렇게 다녀요" },
        { type: "p", html: "실제로 다녀온 여행자들의 후기를 보면 답은 비슷합니다. 3박4일 내내 지하철과 버스만으로 다녔다는 후기가 가장 많았고, 컨택리스 신용카드 한 장으로 대만에서 6일을 지내고 온 사례도 있었어요. 이지카드는 남은 잔액을 편의점에서 알뜰하게 쓰고 귀국하는 것도 흔한 방법입니다. 우버는 다들 미리 앱을 설치해두는 편인데, 실제로 타 본 여행자들 사이에서는 깨끗한 차량과 편한 결제 덕분에 만족스러웠다는 후기도 적지 않았어요." },
        { type: "quote", text: "\"걷는 게 괜찮으시다면 지하철로 움직이셔도 어지간하면 충분합니다.\" — 실제 타이베이를 다녀온 여행자들이 가장 많이 남긴 한마디입니다." },
        { type: "h2", text: "05 · 첫 여행자를 위한 체크리스트" },
        {
          type: "tipList",
          items: [
            { mark: "✓", b: "이지카드부터 챙기기", desc: "공항 도착 후 지하철역이나 편의점에서 바로 구매·충전할 수 있습니다. 지하철, 버스, 편의점까지 한 장으로 해결돼요." },
            { mark: "✓", b: "구글 지도 앱 미리 준비", desc: "노선 검색은 물론 버스 하차 알림까지 챙겨주니, 초행길에 특히 유용해요." },
            { mark: "✓", b: "우버 앱도 함께 준비하기", desc: "짐이 많거나 체력이 떨어졌을 때는 물론, 깔끔한 차량과 정찰 요금을 선호해서 길거리 택시 대신 우버를 즐겨 타는 여행자도 많아요. 미리 설치해두면 언제든 편하게 쓸 수 있습니다." },
            { mark: "✓", b: "컨택리스 신용카드 확인", desc: "카드 뒷면에 와이파이 모양(옆으로 누운) 아이콘이 있다면 지하철 결제가 가능합니다. 다만 버스는 아직 지원하지 않아요." },
          ],
        },
        { type: "cta", title: "타이베이 맛집도 지도에서 미리 찜해두세요", desc: "이지카드로 이동하면서 들르기 좋은 타이베이 맛집을 지도에서 확인해보세요.", btn: "지도 열기 →", href: "/map?region=taipei" },
        { type: "note", text: "이 글은 실제 타이베이를 다녀온 여행자들의 경험을 바탕으로 정리했습니다. 교통 요금과 결제 정책은 방문 전 대중교통 앱이나 공식 안내로 다시 확인하는 것을 추천해요." },
      ],
    },
    en: {
      pageTitle: "Is an EasyCard Enough for Taipei? A First-Timer's 4-Day Transportation Guide · My Secret Taiwan Eats",
      metaDescription: "Is an EasyCard alone enough for a first Taipei trip? When can you use a contactless credit card, and when should you actually take a taxi or Uber? Based on real traveler experiences.",
      ogTitle: "Taipei First Trip, 4 Days 3 Nights: Is an EasyCard Enough?",
      eyebrow: "Taipei Travel Guide · Transportation",
      title: "Taipei First Trip, 4 Days 3 Nights: Is an EasyCard Enough?",
      dek: "Whether one EasyCard covers the MRT, buses, and convenience stores, how far a contactless credit card gets you, and when to actually call a taxi — the transportation questions first-time Taipei travelers ask most.",
      metaAuthor: "My Secret Taiwan Eats Editorial",
      metaTopic: "Taipei · Transportation Guide",
      intro: "Planning a Taipei trip always brings up the same question: \"Is an EasyCard enough? Does my credit card work? When do I actually need a taxi?\" Taipei's transit network is dense enough that the answer is simpler than it sounds. Based on real traveler experiences, here's exactly how far an <strong>EasyCard, a contactless credit card, and Uber/taxis</strong> each get you.",
      blocks: [
        { type: "h2", text: "01 · EasyCard vs. Credit Card: What Each One Covers" },
        {
          type: "compareTable",
          cities: ["EasyCard", "Contactless Credit Card", "Uber / Taxi"],
          rows: [
            { label: "MRT", values: ["Yes — every line, including the Airport MRT", "Yes — your card needs the contactless payment icon on the back", "Use only when needed"] },
            { label: "Buses", values: ["Yes", "Not supported yet", "Use only when needed"] },
            { label: "Convenience stores & marts", values: ["Yes — pay straight from your card balance", "Yes", "N/A"] },
            { label: "Getting set up", values: ["Buy and top up at the airport, MRT stations, or convenience stores", "Just use the card you already have — no extra sign-up", "Install the app and register a card before you fly"] },
            { label: "Good for first-timers?", values: ["Essential if you're mostly using public transit", "A solid backup if you prefer paying by card", "Great when you're worn out, carrying a lot, or just want an easy ride"] },
          ],
        },
        { type: "figure", img: "assets/images/blog/taipei-taxi-night-market.jpg", caption: "Every taxi in Taiwan is yellow, so they're easy to spot from a distance." },
        { type: "h2", text: "02 · The MRT and Buses Already Cover Almost Every Famous Spot" },
        { type: "p", html: "Most of Taipei's well-known sights sit right on an MRT or bus line. Popular stops like the National Palace Museum, Shilin Night Market, Yongkang Street, and Ximending are all easily reachable with just an EasyCard. Google Maps handles transfers between MRT and bus routes and even tells you when to get off the bus, so it's hard to get lost even on your first day." },
        { type: "h2", text: "03 · When Should You Actually Take a Taxi?" },
        {
          type: "tipList",
          items: [
            { mark: "1", b: "When you're worn out", desc: "After a full day of walking, heading back to your hotel is a lot easier by taxi than by forcing another transit transfer." },
            { mark: "2", b: "When shopping has piled up your bags", desc: "Rather than transferring trains with your hands full, it's easier to go straight back to your hotel." },
            { mark: "3", b: "When the transit connection is awkward", desc: "If a route involves a confusing transfer or a long walk, a taxi saves both time and energy." },
            { mark: "4", b: "When you want an easier, cleaner ride", desc: "Flagging a street taxi can mean explaining your destination or getting whatever car happens to pull up. With Uber, you just enter the address, see the fare upfront, and the cars tend to be clean with friendly drivers — enough that plenty of travelers actually prefer it over hailing a regular taxi." },
          ],
        },
        { type: "h2", text: "04 · What a Real 4-Day Trip Actually Looks Like" },
        { type: "p", html: "Real traveler reviews tend to agree. Most people said they got through all four days on just the MRT and buses, and one traveler managed six days in Taiwan on a single contactless credit card. Spending down a leftover EasyCard balance at a convenience store before flying home is a common move too. Most travelers install the Uber app beforehand, and those who actually used it often mentioned how clean the cars were and how easy the payment was." },
        { type: "quote", text: "\"If you're fine with walking, the MRT alone is enough for almost everything.\" — The single most common piece of advice from travelers who've actually been to Taipei." },
        { type: "h2", text: "05 · A Checklist for First-Time Visitors" },
        {
          type: "tipList",
          items: [
            { mark: "✓", b: "Get an EasyCard first", desc: "You can buy and top one up right at the airport MRT station or a convenience store. One card covers the MRT, buses, and convenience stores." },
            { mark: "✓", b: "Set up Google Maps beforehand", desc: "It handles route search and bus-stop alerts, which is especially useful when you don't know the city yet." },
            { mark: "✓", b: "Set up Uber too", desc: "Beyond just tired-and-carrying-too-much situations, plenty of travelers prefer Uber's clean cars and upfront pricing over hailing a taxi off the street. Get it registered ahead of time so it's ready whenever you want it." },
            { mark: "✓", b: "Check for contactless on your credit card", desc: "If the back of your card has the sideways Wi-Fi-shaped icon, it works on the MRT — just not on buses yet." },
          ],
        },
        { type: "cta", title: "Bookmark Taipei Restaurants on the Map Too", desc: "Find Taipei restaurants worth stopping at while you get around on your EasyCard.", btn: "Open Map →", href: "/map?region=taipei" },
        { type: "note", text: "This guide was put together from the experiences of real Taipei travelers. Fares and payment policies can change, so double-check with a transit app or official source before you go." },
      ],
    },
  },
  "taipei-souvenir-gift-guide": {
    heroImage: "assets/images/blog/taiwan-pineapple-tart.jpg",
    ko: {
      pageTitle: "대만 여행 선물 추천 — 뻔한 간식 말고 뭘 사올까? · 나만 알고 싶은 대만 맛집",
      metaDescription: "펑리수, 누가크래커, 에그롤... 대만 선물은 늘 비슷하죠. 재방문객을 위한 추천부터 브랜드별 비교, 까르푸 가성비 팁까지 정리했습니다.",
      ogTitle: "대만 여행 선물 추천 — 뻔한 간식 말고 뭘 사올까?",
      eyebrow: "타이베이 여행 가이드 · 선물",
      title: "대만 여행 선물 추천 — 뻔한 간식 말고 뭘 사올까?",
      dek: "회사 선물부터 재방문객을 위한 신상 간식까지 — 여행자들이 실제로 사 온 대만 선물과 브랜드별 비교, 가성비 팁을 한 번에 정리했습니다.",
      metaAuthor: "나만 알고 싶은 대만 맛집 편집팀",
      metaTopic: "타이베이 · 선물 가이드",
      intro: "대만 여행 선물 하면 펑리수, 누가크래커, 에그롤, 우롱차가 먼저 떠오릅니다. 다 좋은 선택이지만, 여러 번 다녀온 여행자라면 슬슬 새로운 선물이 궁금해지기 마련이에요. 실제 여행자들이 사 온 선물 후기를 바탕으로, 무난한 '국룰' 선물부터 브랜드별 비교, 예산에 맞게 고르는 팁까지 정리해봤어요.",
      blocks: [
        { type: "h2", text: "01 · 실패 없는 '국룰' 선물 리스트" },
        {
          type: "tipList",
          items: [
            { mark: "1", b: "펑리수(鳳梨酥)", desc: "대만 선물의 대명사입니다. 브랜드마다 맛과 가격 차이가 있어서, 이름 있는 브랜드로 사면 실패할 일이 거의 없어요." },
            { mark: "2", b: "누가크래커(牛軋餅)", desc: "회사에 가볍게 돌릴 선물로 가장 무난하다는 평이 많습니다. 다만 브랜드에 따라 맛 차이가 꽤 커요." },
            { mark: "3", b: "에그롤(蛋捲)", desc: "바삭한 식감 덕분에 호불호가 적은 편입니다. 크림이 들어간 제품도 있어서 맛을 다양하게 골라볼 수 있어요." },
            { mark: "4", b: "우롱차 · 대만 홍차", desc: "차를 즐기는 분에게 특히 좋습니다. 부피가 작아 캐리어에 넣기도 편해요." },
            { mark: "5", b: "금문 고량주", desc: "간식은 아니지만 받는 사람마다 크게 반가워한다는 후기가 많습니다. 도수가 높은 편이라 술을 즐기는 분께 추천할 만해요." },
          ],
        },
        { type: "figure", img: "assets/images/blog/taiwan-pineapple-tart.jpg", caption: "한 입 베어 문 펑리수와 따뜻한 차 한 잔 — 대만 선물의 정석 조합." },
        { type: "h2", text: "02 · 재방문객이라면, 이런 것도 찾아보세요" },
        { type: "p", html: "펑리수·누가크래커는 이제 익숙하다면, 크림이 들어간 에그롤처럼 조금 다른 버전을 찾아보는 것도 방법입니다. 맛을 여러 가지로 시식해보고 고를 수 있는 매장도 있고, 포장이 깔끔해서 선물용으로도 무난하다는 후기가 많아요." },
        { type: "h2", text: "03 · 누가크래커, 브랜드마다 이렇게 다릅니다" },
        {
          type: "compareTable",
          cities: ["전문 브랜드(세인트피터 등)", "까르푸 등 마트", "스위덤"],
          rows: [
            { label: "가격대", values: ["다소 비싼 편", "가장 저렴", "중간 — 만원 안팎"] },
            { label: "맛 평가", values: ["꾸준히 좋은 평, 다만 가격이 계속 오르는 추세", "브랜드에 따라 편차가 커서 호불호가 갈립니다", "가격 대비 맛이 좋다는 후기가 많아요"] },
            { label: "추천 상황", values: ["정성껏 챙기고 싶은 선물일 때", "가볍게 인사치레만 할 때", "가성비 좋은 선물을 찾을 때"] },
          ],
        },
        { type: "h2", text: "04 · 예산과 상황에 맞게 고르는 법" },
        {
          type: "tipList",
          items: [
            { mark: "✓", b: "제대로 챙기고 싶은 선물이라면", desc: "전문 브랜드 매장에서 사는 게 안전합니다. 가격은 더 나가지만 맛과 포장 모두 검증된 편이에요." },
            { mark: "✓", b: "가볍게 여러 개 돌릴 선물이라면", desc: "까르푸 같은 마트에서 사도 충분하다는 의견이 많습니다. 다만 마트 자체 누가크래커는 호불호가 갈린다는 후기가 있으니, 브랜드를 확인하고 고르는 게 좋아요." },
            { mark: "✓", b: "최근 대만 물가가 많이 올랐다는 점도 참고하기", desc: "오랜만에 방문하는 여행자라면 예전 가격을 생각하고 갔다가 놀랄 수 있습니다. 예산을 조금 여유 있게 잡아두는 걸 추천해요." },
          ],
        },
        { type: "quote", text: "\"까르푸 누가는 하나 먹고 다 버렸어요, 선물로 주면 욕먹을지도... 스위덤은 가격도 착하고 맛있어요.\" — 여러 브랜드를 직접 먹어본 여행자가 남긴 비교입니다." },
        { type: "cta", title: "지도에서 마트·간식 스팟도 확인해보세요", desc: "선물 쇼핑하기 좋은 마트와 간식 매장을 지도에서 바로 찾아보세요.", btn: "지도 열기 →", href: "/map?region=taipei&cat=mart" },
        { type: "note", text: "이 글은 여행자들이 실제로 사 온 선물 후기를 바탕으로 정리했습니다. 브랜드별 가격과 맛 평가는 개인차가 있을 수 있으니 참고용으로 봐주세요." },
      ],
    },
    en: {
      pageTitle: "Taiwan Souvenir Guide: What to Bring Home Besides the Usual Snacks · My Secret Taiwan Eats",
      metaDescription: "Pineapple cake, nougat crackers, egg rolls... Taiwan souvenirs can get repetitive. Here's what repeat visitors actually buy, a brand comparison, and budget tips for shopping at Carrefour.",
      ogTitle: "Taiwan Souvenir Guide: What to Bring Home Besides the Usual Snacks",
      eyebrow: "Taipei Travel Guide · Souvenirs",
      title: "Taiwan Souvenir Guide: What to Bring Home Besides the Usual Snacks",
      dek: "From office gifts to something new for repeat visitors — real traveler picks, a brand-by-brand comparison, and budget tips, all in one place.",
      metaAuthor: "My Secret Taiwan Eats Editorial",
      metaTopic: "Taipei · Souvenir Guide",
      intro: "Ask anyone what to bring back from Taiwan and you'll hear the same four things: pineapple cake, nougat crackers, egg rolls, oolong tea. They're all solid choices, but if you've been to Taiwan more than once, you're probably ready for something new. Based on real traveler reviews, here's the reliable classic list, a brand comparison, and how to choose based on your budget.",
      blocks: [
        { type: "h2", text: "01 · The Reliable Classics" },
        {
          type: "tipList",
          items: [
            { mark: "1", b: "Pineapple Cake (鳳梨酥)", desc: "The single most iconic Taiwan souvenir. Quality varies a lot by brand, so sticking with a well-known one is nearly foolproof." },
            { mark: "2", b: "Nougat Crackers (牛軋餅)", desc: "Often called the safest pick for handing out at the office. The taste differs quite a bit between brands, so which one you buy matters." },
            { mark: "3", b: "Egg Rolls (蛋捲)", desc: "The crunchy texture makes these an easy crowd-pleaser. Some shops offer cream-filled versions for extra variety." },
            { mark: "4", b: "Oolong or Taiwanese Black Tea", desc: "Great for anyone who drinks tea. Compact and easy to pack too." },
            { mark: "5", b: "Kinmen Kaoliang Liquor", desc: "Not a snack, but travelers say it gets one of the biggest reactions of any gift. Worth it if the recipient drinks." },
          ],
        },
        { type: "figure", img: "assets/images/blog/taiwan-pineapple-tart.jpg", caption: "A bitten pineapple cake and a cup of tea — Taiwan's classic pairing." },
        { type: "h2", text: "02 · If You've Been Before, Look For This Too" },
        { type: "p", html: "If pineapple cake and nougat crackers already feel familiar, cream-filled egg rolls are worth a try for something a little different. Some shops let you sample a range of flavors before you buy, and the packaging tends to be clean enough for gifting." },
        { type: "h2", text: "03 · Nougat Crackers: How the Brands Actually Compare" },
        {
          type: "compareTable",
          cities: ["Specialty brands (e.g. St. Peter)", "Supermarkets like Carrefour", "Sweetum"],
          rows: [
            { label: "Price", values: ["On the pricier side", "The cheapest option", "Mid-range — roughly $7–8 USD"] },
            { label: "Taste", values: ["Consistently good, though prices keep climbing", "Varies a lot by brand — hit or miss", "Often praised as good value for the price"] },
            { label: "Best for", values: ["A gift you want to get right", "A quick, casual gift for several people", "Good taste without the premium price tag"] },
          ],
        },
        { type: "h2", text: "04 · Choosing by Budget and Occasion" },
        {
          type: "tipList",
          items: [
            { mark: "✓", b: "For a gift you want to nail", desc: "Buy from a specialty brand store. It costs more, but both the taste and packaging are proven." },
            { mark: "✓", b: "For handing out several casual gifts", desc: "A supermarket like Carrefour works fine for most people. Just know that the store's own-brand nougat gets mixed reviews, so it's worth checking which brand you're grabbing." },
            { mark: "✓", b: "Keep in mind that prices in Taiwan have risen a lot", desc: "If it's been a while since your last visit, budget a bit more than you remember — prices have gone up noticeably." },
          ],
        },
        { type: "quote", text: "\"I ate one piece of the Carrefour nougat and threw the rest away — giving that as a gift might get you some complaints. Sweetum was actually good, and reasonably priced too.\" — One traveler's brand-by-brand verdict after trying several." },
        { type: "cta", title: "Find Mart and Snack Spots on the Map", desc: "Look up supermarkets and snack shops that are good for souvenir shopping, right on the map.", btn: "Open Map →", href: "/map?region=taipei&cat=mart" },
        { type: "note", text: "This guide was put together from real travelers' souvenir shopping experiences. Brand-by-brand pricing and taste are a matter of personal preference, so take it as a starting point." },
      ],
    },
  },
  "taipei-overnight-red-eye-flight-last-day": {
    heroImage: "assets/images/blog/taipei-chiang-kai-shek-hall-night.jpg",
    ko: {
      pageTitle: "타이베이 무박 일정 가이드 — 숙박 없이 새벽 비행기 타기 · 나만 알고 싶은 대만 맛집",
      metaDescription: "마지막 날 숙소를 잡지 않고 새벽 비행기를 타는 '무박' 일정, 가능할까요? 실제로 그렇게 다녀온 여행자들의 경험을 바탕으로 장단점과 시간 활용법을 정리했습니다.",
      ogTitle: "타이베이 마지막 날, 숙박 없이 새벽 비행기 타도 될까?",
      eyebrow: "타이베이 여행 가이드 · 일정 팁",
      title: "타이베이 마지막 날, 숙박 없이 새벽 비행기 타도 될까?",
      dek: "체크아웃 후 하루를 통으로 놀고 바로 공항으로 — 숙박비를 아끼는 '무박' 일정, 실제로 해본 여행자들의 경험과 시간 활용법을 정리했습니다.",
      metaAuthor: "나만 알고 싶은 대만 맛집 편집팀",
      metaTopic: "타이베이 · 일정 가이드",
      intro: "타이베이 여행 마지막 날, 비행기가 새벽 2~3시라면 고민이 생깁니다. 하루 더 숙박을 잡을지, 아니면 체크아웃 후 그대로 놀다가 공항으로 직행할지. 실제로 '무박'으로 다녀온 여행자들의 경험을 바탕으로 장단점과 시간 활용법을 정리해봤어요.",
      blocks: [
        { type: "h2", text: "01 · 무박, 해볼 만할까?" },
        { type: "p", html: "결론부터 말하면 '사바사'입니다. 체력이 좋다면 충분히 가능하고, 숙박비도 아낄 수 있어서 실제로 시도하는 여행자가 많아요. 반면 어린 자녀나 어르신과 함께라면, 혹은 귀국 다음 날 바로 출근해야 한다면 무리하지 않는 편이 낫다는 의견도 많습니다." },
        { type: "h2", text: "02 · 실제로 이렇게 시간을 보내요" },
        {
          type: "tipList",
          items: [
            { mark: "1", b: "체크아웃 후 짐 보관", desc: "호텔이나 근처 짐 보관 서비스에 맡기고 몸만 가볍게 움직입니다. 대부분의 숙소에서 체크아웃 이후에도 짐을 맡아줘요." },
            { mark: "2", b: "저녁까지는 평소처럼 관광·쇼핑", desc: "레이트 체크아웃이 가능하면 오후 늦게 일정을 시작하는 것도 방법입니다. 마지막 날이라고 특별히 다를 것 없이 자유롭게 시간을 보내요." },
            { mark: "3", b: "샤워되는 마사지숍에서 마무리", desc: "마사지를 받고 그 자리에서 씻고 나오면 한결 개운합니다. 짐 정리와 체력 회복을 동시에 해결할 수 있어요." },
            { mark: "4", b: "공항 이동은 밤 10시~11시 전후", desc: "공항철도나 국광버스(1819)를 타고 여유 있게 이동합니다. 타이베이 메인역에서 버스를 타면 큰 정체 없이 도착해요." },
            { mark: "5", b: "공항 도착 후 무료 샤워장·라운지 활용", desc: "타오위안 공항에는 무료 샤워 시설이 있어서, 탑승 전 한 번 더 씻고 정비할 수 있습니다. 라운지 이용이 가능하다면 그곳에서 쉬다 타는 것도 좋아요." },
          ],
        },
        { type: "figure", img: "assets/images/blog/taipei-chiang-kai-shek-hall-night.jpg", caption: "야간 조명이 켜진 중정기념당(자유광장) — 마지막 밤 산책 코스로도 좋아요." },
        { type: "h2", text: "03 · 그래도 하루 더 자는 게 나은 경우" },
        {
          type: "tipList",
          items: [
            { mark: "✓", b: "어린 자녀나 어르신과 함께라면", desc: "체력 부담이 커서, 짧게라도 호스텔 1박이나 '0.5박'으로 눈을 붙이고 가는 게 안전합니다." },
            { mark: "✓", b: "귀국 다음 날 바로 출근·등교한다면", desc: "무박으로 다녀오면 컨디션 난이도가 꽤 높아요. 도착 후 일정이 있다면 숙박을 잡는 편이 낫습니다." },
            { mark: "✓", b: "숙박비를 아예 포기하기 어렵다면", desc: "굳이 호텔이 아니어도 됩니다. 호스텔 1박만 추가해도 짧게 눈을 붙이고 짐도 여유 있게 정리할 수 있어요." },
          ],
        },
        { type: "quote", text: "\"이왕 가신 거 후회 없이 놀아보세요. 이렇게 놀 수 있는 기회가 흔치는 않다고 생각해요.\" — 무박 일정을 응원하는 여행자들의 댓글이에요." },
        { type: "cta", title: "지도에서 마지막 날 코스도 짜보세요", desc: "숙소·마사지숍·야시장까지, 마지막 날 동선을 지도에서 한눈에 확인해보세요.", btn: "지도 열기 →", href: "/map?region=taipei" },
        { type: "note", text: "이 글은 여행자들이 실제로 겪은 무박 일정 경험을 바탕으로 정리했습니다. 체력과 컨디션은 사람마다 다르니, 무리하지 않는 선에서 참고해 주세요." },
      ],
    },
    en: {
      pageTitle: "Taipei Red-Eye Flight Guide: Skipping the Last Hotel Night · My Secret Taiwan Eats",
      metaDescription: "Can you skip booking a hotel on your last night and catch a 2-3am flight instead? Based on real traveler experiences, here are the pros, cons, and how to spend the time.",
      ogTitle: "Taipei Last Day: Can You Skip the Hotel and Catch a Red-Eye Flight?",
      eyebrow: "Taipei Travel Guide · Itinerary Tips",
      title: "Taipei Last Day: Can You Skip the Hotel and Catch a Red-Eye Flight?",
      dek: "Check out, spend the whole day out, and head straight to the airport — real traveler experiences on this hotel-skipping itinerary and how to make the most of the time.",
      metaAuthor: "My Secret Taiwan Eats Editorial",
      metaTopic: "Taipei · Itinerary Guide",
      intro: "If your flight out of Taipei leaves at 2 or 3am, you're faced with a choice: book one more night, or check out and just keep going until it's time for the airport. Based on real travelers who've actually done the latter, here's a rundown of the pros, cons, and how to spend the time.",
      blocks: [
        { type: "h2", text: "01 · Is Skipping the Hotel Actually Worth It?" },
        { type: "p", html: "The short answer: it depends on you. If your stamina is up for it, it's a completely viable way to save on a hotel night, and plenty of travelers do it. On the other hand, if you're traveling with young kids or older family members, or you have to go straight to work the next day, most people say it's not worth pushing it." },
        { type: "h2", text: "02 · How Travelers Actually Spend the Time" },
        {
          type: "tipList",
          items: [
            { mark: "1", b: "Check out and store your luggage", desc: "Most hotels will hold your bags after checkout, so you can move around freely without them." },
            { mark: "2", b: "Keep sightseeing or shopping like normal", desc: "If a late checkout is available, starting the day later is another option. There's no need to treat it differently just because it's your last day." },
            { mark: "3", b: "Finish up at a massage shop with showers", desc: "Getting a massage and showering on-site leaves you feeling refreshed. It doubles as a chance to repack and recover some energy." },
            { mark: "4", b: "Head to the airport around 10-11pm", desc: "Take the Airport MRT or the Kuo-Kuang bus (route 1819) with plenty of time to spare. From Taipei Main Station, the bus gets you there without much traffic." },
            { mark: "5", b: "Use the free showers or a lounge at the airport", desc: "Taoyuan Airport has free shower facilities, so you can freshen up again right before boarding. If you have lounge access, resting there before your flight helps too." },
          ],
        },
        { type: "figure", img: "assets/images/blog/taipei-chiang-kai-shek-hall-night.jpg", caption: "Chiang Kai-shek Memorial Hall lit up at night — a good spot for one last evening walk." },
        { type: "h2", text: "03 · When It's Better to Book One More Night" },
        {
          type: "tipList",
          items: [
            { mark: "✓", b: "Traveling with young kids or older family members", desc: "The physical toll adds up fast. A short hostel stay or a half-night booking is the safer call." },
            { mark: "✓", b: "You have to work or go to school the day you land", desc: "Skipping the hotel makes for a genuinely tough recovery. If you have plans right after landing, book a room instead." },
            { mark: "✓", b: "You'd rather not give up sleep entirely", desc: "It doesn't have to be a hotel — even one hostel night gives you a chance to rest and repack without rushing." },
          ],
        },
        { type: "quote", text: "\"Since you're already there, might as well enjoy it without regrets. Chances to stay out until your flight like that don't come around often.\" — from travelers cheering on a no-hotel last day." },
        { type: "cta", title: "Plan Your Last Day on the Map Too", desc: "Find hotels, massage shops, and night markets for your last-day route, right on the map.", btn: "Open Map →", href: "/map?region=taipei" },
        { type: "note", text: "This guide was put together from real travelers' experiences skipping the last hotel night. Everyone's stamina is different, so use this as a reference and don't push yourself too hard." },
      ],
    },
  },
};
