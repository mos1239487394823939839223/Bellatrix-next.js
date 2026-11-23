/**
 * Backwards-compatible API facade.
 *
 * Older modules call `api.get(url, { params, signal })` and read `res.data`
 * (axios style). This adapter keeps that exact interface but delegates to the
 * shared HttpClient (src/core/http/HttpClient.js), so every request now gets
 * the same token handling, timeout, envelope unwrapping and ApiError.
 * New code should use `services` from src/services instead.
 */
import { http } from "..";
import { tokenStore } from "../../core/http/TokenStore";
import { getApiBaseUrlWithApi } from "../../config/api.js";

const call = (method) => async (url, a, b) => {
  const hasBody = method === "POST" || method === "PUT" || method === "PATCH";
  const config = (hasBody ? b : a) || {};
  const res = await http.request(method, url, {
    body: hasBody ? a : undefined,
    params: config.params,
    signal: config.signal,
    headers: config.headers && !String(config.headers["Content-Type"] || "").startsWith("multipart/")
      ? config.headers
      : undefined,
    timeoutMs: config.timeout,
  });
  return { data: res.data, status: res.status, headers: res.headers };
};

const api = {
  get: call("GET"),
  delete: call("DELETE"),
  post: call("POST"),
  put: call("PUT"),
  patch: call("PATCH"),
  defaults: {
    get baseURL() {
      return getApiBaseUrlWithApi();
    },
  },
};

/** Multipart POST (FormData). */
export const uploadForm = async (formData, url, options = {}) => api.post(url, formData, options);

/** Token from Redux state (kept for older thunks). */
export const getAuthTokenFromState = (state) => state.auth?.token || tokenStore.getToken();

/** JSON POST returning the unwrapped payload. */
export const postJson = async (url, payload, options = {}) => (await api.post(url, payload, options)).data;

export default api;
