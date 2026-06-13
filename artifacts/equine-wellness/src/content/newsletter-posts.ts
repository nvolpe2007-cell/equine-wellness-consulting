export type NewsletterCategory =
  | "Legislation"
  | "Seasonal Care"
  | "Industry"
  | "Session Guide"
  | "Wellness";

export type NewsletterPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: NewsletterCategory;
  excerpt: string;
  metaDescription: string;
  body: string[];
};

export const newsletterPosts: NewsletterPost[] = [
  {
    id: "2026-05-tension-signs",
    slug: "five-signs-your-horse-is-carrying-tension",
    title: "Five Signs Your Horse Is Carrying Tension You Might Be Missing",
    date: "2026-05-10",
    category: "Seasonal Care",
    excerpt:
      "The signs are usually there long before a horse goes lame or refuses a fence — you just have to know where to look.",
    metaDescription:
      "Five subtle body language signs that your horse is carrying tension — from girthiness to slow warm-ups — and what they mean for performance and wellness.",
    body: [
      "Girthiness or pinned ears when you're tacking up is one of the most common things I see dismissed as attitude. In most cases it isn't. A horse that pins his ears when you reach for the cinch is telling you something hurts, or hurts in memory. That response almost always maps to tightness through the back, the latissimus, or the thoracic sling — the very structures that bear the pressure of the saddle and girth. Before you call it a behavior problem, consider whether it might be a comfort problem.",
      "A shortened stride behind, or a horse that just won't track up no matter how much leg you add, is another sign that often gets blamed on laziness or fitness. What I'm usually finding when I put my hands on these horses is significant tension in the gluteal complex and the lumbar-sacral junction. The horse isn't being lazy. The horse is protecting something.",
      "Inconsistency from one rein to the other is worth paying attention to, especially when it's been creeping in gradually. A horse that's soft and supple going left but braces going right — or vice versa — is often carrying asymmetrical tension through the neck, shoulders, or ribcage. I've been seeing a lot of this in spring sessions, often tracing back to winter movement patterns and one-sided stall habits.",
      "Head tossing and resistance to contact have about a dozen possible causes, and the mouth and bit are usually the first place people look. After that, it's the poll and the atlas-axis joint. I'd also ask about the base of the neck and the trapezius — these muscles directly influence how a horse accepts contact, and when they're locked up, a soft hand isn't enough.",
      "The horse that takes twenty minutes to loosen up — that one is quietly telling you something every single ride. All horses need a warm-up, but if yours needs half the session before he moves like himself, that's not normal. That's a horse working through discomfort before he can get to work. None of these are discipline issues. They're conversations.",
    ],
  },
  {
    id: "2026-04-first-session",
    slug: "what-to-expect-in-your-first-bodywork-session",
    title: "What to Expect at Your First Equine Bodywork Session",
    date: "2026-04-22",
    category: "Session Guide",
    excerpt:
      "If you've never had an equine wellness consultant out before, here's exactly what happens from the moment I arrive — and what your horse will likely show you.",
    metaDescription:
      "A friendly walkthrough of what to expect during a first equine bodywork session with Susie H. Lytal — the assessment, the modalities, and what to watch for in the days after.",
    body: [
      "Before I touch the horse, I watch him. I'll ask you to walk and trot him out if the space allows, and I'll stand back and look at how he moves, where he holds weight, where he doesn't. Postural assessment tells me a lot — the way a horse parks out at rest, how he carries his head, whether one hip is consistently higher than the other. That picture shapes everything I do in the session. Hands-on work without a baseline is just guessing.",
      "Once I start working, I typically begin with hands-on massage before introducing any equipment. Massage lets me feel where the muscle is guarded, where there's heat, where the horse braces or releases. That information tells me whether PEMF or red light will be useful that session, and if so, where to focus. I'm not running through a fixed protocol — I'm following what the horse is showing me.",
      "What horses commonly do during a session: yawn, sometimes repeatedly. Lick and chew. Drop the hind leg and shift weight off it. Lower the head. Some horses get very quiet; some get a little more animated before they settle. All of these are releases — the nervous system unwinding from a state of guarding. If your horse does any of these, you're watching the work take effect.",
      "In the 24 to 48 hours after a first session, keep an eye on how he moves, how he is to tack up, and whether he seems more or less forward than usual. Some horses have a mild low-energy day after their first session — that's normal, and it passes. Others come out the next morning noticeably softer and more willing. The response varies, and both are useful information. First sessions are mostly information — for me and for the horse.",
    ],
  },
  {
    id: "2026-04-summer-heat",
    slug: "summer-heat-and-your-horses-recovery",
    title: "Summer Heat and Recovery: What to Watch When Temperatures Rise",
    date: "2026-04-05",
    category: "Seasonal Care",
    excerpt:
      "Southern California summers change the recovery equation for working horses — here's what shifts and what you can do about it.",
    metaDescription:
      "How heat affects muscle recovery in horses and what to do about it — electrolytes, session timing, and heat-tolerant modalities for Southern California summers.",
    body: [
      "Heat slows everything down, including muscle recovery. When ambient temperatures climb, a horse working at the same intensity as he did in March is under meaningfully more physiological stress — his body is managing thermoregulation on top of the demands of work. Post-work cool-down matters more in summer, not less. Walking out properly, hosing legs, and giving the horse time to drop his respiration rate before returning to the stall or paddock isn't optional — it's part of the session.",
      "On electrolytes: plain salt is better than nothing, and loose salt free-choice is something every horse should have year-round. But in summer, especially for horses in regular work, a full electrolyte spectrum matters — sodium, chloride, potassium, and magnesium are all lost in sweat, and replacing only sodium leaves gaps. I'm not advocating any particular brand, but I'd encourage you to read the label and look for something that covers more than just salt.",
      "Timing your bodywork sessions around the heat is worth thinking about. I prefer morning appointments in summer for horses in active work — the horse is cooler, less stressed, and more receptive. If your horse has had a hard training day in the afternoon heat, I'd rather come the next morning than the same evening. A horse that's still thermally stressed doesn't absorb bodywork the same way a recovered horse does.",
      "Red light and cold laser are two modalities I lean on more in summer, partly because they're heat-tolerant — they support circulation and tissue recovery without adding thermal stress to the horse. PEMF is still useful, but I'm mindful of session length and time of day when it's hot. The horse that sweats clean and recovers fast is a horse that will keep performing. Recovery is training.",
    ],
  },
  {
    id: "2026-03-pemf-explainer",
    slug: "pemf-what-horse-owners-actually-want-to-know",
    title: "PEMF: What Horse Owners Actually Want to Know",
    date: "2026-03-18",
    category: "Industry",
    excerpt:
      "There's a lot of marketing noise around PEMF. Here's a plain-English look at what it actually does, what it doesn't, and how I use it.",
    metaDescription:
      "A plain-English explainer on PEMF for horse owners — what it does at the cell level, the difference between consumer and clinical machines, and how Susie H. Lytal uses it in sessions.",
    body: [
      "PEMF stands for Pulsed Electromagnetic Field therapy. At the cellular level, what it appears to do is support ion exchange across cell membranes — essentially helping cells function the way they're supposed to when they've been compressed, inflamed, or metabolically stressed. It's not delivering heat, it's not stimulating muscle contractions the way an e-stim device does. It's working at a subtler level, which is partly why the effects can be hard to see in a single session but accumulate over time.",
      "The difference between a consumer-grade PEMF device and a clinical machine like Magnawave is meaningful. Consumer devices are lower-powered and have shallower tissue penetration — they may be useful for maintenance or mild support, but they're not reaching deep muscle or joint structures the way a professional unit does. When I use PEMF in a session, I'm working with a machine that has the output to actually reach the tissue I'm trying to affect. That's not a marketing claim — it's physics.",
      "In a session, most horses respond to PEMF within a few minutes. The coil goes over a specific area — often the back, the hindquarters, or the neck — and the horse typically shows the same kind of release signs you'd see with hands-on work: yawning, licking, softening through the topline. Some horses are more demonstrative than others, but after thousands of sessions I find that horses are generally honest about whether something is helping.",
      "What PEMF is genuinely useful for: recovery after hard work, stiffness, pre-competition preparation, horses with chronic tightness patterns that are slow to respond to massage alone. What it's not: a diagnostic tool, a substitute for veterinary care, or a fix for structural problems. If a horse has a joint issue that needs imaging or a lameness that needs a vet, PEMF isn't the answer to that — it may be a useful part of the support protocol after the diagnosis, but it starts with the vet.",
      "I've been using Magnawave PEMF long enough to have a clear picture of when it helps and when the horse needs something different. PEMF isn't magic — but when it's applied correctly, it's a meaningful part of the picture.",
    ],
  },
  {
    id: "2026-02-care-team",
    slug: "how-bodywork-fits-into-your-horses-care-team",
    title: "How Bodywork Fits Into Your Horse's Care Team",
    date: "2026-02-28",
    category: "Wellness",
    excerpt:
      "The best outcomes I've seen happen when bodywork and veterinary care work together — not in separate lanes.",
    metaDescription:
      "How equine bodywork fits into a vet-directed care plan — why Susie H. Lytal always reviews vet history first, and how to talk to your vet about adding bodywork.",
    body: [
      "Before I start any session with a horse I haven't worked with before, I ask about their vet history. Not because I'm going to diagnose anything — I'm not — but because knowing what the vet has found changes how I approach the work. A horse with a history of kissing spines gets handled differently than a horse with no known issues. A horse coming back from a suspensory injury needs a different session than a healthy horse in full work. The history is context, and context matters.",
      "Some of my most effective work happens in the context of vet-directed recovery. After an injury, after surgery, after a significant lameness episode — these are the situations where bodywork can meaningfully support what the vet is managing. Scar tissue, compensatory patterns, muscle guarding that develops while a horse is protecting a painful limb — these are things that bodywork addresses well. I've worked alongside veterinary rehab protocols where my role was very clearly defined: support the tissue, support the range of motion, don't push past what the vet has cleared.",
      "If you want to add bodywork to your horse's care and you're not sure how to bring it up with your vet, keep it simple. Most vets I've worked alongside have been supportive once they understand what I do and what I don't do. I'm not prescribing, diagnosing, or making treatment decisions. I'm working with the musculoskeletal system to support comfort and function. Framed that way, it's rarely a point of conflict — it's an addition to the team.",
      "I'm not trying to replace your veterinarian. I'm trying to make their job easier — and your horse's life better.",
    ],
  },
];

export function getPostBySlug(slug: string): NewsletterPost | undefined {
  return newsletterPosts.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
