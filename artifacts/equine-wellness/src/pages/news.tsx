import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import { WordReveal, LineReveal } from "@/components/ui/AnimatedText";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { newsletterPosts, formatPostDate } from "@/content/newsletter-posts";

export default function News() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card py-20 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4 font-medium">
            The Worthy Horse News
          </p>
          <WordReveal
            text="A monthly dispatch for thoughtful horse owners."
            as="h1"
            className="text-3xl md:text-5xl font-serif text-foreground mb-6 leading-tight"
            delay={0.1}
            stagger={0.05}
          />
          <LineReveal
            text="Industry notes, state-by-state updates, petitions worth following, and seasonal care reminders — written for owners who want to be informed partners in their horse's wellness."
            as="p"
            whileInView={false}
            delay={0.5}
            className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
          />
        </div>
      </div>

      {/* Hero signup */}
      <div className="container mx-auto px-4 -mt-10 mb-20 max-w-2xl relative z-10">
        <NewsletterSignup
          variant="hero"
          source="news_hero"
          heading="Subscribe to The Worthy Horse News"
          subheading="One thoughtful email a month. No spam. Unsubscribe any time."
        />
      </div>

      {/* Posts */}
      <div className="container mx-auto px-4 pb-24 max-w-3xl">
        <div className="mb-12">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            Recent dispatches
          </h2>
          <p className="text-muted-foreground">
            A look at what we've been writing about lately.
          </p>
        </div>

        <div className="space-y-12">
          {newsletterPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover-elevate"
              data-testid={`post-${post.id}`}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-3">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatPostDate(post.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-wider text-primary font-medium">
                    {post.category}
                  </span>
                </span>
              </div>

              <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 leading-snug">
                {post.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed mb-5 italic">
                {post.excerpt}
              </p>

              <div className="space-y-4 text-foreground/90 leading-relaxed">
                {post.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Footer signup */}
        <div className="mt-20 bg-primary rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-serif text-2xl md:text-3xl text-primary-foreground mb-3">
            Don't miss the next dispatch.
          </h3>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join other thoughtful owners getting The Worthy Horse News delivered once a month.
          </p>
          <div className="max-w-lg mx-auto">
            <NewsletterSignup variant="footer" source="news_footer" />
          </div>
        </div>
      </div>
    </div>
  );
}
