#!/usr/bin/env node
// 맛집 상세 페이지 보강 데이터 자동 생성기.
// 저장된 "정확한 구글맵 업체 링크"(place id가 있는 링크)로 구글 지도 업체 정보를 읽어
// 주소·영업시간·휴무일·가까운 MRT역·대표 메뉴·1인 가격대·정보형 소개를 scripts/data/spot-enrichment.json에 채운다.
//
// 규칙 (Chris 확정, 2026-11-11):
//  - 확인된 정확한 구글맵 업체 정보만 쓴다. 업체 정보를 못 읽거나, 구글 좌표가 등록 좌표와 1.5km 넘게 다르거나,
//    폐업·휴업 표시가 있으면 보강하지 않고 보고서에 남긴다.
//  - 대표 메뉴는 구글 리뷰에서 많이 언급된 메뉴(zh-TW 언급 수)만. 없으면 가게 이름에 들어 있는 메뉴, 그것도 없으면 비움.
//  - 메뉴별 가격은 넣지 않는다. 1인 가격대는 구글 리뷰 작성자 보고가 2건 이상 같은 구간일 때만.
//  - 소개는 위 사실만으로 만든 정보형 문장. 후기·평가 표현 금지.
//  - 이미 있는 항목(method=manual 포함)은 --force 없이는 건드리지 않는다.
//
// 사용법은 docs/spot-enrichment.md 참고.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const DEFAULT_DATA_PATH = path.join(__dirname, "data/spot-enrichment.json");
const STATIONS = JSON.parse(fs.readFileSync(path.join(__dirname, "data/mrt-stations.json"), "utf8")).stations;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const MRT_MAX_M = 1200;
const MAX_COORD_DRIFT_M = 1500;
const MIN_MENU_MENTIONS = 5;

/* ---------- CLI ---------- */
const args = process.argv.slice(2);
const opt = name => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const flag = name => args.includes(`--${name}`);
const OPT = {
  regions: opt("regions") ? opt("regions").split(",") : null,
  ids: opt("ids") ? new Set(opt("ids").split(",").map(Number)) : null,
  limit: opt("limit") ? Number(opt("limit")) : Infinity,
  force: flag("force"),
  dryRun: flag("dry-run"),
  cacheDir: opt("cache-dir") || null,
  report: opt("report") || null,
  delayMs: opt("delay-ms") ? Number(opt("delay-ms")) : 1200,
  dataPath: opt("data") ? path.resolve(opt("data")) : DEFAULT_DATA_PATH,
  checkedAt: opt("checked-at") || new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10),
};

/* ---------- site data ---------- */
function loadGlobals(files) {
  const code = files.map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n").replace(/\bconst\b/g, "var").replace(/\blet\b/g, "var");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox;
}
const { REGIONS, CATEGORIES } = loadGlobals(["js/data.js"]);
const REGION_BY_ID = Object.fromEntries(REGIONS.map(r => [r.id, r]));
const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const { hasPlaceIdentity } = require("./lib/google-maps-url");

const cfg = fs.readFileSync(path.join(root, "js/supabase-config.js"), "utf8");
const SUPABASE_URL = cfg.match(/SUPABASE_URL\s*=\s*"([^"]+)"/)[1];
const SUPABASE_ANON_KEY = cfg.match(/SUPABASE_ANON_KEY\s*=\s*"([^"]+)"/)[1];

