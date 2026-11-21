import React from "react";
import CTAButton from "../../CTAButton";

import { useComponentData } from "../../../utils/useComponentData";

import manufacturingData from "../../../data/manufacturing-data.json";



const CTASection = ({

  title,

  subtitle,

  description,

  ctaButton,

  features,

  trustedBy,
}) => {

  // Merge props with default data from JSON

  const propsData = {

    title,

    subtitle,

    description,

    ctaButton,

    features,

    trustedBy,

  };

  const finalData = useComponentData("cta", propsData, manufacturingData);



  console.log(" [CTASection] Data merge:", {

    props: propsData,

    defaultData: manufacturingData.cta,

    finalData: finalData,

  });



  // Use merged data with fallbacks - PRIORITIZE direct props first
  const mergedData = {
    title: title || finalData.title || "Transform Your Manufacturing Operations",
    subtitle: subtitle || finalData.subtitle || "",
    description: description || finalData.description || 
      "Join hundreds of manufacturing companies that have optimized their operations with our solutions.",
    buttonText: ctaButton?.text || finalData.buttonText || "Get Started",
    buttonLink: ctaButton?.link || finalData.buttonLink || null,
    variant: ctaButton?.variant || finalData.variant || "primary",
    features: (features && features.length > 0) ? features : (finalData.features || [
      {
        title: "Streamlined Operations",
        description: "Optimize your manufacturing processes",
        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      },
      {
        title: "Real-time Insights",
        description: "Get actionable data for better decisions",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      },
      {
        title: "Expert Support",
        description: "24/7 support from industry experts",
        icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      },
    ]),
  };



  console.log(" [ManufacturingCTASection Fixed] Final data:", mergedData);

  return (

    <section className="py-20 bg-[var(--color-brand-dark-navy)]">




      <div className="container mx-auto px-6">

        <div className="bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 rounded-3xl p-12 text-white text-center border border-white/10">

          <div className="max-w-4xl mx-auto">

            <header>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">

                {mergedData.title}

              </h2>

              {mergedData.subtitle && (

                <h3 className="text-xl md:text-2xl text-white/90 mb-4 leading-relaxed">

                  {typeof mergedData.subtitle === 'string'

                    ? mergedData.subtitle

                    : mergedData.subtitle?.subtitle || mergedData.subtitle?.title || 'Subtitle'}

                </h3>

              )}

              <p className="text-xl mb-8 leading-relaxed text-white/80">

                {mergedData.description}

              </p>

            </header>



            <div className="grid md:grid-cols-3 gap-8 mb-12">

              {mergedData.features.map((feature, index) => (

                <div key={index} className="text-center">

                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-white/20">

                    <svg

                      className="w-8 h-8 text-[var(--color-primary)]"

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

                  <h4 className="text-xl font-bold mb-2 text-white">

                    {feature.title}

                  </h4>

                  <p className="text-white/70">

                    {typeof feature.description === 'string'

                      ? feature.description

                      : feature.description?.description || feature.description?.desc || 'Feature Description'}

                  </p>

                </div>

              ))}

            </div>



            <CTAButton
              variant="primary"
              size="lg"
              className="rounded-full shadow-lg hover:shadow-xl"
              modalConfig={{
                title: mergedData.title || "Get Started",
                subtitle: mergedData.description || "Let's discuss your manufacturing requirements",
                icon: ""
              }}
            >
              {mergedData.buttonText}
            </CTAButton>

          </div>

        </div>

      </div>

    </section>

  );

};



export default CTASection;

