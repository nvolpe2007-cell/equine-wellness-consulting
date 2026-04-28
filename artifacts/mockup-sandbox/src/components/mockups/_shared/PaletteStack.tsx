import { ArrowRight, Phone, Quote, Sparkles } from "lucide-react";
import barnHero from "@assets/stock_images/barn-hero.jpg";
import massageHands from "@assets/0629_LOC_Horse02_CBH_t1170_1776529181857.jpg";

export type PaletteVariant = "current" | "hybrid" | "luxury";

type PaletteSpec = {
  cssVars: Record<string, string>;
  heroOverlay: string;
  italicAccentClass: string;
  buttonRadius: string;
  cardRadius: string;
  cardShadow: string;
  modalityImageRing: string;
  testimonialQuoteBg: string;
  scrollCueBorder: string;
  pillBorder: string;
  pillBg: string;
  pillText: string;
  goldRule: string;
  serifWeight: string;
};

const palettes: Record<PaletteVariant, PaletteSpec> = {
  current: {
    cssVars: {
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
    },
    heroOverlay:
      "bg-gradient-to-b from-black/30 via-black/40 to-black/70",
    italicAccentClass: "italic text-accent/90",
    buttonRadius: "rounded-full",
    cardRadius: "rounded-2xl",
    cardShadow: "shadow-sm",
    modalityImageRing: "shadow-lg",
    testimonialQuoteBg: "bg-card",
    scrollCueBorder: "border-white/40",
    pillBorder: "border-white/20",
    pillBg: "bg-white/10",
    pillText: "text-white/90",
    goldRule: "bg-accent",
    serifWeight: "font-normal",
  },
  hybrid: {
    cssVars: {
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
    },
    heroOverlay:
      "bg-gradient-to-b from-black/35 via-black/50 to-black/80",
    italicAccentClass: "italic text-accent",
    buttonRadius: "rounded-full",
    cardRadius: "rounded-2xl",
    cardShadow: "shadow-md",
    modalityImageRing: "shadow-xl ring-1 ring-black/5",
    testimonialQuoteBg: "bg-card",
    scrollCueBorder: "border-white/50",
    pillBorder: "border-accent/40",
    pillBg: "bg-black/20",
    pillText: "text-accent",
    goldRule: "bg-accent",
    serifWeight: "font-medium",
  },
  luxury: {
    cssVars: {
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
    },
    heroOverlay:
      "bg-gradient-to-b from-black/40 via-black/55 to-black",
    italicAccentClass: "italic text-accent",
    buttonRadius: "rounded-none",
    cardRadius: "rounded-none",
    cardShadow: "shadow-2xl",
    modalityImageRing: "shadow-2xl ring-1 ring-accent/20",
    testimonialQuoteBg: "bg-card",
    scrollCueBorder: "border-accent/60",
    pillBorder: "border-accent/40",
    pillBg: "bg-black/30",
    pillText: "text-accent",
    goldRule: "bg-accent",
    serifWeight: "font-medium",
  },
};

