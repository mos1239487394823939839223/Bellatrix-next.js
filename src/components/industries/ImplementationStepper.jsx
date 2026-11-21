import React, { useState, useEffect } from "react";

const ImplementationStepper = ({ steps = [], useCustomIcons = false }) => {
  const defaultSteps = steps.length > 0 ? steps : [
    {
      title: "Discovery & Planning",
      desc: "Understand your business requirements and plan the implementation.",
      details: "We analyze your current processes, identify pain points, and create a comprehensive implementation roadmap tailored to your business needs.",
      benefits: [
        "Business process analysis",
        "Requirements gathering",
        "Implementation roadmap",
        "Timeline estimation",
      ],
    },
    {
      title: "Configuration & Setup",
      desc: "Configure NetSuite to match your business processes.",
      details: "Our team configures NetSuite modules, workflows, and customizations to align with your specific business requirements and industry best practices.",
      benefits: [
        "Module configuration",
        "Workflow setup",
        "Custom fields & forms",
        "User roles & permissions",
      ],
    },
    {
      title: "Data Migration",
      desc: "Safely migrate your existing data to NetSuite.",
      details: "We handle the complete data migration process, ensuring data integrity, validation, and seamless transition from your legacy systems to NetSuite.",
      benefits: [
        "Data mapping",
        "Data validation",
        "Migration scripts",
        "Testing & verification",
      ],
    },
    {
      title: "Integration & Testing",
      desc: "Integrate with third-party systems and conduct thorough testing.",
      details: "We integrate NetSuite with your existing systems, perform comprehensive testing, and ensure all integrations work seamlessly before go-live.",
      benefits: [
        "API integrations",
        "System testing",
        "User acceptance testing",
        "Performance optimization",
      ],
    },
    {
      title: "Training & Go-Live",
      desc: "Train your team and launch NetSuite successfully.",
      details: "We provide comprehensive training to your team, support the go-live process, and ensure a smooth transition to the new system with minimal disruption.",
      benefits: [
        "User training",
        "Documentation",
        "Go-live support",
        "Post-launch optimization",
      ],
    },
  ];

  // Default icons for stepper steps
  const getStepIcon = (index) => {
    const icons = [
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>,
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
      </svg>,
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
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>,
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
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>,
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
      </svg>,
    ];
    return icons[index] || icons[0];
  };

  const [current, setCurrent] = useState(0);

  // Auto-progression functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % defaultSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [defaultSteps.length]);

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
              width: `${7 + (current / (defaultSteps.length - 1)) * (100 - 14)}%`,
            }}
          ></div>
          {/* Step circles */}
          {defaultSteps.map((step, idx) => (
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
                {idx <= current ? (
                  <div className="text-white">
                    {useCustomIcons && defaultSteps[idx]?.icon
                      ? defaultSteps[idx].icon
                      : getStepIcon(idx)}
                  </div>
                ) : (
                  <span className="font-semibold">{idx + 1}</span>
                )}
              </button>
              <span
                className={`text-sm font-medium max-w-[140px] text-center transition-colors duration-300 leading-tight absolute top-16
                ${idx <= current ? "text-blue-700" : "text-gray-500"}`}
              >
                {step?.title || `Step ${idx + 1}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step indicators - Mobile */}
      <div className="flex md:hidden mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex space-x-3">
          {defaultSteps.map((step, idx) => (
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
              <span>{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
          <div className="lg:w-2/5">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {defaultSteps[current]?.title || "Step Title"}
            </h3>
            <p className="text-lg font-medium text-gray-700 mb-6">
              {defaultSteps[current]?.desc || "Step description"}
            </p>

            {/* Key Benefits */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                {defaultSteps[current]?.benefitsLabel || "Key Benefits"}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {(defaultSteps[current]?.benefits || []).map((benefit, idx) => (
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
                  setCurrent((prev) => Math.min(defaultSteps.length - 1, prev + 1))
                }
                disabled={current === defaultSteps.length - 1}
                className={`p-3 rounded-full border-2 transition-all duration-200 ${
                  current === defaultSteps.length - 1
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
                {defaultSteps[current]?.detailsLabel || "How It Works"}
              </h4>
              <p className="text-gray-700 leading-relaxed mb-6">
                {defaultSteps[current]?.details || "Step details not available"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center text-blue-600 mb-2">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="font-medium">Automated</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Streamlined process with minimal manual intervention
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center text-green-600 mb-2">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">Reliable</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Proven methodology with enterprise-grade reliability
                  </p>
                </div>
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
          {current + 1} of {defaultSteps.length}
        </span>
        <button
                type="button"
                aria-label="Next step"
          onClick={() =>
            setCurrent((prev) => Math.min(defaultSteps.length - 1, prev + 1))
          }
          disabled={current === defaultSteps.length - 1}
          className={`p-3 rounded-full border-2 transition-all duration-200 ${
            current === defaultSteps.length - 1
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

