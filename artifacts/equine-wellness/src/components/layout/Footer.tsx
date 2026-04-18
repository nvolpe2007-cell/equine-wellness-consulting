import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 mt-20">
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
            <li>Serving [Region/Area - to be updated]</li>
            <li>
              <a href="mailto:contact@example.com" className="hover:text-white transition-colors" data-testid="link-footer-email">
                contact@example.com
              </a>
            </li>
            <li>
              <a href="tel:+1234567890" className="hover:text-white transition-colors" data-testid="link-footer-phone">
                (123) 456-7890
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-xs text-muted/60">
        <p>&copy; {new Date().getFullYear()} Equine Bodywork and Wellness Consulting. All rights reserved.</p>
      </div>
    </footer>
  );
}
