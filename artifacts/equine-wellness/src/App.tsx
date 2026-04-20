import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingCallCta } from "@/components/FloatingCallCta";

import Home from "@/pages/home";
import Bio from "@/pages/bio";
import Modalities from "@/pages/modalities";
import Partners from "@/pages/partners";
import Gallery from "@/pages/gallery";
import News from "@/pages/news";
import NewsPost from "@/pages/news-post";
import NotFound from "@/pages/not-found";

import { getPostBySlug } from "@/content/newsletter-posts";

const queryClient = new QueryClient();

type PageMeta = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

const pageMeta: Record<string, PageMeta> = {
  "/": {
    title: "Equine Bodywork and Wellness Consulting | Susie H. Lytal, MS",
    description:
      "Equine bodywork and wellness sessions with Susie H. Lytal, MS — Equine Biomechanist. Sports massage, PEMF, red light, and more for thoughtful horse owners.",
    ogTitle: "Equine Bodywork and Wellness Consulting",
    ogDescription:
      "Professional equine bodywork and wellness sessions grounded in graduate-level biomechanics. Sports massage, PEMF, red light, cold laser, TENS, and TECAR.",
  },
  "/bio": {
    title: "About Susie H. Lytal, MS — Equine Biomechanist",
    description:
      "Meet Susie H. Lytal, MS — equine biomechanist offering bodywork and wellness sessions in partnership with your veterinarian.",
    ogTitle: "About Susie H. Lytal, MS — Equine Biomechanist",
    ogDescription:
      "Graduate-level biomechanics expertise applied to hands-on equine wellness sessions in partnership with your veterinarian.",
  },
  "/modalities": {
    title: "Wellness Modalities for Horses — Sports Massage, PEMF, Red Light & More",
    description:
      "Explore the wellness modalities used in every session: sports massage, PEMF, red light, TENS, and more — supportive, non-medical care for your horse.",
    ogTitle: "Six Wellness Modalities for Horses",
    ogDescription:
      "Equine sports massage, PEMF (Magnawave), red light (RevitaVet), cold laser, TENS (TrueStim), and TECAR — tailored to your horse.",
  },
  "/gallery": {
    title: "Gallery — Sessions in the Barn Aisle",
    description:
      "A look at sessions in the barn aisle: hands-on bodywork, PEMF, and red light supporting horses across the region.",
    ogTitle: "Gallery — Sessions in the Barn Aisle",
    ogDescription:
      "Glimpses of hands-on equine bodywork, PEMF, and red light sessions in real working barns.",
  },
  "/partners": {
    title: "Trusted Partners — Magnawave, RevitaVet, TrueStim, BeneFab",
    description:
      "The equipment brands and wellness products Susie trusts and uses in every session, including Magnawave, RevitaVet, TrueStim, and BeneFab.",
    ogTitle: "Trusted Equipment Partners",
    ogDescription:
      "The equipment brands Susie uses and recommends: Magnawave, RevitaVet, TrueStim, and BeneFab.",
  },
  "/news": {
    title: "The Worthy Horse News — Newsletter for Thoughtful Horse Owners",
    description:
      "Subscribe to The Worthy Horse News: a monthly dispatch covering legislation, state law, petitions, and seasonal care for thoughtful horse owners.",
    ogTitle: "The Worthy Horse News",
    ogDescription:
      "A monthly dispatch on equine wellness, legislation, petitions, and seasonal care — for thoughtful horse owners.",
  },
};

function setMeta(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setProperty(property: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href: string) {
  let tag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function setRobots(content: string | null) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (content === null) {
    if (tag) tag.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "robots");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    const postSlugMatch = location.match(/^\/news\/([^/]+)$/);
    const post = postSlugMatch ? getPostBySlug(postSlugMatch[1]) : undefined;
    const known: PageMeta | undefined = post
      ? {
          title: `${post.title} | The Worthy Horse News`,
          description: post.metaDescription,
          ogTitle: post.title,
          ogDescription: post.metaDescription,
        }
      : pageMeta[location];
    const meta: PageMeta = known ?? {
      title: "Page not found | Equine Bodywork and Wellness Consulting",
      description:
        "The page you're looking for couldn't be found. Return to the home page to continue exploring equine bodywork and wellness sessions.",
    };
    const ogTitle = meta.ogTitle ?? meta.title;
    const ogDescription = meta.ogDescription ?? meta.description;
    const url = `${window.location.origin}${window.location.pathname}`;

    document.title = meta.title;
    setMeta("description", meta.description);

    setProperty("og:title", ogTitle);
    setProperty("og:description", ogDescription);
    setProperty("og:url", url);
    setProperty("og:type", "website");

    setMeta("twitter:title", ogTitle);
    setMeta("twitter:description", ogDescription);
    setMeta("twitter:card", "summary_large_image");

    setCanonical(url);
    setRobots(known ? null : "noindex, follow");

    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <PageWrapper key={location}>
            <Switch location={location}>
              <Route path="/" component={Home} />
              <Route path="/bio" component={Bio} />
              <Route path="/modalities" component={Modalities} />
              <Route path="/partners" component={Partners} />
              <Route path="/gallery" component={Gallery} />
              <Route path="/news" component={News} />
              <Route path="/news/:slug" component={NewsPost} />
              <Route component={NotFound} />
            </Switch>
          </PageWrapper>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingCallCta />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
