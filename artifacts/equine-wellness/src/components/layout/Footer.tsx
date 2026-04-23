import { Link } from "wouter";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { analyticsEnabled, clearStoredConsent } from "@/lib/analytics";

export function Footer() {
  const handleCookiePreferences = () => {
    clearStoredConsent();
  };

  return (
    <footer className="bg-foreground text-background py-16 mt-20">
      <div className="container mx-auto px-4 mb-12 pb-12 border-b border-white/10">
        <div className="max-w-2xl">
          <NewsletterSignup
            variant="footer"
            source="footer"
            heading="The Worthy Horse News"
            subheading="A monthly dispatch on equine wellness and biomechanics. One thoughtful note a month."
          />
        </div>
      </div>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-serif text-2xl mb-4 text-primary-foreground">Equine Bodywork and Wellness Consulting</h2>
          <p className="text-muted/80 text-sm max-w-md mb-6 leading-relaxed">
            Professional equine biomechanics and wellness services. Susie H. Lytal, MS brings graduate-level expertise to support your horse's performance and well-being.
          </p>
          <div className="text-xs text-muted/60 max-w-sm">
            <p className="mb-2">Disclaimer: Susie H. Lytal is not a veterinarian. Equine bodywork and wellness sessions are not a substitute for veterinary care. We do not diagnose, treat, or prescribe for any medical condition. Please consult with your veterinarian regarding your horse's health.</p>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg mb-4 text-primary-foreground">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/bio" className="text-muted hover:text-white transition-colors text-sm" data-testid="link-footer-bio">About Susie</Link>
            </li>
            <li>
              <Link href="/modalities" className="text-muted hover:text-white transition-colors text-sm" data-testid="link-footer-modalities">Modalities</Link>
            </li>
            <li>
              <Link href="/gallery" className="text-muted hover:text-white transition-colors text-sm" data-testid="link-footer-gallery">Gallery</Link>
            </li>
            <li>
              <Link href="/partners" className="text-muted hover:text-white transition-colors text-sm" data-testid="link-footer-partners">Trusted Partners</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg mb-4 text-primary-foreground">Contact</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li>
              <a href="tel:+13104884389" className="hover:text-white transition-colors" data-testid="link-footer-phone">
                (310) 488-4389
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-xs text-muted/60">
        <p>&copy; {new Date().getFullYear()} Equine Bodywork and Wellness Consulting. All rights reserved.</p>
        {analyticsEnabled && (
          <p className="mt-2">
            <button
              type="button"
              onClick={handleCookiePreferences}
              data-testid="button-cookie-preferences"
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Cookie preferences
            </button>
          </p>
        )}
      </div>
    </footer>
  );
}
