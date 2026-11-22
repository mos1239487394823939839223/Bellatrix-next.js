/**
 * Legacy media API (used by the content form and the picker).
 * Same functions and return shapes as before, now delegating to
 * MediaService (src/services) instead of its own requests.
 */
import { services } from "../services";
import { getAbsoluteBaseUrl } from "../config/api.js";

const BASE_HOST_ABSOLUTE = getAbsoluteBaseUrl();

function toFullUrl(fileUrl) {
  if (!fileUrl) return "";

  // If the URL is already absolute, ensure it uses HTTPS in production
  if (fileUrl.startsWith("http://")) {
    if (typeof window !== "undefined" && window.location?.protocol === "https:") {
      fileUrl = fileUrl.replace(/^http:\/\/68\.178\.169\.236:5000/, window.location.origin);
    }
  }
  if (fileUrl.startsWith("http")) return fileUrl;

  const host = BASE_HOST_ABSOLUTE.replace(/\/$/, "");
  return host + (fileUrl.startsWith("/") ? fileUrl : "/" + fileUrl);
}

const withLink = (item) => (item ? { ...item, fileLink: toFullUrl(item.fileUrl) } : item);

const mediaAPI = {
  /** { data, hasMore, total } */
  async fetchMedia({ page = 1, pageSize = 24, type, searchTerm } = {}) {
    const { items } = await services.media.page({ page, pageSize, type, searchTerm });
    const data = items.map(withLink);
    return { data, hasMore: data.length === pageSize, total: data.length };
  },

  async uploadMedia(file) {
    return withLink(await services.media.upload(file, { caption: "Uploaded media" }));
  },

  async uploadMultipleMedia(files) {
    return Promise.all(Array.from(files).map((f) => this.uploadMedia(f)));
  },

  async deleteMedia(mediaId) {
    await services.media.remove(mediaId);
    return true;
  },

  async updateMedia(mediaId, updates) {
    return services.media.updateDetails(mediaId, updates);
  },

  async getMediaById(mediaId) {
    return withLink(await services.media.getById(mediaId));
  },

  async getMediaPublicById(mediaId) {
    return withLink(await services.media.getPublic(mediaId));
  },
};

export default mediaAPI;
