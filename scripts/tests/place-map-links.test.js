const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../..");
const {
  googleMapsUrl,
  googleMapsLinkLabel,
  hasExactPlaceLink,
  isAllowedGoogleMapsHttpsUrl,
  isCoordinateOnlyMapsUrl,
  coordinateFallbackUrl,
  legacyNameSearchUrl,
} = require("../lib/google-maps-url");

const placeLink = "https://maps.app.goo.gl/jcs5zwRhVnUft7hb6";
const coordLink = "https://www.google.com/maps/search/?api=1&query=25.0559319,121.5100371";
const snapshot = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/data/eats-map-link-snapshot.json"), "utf8"),
);

test("shared helper preserves a collected place shortlink", () => {
  assert.equal(
    googleMapsUrl({ name: "삼월초육 사택커피", link: placeLink, lat: 25.22, lng: 121.63 }, { html: false }),
    placeLink,
  );
  assert.equal(hasExactPlaceLink({ link: placeLink }), true);
});

test("shared helper preserves coordinate-only originals and labels them as location", () => {
  assert.equal(isCoordinateOnlyMapsUrl(coordLink), true);
  assert.equal(hasExactPlaceLink({ link: coordLink }), false);
  assert.equal(googleMapsUrl({ link: coordLink, lat: 25, lng: 121 }, { html: false }), coordLink);
  assert.equal(googleMapsLinkLabel({ link: coordLink }, "ko"), "위치 보기");
  assert.equal(googleMapsLinkLabel({ link: placeLink }, "ko"), "구글맵에서 보기");
});

test("shared helper falls back to coordinates instead of a Korean name search", () => {
  const spot = { name: "복기중권면선", lat: 25.04, lng: 121.5 };
  const url = googleMapsUrl(spot, { html: false });
  assert.equal(url, coordinateFallbackUrl(25.04, 121.5));
  assert.doesNotMatch(url, /복기|%EB%B3%B5/);
  assert.notEqual(url, legacyNameSearchUrl(spot));
});

test("shared helper rejects unsafe URLs", () => {
  const spot = { name: "Cafe", lat: 25, lng: 121 };
  const fallback = googleMapsUrl(spot, { html: false });
  assert.equal(googleMapsUrl({ ...spot, link: "javascript:alert(1)" }, { html: false }), fallback);
  assert.equal(googleMapsUrl({ ...spot, link: "https://maps.app.goo.gl.evil.example/a" }, { html: false }), fallback);
  assert.equal(googleMapsUrl({ ...spot, link: "http://www.google.com/maps?q=1,2" }, { html: false }), fallback);
  assert.equal(isAllowedGoogleMapsHttpsUrl("https://evil.example/maps"), false);
});

test("shared helper escapes saved links for HTML attributes", () => {
  assert.equal(
    googleMapsUrl({ link: "https://www.google.com/maps/place/Test?x=1&y=2" }, { html: true }),
    "https://www.google.com/maps/place/Test?x=1&amp;y=2",
  );
});

test("host/path whitelist accepts only canonical Google Maps HTTPS URLs", () => {
  assert.equal(isAllowedGoogleMapsHttpsUrl("https://maps.app.goo.gl/abc"), true);
  assert.equal(isAllowedGoogleMapsHttpsUrl("https://goo.gl/maps/abc"), true);
  assert.equal(isAllowedGoogleMapsHttpsUrl("https://www.google.com/maps/place/Test"), true);
  assert.equal(isAllowedGoogleMapsHttpsUrl("https://maps.google.com/maps?q=1,2"), true);
  assert.equal(isAllowedGoogleMapsHttpsUrl("https://www.google.com/search?q=maps"), false);
});

