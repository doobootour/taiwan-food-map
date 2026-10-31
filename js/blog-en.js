// Blog posts that have a published English page at /en/blog-<slug>.
// Adding a slug here (after reviewing the post's `en` content in js/blog-content.js)
// is all it takes: scripts/generate-blog-pages.js writes en/blog-<slug>.html, adds
// hreflang to both versions and lists it on /en/blog; generate-sitemap.js adds the pair.
// Shared by the browser (/en/blog list) and the Node generators.
(function (root) {
  const EN_BLOG_SLUGS = [
    "taiwan-first-trip-region-choice",
    "taipei-easycard-transport-guide",
    "taipei-mrt-credit-card-contactless",
    "taoyuan-airport-midnight-arrival-transport",
    "taiwan-arrival-card-twac-guide",
    "pingxi-line-ruifang-houtong-shifen",
    "jiufen-bus-965-from-taipei",
    "taipei-station-luggage-storage",
    "taiwan-food-menu-chinese-words",
    "taipei-national-palace-museum-tips",
    "taipei-beitou-private-hot-spring-booking",
    "kaohsiung-light-rail-fare-art-museum",
    "kaohsiung-cijin-ferry-gushan-vs-zhongzhou",
    "xiaoliuqiu-turtle-snorkeling-beach-tips",
    "taichung-gaomei-wetland-miyahara-rainbow-village-tour-eats",
    "taichung-tainan-tra-vs-thsr",
    "tainan-chimei-museum-ticket-nearby-eats",
    "alishan-zhaoping-line-ticket-exchange",
    "hualien-hotel-location-guide",
    "yilan-kavalan-distillery-cafe-course",
  ];
  if (typeof module === "object" && module.exports) module.exports = { EN_BLOG_SLUGS };
  root.EN_BLOG_SLUGS = EN_BLOG_SLUGS;
})(typeof globalThis !== "undefined" ? globalThis : this);
