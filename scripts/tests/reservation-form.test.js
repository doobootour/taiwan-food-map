#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "../..");
const html = fs.readFileSync(path.join(root, "reservation.html"), "utf8");
const js = fs.readFileSync(path.join(root, "js/reservation.js"), "utf8");
const fn = fs.readFileSync(path.join(root, "supabase/functions/taiwanbite-reservation/index.ts"), "utf8");

const PLACE = "식당이름 (지점) 또는 구글맵 링크";
const EMAIL_RE = /^[^@\s<>"']+@[^@\s<>"']+\.[^@\s<>"']+$/;

let failed = 0;
function check(name, fnTest) {
  try { fnTest(); console.log("ok  " + name); }
  catch (e) { failed++; console.error("FAIL  " + name + "\n  " + (e && e.message ? e.message : e)); }
}

check("form removes old restaurant-name field", () => {
  assert(!html.includes('id="fName"'), "fName still in html");
  assert(!html.includes('id="fBranch"'), "fBranch still in html");
  assert(!html.includes("1. 식당 이름"), "old numbered name label still present");
  assert(!html.includes(">지점 또는 구글맵 링크"), "old branch-only label still present");
});

check("form has combined required place field as #1", () => {
  assert(html.includes(`1. ${PLACE}`), "missing combined label");
  assert(html.includes('id="fPlace"'), "missing fPlace");
  assert(/id="fPlace"[^>]*required/.test(html) || /<input id="fPlace"[^>]*required/.test(html), "fPlace not required");
  assert(html.includes("2. 희망 날짜"), "date not #2");
  assert(html.includes("3. 희망 시간"), "time not #3");
  assert(html.includes("4. 인원"), "party not #4");
  assert(html.includes("5. 예약자 이름"), "booker not #5");
  assert(html.includes("6. 이메일"), "email not #6");
  assert(html.includes("7. 연락처"), "contact not #7");
  assert(html.includes("8. 원하는 시간이 안 될 때"), "fallback not #8");
  assert(html.includes("9. 요청사항"), "requests not #9");
});

check("form email field is required with type=email", () => {
  assert(/id="fEmail"/.test(html), "missing fEmail");
  assert(/id="fEmail"[^>]*type="email"/.test(html), "fEmail not type=email");
  assert(/id="fEmail"[^>]*required/.test(html), "fEmail not required");
  assert(html.includes("input[type=email]"), "email input missing CSS");
});

