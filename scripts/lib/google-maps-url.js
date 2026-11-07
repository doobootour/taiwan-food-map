// Shared Google Maps button URL helper for static generators and tests.
// Prefer the original saved place/short link. Never invent a place page.
// When no allowed saved link exists, fall back to coordinate navigation only
// (not a Korean/name search that can miss the venue).

const GOOGLE_MAPS_HOSTS = new Set(["www.google.com", "google.com", "maps.google.com"]);

function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isAllowedGoogleMapsHttpsUrl(link) {
  if (typeof link !== "string") return false;
  const trimmed = link.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return false;
    if (url.hostname === "maps.app.goo.gl") return true;
    if (url.hostname === "goo.gl" && url.pathname.startsWith("/maps")) return true;
    if (GOOGLE_MAPS_HOSTS.has(url.hostname) && url.pathname.startsWith("/maps")) return true;
    return false;
  } catch (_) {
    return false;
  }
}

function isCoordinateQueryValue(value) {
  return /^-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?$/.test(String(value || "").trim());
}

function isCoordinateOnlyMapsUrl(link) {
  if (!isAllowedGoogleMapsHttpsUrl(link)) return false;
  try {
    const url = new URL(link.trim());
    if (url.hostname === "maps.app.goo.gl" || url.hostname === "goo.gl") return false;
    if (url.pathname.includes("/place")) return false;
    const q = url.searchParams.get("query") || url.searchParams.get("q") || "";
    if (isCoordinateQueryValue(q)) return true;
    if (url.pathname.startsWith("/maps/search/")) {
      const pathQuery = decodeURIComponent(url.pathname.slice("/maps/search/".length));
      if (isCoordinateQueryValue(pathQuery.split("@")[0])) return true;
    }
    return false;
  } catch (_) {
    return false;
  }
}

function hasExactPlaceLink(spot) {
  const link = typeof spot?.link === "string" ? spot.link.trim() : "";
  return isAllowedGoogleMapsHttpsUrl(link) && !isCoordinateOnlyMapsUrl(link);
}

function coordinateFallbackUrl(lat, lng) {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return "";
  return `https://www.google.com/maps/search/?api=1&query=${la},${ln}`;
}

function resolveOptions(fallbackLabelOrOptions) {
  if (fallbackLabelOrOptions && typeof fallbackLabelOrOptions === "object") {
    return fallbackLabelOrOptions;
  }
  // Legacy generators always embed the result in HTML attributes.
  return { html: true };
}

function googleMapsUrl(spot, fallbackLabelOrOptions) {
  const options = resolveOptions(fallbackLabelOrOptions);
  const html = options.html !== false;
  const link = typeof spot?.link === "string" ? spot.link.trim() : "";
  let url = "";
  if (isAllowedGoogleMapsHttpsUrl(link)) {
    url = link;
  } else {
    url = coordinateFallbackUrl(spot?.lat, spot?.lng);
  }
  if (!url) return "";
  return html ? escapeHtmlAttr(url) : url;
}

function googleMapsLinkLabel(spot, lang = "ko") {
  if (hasExactPlaceLink(spot)) {
    return lang === "en" ? "View on Google Maps" : "구글맵에서 보기";
  }
  return lang === "en" ? "View location" : "위치 보기";
}

function legacyNameSearchUrl(spot, fallbackLabel) {
  const query = encodeURIComponent(spot?.name || fallbackLabel || "");
  return `https://www.google.com/maps/search/${query}/@${spot.lat},${spot.lng},17z`;
}

module.exports = {
  escapeHtmlAttr,
  isAllowedGoogleMapsHttpsUrl,
  isCoordinateOnlyMapsUrl,
  hasExactPlaceLink,
  coordinateFallbackUrl,
  googleMapsUrl,
  googleMapsLinkLabel,
  legacyNameSearchUrl,
};
