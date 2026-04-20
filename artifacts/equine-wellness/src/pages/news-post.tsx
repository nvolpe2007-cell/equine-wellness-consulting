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
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 mb-10"
          data-testid="link-back-to-news"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to The Worthy Horse News
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-4">
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

          <h1 className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-sm font-sans tracking-wider uppercase text-primary mb-10">
            By Susie H. Lytal, MS &middot; Equine Biomechanist
          </p>

          <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed mb-10">
            {post.excerpt}
          </p>

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
