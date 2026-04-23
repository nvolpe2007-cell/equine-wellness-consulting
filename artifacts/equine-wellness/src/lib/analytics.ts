import { GA4_MEASUREMENT_ID } from "./site-config";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const analyticsEnabled: boolean = Boolean(GA4_MEASUREMENT_ID);

export function trackPageView(path: string, title: string): void {
  if (!analyticsEnabled || typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
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
  window.gtag("event", name, params);
}
