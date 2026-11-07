// Shared Google Maps button URL helper for static generators and tests.
// Prefer an original saved link that identifies a place (shortlink, /place/,
// query_place_id, ftid, or cid). Never invent a place page.
// Coordinate-only saved links are kept as location navigation.
// Generic name-search URLs without place identity are NOT treated as exact:
// fall back to coordinate navigation (do not promise a business card).

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

function hasPlaceIdentity(link) {
  if (!isAllowedGoogleMapsHttpsUrl(link)) return false;
  try {
    const url = new URL(link.trim());
    if (url.hostname === "maps.app.goo.gl" || url.hostname === "goo.gl") return true;
    if (url.pathname.includes("/place")) return true;
    if (url.searchParams.get("query_place_id")) return true;
    if (url.searchParams.get("ftid")) return true;
    if (url.searchParams.get("cid")) return true;
    // /maps?cid=...
    if ([...url.searchParams.keys()].some((k) => k.toLowerCase() === "cid")) return true;
    // data=!... place feature ids sometimes embed 0x...:0x...
    if (/!1s0x[0-9a-f]+:0x[0-9a-f]+/i.test(url.href)) return true;
    return false;
  } catch (_) {
    return false;
  }
}

function isCoordinateOnlyMapsUrl(link) {
  if (!isAllowedGoogleMapsHttpsUrl(link)) return false;
  if (hasPlaceIdentity(link)) return false;
  try {
    const url = new URL(link.trim());
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

function isGenericNameSearchUrl(link) {
  if (!isAllowedGoogleMapsHttpsUrl(link)) return false;
  if (hasPlaceIdentity(link) || isCoordinateOnlyMapsUrl(link)) return false;
  try {
    const url = new URL(link.trim());
    const q = (url.searchParams.get("query") || url.searchParams.get("q") || "").trim();
    if (q && !isCoordinateQueryValue(q)) return true;
    if (url.pathname.startsWith("/maps/search/")) {
      const pathQuery = decodeURIComponent(url.pathname.slice("/maps/search/".length)).split("@")[0].trim();
      if (pathQuery && !isCoordinateQueryValue(pathQuery)) return true;
    }
    return false;
  } catch (_) {
    return false;
  }
}

function hasExactPlaceLink(spot) {
  const link = typeof spot?.link === "string" ? spot.link.trim() : "";
  return hasPlaceIdentity(link);
}

function coordinateFallbackUrl(lat, lng) {
  // Reject null/undefined/"" so Number(null)===0 cannot become Null Island.
  if (lat == null || lng == null || lat === "" || lng === "") return "";
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return "";
  return `https://www.google.com/maps/search/?api=1&query=${la},${ln}`;
}

function resolveOptions(fallbackLabelOrOptions) {
  if (fallbackLabelOrOptions && typeof fallbackLabelOrOptions === "object") {
    return fallbackLabelOrOptions;
  }
  return { html: true };
}

function googleMapsUrl(spot, fallbackLabelOrOptions) {
  const options = resolveOptions(fallbackLabelOrOptions);
  const html = options.html !== false;
  const link = typeof spot?.link === "string" ? spot.link.trim() : "";
  let url = "";
  if (hasPlaceIdentity(link)) {
    url = link;
  } else if (isCoordinateOnlyMapsUrl(link)) {
    url = link;
  } else {
    // Missing, invalid, or generic name-search without place identity → coordinates only.
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
  isGenericNameSearchUrl,
  hasPlaceIdentity,
  hasExactPlaceLink,
  coordinateFallbackUrl,
  googleMapsUrl,
  googleMapsLinkLabel,
  legacyNameSearchUrl,
};
