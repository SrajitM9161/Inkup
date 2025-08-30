export const ATTR_FIRST = "mp:first_touch";
export const ATTR_SESSION = "mp:session_touch";

function get(param) {
  if (typeof window === "undefined") return null;
  const u = new URLSearchParams(window.location.search);
  return u.get(param);
}

function now() {
  return new Date().toISOString();
}

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
}

function writeLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function captureAttribution() {
  if (typeof window === "undefined") return { first: null, session: null };
  const utm_source = get("utm_source");
  const utm_medium = get("utm_medium");
  const utm_campaign = get("utm_campaign");
  const utm_term = get("utm_term");
  const utm_content = get("utm_content");
  const referrer = document.referrer || null;

  const visit = {
    utm_source: utm_source || null,
    utm_medium: utm_medium || null,
    utm_campaign: utm_campaign || null,
    utm_term: utm_term || null,
    utm_content: utm_content || null,
    referrer: referrer || null,
    landing_page: typeof window !== "undefined" ? window.location.href : null,
    ts: now()
  };

  const first = readLS(ATTR_FIRST) || {
    ...visit,
    utm_source: visit.utm_source || "direct",
    referrer: visit.referrer || "direct"
  };

  writeLS(ATTR_FIRST, first);
  writeLS(ATTR_SESSION, visit);

  return { first, session: visit };
}
