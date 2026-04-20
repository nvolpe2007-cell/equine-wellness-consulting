import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { AnimatedHeading } from "@/components/ui/AnimatedText";

export function ServiceArea() {
  return (
    <section
      aria-label="Service area"
      className="relative overflow-hidden bg-muted py-20 md:py-28"
    >
      {/* Soft, stylized map / topography background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-70"
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="serviceAreaGlow" cx="50%" cy="55%" r="55%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.18" />
              <stop offset="55%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </radialGradient>
            <pattern
              id="serviceAreaGrid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeOpacity="0.06"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="800" height="400" fill="url(#serviceAreaGrid)" />
          <rect width="800" height="400" fill="url(#serviceAreaGlow)" />
          {/* Stylized contour-like lines */}
          <g
            fill="none"
            stroke="hsl(var(--primary))"
            strokeOpacity="0.18"
            strokeWidth="1.2"
          >
            <path d="M -40 280 C 120 240, 260 320, 420 270 S 720 200, 860 250" />
            <path d="M -40 220 C 140 190, 280 250, 440 210 S 720 160, 860 200" />
            <path d="M -40 160 C 160 140, 320 190, 480 160 S 720 120, 860 150" />
            <path d="M -40 100 C 180 90, 360 140, 520 110 S 720 80, 860 100" />
          </g>
          {/* Concentric service-radius rings around an LA-ish point */}
          <g
            transform="translate(380 220)"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeOpacity="0.45"
          >
            <circle r="120" strokeWidth="1.2" strokeDasharray="3 6" />
            <circle r="80" strokeWidth="1.2" strokeDasharray="3 6" />
            <circle r="42" strokeWidth="1.4" />
            <circle r="6" fill="hsl(var(--accent))" stroke="none" />
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <AnimatedHeading
            eyebrow="Where I Work"
            eyebrowClassName="inline-block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3"
            text="Serving horses across Southern California."
            as="h2"
            className="text-3xl md:text-5xl font-serif text-foreground leading-tight"
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/85">
            <p className="text-lg leading-relaxed">
              Susie H. Lytal, MS travels to barns and private facilities across
              the greater Los Angeles area — bringing every modality on-site so
              your horse stays in their familiar environment for each session.
            </p>
            <p className="text-lg leading-relaxed">
              Most regular clients are within roughly a 60-mile radius of the
              LA metro. Travel beyond that radius is often available for
              full-barn days and event work — call or text to discuss.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm text-foreground shadow-sm"
              data-testid="badge-service-region"
            >
              <MapPin className="h-4 w-4 text-accent" />
              Southern California &middot; LA metro
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm text-foreground shadow-sm">
              On-site at your barn
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm text-foreground shadow-sm">
              By appointment
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