const FONT_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
.palette-root { font-family: 'DM Sans', sans-serif; }
.palette-root h1, .palette-root h2, .palette-root h3, .palette-root h4 { font-family: 'Playfair Display', serif; }
.palette-root .font-serif { font-family: 'Playfair Display', serif; }
.palette-root .font-sans { font-family: 'DM Sans', sans-serif; }
`;

export function PaletteStack({ variant }: { variant: PaletteVariant }) {
  const p = palettes[variant];
  const isLuxury = variant === "luxury";

  return (
    <>
      <style>{FONT_STYLES}</style>
      <div
        className="palette-root min-h-screen bg-background text-foreground"
        style={p.cssVars as React.CSSProperties}
      >
        {/* HERO */}
        <section className="relative h-[760px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={barnHero}
              alt="Sunlit barn aisle at dawn"
              className="w-full h-full object-cover object-center"
            />
            <div className={`absolute inset-0 ${p.heroOverlay}`} />
            {isLuxury && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)",
                }}
              />
            )}
          </div>
          <div className="container relative z-10 mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <div
                className={`inline-flex items-center gap-2 ${p.buttonRadius} border ${p.pillBorder} ${p.pillBg} px-4 py-1.5 backdrop-blur-sm mb-8`}
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span
                  className={`${p.pillText} font-sans tracking-widest uppercase text-xs`}
                >
                  Susie H. Lytal, MS · Equine Biomechanist
                </span>
              </div>
              <h1
                className={`text-5xl md:text-6xl ${p.serifWeight} font-serif text-white mb-6 leading-[1.05]`}
              >
                <span className="block">Elevating equine performance</span>
                <span className={`${p.italicAccentClass} inline-block`}>
                  through science and care.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                Professional equine bodywork and wellness consulting,
                grounded in graduate-level biomechanics expertise.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <span
                  className={`group inline-flex h-12 items-center justify-center ${p.buttonRadius} bg-primary px-8 text-base font-medium text-primary-foreground`}
                >
                  Explore Modalities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
                <span
                  className={`inline-flex h-12 items-center justify-center ${p.buttonRadius} bg-white/10 px-8 text-base font-medium text-white backdrop-blur-md border border-white/20`}
                >
                  Meet Susie
                </span>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
              <div
                className={`h-10 w-6 rounded-full border-2 ${p.scrollCueBorder} flex items-start justify-center pt-2`}
              >
                <div className="h-1.5 w-1 rounded-full bg-white/70" />
              </div>
            </div>
          </div>
        </section>

        {/* STATS STRIP (compressed, optional flavor) */}
        <section className="bg-primary text-primary-foreground py-8 border-y border-primary/20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { num: "MS", label: "Master of Science, Biomechanics" },
                { num: "6", label: "Wellness Modalities Offered" },
                {
                  num: "Certified",
                  label: "Equine Sports Massage Therapist",
                },
                { num: "100%", label: "Customized to Each Horse" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-serif mb-1">
                    {stat.num}
                  </div>
                  <div className="text-[0.65rem] md:text-xs uppercase tracking-wider leading-tight opacity-80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MODALITY CARD SECTION */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="inline-block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3">
                What I Offer
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4 leading-tight">
                Wellness sessions, tailored.
              </h2>
              <p className="text-muted-foreground text-base">
                A comprehensive approach to equine comfort. Each session
                is tailored to your horse's unique biomechanical needs.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start bg-card border border-border ${p.cardRadius} ${p.cardShadow} p-6 md:p-10`}
              >
                <div
                  className={`aspect-[4/3] overflow-hidden ${p.cardRadius} ${p.modalityImageRing}`}
                >
                  <img
                    src={massageHands}
                    alt="Equine sports massage session"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-5">
                  <span className="block text-xs font-sans tracking-[0.25em] text-accent uppercase">
                    Certified Application
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif text-foreground leading-tight">
                    Equine Sports Massage
                  </h3>
                  <span
                    className={`block w-12 h-[2px] ${p.goldRule}`}
                  />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    A focused, hands-on session designed to support
                    muscular relaxation, enhance flexibility, and promote
                    overall comfort. Performed by a Certified Equine
                    Sports Massage Therapist.
                  </p>
                  <div className="pt-2">
                    <p className="text-[0.65rem] font-sans tracking-[0.25em] text-primary uppercase mb-3">
                      By the numbers
                    </p>
                    <ul className="grid grid-cols-1 gap-2 text-sm">
                      {[
                        "60–90 min typical session",
                        "Hands-on, no equipment required",
                        "Performed by a Certified Equine Sports Massage Therapist",
                      ].map((stat) => (
                        <li
                          key={stat}
                          className={`${p.cardRadius} bg-muted border border-border px-4 py-2.5 text-foreground`}
                        >
                          {stat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="inline-flex items-center text-sm font-medium text-primary mt-3">
                    Learn more
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section
          aria-label="Client testimonial"
          className="bg-muted py-20"
        >
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3">
                From the Barn Aisle
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-tight">
                What clients are saying.
              </h2>
            </div>

            <div className="max-w-2xl mx-auto">
              <figure
                className={`relative ${p.testimonialQuoteBg} border border-border ${p.cardRadius} p-8 md:p-10 ${p.cardShadow}`}
              >
                <Quote
                  aria-hidden="true"
                  className={`absolute -top-4 left-6 h-9 w-9 text-accent ${p.testimonialQuoteBg} p-1.5 rounded-full border border-border`}
                />
                <blockquote className="font-serif italic text-xl md:text-2xl leading-snug text-foreground">
                  &ldquo;After Susie's first session, my gelding came out
                  the next morning swinging through his back like he
                  hadn't in months. She explained every choice she made —
                  I finally felt like I understood my horse's body.&rdquo;
                </blockquote>
                <span
                  aria-hidden="true"
                  className={`block w-12 h-1 ${p.goldRule} rounded-full mt-6`}
                />
                <figcaption className="mt-4 text-sm font-sans tracking-wider uppercase text-primary">
                  Megan, Hunter/Jumper &mdash; &ldquo;Indigo&rdquo;
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-14 bg-card border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm font-sans tracking-[0.25em] uppercase text-primary mb-3">
              Ready to begin
            </p>
            <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-6">
              Reach out to discuss your horse.
            </h3>
            <span
              className={`inline-flex h-12 items-center justify-center gap-2 ${p.buttonRadius} bg-primary px-8 text-base font-medium text-primary-foreground`}
            >
              <Phone className="h-4 w-4" />
              Call (310) 488-4389
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
