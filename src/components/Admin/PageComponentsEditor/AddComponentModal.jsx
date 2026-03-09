import React, { useState, useMemo } from "react";

import {

  DocumentTextIcon,

  CheckCircleIcon,

  ArrowPathIcon,

  MagnifyingGlassIcon,

  Cog6ToothIcon,

} from "@heroicons/react/24/outline";

import Modal, { ModalFooter } from "../../UI/Modal";

import Button from "../../UI/Button";

import Input from "../../UI/Input";

import DynamicFormField from "../../UI/DynamicFormField";

import Card, { CardContent } from "../../UI/Card";

import {

  generateFormFieldsFromJson,

  updateJsonFromFormFields,

} from "../../../utils/jsonFormUtils";

import { getBasicJsonForComponent } from "../../../utils/componentJsonDefaults";

import { useComponentCategories } from "../../../hooks/useComponentCategories";

import { useFilteredComponents } from "../../../hooks/useFilteredComponents";

import SolutionsGalleryConfig from "../EnhancedPageBuilder/SectionsStep/SolutionsGalleryConfig";



const AddComponentModal = ({

  isOpen,

  onClose,

  onSave,

  loading,

  availableComponents,

}) => {

  const [selectedComponent, setSelectedComponent] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({

    componentType: "",

    componentName: "",

    contentJson: JSON.stringify({}),

    isVisible: 1,

    theme: 1,

  });

  const [jsonData, setJsonData] = useState({});

  const [errors, setErrors] = useState({});



  const categories = useComponentCategories(availableComponents, searchTerm);

  const filteredComponents = useFilteredComponents(

    availableComponents,

    selectedCategory,

    searchTerm

  );



  const handleJsonFieldChange = (path, value) => {

    const updatedJsonData = updateJsonFromFormFields(jsonData, path, value);

    setJsonData(updatedJsonData);

    setFormData((prev) => ({

      ...prev,

      contentJson: JSON.stringify(updatedJsonData, null, 2),

    }));

  };



  const handleComponentSelect = (component) => {

    setSelectedComponent(component);

    setFormData((prev) => ({

      ...prev,

      componentType: component.componentType,

      componentName: component.name,

      isVisible: 1,

      theme: 1,

    }));



    const basicJson = getBasicJsonForComponent(component.componentType);

    setJsonData(basicJson);

    setFormData((prev) => ({

      ...prev,

      contentJson: JSON.stringify(basicJson, null, 2),

    }));

  };



  const validateForm = () => {

    const newErrors = {};



    if (!selectedComponent) {

      newErrors.component = "Please select a component type";

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

      setSelectedComponent(null);

      setFormData({

        componentType: "",

        componentName: "",

        contentJson: JSON.stringify({}),

      });

      setJsonData({});

      setErrors({});

      setSearchTerm("");

      setSelectedCategory("all");

    }

  };



  const dynamicFields = generateFormFieldsFromJson(

    jsonData,

    handleJsonFieldChange

  );



  return (

    <Modal isOpen={isOpen} onClose={onClose} title="Add Component" size="xl">

      <div className="flex h-[80vh]">

        {/* Left Panel - Component Selection */}

        <div className="w-1/2 border-r border-white/20 p-4 overflow-y-auto">

          <div className="space-y-4">

            <h3 className="text-lg font-semibold text-white flex items-center">

              <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-400" />

              Select Component Type

            </h3>



            {/* Search */}

            <div className="relative">

              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input

                type="text"

                placeholder="Search components..."

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

                className="w-full pl-9 pr-3 py-2 text-sm border border-white/20 bg-white/5 text-white placeholder:text-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"

              />

            </div>



            {/* Category Filter */}

            <div className="flex flex-wrap gap-2">

              {categories.map((category) => (

                <button

                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}

                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${

                    selectedCategory === category.id

                      ? "bg-blue-600 text-white border-blue-500"

                      : "bg-white/10 text-gray-300 border-white/20 hover:bg-white/20"

                  }`}

                >

                  <span className="mr-1">{category.icon}</span>

                  {category.name} ({category.count})

                </button>

              ))}

            </div>



            {/* Component Grid */}

            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">

              {filteredComponents.map((component) => (

                <Card

                  key={component.id}

                  className={`cursor-pointer transition-all duration-200 border ${

                    selectedComponent?.id === component.id

                      ? "bg-blue-600/20 border-blue-500 shadow-lg"

                      : "bg-white/10 border-white/20 hover:bg-white/15"

                  }`}

                  onClick={() => handleComponentSelect(component)}

                >

                  <CardContent className="p-3">

                    <div className="flex items-center space-x-3">

                      <div className="text-2xl">{component.icon}</div>

                      <div className="flex-1 min-w-0">

                        <h4 className="text-sm font-semibold text-white truncate">

                          {component.name}

                        </h4>

                        <p className="text-xs text-gray-300 truncate">

                          {component.description}

                        </p>

                        <div className="flex items-center space-x-2 mt-1">

                          <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded">

                            {component.category}

                          </span>

                          <span className="text-xs text-gray-400 font-mono">

                            {component.componentType}

                          </span>

                        </div>

                      </div>

                    </div>

                  </CardContent>

                </Card>

              ))}



              {filteredComponents.length === 0 && (

                <div className="text-center py-8 text-gray-400">

                  <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />

                  <p>No components found matching your criteria</p>

                </div>

              )}

            </div>

          </div>

        </div>



        {/* Right Panel - Component Configuration */}

        <div className="w-1/2 p-4 overflow-y-auto">

          <div className="space-y-4">

            <h3 className="text-lg font-semibold text-white flex items-center">

              <DocumentTextIcon className="h-5 w-5 mr-2 text-green-400" />

              Configure Component

            </h3>



            {selectedComponent ? (

              <>

                {/* Selected Component Info */}

                <div className="bg-white/10 border border-white/20 rounded-lg p-3">

                  <div className="flex items-center space-x-3">

                    <div className="text-2xl">{selectedComponent.icon}</div>

                    <div>

                      <h4 className="text-sm font-semibold text-white">

                        {selectedComponent.name}

                      </h4>

                      <p className="text-xs text-gray-300">

                        {selectedComponent.description}

                      </p>

                    </div>

                  </div>

                </div>



                {/* Component Name */}

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

                    <p className="text-sm text-red-400">

                      {errors.componentName}

                    </p>

                  )}

                </div>



                {/* Dynamic Content Fields */}

                <div className="space-y-3">

                  <h4 className="text-md font-semibold text-white">

                    Content Fields

                  </h4>

                  {formData.componentType === "SolutionsGallery" ? (
                    <SolutionsGalleryConfig
                      component={{ contentJson: formData.contentJson }}
                      index={0}
                      onUpdate={(_idx, _field, value) => {
                        setFormData((prev) => ({ ...prev, contentJson: value }));
                        try { setJsonData(JSON.parse(value)); } catch {}
                      }}
                    />
                  ) : dynamicFields.length > 0 ? (

                    <div className="space-y-4">

                      {dynamicFields.map((field) => (

                        <DynamicFormField

                          key={field.key}

                          field={field}

                          onChange={handleJsonFieldChange}

                        />

                      ))}

                    </div>

                  ) : (

                    <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">

                      <DocumentTextIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />

                      <p className="text-gray-300 text-sm">

                        No content fields configured

                      </p>

                    </div>

                  )}

                </div>



                {/* Raw JSON View */}

                <div className="space-y-2">

                  <details className="group">

                    <summary className="cursor-pointer text-sm font-medium text-gray-300 hover:text-white flex items-center">

                      <DocumentTextIcon className="h-4 w-4 mr-2" />

                      Raw JSON View

                      <span className="ml-2 text-xs text-gray-400 group-open:rotate-90 transition-transform">

                        

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

                        rows={6}

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



                  {/* Component Configuration Controls */}

                  {selectedComponent && (

                    <div className="space-y-3 border-t border-white/10 pt-4 mt-4">

                      <h3 className="text-md font-semibold text-white flex items-center">

                        <Cog6ToothIcon className="h-4 w-4 mr-2 text-purple-400" />

                        Component Configuration

                      </h3>



                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col gap-3 mt-4">

                          <label className="flex items-center gap-2">

                            <input

                              type="checkbox"

                              checked={formData.isVisible === true}

                              onChange={(e) =>

                                setFormData((prev) => ({

                                  ...prev,

                                  isVisible: e.target.checked,

                                }))

                              }

                            />

                            <span>Visible in page</span>

                          </label>

                          <label className="flex items-center gap-2">

                            <input

                              type="checkbox"

                              checked={formData.theme === 1}

                              onChange={(e) =>

                                setFormData((prev) => ({

                                  ...prev,

                                  theme: e.target.checked ? 1 : 2,

                                }))

                              }

                            />

                            <span>Use Light Theme</span>

                          </label>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              </>

            ) : (

              <div className="text-center py-16 text-gray-400">

                <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />

                <h4 className="text-lg font-medium text-white mb-2">

                  Select a Component

                </h4>

                <p>

                  Choose a component type from the left panel to configure it

                </p>

              </div>

            )}

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

          disabled={loading || !selectedComponent}

          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1 text-sm px-3 py-1"

        >

          {loading ? (

            <>

              <ArrowPathIcon className="h-3 w-3 animate-spin" />

              <span>Adding...</span>

            </>

          ) : (

            <>

              <CheckCircleIcon className="h-3 w-3" />

              <span>Add Component</span>

            </>

          )}

        </Button>

      </ModalFooter>

    </Modal>

  );

};



export default AddComponentModal;




