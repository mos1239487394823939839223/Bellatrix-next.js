import React, { useState, useEffect } from "react";
import CTAButton from "../../CTAButton";

const BenefitsSection = ({
  data,
  activeBenefitIdx,
  onShowDemo,
  // Direct props for Page Builder
  title: propTitle,
  description: propDescription,
  ctaButton: propCtaButton,
  features: propFeatures,
}) => {
  // Normalize incoming data structure
  const rawData = data?.data || data || {};
  const featuresData = rawData.features || rawData || {};

  // Prioritize props > data prop > default data
  const displayData = {
    title: propTitle || featuresData.title || rawData.title || "Why Choose Our HR Solution?",
    description: propDescription || featuresData.description || rawData.description || "Discover the key advantages that make our HR platform the smart choice for modern businesses of all sizes and industries.",
    ctaButton: (() => {
      const btn = propCtaButton || rawData.ctaButton || featuresData.ctaButton;
      if (typeof btn === 'object' && btn !== null) {
        return {
          text: btn.text || "Contact Us",
          link: btn.link || "/contact",
          modalTitle: btn.modalTitle || btn.title,
          modalSubtitle: btn.modalSubtitle || btn.subtitle,
          variant: btn.variant || "primary"
        };
      }
      return { text: btn || "Contact Us", link: "/contact" };
    })(),
    features: Array.isArray(propFeatures) && propFeatures.length > 0 
      ? propFeatures 
      : (Array.isArray(featuresData.items) ? featuresData.items : (Array.isArray(rawData.benefits) ? rawData.benefits : (Array.isArray(rawData.items) ? rawData.items : [])))
  };

  // Debug logging for real-time updates
  console.log(" [HRBenefitsSection] Component rendered with:", {
    displayData,
    hasOnShowDemo: !!onShowDemo,
    timestamp: new Date().toISOString(),
  });

  return (
    <>
      <section className="py-20 bg-[var(--color-bg-secondary)] animate-fade-in-up light-section">
        <div className="max-w-6xl mx-auto px-4">
          <header className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary-dark)]">
              {displayData.title}
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              {displayData.description}
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:auto-rows-fr gap-8">
            {displayData.features.map((b, idx) => (
              <article
                key={idx}
                className={`bg-[var(--color-bg-primary)] rounded-2xl shadow-md p-8 flex flex-col items-center text-center border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-[2500ms] animate-fade-in-up ${
                  activeBenefitIdx === idx
                    ? "scale-105 z-10 shadow-2xl border-[var(--color-primary)]"
                    : "scale-100"
                }`}
                style={{
                  transition:
                    "transform 2.5s cubic-bezier(.4,1,.6,1), box-shadow 2.5s, border-color 2.5s",
                }}
                role="article"
                aria-label={`HR Benefit: ${b.title || "HR Feature"}`}
              >
                <h3 className="font-bold text-2xl text-[var(--color-primary-dark)] mb-4">
                  {b.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-lg">
                  {b.desc || b.description}
                </p>
              </article>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <CTAButton
              variant={displayData.ctaButton.variant || "primary"}
              size="lg"
              className="shadow-lg"
              onClick={(e) => {
                if (onShowDemo) {
                  e.preventDefault();
                  onShowDemo();
                }
              }}
              modalConfig={{
                title: displayData.ctaButton.modalTitle || "See Bellatrix HR in Action",
                subtitle: displayData.ctaButton.modalSubtitle || "Let's show you how our HR platform can transform your operations",
                icon: ""
              }}
            >
              {displayData.ctaButton.text}
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default BenefitsSection;
