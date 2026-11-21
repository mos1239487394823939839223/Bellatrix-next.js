import React from "react";
import { addMediaVersionToBust } from "../../utils/cacheBusting";

const CustomerSupport = ({
  data,
  // Direct props for Page Builder
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  image: propImage,
  items: propItems,
  supportInfoTitle: propSupportInfoTitle,
  supportInfoDescription: propSupportInfoDescription,
  _updatedAt,
}) => {
  // Default data
  const defaultData = {
    title: "Bellatrix Customer Support",
    subtitle: "When and How You Need It",
    description:
      "Our dedicated support team is here to ensure your success with comprehensive assistance and expert guidance.",
    image:
      "https://i.pinimg.com/1200x/c4/3b/47/c43b47b28329114afa50028b00c829b8.jpg",
    items: [
      "Always be in the loop with weekly status update calls with your designated project manager.",
      "Get a peek into what is being done with access to JIRA, giving you a real-time view into progress.",
      "Remain in direct communication throughout the day with your designated team through Slack.",
      "Whether you prefer tickets, calls, or emails, communicating with us is a breeze.",
    ],
    contentDescription:
      "For Bellatrix technical support concerning unexpected ERP implementation issues or keeping an eye on customizations and configurations, our team of Bellatrix consultants are available for as much or as little support as you need.",
    supportInfoTitle: "24/7 Support Available",
    supportInfoDescription:
      "Our support team is available around the clock to ensure your business operations run smoothly without interruption.",
  };

  // PRIORITIZE direct props > data prop > default data for real-time preview
  const sectionData = {
    title: propTitle || data?.title || defaultData.title,
    subtitle: propSubtitle || data?.subtitle || defaultData.subtitle,
    description:
      propDescription || data?.description || defaultData.description,
    image: propImage || data?.image || defaultData.image,
    items:
      propItems && propItems.length > 0
        ? propItems
        : data?.items || defaultData.items,
    contentDescription:
      data?.contentDescription || defaultData.contentDescription,
    supportInfoTitle:
      propSupportInfoTitle ||
      data?.supportInfoTitle ||
      defaultData.supportInfoTitle,
    supportInfoDescription:
      propSupportInfoDescription ||
      data?.supportInfoDescription ||
      defaultData.supportInfoDescription,
  };

  const cacheVersion = _updatedAt || data?._updatedAt || Date.now();

  return (
    <>
      <section
        className="py-20 relative overflow-hidden animate-background-glow theme-bg-animated"
        style={{ backgroundColor: "var(--color-brand-dark-navy)" }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              className="text-blue-300"
            >
              <pattern
                id="supportGrid"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#supportGrid)" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Title Section */}
          <header className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
              {sectionData.title}:{" "}
              <span className="text-white">{sectionData.subtitle}</span>
            </h2>
            <p className="text-lg text-white leading-relaxed max-w-3xl mx-auto">
              {sectionData.description}
            </p>
          </header>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Section */}
            <div className="order-2 lg:order-1">
              <div className="relative group">
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-2xl">
                  <img
                    alt="Bellatrix Customer Support"
                    src={addMediaVersionToBust(sectionData.image, cacheVersion)}
                    className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg brightness-110 contrast-110 saturate-110 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-4 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="order-1 lg:order-2 space-y-6">
              <p className="text-base lg:text-lg text-white leading-relaxed">
                {sectionData.contentDescription}
              </p>

              <ul className="space-y-4 text-white">
                {sectionData.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-white rounded-full mt-2 mr-4"></div>
                    <span className="leading-relaxed">
                      {typeof item === "string"
                        ? item
                        : item.text || item.label || ""}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Additional Support Info */}
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-6 rounded-xl border border-blue-400/30 backdrop-blur-sm">
                <h4 className="font-bold text-white mb-2">
                  {sectionData.supportInfoTitle}
                </h4>
                <p className="text-white">
                  {sectionData.supportInfoDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerSupport;
