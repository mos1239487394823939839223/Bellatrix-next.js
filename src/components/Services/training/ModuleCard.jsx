// ModuleCard.jsx
import React from "react";

const ModuleCard = ({ module, index }) => {
  return (
    <>
      <article className="group relative overflow-hidden bg-gray-800 rounded-3xl p-6 border border-gray-600/50 shadow-2xl hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {module.title}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            {module.description}
          </p>
          <div className="text-xs text-blue-400 font-medium">
            Duration: {module.duration}
          </div>
        </div>
      </article>
    </>
  );
};

export default ModuleCard;
