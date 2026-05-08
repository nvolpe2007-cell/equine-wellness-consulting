import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { useRef } from "react";
import { WordReveal, LineReveal, AnimatedHeading, AccentFlourish } from "@/components/ui/AnimatedText";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { Testimonials } from "@/components/sections/Testimonials";
import { CountUp } from "@/components/ui/CountUp";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { spring } from "@/lib/motion";
import massageHero from "@assets/0629_LOC_Horse02_CBH_t1170_1776529181857.jpg?w=640;1024;1600;2400&picture";
import barnExterior from "@assets/stock_images/barn-exterior.jpg?w=400;800;1200;1600&picture";
import horsePortrait from "@assets/stock_images/horse-portrait.jpg?w=400;800;1200&picture";
import massageHands from "@assets/0629_LOC_Horse02_CBH_t1170_1776529181857.jpg?w=400;800;1200&picture";
import pemfWhiteHorse from "@assets/20260407_121449_1776528702902.jpg?w=400;800&picture";
import redLightLeg from "@assets/image_1776880244507.jpeg?w=400;800&picture";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const stats = [
  { value: 6, suffix: "", label: "Wellness Modalities" },
  { value: 90, suffix: " min", label: "Typical Session" },
  { value: 100, suffix: "%", label: "Tailored to Your Horse" },
];

function MagneticAnchor({
  href,
  className,
  children,
  "data-testid": testId,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  "data-testid"?: string;
}) {
  const { ref, x, y, onMouseMove, onMouseLeave } =
    useMagneticEffect<HTMLAnchorElement>(0.25);
  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-testid={testId}
      whileTap={{ scale: 0.97 }}
      transition={spring.snappy}
    >
      {children}
    </motion.a>
  );
}

