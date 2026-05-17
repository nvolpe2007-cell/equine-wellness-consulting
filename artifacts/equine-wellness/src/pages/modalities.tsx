import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Info, Plus } from "lucide-react";
import { useState } from "react";
import { LineReveal, AnimatedHeading } from "@/components/ui/AnimatedText";
import { ResponsiveImage, type PictureData } from "@/components/ui/ResponsiveImage";
import { StickyNav } from "@/components/ui/StickyNav";
import { spring, ease as easing } from "@/lib/motion";
import massageHands from "@assets/0629_LOC_Horse02_CBH_t1170_1776529181857.jpg?w=400;800;1200&picture";
import horseStall from "@assets/stock_images/horse-stall.jpg?w=400;800;1200&picture";
import pemfWhiteHorse from "@assets/20260407_121449_1776528702902.jpg?w=400;800;1200&picture";
import pemfRear from "@assets/20260407_112708_1776528693859.jpg?w=400;800;1200&picture";
import redLightLeg from "@assets/image_1776880244507.jpeg?w=400;800;1200&picture";
import susieWithHorse from "@assets/20260401_140719_1776528664269.jpg?w=400;800;1200&picture";

type Modality = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  directAnswer: string;
  stats: string[];
  questions: { q: string; a: string }[];
  image: PictureData;
};

