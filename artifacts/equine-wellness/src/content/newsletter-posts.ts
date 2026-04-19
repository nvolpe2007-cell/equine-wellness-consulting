export type NewsletterCategory =
  | "Legislation"
  | "State Law"
  | "Petition"
  | "Seasonal Care"
  | "Industry";

export type NewsletterPost = {
  id: string;
  title: string;
  date: string;
  category: NewsletterCategory;
  excerpt: string;
  body: string[];
};

export const newsletterPosts: NewsletterPost[] = [
  {
    id: "2026-04-spring-transition",
    title: "Spring Transition: Helping Your Horse Move Through the Seasonal Shift",
    date: "2026-04-10",
    category: "Seasonal Care",
    excerpt:
      "As pastures green up and work loads ramp back up, horses often experience a noticeable change in body condition, hydration, and muscular comfort. Here are the things I'm watching for in spring sessions.",
    body: [
      "After a long winter of reduced movement, blanketing, and limited turnout, most horses come into spring carrying some degree of muscular guarding — particularly through the topline, hindquarters, and the base of the neck.",
      "In sessions over the past few weeks, I've been seeing a lot of tightness around the longissimus dorsi and the gluteal complex. This often shows up as a shortened stride behind, reluctance to bend through the ribcage, or a horse that feels 'sticky' in the first ten minutes of warm-up.",
      "A few things I'd encourage every owner to keep an eye on as the seasons change: hydration (electrolytes matter more than people think when grass moisture content shifts), foot balance after a winter of softer terrain, and saddle fit as your horse rebuilds topline muscle.",
      "If your horse is starting back into more consistent work, consider adding a maintenance session to your spring rotation. Pairing hands-on bodywork with PEMF or red light can support the horse as their body re-adapts to the demands of work.",
      "As always, none of this replaces a conversation with your veterinarian. If something feels off, start with the vet — wellness work is most effective alongside good primary care.",
    ],
  },
  {
    id: "2026-03-state-roundup",
    title: "Legislation Update: What's Changing for Equine Bodywork Practitioners in 2026",
    date: "2026-03-22",
    category: "Legislation",
    excerpt:
      "From California to Florida, state veterinary boards have been quietly updating language around equine wellness work and bodywork. Here's a plain-English summary of what owners should know.",
    body: [
      "Over the last six months, several state veterinary boards have either proposed or adopted clarifying language around who may provide hands-on, non-medical care to horses — and under what circumstances.",
      "California (proposed): A working group is reviewing how the state defines hands-on, non-medical wellness work to draw a clearer line between licensed veterinary medicine and certified wellness practices like sports massage. Comment periods have been open through the spring.",
      "Texas (adopted): The Texas Board of Veterinary Medical Examiners refined its position on lay practitioners, generally permitting non-diagnostic wellness modalities when performed under the framework of owner consent and without representation as veterinary care.",
      "Florida (in committee): A bill currently in committee would explicitly recognize equine sports massage as a distinct, non-medical discipline when performed by certified practitioners. The language is supportive but still in revision.",
      "If you're an owner: the takeaway is that the legal landscape is generally moving toward clearer recognition of certified wellness practitioners — but the rules vary significantly state-to-state. When booking any modality, ask the practitioner about their certification, scope of practice, and how they coordinate with your veterinarian.",
      "I'll keep tracking these as they evolve and share updates here as bills are passed or amended.",
    ],
  },
  {
    id: "2026-02-petition-watch",
    title: "Petition Watch: Recognizing Certified Equine Massage as a Distinct Profession",
    date: "2026-02-18",
    category: "Petition",
    excerpt:
      "A national petition is gaining traction asking for clearer professional recognition of certified equine sports massage practitioners. Here's what it actually says — and what it doesn't.",
    body: [
      "A petition circulated by a coalition of certified equine bodywork practitioners and educators is currently gathering signatures from horse owners, trainers, and veterinarians across the country.",
      "The petition does not seek to expand scope into veterinary medicine. It explicitly affirms that diagnosis, prescription, and medical care remain the exclusive domain of licensed veterinarians.",
      "What it does ask: that state regulators recognize certified equine sports massage and related wellness modalities as distinct, non-medical professions, with clear standards for certification, continuing education, and ethical practice.",
      "Why this matters: clear professional recognition protects horse owners from under-trained practitioners, supports the team-based approach to equine wellness, and gives veterinarians a clearer framework for collaborative referral.",
      "If you'd like to read the full petition or add your name, search 'Equine Bodywork Recognition Coalition' — and as always, form your own opinion. I'm sharing it because I think more clarity benefits horses and the people who care for them.",
    ],
  },
  {
    id: "2026-01-industry-pemf",
    title: "Industry Note: New Research on PEMF and Recovery in Performance Horses",
    date: "2026-01-30",
    category: "Industry",
    excerpt:
      "A pair of recently published studies look at the relationship between consistent PEMF application and recovery markers in actively competing horses. A measured look at what they found — and what they didn't.",
    body: [
      "Two studies published in the last quarter add to the growing — but still developing — body of literature around Pulsed Electromagnetic Field (PEMF) application in equine athletes.",
      "The first, a smaller cohort study out of a European sport horse program, observed self-reported owner-perceived improvements in post-work recovery and a measurable trend in heart-rate recovery times in horses receiving consistent PEMF sessions over a 12-week training block.",
      "The second was a more controlled trial that looked at muscle stiffness scores using objective myometry. While findings were modest, they trended favorably for the PEMF group when sessions were paired with a structured warm-up and cool-down protocol.",
      "What these studies do not say: that PEMF resolves injury, replaces veterinary diagnostics, or produces dramatic changes in isolation. The horses in both studies were in active, well-managed programs with regular veterinary oversight.",
      "What they do reinforce: that wellness modalities like PEMF appear to contribute most when integrated thoughtfully into a broader program of training, nutrition, hoof care, and veterinary care. That's how I approach it in every session — as one piece of the picture, never the whole.",
    ],
  },
];

export function formatPostDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