for (const file of ["generate-spot-pages.js", "generate-region-pages.js", "generate-category-pages.js"]) {
  test(`${file} requires the shared maps helper`, () => {
    const source = fs.readFileSync(path.join(root, "scripts", file), "utf8");
    assert.match(source, /require\("\.\/lib\/google-maps-url"\)/);
    assert.doesNotMatch(source, /function googleMapsUrl\(/);
    assert.doesNotMatch(source, /encodeURIComponent\(spot\.name/);
  });
}

test("detail generator fetches link and paginates past the 1000-row cap", () => {
  const source = fs.readFileSync(path.join(root, "scripts/generate-spot-pages.js"), "utf8");
  assert.match(source, /nickname,link/);
  assert.match(source, /Range: `\$\{from\}-\$\{to\}`/);
  assert.match(source, /pageSize = 1000/);
  assert.match(source, /select=\$\{select\}/);
});

test("snapshot covers all 1001 eats and excludes removed 816", () => {
  assert.equal(snapshot.length, 1001);
  assert.equal(snapshot.some((s) => Number(s.id) === 816), false);
  const s832 = snapshot.find((s) => Number(s.id) === 832);
  assert.equal(s832.link, placeLink);
});

test("removed venue has no detail page or sitemap entry", () => {
  assert.equal(fs.existsSync(path.join(root, "taipei-noodle-816.html")), false);
  assert.doesNotMatch(fs.readFileSync(path.join(root, "sitemap.xml"), "utf8"), /taipei-noodle-816/);
});

test("coffee venue detail button keeps its exact place link", () => {
  const html = fs.readFileSync(path.join(root, "taipei-brunch-832.html"), "utf8");
  assert.ok(html.includes(`class="btn primary" href="${placeLink}"`));
  assert.ok(html.includes(">구글맵에서 보기</a>"));
});

test("static HTML no longer uses Hangul name-search map buttons for eats", () => {
  const hangulRe = /https:\/\/www\.google\.com\/maps\/search\/[^"\s]*[\uac00-\ud7a3%][^"\s]*\/@/;
  // Percent-encoded Hangul starts with %EC / %ED etc. Detect encoded Hangul syllables in search/@ URLs.
  const encodedHangulSearch = /https:\/\/www\.google\.com\/maps\/search\/[^"\s]*%(?:EA|EB|EC|ED)[^"\s]*\/@-?\d/;
  const offenders = [];
  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name === ".git" || ent.name === "node_modules" || ent.name === "scripts") continue;
      if (ent.name.includes("attraction")) continue; // attractions are out of scope
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".html")) {
        const html = fs.readFileSync(full, "utf8");
        if (encodedHangulSearch.test(html)) offenders.push(ent.name);
      }
    }
  }
  walk(root);
  assert.deepEqual(offenders, []);
});

test("Xiang Duck detail uses the original saved shortlink, not a Korean search", () => {
  const html = fs.readFileSync(
    path.join(root, "taipei-goose-xiang-duck-taipei-jinshan-south-branch-56.html"),
    "utf8",
  );
  assert.match(html, /class="btn primary" href="https:\/\/maps\.app\.goo\.gl\/4qHVuWuh4n4bZbNG8"/);
  assert.doesNotMatch(html, /maps\/search\/%EC%83%B9%EB%8D%95/);
});

test("generic name-search detail uses location label and coordinate URL", () => {
  const html = fs.readFileSync(path.join(root, "taipei-street_food-1017.html"), "utf8");
  assert.match(
    html,
    /class="btn primary" href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=25\.0864483,121\.5249692"[^>]*>위치 보기</,
  );
});

