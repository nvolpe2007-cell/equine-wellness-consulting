import { Phone } from "lucide-react";
import { useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { spring } from "@/lib/motion";

export function FloatingCallCta() {
  const [location] = useLocation();
  const reduce = useReducedMotion();
  if (location.startsWith("/admin")) return null;

  return (
    <div
      className="md:hidden fixed right-4 z-50"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
    >
      <div className="relative inline-flex">
        {!reduce && (
          <>
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-primary/50 pointer-events-none"
              animate={{ scale: [1, 1.55, 1], opacity: [0.6, 0, 0.6] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.6,
              }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-primary/30 pointer-events-none"
              animate={{ scale: [1, 1.9, 1], opacity: [0.4, 0, 0.4] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
                repeatDelay: 0.6,
              }}
            />
          </>
        )}
        <motion.a
          href="tel:+13104884389"
          aria-label="Call Susie at (310) 488-4389"
          data-testid="link-floating-call"
          className="relative inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-xl shadow-primary/30 ring-1 ring-primary/40"
          whileHover={reduce ? undefined : { scale: 1.06 }}
          whileTap={reduce ? undefined : { scale: 0.96 }}
          transition={spring.snappy}
        >
          <Phone className="h-4 w-4" />
          Call (310) 488-4389
        </motion.a>
      </div>
    </div>
  );
}
