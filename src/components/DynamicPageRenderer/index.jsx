'use client'
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { usePageData } from "../../hooks/usePageData";
import { useComponentLoader } from "../../hooks/useComponentLoader";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import PageSection from "./PageSection";

const EMPTY = [];

const DynamicPageRenderer = ({ slug: slugProp }) => {
  const params = useParams();
  const slug = slugProp || params.slug;
  const { pageData, loading, error } = usePageData(slug);

  // Stable reference: avoids new [] on every render when pageData is null/undefined
  const components = pageData?.components || pageData?.sections || EMPTY;
  const { loadedComponents } = useComponentLoader(components);

  const isNewFormat = !!pageData?.components;

  // Memoize filtered+mapped sections so PageSection props are stable references
  // across the incremental loadedComponents updates from useComponentLoader
  const filteredSections = useMemo(() => {
    if (!components.length) return EMPTY;
    return components
      .filter((s) => s.isVisible === true || s.isVisible === 1)
      .map((section, index) => ({
        section,
        index,
        sectionId: isNewFormat ? `component-${index}` : section.uid,
      }));
  }, [components, isNewFormat]);

  const pageType = slug === "home" || !slug ? "home" : "generic";

  if (loading) return <LoadingState pageType={pageType} />;
  if (error) return <ErrorState slug={slug} />;
  if (!pageData) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center"><p className="text-gray-600">No page data available.</p></div>
    </div>
  );
  if (filteredSections.length === 0) return <EmptyState />;

  return (
    <div>
      {filteredSections.map(({ section, index, sectionId }) => (
        <PageSection
          key={sectionId}
          section={section}
          index={index}
          componentData={loadedComponents[sectionId]}
          isNewFormat={isNewFormat}
        />
      ))}
    </div>
  );
};

export default DynamicPageRenderer;

