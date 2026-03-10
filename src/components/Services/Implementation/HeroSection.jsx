// components/Implementation/HeroSection.jsx

import React, { useState, useEffect } from "react";

import SEO from "../../SEO";

import {
  getVariantClasses,
  validateVariant,
} from "../../../utils/variantSystem";

import CTAButton from "../../CTAButton";

const HeroSection = (props) => {
  const [defaultData, setDefaultData] = useState(null);

  // Extract direct props from Page Builder
  const {
    backgroundVideo: propBackgroundVideo,
    titleParts: propTitleParts,
    description: propDescription,
    ctaButton: propCtaButton,
    data: propsData,
    openModal,
  } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/Implementation.json");

        const jsonData = await response.json();

        setDefaultData(jsonData.heroSection);
      } catch (error) {
        console.error("Failed to load Implementation data:", error);

        // Fallback data

        setDefaultData({
          backgroundVideo: "/Videos/HomeHeroSectionV.mp4",

          titleParts: ["Where", "Vision", "Meets", "Reality"],

          description:
            "We don't just implement solutions—we craft digital experiences that transform the way you do business",

          ctaButton: {
            text: "Start Implementation",

            icon: "M13 7l5 5m0 0l-5 5m5-5H6",

            variant: "primary",
          },
        });
      }
    };

    fetchData();
  }, []);

  // PRIORITIZE direct props > data prop > defaultData
  const rawData = {
    backgroundVideo:
      propBackgroundVideo ||
      propsData?.backgroundVideo ||
      defaultData?.backgroundVideo ||
      "/Videos/HomeHeroSectionV.mp4",
    titleParts: propTitleParts ||
      propsData?.titleParts ||
      defaultData?.titleParts || ["Where", "Vision", "Meets", "Reality"],
    description:
      propDescription ||
      propsData?.description ||
      defaultData?.description ||
      "We don't just implement solutions—we craft digital experiences that transform the way you do business",
    ctaButton: propCtaButton ||
      propsData?.ctaButton ||
      defaultData?.ctaButton || {
        text: "Start Implementation",
        icon: "M13 7l5 5m0 0l-5 5m5-5H6",
        variant: "primary",
      },
  };

  // Debug logging for real-time updates
  console.log(" [ImplementationHeroSection] Component received data:", {
    directProps: {
      propBackgroundVideo,
      propTitleParts,
      propDescription,
      propCtaButton,
    },
    propsData,
    defaultData,
    finalData: rawData,
    timestamp: new Date().toISOString(),
  });

  // Convert title/subtitle to titleParts if needed

  const displayData = {
    ...rawData,

    titleParts:
      rawData.titleParts ||
      (rawData.title && rawData.subtitle
        ? [rawData.title, rawData.subtitle]
        : ["Implementation", "Services", "Made", "Simple"]),
  };

  // Get variant classes for the CTA button

  const ctaVariant = validateVariant(
    displayData.ctaButton?.variant || "primary"
  );

  const variantClasses = getVariantClasses(ctaVariant);

  console.log(" [ImplementationHeroSection] CTA Button Debug:", {
    rawVariant: displayData.ctaButton?.variant,

    validatedVariant: ctaVariant,

    variantClasses: variantClasses,

    ctaButton: displayData.ctaButton,
  });

  return (
    <>
      <SEO
        title="Bellatrix ERP Implementation | Where Vision Meets Technology Reality"
        description="Transform your business operations with expert Bellatrix ERP implementation. Our certified consultants craft enterprise solutions that revolutionize how you do business with proven technology."
        keywords="Bellatrix ERP implementation, enterprise technology solutions, certified Oracle consultants, business transformation, ERP deployment, CRM integration, IT consulting services"
        ogTitle="Bellatrix ERP Implementation | Where Vision Meets Technology Reality"
        ogDescription="Expert Bellatrix ERP implementation services with certified consultants. Transform your business operations with enterprise technology solutions."
        ogImage="/Videos/HomeHeroSectionV.mp4"
      />

      <header className="min-h-screen relative overflow-hidden pt-20">
        {/* Background Video or Image */}

        {displayData.backgroundVideo &&
        (displayData.backgroundVideo.includes(".mp4") ||
          displayData.backgroundVideo.includes(".webm")) ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={displayData.backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                displayData.backgroundVideo ||
                displayData.backgroundImage ||
                "/Videos/HomeHeroSectionV.mp4"
              })`,
            }}
          />
        )}

        {/* Creative Overlay with Animated Gradient */}

        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/5 to-white/8 animate-gradient-shift"></div>

        {/* Floating Geometric Elements */}

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-white/60 to-white/40 rounded-full blur-xl animate-float-slow"></div>

          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-white/65 to-white/45 rounded-full blur-lg animate-float-reverse"></div>

          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-white/70 to-white/50 rounded-full blur-md animate-pulse-slow"></div>

          <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-gradient-to-r from-white/60 to-white/40 rounded-full blur-lg animate-bounce-gentle"></div>
        </div>

        {/* Animated Grid Pattern */}

        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-grid-pattern animate-grid-flow"></div>
        </div>

        {/* Content */}

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto px-6">
            {/* Main Heading with Text Animation */}

            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white animate-slide-up">
                {displayData.titleParts.length >= 4 ? (
                  <>
                    <span className="inline-block animate-text-glow">
                      {displayData.titleParts[0]}
                    </span>{" "}
                    <span className="inline-block bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent animate-gradient-text">
                      {displayData.titleParts[1]}
                    </span>{" "}
                    <span className="inline-block animate-text-glow delay-300">
                      {displayData.titleParts[2]}
                    </span>
                    <br />
                    <span className="inline-block bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent animate-gradient-text-reverse">
                      {displayData.titleParts[3]}
                    </span>
                  </>
                ) : displayData.titleParts.length === 2 ? (
                  <>
                    <span className="inline-block animate-text-glow">
                      {displayData.titleParts[0]}
                    </span>

                    <br />

                    <span className="inline-block bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent animate-gradient-text">
                      {displayData.titleParts[1]}
                    </span>
                  </>
                ) : (
                  <span className="inline-block animate-text-glow">
                    {displayData.titleParts[0] || "Implementation Services"}
                  </span>
                )}
              </h1>
            </div>

            {/* Creative Description with Typewriter Effect */}

            <div className="text-center mb-12">
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto animate-fade-in implementation-hero-description">
                {displayData.description}
              </p>
            </div>

            {/* CTA Button - Now using global CTA system */}

            <div className="text-center">
              <CTAButton
                variant={ctaVariant}
                size="lg"
                className="group relative rounded-full overflow-hidden animate-slide-up-delay"
                modalConfig={{
                  title: "Start NetSuite Implementation",

                  subtitle:
                    "Let's discuss your implementation requirements and timeline",

                  icon: "",
                }}
                icon={
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={displayData.ctaButton.icon}
                    />
                  </svg>
                }
              >
                {displayData.ctaButton.text}
              </CTAButton>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeroSection;
