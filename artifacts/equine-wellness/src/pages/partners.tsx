import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { WordReveal, LineReveal } from "@/components/ui/AnimatedText";

export default function Partners() {
  const partners = [
    {
      name: "Magnawave",
      description: "Industry-leading PEMF (Pulsed Electromagnetic Field) equipment. Magnawave systems are used to support cellular function, relaxation, and overall wellness in horses.",
      role: "PEMF Equipment Provider",
      link: "#"
    },
    {
      name: "RevitaVet",
      description: "Advanced red light and infrared technology. RevitaVet systems deliver targeted light application to support soft tissue health and comfort.",
      role: "Red Light Equipment Provider",
      link: "#"
    },
    {
      name: "TrueStim",
      description: "Innovative TENS (Transcutaneous Electrical Nerve Stimulation) devices designed to support muscular relaxation and comfort during sessions.",
      role: "TENS Equipment Provider",
      link: "#"
    },
    {
      name: "BeneFab",
      description: "High-quality equine wellness products, including ceramic-infused fabrics that may help support circulation and comfort for your horse between sessions.",
      role: "Equine Wellness Products",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card py-20 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <WordReveal
            text="Trusted Partners"
            as="h1"
            className="text-4xl md:text-5xl font-serif text-foreground mb-6"
            delay={0.1}
            stagger={0.07}
          />
          <LineReveal
            text="The tools, brands, and equipment I trust to support your horse's wellness."
            as="p"
            whileInView={false}
            delay={0.45}
            className="text-xl text-muted-foreground font-light leading-relaxed"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <p className="text-lg text-muted-foreground">
            I carefully select the equipment and products used during my sessions. Because I believe in these brands, I maintain referral partnerships with several of them. If you are interested in purchasing equipment or products for your own use, you may be able to receive a discount through my partner links below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="mb-6">
                <span className="text-xs font-sans tracking-widest text-primary uppercase mb-2 block">
                  {partner.role}
                </span>
                <h2 className="text-2xl font-serif text-foreground mb-4">{partner.name}</h2>
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
          ))}
        </div>
      </div>
    </div>
  );
}
