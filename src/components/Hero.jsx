import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useCTAModal } from "../contexts/CTAModalContext";
import { useBackgroundVideo } from "../hooks/useBackgroundVideo";
import { VideoSources } from "../utils/videoSources";

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

  // Trigger text fade and reset skeleton when slide media changes
  useEffect(() => {
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
    if (next) next.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    else window.scrollBy({ top: window.innerHeight, behavior: reduceMotion ? "auto" : "smooth" });
  };



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

      {/* Initial loading skeleton until the first video frame is ready */}
      <div
        aria-hidden="true"
        // Background layer (below the headline): branded gradient while the video
        // loads, and the permanent backdrop when video is skipped
        className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ${
          isVideoReady ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-brand-dark) 0%, var(--color-brand-midnight) 55%, var(--color-blue-900) 100%)",
          }}
        />
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.03),rgba(255,255,255,0.1),rgba(255,255,255,0.03))]" />

      </div>

      {/* Background Video */}

      {allowVideo && (
      <video

        ref={videoRef}
        // key: remount (and load the new file) when the slide's video changes
        key={currentVideoSrc}

        autoPlay

        muted

        loop

        playsInline

        preload="auto"
        aria-hidden="true"

        className="absolute inset-0 z-0 w-full h-full object-cover"

        onLoadedData={() => {
          setIsVideoReady(true);
          if (!reduceMotion) tryPlayVideo(videoRef.current);
        }}
        onCanPlay={() => setIsVideoReady(true)}
        onError={() => setIsVideoReady(true)}

      >
        <VideoSources src={currentVideoSrc} />
      </video>
      )}

      {/* Content */}
      <div
        className="relative z-10 min-h-[100dvh] flex items-center justify-center pt-20 pb-12"
        onPointerDown={reduceMotion ? undefined : handleUserInteraction}
      >

        <div className="w-full max-w-6xl mx-auto px-6">

            <article className={`hero-text-transition ${fadeClass}`}>

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

    </section>

  );

});

Hero.displayName = "Hero";

export default Hero;

