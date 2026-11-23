import React from "react";
import OptimizedImg from "../../OptimizedImg";
import { SectionHeader, GlowImageFrame } from "../../site";

const TrainingPrograms = ({
  programsSection = {},
  trainingPrograms = [],
  openProgramModal,
}) => {
  // Debug logging for image data

  console.log(" [TrainingPrograms COMPONENT] Received props:", {
    programsSection,

    imageUrl: programsSection?.image,

    hasImage: !!programsSection?.image,

    imageType: typeof programsSection?.image,
  });

  return (
    <div className="container mx-auto px-6 my-12">
      <SectionHeader
        title={programsSection.title || "Training Programs"}
        description={programsSection.description || "Comprehensive training programs designed to enhance your skills and knowledge."}
        tone="none"
        titleClassName="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
        descriptionClassName="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto"
        highlight="rest"
        highlightClassName="text-blue-600"
      />

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Image - Left Side */}

        <div className="flex-1 flex justify-center">
          <GlowImageFrame
            src={programsSection.image}
            alt={programsSection.title || "Training Programs - Advanced NetSuite Learning Solutions"}
            fallbackSrc="/images/training.jpg"
          />
        </div>

        {/* Training Programs Content - Right Side */}

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 md:auto-rows-fr gap-4">
            {(trainingPrograms.programs || trainingPrograms || []).map(
              (program, index) => {
                const key =
                  program && (program.id || program.programId || program.title)
                    ? `${program.id || program.programId || program.title}-${index}`
                    : `program-${index}`;

                return (
                  <div
                    key={key}
                    onClick={() => openProgramModal(program)}
                    className="text-center p-5 bg-white rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group transform hover:scale-105"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {program.title}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {program.shortDescription}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPrograms;
