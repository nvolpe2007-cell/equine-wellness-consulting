import { ArrowRight, Quote, Sparkles } from "lucide-react";
import barnHero from "@assets/stock_images/barn-hero.jpg";
import massageHands from "@assets/0629_LOC_Horse02_CBH_t1170_1776529181857.jpg";

export type PaletteVariant = "current" | "hybrid" | "luxury";

const palettes: Record<PaletteVariant, Record<string, string>> = {
  current: {
    "--background": "40 33% 96%",
    "--foreground": "30 20% 15%",
    "--primary": "146 17% 35%",
    "--primary-foreground": "40 33% 96%",
    "--accent": "33 60% 60%",
    "--accent-foreground": "40 33% 96%",
    "--card": "40 33% 98%",
    "--card-foreground": "30 20% 15%",
    "--muted": "40 15% 90%",
    "--muted-foreground": "30 10% 40%",
    "--border": "40 15% 85%",
    "--font-sans": "'DM Sans', sans-serif",
    "--font-serif": "'Playfair Display', serif",
  },
  hybrid: {
    "--background": "40 33% 96%",
    "--foreground": "0 0% 8%",
    "--primary": "0 0% 12%",
    "--primary-foreground": "40 33% 96%",
    "--accent": "42 65% 50%",
    "--accent-foreground": "0 0% 8%",
    "--card": "40 33% 99%",
    "--card-foreground": "0 0% 8%",
    "--muted": "40 15% 92%",
    "--muted-foreground": "0 0% 32%",
    "--border": "40 12% 84%",
    "--font-sans": "'DM Sans', sans-serif",
    "--font-serif": "'Playfair Display', serif",
  },
  luxury: {
    "--background": "0 0% 6%",
    "--foreground": "40 30% 96%",
    "--primary": "42 75% 58%",
    "--primary-foreground": "0 0% 6%",
    "--accent": "42 75% 58%",
    "--accent-foreground": "0 0% 6%",
    "--card": "0 0% 10%",
    "--card-foreground": "40 30% 96%",
    "--muted": "0 0% 14%",
    "--muted-foreground": "40 15% 72%",
    "--border": "42 25% 22%",
    "--font-sans": "'DM Sans', sans-serif",
    "--font-serif": "'Playfair Display', serif",
  },
};

/**
 * PaletteStack — VERBATIM extraction of the live equine-wellness components,
 * for side-by-side palette comparison only:
 *   - Hero block from artifacts/equine-wellness/src/pages/home.tsx (lines 36–120)
 *   - One modality card from the same file's services map (lines 240–292),
 *     using the "Equine Sports Massage" entry
 *   - One testimonial figure from
 *     artifacts/equine-wellness/src/components/sections/Testimonials.tsx
 *     (lines 60–85), using the first entry
 *
 * Differences from live (strictly to make extraction work in the sandbox):
 *   - <motion.*> swapped to plain HTML elements (no animation)
 *   - WordReveal/AccentFlourish swapped to static text (no animation)
 *   - wouter <Link> swapped to <a> (no router in sandbox)
 *   - animate-ken-burns class removed (no keyframe defined in sandbox)
 *   - Palette tokens overridden via inline CSS vars on the variant root
 */
export function PaletteStack({ variant }: { variant: PaletteVariant }) {
  return (
    <div
      className="font-sans bg-background text-foreground"
      style={palettes[variant] as React.CSSProperties}
    >
      {/* Hero Section — extracted from home.tsx */}
      <section className="relative h-[92vh] min-h-[640px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={barnHero}
            alt="Sunlit barn aisle at dawn — equine bodywork session setting"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm mb-8">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-white/90 font-sans tracking-widest uppercase text-xs">
                Susie H. Lytal, MS · Equine Biomechanist
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-[1.05]">
              <span className="block">Elevating equine performance</span>
              <span className="relative inline-block">
                <span className="italic text-accent/90 inline-block">
                  through science and care.
                </span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
              Professional equine bodywork and wellness consulting, grounded in graduate-level biomechanics expertise.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                className="group inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
              >
                Explore Modalities
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 px-8 text-base font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 hover:-translate-y-0.5 w-full sm:w-auto border border-white/20"
              >
                Meet Susie
              </a>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="h-10 w-6 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
            <div className="h-1.5 w-1 rounded-full bg-white/70" />
          </div>
        </div>
      </section>

      {/* Services Preview — extracted from home.tsx, single card variant */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3">
                What I Offer
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4 leading-tight">
                Wellness sessions, tailored.
              </h2>
              <p className="text-muted-foreground text-lg">
                A comprehensive approach to equine comfort. Each session is tailored to your horse's unique biomechanical needs, drawing from a range of modalities to support optimal movement and well-being.
              </p>
            </div>
            <a
              href="#"
              className="group inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
            >
              View all modalities
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-shadow duration-500 group flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img
                  src={massageHands}
                  alt="Equine Sports Massage for horses — Certified Application"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-[0.65rem] font-sans tracking-[0.2em] text-accent uppercase mb-2">
                  Certified Application
                </span>
                <h3 className="text-xl font-serif text-foreground mb-3">
                  Equine Sports Massage
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  Targeted hands-on techniques that may support muscular relaxation, flexibility, and overall comfort.
                </p>
                <a
                  href="#"
                  className="mt-6 inline-flex items-center text-sm font-medium text-primary group/link"
                >
                  Learn more
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — extracted from Testimonials.tsx, single figure */}
      <section
        aria-label="Client testimonials"
        className="bg-background py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3">
              From the Barn Aisle
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground leading-tight">
              What clients are saying.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <figure className="relative bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-500 flex flex-col">
              <Quote
                aria-hidden="true"
                className="absolute -top-4 left-6 h-8 w-8 text-accent bg-card p-1.5 rounded-full border border-border"
              />
              <blockquote className="font-serif italic text-xl md:text-2xl leading-snug text-foreground flex-1">
                &ldquo;After Susie's first session, my gelding came out the next morning swinging through his back like he hadn't in months. She explained every choice she made — I finally felt like I understood my horse's body.&rdquo;
              </blockquote>
              <span
                aria-hidden="true"
                className="block w-12 h-1 bg-accent rounded-full mt-6"
              />
              <figcaption className="mt-4 text-sm font-sans tracking-wider uppercase text-primary">
                Megan, Hunter/Jumper &mdash; &ldquo;Indigo&rdquo;
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}
