import React from "react";
import { Section, SectionHeader, CardGrid, FeatureCard } from "../../site";




const ModulesSection = ({ data = {} }) => {

  // اعتمد فقط على البيانات القادمة من props

  const title = data.title || "Product Modules";

  const description = data.description || "";

  const modules = Array.isArray(data.modules)

    ? data.modules.map((m) => ({

        ...m,

        description: m.description || m.desc || "Module description",

      }))

    : [];



  // Debug logging for real-time updates

  console.log(" [HRModulesSection] Component received data:", {

    hasPropsData: !!(data && data.modules),

    propsData: data,

    finalData: modules,

    timestamp: new Date().toISOString(),

  });

  return (
    <Section tone="navy" glow className="animate-fade-in-up">
      <SectionHeader title={title} description={description} tone="dark" titleClassName="text-3xl font-bold mb-6" />
      <CardGrid columns={{ sm: 2, lg: 3 }}>
        {modules.map((m, idx) => (
          <FeatureCard
            key={idx}
            variant="glass"
            title={m.title || "Module"}
            description={m.description}
            ariaLabel={`HR Module: ${m.title || "Module"}`}
          />
        ))}
      </CardGrid>
    </Section>
  );
};



export default ModulesSection;

