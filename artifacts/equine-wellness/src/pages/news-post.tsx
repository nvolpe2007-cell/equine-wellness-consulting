import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { getPostBySlug, formatPostDate } from "@/content/newsletter-posts";
import NotFound from "@/pages/not-found";

const SCHEMA_SCRIPT_ID = "newsletter-article-schema";

export default function NewsPost() {
  const [, params] = useRoute("/news/:slug");
  const slug = params?.slug;
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) return;
    const data = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.date,
      dateModified: post.date,
      articleSection: post.category,
      author: {
        "@type": "Person",
        name: "Susie H. Lytal",
        honorificSuffix: "MS",
        url: `${window.location.origin}/bio`,
      },
      publisher: {
        "@type": "Organization",
        name: "Equine Bodywork and Wellness Consulting",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${window.location.origin}/news/${post.slug}`,
      },
      image: `${window.location.origin}/opengraph.jpg`,
    };

    let script = document.getElementById(
      SCHEMA_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCHEMA_SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      const existing = document.getElementById(SCHEMA_SCRIPT_ID);
      if (existing) existing.remove();
    };
  }, [post]);

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Editorial article header */}
      <section className="relative bg-card overflow-hidden">
        <div className="container mx-auto px-4 pt-20 pb-24 md:pt-24 md:pb-32 relative">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 mb-12"
            data-testid="link-back-to-news"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to The Worthy Horse News
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end"
          >
            <div className="lg:col-span-7">
              <span className="block mb-6 gold-rule" aria-hidden="true" />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-5">
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
              <h1 className="font-serif font-[500] text-4xl md:text-6xl text-foreground leading-[1.02] tracking-tight">
                {post.title}
              </h1>
            </div>
            <div className="lg:col-span-5 lg:pb-3 lg:pl-10 lg:border-l lg:border-border">
              <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <p className="text-xs font-sans tracking-[0.3em] uppercase text-primary">
                By Susie H. Lytal, MS &middot; Equine Biomechanist
              </p>
            </div>
          </motion.div>
        </div>
        <div className="divider-gold" />
      </section>

      {/* Article body */}
      <div className="container mx-auto px-4 py-20 md:py-28 max-w-3xl">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-5 text-foreground/90 leading-relaxed text-base md:text-lg">
            {post.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.article>

        <hr className="my-16 border-border" />

        <div>
          <NewsletterSignup
            variant="hero"
            source={`news_post_${post.slug}`}
            heading="Get the next dispatch in your inbox"
            subheading="One thoughtful note a month from Susie H. Lytal, MS — legislation, seasonal care, and petitions worth following."
          />
        </div>
      </div>
    </div>
  );
}
