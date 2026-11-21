// FeatureCard.jsx
import React from "react";

const FeatureCard = ({ feature, openFeatureModal, index }) => {
  // Add null checks for feature data
  if (!feature) {
    return (
      <article className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center text-gray-500">
          <p>Feature data unavailable</p>
        </div>
      </article>
    );
  }

  return (
    <>
      <article
        className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 p-6 animate-fade-in-up"
        style={{ animationDelay: `${0.1 * (index + 1)}s` }}
      >
        <div className="relative z-10">

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            {feature.title || "Bellatrix Training Feature"}
          </h3>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-4 text-sm">
            {feature.shortDescription ||
              feature.description ||
              "Professional Bellatrix training feature description"}
          </p>

          {/* Learn More Link — only when there is detail content to open */}
          {typeof openFeatureModal === "function" && (
          <button
            type="button"
            data-no-cta-intercept
            onClick={() => openFeatureModal(feature)}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-300 group-hover:translate-x-1 transform cursor-pointer"
            aria-label={`Learn more about ${
              feature.title || "training feature"
            }`}
          >
            Learn More
            <svg
              className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          )}
        </div>
      </article>
    </>
  );
};

export default FeatureCard;
