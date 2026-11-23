import React from "react";
import { CtaBanner } from "../../site";

const CTASection = ({
  title,
  subtitle,
  description,
  ctaButton,
  features,
  trustedBy,
  onCtaClick,
}) => {

  // Use props DIRECTLY - no complex data processing or async fetching
  const finalData = {
    title: title || "Ready to Transform Your HR Operations?",
    subtitle: subtitle || "",
    description:
      description ||
      "Automate onboarding, leave, attendance and payroll on one system your team will actually use.",
    buttonText: ctaButton?.text || "Start Now",
  };

  return (
    <CtaBanner
      title={finalData.title}
      subtitle={finalData.subtitle}
      description={finalData.description}
      buttonText={finalData.buttonText}
      modal={{
        title: "Transform Your HR Operations",
        subtitle: "Let's discuss how Bellatrix HR can automate your processes and reduce administrative workload",
      }}
    />
  );
};

export default CTASection;