function MagneticLink({
  href,
  className,
  children,
  "data-testid": testId,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  "data-testid"?: string;
}) {
  const { ref, x, y, onMouseMove, onMouseLeave } =
    useMagneticEffect<HTMLDivElement>(0.25);
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block"
      whileTap={{ scale: 0.97 }}
      transition={spring.snappy}
    >
      <Link href={href} className={className} data-testid={testId}>
        {children}
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[760px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <ResponsiveImage
            image={massageHero}
            alt="Hands-on equine sports massage — Susie H. Lytal performing bodywork on a horse's back"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            pictureClassName="block w-full h-full"
            className="w-full h-full object-cover object-[center_35%] animate-ken-burns"
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
            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="text-[0.7rem] font-sans tracking-[0.28em] text-white/65 uppercase mb-5">
              Susie H. Lytal, MS · Equine Biomechanist
            </motion.p>
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="block mx-auto mb-8 gold-rule"
              aria-hidden="true"
            />
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 leading-[1.02] tracking-tight">
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
              <MagneticLink
                href="/modalities"
                className="group bg-gold-metallic shadow-gold-glow inline-flex h-12 items-center justify-center rounded-full px-8 text-base font-medium hover:shadow-gold-glow-lg w-full sm:w-auto"
                data-testid="link-hero-modalities"
              >
                Explore Modalities
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticLink>
              <MagneticLink
                href="/bio"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 px-8 text-base font-medium text-white backdrop-blur-md hover:bg-white/20 w-full sm:w-auto border border-white/20"
                data-testid="link-hero-bio"
              >
                Meet Susie
              </MagneticLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Credentials Band */}
      <section className="bg-gold-metallic-band border-y border-[hsl(var(--gold-deep))]/40">
        <motion.div
          className="container mx-auto px-4 py-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-center text-[0.55rem] font-sans tracking-[0.28em] text-primary-foreground/50 uppercase mb-2">Practice at a Glance</p>
          <ul className="flex flex-wrap justify-center items-center gap-y-2 gap-x-0 text-[0.72rem] font-sans tracking-[0.18em] text-primary-foreground/85 uppercase">
            {[
              "M.S. Biology · Cal Poly Pomona",
              "Certified Equine Sports Massage Therapist",
              "Six Wellness Modalities",
              "Southern California",
            ].map((item, i, arr) => (
              <li key={item} className="flex items-center">
                <span>{item}</span>
                {i < arr.length - 1 && (
                  <span aria-hidden="true" className="mx-4 h-3 w-px bg-primary-foreground/35 inline-block align-middle" />
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Stats Strip */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <motion.ul
            className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 md:gap-24"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            {stats.map((stat, i) => (
              <li key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-serif text-primary leading-none mb-1">
                  <CountUp to={stat.value} suffix={stat.suffix} duration={1.4 + i * 0.15} />
                </p>
                <p className="text-xs font-sans tracking-[0.22em] text-muted-foreground uppercase mt-2">
                  {stat.label}
                </p>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Intro / Philosophy */}
      <section className="py-32 md:py-40 bg-card relative">
        <div className="absolute top-0 inset-x-0 divider-gold" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="block mx-auto mb-5 gold-rule" aria-hidden="true" />
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
              whileHover={reduce ? undefined : { scale: 1.01 }}
              transition={spring.gentle}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <ResponsiveImage
                image={barnExterior}
                alt="Quiet stable exterior at golden hour where Susie conducts equine wellness sessions"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 720px, 100vw"
                pictureClassName="block w-full"
                className="w-full h-auto max-h-[420px] object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Service Area */}
      <ServiceArea />

      {/* Services Preview */}
      <section className="py-32 md:py-40 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <span className="block mb-5 gold-rule" aria-hidden="true" />
              <AnimatedHeading
                eyebrow="What I Offer"
                eyebrowClassName="block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3"
                text="Wellness sessions, tailored."
                as="h2"
                className="text-4xl md:text-6xl font-serif text-foreground mb-6 leading-[1.05]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 lg:pb-3"
            >
              <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                A comprehensive approach to equine comfort. Each session is tailored to your horse's unique biomechanical needs, drawing from a range of modalities to support optimal movement and well-being.
              </p>
              <Link
                href="/modalities"
                className="group inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
                data-testid="link-home-all-services"
              >
                View all modalities
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Asymmetric service cards with spring lift */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {(() => {
              const services = [
                {
                  title: "Equine Sports Massage",
                  desc: "Targeted hands-on techniques that may support muscular relaxation, flexibility, and overall comfort.",
                  img: massageHands,
                  tag: "Certified Application",
                },
                {
                  title: "PEMF Sessions",
                  desc: "Pulsed Electromagnetic Field application using Magnawave to support cellular function and recovery.",
                  img: pemfWhiteHorse,
                  tag: "Featuring Magnawave",
                },
                {
                  title: "Red Light Application",
                  desc: "Utilizing RevitaVet equipment to deliver targeted light that may contribute to comfort and tissue health.",
                  img: redLightLeg,
                  tag: "Featuring RevitaVet",
                },
              ];
              const [feature, ...rest] = services;
              return (
                <>
                  <motion.div
                    key={feature.title}
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    whileHover={reduce ? undefined : { y: -6 }}
                    className="lg:col-span-7 bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-shadow duration-500 group flex flex-col"
                    style={{ transition: "box-shadow 0.5s" }}
                  >
                    <div className="h-72 md:h-[460px] overflow-hidden relative">
                      <ResponsiveImage
                        image={feature.img}
                        alt={`${feature.title} for horses — ${feature.tag}`}
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        pictureClassName="block w-full h-full"
                        className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                    </div>
                    <div className="p-8 md:p-10 flex-1 flex flex-col">
                      <span className="text-[0.65rem] font-sans tracking-[0.2em] text-accent uppercase mb-2">{feature.tag}</span>
                      <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed flex-1 text-base md:text-lg">
                        {feature.desc}
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
                  <div className="lg:col-span-5 grid grid-cols-1 gap-8">
                    {rest.map((service) => (
                      <motion.div
                        key={service.title}
                        variants={fadeUp}
                        transition={{ duration: 0.6 }}
                        whileHover={reduce ? undefined : { y: -6 }}
                        className="bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-shadow duration-500 group flex flex-col"
                      >
                        <div className="h-52 overflow-hidden relative">
                          <ResponsiveImage
                            image={service.img}
                            alt={`${service.title} for horses — ${service.tag}`}
                            loading="lazy"
                            decoding="async"
                            sizes="(min-width: 1024px) 41vw, 100vw"
                            pictureClassName="block w-full h-full"
                            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="p-6 md:p-8 flex-1 flex flex-col">
                          <span className="text-[0.65rem] font-sans tracking-[0.2em] text-accent uppercase mb-2">{service.tag}</span>
                          <h3 className="text-xl font-serif text-foreground mb-2">{service.title}</h3>
                          <p className="text-muted-foreground leading-relaxed flex-1 text-sm md:text-base">
                            {service.desc}
                          </p>
                          <Link
                            href="/modalities"
                            className="mt-4 inline-flex items-center text-sm font-medium text-primary group/link"
                          >
                            Learn more
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              );
            })()}
          </motion.div>
        </div>
      </section>

      {/* The Difference Section */}
      <section className="py-32 md:py-40 bg-gold-metallic-band relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)", backgroundSize: "28px 28px" }} />
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
                eyebrowClassName="inline-block text-xs font-sans tracking-[0.3em] text-primary-foreground/80 uppercase mb-3 font-semibold"
                text="The Biomechanical Advantage"
                as="h2"
                className="text-4xl md:text-6xl font-serif mb-6 text-primary-foreground leading-[1.05]"
              />
              <p className="text-primary-foreground/85 text-lg mb-8 leading-relaxed">
                Working with an Equine Biomechanist means looking beyond the surface. It involves analyzing how the horse moves, identifying compensatory patterns, and applying specific modalities to support more efficient, comfortable movement.
              </p>

              <ul className="space-y-4">
                {[
                  "MS, Biology (Equine Biomechanics) — Cal Poly Pomona",
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
                    <CheckCircle2 className="h-6 w-6 text-primary-foreground shrink-0" />
                    <span className="text-primary-foreground/90">{item}</span>
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
                <ResponsiveImage
                  image={horsePortrait}
                  alt="Close-up portrait of a calm horse — illustrating the biomechanical advantage of attentive equine bodywork"
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  pictureClassName="block w-full h-full"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-primary-foreground/40 rounded-2xl z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Disclaimer / Professionalism */}
      <section className="py-24 md:py-32 bg-muted text-center relative">
        <div className="absolute top-0 inset-x-0 divider-gold" />
        <div className="container mx-auto px-4 max-w-4xl relative">
          <h3 className="text-xl font-serif text-foreground mb-4">A Note on Veterinary Care</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Susie H. Lytal is a Certified Equine Sports Massage Therapist and Equine Biomechanist. She is not a veterinarian. The services offered through Equine Bodywork and Wellness Consulting are designed to support overall wellness and comfort. We do not diagnose, treat, cure, or prescribe for any illness, injury, or medical condition. We strongly advocate for a team approach to your horse's health and always recommend consulting with your primary veterinarian regarding any health concerns.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-32 md:py-40 bg-card relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 divider-gold" />
        <div className="container mx-auto px-4 text-center max-w-3xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="block mx-auto mb-6 gold-rule" aria-hidden="true" />
            <WordReveal
              text="Ready to support your horse's wellness?"
              as="h2"
              whileInView
              className="text-4xl md:text-6xl font-serif text-foreground mb-6 leading-[1.05]"
            />
            <p className="text-lg text-muted-foreground mb-10">
              Reach out to discuss your horse's needs and schedule a session. We'll develop a personalized plan to support their comfort and performance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <MagneticAnchor
                href="tel:+13104884389"
                className="group bg-gold-metallic shadow-gold-glow inline-flex h-14 items-center justify-center gap-2 rounded-full px-10 text-base font-medium hover:shadow-gold-glow-lg"
                data-testid="link-cta-phone"
              >
                <Phone className="h-4 w-4" />
                Call (310) 488-4389
              </MagneticAnchor>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
