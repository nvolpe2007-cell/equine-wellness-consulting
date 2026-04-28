import { motion } from "framer-motion";
import { WordReveal, LineReveal } from "@/components/ui/AnimatedText";
import horsePortrait from "@assets/20260401_140719_1776529313797.jpg";

export default function Bio() {
  return (
    <div className="min-h-screen bg-background">
      {/* Editorial Header */}
      <section className="relative bg-card overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -right-32 w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-50"
            style={{
              background:
                "radial-gradient(closest-side, hsl(var(--gold) / 0.28), hsl(var(--gold-deep) / 0.12), transparent 72%)",
            }}
          />
        </div>
        <div className="container mx-auto px-4 py-32 md:py-44 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <span className="block mb-6 gold-rule" aria-hidden="true" />
              <WordReveal
                text="Meet Susie H. Lytal, MS"
                as="h1"
                className="text-5xl md:text-7xl font-serif text-foreground leading-[1.02] tracking-tight"
                delay={0.1}
                stagger={0.07}
              />
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

      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Sidebar / Image */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4]"
            >
              <img
                src={horsePortrait}
                alt="Susie H. Lytal, MS, on-site between equine wellness sessions in the barn aisle"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card p-8 rounded-xl border shadow-sm"
            >
              <h3 className="font-serif text-xl text-foreground mb-4 border-b pb-4">
                Credentials &amp; Training
              </h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex flex-col">
                  <span className="font-medium text-foreground">
                    Master of Science (MS), Biomechanics
                  </span>
                  <span className="text-sm">
                    Graduate-level study of how the equine body moves
                  </span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium text-foreground">
                    Certified Equine Sports Massage Therapist
                  </span>
                  <span className="text-sm">
                    Accredited certification program
                  </span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium text-foreground">
                    Equine Biomechanist
                  </span>
                  <span className="text-sm">
                    Professional designation, applied in every session
                  </span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium text-foreground">
                    Founder, Equine Bodywork and Wellness Consulting
                  </span>
                  <span className="text-sm">
                    Serving the Southern California region by appointment
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg prose-stone dark:prose-invert max-w-none"
            >
              <WordReveal
                text="A Practice Built on Science and Care"
                as="h2"
                whileInView
                className="font-serif text-3xl text-foreground mt-0 mb-6"
                stagger={0.05}
              />

              {/* Credentialed pull quote */}
              <motion.figure
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="not-prose my-8 border-l-4 border-accent pl-6 md:pl-8"
              >
                <blockquote className="font-serif text-2xl md:text-3xl text-foreground leading-snug italic">
                  &ldquo;As an Equine Biomechanist with a Master&rsquo;s in
                  Biomechanics, my goal is simple: to help horses move more
                  comfortably, perform more efficiently, and live happier lives
                  through informed, compassionate bodywork.&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm font-sans tracking-wider uppercase text-primary">
                  Susie H. Lytal, MS &middot; Equine Biomechanist &middot;
                  Certified Equine Sports Massage Therapist
                </figcaption>
              </motion.figure>

              <p>
                Susie H. Lytal, MS, brings a rigorous, scientific understanding
                of anatomy and movement to every horse she works with. Her
                graduate degree in Biomechanics, paired with extensive hands-on
                certification as a Certified Equine Sports Massage Therapist, allows
                Susie to evaluate and support the equine athlete holistically
                — from the elite competitor to the beloved pasture companion.
              </p>

              <p>
                Susie founded{" "}
                <strong>Equine Bodywork and Wellness Consulting</strong> to
                bridge the gap between academic biomechanics and practical
                barn-aisle care. Equine Bodywork and Wellness Consulting offers
                six modalities — sports massage, PEMF (Magnawave), red light
                (RevitaVet), cold laser, TENS (TrueStim), and TECAR — chosen
                and combined for each individual horse.
              </p>

              <WordReveal
                text="The Philosophy"
                as="h3"
                whileInView
                className="font-serif text-2xl text-foreground mt-12 mb-6"
                stagger={0.06}
              />
              <p>
                A session with Susie is never a one-size-fits-all routine.
                Because Susie understands the complex kinetic chains of the
                equine body, she tailors her modalities to address specific
                areas of tension or restriction.
              </p>

              <p>
                Susie believes deeply in a team approach to equine wellness.
                She works collaboratively alongside owners, trainers, farriers,
                and veterinarians. While her work may meaningfully support a
                horse&rsquo;s comfort and muscular health, Susie is clear about
                her role: she provides wellness support, not medical diagnosis
                or any kind of veterinary care.
              </p>

              <motion.div
                initial={{ opacity: 0.4, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="bg-muted p-8 rounded-xl my-10 border-l-4 border-primary not-prose"
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
                <p className="mt-4 text-xs font-sans tracking-wider uppercase text-primary not-prose">
                  Susie H. Lytal, MS
                </p>
              </motion.div>

              <p>
                Outside of sessions, Susie is continually expanding her
                knowledge, staying current with the latest research in equine
                biomechanics, and maintaining her own connection to the horses
                that inspire her work every day.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
