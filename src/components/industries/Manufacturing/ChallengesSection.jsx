import React, { useState, useEffect } from "react";

import SEO from "../../SEO";

const ChallengesSection = (props) => {
  console.log(" [ChallengesSection] ALL PROPS:", props);

  // Handle both flat and nested prop structures

  const title = props?.title || props?.data?.title;

  const subtitle = props?.subtitle || props?.data?.subtitle;

  const _description = props?.description || props?.data?.description;

  const image = props?.image || props?.data?.image;

  const challenges =
    props?.challenges ||
    props?.items ||
    props?.data?.challenges ||
    props?.data?.items ||
    [];

  // Internal state management for pagination

  const [activeChallenge, setActiveChallenge] = useState(0);

  console.log(" [ChallengesSection] Using data:", {
    title,

    subtitle,

    challengesCount: challenges.length,

    hasTitle: !!title,

    hasSubtitle: !!subtitle,

    hasChallenges: challenges.length > 0,

    activeChallenge,
  });

  // Default data as fallback ONLY if no form data is provided

  const defaultData = {
    title: "Manufacturing Challenges",

    subtitle: "Common pain points we solve",

    challenges: [
      {
        title: "Supply Chain Complexity",

        description: "Managing multiple suppliers and vendors",

        impact: "High",

        icon: "M13 10V3L4 14h7v7l9-11h-7z",
      },

      {
        title: "Quality Control",

        description: "Ensuring consistent product quality",

        impact: "High",

        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      },

      {
        title: "Cost Management",

        description: "Controlling operational expenses",

        impact: "Medium",

        icon: "M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z",
      },
    ],

    image:
      "https://i.pinimg.com/736x/c4/80/65/c4806594c1156f008c99c34514da447c.jpg",
  };

  // PRIORITIZE FORM DATA OVER DEFAULTS

  const finalTitle = title || defaultData.title;

  const finalSubtitle = subtitle || defaultData.subtitle;

  // Description is available via description prop if needed

  const finalImage = image || defaultData.image;

  const finalChallenges =
    challenges.length > 0 ? challenges : defaultData.challenges;

  console.log(" [ChallengesSection] FINAL DATA:", {
    finalTitle,

    finalSubtitle,

    finalChallenges,

    usingFormData: challenges.length > 0 || !!title || !!subtitle,
  });

  // Handle pagination dot clicks

  const handlePaginationClick = (index) => {
    console.log(" [CHALLENGES PAGINATION] Clicked dot:", index);

    setActiveChallenge(index);
  };

  // Reset activeChallenge when challenges change

  useEffect(() => {
    if (
      activeChallenge >= finalChallenges.length &&
      finalChallenges.length > 0
    ) {
      setActiveChallenge(0);
    }
  }, [finalChallenges.length, activeChallenge]);

  console.log(
    " [CHALLENGES PAGINATION] Active challenge:",

    activeChallenge,

    "Total:",

    finalChallenges.length
  );

  return (
    <section
      className="manufacturing-challenges py-20 relative overflow-hidden animate-background-glow theme-bg-animated"
      style={{ backgroundColor: "var(--color-brand-dark-navy)" }}
    >
      <SEO
        title="Manufacturing Challenges | Bellatrix Solutions for Complex Operations"
        description="Overcome manufacturing challenges with Bellatrix ERP. Address supply chain complexity, quality control, cost management, and operational inefficiencies."
        keywords="manufacturing challenges, supply chain complexity, quality control, manufacturing cost management, Bellatrix manufacturing solutions"
        ogTitle="Manufacturing Challenges | Bellatrix Solutions for Complex Operations"
        ogDescription="Comprehensive Bellatrix solutions to address critical manufacturing challenges and operational complexities."
        ogImage="/images/manufacturing-challenges.jpg"
      />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            className="text-blue-300"
          >
            <pattern
              id="challengesGrid"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
            </pattern>

            <rect width="100%" height="100%" fill="url(#challengesGrid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Title and Subtitle */}

        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {finalTitle}
          </h2>

          {finalSubtitle && (
            <p className="text-lg text-[var(--color-white)] leading-relaxed max-w-3xl mx-auto">
              {finalSubtitle}
            </p>
          )}
        </header>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Challenges Showcase - Left Side */}

          <div className="flex-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/10">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        finalChallenges[activeChallenge]?.icon ||
                        "M13 10V3L4 14h7v7l9-11h-7z"
                      }
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                  {typeof finalChallenges[activeChallenge]?.title === "string"
                    ? finalChallenges[activeChallenge]?.title
                    : finalChallenges[activeChallenge]?.title?.title ||
                      "Challenge Title"}
                </h3>

                <p className="text-gray-300 mb-4">
                  {typeof finalChallenges[activeChallenge]?.description ===
                  "string"
                    ? finalChallenges[activeChallenge]?.description
                    : finalChallenges[activeChallenge]?.description
                        ?.description || "Challenge Description"}
                </p>

                <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>

                    <span className="text-blue-300 font-semibold">
                      Impact: {finalChallenges[activeChallenge]?.impact}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge Navigation */}

            {finalChallenges.length > 1 && (
              <div className="flex space-x-2 mt-6 justify-center">
                {finalChallenges.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePaginationClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeChallenge === index ? "bg-blue-400" : "bg-gray-500"
                    }`}
                    aria-label={`Go to challenge ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}

            {finalChallenges.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No challenges data available</p>
              </div>
            )}
          </div>

          {/* Image - Right Side */}

          <div className="flex-1 flex justify-center">
            <div className="relative group max-w-xl">
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-2xl">
                <img
                  src={finalImage}
                  alt="Manufacturing Challenges"
                  className="w-full h-auto rounded-xl shadow-lg brightness-110 contrast-110 saturate-110 group-hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
