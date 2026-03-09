import { normalizeProps } from "./normalizeProps";

/**
 * Extract component data from various formats
 */
export const extractComponentData = (component) => {
  let rawData = {};

  if (component.contentJson) {
    try {
      rawData =
        typeof component.contentJson === "string"
          ? JSON.parse(component.contentJson)
          : component.contentJson;
    } catch (err) {
      console.warn("Failed to parse contentJson:", err);
    }
  } else if (component.content && typeof component.content === "object") {
    rawData = component.content;
  }

  const normalizedData = normalizeProps(component.componentType, rawData);
  return normalizedData;
};

/**
 * Build safe props with default arrays for common keys
 */
export const buildSafeProps = (props) => {
  const commonArrayKeys = [
    "items",
    "list",
    "milestones",
    "services",
    "steps",
    "faqs",
    "features",
    "plans",
    "members",
    "values",
    "sections",
    "cases",
    "caseStudies",
    "benefits",
    "types",
    "programs",
    "keyModules",
    "solutions",
  ];
  const safe = { ...(props || {}) };
  commonArrayKeys.forEach((key) => {
    if (safe[key] === undefined || safe[key] === null) safe[key] = [];
  });
  return safe;
};

