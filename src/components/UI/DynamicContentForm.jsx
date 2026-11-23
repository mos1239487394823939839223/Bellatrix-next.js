import React, { useState, useEffect } from "react";

import { Input } from "./Input";

import Button from "./Button";

import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import api from "../../services/legacy/api";

import mediaAPI from "../../services/legacy/mediaAPI";

import { getFieldConfigForComponent } from "../../sections/schemas/componentSchemas";

import { getAvailableVariants } from "../../utils/variantSystem";

import { getApiBaseUrl } from "../../config/api.js";
import { updateMediaVersion } from "../../utils/cacheBusting";

// API Base URL with fallback
const API_BASE_URL = getApiBaseUrl();

/**
 * AuthImage — fetches an image with the auth Bearer token and renders via blob URL.
 * Needed in production where the API requires authentication on /Media/* endpoints.
 * Plain <img src> cannot send headers, so direct URLs fail outside the Vite proxy.
 */
const AuthImage = ({ item, className }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!item?.id) return;
    let revoke = null;
    api
      .get(`/Media/public/${item.id}`, { responseType: "blob" })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        revoke = url;
        setBlobUrl(url);
      })
      .catch(() => setFailed(true));
    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [item?.id]);

  if (failed) {
    return (
      <div className="flex flex-col items-center text-gray-400">
        <PhotoIcon className="h-8 w-8 mb-1" />
        <span className="text-xs text-center px-1 truncate w-full text-center">{item?.fileName}</span>
      </div>
    );
  }
  if (!blobUrl) {
    return <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />;
  }
  return <img src={blobUrl} alt={item?.fileName || "Media"} className={className} />;
};

// Media Picker Modal Component

