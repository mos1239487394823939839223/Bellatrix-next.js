import axios from "axios";

// Get API base URL - use proxy in dev, direct URL in production
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return "/api"; // Use Next.js rewrites proxy in development
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
  }
  return "https://www.bellatrixinc.com/api";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor to normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      message:
        error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 0,
      details: error.response?.data || null,
    };
    return Promise.reject(normalizedError);
  },
);

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Token will be added by individual thunks when needed
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Helper function for file uploads using multipart/form-data
 * @param {FormData} formData - The form data containing files
 * @param {string} url - The endpoint URL
 * @param {Object} options - Additional options including auth token
 */
export const uploadForm = async (
  formData: FormData,
  url: string,
  options: any = {},
) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(options.headers || {}),
    },
    ...options,
  };

  return api.post(url, formData, config);
};

/**
 * Helper to get auth token from state - to be used in thunks
 * @param {Object} state - Redux root state
 * @returns {string|null} JWT token or null
 */
export const getAuthToken = (state: any): string | null => {
  return state.auth?.token || null;
};

// Alias for backward compatibility with store slices
export const getAuthTokenFromState = getAuthToken;

// Lightweight helper for JSON POSTs (returns unwrapped data)
export const postJson = async (url: string, payload: any, options: any = {}) => {
  const res = await api.post(url, payload, options);
  return res.data;
};

export default api;
