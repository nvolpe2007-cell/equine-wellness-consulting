import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { spring, ease as easing } from "@/lib/motion";
import { useState } from "react";
import { LineReveal } from "@/components/ui/AnimatedText";
import { StaggerReveal, StaggerItem } from "@/components/ui/AnimatedText";
import { ResponsiveImage, type PictureData } from "@/components/ui/ResponsiveImage";
import susieWithHorse from "@assets/20260401_140719_1776528664269.jpg?w=400;800;1200&picture";
import horseOnPad from "@assets/20260320_141245_1776528671943.jpg?w=400;800;1200&picture";
import pemfRear from "@assets/20260407_112708_1776528693859.jpg?w=400;800;1200&picture";
import pemfWhiteHorse from "@assets/20260407_121449_1776528702902.jpg?w=400;800;1200&picture";
import redLightPad from "@assets/image_1776880244507.jpeg?w=400;800&picture";

type GalleryImage = {
  src: PictureData;
  alt: string;
  caption: string;
  colSpan: string;
  sizes: string;
};

function GalleryItem({
  image,
  index,
}: {
  image: GalleryImage;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.06,
        duration: 0.55,
        ease: easing.out,
      }}
      className={`relative group overflow-hidden rounded-xl bg-muted ${image.colSpan}`}
      data-testid={`img-gallery-${index}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="w-full h-full"
        animate={
          reduce
            ? undefined
            : hovered
              ? { scale: 1.06 }
              : { scale: 1 }
        }
        transition={spring.gentle}
      >
        <ResponsiveImage
          image={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          sizes={image.sizes}
          pictureClassName="block w-full h-full"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <AnimatePresence>
        {hovered && !reduce && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none flex items-end p-6"
          >
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 6, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut", delay: 0.05 }}
              className="text-white font-serif text-lg leading-snug"
            >
              {image.caption}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {reduce && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <p className="text-white font-serif text-lg">{image.caption}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function Gallery() {
  const images: GalleryImage[] = [
    {
      src: susieWithHorse,
      alt: "Susie on-site preparing for a session",
      caption: "Susie on-site preparing for a session",
      colSpan: "col-span-1 md:col-span-2",
      sizes: "(min-width: 768px) 66vw, 100vw",
    },
    {
      src: redLightPad,
      alt: "LED red light therapy pad glowing across a horse's back during a wellness session",
      caption: "Red light application — RevitaVet",
      colSpan: "col-span-1",
      sizes: "(min-width: 768px) 33vw, 100vw",
    },
    {
      src: horseOnPad,
      alt: "A calm bay standing on the PEMF pad",
      caption: "A calm bay on the PEMF pad",
      colSpan: "col-span-1",
      sizes: "(min-width: 768px) 33vw, 100vw",
    },
    {
      src: pemfWhiteHorse,
      alt: "PEMF session in the stall with a relaxed grey",
      caption: "Magnawave PEMF — a deeply relaxing session",
      colSpan: "col-span-1 md:col-span-2",
      sizes: "(min-width: 768px) 66vw, 100vw",
    },
    {
      src: pemfRear,
      alt: "Magnawave PEMF loops in use during a session",
      caption: "PEMF loops applied along the topline",
      colSpan: "col-span-1 md:col-span-2",
      sizes: "(min-width: 768px) 66vw, 100vw",
    },
    {
      src: susieWithHorse,
      alt: "A quiet moment between sessions",
      caption: "A quiet moment between sessions",
      colSpan: "col-span-1",
      sizes: "(min-width: 768px) 33vw, 100vw",
    },
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
                transition={{
                  duration: 0.65,
                  ease: easing.out,
                  delay: 0.1,
                }}
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
            <GalleryItem key={index} image={image} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
