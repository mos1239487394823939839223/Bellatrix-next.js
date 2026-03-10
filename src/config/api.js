// Centralized API Configuration
// All API endpoints should use these base URLs

// Detect local dev: Turbopack dev rewrites redirect (not proxy), converting
// POST→GET. On localhost we bypass the dev proxy and go to the backend directly.
const isLocalhost = () =>
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

/**
 * Get the base URL for the API (no /api suffix)
 */
export const getApiBaseUrl = () => {
  if (isLocalhost()) {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "https://bellatrixinc.com";
  }
  if (typeof window !== 'undefined') {
    return ""; // Same-origin: nginx routes /api/ to the .NET backend
  }
  // SSR fallback
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://bellatrixinc.com";
};

/**
 * Get the absolute base URL (always includes domain/IP)
 * Useful for file links that need to be absolute.
 *
 * IMPORTANT: In the browser we ALWAYS use window.location.origin so that
 * generated URLs go through nginx (which proxies /uploads/ and /api/ to the
 * backend) rather than hitting the raw backend IP:port directly.
 */
export const getAbsoluteBaseUrl = () => {
  // In the browser, always use the page origin so nginx routes requests correctly.
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  // SSR fallback – backend IP is fine here (no browser restrictions)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return "https://bellatrixinc.com";
};

/**
 * Get the base URL with /api suffix
 */
export const getApiBaseUrlWithApi = () => {
  if (isLocalhost()) {
    return process.env.NEXT_PUBLIC_API_BASE_URL
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
      : "https://bellatrixinc.com/api";
  }
  if (typeof window !== 'undefined') {
    return "/api"; // Same-origin: nginx routes /api/ to the .NET backend
  }
  // SSR fallback
  return process.env.NEXT_PUBLIC_API_BASE_URL_WITH_API || "https://bellatrixinc.com/api";
};

// Export constants for backward compatibility
export const API_BASE_URL = getApiBaseUrl();
export const API_BASE_URL_WITH_API = getApiBaseUrlWithApi();

export default {
  getApiBaseUrl,
  getAbsoluteBaseUrl,
  getApiBaseUrlWithApi,
  API_BASE_URL,
  API_BASE_URL_WITH_API,
};
