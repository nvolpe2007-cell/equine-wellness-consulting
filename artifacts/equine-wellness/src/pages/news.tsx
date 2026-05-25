import { Link } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ease as easing } from "@/lib/motion";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { LineReveal } from "@/components/ui/AnimatedText";
import { StaggerReveal, StaggerItem } from "@/components/ui/AnimatedText";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  newsletterPosts,
  formatPostDate,
  type NewsletterPost,
  type NewsletterCategory,
} from "@/content/newsletter-posts";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStickyVisible } from "@/hooks/useStickyVisible";

const ALL_CATEGORIES: NewsletterCategory[] = [
  "Legislation",
  "Seasonal Care",
  "Industry",
  "Session Guide",
  "Wellness",
];

async function fetchPosts(): Promise<NewsletterPost[]> {
  const res = await fetch("/api/newsletter/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  const json = (await res.json()) as { ok: boolean; posts: NewsletterPost[] };
  if (!json.ok || !Array.isArray(json.posts) || json.posts.length === 0) {
    return newsletterPosts;
  }
  return json.posts;
}

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
            aria-label={`Read full article: ${post.title}`}
          >
            Read full dispatch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.article>
    </StaggerItem>
  );
}

function FilterPills({
  active,
  onChange,
  ariaLabel,
  pills,
}: {
  active: NewsletterCategory | "All";
  onChange: (cat: NewsletterCategory | "All") => void;
  ariaLabel: string;
  pills: Array<NewsletterCategory | "All">;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className="flex items-center gap-2 py-2.5 overflow-x-auto"
    >
      {pills.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          aria-current={active === cat ? "true" : undefined}
          className={[
            "shrink-0 px-4 py-1.5 rounded-full text-sm font-sans font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            active === cat
              ? "bg-primary text-primary-foreground border-primary shadow-gold-glow"
              : "bg-card/80 text-muted-foreground border-border hover:text-foreground hover:border-primary/50",
          ].join(" ")}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}

function CategoryFilterStrip({
  active,
  onChange,
  pills,
}: {
  active: NewsletterCategory | "All";
  onChange: (cat: NewsletterCategory | "All") => void;
  pills: Array<NewsletterCategory | "All">;
}) {
  const reduce = useReducedMotion();
  const show = useStickyVisible("news-hero");

  return (
    <>
      <div className="container mx-auto px-4 max-w-3xl mt-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3 font-medium">
          Filter by topic
        </p>
        <FilterPills
          active={active}
          onChange={onChange}
          ariaLabel="Filter by category"
          pills={pills}
        />
        <div className="divider-gold mt-4" />
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            key="news-filter-nav"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: easing.out }}
            className="fixed top-16 inset-x-0 z-40 bg-background/95 backdrop-blur border-b border-border"
          >
            <div className="container mx-auto px-4">
              <FilterPills
                active={active}
                onChange={onChange}
                ariaLabel="Filter by category (sticky)"
                pills={pills}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function News() {
  const [activeCategory, setActiveCategory] = useState<
    NewsletterCategory | "All"
  >("All");

  const { data: posts = newsletterPosts } = useQuery<NewsletterPost[]>({
    queryKey: ["newsletter-posts"],
    queryFn: fetchPosts,
    placeholderData: newsletterPosts,
    staleTime: 5 * 60 * 1000,
  });

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts],
  );

  const presentCategories = useMemo(
    () => ALL_CATEGORIES.filter((cat) => sortedPosts.some((p) => p.category === cat)),
    [sortedPosts],
  );

  const filterPills: Array<NewsletterCategory | "All"> = useMemo(
    () => ["All", ...presentCategories],
    [presentCategories],
  );

  const filteredPosts = useMemo(
    () =>
      activeCategory === "All"
        ? sortedPosts
        : sortedPosts.filter((p) => p.category === activeCategory),
    [activeCategory, sortedPosts],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Editorial header */}
      <section id="news-hero" className="relative bg-card overflow-hidden">
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
          subheading="One thoughtful note a month — seasonal care, session guides, industry notes, and wellness tips for horse owners. No spam, unsubscribe anytime."
        />
      </div>

      {/* Category filter strip */}
      <CategoryFilterStrip
        active={activeCategory}
        onChange={setActiveCategory}
        pills={filterPills}
      />

      {/* Posts */}
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easing.out }}
        >
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            {activeCategory === "All"
              ? "Recent dispatches"
              : `${activeCategory} dispatches`}
          </h2>
          <p className="text-muted-foreground">
            {activeCategory === "All"
              ? "A look at what we've been writing about lately."
              : `Showing ${filteredPosts.length} post${filteredPosts.length === 1 ? "" : "s"} tagged "${activeCategory}".`}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <StaggerReveal
              key={activeCategory}
              className="space-y-8"
              staggerChildren={0.08}
              viewportMargin="-40px"
            >
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </StaggerReveal>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground text-center py-16"
            >
              No posts in this category yet — check back soon.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
