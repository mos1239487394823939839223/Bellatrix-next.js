import React from "react";
import SEO from "../SEO";

// Component for each support card
const SupportCard = ({ title, items }) => (
  <article style={styles.card}>
    <h3 style={styles.cardTitle}>{title}</h3>
    <ul style={styles.list}>
      {items.map((item, index) => (
        <li key={index} style={styles.listItem}>
          {typeof item === "string" ? item : item.text || item.label || ""}
        </li>
      ))}
    </ul>
  </article>
);

// Main component
const BellatrixSupportSection = ({
  data,
  // Direct props for Page Builder
  title: propTitle,
  description1: propDescription1,
  description2: propDescription2,
  adminSupport: propAdminSupport,
  functionalSupport: propFunctionalSupport,
  developmentSupport: propDevelopmentSupport,
  adminSupportTitle: propAdminSupportTitle,
  functionalSupportTitle: propFunctionalSupportTitle,
  developmentSupportTitle: propDevelopmentSupportTitle,
}) => {
  // Default data
  const defaultAdminSupport = [
    "Ongoing Bellatrix administration",
    "Maintain secure access",
    "Data cleansing and upload",
    "Data administration & maintenance",
    "Help with optimizing the usage of Bellatrix",
    "Monitor usage & transactions",
    "Provide support for your IT team on technical issues",
    "Create new users, roles",
    "Create Saved searches",
    "General support, analytics",
    "Upgrades and testing",
  ];

  const defaultFunctionalSupport = [
    "End User Support",
    "Answer How To Questions",
    "Provide solutions for business requirements",
    "Train new users",
    "Help in performing functional tasks and transactions",
    "Help your IT team in resolving end user requests",
    "Help in running reports/ dashboards",
    "Help with using best practices of Bellatrix",
    "Monitor functional usage and transactions",
    "Year and month end processes",
  ];

  const defaultDevelopmentSupport = [
    "Create New reports",
    "Create New dashboards",
    "Create or manage automated processes with Bellatrix SuiteFlows",
    "Enhance Bellatrix functionality with scripting using Bellatrix SuiteScripts",
    "Create Forms",
    "Integrations",
    "Installation of Suite Bundle as required",
  ];

  const defaultData = {
    title: "Your One-Stop-Shop for Bellatrix Support",
    description1:
      "Your business, and how you run it, is very unique. So is your Bellatrix instance and required support. Our consultants are well versed in a multitude of different areas to ensure that regardless of the level of support that you require, we can assist you.",
    description2:
      "Whether you're in need of functional support, administrator support, development support, or all the above, SherpaCare is the answer.",
    adminSupportTitle: "Admin Support",
    functionalSupportTitle: "Functional Support",
    developmentSupportTitle: "Development Support",
    adminSupport: defaultAdminSupport,
    functionalSupport: defaultFunctionalSupport,
    developmentSupport: defaultDevelopmentSupport,
  };

  // PRIORITIZE direct props > data prop > default data
  const resolveArr = (prop, dataVal, def) => {
    if (prop && prop.length > 0) return prop;
    if (Array.isArray(dataVal) && dataVal.length > 0)
      return dataVal.map((i) =>
        typeof i === "string" ? i : i.text || i.label || ""
      ).filter(Boolean);
    return def;
  };

  const sectionData = {
    title: propTitle || data?.title || defaultData.title,
    description1: propDescription1 || data?.description1 || defaultData.description1,
    description2: propDescription2 || data?.description2 || defaultData.description2,
    adminSupportTitle:
      propAdminSupportTitle || data?.adminSupportTitle || defaultData.adminSupportTitle,
    functionalSupportTitle:
      propFunctionalSupportTitle ||
      data?.functionalSupportTitle ||
      defaultData.functionalSupportTitle,
    developmentSupportTitle:
      propDevelopmentSupportTitle ||
      data?.developmentSupportTitle ||
      defaultData.developmentSupportTitle,
    adminSupport: resolveArr(
      propAdminSupport,
      data?.adminSupport,
      defaultData.adminSupport
    ),
    functionalSupport: resolveArr(
      propFunctionalSupport,
      data?.functionalSupport,
      defaultData.functionalSupport
    ),
    developmentSupport: resolveArr(
      propDevelopmentSupport,
      data?.developmentSupport,
      defaultData.developmentSupport
    ),
  };

  return (
    <>
      <SEO
        title="Bellatrix Support Services | Admin, Functional & Development Support"
        description="Comprehensive Bellatrix support services including admin support, functional support, and development support. Expert consultants for all your ERP needs."
        keywords="Bellatrix admin support, functional support, development support, ERP consulting, NetSuite administration, business process optimization"
        ogTitle="Bellatrix Support Services | Admin, Functional & Development Support"
        ogDescription="Get comprehensive Bellatrix support with our expert consultants covering administration, functional processes, and development needs."
        ogImage="/images/Support/bellatrix-support-services.jpg"
      />
      <section style={styles.section}>
        {/* Background Pattern */}
        <div style={styles.backgroundPattern}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              style={{ color: "#93c5fd" }}
            >
              <pattern
                id="supportGrid"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#supportGrid)" />
            </svg>
          </div>
        </div>

        <div style={styles.container}>
          <header>
            <h2 style={styles.heading}>
              {sectionData.title.includes("Bellatrix") ? (
                <>
                  {sectionData.title.split("Bellatrix")[0]}
                  <span style={styles.headingSpan}>Bellatrix Support</span>
                  {sectionData.title.split("Bellatrix Support")[1] ||
                    sectionData.title
                      .split("Bellatrix")[1]
                      ?.replace(" Support", "") ||
                    ""}
                </>
              ) : (
                sectionData.title
              )}
            </h2>
          </header>
          <p style={styles.paragraph}>{sectionData.description1}</p>
          <p style={styles.paragraph}>{sectionData.description2}</p>

          <div style={styles.cardsContainer}>
            <SupportCard
              title={sectionData.adminSupportTitle}
              items={sectionData.adminSupport}
            />
            <SupportCard
              title={sectionData.functionalSupportTitle}
              items={sectionData.functionalSupport}
            />
            <SupportCard
              title={sectionData.developmentSupportTitle}
              items={sectionData.developmentSupport}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default BellatrixSupportSection;

// === Styles ===
const styles = {
  section: {
    backgroundColor: "var(--color-brand-dark-navy)",
    padding: "50px 0",
    color: "#ffffff",
    fontFamily: '"Gotham A", "Gotham B"',
    position: "relative",
    overflow: "hidden",
  },
  container: {
    maxWidth: "1220px",
    margin: "0 auto",
    padding: "0 15px",
    position: "relative",
    zIndex: 10,
  },
  heading: {
    fontSize: "36px",
    fontWeight: "900",
    textAlign: "center",
    marginBottom: "30px",
    letterSpacing: "-1px",
    color: "#ffffff",
    textTransform: "capitalize",
  },
  headingSpan: {
    color: "#22d3ee", // Fixed cyan — same in light and dark mode
  },
  paragraph: {
    textAlign: "center",
    fontSize: "15px",
    lineHeight: "24px",
    marginBottom: "15px",
    color: "#d1d5db", // gray-300
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "20px",
    marginTop: "40px",
  },
  card: {
    flex: "1 1 calc(33.333% - 20px)",
    minWidth: "300px",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(4px)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  },
  cardHover: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "15px",
    letterSpacing: "-1px",
    borderBottom: "2px solid rgba(34, 211, 238, 0.3)", // Fixed cyan border — same in light and dark mode
    paddingBottom: "10px",
    display: "inline-block",
    paddingLeft: "10px",
    paddingRight: "10px",
    color: "#22d3ee", // Fixed cyan — same in light and dark mode
  },
  list: {
    margin: 0,
    listStyle: "disc",
    paddingLeft: "30px",
  },
  listItem: {
    marginBottom: "10px",
    display: "list-item",
    color: "#d1d5db", // gray-300
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.1,
    zIndex: 1,
  },
};
