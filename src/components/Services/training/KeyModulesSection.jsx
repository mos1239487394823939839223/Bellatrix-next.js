// KeyModulesSection.jsx
import React from "react";
import SEO from "../../SEO";
import ModuleCard from "./ModuleCard";

const KeyModulesSection = ({ keyModulesSection, keyModules }) => {
  // Ensure we always have a valid section object and modules array to avoid runtime errors
  const section = keyModulesSection || {
    title: "Key Training Modules",
    description:
      "Comprehensive curriculum designed to master NetSuite from foundation to advanced implementation",
  };

  const safeTitle = section.title || "Key Training Modules";
  const [firstWord, ...restWords] = safeTitle.split(" ");
  const highlightedTitle = restWords.join(" ");

  const modules = Array.isArray(keyModules) ? keyModules : [];
  return (
    <>
      <SEO
        title="Bellatrix Training Modules | Comprehensive ERP Learning Curriculum"
        description="Explore key Bellatrix training modules covering implementation, financials, inventory, CRM, and advanced customization for comprehensive ERP education and skill development."
        keywords="NetSuite training modules, Oracle ERP curriculum, NetSuite learning modules, ERP training courses, NetSuite education modules, Oracle training curriculum"
        ogTitle="NetSuite Training Modules - Comprehensive Oracle ERP Learning"
        ogDescription="Master Bellatrix with structured training modules. Comprehensive curriculum covering all aspects of ERP implementation and management."
        ogImage="/images/netsuite-training-modules.jpg"
      />
      <section
        className="py-12"
        style={{
          backgroundColor: "#001038",
        }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {firstWord}{" "}
              <span style={{ color: "#60a5fa" }}>{highlightedTitle}</span>
            </h2>
            <p className="text-lg text-[var(--color-white)] leading-relaxed max-w-3xl mx-auto">
              {section.description}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <ModuleCard key={index} module={module} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default KeyModulesSection;
