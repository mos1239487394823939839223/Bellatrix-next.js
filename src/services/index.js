/**
 * Composition root: builds the HttpClient once and injects it into every
 * service. Components import `services` (or a single service) from here and
 * never create HTTP clients themselves (dependency inversion).
 *
 *   import { services } from "@/src/services";      // path alias not configured;
 *   import { services } from "../../services";       // use a relative import
 *   const pages = await services.pages.listAll();
 */
import { HttpClient } from "../core/http/HttpClient";
import { tokenStore } from "../core/http/TokenStore";
import { getApiBaseUrlWithApi } from "../config/api.js";
import {
  AuthService,
  CategoriesService,
  ComponentsService,
  ContactMessagesService,
  DashboardService,
  MediaService,
  PagesService,
  SettingsService,
} from "./domain";

export const http = new HttpClient({
  baseUrl: getApiBaseUrlWithApi, // resolved per call (browser vs server vs localhost)
  getToken: () => tokenStore.getToken(),
  // An expired/invalid session: drop the stale token so the admin shows the login page.
  onUnauthorized: () => tokenStore.clear(),
  timeoutMs: 15000,
});

const pages = new PagesService(http);
const media = new MediaService(http);
const messages = new ContactMessagesService(http);

export const services = Object.freeze({
  pages,
  components: new ComponentsService(http),
  media,
  messages,
  categories: new CategoriesService(http),
  settings: new SettingsService(http),
  auth: new AuthService(http, tokenStore),
  dashboard: new DashboardService({ pages, media, messages }),
});

export { tokenStore };
export { ApiError } from "../core/http/ApiError";
export { ValidationError, validate, rules } from "../core/validation/Validator";
export * as schemas from "../core/validation/schemas";
export default services;
