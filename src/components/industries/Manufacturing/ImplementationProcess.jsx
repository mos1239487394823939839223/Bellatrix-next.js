import React from "react";
import ImplementationStepper from "./ImplementationStepper";
import { useComponentData } from "../../../utils/useComponentData";
import manufacturingData from "../../../data/manufacturing-data.json";

const ImplementationProcess = (props) => {
  // Merge props with default data from JSON
  // Handle both { data: ... } usage and spread props usage
  const contentData = props.data || props;
  
  const finalData = useComponentData(
    "implementationProcess",
    contentData,
    manufacturingData
  );

  console.log(" [ImplementationProcess] Data merge:", {
    props: contentData,
    defaultData: manufacturingData.implementationProcess,
    finalData: finalData,
    stepsCount: finalData.steps?.length,
  });

  return (
    <section className="py-20 bg-white light-section">

      <div className="container mx-auto px-6 max-w-6xl">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            {finalData.title || "Manufacturing Implementation Built for All Industries"}
          </h2>
          <p className="text-xl text-gray-600">
            {finalData.description || "Streamline your entire NetSuite implementation lifecycle — from discovery to go-live — with a proven, secure methodology."}
          </p>
        </header>
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {finalData.sectionTitle || "Implementation Process"}
        </h3>
        <ImplementationStepper 
          implementationProcess={finalData.processSteps || finalData.steps} 
          labels={{
            keyDeliverablesTitle: finalData.keyDeliverablesTitle || "Key Deliverables",
            implementationDetailsTitle: finalData.implementationDetailsTitle || "Implementation Details",
            defaultStats: finalData.defaultStats || undefined
          }}
        />
      </div>
    </section>
  );
};

export default ImplementationProcess;
