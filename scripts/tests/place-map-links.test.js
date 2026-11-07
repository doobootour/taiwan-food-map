const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "../..");
const placeLink = "https://maps.app.goo.gl/jcs5zwRhVnUft7hb6";
for (const file of ["generate-spot-pages.js", "generate-region-pages.js", "generate-category-pages.js"]) {
  const source = fs.readFileSync(path.join(root, "scripts", file), "utf8");
  const body = source.match(/function googleMapsUrl\(spot, fallbackLabel\) \{[\s\S]*?\n\}/)[0];
  const maps = vm.runInNewContext(`(${body})`, { URL });
  test(`${file}: preserves a collected place link instead of a Korean search`, () => {
    assert.equal(maps({name:"삼월초육 사택커피",link:placeLink,lat:25.221883,lng:121.6361852}), placeLink);
  });
  test(`${file}: rejects unsafe URLs and retains the legacy fallback`, () => {
    const spot={name:"Cafe",lat:25,lng:121};
    const fallback=maps(spot);
    assert.equal(maps({...spot,link:"javascript:alert(1)"}),fallback);
    assert.equal(maps({...spot,link:"https://maps.app.goo.gl.evil.example/a"}),fallback);
  });
  test(`${file}: escapes saved links in HTML attributes`, () => {
    assert.equal(maps({link:"https://www.google.com/maps?x=1&y=2"}),"https://www.google.com/maps?x=1&amp;y=2");
  });
}
test("detail generator fetches the saved link", () => {
  const source=fs.readFileSync(path.join(root,"scripts/generate-spot-pages.js"),"utf8");
  assert.match(source,/select=[^`]*nickname,link&order/);
});
test("removed venue has no detail page or sitemap entry", () => {
  assert.equal(fs.existsSync(path.join(root,"taipei-noodle-816.html")),false);
  assert.doesNotMatch(fs.readFileSync(path.join(root,"sitemap.xml"),"utf8"),/taipei-noodle-816/);
});
test("the coffee venue button points to its exact place link", () => {
  const html=fs.readFileSync(path.join(root,"taipei-brunch-832.html"),"utf8");
  assert.ok(html.includes(`class="btn primary" href="${placeLink}"`));
});
