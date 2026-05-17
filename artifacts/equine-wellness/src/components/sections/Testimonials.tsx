import { motion, useReducedMotion } from "framer-motion";
import { AnimatedHeading } from "@/components/ui/AnimatedText";
import { StaggerReveal, StaggerItem } from "@/components/ui/AnimatedText";
import { spring } from "@/lib/motion";

type Testimonial = {
  quote: string;
  name: string;
  horse: string;
  discipline: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "After Susie's first session, my gelding came out the next morning swinging through his back like he hadn't in months. She explained every choice she made — I finally felt like I understood my horse's body.",
    name: "Megan",
    horse: "Indigo",
    discipline: "Hunter/Jumper",
  },
  {
    quote:
      "Susie works in close partnership with our vet. She caught a subtle compensatory pattern early, looped our team in, and helped us get ahead of it before it became a real issue.",
    name: "Carla",
    horse: "Solana",
    discipline: "Dressage",
  },
  {
    quote:
      "Calm, professional, and deeply knowledgeable. My older trail mare looks forward to her sessions and moves better for days afterward. Worth every mile of the drive to get her on Susie's schedule.",
    name: "Jenna",
    horse: "Ruby",
    discipline: "Trail / Pleasure",
  },
];

export function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Client testimonials"
      className="bg-background py-32 md:py-40"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <AnimatedHeading
            eyebrow="From the Barn Aisle"
            eyebrowClassName="inline-block text-xs font-sans tracking-[0.3em] text-primary uppercase mb-3"
            text="What clients are saying."
            as="h2"
            className="text-3xl md:text-5xl font-serif text-foreground leading-tight"
          />
        </motion.div>

        {/* Staggered masonry: first and third at baseline, center card offset up */}
        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
          staggerChildren={0.1}
          viewportMargin="-50px"
        >
          {testimonials.map((t, i) => (
            <StaggerItem key={`${t.name}-${t.horse}`}>
              <motion.figure
                className={`relative bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col h-full${i === 1 ? " md:mt-8" : ""}`}
                data-testid={`testimonial-${i}`}
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
                      "0 20px 40px rgba(0,0,0,0.28), 0 0 0 1px hsl(46 92% 62% / 0.12)",
                    transition: spring.snappy,
                  },
                }}
              >
                {/* Large italic opening quotation mark in Cormorant Garamond gold */}
                <span
                  aria-hidden="true"
                  className="block font-serif italic text-[6rem] leading-none text-primary/70 select-none -mt-4 -mb-6"
                  style={{ fontFamily: "var(--app-font-serif)" }}
                >
                  &ldquo;
                </span>
                <blockquote className="font-serif italic text-xl md:text-2xl leading-snug text-foreground flex-1">
                  {t.quote}
                </blockquote>
                <span
                  aria-hidden="true"
                  className="block w-12 h-1 bg-accent rounded-full mt-6"
                />
                <figcaption className="mt-4 text-sm font-sans tracking-wider uppercase text-primary">
                  {t.name}, {t.discipline} &mdash; &ldquo;{t.horse}&rdquo;
                </figcaption>
              </motion.figure>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
