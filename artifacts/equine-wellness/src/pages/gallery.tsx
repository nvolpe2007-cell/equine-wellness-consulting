import { motion } from "framer-motion";
import { WordReveal, LineReveal } from "@/components/ui/AnimatedText";
import susieWithHorse from "@assets/20260401_140719_1776528664269.jpg";
import horseOnPad from "@assets/20260320_141245_1776528671943.jpg";
import pemfRear from "@assets/20260407_112708_1776528693859.jpg";
import pemfWhiteHorse from "@assets/20260407_121449_1776528702902.jpg";
import redLightPad from "@assets/image_1776880244507.jpeg";

export default function Gallery() {
  const images = [
    { src: susieWithHorse, alt: "Susie on-site preparing for a session", colSpan: "col-span-1 md:col-span-2" },
    { src: redLightPad, alt: "LED red light therapy pad glowing across a horse's back during a wellness session", colSpan: "col-span-1" },
    { src: horseOnPad, alt: "A calm bay standing on the PEMF pad", colSpan: "col-span-1" },
    { src: pemfWhiteHorse, alt: "PEMF session in the stall with a relaxed grey", colSpan: "col-span-1 md:col-span-2" },
    { src: pemfRear, alt: "Magnawave PEMF loops in use during a session", colSpan: "col-span-1 md:col-span-2" },
    { src: susieWithHorse, alt: "A quiet moment between sessions", colSpan: "col-span-1" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card py-20 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <WordReveal
            text="Gallery"
            as="h1"
            className="text-4xl md:text-5xl font-serif text-foreground mb-6"
            delay={0.1}
            stagger={0.08}
          />
          <LineReveal
            text="Glimpses of sessions, serene spaces, and the incredible animals we serve."
            as="p"
            whileInView={false}
            delay={0.45}
            className="text-xl text-muted-foreground font-light leading-relaxed"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className={`relative group overflow-hidden rounded-xl bg-muted ${image.colSpan}`}
              data-testid={`img-gallery-${index}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-serif text-lg">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
