// 맛집 상세 페이지를 색인할지 판단한다.
// 기준과 근거는 docs/seo-indexing-rules.md.
//
// 가게 이름과 닉네임은 세지 않는다. 이름은 모든 상세 페이지의 공통 문장에 들어가고,
// 닉네임은 등록한 사람이지 그 가게에 대한 설명이 아니다.

const MIN_UNIQUE_CHARS = 8;

function fieldText(value) {
  return String(value || "").trim();
}

function isIndexableSpot(spot) {
  if (!spot) return false;
  const review = fieldText(spot.review);
  const address = fieldText(spot.address);
  return review.length >= MIN_UNIQUE_CHARS || address.length >= MIN_UNIQUE_CHARS;
}

module.exports = { MIN_UNIQUE_CHARS, fieldText, isIndexableSpot };
