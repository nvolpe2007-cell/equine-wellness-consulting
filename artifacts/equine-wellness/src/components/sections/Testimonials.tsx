import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { AnimatedHeading } from "@/components/ui/AnimatedText";

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
  return (
    <section
      aria-label="Client testimonials"
      className="bg-background py-24"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.figure
              key={`${t.name}-${t.horse}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-500 flex flex-col"
              data-testid={`testimonial-${i}`}
            >
              {/* TODO: replace with real quote */}
              <Quote
                aria-hidden="true"
                className="absolute -top-4 left-6 h-8 w-8 text-accent bg-card p-1.5 rounded-full border border-border"
              />
              <blockquote className="font-serif italic text-xl md:text-2xl leading-snug text-foreground flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <span
                aria-hidden="true"
                className="block w-12 h-1 bg-accent rounded-full mt-6"
              />
              <figcaption className="mt-4 text-sm font-sans tracking-wider uppercase text-primary">
                {t.name}, {t.discipline} &mdash; &ldquo;{t.horse}&rdquo;
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
