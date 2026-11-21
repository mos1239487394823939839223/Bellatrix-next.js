'use client'
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { usePageData } from "../../hooks/usePageData";
import { getSsrComponent } from "../ssrComponentMap";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import PageSection from "./PageSection";

const EMPTY = [];

const isSectionVisible = (section) => {
  if (!section) return false;

  if (section.isVisible === false || section.isVisible === 0) {
    return false;
  }

  if (section.is_visible === false || section.is_visible === 0) {
    return false;
  }

  return true;
};

const DynamicPageRenderer = ({ slug: slugProp, initialData = null }) => {
  const params = useParams();
  const slug = slugProp || params.slug;
  // Pass initialData so usePageData can skip the client fetch when SSR data is available
  const { pageData, loading, error } = usePageData(slug, initialData);


  // Stable reference: avoids new [] on every render when pageData is null/undefined
  const components = pageData?.components || pageData?.sections || EMPTY;
  const isNewFormat = !!pageData?.components;

  // Memoize filtered+mapped sections so PageSection props are stable references
  const filteredSections = useMemo(() => {
    if (!components.length) return EMPTY;
    return components
      .filter(isSectionVisible)
      .map((section, index) => {
        // Resolved synchronously so the section renders on the server (SEO + LCP)
        const Component = getSsrComponent(section.componentType);
        return {
          section,
          index,
          sectionId: isNewFormat ? `component-${index}` : section.uid,
          componentData: Component ? { Component } : null,
        };
      });
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
      {filteredSections.map(({ section, index, sectionId, componentData }) => (
        <PageSection
          key={sectionId}
          section={section}
          index={index}
          componentData={componentData}
          isNewFormat={isNewFormat}
        />
      ))}
    </div>
  );
};

export default DynamicPageRenderer;

