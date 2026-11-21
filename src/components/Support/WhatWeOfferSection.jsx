import React from "react";
import { addMediaVersionToBust } from "../../utils/cacheBusting";

const WhatWeOfferSection = ({
  data,
  // Direct props for Page Builder
  title: propTitle,
  subtitle: propSubtitle,
  cards: propCards,
  items: propItems,
  _updatedAt,
}) => {
  // Default data
  const defaultData = {
    title: "What We Offer",
    subtitle:
      "Comprehensive support solutions designed to maximize your success",
    cards: [
      {
        title: "Dedicated Team",
        description:
          "A dedicated team of Bellatrix experts that know your instance will be assigned to you.",
        image: "/supoortWhatWeOffer.png",
      },
      {
        title: "Stop Anytime",
        description:
          "SherpaCare offers you the ability to stop your services when you feel confident.",
        image: "/supoortWhatWeOffer2.png",
      },
      {
        title: "Certified Bellatrix Teams",
        description:
          "Trust a team with certified Bellatrix expertise you can rely on.",
        image: "/supoortWhatWeOffer3.png",
      },
    ],
  };

  // PRIORITIZE direct props > data prop > default data
  const sectionData = {
    title: propTitle || data?.title || defaultData.title,
    subtitle: propSubtitle || data?.subtitle || defaultData.subtitle,
    cards:
      propCards && propCards.length > 0
        ? propCards
        : propItems && propItems.length > 0
          ? propItems
          : data?.cards || data?.items || defaultData.cards,
  };

  const cacheVersion = _updatedAt || data?._updatedAt || Date.now();

  return (
    <>
      <section className="w-full bg-gray-50 py-16 light-section">
        <div className="max-w-6xl mx-auto px-4">
          <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {sectionData.title.includes(" ") ? (
                <>
                  {sectionData.title.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="text-blue-600">
                    {sectionData.title.split(" ").slice(-1)[0]}
                  </span>
                </>
              ) : (
                sectionData.title
              )}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {sectionData.subtitle}
            </p>
          </header>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sectionData.cards.map((card, index) => (
              <article
                key={index}
                className="flex flex-col items-center text-center bg-white rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg p-8"
              >
                <div className="flex items-center justify-center mb-6">
                  <img
                    src={addMediaVersionToBust(
                      card.image ||
                      `/supoortWhatWeOffer${index > 0 ? index + 1 : ""}.png`,
                      cacheVersion
                    )}
                    alt={card.title || `Card ${index + 1}`}
                    className="w-32 h-32 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {card.title || card.label || ""}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {card.description || card.text || ""}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhatWeOfferSection;