async function fetchAllSpots() {
  const all = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/eats?select=id,lat,lng,category,region,review,name,link&order=id.asc`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, Range: `${from}-${from + 999}` },
    });
    if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
    const chunk = await res.json();
    all.push(...chunk);
    if (chunk.length < 1000) break;
  }
  return all;
}

/* ---------- Google place fetch ---------- */
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, lang) {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": lang }, redirect: "follow" });
  return { text: await res.text(), url: res.url, status: res.status };
}
function withHl(url, hl) {
  const u = new URL(url);
  u.searchParams.set("hl", hl);
  return u.toString();
}
async function fetchPlace(spot, hl) {
  const cacheFile = OPT.cacheDir && path.join(OPT.cacheDir, `${spot.id}.${hl}.json`);
  if (cacheFile && fs.existsSync(cacheFile) && fs.statSync(cacheFile).size > 1000) return fs.readFileSync(cacheFile, "utf8");
  const first = await get(spot.link, hl === "ko" ? "ko" : "zh-TW");
  const page = await get(withHl(first.url, hl), hl === "ko" ? "ko" : "zh-TW");
  const m = page.text.match(/\/maps\/preview\/place\?[^"]+/);
  if (!m) return null;
  const previewUrl = "https://www.google.com" + m[0].replace(/&amp;/g, "&");
  const preview = await get(previewUrl, hl === "ko" ? "ko" : "zh-TW");
  if (cacheFile) {
    fs.mkdirSync(OPT.cacheDir, { recursive: true });
    fs.writeFileSync(cacheFile, preview.text);
  }
  return preview.text;
}

/* ---------- parse ---------- */
const g = (o, ...ix) => {
  for (const i of ix) {
    if (o == null) return null;
    o = o[i];
  }
  return o == null ? null : o;
};
function walk(o, fn, p = []) {
  if (typeof o === "string") fn(o, p);
  else if (Array.isArray(o)) o.forEach((v, i) => walk(v, fn, p.concat(i)));
}
function parsePreview(raw) {
  if (!raw) return null;
  let d;
  try {
    d = JSON.parse(raw.slice(raw.indexOf("\n") + 1));
  } catch (_) {
    return null;
  }
  const p = d && d[6];
  if (!p || !g(p, 11)) return null;
  const hours = (g(p, 203, 0) || []).map(day => ({
    dow: day[1],
    text: (day[3] || []).map(t => t[0]).join(", "),
    spans: (day[3] || []).map(t => g(t, 1)).filter(Boolean),
  }));
  const prices = {};
  walk(p, (s, pa) => {
    if (pa[0] === 175 && pa[1] === 9 && /^NT\$[\d,]+~[\d,]+$|^NT\$[\d,]+ (이상|以上)$/.test(s)) prices[s] = (prices[s] || 0) + 1;
  });
  const topics = (g(p, 153, 0) || []).map(t => ({ term: g(t, 1), mentions: g(t, 3, 4) || 0 })).filter(t => t.term);
  return {
    name: g(p, 11), nameAlt: g(p, 101), rating: g(p, 4, 7), reviews: g(p, 4, 8),
    addrZh: g(p, 149), addrEn: g(p, 18), types: g(p, 13) || [], lat: g(p, 9, 2), lng: g(p, 9, 3),
    placeId: g(p, 78), status: g(p, 203, 1, 4, 0) || "", hours, prices, topics,
  };
}

/* ---------- helpers ---------- */
function meters(a, b, c, d) {
  const R = 6371000, toR = x => (x * Math.PI) / 180;
  const h = Math.sin(toR(c - a) / 2) ** 2 + Math.cos(toR(a)) * Math.cos(toR(c)) * Math.sin(toR(d - b) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const hasBatchim = s => {
  const m = String(s).replace(/\([^)]*\)/g, "").match(/[가-힣](?=[^가-힣]*$)/);
  if (!m) return null;
  return (m[0].charCodeAt(0) - 0xac00) % 28 !== 0;
};
const endsHangul = s => /[가-힣]$/.test(String(s).replace(/\([^)]*\)$/, "").trim());
const DOW = ["월", "화", "수", "목", "금", "토", "일"];

function hoursSummary(hours) {
  if (!hours.length) return { summary: [], closed: null, lateNight: false };
  const byDow = Object.fromEntries(hours.map(h => [h.dow, h]));
  const isClosed = t => !t || /휴무|休息/.test(t);
  const closed = [1, 2, 3, 4, 5, 6, 7].filter(d => isClosed(byDow[d] && byDow[d].text)).map(d => `${DOW[d - 1]}요일`);
  const groups = [];
  for (let d = 1; d <= 7; d++) {
    const t = byDow[d] && byDow[d].text;
    if (isClosed(t)) continue;
    const last = groups[groups.length - 1];
    if (last && last.t === t && last.b === d - 1) last.b = d;
    else groups.push({ a: d, b: d, t });
  }
  const summary = groups.map(({ a, b, t }) => `${a === 1 && b === 7 ? "매일" : a === b ? DOW[a - 1] : `${DOW[a - 1]}~${DOW[b - 1]}`} ${t}`);
  // 자정을 넘겨 닫는 날(닫는 시각이 여는 시각보다 이르거나 24시간)
  const lateNight = hours.some(h => /24시간/.test(h.text) || h.spans.some(s => {
    const o = (s[0] && s[0][0]) || 0, c = (s[1] && s[1][0]) != null ? s[1][0] : null;
    return c != null && c < o && c > 0;
  }));
  return { summary, closed: closed.length ? closed.join(", ") : "없음(매일 영업)", closedList: closed, lateNight };
}

function priceRange(prices) {
  const c = {};
  for (const [k, v] of Object.entries(prices)) {
    const key = k.replace("NT$", "").replace("以上", "이상");
    c[key] = (c[key] || 0) + v;
  }
  const total = Object.values(c).reduce((a, b) => a + b, 0);
  if (total < 2) return null;
  const top = Math.max(...Object.values(c));
  if (top < 2) return null;
  const modes = Object.keys(c).filter(k => c[k] === top);
  const rs = modes.map(k => (/이상/.test(k) ? [Number(k.split(" ")[0].replace(/,/g, "")), null] : k.split("~").map(x => Number(x.replace(/,/g, "")))));
  const lo = Math.min(...rs.map(r => r[0]));
  const his = rs.map(r => r[1]);
  if (his.includes(null)) return { text: `1인 NT$${lo.toLocaleString("en")} 이상 (구글 리뷰 작성자 보고 기준)`, schema: `NT$${lo}+` };
  const hi = Math.max(...his);
  const text = lo <= 1 ? `1인 NT$${hi.toLocaleString("en")} 이하` : `1인 약 NT$${lo.toLocaleString("en")}~${hi.toLocaleString("en")}`;
  return { text: `${text} (구글 리뷰 작성자 보고 기준)`, schema: `NT$${Math.max(lo, 1)}-${hi}` };
}

/* 리뷰 언급 메뉴 필터: 음식 이름으로 보이는 말만 남기고, 양념·서비스·장소 말은 뺀다. */
const FOOD = /麵|面|飯|粥|湯|餅|包|餃|雞|鴨|鵝|肉|魚|蝦|蟹|蚵|蛤|貝|魷|花枝|蛋|豆|腐|糕|粿|冰|茶|奶|酥|捲|卷|腸|肚|排|塔|布丁|麻糬|丸|鍋|燒|烤|炸|滷|羹|粽|米粉|粄|麻辣|咖哩|披薩|漢堡|三明治|吐司|鬆餅|可麗餅|甜點|果汁|汁|芒果|草莓|鳳梨|芋|地瓜|筍|空心菜|菜脯|椒麻|牛|豬|羊|壽司|拉麵|烏龍|丼|天婦羅|生魚片|咖啡|拿鐵|啤酒|調酒|梅酒|蛋糕|派|餡|饅頭|刈包|小卷|生蠔|龍蝦|鮭|鮪|鰻|鱔|酪|乳|圓|仙草|愛玉|粉粿|黑糖|蜜|燉|醉|涼麵|拌麵|乾麵|水餃|鍋貼|燒賣|腸粉|叉燒|餛飩|抄手|饃|焗/;
const NOT_FOOD = /冰箱|沐浴|扭蛋|茶具|茶杯|茶道|包裝|湯屋|釣魚|犬|藥|男孩|排外|排長龍|快排|多汁|酥脆|內餡|餡料|蛋液|麵粉|咖啡廳|節|巨型|橢圓|烤盤|大鍋|飯碗|膠原|貓飯|、|太太|老阿|好味|阜杭|鮭莓|熱肉|魚冊|小嘯鴨|塔通|周家|黃家|彰化|北門|西夢|阿寇|師|員|者|人|客|店員|老闆|阿姨|排隊|停車|服務|環境|價格|座位|預約|外帶|外送|裝潢|餐廳|夜市|地下|捷運|必比登|米其林|聚餐|生日|表演|風景|夕陽|觀光|遊客|老街|百貨|商店|市集|博物館|寺|廟|街|站|路|區|市場|店|館|樓|號|台菜|日式|中式|西式|台式料理|料理|套餐|菜單|份量|口味|味道|招牌|主店|分店|總店|本店|白糖|冰糖|砂糖|鹽|醬油|香菜|九層塔|蒜|黑醋|花生粉|柴魚|胡椒|辣椒醬|沙茶醬|醬$|蔥$|薑$|油$|水$|冰塊|吸管|鋁箔|裝置|機|椅|桌|廁所|冷氣|音樂|狗|貓$|小孩|兒童|情侶|朋友|家人|觀景|河景|夜景|海景|溫泉/;
const KO_DISH = {"小籠包":"샤오롱바오","湯包":"탕바오","牛肉麵":"우육면","滷肉飯":"루러우판","魯肉飯":"루러우판","雞排":"지파이","珍珠奶茶":"버블티","豆花":"더우화","臭豆腐":"취두부","蚵仔煎":"굴전","蚵仔麵線":"굴 면선","大腸麵線":"곱창 면선","麵線":"면선","鍋貼":"궈톄","水餃":"물만두","餃子":"만두","炒飯":"볶음밥","蛋餅":"단빙","燒餅":"사오빙","油條":"요우탸오","豆漿":"두유","鹹豆漿":"셴또우장","刈包":"꽈바오","割包":"꽈바오","肉圓":"바완","碗粿":"완궈","米糕":"미가오","擔仔麵":"단짜이면","意麵":"이몐","鱔魚意麵":"장어 이몐","虱目魚":"밀크피시","虱目魚粥":"밀크피시 죽","虱目魚肚":"밀크피시 뱃살","牛肉湯":"소고기탕","芒果冰":"망고빙수","剉冰":"빙수","刨冰":"빙수","雪花冰":"쉐화빙","湯圓":"탕위안","芋圓":"위위안","麻糬":"모찌","鳳梨酥":"펑리수","蛋黃酥":"단황수","太陽餅":"태양병","蔥油餅":"총유빙","胡椒餅":"후자오빙","鹽酥雞":"옌수지","滷味":"루웨이","麻辣鍋":"마라 훠궈","火鍋":"훠궈","薑母鴨":"장무야","羊肉爐":"양고기 전골","烤鴨":"오리구이","白斬雞":"바이잔지","雞湯":"닭탕","魚丸湯":"어묵탕","貢丸湯":"궁완탕","餛飩":"훈툰","紅油抄手":"홍유차오서우","酸辣湯":"쏸라탕","東坡肉":"동파육","控肉飯":"콩러우판","爌肉飯":"콩러우판","排骨飯":"파이구판","雞肉飯":"지러우판","火雞肉飯":"칠면조 덮밥","鴨肉飯":"오리고기 덮밥","豬腳":"족발","豬腳飯":"족발 덮밥","肉粽":"쭝쯔","粽子":"쭝쯔","蘿蔔糕":"무떡","叉燒":"차슈","叉燒包":"차슈바오","叉燒酥":"차슈수","燒賣":"샤오마이","蝦餃":"하가우","腸粉":"창펀","楊枝甘露":"양즈간루","布丁":"푸딩","鬆餅":"팬케이크","可麗餅":"크레페","提拉米蘇":"티라미수","蛋糕":"케이크","起司蛋糕":"치즈케이크","蛋塔":"에그타르트","咖啡":"커피","拿鐵":"라테","奶茶":"밀크티","紅茶":"홍차","烏龍茶":"우롱차","檸檬汁":"레몬주스","木瓜牛奶":"파파야 우유","西瓜汁":"수박주스","甘蔗汁":"사탕수수 주스","冬瓜茶":"동과차","生魚片":"사시미","壽司":"초밥","拉麵":"라멘","烏龍麵":"우동","丼飯":"덮밥","豬排":"돈가스","炸豬排":"돈가스","牛排":"스테이크","漢堡":"햄버거","披薩":"피자","義大利麵":"파스타","三明治":"샌드위치","吐司":"토스트","燉飯":"리소토","炸雞":"프라이드치킨","雞翅":"닭날개","烤肉":"고기구이","串燒":"꼬치구이","香腸":"소시지","烤香腸":"숯불 소시지","海鮮粥":"해산물 죽","鱸魚湯":"농어탕","蛤蜊湯":"바지락탕","花枝羹":"오징어 갱","肉羹":"고기 갱","魷魚羹":"오징어 갱","鍋燒意麵":"궈사오 이몐","炒米粉":"볶음 미펀","米粉":"미펀","米粉湯":"미펀탕","粄條":"반탸오","客家小炒":"하카식 볶음","擂茶":"레이차","麻婆豆腐":"마파두부","宮保雞丁":"궁바오지딩","回鍋肉":"후이궈러우","空心菜":"공심채","地瓜葉":"고구마잎 볶음","菜脯蛋":"차이푸단","生蠔":"생굴","龍蝦":"랍스터","螃蟹":"게","蝦仁":"새우","炸蝦":"새우튀김","小卷":"꼴뚜기","烏魚子":"어란","竹筍":"죽순","豆腐":"두부","杏仁豆腐":"행인두부","豆干":"더우간","酒釀":"주냥","紅豆":"팥","仙草":"선초","愛玉":"아이위","粉粿":"펀궈","芒果":"망고","草莓":"딸기","啤酒":"맥주","調酒":"칵테일","梅酒":"매실주","黑糖":"흑당","饅頭":"만터우","涼麵":"량몐","乾麵":"비빔면","拌麵":"비빔면","水煎包":"수이젠바오","生煎包":"성젠바오","包子":"바오쯔","炸醬麵":"짜장면","牛肉捲餅":"소고기 롤빙","蔥抓餅":"총좌빙","割包":"꽈바오","鴨血":"오리 선지","豬血糕":"주쉐가오","鹹酥雞":"옌수지","炸雞排":"지파이","烤玉米":"구운 옥수수","滷蛋":"조림 달걀","茶葉蛋":"차예단","蚵仔":"굴","鮮蚵":"굴","牡蠣":"굴","鮭魚":"연어","鰻魚飯":"장어덮밥","天婦羅":"튀김","咖哩":"카레","咖哩飯":"카레라이스","肉燥飯":"러우짜오판","雞肉":"닭고기","牛肉":"소고기","羊肉":"양고기","豬肉":"돼지고기","鴨肉":"오리고기","鵝肉":"거위고기","鴨賞":"야샹(훈제 오리)","糕渣":"가오자","卜肉":"부러우","花生捲冰淇淋":"땅콩 아이스크림 롤","冰淇淋":"아이스크림","霜淇淋":"소프트아이스크림","奶酪":"판나코타","鬆餅":"팬케이크","鍋燒麵":"궈사오몐","餡餅":"셴빙","燒肉":"야키니쿠","壽喜燒":"스키야키","炒麵":"볶음면","湯麵":"탕면","餛飩麵":"훈툰면","油飯":"유판","米血":"미쉐","肉包":"고기만두","鹽水雞":"옌수이지","烤魚":"생선구이","石斑魚":"다금바리","飛魚":"날치","旗魚":"청새치","麻糬冰":"모찌 빙수","紅豆餅":"홍더우빙","車輪餅":"차룬빙","雞蛋糕":"계란빵","冬粉":"당면","蝦捲":"새우롤","棺材板":"관차이반","鱔魚麵":"장어면","牛肉麵湯":"우육면 국물","滷豬腳":"족발 조림","菜飯":"채판","茶點":"다과","台灣茶":"대만차","飲茶":"얌차","蛤蜊":"바지락","皮蛋":"피단","地瓜":"고구마","豬肝":"돼지 간","綠茶":"녹차","煎餅":"전","年糕":"떡","炸魷魚":"오징어튀김","泡菜":"김치","石鍋拌飯":"돌솥비빔밥","拌飯":"비빔밥","部隊鍋":"부대찌개","炸豆腐":"두부튀김","油豆腐":"유부","鴨血豆腐":"오리 선지두부","雞蛋":"달걀","烤雞":"통닭구이","桶仔雞":"통닭구이","炒青菜":"채소볶음","高麗菜":"양배추 볶음","山豬肉":"멧돼지고기","竹筒飯":"대나무통밥","小米酒":"좁쌀주","刺蔥":"츠충","馬告":"마가오","野菜":"산나물","海鮮":"해산물","海鮮丼":"해산물 덮밥","炒飯糰":"볶음 주먹밥","飯糰":"주먹밥","豆漿紅茶":"두유 홍차","鍋燒":"궈사오","烏骨雞":"오골계","土雞":"토종닭","鹹水雞":"셴수이지","雞腿":"닭다리","雞腿飯":"닭다리 덮밥","排骨":"갈비","排骨酥":"갈비 튀김","牛雜":"소 내장","牛腩":"소 양지","牛舌":"소혀","羊排":"양갈비","豬排飯":"돈가스 덮밥","蝦":"새우","鮮魚湯":"생선탕","魚湯":"생선탕","魚皮":"생선 껍질","鯖魚":"고등어","秋刀魚":"꽁치","香菇":"표고버섯","烤布蕾":"크렘브륄레","千層蛋糕":"크레이프 케이크","肉桂捲":"시나몬롤","可頌":"크루아상","司康":"스콘","貝果":"베이글","馬卡龍":"마카롱","瑪德蓮":"마들렌","費南雪":"피낭시에","水果塔":"과일 타르트","檸檬塔":"레몬 타르트","手沖":"핸드드립","手沖咖啡":"핸드드립 커피","美式咖啡":"아메리카노","卡布奇諾":"카푸치노","抹茶":"말차","鮮奶茶":"우유 밀크티","珍珠":"타피오카 펄","水果茶":"과일차","綠豆湯":"녹두탕","紅豆湯":"팥죽","花生湯":"땅콩탕","燒仙草":"사오셴차오","芋頭":"타로","芋泥":"타로 페이스트","米苔目":"미타이무","愛玉冰":"아이위 빙수","鳳梨冰":"파인애플 빙수","牛奶冰":"우유 빙수","雪花冰":"쉐화빙","肉燥":"러우짜오","肉燥飯":"러우짜오판","乾意麵":"비빔 이몐","鱔魚":"장어","土魠魚羹":"삼치 갱","土魠魚":"삼치","蝦仁飯":"새우 덮밥","蝦捲":"새우롤","碗糕":"완가오","鹹粥":"셴저우","牛肉燴飯":"소고기 덮밥","冬瓜":"동과","豆腐乳":"더우푸루"};
function koDish(term) {
  return KO_DISH[term] ? `${KO_DISH[term]}(${term})` : term;
}
function pickMenu(topics, nameText) {
  const items = [];
  for (const t of topics) {
    const term = String(t.term).trim();
    if (items.length >= 3) break;
    if (t.mentions < MIN_MENU_MENTIONS) continue;
    if (term.length < 2 || term.length > 8) continue;
    if (/[A-Za-z0-9가-힣]/.test(term)) continue;
    if (NOT_FOOD.test(term) || !FOOD.test(term)) continue;
    if (items.some(x => x.term === term || x.term.includes(term) || term.includes(x.term))) continue;
    items.push({ term, mentions: t.mentions });
  }
  if (items.length) return { menu: items.map(x => ({ name: koDish(x.term), mentions: x.mentions })), source: "topics" };
  // 리뷰 언급이 없으면 가게 이름 안의 메뉴 이름만 (예: 富宏牛肉麵 → 우육면)
  const names = Object.keys(KO_DISH).filter(k => k.length >= 2 && nameText.includes(k)).sort((a, b) => b.length - a.length);
  if (names.length) return { menu: [{ name: koDish(names[0]) }], source: "name" };
  return { menu: [], source: "" };
}

function stationLabel(st) {
  return st.ko ? `${st.ko}역 ${st.zh}` : st.zh;
}
function nearestStation(lat, lng) {
  let best = null;
  for (const s of STATIONS) {
    const m = meters(lat, lng, s.lat, s.lng);
    if (!best || m < best.m) best = { s, m };
  }
  if (!best || best.m > MRT_MAX_M) return null;
  const d = Math.max(50, Math.round(best.m / 50) * 50);
  return { label: stationLabel(best.s), zh: best.s.zh, distance: `${d}m`, meters: d };
}

function districtOf(addrZh) {
  const m = String(addrZh || "").match(/[縣市]([^\d縣市]{1,4}?[區鄉鎮市])/);
  return m ? m[1] : "";
}
const CITY_KO = [["臺北市", "타이베이"], ["台北市", "타이베이"], ["新北市", "신베이"], ["基隆市", "지룽"], ["桃園市", "타오위안"], ["新竹", "신주"], ["臺中市", "타이중"], ["台中市", "타이중"], ["彰化縣", "장화"], ["南投縣", "난터우"], ["嘉義", "자이"], ["臺南市", "타이난"], ["台南市", "타이난"], ["高雄市", "가오슝"], ["屏東縣", "핑둥"], ["宜蘭縣", "이란"], ["花蓮縣", "화롄"], ["臺東縣", "타이둥"], ["台東縣", "타이둥"], ["雲林縣", "윈린"], ["苗栗縣", "먀오리"], ["澎湖縣", "펑후"]];
function cityKo(addrZh, region) {
  const hit = CITY_KO.find(([zh]) => String(addrZh || "").includes(zh));
  return hit ? hit[1] : region.ko;
}
function typeLabel(types, category) {
  const generic = /^(음식점|레스토랑|식당)$/;
  const t = (types || []).find(x => endsHangul(x) && !generic.test(x));
  return t || `${category.ko} 가게`;
}

function buildIntro({ region, category, place, mrt, hours, menu }) {
  const parts = [];
  const district = districtOf(place.addrZh);
  const type = typeLabel(place.types, category);
  const be = hasBatchim(type) === false ? "예요" : "이에요";
  parts.push(`${cityKo(place.addrZh, region)}${district ? ` ${district}` : ""}에 있는 ${type}${be}.`);
  if (mrt) parts.push(`${mrt.label}에서 직선 약 ${mrt.distance} 거리예요.`);
  if (hours.summary.length) {
    if (hours.closedList && hours.closedList.length && hours.closedList.length < 7) parts.push(`구글 지도 기준 ${hours.closedList.join(", ")}은 쉬어요.`);
    else if (hours.closed === "없음(매일 영업)") parts.push(`구글 지도 기준 휴무일 없이 매일 열어요.`);
    if (hours.lateNight) parts.push(`자정을 넘겨 늦게까지 영업하는 날이 있어요.`);
  }
  if (menu.source === "topics" && menu.menu.length) parts.push(`구글 리뷰에서는 ${menu.menu.map(m => m.name).join(", ")} 등이 자주 언급돼요.`);
  return parts.join(" ");
}

/* ---------- main ---------- */
async function enrichOne(spot) {
  const region = REGION_BY_ID[spot.region], category = CATEGORY_BY_ID[spot.category];
  if (!region || !category) return { skip: "지역/카테고리 미정의" };
  if (!hasPlaceIdentity(spot.link || "")) return { skip: "정확한 구글맵 업체 링크 없음" };
  const ko = parsePreview(await fetchPlace(spot, "ko"));
  if (!ko) return { skip: "구글 업체 정보 못 읽음(좌표형/이름형 링크)" };
  await sleep(OPT.delayMs / 2);
  const zh = parsePreview(await fetchPlace(spot, "zh-TW")) || { topics: [], prices: {}, name: null };
  if (/폐업|휴업/.test(ko.status)) return { skip: `구글 표시: ${ko.status}` };
  if (ko.lat == null || ko.lng == null) return { skip: "구글 좌표 없음" };
  const drift = meters(spot.lat, spot.lng, ko.lat, ko.lng);
  if (drift > MAX_COORD_DRIFT_M) return { skip: `구글 좌표와 등록 좌표 차이 ${Math.round(drift)}m` };
  if (!ko.addrZh) return { skip: "구글 주소 없음" };
  const hours = hoursSummary(ko.hours);
  const mrt = nearestStation(ko.lat, ko.lng);
  const menu = pickMenu(zh.topics, `${zh.name || ""} ${ko.nameAlt || ""} ${spot.name || ""}`);
  const price = priceRange({ ...ko.prices });
  const intro = buildIntro({ region, category, place: ko, mrt, hours, menu });
  return {
    entry: {
      name_zh: zh.name || ko.nameAlt || ko.name,
      address_zh: ko.addrZh,
      address_en: ko.addrEn,
      hours_summary: hours.summary,
      closed_days: hours.summary.length ? hours.closed : null,
      mrt,
      menu: menu.menu.map(m => ({ name: m.name })),
      menu_source: menu.source,
      price_range: price ? price.text : null,
      price_range_schema: price ? price.schema : null,
      intro,
      google: { place_id: ko.placeId, rating: ko.rating, reviews: ko.reviews },
      method: "auto",
      checked_at: OPT.checkedAt,
    },
  };
}

async function main() {
  const data = fs.existsSync(OPT.dataPath) ? JSON.parse(fs.readFileSync(OPT.dataPath, "utf8")) : { meta: {}, category_mismatch: [], spots: {} };
  data.spots = data.spots || {};
  const spots = (await fetchAllSpots()).filter(s => {
    if (OPT.ids && !OPT.ids.has(s.id)) return false;
    if (OPT.regions && !OPT.regions.includes(s.region)) return false;
    if (!OPT.force && data.spots[String(s.id)]) return false;
    return true;
  });
  const todo = spots.slice(0, OPT.limit);
  const report = { started_at: new Date().toISOString(), considered: todo.length, enriched: [], skipped: [] };
  console.log(`보강 대상 ${todo.length}곳`);
  for (const [i, spot] of todo.entries()) {
    let r;
    try {
      r = await enrichOne(spot);
    } catch (e) {
      r = { skip: `오류: ${e.message}` };
    }
    if (r.entry) {
      if (!(OPT.force && data.spots[String(spot.id)] && data.spots[String(spot.id)].method === "manual")) data.spots[String(spot.id)] = r.entry;
      report.enriched.push(spot.id);
      if (OPT.dryRun) (report.entries = report.entries || {})[spot.id] = r.entry;
    } else report.skipped.push({ id: spot.id, name: spot.name, region: spot.region, reason: r.skip });
    if ((i + 1) % 20 === 0) {
      console.log(`  ${i + 1}/${todo.length} (보강 ${report.enriched.length}, 건너뜀 ${report.skipped.length})`);
      if (!OPT.dryRun) save(data);
    }
    await sleep(OPT.delayMs);
  }
  if (!OPT.dryRun) save(data);
  if (OPT.report) fs.writeFileSync(OPT.report, JSON.stringify(report, null, 1));
  console.log(`완료: 보강 ${report.enriched.length}곳, 건너뜀 ${report.skipped.length}곳`);
  report.skipped.forEach(s => console.log(`  - ${s.id} ${s.name}: ${s.reason}`));
}
function save(data) {
  const sorted = Object.fromEntries(Object.entries(data.spots).sort((a, b) => Number(a[0]) - Number(b[0])));
  fs.writeFileSync(OPT.dataPath, JSON.stringify({ ...data, spots: sorted }, null, 1) + "\n");
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
module.exports = { parsePreview, pickMenu, priceRange, hoursSummary, buildIntro, districtOf };
