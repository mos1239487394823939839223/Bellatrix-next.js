import React from "react";
import SEO from "../SEO";

const SherpaCareServices = ({
  data,
  // Direct props for Page Builder
  title: propTitle,
  subtitle: propSubtitle,
  column1: propColumn1,
  column2: propColumn2,
  column3: propColumn3,
}) => {
  // Default data
  const defaultData = {
    title:
      "No matter what kind of assistance you are looking for, our team can help you.",
    subtitle: "Here are some of the ways Bellatrix helped other organizations:",
    column1: [
      "Ad hoc assistance",
      "Solution design",
      "Updates assistance",
      "Integrating Bellatrix with different tools",
      "Implementing eCommerce applications",
    ],
    column2: [
      "Creating workflows & process mapping",
      "Developing custom KPI",
      "Writing custom scripts",
      "Designing portals and their modification",
      "Bellatrix Advanced Modules Implementation",
    ],
    column3: [
      "Customizing Bellatrix dashboards",
      "Customizing business processes",
      "Building reports and visualizations",
    ],
  };

  // PRIORITIZE direct props > data prop > default data
  const sectionData = {
    title: propTitle || data?.title || defaultData.title,
    subtitle: propSubtitle || data?.subtitle || defaultData.subtitle,
    column1:
      propColumn1 && propColumn1.length > 0
        ? propColumn1
        : data?.column1 || defaultData.column1,
    column2:
      propColumn2 && propColumn2.length > 0
        ? propColumn2
        : data?.column2 || defaultData.column2,
    column3:
      propColumn3 && propColumn3.length > 0
        ? propColumn3
        : data?.column3 || defaultData.column3,
  };

  return (
    <>
      <SEO
        title="SherpaCare Services | Comprehensive Bellatrix ERP Support Solutions"
        description="Comprehensive Bellatrix services including solution design, integrations, eCommerce, workflows, custom scripts, and advanced module implementation."
        keywords="SherpaCare services, ERP solution design, NetSuite integrations, eCommerce applications, custom workflows, KPI development, portal design, advanced modules"
        ogTitle="SherpaCare Services | Comprehensive Bellatrix ERP Support Solutions"
        ogDescription="Expert Bellatrix services covering solution design, integrations, custom development, and advanced module implementation for your business."
        ogImage="/images/Support/sherpacare-services.jpg"
      />
      <section
        className="w-full py-16 relative overflow-hidden animate-background-glow"
        style={{
          backgroundColor: "var(--color-brand-dark-navy)",
        }}
      >
        {/* Ultra Creative Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Background Effects */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-600/20 via-cyan-500/30 to-blue-600/20 rounded-full blur-2xl"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-500/15 via-purple-500/20 to-cyan-500/15 rounded-2xl blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-tr from-white/10 via-blue-300/20 to-white/10 rounded-xl blur-lg"></div>
          <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-gradient-to-r from-blue-600/20 via-cyan-500/30 to-blue-600/20 rounded-full blur-lg"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <article className="rounded-3xl shadow-2xl transition-all duration-500 p-8 md:p-12 backdrop-blur-sm relative overflow-hidden group" style={{ backgroundColor: "#1f2937", border: "1px solid rgba(75,85,99,0.5)" }}>
            {/* Creative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full opacity-20 transform translate-x-16 -translate-y-16 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500/30 to-blue-500/30 rounded-full opacity-20 transform -translate-x-10 translate-y-10 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full opacity-15 transform -translate-x-8 -translate-y-8 group-hover:opacity-30 transition-opacity duration-500"></div>

            {/* Title */}
            <header className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-6">
                {sectionData.title}
              </h2>
              <p className="text-lg text-center mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "#d1d5db" }}>
                {sectionData.subtitle}
              </p>

              {/* Service Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1 */}
                <div className="rounded-xl shadow-lg p-6 transition-all duration-300 group/card" style={{ background: "linear-gradient(135deg, rgba(55,65,81,0.9), rgba(75,85,99,0.8), rgba(55,65,81,0.9))", border: "1px solid rgba(107,114,128,0.5)" }}>
                  <ul className="list-disc list-inside space-y-3 text-base" style={{ color: "#e5e7eb" }}>
                    {sectionData.column1.map((item, idx) => (
                      <li
                        key={idx}
                        className="hover:text-blue-300 transition-colors duration-300"
                      >
                        {typeof item === "string"
                          ? item
                          : item.text || item.label || ""}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2 */}
                <div className="rounded-xl shadow-lg p-6 transition-all duration-300 group/card" style={{ background: "linear-gradient(135deg, rgba(55,65,81,0.9), rgba(75,85,99,0.8), rgba(55,65,81,0.9))", border: "1px solid rgba(107,114,128,0.5)" }}>
                  <ul className="list-disc list-inside space-y-3 text-base" style={{ color: "#e5e7eb" }}>
                    {sectionData.column2.map((item, idx) => (
                      <li
                        key={idx}
                        className="hover:text-blue-300 transition-colors duration-300"
                      >
                        {typeof item === "string"
                          ? item
                          : item.text || item.label || ""}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3 */}
                <div className="rounded-xl shadow-lg p-6 transition-all duration-300 group/card" style={{ background: "linear-gradient(135deg, rgba(55,65,81,0.9), rgba(75,85,99,0.8), rgba(55,65,81,0.9))", border: "1px solid rgba(107,114,128,0.5)" }}>
                  <ul className="list-disc list-inside space-y-3 text-base" style={{ color: "#e5e7eb" }}>
                    {sectionData.column3.map((item, idx) => (
                      <li
                        key={idx}
                        className="hover:text-blue-300 transition-colors duration-300"
                      >
                        {typeof item === "string"
                          ? item
                          : item.text || item.label || ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </header>
          </article>
        </div>
      </section>
    </>
  );
};

export default SherpaCareServices;
