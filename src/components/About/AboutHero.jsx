import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const AboutHero = ({ 
  data,
  // Direct props for Page Builder
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  ctaButtonText: propCtaButtonText,
  ctaButtonLink: propCtaButtonLink,
  backgroundVideo: propBackgroundVideo,
  backgroundImage: propBackgroundImage,
  stats: propStats,
}) => {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Play/pause with autoplay-restriction handling (mirrors Home Hero pattern)
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current && isPlaying) {
        try {
          await videoRef.current.play();
        } catch (error) {
          if (error.name === "AbortError" || error.name === "NotAllowedError") {
            setIsPlaying(false);
          } else {
            console.warn("About Hero video playback error:", error);
          }
        }
      } else if (videoRef.current && !isPlaying) {
        videoRef.current.pause();
      }
    };
    playVideo();
  }, [isPlaying]);
  const scrollToNextSection = () => {
    if (typeof window !== "undefined") {
      const scrollAmount = window.innerHeight * 1;
      window.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };
  // Static fallback data (CMS data comes via props)
  const defaultData = {
    title: "About Bellatrix",
    subtitle: "Your trusted partner in digital transformation",
    description:
      "We are a leading consultancy firm specializing in NetSuite implementations, business process optimization, and technology solutions that drive growth and efficiency.",
    backgroundVideo: "/Videos/about-hero.mp4",
    stats: [
      { value: "500+", label: "Projects Completed" },
      { value: "15+", label: "Years Experience" },
      { value: "98%", label: "Client Satisfaction" },
      { value: "200+", label: "Happy Clients" },
    ],
  };

  // PRIORITIZE direct props > data prop > default data for real-time preview
  const heroData = {
    title: propTitle || data?.title || defaultData?.title || "About Bellatrix",
    subtitle: propSubtitle || data?.subtitle || defaultData?.subtitle || "Your trusted partner in digital transformation",
    description: propDescription || data?.description || defaultData?.description ||
      "We are a leading consultancy firm specializing in NetSuite implementations, business process optimization, and technology solutions that drive growth and efficiency.",
    backgroundVideo: propBackgroundVideo || data?.backgroundVideo || defaultData?.backgroundVideo || "/Videos/about-hero.mp4",
    backgroundImage: propBackgroundImage || data?.backgroundImage || defaultData?.backgroundImage,
    ctaButtonText: propCtaButtonText || data?.ctaButtonText || defaultData?.ctaButtonText || "Discover Our Story",
    ctaButtonLink: propCtaButtonLink || data?.ctaButtonLink || defaultData?.ctaButtonLink || "/about",
    stats: (propStats && propStats.length > 0) ? propStats : (data?.stats || defaultData?.stats || [
      { value: "500+", label: "Projects Completed" },
      { value: "15+", label: "Years Experience" },
      { value: "98%", label: "Client Satisfaction" },
      { value: "200+", label: "Happy Clients" },
    ]),
  };




  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-[var(--color-brand-midnight,#0a0a2e)] via-black to-[var(--color-primary,#C41E3A)]"
    >
      {/* Background Video — fades in only after it's ready (mirrors Home Hero) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: videoReady ? 1 : 0 }}
        onCanPlay={() => setVideoReady(true)}
        onLoadedData={() => {
          if (videoRef.current && isPlaying) {
            videoRef.current.play().catch(() => {
              console.log("About Hero video autoplay blocked (normal)");
            });
          }
        }}
        onError={(e) => console.log("About Hero video error:", e.target.error)}
      >
        <source
          src={heroData.backgroundVideo || "/Videos/about-hero.mp4"}
          type="video/mp4"
        />
      </video>
      {/* Overlay - theme-aware */}
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-primary-dark)/0.8_0%,var(--color-gray-900)/0.6_50%,var(--color-cyan-900)/0.8_100%)] transition-all duration-600 ease-in-out"
      ></div>
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-xl bg-[linear-gradient(90deg,var(--color-primary)/0.2,var(--color-cyan-400)/0.2)] transition-all duration-600 ease-in-out"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full blur-lg bg-[linear-gradient(90deg,var(--color-primary-dark)/0.2,var(--color-cyan-500)/0.2)] transition-all duration-600 ease-in-out"
        />
      </div>
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(to right, #ffffff, #bfdbfe, #a5f3fc)" }}>
            {heroData.title}
          </h1>
          <p className="text-xl md:text-2xl mb-4 leading-relaxed max-w-4xl mx-auto font-medium" style={{ color: "#ffffff" }}>
            {heroData.subtitle}
          </p>
          <p className="text-lg mb-8 leading-relaxed max-w-3xl mx-auto" style={{ color: "#ffffff" }}>
            {heroData.description}
          </p>
          <button
            onClick={scrollToNextSection}
            className="theme-cta-button text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-[linear-gradient(90deg,var(--color-primary),var(--color-cyan-600))] hover:scale-105 transform cursor-pointer inline-flex items-center gap-2"
          >
            {heroData.ctaButtonText || "Discover Our Story"}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
