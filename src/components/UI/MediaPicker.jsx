import React, { useState, useEffect, useCallback, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  XMarkIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import { CheckCircleIcon } from "@heroicons/react/24/solid";

import Button from "./Button";

import Toast from "./Toast";

import axios from "axios";

import mediaAPI from "../../lib/mediaAPI";

import api from "../../lib/api.js";

import { getApiBaseUrlWithApi, getAbsoluteBaseUrl } from "../../config/api.js";

// API Constants

const BASE_API = getApiBaseUrlWithApi();

const BASE_HOST_ABSOLUTE = getAbsoluteBaseUrl();

// Helper function to build full URLs

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

// NEW: Helper function to build public media URL using API endpoint
function toPublicMediaUrl(mediaId) {
  if (!mediaId) return "";

  const host = BASE_HOST_ABSOLUTE.replace(/\/$/, "");

  return `${host}/api/Media/public/${mediaId}`;
}

// Utility functions

function formatFileSize(bytes) {
  if (!bytes) return "Unknown size";

  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

function formatDate(dateString) {
  if (!dateString) return "Unknown date";

  return new Date(dateString).toLocaleDateString();
}

function getMediaType(contentType) {
  if (!contentType) return "file";

  if (contentType.startsWith("image/")) return "image";

  if (contentType.startsWith("video/")) return "video";

  return "file";
}

function validateFileType(file, accept) {
  if (accept === "all") return true;

  const mediaType = getMediaType(file.type);

  return accept === mediaType;
}

// Fetch media from API

async function fetchMedia({
  type = "",

  page = 1,

  pageSize = 40,

  searchTerm = "",

  token = null,
}) {
  const params = { page, pageSize };

  if (type && type !== "all") params.type = type;

  if (searchTerm) params.searchTerm = searchTerm;

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const res = await axios.get(`${BASE_API}/Media`, { params, headers });

    if (!res?.data) throw new Error("No response");

    // Accept both: array or paged result

    const payload = res.data;

    if (!payload.success && payload.message) throw new Error(payload.message);

    // Handle different response structures

    let data = [];

    let hasMore = false;

    if (Array.isArray(payload.data)) {
      data = payload.data;

      hasMore = data.length === pageSize; // Estimate if there are more
    } else if (payload.data?.items) {
      data = payload.data.items;

      hasMore = payload.data.hasMore || data.length === pageSize;
    } else if (payload.data?.results) {
      data = payload.data.results;

      hasMore = payload.data.hasMore || data.length === pageSize;
    } else {
      data = payload.data || [];

      hasMore = false;
    }

    return { data, hasMore };
  } catch (error) {
    console.error("Error fetching media:", error);

    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch media",
    );
  }
}

// Upload media function (if needed)

async function uploadMedia(files, token = null) {
  const formData = new FormData();

  // Handle single file upload

  if (files.length === 1) {
    const file = files[0];

    formData.append("File", file);

    formData.append("Role", "12"); // 12 = General role

    formData.append("AlternateText", file.name);

    formData.append("Caption", "Uploaded media");

    formData.append("SortOrder", "1");
  } else {
    // Handle multiple files upload

    files.forEach((file) => {
      formData.append("Files", file);
    });

    formData.append("Role", "12"); // 12 = General role

    formData.append("SortOrder", "1");
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const endpoint =
      files.length === 1 ? "/Media/upload" : "/Media/upload-multiple";

    const res = await axios.post(`${BASE_API}${endpoint}`, formData, {
      headers: {
        ...headers,

        "Content-Type": "multipart/form-data",
      },
    });

    if (!res?.data) throw new Error("No response");

    const payload = res.data;

    if (!payload.success && payload.message) throw new Error(payload.message);

    console.log(" Upload response:", payload);

    return payload.data || [];
  } catch (error) {
    console.error("Error uploading media:", error);

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to upload media",
    );
  }
}

