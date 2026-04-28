import { motion } from "framer-motion";
import { LineReveal } from "@/components/ui/AnimatedText";
import { ResponsiveImage, type PictureData } from "@/components/ui/ResponsiveImage";
import susieWithHorse from "@assets/20260401_140719_1776528664269.jpg?w=400;800;1200&picture";
import horseOnPad from "@assets/20260320_141245_1776528671943.jpg?w=400;800;1200&picture";
import pemfRear from "@assets/20260407_112708_1776528693859.jpg?w=400;800;1200&picture";
import pemfWhiteHorse from "@assets/20260407_121449_1776528702902.jpg?w=400;800;1200&picture";
import redLightPad from "@assets/image_1776880244507.jpeg?w=400;800&picture";

type GalleryImage = { src: PictureData; alt: string; colSpan: string; sizes: string };

export default function Gallery() {
  const images: GalleryImage[] = [
    { src: susieWithHorse, alt: "Susie on-site preparing for a session", colSpan: "col-span-1 md:col-span-2", sizes: "(min-width: 768px) 66vw, 100vw" },
    { src: redLightPad, alt: "LED red light therapy pad glowing across a horse's back during a wellness session", colSpan: "col-span-1", sizes: "(min-width: 768px) 33vw, 100vw" },
    { src: horseOnPad, alt: "A calm bay standing on the PEMF pad", colSpan: "col-span-1", sizes: "(min-width: 768px) 33vw, 100vw" },
    { src: pemfWhiteHorse, alt: "PEMF session in the stall with a relaxed grey", colSpan: "col-span-1 md:col-span-2", sizes: "(min-width: 768px) 66vw, 100vw" },
    { src: pemfRear, alt: "Magnawave PEMF loops in use during a session", colSpan: "col-span-1 md:col-span-2", sizes: "(min-width: 768px) 66vw, 100vw" },
    { src: susieWithHorse, alt: "A quiet moment between sessions", colSpan: "col-span-1", sizes: "(min-width: 768px) 33vw, 100vw" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-card overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <span className="block mb-6 gold-rule" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-5 font-medium">
                Gallery
              </p>
              <motion.h1
                className="text-5xl md:text-7xl font-serif text-foreground leading-[1.02] tracking-tight"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                Gallery
              </motion.h1>
            </div>
            <div className="lg:col-span-5 lg:pb-3 lg:pl-10 lg:border-l lg:border-border">
              <LineReveal
                text="Glimpses of sessions, serene spaces, and the incredible animals we serve."
                as="p"
                whileInView={false}
                delay={0.45}
                className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
              />
            </div>
          </div>
        </div>
        <div className="divider-gold" />
      </section>

      <div className="container mx-auto px-4 py-24 md:py-32">
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
              <ResponsiveImage
                image={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                sizes={image.sizes}
                pictureClassName="block w-full h-full"
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
