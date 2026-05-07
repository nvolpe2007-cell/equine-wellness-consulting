import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ease as easing } from "@/lib/motion";
import { useStickyVisible } from "@/hooks/useStickyVisible";

export type StickyNavSection = { id: string; label: string };

interface StickyNavProps {
  sections: StickyNavSection[];
  heroId: string;
  ariaLabel?: string;
}

export function StickyNav({
  sections,
  heroId,
  ariaLabel = "Jump to section",
}: StickyNavProps) {
  const reduce = useReducedMotion();
  const showNav = useStickyVisible(heroId);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sectionEls = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (sectionEls.length === 0) return;
    const visible = new Map<string, IntersectionObserverEntry>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry);
          } else {
            visible.delete(entry.target.id);
          }
        });
        if (visible.size > 0) {
          const topMost = [...visible.values()].reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top
              ? curr
              : prev,
          );
          setActiveId(topMost.target.id);
        }
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    sectionEls.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <AnimatePresence>
      {showNav && (
        <motion.div
          key="sticky-nav"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: easing.out }}
          className="fixed top-16 inset-x-0 z-40 bg-background/95 backdrop-blur border-b border-border"
        >
          <div className="container mx-auto px-4">
            <nav
              aria-label={ariaLabel}
              className="flex items-center gap-2 py-2.5 overflow-x-auto"
            >
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  aria-current={activeId === s.id ? "true" : undefined}
                  className={[
                    "shrink-0 px-4 py-1.5 rounded-full text-sm font-sans font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    activeId === s.id
                      ? "bg-primary text-primary-foreground border-primary shadow-gold-glow"
                      : "bg-card/80 text-muted-foreground border-border hover:text-foreground hover:border-primary/50",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
