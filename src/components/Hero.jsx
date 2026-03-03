import { useState, useEffect, useRef, useCallback, memo } from "react";

import SEO from "./SEO";

const Hero = memo(({ slides: propsSlides = [], stats: propsStats = [], data }) => {

  const videoRef = useRef(null);
  const prevVideoRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [fadeClass, setFadeClass] = useState("hero-text-enter");

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

  // When slide changes, load new video source and trigger text fade
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // CSS fade transition for text
    setFadeClass("hero-text-exit");
    const fadeTimer = setTimeout(() => setFadeClass("hero-text-enter"), 50);

    // Only reload video if the src actually changed
    const newSrc = slides[currentSlide]?.video;
    if (prevVideoRef.current !== newSrc) {
      prevVideoRef.current = newSrc;
      video.src = newSrc;
      video.load();
      tryPlayVideo(video);
    }

    return () => clearTimeout(fadeTimer);
  }, [currentSlide, slides, tryPlayVideo]);



  // Auto-advance slides

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentSlide((prev) => (prev + 1) % slides.length);

    }, 8000);

    return () => clearInterval(interval);

  }, [slides.length]);



  // Prefetch next slide video after current one is playing
  useEffect(() => {
    if (!videoLoaded) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    const nextVideoUrl = slides[nextIndex]?.video;
    if (nextVideoUrl && nextVideoUrl !== slides[currentSlide]?.video) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "video";
      link.href = nextVideoUrl;
      document.head.appendChild(link);
      return () => { try { document.head.removeChild(link); } catch {} };
    }
  }, [videoLoaded, currentSlide, slides]);

  // Handle user interaction to enable video playback

  const handleUserInteraction = useCallback(async () => {

    if (!hasUserInteracted && videoRef.current) {

      setHasUserInteracted(true);
      tryPlayVideo(videoRef.current);

    }

  }, [hasUserInteracted, tryPlayVideo]);



  return (

    <main className="min-h-[100dvh] relative overflow-hidden">

      <SEO

        title="Strategic Business Transformation | Bellatrix Bellatrix Solutions"

        description="Drive business growth with Bellatrix's strategic Bellatrix transformation services. Expert implementation, optimization, and data-driven solutions."

        keywords="business transformation, Bellatrix implementation, digital optimization, cloud solutions, business intelligence, ERP consulting"

        ogTitle="Strategic Business Transformation | Bellatrix NetSuite Solutions"

        ogDescription="Transform your business operations with our comprehensive Bellatrix solutions and expert consulting services."

        ogImage="/images/business-transformation-hero.jpg"

        twitterCard="summary_large_image"

      />

      {/* Dark gradient background visible instantly while video loads */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 transition-opacity duration-700"
        style={{ opacity: videoLoaded ? 0 : 1, zIndex: 1 }}
        aria-hidden="true"
      />

      {/* Background Video — preload=metadata to avoid downloading entire file */}

      <video

        ref={videoRef}

        autoPlay

        muted

        loop

        playsInline

        preload="metadata"
        fetchpriority="high"

        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? "opacity-100" : "opacity-0"}`}

        onCanPlayThrough={() => setVideoLoaded(true)}

        onLoadedData={() => {
          setVideoLoaded(true);
          tryPlayVideo(videoRef.current);
        }}

      />

      {/* Content */}
      <section
        className="relative z-10 min-h-[100dvh] flex items-center justify-center cursor-pointer"
        onClick={handleUserInteraction}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleUserInteraction()}
      >

        <div className="w-full max-w-6xl mx-auto px-6">

            <article className={`hero-text-transition ${fadeClass}`}>

              {/* Subtitle */}

              <header className="text-center mb-4">

                <span className="inline-block text-[var(--color-white)]/90 text-sm md:text-base font-semibold letter-spacing-wider mb-2 px-4 py-2 bg-[var(--color-white)]/10 rounded-full backdrop-blur-sm border border-[var(--color-white)]/20">

                  {slides[currentSlide].subtitle}

                </span>

              </header>



              {/* Main Heading */}

              <div className="text-center mb-8">

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-[var(--color-white)]">

                  {slides[currentSlide].title}

                </h1>

              </div>



              {/* Description */}

              <div className="text-center mb-12">

                <p className="text-lg md:text-xl lg:text-2xl text-[var(--color-text-light)] leading-relaxed max-w-4xl mx-auto">

                  {slides[currentSlide].description}

                </p>

              </div>

            </article>

        </div>

      </section>

    </main>

  );

});

Hero.displayName = "Hero";

export default Hero;

