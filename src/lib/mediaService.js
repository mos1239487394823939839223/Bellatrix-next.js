// Media helpers for the Media Library page and the media picker.
//
// Network calls delegate to MediaService (src/services) so they share the
// HttpClient's auth, timeouts and errors; this module keeps the UI helpers
// (URLs, file kinds, sizes, client-side checks).

import { services } from "../services";

// nginx in front of the API accepts request bodies up to 50 MB
// (client_max_body_size 50M); the API itself allows more.
export const MEDIA_MAX_MB = 50;
export const MEDIA_MAX_BYTES = MEDIA_MAX_MB * 1024 * 1024;

const isLocalhost = () =>
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const backendOrigin = () => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://bellatrixinc.com";
  try {
    return new URL(base).origin;
  } catch {
    return base.replace(/\/$/, "");
  }
};

/**
 * URL to store in page content / show in the browser.
 * Live site: relative "/uploads/…" (nginx serves it). Local dev: absolute to the backend.
 */
export function mediaUrl(fileUrl) {
  if (!fileUrl) return "";
  try {
    const u = new URL(fileUrl, "https://placeholder.local");
    const isBackend = u.pathname.startsWith("/uploads/") || u.pathname.startsWith("/api/");
    if (isBackend) {
      const path = u.pathname + u.search;
      return isLocalhost() ? backendOrigin() + path : path;
    }
  } catch {
    /* fall through */
  }
  return fileUrl;
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv|avi|mkv)(\?|#|$)/i;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico)(\?|#|$)/i;

// Decide from the file itself (extension / upload folder). The API's "type" is
// a numeric enum, so it's only used when it's a readable MIME-like string.
export function mediaKind(item = {}) {
  for (const name of [item.fileUrl, item.fileName, item.originalName]) {
    if (!name) continue;
    if (VIDEO_EXT.test(name) || name.includes("/video/")) return "video";
    if (IMAGE_EXT.test(name) || name.includes("/image/")) return "image";
  }
  const t = String(item.contentType ?? item.type ?? "").toLowerCase();
  if (t.startsWith("video")) return "video";
  if (t.startsWith("image")) return "image";
  return "file";
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(v >= 10 ? 0 : 1)} ${units[i]}`;
}

/** List media. Returns { items, hasMore }. */
export const listMedia = (params = {}) => services.media.page(params);

/** Totals for the header (best effort). */
export async function mediaStats() {
  try {
    return await services.media.statistics();
  } catch {
    return null;
  }
}

/** Client-side check before sending. Returns an error message or null. */
export function validateFile(file, accept = "all") {
  if (file.size > MEDIA_MAX_BYTES) {
    return `${file.name} is ${formatBytes(file.size)} — the maximum is ${MEDIA_MAX_MB} MB.`;
  }
  const kind = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : "file";
  if (kind === "file") return `${file.name} isn't an image or a video.`;
  if (accept !== "all" && kind !== accept) return `${file.name} isn't ${accept === "image" ? "an image" : "a video"}.`;
  return null;
}

/** Upload one file with progress (0..100). Resolves with the created media item. */
export const uploadFile = (file, { onProgress, altText, caption } = {}) =>
  services.media.upload(file, { onProgress, altText, caption });

/** Update alt text / caption (validated). */
export const updateMedia = (id, details) => services.media.updateDetails(id, details);

export const deleteMedia = async (id) => {
  await services.media.remove(id);
  return true;
};

/**
 * File names referenced by any published page or the public site settings.
 * Used to flag media that no page uses (pages store /uploads/… paths in
 * their section content).
 */
export async function referencedFileNames() {
  const safe = async (promise) => {
    try {
      return await promise;
    } catch {
      return null;
    }
  };
  const navbar = (await safe(services.categories.navbar())) || [];
  const slugs = new Set();
  try {
    for (const cat of Array.isArray(navbar) ? navbar : []) {
      for (const page of cat.pages || cat.Pages || []) {
        const slug = page.slug || page.Slug;
        if (slug) slugs.add(slug);
      }
    }
  } catch {
    /* ignore */
  }
  slugs.add("home");
  const bodies = (
    await Promise.all([...slugs].map((slug) => safe(services.pages.getPublicBySlug(slug))))
  ).map((page) => JSON.stringify(page || ""));
  bodies.push(JSON.stringify((await safe(services.settings.publicList())) || ""));
  let text = bodies.join(" ").replace(/\\\//g, "/");
  try {
    text = decodeURIComponent(text);
  } catch {
    /* keep raw text if it has a stray % */
  }
  const names = new Set();
  for (const m of text.matchAll(/uploads\/(?:image|video|file)s?\/([^"'\\\s?#)]+)/gi)) names.add(m[1].toLowerCase());
  return { names, pageCount: slugs.size };
}

export function fileNameOf(item = {}) {
  const url = item.fileUrl || "";
  const last = url.split(/[?#]/)[0].split("/").pop() || item.fileName || "";
  try {
    return decodeURIComponent(last).toLowerCase();
  } catch {
    return last.toLowerCase();
  }
}
