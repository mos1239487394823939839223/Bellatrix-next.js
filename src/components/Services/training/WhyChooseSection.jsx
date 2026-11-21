// WhyChooseSection.jsx

import React from "react";


import FeatureCard from "./FeatureCard";

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

  const titleParts = safeTitle.split(/\s+/);
  const firstWord = titleParts[0] || "Why";
  const remainingWords = titleParts.slice(1).join(" ") || "Choose Our Training";

  const rawDescription = whyChooseSection.description;
  const safeDescription =
    typeof rawDescription === "string" && rawDescription.trim().length > 0
      ? rawDescription.trim()
      : "Professional development excellence";

  return (
    <>

      <section className="bg-gray-50 py-12 light-section">
        <div className="container mx-auto px-6">
          <header className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              {firstWord}{" "}
              <span className="text-blue-600">{remainingWords}</span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {safeDescription}
            </p>
          </header>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Features Grid - Left Side */}

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="relative group max-w-2xl">
                {/* Advanced Background Effects */}

                <div className="absolute -inset-8 opacity-30 group-hover:opacity-60 transition-all duration-700">
                  {/* Multiple layered glows */}

                  <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/20 via-cyan-500/30 to-blue-600/20 rounded-3xl blur-2xl"></div>

                  <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/15 via-purple-500/20 to-cyan-500/15 rounded-2xl blur-xl"></div>

                  <div className="absolute -inset-2 bg-gradient-to-tr from-white/10 via-blue-300/20 to-white/10 rounded-xl blur-lg"></div>
                </div>

                {/* Professional Container with Multi-layer Design */}

                <div className="relative bg-gradient-to-br from-gray-900/10 via-blue-900/5 to-gray-900/10 rounded-3xl p-6 backdrop-blur-md border border-white/30 shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500">
                  {/* Inner glow container */}

                  <div className="relative bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 rounded-2xl p-4 border border-white/20">
                    <img
                      src={
                        (whyChooseSection.image &&
                          whyChooseSection.image.trim()) ||
                        "/images/indleaders.jpg"
                      }
                      alt={`${safeTitle} - Professional Development Excellence`}
                      className="w-full h-auto rounded-xl shadow-2xl brightness-105 contrast-110 saturate-105 group-hover:brightness-110 group-hover:contrast-115 group-hover:saturate-110 transition-all duration-500 filter drop-shadow-xl"
                      onError={(e) => {
                        e.target.onerror = null;

                        e.target.src = "/images/indleaders.jpg";
                      }}
                    />

                    {/* Professional overlay effects */}

                    <div className="absolute inset-4 rounded-xl bg-gradient-to-tr from-blue-500/5 via-transparent via-transparent to-cyan-400/5 pointer-events-none"></div>

                    <div className="absolute inset-4 rounded-xl bg-gradient-to-bl from-transparent via-white/3 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Advanced Floating Tech Elements */}

                  <div className="absolute top-3 right-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse shadow-lg"></div>

                      <div className="absolute inset-0 w-4 h-4 bg-blue-400/30 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6">
                    <div className="relative">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full animate-pulse shadow-md"></div>

                      <div className="absolute -inset-1 w-5 h-5 bg-cyan-400/20 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 right-6">
                    <div className="relative">
                      <div className="w-2 h-2 bg-white/90 rounded-full animate-pulse shadow-sm"></div>

                      <div className="absolute -inset-1 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  <div className="absolute top-1/4 left-8">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full animate-pulse opacity-70"></div>
                  </div>

                  <div className="absolute bottom-1/3 right-12">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-white to-blue-200 rounded-full animate-pulse opacity-80"></div>
                  </div>

                  {/* Professional corner accents */}

                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400/40 rounded-tl-3xl"></div>

                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-3xl"></div>

                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400/40 rounded-bl-3xl"></div>

                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/40 rounded-br-3xl"></div>

                  {/* Data visualization lines */}

                  <div className="absolute top-4 left-1/4 w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>

                  <div className="absolute bottom-8 right-1/4 w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent"></div>

                  <div className="absolute top-1/3 right-2 w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-300/50 to-transparent"></div>
                </div>

                {/* Professional Badge */}

                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-2">
                    <span>
                      {whyChooseSection?.Professional_Badge ||
                        whyChooseSection?.badge ||
                        "Professional Excellence"}
                    </span>
                  </div>
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
