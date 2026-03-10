import axios from "axios";
import { clearAuthData } from "../utils/tokenManager";

// Determine base URL by the browser's hostname:
// - localhost → use absolute backend URL directly (Turbopack dev rewrites redirect
//   instead of proxy, which converts POST→GET; going direct avoids that)
// - production domain → use relative path (nginx routes /api/ to the .NET backend)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return process.env.NEXT_PUBLIC_API_BASE_URL || "https://bellatrixinc.com";
    }
    return ""; // Same-origin: root-relative paths route via nginx
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://bellatrixinc.com";
};

const authApi = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token expiration
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all authentication data using centralized token manager
      clearAuthData();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

// Authentication API endpoints
export const authService = {
  // Login
  login: async (credentials) => {
    const response = await authApi.post("/api/Authentication/Login", {
      emailOrUserName: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe || false,
    });
    return response.data;
  },

  // Registration
  register: async (userData) => {
    const response = await authApi.post("/api/Authentication/Registration", {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      username: userData.username,
    });
    return response.data;
  },

  // Verification
  verify: async (verificationData) => {
    const response = await authApi.post("/api/Authentication/Verification", {
      email: verificationData.email,
      verificationCode: verificationData.code,
    });
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await authApi.post("/api/Authentication/Forgot-Password", {
      email: email,
    });
    return response.data;
  },

  // Reset Password
  resetPassword: async (resetData) => {
    const response = await authApi.post("/api/Authentication/Reset-Password", {
      email: resetData.email,
      resetToken: resetData.resetToken,
      newPassword: resetData.newPassword,
      confirmPassword: resetData.confirmPassword,
    });
    return response.data;
  },

  // Change Password (for authenticated users)
  changePassword: async (passwordData) => {
    const response = await authApi.post("/api/Authentication/Change-Password", {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    });
    return response.data;
  },
};

export default authApi;
