import React from "react";

const IndustryStats = ({
  data,
  // Direct props from Page Builder schema
  title,
  subtitle,
  description,
  stats: propsStats,
}) => {
  // Support both direct props and data object
  const safeData = data || {};
  const finalTitle = title || safeData.title || "Retail Industry Stats";
  const finalSubtitle = subtitle || safeData.subtitle || "";
  const finalDescription = description || safeData.description || "";

  // Accept both array and object with stats/items for live preview compatibility
  let stats = propsStats || [];
  if (stats.length === 0) {
    if (Array.isArray(data)) {
      stats = data;
    } else if (Array.isArray(data?.stats)) {
      stats = data.stats;
    } else if (Array.isArray(data?.items)) {
      stats = data.items;
    } else if (Array.isArray(data?.data)) {
      stats = data.data;
    } else if (Array.isArray(data?.data?.stats)) {
      stats = data.data.stats;
    }
  }

  // Default stats if none provided
  const defaultStats = [
    {
      value: "85%",
      label: "Efficiency Improvement",
      description: "Average efficiency gain",
    },
    {
      value: "60%",
      label: "Cost Reduction",
      description: "Operational cost savings",
    },
    {
      value: "90%",
      label: "Accuracy Rate",
      description: "Data accuracy improvement",
    },
    {
      value: "75%",
      label: "Time Savings",
      description: "Process automation benefits",
    },
  ];

  const finalStats = stats.length > 0 ? stats : defaultStats;

  console.log(" [RetailIndustryStats] Rendering with:", {
    finalTitle,
    finalStats,
  });

  return (
    <section className="bg-white py-16">

      <div className="container mx-auto px-6">
        {(finalTitle || finalSubtitle || finalDescription) && (
          <header className="text-center mb-12">
            {finalTitle && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {finalTitle}
              </h2>
            )}
            {finalSubtitle && (
              <h3 className="text-xl text-gray-600 mb-2">{finalSubtitle}</h3>
            )}
            {finalDescription && (
              <p className="text-gray-600 max-w-3xl mx-auto">
                {finalDescription}
              </p>
            )}
          </header>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {finalStats.map((stat, index) => (
            <article key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 theme-stats-value text-[var(--color-brand-accent)] transition-colors duration-600 ease-in-out">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryStats;
