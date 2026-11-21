import React from "react";
import ImplementationStepper from "./ImplementationStepper";

const ImplementationSection = ({
  data,
  // Direct props from Page Builder schema
  title,
  subtitle,
  description,
  implementationProcess: propsImplementationProcess,
}) => {
  // Ensure data is safe and provide fallback
  const safeData = data || {};

  // Support both direct props and data object
  const finalTitle =
    title || safeData.title || "Retail Implementation Built for All Industries";
  const finalSubtitle =
    subtitle || safeData.subtitle || "Proven Implementation Methodology";
  const finalDescription =
    description ||
    safeData.description ||
    "Streamline your entire NetSuite implementation lifecycle — from discovery to go-live — with a proven, secure methodology.";

  const implementationProcess =
    propsImplementationProcess || safeData.implementationProcess || {};
  const processTitle = implementationProcess.title || "Implementation Process";
  const steps = implementationProcess.steps || [];

  // Default steps if none provided
  const defaultSteps = [
    {
      title: "Discovery & Assessment",
      desc: "Analyze current retail processes and requirements",
      benefits: [
        "Current state assessment",
        "Gap analysis",
        "Requirements documentation",
      ],
    },
    {
      title: "Solution Design",
      desc: "Design NetSuite configuration for retail workflows",
      benefits: ["System architecture", "Process flows", "Integration design"],
    },
    {
      title: "Implementation",
      desc: "Deploy and configure NetSuite for your business",
      benefits: ["System setup", "Data migration", "User training"],
    },
    {
      title: "Go-Live & Support",
      desc: "Launch and provide ongoing support",
      benefits: ["Go-live support", "User adoption", "Ongoing optimization"],
    },
  ];

  const finalSteps = steps.length > 0 ? steps : defaultSteps;

  console.log(" [RetailImplementationSection] Rendering with:", {
    finalTitle,
    finalSteps,
  });

  return (
    <section className="py-20 bg-white light-section">

      <div className="container mx-auto px-6 max-w-6xl">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            {finalTitle}
          </h2>
          {finalSubtitle && (
            <h3 className="text-xl text-gray-700 mb-4">{finalSubtitle}</h3>
          )}
          <p className="text-xl text-gray-600">{finalDescription}</p>
        </header>
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {processTitle}
        </h3>
        {/* Implementation Process Stepper component */}
        <ImplementationStepper steps={finalSteps} />
      </div>
    </section>
  );
};

export default ImplementationSection;
