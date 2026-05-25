import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronDown, Phone } from "lucide-react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { useIntroVisibility } from "@/components/intro/IntroVisibilityContext";
import barnFinalFrame from "@assets/barn-door-intro-final-frame.jpg?w=640;1024;1600;2400&picture";

const barnVideoSrc = "/api/storage/public-objects/barn-door-intro-web.mp4";
const BARN_LQIP = "data:image/jpeg;base64,/9j//gAQTGF2YzYwLjMxLjEwMgD/2wBDAAg+Pkk+SVVVVVVVVWRdZGhoaGRkZGRoaGhwcHCDg4NwcHBoaHBwfHyDg4+Tj4eHg4eTk5ubm7q6srLZ2eD/////xABiAAADAQEBAQEAAAAAAAAAAAAFBgQDAgEABwEBAQEBAAAAAAAAAAAAAAAAAwIBABAAAgEEAgIDAQAAAAAAAAAAAAEREiExAkEDgXFhUTKREQEAAAAAAAAAAAAAAAAAAAAA/8AAEQgALQBQAwEiAAIRAAMRAP/aAAwDAQACEQMRAD8A/BSxGcHcBkHP0vkmSg71wwzFRCwiDqkdtEpUx5Znur8eDmkpqYKvyvkItU+4Am2EY4GMCqJPoEGaOtJ76p4kKduq12hYFJSErkKbQhppSWcSKeApCzcEy6XVBvsqXlP+gBXaj7Gul1uU+Q1lhoEOyHZ6q+bOBaiecCje9SW26TNOxKvZLEgSh/Z4lHscKUvkCFhqVHIyoAJSGgyDisFKmLcnchEat5FhO7DYEaLSpBTOCRiDf//Z";

const NAV_REVEAL_AT = 0.92;

const TEXT_SHADOW_BODY = "0 1px 8px rgba(0,0,0,0.9)";
const TEXT_SHADOW_HEAD = "0 2px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.95)";
const TEXT_SHADOW_HERO = "0 2px 32px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.95)";
const TEXT_SHADOW_PARA = "0 1px 12px rgba(0,0,0,0.9)";

