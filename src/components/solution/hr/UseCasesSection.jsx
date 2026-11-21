import React from "react";

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
    <>
      <section className="py-20 bg-[var(--color-bg-secondary)] animate-fade-in-up light-section">
        <div className="max-w-6xl mx-auto px-4">
          <header className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-3 text-[var(--color-primary-dark)]">
              {title}
            </h2>
            {description && (
              <p className="text-lg text-[var(--color-text-secondary)] mb-3">
                {description}
              </p>
            )}
            <div className="mx-auto w-16 h-1 bg-[var(--color-primary)] rounded-full"></div>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {useCases.length > 0 ? (
              useCases.map((u, idx) => (
                <article
                  key={idx}
                  className="bg-[var(--color-bg-primary)] rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-[var(--color-border-primary)] transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                  role="article"
                  aria-label={`HR Use Case: ${u.title}`}
                >
                  <h3 className="font-bold text-lg text-[var(--color-primary-dark)] mb-2">
                    {u.title}
                  </h3>
                  {u.description && (
                    <p className="text-[var(--color-text-secondary)] text-sm">
                      {u.description}
                    </p>
                  )}
                </article>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No use cases added yet. Add some in the form.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default UseCasesSection;
