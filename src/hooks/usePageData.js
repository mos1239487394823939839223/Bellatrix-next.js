import { useState, useEffect } from "react";
import pagesAPI from "../lib/pagesAPI";
import { cachedFetch, invalidateCacheByPrefix } from "../lib/apiCache";

/**
 * Fetches and manages page data for a given slug.
 *
 * @param {string} slug - The page slug to fetch data for.
 * @param {object|null} initialData - SSR-provided page data (skips client fetch when present).
 *   Passed from Server Components via DynamicPageRenderer to eliminate the LCP-blocking
 *   client-side data waterfall on public pages.
 */
export const usePageData = (slug, initialData = null) => {
  const [pageData, setPageData] = useState(initialData);
  const [loading, setLoading] = useState(initialData === null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async (forceRefresh = false) => {
      if (!slug) {
        setLoading(false);
        return;
      }

      // Skip fetch when we already have SSR-provided data (unless forced by admin save)
      if (initialData && !forceRefresh) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const cacheKey = `page:${slug}`;

        // On forced refresh (after admin save) bust the cache entry
        if (forceRefresh) invalidateCacheByPrefix(cacheKey);

        const data = await cachedFetch(
          cacheKey,
          async () => {
            const response = await pagesAPI.getPublicPageBySlug(slug);
            return response.data || response;
          },
          // Cache public page data for 2 minutes
          120_000
        );

        setPageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();

    const handlePageDataUpdate = (event) => {
      const { slug: updatedSlug } = event.detail;
      if (updatedSlug === slug) {
        // Force-refresh so we pick up the newly saved data (admin live-preview)
        fetchPage(true);
      }
    };

    window.addEventListener("pageDataUpdated", handlePageDataUpdate);

    return () => {
      window.removeEventListener("pageDataUpdated", handlePageDataUpdate);
    };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return { pageData, loading, error };
};
