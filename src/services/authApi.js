/**
 * Auth endpoints used by useAuth. Runs on the shared HttpClient; returns the
 * backend envelope ({ success, data, message }) exactly as callers expect.
 */
import { http } from "./index";

const post = async (path, body) => (await http.request("POST", path, { body, unwrap: false })).raw;

// Authentication API endpoints
export const authService = {
  // Login
  login: async (credentials) => {
    const response = await post("/Authentication/Login", {
      emailOrUserName: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe || false,
    });
    return response;
  },

  // Registration
  register: async (userData) => {
    const response = await post("/Authentication/Registration", {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      username: userData.username,
    });
    return response;
  },

  // Verification
  verify: async (verificationData) => {
    const response = await post("/Authentication/Verification", {
      email: verificationData.email,
      verificationCode: verificationData.code,
    });
    return response;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await post("/Authentication/Forgot-Password", {
      email: email,
    });
    return response;
  },

  // Reset Password
  resetPassword: async (resetData) => {
    const response = await post("/Authentication/Reset-Password", {
      email: resetData.email,
      resetToken: resetData.resetToken,
      newPassword: resetData.newPassword,
      confirmPassword: resetData.confirmPassword,
    });
    return response;
  },

  // Change Password (for authenticated users)
  changePassword: async (passwordData) => {
    const response = await post("/Authentication/Change-Password", {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    });
    return response;
  },
};

export default authService;
