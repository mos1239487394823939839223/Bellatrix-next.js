import React from "react";
import { motion } from "framer-motion";

const AboutValues = ({ values = [], data = {} }) => {
  // Static fallback data (CMS data comes via props)
  const defaultData = {
    title: "Our Values",
    description:
      "These core values guide everything we do and shape how we interact with our clients, partners, and each other.",
    items: [],
  };

  // PRIORITIZE props data over default data for real-time preview
  const displayData = data ||
    defaultData || {
      title: "Our Values",
      description:
        "These core values guide everything we do and shape how we interact with our clients, partners, and each other.",
      items: [],
    };

  const defaultValues = [
    {
      icon: "",
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, delivering high-quality solutions that exceed expectations.",
    },
    {
      icon: "",
      title: "Integrity",
      description:
        "We conduct business with honesty, transparency, and ethical practices in all our relationships.",
    },
    {
      icon: "",
      title: "Innovation",
      description:
        "We embrace new technologies and creative approaches to solve complex business challenges.",
    },
    {
      icon: "",
      title: "Customer Focus",
      description:
        "We put our customers at the center of everything we do, ensuring their success is our success.",
    },
  ];

  const displayValues =
    Array.isArray(values) && values.length > 0
      ? values
      : Array.isArray(displayData.items) && displayData.items.length > 0
      ? displayData.items
      : defaultValues;

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
              id="valuesGrid"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#valuesGrid)" />
          </svg>
        </div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {displayData.title}
          </h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto about-values-description">
            {displayData.description}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {displayValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 rounded-2xl transition-all duration-300 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]"
              ></div>
              <div className="relative">
                <div className="text-4xl mb-4">{value.icon || ""}</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {value.title || "Value"}
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {value.description || "A core value that guides our work."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
