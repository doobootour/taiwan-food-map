export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let changed = false;

    if (url.protocol === "http:") {
      url.protocol = "https:";
      changed = true;
    }
    if (url.hostname === "www.taiwanbite.com") {
      url.hostname = "taiwanbite.com";
      changed = true;
    }

    if (changed) {
      return Response.redirect(url.toString(), 301);
    }

    // Spots whose URL changed after a category/name fix (old slug -> new slug).
    const MOVED_SPOTS = {
      "/taipei-taiwanese-buckhon-tofu-guilin-prosperity-plaza-bra-85": "/taipei-korean-85",
    };
    const movedKey = url.pathname.replace(/\.html$/, "");
    if (MOVED_SPOTS[movedKey]) {
      url.pathname = MOVED_SPOTS[movedKey];
      return Response.redirect(url.toString(), 301);
    }

    // en/index.html is a directory index. Default HTML handling answers /en
    // with 307 → /en/, and relative assets on that URL 404 under /en/.
    // Keep the public URL slashless: /en is 200, /en/ redirects to /en.
    if (url.pathname === "/en/") {
      url.pathname = "/en";
      return Response.redirect(url.toString(), 307);
    }
    if (url.pathname === "/en") {
      const indexUrl = new URL(request.url);
      indexUrl.pathname = "/en/";
      const indexResponse = await env.ASSETS.fetch(new Request(indexUrl, request));
      return new Response(indexResponse.body, indexResponse);
    }

    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get("content-type") || "";
    if (!type.includes("text/html")) return response;
    // 관광지 별 마커: leaflet.js를 쓰는 모든 페이지에 attractions.js + attraction-stars.js를 붙인다.
    // HTML 파일을 직접 고치지 않으므로 03:00 재생성 뒤에도 유지된다.
    return new HTMLRewriter()
      .on('script[src*="leaflet@1.9.4/dist/leaflet.js"]', {
        element(el) {
          el.after('<script src="/js/attractions.js"></script><script src="/js/activities.js"></script><script src="/js/attraction-stars.js"></script>', { html: true });
        },
      })
      .transform(response);
  },
};
