import { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Phone } from "lucide-react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { useIntroVisibility } from "@/components/intro/IntroVisibilityContext";
import barnFinalFrame from "@assets/barn-door-intro-final-frame.jpg?w=640;1024;1600;2400&picture";
import barnFirstFrameFallback from "@assets/barn-door-intro-first-frame.jpg";

const barnVideoSrc = "/api/storage/public-objects/barn-door-intro-web.mp4";
// 80×45 px LQIP (405 bytes) — hardcoded so it's in the JS bundle with
// zero additional network requests. Shown as a blurred background the instant
// the component mounts, before any image or video fetch completes.
const BARN_LQIP = "data:image/jpeg;base64,/9j//gAQTGF2YzYwLjMxLjEwMgD/2wBDAAg+Pkk+SVVVVVVVVWRdZGhoaGRkZGRoaGhwcHCDg4NwcHBoaHBwfHyDg4+Tj4eHg4eTk5ubm7q6srLZ2eD/////xABiAAADAQEBAQEAAAAAAAAAAAAFBgQDAgEABwEBAQEBAAAAAAAAAAAAAAAAAwIBABAAAgEEAgIDAQAAAAAAAAAAAAEREiExAkEDgXFhUTKREQEAAAAAAAAAAAAAAAAAAAAA/8AAEQgALQBQAwEiAAIRAAMRAP/aAAwDAQACEQMRAD8A/BSxGcHcBkHP0vkmSg71wwzFRCwiDqkdtEpUx5Znur8eDmkpqYKvyvkItU+4Am2EY4GMCqJPoEGaOtJ76p4kKduq12hYFJSErkKbQhppSWcSKeApCzcEy6XVBvsqXlP+gBXaj7Gul1uU+Q1lhoEOyHZ6q+bOBaiecCje9SW26TNOxKvZLEgSh/Z4lHscKUvkCFhqVHIyoAJSGgyDisFKmLcnchEat5FhO7DYEaLSpBTOCRiDf//Z";

const TRACK_HEIGHT_VH = 350;
const NAV_REVEAL_AT = 0.92;