test("browser app.js helper matches shared fallback behavior", () => {
  const source = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
  assert.match(source, /function googleMapsUrl\(spot, fallbackLabel\)/);
  assert.match(source, /coordinateFallbackUrl/);
  assert.doesNotMatch(source, /encodeURIComponent\(spot\.name \|\| fallbackLabel/);
  const start = source.indexOf("function isAllowedGoogleMapsHttpsUrl");
  const end = source.indexOf("async function loadRecentContributors");
  assert.ok(start > 0 && end > start);
  const body = source.slice(start, end);
  const sandbox = { URL, console };
  vm.createContext(sandbox);
  vm.runInContext(body, sandbox);
  const url = sandbox.googleMapsUrl({ name: "한글가게", lat: 25.1, lng: 121.5 }, "");
  assert.equal(url, "https://www.google.com/maps/search/?api=1&amp;query=25.1,121.5");
  assert.equal(
    sandbox.googleMapsUrl({ link: placeLink, lat: 1, lng: 2 }, ""),
    placeLink,
  );
});

test("region.js and category.js defer to the shared app helper", () => {
  for (const file of ["js/region.js", "js/category.js"]) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    assert.doesNotMatch(source, /function googleMapsUrl\(/);
    assert.match(source, /googleMapsLinkLabel/);
  }
});

test("snapshot place-candidate rows resolve to their original saved links", () => {
  const places = snapshot.filter((s) => hasExactPlaceLink(s));
  assert.equal(places.length, 883);
  for (const spot of places) {
    assert.equal(googleMapsUrl(spot, { html: false }), spot.link.trim());
  }
});


test("generic name-search without place identity is not exact and uses coordinates", () => {
  const spot = {
    id: 1017,
    name: "王子起司馬鈴薯",
    link: "https://www.google.com/maps/search/?api=1&query=%E7%8E%8B%E5%AD%90%E8%B5%B7%E5%8F%B8%E9%A6%AC%E9%88%B4%E8%96%AF%20%E5%A3%AB%E6%9E%97",
    lat: 25.0864483,
    lng: 121.5249692,
  };
  assert.equal(hasExactPlaceLink(spot), false);
  assert.equal(googleMapsUrl(spot, { html: false }), coordinateFallbackUrl(spot.lat, spot.lng));
  assert.equal(googleMapsLinkLabel(spot, "ko"), "위치 보기");
});

test("query_place_id search URLs count as exact place links", () => {
  const spot = {
    link: "https://www.google.com/maps/search/?api=1&query=Test&query_place_id=ChIJUfD5bBSpQjQR8vMHzuT957k",
    lat: 25,
    lng: 121,
  };
  assert.equal(hasExactPlaceLink(spot), true);
  assert.equal(googleMapsUrl(spot, { html: false }), spot.link);
});

test("snapshot exact/location counts are 883 / 118 after integrating 26+493", () => {
  let exact = 0;
  for (const s of snapshot) if (hasExactPlaceLink(s)) exact += 1;
  assert.equal(exact, 883);
  assert.equal(snapshot.length - exact, 118);
});

test("resolved venue 47 detail uses query_place_id link, not coordinates", () => {
  const html = fs.readFileSync(path.join(root, "taipei-cafe-47.html"), "utf8");
  assert.match(html, /query_place_id=ChIJUfD5bBSpQjQR8vMHzuT957k/);
  assert.match(html, /class="btn primary" href="[^"]*query_place_id=/);
  assert.doesNotMatch(html, /class="btn primary" href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=25\.0559319,121\.5100371"/);
});

test("null coordinates do not become Null Island when a place link exists", () => {
  assert.equal(coordinateFallbackUrl(null, null), "");
  assert.equal(
    googleMapsUrl({ link: placeLink, lat: null, lng: null }, { html: false }),
    placeLink,
  );
});

test("910 coordinate maps?q label is location, not exact business", () => {
  const html = fs.readFileSync(path.join(root, "hualien-japanese-910.html"), "utf8");
  assert.match(html, /class="btn primary" href="https:\/\/www\.google\.com\/maps\?q=23\.9787142,121\.6091993"[^>]*>위치 보기</);
  const spot = snapshot.find((s) => Number(s.id) === 910);
  assert.equal(hasExactPlaceLink(spot), false);
  assert.equal(googleMapsLinkLabel(spot, "ko"), "위치 보기");
});

test("493 verified place link sample and unresolved stay location", () => {
  const html = fs.readFileSync(path.join(root, "hualien-cafe-20.html"), "utf8");
  assert.match(html, /query_place_id=ChIJZTAIRZafaDQRK89GuKqiXkQ/);
  assert.match(html, /class="btn primary" href="[^"]*query_place_id=/);
  const unresolved = snapshot.filter((s) => !hasExactPlaceLink(s));
  assert.equal(unresolved.length, 118);
  for (const s of unresolved.slice(0, 5)) {
    assert.equal(googleMapsLinkLabel(s, "ko"), "위치 보기");
  }
});

test("shared-coordinate venues 608 and 609 keep distinct place ids", () => {
  const a = fs.readFileSync(path.join(root, "tainan-taiwanese-movenpick-cafe-608.html"), "utf8");
  const b = fs.readFileSync(path.join(root, "tainan-hotpot-609.html"), "utf8");
  assert.match(a, /query_place_id=ChIJt0gcmL52bjQRMbQzbdMkpTA/);
  assert.match(b, /query_place_id=ChIJbwFmQBF3bjQRSofY7x6F6Rk/);
  assert.doesNotMatch(b, /query_place_id=ChIJt0gcmL52bjQRMbQzbdMkpTA/);
});
