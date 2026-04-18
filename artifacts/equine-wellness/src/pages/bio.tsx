import { motion } from "framer-motion";
import horsePortrait from "@assets/stock_images/horse-portrait.jpg";

export default function Bio() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card py-20 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-foreground mb-6"
          >
            Meet Susie H. Lytal, MS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-light"
          >
            Equine Biomechanist & Certified Equine Sports Massage Therapist
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
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
                alt="A horse in a quiet moment" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card p-8 rounded-xl border shadow-sm"
            >
              <h3 className="font-serif text-xl text-foreground mb-4 border-b pb-4">Credentials & Education</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex flex-col">
                  <span className="font-medium text-foreground">Master of Science (MS)</span>
                  <span className="text-sm">Specialization in Biomechanics</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium text-foreground">Certified Equine Sports Massage Therapist</span>
                  <span className="text-sm">Accredited Certification Program</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium text-foreground">Equine Biomechanist</span>
                  <span className="text-sm">Professional Designation</span>
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
              <h2 className="font-serif text-3xl text-foreground mt-0">A Passion Built on Science and Care</h2>
              
              <p className="lead text-xl text-muted-foreground mb-8">
                "My goal is simple: to help horses move more comfortably, perform more efficiently, and live happier lives through informed, compassionate bodywork."
              </p>

              <p>
                With a Master's degree in Biomechanics, Susie brings a rigorous, scientific understanding of anatomy and movement to her work with horses. This academic foundation, paired with her extensive hands-on certification as an Equine Sports Massage Therapist, allows her to evaluate and support the equine athlete holistically.
              </p>

              <p>
                Susie founded <strong>Equine Bodywork and Wellness Consulting</strong> to bridge the gap between academic biomechanics and practical barn-aisle care. She recognizes that every horse—from the elite competitor to the beloved pasture companion—has unique structural needs and compensatory patterns.
              </p>

              <h3 className="font-serif text-2xl text-foreground mt-12 mb-6">The Philosophy</h3>
              <p>
                A session with Susie is never a one-size-fits-all routine. Because she understands the complex kinetic chains of the equine body, she can tailor her modalities to address specific areas of tension or restriction. 
              </p>
              
              <p>
                Susie believes deeply in a team approach to equine wellness. She works collaboratively alongside owners, trainers, farriers, and veterinarians. While her work may profoundly support a horse's comfort and muscular health, she is clear about her role: she provides wellness support, not medical diagnosis or treatment.
              </p>

              <div className="bg-muted p-8 rounded-xl my-10 border-l-4 border-primary">
                <p className="italic text-foreground m-0">
                  "When we understand how the horse is designed to move, we can better support them when they struggle. It's about giving them the tools to balance their own bodies, relieving tension before it becomes a major obstacle."
                </p>
              </div>

              <p>
                Outside of sessions, Susie is continually expanding her knowledge, staying current with the latest research in equine biomechanics, and maintaining her own connection to the horses that inspire her work every day.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
