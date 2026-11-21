// TrainingProgramCard.jsx
import React from "react";

const TrainingProgramCard = ({ program, index, onClick }) => {
  return (
    <>
      <article
        onClick={onClick}
        className="text-center p-5 bg-white rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group transform hover:scale-105"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {program.title || "Bellatrix Training Program"}
        </h3>
        <p className="text-sm text-gray-600">
          {program.shortDescription || program.description ||
            "Professional Bellatrix training course"}
        </p>
      </article>
    </>
  );
};

export default TrainingProgramCard;