export function BarnDoorIntro() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingTimeRef = useRef<number | null>(null);
  const posterImgRef = useRef<HTMLImageElement | null>(null);
  const { setIntroActive, setNavRevealed } = useIntroVisibility();
  const [showSkip, setShowSkip] = useState(false);

  // Responsive values — slide distance and track height change at md breakpoint
  const isMd = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
  const [slidePx, setSlidePx] = useState<number>(() => (isMd ? 60 : 30));
  const [trackHeightVh, setTrackHeightVh] = useState<number>(() => (isMd ? 450 : 300));
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent) => {
      setSlidePx(e.matches ? 60 : 30);
      setTrackHeightVh(e.matches ? 450 : 300);
    };
    mq.addEventListener("change", update);
    setSlidePx(mq.matches ? 60 : 30);
    setTrackHeightVh(mq.matches ? 450 : 300);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Spring-smoothed progress — gives the "heavy" cinematic inertia feel.
  // Text animations lag slightly behind scroll then ease into place.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    mass: 1.8,
    restDelta: 0.0005,
  });

  // Video parallax: subtle pull-in scale
  const videoScale = useTransform(smoothProgress, [0, 1], [1.0, 1.06]);

  // ── Beat 1 (0–28%): left-anchored ──────────────────────────────────────────
  const beat1Opacity = useTransform(smoothProgress, [0, 0.04, 0.22, 0.28], [1, 1, 1, 0]);
  const beat1Y = useTransform(smoothProgress, [0, 0.28], [0, -10]);
  const beat1HeadX = useTransform(smoothProgress, [0.10, 0.28], reduce ? [0, 0] : [0, -slidePx * 0.5]);
  const beat1ItalicX = useTransform(smoothProgress, [0.10, 0.28], reduce ? [0, 0] : [0, slidePx * 0.5]);

  // ── Beat 2 (28–54%): right-offset ──────────────────────────────────────────
  const beat2Opacity = useTransform(smoothProgress, [0.28, 0.34, 0.50, 0.54], [0, 1, 1, 0]);
  const beat2Y = useTransform(smoothProgress, [0.28, 0.54], [12, -8]);
  const beat2HeadX = useTransform(smoothProgress, [0.28, 0.38], reduce ? [0, 0] : [slidePx, 0]);
  const beat2BodyX = useTransform(smoothProgress, [0.30, 0.40], reduce ? [0, 0] : [-slidePx, 0]);

  // ── Beat 3 (54–76%): collision ─────────────────────────────────────────────
  const beat3Opacity = useTransform(smoothProgress, [0.54, 0.60, 0.72, 0.76], [0, 1, 1, 0]);
  const beat3Y = useTransform(smoothProgress, [0.54, 0.76], [10, -8]);
  const beat3LeftX = useTransform(smoothProgress, [0.54, 0.65], reduce ? [0, 0] : [-slidePx, 0]);
  const beat3RightX = useTransform(smoothProgress, [0.54, 0.65], reduce ? [0, 0] : [slidePx, 0]);

  // ── Beat 4 (76–100%): staggered brand mark ─────────────────────────────────
  const beat4ContainerOpacity = useTransform(smoothProgress, [0.76, 0.84, 1], [0, 1, 1]);
  const beat4EyebrowOpacity = useTransform(smoothProgress, [0.76, 0.82], [0, 1]);
  const beat4EyebrowY = useTransform(smoothProgress, [0.76, 0.84], [16, 0]);
  const beat4RuleOpacity = useTransform(smoothProgress, [0.78, 0.84], [0, 1]);
  const beat4RuleY = useTransform(smoothProgress, [0.78, 0.86], [16, 0]);
  const beat4H1Line1Opacity = useTransform(smoothProgress, [0.80, 0.86], [0, 1]);
  const beat4H1Line1Y = useTransform(smoothProgress, [0.80, 0.88], [16, 0]);
  const beat4H1Line2Opacity = useTransform(smoothProgress, [0.82, 0.88], [0, 1]);
  const beat4H1Line2Y = useTransform(smoothProgress, [0.82, 0.90], [16, 0]);
  const beat4ParaOpacity = useTransform(smoothProgress, [0.84, 0.90], [0, 1]);
  const beat4ParaY = useTransform(smoothProgress, [0.84, 0.92], [16, 0]);
  const beat4ButtonsOpacity = useTransform(smoothProgress, [0.86, 0.94], [0, 1]);
  const beat4ButtonsY = useTransform(smoothProgress, [0.86, 0.96], [20, 0]);

  const vignetteOpacity = useTransform(smoothProgress, [0, 0.7, 1], [0.25, 0.35, 0.55]);
  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  // Helper: fade out the LQIP overlay
  const clearLqip = useCallback(() => {
    if (posterImgRef.current) {
      posterImgRef.current.style.opacity = "0";
    }
  }, []);

  // Fallback: clear LQIP overlay after 2s in case static image / video seek never fires
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(clearLqip, 2000);
    return () => window.clearTimeout(t);
  }, [reduce, clearLqip]);

  // Skip link: fade in after 4s only if user is still near the top (< 5% scrolled)
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => {
      if (scrollYProgress.get() <= 0.05) setShowSkip(true);
    }, 4000);
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.05) setShowSkip(false);
    });
    return () => {
      window.clearTimeout(t);
      unsub();
    };
  }, [reduce, scrollYProgress]);

  // Mark intro as active for navbar hiding
  useEffect(() => {
    if (reduce) {
      setIntroActive(false);
      setNavRevealed(true);
      return;
    }
    setIntroActive(true);
    return () => {
      setIntroActive(false);
      setNavRevealed(true);
    };
  }, [reduce, setIntroActive, setNavRevealed]);

  // Scroll handler — updates target time + navbar reveal on all devices.
  // The actual seek happens in a continuous RAF lerp loop so the video
  // scrubs smoothly rather than jumping frame-to-frame on each scroll event.
  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    const trackH = el.offsetHeight;
    const progress = Math.max(0, Math.min(1, -rect.top / (trackH - viewH)));
    setNavRevealed(progress >= NAV_REVEAL_AT);

    const video = videoRef.current;
    if (!video) return;
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!duration) return;
    const FIRST_VISIBLE_T = 0.5;
    pendingTimeRef.current = FIRST_VISIBLE_T + progress * (duration - FIRST_VISIBLE_T);

    // Kick off the lerp loop if it isn't already running
    if (rafRef.current != null) return;
    const LERP = 0.12; // closes ~12% of the gap per 60fps frame
    const step = () => {
      const vid = videoRef.current;
      const target = pendingTimeRef.current;
      if (!vid || target === null) { rafRef.current = null; return; }
      const diff = target - vid.currentTime;
      if (Math.abs(diff) < 0.012) {
        try { vid.currentTime = target; } catch { /* ignore */ }
        rafRef.current = null;
        return;
      }
      try { vid.currentTime = vid.currentTime + diff * LERP; } catch { /* ignore */ }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [setNavRevealed]);

  useEffect(() => {
    if (reduce) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current != null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, [reduce, handleScroll]);

  // ── Reduced motion: static composition ──────────────────────────────────────
  if (reduce) {
    return (
      <section className="relative h-screen min-h-[760px] w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <ResponsiveImage
            image={barnFinalFrame}
            alt="Through the open barn doors — entering the aisle where Susie performs equine bodywork"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            pictureClassName="block w-full h-full"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/65" />
        </div>
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <p className="text-[0.7rem] font-sans tracking-[0.28em] text-white/85 uppercase mb-5">
            Susie H. Lytal, MS · Equine Biomechanist
          </p>
          <span className="block mx-auto mb-6 gold-rule" aria-hidden="true" />
          <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.05] tracking-tight">
            <span className="block">For the horses you love most.</span>
            <span className="block italic text-accent/90 mt-2">
              Equine Bodywork & Wellness Consulting
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/85 font-light leading-relaxed">
            Graduate-level biomechanics. Hands that listen.
          </p>
          <a
            href="tel:+13104884389"
            className="mt-10 bg-gold-metallic shadow-gold-glow inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-medium hover:shadow-gold-glow-lg"
            data-testid="link-intro-call"
          >
            <Phone className="h-4 w-4" />
            (310) 488-4389
          </a>
        </div>
      </section>
    );
  }

  // ── Full scroll-scrubbed cinematic intro ────────────────────────────────────
  return (
    <div
      ref={trackRef}
      className="relative w-full bg-black"
      style={{ marginTop: "-5rem", height: `calc(${trackHeightVh}vh + 5rem)` }}
      data-testid="barn-door-intro"
    >
      <div className="sticky top-0 h-screen h-svh w-full overflow-hidden bg-black">

        {/* High-quality static fallback — always visible under the video */}
        <div className="absolute inset-0">
          <ResponsiveImage
            image={barnFinalFrame}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            pictureClassName="block w-full h-full"
            className="w-full h-full object-cover"
            onLoad={clearLqip}
          />
        </div>

        {/* Video layer with parallax scale */}
        <motion.div
          style={{ scale: videoScale }}
          className="absolute inset-0 will-change-transform"
        >
          <video
            ref={videoRef}
            src={barnVideoSrc}
            muted
            playsInline
            autoPlay={false}
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            onLoadedMetadata={(e) => {
              try {
                const vid = e.currentTarget;
                const onSeeked = () => {
                  vid.removeEventListener("seeked", onSeeked);
                  clearLqip();
                };
                vid.addEventListener("seeked", onSeeked);
                vid.currentTime = 0.5;
              } catch { /* ignore */ }
            }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ backgroundColor: "transparent" }}
          />
        </motion.div>

        {/* LQIP overlay — shows instantly on mount, cleared by seek or 2s timeout */}
        <img
          ref={posterImgRef}
          src={BARN_LQIP}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 1, transition: "opacity 0.6s" }}
        />

        {/* Cinematic vignette */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: vignetteOpacity }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40"
        />

        {/* Beat 4 scrim — darkens center band as the brand mark fades in */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: beat4ContainerOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/28 via-black/60 to-black/28 will-change-transform"
        />

        {/* ── Beat 1: left-anchored ── */}
        <motion.div
          style={{ opacity: beat1Opacity, y: beat1Y }}
          className="absolute inset-0 grid grid-cols-12 items-center will-change-transform px-6 md:px-16 lg:px-24"
        >
          <div className="col-span-12 md:col-span-7 md:col-start-1">
            <motion.p
              style={{ x: beat1HeadX, textShadow: TEXT_SHADOW_BODY }}
              className="text-[0.65rem] sm:text-[0.7rem] font-sans tracking-[0.32em] text-white/85 uppercase mb-5 will-change-transform"
            >
              Susie H. Lytal, MS · Equine Biomechanist
            </motion.p>
            <motion.span
              style={{ x: beat1HeadX }}
              className="block mb-6 gold-rule will-change-transform"
              aria-hidden="true"
            />
            <motion.div
              style={{ x: beat1HeadX, textShadow: TEXT_SHADOW_HEAD }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.05] tracking-tight will-change-transform"
            >
              For the horses
            </motion.div>
            <motion.div
              style={{ x: beat1ItalicX, textShadow: TEXT_SHADOW_HEAD }}
              className="italic text-accent/90 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.05] tracking-tight will-change-transform"
            >
              you love most.
            </motion.div>
          </div>
        </motion.div>

        {/* ── Beat 2: right-anchored ── */}
        <motion.div
          style={{ opacity: beat2Opacity, y: beat2Y }}
          className="absolute inset-0 grid grid-cols-12 items-center will-change-transform px-6 md:px-16 lg:px-24"
        >
          <div className="col-span-12 md:col-span-8 md:col-start-5 text-center md:text-right">
            <motion.span
              style={{ x: beat2HeadX }}
              className="block mb-6 gold-rule mx-auto md:ml-auto will-change-transform"
              aria-hidden="true"
            />
            <motion.div
              style={{ x: beat2HeadX, textShadow: TEXT_SHADOW_HEAD }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.08] tracking-tight will-change-transform"
            >
              Graduate-level biomechanics.
              <span className="block italic text-accent/90 mt-1">
                Hands that listen.
              </span>
            </motion.div>
            <motion.p
              style={{ x: beat2BodyX, textShadow: TEXT_SHADOW_PARA }}
              className="mt-6 max-w-lg text-base md:text-lg text-white/80 font-light leading-relaxed will-change-transform mx-auto md:ml-auto"
            >
              Wellness sessions in partnership with your veterinarian — grounded
              in science, delivered with compassion.
            </motion.p>
          </div>
        </motion.div>

        {/* ── Beat 3: collision ── */}
        <motion.div
          style={{ opacity: beat3Opacity, y: beat3Y }}
          className="absolute inset-0 flex items-center justify-center will-change-transform px-6"
        >
          <div className="text-center" aria-label="Where science meets the horse.">
            <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-0">
              <motion.span
                style={{ x: beat3LeftX }}
                className="inline-block font-serif text-white leading-[1.0] tracking-tight will-change-transform"
              >
                <span style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", textShadow: TEXT_SHADOW_HERO, display: "block" }}>
                  Where science
                </span>
              </motion.span>
              <motion.span
                style={{ x: beat3RightX }}
                className="inline-block font-serif italic text-gold-gradient leading-[1.0] tracking-tight will-change-transform"
              >
                <span style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", display: "block" }}>
                  meets the horse.
                </span>
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* ── Beat 4: final brand mark ── */}
        <motion.div
          style={{ opacity: beat4ContainerOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center translate-y-24 will-change-transform"
        >
          <motion.p
            style={{ opacity: beat4EyebrowOpacity, y: beat4EyebrowY, textShadow: TEXT_SHADOW_BODY }}
            className="text-[0.65rem] sm:text-[0.7rem] font-sans tracking-[0.32em] text-white/85 uppercase mb-5 will-change-transform"
          >
            Welcome
          </motion.p>

          <motion.span
            aria-hidden="true"
            style={{ opacity: beat4RuleOpacity, y: beat4RuleY }}
            className="block mx-auto mb-6 gold-rule will-change-transform"
          />

          <h1
            className="font-serif text-white leading-[1.02] tracking-tight max-w-5xl"
            style={{ fontSize: "clamp(2.75rem, 8vw, 6.5rem)" }}
          >
            <motion.span
              style={{ opacity: beat4H1Line1Opacity, y: beat4H1Line1Y, textShadow: TEXT_SHADOW_HERO }}
              className="block will-change-transform"
            >
              Equine Bodywork
            </motion.span>
            <motion.span
              style={{ opacity: beat4H1Line2Opacity, y: beat4H1Line2Y }}
              className="block italic text-gold-gradient will-change-transform"
            >
              & Wellness Consulting
            </motion.span>
          </h1>

          <motion.p
            style={{ opacity: beat4ParaOpacity, y: beat4ParaY, textShadow: TEXT_SHADOW_PARA }}
            className="mt-6 max-w-2xl text-base md:text-lg text-white/85 font-light leading-relaxed will-change-transform"
          >
            Sports massage, PEMF, red light, cold laser, TENS, and TECAR —
            tailored to your horse.
          </motion.p>

          <motion.div
            style={{ opacity: beat4ButtonsOpacity, y: beat4ButtonsY }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 will-change-transform"
          >
            <a
              href="tel:+13104884389"
              className="bg-gold-metallic shadow-gold-glow inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-medium hover:shadow-gold-glow-lg"
              data-testid="link-intro-call"
            >
              <Phone className="h-4 w-4" />
              (310) 488-4389
            </a>
            <a
              href="#after-intro"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 px-8 text-base font-medium text-white backdrop-blur-md hover:bg-white/20 border border-white/20"
              data-testid="link-intro-continue"
            >
              Continue
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll hint — animated bouncing chevron */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: scrollHintOpacity }}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-[0.6rem] font-sans tracking-[0.3em] text-white/70 uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-white/60" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Skip intro — fades in after 4s for slow connections */}
        <a
          href="#after-intro"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[0.6rem] font-sans tracking-[0.3em] text-white/60 uppercase hover:text-white/90 transition-colors"
          style={{
            opacity: showSkip ? 1 : 0,
            transition: "opacity 0.8s",
            pointerEvents: showSkip ? "auto" : "none",
          }}
          aria-label="Skip intro"
        >
          Skip intro
          <ChevronDown className="h-3.5 w-3.5 -rotate-90" strokeWidth={1.5} />
        </a>
      </div>
    </div>
  );
}
