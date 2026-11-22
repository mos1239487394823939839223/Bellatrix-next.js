/**
 * Base class for REST resources on the Bellatrix API.
 *
 * Holds the injected HttpClient and the resource path, and provides the
 * standard CRUD calls. Subclasses add only what is specific to their resource
 * (Liskov: a subclass can be used anywhere a BaseService is expected).
 */
export class BaseService {
  /**
   * @param {import("../core/http/HttpClient").HttpClient} http
   * @param {string} resource  e.g. "/Pages"
   */
  constructor(http, resource) {
    if (!http) throw new Error(`${this.constructor.name} needs an HttpClient`);
    this.http = http;
    this.resource = resource;
  }

  path(suffix = "") {
    return `${this.resource}${suffix}`;
  }

  list(params, opts) {
    return this.http.get(this.path(), { ...opts, params });
  }

  getById(id, opts) {
    return this.http.get(this.path(`/${encodeURIComponent(id)}`), opts);
  }

  create(data, opts) {
    return this.http.post(this.path(), data, opts);
  }

  update(id, data, opts) {
    return this.http.put(this.path(`/${encodeURIComponent(id)}`), data, opts);
  }

  remove(id, opts) {
    return this.http.delete(this.path(`/${encodeURIComponent(id)}`), opts);
  }
}

/** Normalise list payloads: array, { items }, { results } or { data }. */
export function asList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    return payload.items || payload.results || payload.data || [];
  }
  return [];
}

export default BaseService;
