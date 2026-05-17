import { useState, useEffect, useRef, useCallback, memo } from "react";

const Hero = memo(({ slides: propsSlides = [], stats: propsStats = [], data }) => {

  const videoRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [fadeClass, setFadeClass] = useState("hero-text-enter");
  const [isVideoReady, setIsVideoReady] = useState(false);

  const [hasUserInteracted, setHasUserInteracted] = useState(false);



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

    const interval = setInterval(() => {

      setCurrentSlide((prev) => (prev + 1) % slides.length);

    }, 8000);

    return () => clearInterval(interval);

  }, [slides.length]);



  // Native video preload is used to avoid browser warnings from manual preload links.

  // Handle user interaction to enable video playback

  const handleUserInteraction = useCallback(async () => {

    if (!hasUserInteracted && videoRef.current) {

      setHasUserInteracted(true);
      tryPlayVideo(videoRef.current);

    }

  }, [hasUserInteracted, tryPlayVideo]);



  return (

    <section className="min-h-[100dvh] relative overflow-hidden" aria-label="Homepage hero">

      {/* Initial loading skeleton until the first video frame is ready */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-700 ${
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

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6">
          <div className="mx-auto max-w-6xl space-y-5">
            <div className="h-8 w-48 rounded-full bg-[var(--tw-gray-300)]/40" />
            <div className="h-14 w-full max-w-3xl rounded-xl bg-[var(--tw-gray-200)]/35" />
            <div className="h-6 w-full max-w-2xl rounded-lg bg-[var(--tw-gray-300)]/25" />
          </div>
        </div>
      </div>

      {/* Background Video */}

      <video

        ref={videoRef}
        src={currentVideoSrc}

        autoPlay

        muted

        loop

        playsInline

        preload="auto"
        fetchPriority="high"
        aria-hidden="true"

        className="absolute inset-0 w-full h-full object-cover"

        onLoadedData={() => {
          setIsVideoReady(true);
          tryPlayVideo(videoRef.current);
        }}
        onCanPlay={() => setIsVideoReady(true)}
        onError={() => setIsVideoReady(true)}

      />

      {/* Content */}
      <div
        className="relative z-10 min-h-[100dvh] flex items-center justify-center cursor-pointer"
        onClick={handleUserInteraction}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleUserInteraction()}
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

              <div className="text-center mb-12">

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

            </article>

        </div>

      </div>

    </section>

  );

});

Hero.displayName = "Hero";

export default Hero;

