// 모든 Leaflet 지도에 js/attractions.js의 관광지를 별 마커로 얹는다.
// worker.js가 leaflet.js 바로 뒤에 이 파일과 attractions.js를 끼워 넣으므로
// 지도 스크립트가 L.map()을 부르기 전에 훅이 등록된다. 지역을 추가하면 자동으로 별이 생긴다.
(function () {
  if (!window.L || !L.Map || typeof ATTRACTIONS === "undefined") return;
  var css = document.createElement("style");
  css.textContent =
    ".attr-star{font-size:18px;line-height:20px;text-align:center;filter:drop-shadow(0 1px 2px rgba(0,0,0,.55));cursor:pointer}" +
    ".attr-popup .leaflet-popup-content-wrapper{border-radius:18px;padding:0;box-shadow:var(--shadow-lg,0 10px 30px rgba(0,0,0,.18))}" +
    ".attr-popup .leaflet-popup-content{margin:0;width:auto!important}" +
    ".attr-pop{box-sizing:border-box;width:min(240px,72vw);padding:14px 16px;font-family:var(--font-body,Pretendard,sans-serif)}" +
    ".attr-pop-badge{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:700;color:var(--terracotta-dark,#a8562c);background:var(--terracotta-tint,#f6e6da);padding:3px 9px;border-radius:999px;line-height:1.3}" +
    ".attr-pop-name{display:block;margin:10px 0 0;font-family:var(--font-display,inherit);font-weight:700;font-size:15px;line-height:1.35;color:var(--ink,#2b2420);word-break:keep-all;overflow-wrap:anywhere}" +
    ".attr-pop-zh{display:block;margin:2px 0 0;font-size:12px;line-height:1.4;color:var(--ink-faint,#9a8f86)}" +
    ".attr-pop-btn{display:block;margin:12px 0 0;padding:9px 12px;border-radius:12px;background:var(--terracotta,#c2703f);color:#fff!important;box-shadow:0 2px 6px rgba(156,82,40,.28);font-size:12.5px;font-weight:700;text-align:center;text-decoration:none}" +
    ".attr-pop-btn:hover,.attr-pop-btn:active{background:var(--terracotta-dark,#9c5228)}" +
    ".attr-popup a.leaflet-popup-close-button{top:8px;right:8px}";
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
          .bindPopup(
            '<div class="attr-pop"><span class="attr-pop-badge">★ 관광지</span>' +
            '<span class="attr-pop-name">' + esc(it.ko) + '</span>' +
            '<span class="attr-pop-zh">' + esc(it.zh) + '</span>' +
            '<a class="attr-pop-btn" href="' + href + '">관광지 안내 보기 →</a></div>',
            { className: "attr-popup", maxWidth: 280, minWidth: 0, offset: [0, -4], autoPan: true, autoPanPaddingTopLeft: L.point(16, 70), autoPanPaddingBottomRight: L.point(window.innerWidth < 768 ? 170 : 24, window.innerWidth < 768 ? 60 : 24) })
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
