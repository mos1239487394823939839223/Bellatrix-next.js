// WhyChooseSection.jsx

import React from "react";


import FeatureCard from "./FeatureCard";
import OptimizedImg from "../../OptimizedImg";
import { Section, SectionHeader, GlowImageFrame } from "../../site";

const WhyChooseSection = ({
  whyChooseSection,

  trainingFeatures,

  openFeatureModal,
}) => {
  // Data validation and error handling

  if (!whyChooseSection) {
    console.error("TrainingWhyChooseSection: whyChooseSection data is missing");

    return (
      <div className="bg-gray-50 py-12 light-section">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Why Choose Our Training
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Professional development excellence
          </p>

          <div className="mt-8 text-red-600">
            <p>
              Component data is missing. Please check the data configuration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!trainingFeatures || !Array.isArray(trainingFeatures)) {
    console.error(
      "TrainingWhyChooseSection: trainingFeatures data is missing or invalid",
    );

    return (
      <div className="bg-gray-50 py-12 light-section">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            {whyChooseSection.title || "Why Choose Our Training"}
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {whyChooseSection.description ||
              "Professional development excellence"}
          </p>

          <div className="mt-8 text-red-600">
            <p>
              Training features data is missing. Please check the data
              configuration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Safe normalization for title/description so editor changes can't break UI

  const rawTitle = whyChooseSection.title;
  const safeTitle =
    typeof rawTitle === "string" && rawTitle.trim().length > 0
      ? rawTitle.trim()
      : "Why Choose Our Training";


  const rawDescription = whyChooseSection.description;
  const safeDescription =
    typeof rawDescription === "string" && rawDescription.trim().length > 0
      ? rawDescription.trim()
      : "Professional development excellence";

  return (
    <>

      <Section tone="plain" padding="sm" width="container" containerClassName="px-6" className="bg-gray-50">
          <SectionHeader
          title={safeTitle}
          description={safeDescription}
          tone="none"
          titleClassName="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
          descriptionClassName="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto"
          highlight="rest"
          highlightClassName="text-blue-600"
        />

          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Features Grid - Left Side */}

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 md:auto-rows-fr gap-6">
                {trainingFeatures.map((feature, index) => (
                  <FeatureCard
                    key={feature.id || feature.featureId || `feature-${index}`}
                    feature={feature}
                    openFeatureModal={openFeatureModal}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Image - Right Side */}

            <div className="flex-1 flex justify-center">
              <GlowImageFrame
                src={whyChooseSection.image && whyChooseSection.image.trim()}
                alt={`${safeTitle} - Professional Development Excellence`}
                fallbackSrc="/images/indleaders.jpg"
                badge={whyChooseSection?.Professional_Badge || whyChooseSection?.badge || "Professional Excellence"}
              />
            </div>
          </div>
      </Section>
    </>
  );
};

export default WhyChooseSection;
