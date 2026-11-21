import React, { useState, useEffect } from "react";
import { getIconPath } from "../../../utils/iconPaths";

const ImplementationStepper = ({ implementationProcess, labels = {} }) => {
  // Get dynamic labels with defaults
  const dynamicLabels = {
    keyDeliverablesTitle: labels.keyDeliverablesTitle || "Key Deliverables",
    implementationDetailsTitle: labels.implementationDetailsTitle || "Implementation Details",
    defaultStats: labels.defaultStats || [
      {
        title: "Efficient",
        description: "Streamlined process with proven methodologies",
        icon: "Bolt",
        color: "blue"
      },
      {
        title: "Proven",
        description: "Tested methodology with 98% success rate",
        icon: "CheckCircle",
        color: "green"
      }
    ]
  };

  // Ensure we have valid data and normalize it
  const safeProcessData = (implementationProcess || []).map(step => {
    // Handle benefits if string
    let benefits = step.benefits;
    if (typeof benefits === 'string') {
      benefits = benefits.split(',').map(b => b.trim()).filter(b => b);
    }

    return {
      ...step,
      benefits: Array.isArray(benefits) ? benefits : undefined,
      stats: Array.isArray(step.stats) ? step.stats : undefined
    };
  });

  const steps = [
    {
      title: safeProcessData[0]?.title || "Discovery & Assessment",
      desc:
        safeProcessData[0]?.desc ||
        safeProcessData[0]?.description ||
        "Analyze current manufacturing processes, systems, and requirements",
      details:
        safeProcessData[0]?.details ||
        "Comprehensive analysis of your existing manufacturing operations, including process mapping, system evaluation, and requirements gathering. We identify gaps and opportunities for improvement.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      benefits: safeProcessData[0]?.benefits || [
        "Current state assessment",
        "Gap analysis",
        "Requirements documentation",
        "Process mapping",
      ],
      stats: safeProcessData[0]?.stats,
    },
    {
      title: safeProcessData[1]?.title || "Solution Design",
      desc:
        safeProcessData[1]?.desc ||
        safeProcessData[1]?.description ||
        "Design NetSuite configuration tailored to manufacturing workflows",
      details:
        safeProcessData[1]?.details ||
        "Create a detailed blueprint for your NetSuite implementation, including system architecture, integration points, and customization requirements specific to manufacturing processes.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      benefits: safeProcessData[1]?.benefits || [
        "System architecture",
        "Process flows",
        "Integration design",
        "Custom requirements",
      ],
      stats: safeProcessData[1]?.stats,
    },
    {
      title: safeProcessData[2]?.title || "Configuration & Development",
      desc:
        safeProcessData[2]?.desc ||
        safeProcessData[2]?.description ||
        "Configure NetSuite modules and develop custom manufacturing features",
      details:
        safeProcessData[2]?.details ||
        "Implementation of NetSuite configuration based on the approved design, including custom script development, workflow automation, and integration setup.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      benefits: safeProcessData[2]?.benefits || [
        "Configured system",
        "Custom developments",
        "Integration setup",
        "Workflow automation",
      ],
      stats: safeProcessData[2]?.stats,
    },
    {
      title: safeProcessData[3]?.title || "Testing & Training",
      desc:
        safeProcessData[3]?.desc ||
        safeProcessData[3]?.description ||
        "Comprehensive testing and user training for manufacturing teams",
      details:
        safeProcessData[3]?.details ||
        "Thorough system testing including unit, integration, and user acceptance testing. Comprehensive training programs for all user groups to ensure smooth adoption.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      benefits: safeProcessData[3]?.benefits || [
        "Test results",
        "Training materials",
        "User documentation",
        "System validation",
      ],
      stats: safeProcessData[3]?.stats,
    },
    {
      title: safeProcessData[4]?.title || "Go-Live & Support",
      desc:
        safeProcessData[4]?.desc ||
        safeProcessData[4]?.description ||
        "Production deployment with ongoing support and optimization",
      details:
        safeProcessData[4]?.details ||
        "Carefully managed production deployment with real-time monitoring, immediate support, and post-implementation optimization to ensure successful system adoption.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      benefits: safeProcessData[4]?.benefits || [
        "Live system",
        "Support documentation",
        "Performance monitoring",
        "Optimization",
      ],
      stats: safeProcessData[4]?.stats,
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-progression functionality - runs automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full">
      {/* Step indicators - Desktop */}
      <div className="hidden md:flex mb-20 relative">
        <div className="flex justify-between items-center w-full relative">
          {/* Progress bar */}
          <div className="absolute top-7 left-7 right-7 h-2 bg-gray-200 rounded-full z-0"></div>
          <div
            className="absolute top-7 left-7 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{
              width: `${7 + (current / (steps.length - 1)) * (100 - 14)}%`,
            }}
          ></div>
          {/* Step circles */}
          {steps.map((step, idx) => (
            <div key={idx} className="z-10 flex flex-col items-center relative">
              <button
                onClick={() => setCurrent(idx)}
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 border-2 shadow-lg hover:scale-105
                  ${
                    idx <= current
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-blue-200"
                      : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
                  }`}
              >
                {idx <= current && React.isValidElement(steps[idx]?.icon) ? (
                  <div className="text-white">{steps[idx]?.icon}</div>
                ) : (
                  <span className="font-semibold">{idx + 1}</span>
                )}
              </button>
              <span
                className={`text-sm font-medium max-w-[140px] text-center transition-colors duration-300 leading-tight absolute top-16
                ${idx <= current ? "text-blue-700" : "text-gray-500"}`}
              >
                {typeof step.title === "string"
                  ? step.title
                  : step.title?.title || step.title?.name || "Step Title"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step indicators - Mobile */}
      <div className="flex md:hidden mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex space-x-3">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg border text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center space-x-2
                ${
                  idx === current
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
            >
              <span className="text-xs">{idx + 1}</span>
              <span>
                {typeof step.title === "string"
                  ? step.title
                  : step.title?.title || step.title?.name || "Step Title"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
          <div className="lg:w-2/5">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {typeof steps[current]?.title === "string"
                ? steps[current]?.title
                : steps[current]?.title?.title ||
                  steps[current]?.title?.name ||
                  "Step Title"}
            </h3>
            <p className="text-lg font-medium text-gray-700 mb-6">
              {typeof steps[current]?.desc === "string"
                ? steps[current]?.desc
                : steps[current]?.desc?.desc ||
                  steps[current]?.desc?.description ||
                  "Step Description"}
            </p>

            {/* Key Benefits */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                {dynamicLabels.keyDeliverablesTitle}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {steps[current].benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
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
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation controls - Desktop */}
            <div className="hidden md:flex mt-6">
              <button
                type="button"
                aria-label="Previous step"
                onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
                disabled={current === 0}
                className={`mr-3 p-3 rounded-full border-2 transition-all duration-200 ${
                  current === 0
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <svg aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next step"
                onClick={() =>
                  setCurrent((prev) => Math.min(steps.length - 1, prev + 1))
                }
                disabled={current === steps.length - 1}
                className={`p-3 rounded-full border-2 transition-all duration-200 ${
                  current === steps.length - 1
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <svg aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="lg:w-3/5">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                {dynamicLabels.implementationDetailsTitle}
              </h4>
              <p className="text-gray-700 leading-relaxed mb-6">
                {typeof steps[current]?.details === "string"
                  ? steps[current]?.details
                  : steps[current]?.details?.details ||
                    steps[current]?.description ||
                    "Step Details"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(steps[current].stats && steps[current].stats.length > 0 
                  ? steps[current].stats 
                  : dynamicLabels.defaultStats
                ).map((stat, idx) => {
                  const iconPathData = getIconPath(stat.icon) || stat.icon || "M13 10V3L4 14h7v7l9-11h-7z";
                  const color = stat.color || (idx === 0 ? "blue" : "green");
                  
                  return (
                    <div key={idx} className={`bg-white rounded-lg p-4 border border-${color}-100`}>
                      <div className={`flex items-center text-${color}-600 mb-2`}>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={iconPathData}
                          />
                        </svg>
                        <span className="font-medium">{stat.title}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {stat.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation controls */}
      <div className="flex justify-center mt-6 md:hidden">
        <button
                type="button"
                aria-label="Previous step"
          onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
          disabled={current === 0}
          className={`mr-3 p-3 rounded-full border-2 transition-all duration-200 ${
            current === 0
              ? "text-gray-300 border-gray-200 cursor-not-allowed"
              : "text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <svg aria-hidden="true"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="flex items-center px-3 sm:px-4 text-sm text-gray-500 font-medium whitespace-nowrap" aria-live="polite">
          {current + 1} of {steps.length}
        </span>
        <button
                type="button"
                aria-label="Next step"
          onClick={() =>
            setCurrent((prev) => Math.min(steps.length - 1, prev + 1))
          }
          disabled={current === steps.length - 1}
          className={`p-3 rounded-full border-2 transition-all duration-200 ${
            current === steps.length - 1
              ? "text-gray-300 border-gray-200 cursor-not-allowed"
              : "text-gray-600 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <svg aria-hidden="true"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImplementationStepper;