check("client js uses combined field, email validation, and new payload", () => {
  assert(js.includes('["fPlace"'), "FIELDS missing fPlace");
  assert(!/\["fName"/.test(js), "FIELDS still has fName");
  assert(js.includes("restaurant_or_map"), "payload missing restaurant_or_map");
  assert(!js.includes("restaurant_name:"), "payload still sends restaurant_name");
  assert(js.includes("email: v(\"fEmail\")"), "payload missing email");
  assert(js.includes("EMAIL_RE"), "missing EMAIL_RE");
  assert(js.includes("이메일 형식을 확인해 주세요."), "missing format error");
  assert(js.includes("PLACE_LABEL") && js.includes(PLACE), "copy template missing new label");
  assert(js.includes("`1. ${PLACE_LABEL}:"), "copy template not using PLACE_LABEL");
  assert(!js.includes("1. 식당 이름:"), "copy template still has old name line");
  assert(js.includes('qs.get("name")') && js.includes('qs.get("map")'), "prefill from name/map query dropped");
  assert(js.includes("fContact"), "contact field dropped");
});

check("email regex matches golf-style valid/invalid cases", () => {
  const ok = ["you@example.com", "a.b+c@mail.co.kr", "Chris.Kim@gmail.com"];
  const bad = ["", "not-an-email", "a@b", "a@b.", "@x.com", "a@ b.com", "a<b>@x.com", "a@x com"];
  for (const e of ok) assert(EMAIL_RE.test(e), "should accept " + e);
  for (const e of bad) assert(!EMAIL_RE.test(e), "should reject " + e);
  assert(js.includes(EMAIL_RE.source) || js.includes(String(EMAIL_RE)), "js EMAIL_RE differs");
  assert(fn.includes(EMAIL_RE.source) || fn.includes("/^[^@\\s<>\"']+@[^@\\s<>\"']+\\.[^@\\s<>\"']+$/"), "fn EMAIL_RE differs");
});

check("server function drops separate name field, uses new label, reply_to, confirmation", () => {
  assert(fn.includes("PLACE_LABEL = \"식당이름 (지점) 또는 구글맵 링크\""), "missing PLACE_LABEL");
  assert(fn.includes("1. ${PLACE_LABEL}:"), "admin mail missing numbered place label");
  assert(fn.includes("6. 이메일:"), "admin mail missing 이메일 line");
  assert(!fn.includes("1. 식당 이름:"), "admin mail still has old name line");
  assert(!fn.includes("지점 또는 구글맵 링크"), "admin mail still has old branch-only label");
  assert(fn.includes("replyTo: email"), "admin mail missing replyTo applicant email");
  assert(fn.includes("replyTo: adminEmail"), "customer mail missing replyTo admin");
  assert(fn.includes("body.reply_to = mail.replyTo"), "Resend reply_to not set");
  assert(fn.includes("taiwanbite-reservation-customer/"), "customer confirmation not sent");
  assert(fn.includes("[${BRAND} 예약대행] 신청이 접수되었습니다"), "customer subject/heading missing");
  assert(fn.includes("subject: oneLine(`[${BRAND} 예약대행] ${place} / ${dateLabel}`)"), "admin subject not using place value");
  assert(fn.includes("if (!EMAIL_RE.test(email))"), "server email format check missing");
  assert(fn.includes("placeFromPayload"), "legacy payload fallback missing");
  assert(fn.includes("p.restaurant_or_map"), "new payload field not read");
  assert(fn.includes("row.email") || fn.includes("email,"), "email not stored");
});

check("placeFromPayload and linkify helpers behave as intended", () => {
  function str(v, max) { return typeof v === "string" ? v.trim().slice(0, max) : ""; }
  function placeFromPayload(p) {
    const combined = str(p.restaurant_or_map, 500);
    if (combined) return combined;
    return [str(p.restaurant_name, 120), str(p.branch_or_map, 500)].filter(Boolean).join(" ").slice(0, 500);
  }
  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function linkifyPlace(s) {
    const src = String(s || "");
    const parts = [];
    let last = 0;
    const re = /https:\/\/[^\s<>"']+/g;
    let m;
    while ((m = re.exec(src))) {
      if (m.index > last) parts.push(esc(src.slice(last, m.index)));
      const url = m[0];
      parts.push(`<a href="${esc(url)}">${esc(url)}</a>`);
      last = m.index + url.length;
    }
    if (last < src.length) parts.push(esc(src.slice(last)));
    return (parts.join("") || esc(src)).replace(/\r\n|\r|\n/g, "<br>");
  }
  function oneLine(v, max = 150) { return String(v ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max); }

  assert.strictEqual(placeFromPayload({ restaurant_or_map: " 딘타이펑 101점 " }), "딘타이펑 101점");
  assert.strictEqual(placeFromPayload({ restaurant_name: "딘타이펑", branch_or_map: "https://maps.app.goo.gl/x" }), "딘타이펑 https://maps.app.goo.gl/x");
  assert.strictEqual(placeFromPayload({ restaurant_or_map: "A", restaurant_name: "ignored", branch_or_map: "ignored" }), "A");
  assert.strictEqual(placeFromPayload({}), "");

  const htmlPlace = linkifyPlace('딘타이펑 <101점> https://maps.app.goo.gl/abc');
  assert(htmlPlace.includes("딘타이펑 &lt;101점&gt; "), "text not escaped: " + htmlPlace);
  assert(htmlPlace.includes('<a href="https://maps.app.goo.gl/abc">https://maps.app.goo.gl/abc</a>'), "url not linked: " + htmlPlace);
  const subj = oneLine(`[대만맛집 예약대행] ${"딘타이펑 101점 https://maps.app.goo.gl/abc"} / 2026-12-20 (일)`);
  assert(subj.includes("딘타이펑 101점"), "subject missing place value");
  assert(!subj.includes("undefined"), "subject has undefined");
});

if (failed) {
  console.error("\n" + failed + " test(s) failed");
  process.exit(1);
}
console.log("\nall tests passed");
