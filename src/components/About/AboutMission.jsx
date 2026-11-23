import React from "react";
import Image from "next/image";
import { Section, SectionHeader } from "../site";

const AboutMission = ({ data }) => {
  // Static fallback data (CMS data comes via props)
  const defaultData = {
    title: "Our Mission",
    description:
      "To empower businesses with innovative technology solutions that transform operations, enhance productivity, and drive sustainable growth.",
    vision:
      "To be the global leader in business transformation consulting, helping organizations achieve their full potential through technology excellence.",
  };

  // PRIORITIZE props data over default data for real-time preview
  // Handle both direct data and normalized {data: {...}} format
  const rawData = data?.data || data || {};
  
  // Default stats if not provided
  const defaultStats = [
    { value: "500+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "15+", label: "Years Experience" },
    { value: "50+", label: "Expert Team" },
  ];
  
  const missionData = {
    title: rawData.title || defaultData?.title || "Our Mission",
    subtitle: rawData.subtitle || defaultData?.subtitle || "",
    description: rawData.description || defaultData?.description || "To empower businesses with innovative technology solutions that transform operations, enhance productivity, and drive sustainable growth.",
    vision: rawData.vision || defaultData?.vision || "To be the global leader in business transformation consulting, helping organizations achieve their full potential through technology excellence.",
    visionTitle: rawData.visionTitle || defaultData?.visionTitle || "Our Vision",
    additionalContent: rawData.additionalContent || defaultData?.additionalContent || "",
    image: rawData.image || defaultData?.image || "/images/ourProServices.png",
    imageAlt: rawData.imageAlt || defaultData?.imageAlt || "About Bellatrix - Professional Services",
    badgeText: rawData.badgeText || defaultData?.badgeText || "Industry Leader",
    missionPointsTitle: rawData.missionPointsTitle || defaultData?.missionPointsTitle || "Key Focus Areas",
    stats: (Array.isArray(rawData.stats) && rawData.stats.length > 0) ? rawData.stats : (defaultData?.stats || defaultStats),
    missionPoints: Array.isArray(rawData.missionPoints) ? rawData.missionPoints : (defaultData?.missionPoints || []),
  };

  // Debug disabled in production — data shape is stable


  return (
    <Section id="about-section" tone="plain" band={false} width="container" containerClassName="px-4 md:px-8" className="bg-white">
        <SectionHeader
          title={missionData.title || "About Bellatrix"}
          description={missionData.subtitle}
          tone="none"
          className="mb-14"
          titleClassName="text-4xl md:text-5xl font-extrabold mb-3 text-blue-900 tracking-tight"
          descriptionClassName="text-lg max-w-2xl mx-auto mb-3 text-blue-700"
        >
          <p className="text-base max-w-2xl mx-auto text-gray-600">{missionData.description || "We are a leading Bellatrix consultancy dedicated to transforming businesses through innovative technology solutions."}</p>
        </SectionHeader>
        <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-16">
          {/* Image - Left Side */}
          <div className="flex-1 flex justify-center md:sticky md:top-28">
            <div className="relative max-w-md w-full bg-slate-50 rounded-2xl shadow-md p-5 flex flex-col items-center border border-slate-200">
              <Image
                src={missionData.image || "/images/ourProServices.png"}
                alt={missionData.imageAlt || "About Bellatrix - Professional Services"}
                width={400}
                height={320}
                className="w-full h-auto rounded-xl shadow-sm mb-3 object-cover"
                style={{ maxHeight: 320 }}
              />
              <span className="inline-block bg-white text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-1 rounded-full mt-2">{missionData.badgeText}</span>
            </div>
          </div>
          {/* Content - Right Side */}
          <div className="flex-1 space-y-6">
            {missionData.vision && (
              <div className="mb-4 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <h4 className="text-lg font-semibold mb-1 text-blue-900">{missionData.visionTitle}</h4>
                <p className="text-sm leading-relaxed text-slate-600">{missionData.vision}</p>
              </div>
            )}
            {missionData.additionalContent && (
              <div className="mb-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-sm leading-relaxed text-slate-700">{missionData.additionalContent}</p>
              </div>
            )}
            {/* Stats Grid - Dynamic */}
            {missionData.stats && missionData.stats.length > 0 && (
              <div className="grid grid-cols-2 auto-rows-fr gap-4">
                {missionData.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col shadow-sm"
                  >
                    {(() => {
                      const value = String(stat.value || stat.number || "0");
                      // Numbers ("500+", "98%") read as big stats; words read as a card heading
                      const isNumeric = /^[\s\d$€£+.,%xX/-]+$/.test(value);
                      return (
                        <div className={isNumeric ? "text-3xl font-bold text-blue-700" : "text-base font-semibold leading-snug text-slate-900"}>
                          {value}
                        </div>
                      );
                    })()}
                    <div className="text-sm leading-relaxed text-slate-600 mt-1.5">{stat.label || stat.text || stat.description || "Statistic"}</div>
                  </div>
                ))}
              </div>
            )}
            {/* Mission Points Section */}
            {missionData.missionPoints && missionData.missionPoints.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-3 text-blue-900">{missionData.missionPointsTitle}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 md:auto-rows-fr gap-4">
                  {missionData.missionPoints.map((point, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3"
                    >
                      <div className="w-7 h-7 shrink-0 rounded-full bg-blue-600 flex items-center justify-center" aria-hidden="true">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-1 text-slate-900">{point.title || point.label || `Point ${index + 1}`}</h5>
                        <p className="text-sm leading-relaxed text-slate-600">{point.description || point.text || point.content || "Mission point description"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
    </Section>
  );
};

export default AboutMission;
