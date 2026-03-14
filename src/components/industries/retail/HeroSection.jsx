import React from "react";
import SEO from "../../SEO";
import CTAButton from "../../CTAButton";

const HeroSection = ({
  data: propsData,
  // Direct props from Page Builder schema
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  backgroundImage: propBackgroundImage,
  ctaText: propCtaText,
  ctaLink: propCtaLink,
}) => {
  // Support both direct props and data object - direct props take priority
  const data = {
    title: propTitle || propsData?.title || "Retail Solutions",
    subtitle:
      propSubtitle || propsData?.subtitle || "Transform your retail operations",
    description:
      propDescription ||
      propsData?.description ||
      "Comprehensive NetSuite solutions for retail businesses",
    backgroundImage: propBackgroundImage || propsData?.backgroundImage || "",
    ctaText: propCtaText || propsData?.ctaText || "Request Info",
    ctaLink: propCtaLink || propsData?.ctaLink || "/contact",
  };

  // Debug logging for real-time updates
  console.log(" [RetailHeroSection] Component received data:", {
    hasPropsData: !!propsData,
    directProps: { propTitle, propSubtitle, propDescription },
    finalData: data,
    timestamp: new Date().toISOString(),
  });

  return (
    <header
      className="relative overflow-hidden animate-background-glow theme-bg-animated text-white py-20 md:py-32 lg:py-48"
      style={{
        width: "100%",
        fontFamily: '"Gotham A", "Gotham B"',
        backgroundImage: data.backgroundImage
          ? `url(${data.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <SEO
        title="Bellatrix Retail Platform | E-commerce & Omnichannel Solutions"
        description="Modern Bellatrix retail platform for e-commerce, POS, inventory management, and omnichannel retail operations. Transform your retail business today."
        keywords="Bellatrix retail platform, e-commerce solutions, omnichannel retail, NetSuite POS, retail inventory management, retail ERP system"
        ogTitle="Bellatrix Retail Platform | E-commerce & Omnichannel Solutions"
        ogDescription="Comprehensive Bellatrix retail platform for modern e-commerce and omnichannel retail operations."
        ogImage="/images/retail-hero.jpg"
      />
      {/* Dark overlay for better text contrast over background image */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlays */}
        <div className="absolute inset-0 theme-gradient-overlay"></div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-2xl opacity-30 theme-floating-element-1"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full blur-xl opacity-40 theme-floating-element-2"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full blur-lg opacity-20 theme-floating-element-3"></div>

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
                id="retailGrid"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#retailGrid)" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-6xl">
        <div className="py-10 md:py-0" style={{ marginTop: "30%" }}>
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-white animate-slide-up tracking-tight">
            {data.title}
          </h1>

          {/* Subtitle */}
          {data.subtitle && (
            <p className="text-xl md:text-2xl text-center font-bold text-white animate-fade-in mb-4">
              {data.subtitle}
            </p>
          )}

          {/* Description */}
          <p className="text-lg md:text-xl text-center font-bold text-white animate-slide-up tracking-tight mb-4">
            {data.description}
          </p>

          {/* CTA Button - now uses CTAButton to open contact modal */}
          <div className="text-center">
            <CTAButton
              variant="primary"
              size="lg"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl"
              modalConfig={{
                title: data.title || "Retail Solutions",
                subtitle: data.description || "Let's discuss your retail needs",
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              }
            >
              {data.ctaText || "Request Info"}
            </CTAButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
