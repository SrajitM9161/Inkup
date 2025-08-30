import mixpanel from "mixpanel-browser";
import { captureAttribution, ATTR_FIRST, ATTR_SESSION } from "./attribution";

let inited = false;

export function initMixpanel() {
  if (inited) return;
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;

  mixpanel.init(token, { debug: false, track_pageview: false, persistence: "localStorage" });

  const { first, session } = captureAttribution();

  const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;
  const lang = typeof navigator !== "undefined" ? navigator.language : null;
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : null;
  const screen_w = typeof window !== "undefined" ? window.screen?.width : null;
  const screen_h = typeof window !== "undefined" ? window.screen?.height : null;

  const supers = {
    timezone: tz,
    locale: lang,
    user_agent: ua,
    screen_w,
    screen_h,
    first_utm_source: first?.utm_source || null,
    first_utm_medium: first?.utm_medium || null,
    first_utm_campaign: first?.utm_campaign || null,
    first_referrer: first?.referrer || null,
    session_utm_source: session?.utm_source || null,
    session_utm_medium: session?.utm_medium || null,
    session_utm_campaign: session?.utm_campaign || null,
    session_referrer: session?.referrer || null
  };

  mixpanel.register(supers);

  inited = true;
}

export function identifyUser(user) {
  if (!user?.id) return;
  mixpanel.identify(user.id);
  mixpanel.people.set({
    $email: user.email || null,
    plan_type: user.plan || "free",
    credits_remaining: user.credits ?? null,
    signup_source: user.signup_source || null
  });
}

export function aliasUser(tempId, realId) {
  try { mixpanel.alias(realId, tempId); } catch {}
}

export function trackEvent(name, props = {}) {
  mixpanel.track(name, {
    ...props,
    page_path: typeof window !== "undefined" ? window.location.pathname : null,
    page_url: typeof window !== "undefined" ? window.location.href : null,
    ts: new Date().toISOString()
  });
}

export function setOnce(props = {}) {
  mixpanel.people.set_once(props);
}

export function register(props = {}) {
  mixpanel.register(props);
}

export function trackPageView(extra = {}) {
  trackEvent("Page Viewed", extra);
}
