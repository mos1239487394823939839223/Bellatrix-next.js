import React from "react";
import CTAButton from "../../CTAButton";
import { smartRender } from "../../../utils/htmlSanitizer";

const PayrollCTA = ({
  title,
  subtitle,
  description,
  ctaButton,
}) => {
  console.log(" [PayrollCTA Fixed] Received props:", {
    title,
    subtitle,
    description,
    ctaButton,
  });

  // Use props DIRECTLY - no complex data processing or async fetching
  const finalData = {
    title: title || "Ready to Simplify Your Payroll?",
    subtitle: subtitle || "",
    description: description || "",
    buttonText: ctaButton?.text || "Start Now",
  };

  // Extra debug showing normalized data
  console.log(" [PayrollCTA Fixed] Final data:", finalData);

  // Check if title and description contain HTML and render accordingly
  const titleHTML = smartRender(finalData.title);
  const descriptionHTML = smartRender(finalData.description);

  return (
    <>
      <section className="py-20 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-[var(--color-brand-dark-navy)]"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-[var(--color-accent)]/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[var(--color-accent-light)]/15 rounded-full blur-md animate-pulse delay-500"></div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <header className="text-center">
            {/* Main Title - Fixed HTML rendering */}
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--color-text-inverse)] leading-tight"
              {...(titleHTML
                ? { dangerouslySetInnerHTML: titleHTML }
                : { children: finalData.title })}
            />

            {/* Subtitle */}
            {finalData.subtitle && (
              <h3 className="text-lg md:text-xl text-[var(--color-text-inverse)] opacity-80 mb-4 leading-relaxed max-w-2xl mx-auto">
                {finalData.subtitle}
              </h3>
            )}

            {/* Description - Fixed HTML rendering */}
            <p
              className="text-xl md:text-2xl text-[var(--color-text-inverse)] opacity-90 mb-10 leading-relaxed max-w-3xl mx-auto"
              {...(descriptionHTML
                ? { dangerouslySetInnerHTML: descriptionHTML }
                : { children: finalData.description })}
            />

            {/* CTA Button */}
            <CTAButton
              variant="secondary"
              size="xl"
              className="shadow-2xl hover:shadow-3xl"
              modalConfig={{
                title: "Start Your Payroll Transformation",
                subtitle: "Let's discuss how Bellatrix Payroll can streamline your operations",
                icon: ""
              }}
            >
              {finalData.buttonText}
            </CTAButton>

           
          </header>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--color-primary-dark)]/50 to-transparent"></div>
      </section>
    </>
  );
};

export default PayrollCTA;
