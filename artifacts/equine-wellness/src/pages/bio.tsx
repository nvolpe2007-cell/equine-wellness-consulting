import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { ease as easing } from "@/lib/motion";
import { WordReveal, LineReveal } from "@/components/ui/AnimatedText";
import { StaggerReveal, StaggerItem } from "@/components/ui/AnimatedText";
import { StickyNav } from "@/components/ui/StickyNav";
import horsePortrait from "@assets/20260401_140719_1776529313797.jpg?w=400;800&picture";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

const BIO_SECTIONS = [
  { id: "credentials", label: "Credentials" },
  { id: "experience", label: "Experience" },
  { id: "approach", label: "Approach" },
  { id: "contact", label: "Contact" },
];

export default function Bio() {
  return (
    <div className="min-h-screen bg-background">
      <StickyNav
        sections={BIO_SECTIONS}
        heroId="bio-hero"
        ariaLabel="Jump to section"
      />

      {/* Editorial Header */}
      <section id="bio-hero" className="relative bg-card overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <span className="block mb-6 gold-rule" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-5 font-medium">
                About Susie
              </p>
              <motion.h1
                className="text-5xl md:text-7xl font-serif text-foreground leading-[1.02] tracking-tight"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: easing.out, delay: 0.1 }}
              >
                Meet Susie H. Lytal, MS
              </motion.h1>
            </div>
            <div className="lg:col-span-5 lg:pb-3 lg:pl-10 lg:border-l lg:border-border">
              <LineReveal
                text="Equine Biomechanist & Certified Equine Sports Massage Therapist"
                as="p"
                whileInView={false}
                delay={0.55}
                className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
              />
            </div>
          </div>
        </div>
        <div className="divider-gold" />
      </section>

      {/* Credentials */}
      <section
        id="credentials"
        className="scroll-mt-28 container mx-auto px-4 pt-24 md:pt-32 max-w-5xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Image — portrait bleeds slightly outside grid column on desktop */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: easing.out }}
              className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4] lg:-mr-12 xl:-mr-20 rotate-[0.8deg]"
            >
              <ResponsiveImage
                image={horsePortrait}
                alt="Susie H. Lytal, MS, on-site between equine wellness sessions in the barn aisle"
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 40vw, 100vw"
                pictureClassName="block w-full h-full"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Credentials card */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: easing.out }}
              className="bg-card p-8 rounded-xl border shadow-sm"
            >
              <h2 className="font-serif text-2xl text-foreground mb-6 pb-4 border-b border-border">
                Credentials &amp; Training
              </h2>
              <StaggerReveal
                className="space-y-5 text-muted-foreground"
                staggerChildren={0.09}
                delayChildren={0.1}
              >
                {[
                  {
                    title: "MS, Biology (Equine Biomechanics)",
                    sub: "Cal Poly Pomona",
                  },
                  {
                    title: "Certified Equine Sports Massage Therapist",
                    sub: "Accredited certification program",
                  },
                  {
                    title: "Equine Biomechanist",
                    sub: "Professional designation, applied in every session",
                  },
                  {
                    title: "Founder, Equine Bodywork and Wellness Consulting",
                    sub: "Serving the Southern California region by appointment",
                  },
                ].map((item) => (
                  <StaggerItem key={item.title}>
                    <span className="font-medium text-foreground block">
                      {item.title}
                    </span>
                    <span className="text-sm">{item.sub}</span>
                  </StaggerItem>
                ))}
              </StaggerReveal>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section
        id="experience"
        className="scroll-mt-28 container mx-auto px-4 pt-24 md:pt-32 max-w-5xl"
      >
        <div className="max-w-3xl">
          <WordReveal
            text="A Practice Built on Science and Care"
            as="h2"
            whileInView
            className="font-serif text-3xl text-foreground mt-0 mb-8"
            stagger={0.05}
          />

          {/* Credentialed pull quote */}
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easing.out }}
            className="my-8 border-l-4 border-accent pl-6 md:pl-8"
          >
            <blockquote className="font-serif text-2xl md:text-3xl text-foreground leading-snug italic">
              &ldquo;As an Equine Biomechanist with a Master&rsquo;s in Biology
              (Equine Biomechanics), my goal is simple: to help horses move more
              comfortably, perform more efficiently, and live happier lives
              through informed, compassionate bodywork.&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm font-sans tracking-wider uppercase text-primary">
              Susie H. Lytal, MS &middot; Equine Biomechanist &middot; Certified
              Equine Sports Massage Therapist
            </figcaption>
          </motion.figure>

          <StaggerReveal
            className="space-y-5 prose prose-lg prose-stone dark:prose-invert max-w-none"
            staggerChildren={0.1}
            viewportMargin="-60px"
          >
            <StaggerItem>
              <p>
                Susie H. Lytal, MS, brings a rigorous, scientific understanding
                of anatomy and movement to every horse she works with. Her MS in
                Biology (Equine Biomechanics) from Cal Poly Pomona, paired with
                extensive hands-on certification as a Certified Equine Sports
                Massage Therapist, allows Susie to evaluate and support the
                equine athlete holistically — from the elite competitor to the
                beloved pasture companion.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                Susie founded{" "}
                <strong>Equine Bodywork and Wellness Consulting</strong> to
                bridge the gap between academic biomechanics and practical
                barn-aisle care. Equine Bodywork and Wellness Consulting offers
                six modalities — sports massage, PEMF (Magnawave), red light
                (RevitaVet), cold laser, TENS (TrueStim), and TECAR — chosen
                and combined for each individual horse.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                Outside of sessions, Susie is continually expanding her
                knowledge, staying current with the latest research in equine
                biomechanics, and maintaining her own connection to the horses
                that inspire her work every day.
              </p>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>

      {/* Approach */}
      <section
        id="approach"
        className="scroll-mt-28 container mx-auto px-4 pt-24 md:pt-32 max-w-5xl"
      >
        <div className="max-w-3xl">
          <WordReveal
            text="The Approach"
            as="h2"
            whileInView
            className="font-serif text-3xl text-foreground mt-0 mb-8"
            stagger={0.06}
          />

          <StaggerReveal
            className="space-y-5 prose prose-lg prose-stone dark:prose-invert max-w-none"
            staggerChildren={0.1}
            viewportMargin="-60px"
          >
            <StaggerItem>
              <p>
                A session with Susie is never a one-size-fits-all routine.
                Because Susie understands the complex kinetic chains of the
                equine body, she tailors her modalities to address specific
                areas of tension or restriction.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                Susie believes deeply in a team approach to equine wellness. She
                works collaboratively alongside owners, trainers, farriers, and
                veterinarians. While her work may meaningfully support a
                horse&rsquo;s comfort and muscular health, Susie is clear about
                her role: she provides wellness support, not medical diagnosis or
                any kind of veterinary care.
              </p>
            </StaggerItem>
          </StaggerReveal>

          <motion.div
            initial={{ opacity: 0.4, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easing.out }}
            className="bg-muted p-8 rounded-xl mt-10 border-l-4 border-primary"
          >
            <LineReveal
              text='"When we understand how the horse is designed to move, we can better support them when they struggle.'
              as="span"
              delay={0.15}
              className="block italic text-foreground"
            />
            <LineReveal
              text={`It's about giving them the tools to balance their own bodies, relieving tension before it becomes a major obstacle."`}
              as="span"
              delay={0.55}
              className="block italic text-foreground mt-2"
            />
            <p className="mt-4 text-xs font-sans tracking-wider uppercase text-primary">
              Susie H. Lytal, MS
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="scroll-mt-28 py-32 md:py-40 relative mt-24 md:mt-32"
      >
        <div className="absolute top-0 inset-x-0 divider-gold" />
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easing.out }}
          >
            <span className="block mb-6 gold-rule mx-auto" aria-hidden="true" />
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">
              Get in Touch
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              Ready to book a session?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
              Call or text Susie directly to discuss your horse's needs and
              schedule a visit. Sessions are by appointment in the Southern
              California region.
            </p>
            <a
              href="tel:+13104884389"
              className="inline-flex items-center gap-3 bg-gold-metallic text-primary-foreground px-8 py-4 rounded-full font-sans font-semibold text-lg shadow-gold-glow hover:opacity-90 transition-opacity"
              aria-label="Call Susie at (310) 488-4389"
            >
              <Phone className="h-5 w-5" />
              (310) 488-4389
            </a>
            <p className="mt-6 text-sm text-muted-foreground">
              Call or text &middot; By appointment only
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
