import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Sparkles, Phone } from "lucide-react";
import { useRef } from "react";
import { WordReveal, LineReveal, AnimatedHeading, AccentFlourish } from "@/components/ui/AnimatedText";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import barnHero from "@assets/stock_images/barn-hero.jpg";
import barnExterior from "@assets/stock_images/barn-exterior.jpg";
import horsePortrait from "@assets/stock_images/horse-portrait.jpg";
import massageHands from "@assets/0629_LOC_Horse02_CBH_t1170_1776529181857.jpg";
import pemfWhiteHorse from "@assets/20260407_121449_1776528702902.jpg";
import redLightLeg from "@assets/20260319_191731_1776528710545.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[640px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <img 
            src={barnHero} 
            alt="Warm barn interior morning light" 
            className="w-full h-full object-cover object-center animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm mb-8">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-white/90 font-sans tracking-widest uppercase text-xs">Susie H. Lytal, MS · Equine Biomechanist</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-[1.05]">
              <WordReveal
                text="Elevating equine performance"
                as="span"
                className="block"
                delay={0.25}
                stagger={0.07}
                duration={0.8}
              />
              <span className="relative inline-block">
                <WordReveal
                  text="through science and care."
                  as="span"
                  className="italic text-accent/90 inline-block"
                  delay={0.85}
                  stagger={0.06}
                  duration={0.8}
                />
                <AccentFlourish delay={1.6} />
              </span>
            </h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="text-lg md:text-xl text-white/85 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
              Professional equine bodywork and wellness consulting, grounded in graduate-level biomechanics expertise.
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/modalities"
                className="group inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
                data-testid="link-hero-modalities"
              >
                Explore Modalities
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/bio"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 px-8 text-base font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 hover:-translate-y-0.5 w-full sm:w-auto border border-white/20"
                data-testid="link-hero-bio"
              >
                Meet Susie
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-6 rounded-full border-2 border-white/40 flex items-start justify-center pt-2"
          >
            <div className="h-1.5 w-1 rounded-full bg-white/70" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Strip */}
      <section className="bg-primary text-primary-foreground py-10 border-y border-primary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { num: "MS", label: "Master of Science, Biomechanics" },
              { num: "6", label: "Wellness Modalities Offered" },
              { num: "Certified", label: "Equine Sports Massage Therapist" },
              { num: "100%", label: "Customized to Each Horse" },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} transition={{ duration: 0.5 }}>
                <div className="text-3xl md:text-4xl font-serif text-white mb-1">{stat.num}</div>
                <div className="text-xs md:text-sm text-white/75 uppercase tracking-wider leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Intro / Philosophy */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <LineReveal
              text="Philosophy"
              as="span"
              className="inline-block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-4"
            />
            <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-6 leading-tight">
              <WordReveal
                text="Grounded in knowledge."
                as="span"
                whileInView
                delay={0.18}
                className="block"
              />
              <WordReveal
                text="Delivered with compassion."
                as="span"
                whileInView
                delay={0.55}
                className="block italic"
              />
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Every horse is a complex athlete, whether they are performing at the highest levels of competition or carrying you safely down the trail. My approach to equine wellness combines a deep, scientific understanding of biomechanics with highly attuned, hands-on application. We don't just look at the symptoms; we support the whole horse.
            </p>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <img src={barnExterior} alt="Stable" className="w-full h-auto max-h-[420px] object-cover" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <AnimatedHeading
                eyebrow="What I Offer"
                eyebrowClassName="inline-block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3"
                text="Wellness sessions, tailored."
                as="h2"
                className="text-3xl md:text-5xl font-serif text-foreground mb-4 leading-tight"
              />
              <p className="text-muted-foreground text-lg">
                A comprehensive approach to equine comfort. Each session is tailored to your horse's unique biomechanical needs, drawing from a range of modalities to support optimal movement and well-being.
              </p>
            </motion.div>
            <Link
              href="/modalities"
              className="group inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
              data-testid="link-home-all-services"
            >
              View all modalities
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Equine Sports Massage",
                desc: "Targeted hands-on techniques that may support muscular relaxation, flexibility, and overall comfort.",
                img: massageHands,
                tag: "Certified Application"
              },
              {
                title: "PEMF Sessions",
                desc: "Pulsed Electromagnetic Field application using Magnawave to support cellular function and recovery.",
                img: pemfWhiteHorse,
                tag: "Featuring Magnawave"
              },
              {
                title: "Red Light Application",
                desc: "Utilizing RevitaVet equipment to deliver targeted light that may contribute to comfort and tissue health.",
                img: redLightLeg,
                tag: "Featuring RevitaVet"
              }
            ].map((service) => (
              <motion.div 
                key={service.title}
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-shadow duration-500 group flex flex-col"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-[0.65rem] font-sans tracking-[0.2em] text-accent uppercase mb-2">{service.tag}</span>
                  <h3 className="text-xl font-serif text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    {service.desc}
                  </p>
                  <Link
                    href="/modalities"
                    className="mt-6 inline-flex items-center text-sm font-medium text-primary group/link"
                  >
                    Learn more
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Difference Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <AnimatedHeading
                eyebrow="The Difference"
                eyebrowClassName="inline-block text-xs font-sans tracking-[0.3em] text-accent uppercase mb-3"
                text="The Biomechanical Advantage"
                as="h2"
                className="text-3xl md:text-5xl font-serif mb-6 text-white leading-tight"
              />
              <p className="text-primary-foreground/85 text-lg mb-8 leading-relaxed">
                Working with an Equine Biomechanist means looking beyond the surface. It involves analyzing how the horse moves, identifying compensatory patterns, and applying specific modalities to support more efficient, comfortable movement.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Graduate-level education in biomechanics (MS)",
                  "Certified Equine Sports Massage Therapist",
                  "Comprehensive multi-modality approach",
                  "Collaborative relationship with veterinary professionals"
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                    <span className="text-white/90">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10">
                <img src={horsePortrait} alt="A horse close up" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-accent rounded-2xl z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <span className="inline-block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3">
                The Worthy Horse News
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-tight">
                A monthly note from the barn.
              </h2>
            </div>
            <NewsletterSignup
              variant="hero"
              source="home_page"
              subheading="Thoughtful writing on equine wellness, biomechanics, and the horses behind the work."
            />
          </motion.div>
        </div>
      </section>

      {/* Disclaimer / Professionalism */}
      <section className="py-16 bg-muted text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-xl font-serif text-foreground mb-4">A Note on Veterinary Care</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Susie H. Lytal is a Certified Equine Sports Massage Therapist and Equine Biomechanist. She is not a veterinarian. The services offered through Equine Bodywork and Wellness Consulting are designed to support overall wellness and comfort. We do not diagnose, treat, cure, or prescribe for any illness, injury, or medical condition. We strongly advocate for a team approach to your horse's health and always recommend consulting with your primary veterinarian regarding any health concerns.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 bg-card border-t relative overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-3xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <WordReveal
              text="Ready to support your horse's wellness?"
              as="h2"
              whileInView
              className="text-4xl md:text-5xl font-serif text-foreground mb-6"
            />
            <p className="text-lg text-muted-foreground mb-10">
              Reach out to discuss your horse's needs and schedule a session. We'll develop a personalized plan to support their comfort and performance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="tel:+13104884389" 
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-10 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 shadow-md"
                data-testid="link-cta-phone"
              >
                <Phone className="h-4 w-4" />
                Call (310) 488-4389
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
