import React from "react";
import Image from "next/image";
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
  const displayData = {
    title: title || data?.title || "Transform Your Payroll Process",
    subtitle: subtitle || data?.subtitle || "Streamline operations with our intelligent, automated payroll system",
    description: description || data?.description,
    ctaButton: ctaButton || data?.ctaButton,
    backgroundImage: backgroundImage || data?.backgroundImage || "/images/payrollFinal.jpeg",
    bgColor: bgColor || data?.bgColor,
    bgVideo: bgVideo || data?.bgVideo,
  };

  return (
    <>
      <header className="py-24 lg:py-32 flex items-center justify-center relative min-h-screen">
        {/* Background Image */}

        <div className="absolute inset-0">
          {/* Priority:true — this is the LCP image on the payroll page */}
          <Image
            src={displayData.backgroundImage}
            alt="Payroll Dashboard Interface"
            fill
            priority
            sizes="100vw"
            className="object-cover"
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
