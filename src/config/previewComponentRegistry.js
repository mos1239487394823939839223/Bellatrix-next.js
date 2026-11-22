/**
 * Section components for the admin live preview, generated from the single
 * section registry (src/sections). Components are React.lazy wrappers, so the
 * admin no longer downloads every section up front; render them inside
 * <Suspense>.
 */
import { lazy } from "react";
import { SECTIONS } from "../sections/sections";
import { resolveSection } from "../sections/registry";

const lazyByPath = new Map();
const lazyFor = (entry) => {
  if (!lazyByPath.has(entry.path)) lazyByPath.set(entry.path, lazy(entry.load));
  return lazyByPath.get(entry.path);
};

/** type (incl. aliases) → lazy component */
export const componentRegistry = Object.fromEntries(
  SECTIONS.flatMap((s) => [...s.types, ...(s.aliases || [])].map((t) => [t, lazyFor(s)]))
);

/** Lazy component for a saved section type (tolerant of naming variants), or null. */
export const getComponentByType = (componentType) => {
  const entry = resolveSection(componentType);
  return entry ? lazyFor(entry) : null;
};

export const hasComponent = (componentType) => Boolean(resolveSection(componentType));

export default componentRegistry;
