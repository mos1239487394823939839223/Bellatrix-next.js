import React from "react";
import { addMediaVersionToBust } from "../../utils/cacheBusting";
import OptimizedImg from "../OptimizedImg";

const SupportSecondSec = ({
  data,
  // Direct props for Page Builder
  title: propTitle,
  description1: propDescription1,
  description2: propDescription2,
  image: propImage,
  _updatedAt,
}) => {
  // Default data
  const defaultData = {
    title: "Empower Your Business with Bellatrix Support",
    description1:
      "Our Bellatrix Support service was built to empower your organization to use Bellatrix with confidence. Our in-house team of 85+ Bellatrix certified professionals are ready to support you to maximize the return on your Bellatrix investment.",
    description2:
      "With our 18 years of implementation, customization, and development within Bellatrix, rest assured we have the expertise to not only answer your questions, but to proactively improve your Bellatrix instance.",
    image: "/images/Support/HeroSection.png",
  };

  // PRIORITIZE direct props > data prop > default data
  const sectionData = {
    title: propTitle || data?.title || defaultData.title,
    description1:
      propDescription1 ||
      data?.description1 ||
      data?.description ||
      defaultData.description1,
    description2:
      propDescription2 || data?.description2 || defaultData.description2,
    image: propImage || data?.image || defaultData.image,
  };

  const cacheVersion = _updatedAt || data?._updatedAt || Date.now();

  return (
    <>
      <section className="w-full bg-gray-50 py-16 light-section">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image Section */}
          <div className="order-2 md:order-1">
            <OptimizedImg
              src={addMediaVersionToBust(sectionData.image, cacheVersion)}
              alt="Bellatrix Support Services - Professional ERP implementation and customization expertise"
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Text Section */}
          <article className="order-1 md:order-2">
            <header>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
                {sectionData.title}
              </h2>
            </header>
            <p className="text-lg text-gray-700 mb-4">
              {sectionData.description1}
            </p>
            <p className="text-lg text-gray-700">{sectionData.description2}</p>
          </article>
        </div>
      </section>
    </>
  );
};
export default SupportSecondSec;
