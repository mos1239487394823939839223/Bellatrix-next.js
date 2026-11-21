import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useCTAModal } from "../contexts/CTAModalContext";
import { useBackgroundVideo } from "../hooks/useBackgroundVideo";
import { VideoSources, getPosterSrc } from "../utils/videoSources";

const Hero = memo(({ slides: propsSlides = [], stats: propsStats = [], data }) => {

  const videoRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [fadeClass, setFadeClass] = useState("hero-text-enter");
  const [isVideoReady, setIsVideoReady] = useState(false);

  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const sectionRef = useRef(null);
  const { openCTAModal } = useCTAModal();
  // Video only after hydration and not for Data Saver / reduced-motion visitors
  const allowVideo = useBackgroundVideo();
  // Placeholder is part of the server HTML (visible from first paint); after
  // hydration it stays only while a video is actually on its way.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // Respect the OS "reduce motion" setting: no auto-advancing slides, no autoplay video
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduceMotion(mq.matches);
      if (mq.matches) setIsPlaying(false);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);



  // PRIORITIZE props data over default data for real-time preview

  const defaultSlides = [

    {

      title: "Strategic Business Transformation",

      subtitle: "Bellatrix Consultancy",

      description:

        "Streamline operations and drive growth with our comprehensive NetSuite solutions.",

      video: "/Videos/implementation/homepage_hero.mp4",

    },

    {

      title: "Digital Optimization Experts",

      subtitle: "Cloud Solutions Specialists",

      description:

        "Enhance productivity with our tailored implementation and consulting services.",

      video: "/Videos/HomeHeroSectionV.mp4",

    },

    {

      title: "Data-Driven Decision Making",

      subtitle: "Business Intelligence Partners",

      description: "Leverage real-time analytics to transform your operations.",

      video: "/Videos/HomeHeroSectionV.mp4",

    },

  ];



  const slides = propsSlides.length > 0 ? propsSlides : (data?.slides?.length > 0 ? data.slides : defaultSlides);
  const stats = propsStats.length > 0 ? propsStats : (data?.stats || []);
  const currentVideoSrc = slides[currentSlide]?.video || "/Videos/implementation/homepage_hero.mp4";
  // Still frame: shown while the video loads, when autoplay is blocked (iOS Low
  // Power Mode) and instead of the video for reduce-motion / Data Saver visitors
  const posterSrc = getPosterSrc(currentVideoSrc);
  const [posterReady, setPosterReady] = useState(false);
  useEffect(() => setPosterReady(false), [posterSrc]);

  // iOS only autoplays inline video that is muted *before* play; set it on the
  // element directly (React doesn't render the muted attribute) and start it
  // as soon as it mounts instead of waiting for loadeddata.
  useEffect(() => {
    const v = videoRef.current;
    if (!allowVideo || !v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [allowVideo, currentVideoSrc]);

  // Play the current video with autoplay-restriction handling
  const tryPlayVideo = useCallback(async (videoEl) => {
    if (!videoEl) return;
    try {
      await videoEl.play();
      setIsPlaying(true);
    } catch (error) {
      if (error.name === "AbortError" || error.name === "NotAllowedError") {
        setIsPlaying(false);
      }
    }
  }, []);

  // Handle video play/pause
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      tryPlayVideo(videoRef.current);
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, tryPlayVideo]);

  // On slide changes: fade the text out/in and wait for the new video's first frame.
  // Skipped on first load — the server-rendered headline is already visible, and
  // hiding it again during hydration caused a visible flash.
  const isFirstSlideRender = useRef(true);
  useEffect(() => {
    if (isFirstSlideRender.current) {
      isFirstSlideRender.current = false;
      return undefined;
    }
    setIsVideoReady(false);
    setFadeClass("hero-text-exit");
    const fadeTimer = setTimeout(() => setFadeClass("hero-text-enter"), 50);

    return () => clearTimeout(fadeTimer);
  }, [currentSlide, currentVideoSrc]);



  // Auto-advance slides

  useEffect(() => {
    if (reduceMotion || slides.length < 2) return undefined;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length, reduceMotion]);

  // CTA copy can be overridden per slide or for the whole hero from the CMS
  const slide = slides[currentSlide] || {};
  const primaryCta = slide.ctaText || data?.ctaText || "Book a free consultation";
  const secondaryCta = slide.secondaryCtaText || data?.secondaryCtaText || "Explore our services";
  const scrollPastHero = () => {
    const next = sectionRef.current?.closest("section[data-theme]")?.nextElementSibling || sectionRef.current?.nextElementSibling;
    if (next && window.__lenis) window.__lenis.scrollTo(next, { offset: -72 });
    else if (next) next.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    else window.scrollBy({ top: window.innerHeight, behavior: reduceMotion ? "auto" : "smooth" });
  };

  // Scroll-linked recede: content drifts up and fades, background slowly zooms
  // (like a camera pulling back). Writes one CSS variable per frame — no re-renders.
  useEffect(() => {
    if (reduceMotion) return undefined;
    const el = sectionRef.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = el.offsetHeight || window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.9)));
      el.style.setProperty("--hero-p", p.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [reduceMotion]);



  // Native video preload is used to avoid browser warnings from manual preload links.

  // Handle user interaction to enable video playback

  const handleUserInteraction = useCallback(async () => {

    if (!hasUserInteracted && videoRef.current) {

      setHasUserInteracted(true);
      tryPlayVideo(videoRef.current);

    }

  }, [hasUserInteracted, tryPlayVideo]);



  return (

    <section ref={sectionRef} className="min-h-[100dvh] relative overflow-hidden" aria-label="Homepage hero">

      {/* Backdrop — always present, server-rendered, never fades out. It is what
          visitors see while the video loads (and permanently when the video is
          skipped), so the hero can never flash white. */}
      {/* Background layers (backdrop → video → network) zoom together on scroll */}
      <div className="absolute inset-0 hero-parallax-bg">
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(37, 99, 235, 0.45) 0%, transparent 60%), linear-gradient(135deg, var(--color-brand-dark, #001038) 0%, var(--color-brand-midnight, #191970) 55%, var(--color-blue-900, #1e3a8a) 100%)",
          }}
        />
        {/* Video placeholder (skeleton): planet-horizon glow where the globe video
            appears, a light sweep, and a thin progress line. Purely decorative —
            the headline and buttons above are real content. Fades out on the
            video's first frame, or right after hydration when video is skipped. */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            !isVideoReady && !posterReady && (!hydrated || allowVideo || posterSrc) ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 hero-placeholder-horizon" />
          <div className="absolute inset-0 hero-loading-shimmer" />
          <div className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-white/10">
            <div className="h-full w-1/3 hero-loading-bar" />
          </div>
        </div>
      </div>

      {/* Background Video */}

      {/* Poster frame (client-only, so it never competes with the server-rendered headline) */}
      {hydrated && posterSrc && (
        <img
          src={posterSrc}
          alt=""
          aria-hidden="true"
          decoding="async"
          onLoad={() => setPosterReady(true)}
          className={`absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-500 ${
            posterReady ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {allowVideo && (
      <video

        ref={videoRef}
        // key: remount (and load the new file) when the slide's video changes
        key={currentVideoSrc}
        poster={posterSrc || undefined}

        autoPlay

        muted

        loop

        playsInline

        preload="auto"
        aria-hidden="true"

        // Invisible until a frame is actually playing, then cross-fades over the backdrop
        className={`absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
          isVideoReady ? "opacity-100" : "opacity-0"
        }`}

        onLoadedData={() => {
          if (!reduceMotion) tryPlayVideo(videoRef.current);
        }}
        // "playing" = a real frame is being shown. Not "error": on desktop the phone
        // <source> is skipped with an error event, which used to fade out the backdrop
        // early and leave the hero white until the video arrived.
        onPlaying={() => setIsVideoReady(true)}

      >
        <VideoSources src={currentVideoSrc} />
      </video>
      )}

      {/* Aurora light drifting across the sky + cinematic vignette (CSS only) */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="hero-aurora hero-aurora-a" />
        <div className="hero-aurora hero-aurora-b" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none hero-vignette" />
      {/* Bottom fade so the next section starts cleanly */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 z-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 min-h-[100dvh] flex items-center justify-center pt-20 pb-12"
        onPointerDown={reduceMotion ? undefined : handleUserInteraction}
      >

        <div className="w-full max-w-6xl mx-auto px-6 hero-parallax-content">

            {/* hero-intro: staggered CSS entrance from first paint (no JS gate) */}
            <article className={`hero-text-transition hero-intro ${fadeClass}`}>

              {/* Subtitle */}

              <header className="text-center mb-4">

                <span className="inline-block text-[var(--color-white)]/90 text-sm sm:text-base font-semibold letter-spacing-wider mb-2 px-4 py-2 bg-[var(--color-white)]/10 rounded-full backdrop-blur-sm border border-[var(--color-white)]/20">

                  {slides[currentSlide].subtitle}

                </span>

              </header>



              {/* Main Heading */}

              <div className="text-center mb-8">

                <h1
                  className="font-bold leading-tight text-[var(--color-white)]"
                  style={{
                    fontSize: 'clamp(1.75rem, 5vw + 0.5rem, 4.5rem)',
                    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  }}
                >

                  {slides[currentSlide].title}

                </h1>

              </div>



              {/* Description */}

              <div className="text-center mb-10">

                <p
                  className="text-[var(--color-text-light)] leading-relaxed max-w-4xl mx-auto"
                  style={{
                    fontSize: 'clamp(1rem, 1.5vw + 0.5rem, 1.5rem)',
                    textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                  }}
                >

                  {slides[currentSlide].description}

                </p>

              </div>

              {/* Calls to action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
                <button
                  type="button"
                  data-no-cta-intercept
                  onClick={() => openCTAModal({ title: "Book a free consultation", subtitle: "Tell us about your business and an ERP consultant will get back to you within 24 hours." })}
                  className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-black/30 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                  style={{ minHeight: 48 }}
                >
                  {primaryCta}
                  <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                <button
                  type="button"
                  data-no-cta-intercept
                  onClick={scrollPastHero}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white border border-white/60 bg-black/45 backdrop-blur-md transition-colors duration-200 hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ minHeight: 48 }}
                >
                  {secondaryCta}
                </button>
              </div>

            </article>

        </div>

      </div>

      {/* Scroll cue (wrapper handles position + parallax; button stays untransformed) */}
      <div className="hero-parallax-content absolute bottom-7 inset-x-0 z-10 hidden sm:flex justify-center pointer-events-none">
        <button
          type="button"
          data-no-cta-intercept
          onClick={scrollPastHero}
          aria-label="Scroll to the next section"
          className="pointer-events-auto flex flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-2 py-1"
        >
          <span>Scroll to explore</span>
          <span className="scroll-cue-line" aria-hidden="true" />
        </button>
      </div>

    </section>

  );

});

Hero.displayName = "Hero";

export default Hero;

