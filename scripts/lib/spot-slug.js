// eats 테이블의 한 행(스팟)을 URL 슬러그로 바꾸는 공용 로직.
// generate-region-pages.js / generate-category-pages.js / generate-spot-pages.js /
// generate-sitemap.js가 모두 이 파일을 통해 슬러그를 만들어야 서로 다른 스크립트가
// 같은 스팟에 대해 다른 URL을 만들어내는 일이 없다.
//
// 형식: <region>-<category>-<가게이름 slug>-<id>  (가게이름이 영문/숫자로 못 바뀌면 <region>-<category>-<id>)
// 가게 이름 대부분이 한자·한글이라 라틴 문자로 바뀌지 않는 경우가 많음 — 그런 경우엔 id로 유일성만 보장한다.
function slugifyName(name) {
  return String(name || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // 라틴 문자의 발음 구별 기호(accent) 제거
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
}

function slugForSpot(spot) {
  const namePart = slugifyName(spot.name);
  return namePart
    ? `${spot.region}-${spot.category}-${namePart}-${spot.id}`
    : `${spot.region}-${spot.category}-${spot.id}`;
}

function comboSlug(regionId, categoryId) {
  return `${regionId}-${categoryId}`;
}

module.exports = { slugifyName, slugForSpot, comboSlug };
