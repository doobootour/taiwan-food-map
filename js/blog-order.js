// Blog listing order. Newest publish date first.
// Keep this file free of other dependencies so both the browser (blog.html)
// and scripts/generate-blog-pages.js can use the same comparison.
//
// Date resolution, first match wins:
//   1. A date field on the list item (datePublished, published, publishedAt, date)
//   2. datesBySlug[slug], filled by the generator from the post page's
//      article:published_time (the same value as JSON-LD datePublished)
// Posts with no parseable date sort last. Equal timestamps break ties by slug.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.publishRaw = api.publishRaw;
  root.compareBlogPosts = api.compareBlogPosts;
  root.sortBlogPosts = api.sortBlogPosts;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function publishRaw(post, datesBySlug) {
    if (post) {
      const direct = post.datePublished || post.published || post.publishedAt || post.date;
      if (direct) return String(direct);
      if (datesBySlug && datesBySlug[post.slug]) return String(datesBySlug[post.slug]);
    }
    return "";
  }

  function compareBlogPosts(a, b, datesBySlug) {
    const ta = Date.parse(publishRaw(a, datesBySlug));
    const tb = Date.parse(publishRaw(b, datesBySlug));
    const aOk = Number.isFinite(ta);
    const bOk = Number.isFinite(tb);
    if (aOk && bOk && ta !== tb) return tb - ta;
    if (aOk !== bOk) return aOk ? -1 : 1;
    return String((a && a.slug) || "").localeCompare(String((b && b.slug) || ""));
  }

  function sortBlogPosts(posts, datesBySlug) {
    return posts.slice().sort((a, b) => compareBlogPosts(a, b, datesBySlug));
  }

  return { publishRaw, compareBlogPosts, sortBlogPosts };
});
