import React from "react";
import { useCTAModal } from "../../contexts/CTAModalContext";

const PrePackagedSection = ({
  data,
  // Direct props for Page Builder / normalizeProps
  title: propTitle,
  description: propDescription,
  subtitle: propSubtitle,
  items: propItems,
  packages: propPackages,
}) => {
  const { openCTAModal } = useCTAModal();
  // Default data from schema
  const schemaDefault = {
    title: "Pre-Packaged Support Solutions",
    subtitle: "",
    description: "Choose from our pre-packaged support options designed for businesses of all sizes",
    packages: [
      {
        name: "Basic Support",
        description: "Essential support for small businesses",
        features: ["Email support", "Business hours coverage", "Monthly check-ins"],
        price: "$999/month"
      },
      {
        name: "Premium Support",
        description: "Comprehensive support for growing businesses",
        features: ["24/7 support", "Dedicated account manager", "Priority response", "Quarterly reviews"],
        price: "$2,499/month"
      }
    ]
  };

  // Use direct props > data > schema default
  const sectionData = {
    title: propTitle || data?.title || schemaDefault.title,
    subtitle: propSubtitle || data?.subtitle || schemaDefault.subtitle,
    description: propDescription || data?.description || schemaDefault.description,
    packages:
      propItems ||
      propPackages ||
      data?.items ||
      data?.packages ||
      schemaDefault.packages,
  };

  return (
    <>
      <section
          className="light-section prepackaged-support-section"
        style={{
          backgroundColor: "#f7f7f7",
          padding: "56px 20px 48px",
          margin: "80px auto",
          borderRadius: "15px",
          boxShadow:
            "0px 4px 16px rgba(0, 0, 0, 0.1), 0px 8px 32px rgba(0, 0, 0, 0.05)",
          color: "#0f172a",
          textAlign: "center",
          // full width minus gutters on phones, capped on desktop
          width: "min(1180px, calc(100% - 32px))",
        }}
      >
        <div
          style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 15px" }}
        >
          <header>
            <h2
              style={{
                fontSize: "30px",
                marginBottom: "16px",
                letterSpacing: "-1px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {sectionData.title}
            </h2>
            {sectionData.subtitle && (
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#333",
                }}
              >
                {sectionData.subtitle}
              </p>
            )}
          </header>
          <p style={{ fontSize: "19px", lineHeight: "1.6", marginBottom: "48px" }}>
            {sectionData.description}
          </p>

          {/* Packages / Items */}
          {sectionData.packages && sectionData.packages.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))`,
                gap: "24px",
                textAlign: "left",
                marginTop: "16px",
              }}
            >
              {sectionData.packages.map((pkg, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "32px 24px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {/* Package Name */}
                  {pkg.name && (
                    <h3
                      className="prepackaged-support-name"
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#1a1a1a",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {pkg.name}
                    </h3>
                  )}

                  {/* Price */}
                  {pkg.price && (
                    <p
                      className="prepackaged-support-price"
                      style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        color: "var(--color-primary, #2563eb)",
                        letterSpacing: "-0.5px",
                        margin: "0",
                      }}
                    >
                      {pkg.price}
                    </p>
                  )}

                  {/* Package Description */}
                  {pkg.description && (
                    <p
                      className="prepackaged-support-description"
                      style={{
                        fontSize: "15px",
                        color: "#555",
                        lineHeight: "1.6",
                        margin: "0",
                      }}
                    >
                      {pkg.description}
                    </p>
                  )}

                  {/* Features List */}
                  {pkg.features && pkg.features.length > 0 && (
                    <ul
                      style={{
                        listStyle: "none",
                        padding: "0",
                        margin: "8px 0 0 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {pkg.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            fontSize: "14px",
                            color: "#444",
                          }}
                        >
                          <span aria-hidden="true" style={{ color: "#16a34a", fontWeight: "700", flexShrink: 0 }}>
                            ✓
                          </span>
                          {typeof feature === "string" ? feature : feature.text || feature.label || ""}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Every plan needs a way to act on it */}
                  <button
                    type="button"
                    data-no-cta-intercept
                    onClick={() =>
                      openCTAModal({
                        title: `Get started with ${pkg.name || "this plan"}`,
                        subtitle: pkg.price
                          ? `${pkg.price} — tell us about your NetSuite setup and we'll get you onboarded.`
                          : "Tell us about your NetSuite setup and we'll get you onboarded.",
                      })
                    }
                    className="mt-auto w-full rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    style={{ minHeight: 48, marginTop: "auto" }}
                  >
                    {pkg.ctaText || `Get started with ${pkg.name ? pkg.name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "this plan"}`}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PrePackagedSection;
