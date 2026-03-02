import { useState } from "react";
import Button from "../../../UI/Button";
import DynamicFormGenerator from "../../../UI/DynamicFormGenerator";

// Safely parse contentJson which may arrive as a string or already-parsed object
const safeParseContentJson = (contentJson, fallback = {}) => {
  if (!contentJson) return fallback;
  if (typeof contentJson === "object") return contentJson;
  try {
    return JSON.parse(contentJson);
  } catch (e) {
    console.error("[ComponentFormRenderer] Failed to parse contentJson:", e);
    return fallback;
  }
};

/**
 * Migrate legacy data shapes to match the current schema field names.
 * This is needed when existing DB records were saved with old key names.
 */
const migrateComponentData = (data, componentType) => {
  if (!data || typeof data !== "object") return data;

  // PayrollPainPointsSection: legacy used `items` [{text, icon}] → now `painPoints` [{title, description, icon}]
  if (componentType === "PayrollPainPointsSection") {
    const hasPainPoints = Array.isArray(data.painPoints) && data.painPoints.length > 0;
    const hasLegacyItems = Array.isArray(data.items) && data.items.length > 0;
    if (!hasPainPoints && hasLegacyItems) {
      return {
        ...data,
        painPoints: data.items.map((item) => ({
          title: item.title || item.text || "",
          description: item.description || "",
          icon: item.icon || "",
        })),
      };
    }
  }

  return data;
};

const ComponentFormRenderer = ({
  component,
  index,
  componentSchemas,
  getAboutComponentSchema,
  getGeneralComponentSchema,
  getSupportComponentSchema,
  generateDynamicSchema,
  validateAndFormatJSON,
  onUpdate,
}) => {
  const [viewMode, setViewMode] = useState(component.viewMode || "form");

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    onUpdate(index, "viewMode", mode);
  };

  const componentSchema =
    getAboutComponentSchema(component.componentType) ||
    getGeneralComponentSchema(component.componentType) ||
    getSupportComponentSchema(component.componentType) ||
    (componentSchemas[component.componentType]?.schema
      ? componentSchemas[component.componentType]
      : null);

  if (viewMode === "json") {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-300">
            Content Configuration
          </label>
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleViewModeChange("form")}
              className="px-3 py-1 text-xs rounded-md transition-all text-gray-400 hover:text-white"
            >
              Form View
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange("json")}
              className="px-3 py-1 text-xs rounded-md transition-all bg-blue-500 text-white"
            >
              JSON View
            </button>
          </div>
        </div>
        <textarea
          rows={6}
          value={
            typeof component.contentJson === "string"
              ? component.contentJson
              : JSON.stringify(component.contentJson ?? {}, null, 2)
          }
          onChange={(e) => onUpdate(index, "contentJson", e.target.value)}
          placeholder='{"title": "Example Title", "description": "Example Description"}'
          className="block w-full rounded-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:border-blue-400 focus:ring-blue-400/20 shadow-sm font-mono text-sm resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            Enter valid JSON data for this component
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const formatted = validateAndFormatJSON(
                typeof component.contentJson === "string"
                  ? component.contentJson
                  : JSON.stringify(component.contentJson ?? {}),
              );
              onUpdate(index, "contentJson", formatted);
            }}
            className="bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-200 text-xs px-2 py-1"
          >
            Format JSON
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-300">
          Content Configuration
        </label>
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            type="button"
            onClick={() => handleViewModeChange("form")}
            className="px-3 py-1 text-xs rounded-md transition-all bg-blue-500 text-white"
          >
            Form View
          </button>
          <button
            type="button"
            onClick={() => handleViewModeChange("json")}
            className="px-3 py-1 text-xs rounded-md transition-all text-gray-400 hover:text-white"
          >
            JSON View
          </button>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4">
        {componentSchema ? (
          <DynamicFormGenerator
            schema={componentSchema.schema}
            data={migrateComponentData(
              safeParseContentJson(
                component.contentJson,
                componentSchema.defaultData || {}
              ),
              component.componentType
            )}
            onChange={(formData) => {
              onUpdate(index, "contentJson", JSON.stringify(formData, null, 2));
            }}
            onFieldChange={(field, value) => {
              const currentData = migrateComponentData(
                safeParseContentJson(component.contentJson),
                component.componentType
              );

              // Handle nested paths like "slides.0.image" or "ctaButton.text"
              const pathParts = field.split(".");
              if (pathParts.length === 1) {
                // Simple field
                const updated = { ...currentData, [field]: value };
                onUpdate(
                  index,
                  "contentJson",
                  JSON.stringify(updated, null, 2),
                );
              } else {
                // Nested path - update deep object
                const updated = JSON.parse(JSON.stringify(currentData)); // Deep clone
                let current = updated;
                for (let i = 0; i < pathParts.length - 1; i++) {
                  const key = pathParts[i];
                  if (!current[key]) {
                    current[key] = isNaN(pathParts[i + 1]) ? {} : [];
                  }
                  current = current[key];
                }
                current[pathParts[pathParts.length - 1]] = value;
                onUpdate(
                  index,
                  "contentJson",
                  JSON.stringify(updated, null, 2),
                );
              }
            }}
            componentType={component.componentType}
          />
        ) : (
          <DynamicFormGenerator
            schema={
              generateDynamicSchema(
                safeParseContentJson(component.contentJson),
                component.componentType,
              ).schema
            }
            data={safeParseContentJson(component.contentJson)}
            onChange={(formData) => {
              onUpdate(index, "contentJson", JSON.stringify(formData, null, 2));
            }}
            componentType={component.componentType}
            className="text-white [&_label]:text-gray-300"
          />
        )}
      </div>
    </div>
  );
};

export default ComponentFormRenderer;
