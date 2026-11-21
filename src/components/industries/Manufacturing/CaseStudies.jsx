import React from "react";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";


import { useComponentData } from "../../../utils/useComponentData";

import manufacturingData from "../../../data/manufacturing-data.json";

const CaseStudies = (props) => {
  // Handle both flat props and data object
  const title = props?.title || props?.data?.title;
  const description = props?.description || props?.data?.description;
  const items =
    props?.items ||
    props?.caseStudies ||
    props?.data?.items ||
    props?.data?.caseStudies;

  // Merge props with default data from JSON (fallback only)
  const finalData = useComponentData(
    "caseStudies",
    props?.data,
    manufacturingData
  );

  // PRIORITIZE direct props over merged data
  const finalTitle = title || finalData.title;
  const finalDescription = description || finalData.description;
  const finalItems = items || finalData.items || [];

  console.log(" [CaseStudies] Data merge:", {
    props: props,

    defaultData: manufacturingData.caseStudies,

    finalData: finalData,

    itemsCount: finalItems?.length,

    title: finalTitle,

    description: finalDescription,

    hasTitle: !!finalTitle,

    hasDescription: !!finalDescription,
  });

  // Debug: Log the exact values being used

  console.log(" [CaseStudies] Title/Description Debug:", {
    titleFromProps: props?.data?.title,

    descriptionFromProps: props?.data?.description,

    finalTitle: finalData.title,

    finalDescription: finalData.description,

    titleSplit: finalData.title ? finalData.title.split(" ") : null,
  });

  return (
    <section
      className="py-20 relative overflow-hidden animate-background-glow theme-bg-animated"
      style={{ backgroundColor: "var(--color-brand-dark-navy)" }}
    >

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
            {finalTitle ? finalTitle.split(" ")[0] : "Success"}{" "}
            <span className="text-cyan-400">
              {finalTitle
                ? finalTitle.split(" ").slice(1).join(" ")
                : "Stories"}
            </span>
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {finalDescription ||
              "Real manufacturing companies achieving remarkable results with NetSuite solutions."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {(Array.isArray(finalItems) ? finalItems : []).map((study, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/10"
            >
              <div className="relative h-48">
                <img
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

                  <p className="text-cyan-300">
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
                    {(() => {
                      const results = study.results;

                      // Ensure results is an array

                      if (!Array.isArray(results)) {
                        // If results is a string, convert it to array

                        if (typeof results === "string") {
                          return (
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-4 h-4 text-cyan-400"
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
                                {results}
                              </span>
                            </div>
                          );
                        }

                        // If results is not available or not an array, show fallback

                        return (
                          <div className="text-gray-400 text-sm">
                            Results not available for this case study.
                          </div>
                        );
                      }

                      // If results is an array, map over it

                      return results.map((result, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4 text-cyan-400"
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
                            {result}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