export function BarnDoorIntro() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingTimeRef = useRef<number | null>(null);
  const posterImgRef = useRef<HTMLImageElement | null>(null);
  const { setIntroActive, setNavRevealed } = useIntroVisibility();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Beat 1: visible from the very start, fades by 40%
  const beat1Opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.3, 0.4],
    [1, 1, 1, 0],
  );
  const beat1Y = useTransform(scrollYProgress, [0, 0.4], [0, -10]);

  // Beat 2: ~38–62% peak
  const beat2Opacity = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.6, 0.7],
    [0, 1, 1, 0],
  );
  const beat2Y = useTransform(scrollYProgress, [0.34, 0.7], [12, -10]);

  // Beat 3 (final brand mark): appears ~70% and HOLDS
  const beat3Opacity = useTransform(
    scrollYProgress,
    [0.66, 0.82, 1],
    [0, 1, 1],
  );
  const beat3Y = useTransform(scrollYProgress, [0.66, 0.92], [16, 0]);

  // Subtle vignette intensifies at the end so text reads on the final frame
  const vignetteOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [0.25, 0.35, 0.55],
  );

  // Mark intro as active for navbar hiding
  useEffect(() => {
    if (reduce) {
      // No scroll-scrub: navbar stays visible.
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

  // Native scroll handler — drives video seek + navbar reveal.
  // A direct window "scroll" listener is more reliable than FM12 motion-value
  // change callbacks when the page runs inside an iframe (Replit preview pane,
  // canvas embed), where compositor-thread timing can cause FM12 change events
  // to lag or be skipped.
  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    const trackH = el.offsetHeight; // ≈ TRACK_HEIGHT_VH * viewH
    // progress: 0 when trackRef top == viewport top
    //           1 when trackRef bottom == viewport bottom
    const progress = Math.max(0, Math.min(1, -rect.top / (trackH - viewH)));

    // Navbar reveal
    setNavRevealed(progress >= NAV_REVEAL_AT);

    // Video seek — coalesced via rAF to avoid thrashing the media decoder
    const video = videoRef.current;
    if (!video) return;
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!duration) return;
    // t=0 of the trimmed clip is still a brief dark fade-in; the barn is
    // fully visible at t=0.5s.  Map scroll progress 0→1 onto 0.5s→end so
    // the first frame the user ever sees is the lit barn interior.
    const FIRST_VISIBLE_T = 0.5;
    const target = FIRST_VISIBLE_T + progress * (duration - FIRST_VISIBLE_T);
    if (Math.abs(video.currentTime - target) < 0.016) return; // sub-frame, skip
    pendingTimeRef.current = target;
    if (rafRef.current != null) return; // rAF already pending, it will pick up the latest pendingTime
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const t = pendingTimeRef.current;
      pendingTimeRef.current = null;
      if (t == null) return;
      const vid = videoRef.current;
      if (!vid) return;
      if (Math.abs(vid.currentTime - t) < 0.016) return;
      try {
        vid.currentTime = t;
      } catch {
        /* ignore seek errors during teardown */
      }
    });
  }, [setNavRevealed]);

  useEffect(() => {
    if (reduce) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // sync immediately in case the page already has scroll offset
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [reduce, handleScroll]);

  // ---------- Reduced motion: static composition, no scroll spacer ----------
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

  // ---------- Full scroll-scrubbed cinematic intro ----------
  return (
    <div
      ref={trackRef}
      className="relative w-full bg-black"
      style={{
        // Pull the track up by the navbar height (h-20 = 5rem) so the sticky
        // video panel covers the full viewport from y=0 immediately, with no
        // black gap at the top. Height is extended by the same amount so the
        // total scroll distance stays the same.
        marginTop: "-5rem",
        height: `calc(${TRACK_HEIGHT_VH}vh + 5rem)`,
      }}
      data-testid="barn-door-intro"
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{
          backgroundImage: `url(${BARN_LQIP})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Video layer */}
        <video
          ref={videoRef}
          src={barnVideoSrc}
          poster={barnFirstFrameFallback}
          muted
          playsInline
          autoPlay={false}
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          onLoadedMetadata={(e) => {
            // Seek to the first fully-visible frame (matches the poster).
            // t=0 is a brief dark fade-in; 0.5s is the first barn frame.
            // We hide the poster overlay only once the seek completes so there
            // is never a black flash between "poster removed" and "frame ready".
            try {
              const vid = e.currentTarget;
              const onSeeked = () => {
                vid.removeEventListener("seeked", onSeeked);
                if (posterImgRef.current) {
                  posterImgRef.current.style.opacity = "0";
                }
              };
              vid.addEventListener("seeked", onSeeked);
              vid.currentTime = 0.5;
            } catch {
              /* ignore */
            }
          }}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ backgroundColor: "transparent" }}
        />

        {/* Poster overlay — visible until the initial seek to t=0.5 completes.
            Sits above the video element so the browser's black "seeking" frame
            is never exposed; fades out once the seeked event fires. */}
        <img
          ref={posterImgRef}
          src={barnFirstFrameFallback}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: 1 }}
        />

        {/* Cinematic vignette on top of the video */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: vignetteOpacity }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40"
        />

        {/* Beat 1 */}
        <motion.div
          style={{ opacity: beat1Opacity, y: beat1Y }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center will-change-transform"
        >
          <p className="text-[0.65rem] sm:text-[0.7rem] font-sans tracking-[0.32em] text-white/85 uppercase mb-5"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
            Susie H. Lytal, MS · Equine Biomechanist
          </p>
          <span className="block mx-auto mb-6 gold-rule" aria-hidden="true" />
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white leading-[1.05] tracking-tight max-w-4xl"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.95)" }}>
            For the horses
            <span className="block italic text-accent/90">you love most.</span>
          </h2>
        </motion.div>

        {/* Beat 2 */}
        <motion.div
          style={{ opacity: beat2Opacity, y: beat2Y }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center will-change-transform"
        >
          <span className="block mx-auto mb-6 gold-rule" aria-hidden="true" />
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white leading-[1.08] tracking-tight max-w-4xl"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.95)" }}>
            Graduate-level biomechanics.
            <span className="block italic text-accent/90 mt-1">
              Hands that listen.
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-base md:text-lg text-white/80 font-light leading-relaxed"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
            Wellness sessions in partnership with your veterinarian — grounded
            in science, delivered with compassion.
          </p>
        </motion.div>

        {/* Beat 3 — final brand mark, holds on the last frame */}
        <motion.div
          style={{ opacity: beat3Opacity, y: beat3Y }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center will-change-transform"
        >
          <p className="text-[0.65rem] sm:text-[0.7rem] font-sans tracking-[0.32em] text-white/85 uppercase mb-5"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
            Welcome
          </p>
          <span className="block mx-auto mb-6 gold-rule" aria-hidden="true" />
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-white leading-[1.02] tracking-tight max-w-5xl"
            style={{ textShadow: "0 2px 32px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.95)" }}>
            Equine Bodywork
            <span className="block italic text-gold-gradient">
              & Wellness Consulting
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg text-white/85 font-light leading-relaxed"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
            Sports massage, PEMF, red light, cold laser, TENS, and TECAR —
            tailored to your horse.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
        </motion.div>

        {/* Scroll hint visible only at the very start */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.06], [1, 0]),
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.6rem] font-sans tracking-[0.32em] text-white/85 uppercase"
        >
          Scroll
        </motion.div>
      </div>
    </div>
  );
}
