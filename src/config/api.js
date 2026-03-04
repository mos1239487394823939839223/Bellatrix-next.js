// Centralized API Configuration
// All API endpoints should use these base URLs

/**
 * Get the base URL for the API
 * In development, returns empty string to use Next.js rewrites proxy
 * In production, returns the configured API URL
 */
export const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return ""; // Use Next.js rewrites proxy in development
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin; // Match deployed origin to avoid CORS mismatches
  }
  return "https://bellatrixinc.com";
};

/**
 * Get the absolute base URL (always includes domain/IP)
 * Useful for file links that need to be absolute
 */
export const getAbsoluteBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // Use current page origin in production to avoid mixed-content (HTTP on HTTPS page)
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://www.bellatrixinc.com"; // Fallback to HTTPS production domain
};

/**
 * Get the base URL with /api suffix
 */
export const getApiBaseUrlWithApi = () => {
  if (process.env.NODE_ENV === 'development') {
    return "/api"; // Use Next.js rewrites proxy in development
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL_WITH_API) {
    return process.env.NEXT_PUBLIC_API_BASE_URL_WITH_API;
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/api`;
  }
  return "https://bellatrixinc.com/api";
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
