import React from "react";
import { motion } from "framer-motion";

const AboutMilestones = ({ milestones = [], data = {} }) => {
  // Static fallback data (CMS data comes via props)
  const defaultData = {
    title: "Our Journey in Numbers",
    description:
      "Key milestones that mark our growth and success in delivering exceptional Bellatrix solutions.",
    items: [],
  };

  // PRIORITIZE props data over default data for real-time preview
  const displayData = data || defaultData || {
    title: "Our Journey in Numbers",
    description:
      "Key milestones that mark our growth and success in delivering exceptional Bellatrix solutions.",
    items: [],
  };

  const displayMilestones =
    milestones.length > 0 ? milestones : displayData.items;

  return (
    <section
      className="py-20 relative overflow-hidden animate-background-glow theme-bg-animated bg-[var(--color-brand-dark-navy)]"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            className="text-[var(--color-blue-300)] transition-colors duration-600 ease-in-out"
          >
            <pattern
              id="milestonesGrid"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#milestonesGrid)" />
          </svg>
        </div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {displayData.title}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {displayData.description}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(displayMilestones) &&
            displayMilestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-5xl font-bold text-[var(--color-cyan-400)] transition-colors duration-600 ease-in-out mb-4">
                  {milestone.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {milestone.title}
                </h3>
                <p className="text-gray-300">{milestone.description}</p>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default AboutMilestones;
