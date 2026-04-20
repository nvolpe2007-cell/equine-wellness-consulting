import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { WordReveal, LineReveal } from "@/components/ui/AnimatedText";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { newsletterPosts, formatPostDate, type NewsletterPost } from "@/content/newsletter-posts";

const sortedPosts: NewsletterPost[] = [...newsletterPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

function PostCard({ post, index }: { post: NewsletterPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm"
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
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
          data-testid={`link-read-full-${post.id}`}
        >
          Read full dispatch
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

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
            text="Notes for thoughtful horse owners."
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

      {/* Signup */}
      <div className="container mx-auto px-4 pt-16 max-w-2xl">
        <NewsletterSignup
          variant="hero"
          source="news_page"
          heading="Subscribe to The Worthy Horse News"
          subheading="One thoughtful note a month — legislation, seasonal care, and petitions worth following. No spam, unsubscribe anytime."
        />
      </div>

      {/* Posts */}
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <div className="mb-12">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            Recent dispatches
          </h2>
          <p className="text-muted-foreground">
            A look at what we've been writing about lately.
          </p>
        </div>

        <div className="space-y-8">
          {sortedPosts.map((post, idx) => (
            <PostCard key={post.id} post={post} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
