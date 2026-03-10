import axios from "axios";
import { getApiBaseUrlWithApi } from "../config/api.js";

const api = axios.create({
  baseURL: getApiBaseUrlWithApi(),
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor: unwrap { data, success, message } envelope and normalize errors
api.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      if (response.data.success === false) {
        const error: any = new Error(response.data.message || "API request failed");
        error.response = { status: response.status, data: response.data };
        throw error;
      }
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const isBrowser = typeof window !== 'undefined';
      if (isBrowser) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("adminToken");
      }
    }
    const normalizedError = {
      message:
        error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 0,
      details: error.response?.data || null,
    };
    return Promise.reject(normalizedError);
  },
);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const isBrowser = typeof window !== 'undefined';
    let token = isBrowser ? localStorage.getItem('authToken') : null;
    if (!token && isBrowser) {
      token = localStorage.getItem('adminToken') ||
              sessionStorage.getItem('authToken') ||
              sessionStorage.getItem('adminToken');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
