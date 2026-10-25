// 모든 Leaflet 지도에 js/attractions.js의 관광지를 별 마커로 얹는다.
// worker.js가 leaflet.js 바로 뒤에 이 파일과 attractions.js를 끼워 넣으므로
// 지도 스크립트가 L.map()을 부르기 전에 훅이 등록된다. 지역을 추가하면 자동으로 별이 생긴다.
(function () {
  if (!window.L || !L.Map || typeof ATTRACTIONS === "undefined") return;
  var css = document.createElement("style");
  css.textContent =
    ".attr-star{font-size:26px;line-height:30px;text-align:center;filter:drop-shadow(0 1px 2px rgba(0,0,0,.55));cursor:pointer}" +
    ".attr-star-pop b{display:block;margin-bottom:4px}";
  document.head.appendChild(css);
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  L.Map.addInitHook(function () {
    var map = this;
    var icon = L.divIcon({ html: '<div class="attr-star">⭐</div>', className: "", iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -14] });
    Object.keys(ATTRACTIONS).forEach(function (regionId) {
      (ATTRACTIONS[regionId].items || []).forEach(function (it) {
        var href = "/" + regionId + "-attractions#" + it.id;
        L.marker([it.lat, it.lng], { icon: icon, zIndexOffset: 2000, title: it.ko + " " + it.zh, keyboard: true })
          .bindPopup('<div class="attr-star-pop"><b>⭐ ' + esc(it.ko) + " " + esc(it.zh) + '</b><a href="' + href + '">관광지 안내 보기 →</a></div>')
          .addTo(map);
      });
    });
  });
})();
