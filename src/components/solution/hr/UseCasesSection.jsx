import React from "react";
import { Section, SectionHeader, CardGrid, FeatureCard } from "../../site";

const UseCasesSection = (props) => {
  // Handle both { data: ... } usage and spread props usage from LivePreview
  const contentData = props.data || props;
  
  // Get title - make sure it's a string, not an array or object
  let title = contentData.title;
  if (Array.isArray(title)) {
    title = title[0] || "Who Is It For?";
  } else if (typeof title !== 'string') {
    title = "Who Is It For?";
  }
  
  const description = contentData.description || "";
  
  // Check for useCases first, then items as fallback
  let rawUseCases = contentData.useCases || contentData.items || [];
  
  // Normalize useCases to be an array of objects with title and description
  const useCases = Array.isArray(rawUseCases) 
    ? rawUseCases.map((item, index) => {
        // Handle if item is a string
        if (typeof item === 'string') {
          return { title: item, description: '' };
        }
        // Handle if item is an object
        if (typeof item === 'object' && item !== null) {
          return {
            title: item.title || item.name || `Use Case ${index + 1}`,
            description: item.description || item.desc || ''
          };
        }
        // Fallback for weird data
        return { title: `Use Case ${index + 1}`, description: '' };
      })
    : [];

  // Debug logging
  console.log(" [HRUseCasesSection] Final processed data:", {
    title,
    description,
    useCasesCount: useCases.length,
    useCases: useCases,
    rawInput: { props, contentData, rawUseCases }
  });
  
  return (
    <Section tone="muted" className="animate-fade-in-up">
      <SectionHeader
        title={title}
        description={description}
        accent
        titleClassName="text-3xl font-extrabold mb-3"
        descriptionClassName="text-lg mb-3"
      />
      {useCases.length > 0 ? (
        <CardGrid columns={{ sm: 2, lg: 4 }} gap="gap-6">
          {useCases.map((u, idx) => (
            <FeatureCard
              key={idx}
              variant="elevated"
              title={u.title}
              description={u.description}
              ariaLabel={`HR Use Case: ${u.title}`}
            />
          ))}
        </CardGrid>
      ) : (
        <div className="text-center text-gray-500 py-10">No use cases added yet. Add some in the form.</div>
      )}
    </Section>
  );
};

export default UseCasesSection;
