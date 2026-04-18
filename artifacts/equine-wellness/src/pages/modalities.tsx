import { motion } from "framer-motion";
import { Info, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { WordReveal, LineReveal, AnimatedHeading } from "@/components/ui/AnimatedText";
import massageHands from "@assets/0629_LOC_Horse02_CBH_t1170_1776529181857.jpg";
import horseStall from "@assets/stock_images/horse-stall.jpg";
import pemfWhiteHorse from "@assets/20260407_121449_1776528702902.jpg";
import pemfRear from "@assets/20260407_112708_1776528693859.jpg";
import redLightLeg from "@assets/20260319_191731_1776528710545.jpg";
import susieWithHorse from "@assets/20260401_140719_1776528664269.jpg";

const faqs = [
  {
    q: "What is equine bodywork?",
    a: "Equine bodywork is a non-invasive, hands-on approach designed to support a horse's muscular comfort, flexibility, and overall well-being. It draws on a combination of techniques — including sports massage and complementary modalities such as PEMF, red light, cold laser, TENS, and TECAR — and is offered as wellness support, not medical care."
  },
  {
    q: "Is this a substitute for veterinary care?",
    a: "No. Susie H. Lytal is an Equine Biomechanist and Certified Equine Sports Massage Therapist — not a veterinarian. Wellness sessions do not diagnose, treat, cure, or prescribe for any medical condition. We work alongside your primary veterinarian as part of a team approach to your horse's health."
  },
  {
    q: "How long does a session take?",
    a: "A typical session lasts approximately 60 to 90 minutes, depending on the horse and the modalities included. Susie tailors each session to the individual horse's needs, often combining hands-on massage with one or more complementary modalities."
  },
  {
    q: "Which modalities are offered?",
    a: "Six modalities are offered: Equine Sports Massage, PEMF (Magnawave), Red Light (RevitaVet), Cold Laser, TENS (TrueStim), and TECAR. Each is integrated thoughtfully based on the horse's response and biomechanical needs."
  },
  {
    q: "How often should my horse have a session?",
    a: "Frequency depends on the horse's workload, age, and goals. Performance horses in heavy training often benefit from regular sessions, while companion horses may do well with periodic maintenance sessions. Susie can recommend a cadence after the first session."
  },
  {
    q: "How do I book a session?",
    a: "Call or text Susie directly at (310) 488-4389 to discuss your horse's needs and schedule a visit."
  }
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="border-b border-border last:border-b-0"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
        aria-expanded={open}
      >
        <h3 className="text-lg md:text-xl font-serif text-foreground group-hover:text-primary transition-colors">
          {q}
        </h3>
        <span className="shrink-0 h-9 w-9 rounded-full border border-border flex items-center justify-center text-primary transition-all group-hover:border-primary group-hover:bg-primary/5">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="text-muted-foreground leading-relaxed pb-6 pr-12 max-w-3xl">{a}</p>
      </motion.div>
    </motion.div>
  );
}

export default function Modalities() {
  const modalities = [
    {
      id: "massage",
      title: "Equine Sports Massage",
      subtitle: "Certified Application",
      description: "A focused, hands-on session designed to support muscular relaxation, enhance flexibility, and promote overall comfort. As a Certified Equine Sports Massage Therapist, Susie applies specific techniques to address areas of tension, which may help the horse move more freely and comfortably.",
      image: massageHands,
    },
    {
      id: "pemf",
      title: "PEMF (Pulsed Electromagnetic Field)",
      subtitle: "Featuring Magnawave Equipment",
      description: "PEMF uses electromagnetic fields to support cellular health. During a session, a large loop is gently placed over the horse's body. This non-invasive modality may contribute to natural recovery processes, support relaxation, and promote a general sense of well-being.",
      image: pemfWhiteHorse,
    },
    {
      id: "red-light",
      title: "Red Light Application",
      subtitle: "Featuring RevitaVet Equipment",
      description: "Targeted red and infrared light is applied to specific areas of the horse's body. This modality is commonly used to support soft tissue health and may assist in maintaining comfort and flexibility. It is a quiet, deeply relaxing experience for the horse.",
      image: redLightLeg,
    },
    {
      id: "cold-laser",
      title: "Cold Laser",
      subtitle: "Low-Level Light Application",
      description: "Cold laser utilizes specific wavelengths of light to interact with tissue. Used selectively during sessions, it may support the body's natural response mechanisms and contribute to overall muscular comfort without generating heat.",
      image: horseStall,
    },
    {
      id: "tens",
      title: "TENS (Transcutaneous Electrical Nerve Stimulation)",
      subtitle: "Featuring TrueStim Equipment",
      description: "TENS involves the delivery of mild electrical impulses to support comfort. When integrated into a session, it can be used to help the horse relax tense muscles and may support an improved range of motion.",
      image: susieWithHorse,
    },
    {
      id: "tecar",
      title: "TECAR",
      subtitle: "Transfer of Energy Capacitive and Resistive",
      description: "TECAR utilizes radiofrequency energy to support tissue health from within. It is applied smoothly over the horse's body and may contribute to enhanced circulation, localized comfort, and muscular relaxation.",
      image: pemfRear,
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card py-20 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <WordReveal
            text="Wellness Modalities"
            as="h1"
            className="text-4xl md:text-5xl font-serif text-foreground mb-6"
            delay={0.1}
            stagger={0.07}
          />
          <LineReveal
            text="A multi-faceted approach to equine comfort. Every session is customized to your horse's unique biomechanical needs."
            as="p"
            whileInView={false}
            delay={0.5}
            className="text-xl text-muted-foreground font-light leading-relaxed"
          />
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
        <div className="space-y-28">
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
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  transition={{ duration: 0.5 }}
                  className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border group"
                >
                  <img 
                    src={modality.image} 
                    alt={modality.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  />
                </motion.div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div>
                  <AnimatedHeading
                    eyebrow={modality.subtitle}
                    eyebrowClassName="block text-sm font-sans tracking-widest text-primary uppercase mb-2"
                    text={modality.title}
                    as="h2"
                    className="text-3xl md:text-4xl font-serif text-foreground"
                  />
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-12 h-1 bg-accent rounded-full origin-left"
                />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {modality.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section className="bg-card border-t py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <AnimatedHeading
              eyebrow="FAQ"
              eyebrowClassName="inline-block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3"
              text="Common questions about equine bodywork"
              as="h2"
              className="text-3xl md:text-4xl font-serif text-foreground"
            />
          </motion.div>
          <div>
            {faqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
