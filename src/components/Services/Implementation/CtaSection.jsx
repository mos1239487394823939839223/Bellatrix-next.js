// components/Implementation/CtaSection.jsx

import React from "react";


import {
  validateVariant,
} from "../../../utils/variantSystem";

import { smartRender } from "../../../utils/htmlSanitizer";

import { renderIcon } from "../../../utils/iconUtils";

import CTAButton from "../../CTAButton";

const CtaSection = ({
  title,

  subtitle,

  description,

  ctaButton,

  features,

  trustedBy,
}) => {
  console.log(" [ImplementationCTASection Fixed] Received props:", {
    title,

    subtitle,

    description,

    ctaButton,

    features,

    trustedBy,
  });

  // Use props DIRECTLY - no complex data processing or async fetching

  const finalData = {
    title: title || "Ready for a Seamless NetSuite Implementation?",

    subtitle:
      subtitle ||
      "Transform your business operations with our expert NetSuite implementation services. Let's turn your vision into reality with proven methodologies and dedicated support.",

    description: description || "",

    buttonText: ctaButton?.text || "Get Started Today",

    buttonLink: ctaButton?.link || null,

    variant: validateVariant(ctaButton?.variant || "primary"),

    features: features || [
      {
        title: "Quick Response",

        description: "Get a detailed proposal within 24 hours",

        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      },

      {
        title: "Proven Success",

        description: "99.9% implementation success rate",

        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      },

      {
        title: "Expert Support",

        description: "Dedicated team of certified professionals",

        icon:
          "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      },
    ],
  };

  console.log(" [ImplementationCTASection Fixed] Final data:", finalData);

  // Check if title and subtitle contain HTML and render accordingly

  const titleHTML = smartRender(finalData.title);

  const subtitleHTML = smartRender(finalData.subtitle);

  return (
    <>

      <section
        className="relative py-16 overflow-hidden"
        style={{ backgroundColor: "var(--color-brand-dark-navy)" }}
      >
        {/* Simple Background Pattern */}

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              className="text-[var(--color-primary-light)]"
            >
              <pattern
                id="simpleGrid"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
              </pattern>

              <rect width="100%" height="100%" fill="url(#simpleGrid)" />
            </svg>
          </div>
        </div>

        {/* Subtle Gradient Background */}

        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)]/10 via-transparent to-[var(--color-primary)]/10"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}

            <header>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-inverse)] mb-6"
                {...(titleHTML
                  ? { dangerouslySetInnerHTML: titleHTML }
                  : { children: finalData.title })}
              />
            </header>

            {finalData.subtitle && (
              <p
                className="text-lg md:text-xl text-[var(--color-text-inverse)] opacity-80 leading-relaxed mb-12 max-w-3xl mx-auto"
                {...(subtitleHTML
                  ? { dangerouslySetInnerHTML: subtitleHTML }
                  : { children: finalData.subtitle })}
              />
            )}

            {finalData.description && (
              <p className="text-base md:text-lg text-[var(--color-text-inverse)] opacity-70 leading-relaxed mb-8 max-w-2xl mx-auto">
                {finalData.description}
              </p>
            )}

            {/* CTA Button */}

            <div className="mb-16">
              <CTAButton
                variant={finalData.variant}
                size="lg"
                className="rounded-xl hover:scale-105 hover:shadow-lg"
                modalConfig={{
                  title: "NetSuite Implementation Consultation",

                  subtitle:
                    "Let's discuss your implementation needs and timeline",

                  icon: "",
                }}
              >
                {finalData.buttonText}
              </CTAButton>
            </div>

            {/* Features Grid */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {finalData.features.map((feature, index) => {
                const bgColors = [
                  "bg-[var(--color-primary)]",

                  "bg-[var(--color-primary-dark)]",

                  "bg-[var(--color-brand-variant)]",
                ];

                return (
                  <article
                    key={index}
                    className="bg-[var(--color-text-inverse)]/5 backdrop-blur-sm rounded-xl p-6 border border-[var(--color-text-inverse)]/10 hover:bg-[var(--color-text-inverse)]/10 transition-all duration-300 group"
                  >
                    <div
                      className={`w-12 h-12 ${bgColors[index]} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {renderIcon(feature.icon, "w-6 h-6 text-[var(--color-text-inverse)]")}
                    </div>

                    <h3 className="text-xl font-semibold text-[var(--color-text-inverse)] mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-[var(--color-text-inverse)] opacity-80 text-sm">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CtaSection;
