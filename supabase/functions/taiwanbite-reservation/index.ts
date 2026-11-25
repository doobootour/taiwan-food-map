import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// taiwanbite.com /reservation 식당 예약대행 신청 → 관리자 이메일 + 신청자 접수 확인 메일 (Resend).
// 두부골프 notify-new-request와 같은 방식: 같은 Resend 키(RESEND_API_KEY)·보내는 주소(RESEND_FROM)·
// 받는 주소(ADMIN_NOTIFY_EMAIL, 없으면 doobootour@gmail.com). 비밀값은 함수 시크릿에만 있다.
// 관리자 메일 reply_to는 신청자 이메일, 신청자 확인 메일 reply_to는 관리자 주소.
// 스팸 방지: 허니팟 필드, 최소 작성 시간, 서버 측 입력 검증, 최근 접수 건수 제한, Idempotency-Key.

const ALLOWED_ORIGINS = new Set(["https://taiwanbite.com", "https://www.taiwanbite.com"]);
const BRAND = "대만맛집";
const PLACE_LABEL = "식당이름 (지점) 또는 구글맵 링크";
const MIN_FILL_MS = 4000;
const FALLBACKS = new Set(["다른 시간 가능", "다른 날짜 가능", "취소"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const EMAIL_RE = /^[^@\s<>"']+@[^@\s<>"']+\.[^@\s<>"']+$/;
const HTTPS_URL = /https:\/\/[^\s<>"']+/g;

function cors(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://taiwanbite.com",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}
function esc(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
function escLines(v: unknown): string { return esc(v).replace(/\r\n|\r|\n/g, "<br>"); }
function oneLine(v: unknown, max = 150): string { return String(v ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max); }
function str(v: unknown, max: number): string { return typeof v === "string" ? v.trim().slice(0, max) : ""; }
function brandedFrom(raw: string | undefined): string {
  const s = (raw || "").trim() || "onboarding@resend.dev";
  const m = s.match(/<([^<>\s]+@[^<>\s]+)>\s*$/);
  return `${BRAND} <${(m ? m[1] : s).trim()}>`;
}
function weekday(d: string): string {
  const t = new Date(d + "T00:00:00Z");
  return isNaN(t.getTime()) ? "" : ["일", "월", "화", "수", "목", "금", "토"][t.getUTCDay()];
}
function maskEmail(e: string): string { return e.replace(/^(.{2}).*(@.*)$/, "$1***$2"); }

function placeFromPayload(p: Record<string, unknown>): string {
  const combined = str(p.restaurant_or_map, 500);
  if (combined) return combined;
  return [str(p.restaurant_name, 120), str(p.branch_or_map, 500)].filter(Boolean).join(" ").slice(0, 500);
}

function linkifyPlace(s: string): string {
  const src = String(s || "");
  const parts: string[] = [];
  let last = 0;
  const re = new RegExp(HTTPS_URL.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) parts.push(esc(src.slice(last, m.index)));
    const url = m[0];
    parts.push(`<a href="${esc(url)}">${esc(url)}</a>`);
    last = m.index + url.length;
  }
  if (last < src.length) parts.push(esc(src.slice(last)));
  return (parts.join("") || esc(src)).replace(/\r\n|\r|\n/g, "<br>");
}

async function sendMail(
  apiKey: string,
  mail: { from: string; to: string; subject: string; html: string; replyTo?: string; idempotencyKey: string },
): Promise<{ ok: boolean; id: string; status: number; text: string }> {
  const body: Record<string, unknown> = { from: mail.from, to: [mail.to], subject: mail.subject, html: mail.html };
  if (mail.replyTo) body.reply_to = mail.replyTo;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": mail.idempotencyKey,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let id = "";
  try { id = JSON.parse(text).id || ""; } catch { /* ignore */ }
  if (!res.ok) console.error("resend error", res.status, text);
  return { ok: res.ok, id, status: res.status, text };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const headers = { ...cors(origin), "Content-Type": "application/json" };
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "forbidden" }, 403);

  let p: Record<string, unknown> = {};
  try { p = await req.json(); } catch { return json({ error: "invalid json" }, 400); }

  // 스팸: 허니팟이 채워졌거나 너무 빨리 제출 → 성공처럼 응답하고 아무것도 보내지 않는다.
  const elapsed = Number(p.elapsed_ms || 0);
  if (str(p.website, 200) || !(elapsed >= MIN_FILL_MS)) return json({ ok: true });

  const place = placeFromPayload(p);
  const email = str(p.email, 200);
  const row = {
    restaurant_name: oneLine(place, 120),
    branch_or_map: place,
    email,
    preferred_date: str(p.preferred_date, 10),
    time_first: str(p.time_first, 5),
    time_second: str(p.time_second, 5) || null,
    adults: Number.parseInt(String(p.adults ?? ""), 10),
    children: Number.parseInt(String(p.children ?? "0"), 10) || 0,
    booker_name_en: str(p.booker_name_en, 80),
    contact: str(p.contact, 100),
    if_unavailable: str(p.if_unavailable, 20),
    requests: str(p.requests, 1000) || null,
    source_page: str(p.source_page, 300) || null,
  };
  const todayTpe = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10);
  if (!place || !row.booker_name_en || row.contact.length < 2) return json({ error: "필수 항목을 모두 입력해 주세요." }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "이메일 형식을 확인해 주세요." }, 400);
  if (!DATE_RE.test(row.preferred_date) || row.preferred_date < todayTpe) return json({ error: "희망 날짜를 오늘 이후로 선택해 주세요." }, 400);
  if (!TIME_RE.test(row.time_first) || (row.time_second && !TIME_RE.test(row.time_second))) return json({ error: "희망 시간을 다시 확인해 주세요." }, 400);
  if (!Number.isInteger(row.adults) || row.adults < 1 || row.adults > 50 || row.children < 0 || row.children > 50) return json({ error: "인원을 다시 확인해 주세요." }, 400);
  if (!FALLBACKS.has(row.if_unavailable)) return json({ error: "원하는 시간이 안 될 때 어떻게 할지 골라 주세요." }, 400);

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) { console.error("RESEND_API_KEY not set"); return json({ error: "server error" }, 500); }
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // 접수 건수 제한: 10분에 전체 20건, 같은 연락처 또는 같은 이메일 3건.
  const since = new Date(Date.now() - 10 * 60_000).toISOString();
  const [{ count: total }, { count: sameContact }, { count: sameEmail }] = await Promise.all([
    supabase.from("taiwanbite_reservation_requests").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("taiwanbite_reservation_requests").select("id", { count: "exact", head: true }).gte("created_at", since).eq("contact", row.contact),
    supabase.from("taiwanbite_reservation_requests").select("id", { count: "exact", head: true }).gte("created_at", since).eq("email", row.email),
  ]);
  if ((total ?? 0) >= 20 || (sameContact ?? 0) >= 3 || (sameEmail ?? 0) >= 3) return json({ error: "짧은 시간에 신청이 너무 많아요. 잠시 후 다시 시도해 주세요." }, 429);

  const { data: saved, error: insErr } = await supabase.from("taiwanbite_reservation_requests").insert(row).select("id").single();
  if (insErr || !saved) { console.error("insert error", insErr); return json({ error: "server error" }, 500); }

  const adminEmail = Deno.env.get("ADMIN_NOTIFY_EMAIL") || "doobootour@gmail.com";
  const dateLabel = `${row.preferred_date} (${weekday(row.preferred_date)})`;
  const placeHtml = linkifyPlace(place);
  const timeLine = `1순위 ${esc(row.time_first)} / 2순위 ${esc(row.time_second || "없음")}`;
  const peopleLine = `성인 ${row.adults}명 / 아이 ${row.children}명`;
  const booker = esc(row.booker_name_en.toUpperCase());
  const adminHtml = `
    <h2>[${BRAND} 예약대행] 새 신청이 접수되었습니다</h2>
    <p><b>1. ${PLACE_LABEL}:</b> ${placeHtml}</p>
    <p><b>2. 희망 날짜:</b> ${esc(dateLabel)}</p>
    <p><b>3. 희망 시간:</b> ${timeLine}</p>
    <p><b>4. 인원:</b> ${peopleLine}</p>
    <p><b>5. 예약자 이름(영문):</b> ${booker}</p>
    <p><b>6. 이메일:</b> ${esc(email)}</p>
    <p><b>7. 연락처(카톡 ID 또는 전화번호):</b> ${esc(row.contact)}</p>
    <p><b>8. 원하는 시간이 안 될 때:</b> ${esc(row.if_unavailable)}</p>
    <p><b>9. 요청사항:</b> ${row.requests ? escLines(row.requests) : "없음"}</p>
    <hr>
    <p>※ 예약대행료 5,000원 ※ 예약 완료 후 환불 불가 ※ 날짜 또는 시간 변경 1회 가능</p>
    <p>※ 손님에게는 "신청 후 24시간 이내에 카톡으로 안내드려요"라고 안내되었으며, 접수 확인 메일도 신청자 이메일로 발송합니다.</p>
    <p style="color:#888;font-size:12px;">접수 번호 ${esc(saved.id)}${row.source_page ? ` · 신청 페이지 ${esc(row.source_page)}` : ""}</p>`;

  const userHtml = `
    <h2>[${BRAND} 예약대행] 신청이 접수되었습니다</h2>
    <p>안녕하세요 ${booker}님, 대만 식당 예약대행 신청이 접수되었습니다.</p>
    <p><b>${PLACE_LABEL}:</b> ${placeHtml}</p>
    <p><b>희망 날짜:</b> ${esc(dateLabel)}</p>
    <p><b>희망 시간:</b> ${timeLine}</p>
    <p><b>인원:</b> ${peopleLine}</p>
    <p>신청 후 24시간 이내에 카톡으로 안내드려요.</p>
    <p>※ 예약대행료 5,000원 ※ 예약 완료 후 환불 불가 ※ 날짜 또는 시간 변경 1회 가능</p>
    <p>감사합니다.<br>${BRAND}</p>`;

  const from = brandedFrom(Deno.env.get("RESEND_FROM"));
  const adminRes = await sendMail(resendKey, {
    from,
    to: adminEmail,
    subject: oneLine(`[${BRAND} 예약대행] ${place} / ${dateLabel}`),
    html: adminHtml,
    replyTo: email,
    idempotencyKey: `taiwanbite-reservation/${saved.id}`,
  });
  if (!adminRes.ok) {
    return json({ error: "메일 발송에 실패했어요. 카톡으로 보내기를 이용해 주세요." }, 502);
  }
  const userRes = await sendMail(resendKey, {
    from,
    to: email,
    subject: `[${BRAND} 예약대행] 신청이 접수되었습니다`,
    html: userHtml,
    replyTo: adminEmail,
    idempotencyKey: `taiwanbite-reservation-customer/${saved.id}`,
  });
  if (!userRes.ok) console.error("customer confirmation email failed", saved.id, userRes.status, userRes.text);

  await supabase.from("taiwanbite_reservation_requests").update({ emailed: true, email_id: adminRes.id }).eq("id", saved.id);
  console.log("taiwanbite reservation emailed", saved.id, "to", maskEmail(adminEmail), "resend id", adminRes.id, "customer", userRes.ok);
  return json({ ok: true, id: saved.id });
});
