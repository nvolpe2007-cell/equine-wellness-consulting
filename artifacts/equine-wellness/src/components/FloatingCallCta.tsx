import { Phone } from "lucide-react";

export function FloatingCallCta() {
  return (
    <a
      href="tel:+13104884389"
      aria-label="Call Susie at (310) 488-4389"
      data-testid="link-floating-call"
      className="md:hidden fixed right-4 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-xl shadow-primary/30 ring-1 ring-primary/40 transition-transform active:scale-95"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
      }}
    >
      <Phone className="h-4 w-4" />
      Call (310) 488-4389
    </a>
  );
}
