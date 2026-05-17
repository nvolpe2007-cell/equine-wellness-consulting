import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin } from "lucide-react";
import { AnimatedHeading } from "@/components/ui/AnimatedText";

export function ServiceArea() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const auroraY = useTransform(scrollYProgress, [0, 1], ["-60px", "60px"]);

  return (
    <section
      ref={sectionRef}
      aria-label="Service area"
      className="relative overflow-hidden bg-gold-aurora py-28 md:py-40"
    >
      {/* Soft aurora veils for depth — parallax on scroll */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ y: auroraY }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-32 -left-32 w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--gold-light) / 0.45), hsl(var(--gold) / 0.18), transparent 72%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/3 -right-40 w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-55"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--gold) / 0.42), hsl(var(--gold-deep) / 0.20), transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -bottom-40 left-1/4 w-[50vw] h-[50vw] rounded-full blur-[160px] opacity-50"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--gold-light) / 0.36), hsl(var(--gold) / 0.18), transparent 72%)",
          }}
        />
      </motion.div>
      {/* Static overlays stay outside the parallax container */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {/* Top + bottom hairline gold rules */}
        <div className="absolute top-0 inset-x-0 divider-gold" />
        <div className="absolute bottom-0 inset-x-0 divider-gold" />
        {/* Soft vignette to anchor type */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/40" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="gold-rule mb-5" />
          <AnimatedHeading
            eyebrow="Where I Work"
            eyebrowClassName="block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3"
            text="Serving horses across Southern California."
            as="h2"
            className="text-3xl md:text-5xl font-serif text-foreground leading-tight"
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/85">
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

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur border border-border px-4 py-2 text-sm text-foreground shadow-sm"
              data-testid="badge-service-region"
            >
              <MapPin className="h-4 w-4 text-accent" />
              Southern California &middot; LA metro
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur border border-border px-4 py-2 text-sm text-foreground shadow-sm">
              On-site at your barn
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur border border-border px-4 py-2 text-sm text-foreground shadow-sm">
              By appointment
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