const MediaPickerModal = ({ isOpen, onClose, onSelect }) => {
  const [media, setMedia] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [toast, setToast] = useState(null);

  const fileInputRef = React.useRef();

  // Show toast notification (no alert — works in all production browsers)

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    try {
      setLoading(true);

      console.log(" Fetching media from API...");

      const response = await api.get("/Media?page=1&pageSize=100");

      console.log(" Media API response:", response);

      // The api interceptor already unwraps response.data.data → response.data
      // So items live at response.data.items directly

      let mediaItems = [];

      if (response.data?.items) {
        mediaItems = response.data.items;
      } else if (Array.isArray(response.data)) {
        mediaItems = response.data;
      }

      console.log(" Processed media items:", mediaItems);

      // Log individual items for debugging

      mediaItems.forEach((item, index) => {
        console.log(` Media item ${index}:`, {
          id: item.id,

          fileName: item.fileName,

          fileUrl: item.fileUrl,

          filePath: item.filePath,

          mediaType: item.mediaType,

          fullUrl: (item.fileUrl || item.filePath)?.startsWith("http")
            ? item.fileUrl || item.filePath
            : `${API_BASE_URL}${
                item.fileUrl || item.filePath
              }`,
        });
      });

      setMedia(mediaItems);
    } catch (error) {
      console.error(" Error fetching media:", error);

      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = null;

    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setUploading(true);

    try {
      console.log(" Uploading file:", selectedFile.name);

      const formData = new FormData();

      formData.append("File", selectedFile);

      formData.append("Role", "12"); // 12 = General role

      formData.append("AlternateText", selectedFile.name);

      formData.append("Caption", "Uploaded media");

      formData.append("SortOrder", "1");

      const response = await api.post("/Media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(" Upload response:", response.data);

      // Refresh media list after upload

      console.log(" Refreshing media list after upload...");

      await fetchMedia();

      console.log(" Media list refreshed");

      // Update media version to bust cache on all pages
      updateMediaVersion();

      showToast("File uploaded successfully!", "success");
    } catch (err) {
      console.error(" Error uploading media:", err);

      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = async () => {
    if (selectedMedia) {
      try {
        console.log(" Fetching media details for ID:", selectedMedia.id);

        const mediaDetails = await mediaAPI.getMediaPublicById(
          selectedMedia.id,
        );

        console.log(" Media details response:", mediaDetails);

        // Extract fileUrl from the response

        const fileUrl = mediaDetails.fileUrl;

        console.log(" Media fileUrl:", fileUrl);

        // Build full URL

        const fullUrl = fileUrl?.startsWith("http")
          ? fileUrl
          : `${API_BASE_URL}${fileUrl}`;

        console.log(" Final full URL:", fullUrl);

        onSelect(fullUrl);

        onClose();

        setSelectedMedia(null);
      } catch (error) {
        console.error(" Error fetching media details:", error);

        // Fallback to original behavior if API call fails

        console.log(" Selected media (fallback):", selectedMedia);

        const mediaUrl =
          selectedMedia.fileUrl || selectedMedia.filePath || selectedMedia.url;

        const fullUrl = mediaUrl?.startsWith("http")
          ? mediaUrl
          : `${API_BASE_URL}${mediaUrl}`;

        console.log(" Full media URL (fallback):", fullUrl);

        onSelect(fullUrl);

        onClose();

        setSelectedMedia(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Select Media
            </h3>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUploadClick}
                disabled={uploading}
                className="flex items-center gap-2"
              >
                <PhotoIcon className="h-4 w-4" />

                {uploading ? "Uploading..." : "Upload Media"}
              </Button>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Visually hidden — NOT display:none so browsers allow programmatic .click() in production */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ position: "absolute", width: 0, height: 0, opacity: 0, overflow: "hidden" }}
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Inline toast — replaces alert() which is blocked in some production browsers */}
        {toast && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-white transition-all ${
              toast.type === "error"
                ? "bg-red-500"
                : toast.type === "success"
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
          >
            {toast.message}
          </div>
        )}

        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                    selectedMedia?.id === item.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {(() => {
                      // More flexible image detection

                      const isImage =
                        item.mediaType === 0 ||
                        item.mediaType?.startsWith("image/") ||
                        item.fileName?.match(
                          /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i,
                        );

                      const isVideo =
                        item.mediaType === 1 ||
                        item.mediaType?.startsWith("video/") ||
                        item.fileName?.match(
                          /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i,
                        );

                      console.log(` Media type check for ${item.fileName}:`, {
                        mediaType: item.mediaType,

                        isImage,

                        isVideo,

                        fileName: item.fileName,
                      });

                      if (isImage) {
                        return (
                          <AuthImage
                            item={item}
                            className="w-full h-full object-cover"
                          />
                        );
                      } else if (isVideo) {
                        return (
                          <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                            <video
                              className="w-full h-full object-cover"
                              muted
                              preload="metadata"
                              onError={(e) => {
                                console.error(
                                  " Video failed to load:",

                                  e.target.src,
                                );
                              }}
                            >
                              <source
                                src={(() => {
                                  const mediaUrl =
                                    item.fileUrl || item.filePath;

                                  const fullUrl = mediaUrl?.startsWith("http")
                                    ? mediaUrl
                                    : `${
                                        API_BASE_URL
                                      }${mediaUrl}`;

                                  console.log(
                                    " Loading video:",

                                    fullUrl,

                                    "from original:",

                                    mediaUrl,
                                  );

                                  return fullUrl;
                                })()}
                                type={item.mediaType}
                              />
                            </video>

                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                              <VideoCameraIcon className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex flex-col items-center text-gray-500">
                            <PhotoIcon className="h-8 w-8 mb-2" />

                            <span className="text-xs text-center">
                              {item.fileName}
                            </span>
                          </div>
                        );
                      }
                    })()}
                  </div>

                  <div className="p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {item.fileName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSelect}
            disabled={!selectedMedia}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select Media
          </Button>
        </div>
      </div>
    </div>
  );
};

// Dynamic Content Form Component

const DynamicContentForm = ({
  contentJson,

  onChange,

  className = "",

  componentType = null,
}) => {
  const [parsedContent, setParsedContent] = useState({});

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [currentMediaField, setCurrentMediaField] = useState(null);

  const [fieldConfig, setFieldConfig] = useState({});

  // Parse contentJson on mount and when it changes

  useEffect(() => {
    try {
      const content =
        typeof contentJson === "string"
          ? JSON.parse(contentJson || "{}")
          : contentJson || {};

      console.log(" Parsed contentJson:", content);

      setParsedContent(content);
    } catch (error) {
      console.error("Error parsing contentJson:", error);

      setParsedContent({});
    }
  }, [contentJson]);

  // Load field configuration for the component type

  useEffect(() => {
    if (componentType) {
      const config = getFieldConfigForComponent(componentType);

      setFieldConfig(config);

      console.log(` Field config for ${componentType}:`, config);
    }
  }, [componentType]);

  // Fields that should use media picker instead of text input

  const mediaFields = [
    "backgroundimage",

    "backgroundvideo",

    "image",

    "video",

    "icon",

    "logo",

    "thumbnail",

    "avatar",

    "picture",

    "photo",

    "banner",

    "heroimage",

    "herovideo",

    "img",

    "pic",

    "media",

    "file",

    "asset",

    "poster",

    // About section specific fields

    "backgroundImage",

    "backgroundVideo",

    "teamMemberImage",

    "memberImage",
  ];

  // Check if a field name suggests it's a media field

  const isMediaField = (fieldName) => {
    const lowerFieldName = fieldName.toLowerCase();

    return (
      mediaFields.some(
        (mediaField) =>
          lowerFieldName.includes(mediaField) ||
          lowerFieldName.endsWith("image") ||
          lowerFieldName.endsWith("video") ||
          lowerFieldName.endsWith("img") ||
          lowerFieldName.endsWith("pic") ||
          lowerFieldName.endsWith("photo") ||
          lowerFieldName.endsWith("asset") ||
          lowerFieldName.endsWith("media"),
      ) ||
      // Special handling for About sections

      (componentType &&
        componentType.includes("About") &&
        (fieldName === "backgroundImage" ||
          fieldName === "backgroundVideo" ||
          fieldName === "image" ||
          (fieldName.includes("team") && fieldName.includes("image"))))
    );
  };

  // Fields that should use select dropdown for variants

  const isVariantField = (fieldName) => {
    return fieldName.toLowerCase() === "variant";
  };

  // Get available app routes for link suggestions

  const getAvailableRoutes = () => {
    return [
      { value: "/", label: "Home" },

      { value: "/about", label: "About Us" },

      { value: "/services", label: "Services" },

      { value: null, label: "Contact (Modal)" },

      { value: "/training", label: "Training" },

      { value: "/implementation", label: "Implementation" },

      { value: "/customization", label: "Customization" },

      { value: "/consulting", label: "Consulting" },

      { value: "/support", label: "Support" },

      { value: "/hr", label: "HR Solutions" },

      { value: "/payroll", label: "Payroll" },

      { value: "/manufacturing", label: "Manufacturing" },

      { value: "/retail", label: "Retail" },
    ];
  };

  // Fields that should use route suggestions for links

  const isLinkField = (fieldName) => {
    const linkFields = ["link", "url", "href", "to", "route"];

    return linkFields.some((linkField) =>
      fieldName.toLowerCase().includes(linkField.toLowerCase()),
    );
  };

  // Update a field value in the parsed content

  const updateField = (path, value) => {
    const newContent = { ...parsedContent };

    // Handle nested paths like "ctaButton.text" or "features[0].title"

    const keys = path.split(".");

    let current = newContent;

    // Navigate to the parent object, handling array indices

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];

      // Check if this key contains an array index (e.g., "features[0]")

      const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);

      if (arrayMatch) {
        const arrayKey = arrayMatch[1];

        const arrayIndex = parseInt(arrayMatch[2], 10);

        // Ensure the array exists

        if (!current[arrayKey]) {
          current[arrayKey] = [];
        }

        // Ensure the array index exists

        if (!current[arrayKey][arrayIndex]) {
          current[arrayKey][arrayIndex] = {};
        }

        current = current[arrayKey][arrayIndex];
      } else {
        // Regular object key

        if (!current[key]) {
          current[key] = {};
        }

        current = current[key];
      }
    }

    // Set the final value

    const finalKey = keys[keys.length - 1];

    const finalArrayMatch = finalKey.match(/^(.+)\[(\d+)\]$/);

    if (finalArrayMatch) {
      const arrayKey = finalArrayMatch[1];

      const arrayIndex = parseInt(finalArrayMatch[2], 10);

      // Ensure the array exists

      if (!current[arrayKey]) {
        current[arrayKey] = [];
      }

      // Set the value at the specific array index

      current[arrayKey][arrayIndex] = value;
    } else {
      // Regular field

      current[finalKey] = value;
    }

    setParsedContent(newContent);

    // Convert back to JSON string and call onChange

    const jsonString = JSON.stringify(newContent, null, 2);

    console.log(" Updated contentJson:", newContent);

    // Add specific debugging for ManufacturingHeroSection

    if (componentType === "ManufacturingHeroSection") {
      console.log(" [DYNAMIC FORM CHANGE] ManufacturingHeroSection:", {
        field: path,

        value: value,

        fullData: newContent,

        jsonString: jsonString,
      });
    }

    onChange(jsonString);
  };

  // Open media picker for a specific field

  const openMediaPicker = (fieldPath) => {
    console.log(" Opening media picker for field:", fieldPath);

    setCurrentMediaField(fieldPath);

    setMediaPickerOpen(true);
  };

  // Handle media selection

  const handleMediaSelect = (mediaUrl) => {
    if (currentMediaField) {
      console.log(
        " Setting media URL:",

        mediaUrl,

        "for field:",

        currentMediaField,
      );

      updateField(currentMediaField, mediaUrl);
    }

    setCurrentMediaField(null);
  };

  // Recursively render form fields for an object

  const renderFields = (obj, parentPath = "") => {
    const fields = [];

    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      const fieldPath = parentPath ? `${parentPath}.${key}` : key;

      if (Array.isArray(value)) {
        // Render array items as individual inputs or nested objects

        fields.push(
          <div key={fieldPath} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newArr = [...value];

                  if (value.length > 0 && typeof value[0] === "object") {
                    // Add new object with same structure as first item

                    const newItem = {};

                    Object.keys(value[0]).forEach((subKey) => {
                      newItem[subKey] = "";
                    });

                    newArr.push(newItem);
                  } else {
                    // Add new primitive value

                    newArr.push("");
                  }

                  updateField(fieldPath, newArr);
                }}
                className="text-xs px-2 py-1"
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {value.map((item, idx) => {
                const itemPath = `${fieldPath}[${idx}]`;

                if (item && typeof item === "object") {
                  // Render nested object fields for each array item

                  return (
                    <div
                      key={itemPath}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Item {idx + 1}
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newArr = [...value];

                            newArr.splice(idx, 1);

                            updateField(fieldPath, newArr);
                          }}
                          className="text-red-600 hover:text-red-700 text-xs px-2 py-1"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {renderFields(item, itemPath)}
                      </div>
                    </div>
                  );
                } else {
                  // Render simple input for primitive array item

                  return (
                    <div key={itemPath} className="flex items-center space-x-2">
                      <Input
                        value={item || ""}
                        onChange={(e) => {
                          const newArr = [...value];

                          newArr[idx] = e.target.value;

                          updateField(fieldPath, newArr);
                        }}
                        placeholder={`Item ${idx + 1}`}
                        className="flex-1"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newArr = [...value];

                          newArr.splice(idx, 1);

                          updateField(fieldPath, newArr);
                        }}
                        className="text-red-600 hover:text-red-700 px-2 py-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                }
              })}
            </div>
          </div>,
        );
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        // Nested object - render as a group

        fields.push(
          <div
            key={fieldPath}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4"
          >
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </h4>

            <div className="space-y-3">{renderFields(value, fieldPath)}</div>
          </div>,
        );
      } else {
        // Simple field

        const isMedia = isMediaField(key);

        fields.push(
          <div key={fieldPath} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}

              {isMedia && (
                <span className="text-xs text-blue-600 ml-1">(Media)</span>
              )}
            </label>

            {isMedia ? (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={value || ""}
                    onChange={(e) => updateField(fieldPath, e.target.value)}
                    placeholder={`Enter ${key} URL or select from library`}
                    className="flex-1"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openMediaPicker(fieldPath)}
                    className="px-3 shrink-0"
                    title="Select from media library"
                  >
                    <PhotoIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Media Preview */}

                {value && (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                    {(() => {
                      const fullUrl = value?.startsWith("http")
                        ? value
                        : `${API_BASE_URL}${value}`;

                      const fileName = value.split("/").pop() || value;

                      const isVideo = fileName.match(
                        /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i,
                      );

                      if (isVideo) {
                        return (
                          <div className="w-8 h-8 bg-gray-800 rounded border flex items-center justify-center">
                            <VideoCameraIcon className="h-4 w-4 text-white" />
                          </div>
                        );
                      } else {
                        return (
                          <>
                            <img
                              src={fullUrl}
                              alt="Preview"
                              className="w-8 h-8 object-cover rounded border"
                              onError={(e) => {
                                e.target.style.display = "none";

                                e.target.nextSibling.style.display = "flex";
                              }}
                            />

                            <div className="hidden w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                              <PhotoIcon className="h-4 w-4 text-gray-400" />
                            </div>
                          </>
                        );
                      }
                    })()}

                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      Selected: {value.split("/").pop() || value}
                    </span>
                  </div>
                )}
              </div>
            ) : isVariantField(key) ? (
              <div className="space-y-2">
                <select
                  value={value || "primary"}
                  onChange={(e) => updateField(fieldPath, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {getAvailableVariants().map((variant) => (
                    <option key={variant.value} value={variant.value}>
                      {variant.label}
                    </option>
                  ))}
                </select>

                {/* Variant Preview */}

                {value && (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                    <div
                      className={`px-3 py-1 text-xs rounded font-medium ${
                        value === "primary"
                          ? "bg-blue-600 text-white"
                          : value === "secondary"
                          ? "bg-gray-600 text-white"
                          : value === "success"
                          ? "bg-green-600 text-white"
                          : value === "warning"
                          ? "bg-yellow-600 text-white"
                          : value === "danger"
                          ? "bg-red-600 text-white"
                          : value === "info"
                          ? "bg-cyan-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {value}
                    </div>

                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Selected variant style preview
                    </span>
                  </div>
                )}
              </div>
            ) : isLinkField(key) ? (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={value || ""}
                    onChange={(e) => updateField(fieldPath, e.target.value)}
                    placeholder={`Enter ${key} (e.g., /about or https://example.com)`}
                    className="flex-1"
                    list={`routes-${fieldPath.replace(/[^\w]/g, "-")}`}
                  />
                </div>

                <datalist id={`routes-${fieldPath.replace(/[^\w]/g, "-")}`}>
                  {getAvailableRoutes().map((route) => (
                    <option key={route.value} value={route.value}>
                      {route.label}
                    </option>
                  ))}
                </datalist>

                {/* Link Preview */}

                {value && (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                    <div className="text-xs">
                      {value.startsWith("http") ? (
                        <span className="text-blue-600 dark:text-blue-400">
                          External Link
                        </span>
                      ) : (
                        <span className="text-green-600 dark:text-green-400">
                          Internal Route
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {value}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Input
                value={value || ""}
                onChange={(e) => updateField(fieldPath, e.target.value)}
                placeholder={`Enter ${key}`}
              />
            )}
          </div>,
        );
      }
    });

    return fields;
  };

  // Add new field functionality

  const addNewField = () => {
    const fieldName = prompt("Enter field name:");

    if (fieldName && fieldName.trim()) {
      updateField(fieldName.trim(), "");
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Dynamic Content Fields
        </h3>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNewField}
          className="text-xs"
        >
          + Add Field
        </Button>
      </div>

      {Object.keys(parsedContent).length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No content fields found. Add some fields to get started.</p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNewField}
            className="mt-2"
          >
            Add First Field
          </Button>
        </div>
      ) : (
        <div className="space-y-4">{renderFields(parsedContent)}</div>
      )}

      {/* Media Picker Modal */}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);

          setCurrentMediaField(null);
        }}
        onSelect={handleMediaSelect}
      />
    </div>
  );
};

export default DynamicContentForm;
