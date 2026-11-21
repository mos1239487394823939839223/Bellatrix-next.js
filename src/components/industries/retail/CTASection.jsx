import React from "react";
import CTAButton from "../../CTAButton";

const CTASection = (props) => {
  // Handle both flat props and nested structures
  const title = props?.title || props?.data?.title;
  const subtitle = props?.subtitle || props?.data?.subtitle;
  const description = props?.description || props?.data?.description;
  const ctaButton = props?.ctaButton || props?.data?.ctaButton;
  const features = props?.features || props?.data?.features;
  const trustedBy = props?.trustedBy || props?.data?.trustedBy;
  const openContactModal = props?.openContactModal;

  console.log(" [RetailCTASection Fixed] Received props:", {
    title,

    subtitle,

    description,

    ctaButton,

    features,

    trustedBy,
  });

  // Use props DIRECTLY - no complex data processing

  const finalData = {
    title: title || "Ready to Transform Your Retail Operations?",

    subtitle: subtitle || "",

    description:
      description ||
      "Join hundreds of retail companies that have unified their commerce operations and improved customer experience with NetSuite. Get started with a free consultation today.",

    buttonText: ctaButton?.text || "Get Started",

    buttonLink: null,

    variant: ctaButton?.variant || "primary",

    features: features || [
      {
        title: "Free Assessment",

        description: "Comprehensive evaluation of your retail processes",

        icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      },

      {
        title: "Rapid Implementation",

        description: "Get up and running faster with our proven methodology",

        icon: "M13 10V3L4 14h7v7l9-11h-7z",
      },

      {
        title: "Ongoing Support",

        description: "Continuous optimization and support for your success",

        icon:
          "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      },
    ],
  };

  console.log(" [RetailCTASection Fixed] Final data:", finalData);

  return (
    <section className="bg-gray-50 py-20 light-section">

      <div className="container mx-auto px-6">
        <div 
          className="rounded-3xl p-12 text-center border"
          style={{ 
            background: 'var(--color-cta-bg)', 
            color: 'var(--color-cta-text)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="max-w-4xl mx-auto">
            <header>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'inherit' }}>
                {finalData.title}
              </h2>

              {finalData.subtitle && (
                <h3 className="text-xl md:text-2xl mb-4 leading-relaxed" style={{ opacity: 0.9, color: 'inherit' }}>
                  {typeof finalData.subtitle === "string"
                    ? finalData.subtitle
                    : finalData.subtitle?.subtitle ||
                      finalData.subtitle?.title ||
                      "Subtitle"}
                </h3>
              )}

              <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--color-cta-subtext)' }}>
                {finalData.description}
              </p>
            </header>


            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {finalData.features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-200">
                    <svg
                      className="w-8 h-8 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={feature.icon}
                      />
                    </svg>
                  </div>

                  <h4 className="text-xl font-bold mb-2" style={{ color: 'inherit' }}>
                    {feature.title}
                  </h4>

                  <p style={{ color: 'var(--color-cta-subtext)' }}>
                    {typeof feature.description === "string"
                      ? feature.description
                      : feature.description?.description ||
                        feature.description?.desc ||
                        "Feature Description"}
                  </p>
                </div>
              ))}
            </div>


            <CTAButton
              variant="primary"
              size="lg"
              className="rounded-full shadow-lg hover:shadow-xl"
              modalConfig={{
                title: finalData.title || "Get Started",
                subtitle:
                  finalData.description ||
                  "Let's discuss your retail requirements",
                icon: "",
              }}
            >
              {finalData.buttonText}
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
