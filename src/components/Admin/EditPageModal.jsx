import React, { useState, useEffect } from "react";
import {
  PencilIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import Modal, { ModalFooter } from "../UI/Modal";
import Button from "../UI/Button";
import Input from "../UI/Input";
import PageComponentsEditor from "./PageComponentsEditor";
import pagesAPI from "../../lib/pagesAPI";

const EditPageModal = ({ isOpen, onClose, page, onSave, showToast }) => {
  const [currentStep, setCurrentStep] = useState("page"); // "page" or "components"
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    categoryId: 1,
    isHomepage: false,
    isPublished: false,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // Add a key to force remount PageComponentsEditor when components change
  const [componentsKey, setComponentsKey] = useState(0);

  // Handler to be passed to PageComponentsEditor to force refresh
  const handleComponentsSave = async () => {
    setComponentsKey((k) => k + 1); // force remount
    if (onSave) await onSave();
  };

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await pagesAPI.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error loading categories:", error);
        showToast("Error loading categories", "error");
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, showToast]);

  // Initialize form data when page changes
  useEffect(() => {
    if (page) {
      setFormData({
        name: page.name || page.title || "",
        slug: page.slug || "",
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        categoryId: page.categoryId || 1,
        isHomepage: page.isHomepage || false,
        isPublished: page.isPublished || false,
      });
      setErrors({});
      setCurrentStep("page"); // Reset to page step when opening modal
    }
  }, [page]);

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Page name must be at least 2 characters long";
    }
    if (formData.name && formData.name.length > 100) {
      newErrors.name = "Page name must not exceed 100 characters";
    }

    // Optional field validation
    if (formData.slug && formData.slug.length > 200) {
      newErrors.slug = "Page slug must not exceed 200 characters";
    }
    if (formData.metaTitle && formData.metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title must not exceed 60 characters";
    }
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription =
        "Meta description must not exceed 160 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast("Please fix the validation errors", "error");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: formData.name,
        slug: formData.slug,
        categoryId: formData.categoryId,
        isHomepage: formData.isHomepage,
        isPublished: formData.isPublished,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        description: formData.description,
      };
      await pagesAPI.updatePage(page.id, payload);
      showToast(`Page "${formData.name}" updated successfully`, "success");
      await onSave(); // Refresh the pages list
      onClose();
    } catch (err) {
      console.error("Error updating page:", err);
      showToast("Error updating page: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (!validateForm()) {
      showToast("Please fix the validation errors before proceeding", "error");
      return;
    }

    try {
      setLoading(true);
      await pagesAPI.updatePage(page.id, formData);
      showToast(`Page "${formData.name}" updated successfully`, "success");
      setCurrentStep("components");
    } catch (err) {
      console.error("Error updating page:", err);
      showToast("Error updating page: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPage = () => {
    setCurrentStep("page");
  };

  if (!page) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
      {/* Modal Header */}
      <div className="relative bg-white/10 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow">
              {currentStep === "page" ? (
                <PencilIcon className="h-5 w-5 text-white" />
              ) : (
                <CogIcon className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {currentStep === "page" ? "Edit Page" : "Edit Page Components"}
              </h2>
              <p className="text-xs text-gray-300">
                {currentStep === "page"
                  ? "Update page information and settings"
                  : `Manage components for "${formData.name}"`}
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center space-x-1">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentStep === "page"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              1
            </div>
            <ArrowRightIcon className="h-3 w-3 text-gray-400" />
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentStep === "components"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              2
            </div>
          </div>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-4 bg-white/5 max-h-[70vh] overflow-y-auto">
        {currentStep === "page" ? (
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-white flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-400" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Page Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Page Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter page name"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    maxLength={100}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-400 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {formData.name.length}/100 characters
                  </p>
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Slug
                  </label>
                  <Input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="page-slug"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                      errors.slug ? "border-red-500" : ""
                    }`}
                    maxLength={200}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-400 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.slug}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {formData.slug.length}/200 characters
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    handleInputChange("categoryId", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-gray-800 text-white"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEO Information */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-white flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2 text-green-400" />
                SEO Information
              </h3>

              <div className="space-y-3">
                {/* Meta Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Meta Title
                  </label>
                  <Input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) =>
                      handleInputChange("metaTitle", e.target.value)
                    }
                    placeholder="SEO title for search engines"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                      errors.metaTitle ? "border-red-500" : ""
                    }`}
                    maxLength={70}
                  />
                  {errors.metaTitle && (
                    <p className="text-sm text-red-400 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.metaTitle}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {formData.metaTitle.length}/70 characters
                  </p>
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) =>
                      handleInputChange("metaDescription", e.target.value)
                    }
                    placeholder="SEO description for search engines"
                    rows={3}
                    className={`w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.metaDescription ? "border-red-500" : ""
                    }`}
                    maxLength={200}
                  />
                  {errors.metaDescription && (
                    <p className="text-sm text-red-400 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.metaDescription}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {formData.metaDescription.length}/200 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Page Settings */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-white flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2 text-purple-400" />
                Page Settings
              </h3>

              <div className="space-y-3">
                {/* Published Status */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      handleInputChange("isPublished", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor="isPublished"
                    className="text-sm font-medium text-white"
                  >
                    Published
                  </label>
                  <span className="text-xs text-gray-400">
                    Make this page visible to visitors
                  </span>
                </div>

                {/* Homepage Status */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isHomepage"
                    checked={formData.isHomepage}
                    onChange={(e) =>
                      handleInputChange("isHomepage", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor="isHomepage"
                    className="text-sm font-medium text-white"
                  >
                    Set as main page of this category
                  </label>
                  <span className="text-xs text-gray-400">
                    Make this the homepage within its category
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  This will make the page the main (homepage) within its
                  category.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <PageComponentsEditor
            key={componentsKey}
            pageId={page.id}
            pageName={formData.name}
            pageSlug={page.slug || formData.slug}
            onClose={handleBackToPage}
            onSave={handleComponentsSave}
            showToast={showToast}
          />
        )}
      </div>

      {/* Modal Footer */}
      <div className="bg-white/10 border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300">
              {currentStep === "page"
                ? "Form-based editing with validation"
                : "Component management interface"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {currentStep === "page" ? (
              <>
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
                  className="group bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1 text-sm px-3 py-1"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-3 w-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-3 w-3 group-hover:scale-110 transition-transform duration-200" />
                      <span>Save & Close</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="group bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1 text-sm px-3 py-1"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-3 w-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightIcon className="h-3 w-3 group-hover:scale-110 transition-transform duration-200" />
                      <span>Next: Components</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleBackToPage}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm px-3 py-1"
                >
                  Back
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1 text-sm px-3 py-1"
                >
                  <CheckCircleIcon className="h-3 w-3" />
                  <span>Done</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditPageModal;
