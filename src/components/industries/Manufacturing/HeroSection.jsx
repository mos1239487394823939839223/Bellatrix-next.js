import React from "react";
import CTAButton from "../../CTAButton";
import { motion } from "framer-motion";

const HeroSection = (props) => {
  // PRIORITIZE props data over default data for real-time preview
  const ctaButton = props.ctaButton || props.data?.ctaButton;
  const title = props.title || props.data?.title;
  const subtitle = props.subtitle || props.data?.subtitle;
  const description = props.description || props.data?.description;
  const backgroundImage = props.backgroundImage || props.data?.backgroundImage;
  const backgroundVideo = props.backgroundVideo || props.data?.backgroundVideo;

  // Use form data directly with fallbacks
  const finalData = {
    title: title || "Manufacturing Solutions",
    subtitle: subtitle || "Streamline your manufacturing operations",
    description: description || "Comprehensive NetSuite solutions for manufacturing businesses",
    backgroundImage: backgroundImage || "/images/manufacturing-hero.jpg",
    backgroundVideo: backgroundVideo || "",
    ctaButton: ctaButton || {
      text: "Learn More",
      link: "/manufacturing",
      variant: "primary",
    },
  };

  // Debug logging for real-time updates
  console.log(" [ManufacturingHeroSection] Component received data:", {
    hasPropsData: !!(props.title || props.subtitle || props.data),
    props: props,
    finalData: finalData,
    timestamp: new Date().toISOString()
  });

  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${finalData.backgroundImage})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-dark-navy)]/95 via-[var(--color-brand-dark-navy)]/90 to-[var(--color-brand-dark-navy)]/95"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-lg"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            {finalData.title}
          </h1>
          <h2 className="text-2xl md:text-3xl text-white/80 mb-6 font-semibold">
            {finalData.subtitle}
          </h2>
          <p className="text-xl md:text-2xl text-white/70 mb-8 leading-relaxed max-w-4xl mx-auto">
            {finalData.description}
          </p>

          {/* CTA Button - now opens contact modal */}
          {finalData.ctaButton && (
            <div className="flex justify-center">
              <CTAButton
                variant={finalData.ctaButton.variant || "primary"}
                size="lg"
                className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl"
                modalConfig={{
                  title: finalData.title || "Manufacturing Solutions",
                  subtitle: finalData.description || "Let's discuss your manufacturing needs",
                }}
              >
                {finalData.ctaButton.text}
              </CTAButton>
            </div>
          )}
        </motion.div>
      </div>
    </header>
  );
};

export default HeroSection;
