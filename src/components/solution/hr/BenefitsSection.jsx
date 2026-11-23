import React from "react";
import CTAButton from "../../CTAButton";
import { Section, SectionHeader, CardGrid, FeatureCard } from "../../site";

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
    <Section tone="muted" className="animate-fade-in-up">
      <SectionHeader title={displayData.title} description={displayData.description} />
      <CardGrid columns={{ sm: 2, lg: 3 }}>
        {displayData.features.map((b, idx) => (
          <FeatureCard
            key={idx}
            variant="outline"
            title={b.title}
            description={b.desc || b.description}
            ariaLabel={`HR Benefit: ${b.title || "HR Feature"}`}
            className={activeBenefitIdx === idx ? "scale-105 z-10 shadow-2xl border-[var(--color-primary)]" : "scale-100"}
            style={{ transition: "transform 2.5s cubic-bezier(.4,1,.6,1), box-shadow 2.5s, border-color 2.5s" }}
          />
        ))}
      </CardGrid>
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
            icon: "",
          }}
        >
          {displayData.ctaButton.text}
        </CTAButton>
      </div>
    </Section>
  );
};

export default BenefitsSection;
