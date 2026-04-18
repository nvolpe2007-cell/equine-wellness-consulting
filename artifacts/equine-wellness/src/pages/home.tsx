import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import barnHero from "@assets/stock_images/barn-hero.jpg";
import barnExterior from "@assets/stock_images/barn-exterior.jpg";
import horsePortrait from "@assets/stock_images/horse-portrait.jpg";
import massageHands from "@assets/stock_images/massage-hands.jpg";
import pemfWhiteHorse from "@assets/20260407_121449_1776528702902.jpg";
import redLightLeg from "@assets/20260319_191731_1776528710545.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={barnHero} 
            alt="Warm barn interior morning light" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-primary-foreground/90 font-sans tracking-widest uppercase text-sm mb-6">Susie H. Lytal, MS • Equine Biomechanist</h2>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
              Elevating equine performance through science and care.
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
              Professional equine bodywork and wellness consulting, grounded in graduate-level biomechanics expertise.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/modalities"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 w-full sm:w-auto"
                data-testid="link-hero-modalities"
              >
                Explore Modalities
              </Link>
              <Link
                href="/bio"
                className="inline-flex h-12 items-center justify-center rounded-md bg-white/10 px-8 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 w-full sm:w-auto border border-white/20"
                data-testid="link-hero-bio"
              >
                Meet Susie
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro / Philosophy */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">Grounded in Knowledge. Delivered with Compassion.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Every horse is a complex athlete, whether they are performing at the highest levels of competition or carrying you safely down the trail. My approach to equine wellness combines a deep, scientific understanding of biomechanics with highly attuned, hands-on application. We don't just look at the symptoms; we support the whole horse.
            </p>
            <img src={barnExterior} alt="Stable" className="w-full h-auto max-h-[400px] object-cover rounded-xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Wellness Sessions</h2>
              <p className="text-muted-foreground">
                A comprehensive approach to equine comfort. Each session is tailored to your horse's unique biomechanical needs, utilizing a range of modalities to support optimal movement and well-being.
              </p>
            </div>
            <Link
              href="/modalities"
              className="group inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
              data-testid="link-home-all-services"
            >
              View all modalities
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Equine Sports Massage",
                desc: "Targeted hands-on techniques that may support muscular relaxation, flexibility, and overall comfort.",
                img: massageHands
              },
              {
                title: "PEMF Sessions",
                desc: "Pulsed Electromagnetic Field application using Magnawave to support cellular function and recovery.",
                img: pemfWhiteHorse
              },
              {
                title: "Red Light Application",
                desc: "Utilizing RevitaVet equipment to deliver targeted light that may contribute to comfort and tissue health.",
                img: redLightLeg
              }
            ].map((service, i) => (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card rounded-xl overflow-hidden border shadow-sm group"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-serif text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Difference Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-white">The Biomechanical Advantage</h2>
              <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed">
                Working with an Equine Biomechanist means looking beyond the surface. It involves analyzing how the horse moves, identifying compensatory patterns, and applying specific modalities to support more efficient, comfortable movement.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Graduate-level education in biomechanics (MS)",
                  "Certified Equine Sports Massage Therapist",
                  "Comprehensive multi-modality approach",
                  "Collaborative relationship with veterinary professionals"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10">
                <img src={horsePortrait} alt="A horse close up" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-accent rounded-2xl z-0" />
            </div>
          </div>
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
      <section id="contact" className="py-24 bg-card border-t">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-serif text-foreground mb-6">Ready to support your horse's wellness?</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Reach out to discuss your horse's needs and schedule a session. We'll develop a personalized plan to support their comfort and performance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="tel:+13104884389" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
              data-testid="link-cta-phone"
            >
              Call (310) 488-4389
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
