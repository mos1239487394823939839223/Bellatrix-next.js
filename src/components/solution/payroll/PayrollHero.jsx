import React, { useState, useEffect } from "react";

import SEO from "../../SEO";
import CTAButton from "../../CTAButton";

const PayrollHero = ({
  title,

  subtitle,

  description,

  ctaButton,

  backgroundImage,

  bgColor,

  bgVideo,

  onCtaClick,

  data,
}) => {
  const [defaultData, setDefaultData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/payroll.json");

        const data = await response.json();

        setDefaultData(data.hero);
      } catch (error) {
        console.error("Failed to load payroll data:", error);

        // Fallback data

        setDefaultData({
          title: "Transform Your Payroll Process",

          subtitle:
            "Streamline operations with our intelligent, automated payroll system",
        });
      }
    };

    fetchData();
  }, []);

  // PRIORITIZE props data over default data for real-time preview

  const displayData = {
    title:
      title ||
      data?.title ||
      defaultData?.title ||
      "Transform Your Payroll Process",

    subtitle:
      subtitle ||
      data?.subtitle ||
      defaultData?.subtitle ||
      "Streamline operations with our intelligent, automated payroll system",

    description: description || data?.description || defaultData?.description,

    ctaButton: ctaButton || data?.ctaButton || defaultData?.ctaButton,

    backgroundImage:
      backgroundImage ||
      data?.backgroundImage ||
      defaultData?.backgroundImage ||
      "/images/payrollFinal.jpeg",

    bgColor: bgColor || data?.bgColor || defaultData?.bgColor,

    bgVideo: bgVideo || data?.bgVideo || defaultData?.bgVideo,
  };

  console.log(" [PayrollHero] Component received data:", {
    hasPropsData: !!(data && Object.keys(data).length > 0),

    propsData: data,

    hasDefaultData: !!defaultData,

    finalData: displayData,

    timestamp: new Date().toISOString(),
  });

  return (
    <>
      <SEO
        title={`Bellatrix Payroll Solutions | ${
          title || "Transform Your Payroll Process"
        }`}
        description={`${
          subtitle ||
          "Streamline payroll operations with Bellatrix automated payroll system"
        } - Professional ERP payroll management with expert implementation and compliance assurance.`}
        keywords="Bellatrix payroll automation, ERP payroll management, automated payroll processing, NetSuite HR solutions, payroll system implementation"
        ogTitle={`NetSuite Payroll Management - ${
          title || "Transform Your Payroll Process"
        }`}
        ogDescription={`${(
          subtitle || "Professional Bellatrix payroll automation"
        ).substring(
          0,

          120
        )}... Expert ERP payroll solutions and implementation.`}
        ogImage="/images/netsuite-payroll-hero.jpg"
      />

      <header className="py-24 lg:py-32 flex items-center justify-center relative min-h-screen">
        {/* Background Image */}

        <div className="absolute inset-0">
          <img
            src={displayData.backgroundImage}
            alt="Payroll Dashboard Interface"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Background image failed to load:", e.target.src);

              e.target.style.backgroundColor = "#1e40af";
            }}
          />

          {/* Simple Light Overlay */}

          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center space-y-8">
              <h1
                className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.9] text-[var(--color-text-inverse)] drop-shadow-lg text-center"
                style={{
                  textShadow:
                    "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)",
                }}
              >
                {displayData.title}
              </h1>

              <div className="max-w-4xl mx-auto space-y-4">
                <p
                  className="text-lg md:text-xl lg:text-2xl text-[var(--color-white)] leading-relaxed font-medium drop-shadow-md text-center"
                  style={{
                    textShadow:
                      "0 0 15px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {displayData.subtitle}
                </p>

                {displayData.description && (
                  <p
                    className="text-base md:text-lg text-[var(--color-white)] leading-relaxed drop-shadow-md text-center"
                    style={{
                      textShadow:
                        "0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {displayData.description}
                  </p>
                )}

                {displayData.ctaButton && (
                  <div className="mt-8">
                    <CTAButton
                      variant="primary"
                      size="lg"
                      className="inline-flex items-center px-8 py-4 text-lg font-semibold text-[var(--color-text-inverse)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      modalConfig={{
                        title: displayData.title || "Payroll Solutions",
                        subtitle:
                          displayData.subtitle ||
                          "Let's discuss your payroll needs",
                        icon: "",
                      }}
                    >
                      {displayData.ctaButton.text}
                    </CTAButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default PayrollHero;
