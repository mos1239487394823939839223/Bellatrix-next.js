/**
 * Declarative validation.
 *
 * A schema maps field names to a list of rules; each rule is a small function
 * returning an error message or null. New rules can be added without touching
 * the validator (open for extension, closed for modification).
 *
 *   const schema = { email: [rules.required(), rules.email()] };
 *   const { valid, errors } = validate(schema, data);   // errors.email = "..."
 */

const isBlank = (v) => v === undefined || v === null || (typeof v === "string" && v.trim() === "") || (Array.isArray(v) && v.length === 0);
const str = (v) => (v === undefined || v === null ? "" : String(v));

export const rules = {
  required: (msg = "This field is required.") => (v) => (isBlank(v) ? msg : null),

  minLength: (n, msg) => (v) =>
    isBlank(v) || str(v).trim().length >= n ? null : msg || `Must be at least ${n} characters.`,

  maxLength: (n, msg) => (v) =>
    isBlank(v) || str(v).length <= n ? null : msg || `Must be ${n} characters or fewer.`,

  email: (msg = "Enter a valid email, e.g. name@company.com.") => (v) =>
    isBlank(v) || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str(v).trim()) ? null : msg,

  phone: (msg = "Enter a valid phone number.") => (v) =>
    isBlank(v) || /^\+?[\d\s()./-]{6,20}$/.test(str(v).trim()) ? null : msg,

  pattern: (re, msg = "Invalid format.") => (v) => (isBlank(v) || re.test(str(v)) ? null : msg),

  slug: (msg = "Use lowercase letters, numbers and hyphens only (e.g. hr-solutions).") => (v) =>
    isBlank(v) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str(v)) ? null : msg,

  url: (msg = "Enter a full link (https://…) or a site path (/page).") => (v) =>
    isBlank(v) || /^(https?:\/\/[^\s]+|\/[^\s]*|mailto:[^\s]+|tel:[^\s]+|#[^\s]*)$/i.test(str(v).trim()) ? null : msg,

  integer: (msg = "Enter a whole number.") => (v) => (isBlank(v) || Number.isInteger(Number(v)) ? null : msg),

  range: (min, max, msg) => (v) =>
    isBlank(v) || (Number(v) >= min && Number(v) <= max) ? null : msg || `Must be between ${min} and ${max}.`,

  oneOf: (values, msg = "Choose one of the listed options.") => (v) => (isBlank(v) || values.includes(v) ? null : msg),

  /** Rejects text with markup that could become active content. */
  noScript: (msg = "Remove HTML scripts, event handlers or javascript: links.") => (v) =>
    isBlank(v) || !/<\s*script|javascript:|<[^>]*\son\w+\s*=/i.test(str(v)) ? null : msg,

  maxLinks: (n, msg) => (v) =>
    isBlank(v) || (str(v).match(/https?:\/\/|www\./gi) || []).length <= n ? null : msg || `Please include no more than ${n} links.`,

  custom: (fn) => fn,
};

/**
 * @param {Record<string, Function[]>} schema
 * @param {object} data
 * @returns {{ valid: boolean, errors: Record<string,string> }}
 */
export function validate(schema, data = {}) {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(schema)) {
    for (const rule of fieldRules) {
      const message = rule(data[field], data);
      if (message) {
        errors[field] = message;
        break; // first failing rule per field
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/** Thrown by services when input fails validation before any request is sent. */
export class ValidationError extends Error {
  constructor(errors) {
    super(Object.values(errors)[0] || "Please check the highlighted fields.");
    this.name = "ValidationError";
    this.errors = errors;
    this.code = "VALIDATION";
    this.status = 0;
  }
}

/** validate() or throw ValidationError. */
export function assertValid(schema, data) {
  const { valid, errors } = validate(schema, data);
  if (!valid) throw new ValidationError(errors);
  return data;
}
