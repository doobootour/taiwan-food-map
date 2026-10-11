import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
type LL = { lat: number; lng: number };

const ok = (lat: number, lng: number): LL | null =>
  isFinite(lat) && isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && !(lat === 0 && lng === 0) ? { lat, lng } : null;

function extractLatLng(text: string): LL | null {
  let t = text;
  try { t = decodeURIComponent(text); } catch { /* keep raw */ }
  const pats = [
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // 실제 핀 위치 (가장 정확)
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&](?:q|query|ll|center|destination|daddr)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
  ];
  for (const re of pats) {
    const m = t.match(re);
    if (m) { const r = ok(parseFloat(m[1]), parseFloat(m[2])); if (r) return r; }
  }
  return null;
}

function cleanTitle(raw: string): string {
  return raw.replace(/\s*[-·]\s*Google\s*(지도|Maps|地圖|地图|マップ)\s*$/i, "").trim();
}

// 주소처럼 보이는 문자열은 가게 이름으로 쓰지 않는다
function looksLikeAddress(n: string): boolean {
  // "970, Hualien County..." / "No. 36, ..." / "970花蓮縣花蓮市..." 처럼 번호로 시작하는 주소
  if (/^\s*(No\.?\s*)?\d+[A-Za-z-]?\s*[,，號号]/i.test(n)) return true;
  if (/^\s*\d{3,6}\s*[\u4e00-\u9fff]{2,3}[縣市]/.test(n)) return true;
  // 영문 주소 단어가 쉼표와 함께 나오면 주소 ("1709 Cafe' Bar" 같은 이름은 통과)
  if (/,/.test(n) && /\b(County|City|Road|Rd|Village|Dist|District|Township|Street|St|Ave|Lane|Alley|Sec|Taiwan)\b/i.test(n)) return true;
  // 한자 주소: 縣/市 + 區/鄉/鎮/路/街/里, 또는 번지(號), 숫자+巷/弄 ("夜市", "老街" 같은 이름은 통과)
  if (/[縣市].{0,8}[區鄉鎮路街里]|號|\d+\s*[巷弄段]/.test(n)) return true;
  return false;
}
const validName = (n: string | null | undefined): string | null => {
  const t = (n || "").trim();
  return t && !looksLikeAddress(t) ? t : null;
};

function nameFromUrl(url: string): string | null {
  let m = url.match(/\/maps\/place\/([^/@?]+)/);
  if (!m) m = url.match(/[?&](?:q|query)=([^&]+)/);
  if (!m) return null;
  try {
    const n = decodeURIComponent(m[1].replace(/\+/g, " ")).trim();
    if (!n || /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(n) || /^place_id:/i.test(n)) return null;
    return validName(n);
  } catch { return null; }
}

function nameFromHtml(html: string): string | null {
  const m = html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:title"/i) ||
    html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i);
  if (m) { const n = cleanTitle(m[1]); if (n && n !== "Google Maps") return validName(n); }
  return null;
}

async function get(url: string) {
  const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA, "Accept-Language": "zh-TW,ko;q=0.8,en;q=0.6" } });
  let finalUrl = res.url || url;
  // EU 등에서 consent.google.com 으로 튕기면 continue 파라미터에 원래 주소가 들어 있다
  if (/consent\.google\./.test(finalUrl)) {
    const cont = new URL(finalUrl).searchParams.get("continue");
    if (cont) finalUrl = cont;
  }
  return { finalUrl, html: await res.text() };
}

// 좌표 없는 페이지(?q=이름&ftid=..., /maps/place/이름 등): 페이지 HTML이 미리 불러오는
// /maps/preview/place 응답에서 실제 핀 좌표 [null,null,lat,lng] 를 찾는다
const DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";
type Place = { coords: LL | null; name: string | null };
async function placeFromPreview(pageUrl: string): Promise<Place> {
  // 모바일 UA 페이지에는 preview 프리로드가 없어서 데스크톱 UA로 다시 받는다
  const html = await (await fetch(pageUrl, { headers: { "User-Agent": DESKTOP_UA } })).text();
  const m = html.match(/href="(\/maps\/preview\/(?:place|search)[^"]+)"/);
  if (!m) return { coords: null, name: null };
  const res = await fetch("https://www.google.com" + m[1].replace(/&amp;/g, "&"), { headers: { "User-Agent": DESKTOP_UA } });
  const txt = await res.text();
  let name: string | null = null;
  let coords: LL | null = null;
  try {
    const d = JSON.parse(txt.replace(/^\)\]\}'\s*/, ""));
    const p = d?.[6];
    if (p) {
      name = validName(typeof p[11] === "string" ? p[11] : null);
      if (Array.isArray(p[9])) coords = ok(Number(p[9][2]), Number(p[9][3]));
    }
  } catch { /* 형식이 바뀌면 정규식으로 */ }
  if (!coords) {
    const c = txt.match(/\[null,null,(-?\d+\.\d+),(-?\d+\.\d+)\]/);
    if (c) coords = ok(parseFloat(c[1]), parseFloat(c[2]));
  }
  return { coords, name };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const raw = typeof body?.url === "string" ? body.url : "";
    const url = (raw.match(/https?:\/\/\S+/) || [])[0];
    if (!url) return json({ error: "url이 필요합니다" }, 400);

    let coords = extractLatLng(url);
    let name = nameFromUrl(url);
    let finalUrl = url;

    if (!coords || !name) {
      const page = await get(url);
      finalUrl = page.finalUrl;
      coords = coords || extractLatLng(finalUrl);
      name = name || nameFromUrl(finalUrl) || nameFromHtml(page.html);
      if (!coords || !name) {
        // 페이지가 불러오는 장소 데이터: 실제 핀 좌표와 정식 가게 이름
        const pl = await placeFromPreview(finalUrl).catch(() => ({ coords: null, name: null } as Place));
        coords = coords || pl.coords;
        name = name || pl.name;
      }
      if (!coords && name) {
        coords = (await placeFromPreview("https://www.google.com/maps?q=" + encodeURIComponent(name)).catch(() => null))?.coords ?? null;
      }
    }

    if (!coords) return json({ error: "좌표를 찾을 수 없습니다", name, finalUrl }, 422);
    return json({ ...coords, name, finalUrl });
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
