// components/Implementation/WhyChooseSection.jsx

import React, { useState, useEffect } from "react";

import SEO from "../../SEO";
import { loadImplementationData } from "../../../data/implementationDataLoader";

const WhyChooseSection = (props) => {
  const [defaultData, setDefaultData] = useState(null);

  // Extract direct props from Page Builder
  const {
    title: propTitle,
    subtitle: propSubtitle,
    image: propImage,
    features: propFeatures,
    data: propsData,
  } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await loadImplementationData();
        setDefaultData(jsonData.whyChooseSection);
      } catch {
        setDefaultData({
          title: "Why Choose Bellatrix for Implementation?",
          subtitle: "We bring years of expertise, proven methodologies, and cutting-edge solutions to ensure your implementation success",
          image: "/Videos/implementation/whyChoese.jpg",
          features: [],
        });
      }
    };
    fetchData();
  }, []);

  // PRIORITIZE direct props > data prop > defaultData
  const displayData = {
    title:
      propTitle ||
      propsData?.title ||
      defaultData?.title ||
      "Why Choose Bellatrix for Implementation?",
    subtitle:
      propSubtitle ||
      propsData?.subtitle ||
      defaultData?.subtitle ||
      "We bring years of expertise, proven methodologies, and cutting-edge solutions to ensure your implementation success",
    image:
      propImage ||
      propsData?.image ||
      defaultData?.image ||
      "/Videos/implementation/whyChoese.jpg",
    features:
      propFeatures || propsData?.features || defaultData?.features || [],
  };

  // Debug logging for real-time updates
  console.log(" [ImplementationWhyChooseSection] Component received data:", {
    directProps: { propTitle, propSubtitle, propImage },
    propsData,
    defaultData,
    finalData: displayData,
    timestamp: new Date().toISOString(),
  });

  return (
    <>
      <SEO
        title="Why Choose Bellatrix | Bellatrix ERP Implementation Excellence"
        description="Choose Bellatrix for Bellatrix ERP implementation with 18+ years expertise, certified technology consultants, proven methodologies, and cutting-edge enterprise solutions for guaranteed success."
        keywords="Bellatrix certified consultants, ERP implementation expertise, enterprise technology solutions, Oracle consulting company, IT implementation excellence, CRM deployment specialists, business transformation experts"
        ogTitle="Why Choose Bellatrix | Bellatrix ERP Implementation Excellence"
        ogDescription="Leading Bellatrix ERP implementation company with certified consultants, proven methodologies, and 18+ years of enterprise technology expertise."
        ogImage="/Videos/implementation/whyChoese.jpg"
      />

      <section
        className="py-12 relative overflow-hidden animate-background-glow"
        style={{
          backgroundColor: "#001038",
        }}
      >
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}

          <header className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {displayData.title}
            </h2>

            <p className="text-lg leading-relaxed max-w-3xl mx-auto implementation-whychoose-subtitle">
              {displayData.subtitle}
            </p>
          </header>

          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Features Content - Left Side */}

            <div className="flex-1">
              <div className="bg-gray-800 rounded-3xl p-8 border border-gray-600/50 shadow-2xl hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group backdrop-blur-sm">
                {/* Creative Background Elements */}

                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full opacity-20 transform translate-x-16 -translate-y-16 group-hover:opacity-40 transition-opacity duration-500"></div>

                <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-500/20 rounded-full opacity-20 transform -translate-x-10 translate-y-10 group-hover:opacity-40 transition-opacity duration-500"></div>

                <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-cyan-400/15 rounded-full opacity-15 transform -translate-x-8 -translate-y-8 group-hover:opacity-30 transition-opacity duration-500"></div>

                <div className="relative z-10 space-y-4">
                  {(displayData.features || []).map((feature, index) => {
                    const bgColors = [
                      "bg-blue-800",

                      "bg-blue-850",

                      "bg-blue-900",

                      "bg-blue-700",
                    ];

                    return (
                      <div
                        key={index}
                        className="group/item hover:bg-gray-700/30 rounded-xl p-3 transition-all duration-300 hover:transform hover:translate-x-2"
                      >
                        <div className="flex items-center">
                          <div className="relative mr-3">
                            <div
                              className={`w-7 h-7 ${bgColors[index]} rounded-lg flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-all duration-300`}
                            >
                              <span className="text-white font-bold text-xs">
                                {feature.number}
                              </span>
                            </div>

                            <div
                              className={`absolute -inset-1 ${bgColors[index]} rounded-lg blur opacity-30 group-hover/item:opacity-60 transition-opacity duration-300`}
                            ></div>
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1 group-hover/item:text-blue-300 transition-all duration-300">
                              {feature.title}
                            </h3>

                            <p className="text-sm text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Image - Right Side */}

            <div className="flex-1 flex justify-center">
              <div className="relative group implementation-whychoose-image-wrapper">
                {/* Glowing background effect - disabled for dark mode via global CSS */}

                <div className="absolute -inset-4 bg-blue-300/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 implementation-whychoose-image-glow"></div>

                {/* Image container with enhanced styling - inline style keeps it identical in all themes */}

                <div
                  className="relative rounded-2xl p-4 backdrop-blur-sm shadow-2xl implementation-whychoose-image-container"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <img
                    src={displayData.image}
                    alt="Why Choose Bellatrix - Digital Innovation & Technology"
                    className="w-full h-auto lg:max-w-md rounded-xl shadow-lg brightness-110 contrast-110 saturate-110 group-hover:scale-105 transition-all duration-500"
                  />

                  {/* Floating elements for tech feel */}

                  <div className="absolute top-2 right-2 w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>

                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-300/80 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseSection;
