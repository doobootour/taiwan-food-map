// 지역별 블로그 콘텐츠 — region.html에서 사용. 언어별로 ko/en 콘텐츠를 따로 둔다.
const REGION_CONTENT = {
  taipei: {
    ko: {
      intro: "대만 여행의 관문이자 심장. 24시간 꺼지지 않는 야시장, 반짝이는 101타워, 골목 안 백년 노포가 한 도시 안에 다 들어있어요. 대중교통(MRT)만으로 웬만한 명소를 다 돌 수 있어서, 대만이 처음이라면 타이베이부터 시작하는 게 정답입니다.",
      highlights: [
        { title: "타이베이 101 & 신이(信義) 지구", desc: "대만에서 가장 높은 빌딩과 그 주변의 백화점·루프탑 바 거리. 야경 명소로도 유명해요." },
        { title: "시먼딩(西門町)", desc: "대만판 홍대. 스트리트 패션, 인생네컷, 길거리 공연이 몰려있는 젊음의 거리." },
        { title: "융캉제(永康街) & 동먼(東門)", desc: "딘타이펑 본점을 비롯한 미식 골목. 조용한 골목마다 감성 카페와 소품샵이 숨어있어요." },
        { title: "지우펀(九份) & 스펀(十分)", desc: "타이베이 시내에서 1시간 거리. 지브리 애니메이션 감성의 산동네와 천등 날리기 체험." },
        { title: "베이터우(北投) 온천", desc: "MRT로 30분이면 도착하는 온천 마을. 당일치기 힐링 코스로 인기예요." },
      ],
      activities: [
        "닝샤(寧夏)·라오허제(饒河) 야시장에서 노점 음식 순례하기",
        "고궁박물관에서 중화문명 유물 감상하기",
        "MRT 1일권으로 시내 명소 자유여행",
        "루프탑 바나 전망대에서 101타워 야경 보기",
        "융캉제 골목 카페 투어",
      ],
    },
    en: {
      intro: "Taiwan's gateway city and beating heart. Night markets that never sleep, the glittering Taipei 101, and century-old noodle shops down quiet alleys all exist within one city — and nearly every sight is reachable by MRT alone, making Taipei the obvious place to start a first trip to Taiwan.",
      highlights: [
        { title: "Taipei 101 & Xinyi District", desc: "Taiwan's tallest tower, surrounded by department stores and rooftop bars — also famous for its night skyline." },
        { title: "Ximending (西門町)", desc: "Taiwan's answer to Hongdae. Street fashion, photo booths, and busking performers pack this youthful district." },
        { title: "Yongkang St. & Dongmen (東門)", desc: "A food-lover's alley anchored by the original Din Tai Fung. Quiet side streets hide cozy cafés and gift shops." },
        { title: "Jiufen (九份) & Shifen (十分)", desc: "An hour from downtown Taipei — a Ghibli-esque hillside town, plus releasing your own sky lantern." },
        { title: "Beitou (北投) Hot Springs", desc: "A hot-spring village just 30 minutes away by MRT. A favorite for a healing day trip." },
      ],
      activities: [
        "Eat your way through the Ningxia and Raohe night markets",
        "See Chinese civilization's treasures at the National Palace Museum",
        "Explore the city freely with a one-day MRT pass",
        "Watch the Taipei 101 night skyline from a rooftop bar or observation deck",
        "Café-hop through the alleys of Yongkang Street",
      ],
    },
  },
  kaohsiung: {
    ko: {
      intro: "대만 남부의 항구도시. 타이베이보다 느긋하고 여유로운 분위기에, 넓은 대로와 트램이 어우러진 이국적인 풍경이 매력이에요. 바다를 낀 노을 명소가 많아서 '남대만의 감성 도시'로 불립니다.",
      highlights: [
        { title: "연지담(蓮池潭)", desc: "용호탑으로 유명한 호수 공원. 사진 찍기 좋은 대만 남부 대표 명소예요." },
        { title: "보얼예술특구(駁二藝術特區)", desc: "옛 항만 창고를 개조한 예술 거리. 갤러리, 편집숍, 감성 카페가 모여있어요." },
        { title: "치진(旗津) 해변", desc: "페리로 10분이면 도착하는 섬. 자전거 타고 해산물 거리 구경하기 좋아요." },
        { title: "리우허(六合) 야시장", desc: "가오슝 대표 야시장. 관광객보다 현지인 비중이 높아 더 진짜배기예요." },
        { title: "85빌딩 & 아이허(愛河)", desc: "강변을 따라 노을 산책하기 좋은 코스. 야경이 특히 아름다워요." },
      ],
      activities: [
        "경전철(LRT) 타고 항구 도시 한 바퀴 돌기",
        "치진 해변에서 자전거 라이딩",
        "보얼예술특구에서 감성 사진 찍기",
        "아이허 강변 카페에서 노을 감상",
        "리우허 야시장에서 로컬 야식 즐기기",
      ],
    },
    en: {
      intro: "A port city in southern Taiwan with a slower, more relaxed pace than Taipei — wide boulevards and a light rail line give it an unusually open, easygoing feel. With plenty of waterfront sunset spots, it's often called the “mood city” of southern Taiwan.",
      highlights: [
        { title: "Lotus Pond (蓮池潭)", desc: "A lake park famous for its Dragon & Tiger Pagodas — one of southern Taiwan's most photogenic spots." },
        { title: "Pier-2 Art Center (駁二藝術特區)", desc: "Old harbor warehouses turned art district, full of galleries, concept shops, and cafés." },
        { title: "Cijin (旗津) Beach", desc: "A 10-minute ferry ride away — great for cycling past the seafood street." },
        { title: "Liuhe Night Market (六合)", desc: "Kaohsiung's signature night market, with more locals than tourists for an authentic feel." },
        { title: "85 Sky Tower & Love River (愛河)", desc: "A riverside walk that's perfect at sunset, with especially beautiful night views." },
      ],
      activities: [
        "Ride the light rail around the harbor city",
        "Cycle along Cijin Beach",
        "Take photos around the Pier-2 Art Center",
        "Watch the sunset from a café on the Love River",
        "Try local late-night snacks at Liuhe Night Market",
      ],
    },
  },
  taichung: {
    ko: {
      intro: "대만 커피·카페 문화의 수도이자 버블티가 탄생한 도시. 온화한 기후와 넓은 공원, 감각적인 로컬 브랜드 카페가 많아 '여유롭게 머무는 여행'에 잘 맞는 곳이에요.",
      highlights: [
        { title: "차오우다오(草悟道)", desc: "미술관에서 공원까지 이어지는 산책로. 양옆으로 독립서점과 카페가 늘어서 있어요." },
        { title: "펑지아(逢甲) 야시장", desc: "대만에서 손꼽히는 규모의 야시장. 대학가답게 젊고 트렌디한 먹거리가 많아요." },
        { title: "국립대만미술관", desc: "무료 입장인 대형 미술관. 넓은 잔디 공원이 함께 있어 피크닉하기 좋아요." },
        { title: "공원로(公園路) 일대 카페 거리", desc: "타이중이 왜 '카페의 도시'인지 알 수 있는 감성 카페 밀집 지역." },
        { title: "고미습지(高美濕地)", desc: "타이중 근교의 노을 명소. 풍력발전기와 갯벌이 만드는 이국적인 풍경." },
      ],
      activities: [
        "버블티 발상지에서 원조 펄밀크티 마시기",
        "차오우다오 따라 카페 투어",
        "펑지아 야시장에서 대학가 감성 먹거리 즐기기",
        "고미습지에서 노을 사진 찍기",
        "자전거로 도심 공원 라이딩",
      ],
    },
    en: {
      intro: "The capital of Taiwan's coffee and café culture — and the birthplace of bubble milk tea. A mild climate, spacious parks, and a wave of stylish independent cafés make Taichung the perfect place for a slow, unhurried trip.",
      highlights: [
        { title: "Calligraphy Greenway (草悟道)", desc: "A promenade linking a museum to a park, lined on both sides with indie bookstores and cafés." },
        { title: "Fengjia Night Market (逢甲)", desc: "One of Taiwan's largest night markets, with young, trendy food befitting its university-town setting." },
        { title: "National Taiwan Museum of Fine Arts", desc: "A large museum with free admission, set beside a wide lawn park perfect for a picnic." },
        { title: "Gongyuan Road Café Street", desc: "A cluster of stylish cafés that shows exactly why Taichung is called Taiwan's “café city”." },
        { title: "Gaomei Wetlands (高美濕地)", desc: "A sunset spot on Taichung's outskirts, where wind turbines and tidal flats create an otherworldly scene." },
      ],
      activities: [
        "Drink the original pearl milk tea where bubble tea was born",
        "Café-hop along the Calligraphy Greenway",
        "Enjoy trendy university-town food at Fengjia Night Market",
        "Photograph the sunset at Gaomei Wetlands",
        "Cycle through the city's downtown parks",
      ],
    },
  },
  tainan: {
    ko: {
      intro: "대만 최초의 수도이자, '대만 미식의 뿌리'로 불리는 도시. 화려한 관광지보다는 골목 노포와 옛 정취가 매력이에요. 하루 종일 먹으러 다녀도 다 못 먹을 만큼 로컬 맛집이 밀집해있습니다.",
      highlights: [
        { title: "안평고보(安平古堡)", desc: "네덜란드 통치 시대의 유적. 대만 역사가 시작된 곳이에요." },
        { title: "선농제(神農街)", desc: "옛 가옥을 개조한 갤러리·바가 모인 거리. 밤에 조명이 켜지면 더 예뻐요." },
        { title: "츠칸러우(赤崁樓)", desc: "타이난을 대표하는 사적지. 시내 한복판에서 만나는 옛 대만." },
        { title: "하야시백화점(林百貨)", desc: "1932년 지어진 대만 최초의 백화점을 복원한 곳. 옥상 신사도 볼거리." },
        { title: "국화시장·중정로 골목", desc: "우육탕 등 로컬 소자 맛집이 밀집한 구역." },
      ],
      activities: [
        "골목 노포 돌아다니며 먹부림하기",
        "선농제에서 야경 산책",
        "안평고보·츠칸러우 등 유적지 도보 투어",
        "자전거 대여해서 옛 시가지 구석구석 누비기",
        "로컬 카페에서 대만식 브런치 즐기기",
      ],
    },
    en: {
      intro: "Taiwan's first capital, often called “the roots of Taiwanese cuisine.” Tainan's charm is less about big attractions and more about old-town alleys and century-old shops — there are so many local snack spots packed in that you couldn't eat through them all in a single day.",
      highlights: [
        { title: "Fort Zeelandia (安平古堡)", desc: "A relic of Dutch colonial rule, and the site where Taiwan's recorded history begins." },
        { title: "Shennong Street (神農街)", desc: "Old houses turned into galleries and bars — even prettier once the lights come on at night." },
        { title: "Chihkan Tower (赤崁樓)", desc: "Tainan's signature historic site, where old Taiwan surfaces right in the middle of the modern city." },
        { title: "Hayashi Department Store (林百貨)", desc: "Taiwan's first department store, built in 1932 and beautifully restored — its rooftop shrine is worth a look." },
        { title: "Guohua Market & Zhongzheng Rd. Alleys", desc: "A dense pocket of local snack shops serving beef soup and more." },
      ],
      activities: [
        "Snack-hop through old-town alley shops",
        "Take an evening stroll along Shennong Street",
        "Walk the historic sites — Fort Zeelandia, Chihkan Tower, and more",
        "Rent a bike and explore every corner of the old city",
        "Enjoy a Taiwanese-style brunch at a local café",
      ],
    },
  },
  hualien: {
    ko: {
      intro: "대만에서 가장 화려한 자연을 가진 동부 해안 도시. 타이루거 협곡의 웅장한 대리석 절벽과 태평양이 맞닿은 풍경이 대만 서부와는 완전히 다른 매력을 보여줘요. 도심보다 자연이 주인공인 여행지입니다.",
      highlights: [
        { title: "타이루거 국립공원(太魯閣)", desc: "대만 최고의 자연 명소. 대리석 협곡 사이로 트레킹 코스가 이어져요." },
        { title: "칭수이 절벽(清水斷崖)", desc: "해안 도로를 달리며 만나는 대만에서 가장 아름다운 해안절경." },
        { title: "화롄 시내 야시장", desc: "동대문·자강 야시장 등, 소박하지만 정겨운 로컬 야시장 문화." },
        { title: "치싱탄(七星潭)", desc: "몽돌 해변에서 즐기는 노을. 자전거 도로가 잘 되어있어 라이딩 코스로도 인기." },
        { title: "화롄 남부 온천·농장 지대", desc: "루이수이 등 온천 마을과 목장 체험이 가능한 화롄 남부 지역." },
      ],
      activities: [
        "타이루거 협곡 트레킹",
        "해안도로 렌터카·오토바이 드라이브",
        "치싱탄에서 몽돌 해변 산책",
        "동부 온천 마을에서 하룻밤 힐링",
        "화롄 야시장에서 소박한 로컬 먹거리 즐기기",
      ],
    },
    en: {
      intro: "An east-coast city with Taiwan's most spectacular scenery. The towering marble cliffs of Taroko Gorge meeting the Pacific Ocean create a landscape completely unlike western Taiwan — here, nature takes center stage over the city itself.",
      highlights: [
        { title: "Taroko National Park (太魯閣)", desc: "Taiwan's finest natural attraction, with hiking trails winding through marble gorges." },
        { title: "Qingshui Cliff (清水斷崖)", desc: "Taiwan's most beautiful coastline, encountered while driving along the coastal highway." },
        { title: "Hualien Night Markets", desc: "Dongdamen and Zigiang night markets — modest but warm, distinctly local night-market culture." },
        { title: "Qixingtan (七星潭)", desc: "A pebble beach great for sunset, with a well-built bike path that's popular for riding." },
        { title: "Ruisui Hot Springs & Ranch Area", desc: "Hot spring towns like Ruisui, plus ranch experiences along the East Rift Valley." },
      ],
      activities: [
        "Hike through Taroko Gorge",
        "Drive or ride the coastal highway by rental car or scooter",
        "Stroll the pebble beach at Qixingtan",
        "Unwind overnight at an east-coast hot spring town",
        "Enjoy simple local food at Hualien's night markets",
      ],
    },
  },
  yilan: {
    ko: {
      intro: "타이베이에서 설산터널만 넘으면 40분 만에 도착하는 힐링 여행지. 온천, 논밭 풍경, 대파 요리로 유명해서 '타이베이 사람들의 주말 도피처'로 불려요.",
      highlights: [
        { title: "자오시(礁溪) 온천", desc: "기차역 바로 앞에 온천 거리가 있는 진귀한 온천 마을. 무료 족욕탕도 곳곳에." },
        { title: "카발란 위스키 공장(噶瑪蘭威士忌酒廠)", desc: "세계적인 상을 휩쓴 대만산 위스키 양조장. 견학 투어를 돌아보고 위스키도 시음해볼 수 있어요." },
        { title: "뤄동(羅東) 야시장", desc: "이란 최대 규모 야시장. 대파빵, 소시지 등 이란 로컬 먹거리의 성지." },
        { title: "난양박물관(蘭陽博物館)과 와이아오(外澳) 해변", desc: "비스듬히 기울어진 삼각형 모양의 독특한 건축으로 유명한 박물관. 바로 옆 해변에서는 수영과 서핑도 즐길 수 있어요." },
        { title: "귀산도(龜山島) 전망", desc: "이란 해안 어디서든 보이는 거북섬. 배를 타고 돌고래 투어도 가능해요." },
      ],
      activities: [
        "자오시 온천 족욕·숙박 즐기기",
        "뤄동 야시장에서 대파 요리 먹부림",
        "논밭 사이 감성 카페 투어",
        "난양박물관 구경 후 와이아오 해변에서 수영·서핑 즐기기",
        "귀산도 돌고래 투어",
      ],
    },
    en: {
      intro: "Just 40 minutes from Taipei through the Xueshan Tunnel, this is where Taipei locals escape on weekends — known for its hot springs, rice-paddy scenery, and scallion dishes.",
      highlights: [
        { title: "Jiaoxi (礁溪) Hot Springs", desc: "A rare hot-spring town with a spa street right outside the train station, plus free foot baths scattered around." },
        { title: "Kavalan Whisky Distillery (噶瑪蘭威士忌酒廠)", desc: "An award-winning Taiwanese whisky distillery — take the factory tour and sample the whisky." },
        { title: "Luodong Night Market (羅東)", desc: "Yilan's largest night market — the go-to spot for scallion pancakes, sausages, and other local specialties." },
        { title: "Lanyang Museum (蘭陽博物館) & Waiao Beach", desc: "A museum known for its striking wedge-shaped architecture. The beach right next door is popular for swimming and surfing." },
        { title: "Turtle Island (龜山島) Views", desc: "Visible from almost anywhere along the Yilan coast — boat tours out to see dolphins are also available." },
      ],
      activities: [
        "Soak your feet — or stay the night — at the Jiaoxi hot springs",
        "Feast on scallion dishes at Luodong Night Market",
        "Café-hop through the rice paddies",
        "Visit the Lanyang Museum, then swim or surf at Waiao Beach next door",
        "Take a dolphin-watching boat tour near Turtle Island",
      ],
    },
  },
  jiufen: {
    ko: {
      intro: "타이베이에서 버스로 1시간이면 닿는 산동네. 붉은 등불이 켜진 계단식 골목과 안개 낀 산비탈 풍경으로 유명해서, 대만 여행 사진의 상당수가 여기서 나온다는 말이 있을 정도예요. 근처 예류·스펀·진과스까지 묶어서 하루 코스로 돌아보기 좋아요.",
      highlights: [
        { title: "예류 지질공원(野柳)", desc: "여왕머리 바위로 유명한 기암 해안. 파도가 깎아낸 신비로운 지형을 볼 수 있어요." },
        { title: "스펀 천등 날리기", desc: "옛 철길 위에서 소원을 적은 천등을 직접 날려보는 체험. 지우펀 여행의 하이라이트로 꼽혀요." },
        { title: "스펀 폭포(十分瀑布)", desc: "대만판 나이아가라라 불리는 폭포. 스펀 천등 마을과 가까워 함께 둘러보기 좋아요." },
        { title: "진과스 황금박물관(金瓜石)", desc: "일제강점기 금광촌을 그대로 보존한 곳. 커다란 금괴를 직접 만져볼 수 있어요." },
        { title: "지우펀 노제(老街)", desc: "치산제(基山街) 골목을 따라 이어지는 찻집과 먹거리 노점. 해 질 무렵 등불이 켜지면 가장 아름다워요." },
      ],
      activities: [
        "예류에서 기암 지형 구경하기",
        "핑시선(平溪線) 열차 타고 옛 탄광촌 기차 여행",
        "스펀에서 천등 날리며 소원 빌기",
        "진과스 황금박물관 둘러보기",
        "해 질 무렵 지우펀 노제에서 야경 감상하기",
      ],
    },
    en: {
      intro: "A hillside town just an hour by bus from Taipei, famous for its lantern-lit stepped alleys and misty mountainside views — it's said that a huge share of every Taiwan trip's photos come from here. It pairs perfectly with nearby Yehliu, Shifen, and Jinguashi for a full day trip.",
      highlights: [
        { title: "Yehliu Geopark (野柳)", desc: "A coastal geopark famous for the Queen's Head rock — wave-carved formations that look almost otherworldly." },
        { title: "Shifen Sky Lanterns", desc: "Write a wish on a sky lantern and release it right over the old railway tracks — often the highlight of a Jiufen day trip." },
        { title: "Shifen Waterfall (十分瀑布)", desc: "Often called \"Taiwan's Niagara” — close to the Shifen lantern village, easy to combine in one visit." },
        { title: "Gold Ecological Park, Jinguashi (金瓜石)", desc: "A preserved Japanese-era gold-mining town — you can even touch a giant gold bar on display." },
        { title: "Jiufen Old Street", desc: "A lane of teahouses and street food along Jishan Street — most beautiful just as the lanterns switch on at dusk." },
      ],
      activities: [
        "Explore the strange rock formations at Yehliu",
        "Ride the Pingxi rail line through old mining villages",
        "Release a sky lantern and make a wish at Shifen",
        "Visit the Gold Ecological Park in Jinguashi",
        "Watch the sunset glow over Jiufen's old street",
      ],
    },
  },
  taitung: {
    ko: {
      intro: "대만 동부 해안의 슬로우 라이프 도시. 태평양과 중앙산맥 사이 좁고 긴 평야에 논밭과 목장이 펼쳐져 있고, 매년 여름 루예고원 열기구 축제로 유명해요. 원주민 문화와 느긋한 해안 드라이브를 즐기기 좋은 곳이에요.",
      highlights: [
        { title: "루예고원(鹿野高台)", desc: "매년 여름 국제 열기구 축제가 열리는 초록 언덕. 패러글라이딩 명소이기도 해요." },
        { title: "삼선대(三仙台)", desc: "8개 아치로 연결된 인도교가 유명한 해안 명소. 일출 명소로도 손꼽혀요." },
        { title: "즈번 온천(知本溫泉)", desc: "대만 3대 온천 중 하나. 산속 노천탕에서 여유를 즐길 수 있어요." },
        { title: "타이동 삼림공원", desc: "해변과 이어진 도심 속 숲 공원. 자전거 라이딩 코스로 인기예요." },
        { title: "츠상(池上) 논밭 자전거길", desc: "황금빛 논이 펼쳐지는 무장애 자전거길. 대만 관광청 광고 배경으로도 유명해요." },
      ],
      activities: [
        "루예고원에서 열기구 구경하기 (여름 시즌)",
        "츠상 논밭길 자전거 라이딩",
        "삼선대에서 일출 보기",
        "즈번 온천에서 하룻밤 힐링",
        "타이동 기차역 인근 야시장에서 로컬 먹거리 즐기기",
      ],
    },
    en: {
      intro: "A slow-life city on Taiwan's east coast, tucked into a narrow valley between the Pacific and the Central Mountain Range. Best known for its summer hot-air-balloon festival on Luye Highland, it's also a great base for indigenous culture and easygoing coastal drives.",
      highlights: [
        { title: "Luye Highland (鹿野高台)", desc: "A green highland that hosts an international hot-air-balloon festival every summer — also popular for paragliding." },
        { title: "Sanxiantai (三仙台)", desc: "A coastal landmark famous for its eight-arch pedestrian bridge — also a top spot for sunrise." },
        { title: "Zhiben Hot Springs (知本溫泉)", desc: "One of Taiwan's three great hot springs — soak in an open-air bath tucked into the mountains." },
        { title: "Taitung Forest Park", desc: "A forest park in the middle of the city that runs right up to the beach — a favorite for cycling." },
        { title: "Chishang (池上) Rice Paddy Bike Path", desc: "A flat cycling path through golden rice paddies — famous as the backdrop of Taiwan's tourism ads." },
      ],
      activities: [
        "See the hot-air balloons at Luye Highland (summer season)",
        "Cycle through the rice paddies of Chishang",
        "Watch the sunrise at Sanxiantai",
        "Unwind overnight at Zhiben Hot Springs",
        "Enjoy local food at the night market near Taitung Station",
      ],
    },
  },
  alishan: {
    ko: {
      intro: "구름 위 일출과 삼림열차로 유명한 대만 대표 고산 여행지. 아리산 국가풍경구의 신목 숲과 근처 일월담(日月潭)을 함께 묶어 1박 2일 코스로 즐기기 좋아요.",
      highlights: [
        { title: "아리산 일출(祝山日出)", desc: "주산 전망대에서 보는 구름바다 위 일출. 새벽 일출 열차를 타고 올라가요." },
        { title: "아리산 삼림철도", desc: "1912년부터 운행된 산악 철도. 편백나무 숲 사이를 지나는 구간이 명물이에요." },
        { title: "신목 군락(神木群)", desc: "수천 년 된 편백나무 거목들이 모여있는 산책로. 삼림욕하기 좋아요." },
        { title: "일월담(日月潭)", desc: "대만에서 가장 큰 호수. 유람선이나 자전거로 호수를 한 바퀴 도는 코스가 인기예요." },
        { title: "아리산 고산차(高山茶)", desc: "구름 낀 고산지대에서 재배되는 우롱차 산지. 다원 투어와 시음이 가능해요." },
      ],
      activities: [
        "새벽 일출 열차 타고 주산에서 일출 보기",
        "삼림철도 타고 편백나무 숲 지나가기",
        "일월담 자전거 일주",
        "다원에서 고산차 시음하기",
        "신목 산책로에서 삼림욕 즐기기",
      ],
    },
    en: {
      intro: "Taiwan's signature mountain getaway, famous for sunrise above the clouds and its narrow-gauge forest railway. Pair the ancient cypress forests of Alishan National Scenic Area with nearby Sun Moon Lake for a great overnight trip.",
      highlights: [
        { title: "Alishan Sunrise (祝山日出)", desc: "Sunrise over a sea of clouds from Zhushan viewing platform, reached by an early-morning sunrise train." },
        { title: "Alishan Forest Railway", desc: "A mountain railway running since 1912 — the stretch through cypress forest is the scenic highlight." },
        { title: "Sacred Trees Area (神木群)", desc: "A walking trail past cypress trees thousands of years old — perfect for forest bathing." },
        { title: "Sun Moon Lake (日月潭)", desc: "Taiwan's largest lake — popular for a boat cruise or a full bike loop around the water." },
        { title: "Alishan High Mountain Tea (高山茶)", desc: "A high-mountain oolong tea region grown in the misty peaks — tour a tea farm and sample fresh brews." },
      ],
      activities: [
        "Ride the sunrise train and watch dawn break at Zhushan",
        "Ride the forest railway through the cypress woods",
        "Cycle the full loop around Sun Moon Lake",
        "Sample high-mountain tea at a local farm",
        "Take a forest-bathing walk through the ancient cypress grove",
      ],
    },
  },
};