const modalities: Modality[] = [
  {
    id: "massage",
    title: "Equine Sports Massage",
    subtitle: "Certified Application",
    description:
      "A focused, hands-on session designed to support muscular relaxation, enhance flexibility, and promote overall comfort. As a Certified Equine Sports Massage Therapist, Susie applies specific techniques to address areas of tension, which may help the horse move more freely and comfortably.",
    directAnswer:
      "Equine sports massage is a hands-on wellness modality that uses targeted manual techniques — compression, effleurage, friction, and stretching — to support muscular comfort, flexibility, and recovery. At Equine Bodywork and Wellness Consulting it is performed by Susie H. Lytal, MS, a Certified Equine Sports Massage Therapist, as wellness support — not a substitute for veterinary care.",
    stats: [
      "60–90 min typical session",
      "Hands-on, no equipment required",
      "Performed by a Certified Equine Sports Massage Therapist",
    ],
    questions: [
      {
        q: "How often should my horse get a sports massage?",
        a: "Performance horses in heavy training often benefit from a session every 2–4 weeks. Companion or lightly worked horses may do well with a session every 6–8 weeks. Susie recommends a cadence after the first visit, based on what she observes in your individual horse.",
      },
      {
        q: "Will my horse be sore after a massage?",
        a: "Most horses appear visibly more relaxed after a session. Some may show mild, short-term changes in movement as compensatory patterns release — typically resolving within 24–48 hours.",
      },
      {
        q: "Can I ride my horse the same day as a session?",
        a: "Light hand-walking or turnout is ideal on session day. Most owners return to normal work the following day. Susie will give specific guidance based on what she sees during the session.",
      },
    ],
    image: massageHands,
  },
  {
    id: "pemf",
    title: "PEMF (Pulsed Electromagnetic Field)",
    subtitle: "Featuring Magnawave Equipment",
    description:
      "PEMF uses electromagnetic fields to support cellular health. During a session, a large loop is gently placed over the horse's body. This non-invasive modality may contribute to natural recovery processes, support relaxation, and promote a general sense of well-being.",
    directAnswer:
      "PEMF (Pulsed Electromagnetic Field) for horses is a non-invasive wellness modality in which a large electromagnetic loop is gently passed over the horse's body to support cellular function, recovery, and relaxation. Equine Bodywork and Wellness Consulting uses Magnawave equipment, the recognized standard for equine PEMF application.",
    stats: [
      "30–60 min per session",
      "Magnawave equipment",
      "Used worldwide in sport horse programs",
    ],
    questions: [
      {
        q: "What does PEMF feel like for the horse?",
        a: "Most horses settle into the rhythmic pulse quickly. Many drop their heads, lick and chew, or visibly relax within the first few minutes. The application is non-invasive and produces no heat.",
      },
      {
        q: "Is PEMF safe for my horse?",
        a: "PEMF is broadly considered safe for healthy horses. There are specific contraindications — including pregnancy, certain implanted devices, and active infection — so Susie coordinates with your veterinarian whenever there's a question.",
      },
      {
        q: "How soon will I see a difference after a PEMF session?",
        a: "Many owners notice softer movement and easier warm-ups within 24–72 hours. Susie typically recommends a baseline of 3–5 sessions to gauge how your horse responds.",
      },
    ],
    image: pemfWhiteHorse,
  },
  {
    id: "red-light",
    title: "Red Light Application",
    subtitle: "Featuring RevitaVet Equipment",
    description:
      "Targeted red and infrared light is applied to specific areas of the horse's body. This modality is commonly used to support soft tissue health and may assist in maintaining comfort and flexibility. It is a quiet, deeply relaxing experience for the horse.",
    directAnswer:
      "Red light application for horses uses targeted red and near-infrared wavelengths to support soft tissue health and muscular comfort. Equine Bodywork and Wellness Consulting uses RevitaVet equipment, applied to specific areas of the horse's body during a session. It is a quiet, deeply relaxing experience and is offered as wellness support, not medical care.",
    stats: [
      "10–20 min per area",
      "RevitaVet equipment",
      "Wavelengths in the 630–880 nm range",
    ],
    questions: [
      {
        q: "What is red light application used for in horses?",
        a: "Owners commonly use it to support recovery in working muscle groups, soft tissue comfort around joints, and general relaxation. It is wellness support — not medical care.",
      },
      {
        q: "Does my horse need to be clipped or bathed first?",
        a: "A clean coat helps the light reach the tissue effectively. Clipping is not required, but for very heavy winter coats Susie may extend the application time per area.",
      },
      {
        q: "Can red light be combined with other modalities in one session?",
        a: "Yes — it pairs well with massage and PEMF in the same session. Susie tailors the order and duration based on what each horse needs that day.",
      },
    ],
    image: redLightLeg,
  },
  {
    id: "cold-laser",
    title: "Cold Laser",
    subtitle: "Low-Level Light Application",
    description:
      "Cold laser utilizes specific wavelengths of light to interact with tissue. Used selectively during sessions, it may support the body's natural response mechanisms and contribute to overall muscular comfort without generating heat.",
    directAnswer:
      "Cold laser — also called low-level laser application — uses specific wavelengths of light to interact with surface tissue without generating heat. Used selectively in a session by Equine Bodywork and Wellness Consulting, it may support the body's natural response mechanisms and contribute to localized muscular comfort. It is wellness work, not veterinary care.",
    stats: [
      "5–15 min per area",
      "Class IIIB low-level laser",
      "Non-thermal, non-invasive",
    ],
    questions: [
      {
        q: "How is cold laser different from red light application?",
        a: "Both deliver light energy. Cold laser uses a coherent, focused beam at a tighter wavelength, allowing precise application to a small area. Red light application delivers a broader, diffused field across larger surfaces.",
      },
      {
        q: "Is cold laser safe around the horse's eyes and joints?",
        a: "Cold laser is non-thermal and broadly considered safe when applied by a trained practitioner. Eye-protection protocols are followed, and certain areas — such as open growth plates in young horses or known tumors — are avoided.",
      },
      {
        q: "Will I see results from a single cold laser session?",
        a: "Some horses show visible release within minutes. For most, several sessions across 2–4 weeks give a clearer picture of how their body is responding.",
      },
    ],
    image: horseStall,
  },
  {
    id: "tens",
    title: "TENS (Transcutaneous Electrical Nerve Stimulation)",
    subtitle: "Featuring TrueStim Equipment",
    description:
      "TENS involves the delivery of mild electrical impulses to support comfort. When integrated into a session, it can be used to help the horse relax tense muscles and may support an improved range of motion.",
    directAnswer:
      "TENS (Transcutaneous Electrical Nerve Stimulation) for horses delivers gentle, controlled electrical impulses through the skin to support muscular relaxation and range of motion. Equine Bodywork and Wellness Consulting uses TrueStim equipment, applied selectively during a session as wellness support — not as a veterinary procedure.",
    stats: [
      "15–30 min per area",
      "TrueStim equipment",
      "Adjustable intensity, fully horse-monitored",
    ],
    questions: [
      {
        q: "Does TENS hurt the horse?",
        a: "TENS is calibrated to a level the horse accepts comfortably. Susie starts low and increases only to the point where the horse remains relaxed. Most horses stand quietly throughout the application.",
      },
      {
        q: "How is TENS different from PEMF?",
        a: "TENS works through skin-surface electrodes that stimulate nerves and muscle directly. PEMF uses electromagnetic fields that pass through tissue. The mechanisms are different and the two are sometimes combined in a single session.",
      },
      {
        q: "How often is TENS used in a typical session?",
        a: "TENS is used selectively, not in every session. Susie includes it when a horse is showing patterns that respond well to neuromuscular stimulation.",
      },
    ],
    image: susieWithHorse,
  },
  {
    id: "tecar",
    title: "TECAR",
    subtitle: "Transfer of Energy Capacitive and Resistive",
    description:
      "TECAR utilizes radiofrequency energy to support tissue health from within. It is applied smoothly over the horse's body and may contribute to enhanced circulation, localized comfort, and muscular relaxation.",
    directAnswer:
      "TECAR (Transfer of Energy Capacitive and Resistive) for horses uses radiofrequency energy applied smoothly over the body to support tissue health from within. Used selectively in a session by Equine Bodywork and Wellness Consulting, it may contribute to enhanced circulation, localized comfort, and muscular relaxation. It is wellness support, not a medical procedure.",
    stats: [
      "15–25 min per area",
      "Radiofrequency-based",
      "Capacitive and resistive modes",
    ],
    questions: [
      {
        q: "What does TECAR feel like to the horse?",
        a: "TECAR generates a gentle, deep warmth as the energy moves through tissue. Most horses settle into the application quickly and many show visible relaxation cues within minutes.",
      },
      {
        q: "How is TECAR different from PEMF?",
        a: "PEMF delivers electromagnetic pulses through a loop. TECAR delivers radiofrequency energy through hand-applied electrodes and produces a warming sensation, which PEMF does not.",
      },
      {
        q: "When is TECAR a good choice?",
        a: "Susie typically chooses TECAR for horses showing deeper muscle tension or working through demanding training blocks. It's never used as a stand-alone medical fix — always as part of a broader wellness approach.",
      },
    ],
    image: pemfRear,
  },
];

