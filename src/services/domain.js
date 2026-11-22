/**
 * Domain services — one class per API area, each with a single responsibility.
 * They depend on an HttpClient abstraction passed in by the container
 * (src/services/index.js), never on fetch/axios directly.
 */
import { BaseService, asList } from "./BaseService";
import { assertValid } from "../core/validation/Validator";
import {
  categorySchema,
  componentSchema,
  contactMessageSchema,
  loginSchema,
  mediaDetailsSchema,
  pageSchema,
} from "../core/validation/schemas";

// ---------------------------------------------------------------- Pages
export class PagesService extends BaseService {
  constructor(http) {
    super(http, "/Pages");
  }

  async listAll(opts) {
    return asList(await this.list(undefined, opts));
  }

  /** Published page by slug (public, no token needed). */
  getPublicBySlug(slug, opts) {
    return this.http.get(this.path(`/public/${encodeURIComponent(slug)}`), { ...opts, auth: false });
  }

  async getComponents(pageId, opts) {
    return asList(await this.http.get(this.path(`/${pageId}/components`), opts));
  }

  /** Create or update page settings after validation. */
  save(page, opts) {
    assertValid(pageSchema, page);
    return page.id ? this.http.put(this.path(), page, opts) : this.create(page, opts);
  }

  reorderComponents(pageId, componentIds, opts) {
    return this.http.put(this.path(`/${pageId}/reorder-components`), { componentIds }, opts);
  }
}

// ------------------------------------------------------- Page sections
export class ComponentsService extends BaseService {
  constructor(http) {
    super(http, "/Pages/components");
  }

  /** Save one section. contentJson may be an object or a JSON string. */
  saveSection(component, opts) {
    const payload = {
      ...component,
      contentJson:
        typeof component.contentJson === "string" ? component.contentJson : JSON.stringify(component.contentJson ?? {}),
    };
    assertValid(componentSchema, payload);
    return this.update(payload.id, payload, opts);
  }
}

// ---------------------------------------------------------------- Media
export class MediaService extends BaseService {
  constructor(http) {
    super(http, "/Media");
  }

  async page({ page = 1, pageSize = 48, type, searchTerm } = {}, opts) {
    const data = await this.list({ page, pageSize, type: type && type !== "all" ? type : undefined, searchTerm }, opts);
    const items = asList(data);
    return { items, hasMore: data?.hasMore ?? items.length === pageSize };
  }

  statistics(opts) {
    return this.http.get(this.path("/statistics"), opts);
  }

  getPublic(id, opts) {
    return this.http.get(this.path(`/public/${id}`), { ...opts, auth: false });
  }

  /** Upload one file with progress; resolves with the created media item. */
  async upload(file, { onProgress, altText, caption, role = 12 } = {}) {
    const form = new FormData();
    form.append("File", file);
    form.append("Role", String(role)); // 12 = General
    form.append("AlternateText", altText || file.name.replace(/\.[^.]+$/, ""));
    form.append("Caption", caption || "");
    form.append("SortOrder", "1");
    const data = await this.http.upload(this.path("/upload"), form, { onProgress });
    return Array.isArray(data) ? data[0] : data;
  }

  /** Update alt text / caption (validated). */
  async updateDetails(id, details, opts) {
    const body = {
      alternateText: details.alternateText ?? "",
      caption: details.caption ?? "",
      ...(details.role != null ? { role: details.role } : {}),
      ...(details.sortOrder != null ? { sortOrder: details.sortOrder } : {}),
    };
    assertValid(mediaDetailsSchema, body);
    try {
      return await this.update(id, body, opts);
    } catch (err) {
      // Some API builds bind this endpoint from form fields instead of JSON
      if (err.status !== 400 && err.status !== 415) throw err;
      const form = new FormData();
      form.append("AlternateText", body.alternateText);
      form.append("Caption", body.caption);
      if (body.role != null) form.append("Role", String(body.role));
      if (body.sortOrder != null) form.append("SortOrder", String(body.sortOrder));
      return this.http.put(this.path(`/${id}`), form, opts);
    }
  }
}

// ------------------------------------------------------ Contact messages
export class ContactMessagesService extends BaseService {
  constructor(http) {
    super(http, "/ContactMessages");
  }

