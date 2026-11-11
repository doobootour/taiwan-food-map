// 맛집 상세 페이지를 색인할지 판단한다.
// 기준과 근거는 docs/seo-indexing-rules.md.
//
// 가게 이름과 닉네임은 세지 않는다. 이름은 모든 상세 페이지의 공통 문장에 들어가고,
// 닉네임은 등록한 사람이지 그 가게에 대한 설명이 아니다.

const fs = require("fs");
const path = require("path");

const MIN_UNIQUE_CHARS = 8;

// 보강 데이터(scripts/data/spot-enrichment.json)에 확인된 주소가 있으면 고유 정보로 센다.
const ENRICHMENT_PATH = path.join(__dirname, "..", "data", "spot-enrichment.json");
let ENRICHED_ADDRESS = {};
try {
  const data = JSON.parse(fs.readFileSync(ENRICHMENT_PATH, "utf8"));
  ENRICHED_ADDRESS = Object.fromEntries(Object.entries(data.spots || {}).map(([id, e]) => [id, e.address_zh || ""]));
} catch (_) {
  ENRICHED_ADDRESS = {};
}

function fieldText(value) {
  return String(value || "").trim();
}

function isIndexableSpot(spot) {
  if (!spot) return false;
  const review = fieldText(spot.review);
  const address = fieldText(spot.address) || fieldText(ENRICHED_ADDRESS[String(spot.id)]);
  return review.length >= MIN_UNIQUE_CHARS || address.length >= MIN_UNIQUE_CHARS;
}

module.exports = { MIN_UNIQUE_CHARS, fieldText, isIndexableSpot };
