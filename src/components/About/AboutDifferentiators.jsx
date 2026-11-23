import React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader, CardGrid } from "../site";

const AboutDifferentiators = ({ differentiators = [], data = {} }) => {
  // Static fallback data (CMS data comes via props)
  const defaultData = {
    title: "What Sets Us Apart",
    description:
      "Our unique combination of expertise, methodology, and commitment to excellence makes us the preferred choice for Bellatrix implementations.",
    items: [],
  };

  // PRIORITIZE props data over default data for real-time preview
  const displayData = data || defaultData || {
    title: "What Sets Us Apart",
    description:
      "Our unique combination of expertise, methodology, and commitment to excellence makes us the preferred choice for Bellatrix implementations.",
    items: [],
  };

  const displayDifferentiators =
    differentiators.length > 0 ? differentiators : displayData.items;
    
  return (
    <Section tone="plain" width="container" containerClassName="px-6" className="bg-gray-50">
      <SectionHeader
        title={displayData.title}
        description={displayData.description}
        tone="none"
        className="mb-16"
        titleClassName="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--color-text-primary)] transition-colors duration-600 ease-in-out"
        descriptionClassName="text-lg leading-relaxed max-w-3xl mx-auto text-[var(--color-text-secondary)] transition-colors duration-600 ease-in-out"
      />
      <CardGrid columns={{ base: null, md: 2, lg: 4 }} gap="gap-8" equalHeight={false}>
          {Array.isArray(displayDifferentiators) &&
            displayDifferentiators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <h3
                  className="text-xl font-bold mb-4 text-[var(--color-text-primary)] transition-colors duration-600 ease-in-out"
                >
                  {item.title}
                </h3>
                <p
                  className="leading-relaxed text-[var(--color-text-secondary)] transition-colors duration-600 ease-in-out"
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
</CardGrid>
    </Section>
  );
};

export default AboutDifferentiators;
