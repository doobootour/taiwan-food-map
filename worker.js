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

    return env.ASSETS.fetch(request);
  },
};
