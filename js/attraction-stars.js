// 모든 Leaflet 지도에 js/attractions.js의 관광지를 별 마커로 얹는다.
// worker.js가 leaflet.js 바로 뒤에 이 파일과 attractions.js를 끼워 넣으므로
// 지도 스크립트가 L.map()을 부르기 전에 훅이 등록된다. 지역을 추가하면 자동으로 별이 생긴다.
(function () {
  if (!window.L || !L.Map || typeof ATTRACTIONS === "undefined") return;
  var css = document.createElement("style");
  css.textContent =
    ".attr-star{font-size:18px;line-height:20px;text-align:center;filter:drop-shadow(0 1px 2px rgba(0,0,0,.55));cursor:pointer}" +
    ".attr-star-pop b{display:block;margin-bottom:4px}";
  document.head.appendChild(css);
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var MIN_ZOOM = 11;
  L.Map.addInitHook(function () {
    var map = this;
    // 관광지 전용 지도(#attractionsMap)는 항상 보이고, 다른 지도는 확대했을 때만 보인다
    var alwaysOn = map.getContainer && map.getContainer().id === "attractionsMap";
    var group = L.layerGroup();
    var icon = L.divIcon({ html: '<div class="attr-star">⭐</div>', className: "", iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -10] });
    Object.keys(ATTRACTIONS).forEach(function (regionId) {
      (ATTRACTIONS[regionId].items || []).forEach(function (it) {
        var href = "/" + regionId + "-attractions#" + it.id;
        L.marker([it.lat, it.lng], { icon: icon, zIndexOffset: 2000, title: it.ko + " " + it.zh, keyboard: true })
          .bindPopup('<div class="attr-star-pop"><b>⭐ ' + esc(it.ko) + " " + esc(it.zh) + '</b><a href="' + href + '">관광지 안내 보기 →</a></div>')
          .addTo(group);
      });
    });
    function sync() {
      var show = alwaysOn || map.getZoom() >= MIN_ZOOM;
      if (show && !map.hasLayer(group)) group.addTo(map);
      if (!show && map.hasLayer(group)) map.removeLayer(group);
    }
    map.on("zoomend", sync);
    map.whenReady(sync);
  });
})();
