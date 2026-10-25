// 지역별 '꼭 가볼 곳' 데이터. scripts/generate-attraction-pages.js가 이 파일을 읽어
// <region>-attractions.html 페이지와 region-<region>.html의 '꼭 가볼 곳' 칸을 만든다.
// 다른 지역을 넣을 때는 ATTRACTIONS에 같은 형식으로 지역 키를 추가하면 된다.
// lat/lng는 근처 맛집을 고르고 별 마커를 찍는 대략 좌표다(관광청·OpenStreetMap 기준).
// image는 카드 맨 위 사진. 출처·라이선스는 assets/images/attractions/CREDITS.md에 함께 적는다.
// 맛집 지역(REGIONS)에 없는 곳은 region: { id, ko }로 이름을 정한다(지역 페이지 링크 없이 만든다).
// 오래 두고 볼 일반 소개만 적는다(유래·배경·볼거리·시기·가는 법). 사실은 공식 관광 출처로 확인한다.
const ATTRACTIONS = {
  hualien: {
    title: "화롄 꼭 가볼 곳 5곳",
    description: "타이루거 협곡, 청수단애, 칠성담, 리위탄, 동대문 야시장. 화롄 대표 관광지 5곳의 이름 유래와 볼거리, 가기 좋은 때와 가는 방법, 근처 맛집을 한 번에 정리했어요.",
    intro: "화롄은 협곡, 바다 절벽, 호수, 야시장이 차로 한 시간 안에 모여 있는 곳이에요. 관광지마다 근처에 등록된 맛집을 거리순으로 붙여 두었으니, 구경하고 바로 먹을 곳까지 정해 보세요.",
    doobootourUrl: "https://doobootour.com/",
    items: [
      {
        image: {"src": "/assets/images/attractions/hualien/taroko.webp", "alt": "타이루거 협곡 燕子口에서 올려다본 대리석 절벽", "width": 1200, "height": 1805, "credit": "edwin.11", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:View_From_Swallow_Grotto_in_Taroko_Gorge_(5448560308).jpg"},
        id: "taroko",
        ko: "타이루거 협곡",
        zh: "太魯閣國家公園",
        lat: 24.1577, lng: 121.6222,
        origin: "'타이루거(太魯閣)'는 이 골짜기에 살아온 원주민 트루쿠(Truku)족의 이름에서 왔어요. 청나라 때는 '大魯閣', 일본 통치기에는 'Taroko'로 불렸고, 그 발음이 지금의 이름으로 굳었어요.",
        intro: "수억 년 전 바다 밑 생물이 쌓여 만들어진 석회암이 열과 압력을 받아 대리석이 됐고, 대만 섬이 솟아오르는 동안 立霧溪가 그 대리석을 깊게 깎아 내려 거의 수직인 협곡이 생겼어요. 1986년에 국가공원으로 지정됐어요.",
        highlights: "협곡에서 가장 좁은 구간인 燕子口와 九曲洞이 대표 볼거리예요. 燕子口는 절벽의 작은 구멍에 제비가 둥지를 틀어 붙은 이름이고, 九曲洞은 굽이굽이 휘어진 터널 길을 따라 협곡을 보는 곳이에요. 협곡 입구의 遊客中心 주변 太魯閣臺地 산책로에서 국가공원 전시를 보고 시작하기 좋아요.",
        season: "燕子口에 제비가 많이 드나드는 때는 봄과 여름이에요.",
        access: "화롄역에서 차로 약 40분이에요. 협곡 입구 遊客中心 앞까지 태로코 버스 302번이 新城역에서 다녀요.",
        sources: [
          { label: "交通部觀光署 太魯閣遊客中心", url: "https://www.taiwan.net.tw/m1.aspx?id=R43&sNo=0001124" },
          { label: "太魯閣國家公園 峽谷의 형성", url: "https://www.taroko.gov.tw/ch/sglarticle/taroko-gorge-past-and-present" },
          { label: "太魯閣國家公園 太魯閣族", url: "https://www.taroko.gov.tw/ch/sglarticle/taroko-tribe" }
        ],
        doobootour: true
      },
      {
        image: {"src": "/assets/images/attractions/hualien/qingshui-cliff.webp", "alt": "태평양으로 떨어지는 청수단애 절벽과 푸른 바다", "width": 1200, "height": 800, "credit": "Huaiwun", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Taroko_National_Park_Qingshui_Cliff_(Huaiwun).jpg"},
        id: "qingshui-cliff",
        ko: "청수단애",
        zh: "清水斷崖",
        lat: 24.2104, lng: 121.6792,
        origin: "'清水'는 절벽 뒤에 솟은 清水山에서 따온 이름이에요. 和平에서 崇德까지 약 21km 이어지는 해안 절벽으로, 예부터 '대만 8경'의 하나로 꼽혀 왔어요.",
        intro: "필리핀해판과 유라시아판이 부딪히며 땅이 솟아올랐고, 단단한 대리석과 편마암이 드러나면서 1,000m 넘는 산자락이 거의 90도로 태평양에 떨어지는 지형이 됐어요. 1932년 개통한 蘇花公路가 이 절벽 허리를 따라 나 있어요.",
        highlights: "蘇花公路를 달리며 차창으로 보는 풍경이 가장 유명해요. 崇德터널 북쪽 출구 옆에는 전망대 두 곳을 지나 자갈 해변까지 내려가는 약 320m 길이 있어서, 절벽과 바다를 한 화면에 담을 수 있어요.",
        season: "동쪽 바다를 마주 보고 있어 해 뜰 무렵 풍경이 특히 좋아요.",
        access: "화롄역에서 蘇花公路(台9線)를 따라 북쪽으로 차로 약 40~50분이에요. 대중교통으로는 가기 어려워서 차나 투어로 가는 편이 편해요.",
        sources: [
          { label: "交通部觀光署 清水斷崖", url: "https://www.tad.gov.tw/m1.aspx?id=2228&sNo=0001124" },
          { label: "交通部觀光署 蘇花公路", url: "https://www.tad.gov.tw/m1.aspx?id=13&sNo=0001016" },
          { label: "林業及自然保育署 臺灣地景保育網", url: "https://landscape.forest.gov.tw/Front/land_search/Landscape.aspx?Sn=306&id=kVsq7hIIvoI%3D" }
        ],
        doobootour: true
      },
      {
        image: {"src": "/assets/images/attractions/hualien/qixingtan.webp", "alt": "야자수 너머로 보이는 칠성담 해안과 산", "width": 1200, "height": 800, "credit": "Artemas Liu", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Qixingtan_Beach,_Taiwan.jpg"},
        id: "qixingtan",
        ko: "칠성담",
        zh: "七星潭",
        lat: 24.0264, lng: 121.6320,
        origin: "이름에 '潭(못)'이 붙었지만 호수가 아니라 바다예요. 원래 지금의 화롄 공항 자리에 크고 작은 호수가 있었는데, 일본 통치기에 비행장을 지으면서 메워졌어요. 해안가로 옮겨 온 주민들이 옛 마을 이름을 그대로 쓰면서 이 바닷가가 '七星潭'이 됐어요.",
        intro: "단층이 만든 초승달 모양 해안이라 '月牙灣'이라고도 불러요. 파도에 둥글게 다듬어진 검은 자갈이 해변을 덮고 있고, 뒤로는 중앙산맥이, 북쪽 멀리로는 청수단애가 보여요.",
        highlights: "자갈을 일곱 개 넘게 쌓으며 소원을 비는 '돌탑 쌓기'가 이곳의 대표 놀이예요. 남쪽 四八高地에 오르면 해안 곡선 전체가 내려다보이고, 화롄 시내 太平洋公園까지 이어지는 해안 자전거길도 있어요. 해변 자갈은 공공 자산이라 가져가면 안 돼요.",
        season: "태평양 일출을 보러 새벽에 가거나, 밤에 賞星廣場에서 별을 보는 것을 추천해요. 그늘이 거의 없어서 여름 낮에는 햇볕 대비를 하는 게 좋아요.",
        access: "화롄역에서 차로 약 15분이에요. 시내에서 해안 자전거길을 따라 자전거로 가도 돼요.",
        sources: [
          { label: "交通部觀光署 七星潭", url: "https://www.taiwan.net.tw/m1.aspx?id=9488&sNo=0001124" },
          { label: "花蓮觀光 七星潭海岸風景特定區", url: "https://hualien.travel/zh-tw/attraction/68/" }
        ],
        doobootour: true
      },
      {
        image: {"src": "/assets/images/attractions/hualien/liyu-lake.webp", "alt": "산에 둘러싸인 리위탄 호숫가 산책로", "width": 1200, "height": 801, "credit": "darrenlmh", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Liyu_Lake_Hualien_(37723288612).jpg"},
        id: "liyu-lake",
        ko: "리위탄",
        zh: "鯉魚潭",
        lat: 23.927826, lng: 121.50987,
        origin: "호수 동쪽에 있는 鯉魚山에서 이름을 따왔어요.",
        intro: "면적 약 104헥타르로 화롄에서 가장 큰 내륙 호수예요. 남북으로 길쭉한 타원형이고, 계절에 따라 호수 크기가 조금씩 달라져요.",
        highlights: "호수를 한 바퀴 도는 길이 약 4km라 천천히 걸어도 한 시간쯤이면 돌 수 있어요. 호숫가에서 피크닉이나 캠핑을 하거나 배를 타고 호수를 둘러볼 수 있고, 날씨가 좋으면 鯉魚山 위로 패러글라이딩이 떠다녀요.",
        season: "봄에는 花東縱谷 국가풍경구가 반딧불이 관찰 행사인 '鯉魚潭賞螢季'를 열어요. 호수 주변은 24시간 열려 있고, 방문자센터는 08:30~17:30에 문을 열어요.",
        access: "화롄역에서 차로 약 30분이에요. 화롄 버스터미널에서 303번이나 台灣好行 303B·303C를 타고 鯉魚潭潭北遊客中心에서 내려요.",
        sources: [
          { label: "交通部觀光署 鯉魚潭", url: "https://www.tad.gov.tw/m1.aspx?id=3&sNo=0001124" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/hualien/dongdamen.webp", "alt": "사람들로 붐비는 화롄 동대문 야시장 입구", "width": 1200, "height": 856, "credit": "Rutger van der Maar", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hualien_Dongdamen_Night_Market.jpg"},
        id: "dongdamen",
        ko: "동대문 야시장",
        zh: "東大門夜市",
        lat: 23.9736, lng: 121.6112,
        origin: "화롄의 오래된 야시장들을 한곳에 모아 2015년에 문을 연 야시장이에요. 해변에 있던 南濱夜市의 뒤를 잇는 福町夜市와, 시내에 따로 있던 自強夜市 등이 옮겨 와 하나가 됐어요.",
        intro: "福町夜市, 原住民一條街, 各省一條街, 自強夜市 네 구역으로 나뉘어 있고, 400개가 넘는 노점이 모인 화롄 최대 야시장이에요. 옛 화롄역 자리 바로 옆이라 낮에는 옛 철길 흔적을 따라 걸어 볼 수도 있어요.",
        highlights: "原住民一條街에서는 돌판구이, 산돼지 볶음 같은 원주민 음식을, 붉은 벽돌과 등불로 꾸민 各省一條街에서는 중국 여러 지방 음식을 맛볼 수 있어요. 福町·自強 구역에는 臭豆腐, 구운 옥수수, 해산물 구이 같은 대만 야시장 간식이 모여 있고, 저녁에는 무대 공연이 열리기도 해요.",
        season: "저녁 시간에 가는 곳이에요. 화롄현 관광 사이트 기준 매일 18:00~24:00이고, 가게마다 여는 시간이 조금씩 달라요.",
        access: "화롄역에서 차로 약 10분이에요. 시내 숙소라면 걸어서 갈 수 있고, 화롄역에서 시내버스로도 갈 수 있어요.",
        sources: [
          { label: "花蓮觀光 東大門夜市", url: "https://hualien.travel/zh-tw/attraction/17/" },
          { label: "花蓮市 文化觀光資訊網 東大門國際觀光夜市", url: "https://culture-tourism.hualien.gov.tw/attraction_dt.php?id=17" }
        ],
        doobootour: false
      }
    ]
  },
  taipei: {
    title: "타이베이 꼭 가볼 곳 5곳",
    description: "타이베이 101, 고궁박물원, 중정기념당, 스린 야시장, 샹산. 타이베이 대표 관광지 5곳의 이름 유래와 볼거리, 가기 좋은 때와 가는 방법, 근처 맛집을 한 번에 정리했어요.",
    intro: "타이베이는 MRT만으로 랜드마크, 박물관, 야시장, 야경 명소를 대부분 돌아볼 수 있는 도시예요. 관광지마다 근처에 등록된 맛집을 거리순으로 붙여 두었으니, 구경하고 바로 먹을 곳까지 정해 보세요.",
    items: [
      {
        image: {"src": "/assets/images/attractions/taipei/taipei-101.webp", "alt": "해 질 무렵 산 위에서 본 타이베이 101", "width": 1200, "height": 800, "credit": "Uwe Aranas (CEphoto)", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Taipei_Taiwan_Taipei-101-Tower-01.jpg"},
        id: "taipei-101", ko: "타이베이 101", zh: "台北101", lat: 25.03361, lng: 121.56476,
        origin: "지상 101층 건물이라 '101'이라는 이름이 붙었어요. 건축가 李祖原이 중화권에서 길한 숫자로 여기는 8을 바탕으로 설계해서, 8개 층을 한 마디로 쌓아 올린 대나무 모양이 됐어요.",
        intro: "신이(信義) 지구 한가운데 있는 타이베이의 상징이에요. 저층부는 쇼핑몰이고, 주변으로 백화점과 쇼핑가가 이어져 타이베이에서 가장 번화한 상권을 이뤄요.",
        highlights: "382m 높이의 89층 전망대까지 5층에서 엘리베이터를 타면 분속 1,010m로 약 37초 만에 올라가요. 전망대 안에서는 강풍과 지진에 대비해 매달아 둔 660톤 무게의 윈드 댐퍼를 직접 볼 수 있고, 더 높은 곳에서 밖으로 나가 걷는 'Skyline 460' 프로그램도 있어요. 밤에는 요일마다 꼭대기 조명 색이 바뀌고, 근처 옛 眷村을 살린 四四南村에서 101을 올려다보는 사진도 인기예요.",
        season: "해 질 무렵 전망대에 오르면 낮 풍경과 야경을 한 번에 볼 수 있어요. 12월 31일 밤 건물에서 쏘아 올리는 새해 불꽃놀이가 가장 유명해요.",
        access: "MRT 淡水信義線 台北101/世貿역과 바로 이어져 있어요.",
        sources: [
          { label: "交通部觀光署 台北101", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001090&id=7927" },
          { label: "交通部觀光署 台北101 景點資料", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_379000000a_000217" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/taipei/palace-museum.webp", "alt": "정문 쪽에서 본 고궁박물원 본관", "width": 1200, "height": 800, "credit": "Gary Lee Todd, Ph.D.", "license": "CC0", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "sourceUrl": "https://commons.wikimedia.org/wiki/File:National_Palace_Museum,_Taipei_03.jpg"},
        id: "palace-museum", ko: "고궁박물원", zh: "國立故宮博物院", lat: 25.10236, lng: 121.54849,
        origin: "옛 황궁(故宮)에 전해지던 황실 소장품을 모아 둔 박물관이라 '故宮'이라는 이름이 붙었어요.",
        intro: "1965년 타이베이 外雙溪에 중국 궁전 양식으로 지어졌어요. 송·원·명·청 네 왕조의 황실 소장품을 이어받아 약 70만 점에 이르는 유물을 갖고 있어요.",
        highlights: "배추 모양 옥 조각 '翠玉白菜', 돼지고기 조각처럼 보이는 돌 '肉形石', 긴 명문이 새겨진 청동기 '毛公鼎'이 가장 인기 있는 소장품이에요. 박물관 옆 송나라풍 정원 至善園과 연못이 있는 至德園도 함께 둘러보기 좋아요.",
        season: "실내 관람이라 비 오는 날이나 한여름 낮에 가기 좋아요. 전시가 방대해서 반나절 정도는 잡는 게 좋아요.",
        access: "MRT 士林역에서 버스를 타고 故宮博物院 정류장에서 내려요.",
        sources: [
          { label: "交通部觀光署 國立故宮博物院", url: "https://www.tad.gov.tw/m1.aspx?id=74&sNo=0001016" },
          { label: "交通部觀光署 景點資料", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_379000000a_000019" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/taipei/cks-memorial.webp", "alt": "광장 끝에 선 파란 지붕의 중정기념당", "width": 1200, "height": 800, "credit": "AngMoKio", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Chiang_Kai-shek_memorial_amk.jpg"},
        id: "cks-memorial", ko: "중정기념당", zh: "中正紀念堂", lat: 25.03619, lng: 121.51868,
        origin: "1975년 세상을 떠난 蔣介石을 기리려고 지은 곳이에요. '中正'은 蔣介石의 이름이에요.",
        intro: "蔣介石이 세상을 떠난 이듬해 공사를 시작했고, 원래 육군 사령부가 있던 자리예요. 圓山大飯店을 설계한 楊卓成이 설계했고, 파란 지붕과 흰 벽으로 된 높이 70m의 기념당이 넓은 광장 끝에 서 있어요.",
        highlights: "광장 양옆에 붉은 기둥의 국가희극원(國家戲劇院)과 국가음악청(國家音樂廳)이 마주 보고 있어 정문 쪽에서 세 건물을 함께 담는 사진이 대표 구도예요. 기념당 아래층에는 전시실이 있어요.",
        season: "광장이 넓고 그늘이 적어서 아침이나 해 질 무렵이 걷기 편해요. 밤에는 건물에 조명이 들어와요.",
        access: "MRT 中正紀念堂역에서 바로 이어져요.",
        sources: [
          { label: "交通部觀光署 中正紀念堂", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_379000000a_000023" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/taipei/shilin-night-market.webp", "alt": "가게가 늘어선 스린 야시장 골목", "width": 1200, "height": 675, "credit": "Exec8", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shilin_Night_Market_02.jpg"},
        id: "shilin-night-market", ko: "스린 야시장", zh: "士林夜市", lat: 25.08787, lng: 121.52408,
        origin: "타이베이 士林 지역에 있는 야시장이라 이 이름으로 불려요. 1910년에 지어진 士林市場이 중심이에요.",
        intro: "타이베이에서 가장 큰 야시장이에요. 陽明戲院과 慈諴宮을 중심으로 골목마다 먹거리와 옷·잡화 가게가 촘촘하게 이어져요.",
        highlights: "큰 전병으로 작은 전병을 싸는 '大餅包小餅', 士林大香腸, 얼굴보다 큰 닭튀김, 바닥을 바삭하게 구운 生煎包가 대표 먹거리예요. 여러 가지를 조금씩 사서 나눠 먹으며 걷는 게 가장 재미있어요.",
        season: "해가 진 뒤 저녁부터 가장 활기가 넘쳐요.",
        access: "MRT 淡水信義線 劍潭역에서 걸어서 바로예요.",
        sources: [
          { label: "交通部觀光署 士林夜市", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=154" },
          { label: "交通部觀光署 景點資料", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_379000000a_001536" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/taipei/xiangshan.webp", "alt": "샹산에서 내려다본 타이베이 101과 시내", "width": 1200, "height": 800, "credit": "Balon Greyjoy", "license": "CC0", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "sourceUrl": "https://commons.wikimedia.org/wiki/File:20190418_Elephant_Mountain_view-3.jpg"},
        id: "xiangshan", ko: "샹산", zh: "象山", lat: 25.02738, lng: 121.57095,
        origin: "산 모양이 코끼리 머리를 닮아 '象山(코끼리산)'이라는 이름이 붙었어요.",
        intro: "해발 183m의 사암 산으로, 타이베이 동남쪽 '四獸山' 가운데 가장 높은 봉우리예요. 등산로는 약 1,450m이고 천천히 왕복하면 1시간 40분 정도 걸려요.",
        highlights: "정상 부근의 커다란 바위 여섯 개 '六巨石' 위에서 타이베이 101을 정면으로 내려다보는 풍경이 가장 유명해요. 가는 길에 정자 超然亭과 바위 틈 사이로 난 좁은 길 一線天도 지나요.",
        season: "일출, 일몰, 야경 모두 좋고, 12월 31일 밤에는 101 새해 불꽃놀이를 보려는 사람들로 붐벼요. 계단이 많아 편한 신발이 좋아요.",
        access: "MRT 象山역에서 걸어서 信義路五段150巷22弄 등산로 입구까지 갈 수 있어요.",
        sources: [
          { label: "臺北旅遊網 象山", url: "https://www.travel.taipei/zh-tw/attraction/details/185" },
          { label: "交通部觀光署 景點資料", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_379000000a_000185" }
        ],
        doobootour: false
      }
    ]
  },
  jiufen: {
    title: "신베이 꼭 가볼 곳 5곳",
    description: "지우펀, 스펀, 예류, 단수이, 진과스. 타이베이 근교 신베이 대표 관광지 5곳의 이름 유래와 볼거리, 가기 좋은 때와 가는 방법, 근처 맛집을 한 번에 정리했어요.",
    intro: "타이베이를 둘러싼 신베이에는 옛 광산 마을, 기찻길 옆 마을, 바닷가 기암, 강변 노을 명소가 모여 있어요. 관광지마다 근처에 등록된 맛집을 거리순으로 붙여 두었으니, 구경하고 바로 먹을 곳까지 정해 보세요.",
    items: [
      {
        image: {"src": "/assets/images/attractions/jiufen/jiufen.webp", "alt": "붉은 등이 줄지어 걸린 지우펀 골목", "width": 1200, "height": 900, "credit": "Another Believer", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jiufen,_November_27,_2024_-_181.jpg"},
        id: "jiufen", ko: "지우펀", zh: "九份", lat: 25.10982, lng: 121.84341,
        origin: "옛날 이곳에 녹나무를 끓여 장뇌를 만드는 솥(腦灶)이 90개 있었고, 10개를 한 몫(份)으로 나눠 아홉 몫이 됐다는 데서 '九份'이라는 이름이 왔다고 해요. 아홉 집이 살던 마을이라는 이야기도 전해져요.",
        intro: "1890년 무렵 금이 발견되면서 사람이 몰려든 광산 마을이에요. 1930년대에는 '작은 상하이(小上海)'라 불릴 만큼 번성했고, 광산이 쇠퇴한 뒤에는 1980년대 말 베니스 영화제에서 상을 받은 영화 《悲情城市》 덕분에 다시 이름이 알려졌어요.",
        highlights: "좁은 골목 基山街를 따라 먹거리와 기념품 가게가 이어지고, 돌계단 길 豎崎路에는 붉은 등이 달린 찻집들이 늘어서 있어요. 산비탈 마을이라 雞籠山과 바다가 함께 내려다보여요.",
        season: "봄에는 벚꽃, 여름에는 시원한 바람, 가을에는 억새, 겨울에는 구름과 안개가 어울린다고 소개돼요. 등이 켜지는 해 질 무렵이 가장 분위기 있어요.",
        access: "타이베이에서 버스로 가거나, 기차로 瑞芳역까지 간 뒤 버스나 택시로 올라가요.",
        sources: [
          { label: "交通部觀光署 九份", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=290" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/jiufen/shifen.webp", "alt": "커튼처럼 넓게 떨어지는 스펀 폭포", "width": 1200, "height": 803, "credit": "Suicasmo", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shifen_Waterfall_20130902.jpg"},
        id: "shifen", ko: "스펀", zh: "十分", lat: 25.04269, lng: 121.77667,
        origin: "平溪線 철도의 十分역을 중심으로 한 마을이에요. 平溪線은 원래 석탄을 실어 나르려고 놓은 철길이에요.",
        intro: "十分老街는 기찻길 바로 양옆에 가게가 붙어 있어서 기차가 마을 한가운데를 지나가요. 근처에는 '대만의 나이아가라(臺灣尼加拉瀑布)'라 불리는 커튼형 폭포 十分瀑布가 있어요.",
        highlights: "철길 위에서 소원을 적은 풍등(天燈)을 날리는 것이 대표 체험이에요. 十分瀑布는 넓은 바위 면을 따라 물이 커튼처럼 떨어지는 모습이 볼거리예요.",
        season: "정월대보름(元宵) 무렵에는 하늘 가득 풍등을 날리는 平溪天燈節이 열려요.",
        access: "기차로 瑞芳역에서 平溪線으로 갈아타고 十分역에서 내려요.",
        sources: [
          { label: "交通部觀光署 十分", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001091&id=2188" },
          { label: "交通部觀光署 十分老街", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_382000000a_110037" },
          { label: "交通部觀光署 十分瀑布", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_382000000a_111423" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/jiufen/yehliu.webp", "alt": "예류 해안의 여왕머리 바위와 관광객", "width": 1200, "height": 900, "credit": "姜 明雄", "license": "CC0", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tourists_around_the_mushroom_rock_named_Queen%27s_head_at_Yehliu_20181027.jpg"},
        id: "yehliu", ko: "예류", zh: "野柳", lat: 25.2064, lng: 121.69047,
        origin: "大屯山 줄기가 바다로 길게 뻗어 나간 곶(岬角)에 자리한 野柳 마을의 이름을 따서 불러요.",
        intro: "바닷물과 바람이 오랜 세월 바위를 깎아 버섯바위, 해식동굴, 두부처럼 갈라진 두부바위, 촛대바위, 동글게 파인 구멍(壺穴) 같은 독특한 지형이 모인 곳이에요.",
        highlights: "옆얼굴이 여왕을 닮은 버섯바위 '女王頭'가 가장 유명해요. 곶 끝까지 이어진 길을 따라 걸으며 여러 모양의 기암을 차례로 볼 수 있어요.",
        season: "바닷가라 그늘이 적어서 햇볕이 약한 오전이나 늦은 오후가 걷기 편해요.",
        access: "타이베이에서 金山·基隆 방면 버스를 타고 野柳 정류장에서 내려요.",
        sources: [
          { label: "交通部觀光署 野柳", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_382000000a_109735" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/jiufen/tamsui.webp", "alt": "단수이 옛 거리의 오래된 건물들", "width": 1200, "height": 800, "credit": "Supanut Arunoprayote", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tamsui_Old_Street_Buildings_08.23_(6).jpg"},
        id: "tamsui", ko: "단수이", zh: "淡水", lat: 25.17103, lng: 121.43855,
        origin: "淡水河가 바다로 흘러드는 하구에 자리한 항구 마을이라 강 이름을 그대로 쓰고 있어요.",
        intro: "MRT 淡水역에서 바로 中正路, 重建街, 清水街를 따라 옛 거리(淡水老街)가 이어져요. 강가를 따라 걷다 보면 국가 고적인 紅毛城까지 닿아요.",
        highlights: "老街에서 간식을 사 들고 강변 산책로를 걷다가 노을을 보는 것이 정석 코스예요. 紅毛城에서 보는 저녁노을 '戍臺夕照'는 淡水八景의 하나로 꼽혀요.",
        season: "해 질 무렵 강 위로 지는 노을이 가장 유명해요.",
        access: "MRT 淡水信義線 종점 淡水역에서 내리면 바로예요.",
        sources: [
          { label: "交通部觀光署 淡水老街", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_382000000a_109658" },
          { label: "交通部觀光署 紅毛城", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=2129" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/jiufen/jinguashi.webp", "alt": "진과스 황금박물관 공원의 유리 건물", "width": 1200, "height": 798, "credit": "CT Snow", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Gold_Museum_at_Jiufen_Taiwan_01.jpg"},
        id: "jinguashi", ko: "진과스", zh: "金瓜石", lat: 25.10796, lng: 121.85766,
        origin: "마을 뒤 바위산 모양이 호박(金瓜)을 닮아 '金瓜石'이라는 이름이 붙었어요.",
        intro: "1893~94년 무렵 금이 발견되면서 생긴 광산 마을이에요. 지우펀 바로 옆 산자락에 있어 함께 둘러보기 좋아요.",
        highlights: "2004년 11월 문을 연 黃金博物館은 옛 광산 마을 전체를 하나의 박물관처럼 보존한 생태박물관이에요. 옛 광산 시설과 일본식 숙소, 산과 바다가 어우러진 풍경을 함께 볼 수 있어요.",
        season: "산 위라 날씨가 자주 바뀌니 맑은 날을 골라 가면 바다 전망까지 볼 수 있어요.",
        access: "瑞芳역이나 지우펀에서 金瓜石 방면 버스를 타고 종점 근처에서 내려요.",
        sources: [
          { label: "交通部觀光署 金瓜石", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_382000000a_109620" },
          { label: "交通部觀光署 黃金博物館", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_382000000a_111421" }
        ],
        doobootour: false
      }
    ]
  },
  taichung: {
    title: "타이중 꼭 가볼 곳 5곳",
    description: "고미습지, 무지개마을, 펑지아 야시장, 궁원안과, 일월담. 타이중과 근교 대표 관광지 5곳의 이름 유래와 볼거리, 가기 좋은 때와 가는 방법, 근처 맛집을 한 번에 정리했어요.",
    intro: "타이중은 바닷가 습지, 벽화 마을, 대학가 야시장, 옛 건물을 살린 디저트 가게가 모여 있고, 차로 일월담까지 다녀오기 좋은 도시예요. 관광지마다 근처에 등록된 맛집을 거리순으로 붙여 두었으니, 구경하고 바로 먹을 곳까지 정해 보세요.",
    items: [
      {
        image: {"src": "/assets/images/attractions/taichung/gaomei-wetland.webp", "alt": "노을 진 고미습지 나무 데크와 풍력 발전기", "width": 1200, "height": 800, "credit": "劉柏辰 (Buslion Liu)", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Taichung_County_Gaomei_Wetlands_Wildlife_Refuge,_Buslion_Liu.jpg"},
        id: "gaomei-wetland", ko: "고미습지", zh: "高美濕地", lat: 24.31195, lng: 120.54981,
        origin: "타이중 清水區 高美 지역 바닷가에 펼쳐진 습지라 지명을 따서 불러요.",
        intro: "大甲溪 하구 남쪽에 있는 약 701.3헥타르 넓이의 습지예요. 120종이 넘는 새가 찾아오는 생태 보호구역이에요.",
        highlights: "갯벌 위로 놓인 나무 데크를 따라 걸으며 게와 새를 관찰할 수 있어요. 바다 쪽으로 늘어선 풍력 발전기 뒤로 해가 지는 풍경이 가장 유명해요. 데크는 물때에 맞춰 열려요.",
        season: "해 질 무렵 노을과 풍차가 어우러지는 시간이 가장 인기예요. 가기 전에 물때를 확인하면 좋아요.",
        access: "清水역에서 巨業 178번 버스를 타고 가요.",
        sources: [
          { label: "交通部觀光署 高美濕地", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_387000000a_000054" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/taichung/rainbow-village.webp", "alt": "알록달록한 그림으로 덮인 무지개마을 집", "width": 1200, "height": 897, "credit": "Zairon", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Taichung_Rainbow_Village_45.jpg"},
        id: "rainbow-village", ko: "무지개마을", zh: "彩虹眷村", lat: 24.13368, lng: 120.60983,
        origin: "마을 벽과 바닥이 알록달록한 그림으로 덮여 있어 '彩虹(무지개)'라는 이름이 붙었어요. 그림을 그린 黃永阜 할아버지는 '彩虹爺爺'로 불려요.",
        intro: "타이중 南屯區 春安路56巷에 있는 작은 마을이에요. 黃永阜 할아버지가 그린 그림이 골목 벽과 바닥을 가득 채우고 있어요.",
        highlights: "어디를 찍어도 색이 선명해서 사진 찍기 좋은 곳이에요. 론리플래닛이 '숨은 명소(secret wonder)'로 소개했고, 소원을 적는 DIY 기도 카드를 무료로 체험할 수 있어요.",
        season: "규모가 작아 30분~1시간이면 둘러볼 수 있어요. 햇빛이 좋은 낮에 가면 색이 가장 선명하게 나와요.",
        access: "타이중 시내에서 버스나 택시로 갈 수 있어요.",
        sources: [
          { label: "交通部觀光署 彩虹眷村", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_387000000a_000574" },
          { label: "臺中觀光旅遊網 彩虹眷村", url: "https://travel.taichung.gov.tw/zh-tw/attractions/intro/574" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/taichung/fengjia-night-market.webp", "alt": "밤에 사람들로 붐비는 펑지아 야시장 입구", "width": 1200, "height": 800, "credit": "dabing626", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Feng_Chia_Night_Market_entrance_20130417.jpg"},
        id: "fengjia-night-market", ko: "펑지아 야시장", zh: "逢甲夜市", lat: 24.17951, lng: 120.64632,
        origin: "逢甲大學 옆문 앞에 생긴 야시장이라 학교 이름을 따서 불러요.",
        intro: "文華路에서 福星路까지 이어지는 대학가 야시장이에요. 젊은 손님이 많아 새로운 먹거리가 자주 생기고, 옷과 잡화 가게도 함께 모여 있어요.",
        highlights: "여러 가게를 돌며 간식을 하나씩 맛보는 게 이곳을 즐기는 방법이에요. 먹거리와 쇼핑을 한 번에 할 수 있어요.",
        season: "해가 진 뒤 저녁부터 밤늦게까지 가장 붐벼요.",
        access: "타이중 시내에서 逢甲大學 방면 버스를 타고 가요.",
        sources: [
          { label: "交通部觀光署 逢甲夜市", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_387000000a_000039" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/taichung/miyahara.webp", "alt": "붉은 벽돌 아케이드가 있는 궁원안과 건물", "width": 1200, "height": 800, "credit": "大三可", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:%E5%8F%B0%E4%B8%AD%E5%AE%AE%E5%8E%9F%E7%9C%BC%E7%A7%91.jpg"},
        id: "miyahara", ko: "궁원안과", zh: "宮原眼科", lat: 24.13784, lng: 120.68356,
        origin: "1927년 일본인 안과 의사 宮原武熊가 지은 안과 병원이라 '宮原眼科'라는 이름이 남았어요. 당시 타이중에서 가장 큰 안과였어요.",
        intro: "옛 병원 건물을 펑리수로 유명한 日出 팀이 고쳐 디저트 가게로 운영하고 있어요. 붉은 벽돌 아케이드 외관은 그대로 살리고, 안은 도서관처럼 꾸몄어요.",
        highlights: "천장까지 닿는 책장 모양 진열대와 옛 우물을 살린 기부함이 볼거리예요. 아이스크림과 펑리수 같은 선물용 과자가 인기예요.",
        season: "실내라 날씨와 상관없이 가기 좋아요. 기차역에서 가까워 타이중에 도착하거나 떠날 때 들르기 편해요.",
        access: "타이중역에서 걸어서 갈 수 있고, 綠川 바로 옆에 있어요.",
        sources: [
          { label: "交通部觀光署 宮原眼科", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_387000000a_000793" },
          { label: "臺中觀光旅遊網 宮原眼科", url: "https://travel.taichung.gov.tw/ja/attractions/intro/1211" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/taichung/sun-moon-lake.webp", "alt": "산에 둘러싸인 일월담 호수 풍경", "width": 1200, "height": 803, "credit": "Suicasmo", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sun_Moon_Lake_20150202.jpg"},
        id: "sun-moon-lake", ko: "일월담", zh: "日月潭", lat: 23.8569, lng: 120.9156,
        origin: "호수 가운데 拉魯島를 경계로 동쪽은 해(日)처럼 둥글고 서쪽은 초승달(月)처럼 생겨 '日月潭'이라는 이름이 붙었어요. 원래 이곳에 살던 邵族은 이 호수를 Zintun이라 불러요.",
        intro: "南投縣에 있는 호수로 '대만 8경(臺灣八景)'의 하나로 꼽혀요. 타이중에서 차로 다녀오는 경우가 많아 타이중 페이지에 함께 넣었어요.",
        highlights: "호숫가 伊達邵는 邵族 마을로, 원주민 문화와 이 지역 특산 紅玉紅茶를 맛볼 수 있어요. 배를 타고 호수를 건너거나 호숫가 길을 따라 걸으며 산과 물이 어우러진 풍경을 즐겨요.",
        season: "이른 아침 호수 위에 물안개가 낄 때 특히 아름다워요. 음력 8월에는 邵族의 祖靈祭가 열려요.",
        access: "타이중 高鐵역이나 시내에서 日月潭行 버스를 타고 가요.",
        sources: [
          { label: "日月潭國家風景區 發現日月潭", url: "https://www.sunmoonlake.gov.tw/guides/ArticlesFull?a=32" },
          { label: "交通部觀光署 伊達邵", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376480000a_000382" }
        ],
        doobootour: false
      }
    ]
  },
  tainan: {
    title: "타이난 꼭 가볼 곳 5곳",
    description: "안평고보, 적감루, 선농제, 치메이 박물관, 화원 야시장. 타이난 대표 관광지 5곳의 이름 유래와 볼거리, 가기 좋은 때와 가는 방법, 근처 맛집을 한 번에 정리했어요.",
    intro: "타이난은 네덜란드 시대 성채와 청나라 때 항구 거리가 그대로 남아 있는, 대만에서 가장 오래된 도시예요. 관광지마다 근처에 등록된 맛집을 거리순으로 붙여 두었으니, 구경하고 바로 먹을 곳까지 정해 보세요.",
    items: [
      {
        image: {"src": "/assets/images/attractions/tainan/anping-fort.webp", "alt": "안평고보의 전망대와 붉은 벽돌 성벽", "width": 1200, "height": 800, "credit": "Uwe Aranas (CEphoto)", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tainan_Taiwan_Fort-Zeelandia-01.jpg"},
        id: "anping-fort", ko: "안평고보", zh: "安平古堡", lat: 23.00092, lng: 120.16062,
        origin: "1624년 이곳을 차지한 네덜란드가 지은 熱蘭遮城(질란디아 요새)이 시작이에요. 1662년 鄭成功이 빼앗은 뒤 '安平鎮'으로 이름을 바꿨고, 사람들은 '王城'이라고도 불렀어요.",
        intro: "1634년에 완공된 요새로, 지금 남아 있는 것 가운데 원래 모습 그대로인 것은 바깥 성의 남쪽 성벽뿐이에요.",
        highlights: "세월이 느껴지는 붉은 벽돌 성벽과 그 위를 덮은 오래된 반얀나무 뿌리가 대표 볼거리예요. 전망대에 오르면 安平 일대가 내려다보여요.",
        season: "타이난은 햇볕이 강해서 오전이나 늦은 오후가 둘러보기 편해요. 주변 安平老街와 묶어서 가면 좋아요.",
        access: "타이난역에서 安平 방면 버스를 타고 가요.",
        sources: [
          { label: "交通部觀光署 安平古堡", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_395000000a_000671" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/tainan/chihkan-tower.webp", "alt": "정원 너머로 보이는 적감루 누각", "width": 1200, "height": 874, "credit": "Rutger van der Maar", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Chihkan_Tower_(Fort_Provintia).jpg"},
        id: "chihkan-tower", ko: "적감루", zh: "赤崁樓", lat: 22.99722, lng: 120.20242,
        origin: "1652년 네덜란드가 지은 普羅民遮城(프로방시아 요새)에서 시작됐어요.",
        intro: "타이난 시내 한가운데 있는 유적으로, 네덜란드 시대 요새 터 위에 뒤에 지어진 중국식 누각들이 서 있어요.",
        highlights: "海神廟와 文昌閣 두 누각, 蓬壺書院이 볼거리예요. 거북처럼 생긴 전설의 동물 贔屭가 등에 지고 있는 비석 아홉 개도 유명해요.",
        season: "저녁에 조명이 들어오면 낮과 다른 분위기를 즐길 수 있어요.",
        access: "타이난역에서 걸어서 약 15~20분이에요.",
        sources: [
          { label: "交通部觀光署 赤崁樓", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_395000000a_000674" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/tainan/shennong-street.webp", "alt": "저녁 조명이 켜진 선농제 옛 골목", "width": 1200, "height": 900, "credit": "Tze Chiang Hao", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:%E7%A5%9E%E8%BE%B2%E8%A1%97_Shennong_Street_Tainan_City02.jpg"},
        id: "shennong-street", ko: "선농제", zh: "神農街", lat: 22.99757, lng: 120.19655,
        origin: "청나라 때 타이난의 강 항구 '五條港'으로 들어오는 입구에 자리한 거리로, 배에서 내린 상인들이 오가던 길이에요.",
        intro: "좁은 골목을 따라 오래된 2층 목조 가옥이 그대로 남아 있고, 지금은 그 안에 작은 카페와 공방, 가게가 들어와 있어요.",
        highlights: "옛 가옥의 나무 문과 창, 처마에 매단 등을 보며 천천히 걷는 것이 이 골목을 즐기는 방법이에요.",
        season: "등이 켜지는 저녁에 가면 골목 분위기가 가장 좋아요.",
        access: "타이난 시내 중심에서 걸어서 갈 수 있어요. 적감루에서도 멀지 않아요.",
        sources: [
          { label: "交通部觀光署 神農街", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_395000000a_001351" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/tainan/chimei-museum.webp", "alt": "밤에 조명이 켜진 치메이 박물관", "width": 1200, "height": 721, "credit": "Deon", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Chimei_Museum_20190210_(cropped).jpg"},
        id: "chimei-museum", ko: "치메이 박물관", zh: "奇美博物館", lat: 22.93482, lng: 120.22619,
        origin: "대만 기업 奇美가 세운 박물관이라 회사 이름을 따서 불러요.",
        intro: "유럽 궁전풍 외관의 박물관이에요. 둥근 돔이 올라간 정면과 넓은 정원이 어우러져 있어요.",
        highlights: "아폴론 분수, 올림포스 신들의 조각이 늘어선 해자 위 다리, 프랑스 조각가 Louis-Ernest Barrias의 작품을 본뜬 '榮耀天使' 조각이 정원의 볼거리예요.",
        season: "실내 관람은 날씨와 상관없고, 정원 사진은 맑은 날 오후 햇빛이 정면을 비출 때 예뻐요.",
        access: "타이난역에서 기차로 保安역까지 가서 걷거나, 시내에서 차로 가요.",
        sources: [
          { label: "交通部觀光署 奇美博物館", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_395000000a_000572" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/tainan/garden-night-market.webp", "alt": "간판과 사람들로 북적이는 화원 야시장", "width": 1200, "height": 803, "credit": "褒忠國中 雲端網", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_Garden_Night_Market_in_Tainan_2014-05-29.jpg"},
        id: "garden-night-market", ko: "화원 야시장", zh: "花園夜市", lat: 23.0108, lng: 120.2003,
        origin: "1999년에 시작해 2005년 지금의 海安路와 和緯路 자리로 옮겨 왔어요.",
        intro: "타이난에서 가장 큰 야시장이에요. 넓은 공터에 먹거리와 놀거리, 잡화 구역이 나뉘어 있어요.",
        highlights: "가게마다 높이 세운 깃발이 바다처럼 펄럭이는 '旗海'가 이 야시장의 상징이에요. 타이난 간식과 야시장 먹거리를 한자리에서 골라 먹을 수 있어요.",
        season: "매일 열지 않고 주말 위주로 정해진 요일에만 열려요. 가기 전에 요일을 꼭 확인하세요.",
        access: "타이난 시내에서 버스나 택시로 가요.",
        sources: [
          { label: "臺南旅遊網 花園夜市", url: "https://www.twtainan.net/zh-tw/attractions/detail/5572" }
        ],
        doobootour: false
      }
    ]
  },
  kaohsiung: {
    title: "가오슝 꼭 가볼 곳 5곳",
    description: "보얼 예술특구, 연지담 용호탑, 치진, 류허 야시장, 불광산. 가오슝 대표 관광지 5곳의 이름 유래와 볼거리, 가기 좋은 때와 가는 방법, 근처 맛집을 한 번에 정리했어요.",
    intro: "가오슝은 항구 창고를 살린 예술 거리, 호수 위 탑, 페리로 건너는 섬, 야시장과 큰 사찰이 모인 남부의 항구 도시예요. 관광지마다 근처에 등록된 맛집을 거리순으로 붙여 두었으니, 구경하고 바로 먹을 곳까지 정해 보세요.",
    items: [
      {
        image: {"src": "/assets/images/attractions/kaohsiung/pier2.webp", "alt": "보얼 예술특구 창고 앞 산책길", "width": 1200, "height": 800, "credit": "ABOVE THE SKY", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_Pier-2_Art_Center_2020070901.jpg"},
        id: "pier2", ko: "보얼", zh: "駁二藝術特區", lat: 22.620005, lng: 120.2816,
        origin: "가오슝항 옆 옛 항구 창고 지대를 예술 공간으로 바꾼 곳이에요.",
        intro: "愛河가 항구와 만나는 鹽埕埔 바닷가의 옛 항구 창고들을 2000년부터 예술 공간으로 바꿨어요. 大義, 大勇, 蓬萊 세 구역에 걸쳐 창고 25동이 이어져 있어요.",
        highlights: "창고마다 전시와 공방, 가게가 들어서 있고, 바깥 공터에는 큰 설치 작품들이 놓여 있어요. 옛 철길을 살린 西臨港線 자전거길을 따라 바닷가를 달리기도 좋아요.",
        season: "낮에는 그늘이 적어서 해가 기우는 늦은 오후부터 저녁까지가 걷기 좋아요.",
        access: "가오슝 경전철(輕軌) 駁二大義역·駁二蓬萊역이나 MRT 鹽埕埔역에서 걸어서 갈 수 있어요.",
        sources: [
          { label: "交通部觀光署 駁二藝術特區", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=A12-00229" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/kaohsiung/lotus-pond.webp", "alt": "연지담 위에 선 용호탑 쌍탑", "width": 1200, "height": 800, "credit": "Uwe Aranas (CEphoto)", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kaohsiung_Taiwan_Dragon-and-Tiger-Pagodas-01.jpg"},
        id: "lotus-pond", ko: "연지담 용호탑", zh: "蓮池潭 龍虎塔", lat: 22.6779, lng: 120.2955,
        origin: "옛 이름은 '蓮花潭'으로, 연꽃이 많아 붙은 이름이에요. 청나라 때 연꽃 향을 노래한 '泮水荷香'이 鳳山八景의 하나로 꼽혔어요.",
        intro: "가오슝 左營에 있는 약 42헥타르 넓이의 호수예요. 호숫가를 따라 크고 작은 사원과 탑이 늘어서 있어요.",
        highlights: "7층짜리 쌍탑 龍虎塔은 용의 입으로 들어가 호랑이 입으로 나오도록 되어 있고, 지그재그 다리 九曲橋로 호수 위를 건너가요. 1953년에 지은 春秋閣도 함께 볼 수 있어요.",
        season: "호수 위로 지는 노을 '蓮潭夕照'가 유명해서 해 질 무렵이 좋아요.",
        access: "高鐵·臺鐵 新左營역이나 臺鐵 左營(舊城)역에서 버스나 택시로 가까워요.",
        sources: [
          { label: "交通部觀光署 蓮池潭", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=2149" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/kaohsiung/cijin.webp", "alt": "치허우산에서 내려다본 치진 야경", "width": 1200, "height": 798, "credit": "Peellden", "license": "CC BY 3.0", "licenseUrl": "https://creativecommons.org/licenses/by/3.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Cijin_District_view_from_Mt_QiHou.jpg"},
        id: "cijin", ko: "치진", zh: "旗津", lat: 22.61552, lng: 120.26471,
        origin: "옛 이름은 '旗後'예요. 가오슝항 바깥쪽에 길고 좁게 뻗은 섬이에요.",
        intro: "가오슝 시내에서 페리나 해저터널(過港隧道)로 건너가는 섬이에요. 약 300년 된 旗津天后宮은 가오슝에서 처음 세운 마조(媽祖) 사당이에요.",
        highlights: "1883년 영국인 기술자가 지은 旗後燈塔과 旗後砲台에 오르면 항구와 바다가 한눈에 보여요. 해산물 거리, 바닷가 공원, 조개 박물관도 함께 둘러볼 수 있어요.",
        season: "해 질 무렵 해변과 등대 언덕에서 보는 노을이 좋아요.",
        access: "鼓山 페리 선착장에서 배를 타면 약 5분이면 旗津에 닿아요.",
        sources: [
          { label: "交通部觀光署 旗津", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=A12-00075" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/kaohsiung/liuhe-night-market.webp", "alt": "밤에 노점이 늘어선 류허 야시장 거리", "width": 1200, "height": 900, "credit": "Chainwit.", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kaohsiung-_Liuhe_Night_Market_-_%E5%85%AD%E5%90%88%E5%A4%9C%E5%B8%82_(2026)_-_img_07.jpg"},
        id: "liuhe-night-market", ko: "류허 야시장", zh: "六合夜市", lat: 22.6317, lng: 120.2995,
        origin: "1950년 무렵 大港埔 일대에 먹거리 노점이 모이면서 시작된 야시장이에요.",
        intro: "낮에는 보통 차가 다니는 길이고, 밤이 되면 노점이 펼쳐지는 야시장으로 바뀌어요.",
        highlights: "철판 스테이크와 해산물, 파파야 우유(木瓜牛奶), 소금에 쪄 낸 새우가 대표 먹거리예요.",
        season: "해가 진 뒤 저녁부터 가장 활기가 넘쳐요.",
        access: "MRT 美麗島역에서 걸어서 바로이고, 가오슝역에서 中山路를 따라 걸어서 10여 분이에요.",
        sources: [
          { label: "交通部觀光署 六合夜市", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=2245" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/kaohsiung/fo-guang-shan.webp", "alt": "하늘에서 본 불광산 불타기념관과 대불", "width": 1200, "height": 800, "credit": "Huicheng1967", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Fo_Guang_Shan_Buddha_Museum_%E4%BD%9B%E5%85%89%E5%B1%B1%E4%BD%9B%E9%99%80%E7%B4%80%E5%BF%B5%E9%A4%A8_.jpg"},
        id: "fo-guang-shan", ko: "불광산", zh: "佛光山", lat: 22.7474, lng: 120.44612,
        origin: "1967년 星雲法師가 가오슝 大樹區 산자락에 세운 불교 사찰이에요.",
        intro: "高屏溪 오른쪽 기슭에 50헥타르 넘게 펼쳐진 대규모 사찰이에요. 2011년에는 바로 옆에 佛陀紀念館이 문을 열었어요.",
        highlights: "佛陀紀念館은 넓은 길 양옆으로 탑이 늘어서고 끝에 커다란 불상이 앉아 있는 모습이 장관이에요. 전시관과 사찰 건물을 함께 둘러볼 수 있어요.",
        season: "넓어서 걸을 일이 많으니 햇볕이 약한 오전이나 늦은 오후가 편해요.",
        access: "高鐵 左營역이나 가오슝 시내에서 佛光山행 버스를 타고 가요.",
        sources: [
          { label: "交通部觀光署 佛光山", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_397000000a_000026" },
          { label: "交通部觀光署 佛陀紀念館", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_397000000a_000579" }
        ],
        doobootour: false
      }
    ]
  },
  yilan: {
    title: "이란 꼭 가볼 곳 5곳",
    description: "뤄둥 야시장, 전통예술센터, 자오시 온천, 구이산섬, 타이핑산. 이란 대표 관광지 5곳의 이름 유래와 볼거리, 가기 좋은 때와 가는 방법, 근처 맛집을 한 번에 정리했어요.",
    intro: "이란은 타이베이에서 가까우면서도 야시장, 온천, 바다 위 화산섬, 산속 숲이 모두 있는 곳이에요. 관광지마다 근처에 등록된 맛집을 거리순으로 붙여 두었으니, 구경하고 바로 먹을 곳까지 정해 보세요.",
    items: [
      {
        image: {"src": "/assets/images/attractions/yilan/luodong-night-market.webp", "alt": "사람들로 붐비는 뤄둥 야시장", "width": 1200, "height": 676, "credit": "tomscoffin", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:2014-01-29_Luodong_Night_Market_01.jpg"},
        id: "luodong-night-market", ko: "뤄둥 야시장", zh: "羅東夜市", lat: 24.67704, lng: 121.76931,
        origin: "이란 羅東鎮 中山公園 둘레에 열리는 야시장이라 지명을 따서 불러요.",
        intro: "中山公園을 둘러싼 民生路, 民權路, 公園路, 興東路 일대에 먹거리 가게와 노점이 모여 있어요.",
        highlights: "이란 지역 간식과 야시장 먹거리를 한 바퀴 돌며 맛보는 게 이곳을 즐기는 방법이에요. 공원 옆이라 사 온 음식을 들고 잠시 쉬기도 좋아요.",
        season: "해가 진 뒤 저녁부터 가장 붐벼요.",
        access: "羅東역에서 걸어서 갈 수 있어요.",
        sources: [
          { label: "交通部觀光署 羅東夜市", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376420000a_000246" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/yilan/traditional-arts.webp", "alt": "전통예술센터의 붉은 지붕 전통 무대", "width": 1200, "height": 859, "credit": "Bernard Gagnon", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:National_Center_for_Traditional_Arts_01.jpg"},
        id: "traditional-arts", ko: "전통예술센터", zh: "國立傳統藝術中心", lat: 24.68558, lng: 121.8241,
        origin: "대만 전통 예술을 보존하고 알리려고 만든 국립 문화 공간이라 이 이름이 붙었어요.",
        intro: "冬山河 강가에 親水公園과 마주 보고 있어요. 옛 거리를 재현한 단지 안에 공방과 전시관, 공연장이 모여 있어요.",
        highlights: "傳藝老街에서는 전통 공예 시연을 보고 직접 체험해 볼 수 있어요. 옛 저택 黃舉人宅, 사당 文昌祠, 전통 공연을 하는 曲藝館도 볼거리예요.",
        season: "공연과 체험 일정이 있는 날 맞춰 가면 더 즐겁게 둘러볼 수 있어요.",
        access: "羅東역에서 台灣好行 綠21번 버스나 葛瑪蘭 621번 버스를 타고 가요.",
        sources: [
          { label: "交通部觀光署 國立傳統藝術中心", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_a15011300h_010087" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/yilan/jiaoxi.webp", "alt": "나무 사이로 보이는 자오시 온천 공원 입구", "width": 1200, "height": 675, "credit": "Yu tptw", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:%E7%A4%81%E6%BA%AA%E6%BA%AB%E6%B3%89%E5%85%AC%E5%9C%92%E5%85%A5%E5%8F%A3.jpg"},
        id: "jiaoxi", ko: "자오시 온천", zh: "礁溪溫泉", lat: 24.8288, lng: 121.77366,
        origin: "이란 礁溪鄉에서 솟는 온천이라 지명을 따서 불러요.",
        intro: "평지에서 솟는 보기 드문 탄산수소나트륨 온천이에요. 수온은 약 58℃이고 물이 맑고 냄새가 거의 없어요.",
        highlights: "礁溪역 근처에 온천 공원과 광장, 표석이 있어 무료 족욕부터 온천 호텔까지 기차역에서 걸어서 즐길 수 있어요.",
        season: "선선한 가을과 겨울에 특히 인기가 많아요.",
        access: "기차로 礁溪역에서 내리면 바로 온천 거리예요. 타이베이에서 버스로도 자주 다녀요.",
        sources: [
          { label: "交通部觀光署 礁溪溫泉", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=614" },
          { label: "交通部觀光署 景點資料", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376420000a_000090" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/yilan/guishan-island.webp", "alt": "터우청 바다 위로 보이는 구이산섬", "width": 1200, "height": 828, "credit": "Ma7ged", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Guishan_Island_from_Toucheng.jpg"},
        id: "guishan-island", ko: "구이산섬", zh: "龜山島", lat: 24.84241, lng: 121.95014,
        origin: "바다에 떠 있는 모습이 거북(龜)을 닮아 '龜山島'라는 이름이 붙었어요.",
        intro: "頭城 동쪽 바다 약 10km에 떠 있는 활화산 섬이에요. 이란 해안 어디서나 보이는 이란의 상징이에요.",
        highlights: "섬 둘레를 배로 돌며 기암과 바다 풍경 '龜山八景'을 보는 것이 대표 코스예요. 섬 위 401高地까지는 1,706개 계단이 이어져요.",
        season: "4월부터 9월까지는 배를 타고 고래와 돌고래를 보러 나가기 좋은 때예요.",
        access: "頭城 烏石港에서 배를 타고 가요.",
        sources: [
          { label: "交通部觀光署 龜山島", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376420000a_000348" },
          { label: "交通部觀光署 景點資料", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_a15011300h_010073" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/yilan/taipingshan.webp", "alt": "숲에 둘러싸인 타이핑산 산림철도 역", "width": 1200, "height": 675, "credit": "Bob Tan", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Taiping_Mountain%27s_Forest_Railway_Station.jpg"},
        id: "taipingshan", ko: "타이핑산", zh: "太平山", lat: 24.5574677, lng: 121.4995,
        origin: "옛 이름은 타이얄족 말로 '울창하다'는 뜻의 '眠腦'였어요. 뒤에 中里正이 '天下太平'에서 따와 '太平山'이라 이름 붙였어요.",
        intro: "1915년부터 벌목이 이뤄지던 산으로, 1983년 국가 삼림 휴양지로 바뀌었어요.",
        highlights: "옛 산림 철도를 달리는 작은 기차 '蹦蹦車'와 숲길 見晴步道가 대표 볼거리예요. 해발 1,840m의 翠峰湖는 대만에서 가장 큰 고산 호수이고, 산 아래 鳩之澤에서는 탄산 온천을 즐길 수 있어요.",
        season: "가을에는 너도밤나무(山毛櫸)가 노랗게 물들어요. 산 위는 평지보다 많이 서늘하니 겉옷을 챙기세요.",
        access: "이란역이나 羅東역에서 國光客運 1750번 버스를 타고 가요.",
        sources: [
          { label: "交通部觀光署 太平山國家森林遊樂區", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_345040000g_000001" }
        ],
        doobootour: false
      }
    ]
  },
  kenting: {
    region: { id: "kenting", ko: "컨딩" },
    title: "컨딩 꼭 가볼 곳 5곳",
    description: "컨딩, 어롼비 등대, 룽판 공원, 백사만, 해양생물박물관. 대만 최남단 컨딩 대표 관광지 5곳의 이름 유래와 볼거리, 가기 좋은 때와 가는 방법, 근처 맛집을 한 번에 정리했어요.",
    intro: "컨딩은 대만 본섬 가장 남쪽 끝, 산호초가 솟아 생긴 해안과 바다가 어우러진 곳이에요. 관광지마다 근처에 등록된 맛집이 있으면 거리순으로 붙여 두었어요.",
    items: [
      {
        image: {"src": "/assets/images/attractions/kenting/kenting.webp", "alt": "컨딩 해변의 모래사장과 파도", "width": 1200, "height": 800, "credit": "lienyuan lee", "license": "CC BY 3.0", "licenseUrl": "https://creativecommons.org/licenses/by/3.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:%E5%A2%BE%E4%B8%81%E6%B5%B7%E7%81%98_Kending_Beach_-_panoramio.jpg"},
        id: "kenting", ko: "컨딩", zh: "墾丁", lat: 21.9446, lng: 120.7966,
        origin: "대만 최남단 恆春반도 끝자락 마을 '墾丁'의 이름이 이 일대 국가공원 이름이 됐어요.",
        intro: "바다에서 솟아오른 산호초 위에 숲이 자란 독특한 지형이 국가공원으로 보호되고 있어요. 1906년에 문을 연 恆春 열대식물원이 지금의 墾丁 삼림 휴양지가 됐어요.",
        highlights: "밤이면 노점과 가게가 늘어서는 墾丁大街가 이 일대의 야시장 거리예요. '大灣'이라 불리는 墾丁 해수욕장에서 바다를 즐기고, 삼림 휴양지에서 산호초 숲길을 걸을 수 있어요.",
        season: "10월에는 회색얼굴수리매(灰面鵟鷹)가 무리 지어 날아드는 모습을 볼 수 있어요.",
        access: "高鐵 左營역에서 墾丁快線 9188번이나 9189번 버스를 타고 墾丁에서 내려요.",
        sources: [
          { label: "交通部觀光署 墾丁國家公園", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=421" },
          { label: "交通部觀光署 墾丁國家森林遊樂區", url: "https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_345040000g_000014" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/kenting/eluanbi.webp", "alt": "푸른 하늘 아래 흰 어롼비 등대", "width": 1200, "height": 800, "credit": "Suicasmo", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Eluanbi_Lighthouse_20240918-1.jpg"},
        id: "eluanbi", ko: "어롼비 등대", zh: "鵝鑾鼻燈塔", lat: 21.9022, lng: 120.8526,
        origin: "屏東 鵝鑾鼻 곶(岬角)에 서 있어서 곶 이름을 따서 불러요.",
        intro: "1881년에 세운 흰 철탑 등대로, 대만 본섬에서 가장 남쪽에 있는 등대예요. 포대처럼 쌓은 담에 총안을 내고 둘레에 해자를 판, 대만에서 하나뿐인 무장 등대예요.",
        highlights: "1962년 성능을 높인 뒤 '동아시아의 빛(東亞之光)'으로 불렸고, '대만 8경(臺灣八景)'의 하나로 꼽혀요. 1992년부터 일반에 공개돼 등대 주변 공원을 산책하며 바다를 볼 수 있어요.",
        season: "맑은 날 오후 햇빛 아래 흰 등대와 파란 하늘이 가장 선명해요.",
        access: "墾丁에서 차나 墾丁街車로 남쪽 끝까지 가요.",
        sources: [
          { label: "交通部觀光署 鵝鑾鼻燈塔", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=A12-00181" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/kenting/longpan.webp", "alt": "룽판 공원 석회암 언덕과 태평양", "width": 1200, "height": 900, "credit": "Tbatb", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Scene_at_Longpan_Park.jpg"},
        id: "longpan", ko: "룽판 공원", zh: "龍磐公園", lat: 21.9286, lng: 120.8547,
        origin: "鵝鑾鼻와 風吹砂 사이 바닷가 언덕에 자리한 공원이에요.",
        intro: "솟아오른 석회암 대지가 바다와 만나는 곳이라, 깎아지른 절벽과 땅이 꺼진 구멍(滲穴), 동굴, 붉은 흙 같은 지형을 볼 수 있어요.",
        highlights: "탁 트인 풀밭 끝에서 태평양을 내려다보는 풍경이 이곳의 하이라이트예요. 하루 종일 열려 있어 별이나 해돋이를 보러 오는 사람도 많아요.",
        season: "동쪽 바다를 마주하고 있어 해 뜰 무렵이 특히 좋아요. 바람이 세게 부는 날이 많아요.",
        access: "佳鵝公路(台26線)를 따라 차로 가요.",
        sources: [
          { label: "交通部觀光署 龍磐公園", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=A12-00502" },
          { label: "墾丁國家公園管理處", url: "https://www.ktnp.gov.tw/" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/kenting/baisha-bay.webp", "alt": "컨딩 백사만의 맑은 바다와 산호 바위", "width": 1200, "height": 675, "credit": "黃鈞奕", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kenting_National_Park_Baishawan.jpg"},
        id: "baisha-bay", ko: "백사만", zh: "白砂灣", lat: 21.9406, lng: 120.7128,
        origin: "조개껍데기가 부서져 생긴 흰 모래(白砂) 해변이라 '白砂灣(白沙灣)'이라는 이름이 붙었어요. 신베이의 같은 이름 해변과는 다른 곳이에요.",
        intro: "恆春반도 서쪽에 있는 약 500m 길이의 흰 모래 해변이에요. 영화 《海角七號》를 찍은 곳으로도 알려져 있어요.",
        highlights: "북동 계절풍을 막아 주는 지형이라 파도가 비교적 잔잔해서 물놀이하기 좋아요. 맑은 바다색과 흰 모래가 대비되는 풍경이 아름다워요.",
        season: "서쪽 바다를 마주하고 있어 해 질 무렵 노을이 좋아요.",
        access: "墾丁街車 藍線을 타거나 차로 가요.",
        sources: [
          { label: "屏東縣恆春鎮公所 白砂灣", url: "https://www.pthg.gov.tw/townhengchuen/cp.aspx?n=E3BCC84A0709DF36&s=8CC0C8D26CB15B29" }
        ],
        doobootour: false
      },
      {
        image: {"src": "/assets/images/attractions/kenting/nmmba.webp", "alt": "해양생물박물관 앞 분수 광장과 고래 조각", "width": 1200, "height": 793, "credit": "Bernard Gagnon", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pacific_Dabbling_Plaza,_National_Museum_of_Marine_Biology_and_Aquarium_20110607.jpg"},
        id: "nmmba", ko: "해양생물박물관", zh: "國立海洋生物博物館", lat: 22.047071, lng: 120.69877,
        origin: "해양 생물을 전시하고 연구하는 국립 박물관이라 이 이름이 붙었어요.",
        intro: "屏東 車城鄉 後灣路2號에 있는 대형 수족관이에요. 臺灣水域館, 珊瑚王國館, 世界水域館 세 관으로 나뉘어 있어요.",
        highlights: "흰고래(벨루가)와 펭귄이 인기이고, 대왕고래 뼈 전시도 볼 수 있어요. 미쉐린 그린 가이드에서 별 3개를 받았어요.",
        season: "실내 관람이라 비 오는 날이나 한여름 낮에 가기 좋아요.",
        access: "高鐵 左營역에서 墾丁 방면 버스를 타고 가거나 차로 가요.",
        sources: [
          { label: "交通部觀光署 國立海洋生物博物館", url: "https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=2242" }
        ],
        doobootour: false
      }
    ]
  }
};
