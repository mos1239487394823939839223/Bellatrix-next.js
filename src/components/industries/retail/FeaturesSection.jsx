import SEO from "../../SEO";

const FeaturesSection = ({
  data,
  // Direct props from Page Builder schema
  title,
  subtitle,
  retailFeatures: propsRetailFeatures,
}) => {
  // Support both direct props and data object
  const safeData = data || {};
  const finalTitle = title || safeData.title || "Retail Features";
  const finalSubtitle =
    subtitle ||
    safeData.subtitle ||
    "Comprehensive features designed specifically for retail operations and customer experience optimization.";

  // Get features from props or data
  let retailFeatures = propsRetailFeatures || safeData.retailFeatures || [];

  // Default features if none provided
  const defaultFeatures = [
    {
      id: "feature-1",
      title: "Omnichannel POS",
      description: "Unified point-of-sale across online and in-store channels",
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
      benefits: ["Faster checkout", "Inventory sync", "Flexible payments"],
    },
    {
      id: "feature-2",
      title: "Inventory Optimization",
      description: "Real-time stock visibility across locations",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      benefits: [
        "Reduce stockouts",
        "Lower carrying costs",
        "Demand forecasting",
      ],
    },
    {
      id: "feature-3",
      title: "Customer 360",
      description: "Complete customer view across all touchpoints",
      icon:
        "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      benefits: ["Unified profiles", "Purchase history", "Personalized offers"],
    },
    {
      id: "feature-4",
      title: "Order Management",
      description: "Streamlined order processing and fulfillment",
      icon:
        "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      benefits: [
        "Multi-channel orders",
        "Automated routing",
        "Real-time tracking",
      ],
    },
  ];

  const finalFeatures =
    retailFeatures.length > 0 ? retailFeatures : defaultFeatures;

  console.log(" [RetailFeaturesSection] Rendering with:", {
    finalTitle,
    finalFeatures,
  });

  // Show default content even without data
  return (
    <section className="py-20 relative overflow-hidden theme-bg-primary bg-[var(--color-brand-dark-navy)]">
      <SEO
        title="Retail Features | Bellatrix E-commerce & POS Capabilities"
        description="Explore comprehensive Bellatrix retail features for e-commerce, POS, inventory management, customer experience, and omnichannel retail operations."
        keywords="Bellatrix retail features, e-commerce features, POS system features, retail inventory features, omnichannel retail capabilities, NetSuite commerce features"
        ogTitle="Retail Features | Bellatrix E-commerce & POS Capabilities"
        ogDescription="Comprehensive Bellatrix retail features designed for modern e-commerce and retail operations optimization."
        ogImage="/images/retail-features.jpg"
      />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            className="text-blue-300"
          >
            <pattern
              id="featuresGrid"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#featuresGrid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <header className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {finalTitle.includes(" ") ? (
              <>
                {finalTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="theme-highlight-text text-[var(--color-cyan-400)] transition-colors duration-600 ease-in-out">
                  {finalTitle.split(" ").slice(-1)[0]}
                </span>
              </>
            ) : (
              <span className="theme-highlight-text text-[var(--color-cyan-400)] transition-colors duration-600 ease-in-out">
                {finalTitle}
              </span>
            )}
          </h2>
          <p className="text-lg text-[var(--color-white)] leading-relaxed max-w-3xl mx-auto">
            {finalSubtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {finalFeatures.map((feature, index) => (
            <article
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 theme-feature-icon bg-gradient-to-br from-[var(--color-brand-accent)] to-[var(--color-brand-variant)] transition-all duration-600 ease-in-out">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {typeof feature.title === "string"
                      ? feature.title
                      : feature.title?.title ||
                        feature.title?.name ||
                        "Feature Title"}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {typeof feature.description === "string"
                      ? feature.description
                      : feature.description?.description ||
                        feature.description?.desc ||
                        "Feature Description"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(feature.benefits || []).map((benefit, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full theme-feature-dot bg-[var(--color-cyan-400)] transition-colors duration-600 ease-in-out"></div>
                        <span className="text-sm text-gray-300">
                          {typeof benefit === "string"
                            ? benefit
                            : benefit?.benefit ||
                              benefit?.name ||
                              benefit?.title ||
                              "Benefit"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
