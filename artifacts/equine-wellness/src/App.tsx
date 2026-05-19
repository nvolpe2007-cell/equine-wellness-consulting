import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ease as easing } from "@/lib/motion";
import { useEffect, useRef } from "react";
import { useIntroVisibility } from "@/components/intro/IntroVisibilityContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingCallCta } from "@/components/FloatingCallCta";
import { CookieConsent } from "@/components/CookieConsent";
import { IntroVisibilityProvider } from "@/components/intro/IntroVisibilityContext";

import Home from "@/pages/home";
import Bio from "@/pages/bio";
import Modalities from "@/pages/modalities";
import Partners from "@/pages/partners";
import Gallery from "@/pages/gallery";
import News from "@/pages/news";
import NewsPost from "@/pages/news-post";
import Survey from "@/pages/survey";
import SurveyAdmin from "@/pages/admin/survey";
import NotFound from "@/pages/not-found";

import { getPostBySlug } from "@/content/newsletter-posts";
import { trackPageView, initAnalyticsConsent } from "@/lib/analytics";

const queryClient = new QueryClient();

const NAV_ORDER = [
  "/",
  "/bio",
  "/modalities",
  "/gallery",
  "/news",
  "/partners",
  "/survey",
];

function getNavIndex(path: string): number {
  const base = path.split("/")[1] ? `/${path.split("/")[1]}` : "/";
  return NAV_ORDER.indexOf(base);
}

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
  "/survey": {
    title: "PV Horse Keeping Survey — Share Your Voice | Equine Bodywork and Wellness Consulting",
    description:
      "Share your perspective on the quality of horse keeping in Palos Verdes and what should be done to preserve equestrian culture in the Peninsula.",
    ogTitle: "Palos Verdes Horse Keeping Survey",
    ogDescription:
      "Community survey on the quality of horse keeping in Palos Verdes — your voice helps preserve equestrian culture in the Peninsula.",
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

function PageWrapper({
  children,
  direction,
}: {
  children: React.ReactNode;
  direction: "forward" | "back" | "none";
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className="relative">{children}</div>;
  }

  const xEnter = direction === "back" ? -28 : direction === "forward" ? 28 : 0;
  const xExit = direction === "back" ? 28 : direction === "forward" ? -28 : 0;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: xEnter }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: xExit }}
      transition={{ duration: 0.28, ease: easing.out }}
    >
      {children}
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  const directionRef = useRef<"forward" | "back" | "none">("none");
  const { setIntroActive } = useIntroVisibility();

  // Defensive: any navigation away from "/" must restore the navbar,
  // even if BarnDoorIntro's unmount effect somehow misses (e.g. fast
  // consecutive route changes during AnimatePresence transitions).
  useEffect(() => {
    if (location !== "/") setIntroActive(false);
  }, [location, setIntroActive]);

  // Compute direction synchronously during render so PageWrapper always
  // receives the correct value for the current navigation (not the previous one).
  if (prevLocationRef.current !== location) {
    const prevIdx = getNavIndex(prevLocationRef.current);
    const nextIdx = getNavIndex(location);
    if (prevIdx === -1 || nextIdx === -1 || prevIdx === nextIdx) {
      directionRef.current = "none";
    } else if (nextIdx > prevIdx) {
      directionRef.current = "forward";
    } else {
      directionRef.current = "back";
    }
    prevLocationRef.current = location;
  }

  useEffect(() => {
    initAnalyticsConsent();
  }, []);

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
    trackPageView(window.location.pathname, meta.title);
  }, [location]);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="relative flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <PageWrapper key={location} direction={directionRef.current}>
            <Switch location={location}>
              <Route path="/" component={Home} />
              <Route path="/bio" component={Bio} />
              <Route path="/modalities" component={Modalities} />
              <Route path="/partners" component={Partners} />
              <Route path="/gallery" component={Gallery} />
              <Route path="/news" component={News} />
              <Route path="/news/:slug" component={NewsPost} />
              <Route path="/survey" component={Survey} />
              <Route path="/admin/survey" component={SurveyAdmin} />
              <Route component={NotFound} />
            </Switch>
          </PageWrapper>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingCallCta />
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <IntroVisibilityProvider>
            <Router />
          </IntroVisibilityProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
