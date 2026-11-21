import React, { useState, useEffect } from "react";

const SolutionsSection = ({
  data,
  activeSolution: propActiveSolution,
  setActiveSolution: propSetActiveSolution,
  // Direct props from Page Builder schema
  title,
  subtitle,
  description,
  netSuiteSolutions: propsNetSuiteSolutions,
  image,
}) => {
  // Internal state for activeSolution if not provided by parent
  const [internalActiveSolution, setInternalActiveSolution] = useState(0);
  const activeSolution =
    propActiveSolution !== undefined
      ? propActiveSolution
      : internalActiveSolution;
  const setActiveSolution = propSetActiveSolution || setInternalActiveSolution;

  // Ensure data is safe and provide fallback
  const safeData = data || {};

  // Support both direct props and data object
  const finalTitle = title || safeData.title || "NetSuite Solutions";
  const finalSubtitle =
    subtitle || safeData.subtitle || "Comprehensive Retail Solutions";
  const finalDescription =
    description ||
    safeData.description ||
    "Comprehensive retail solutions that unify your commerce operations, from inventory management to customer experience optimization.";
  const finalImage =
    image ||
    safeData.image ||
    "https://i.pinimg.com/736x/5d/33/74/5d33743cd85ff60ff425a2614a87503f.jpg";

  // Safely extract solutions with proper array validation
  let netSuiteSolutions = propsNetSuiteSolutions || [];
  if (netSuiteSolutions.length === 0) {
    if (Array.isArray(safeData.netSuiteSolutions)) {
      netSuiteSolutions = safeData.netSuiteSolutions;
    } else if (Array.isArray(safeData.solutions)) {
      netSuiteSolutions = safeData.solutions;
    } else if (Array.isArray(safeData.items)) {
      netSuiteSolutions = safeData.items;
    }
  }

  // Default solutions if none provided
  const defaultSolutions = [
    {
      title: "E-commerce Platform",
      description: "Complete e-commerce solution with NetSuite integration",
      features: ["Online store", "Payment processing", "Order management"],
      benefits: "50% increase in online sales",
    },
    {
      title: "Inventory Management",
      description: "Advanced inventory control and tracking",
      features: [
        "Real-time tracking",
        "Multi-location",
        "Automated reordering",
      ],
      benefits: "30% reduction in stockouts",
    },
    {
      title: "Customer Experience",
      description: "Unified customer experience across all channels",
      features: [
        "360° customer view",
        "Personalization",
        "Omnichannel support",
      ],
      benefits: "40% improvement in customer satisfaction",
    },
  ];

  const finalSolutions =
    netSuiteSolutions.length > 0 ? netSuiteSolutions : defaultSolutions;
  const safeActiveSolution = Math.min(
    activeSolution || 0,
    finalSolutions.length - 1
  );

  // Auto-rotate solutions
  useEffect(() => {
    if (finalSolutions.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSolution((prev) => (prev + 1) % finalSolutions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [finalSolutions.length, setActiveSolution]);

  console.log(" [RetailSolutionsSection] Rendering with:", {
    finalTitle,
    finalSolutions,
  });

  return (
    <section className="bg-gray-50 py-20 light-section">

      <div className="container mx-auto px-6">
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            {finalTitle.includes(" ") ? (
              <>
                {finalTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="theme-primary-text text-[var(--color-brand-accent)] transition-colors duration-600 ease-in-out">
                  {finalTitle.split(" ").slice(-1)[0]}
                </span>
              </>
            ) : (
              <span className="theme-primary-text text-[var(--color-brand-accent)] transition-colors duration-600 ease-in-out">
                {finalTitle}
              </span>
            )}
          </h2>
          {finalSubtitle && (
            <h3 className="text-xl text-gray-700 mb-4">{finalSubtitle}</h3>
          )}
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {finalDescription}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image - Left Side */}
          <div className="flex-1 flex justify-center">
            <div className="relative group max-w-xl">
              <div className="absolute -inset-8 opacity-30 group-hover:opacity-60 transition-all duration-700">
                <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/20 via-cyan-500/30 to-blue-600/20 rounded-3xl blur-2xl"></div>
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/15 via-blue-500/20 to-cyan-500/15 rounded-2xl blur-xl"></div>
                <div className="absolute -inset-2 bg-gradient-to-tr from-white/10 via-blue-300/20 to-white/10 rounded-xl blur-lg"></div>
              </div>

              <div className="relative bg-gradient-to-br from-gray-900/10 via-blue-900/5 to-gray-900/10 rounded-3xl p-6 backdrop-blur-md border border-white/30 shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500">
                <div className="relative bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 rounded-2xl p-4 border border-white/20">
                  <img
                    src={finalImage}
                    alt="NetSuite Retail Solutions"
                    className="w-full h-110 object-cover rounded-xl shadow-2xl brightness-105 contrast-110 saturate-105 group-hover:brightness-110 group-hover:contrast-115 group-hover:saturate-110 transition-all duration-500 filter drop-shadow-xl"
                  />

                  <div className="absolute inset-4 rounded-xl bg-gradient-to-tr from-blue-500/5 via-transparent to-cyan-400/5 pointer-events-none"></div>
                  <div className="absolute inset-4 rounded-xl bg-gradient-to-bl from-transparent via-white/3 to-transparent pointer-events-none"></div>
                </div>

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

                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400/40 rounded-tl-3xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400/40 rounded-bl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/40 rounded-br-3xl"></div>
              </div>

              <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <span>NetSuite Expert</span>
                </div>
              </div>
            </div>
          </div>

          {/* Solutions Showcase - Right Side */}
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-bold text-gray-800">
              {typeof finalSolutions[safeActiveSolution]?.title === "string"
                ? finalSolutions[safeActiveSolution]?.title
                : finalSolutions[safeActiveSolution]?.title?.title ||
                  "Solution Title"}
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {typeof finalSolutions[safeActiveSolution]?.description ===
              "string"
                ? finalSolutions[safeActiveSolution]?.description
                : finalSolutions[safeActiveSolution]?.description
                    ?.description || "Solution Description"}
            </p>

            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Key Features:
              </h4>
              {(() => {
                let features = finalSolutions[safeActiveSolution]?.features;

                // Handle string features (comma separated)
                if (typeof features === 'string') {
                  features = features.split(',').map(f => f.trim()).filter(f => f);
                }

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
                  {typeof finalSolutions[safeActiveSolution]?.benefits ===
                  "string"
                    ? finalSolutions[safeActiveSolution]?.benefits
                    : finalSolutions[safeActiveSolution]?.benefits?.benefits ||
                      "Improved Results"}
                </span>
              </div>
            </div>

            {/* Solution Navigation */}
            <div className="flex gap-4 mt-6 justify-center">
              {finalSolutions.map((_, index) => (
                <button
                  type="button"
                  aria-label={`Show item ${index + 1}`}
                  aria-current={activeSolution === index ? "true" : undefined}
                  key={index}
                  onClick={() => setActiveSolution(index)}
                  className={`relative w-3 h-3 rounded-full after:absolute after:-inset-2 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-all duration-300 ${
                    activeSolution === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
