import React from "react";
import CTAButton from "../CTAButton";
import { addMediaVersionToBust } from "../../utils/cacheBusting";

const BellatrixSupportHero = ({
  data,
  // Direct props for Page Builder
  title: propTitle,
  description: propDescription,
  ctaButtonText: propCtaButtonText,
  backgroundImage: propBackgroundImage,
  _updatedAt,
}) => {
  // Default data
  const defaultData = {
    title: "Bellatrix Support",
    description:
      "Get access to expert knowledge and ongoing NetSuite support after your initial go-live phase.",
    ctaButtonText: "Talk to an Expert",
    backgroundImage: "/images/Support/HeroSection.png",
  };

  // PRIORITIZE direct props > data prop > default data for real-time preview
  const heroData = {
    title: propTitle || data?.title || defaultData.title,
    description:
      propDescription || data?.description || defaultData.description,
    ctaButtonText:
      propCtaButtonText || data?.ctaButtonText || defaultData.ctaButtonText,
    backgroundImage:
      propBackgroundImage ||
      data?.backgroundImage ||
      data?.image ||
      defaultData.backgroundImage,
  };

  const cacheVersion = _updatedAt || data?._updatedAt || Date.now();

  return (
    <>
      <header
        className="py-12 relative overflow-hidden animate-background-glow theme-bg-animated text-white"
        style={{
          padding: "150px 0 50px",
          width: "100%",
          fontSize: "15px",
          lineHeight: "24px",
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient overlays */}
          <div className="absolute inset-0 theme-gradient-overlay"></div>

          {/* Floating elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 theme-floating-element-1 rounded-full blur-2xl opacity-30"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 theme-floating-element-2 rounded-full blur-xl opacity-40"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 theme-floating-element-3 rounded-full blur-lg opacity-20"></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                className="theme-pattern-color"
                style={{
                  color: "var(--color-cyan-300)",
                  transition: "color 0.6s ease",
                }}
              >
                <pattern
                  id="supportGrid"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="1"
                    cy="1"
                    r="1"
                    fill="currentColor"
                    opacity="0.3"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#supportGrid)" />
              </svg>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1220px",
            margin: "0 auto",
            padding: "0 7.5px",
          }}
          className="relative z-10"
        >
          <div style={{ padding: "40px 15px 20px" }}>
            {/* Title */}
            <h1
              style={{
                fontWeight: "700",
                fontSize: "clamp(34px, 8.5vw, 50px)",
                lineHeight: 1.08,
                textWrap: "balance",
                textAlign: "center",
                letterSpacing: "-1px",
                margin: "0 0 13px",
              }}
              className="text-white animate-slide-up"
            >
              {heroData.title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "20px",
                lineHeight: "30px",
                textAlign: "center",
                margin: 0,
              }}
              className="text-white animate-fade-in"
            >
              {heroData.description}
            </p>

            {/* CTA Button */}
            <div style={{ textAlign: "center" }}>
              <CTAButton
                variant="primary"
                size="lg"
                className="group relative inline-block min-w-[180px] min-h-[56px] font-bold text-sm uppercase leading-5 rounded-md px-4 py-4 mt-8 mb-0 no-underline transition-all duration-300 transform hover:scale-105 text-white border-2 theme-cta-button"
                modalConfig={{
                  title: "Contact Us",
                  subtitle: "Let's discuss your project",
                  icon: "",
                }}
              >
                {heroData.ctaButtonText}
              </CTAButton>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default BellatrixSupportHero;
