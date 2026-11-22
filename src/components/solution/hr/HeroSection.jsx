import React, { useState, useEffect } from "react";
import { useBackgroundVideo } from "../../../hooks/useBackgroundVideo";
import { VideoSources, getPosterSrc } from "../../../utils/videoSources";
import { staticContent } from "../../../services/StaticContentRepository";

const HeroSection = ({ 
  data = {},
  // Direct props from Page Builder schema
  title: propsTitle,
  subtitle: propsSubtitle,
  bgVideo: propsBgVideo,
  bgColor: propsBgColor,
}) => {
  // Decorative hero video only when the visitor hasn't asked for less data/motion
  const allowVideo = useBackgroundVideo();
  const [defaultData, setDefaultData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await staticContent.load("hr");
        setDefaultData(jsonData.hero);
      } catch (error) {
        console.error("Failed to load HR data:", error);
        // Fallback data
        setDefaultData({
          title: "Modern HR, Payroll & People Management",
          subtitle:
            "Automate HR, empower employees, and stay compliant—on one secure platform designed for the future of work.",
          bgVideo: "/Videos/hrVideo.mp4",
          bgColor: "bg-gradient-to-br from-[#191970] via-black to-blue-700",
        });
      }
    };
    fetchData();
  }, []);

  // PRIORITIZE direct props > data.hero > data > defaultData for real-time preview
  const heroFromData = data?.hero || data || {};
  
  const heroData = {
    title: propsTitle || heroFromData.title || defaultData?.title || "Modern HR, Payroll & People Management",
    subtitle: propsSubtitle || heroFromData.subtitle || defaultData?.subtitle || "Automate HR, empower employees, and stay compliant—on one secure platform designed for the future of work.",
    bgVideo: propsBgVideo || heroFromData.bgVideo || heroFromData.backgroundVideo || heroFromData.backgroundImage || defaultData?.bgVideo || "/Videos/hrVideo.mp4",
    bgColor: propsBgColor || heroFromData.bgColor || defaultData?.bgColor || "bg-gradient-to-br from-[#191970] via-black to-blue-700",
  };

  // Debug logging for real-time updates
  console.log(" [HRHeroSection] Component received data:", {
    directProps: { title: propsTitle, subtitle: propsSubtitle, bgVideo: propsBgVideo, bgColor: propsBgColor },
    dataObject: data,
    heroFromData: heroFromData,
    finalData: heroData,
    timestamp: new Date().toISOString()
  });

  return (
    <>
      <header className="w-full min-h-screen bg-gradient-to-br from-[var(--color-brand-midnight)] via-black to-[var(--color-primary)] py-24 md:py-32 text-center flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          {/* Still frame behind the video: visible when autoplay is blocked or the video is skipped */}
          {getPosterSrc(heroData.bgVideo) && (
            <img src={getPosterSrc(heroData.bgVideo)} alt="" aria-hidden="true" decoding="async" fetchPriority="low" className="absolute inset-0 w-full h-full object-cover" />
          )}
          {allowVideo && (
          <video
            poster={getPosterSrc(heroData.bgVideo) || undefined}
            autoPlay
            muted
            loop
            playsInline
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            className="absolute inset-0 w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-[8s] ease-in-out pointer-events-none"
            style={{
              filter:
                "brightness(0.7) contrast(1.2) saturate(1.3) hue-rotate(10deg)",
              animation: "video-enhance 20s ease-in-out infinite",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            <VideoSources src={heroData.bgVideo} />
            Your browser does not support the video tag.
          </video>
          )}
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 animate-fade-in-up">
          <div className="accent-bar mx-auto mb-4" aria-hidden="true"></div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-text-inverse)] mb-4 tracking-tight drop-shadow-2xl">
            {heroData.title}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-text-inverse)] mb-8 drop-shadow-lg">
            {heroData.subtitle}
          </p>
        </div>
      </header>
    </>
  );
};

export default HeroSection;
