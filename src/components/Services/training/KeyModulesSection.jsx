// KeyModulesSection.jsx
import React from "react";
import ModuleCard from "./ModuleCard";
import { Section, SectionHeader, CardGrid } from "../../site";

const KeyModulesSection = ({ keyModulesSection, keyModules }) => {
  // Ensure we always have a valid section object and modules array to avoid runtime errors
  const section = keyModulesSection || {
    title: "Key Training Modules",
    description:
      "Comprehensive curriculum designed to master NetSuite from foundation to advanced implementation",
  };

  const safeTitle = section.title || "Key Training Modules";

  const modules = Array.isArray(keyModules) ? keyModules : [];
  return (
    <>
      <Section tone="navy" padding="sm" width="container" containerClassName="px-6 relative z-10" style={{ backgroundColor: "#001038" }}>
        <SectionHeader
          title={safeTitle}
          description={section.description}
          tone="none"
          className="mb-12"
          titleClassName="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          descriptionClassName="text-lg text-[var(--color-white)] leading-relaxed max-w-3xl mx-auto"
          highlight="rest"
          highlightClassName=""
          highlightStyle={{ color: "#60a5fa" }}
        />
        <CardGrid columns={{ md: 2, lg: 3 }} gap="gap-8" equalHeight={false}>
            {modules.map((module, index) => (
              <ModuleCard key={index} module={module} index={index} />
            ))}
</CardGrid>
      </Section>
    </>
  );
};

export default KeyModulesSection;
