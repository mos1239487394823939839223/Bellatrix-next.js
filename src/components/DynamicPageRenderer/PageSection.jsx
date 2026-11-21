import { memo, useMemo } from "react";
import ComponentNotFound from "./ComponentNotFound";
import { extractComponentData, buildSafeProps } from "../../utils/componentDataExtractor";

// React.memo: when useComponentLoader loads component-3, only component-3's
// PageSection re-renders. All other sections bail out early (same props).
const PageSection = memo(({ section, index, componentData, isNewFormat = false }) => {
  const sectionId = isNewFormat ? `component-${index}` : section.uid;
  const themeAttribute = section.theme === 1 ? "light" : "dark";

  if (!componentData || !componentData.Component) {
    // Still fetching the JS module — show a neutral skeleton instead of an error
    return (
      <section
        data-theme={themeAttribute}
        style={{ minHeight: 120, background: "transparent" }}
        aria-hidden="true"
      />
    );
  }

  const { Component } = componentData;

  if (isNewFormat) {
    const normalizedProps = extractComponentData(section);
    const safeProps = buildSafeProps(normalizedProps);
    const propsToPass = {
      ...safeProps,
      // Use section's own timestamp only — never Date.now() (would change every render)
      _updatedAt: section.updatedAt || section.updated_at,
      renderIcon: safeProps.renderIcon || (() => null),
      openProgramModal: safeProps.openProgramModal || (() => {}),
      // Left undefined when absent so cards can hide "Learn More" buttons that would do nothing
      openFeatureModal: safeProps.openFeatureModal,
      onCtaClick: safeProps.onCtaClick || (() => {}),
    };

    return (
      <section data-theme={themeAttribute}>
        <Component {...propsToPass} />
      </section>
    );
  }

  const transformedProps = {
    data: section.props,
    ...section.props,
  };

  return (
    <section data-theme={themeAttribute}>
      <Component {...transformedProps} />
    </section>
  );
});

PageSection.displayName = "PageSection";
export default PageSection;

