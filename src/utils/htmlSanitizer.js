/**
 * HTML sanitization for CMS text that may contain light formatting.
 *
 * Safe by construction: the whole string is escaped first, then only an
 * allow-list of simple formatting tags is turned back into markup — with no
 * attributes except a plain `class` (so CMS headings can keep a colored word,
 * e.g. <span class="text-blue-600">). Event handlers, styles, links, scripts,
 * images and any other tag/attribute stay escaped text.
 */

const ALLOWED_TAGS = ["span", "strong", "em", "b", "i", "u", "br", "mark", "small", "sub", "sup"];
const SAFE_CLASS = /^[\w\s\-:/[\].#%]*$/;

const escapeHTML = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

// Matches an escaped tag: &lt;/span&gt;, &lt;br/&gt;, &lt;span class=&quot;x&quot;&gt;
const ESCAPED_TAG = /&lt;(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+class=&quot;[^&]*&quot;)?)\s*(\/?)&gt;/g;

/** Escape everything (plain text). */
export const sanitizeHTML = (html) => (html ? escapeHTML(html) : "");

/** Escaped text with an allow-list of formatting tags restored (no attributes but class). */
export const sanitizeFormatting = (html) => {
  if (!html) return "";
  return escapeHTML(html).replace(ESCAPED_TAG, (match, close, tag, classAttr, selfClose) => {
    const name = tag.toLowerCase();
    if (!ALLOWED_TAGS.includes(name)) return match; // stays visible as text, harmless
    if (close) return `</${name}>`;
    if (name === "br") return "<br />";
    let cls = "";
    if (classAttr) {
      const value = classAttr.replace(/^\s+class=&quot;/, "").replace(/&quot;$/, "");
      if (SAFE_CLASS.test(value)) cls = ` class="${value}"`;
    }
    return `<${name}${cls}${selfClose ? " /" : ""}>`;
  });
};

/** For React's dangerouslySetInnerHTML — plain text, fully escaped. */
export const renderHTML = (html) => ({ __html: sanitizeHTML(html) });

/** For React's dangerouslySetInnerHTML — allows simple formatting tags only. */
export const renderSafeHTML = (html) => ({ __html: sanitizeFormatting(html) });

/** True if the string contains something that looks like a tag. */
export const containsHTML = (text) => (text ? /<[^>]*>/.test(text) : false);

/**
 * Formatting-aware render: returns { __html } when the text contains tags,
 * or null so the caller renders it as plain text.
 */
export const smartRender = (content) => (content && containsHTML(content) ? renderSafeHTML(content) : null);

/**
 * JSON for <script type="application/ld+json">. JSON.stringify alone lets a
 * CMS string containing "</script>" close the tag; escape <, > and & as
 * unicode so the JSON stays valid and inert.
 */
export const safeJsonLd = (data) =>
  JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(new RegExp(String.fromCharCode(0x2028), "g"), "\\u2028")
    .replace(new RegExp(String.fromCharCode(0x2029), "g"), "\\u2029");
