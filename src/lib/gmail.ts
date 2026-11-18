"use client";

/*
 * Opens a pre-filled Gmail draft addressed to Santhosh, sent from the visitor's
 * own Gmail account. Google does not allow a website to send mail from a
 * visitor's account by itself, so the visitor always presses Send in Gmail.
 *
 *   Android  → Gmail app (Chrome intent); falls back to Gmail on the web if the app is missing.
 *   iOS      → Gmail app (googlegmail:// scheme); falls back to Gmail on the web after a moment.
 *   Desktop  → Gmail compose window in a new tab.
 */

export type Draft = { to: string; subject?: string; body?: string };
export type Platform = "android" | "ios" | "desktop";
type Via = "app" | "web";

declare global {
  interface Window {
    /** Test hook: when present, receives the URL instead of the browser navigating. */
    __skkOpenGmail?: (url: string, via: Via) => void;
  }
}

const enc = encodeURIComponent;

export function gmailWebUrl({ to, subject = "", body = "" }: Draft) {
  const q = ["view=cm", "fs=1", `to=${enc(to)}`];
  if (subject) q.push(`su=${enc(subject)}`);
  if (body) q.push(`body=${enc(body)}`);
  return `https://mail.google.com/mail/?${q.join("&")}`;
}

function mailQuery({ subject = "", body = "" }: Draft) {
  const q = [subject && `subject=${enc(subject)}`, body && `body=${enc(body)}`].filter(Boolean).join("&");
  return q ? `?${q}` : "";
}

export function gmailAndroidIntent(d: Draft) {
  return (
    `intent:${d.to}${mailQuery(d)}` +
    `#Intent;scheme=mailto;action=android.intent.action.SENDTO;package=com.google.android.gm;` +
    `S.browser_fallback_url=${enc(gmailWebUrl(d))};end`
  );
}

export function gmailIosUrl({ to, subject = "", body = "" }: Draft) {
  const q = [`to=${enc(to)}`, subject && `subject=${enc(subject)}`, body && `body=${enc(body)}`].filter(Boolean).join("&");
  return `googlegmail:///co?${q}`;
}

export function mailtoUrl(d: Draft) {
  return `mailto:${d.to}${mailQuery(d)}`;
}

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
  return "desktop";
}

function go(url: string, via: Via, newTab = false) {
  if (window.__skkOpenGmail) return window.__skkOpenGmail(url, via);
  if (newTab) {
    const w = window.open(url, "_blank");
    if (w) {
      w.opener = null;
      return;
    }
  }
  window.location.href = url;
}

/** Must be called from a click or submit handler (pop-up blockers). Returns the platform used. */
export function openGmail(d: Draft): Platform {
  const platform = detectPlatform();
  if (platform === "android") {
    go(gmailAndroidIntent(d), "app");
  } else if (platform === "ios") {
    go(gmailIosUrl(d), "app");
    if (!window.__skkOpenGmail) {
      // If the Gmail app did not take over (not installed), continue in Gmail on the web.
      const timer = window.setTimeout(() => {
        if (document.visibilityState === "visible") window.location.href = gmailWebUrl(d);
      }, 1600);
      const cancel = () => window.clearTimeout(timer);
      document.addEventListener("visibilitychange", cancel, { once: true });
      window.addEventListener("pagehide", cancel, { once: true });
    }
  } else {
    go(gmailWebUrl(d), "web", true);
  }
  return platform;
}
