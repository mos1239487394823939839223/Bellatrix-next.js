import React from "react";
import { addMediaVersionToBust } from "../../utils/cacheBusting";
import OptimizedImg from "../OptimizedImg";

// Normalize upload URLs to HTTPS domain to match DedicatedTeamSection behavior
const rewriteUploadsUrl = (url) => {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("http://68.178.169.236:5000/uploads/")) {
    return url.replace(
      "http://68.178.169.236:5000",
      "https://www.bellatrixinc.com"
    );
  }
  return url;
};

const isLikelyImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  return (
    lower.startsWith("data:image") ||
    /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/.test(lower)
  );
};

const PayPerUseSection = ({
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
    title: "Only Pay for the Hours you Use",
    description1:
      "Stop paying a lot of money for support that you may not use! How many real hours do you get to take advantage of in your support contract? If you don't use them, do you lose them?",
    description2:
      "Our approach is different. Our monthly reviews focus on the realignment of time/hours not used and outlines new ways to leverage unused support hours in order to optimize your system.",
    image: "/images/Support/pay2.jpeg",
  };

  // PRIORITIZE direct props > data prop > default data
  const sectionData = {
    title: propTitle || data?.title || defaultData.title,
    description1:
      propDescription1 || data?.description1 || defaultData.description1,
    description2:
      propDescription2 || data?.description2 || defaultData.description2,
    image:
      (isLikelyImageUrl(
        rewriteUploadsUrl(propImage || data?.image || data?.backgroundImage)
      )
        ? rewriteUploadsUrl(propImage || data?.image || data?.backgroundImage)
        : defaultData.image) || defaultData.image,
  };

  const cacheVersion = _updatedAt || data?._updatedAt || Date.now();

  return (
    <>
      <section className="w-full bg-white py-16 light-section">
        <div className="max-w-6xl mx-auto px-4">
          <header className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center">
              {sectionData.title}
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text Section */}
            <div className="order-1 md:order-1">
              <p className="text-lg text-gray-700 mb-4">
                {sectionData.description1}
              </p>
              <p className="text-lg text-gray-700">
                {sectionData.description2}
              </p>
            </div>

            {/* Image Section */}
            <div className="order-2 md:order-2">
              <OptimizedImg
                alt="Bellatrix dashboard"
                src={addMediaVersionToBust(sectionData.image, cacheVersion)}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PayPerUseSection;
