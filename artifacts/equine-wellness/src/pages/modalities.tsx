import { motion } from "framer-motion";
import { Info } from "lucide-react";

export default function Modalities() {
  const modalities = [
    {
      id: "massage",
      title: "Equine Sports Massage",
      subtitle: "Certified Application",
      description: "A focused, hands-on session designed to support muscular relaxation, enhance flexibility, and promote overall comfort. As a Certified Equine Sports Massage Therapist, Susie applies specific techniques to address areas of tension, which may help the horse move more freely and comfortably.",
      image: "/images/gallery-massage.png",
    },
    {
      id: "pemf",
      title: "PEMF (Pulsed Electromagnetic Field)",
      subtitle: "Featuring Magnawave Equipment",
      description: "PEMF uses electromagnetic fields to support cellular health. During a session, a large loop is gently placed over the horse's body. This non-invasive modality may contribute to natural recovery processes, support relaxation, and promote a general sense of well-being.",
      image: "/images/gallery-pemf.png",
    },
    {
      id: "red-light",
      title: "Red Light Application",
      subtitle: "Featuring RevitaVet Equipment",
      description: "Targeted red and infrared light is applied to specific areas of the horse's body. This modality is commonly used to support soft tissue health and may assist in maintaining comfort and flexibility. It is a quiet, deeply relaxing experience for the horse.",
      image: "/images/gallery-redlight.png",
    },
    {
      id: "cold-laser",
      title: "Cold Laser",
      subtitle: "Low-Level Light Application",
      description: "Cold laser utilizes specific wavelengths of light to interact with tissue. Used selectively during sessions, it may support the body's natural response mechanisms and contribute to overall muscular comfort without generating heat.",
      image: "/images/gallery-pasture.png", // Using a serene image here
    },
    {
      id: "tens",
      title: "TENS (Transcutaneous Electrical Nerve Stimulation)",
      subtitle: "Featuring TrueStim Equipment",
      description: "TENS involves the delivery of mild electrical impulses to support comfort. When integrated into a session, it can be used to help the horse relax tense muscles and may support an improved range of motion.",
      image: "/images/gallery-hands.png",
    },
    {
      id: "tecar",
      title: "TECAR",
      subtitle: "Transfer of Energy Capacitive and Resistive",
      description: "TECAR utilizes radiofrequency energy to support tissue health from within. It is applied smoothly over the horse's body and may contribute to enhanced circulation, localized comfort, and muscular relaxation.",
      image: "/images/gallery-aisle.png",
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card py-20 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-foreground mb-6"
          >
            Wellness Modalities
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-light leading-relaxed"
          >
            A multi-faceted approach to equine comfort. Every session is customized to your horse's unique biomechanical needs.
          </motion.p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-accent/10 border-y border-accent/20">
        <div className="container mx-auto px-4 py-6 flex items-start gap-4">
          <Info className="h-6 w-6 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80 leading-relaxed max-w-4xl">
            <strong>Professional Disclaimer:</strong> The modalities listed below are provided to support general wellness, comfort, and athletic performance. They are not intended to replace veterinary care. Susie H. Lytal is an Equine Biomechanist and Certified Equine Sports Massage Therapist, not a veterinarian. We do not diagnose, treat, or prescribe for any medical conditions. We strongly encourage all clients to work closely with their veterinarian.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="space-y-24">
          {modalities.map((modality, index) => (
            <motion.div 
              key={modality.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border">
                  <img 
                    src={modality.image} 
                    alt={modality.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div>
                  <h3 className="text-sm font-sans tracking-widest text-primary uppercase mb-2">
                    {modality.subtitle}
                  </h3>
                  <h2 className="text-3xl md:text-4xl font-serif text-foreground">
                    {modality.title}
                  </h2>
                </div>
                <div className="w-12 h-1 bg-accent rounded-full" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {modality.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
