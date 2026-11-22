/**
 * Legacy token helpers — thin wrappers over the single TokenStore
 * (src/core/http/TokenStore.js), kept so existing imports keep working.
 */
import { tokenStore } from "../core/http/TokenStore";

export const getAuthToken = () => tokenStore.getToken();

export const setAuthToken = (token) => tokenStore.setToken(token, { remember: true });

export const setUserData = (userData) => tokenStore.setUser(userData);

export const getUserData = () => tokenStore.getUser();

export const clearAuthData = () => tokenStore.clear();

export const isAuthenticated = () => tokenStore.isAuthenticated();

/** "Bearer <token>" or null (string, as before). */
export const getAuthHeader = () => {
  const token = tokenStore.getToken();
  return token ? `Bearer ${token}` : null;
};

export default {
  getAuthToken,
  setAuthToken,
  setUserData,
  getUserData,
  clearAuthData,
  isAuthenticated,
  getAuthHeader,
};
