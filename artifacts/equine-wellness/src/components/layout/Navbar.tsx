import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { spring, ease as easing } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useIntroVisibility } from "@/components/intro/IntroVisibilityContext";

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
  const reduce = useReducedMotion();
  const { introActive, navRevealed } = useIntroVisibility();
  const hidden = introActive && !navRevealed;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{
        y: hidden ? -16 : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{ duration: hidden ? 0.35 : 0.6, ease: easing.out }}
      style={{ pointerEvents: hidden ? "none" : "auto" }}
      aria-hidden={hidden ? "true" : undefined}
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        scrolled
          ? "bg-background/90 border-border shadow-sm"
          : "bg-background/60 border-transparent",
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4 flex items-center justify-between transition-all duration-300",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 group"
          data-testid="link-home-logo"
        >
          <img
            src={`${import.meta.env.BASE_URL}favicon.svg`}
            alt=""
            aria-hidden="true"
            className="h-7 w-7 sm:h-9 sm:w-9 shrink-0"
            data-testid="img-header-mark"
          />
          <span className="flex flex-col items-start gap-0.5">
            <span className="font-serif text-xl font-medium text-foreground transition-colors group-hover:text-primary">
              Equine Bodywork and Wellness Consulting
            </span>
            <span className="text-[0.65rem] font-sans text-muted-foreground uppercase tracking-[0.2em]">
              Susie H. Lytal, MS · Equine Wellness Consultant
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => {
            const isActive = location === link.href;
            return (
              <motion.div
                key={link.href}
                className="relative"
                whileHover={reduce ? undefined : { scale: 1.04 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={spring.snappy}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative block text-sm font-medium transition-colors hover:text-primary py-1",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                  data-active={isActive}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                  {isActive && !reduce && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: spring.snappy.stiffness,
                        damping: spring.snappy.damping,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
          <motion.a
            href="tel:+13104884389"
            className="bg-gold-metallic shadow-gold-glow inline-flex h-10 items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-medium whitespace-nowrap transition-shadow hover:shadow-gold-glow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            data-testid="link-nav-contact"
            aria-label="Call (310) 488-4389"
            whileHover={reduce ? undefined : { y: -2, scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={spring.snappy}
          >
            <Phone className="h-3.5 w-3.5" />
            (310) 488-4389
          </motion.a>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
          aria-label="Toggle menu"
        >
          {reduce ? (
            isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {reduce ? (
        isOpen && (
          <div className="md:hidden border-t bg-background shadow-lg">
            <div className="px-4 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium transition-colors block",
                    location === link.href ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                  data-testid={`link-mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t">
                <a
                  href="tel:+13104884389"
                  className="bg-gold-metallic shadow-gold-glow inline-flex w-full h-12 items-center justify-center gap-2 rounded-full px-6 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                  data-testid="link-mobile-nav-contact"
                >
                  <Phone className="h-4 w-4" />
                  Call (310) 488-4389
                </a>
              </div>
            </div>
          </div>
        )
      ) : (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: easing.out }}
              className="md:hidden border-t bg-background overflow-hidden shadow-lg"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "text-lg font-medium transition-colors block",
                        location === link.href
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                      onClick={() => setIsOpen(false)}
                      data-testid={`link-mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.header>
  );
}
