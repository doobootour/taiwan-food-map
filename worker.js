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

    return env.ASSETS.fetch(request);
  },
};
