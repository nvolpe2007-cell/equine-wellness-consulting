import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Home from "@/pages/home";
import Bio from "@/pages/bio";
import Modalities from "@/pages/modalities";
import Partners from "@/pages/partners";
import Gallery from "@/pages/gallery";
import News from "@/pages/news";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const titles: Record<string, string> = {
  "/": "Equine Bodywork and Wellness Consulting | Susie H. Lytal, MS",
  "/bio": "About Susie H. Lytal, MS — Equine Biomechanist",
  "/modalities": "Wellness Modalities for Horses — Sports Massage, PEMF, Red Light & More",
  "/gallery": "Gallery — Sessions in the Barn Aisle",
  "/partners": "Trusted Partners — Magnawave, RevitaVet, TrueStim, BeneFab",
  "/news": "The Worthy Horse News — Newsletter for Thoughtful Horse Owners",
};

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
    document.title = titles[location] ?? titles["/"];
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
              <Route component={NotFound} />
            </Switch>
          </PageWrapper>
        </AnimatePresence>
      </main>
      <Footer />
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
