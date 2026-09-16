// 카테고리별 SEO 페이지(category-*.html) 콘텐츠 — category.html에서 사용.
// 언어별로 ko/en 콘텐츠를 따로 둔다. 지역 콘텐츠(region-content.js)와 동일한 구조.
const CATEGORY_CONTENT = {
  beef_noodle: {
    tagKo: "대만 국민 소울푸드", tagEn: "Taiwan's National Soul Food",
    ko: {
      sub: "얼큰한 홍샤오 육수부터 맑은 칭둔까지, 대만 어디서나 만나는 국물 요리",
      intro: "우육면(牛肉麵)은 대만을 대표하는 국물 요리로, 진한 홍샤오(紅燒) 스타일과 맑은 칭둔(清燉) 스타일 두 갈래로 나뉩니다. 타이베이 융캉제 인근엔 수십 년 된 노포가 몰려있고, 매년 열리는 타이베이 우육면 페스티벌에서 우승한 집들은 항상 웨이팅이 길어요. 국물에 고추기름과 산차이(酸菜)를 더해 자기 입맛대로 조절해 먹는 게 포인트입니다.",
      tips: [
        { title: "홍샤오 vs 칭둔", desc: "홍샤오는 간장·두반장 베이스로 얼큰하고 진하고, 칭둔은 소금과 향신료만으로 우려낸 맑고 깔끔한 맛이에요. 처음이라면 홍샤오부터 시작해보세요." },
        { title: "면발 선택", desc: "가게에 따라 넓은 면(寬麵), 가는 면(細麵), 도삭면(刀削麵) 중 고를 수 있어요. 없으면 기본 면으로 나옵니다." },
        { title: "곁들임 반찬", desc: "테이블에 놓인 산차이(절인 갓)와 고추기름은 셀프로 추가하는 용도예요. 소룡포나 소채(小菜)를 곁들이면 든든해요." },
      ],
      checklist: [
        "국물 색이 진하면 홍샤오, 맑으면 칭둔 — 메뉴판 사진으로 먼저 확인하기",
        "웨이팅 긴 노포는 회전율이 빨라 대부분 20분 안에 착석 가능",
        "고기 부위(근육/힘줄/양지)를 고를 수 있는 곳도 있으니 메뉴 확인",
        "매운 정도는 고추기름을 따로 추가해 직접 조절하기",
      ],
    },
    en: {
      sub: "From rich red-braised broth to clear consommé — Taiwan's everyday noodle soup",
      intro: "Beef noodle soup is Taiwan's signature noodle dish, split into two camps: rich, soy-and-chili-bean-based hongshao and clear, delicate qingdun. Century-old shops cluster near Taipei's Yongkang Street, and winners of the annual Taipei Beef Noodle Festival always draw long lines. Part of the fun is dialing in the bowl yourself with chili oil and pickled mustard greens on the table.",
      tips: [
        { title: "Hongshao vs. Qingdun", desc: "Hongshao is soy-and-bean-paste based — rich and slightly spicy. Qingdun is a clear broth seasoned mainly with salt. First time? Start with hongshao." },
        { title: "Choosing your noodles", desc: "Many shops let you pick wide noodles, thin noodles, or hand-shaved noodles. If you don't specify, you'll get the house default." },
        { title: "Table condiments", desc: "Pickled mustard greens and chili oil on the table are self-serve. Add a side of xiaolongbao or a small dish to round out the meal." },
      ],
      checklist: [
        "Darker broth means hongshao, clear broth means qingdun — check a menu photo before ordering",
        "Even long lines move fast; most shops turn tables within 20 minutes",
        "Some shops let you choose the cut (tendon, shank, brisket) — check the menu",
        "Adjust spice yourself by adding chili oil at the table",
      ],
    },
  },

  noodle: {
    tagKo: "탄쯔면부터 이멘까지", tagEn: "From Danzai to Yi Mein",
    ko: {
      sub: "타이난 탄쯔면, 산둥식 도삭면 등 대만 곳곳의 다양한 면 요리",
      intro: "대만의 '국수'는 우육면과 별개로 훨씬 다양합니다. 타이난의 명물 탄쯔면(擔仔麵)은 새우 육수에 다진 고기 소스를 올린 한입 크기 국수이고, 이멘(意麵)·도삭면(刀削麵)처럼 중국 각지에서 건너온 스타일도 흔해요. 대부분 가격이 저렴해 로컬 식사로 부담 없이 즐기기 좋습니다.",
      tips: [
        { title: "탄쯔면", desc: "타이난 여행 중이라면 꼭 먹어봐야 할 명물. 새우알과 다진 고기 소스가 핵심이에요." },
        { title: "건면 vs 탕면", desc: "국물 없이 비벼먹는 건반면(乾拌麵)과 국물이 있는 탕면 중 선택 가능한 곳이 많아요." },
        { title: "1인 식사에 최적", desc: "대부분 1인분 기준 작은 그릇으로 나와서 여러 메뉴를 조금씩 시켜 먹기 좋아요." },
      ],
      checklist: [
        "메뉴에 '乾' 자가 있으면 국물 없는 비빔면",
        "완탕(餛飩)이나 계란을 추가 토핑으로 넣을 수 있는지 확인",
        "저렴한 로컬 식당일수록 현금 결제만 되는 경우가 많음",
        "매장마다 면 굵기가 달라 취향에 맞는 곳을 여러 번 시도해보기",
      ],
    },
    en: {
      sub: "Tainan's danzai noodles, Shandong-style hand-pulled noodles, and everything in between",
      intro: "Beyond beef noodle soup, Taiwan's noodle scene is far more varied. Tainan's signature danzai mian is a small bowl in shrimp broth topped with minced pork sauce, and styles brought over from mainland China — yi mein, hand-shaved noodles — are common too. Most bowls are cheap, casual, and easy to work into any meal.",
      tips: [
        { title: "Danzai mian", desc: "A Tainan must-try — the shrimp roe and minced pork sauce are what make it distinctive." },
        { title: "Dry vs. soup style", desc: "Many shops let you choose between dry, tossed noodles (乾拌麵) and a soup version." },
        { title: "Great for solo meals", desc: "Portions are usually small, so it's easy to order a couple of different bowls to share with yourself." },
      ],
      checklist: [
        "A '乾' on the menu means dry, tossed noodles with no broth",
        "Ask if wontons or an egg can be added as extra toppings",
        "Cheaper local shops often take cash only",
        "Noodle thickness varies by shop — worth trying a few to find your favorite",
      ],
    },
  },

  japanese: {
    tagKo: "대만인이 사랑하는 일본 맛", tagEn: "Japan, Filtered Through Taiwan",
    ko: {
      sub: "스시·라멘 체인부터 현지화된 일식 다이닝까지",
      intro: "대만은 일본과의 오랜 교류 덕에 일식 문화가 깊게 자리잡았습니다. 회전초밥 체인부터 오마카세, 일본식 카레·돈카츠 전문점까지 선택지가 넓고, 현지 물가 기준으로도 합리적인 편이에요.",
      tips: [
        { title: "가성비 오마카세", desc: "일본보다 저렴한 가격에 오마카세를 즐길 수 있는 곳이 많아 현지인들도 즐겨 찾아요." },
        { title: "체인점 퀄리티", desc: "쿠라스시, 스시로 같은 체인도 재료 신선도가 준수해 실패 확률이 낮습니다." },
        { title: "런치 세트 활용", desc: "저녁보다 점심 세트 메뉴가 훨씬 저렴한 곳이 많으니 시간대를 조율해보세요." },
      ],
      checklist: [
        "인기 오마카세는 최소 며칠 전 예약 필수",
        "런치타임(11:30~14:00) 세트 메뉴 확인",
        "체인 초밥집은 웨이팅 앱/번호표 시스템 사용 여부 확인",
        "가격은 대부분 신타이완달러(NT$) 표기, 세금 별도인지 확인",
      ],
    },
    en: {
      sub: "From sushi and ramen chains to Taiwanese-style Japanese dining",
      intro: "Thanks to close historical and travel ties with Japan, Japanese food culture runs deep in Taiwan. Options range from conveyor-belt sushi chains to omakase counters and katsu/curry specialists, and prices are generally reasonable by local standards.",
      tips: [
        { title: "Affordable omakase", desc: "Many omakase counters are cheaper than in Japan, so locals treat themselves here too." },
        { title: "Chain quality holds up", desc: "Even chains like Kura Sushi and Sushiro maintain decent ingredient freshness, so they're a safe bet." },
        { title: "Lunch sets are the move", desc: "Lunch sets are often far cheaper than dinner — plan your visit around midday if you can." },
      ],
      checklist: [
        "Popular omakase counters need reservations at least a few days ahead",
        "Check lunch-set hours (roughly 11:30am–2pm)",
        "Chain sushi spots may use a queuing app or numbered tickets",
        "Prices are in NT$ — confirm whether tax is included",
      ],
    },
  },

  seafood: {
    tagKo: "섬나라 대만의 자부심", tagEn: "An Island Nation's Pride",
    ko: {
      sub: "야시장 해산물 노점부터 항구 도시의 활어 식당까지",
      intro: "사면이 바다인 대만은 해산물 요리 수준이 매우 높습니다. 가오슝·이란·화롄 같은 항구 도시에서는 그날 잡은 활어를 바로 조리해주는 식당이 많고, 야시장에서는 굴전(蚵仔煎), 새우튀김 같은 캐주얼한 해산물 간식도 인기예요.",
      tips: [
        { title: "시가(時價) 메뉴 주의", desc: "생선·게 요리는 시가로 표기된 경우가 많아 주문 전 가격을 꼭 확인하세요." },
        { title: "굴전(蚵仔煎)", desc: "대만식 굴 오믈렛으로 야시장 필수 메뉴. 새콤달콤한 소스가 특징이에요." },
        { title: "항구 직송 식당", desc: "가오슝 치진, 이란 등 항구 근처 식당은 아침에 들어온 활어로 조리해 신선도가 높아요." },
      ],
      checklist: [
        "'時價'라고 적힌 메뉴는 주문 전 직원에게 가격 재확인",
        "생굴/조개류는 여름철 위생 상태를 특히 신경써서 고르기",
        "게·새우는 무게 단위(斤/兩)로 가격이 매겨지는 경우가 많음",
        "야시장 해산물 노점은 현금 결제 위주",
      ],
    },
    en: {
      sub: "From night-market seafood stalls to fresh-catch restaurants in port towns",
      intro: "Surrounded by sea on all sides, Taiwan takes its seafood seriously. Port towns like Kaohsiung, Yilan, and Hualien have restaurants that cook the day's catch to order, while night markets offer casual bites like oyster omelets and fried shrimp.",
      tips: [
        { title: "Watch for 'market price'", desc: "Fish and crab dishes are often priced at market rate — always confirm the price before ordering." },
        { title: "Oyster omelet (蚵仔煎)", desc: "Taiwan's take on the oyster omelet, finished with a sweet-tangy sauce — a night-market essential." },
        { title: "Straight-from-the-dock spots", desc: "Near ports like Kaohsiung's Cijin or in Yilan, restaurants cook fish landed that same morning." },
      ],
      checklist: [
        "Anything marked '時價' (market price) — ask staff to confirm the cost before ordering",
        "Be extra mindful of hygiene with raw oysters/shellfish in summer",
        "Crab and shrimp are often priced by weight",
        "Night-market seafood stalls mostly take cash only",
      ],
    },
  },

  ramen: {
    tagKo: "일본식 그대로, 혹은 대만식으로", tagEn: "Straight From Japan, or Taiwan's Own Twist",
    ko: {
      sub: "돈코츠부터 마라 라멘까지 다양한 스타일",
      intro: "대만 라멘 시장은 일본 정통 프랜차이즈와 현지 오리지널 브랜드가 공존합니다. 돈코츠, 쇼유 같은 클래식 스타일은 물론 마라(麻辣)를 접목한 대만식 퓨전 라멘도 많아 선택의 폭이 넓어요.",
      tips: [
        { title: "웨이팅 필수 맛집", desc: "인기 라멘집은 오픈 전부터 줄이 길어요. 평일 이른 저녁을 노리세요." },
        { title: "사이드 메뉴", desc: "교자, 차슈 덮밥을 세트로 묶어 파는 곳이 많아 든든하게 즐길 수 있어요." },
        { title: "면 삶기 정도", desc: "일부 매장은 면의 익힘 정도를 선택할 수 있어요." },
      ],
      checklist: [
        "인기 매장은 웨이팅 앱으로 원격 줄서기가 가능한지 확인",
        "국물 종류(돈코츠/쇼유/미소)는 메뉴판 색상으로 구분되는 경우가 많음",
        "점심 세트가 저녁보다 저렴한 경우가 대부분",
        "매운맛 원하면 마라 라멘 전문점 검색",
      ],
    },
    en: {
      sub: "From tonkotsu to mala-spiced fusion bowls",
      intro: "Taiwan's ramen scene mixes authentic Japanese franchises with homegrown brands. Classic tonkotsu and shoyu styles sit alongside Taiwanese fusion bowls that fold in mala spice, so there's plenty of range.",
      tips: [
        { title: "Popular shops mean lines", desc: "Well-known ramen shops queue up before opening — an early weekday dinner is your best bet." },
        { title: "Side dishes", desc: "Gyoza and chashu rice bowls are often sold as sets, making for a heartier meal." },
        { title: "Noodle firmness", desc: "Some shops let you choose how firm you want your noodles cooked." },
      ],
      checklist: [
        "Check if popular shops offer remote queuing via an app",
        "Broth type (tonkotsu/shoyu/miso) is often color-coded on the menu",
        "Lunch sets are usually cheaper than dinner",
        "Looking for spice? Search for mala ramen specialists",
      ],
    },
  },

  hotpot: {
    tagKo: "탕후이의 나라", tagEn: "Hot Pot Heaven",
    ko: {
      sub: "1인 훠궈부터 마라탕 스타일까지, 대만 훠궈 문화 총정리",
      intro: "대만은 1인용 훠궈(개인 냄비) 문화가 특히 발달해 혼자서도 부담 없이 즐길 수 있어요. 마라탕처럼 매운 스타일부터 사골·토마토 베이스의 순한 육수까지 다양하고, 무제한 사이드바를 제공하는 곳도 많습니다.",
      tips: [
        { title: "1인 훠궈", desc: "1인용 미니 냄비로 나오는 곳이 많아 혼밥 여행자에게도 부담 없어요." },
        { title: "육수 반반 선택", desc: "매운맛과 순한맛을 반반으로 나눈 원앙궈(鴛鴦鍋)를 시키면 취향껏 즐길 수 있어요." },
        { title: "무제한 바", desc: "일부 매장은 음료·아이스크림·소스바가 무제한이라 가성비가 좋아요." },
      ],
      checklist: [
        "혼자 여행 중이면 '개인 냄비' 제공 여부 먼저 확인",
        "매운 정도(小辣/中辣/大辣)를 주문 시 미리 정하기",
        "고기 무한리필 매장은 시간제한이 있는 경우가 많음",
        "서비스 차지(10%)가 별도로 붙는 곳이 대부분",
      ],
    },
    en: {
      sub: "From solo hot pot to mala-style spice bombs",
      intro: "Taiwan has perfected the solo hot pot — individual pots make it easy to eat alone without feeling awkward. Broths range from fiery mala to mild bone or tomato bases, and many spots throw in an unlimited drink and topping bar.",
      tips: [
        { title: "Solo hot pot", desc: "Many shops serve single-portion mini pots, making it easy for solo travelers." },
        { title: "Split broth", desc: "Order a yuanyang (split) pot to get spicy and mild broth side by side." },
        { title: "Unlimited bars", desc: "Some places offer unlimited drinks, ice cream, and sauces — great value." },
      ],
      checklist: [
        "Traveling solo? Confirm individual-pot service first",
        "Decide your spice level (mild/medium/hot) when ordering",
        "All-you-can-eat meat is often time-limited",
        "Most places add a 10% service charge",
      ],
    },
  },

  breakfast: {
    tagKo: "대만 아침의 정석", tagEn: "The Taiwanese Morning Ritual",
    ko: {
      sub: "떠우장·판퇀부터 딴빙까지, 로컬처럼 하루를 시작하는 법",
      intro: "대만의 아침식사 문화는 독립적인 산업이라 할 만큼 발달해 있어요. 떠우장(豆漿, 두유), 딴빙(蛋餅, 계란전병), 판퇀(飯糰, 주먹밥) 등을 파는 조식 전문점이 새벽부터 문을 열고, 대부분 포장 위주라 회전이 빠릅니다.",
      tips: [
        { title: "떠우장 온/냉", desc: "두유는 따뜻한 셴또우장(짠맛)과 시원한 단맛 버전 중 고를 수 있어요." },
        { title: "딴빙 커스텀", desc: "계란전병 안에 치즈, 참치, 옥수수 등 토핑을 추가할 수 있는 곳이 많아요." },
        { title: "포장 주문 팁", desc: "현지인들은 대부분 포장해가요. 자리가 협소한 매장이 많으니 참고하세요." },
      ],
      checklist: [
        "영업시간이 대부분 새벽~오전 11시로 짧음",
        "메뉴판에 한자만 있는 경우가 많아 사진으로 미리 확인하고 가면 편함",
        "포장(外帶)과 매장(內用) 구분해서 주문하기",
        "현금 결제 위주인 노포가 많음",
      ],
    },
    en: {
      sub: "Soy milk, rice rolls, and egg pancakes — how locals start the day",
      intro: "Breakfast is practically its own industry in Taiwan. Shops selling soy milk, egg crepes (dan bing), and rice balls (fan tuan) open before dawn, and most business is takeout, so lines move fast.",
      tips: [
        { title: "Hot or cold soy milk", desc: "Choose warm, savory soy milk or the cold, sweet version." },
        { title: "Customize your dan bing", desc: "Many shops let you add cheese, tuna, or corn inside the egg crepe." },
        { title: "It's mostly takeout", desc: "Locals mostly grab and go — seating is often limited." },
      ],
      checklist: [
        "Hours are usually short — dawn to around 11am",
        "Menus are often Chinese-only; a photo lookup beforehand helps",
        "Specify takeout vs. dine-in when ordering",
        "Many old-school shops are cash-only",
      ],
    },
  },

  brunch: {
    tagKo: "여유로운 오전을 위한 한 끼", tagEn: "A Slower Kind of Morning",
    ko: {
      sub: "감성 카페형 브런치 레스토랑이 몰린 골목들",
      intro: "타이베이 다안(大安)·중산(中山) 구역을 중심으로 서구식 브런치 카페가 크게 늘었습니다. 팬케이크, 에그 베네딕트 같은 메뉴에 대만 감성의 인테리어를 더한 곳이 많아 사진 찍기도 좋고, 주말엔 웨이팅이 긴 편이에요.",
      tips: [
        { title: "주말 웨이팅", desc: "인기 브런치 카페는 주말 오전 웨이팅이 1시간 넘는 경우도 흔해요. 평일 방문을 추천해요." },
        { title: "세트 메뉴", desc: "커피/주스가 포함된 세트가 단품보다 저렴한 경우가 많아요." },
        { title: "노트북 이용 매너", desc: "브런치 타임엔 회전을 위해 장시간 작업은 자제하는 게 매너예요." },
      ],
      checklist: [
        "인기 매장은 웨이팅 앱으로 원격 대기 가능 여부 확인",
        "브런치 타임은 대체로 오전 9시~오후 2~3시로 한정",
        "1인 방문 가능 여부는 미리 확인(2인 이상 테이블만 받는 곳도 있음)",
        "사진 찍을 땐 다른 손님 배려하기",
      ],
    },
    en: {
      sub: "The alley cafés where Taiwan's brunch scene thrives",
      intro: "Western-style brunch cafés have boomed around Taipei's Da'an and Zhongshan districts. Pancakes and eggs Benedict get a Taiwan-cool interior treatment, which makes for good photos — and long weekend lines.",
      tips: [
        { title: "Weekend waits", desc: "Popular brunch spots can have hour-plus waits on weekend mornings — try a weekday instead." },
        { title: "Set menus", desc: "A set with coffee or juice is often cheaper than ordering à la carte." },
        { title: "Laptop etiquette", desc: "Long work sessions during brunch hours can slow down table turnover — best to avoid it." },
      ],
      checklist: [
        "Check whether popular spots support remote queuing via an app",
        "Brunch hours typically run 9am–2/3pm",
        "Confirm solo seating is allowed (some tables are 2-person minimum)",
        "Be considerate of other guests when taking photos",
      ],
    },
  },

  cafe: {
    tagKo: "카페 투어의 성지, 타이중", tagEn: "Taichung, the Café-Hopping Capital",
    ko: {
      sub: "스페셜티 커피부터 감성 인테리어 카페까지",
      intro: "대만, 특히 타이중은 카페 밀도가 높기로 유명합니다. 스페셜티 원두를 다루는 로스터리형 카페부터 오래된 건물을 개조한 인테리어 맛집까지 스타일이 다양하고, 대부분 좌석 회전에 여유가 있어 오래 머물기 좋아요.",
      tips: [
        { title: "타이중 카페 투어", desc: "타이중 시먼루·이중가 인근에 감성 카페가 밀집해 있어요." },
        { title: "1인 1메뉴 룰", desc: "많은 카페가 좌석당 최소 1인 1음료 주문을 요구합니다." },
        { title: "콘센트/와이파이", desc: "노트북 작업하기 좋은 카페는 대부분 콘센트와 와이파이를 안내판에 표시해둬요." },
      ],
      checklist: [
        "인기 카페는 오후 시간대(2~5시)가 가장 붐빔",
        "좌석 이용시간 제한(2시간 등)이 있는지 입구 안내문 확인",
        "1인 1메뉴 주문 룰 여부 확인",
        "사진 촬영 시 다른 손님 자리 침범하지 않기",
      ],
    },
    en: {
      sub: "From specialty coffee bars to design-forward cafés",
      intro: "Taiwan — Taichung especially — is famous for its café density. Options range from specialty-bean roasteries to converted heritage buildings, and most places let you linger without pressure to rush.",
      tips: [
        { title: "Taichung café-hopping", desc: "Cafés cluster around Taichung's Ximen Road and Yizhong Street." },
        { title: "One drink per seat", desc: "Many cafés require at least one drink order per person seated." },
        { title: "Outlets and wifi", desc: "Laptop-friendly cafés usually post outlet and wifi availability at the entrance." },
      ],
      checklist: [
        "Popular cafés get busiest in the afternoon (2–5pm)",
        "Check the entrance for seating time limits (often 2 hours)",
        "Confirm the one-drink-per-person policy",
        "Be mindful of other guests' space when taking photos",
      ],
    },
  },

  shaved_ice: {
    tagKo: "더위를 씻어주는 대만 국민 디저트", tagEn: "Taiwan's Answer to Summer Heat",
    ko: {
      sub: "망고빙수부터 전통 팔보빙까지",
      intro: "대만 빙수는 얼음을 눈처럼 곱게 갈아 그 위에 망고, 땅콩, 타로 등을 올리는 것이 특징입니다. 여름철엔 망고빙수 전문점 앞에 줄이 길게 늘어서고, 전통 시장에는 옛날 방식 그대로의 팔보빙(八寶冰)을 파는 노포도 남아 있어요.",
      tips: [
        { title: "제철 망고빙수", desc: "5~9월 망고 제철엔 대부분의 빙수 전문점이 망고빙수를 메인으로 내세워요." },
        { title: "토핑 커스텀", desc: "타로볼, 연유, 아이스크림 등 토핑을 추가로 선택할 수 있는 곳이 많아요." },
        { title: "2인 이상 셰어 추천", desc: "양이 생각보다 많아서 2~3인이 하나를 나눠 먹기 좋아요." },
      ],
      checklist: [
        "망고빙수는 5~9월 제철 시즌에 맛과 가격이 가장 좋음",
        "인기 매장은 오픈런/웨이팅이 필요할 수 있음",
        "얼음이 빨리 녹으니 사진은 서둘러 찍기",
        "일부 매장은 카드 결제 불가, 현금 준비",
      ],
    },
    en: {
      sub: "From mango shaved ice to the traditional eight-treasure bowl",
      intro: "Taiwanese shaved ice is shaved snow-fine, then piled with toppings like mango, peanuts, or taro. In summer, mango shaved ice shops draw long lines, while traditional markets still have old-school stalls serving the classic eight-treasure bowl.",
      tips: [
        { title: "Mango season", desc: "During mango season (May–September), most shaved-ice shops make it their headline item." },
        { title: "Custom toppings", desc: "Many shops let you add taro balls, condensed milk, or ice cream." },
        { title: "Share with a friend", desc: "Portions are bigger than expected — great for splitting between 2–3 people." },
      ],
      checklist: [
        "Mango shaved ice is best (and cheapest) in season, May–September",
        "Popular shops may require an early visit or a wait",
        "Ice melts fast — take your photos quickly",
        "Some shops are cash-only",
      ],
    },
  },

  korean: {
    tagKo: "타지에서 만나는 고향의 맛", tagEn: "A Taste of Home, Abroad",
    ko: {
      sub: "여행 중 한식이 그리울 때 찾는 현지 한식당",
      intro: "대만 각 대도시엔 한국 교민이나 유학생을 대상으로 한 한식당이 자리잡고 있습니다. 삼겹살, 부대찌개 같은 대중적인 메뉴부터 분식점 스타일 매장까지 있어 장기 여행 중 한식이 생각날 때 찾기 좋아요.",
      tips: [
        { title: "교민 밀집 지역", desc: "타이베이 중산·티엔무 지역에 한식당이 비교적 많이 모여 있어요." },
        { title: "한국 맛 기대치", desc: "현지화된 곳도 있으니 리뷰에서 '한국인 입맛에 가까운지' 확인하고 가는 게 좋아요." },
        { title: "포장 반찬 판매", desc: "일부 한식당은 김치, 밑반찬을 포장 판매해 숙소에서 먹기도 좋아요." },
      ],
      checklist: [
        "리뷰에 '한국인 사장/한국인 입맛'이 언급된 곳이 대체로 만족도 높음",
        "가격대는 현지 식당보다 다소 높은 편",
        "예약 없이 방문 가능한 곳이 대부분이나 주말 저녁은 붐빌 수 있음",
        "한국 소주/맥주 판매 여부는 매장마다 다름",
      ],
    },
    en: {
      sub: "For when a Taiwan trip calls for a bowl of Korean comfort food",
      intro: "Every major Taiwanese city has Korean restaurants catering to the local Korean community and students. From samgyeopsal to budae-jjigae to snack-bar style spots, they're a reliable fix when you're missing Korean food on a longer trip.",
      tips: [
        { title: "Where Koreans gather", desc: "Taipei's Zhongshan and Tianmu areas have a relatively high concentration of Korean restaurants." },
        { title: "Set expectations", desc: "Some spots are localized — check reviews for how close the flavors are to home." },
        { title: "Takeout side dishes", desc: "Some Korean restaurants sell kimchi and banchan to go, handy for eating back at your accommodation." },
      ],
      checklist: [
        "Reviews mentioning a 'Korean owner' or 'authentic Korean taste' tend to rate higher",
        "Prices run a bit higher than local Taiwanese restaurants",
        "Most don't require reservations, but weekend evenings can get busy",
        "Availability of Korean soju/beer varies by restaurant",
      ],
    },
  },

  pasta: {
    tagKo: "대만식으로 재해석된 이탈리안", tagEn: "Italian, Reimagined the Taiwanese Way",
    ko: {
      sub: "캐주얼 파스타 맛집부터 정통 이탈리안까지",
      intro: "대만의 파스타 식당은 크게 두 갈래입니다. 학생·직장인을 겨냥한 저렴한 캐주얼 파스타 전문점, 그리고 정통 이탈리안을 표방하는 파인다이닝. 캐주얼 매장은 세트로 수프·음료가 포함돼 가성비가 좋은 편이에요.",
      tips: [
        { title: "런치 세트", desc: "평일 점심엔 파스타+수프+음료 세트가 저렴하게 제공되는 곳이 많아요." },
        { title: "매운맛 파스타", desc: "대만식으로 변형된 마라·고추 파스타도 흔하니 매운 음식 좋아하면 시도해보세요." },
        { title: "예약 필요 여부", desc: "정통 이탈리안 파인다이닝은 주말 예약이 필수인 경우가 많아요." },
      ],
      checklist: [
        "런치 타임(11:30~14:00) 세트 메뉴 여부 확인",
        "캐주얼 매장은 웨이팅 없이 바로 착석 가능한 경우가 많음",
        "파인다이닝은 최소 1~2일 전 예약 권장",
        "1인분 양이 한국보다 적은 경우가 있어 사이드 추가 고려",
      ],
    },
    en: {
      sub: "From casual pasta joints to authentic Italian dining",
      intro: "Taiwan's pasta scene splits into two: cheap, casual spots aimed at students and office workers, and fine dining that goes for authentic Italian. Casual sets usually bundle in soup and a drink for good value.",
      tips: [
        { title: "Lunch sets", desc: "Weekday lunch sets — pasta, soup, and a drink — are often a bargain." },
        { title: "Spicy pasta", desc: "Taiwan-style mala or chili pasta is common — worth a try if you like heat." },
        { title: "Reservations", desc: "Authentic Italian fine dining often requires a weekend reservation." },
      ],
      checklist: [
        "Check for lunch-set hours (roughly 11:30am–2pm)",
        "Casual spots often seat you without a wait",
        "Book fine dining at least 1–2 days ahead",
        "Portions can run smaller than expected — consider a side dish",
      ],
    },
  },

  bbq: {
    tagKo: "구워 먹는 즐거움", tagEn: "The Joy of Grilling",
    ko: {
      sub: "대만식 숯불구이와 한국식 무한리필 고깃집",
      intro: "대만의 BBQ는 크게 대만/일본식 숯불구이와 한국식 무한리필 고깃집으로 나뉩니다. 특히 무한리필(吃到飽) BBQ는 여럿이 함께 방문하기 좋아 인기가 높고, 시간제 예약제로 운영되는 곳이 많아요.",
      tips: [
        { title: "무한리필 시간제", desc: "吃到飽(츠따오빠오) 매장은 보통 90~120분 시간제로 운영돼요." },
        { title: "1인 그릴 시스템", desc: "혼자서도 즐길 수 있는 개인용 화로 좌석을 갖춘 곳도 많아요." },
        { title: "사이드바 활용", desc: "음료·디저트바가 무제한인 경우가 많아 충분히 활용하세요." },
      ],
      checklist: [
        "무한리필 매장은 인원수만큼 필수 주문, 예약 권장",
        "시간 초과 시 추가 요금이 부과될 수 있음",
        "1인 방문 가능 좌석(개인 화로)이 있는지 사전 확인",
        "남은 음식은 대부분 포장 불가(잔반 페널티가 있는 곳도 있음)",
      ],
    },
    en: {
      sub: "Charcoal grills and all-you-can-eat Korean-style BBQ",
      intro: "BBQ in Taiwan splits into Taiwanese/Japanese-style charcoal grilling and Korean-style all-you-can-eat spots. The buffet-style places (吃到飽) are especially popular for group outings and usually run on timed seatings.",
      tips: [
        { title: "Timed all-you-can-eat", desc: "Buffet BBQ seatings usually run 90–120 minutes." },
        { title: "Solo-friendly grills", desc: "Many spots have individual grill seating, so solo diners aren't left out." },
        { title: "Use the side bar", desc: "Unlimited drink and dessert bars are common — make the most of them." },
      ],
      checklist: [
        "Buffet spots require one order per person and reservations are recommended",
        "Going over the time limit may incur extra charges",
        "Check ahead for solo-friendly individual-grill seating",
        "Leftover food usually can't be boxed up — some places even charge a food-waste fee",
      ],
    },
  },

  steak: {
    tagKo: "가성비 스테이크의 나라", tagEn: "Where Steak Doesn't Break the Bank",
    ko: {
      sub: "저렴한 철판 스테이크부터 고급 다이닝까지",
      intro: "대만은 저렴한 철판 스테이크(平價牛排) 문화가 발달해, 수프·샐러드바·아이스크림까지 포함된 세트를 부담 없는 가격에 즐길 수 있는 곳이 많습니다. 물론 고급 스테이크하우스도 별도로 잘 발달해 있어요.",
      tips: [
        { title: "저가 철판 스테이크", desc: "저가 체인 철판 스테이크는 샐러드바·수프·음료가 무제한인 경우가 많아 가성비가 좋아요." },
        { title: "굽기 정도", desc: "웰던 위주 문화라 미디엄레어를 원하면 주문 시 명확히 말해야 해요." },
        { title: "철판 화상 주의", desc: "뜨거운 철판 위에 바로 나오니 소스가 튈 수 있어 옷차림에 유의하세요." },
      ],
      checklist: [
        "저가 체인은 세트 메뉴(수프+샐러드바+메인)로 주문하는 게 이득",
        "굽기 정도는 명확한 단어로 정확히 요청하기",
        "고급 스테이크하우스는 주말 예약 필수",
        "철판 요리는 뜨거우니 아이 동반 시 주의",
      ],
    },
    en: {
      sub: "From cheap cast-iron steaks to upscale steakhouses",
      intro: "Taiwan has a whole culture built around cheap sizzling-plate steak, with sets that include soup, a salad bar, and even ice cream for a very reasonable price. Upscale steakhouses are well established too, for when you want to spend more.",
      tips: [
        { title: "Budget sizzling steak", desc: "Cheap chain steak sets often include an unlimited salad bar, soup, and drinks — great value." },
        { title: "Doneness", desc: "The default leans well-done, so be explicit if you want medium-rare." },
        { title: "Watch the hot plate", desc: "Steaks arrive sizzling on a hot plate — sauce can splash, so dress accordingly." },
      ],
      checklist: [
        "Budget chains are best ordered as a full set (soup + salad bar + main)",
        "Be specific and clear about your preferred doneness",
        "Upscale steakhouses need weekend reservations",
        "Watch young kids around the hot sizzling plate",
      ],
    },
  },

  dimsum: {
    tagKo: "한입 크기의 정성", tagEn: "Bite-Sized Craftsmanship",
    ko: {
      sub: "소룡포부터 다양한 만두·튀김 요리까지",
      intro: "대만은 딘타이펑으로 대표되는 소룡포(小籠包) 문화가 세계적으로 알려져 있지만, 그 외에도 하가우·샤오마이 등 광둥식 딤섬 전문점도 곳곳에 있습니다. 여러 종류를 조금씩 시켜 나눠 먹는 게 기본 문화예요.",
      tips: [
        { title: "소룡포 먹는 법", desc: "젓가락으로 조심히 들어 숟가락에 올린 뒤, 피를 살짝 터뜨려 육즙을 식히고 먹으면 좋아요." },
        { title: "체크 시트 주문", desc: "많은 딤섬 전문점은 체크 시트에 수량을 적어 주문하는 방식이에요." },
        { title: "여럿이 나눠먹기", desc: "1인당 1~2종류씩 골라 다양하게 시키는 게 딤섬을 제대로 즐기는 방법이에요." },
      ],
      checklist: [
        "딘타이펑 인기 지점은 웨이팅 앱으로 미리 줄서기 가능",
        "소룡포는 나오자마자 뜨거우니 화상 주의",
        "체크 시트 방식 매장은 한자 메뉴명을 사진으로 미리 확인",
        "브런치~점심 시간대가 가장 붐빔",
      ],
    },
    en: {
      sub: "From soup dumplings to a full spread of steamed and fried bites",
      intro: "Taiwan's xiaolongbao culture — led by Din Tai Fung — is world-famous, but Cantonese-style dim sum spots serving har gow and siu mai are common too. The custom is to order several small dishes and share.",
      tips: [
        { title: "How to eat xiaolongbao", desc: "Lift it gently onto a spoon, nick the skin to let the soup cool slightly, then eat." },
        { title: "Checklist ordering", desc: "Many dim sum spots use a paper checklist where you mark quantities yourself." },
        { title: "Order to share", desc: "Pick 1–2 items per person for a proper spread — that's how dim sum is meant to be eaten." },
      ],
      checklist: [
        "Popular Din Tai Fung branches allow remote queuing via an app",
        "Xiaolongbao come out piping hot — be careful of burns",
        "For checklist-order shops, look up the Chinese menu names beforehand",
        "Brunch through lunch is the busiest window",
      ],
    },
  },

  goose: {
    tagKo: "대만 남부의 자부심", tagEn: "A Point of Pride in Southern Taiwan",
    ko: {
      sub: "이란·타이베이의 명물, 훈제 거위 요리",
      intro: "거위 요리는 이란(宜蘭) 지역의 명물로 특히 유명하며, 타이베이에도 유명 노포들이 있습니다. 훈제향이 밴 쫄깃한 거위고기를 부추 소스에 찍어 먹는 것이 정석이고, 거위 국수·거위죽 같은 세트 메뉴로도 즐길 수 있어요.",
      tips: [
        { title: "훈제거위 정석", desc: "얇게 썬 훈제 거위고기를 부추(韭菜) 소스에 찍어 먹는 게 기본이에요." },
        { title: "거위 국수 세트", desc: "거위고기 몇 조각과 국수를 함께 내는 세트 메뉴가 가성비 좋아요." },
        { title: "이란 원조 맛집", desc: "이란 뤄동 야시장 인근에 원조로 알려진 노포들이 모여 있어요." },
      ],
      checklist: [
        "유명 노포는 점심시간 전후로 재료 소진되는 경우가 있어 이른 방문 추천",
        "부추 소스는 짠 편이니 소량씩 찍어 먹기",
        "포장 판매(진공포장 거위고기)하는 곳도 있어 선물용으로도 인기",
        "이란 지역 여행 시 우선순위로 고려",
      ],
    },
    en: {
      sub: "Smoked goose, a specialty from Yilan and beyond",
      intro: "Goose is a specialty of Yilan and has a following in Taipei too. The classic way to eat it is thin-sliced smoked goose dipped in a chive sauce, often served as a set with goose noodles or congee.",
      tips: [
        { title: "The classic bite", desc: "Thin-sliced smoked goose dipped in chive sauce is the standard way to eat it." },
        { title: "Goose noodle sets", desc: "A set of a few goose slices with noodles is good value." },
        { title: "The Yilan originals", desc: "Long-running shops considered the originals cluster near Yilan's Luodong Night Market." },
      ],
      checklist: [
        "Famous shops can sell out around lunchtime — go early",
        "The chive dipping sauce is salty, so use it sparingly",
        "Vacuum-packed goose is sold for takeaway — a good souvenir",
        "Worth prioritizing if you're visiting the Yilan area",
      ],
    },
  },

  street_food: {
    tagKo: "야시장의 심장", tagEn: "The Heart of the Night Market",
    ko: {
      sub: "대만 여행의 재미, 길거리 음식 탐방",
      intro: "대만 여행의 하이라이트는 단연 야시장 노점 음식입니다. 지파이(雞排, 대형 치킨커틀릿), 총유빙(蔥油餅), 꼬치 완자 등 저렴하고 다양한 간식을 걸어다니며 조금씩 맛볼 수 있어요.",
      tips: [
        { title: "여러 곳 조금씩", desc: "한 노점에서 배부르게 먹기보다 여러 노점을 돌며 조금씩 맛보는 게 야시장을 즐기는 법이에요." },
        { title: "줄 선 노점 우선", desc: "현지인들이 줄 서 있는 노점은 대부분 맛이 검증된 곳이에요." },
        { title: "현금 필수", desc: "노점 대부분 현금만 받으니 소액권을 미리 준비하세요." },
      ],
      checklist: [
        "저녁 6시~10시가 노점 대부분이 가장 활발한 시간대",
        "위생이 걱정되면 즉석에서 조리하는 노점 위주로 선택",
        "소액권(NT$100 이하) 미리 준비",
        "포장(打包)도 대부분 가능하니 숙소에서 먹어도 좋음",
      ],
    },
    en: {
      sub: "The real fun of a Taiwan trip — hunting down street food",
      intro: "Night-market street food is the highlight of any Taiwan trip. Giant fried chicken cutlets, scallion pancakes, and skewered meatballs are all cheap enough to graze from stall to stall.",
      tips: [
        { title: "A little at each stall", desc: "The best way to enjoy a night market is grazing across several stalls, not filling up at one." },
        { title: "Follow the local line", desc: "A stall with locals queuing is usually a good sign." },
        { title: "Bring cash", desc: "Most stalls are cash-only — carry small bills." },
      ],
      checklist: [
        "6pm–10pm is when most night markets are liveliest",
        "If hygiene is a concern, favor stalls that cook to order",
        "Carry small bills (under NT$100)",
        "Most stalls will pack food to go if you'd rather eat back at your room",
      ],
    },
  },

  mart: {
    tagKo: "여행자의 숨은 보물창고", tagEn: "A Traveler's Hidden Treasure Trove",
    ko: {
      sub: "편의점 간식부터 현지 슈퍼마켓 특산품까지",
      intro: "대만 여행에서 마트·편의점 탐방은 그 자체로 즐거움입니다. 세븐일레븐·패밀리마트 같은 편의점은 밀도가 세계 최고 수준이라 어디서든 간편식과 음료를 구할 수 있고, 대형마트에서는 펑리수, 차 등 특산품을 저렴하게 구입할 수 있어요.",
      tips: [
        { title: "편의점 즉석 간식", desc: "많은 편의점이 즉석 조리 도시락과 오뎅을 잘 갖춰두고 있어요." },
        { title: "대형마트 특산품", desc: "대형마트는 공항 면세점보다 저렴하게 펑리수·차 등을 살 수 있어요." },
        { title: "전자결제 활용", desc: "이지카드(悠遊卡)를 편의점 결제에도 쓸 수 있어 잔돈 걱정이 없어요." },
      ],
      checklist: [
        "선물용 특산품은 마트가 관광지 상점보다 저렴한 경우가 많음",
        "이지카드로 편의점 결제 가능 여부 확인",
        "대형마트는 대부분 오후 10시~11시까지 영업",
        "면세 규정에 걸리는 품목(액체류 등)은 기내 반입 제한 확인",
      ],
    },
    en: {
      sub: "From convenience-store snacks to local supermarket specialties",
      intro: "Browsing marts and convenience stores is a small joy of traveling in Taiwan. 7-Eleven and FamilyMart are everywhere, always stocked with easy meals and drinks, while big supermarkets sell souvenirs like pineapple cake and tea for less than the airport.",
      tips: [
        { title: "Ready-to-eat counters", desc: "Many convenience stores have solid hot-food counters — bento boxes, oden, and more." },
        { title: "Souvenirs at supermarkets", desc: "Big supermarkets sell pineapple cake and tea cheaper than duty-free at the airport." },
        { title: "Use your EasyCard", desc: "Your EasyCard (悠遊卡) works at convenience stores too, so you don't need exact change." },
      ],
      checklist: [
        "Souvenirs are often cheaper at supermarkets than tourist-area shops",
        "Confirm EasyCard is accepted for convenience-store payment",
        "Big supermarkets are typically open until 10–11pm",
        "Check carry-on restrictions for liquids and other regulated items",
      ],
    },
  },

  fruit: {
    tagKo: "아열대 섬나라의 축복", tagEn: "A Subtropical Island's Blessing",
    ko: {
      sub: "망고, 리치, 롄우까지 사계절 신선한 과일",
      intro: "아열대 기후의 대만은 계절마다 특산 과일이 달라 사시사철 신선한 과일을 즐길 수 있습니다. 여름엔 망고와 리치, 겨울엔 롄우(蓮霧)와 귤류가 제철이고, 노점이나 과일가게에서 즉석으로 잘라 파는 컵과일도 인기예요.",
      tips: [
        { title: "계절 과일 확인", desc: "5~8월은 망고·리치, 11~2월은 롄우·귤류가 제철이에요." },
        { title: "컵과일", desc: "노점에서 즉석으로 깎아 컵에 담아주는 과일은 저렴하고 간편한 간식이에요." },
        { title: "과일 시장 방문", desc: "전통 과일시장을 방문하면 현지 가격을 체감할 수 있어요." },
      ],
      checklist: [
        "제철 과일이 가장 저렴하고 맛있음 — 여행 시기에 맞는 과일 미리 확인",
        "컵과일은 냉장 보관 상태가 좋은 노점 위주로 선택",
        "숙소에 반입 시 껍질 처리가 편한 과일(바나나, 귤 등) 추천",
        "국내 반입 제한 과일(생과일)은 출국 전 세관 규정 확인",
      ],
    },
    en: {
      sub: "Mango, lychee, wax apple — fresh fruit all year round",
      intro: "Taiwan's subtropical climate means a different fruit is in season nearly every month. Summer brings mango and lychee, winter brings wax apple and citrus, and street stalls sell pre-cut fruit cups that make for an easy snack.",
      tips: [
        { title: "Check what's in season", desc: "May–August is mango and lychee season; November–February is wax apple and citrus." },
        { title: "Fruit cups", desc: "Stalls that cut fruit to order into cups are a cheap, convenient snack." },
        { title: "Visit a fruit market", desc: "A traditional fruit market shows you real local prices." },
      ],
      checklist: [
        "In-season fruit is cheapest and best — check what's in season for your trip dates",
        "Choose fruit-cup stalls that keep their stock properly chilled",
        "Easy-peel fruit (bananas, tangerines) travels best back to your room",
        "Check your home country's customs rules before bringing fresh fruit back",
      ],
    },
  },

  thai: {
    tagKo: "동남아 미식의 교차로", tagEn: "A Crossroads of Southeast Asian Flavor",
    ko: {
      sub: "새콤달콤 매콤한 태국 요리 전문점",
      intro: "대만에는 동남아 이주노동자·교민 커뮤니티를 중심으로 태국 음식점이 잘 발달해 있습니다. 똠얌꿍, 팟타이 같은 대중적인 메뉴부터 현지인도 즐겨 찾는 로컬 맛집까지 다양하게 만날 수 있어요.",
      tips: [
        { title: "매운맛 조절", desc: "대만식으로 순화된 곳도 있으니 매운맛을 원하면 '태국 현지 맛'으로 요청해보세요." },
        { title: "런치 세트", desc: "평일 점심엔 볶음밥/팟타이 세트가 저렴하게 나오는 곳이 많아요." },
        { title: "커뮤니티 맛집", desc: "이주노동자 밀집 지역의 식당이 더 현지 맛에 가까운 경우가 많아요." },
      ],
      checklist: [
        "매운 정도는 주문 시 미리 조율하기",
        "런치 세트 시간대(11:30~14:00) 활용",
        "고수(香菜) 호불호는 미리 빼달라고 요청 가능",
        "커뮤니티 밀집 지역 맛집은 현금 결제 위주",
      ],
    },
    en: {
      sub: "Sour, sweet, and spicy — Taiwan's Thai food scene",
      intro: "Thanks to a sizable Southeast Asian migrant community, Thai food is well established in Taiwan. Options range from crowd-pleasers like tom yum and pad thai to community favorites with more authentic flavor.",
      tips: [
        { title: "Adjust the spice", desc: "Some places tone it down for local tastes — ask for it 'Thai spicy' if you want the real heat." },
        { title: "Lunch sets", desc: "Weekday lunch sets (fried rice, pad thai) are often good value." },
        { title: "Community favorites", desc: "Restaurants in migrant-worker hubs tend to serve more authentic flavors." },
      ],
      checklist: [
        "Settle on your spice level when ordering",
        "Take advantage of lunch-set hours (roughly 11:30am–2pm)",
        "You can ask for cilantro (香菜) to be left out",
        "Community-area restaurants tend to be cash-only",
      ],
    },
  },

  vietnamese: {
    tagKo: "쌀국수의 부드러운 위로", tagEn: "The Gentle Comfort of Pho",
    ko: {
      sub: "포·반미부터 로컬 베트남 식당까지",
      intro: "대만은 베트남 이주민·결혼이민 커뮤니티가 커서 현지화되지 않은 정통 베트남 음식점을 쉽게 찾을 수 있습니다. 쌀국수(포)와 반미가 대표적이며, 가격도 대체로 합리적이에요.",
      tips: [
        { title: "포 고르기", desc: "소고기 국물과 닭고기 국물 중 선택 가능한 곳이 많아요." },
        { title: "반미 커스텀", desc: "고수·오이 등 토핑을 빼고 넣는 걸 요청할 수 있어요." },
        { title: "정통 맛집 찾기", desc: "베트남 이주민이 운영하는 작은 식당이 오히려 더 현지 맛에 가까운 경우가 많아요." },
      ],
      checklist: [
        "고수(香菜) 알레르기/호불호 있으면 미리 빼달라고 요청",
        "국물 종류(소고기/닭고기)는 주문 시 선택",
        "반미는 포장해서 이동 중 먹기도 좋음",
        "소규모 로컬 맛집은 현금 결제 위주",
      ],
    },
    en: {
      sub: "Pho, banh mi, and local Vietnamese eateries",
      intro: "A large Vietnamese immigrant community means Taiwan has plenty of authentic, non-localized Vietnamese restaurants. Pho and banh mi are the standouts, and prices are generally reasonable.",
      tips: [
        { title: "Choosing your pho", desc: "Many shops let you choose between beef broth and chicken broth." },
        { title: "Customize your banh mi", desc: "You can ask to leave out or add toppings like cilantro or cucumber." },
        { title: "Finding the real deal", desc: "Small shops run by Vietnamese immigrants often serve the most authentic flavors." },
      ],
      checklist: [
        "Ask to leave out cilantro if it's not for you",
        "Choose your broth (beef/chicken) when ordering",
        "Banh mi travels well if you want to eat on the go",
        "Small local shops tend to be cash-only",
      ],
    },
  },

  indian: {
    tagKo: "향신료 가득한 별미", tagEn: "A Spice-Forward Escape",
    ko: {
      sub: "커리·탄두리부터 채식 옵션까지",
      intro: "대만 대도시엔 인도·네팔계 이주민이 운영하는 인도 음식점이 자리잡고 있어, 커리와 탄두리 치킨, 난 등을 어렵지 않게 즐길 수 있습니다. 채식 메뉴가 잘 갖춰져 있어 비건 여행자에게도 좋은 선택지예요.",
      tips: [
        { title: "채식 옵션 풍부", desc: "인도 음식점은 대부분 베지테리언 메뉴가 별도로 구분되어 있어 채식 여행자에게 유용해요." },
        { title: "매운맛 단계", desc: "매운 정도를 단계별로 선택할 수 있는 곳이 많아요." },
        { title: "런치 뷔페", desc: "일부 매장은 평일 점심 뷔페를 운영해 다양한 커리를 한 번에 맛볼 수 있어요." },
      ],
      checklist: [
        "채식 여행자는 메뉴판의 '素食/Veg' 표시 확인",
        "매운맛 단계는 주문 시 명확히 요청",
        "난·라이스 중 주식 선택 가능 여부 확인",
        "런치 뷔페 운영 요일/시간 미리 확인",
      ],
    },
    en: {
      sub: "Curry, tandoor, and reliable vegetarian options",
      intro: "Indian and Nepali immigrant-run restaurants are established in Taiwan's major cities, making curry, tandoori chicken, and naan easy to find. Vegetarian menus are usually well developed, a plus for plant-based travelers.",
      tips: [
        { title: "Solid vegetarian options", desc: "Most Indian restaurants have a clearly marked vegetarian section — useful for veg travelers." },
        { title: "Spice levels", desc: "Many places let you pick a spice level on a scale." },
        { title: "Lunch buffets", desc: "Some spots run a weekday lunch buffet, a good way to sample several curries at once." },
      ],
      checklist: [
        "Vegetarians should look for '素食/Veg' labels on the menu",
        "Be clear about your spice level when ordering",
        "Check whether naan or rice is included, or an extra",
        "Confirm lunch buffet days/hours ahead of time",
      ],
    },
  },

  taiwanese: {
    tagKo: "대만 가정식의 정수", tagEn: "The Essence of Taiwanese Home Cooking",
    ko: {
      sub: "루러우판부터 반찬 뷔페까지, 진짜 대만의 맛",
      intro: "루러우판(滷肉飯), 삼배계(三杯雞), 오아미센(蚵仔麵線) 등 대만 가정식은 저렴하면서도 대만 미식의 정수를 보여줍니다. 반찬을 골라 담는 쯔주찬(自助餐) 스타일 식당도 흔해 한 끼를 알차게 채울 수 있어요.",
      tips: [
        { title: "쯔주찬 이용법", desc: "반찬을 직접 골라 담고 무게나 개수로 계산하는 방식이니 원하는 만큼만 담으세요." },
        { title: "루러우판 필수", desc: "간장에 조린 다진 돼지고기를 밥에 얹은 루러우판은 대만식의 기본이자 필수 메뉴예요." },
        { title: "노포 위주 탐방", desc: "대만식은 화려한 인테리어보다 몇십 년 된 허름한 노포가 더 맛있는 경우가 많아요." },
      ],
      checklist: [
        "쯔주찬은 반찬 담기 전 가격 계산 방식(무게/개당) 확인",
        "루러우판은 곱빼기 옵션이 있는지 확인",
        "오래된 노포는 카드 결제가 안 되는 경우가 많아 현금 준비",
        "현지인처럼 국 하나 곁들여 먹으면 더 든든함",
      ],
    },
    en: {
      sub: "From braised pork rice to self-serve side-dish counters — the real taste of Taiwan",
      intro: "Braised pork rice (lu rou fan), three-cup chicken, and oyster vermicelli show off the essence of Taiwanese cooking at low prices. Self-serve side-dish counters (zizhucan) are common too, letting you build a full meal quickly.",
      tips: [
        { title: "Using a zizhucan counter", desc: "You pick your own sides and pay by weight or count — take only what you'll eat." },
        { title: "Don't skip lu rou fan", desc: "Minced pork braised in soy sauce over rice is the foundational, must-try Taiwanese dish." },
        { title: "Look for the old shops", desc: "A plain, decades-old shop often beats a fancier one for authentic flavor." },
      ],
      checklist: [
        "Confirm the pricing method (by weight or by item) before loading your tray at a zizhucan counter",
        "Ask if a large portion (大碗) of lu rou fan is available",
        "Old-school shops often don't take cards — bring cash",
        "Add a bowl of soup for a more complete, local-style meal",
      ],
    },
  },

  pizza: {
    tagKo: "대만식으로 재해석된 한 조각", tagEn: "A Slice, Taiwan-Style",
    ko: {
      sub: "화덕 피자 전문점부터 대만식 토핑 피자까지",
      intro: "대만의 피자 씬은 정통 나폴리식 화덕 피자 전문점과, 현지 입맛에 맞춘 독특한 토핑(고구마무스, 감자 등)의 캐주얼 피자 체인으로 나뉩니다. 배달 문화가 발달해 있어 숙소에서 편하게 즐기기도 좋아요.",
      tips: [
        { title: "화덕 피자 맛집", desc: "타이베이 시내엔 정통 나폴리 스타일을 표방하는 화덕 피자 전문점이 늘고 있어요." },
        { title: "대만식 토핑 체험", desc: "고구마무스, 옥수수, 명란 등 독특한 토핑을 한 번쯤 시도해보세요." },
        { title: "배달 앱 활용", desc: "우버이츠, 푸드판다 등으로 숙소까지 배달받기 편해요." },
      ],
      checklist: [
        "화덕 피자는 웨이팅이 있을 수 있어 저녁엔 예약 추천",
        "독특한 토핑 메뉴는 리뷰로 호불호 미리 확인",
        "배달 앱 이용 시 최소 주문 금액 확인",
        "1인이면 슬라이스(조각) 판매 매장 찾아보기",
      ],
    },
    en: {
      sub: "From wood-fired pizzerias to Taiwan-topped pies",
      intro: "Taiwan's pizza scene splits between authentic Neapolitan wood-fired specialists and casual chains with distinctly local toppings like sweet-potato mousse or potato. Delivery culture is strong, so it's easy to eat one back at your room.",
      tips: [
        { title: "Wood-fired pizzerias", desc: "Authentic Neapolitan-style wood-fired pizzerias are increasingly common around Taipei." },
        { title: "Try a local topping", desc: "Give sweet-potato mousse, corn, or mentaiko toppings a try at least once." },
        { title: "Delivery apps", desc: "Uber Eats and Foodpanda make it easy to get pizza delivered to your accommodation." },
      ],
      checklist: [
        "Wood-fired spots may have a wait — a dinner reservation helps",
        "Check reviews before committing to an unusual topping",
        "Confirm the minimum order amount when using a delivery app",
        "Solo? Look for a shop that sells pizza by the slice",
      ],
    },
  },

  stinky_tofu: {
    tagKo: "호불호 확실한 대만 시그니처", tagEn: "Taiwan's Most Divisive Signature Dish",
    ko: {
      sub: "발효 두부의 강렬한 향, 한 번은 도전해볼 맛",
      intro: "취두부(臭豆腐)는 대만 여행에서 가장 호불호가 갈리는 음식으로 유명합니다. 발효 과정에서 나는 강한 냄새와 달리 튀겨서 김치나 소스를 곁들이면 의외로 고소하고 바삭한 맛이라, 도전해본 여행자 대부분이 만족한다고 해요.",
      tips: [
        { title: "튀김 vs 마라 스타일", desc: "야시장에서 흔한 튀긴 취두부와 마라육수에 끓인 스타일 중 골라보세요." },
        { title: "김치 곁들임", desc: "대만식 절임 배추를 곁들여 먹는 게 정석이고, 느끼함을 잡아줘요." },
        { title: "냄새와 맛은 별개", desc: "냄새에 비해 실제 맛은 고소하고 담백한 편이니 편견 없이 도전해보세요." },
      ],
      checklist: [
        "냄새에 예민하면 야외 노점보다 실내 매장 추천",
        "처음이라면 튀긴 스타일부터 도전",
        "김치·소스는 매장에서 곁들여주는 대로 함께 먹기",
        "숙소나 대중교통에 냄새가 밸 수 있어 포장은 비닐 이중포장 권장",
      ],
    },
    en: {
      sub: "Fermented tofu with a smell you'll never forget — worth trying at least once",
      intro: "Stinky tofu is famously the most polarizing dish in Taiwan. Despite the pungent fermented smell, once fried and served with pickled cabbage or sauce, it's surprisingly savory and crispy — most travelers who try it end up won over.",
      tips: [
        { title: "Fried vs. mala style", desc: "Choose between the common night-market fried version and the mala-broth-boiled style." },
        { title: "Pair with pickled cabbage", desc: "Taiwanese-style pickled cabbage is the classic pairing and cuts through the richness." },
        { title: "Smell isn't taste", desc: "The flavor is milder and more savory than the smell suggests — worth trying with an open mind." },
      ],
      checklist: [
        "If you're smell-sensitive, choose an indoor shop over an open-air stall",
        "First time? Start with the fried version",
        "Eat it with whatever pickles or sauce the shop provides",
        "Smell can linger on clothes or in transit — double-bag it for takeout",
      ],
    },
  },

  bakery: {
    tagKo: "골목마다 숨은 빵 맛집", tagEn: "A Bakery Around Every Corner",
    ko: {
      sub: "펑리수 원조부터 감성 베이커리 카페까지",
      intro: "대만은 펑리수(鳳梨酥) 같은 전통 과자부터 일본식 소보로빵, 유럽식 소금빵까지 베이커리 씬이 풍부합니다. 유명 브랜드는 선물용 포장이 잘 되어 있어 기념품 쇼핑 장소로도 인기예요.",
      tips: [
        { title: "펑리수 시식", desc: "유명 펑리수 매장은 매장에서 시식 후 구매할 수 있는 곳이 많아요." },
        { title: "오픈런 인기 빵집", desc: "타이베이 인기 베이커리는 특정 메뉴가 오전에 품절되는 경우가 많아요." },
        { title: "선물 포장 서비스", desc: "명절/기념일용 포장 박스를 별도로 제공하는 매장이 많아 선물용으로 좋아요." },
      ],
      checklist: [
        "선물용 펑리수는 유통기한을 확인하고 넉넉히 구매",
        "인기 빵집은 오전 방문이 재고 확보에 유리",
        "시식 후 구매하는 매장 예절 지키기",
        "포장 시 상온 보관 가능 기간 확인",
      ],
    },
    en: {
      sub: "From original pineapple cake bakeries to design-forward bread shops",
      intro: "Taiwan's bakery scene runs from traditional pineapple cake to Japanese-style soboro bread to European-style salt buns. Famous brands wrap gifts beautifully, making bakeries a popular souvenir stop too.",
      tips: [
        { title: "Sample before you buy", desc: "Well-known pineapple cake shops often let you try a sample before purchasing." },
        { title: "Popular items sell out early", desc: "Certain items at Taipei's best bakeries can sell out by late morning." },
        { title: "Gift packaging", desc: "Many bakeries offer special gift-box packaging, great for souvenirs." },
      ],
      checklist: [
        "Check the shelf life on gift pineapple cake and buy accordingly",
        "Morning visits give the best chance at popular items still being in stock",
        "Be considerate when sampling before buying",
        "Confirm how long the packaging keeps items fresh at room temperature",
      ],
    },
  },

  bar: {
    tagKo: "밤이 깊을수록 진해지는 매력", tagEn: "A City That Comes Alive After Dark",
    ko: {
      sub: "크래프트 칵테일 바부터 로컬 맥주 펍까지",
      intro: "타이베이는 아시아 베스트 바 리스트에 꾸준히 이름을 올릴 만큼 칵테일 바 씬이 발달했습니다. 숨겨진 인테리어의 스피크이지 바부터 캐주얼한 크래프트 맥주 펍까지 다양하게 즐길 수 있어요.",
      tips: [
        { title: "스피크이지 바", desc: "간판 없이 숨겨진 입구로 들어가는 스피크이지 콘셉트 바가 많아 찾는 재미가 있어요." },
        { title: "커버 차지 확인", desc: "일부 인기 바는 입장 시 최소 주문이나 커버 차지가 있어요." },
        { title: "대만 크래프트 맥주", desc: "타이완 비어 외에도 로컬 크래프트 브루어리 맥주를 취급하는 펍이 늘고 있어요." },
      ],
      checklist: [
        "인기 바는 주말 예약을 권장",
        "최소 주문/커버 차지 여부 사전 확인",
        "여권 등 신분증 지참(연령 확인 요구 가능)",
        "막차 시간 확인 후 이동 계획 세우기",
      ],
    },
    en: {
      sub: "From craft cocktail dens to laid-back local beer pubs",
      intro: "Taipei's cocktail bar scene regularly lands on Asia's best-bar lists. You'll find everything from unmarked speakeasy-style bars to casual craft beer pubs.",
      tips: [
        { title: "Speakeasy bars", desc: "Many bars hide behind unmarked entrances — part of the fun is finding them." },
        { title: "Check for a cover charge", desc: "Some popular bars have a minimum order or cover charge." },
        { title: "Taiwanese craft beer", desc: "Beyond Taiwan Beer, more pubs now carry local craft brewery beers." },
      ],
      checklist: [
        "Reservations are recommended for popular bars on weekends",
        "Confirm any minimum order or cover charge ahead of time",
        "Bring ID — age verification may be requested",
        "Check last-train times before planning your night",
      ],
    },
  },

  gift_shop: {
    tagKo: "여행의 기억을 담아가는 곳", tagEn: "Where Travel Memories Get Packaged",
    ko: {
      sub: "감성 문구부터 대만 굿즈까지",
      intro: "지우펀, 딩시 같은 관광지 골목에는 대만 감성이 담긴 소품가게가 많습니다. 손글씨 엽서, 대만 전통 문양 굿즈, 로컬 브랜드 문구류까지 구경하는 재미가 커요.",
      tips: [
        { title: "지역 한정 굿즈", desc: "지역명이 들어간 한정판 소품은 그 도시에서만 구할 수 있는 경우가 많아요." },
        { title: "가격 흥정 문화 없음", desc: "대만은 정찰제가 기본이라 흥정은 시도하지 않는 게 좋아요." },
        { title: "포장 요청 가능", desc: "선물용이라고 말하면 포장을 도와주는 매장이 많아요." },
      ],
      checklist: [
        "깨지기 쉬운 소품은 기내 수하물 포장 여부 확인",
        "지역 한정판은 재입고가 안 되는 경우가 많아 마음에 들면 바로 구매",
        "카드 결제 가능 여부는 매장마다 다르니 현금도 준비",
        "영수증은 면세 신청 시 필요할 수 있어 보관",
      ],
    },
    en: {
      sub: "From stationery to Taiwan-themed goods",
      intro: "Tourist alleys like Jiufen and Dihua Street are full of gift shops with a distinctly Taiwanese feel — hand-lettered postcards, traditional-pattern goods, and local stationery brands are all worth browsing.",
      tips: [
        { title: "Region-limited goods", desc: "Items branded with a specific city name are often only sold there." },
        { title: "No haggling culture", desc: "Prices are fixed in Taiwan, so bargaining isn't customary." },
        { title: "Ask about gift wrapping", desc: "Many shops will wrap an item if you mention it's a gift." },
      ],
      checklist: [
        "Check whether fragile items can be packed for checked or carry-on luggage",
        "Region-limited items may not be restocked — buy it if you love it",
        "Card acceptance varies by shop, so carry some cash too",
        "Keep receipts in case you need them for a tax refund",
      ],
    },
  },

  attraction: {
    tagKo: "먹는 것 이상의 즐거움", tagEn: "More Than Just a Meal",
    ko: {
      sub: "먹거리 골목 주변의 체험형 명소",
      intro: "지도에 등록된 체험/관광지는 맛집 탐방 동선에 곁들이기 좋은 스팟들입니다. 전통시장 체험, 온천, 소규모 박물관 등 식사 전후로 짧게 들르기 좋은 곳 위주예요.",
      tips: [
        { title: "동선에 끼워넣기", desc: "맛집 탐방 전후로 30분~1시간 정도 짧게 즐길 수 있는 곳 위주로 구성돼 있어요." },
        { title: "현지인 리뷰 확인", desc: "관광지보다 현지인이 즐겨 찾는 소규모 스팟이 등록된 경우가 많으니 리뷰를 참고하세요." },
        { title: "영업시간 미리 확인", desc: "소규모 스팟은 정기 휴무일이 있는 경우가 많아 방문 전 확인이 필요해요." },
      ],
      checklist: [
        "영업시간·정기휴무일은 방문 전 구글맵에서 재확인",
        "온천 등은 수건·수영복 등 준비물 확인",
        "맛집 탐방 동선에 자연스럽게 끼워넣기",
        "혼잡한 시간대(주말 오후)는 피해서 방문",
      ],
    },
    en: {
      sub: "Hands-on attractions near Taiwan's food streets",
      intro: "The attractions pinned on the map are spots that pair naturally with a food-focused itinerary — traditional market experiences, hot springs, small museums — the kind of thing you can fit in around a meal.",
      tips: [
        { title: "Fold it into your route", desc: "Most are designed to fit into a 30-minute-to-1-hour window around a meal." },
        { title: "Check local reviews", desc: "Many are smaller, local favorites rather than big tourist sites — reviews help set expectations." },
        { title: "Confirm hours ahead", desc: "Smaller spots often have irregular closing days, so check before you go." },
      ],
      checklist: [
        "Double-check hours and closing days on Google Maps before visiting",
        "Bring a towel/swimsuit if visiting a hot spring",
        "Slot it naturally into your food-focused route",
        "Avoid peak times (weekend afternoons) if you can",
      ],
    },
  },

  shopping: {
    tagKo: "먹부림 사이 쇼핑 타임", tagEn: "A Shopping Break Between Bites",
    ko: {
      sub: "야시장 쇼핑부터 로컬 브랜드 편집숍까지",
      intro: "먹거리 탐방 동선에 곁들이기 좋은 쇼핑 스팟들을 모았습니다. 야시장의 저가 잡화부터 시먼딩·다안 지역의 로컬 브랜드 편집숍까지 다양해요.",
      tips: [
        { title: "야시장 쇼핑", desc: "야시장에서는 옷·액세서리를 저렴하게 살 수 있지만 정찰제가 아닌 곳도 있어요." },
        { title: "로컬 브랜드 발굴", desc: "시먼딩·다안 지역엔 대만 로컬 디자이너 브랜드 편집숍이 모여 있어요." },
        { title: "면세 쇼핑", desc: "일정 금액 이상 구매 시 외국인 즉시환급(TRS) 제도를 이용할 수 있어요." },
      ],
      checklist: [
        "즉시환급 대상 매장인지(TRS 스티커) 확인",
        "야시장은 매장별로 가격이 달라 여러 곳 비교 추천",
        "결제수단(현금/카드) 매장별로 다르니 확인",
        "영수증은 환급 신청 시 필요하니 보관",
      ],
    },
    en: {
      sub: "From night-market shopping to local designer boutiques",
      intro: "These are shopping stops that fit neatly around a food-focused itinerary — cheap night-market finds to local designer boutiques around Ximending and Da'an.",
      tips: [
        { title: "Night-market shopping", desc: "Clothes and accessories are cheap at night markets, though not every stall has fixed prices." },
        { title: "Discover local brands", desc: "Ximending and Da'an have a cluster of Taiwanese designer boutiques worth browsing." },
        { title: "Tax-free shopping", desc: "Spend over a certain amount and you can use the tourist tax refund (TRS) scheme." },
      ],
      checklist: [
        "Look for a TRS (tax refund) sticker at eligible shops",
        "Night-market prices vary by stall — worth comparing a few",
        "Payment method (cash/card) varies by shop — check ahead",
        "Keep receipts in case you need them for a tax refund",
      ],
    },
  },

  liquor_shop: {
    tagKo: "대만 술 문화 입문", tagEn: "A Crash Course in Taiwanese Drinking Culture",
    ko: {
      sub: "타이완 비어부터 진먼 카오량주까지",
      intro: "대만의 주류샵에서는 국민 맥주 타이완 비어(台灣啤酒)부터 독한 증류주 진먼 카오량주(金門高粱酒), 편의점에서도 구하기 쉬운 로컬 크래프트 맥주까지 다양하게 만날 수 있습니다. 선물용 미니어처 세트도 인기예요.",
      tips: [
        { title: "타이완 비어 라인업", desc: "생과일이 들어간 프루트 비어 시리즈는 여행자들에게 특히 인기예요." },
        { title: "카오량주 도수 주의", desc: "58도에 달하는 카오량주는 독하니 소량으로 시작하는 걸 추천해요." },
        { title: "면세 한도 확인", desc: "귀국 시 주류 면세 한도를 넘지 않도록 확인하세요." },
      ],
      checklist: [
        "귀국 국가의 주류 면세 한도 미리 확인",
        "카오량주 등 고도수 술은 기내 위탁수하물 규정 확인",
        "선물용 미니어처 세트는 공항 면세점보다 시내가 저렴한 경우 많음",
        "미성년자 동반 시 시음 코너 이용 불가할 수 있음",
      ],
    },
    en: {
      sub: "From Taiwan Beer to Kinmen Kaoliang",
      intro: "Liquor shops here range from the everyday Taiwan Beer to the fiery Kinmen Kaoliang spirit, plus local craft beers now easy to find even at convenience stores. Miniature gift sets are a popular souvenir.",
      tips: [
        { title: "Taiwan Beer's fruit series", desc: "The fruit beer lineup, made with real fruit, is especially popular with travelers." },
        { title: "Watch the proof on Kaoliang", desc: "Kaoliang can run up to 58% ABV — start with a small pour." },
        { title: "Mind duty-free limits", desc: "Check your home country's duty-free alcohol allowance before buying too much." },
      ],
      checklist: [
        "Check your home country's duty-free alcohol limit ahead of time",
        "High-proof spirits like Kaoliang may need to go in checked luggage — check airline rules",
        "Miniature gift sets are often cheaper downtown than at the airport",
        "Tasting counters may not serve minors accompanying you",
      ],
    },
  },
};
