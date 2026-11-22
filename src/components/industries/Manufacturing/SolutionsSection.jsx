import React, { useState, useEffect } from "react";
import OptimizedImg from "../../OptimizedImg";

const SolutionsSection = (props) => {
  console.log(" [SolutionsSection] ALL PROPS:", props);

  // Handle both flat and nested prop structures
  const title = props?.title || props?.data?.title;
  const subtitle = props?.subtitle || props?.data?.subtitle;
  const description = props?.description || props?.data?.description;
  const image = props?.image || props?.data?.image;
  const solutions =
    props?.solutions ||
    props?.items ||
    props?.data?.solutions ||
    props?.data?.items ||
    [];

  // Internal state management for pagination
  const [activeSolution, setActiveSolution] = useState(0);

  // Ensure activeSolution is within bounds
  const safeActiveSolution = Math.max(
    0,
    Math.min(activeSolution, solutions.length - 1)
  );

  // Default data as fallback ONLY if no form data is provided
  const defaultData = {
    title: "NetSuite Solutions",
    subtitle: "Comprehensive manufacturing solutions",
    description:
      "Comprehensive manufacturing solutions that address every aspect of your operations, from planning to production to delivery.",
    solutions: [
      {
        title: "Production Management",
        description: "End-to-end production planning and execution",
        features: ["Work orders", "Routing", "Capacity planning"],
        benefits: "40% improvement in production efficiency",
      },
      {
        title: "Inventory Control",
        description: "Advanced inventory management capabilities",
        features: ["Multi-location", "Serial tracking", "Cycle counting"],
        benefits: "30% reduction in inventory costs",
      },
      {
        title: "Quality Assurance",
        description: "Comprehensive quality control systems",
        features: ["Quality gates", "Defect tracking", "Compliance reporting"],
        benefits: "99.5% quality achievement rate",
      },
    ],
  };

  // PRIORITIZE FORM DATA OVER DEFAULTS
  const finalTitle = title || defaultData.title;
  const finalSubtitle = subtitle || defaultData.subtitle;
  const finalDescription = description || defaultData.description;
  const finalImage =
    image ||
    "https://i.pinimg.com/1200x/19/e6/91/19e6918482b92f0f7e31e68d376bf711.jpg";
  const finalSolutions =
    solutions.length > 0 ? solutions : defaultData.solutions;

  // Handle pagination dot clicks
  const handlePaginationClick = (index) => {
    setActiveSolution(index);
  };

  // Reset activeSolution when solutions change
  useEffect(() => {
    if (activeSolution >= finalSolutions.length && finalSolutions.length > 0) {
      setActiveSolution(0);
    }
  }, [finalSolutions.length, activeSolution]);

  // Auto-advance carousel (optional)
  useEffect(() => {
    if (finalSolutions.length > 1) {
      const interval = setInterval(() => {
        setActiveSolution((prev) => (prev + 1) % finalSolutions.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [finalSolutions.length]);

  return (
    <section className="manufacturing-solutions bg-gray-50 py-20 light-section">

      <div className="container mx-auto px-6">
        {/* Title and Subtitle */}
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            {finalTitle}
          </h2>
          {finalSubtitle && (
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {finalSubtitle}
            </p>
          )}
          {finalDescription && (
            <p className="text-base text-gray-500 leading-relaxed max-w-4xl mx-auto mt-4">
              {finalDescription}
            </p>
          )}
        </header>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image - Left Side - SIMPLIFIED */}
          <div className="flex-1 flex justify-center">
            <div className="max-w-2xl w-full">
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-lg">
                <OptimizedImg
                  src={finalImage}
                  alt="NetSuite Manufacturing Solutions"
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Solutions Showcase - Right Side */}
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-bold text-gray-800">
              {(() => {
                const currentSolution = finalSolutions[safeActiveSolution];
                const title = currentSolution?.title;
                return typeof title === "string"
                  ? title
                  : title?.title || "Solution Title";
              })()}
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {(() => {
                const currentSolution = finalSolutions[safeActiveSolution];
                const description = currentSolution?.description;
                return typeof description === "string"
                  ? description
                  : description?.description || "Solution Description";
              })()}
            </p>

            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Key Features:
              </h4>
              {(() => {
                const currentSolution = finalSolutions[safeActiveSolution];
                const features = currentSolution?.features;

                // Ensure features is an array
                if (!Array.isArray(features)) {
                  return (
                    <div className="text-gray-500 text-sm">
                      No features available for this solution.
                    </div>
                  );
                }

                return features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-600">
                      {typeof feature === "string"
                        ? feature
                        : feature?.name || feature?.title || "Feature"}
                    </span>
                  </div>
                ));
              })()}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-blue-700 font-semibold">
                  Result:{" "}
                  {(() => {
                    const currentSolution = finalSolutions[safeActiveSolution];
                    const benefits = currentSolution?.benefits;
                    return typeof benefits === "string"
                      ? benefits
                      : benefits?.benefits || "Improved Results";
                  })()}
                </span>
              </div>
            </div>

            {/* Solution Navigation */}
            {finalSolutions.length > 1 && (
              <div className="flex gap-5 mt-6 justify-center">
                {finalSolutions.map((_, index) => (
                  <button
                  type="button"
                  aria-current={activeSolution === index ? "true" : undefined}
                    key={index}
                    onClick={() => handlePaginationClick(index)}
                    className={`relative w-3 h-3 rounded-full after:absolute after:-inset-[10px] after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-all duration-300 ${
                      activeSolution === index ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    aria-label={`Go to solution ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {finalSolutions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No solutions data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
