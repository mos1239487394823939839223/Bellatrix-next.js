// Media service shared by the Media Library page and the media picker.
//
// Talks to the .NET backend (/api/Media). Uploads use XMLHttpRequest so the UI
// can show real progress for large videos.

import { getApiBaseUrlWithApi } from "../config/api.js";
import { getAuthToken } from "../utils/tokenManager.js";

// nginx in front of the API accepts request bodies up to 50 MB
// (client_max_body_size 50M); the API itself allows more.
export const MEDIA_MAX_MB = 50;
export const MEDIA_MAX_BYTES = MEDIA_MAX_MB * 1024 * 1024;

const api = () => getApiBaseUrlWithApi();

const authHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

async function readJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

function errorFor(status, payload) {
  if (status === 401 || status === 403) return "Your session has expired — sign in again.";
  if (status === 413) return `File is too large for the server (max ${MEDIA_MAX_MB} MB).`;
  return payload?.message || payload?.title || `Request failed (${status})`;
}

/** List media. Returns { items, hasMore }. */
export async function listMedia({ page = 1, pageSize = 48, type, searchTerm } = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (type && type !== "all") params.set("type", type);
  if (searchTerm) params.set("searchTerm", searchTerm);
  const res = await fetch(`${api()}/Media?${params}`, { headers: authHeader() });
  const payload = await readJson(res);
  if (!res.ok || payload.success === false) throw new Error(errorFor(res.status, payload));
  const data = payload.data;
  const items = Array.isArray(data) ? data : data?.items || data?.results || [];
  return { items, hasMore: data?.hasMore ?? items.length === pageSize };
}

/** Totals for the header (best effort). */
export async function mediaStats() {
  try {
    const res = await fetch(`${api()}/Media/statistics`, { headers: authHeader() });
    const payload = await readJson(res);
    return res.ok ? payload.data || null : null;
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

/**
 * Upload one file. onProgress(0..100). Resolves with the created media item.
 */
export function uploadFile(file, { onProgress, altText, caption } = {}) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("File", file);
    form.append("Role", "12"); // 12 = General
    form.append("AlternateText", altText || file.name.replace(/\.[^.]+$/, ""));
    form.append("Caption", caption || "");
    form.append("SortOrder", "1");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${api()}/Media/upload`);
    const { Authorization } = authHeader();
    if (Authorization) xhr.setRequestHeader("Authorization", Authorization);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let payload = {};
      try {
        payload = JSON.parse(xhr.responseText || "{}");
      } catch {
        payload = { message: xhr.responseText };
      }
      if (xhr.status >= 200 && xhr.status < 300 && payload.success !== false) {
        const item = Array.isArray(payload.data) ? payload.data[0] : payload.data;
        resolve(item || {});
      } else {
        reject(new Error(errorFor(xhr.status, payload)));
      }
    };
    xhr.onerror = () => reject(new Error("Network error — check your connection and try again."));
    xhr.send(form);
  });
}

/** Update alt text / caption. Tries JSON first, then form data. */
export async function updateMedia(id, { alternateText, caption, role, sortOrder }) {
  const body = {
    alternateText: alternateText ?? "",
    caption: caption ?? "",
    ...(role != null ? { role } : {}),
    ...(sortOrder != null ? { sortOrder } : {}),
  };
  let res = await fetch(`${api()}/Media/${id}`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 415 || res.status === 400) {
    const form = new FormData();
    form.append("AlternateText", body.alternateText);
    form.append("Caption", body.caption);
    if (role != null) form.append("Role", String(role));
    if (sortOrder != null) form.append("SortOrder", String(sortOrder));
    res = await fetch(`${api()}/Media/${id}`, { method: "PUT", headers: authHeader(), body: form });
  }
  const payload = await readJson(res);
  if (!res.ok || payload.success === false) throw new Error(errorFor(res.status, payload));
  return payload.data || body;
}

export async function deleteMedia(id) {
  const res = await fetch(`${api()}/Media/${id}`, { method: "DELETE", headers: authHeader() });
  const payload = await readJson(res);
  if (!res.ok || payload.success === false) throw new Error(errorFor(res.status, payload));
  return true;
}

/**
 * File names referenced by any published page or the public site settings.
 * Used to flag media that no page uses (pages store /uploads/… paths in
 * their section content).
 */
export async function referencedFileNames() {
  const get = async (path) => {
    try {
      const res = await fetch(`${api()}${path}`);
      return res.ok ? await res.text() : "";
    } catch {
      return "";
    }
  };
  const navbar = await get("/Categories/navbar");
  const slugs = new Set();
  try {
    const data = JSON.parse(navbar);
    for (const cat of data.data || data || []) {
      for (const page of cat.pages || cat.Pages || []) {
        const slug = page.slug || page.Slug;
        if (slug) slugs.add(slug);
      }
    }
  } catch {
    /* ignore */
  }
  slugs.add("home");
  const bodies = await Promise.all([...slugs].map((slug) => get(`/Pages/public/${encodeURIComponent(slug)}`)));
  bodies.push(await get("/Settings/public"));
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
