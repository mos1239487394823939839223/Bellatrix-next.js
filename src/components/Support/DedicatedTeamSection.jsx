import React from "react";
import { addMediaVersionToBust } from "../../utils/cacheBusting";
import OptimizedImg from "../OptimizedImg";

const DedicatedTeamSection = ({
  data,
  // Direct props for Page Builder
  title: propTitle,
  items: propItems,
  image: propImage,
  members: propMembers,
  _updatedAt, // Timestamp from server for cache-busting
}) => {
  // Default data
  const defaultData = {
    title: "Your Own Dedicated Team of Bellatrix",
    items: [
      "A team will be assigned to you that is familiar with your organization, how you do things, and most importantly, your goals for your ERP system",
      "A committed team familiar with your ERP environment",
      "Experienced professionals, including a project lead and solution consultants",
      "Structured collaboration to avoid knowledge silos",
      "Access to the collective expertise of a broad team of Bellatrix specialists",
    ],
    image: "/images/Support/team.jpeg",
  };

  // Resolve members array from prop or data
  const resolvedMembers = (propMembers && propMembers.length > 0)
    ? propMembers
    : data?.members || [];

  // Extract image: direct prop > members[0].image > data.image > default
  const resolvedImage = propImage
    || (resolvedMembers.length > 0 && resolvedMembers[0]?.image ? resolvedMembers[0].image : null)
    || data?.image
    || defaultData.image;

  // Extract items: support items[] of strings OR bulletPoints[] of objects
  const resolveItems = (raw) => {
    if (!raw || raw.length === 0) return null;
    return raw.map((item) =>
      typeof item === "string" ? item : item.text || item.label || item.bio || ""
    ).filter(Boolean);
  };

  // PRIORITIZE direct props > data prop > default data
  const sectionData = {
    title: propTitle || data?.title || defaultData.title,
    items:
      resolveItems(propItems) ||
      resolveItems(data?.items) ||
      resolveItems(data?.bulletPoints) ||
      defaultData.items,
    image: resolvedImage,
  };

  // Use server timestamp for cache-busting to ensure all browsers get fresh images
  const cacheVersion = _updatedAt || data?._updatedAt || Date.now();

  return (
    <section
      style={{
        backgroundColor: "var(--color-brand-dark-navy)",
        padding: "60px 0",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          inset: "0",
          opacity: "0.1",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            style={{ color: "#60A5FA" }}
          >
            <pattern
              id="dedicatedGrid"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dedicatedGrid)" />
          </svg>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: "0 15px",
          position: "relative",
          zIndex: "10",
        }}
      >
        {/* Section Title */}
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "50px",
            lineHeight: "40px",
            letterSpacing: "-1px",
            color: "white",
          }}
        >
          {sectionData.title.includes("Bellatrix") ? (
            <>
              {sectionData.title.split("Bellatrix")[0]}
              <span style={{ color: "#22D3EE" }}>Bellatrix</span>
              {sectionData.title.split("Bellatrix")[1] || ""}
            </>
          ) : (
            sectionData.title
          )}
        </h2>

        {/* Content Layout */}
        {/* Stacks on phones/tablets, side by side from md up */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
          {/* Text Content with Bullet Points */}
          <div className="w-full md:flex-1 md:max-w-[50%]">
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0",
                fontSize: "16px",
                lineHeight: "1.8",
              }}
            >
              {sectionData.items.map((item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom:
                      index === sectionData.items.length - 1 ? "0" : "20px",
                    position: "relative",
                    paddingLeft: "25px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      content: "",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#22D3EE",
                      borderRadius: "50%",
                      position: "absolute",
                      left: "0",
                      top: "12px",
                    }}
                  ></span>
                  <span style={{ color: "#D1D5DB" }}>
                    {typeof item === "string"
                      ? item
                      : item.text || item.label || ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="w-full md:flex-1 md:max-w-[50%] text-center">
            <div
              style={{
                position: "relative",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                borderRadius: "16px",
                padding: "16px",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
              }}
            >
              <OptimizedImg
                src={addMediaVersionToBust(sectionData.image, cacheVersion)}
                alt="ERP Implementation Team"
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  brightness: "1.1",
                  contrast: "1.1",
                  saturate: "1.1",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "16px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(to top right, rgba(34, 211, 238, 0.05), transparent, rgba(34, 211, 238, 0.05))",
                  pointerEvents: "none",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DedicatedTeamSection;
