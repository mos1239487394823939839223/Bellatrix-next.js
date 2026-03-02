import React, { useState, useEffect, useMemo } from "react";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Modal, { ModalFooter } from "../../UI/Modal";
import Button from "../../UI/Button";
import Input from "../../UI/Input";
import DynamicFormGenerator from "../../UI/DynamicFormGenerator";
import DynamicFormField from "../../UI/DynamicFormField";
import FancyToggle from "../../UI/FancyToggle";
import {
  parseJsonToFormFields,
  generateFormFieldsFromJson,
  updateJsonFromFormFields,
} from "../../../utils/jsonFormUtils";
import { generalComponentSchemas } from "../../../data/generalComponentSchemas";
import { supportComponentSchemas } from "../../../data/supportComponentSchemas";
import { aboutComponentSchemas } from "../../../data/aboutComponentSchemas";
import { normalizeProps } from "../../../utils/normalizeProps";

// Merge all schema registries into one lookup so every component type resolves correctly
const allComponentSchemas = {
  ...generalComponentSchemas,
  ...supportComponentSchemas,
  ...aboutComponentSchemas,
};

const EditComponentModal = ({
  isOpen,
  onClose,
  component,
  onSave,
  loading,
}) => {
  const [formData, setFormData] = useState({
    componentType: "",
    componentName: "",
    contentJson: "",
    isVisible: 1,
    theme: 1,
  });
  const [jsonData, setJsonData] = useState({});
  const [errors, setErrors] = useState({});
  const [useSchemaMode, setUseSchemaMode] = useState(true);

  // Get schema for current component type
  const currentSchema = useMemo(() => {
    const componentType = formData.componentType;
    return allComponentSchemas[componentType] || null;
  }, [formData.componentType]);

  useEffect(() => {
    if (component) {
      const parsedJson = parseJsonToFormFields(component.contentJson);
      const componentType = component.componentType || "Generic";

      // For components with a known schema, normalize the DB data so the form
      // shows the correct fields (e.g. extracts members[0].image → image,
      // maps bulletPoints/members → items, fills in missing defaults).
      const schema = allComponentSchemas[componentType];
      let normalizedJson = parsedJson;
      if (schema) {
        try {
          const normalized = normalizeProps(componentType, parsedJson);
          // normalizeProps returns {title, items, image, ..., data: {...}}
          // Strip the internal `data` wrapper to keep only display fields.
          const { data: _internalData, ...displayFields } = normalized;
          // Only use normalized output if it produced more/better fields
          normalizedJson = Object.keys(displayFields).length > 0
            ? displayFields
            : parsedJson;

          // PayrollPainPointsSection: normalizeProps wraps painPoints into a nested
          // object { title, description, painPoints: [...], image }. Flatten it back
          // to a plain array so DynamicFormGenerator renders the array correctly.
          if (componentType === "PayrollPainPointsSection") {
            const pp = normalizedJson.painPoints;
            if (pp && !Array.isArray(pp)) {
              normalizedJson = {
                ...normalizedJson,
                painPoints: Array.isArray(pp.painPoints) ? pp.painPoints : [],
              };
            }
            // Also handle legacy `items` key → painPoints migration
            if (
              (!normalizedJson.painPoints || normalizedJson.painPoints.length === 0) &&
              Array.isArray(normalizedJson.items) && normalizedJson.items.length > 0
            ) {
              normalizedJson = {
                ...normalizedJson,
                painPoints: normalizedJson.items.map((item) => ({
                  title: item.title || item.text || "",
                  description: item.description || "",
                  icon: item.icon || "",
                })),
              };
            }
          }
        } catch (e) {
          // fallback to raw parsed data
        }
      }

      // If the normalizer returned empty fields, seed from schema defaultData
      if (schema?.defaultData) {
        if (!normalizedJson.items || normalizedJson.items.length === 0) {
          normalizedJson = { ...normalizedJson, items: schema.defaultData.items || [] };
        }
        if (!normalizedJson.image) {
          normalizedJson = { ...normalizedJson, image: schema.defaultData.image || "" };
        }
        if (!normalizedJson.title) {
          normalizedJson = { ...normalizedJson, title: schema.defaultData.title || "" };
        }
        if (!normalizedJson.description1 && schema.defaultData.description1) {
          normalizedJson = { ...normalizedJson, description1: schema.defaultData.description1 };
        }
        if (!normalizedJson.description2 && schema.defaultData.description2) {
          normalizedJson = { ...normalizedJson, description2: schema.defaultData.description2 };
        }
        // Seed any other array fields defined in defaultData that are missing or empty
        Object.entries(schema.defaultData).forEach(([key, val]) => {
          if (
            Array.isArray(val) &&
            (!normalizedJson[key] || normalizedJson[key].length === 0)
          ) {
            normalizedJson = { ...normalizedJson, [key]: val };
          }
        });
      }

      setFormData({
        componentType,
        componentName: component.componentName || "",
        contentJson: JSON.stringify(normalizedJson, null, 2),
        isVisible: component.isVisible ?? 1,
        theme: component.theme ?? 1,
      });
      setJsonData(normalizedJson);
      setErrors({});

      // Check if schema exists for this component type
      setUseSchemaMode(!!schema);
    }
  }, [component]);

  // Handle changes from DynamicFormGenerator (schema-based)
  const handleSchemaDataChange = (newData) => {
    setJsonData(newData);
    setFormData((prev) => ({
      ...prev,
      contentJson: JSON.stringify(newData, null, 2),
    }));
  };

  // Handle changes from legacy DynamicFormField
  const handleJsonFieldChange = (path, value) => {
    const updatedJsonData = updateJsonFromFormFields(jsonData, path, value);
    setJsonData(updatedJsonData);
    setFormData((prev) => ({
      ...prev,
      contentJson: JSON.stringify(updatedJsonData, null, 2),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.componentType || formData.componentType.length > 50) {
      newErrors.componentType = "Component type must be 1-50 characters";
    }

    if (formData.componentName && formData.componentName.length > 100) {
      newErrors.componentName = "Component name must not exceed 100 characters";
    }

    if (!formData.contentJson || formData.contentJson.trim().length === 0) {
      newErrors.contentJson = "Content JSON is required";
    } else {
      try {
        JSON.parse(formData.contentJson);
      } catch {
        newErrors.contentJson = "Invalid JSON format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!component) return null;

  const dynamicFields = generateFormFieldsFromJson(
    jsonData,
    handleJsonFieldChange
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Component" size="lg">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Basic Component Info */}
        <div className="space-y-3">
          <h3 className="text-md font-semibold text-white flex items-center">
            <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-400" />
            Component Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Component Type *
              </label>
              <Input
                type="text"
                value={formData.componentType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    componentType: e.target.value,
                  }))
                }
                placeholder="Component Type"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                disabled
              />
              {currentSchema && (
                <p className="text-xs text-green-400">
                  ✓ Schema found: {currentSchema.displayName}
                </p>
              )}
              {!currentSchema && formData.componentType && (
                <p className="text-xs text-yellow-400">
                  ⚠ No schema found, using auto-generated fields
                </p>
              )}
              {errors.componentType && (
                <p className="text-sm text-red-400">{errors.componentType}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Component Name
              </label>
              <Input
                type="text"
                value={formData.componentName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    componentName: e.target.value,
                  }))
                }
                placeholder="Enter component name"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                maxLength={100}
              />
              {errors.componentName && (
                <p className="text-sm text-red-400">{errors.componentName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Content Fields */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-white flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2 text-green-400" />
              Content Fields
            </h3>
            {currentSchema && (
              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-400">Use Schema</label>
                <input
                  type="checkbox"
                  checked={useSchemaMode}
                  onChange={(e) => setUseSchemaMode(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
              </div>
            )}
          </div>

          {/* Schema-based Form */}
          {currentSchema && useSchemaMode ? (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <DynamicFormGenerator
                schema={currentSchema.schema}
                data={jsonData}
                onChange={handleSchemaDataChange}
                componentType={formData.componentType}
                className="edit-modal-form"
              />
            </div>
          ) : (
            /* Legacy auto-generated fields */
            <>
              <div className="flex items-center space-x-2 mb-2">
                <button
                  onClick={() => {
                    const fieldName = prompt("Enter field name:");
                    if (fieldName && fieldName.trim()) {
                      const newJsonData = { ...jsonData, [fieldName.trim()]: "" };
                      setJsonData(newJsonData);
                      setFormData((prev) => ({
                        ...prev,
                        contentJson: JSON.stringify(newJsonData, null, 2),
                      }));
                    }
                  }}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs flex items-center space-x-1"
                >
                  <PlusIcon className="h-3 w-3" />
                  <span>Add Field</span>
                </button>
              </div>

              {dynamicFields.length > 0 ? (
                <div className="space-y-4">
                  {dynamicFields.map((field) => (
                    <div key={field.key} className="relative">
                      <DynamicFormField
                        field={field}
                        onChange={handleJsonFieldChange}
                      />
                      <button
                        onClick={() => {
                          const newJsonData = { ...jsonData };
                          delete newJsonData[field.key];
                          setJsonData(newJsonData);
                          setFormData((prev) => ({
                            ...prev,
                            contentJson: JSON.stringify(newJsonData, null, 2),
                          }));
                        }}
                        className="absolute top-0 right-0 p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                        title="Remove field"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">
                    No Content Fields
                  </h4>
                  <p className="text-gray-300 mb-4">
                    This component doesn't have any content fields yet.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        const newJsonData = { title: "", content: "" };
                        setJsonData(newJsonData);
                        setFormData((prev) => ({
                          ...prev,
                          contentJson: JSON.stringify(newJsonData, null, 2),
                        }));
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                    >
                      Add Basic Fields
                    </button>
                    <button
                      onClick={() => {
                        const newJsonData = {
                          title: "",
                          subtitle: "",
                          description: "",
                          imageUrl: "",
                          buttonText: "",
                          buttonUrl: "",
                        };
                        setJsonData(newJsonData);
                        setFormData((prev) => ({
                          ...prev,
                          contentJson: JSON.stringify(newJsonData, null, 2),
                        }));
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                    >
                      Add Hero Fields
                    </button>
                    <button
                      onClick={() => {
                        const newJsonData = {
                          title: "",
                          questions: [{ question: "", answer: "" }],
                        };
                        setJsonData(newJsonData);
                        setFormData((prev) => ({
                          ...prev,
                          contentJson: JSON.stringify(newJsonData, null, 2),
                        }));
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
                    >
                      Add FAQ Fields
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Raw JSON View */}
        <div className="space-y-2">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-300 hover:text-white flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Raw JSON View
              <span className="ml-2 text-xs text-gray-400 group-open:rotate-90 transition-transform">
                ▶
              </span>
            </summary>
            <div className="mt-2">
              <textarea
                value={formData.contentJson}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    contentJson: e.target.value,
                  }));
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setJsonData(parsed);
                  } catch {
                    // Invalid JSON, don't update jsonData
                  }
                }}
                rows={8}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                placeholder='{"title": "Example", "content": "..."}'
              />
              {errors.contentJson && (
                <p className="text-sm text-red-400 mt-2">
                  {errors.contentJson}
                </p>
              )}
            </div>
          </details>
        </div>

        {/* Component Configuration Controls */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <h3 className="text-md font-semibold text-white flex items-center">
            <Cog6ToothIcon className="h-4 w-4 mr-2 text-purple-400" />
            Component Configuration
          </h3>

          <div className="bg-white/5 rounded-xl p-6 space-y-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Visibility Toggle */}
              <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <FancyToggle
                  label="Component Visible"
                  checked={
                    formData.isVisible === true || formData.isVisible === 1
                  }
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      isVisible: val,
                    }))
                  }
                  gradient="green"
                  size="normal"
                  description="Control if this component appears on the live page"
                  className="w-full"
                />
                <div className="mt-2 text-xs text-gray-300 bg-white/5 rounded p-2">
                  <span className="font-medium">Preview: </span>
                  {formData.isVisible === true || formData.isVisible === 1 ? (
                    <span className="text-green-400">
                      ✓ Component will be shown
                    </span>
                  ) : (
                    <span className="text-red-400">
                      ✗ Component will be hidden
                    </span>
                  )}
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <FancyToggle
                  label="Light Theme"
                  checked={formData.theme === 1}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      theme: val ? 1 : 2,
                    }))
                  }
                  gradient="blue"
                  size="normal"
                  description="Switch between light and dark theme styling"
                  className="w-full"
                />
                <div className="mt-2 text-xs text-gray-300 bg-white/5 rounded p-2">
                  <span className="font-medium">Preview: </span>
                  {formData.theme === 1 ? (
                    <span className="text-blue-400">☀ Light theme active</span>
                  ) : (
                    <span className="text-gray-400">🌙 Dark theme active</span>
                  )}
                </div>
              </div>
            </div>

            {/* Live Preview Indicator */}
            <div className="flex items-center justify-center space-x-2 py-3 border-t border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">
                Changes apply instantly in preview
              </span>
            </div>
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm px-3 py-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1 text-sm px-3 py-1"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-3 w-3 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-3 w-3" />
              <span>Update Component</span>
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditComponentModal;
