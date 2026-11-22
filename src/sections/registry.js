/**
 * Section registry API — every consumer (live renderer, server renderer,
 * admin preview, admin catalog) resolves sections through these functions.
 * The data lives in ./sections.js.
 */
import { SECTIONS } from "./sections";

const byPath = new Map(SECTIONS.map((s) => [s.path, s]));

// Exact type → entry, for catalog types and aliases
const byType = new Map();
for (const s of SECTIONS) {
  for (const t of [...s.types, ...(s.aliases || [])]) {
    if (byType.has(t)) throw new Error(`Section type "${t}" is registered twice`);
    byType.set(t, s);
  }
}

/** Tolerant lookup: exact, then common naming variants saved over the years. */
export function resolveSection(type) {
  if (!type) return null;
  if (byType.has(type)) return byType.get(type);
  const candidates = [
    type.replace(/CTA/g, "Cta"),
    type.replace(/Cta/g, "CTA"),
    type.replace(/Section$/, ""),
    `${type}Section`,
    type.replace(/sSection$/, "Section"),
    type.charAt(0).toUpperCase() + type.slice(1),
  ];
  for (const c of candidates) if (byType.has(c)) return byType.get(c);
  return null;
}

/** Component path for a section type (or null). */
export const pathForType = (type) => resolveSection(type)?.path ?? null;

/** Registry entry for a component path (or null). */
export const sectionByPath = (path) => byPath.get(path) ?? null;

/** Section types offered in the admin "Add component" catalog → path. */
export const catalogTypeToPath = Object.freeze(
  Object.fromEntries(SECTIONS.flatMap((s) => s.types.map((t) => [t, s.path])))
);

/** All registered types including aliases. */
export const allSectionTypes = () => [...byType.keys()];

// Loaded component cache (module default export) — survives navigations.
const loaded = new Map();

/** Load a section component by path; resolves to the component (default export). */
export async function loadSectionByPath(path) {
  if (loaded.has(path)) return loaded.get(path);
  const entry = byPath.get(path);
  if (!entry) throw new Error(`Unknown section path: ${path}`);
  const mod = await entry.load();
  const component = mod.default ?? mod;
  loaded.set(path, component);
  return component;
}

export default { resolveSection, pathForType, sectionByPath, catalogTypeToPath, loadSectionByPath };
