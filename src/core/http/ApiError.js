/**
 * The one error type every API call rejects with.
 *
 * Keeps the fields the app already relied on ({ message, status, details })
 * and adds a human-friendly message for common HTTP failures, so screens can
 * show `error.message` directly.
 */
export class ApiError extends Error {
  /**
   * @param {string} message  readable message
   * @param {object} [opts]
   * @param {number} [opts.status]   HTTP status (0 = network / timeout)
   * @param {*}      [opts.details]  parsed response body, if any
   * @param {string} [opts.code]     machine-readable code (e.g. "TIMEOUT")
   */
  constructor(message, { status = 0, details = null, code } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.code = code || ApiError.codeFor(status);
    // axios-compatible shape for older callers that read error.response.*
    this.response = { status, data: details };
  }

  static codeFor(status) {
    if (status === 0) return "NETWORK";
    if (status === 400 || status === 422) return "VALIDATION";
    if (status === 401) return "UNAUTHORIZED";
    if (status === 403) return "FORBIDDEN";
    if (status === 404) return "NOT_FOUND";
    if (status === 409) return "CONFLICT";
    if (status === 413) return "TOO_LARGE";
    if (status === 429) return "RATE_LIMITED";
    if (status >= 500) return "SERVER";
    return "HTTP";
  }

  /** Message for a status when the server didn't send a usable one. */
  static defaultMessage(status) {
    switch (ApiError.codeFor(status)) {
      case "NETWORK": return "Can't reach the server. Check your connection and try again.";
      case "UNAUTHORIZED": return "Your session has expired. Please sign in again.";
      case "FORBIDDEN": return "You don't have permission to do that.";
      case "NOT_FOUND": return "That item no longer exists.";
      case "TOO_LARGE": return "The file is too large for the server.";
      case "RATE_LIMITED": return "Too many requests in a short time. Please wait a moment and try again.";
      case "SERVER": return "The server ran into a problem. Please try again shortly.";
      default: return `Request failed (${status}).`;
    }
  }

  /** Build from a parsed response body + status. */
  static fromResponse(status, body) {
    const serverMessage =
      body && typeof body === "object"
        ? body.message || body.title || (Array.isArray(body.errors) ? body.errors.join(" ") : null)
        : null;
    // Validation details from ASP.NET ({ errors: { Field: ["msg"] } })
    let validation = null;
    if (body && body.errors && typeof body.errors === "object" && !Array.isArray(body.errors)) {
      validation = Object.values(body.errors).flat().join(" ");
    }
    return new ApiError(validation || serverMessage || ApiError.defaultMessage(status), { status, details: body });
  }

  get isUnauthorized() {
    return this.status === 401;
  }
}

export default ApiError;
