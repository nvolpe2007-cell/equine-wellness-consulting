import { useEffect, useState } from "react";
import {
  analyticsEnabled,
  getStoredConsent,
  setAnalyticsConsent,
  trackPageView,
} from "@/lib/analytics";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled) return;
    if (getStoredConsent() === null) setVisible(true);
  }, []);

  if (!analyticsEnabled || !visible) return null;

  const handleAccept = () => {
    setAnalyticsConsent("granted");
    trackPageView(window.location.pathname, document.title);
    setVisible(false);
  };

  const handleDecline = () => {
    setAnalyticsConsent("denied");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      data-testid="cookie-consent-banner"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 md:pb-6"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
      }}
    >
      <div className="mx-auto max-w-3xl rounded-lg border border-border/60 bg-background/95 backdrop-blur shadow-lg ring-1 ring-black/5 px-5 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="font-serif text-sm md:text-[0.95rem] text-foreground/80 leading-relaxed">
            We use a few cookies to understand how visitors find this site. May
            we turn on analytics?
          </p>
          <div className="flex items-center gap-2 md:flex-shrink-0">
            <button
              type="button"
              onClick={handleDecline}
              data-testid="button-cookie-decline"
              className="text-sm px-4 py-2 rounded-md border border-border text-foreground/80 hover:bg-muted/40 transition-colors"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAccept}
              data-testid="button-cookie-accept"
              className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
