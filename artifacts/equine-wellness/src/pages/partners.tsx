import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { LineReveal } from "@/components/ui/AnimatedText";
import { spring } from "@/lib/motion";

export default function Partners() {
  const reduce = useReducedMotion();
  const partners = [
    {
      name: "Magnawave",
      description:
        "Industry-leading PEMF (Pulsed Electromagnetic Field) equipment. Magnawave systems are used to support cellular function, relaxation, and overall wellness in horses.",
      role: "PEMF Equipment Provider",
      link: "#",
    },
    {
      name: "RevitaVet",
      description:
        "Advanced red light and infrared technology. RevitaVet systems deliver targeted light application to support soft tissue health and comfort.",
      role: "Red Light Equipment Provider",
      link: "#",
    },
    {
      name: "TrueStim",
      description:
        "Innovative TENS (Transcutaneous Electrical Nerve Stimulation) devices designed to support muscular relaxation and comfort during sessions.",
      role: "TENS Equipment Provider",
      link: "#",
    },
    {
      name: "BeneFab",
      description:
        "High-quality equine wellness products, including ceramic-infused fabrics that may help support circulation and comfort for your horse between sessions.",
      role: "Equine Wellness Products",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-card overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <span className="block mb-6 gold-rule" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-5 font-medium">
                Trusted Partners
              </p>
              <motion.h1
                className="text-5xl md:text-7xl font-serif font-[500] text-foreground leading-[1.0] tracking-tight"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                Trusted Partners
              </motion.h1>
            </div>
            <div className="lg:col-span-5 lg:pb-3 lg:pl-10 lg:border-l lg:border-border">
              <LineReveal
                text="The tools, brands, and equipment I trust to support your horse's wellness."
                as="p"
                whileInView={false}
                delay={0.45}
                className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
              />
            </div>
          </div>
        </div>
        <div className="divider-gold" />
      </section>

      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <aside className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <span className="block mb-5 gold-rule" aria-hidden="true" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              I carefully select the equipment and products used during my sessions. Because I believe in these brands, I maintain referral partnerships with several of them. If you are interested in purchasing equipment or products for your own use, you may be able to receive a discount through my partner links below.
            </p>
          </aside>

          {/* Partner cards float in from alternating horizontal offsets */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {partners.map((partner, i) => {
              const xOffset = i % 2 === 0 ? -24 : 24;
              return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, x: xOffset, y: 16 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <motion.div
                  className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col h-full cursor-default"
                  initial="rest"
                  whileHover={reduce ? undefined : "hover"}
                  animate="rest"
                  variants={{
                    rest: {
                      y: 0,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    },
                    hover: {
                      y: -6,
                      boxShadow:
                        "0 20px 40px rgba(0,0,0,0.25), 0 0 20px rgba(198,163,40,0.07)",
                      transition: spring.snappy,
                    },
                  }}
                >
                  <div className="mb-6">
                    <span className="text-xs font-sans tracking-widest text-primary uppercase mb-2 block">
                      {partner.role}
                    </span>
                    <h3 className="text-2xl font-serif text-foreground mb-4">
                      {partner.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {partner.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-6">
                    <a
                      href={partner.link}
                      className="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors group"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`link-partner-${partner.name.toLowerCase()}`}
                    >
                      Visit {partner.name}
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </motion.div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
