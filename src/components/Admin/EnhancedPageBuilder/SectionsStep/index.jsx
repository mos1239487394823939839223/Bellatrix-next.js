import { useState } from "react";
import { LivePreview } from "../../../UI/LivePreview";
import Card from "../../../UI/Card";
import { useComponentCategories } from "../../../../hooks/useComponentCategories";
import { useFilteredComponents } from "../../../../hooks/useFilteredComponents";
import AvailableComponentsSection from "./AvailableComponentsSection";
import ComponentConfigurationSection from "./ComponentConfigurationSection";
import ComponentInputModal from "./ComponentInputModal";
import { getAboutComponentSchema } from "../../../../sections/schemas/aboutComponentSchemas";
import { getGeneralComponentSchema } from "../../../../sections/schemas/generalComponentSchemas";
import { getSupportComponentSchema } from "../../../../sections/schemas/supportComponentSchemas";
import { generateDynamicSchema } from "../../../../utils/dynamicSchemaGenerator";

const SectionsStep = ({
  pageData,
  availableComponents,
  onAddComponent,
  onUpdateComponent,
  onRemoveComponent,
  onReorderComponents,
  componentSchemas = {},
  showNewInputModal,
  setShowNewInputModal,
  currentComponent,
  useNewInputSystemState,
  setUseNewInputSystemState,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useComponentCategories(availableComponents, searchTerm);
  const filteredComponents = useFilteredComponents(
    availableComponents,
    selectedCategory,
    searchTerm,
  );

  const handleModalInputChange = (field, value, componentIndex) => {
    const currentData = pageData.components[componentIndex];
    let updatedContent = {};
    try {
      updatedContent = currentData.contentJson
        ? JSON.parse(currentData.contentJson)
        : {};
    } catch (error) {
      console.warn("Failed to parse contentJson:", error.message);
      updatedContent = {};
    }
    updatedContent[field] = value;
    const newContentJson = JSON.stringify(updatedContent, null, 2);
    onUpdateComponent(componentIndex, "contentJson", newContentJson);
  };

  const renderDynamicInputs = (
    data,
    fieldPath = "",
    level = 0,
    componentIndex,
  ) => {
    if (!data || typeof data !== "object") {
      return <div>No configuration available for this component</div>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="border border-gray-200 p-3 rounded">
            <label className="block text-sm font-medium text-white mb-1">
              {key}
            </label>
            {typeof value === "string" && (
              <input
                type="text"
                defaultValue={value}
                onChange={(e) =>
                  handleModalInputChange(key, e.target.value, componentIndex)
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            )}
            {typeof value === "boolean" && (
              <input
                type="checkbox"
                defaultChecked={value}
                onChange={(e) =>
                  handleModalInputChange(key, e.target.checked, componentIndex)
                }
                className="h-4 w-4 text-blue-600"
              />
            )}
            {Array.isArray(value) && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Array with {value.length} items
                </div>
                <button className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
                  Add Item
                </button>
              </div>
            )}
            {typeof value === "object" &&
              value !== null &&
              !Array.isArray(value) && (
                <div className="pl-4 border-l-2 border-gray-200">
                  {renderDynamicInputs(
                    value,
                    `${fieldPath}.${key}`,
                    level + 1,
                    componentIndex,
                  )}
                </div>
              )}
          </div>
        ))}
      </div>
    );
  };

  const validateAndFormatJSON = (jsonString) => {
    try {
      if (!jsonString.trim()) return "{}";
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  return (
    <div className="space-y-6">
      <AvailableComponentsSection
        availableComponents={availableComponents}
        filteredComponents={filteredComponents}
        categories={categories}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchTerm}
        onAddComponent={onAddComponent}
      />

      <ComponentConfigurationSection
        components={pageData.components}
        availableComponents={availableComponents}
        onUpdateComponent={onUpdateComponent}
        onRemoveComponent={onRemoveComponent}
        onReorderComponents={onReorderComponents}
        componentSchemas={componentSchemas}
        getAboutComponentSchema={getAboutComponentSchema}
        getGeneralComponentSchema={getGeneralComponentSchema}
        getSupportComponentSchema={getSupportComponentSchema}
        generateDynamicSchema={generateDynamicSchema}
        validateAndFormatJSON={validateAndFormatJSON}
      />

      <LivePreview
        components={pageData.components.filter(
          (comp) => comp.isVisible !== false && comp.isVisible !== 0,
        )}
        previewMode="desktop"
        showDebugInfo={false}
        className="mt-6"
        key={`preview-${pageData.components
          .map(
            (c) =>
              `${c.componentType}-${c.contentJson?.length || 0}-${c.contentJson?.slice(-50) || ""}`,
          )
          .join("|")}`}
      />

      <ComponentInputModal
        isOpen={showNewInputModal}
        onClose={() => setShowNewInputModal(false)}
        component={currentComponent}
        useNewInputSystem={useNewInputSystemState}
        onToggleInputSystem={setUseNewInputSystemState}
        onUpdate={onUpdateComponent}
        renderDynamicInputs={renderDynamicInputs}
      />
    </div>
  );
};

export default SectionsStep;
