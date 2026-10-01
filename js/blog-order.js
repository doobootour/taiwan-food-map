// Blog listing order. Newest publish date first.
// Keep this file free of other dependencies so both the browser (blog.html)
// and scripts/generate-blog-pages.js can use the same comparison.
//
// Date resolution, first match wins:
//   1. A date field on the list item (datePublished, published, publishedAt, date)
//   2. datesBySlug[slug], filled by the generator from the post page's
//      article:published_time (the same value as JSON-LD datePublished)
// A post with no parseable date sorts first (treated as newest). That covers a
// new BLOG_LIST row appended before blog.html's date map is regenerated.
// Among undated posts, a later original list index comes first.
// Equal timestamps still break ties by slug.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.publishRaw = api.publishRaw;
  root.compareBlogPosts = api.compareBlogPosts;
  root.sortBlogPosts = api.sortBlogPosts;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function postOf(entry) {
    return entry && entry.post ? entry.post : entry;
  }

  function indexOf(entry) {
    return entry && Number.isFinite(entry.index) ? entry.index : -1;
  }

  function publishRaw(post, datesBySlug) {
    const item = postOf(post);
    if (item) {
      const direct = item.datePublished || item.published || item.publishedAt || item.date;
      if (direct) return String(direct);
      if (datesBySlug && datesBySlug[item.slug]) return String(datesBySlug[item.slug]);
    }
    return "";
  }

  function slugOf(entry) {
    const item = postOf(entry);
    return String((item && item.slug) || "");
  }

  function compareBlogPosts(a, b, datesBySlug) {
    const ta = Date.parse(publishRaw(a, datesBySlug));
    const tb = Date.parse(publishRaw(b, datesBySlug));
    const aOk = Number.isFinite(ta);
    const bOk = Number.isFinite(tb);
    if (aOk && bOk && ta !== tb) return tb - ta;
    if (aOk && bOk) return slugOf(a).localeCompare(slugOf(b));
    if (aOk !== bOk) return aOk ? 1 : -1;
    const ia = indexOf(a);
    const ib = indexOf(b);
    if (ia !== ib) return ib - ia;
    return slugOf(a).localeCompare(slugOf(b));
  }

  function sortBlogPosts(posts, datesBySlug) {
    const decorated = posts.map((entry, index) => {
      if (entry && entry.post && Number.isFinite(entry.index)) return entry;
      return { post: entry, index };
    });
    return decorated.slice().sort((a, b) => compareBlogPosts(a, b, datesBySlug)).map(postOf);
  }

  return { publishRaw, compareBlogPosts, sortBlogPosts };
});
