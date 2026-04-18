import { motion } from "framer-motion";

export default function Gallery() {
  const images = [
    { src: "/images/hero-barn.png", alt: "Warm morning light in the stable", colSpan: "col-span-1 md:col-span-2" },
    { src: "/images/gallery-hands.png", alt: "Equine bodywork hand massage", colSpan: "col-span-1" },
    { src: "/images/gallery-redlight.png", alt: "Red light session", colSpan: "col-span-1" },
    { src: "/images/gallery-massage.png", alt: "Equine massage session", colSpan: "col-span-1 md:col-span-2" },
    { src: "/images/gallery-pemf.png", alt: "PEMF session with Magnawave", colSpan: "col-span-1 md:col-span-2" },
    { src: "/images/gallery-pasture.png", alt: "Horse relaxing in pasture", colSpan: "col-span-1" },
    { src: "/images/bio-stable.png", alt: "Professional credentials", colSpan: "col-span-1" },
    { src: "/images/gallery-aisle.png", alt: "Quiet stable aisle", colSpan: "col-span-1 md:col-span-2" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card py-20 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-foreground mb-6"
          >
            Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-light leading-relaxed"
          >
            Glimpses of sessions, serene spaces, and the incredible animals we serve.
          </motion.p>
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
            >
              <img 
                src={image.src} 
                alt={image.alt} 
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
