import { GA4_MEASUREMENT_ID } from "./site-config";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const analyticsEnabled: boolean = Boolean(GA4_MEASUREMENT_ID);

const CONSENT_STORAGE_KEY = "cookie-consent.analytics.v1";

export type ConsentChoice = "granted" | "denied";

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;
    return null;
  } catch {
    return null;
  }
}

function applyGtagConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", { analytics_storage: choice });
}

export const COOKIE_CONSENT_RESET_EVENT = "cookie-consent:reset";

export function clearStoredConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // ignore storage failures
  }
  applyGtagConsent("denied");
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_RESET_EVENT));
}

export function setAnalyticsConsent(choice: ConsentChoice): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // ignore storage failures (e.g., private mode)
    }
  }
  applyGtagConsent(choice);
}

export function initAnalyticsConsent(): void {
  const stored = getStoredConsent();
  if (stored) applyGtagConsent(stored);
}

function consentGranted(): boolean {
  return getStoredConsent() === "granted";
}

export function trackPageView(path: string, title: string): void {
  if (!analyticsEnabled || typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  if (!consentGranted()) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
    send_to: GA4_MEASUREMENT_ID,
  });
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
): void {
  if (!analyticsEnabled || typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  if (!consentGranted()) return;
  window.gtag("event", name, params);
}
