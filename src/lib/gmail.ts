"use client";

/*
 * Opens a pre-filled Gmail draft addressed to Santhosh, in the Gmail account
 * of the address the visitor typed in the form. The email is sent from that
 * account. Google does not allow a website to press Send for someone, so the
 * visitor always presses Send in Gmail.
 *
 *   Desktop  → Google's account chooser for that address (sign-in pre-filled if
 *              needed), then the Gmail compose window of that account, new tab.
 *   Android  → Gmail app compose, asked to use that account; falls back to the
 *              desktop route in the browser if the app is missing.
 *   iOS      → Gmail app compose (googlegmail://); falls back to the browser route.
 *              The iOS app opens on its active account; the From line can be switched.
 */

export type Draft = { to: string; from: string; subject?: string; body?: string };
export type Platform = "android" | "ios" | "desktop";
type Via = "app" | "web";

declare global {
  interface Window {
    /** Test hook: when present, receives the URL instead of the browser navigating. */
    __skkOpenGmail?: (url: string, via: Via) => void;
  }
}

const enc = encodeURIComponent;

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** Gmail compose window for one specific account (authuser = that address). */
export function gmailComposeUrl({ to, from, subject = "", body = "" }: Draft) {
  const q = [`authuser=${enc(from)}`, "view=cm", "fs=1", `to=${enc(to)}`];
  if (subject) q.push(`su=${enc(subject)}`);
  if (body) q.push(`body=${enc(body)}`);
  return `https://mail.google.com/mail/?${q.join("&")}`;
}

/** Selects (or signs in to) the visitor's Google account first, then continues to that account's compose window. */
export function gmailWebUrl(d: Draft) {
  return `https://accounts.google.com/AccountChooser?Email=${enc(d.from)}&continue=${enc(gmailComposeUrl(d))}`;
}

function mailQuery({ subject = "", body = "" }: Draft) {
  const q = [subject && `subject=${enc(subject)}`, body && `body=${enc(body)}`].filter(Boolean).join("&");
  return q ? `?${q}` : "";
}

export function gmailAndroidIntent(d: Draft) {
  return (
    `intent:${d.to}${mailQuery(d)}` +
    `#Intent;scheme=mailto;action=android.intent.action.SENDTO;package=com.google.android.gm;` +
    `S.fromAccountString=${enc(d.from)};` +
    `S.browser_fallback_url=${enc(gmailWebUrl(d))};end`
  );
}

export function gmailIosUrl({ to, subject = "", body = "" }: Draft) {
  const q = [`to=${enc(to)}`, subject && `subject=${enc(subject)}`, body && `body=${enc(body)}`].filter(Boolean).join("&");
  return `googlegmail:///co?${q}`;
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
