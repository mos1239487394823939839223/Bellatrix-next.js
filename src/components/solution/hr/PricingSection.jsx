import React, { useState, useEffect } from "react";
import CTAButton from "../../CTAButton";

const PricingSection = ({ data = {} }) => {
  const [defaultData, setDefaultData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/hr.json");
        const jsonData = await response.json();
        setDefaultData(jsonData.pricing);
      } catch (error) {
        console.error("Failed to load HR data:", error);
        // Fallback data
        setDefaultData([
          {
            name: "Essential",
            price: "$2,500",
            period: "one-time implementation",
            description:
              "Perfect for small teams getting started with HR automation",
            features: [
              "Basic system analysis & configuration",
              "Standard implementation setup",
            ],
            isPopular: false,
          },
        ]);
      }
    };
    fetchData();
  }, []);

  // PRIORITIZE props data over default data for real-time preview
  const pricing = data.pricing || defaultData || [];

  // Debug logging for real-time updates
  console.log(" [HRPricingSection] Component received data:", {
    hasPropsData: !!(data && data.pricing),
    propsData: data,
    hasDefaultData: !!defaultData,
    finalData: pricing,
    timestamp: new Date().toISOString(),
  });
  return (
    <>
      <section
        className="py-12 relative"
        style={{ backgroundColor: "var(--color-brand-dark-navy)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)]/10 via-transparent to-[var(--color-primary)]/10 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <header className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-inverse)] mb-4">
              {data.title || (
                <>
                  Implementation{" "}
                  <span className="text-[var(--color-primary-light)]">
                    Pricing
                  </span>
                </>
              )}
            </h2>
            <p className="text-lg text-[var(--color-text-light)] leading-relaxed max-w-3xl mx-auto">
              {data.description ||
                "Choose the perfect implementation plan that fits your business needs and budget"}
            </p>
          </header>
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <article
                key={index}
                className={`bg-[var(--color-text-inverse)]/5 backdrop-blur-sm rounded-2xl p-8 border-2 ${
                  plan.isPopular
                    ? "border-[var(--color-primary-light)] hover:border-[var(--color-primary)] transform scale-105"
                    : "border-[var(--color-text-inverse)]/10 hover:border-[var(--color-primary)]/30"
                } transition-all duration-300 relative`}
                role="article"
                aria-label={`Pricing Plan: ${plan.name || "Plan"}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[var(--color-primary)] text-[var(--color-text-inverse)] px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <header className="text-center">
                  <h3 className="text-2xl font-bold text-[var(--color-text-inverse)] mb-2">
                    {plan.name || "Plan"}
                  </h3>
                  <p className="text-white/80 mb-6">
                    {plan.description || "Plan description"}
                  </p>
                  <div className="mb-6">
                    <span
                      className={`text-4xl font-bold ${
                        plan.isPopular
                          ? "text-[var(--color-primary-light)]"
                          : "text-[var(--color-text-inverse)]"
                      }`}
                    >
                      {plan.price || "$0"}
                    </span>
                    <span className="text-white/70 ml-2">
                      {plan.period || ""}
                    </span>
                  </div>
                </header>
                <ul className="space-y-4 mb-8" role="list">
                  {(() => {
                    const featuresRaw = plan.features || plan.items || [];
                    let featuresArray = [];
                    if (Array.isArray(featuresRaw)) {
                      featuresArray = featuresRaw;
                    } else if (typeof featuresRaw === "string") {
                      featuresArray = featuresRaw
                        .split(/[;,\n]+/)
                        .map((s) => s.trim())
                        .filter(Boolean);
                    } else if (featuresRaw && typeof featuresRaw === "object") {
                      // if it's an object, try to extract string values or titles
                      featuresArray = Object.values(featuresRaw).map((v) =>
                        typeof v === "string" ? v : v?.title || v?.name || ""
                      );
                    }

                    return featuresArray.map((feature, i) => (
                      <li key={i} className="flex items-center" role="listitem">
                        <svg
                          className="w-5 h-5 text-[var(--color-success)] mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-white/90">
                          {feature}
                        </span>
                      </li>
                    ));
                  })()}
                </ul>
                <CTAButton
                  variant={plan.isPopular ? "primary" : "secondary"}
                  size="md"
                  className="w-full"
                  modalConfig={{
                    title: `${plan.name} Plan - Let's Get Started`,
                    subtitle: `Interested in the ${plan.name} plan? Let's discuss how we can help transform your HR operations`,
                    icon: ""
                  }}
                >
                  {plan.ctaText || "Get Started"}
                </CTAButton>
              </article>
            ))}
          </div>
          {/* Additional Info */}
          <footer className="text-center mt-12">
            <p className="text-[var(--color-text-light)] mb-4">
              All plans include free consultation and project scoping
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Need a custom solution?{" "}
              <span className="text-[var(--color-primary-light)] font-semibold cursor-pointer hover:underline">
                Contact our team for personalized pricing
              </span>
            </p>
          </footer>
        </div>
      </section>
    </>
  );
};

export default PricingSection;
