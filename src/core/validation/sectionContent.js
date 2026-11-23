/**
 * Validates the content of any page section before it is saved, whatever its
 * type (sections are CMS-defined, so this walks the whole content tree):
 *  - link / media fields must be safe addresses (no javascript:, data:text/html…)
 *  - text must not contain scripts, event handlers or javascript: links
 *  - fields marked `required` in the section's form schema must be filled
 * Returns { valid, errors: [{ path, message }] } with readable field paths.
 */

const LINK_KEY = /(^|[_-])(url|href|link|src|video|image|poster|logo|icon|avatar|background|bgVideo|backgroundImage|backgroundVideo|file|media)$|Url$|Link$|Image$|Video$|Src$/i;
const SAFE_LINK = /^(https?:\/\/[^\s"'<>]+|\/[^\s"'<>]*|\.{1,2}\/[^\s"'<>]*|#[^\s"'<>]*|mailto:[^\s"'<>]+|tel:[+\d\s().-]+|[\w./-]+\.(png|jpe?g|gif|webp|avif|svg|mp4|webm|mov|pdf))$/i;
const DANGEROUS = /<\s*\/?\s*(script|iframe|object|embed|style|link|meta)\b|javascript:|vbscript:|data:text\/html|<[^>]*\son[a-z]+\s*=/i;

const label = (path) =>
  path
    .replace(/\[(\d+)\]/g, (_, i) => ` #${Number(i) + 1}`)
    .replace(/\./g, " › ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

function walk(value, path, errors) {
  if (typeof value === "string") {
    const key = path.split(/[.[\]]/).filter(Boolean).pop() || "";
    const v = value.trim();
    if (DANGEROUS.test(v)) {
      errors.push({ path, message: `${label(path)}: remove scripts, event handlers or javascript: links.` });
    } else if (v && LINK_KEY.test(key) && !/\s/.test(v) && !SAFE_LINK.test(v) && /^[a-z][a-z0-9+.-]*:/i.test(v)) {
      errors.push({ path, message: `${label(path)}: use a web address (https://…) or a site path (/…).` });
    }
    if (value.length > 20000) errors.push({ path, message: `${label(path)}: text is too long (max 20,000 characters).` });
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > 200) errors.push({ path, message: `${label(path)}: too many items (max 200).` });
    value.forEach((v, i) => walk(v, `${path}[${i}]`, errors));
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k, errors);
  }
}

/** Required fields from a section form schema ({ properties: { field: { required: true } } }). */
function requiredErrors(schema, content, errors) {
  const props = schema?.properties || {};
  for (const [field, def] of Object.entries(props)) {
    if (!def?.required) continue;
    const v = content?.[field];
    if (v === undefined || v === null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && !v.length)) {
      errors.push({ path: field, message: `${def.label || label(field)} is required.` });
    }
  }
}

/**
 * @param {object|string} content  section content (object or JSON string)
 * @param {object} [formSchema]     the section's admin form schema (optional)
 */
export function validateSectionContent(content, formSchema) {
  let data = content;
  if (typeof content === "string") {
    try {
      data = content.trim() ? JSON.parse(content) : {};
    } catch {
      return { valid: false, errors: [{ path: "", message: "The section content isn't valid JSON." }] };
    }
  }
  const errors = [];
  walk(data, "", errors);
  requiredErrors(formSchema, data, errors);
  const unique = errors.filter((e, i) => errors.findIndex((x) => x.message === e.message) === i).slice(0, 10);
  return { valid: unique.length === 0, errors: unique };
}

/** One readable sentence for a toast. */
export const describeErrors = (errors) =>
  errors.length === 1 ? errors[0].message : `${errors[0].message} (+${errors.length - 1} more)`;
