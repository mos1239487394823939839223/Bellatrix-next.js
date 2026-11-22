import { ApiError } from "./ApiError";

/**
 * Small fetch-based HTTP client used by every service.
 *
 * Responsibilities (and only these):
 *  - build URLs from a base URL + path + query params
 *  - attach the bearer token from an injected token provider
 *  - JSON / FormData bodies, timeouts, caller AbortSignals
 *  - unwrap the backend envelope { success, data, message }
 *  - turn every failure into an ApiError
 *
 * Dependencies are injected (base URL resolver, token provider, 401 hook), so
 * it can be reused for another API or tested with a fake fetch.
 */
export class HttpClient {
  /**
   * @param {object}   opts
   * @param {() => string}        opts.baseUrl        resolves the API base (".../api") per call
   * @param {() => (string|null)} [opts.getToken]     returns the bearer token
   * @param {(err: ApiError) => void} [opts.onUnauthorized] called on 401 when a token was sent
   * @param {number}   [opts.timeoutMs=15000]
   * @param {typeof fetch} [opts.fetchImpl]
   */
  constructor({ baseUrl, getToken = () => null, onUnauthorized, timeoutMs = 15000, fetchImpl } = {}) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
    this.onUnauthorized = onUnauthorized;
    this.timeoutMs = timeoutMs;
    this.fetchImpl = fetchImpl || ((...args) => fetch(...args));
  }

  url(path, params) {
    const base = String(this.baseUrl()).replace(/\/$/, "");
    const full = /^https?:\/\//i.test(path) ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
    if (!params) return full;
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      if (Array.isArray(v)) v.forEach((item) => qs.append(k, String(item)));
      else qs.append(k, String(v));
    });
    const query = qs.toString();
    return query ? `${full}${full.includes("?") ? "&" : "?"}${query}` : full;
  }

  /**
   * Low-level request. Resolves with { data, status, headers, raw } where
   * `data` is the unwrapped payload; rejects with ApiError.
   */
  async request(method, path, { body, params, headers = {}, signal, timeoutMs, auth = true, unwrap = true } = {}) {
    const token = auth ? this.getToken() : null;
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;
    const init = {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && !isForm ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    };

    // Timeout + caller cancellation
    const controller = new AbortController();
    const limit = timeoutMs ?? this.timeoutMs;
    const timer = limit ? setTimeout(() => controller.abort(new DOMException("Timeout", "TimeoutError")), limit) : null;
    if (signal) {
      if (signal.aborted) controller.abort(signal.reason);
      else signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
    }
    init.signal = controller.signal;

    let res;
    try {
      res = await this.fetchImpl(this.url(path, params), init);
    } catch (err) {
      if (signal?.aborted) throw err; // caller cancelled: keep the AbortError semantics
      const timedOut = err?.name === "TimeoutError" || controller.signal.reason?.name === "TimeoutError";
      throw new ApiError(
        timedOut ? "The server took too long to respond. Please try again." : ApiError.defaultMessage(0),
        { status: 0, code: timedOut ? "TIMEOUT" : "NETWORK" }
      );
    } finally {
      if (timer) clearTimeout(timer);
    }

    const body_ = await HttpClient.parseBody(res);

    if (!res.ok) {
      const error = ApiError.fromResponse(res.status, body_);
      if (res.status === 401 && token && this.onUnauthorized) this.onUnauthorized(error);
      throw error;
    }
    // Backend envelope: { success: false, message } on a 200 is still a failure
    if (body_ && typeof body_ === "object" && body_.success === false) {
      throw new ApiError(body_.message || "The request was not successful.", { status: res.status, details: body_, code: "REJECTED" });
    }

    const data = unwrap && body_ && typeof body_ === "object" && "data" in body_ ? body_.data : body_;
    return { data, status: res.status, headers: res.headers, raw: body_ };
  }

  static async parseBody(res) {
    if (res.status === 204) return null;
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  // Convenience verbs — resolve with the unwrapped payload only.
  async get(path, opts) {
    return (await this.request("GET", path, opts)).data;
  }
  async post(path, body, opts) {
    return (await this.request("POST", path, { ...opts, body })).data;
  }
  async put(path, body, opts) {
    return (await this.request("PUT", path, { ...opts, body })).data;
  }
  async patch(path, body, opts) {
    return (await this.request("PATCH", path, { ...opts, body })).data;
  }
  async delete(path, opts) {
    return (await this.request("DELETE", path, opts)).data;
  }

  /**
   * Multipart upload with progress (XMLHttpRequest — fetch has no upload progress).
   * @param {string} path
   * @param {FormData} form
   * @param {{ onProgress?: (percent:number) => void }} [opts]
   */
  upload(path, form, { onProgress } = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", this.url(path));
      const token = this.getToken();
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        let body = null;
        try {
          body = xhr.responseText ? JSON.parse(xhr.responseText) : null;
        } catch {
          body = xhr.responseText;
        }
        if (xhr.status >= 200 && xhr.status < 300 && !(body && body.success === false)) {
          resolve(body && typeof body === "object" && "data" in body ? body.data : body);
        } else {
          const error = ApiError.fromResponse(xhr.status, body);
          if (xhr.status === 401 && token && this.onUnauthorized) this.onUnauthorized(error);
          reject(error);
        }
      };
      xhr.onerror = () => reject(new ApiError(ApiError.defaultMessage(0), { status: 0 }));
      xhr.send(form);
    });
  }
}

export default HttpClient;
