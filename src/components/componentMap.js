/**
 * Section lookup for the client renderer and admin tools.
 * Thin adapter over the single section registry (src/sections) — the list of
 * sections is no longer maintained here.
 */
import { catalogTypeToPath, loadSectionByPath, pathForType } from "../sections/registry";

/** Catalog types → component path (what the admin "Add component" list offers). */
export const idToPathMap = catalogTypeToPath;

/** Component path for any saved section type (catalog types, aliases, naming variants). */
export const getComponentPathFromId = (componentId) => pathForType(componentId);

const isChunkError = (error) =>
  error?.name === "ChunkLoadError" ||
  /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed|Expected a JavaScript/i.test(
    error?.message || ""
  );

/**
 * Load a section component by path (cached by the registry).
 * Returns null on failure. If the failure is a stale chunk after a new deploy,
 * reloads the page once (at most every 30 s) to pick up the fresh build.
 */
export const loadComponent = async (componentPath) => {
  try {
    return await loadSectionByPath(componentPath);
  } catch (error) {
    if (isChunkError(error) && typeof window !== "undefined") {
      const RELOAD_KEY = "chunkReloadAt";
      const lastReload = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
      const now = Date.now();
      if (now - lastReload > 30_000) {
        sessionStorage.setItem(RELOAD_KEY, String(now));
        window.location.reload();
        return null;
      }
    }
    console.error(`Failed to load component ${componentPath}:`, error);
    return null;
  }
};
