export const SITE_URL: string =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://equinebodywork.com";

export const GSC_VERIFICATION: string =
  (import.meta.env.VITE_GSC_VERIFICATION as string | undefined) ?? "";

export const GA4_MEASUREMENT_ID: string =
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined) ?? "";
