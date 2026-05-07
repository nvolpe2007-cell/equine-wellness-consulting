import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/bio", label: "About Susie" },
  { href: "/modalities", label: "Modalities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "Newsletter" },
  { href: "/partners", label: "Trusted Partners" },
  { href: "/survey", label: "PV Survey" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        scrolled ? "bg-background/90 border-border shadow-sm" : "bg-background/60 border-transparent"
      )}
    >
      <div className={cn(
        "container mx-auto px-4 flex items-center justify-between transition-all duration-300",
        scrolled ? "h-16" : "h-20"
      )}>
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group" data-testid="link-home-logo">
          <img
            src={`${import.meta.env.BASE_URL}favicon.svg`}
            alt=""
            aria-hidden="true"
            className="h-7 w-7 sm:h-9 sm:w-9 shrink-0"
            data-testid="img-header-mark"
          />
          <span className="flex flex-col items-start gap-0.5">
            <span className="font-serif text-xl font-medium text-foreground transition-colors group-hover:text-primary">Equine Bodywork and Wellness Consulting</span>
            <span className="text-[0.65rem] font-sans text-muted-foreground uppercase tracking-[0.2em]">Susie H. Lytal, MS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-underline text-sm font-medium transition-colors hover:text-primary",
                location === link.href ? "text-primary" : "text-muted-foreground"
              )}
              data-active={location === link.href}
              data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:+13104884389"
            className="bg-gold-metallic shadow-gold-glow inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all hover:shadow-gold-glow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            data-testid="link-nav-contact"
          >
            <Phone className="h-3.5 w-3.5" />
            (310) 488-4389
          </a>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t bg-background px-4 py-6 flex flex-col gap-4 shadow-lg absolute w-full"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-lg font-medium transition-colors",
                location === link.href ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => setIsOpen(false)}
              data-testid={`link-mobile-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t">
            <a
              href="tel:+13104884389"
              className="bg-gold-metallic shadow-gold-glow inline-flex w-full h-12 items-center justify-center gap-2 rounded-full px-6 py-2 text-base font-medium transition-all hover:shadow-gold-glow-lg"
              onClick={() => setIsOpen(false)}
              data-testid="link-mobile-nav-contact"
            >
              <Phone className="h-4 w-4" />
              Call (310) 488-4389
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
