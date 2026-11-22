import React from "react";
import OptimizedImg from "../../OptimizedImg";

const CaseStudiesSection = ({
  data,
  // Direct props from Page Builder schema
  title,
  description,
  caseStudies: propsCaseStudies,
}) => {
  // Support both direct props and data object
  const safeData = data || {};
  const finalTitle = title || safeData.title || "Retail Success Stories";
  const finalDescription =
    description ||
    safeData.description ||
    "Real retail companies achieving remarkable results with NetSuite commerce solutions.";

  // Get case studies from props or data
  let caseStudies = propsCaseStudies || safeData.caseStudies || [];

  // Default case studies if none provided
  const defaultCaseStudies = [
    {
      id: "case-1",
      title: "Modernizing Checkout for Fashion Retailer",
      company: "Fashion Forward Co.",
      industry: "Fashion Retail",
      quote: "NetSuite transformed our operations and customer experience.",
      challenge:
        "Legacy POS system causing checkout delays and inventory mismatches",
      solution:
        "Implemented unified POS and real-time inventory synchronization",
      description: "Complete digital transformation of retail operations",
      results: [
        "40% faster checkout",
        "95% inventory accuracy",
        "25% sales increase",
      ],
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "case-2",
      title: "E-commerce Integration Success",
      company: "Home Essentials Plus",
      industry: "Home & Garden",
      quote: "Seamless omnichannel experience for our customers.",
      challenge: "Disconnected online and in-store systems",
      solution: "NetSuite Commerce integration with unified inventory",
      description: "Full omnichannel retail transformation",
      results: [
        "60% online sales growth",
        "Real-time inventory sync",
        "Customer satisfaction up 35%",
      ],
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const finalCaseStudies =
    caseStudies.length > 0 ? caseStudies : defaultCaseStudies;

  console.log(" [RetailCaseStudiesSection] Rendering with:", {
    finalTitle,
    finalCaseStudies,
  });

  return (
    <section className="py-20 relative overflow-hidden theme-bg-primary bg-[var(--color-brand-dark-navy)]">

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            className="text-blue-300"
          >
            <pattern
              id="successGrid"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#successGrid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {finalTitle.includes(" ") ? (
              <>
                {finalTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="theme-highlight-text text-[var(--color-cyan-400)] transition-colors duration-600 ease-in-out">
                  {finalTitle.split(" ").slice(-1)[0]}
                </span>
              </>
            ) : (
              <span className="theme-highlight-text text-[var(--color-cyan-400)] transition-colors duration-600 ease-in-out">
                {finalTitle}
              </span>
            )}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {finalDescription}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {finalCaseStudies.map((study, index) => (
            <article
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
            >
              <div className="relative h-48">
                <OptimizedImg
                  src={study.image}
                  alt={study.company}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">
                    {typeof study.company === "string"
                      ? study.company
                      : study.company?.name ||
                        study.company?.title ||
                        "Company Name"}
                  </h3>
                  <p className="theme-accent-text text-[var(--color-cyan-300)] transition-colors duration-600 ease-in-out">
                    {typeof study.industry === "string"
                      ? study.industry
                      : study.industry?.name ||
                        study.industry?.title ||
                        "Industry"}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2">Challenge:</h4>
                  <p className="text-gray-300 text-sm">
                    {typeof study.challenge === "string"
                      ? study.challenge
                      : study.challenge?.challenge ||
                        study.challenge?.description ||
                        "Challenge Description"}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2">Solution:</h4>
                  <p className="text-gray-300 text-sm">
                    {typeof study.solution === "string"
                      ? study.solution
                      : study.solution?.solution ||
                        study.solution?.description ||
                        "Solution Description"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Results:</h4>
                  <div className="space-y-2">
                    {Array.isArray(study.results) ? study.results.map((result, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 theme-check-icon text-[var(--color-cyan-400)] transition-colors duration-600 ease-in-out"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-300 text-sm">
                          {typeof result === "string"
                            ? result
                            : result?.result ||
                              result?.name ||
                              result?.title ||
                              "Result"}
                        </span>
                      </div>
                    )) : (
                      <span className="text-gray-400 text-sm">
                        {typeof study.results === "string" ? study.results : "No results available"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
