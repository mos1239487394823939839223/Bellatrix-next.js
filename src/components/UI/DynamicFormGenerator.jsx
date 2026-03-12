import React, { useState, useEffect, useRef } from "react";

import {
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PhotoIcon,
  VideoCameraIcon,
  CloudArrowUpIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

import Button from "../UI/Button";

import MediaPicker from "../UI/MediaPicker";

import IconPicker from "../UI/IconPicker";

/**
 * Custom Styled Select Component
 */
const StyledSelect = ({ value, onChange, options, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options?.find((opt) => {
    const optValue = typeof opt === "object" ? opt.value : opt;
    return optValue === value;
  });

  const selectedLabel = selectedOption
    ? typeof selectedOption === "object"
      ? selectedOption.label
      : selectedOption
    : placeholder || `Select ${label}`;

  return (
    <div ref={selectRef} className="relative">
      {/* Selected Value Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-left text-white 
                   hover:bg-slate-700/80 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                   focus:border-blue-500 transition-all duration-200 flex items-center justify-between group"
      >
        <span className={value ? "text-white" : "text-slate-400"}>
          {selectedLabel}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600/50 rounded-xl shadow-2xl 
                        overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {options?.map((option, index) => {
              const optValue =
                typeof option === "object" ? option.value : option;
              const optLabel =
                typeof option === "object" ? option.label : option;
              const isSelected = optValue === value;

              return (
                <button
                  key={optValue}
                  type="button"
                  onClick={() => {
                    onChange(optValue);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-all duration-150
                    ${
                      isSelected
                        ? "bg-blue-600/30 text-blue-300 border-l-4 border-blue-500"
                        : "text-slate-300 hover:bg-slate-700/80 hover:text-white border-l-4 border-transparent"
                    }
                    ${
                      index !== options.length - 1
                        ? "border-b border-slate-700/50"
                        : ""
                    }
                  `}
                >
                  <span className="font-medium">{optLabel}</span>
                  {isSelected && (
                    <CheckIcon className="w-5 h-5 text-blue-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/**

 * Dynamic Form Generator

 * Automatically generates form fields based on component schema definitions

 */

const DynamicFormGenerator = ({
  schema,

  data = {},

  onChange,

  onFieldChange,

  componentType,

  className = "",
  disabled = false,
}) => {
  const [formData, setFormData] = useState(data);

  const [expandedSections, setExpandedSections] = useState({});

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [mediaPickerField, setMediaPickerField] = useState(null);

  const [mediaPickerType, setMediaPickerType] = useState("all");

  const [mediaPickerCallback, setMediaPickerCallback] = useState(null);

  const shouldDebug = false;
  const debugLog = (...args) => {
    if (shouldDebug) console.log(...args);
  };
  const debugWarn = (...args) => {
    if (shouldDebug) console.warn(...args);
  };

  // Open media picker for a specific field

  const openMediaPicker = (fieldPath, mediaType = "all", callback = null) => {
    setMediaPickerField(fieldPath);

    setMediaPickerType(mediaType);

    setMediaPickerCallback(() => callback);

    setMediaPickerOpen(true);
  };

  // Handle media selection from picker

  const handleMediaSelect = (url) => {
    debugLog(" [MEDIA SELECT] Selected URL:", url);

    debugLog(" [MEDIA SELECT] mediaPickerField:", mediaPickerField);

    debugLog(" [MEDIA SELECT] mediaPickerCallback:", !!mediaPickerCallback);

    if (mediaPickerCallback) {
      // Use callback for array items

      debugLog(" [MEDIA SELECT] Using callback");

      mediaPickerCallback(url);
    } else if (mediaPickerField) {
      // Use field path for regular fields

      debugLog(
        " [MEDIA SELECT] Using handleChange for field:",
        mediaPickerField
      );

      handleChange(mediaPickerField, url);
    }

    setMediaPickerOpen(false);

    setMediaPickerField(null);

    setMediaPickerCallback(null);
  };

  useEffect(() => {
    debugLog(" [DynamicFormGenerator] Data prop changed:", {
      componentType,

      dataKeys: Object.keys(data),

      dataChanged: JSON.stringify(data) !== JSON.stringify(formData),

      currentFormData: formData,

      newData: data,

      dataType: typeof data,

      isEmpty: !data || Object.keys(data).length === 0,
    });

    // Only update if data is actually different and not empty

    if (
      data &&
      Object.keys(data).length > 0 &&
      JSON.stringify(data) !== JSON.stringify(formData)
    ) {
      debugLog(
        " [DynamicFormGenerator] Updating form data from:",

        formData,

        "to:",

        data
      );

      setFormData(data);
    } else if (!data || Object.keys(data).length === 0) {
      debugLog(" [DynamicFormGenerator] Empty or no data received:", {
        componentType,

        data,

        formData,
      });
    } else {
      debugLog(" [DynamicFormGenerator] Data unchanged:", {
        componentType,

        dataKeys: Object.keys(data),

        formDataKeys: Object.keys(formData),
      });
    }
  }, [data, componentType]);

  const handleChange = (path, value) => {
    debugLog(" [DynamicFormGenerator] handleChange:", {
      componentType,
      path,
      value,
      valueType: typeof value,
      isArray: Array.isArray(value),
      currentFormData: formData,
    });

    const setValueAtPath = (obj, path, value) => {
      const parts = path.split(".");
      const newObj = { ...obj };
      let current = newObj;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        const nextPart = parts[i + 1];

        // Check if the next part is a numeric index
        const isNextPartNumber = /^\d+$/.test(nextPart);

        if (!(part in current)) {
          current[part] = isNextPartNumber ? [] : {};
        } else {
          // Ensure we clone correctly
          if (Array.isArray(current[part])) {
            current[part] = [...current[part]];
          } else if (typeof current[part] === 'object' && current[part] !== null) {
            current[part] = { ...current[part] };
          }
        }
        current = current[part];
      }

      current[parts[parts.length - 1]] = value;
      return newObj;
    };

    const updatedData = setValueAtPath(formData, path, value);

    debugLog(" [DynamicFormGenerator] Updated data:", {
      path,
      updatedData,
      changedField: getValueByPath(updatedData, path), // Use getValueByPath to get the changed field
    });

    setFormData(updatedData);
    onChange(updatedData);

    // Also trigger field-specific change for immediate preview updates

    if (onFieldChange) {
      debugLog(" [DynamicFormGenerator] Calling onFieldChange:", {
        path,

        value,
      });

      onFieldChange(path, value);
    }
  };

  const handleArrayAdd = (path, defaultItem = {}) => {
    const updatedData = JSON.parse(JSON.stringify(formData));

    const pathArray = path.split(".");

    let current = updatedData;

    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) {
        current[pathArray[i]] = {};
      }

      current = current[pathArray[i]];
    }

    const arrayKey = pathArray[pathArray.length - 1];

    if (!Array.isArray(current[arrayKey])) {
      current[arrayKey] = [];
    }

    current[arrayKey].push(defaultItem);

    setFormData(updatedData);

    onChange(updatedData);
  };

  const handleArrayRemove = (path, index) => {
    const updatedData = JSON.parse(JSON.stringify(formData));

    const pathArray = path.split(".");

    let current = updatedData;

    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }

    const arrayKey = pathArray[pathArray.length - 1];

    if (Array.isArray(current[arrayKey])) {
      current[arrayKey].splice(index, 1);
    }

    setFormData(updatedData);

    onChange(updatedData);
  };

  const handleArrayMove = (path, fromIndex, toIndex) => {
    const updatedData = JSON.parse(JSON.stringify(formData));

    const pathArray = path.split(".");

    let current = updatedData;

    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }

    const arrayKey = pathArray[pathArray.length - 1];

    if (!Array.isArray(current[arrayKey])) return;

    const item = current[arrayKey][fromIndex];

    current[arrayKey].splice(fromIndex, 1);

    current[arrayKey].splice(toIndex, 0, item);

    setFormData(updatedData);

    onChange(updatedData);
  };

  const getValueByPath = (obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const createDefaultItem = (itemSchema) => {
    // Add safety check for itemSchema

    if (!itemSchema) {
      console.warn(
        " [DynamicFormGenerator] createDefaultItem: itemSchema is undefined"
      );

      return { title: "", description: "" };
    }

    // Handle different schema types

    if (itemSchema.type === "string") {
      return "";
    }

    if (itemSchema.type === "number") {
      return 0;
    }

    if (itemSchema.type === "boolean") {
      return false;
    }

    if (itemSchema.type === "array") {
      return [];
    }

    if (itemSchema.type === "object" && itemSchema.properties) {
      const defaultItem = {};

      Object.entries(itemSchema.properties).forEach(([key, prop]) => {
        // Recursively create default values for nested objects

        if (prop.type === "string") {
          if (key === "id" || key === "key") {
            // Generate a unique ID to avoid React key collisions
            defaultItem[key] = `id_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          } else {
            defaultItem[key] = prop.defaultData || "";
          }
        } else if (prop.type === "number") {
          defaultItem[key] = prop.defaultData ?? 0;
        } else if (prop.type === "boolean") {
          defaultItem[key] = prop.defaultData ?? false;
        } else if (prop.type === "array") {
          defaultItem[key] = [];
        } else if (prop.type === "object" && prop.properties) {
          // Recursively handle nested objects

          defaultItem[key] = createDefaultItem(prop);
        } else {
          defaultItem[key] = "";
        }
      });

      return defaultItem;
    }

    // Fallback for unknown types

    return { title: "", description: "" };
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,

      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Render function specifically for array item fields

  const renderArrayItemField = (fieldName, fieldSchema, value, onChange) => {
    const isRequired = fieldSchema.required;

    const isSlideDescriptionField = fieldSchema.label === "Slide Description";

    const labelClasses = `block text-sm font-medium text-gray-300 mb-2 ${
      isRequired ? "text-white" : ""
    } ${isSlideDescriptionField ? "hero-slide-description-label" : ""}`;

    const inputClasses = `w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200 ${
      isRequired ? "border-white/40" : ""
    }`;

    switch (fieldSchema.formField) {
      case "text":
      // falls through
      case "email":
      // falls through
      case "url":
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}

              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <input
              type={fieldSchema.formField}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className={inputClasses}
              placeholder={fieldSchema.placeholder}
              required={isRequired}
              disabled={disabled}
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}

              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <textarea
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className={inputClasses}
              rows="3"
              placeholder={fieldSchema.placeholder}
              required={isRequired}
              disabled={disabled}
            />
          </div>
        );

      case "number":
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}

              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <input
              type="number"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className={inputClasses}
              placeholder={fieldSchema.placeholder}
              required={isRequired}
            />
          </div>
        );

      case "select":
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}

              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <StyledSelect
              value={value || ""}
              onChange={onChange}
              options={fieldSchema.options}
              placeholder={`Select ${fieldSchema.label}`}
              label={fieldSchema.label}
              disabled={disabled}
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />

            <label className="text-sm font-medium text-gray-300">
              {fieldSchema.label}
            </label>
          </div>
        );

      case "media":
      // falls through
      case "media-image":
      // falls through
      case "media-video":
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}

              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className={`${inputClasses} flex-1`}
                placeholder={fieldSchema.placeholder || "Enter media URL"}
                required={isRequired}
              />

              <button
                type="button"
                onClick={() => {
                  const mediaType =
                    fieldSchema.formField === "media-video" ||
                    fieldSchema.mediaType === "video"
                      ? "video"
                      : fieldSchema.formField === "media-image" ||
                        fieldSchema.mediaType === "image"
                      ? "image"
                      : "all";

                  // Use callback to update array item value

                  openMediaPicker(null, mediaType, (url) => onChange(url));
                }}
                className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 rounded-lg flex items-center gap-1 text-sm transition-colors"
              >
                <CloudArrowUpIcon className="h-4 w-4" />
                Browse
              </button>
            </div>

            <small className="text-xs text-gray-400 flex items-center gap-1">
              {fieldSchema.mediaType === "video" ||
              fieldSchema.formField === "media-video" ? (
                <>
                  <VideoCameraIcon className="h-3 w-3" /> Video URL or upload
                </>
              ) : (
                <>
                  <PhotoIcon className="h-3 w-3" /> Image URL or upload
                </>
              )}
            </small>

            {value && (
              <div className="mt-2 relative group inline-block">
                {fieldSchema.mediaType === "video" ||
                fieldSchema.formField === "media-video" ? (
                  <video
                    src={value}
                    className="h-16 object-cover rounded border border-white/20"
                    muted
                  />
                ) : (
                  <img
                    src={value}
                    alt="Preview"
                    className="h-16 object-cover rounded border border-white/20"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );

      case "icon":
        return (
          <IconPicker
            value={value || ""}
            onChange={onChange}
            label={fieldSchema.label}
            placeholder={fieldSchema.placeholder || "Select an icon..."}
            required={isRequired}
          />
        );

      case "array": {
        const arrayValue = Array.isArray(value) ? value : [];
        const itemSchema = fieldSchema.items;
        // Use local state for expansion or default to expanded
        // Since we can't easily use the global expandedSections state with a unique path here without passing it down
        // We'll default to always expanded for nested arrays for now to keep it simple and functional
        
        return (
          <div className="space-y-3 border border-white/10 rounded-lg p-3 bg-white/5">
            <div className="flex items-center justify-between">
              <label className={labelClasses}>
                {fieldSchema.label} <span className="text-gray-500 text-xs">({arrayValue.length})</span>
                {isRequired && <span className="text-red-400">*</span>}
              </label>

              <Button
                size="sm"
                onClick={() => {
                  const defaultItem = createDefaultItem(itemSchema);
                  const newArray = [...arrayValue, defaultItem];
                  onChange(newArray);
                }}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-400/30 text-xs px-2 py-1"
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {arrayValue.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-white/5 rounded border border-white/10"
                >
                   {/* Handle generic item rendering */}
                   <div className="flex-1">
                      {itemSchema && itemSchema.type === "string" ? (
                        <input
                          type="text"
                          value={item || ""}
                          onChange={(e) => {
                            const newArray = [...arrayValue];
                            newArray[index] = e.target.value;
                            onChange(newArray);
                          }}
                          className={`${inputClasses} text-sm py-1 px-2`}
                          placeholder={`${fieldSchema.label} item`}
                        />
                      ) : itemSchema && itemSchema.properties ? (
                         /* Recursive object rendering for nested array items */
                         <div className="space-y-2">
                           {Object.entries(itemSchema.properties).map(([propKey, propSchema]) => (
                              <div key={propKey}>
                                {renderArrayItemField(
                                  propKey, 
                                  propSchema, 
                                  item?.[propKey], 
                                  (newValue) => {
                                    const newArray = [...arrayValue];
                                    if (!newArray[index] || typeof newArray[index] !== 'object') {
                                       newArray[index] = {};
                                    }
                                    newArray[index] = { ...newArray[index], [propKey]: newValue };
                                    onChange(newArray);
                                  }
                                )}
                              </div>
                           ))}
                         </div>
                      ) : (
                        <div className="text-gray-400 text-xs">Unsupported item type</div>
                      )}
                   </div>

                   <Button
                      size="xs"
                      onClick={() => {
                        const newArray = [...arrayValue];
                        newArray.splice(index, 1);
                        onChange(newArray);
                      }}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-400/30 mt-1"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                </div>
              ))}
              
              {arrayValue.length === 0 && (
                <div className="text-center py-2 text-gray-500 text-xs italic">
                  No items added
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}

              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className={inputClasses}
              placeholder={fieldSchema.placeholder}
              required={isRequired}
            />
          </div>
        );
    }
  };

  const renderField = (key, fieldSchema, basePath = "", level = 0) => {
    // Add safety check for fieldSchema

    if (!fieldSchema) {
      console.warn(
        " [DynamicFormGenerator] renderField: fieldSchema is undefined for key:",

        key
      );

      return (
        <div
          key={basePath ? `${basePath}.${key}` : key}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
        >
          <div className="text-red-400 text-sm font-medium">
            Error: No schema defined
          </div>

          <div className="text-red-300 text-xs mt-1">Field: {key}</div>
        </div>
      );
    }

    const fullPath = basePath ? `${basePath}.${key}` : key;

    const value = getValueByPath(formData, fullPath);

    const isRequired = fieldSchema.required;

    const fieldType = fieldSchema.formField || fieldSchema.type || "text";

    debugLog(" [RENDER FIELD] Field details:", {
      key,

      basePath,

      fullPath,

      value,

      fieldType,

      isRequired,

      level,

      componentType,
    });

    // Base classes for form fields

    const inputClasses =
      "block w-full rounded-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20 shadow-sm";

    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

    switch (fieldType) {
      case "text":
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <input
              type="text"
              value={value || ""}
              onChange={(e) => {
                debugLog(" [TEXT INPUT CHANGE]", {
                  fullPath,

                  oldValue: value,

                  newValue: e.target.value,

                  componentType,
                });

                handleChange(fullPath, e.target.value);
              }}
              placeholder={fieldSchema.placeholder}
              className={inputClasses}
              disabled={disabled}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <textarea
              value={value || ""}
              onChange={(e) => {
                debugLog(" [TEXTAREA CHANGE]", {
                  fullPath,

                  oldValue: value,

                  newValue: e.target.value,

                  componentType,
                });

                handleChange(fullPath, e.target.value);
              }}
              placeholder={fieldSchema.placeholder}
              rows={3}
              className={inputClasses}
              disabled={disabled}
            />
          </div>
        );

      case "select":
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <StyledSelect
              value={value || ""}
              onChange={(val) => handleChange(fullPath, val)}
              options={fieldSchema.options}
              placeholder={`Select ${fieldSchema.label}`}
              label={fieldSchema.label}
              disabled={disabled}
            />
        </div>
        );

      case "icon":
        return (
          <div key={fullPath} className="space-y-2">
            <IconPicker
              value={value || ""}
              onChange={(val) => handleChange(fullPath, val)}
              label={fieldSchema.label}
              placeholder={fieldSchema.placeholder || "Select an icon..."}
              required={isRequired}
            />
          </div>
        );

      case "media":
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <div className="flex gap-2">
              <input
                type="url"
                value={value || ""}
                onChange={(e) => handleChange(fullPath, e.target.value)}
                placeholder={fieldSchema.placeholder}
                className={`${inputClasses} flex-1`}
              />

              <Button
                type="button"
                onClick={() =>
                  openMediaPicker(fullPath, fieldSchema.mediaType || "all")
                }
                className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-400/30 flex items-center gap-2 px-3"
              >
                <CloudArrowUpIcon className="h-4 w-4" />
                Browse
              </Button>
            </div>

            <p className="text-xs text-gray-400 flex items-center gap-1">
              {fieldSchema.mediaType === "video" ? (
                <>
                  <VideoCameraIcon className="h-3 w-3" /> Enter URL or click
                  Browse to upload/select video
                </>
              ) : fieldSchema.mediaType === "image" ? (
                <>
                  <PhotoIcon className="h-3 w-3" /> Enter URL or click Browse to
                  upload/select image
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-3 w-3" /> Enter URL or click
                  Browse to upload/select media
                </>
              )}
            </p>

            {value && (
              <div className="mt-2 relative group">
                {fieldSchema.mediaType === "video" ? (
                  <video
                    src={value}
                    className="max-w-xs h-20 object-cover rounded border border-white/20"
                    muted
                  />
                ) : (
                  <img
                    src={value}
                    alt="Preview"
                    className="max-w-xs h-20 object-cover rounded border border-white/20"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}

                <button
                  type="button"
                  onClick={() => handleChange(fullPath, "")}
                  className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        );

      case "tagList": {
        const tags = Array.isArray(value) ? value : [];

        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <div className="space-y-2">
              <input
                type="text"
                placeholder={fieldSchema.placeholder}
                className={inputClasses}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    e.preventDefault();

                    const newTags = [...tags, e.target.value.trim()];

                    handleChange(fullPath, newTags);

                    e.target.value = "";
                  }
                }}
              />

              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30"
                  >
                    {tag}

                    <button
                      type="button"
                      onClick={() => {
                        const newTags = tags.filter((_, i) => i !== index);

                        handleChange(fullPath, newTags);
                      }}
                      className="ml-1 text-blue-300 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400">Press Enter to add tags</p>
          </div>
        );
      }

      case "object": {
        const isExpanded = expandedSections[fullPath] !== false;

        const objectValue = value || {};

        debugLog(" [OBJECT FIELD] Rendering object:", {
          fullPath,

          fieldLabel: fieldSchema.label,

          objectValue,

          hasProperties: !!fieldSchema.properties,

          properties: fieldSchema.properties
            ? Object.keys(fieldSchema.properties)
            : [],
        });

        return (
          <div key={fullPath} className="space-y-3">
            <button
              type="button"
              onClick={() => toggleSection(fullPath)}
              className="flex items-center justify-between w-full p-3 bg-white/5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition-all duration-200"
            >
              <span className="font-medium">
                {fieldSchema.label}{" "}
                {isRequired && <span className="text-red-400">*</span>}
              </span>

              {isExpanded ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>

            {isExpanded && fieldSchema.properties && (
              <div className="pl-4 space-y-4 border-l-2 border-white/10 bg-white/5 rounded-lg p-4">
                {Object.entries(fieldSchema.properties).map(
                  ([propKey, propSchema]) => {
                    debugLog(" [OBJECT PROPERTY] Rendering property:", {
                      propKey,

                      propSchema,

                      currentPath: fullPath,

                      newPath: `${fullPath}.${propKey}`,

                      currentValue: objectValue[propKey],
                    });

                    return renderField(
                      propKey,

                      propSchema,

                      fullPath,

                      level + 1
                    );
                  }
                )}
              </div>
            )}
          </div>
        );
      }

      case "array": {
        const arrayValue = Array.isArray(value) ? value : [];

        const itemSchema = fieldSchema.items;

        const isArrayExpanded = expandedSections[fullPath] !== false;

        return (
          <div key={fullPath} className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleSection(fullPath)}
                className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition-all duration-200"
              >
                <span className="font-medium">
                  {fieldSchema.label} ({arrayValue.length})
                </span>

                {isArrayExpanded ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>

              <Button
                size="sm"
                onClick={() => {
                  const defaultItem = createDefaultItem(itemSchema);

                  debugLog(" [ARRAY ADD] Adding item with schema:", {
                    itemSchema,

                    defaultItem,

                    fullPath,
                  });

                  handleArrayAdd(fullPath, defaultItem);
                }}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-400/30"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {isArrayExpanded && (
              <div className="space-y-4">
                {arrayValue.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-300">
                        Item {index + 1}
                        {/* Debug info */}
                        <span className="ml-2 text-xs text-gray-500">
                          {itemSchema ? (itemSchema.properties ? `(${Object.keys(itemSchema.properties).length} fields)` : `(type: ${itemSchema.type})`) : "(no schema)"}
                        </span>
                      </h4>

                      <div className="flex items-center space-x-2">
                        {index > 0 && (
                          <Button
                            size="xs"
                            onClick={() =>
                              handleArrayMove(fullPath, index, index - 1)
                            }
                            className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300"
                          >
                            ↑
                          </Button>
                        )}

                        {index < arrayValue.length - 1 && (
                          <Button
                            size="xs"
                            onClick={() =>
                              handleArrayMove(fullPath, index, index + 1)
                            }
                            className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300"
                          >
                            ↓
                          </Button>
                        )}

                        <Button
                          size="xs"
                          onClick={() => handleArrayRemove(fullPath, index)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-400/30"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {itemSchema && itemSchema.type === "string" ? (
                        <input
                          type="text"
                          value={item || ""}
                          onChange={(e) => {
                            const newArray = [...arrayValue];

                            newArray[index] = e.target.value;

                            handleChange(fullPath, newArray);
                          }}
                          className={inputClasses}
                          placeholder={`${fieldSchema.label} item`}
                        />
                      ) : itemSchema && itemSchema.properties ? (
                        Object.entries(itemSchema.properties).map(
                          ([propKey, propSchema]) => {
                            const itemFieldPath = `${fullPath}.${index}.${propKey}`;

                            const currentValue =
                              item && typeof item === "object"
                                ? item[propKey]
                                : undefined;

                            debugLog(
                              " [ARRAY ITEM FIELD] Rendering field:",

                              {
                                itemIndex: index,

                                propKey,

                                itemFieldPath,

                                currentValue,

                                item,

                                propSchema,

                                fullPath,

                                arrayValue,

                                itemSchema: itemSchema.properties,
                              }
                            );

                            // Create a custom render function for array item fields

                            return (
                              <div key={propKey} className="space-y-2">
                                {renderArrayItemField(
                                  propKey,

                                  propSchema,

                                  currentValue,

                                  (newValue) => {
                                    const newArray = [...arrayValue];

                                    if (
                                      !newArray[index] ||
                                      typeof newArray[index] !== "object"
                                    ) {
                                      newArray[index] = {};
                                    }

                                    newArray[index] = {
                                      ...newArray[index],

                                      [propKey]: newValue,
                                    };

                                    handleChange(fullPath, newArray);
                                  }
                                )}
                              </div>
                            );
                          }
                        )
                      ) : (
                        <div className="text-center py-4 text-gray-400">
                          <div className="text-sm">
                            No schema defined for array items
                          </div>

                          <div className="text-xs mt-1">
                            Item Schema:{" "}
                            {itemSchema
                              ? JSON.stringify(itemSchema)
                              : "undefined"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {arrayValue.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No {fieldSchema.label.toLowerCase()} added yet.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      case "checkbox":
        return (
          <div key={fullPath} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={fullPath}
                checked={Boolean(value)}
                onChange={(e) => {
                  console.log(" [CHECKBOX CHANGE]", {
                    fullPath,

                    oldValue: value,

                    newValue: e.target.checked,

                    componentType,
                  });

                  handleChange(fullPath, e.target.checked);
                }}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
              />

              <label
                htmlFor={fullPath}
                className="text-sm font-medium text-gray-300"
              >
                {fieldSchema.label}{" "}
                {isRequired && <span className="text-red-400">*</span>}
              </label>
            </div>
          </div>
        );

      case "number":
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <input
              type="number"
              value={value || ""}
              onChange={(e) => {
                const numValue =
                  e.target.value === "" ? "" : Number(e.target.value);

                console.log(" [NUMBER CHANGE]", {
                  fullPath,

                  oldValue: value,

                  newValue: numValue,

                  componentType,
                });

                handleChange(fullPath, numValue);
              }}
              placeholder={fieldSchema.placeholder}
              className={inputClasses}
            />
          </div>
        );

      case "email":
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <input
              type="email"
              value={value || ""}
              onChange={(e) => {
                console.log(" [EMAIL CHANGE]", {
                  fullPath,

                  oldValue: value,

                  newValue: e.target.value,

                  componentType,
                });

                handleChange(fullPath, e.target.value);
              }}
              placeholder={fieldSchema.placeholder}
              className={inputClasses}
            />
          </div>
        );

      case "url":
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <input
              type="url"
              value={value || ""}
              onChange={(e) => {
                console.log(" [URL CHANGE]", {
                  fullPath,

                  oldValue: value,

                  newValue: e.target.value,

                  componentType,
                });

                handleChange(fullPath, e.target.value);
              }}
              placeholder={fieldSchema.placeholder}
              className={inputClasses}
            />
          </div>
        );

      case "color":
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <div className="flex space-x-2">
              <input
                type="color"
                value={value || "#000000"}
                onChange={(e) => {
                  console.log(" [COLOR CHANGE]", {
                    fullPath,

                    oldValue: value,

                    newValue: e.target.value,

                    componentType,
                  });

                  handleChange(fullPath, e.target.value);
                }}
                className="w-12 h-10 rounded border border-white/20 bg-white/10"
              />

              <input
                type="text"
                value={value || ""}
                onChange={(e) => handleChange(fullPath, e.target.value)}
                placeholder={fieldSchema.placeholder}
                className={`${inputClasses} flex-1`}
              />
            </div>
          </div>
        );

      case "media-image":
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <div className="flex gap-2">
              <input
                type="url"
                value={value || ""}
                onChange={(e) => {
                  console.log(" [IMAGE CHANGE]", {
                    fullPath,

                    oldValue: value,

                    newValue: e.target.value,

                    componentType,
                  });

                  handleChange(fullPath, e.target.value);
                }}
                placeholder={fieldSchema.placeholder || "/images/example.jpg"}
                className={`${inputClasses} flex-1`}
              />

              <Button
                type="button"
                onClick={() => openMediaPicker(fullPath, "image")}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-400/30 flex items-center gap-2 px-3"
              >
                <CloudArrowUpIcon className="h-4 w-4" />
                Browse
              </Button>
            </div>

            <p className="text-xs text-gray-400 flex items-center gap-1">
              <PhotoIcon className="h-3 w-3" />
              Enter URL or click Browse to upload/select image
            </p>

            {value && (
              <div className="mt-2 relative group">
                <img
                  src={value}
                  alt="Preview"
                  className="max-w-xs h-24 object-cover rounded border border-white/20"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleChange(fullPath, "")}
                  className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        );

      case "media-video":
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <div className="flex gap-2">
              <input
                type="url"
                value={value || ""}
                onChange={(e) => {
                  console.log(" [VIDEO CHANGE]", {
                    fullPath,

                    oldValue: value,

                    newValue: e.target.value,

                    componentType,
                  });

                  handleChange(fullPath, e.target.value);
                }}
                placeholder={fieldSchema.placeholder || "/videos/example.mp4"}
                className={`${inputClasses} flex-1`}
              />

              <Button
                type="button"
                onClick={() => openMediaPicker(fullPath, "video")}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-400/30 flex items-center gap-2 px-3"
              >
                <CloudArrowUpIcon className="h-4 w-4" />
                Browse
              </Button>
            </div>

            <p className="text-xs text-gray-400 flex items-center gap-1">
              <VideoCameraIcon className="h-3 w-3" />
              Enter URL or click Browse to upload/select video
            </p>

            {value && (
              <div className="mt-2 relative group">
                <video
                  src={value}
                  className="max-w-xs h-24 object-cover rounded border border-white/20"
                  muted
                />

                <button
                  type="button"
                  onClick={() => handleChange(fullPath, "")}
                  className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div key={fullPath} className="space-y-2">
            <label className={labelClasses}>
              {fieldSchema.label}{" "}
              {isRequired && <span className="text-red-400">*</span>}
            </label>

            <input
              type="text"
              value={value || ""}
              onChange={(e) => handleChange(fullPath, e.target.value)}
              placeholder={fieldSchema.placeholder}
              className={inputClasses}
            />
          </div>
        );
    }
  };

  if (!schema || !schema.properties) {
    console.log(" [DynamicFormGenerator] No schema or properties:", {
      componentType,

      hasSchema: !!schema,

      hasProperties: !!(schema && schema.properties),

      schema: schema,
    });

    return (
      <div className="p-4 text-center text-gray-400">
        <div className="mb-2">No schema defined for this component</div>

        <div className="text-xs text-gray-500">Component: {componentType}</div>

        <div className="text-xs text-gray-500">
          Schema: {schema ? "exists" : "missing"}
        </div>

        <div className="text-xs text-gray-500">
          Properties: {schema && schema.properties ? "exists" : "missing"}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Component Configuration
          </h3>

          <span className="text-sm text-gray-400">{componentType}</span>
        </div>

        <div className="space-y-6">
          {(() => {
            const fieldEntries = Object.entries(schema.properties);

            debugLog(" [DynamicFormGenerator] Rendering fields:", {
              componentType,

              fieldCount: fieldEntries.length,

              fieldKeys: fieldEntries.map(([key]) => key),

              schemaProperties: schema.properties,

              formDataKeys: formData && typeof formData === 'object' && !Array.isArray(formData) ? Object.keys(formData) : [],

              hasItemsInData: formData && typeof formData === 'object' && !Array.isArray(formData) ? "items" in formData : false,

              hasItemsInSchema: "items" in schema.properties,
            });

            return fieldEntries.map(([key, fieldSchema]) => {
              debugLog(" [DynamicFormGenerator] Rendering field:", {
                componentType,

                fieldKey: key,

                fieldSchema,

                fieldValue: getValueByPath(formData, key),

                hasItemsField: key === "items",

                isArrayField: fieldSchema.type === "array",

                formFieldType: fieldSchema.formField || fieldSchema.type,

                isInSchema: key in schema.properties,

                isInFormData: formData && typeof formData === 'object' && !Array.isArray(formData) ? key in formData : false,

                isHidden: fieldSchema.hidden === true,
              });

              // Log warning for unexpected items field

              if (key === "items" && fieldSchema.type !== "array") {
                debugWarn(
                  " [DynamicFormGenerator] Unexpected items field found:",

                  {
                    componentType,

                    fieldSchema,

                    fieldType: fieldSchema.type,

                    formFieldType: fieldSchema.formField,
                  }
                );
              }

              // Only render fields that exist in the schema

              if (!(key in schema.properties)) {
                debugWarn(
                  " [DynamicFormGenerator] Field not in schema, skipping:",

                  {
                    componentType,

                    fieldKey: key,

                    schemaKeys: Object.keys(schema.properties),
                  }
                );

                return null;
              }

              // Skip hidden fields

              if (fieldSchema.hidden === true) {
                debugLog(
                  " [DynamicFormGenerator] Field is hidden, skipping:",

                  {
                    componentType,

                    fieldKey: key,

                    fieldSchema,
                  }
                );

                return null;
              }

              return renderField(key, fieldSchema);
            });
          })()}
        </div>
      </div>

      {/* Media Picker Modal */}

      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);

          setMediaPickerField(null);
        }}
        onSelect={handleMediaSelect}
        accept={mediaPickerType}
        title={
          mediaPickerType === "video"
            ? "Choose Video"
            : mediaPickerType === "image"
            ? "Choose Image"
            : "Choose Media"
        }
      />
    </>
  );
};

export default DynamicFormGenerator;