const generalFaqs = [
  {
    q: "What is equine bodywork?",
    a: "Equine bodywork is a non-invasive, hands-on approach designed to support a horse's muscular comfort, flexibility, and overall well-being. It draws on a combination of techniques — including sports massage and complementary modalities such as PEMF, red light, cold laser, TENS, and TECAR — and is offered as wellness support, not medical care.",
  },
  {
    q: "Is this a substitute for veterinary care?",
    a: "No. Susie H. Lytal is an Equine Biomechanist and Certified Equine Sports Massage Therapist — not a veterinarian. Wellness sessions do not diagnose, treat, cure, or prescribe for any medical condition. Susie works alongside your primary veterinarian as part of a team approach to your horse's health.",
  },
  {
    q: "How long does a session take?",
    a: "A typical session lasts approximately 60 to 90 minutes, depending on the horse and the modalities included. Susie tailors each session to the individual horse's needs, often combining hands-on massage with one or more complementary modalities.",
  },
  {
    q: "Which modalities are offered?",
    a: "Six modalities are offered: Equine Sports Massage, PEMF (Magnawave), Red Light (RevitaVet), Cold Laser, TENS (TrueStim), and TECAR. Each is integrated thoughtfully based on the horse's response and biomechanical needs.",
  },
  {
    q: "How often should my horse have a session?",
    a: "Frequency depends on the horse's workload, age, and goals. Performance horses in heavy training often benefit from regular sessions, while companion horses may do well with periodic maintenance sessions. Susie can recommend a cadence after the first session.",
  },
  {
    q: "How do I book a session?",
    a: "Call or text Susie directly at (310) 488-4389 to discuss your horse's needs and schedule a visit.",
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
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
        <motion.span
          className="shrink-0 h-9 w-9 rounded-full border border-border flex items-center justify-center text-primary group-hover:border-primary group-hover:bg-primary/5 transition-colors"
          animate={reduce ? undefined : { rotate: open ? 45 : 0 }}
          transition={spring.snappy}
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>

      {reduce ? (
        open && (
          <div className="overflow-hidden">
            <p className="text-muted-foreground leading-relaxed pb-6 pr-12 max-w-3xl">{a}</p>
          </div>
        )
      ) : (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: easing.out }}
              className="overflow-hidden"
            >
              <p className="text-muted-foreground leading-relaxed pb-6 pr-12 max-w-3xl">
                {a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function ModalityFaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="py-5 first:pt-0 last:pb-0 border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 cursor-pointer text-left group"
        aria-expanded={open}
      >
        <h4 className="text-base md:text-lg font-serif text-foreground group-hover:text-primary transition-colors">
          {q}
        </h4>
        <motion.span
          className="shrink-0 h-7 w-7 rounded-full border border-border flex items-center justify-center text-primary"
          animate={reduce ? undefined : { rotate: open ? 45 : 0 }}
          transition={spring.snappy}
        >
          <Plus className="h-3.5 w-3.5" />
        </motion.span>
      </button>

      {reduce ? (
        open && (
          <div>
            <p className="text-muted-foreground leading-relaxed mt-3 pr-10">{a}</p>
          </div>
        )
      ) : (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: easing.out }}
              className="overflow-hidden"
            >
              <p className="text-muted-foreground leading-relaxed mt-3 pr-10">
                {a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

const MODALITY_SECTIONS = [
  { id: "massage", label: "Massage" },
  { id: "pemf", label: "PEMF" },
  { id: "red-light", label: "Red Light" },
  { id: "cold-laser", label: "Cold Laser" },
  { id: "tens", label: "TENS" },
  { id: "tecar", label: "TECAR" },
];

export default function Modalities() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-background">
      <StickyNav
        sections={MODALITY_SECTIONS}
        heroId="modality-hero"
        ariaLabel="Jump to modality"
      />
      {/* Editorial Header */}
      <section id="modality-hero" className="relative bg-card overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <span className="block mb-6 gold-rule" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-5 font-medium">
                Modalities
              </p>
              <motion.h1
                className="text-5xl md:text-7xl font-serif text-foreground leading-[1.02] tracking-tight"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: easing.out, delay: 0.1 }}
              >
                Wellness Modalities
              </motion.h1>
            </div>
            <div className="lg:col-span-5 lg:pb-3 lg:pl-10 lg:border-l lg:border-border">
              <LineReveal
                text="A multi-faceted approach to equine comfort. Every session is customized to your horse's unique biomechanical needs."
                as="p"
                whileInView={false}
                delay={0.5}
                className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
              />
            </div>
          </div>
        </div>
        <div className="divider-gold" />
      </section>

      {/* Important Notice */}
      <div className="bg-accent/10 border-y border-accent/20">
        <div className="container mx-auto px-4 py-6 flex items-start gap-4">
          <Info className="h-6 w-6 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80 leading-relaxed max-w-4xl">
            <strong>Professional Disclaimer:</strong> The modalities listed below are provided to support general wellness, comfort, and athletic performance. They are not intended to replace veterinary care. Susie H. Lytal is an Equine Biomechanist and Certified Equine Sports Massage Therapist, not a veterinarian. We do not diagnose, treat, or prescribe for any medical conditions. We strongly encourage all clients to work closely with their veterinarian.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-32 md:py-40">
        <div className="space-y-32">
          {modalities.map((modality, index) => (
            <motion.section
              key={modality.id}
              id={modality.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-32"
            >
              {/* Alternating tilt angles for the card wrapper on desktop */}
              {(() => {
                const tilts = [1.2, -1.2, 0.6, -0.8, 1.0, -0.6];
                const tiltDeg = tilts[index % tilts.length];
                return (
              <motion.div
                className={`flex flex-col ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-12 lg:gap-20 items-start`}
                whileHover={reduce ? undefined : { rotate: tiltDeg }}
                transition={{ type: "spring", stiffness: 200, damping: 24 }}
                style={{ transformOrigin: "center bottom" }}
              >
                <div className="w-full lg:w-1/2">
                  <motion.div
                    whileHover={reduce ? undefined : { scale: 1.015 }}
                    transition={spring.gentle}
                    className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border group"
                  >
                    <ResponsiveImage
                      image={modality.image}
                      alt={`${modality.title} session for horses — ${modality.subtitle}`}
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      pictureClassName="block w-full h-full"
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

                  <div className="rounded-xl border-l-4 border-accent bg-accent/5 p-5 md:p-6">
                    <p className="text-xs font-sans tracking-[0.25em] text-accent uppercase mb-2">
                      In short
                    </p>
                    <p className="text-base md:text-lg text-foreground leading-relaxed">
                      {modality.directAnswer}
                    </p>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {modality.description}
                  </p>

                  <div className="pt-2">
                    <p className="text-xs font-sans tracking-[0.25em] text-primary uppercase mb-3">
                      By the numbers
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      {modality.stats.map((stat) => (
                        <li
                          key={stat}
                          className="rounded-lg bg-card border border-border px-4 py-3 text-foreground"
                        >
                          {stat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
              );
              })()}

              {/* Per-modality common questions — AnimatePresence accordions */}
              <div className="mt-12 lg:mt-16 max-w-4xl mx-auto bg-card border border-border rounded-2xl p-6 md:p-10">
                <p className="text-xs font-sans tracking-[0.25em] text-primary uppercase mb-3">
                  Common questions
                </p>
                <h3 className="text-2xl font-serif text-foreground mb-6">
                  About {modality.title}
                </h3>
                <div>
                  {modality.questions.map((qa) => (
                    <ModalityFaqItem key={qa.q} q={qa.q} a={qa.a} />
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>

      {/* General FAQ */}
      <section className="bg-card py-32 md:py-40 relative">
        <div className="absolute top-0 inset-x-0 divider-gold" />
        <div className="container mx-auto px-4 max-w-4xl relative">
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
            {generalFaqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