const MediaPicker = ({
  isOpen,

  onClose,

  onSelect,

  accept = "all", // "all", "image", "video"

  title = "Choose Media",

  maxSelection = 1,
}) => {
  const [media, setMedia] = useState([]);

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentFilter, setCurrentFilter] = useState(
    accept === "all" ? "all" : accept,
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const [selectedItems, setSelectedItems] = useState([]);

  const [toast, setToast] = useState(null);

  const [blobUrls, setBlobUrls] = useState({});

  const fileInputRef = useRef(null);

  const loadingRef = useRef(false);

  // Fetch media file with auth and return a blob URL (needed because /uploads/* requires auth)
  const fetchBlobUrl = useCallback(async (mediaId) => {
    if (!mediaId || blobUrls[mediaId]) return;
    try {
      const res = await api.get(`/Media/public/${mediaId}`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      setBlobUrls(prev => ({ ...prev, [mediaId]: url }));
    } catch (err) {
      console.error('[MediaPicker] Failed to fetch blob for', mediaId, err);
    }
  }, [blobUrls]);

  // Fetch blob URLs for all media items when media list changes
  useEffect(() => {
    media.forEach((item) => {
      if (item.id && !blobUrls[item.id]) {
        fetchBlobUrl(item.id);
      }
    });
  }, [media, fetchBlobUrl]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(blobUrls).forEach((url) => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, []);

  // Show toast notification

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });

    setTimeout(() => setToast(null), 3000);
  }, []);

  // Fetch media from API using new fetch function

  const fetchMediaData = useCallback(
    async ({
      page = 1,

      pageSize = 24,

      type,

      searchTerm: search,

      append = false,
    } = {}) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;

        setLoading(page === 1);

        setError(null);

        // Get auth token from localStorage

        const token = localStorage.getItem("authToken");

        const result = await fetchMedia({
          page,

          pageSize,

          type: type && type !== "all" ? type : undefined,

          searchTerm: search,

          token,
        });

        const mediaItems = (result.data || []).map((item) => ({
          ...item,
          fileLink: toFullUrl(item.fileUrl),
        }));

        if (append) {
          setMedia((prev) => [...prev, ...mediaItems]);
        } else {
          setMedia(mediaItems);

          setSelectedItems([]); // Reset selection on new fetch
        }

        setHasMore(result.hasMore);
      } catch (err) {
        console.error("Error fetching media:", err);

        setError(err.message);

        showToast(`Error fetching media: ${err.message}`, "error");
      } finally {
        setLoading(false);

        loadingRef.current = false;
      }
    },

    [showToast],
  );

  // Upload new media using new upload function

  const uploadMediaFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;

      try {
        setUploading(true);

        // Validate files

        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

        const validFiles = Array.from(files).filter((file) => {
          // Check file size
          if (file.size > MAX_FILE_SIZE) {
            showToast(
              `File too large: ${file.name} (${formatFileSize(file.size)}). Maximum size allowed is 10MB.`,
              "error"
            );
            return false;
          }

          // Check file type
          if (!validateFileType(file, accept)) {
            showToast(
              `Invalid file type: ${file.name}. Accepted: ${accept}`,
              "error"
            );
            return false;
          }

          return true;
        });

        if (validFiles.length === 0) {
          setUploading(false);

          return;
        }

        console.log(
          " Uploading files:",
          validFiles.map((f) => f.name),
        );

        // Get auth token from localStorage

        const token = localStorage.getItem("authToken");

        // Upload files with token

        const uploadResults = await uploadMedia(validFiles, token);

        console.log(" Upload results:", uploadResults);

        showToast(
          `Successfully uploaded ${
            uploadResults.length || validFiles.length
          } file(s)`,

          "success",
        );

        // Refresh media list to show newly uploaded files

        console.log(" Refreshing media list after upload...");

        setCurrentPage(1);

        await fetchMediaData({
          page: 1,

          type: currentFilter === "all" ? undefined : currentFilter,

          searchTerm,
        });

        console.log(" Media list refreshed");
      } catch (err) {
        console.error(" Error uploading media:", err);

        showToast(`Upload error: ${err.message}`, "error");
      } finally {
        setUploading(false);
      }
    },

    [accept, currentFilter, searchTerm, showToast, fetchMediaData],
  );

  // Handle file input change

  const handleFileUpload = useCallback(
    (event) => {
      const files = Array.from(event.target.files);

      if (files.length > 0) {
        uploadMediaFiles(files);
      }

      // Reset input

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },

    [uploadMediaFiles],
  );

  // Handle filter change

  const handleFilterChange = useCallback(
    (filter) => {
      setCurrentFilter(filter);

      setCurrentPage(1);

      fetchMediaData({
        page: 1,

        type: filter === "all" ? undefined : filter,

        searchTerm,
      });
    },

    [searchTerm, fetchMediaData],
  );

  // Handle search

  const handleSearch = useCallback(
    (search) => {
      setSearchTerm(search);

      setCurrentPage(1);

      fetchMediaData({
        page: 1,

        type: currentFilter === "all" ? undefined : currentFilter,

        searchTerm: search,
      });
    },

    [currentFilter, fetchMediaData],
  );

  // Load more media

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;

      setCurrentPage(nextPage);

      fetchMediaData({
        page: nextPage,

        type: currentFilter === "all" ? undefined : currentFilter,

        searchTerm,

        append: true,
      });
    }
  }, [
    hasMore,

    loading,

    currentPage,

    currentFilter,

    searchTerm,

    fetchMediaData,
  ]);

  // Handle media selection

  const handleSelect = useCallback(
    async (mediaItem) => {
      try {
        // Fetch detailed media information using the public endpoint

        console.log(" Fetching media details for ID:", mediaItem.id);

        const mediaDetails = await mediaAPI.getMediaPublicById(mediaItem.id);

        console.log(" Media details response:", mediaDetails);

        // Use public Media API endpoint for the URL

        const publicUrl = toPublicMediaUrl(mediaItem.id);

        console.log(" Final public URL:", publicUrl);

        const processedDetails = {
          ...mediaDetails,
          fileLink: toFullUrl(mediaDetails.fileUrl || mediaItem.fileUrl),
        };

        if (maxSelection === 1) {
          // Single selection - use direct file link and call onSelect

          onSelect(processedDetails.fileLink, processedDetails);

          onClose();
        } else {
          // Multiple selection

          setSelectedItems((prev) => {
            const isSelected = prev.find((item) => item.id === mediaItem.id);

            if (isSelected) {
              return prev.filter((item) => item.id !== mediaItem.id);
            } else if (prev.length < maxSelection) {
              return [...prev, mediaDetails];
            }

            return prev;
          });
        }
      } catch (error) {
        console.error(" Error fetching media details:", error);

        showToast("Failed to fetch media details. Please try again.", "error");

        // Fallback to public API URL if API call fails

        if (maxSelection === 1) {
          const directUrl = toFullUrl(mediaItem.fileUrl);

          onSelect(directUrl, mediaItem);

          onClose();
        }
      }
    },

    [maxSelection, onSelect, onClose, showToast],
  );

  // Handle confirm selection (for multiple selection)

  const handleConfirmSelection = useCallback(() => {
    if (selectedItems.length > 0) {
      if (maxSelection === 1) {
        onSelect(selectedItems[0].fileLink || toFullUrl(selectedItems[0].fileUrl), selectedItems[0]);
      } else {
        const selectedResults = selectedItems.map((item) => ({
          url: item.fileLink || toFullUrl(item.fileUrl),
          item: item,
        }));

        onSelect(selectedResults);
      }
      onClose();
    }
  }, [selectedItems, maxSelection, onSelect, onClose]);

  // Initial fetch when modal opens

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);

      fetchMediaData({
        page: 1,

        type: currentFilter === "all" ? undefined : currentFilter,
      });
    }
  }, [isOpen, currentFilter, fetchMediaData]);

  // Keyboard handling

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);

      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Render media item

  const renderMediaItem = (mediaItem) => {
    const isSelected = selectedItems.find((item) => item.id === mediaItem.id);

    // Use authenticated blob URL if available, fall back to direct file link
    const fullUrl = blobUrls[mediaItem.id] || toFullUrl(mediaItem.fileUrl);

    // Determine media type from contentType OR filename/URL
    const fileName = mediaItem.fileName || mediaItem.fileUrl || "";
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "bmp",
      "ico",
    ];
    const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];

    const isImage =
      mediaItem.contentType?.startsWith("image/") ||
      imageExtensions.includes(fileExtension) ||
      mediaItem.fileUrl?.includes("/image/");

    const isVideo =
      mediaItem.contentType?.startsWith("video/") ||
      videoExtensions.includes(fileExtension) ||
      mediaItem.fileUrl?.includes("/video/");

    // Debug logging
    console.log("[MediaPicker] Rendering item:", {
      id: mediaItem.id,
      fileName: mediaItem.fileName,
      fileUrl: mediaItem.fileUrl,
      fullUrl,
      contentType: mediaItem.contentType,
      isImage,
      isVideo,
    });

    return (
      <motion.div
        key={mediaItem.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={`relative group cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm border-2 transition-all duration-200 ${
          isSelected
            ? "border-blue-500 ring-2 ring-blue-200"
            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
        }`}
        onClick={() => handleSelect(mediaItem)}
      >
        {/* Selection indicator */}

        {isSelected && (
          <div className="absolute top-2 right-2 z-10">
            <CheckCircleIcon className="h-6 w-6 text-blue-500 bg-white rounded-full" />
          </div>
        )}

        {/* Media preview */}

        <div
          className="aspect-square flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: "#e5e7eb" }}
        >
          {/* Gray placeholder - only show if NOT an image */}
          {!isImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideo ? (
                <VideoCameraIcon className="h-12 w-12 text-gray-400" />
              ) : (
                <DocumentIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
          )}

          {/* Actual image using background-image */}
          {isImage && (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${fullUrl})`,
                zIndex: 1,
              }}
            />
          )}

          {/* Video preview using video element */}
          {isVideo && (
            <>
              <video
                src={fullUrl}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ zIndex: 1 }}
                muted
                preload="metadata"
                playsInline
                onLoadedData={(e) => {
                  // Video loaded successfully, hide placeholder
                  e.target.style.opacity = 1;
                }}
                onError={(e) => {
                  // Video failed to load, keep placeholder visible
                  e.target.style.display = "none";
                }}
              />
              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-black/50 rounded-full p-3">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </>
          )}

          {isVideo && (
            <div className="absolute bottom-1 right-1  text-white text-xs px-1.5 py-0.5 rounded z-10">
              VIDEO
            </div>
          )}

          {/* Hover overlay */}

          <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center z-20">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <EyeIcon className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Media info */}

        <div className="p-3">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {mediaItem.fileName || "Untitled"}
          </h4>

          <div className="mt-1 space-y-1">
            {mediaItem.role && (
              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {mediaItem.role}
              </span>
            )}

            <p className="text-xs text-gray-500">
              {formatDate(mediaItem.createdAt)}
            </p>

            {mediaItem.fileSize && (
              <p className="text-xs text-gray-400">
                {formatFileSize(mediaItem.fileSize)}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[600px] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}

            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Toolbar */}

              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                {/* Filter buttons */}

                <div className="flex rounded-lg bg-gray-100 p-1">
                  {["all", "image", "video"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentFilter === filter
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {filter === "all"
                        ? "All"
                        : filter === "image"
                        ? "Images"
                        : "Videos"}
                    </button>
                  ))}
                </div>

                {/* Search */}

                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search media..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Upload button */}

                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={
                      accept === "image"
                        ? "image/*"
                        : accept === "video"
                        ? "video/*"
                        : "image/*,video/*"
                    }
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <CloudArrowUpIcon className="h-5 w-5" />

                    {uploading ? "Uploading..." : "Upload"}
                  </Button>

                  <Button
                    onClick={() => {
                      setCurrentPage(1);

                      fetchMediaData({
                        page: 1,

                        type:
                          currentFilter === "all" ? undefined : currentFilter,

                        searchTerm,
                      });
                    }}
                    variant="outline"
                    disabled={loading}
                  >
                    <ArrowPathIcon
                      className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}

            <div className="flex-1 p-6 overflow-y-auto">
              {error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
                    <DocumentIcon className="h-12 w-12 mx-auto" />
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading media
                  </h3>

                  <p className="text-gray-500 mb-4">{error}</p>

                  <Button onClick={() => fetchMediaData()}>Try Again</Button>
                </div>
              ) : loading && media.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowPathIcon className="h-12 w-12 mx-auto text-gray-400 animate-spin mb-4" />

                  <p className="text-gray-500">Loading media...</p>
                </div>
              ) : media.length === 0 ? (
                <div className="text-center py-12">
                  <PhotoIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />

                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No media found
                  </h3>

                  <p className="text-gray-500 mb-4">
                    Upload your first media file to get started
                  </p>

                  <Button onClick={() => fileInputRef.current?.click()}>
                    <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                    Upload Media
                  </Button>
                </div>
              ) : (
                <>
                  {/* Media grid */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {media.map(renderMediaItem)}
                  </div>

                  {/* Load more */}

                  {hasMore && (
                    <div className="text-center mt-8">
                      <Button
                        onClick={loadMore}
                        disabled={loading}
                        variant="outline"
                      >
                        {loading ? (
                          <>
                            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer for multiple selection */}

            {maxSelection > 1 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedItems.length} of {maxSelection} selected
                  </span>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>

                    <Button
                      onClick={handleConfirmSelection}
                      disabled={selectedItems.length === 0}
                    >
                      Confirm Selection
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Toast notifications */}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default MediaPicker;