  /** Public submit — validated with the same rules as the form. */
  submit(form, opts) {
    assertValid(contactMessageSchema, form);
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phone?.trim() || null,
      companyName: form.companyName?.trim() || null,
      industry: form.industryId,
      country: form.countryId,
      message: form.message.trim(),
    };
    return this.http.post(this.path("/submit"), payload, { ...opts, auth: false });
  }

  search(params, opts) {
    return this.http.get(this.path("/search"), { ...opts, params });
  }
  recent(count = 5, opts) {
    return this.http.get(this.path("/recent"), { ...opts, params: { count } });
  }
  stats(opts) {
    return this.http.get(this.path("/stats"), opts);
  }
  markReplied(id, opts) {
    return this.http.patch(this.path(`/${id}/mark-replied`), undefined, opts);
  }
  markUnreplied(id, opts) {
    return this.http.patch(this.path(`/${id}/mark-unreplied`), undefined, opts);
  }
}

// ------------------------------------------------------------ Categories
export class CategoriesService extends BaseService {
  constructor(http) {
    super(http, "/Categories");
  }

  async listAll(opts) {
    return asList(await this.list(undefined, opts));
  }
  navbar(opts) {
    return this.http.get(this.path("/navbar"), { ...opts, auth: false });
  }
  search(keyword, opts) {
    return this.http.get(this.path("/search"), { ...opts, params: { keyword } });
  }

  /** Create or update (the API updates with PUT /Categories and the id in the body). */
  save(category, opts) {
    const data = { ...category, name: String(category.name ?? "").trim() };
    assertValid(categorySchema, data);
    return data.id != null ? this.http.put(this.path(), data, opts) : this.create(data, opts);
  }
}

// --------------------------------------------------------------- Settings
export class SettingsService extends BaseService {
  constructor(http) {
    super(http, "/Settings");
  }

  publicList(opts) {
    return this.http.get(this.path("/public"), { ...opts, auth: false });
  }
  publicDictionary(opts) {
    return this.http.get(this.path("/public/dictionary"), { ...opts, auth: false });
  }
  byKey(key, opts) {
    return this.http.get(this.path(`/key/${encodeURIComponent(key)}`), opts);
  }
  bulkUpdate(settings, opts) {
    return this.http.put(this.path("/bulk"), settings, opts);
  }
}

// -------------------------------------------------------------- Auth
export class AuthService {
  /** @param {import("../core/http/HttpClient").HttpClient} http @param {import("../core/http/TokenStore").TokenStore} tokens */
  constructor(http, tokens) {
    this.http = http;
    this.tokens = tokens;
  }

  async login({ email, password, rememberMe = false }) {
    assertValid(loginSchema, { email, password });
    const data = await this.http.post("/Authentication/Login", { emailOrUserName: email, password, rememberMe }, { auth: false });
    if (!data?.token) throw new Error("Login failed: no session was returned.");
    this.tokens.setToken(data.token, { remember: rememberMe });
    this.tokens.setUser(data);
    return data;
  }

  logout() {
    this.tokens.clear();
  }

  profile(opts) {
    return this.http.get("/Authentication/Profile", opts);
  }

  changePassword(body, opts) {
    return this.http.post("/Authentication/Change-Password", body, opts);
  }

  isAuthenticated() {
    return this.tokens.isAuthenticated();
  }
}

// ------------------------------------------------------------- Dashboard
export class DashboardService {
  /** Composes other services (no HTTP of its own). */
  constructor({ pages, media, messages }) {
    this.pages = pages;
    this.media = media;
    this.messages = messages;
  }

  async overview() {
    const [pages, mediaStats, messageStats, recent] = await Promise.allSettled([
      this.pages.listAll(),
      this.media.statistics(),
      this.messages.stats(),
      this.messages.recent(5),
    ]);
    const value = (r, fallback) => (r.status === "fulfilled" ? r.value : fallback);
    return {
      pages: value(pages, []),
      mediaStats: value(mediaStats, null),
      messageStats: value(messageStats, null),
      recentMessages: asList(value(recent, [])),
    };
  }
}
