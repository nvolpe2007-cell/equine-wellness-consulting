import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ease as easing } from "@/lib/motion";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { LineReveal } from "@/components/ui/AnimatedText";
import { StaggerReveal, StaggerItem } from "@/components/ui/AnimatedText";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { newsletterPosts, formatPostDate, type NewsletterPost } from "@/content/newsletter-posts";

const sortedPosts: NewsletterPost[] = [...newsletterPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

function PostCard({ post }: { post: NewsletterPost }) {
  const reduce = useReducedMotion();
  return (
    <StaggerItem>
      <motion.article
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-shadow duration-500"
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
          <Link
            href={`/news/${post.slug}`}
            className="hover:text-primary transition-colors"
            data-testid={`link-post-title-${post.id}`}
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-muted-foreground leading-relaxed italic">
          {post.excerpt}
        </p>

        <div className="mt-5">
          <Link
            href={`/news/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
            data-testid={`link-read-full-${post.id}`}
          >
            Read full dispatch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.article>
    </StaggerItem>
  );
}

export default function News() {
  return (
    <div className="min-h-screen bg-background">
      {/* Editorial header */}
      <section className="relative bg-card overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <span className="block mb-6 gold-rule" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-5 font-medium">
                The Worthy Horse News
              </p>
              <motion.h1
                className="text-5xl md:text-7xl font-serif text-foreground leading-[1.02] tracking-tight"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: easing.out, delay: 0.1 }}
              >
                Notes for thoughtful horse owners.
              </motion.h1>
            </div>
            <div className="lg:col-span-5 lg:pb-3 lg:pl-10 lg:border-l lg:border-border">
              <LineReveal
                text="Industry notes, state-by-state updates, petitions worth following, and seasonal care reminders — written for owners who want to be informed partners in their horse's wellness."
                as="p"
                whileInView={false}
                delay={0.5}
                className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed"
              />
            </div>
          </div>
        </div>
        <div className="divider-gold" />
      </section>

      {/* Signup */}
      <div className="container mx-auto px-4 pt-20 max-w-2xl">
        <NewsletterSignup
          variant="hero"
          source="news_page"
          heading="Subscribe to The Worthy Horse News"
          subheading="One thoughtful note a month — legislation, seasonal care, and petitions worth following. No spam, unsubscribe anytime."
        />
      </div>

      {/* Posts */}
      <div className="container mx-auto px-4 py-32 md:py-40 max-w-3xl">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easing.out }}
        >
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            Recent dispatches
          </h2>
          <p className="text-muted-foreground">
            A look at what we've been writing about lately.
          </p>
        </motion.div>

        <StaggerReveal className="space-y-8" staggerChildren={0.08} viewportMargin="-40px">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </StaggerReveal>
      </div>
    </div>
  );
}
