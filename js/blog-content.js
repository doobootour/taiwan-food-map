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
      metaReadTime: "약 7분 소요",
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
      metaReadTime: "About 7 min read",
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
      metaReadTime: "약 6분 소요",
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
            { label: "첫 여행자 추천도", values: ["대중교통 위주라면 필수", "카드 결제를 선호한다면 보조 수단으로 좋습니다", "체력이 떨어지거나 짐이 많을 때만"] },
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
          ],
        },
        { type: "h2", text: "04 · 3박4일, 실제로는 이렇게 다녀요" },
        { type: "p", html: "실제로 다녀온 여행자들의 후기를 보면 답은 비슷합니다. 3박4일 내내 지하철과 버스만으로 다녔다는 후기가 가장 많았고, 컨택리스 신용카드 한 장으로 대만에서 6일을 지내고 온 사례도 있었어요. 이지카드는 남은 잔액을 편의점에서 알뜰하게 쓰고 귀국하는 것도 흔한 방법입니다. 우버 앱은 다들 미리 설치해두지만, 실제로 타는 일은 드물다는 의견이 많았어요." },
        { type: "quote", text: "\"걷는 게 괜찮으시다면 지하철로 움직이셔도 어지간하면 충분합니다.\" — 실제 타이베이를 다녀온 여행자들이 가장 많이 남긴 한마디입니다." },
        { type: "h2", text: "05 · 첫 여행자를 위한 체크리스트" },
        {
          type: "tipList",
          items: [
            { mark: "✓", b: "이지카드부터 챙기기", desc: "공항 도착 후 지하철역이나 편의점에서 바로 구매·충전할 수 있습니다. 지하철, 버스, 편의점까지 한 장으로 해결돼요." },
            { mark: "✓", b: "구글 지도 앱 미리 준비", desc: "노선 검색은 물론 버스 하차 알림까지 챙겨주니, 초행길에 특히 유용해요." },
            { mark: "✓", b: "우버 앱은 미리 설치만 해두기", desc: "실제로 탈 일은 많지 않아도, 짐이 많거나 체력이 떨어졌을 때를 대비해 미리 설치해두면 마음이 편합니다." },
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
      metaReadTime: "About 6 min read",
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
            { label: "Good for first-timers?", values: ["Essential if you're mostly using public transit", "A solid backup if you prefer paying by card", "Only when you're worn out or carrying a lot"] },
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
          ],
        },
        { type: "h2", text: "04 · What a Real 4-Day Trip Actually Looks Like" },
        { type: "p", html: "Real traveler reviews tend to agree. Most people said they got through all four days on just the MRT and buses, and one traveler managed six days in Taiwan on a single contactless credit card. Spending down a leftover EasyCard balance at a convenience store before flying home is a common move too. Almost everyone installs the Uber app just in case, but actually needing to use it turns out to be rare." },
        { type: "quote", text: "\"If you're fine with walking, the MRT alone is enough for almost everything.\" — The single most common piece of advice from travelers who've actually been to Taipei." },
        { type: "h2", text: "05 · A Checklist for First-Time Visitors" },
        {
          type: "tipList",
          items: [
            { mark: "✓", b: "Get an EasyCard first", desc: "You can buy and top one up right at the airport MRT station or a convenience store. One card covers the MRT, buses, and convenience stores." },
            { mark: "✓", b: "Set up Google Maps beforehand", desc: "It handles route search and bus-stop alerts, which is especially useful when you don't know the city yet." },
            { mark: "✓", b: "Install Uber, but just register it", desc: "You may not end up using it much, but having it ready gives peace of mind for when you're tired or carrying too much." },
            { mark: "✓", b: "Check for contactless on your credit card", desc: "If the back of your card has the sideways Wi-Fi-shaped icon, it works on the MRT — just not on buses yet." },
          ],
        },
        { type: "cta", title: "Bookmark Taipei Restaurants on the Map Too", desc: "Find Taipei restaurants worth stopping at while you get around on your EasyCard.", btn: "Open Map →", href: "/map?region=taipei" },
        { type: "note", text: "This guide was put together from the experiences of real Taipei travelers. Fares and payment policies can change, so double-check with a transit app or official source before you go." },
      ],
    },
  },
};
