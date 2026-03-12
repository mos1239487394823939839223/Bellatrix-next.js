'use client'
import React, { useState, useEffect, useRef, useCallback } from "react";

import { DndContext } from "@dnd-kit/core";

import { SortableContext } from "@dnd-kit/sortable";

import { DraggableComponent } from "./DraggableComponent";

import { useRouter, useParams } from 'next/navigation';

import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  Bars3BottomLeftIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import Button from "../UI/Button";

import { Input } from "../UI/Input";

import Card, { CardContent, CardHeader, CardTitle } from "../UI/Card";

import Modal, { ModalFooter } from "../UI/Modal";

import FancyToggle, { ComponentToggles } from "../UI/FancyToggle";

import { validateVariant } from "../../utils/variantSystem";

import Toast from "../UI/Toast";

import SectionDataEditor from "./SectionDataEditor";

import PagePreview from "./PagePreview";

import MediaInputDetector from "../UI/MediaInputDetector";

import DynamicContentForm from "../UI/DynamicContentForm";

import DynamicFormGenerator from "../UI/DynamicFormGenerator";

import { LivePreview, SplitScreenPreview } from "../UI/LivePreview";

import { getAboutComponentSchema } from "../../data/aboutComponentSchemas";

import { getGeneralComponentSchema } from "../../data/generalComponentSchemas";

import { getSupportComponentSchema } from "../../data/supportComponentSchemas";

import {} from "../../utils/dynamicSchemaGenerator";

import pagesAPI from "../../lib/pagesAPI";

import { updateMediaVersion } from "../../utils/cacheBusting";

import {
  CategorySelector,
  PageDetailsStep,
  ReviewStep,
  SectionsStep,
} from "./EnhancedPageBuilder/index";

const EnhancedPageBuilder = () => {
  const router = useRouter();

  // const location = useLocation();

  const { pageId } = useParams();

  const [currentStep, setCurrentStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);

  const [toast, setToast] = useState(null);

  const [useNewInputSystem, setUseNewInputSystem] = useState(true); // Toggle for new input system

  // Ref to prevent multiple simultaneous API calls

  const isSavingRef = useRef(false);

  // Page data - moved up to fix initialization order

  const [pageData, setPageData] = useState({
    id: null, // Add page ID to state

    name: "",

    categoryId: null,

    slug: "",

    metaTitle: "",

    metaDescription: "",

    isHomepage: false,

    isPublished: false,

    components: [],
  });

  // Slug validation state

  const [slugChecking, setSlugChecking] = useState(false);

  const [slugAvailable, setSlugAvailable] = useState(true);

  const [slugError, setSlugError] = useState("");

  // Debounced auto-save system

  const autoSaveTimeoutRef = useRef(null);

  // Debounced auto-save function - now accepts component info directly to avoid stale closure
  const debouncedAutoSave = useCallback(
    (componentInfo, componentData) => {
      // Clear any existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        if (!componentInfo?.id || !pageData.id) {
          console.log(
            " [AUTO-SAVE] Skipping auto-save - component or page not saved yet",
          );
          return;
        }

        const updateData = {
          id: componentInfo.id,
          pageId: pageData.id,
          componentType: componentInfo.componentType,
          componentName: componentInfo.componentName || "",
          contentJson: JSON.stringify(componentData, null, 2),
          orderIndex:
            componentInfo.orderIndex !== undefined
              ? componentInfo.orderIndex
              : 0,
          isVisible: Boolean(
            componentInfo.isVisible === true || componentInfo.isVisible === 1,
          ),
          theme: componentInfo.theme || 1,
        };

        console.log(" [AUTO-SAVE] Saving component:", {
          componentType: componentInfo.componentType,
          componentId: componentInfo.id,
          dataKeys: Object.keys(componentData),
        });

        pagesAPI
          .updatePageComponent(componentInfo.id, updateData)
          .then(() => {
            console.log(" [AUTO-SAVE] Component saved successfully");
          })
          .catch((error) => {
            console.error(" [AUTO-SAVE] Failed to save component:", error);
          });
      }, 1500); // 1.5 second delay
    },
    [pageData.id],
  );

  // Cleanup auto-save timeout on unmount

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Step navigation handler

  const handleStepClick = (stepId) => {
    console.log(" [STEP NAVIGATION] Clicked step:", stepId);

    if (stepId < currentStep) {
      setCurrentStep(stepId);

      console.log(` [STEP NAVIGATION] Navigated back to step ${stepId}`);
    } else if (stepId === currentStep) {
      console.log("ℹ [STEP NAVIGATION] Already on this step");
    } else {
      console.log(" [STEP NAVIGATION] Cannot skip ahead to future steps");
    }
  };

  // Available components derived dynamically from component registry

  const [availableComponents, setAvailableComponents] = useState([]);

  // Load existing page data if editing

  useEffect(() => {
    const loadExistingPage = async () => {
      if (pageId && !isNaN(parseInt(pageId))) {
        try {
          setLoading(true);

          console.log(` [PAGE LOAD] Loading existing page with ID: ${pageId}`);

          const pageData = await pagesAPI.getPageById(pageId);

          const components = await pagesAPI.getPageComponents(pageId);

          console.log(" [PAGE LOAD] Loaded page data:", {
            pageData,

            components,
          });

          setPageData({
            id: pageData.id,

            name: pageData.name || "",

            categoryId: pageData.categoryId || null,

            slug: pageData.slug || "",

            metaTitle: pageData.metaTitle || "",

            metaDescription: pageData.metaDescription || "",

            isHomepage: pageData.isHomepage || false,

            isPublished: pageData.isPublished || false,

            components:
              components?.map((component, index) => ({
                id: component.id,

                componentType: component.componentType || "Generic",

                componentName: component.componentName || "Component",

                orderIndex: component.orderIndex ?? index + 1,

                isVisible: component.isVisible ?? true,

                theme: component.theme ?? 1,

                contentJson:
                  typeof component.contentJson === "string"
                    ? component.contentJson || JSON.stringify({})
                    : JSON.stringify(component.contentJson ?? {}),
              })) || [],
          });

          // Set current step to component configuration if we have data

          if (components && components.length > 0) {
            setCurrentStep(2);
          }
        } catch (error) {
          console.error(" [PAGE LOAD] Failed to load existing page:", error);

          showToast(`Failed to load page: ${error.message}`, "error");
        } finally {
          setLoading(false);
        }
      }
    };

    loadExistingPage();
  }, [pageId]);

  useEffect(() => {
    // Load components from comprehensive component registry (shared loader)

    const loadRegistry = async () => {
      try {
        const { loadAvailableComponents } =
          await import("../../utils/availableComponentsLoader");

        const components = await loadAvailableComponents();

        console.log(
          " [COMPONENT REGISTRY] Loaded unified component list:",
          components.length,
        );

        setAvailableComponents(components);
      } catch (e) {
        console.error("Failed to load component registry", e);
      }
    };

    loadRegistry();
  }, []);

  // Load About component schemas for enhanced form generation

  useEffect(() => {
    const loadSchemas = async () => {
      try {
        const schemas = {};

        // Pre-load schemas for all About components

        const aboutComponents = [
          "AboutMissionSection",

          "AboutTeamSection",

          "AboutValuesSection",

          "AboutJourneySection",

          "AboutMilestonesSection",

          "AboutDifferentiatorsSection",

          "AboutCTASection",

          "AboutHeroSection",
        ];

        aboutComponents.forEach((compType) => {
          try {
            schemas[compType] = getAboutComponentSchema(compType);
          } catch (error) {
            console.warn(
              ` [SCHEMA LOAD] Failed to load schema for ${compType}:`,

              error,
            );
          }
        });

        // Pre-load schemas for general components

        const generalComponents = [
          "PayrollHeroSection",

          "PayrollHowItWorksSection",

          "PayrollWorkflowSection",

          "PayrollStepperSection",

          "PayrollPainPointsSection",

          "PayrollFAQSection",

          "PayrollCTASection",

          "HRHeroSection",

          "HRModulesSection",

          "HRBenefitsSection",

          "HRUseCasesSection",

          "HRPricingSection",

          "HRFAQSection",

          "HRCTASection",

          // Training components (enhanced schemas)

          "TrainingHeroSection",

          "TrainingProgramsSection",

          "TrainingKeyModulesSection",

          "TrainingWhyChooseSection",

          // Retail components (enhanced schemas)

          "RetailFeaturesSection",

          "RetailCaseStudies",
        ];

        generalComponents.forEach((compType) => {
          try {
            schemas[compType] = getGeneralComponentSchema(compType);
          } catch (error) {
            console.warn(
              ` [SCHEMA LOAD] Failed to load general schema for ${compType}:`,

              error,
            );
          }
        });

        setComponentSchemas(schemas);

        console.log(
          " [SCHEMAS LOADED] Available schemas:",

          Object.keys(schemas),
        );
      } catch (error) {
        console.error(
          " [SCHEMA LOAD ERROR] Failed to load component schemas:",

          error,
        );
      }
    };

    loadSchemas();
  }, []);

  // UI State

  const [editingComponent, setEditingComponent] = useState(null);

  const [showSectionEditor, setShowSectionEditor] = useState(false);

  const [showPagePreview, setShowPagePreview] = useState(false);

  const [componentSchemas, setComponentSchemas] = useState({});

  // New Input System State

  const [showNewInputModal, setShowNewInputModal] = useState(false);

  const [currentComponent, setCurrentComponent] = useState(null);

  const [useNewInputSystemState, setUseNewInputSystemState] = useState(true);

  const steps = [
    { id: 1, title: "Category", description: "Choose a category for the page" },

    { id: 2, title: "Page Details", description: "Basic page information" },

    {
      id: 3,

      title: "Add Sections",

      description: "Choose and configure sections",
    },

    {
      id: 4,

      title: "Review & Publish",

      description: "Final review and publish",
    },
  ];

  const showToast = (message, type = "info") => {
    setToast({ message, type });

    setTimeout(() => setToast(null), 5000);
  };

  // Utility function to generate slug from name

  const generateSlugFromName = (name) => {
    if (!name || typeof name !== "string") return "untitled-page";

    let slug = name

      .toLowerCase()

      .replace(/[^a-z0-9\s-]/g, "")

      .replace(/\s+/g, "-")

      .replace(/-+/g, "-")

      .trim();

    // Remove leading/trailing hyphens

    slug = slug.replace(/^-+|-+$/g, "");

    return slug || "untitled-page";
  };

  // Utility function to apply default values to page data

  const applyDefaultValues = (data, status = "draft") => {
    const defaultName = "Untitled Page";

    const name = data.name?.trim() || defaultName;

    const slug = data.slug?.trim() || generateSlugFromName(name);

    return {
      name: name,

      categoryId: data.categoryId ?? 1,

      slug: slug,

      metaTitle: data.metaTitle?.trim() || "",

      metaDescription: data.metaDescription?.trim() || "",

      isHomepage: data.isHomepage ?? false,

      isPublished: status === "published",

      components:
        data.components?.map((component, index) => {
          // Create the component object with proper content handling

          const processedComponent = {
            id: component.id, // Add the component ID from API

            componentType: component.componentType || "Generic",

            componentName: component.componentName || "New Component",

            orderIndex: component.orderIndex ?? index + 1, // Use API orderIndex or auto-generate

            isVisible:
              component.isVisible === undefined
                ? true
                : Boolean(
                    component.isVisible === true || component.isVisible === 1,
                  ), // Always boolean

            theme:
              component.theme === undefined ? 1 : component.theme === 2 ? 2 : 1, // Always 1 or 2
          };

          // Handle contentJson string conversion for API
          // IMPORTANT: Preserve BOTH contentJson (string) AND content (object) for API compatibility

          console.log(` Processing component ${index + 1}:`, {
            componentType: component.componentType,

            originalContentJson: component.contentJson,

            contentJsonType: typeof component.contentJson,

            contentJsonLength: component.contentJson?.length || 0,
          });

          if (
            component.contentJson &&
            typeof component.contentJson === "string"
          ) {
            try {
              // Parse and validate JSON before sending

              const parsedContent = JSON.parse(component.contentJson);

              processedComponent.content = parsedContent;

              // CRITICAL FIX: Also preserve the original contentJson string for the API
              processedComponent.contentJson = component.contentJson;

              console.log(
                ` Successfully parsed contentJson for component ${index + 1}:`,

                {
                  contentKeys: Object.keys(parsedContent),
                  contentJsonLength: component.contentJson.length,
                },
              );
            } catch (error) {
              console.error(
                ` Invalid JSON in component ${index + 1}:`,

                error.message,
              );

              // If invalid JSON, create empty object

              processedComponent.content = {};

              processedComponent.contentJson = JSON.stringify({});
            }
          } else if (
            component.content &&
            typeof component.content === "object"
          ) {
            processedComponent.content = component.content;

            // Convert content object to contentJson string
            processedComponent.contentJson = JSON.stringify(component.content);

            console.log(
              ` Using existing content object for component ${index + 1}:`,

              { contentKeys: Object.keys(component.content) },
            );
          } else {
            processedComponent.content = {};

            processedComponent.contentJson = JSON.stringify({});

            console.log(` Creating empty content for component ${index + 1}`);
          }

          console.log(
            ` Final processed component ${index + 1}:`,

            {
              componentType: processedComponent.componentType,
              hasContent: !!processedComponent.content,
              hasContentJson: !!processedComponent.contentJson,
              contentJsonLength: processedComponent.contentJson?.length || 0,
            },
          );

          return processedComponent;
        }) || [],
    };
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Slug checking function

  const checkSlugAvailability = async (slug, excludeId = null) => {
    if (!slug || slug.trim() === "") {
      setSlugAvailable(true);

      setSlugError("");

      return;
    }

    // Guard against accidental very-long slugs (e.g. page HTML leaking into slug field)
    if (slug.length > 300) {
      setSlugError("Slug is too long.");
      setSlugAvailable(false);
      return;
    }

    // Validate slug format before making API call

    const slugRegex = /^[a-z0-9-]+$/;

    if (!slugRegex.test(slug)) {
      setSlugError(
        "Slug must only contain lowercase letters, numbers, and dashes - يجب أن يحتوي الـ Slug على أحرف إنجليزية صغيرة وأرقام وشرطات فقط",
      );

      setSlugAvailable(false);

      return;
    }

    setSlugChecking(true);

    setSlugError("");

    try {
      const response = await pagesAPI.checkSlugExists(slug, excludeId);

      const isAvailable = !response.data;

      setSlugAvailable(isAvailable);

      if (!isAvailable) {
        setSlugError(
          "This slug is already in use. Please choose a different one - الـ Slug مستخدم من قبل، يرجى اختيار آخر",
        );
      }
    } catch (error) {
      console.error("Error checking slug availability:", error);

      setSlugError(
        "Unable to verify slug availability. Please try again - تعذر التحقق من الـ Slug، حاول مرة أخرى",
      );

      setSlugAvailable(false);
    } finally {
      setSlugChecking(false);
    }
  };

  // Debounced slug checking effect

  useEffect(() => {
    if (!pageData.slug || pageData.slug.trim() === "") {
      setSlugAvailable(true);

      setSlugError("");

      return;
    }

    const timeoutId = setTimeout(() => {
      checkSlugAvailability(pageData.slug, pageData.id);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [pageData.slug, pageData.id]);

  const handlePageDataChange = (field, value) => {
    // Handle slug input specially

    if (field === "slug") {
      // Only allow alphanumeric characters, dashes, and lowercase letters

      if (value === "" || /^[a-z0-9-]*$/.test(value)) {
        setPageData((prev) => ({
          ...prev,

          slug: value,
        }));

        // Clear previous slug error when user starts typing

        if (slugError) {
          setSlugError("");
        }
      } else {
        showToast(
          "Slug must only contain lowercase letters, numbers, and dashes - يجب أن يحتوي الـ Slug على أحرف صغيرة وأرقام وشرطات فقط",

          "error",
        );
      }
    } else {
      setPageData((prev) => ({
        ...prev,

        [field]: value,
      }));
    }

    // Auto-generate slug from name

    if (field === "name") {
      // Generate slug properly handling special cases

      let slug = value

        .toLowerCase()

        .replace(/[^a-z0-9\s-]/g, "")

        .replace(/\s+/g, "-")

        .replace(/-+/g, "-")

        .trim();

      // Remove leading/trailing hyphens

      slug = slug.replace(/^-+|-+$/g, "");

      setPageData((prev) => ({ ...prev, slug }));
    }
  };

  const addComponent = async (component) => {
    const MAX_RETRIES = 3;

    const tempId = `temp-${Date.now()}`;

    try {
      setLoading(true);

      // Always use schema-based default data for consistent pre-filling

      let defaultContent = getDefaultDataForComponent(component.componentType);

      // For About components, also check schema-based defaults

      if (component.componentType.includes("About")) {
        const componentSchema = getAboutComponentSchema(
          component.componentType,
        );

        if (componentSchema && componentSchema.defaultData) {
          defaultContent = {
            ...defaultContent,

            ...componentSchema.defaultData,
          };

          console.log(
            ` [SCHEMA DEFAULT] Using schema defaults for ${component.componentType}:`,

            componentSchema.defaultData,
          );
        }
      }

      console.log(
        ` [ADD COMPONENT] Adding ${component.componentType} with default data:`,

        defaultContent,
      );

      // Ensure we have valid default data

      if (!defaultContent || Object.keys(defaultContent).length === 0) {
        console.warn(
          ` [ADD COMPONENT] No default data found for ${component.componentType}, using fallback`,
        );

        defaultContent = {
          title: `${component.componentType} Title`,

          description: `${component.componentType} Description`,

          content: `This is a ${component.componentType} component`,
        };
      }

      // If we're editing an existing page (have pageId), fetch latest components

      let nextOrderIndex;

      if (pageData.id) {
        console.log(
          " [ADD COMPONENT] Fetching latest components for existing page:",

          pageData.id,
        );

        const latestComponents = await pagesAPI.getPageComponents(pageData.id);

        const maxOrderIndex = latestComponents.length
          ? Math.max(...latestComponents.map((c) => c.orderIndex ?? 0))
          : -1;

        // Start from at least 1 to avoid 0-index issues and ghost row conflicts

        nextOrderIndex = Math.max(maxOrderIndex + 1, 1);

        console.log(
          " [ADD COMPONENT] Calculated nextOrderIndex:",

          nextOrderIndex,

          "from",

          latestComponents.length,

          "existing components",
        );
      } else {
        // For new pages, use local component count

        nextOrderIndex = pageData.components.length + 1;

        console.log(
          " [ADD COMPONENT] Using local nextOrderIndex for new page:",

          nextOrderIndex,
        );
      }

      const newComponent = {
        id: tempId,

        componentType: component.componentType || "Generic",

        componentName: component.componentName || "New Component",

        contentJson: JSON.stringify(defaultContent, null, 2),

        orderIndex: nextOrderIndex,

        isVisible: true, // Use boolean for API compatibility

        theme: 1, // 1 = light, 2 = dark

        pending: !pageData.id, // Mark as pending only if it's a new page
      };

      console.log(` [ADD COMPONENT] New component created:`, {
        componentType: newComponent.componentType,

        contentJson: newComponent.contentJson,

        hasContentJson: !!newComponent.contentJson,

        contentLength: newComponent.contentJson?.length || 0,
      });

      // Add to local state immediately (optimistic update)

      setPageData((prev) => ({
        ...prev,

        components: [...prev.components, newComponent],
      }));

      // If this is an existing page, create the component via API

      if (pageData.id) {
        let created = null;

        let attempt = 0;

        while (attempt < MAX_RETRIES && !created) {
          try {
            // Always use the latest state for isVisible and theme

            const latestComponent = {
              ...newComponent,

              ...pageData.components.find((comp) => comp.id === tempId),
            };

            const payload = {
              pageId: pageData.id,

              componentType: latestComponent.componentType,

              componentName: latestComponent.componentName,

              contentJson: latestComponent.contentJson,

              orderIndex: nextOrderIndex,

              isVisible: latestComponent.isVisible,

              theme: latestComponent.theme,
            };

            console.log(
              ` [ADD COMPONENT] Attempt ${
                attempt + 1
              }/${MAX_RETRIES} with payload:`,

              payload,
            );

            created = await pagesAPI.createPageComponent(pageData.id, payload);

            // Replace temp component with real component

            setPageData((prev) => ({
              ...prev,

              components: prev.components.map((comp) =>
                comp.id === tempId ? created : comp,
              ),
            }));

            console.log(
              " [ADD COMPONENT] Successfully created component:",

              created,
            );
          } catch (err) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              JSON.stringify(err.response?.data);

            const isDuplicateKey =
              errorMessage?.includes("IX_PageComponents_PageId_OrderIndex") ||
              errorMessage?.includes("duplicate key") ||
              err.response?.data?.errorCode === 2601;

            console.error(` [ADD COMPONENT] Attempt ${attempt + 1} failed:`, {
              error: errorMessage,

              isDuplicateKey,

              nextOrderIndex,

              response: err.response?.data,
            });

            if (isDuplicateKey && attempt < MAX_RETRIES - 1) {
              console.warn(
                " [RETRY] Duplicate order index detected, trying higher orderIndex...",
              );

              // Refetch latest components to get known indices

              const refreshedComponents = await pagesAPI.getPageComponents(
                pageData.id,
              );

              const usedIndices = refreshedComponents.map(
                (c) => c.orderIndex ?? 0,
              );

              // Bump nextOrderIndex past the conflicting value

              // If API returns 0 components but DB has ghost rows,

              // keep incrementing past the conflicting index.

              nextOrderIndex = nextOrderIndex + 1;

              while (usedIndices.includes(nextOrderIndex)) {
                nextOrderIndex++;
              }

              // If still getting conflicts after first bump, use a high value

              if (attempt >= 1) {
                nextOrderIndex = Math.max(
                  nextOrderIndex,
                  100 + Math.floor(Date.now() % 10000),
                );
              }

              console.log(
                " [RETRY] New nextOrderIndex:",

                nextOrderIndex,

                "(attempt",
                attempt + 2,
                "of",
                MAX_RETRIES,
                ")",
              );

              attempt++;

              continue;
            } else {
              throw err;
            }
          }
        }

        if (!created) {
          // Remove temp component if all retries failed

          setPageData((prev) => ({
            ...prev,

            components: prev.components.filter((comp) => comp.id !== tempId),
          }));

          showToast(
            "Unable to add component after multiple attempts. Please try again.",

            "error",
          );

          return;
        }
      }

      showToast(
        (component.componentName || component.name || "Component") +
          " added to page",

        "success",
      );
    } catch (error) {
      console.error(" [ADD COMPONENT] Final error:", error);

      // Remove temp component on error

      setPageData((prev) => ({
        ...prev,

        components: prev.components.filter((comp) => comp.id !== tempId),
      }));

      const errorMessage = error.response?.data?.message || error.message;

      showToast(`Error adding component: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to update a specific component field

  const updateComponent = (index, field, value) => {
    setPageData((prev) => {
      const updatedComponents = [...prev.components];

      const currentComponent = updatedComponents[index];

      // Parse existing contentJson or create new

      let contentData = {};

      if (currentComponent.contentJson) {
        try {
          contentData = JSON.parse(currentComponent.contentJson);
        } catch (e) {
          console.error(" JSON Parse Error:", e);
        }
      }

      // Update the specific field in contentData

      if (field === "contentJson") {
        // Direct JSON update

        updatedComponents[index] = {
          ...currentComponent,

          contentJson: value,
        };

        // Trigger debounced auto-save for contentJson updates
        try {
          const parsedData = JSON.parse(value);
          // Pass the updated component info directly to avoid stale closure issues
          const updatedComponentInfo = {
            ...currentComponent,
            contentJson: value,
          };
          debouncedAutoSave(updatedComponentInfo, parsedData);
        } catch (e) {
          console.warn(" [AUTO-SAVE] Invalid JSON, skipping auto-save:", e);
        }
      } else if (
        field === "isVisible" ||
        field === "theme" ||
        field === "componentType" ||
        field === "componentName" ||
        field === "orderIndex"
      ) {
        // Update component-level fields directly (not in contentJson)

        updatedComponents[index] = {
          ...currentComponent,

          [field]: value,
        };
      } else {
        // Update specific field in content JSON

        const updatedContentData = {
          ...contentData,

          [field]: value,
        };

        updatedComponents[index] = {
          ...currentComponent,

          contentJson: JSON.stringify(updatedContentData, null, 2),
        };
      }

      return {
        ...prev,

        components: updatedComponents,
      };
    });

    // Make API call to persist changes for isVisible, theme, contentJson, and other component-level fields

    if (
      field === "isVisible" ||
      field === "theme" ||
      field === "componentType" ||
      field === "componentName" ||
      field === "orderIndex" ||
      field === "contentJson"
    ) {
      const component = pageData.components[index];

      if (component?.id && pageData.id) {
        // Always use the latest state for isVisible and theme

        const updateData = {
          id: component.id,

          pageId: pageData.id,

          componentType: component.componentType,

          componentName: component.componentName || "",

          contentJson:
            field === "contentJson"
              ? value
              : component.contentJson || JSON.stringify({}),

          orderIndex:
            component.orderIndex !== undefined ? component.orderIndex : index,

          // Use the new value from checkbox for isVisible and theme

          isVisible:
            field === "isVisible"
              ? Boolean(value === true || value === 1)
              : Boolean(
                  component.isVisible === true || component.isVisible === 1,
                ),

          theme: field === "theme" ? value : component.theme,
        };

        // Make async API call (don't await to keep UI responsive)

        pagesAPI

          .updatePageComponent(component.id, updateData)

          .then(() => {
            showToast(`${field} updated successfully`, "success");
          })

          .catch((error) => {
            showToast(`Failed to update ${field}: ${error.message}`, "error");

            // Revert the local change on API failure

            setPageData((prevData) => {
              const revertedComponents = [...prevData.components];

              const originalComponent = component; // Store the original component state before update

              if (field === "isVisible") {
                revertedComponents[index] = {
                  ...revertedComponents[index],

                  isVisible: !value, // Revert to opposite of the attempted value
                };
              } else if (field === "theme") {
                revertedComponents[index] = {
                  ...revertedComponents[index],

                  theme: value === 1 ? 2 : 1, // Revert to opposite of the attempted value
                };
              } else {
                // For other fields (contentJson, componentType, etc.), revert to original value

                revertedComponents[index] = {
                  ...revertedComponents[index],

                  [field]: originalComponent[field], // Revert to original value
                };
              }

              return {
                ...prevData,

                components: revertedComponents,
              };
            });
          });
      }
    }

    // Immediate API sync for critical AboutMissionSection fields (real-time synchronization)

    if (
      pageData.components[index]?.componentType === "AboutMissionSection" &&
      (field === "title" ||
        field === "description" ||
        field === "vision" ||
        field === "subtitle")
    ) {
      const component = pageData.components[index];

      if (component?.id && pageData.id) {
        const currentContentData = (() => {
          try {
            return JSON.parse(component.contentJson || "{}");
          } catch {
            return {};
          }
        })();

        const updateData = {
          id: component.id,

          pageId: pageData.id,

          componentType: component.componentType,

          componentName: component.componentName || "",

          contentJson: JSON.stringify(
            {
              ...currentContentData,

              [field]: value,
            },

            null,

            2,
          ),

          orderIndex:
            component.orderIndex !== undefined ? component.orderIndex : index,

          isVisible: Boolean(
            component.isVisible === true || component.isVisible === 1,
          ),

          theme: component.theme || 1,
        };

        pagesAPI.updatePageComponent(component.id, updateData).catch(() => {});
      }
    }
  };

  // Generate component-specific default data from JSON files

  const generateDefaultDataFromJSON = () => {
    return {
      // About Components (from about.json)

      AboutHeroSection: {
        title: "About Bellatrix",

        subtitle: "Your trusted partner in digital transformation",

        description:
          "We are a leading consultancy firm specializing in NetSuite implementations, business process optimization, and technology solutions that drive growth and efficiency.",

        backgroundVideo: "/Videos/about-hero.mp4",

        stats: [
          { value: "500+", label: "Projects Completed" },

          { value: "15+", label: "Years Experience" },

          { value: "98%", label: "Client Satisfaction" },

          { value: "200+", label: "Happy Clients" },
        ],
      },

      AboutMissionSection: {
        title: "Our Mission",

        description:
          "To empower businesses with innovative technology solutions that transform operations, enhance productivity, and drive sustainable growth.",

        vision:
          "To be the global leader in business transformation consulting, helping organizations achieve their full potential through technology excellence.",
      },

      AboutJourneySection: {
        title: "Our Journey",

        description:
          "From humble beginnings to becoming a trusted global partner",

        timeline: [
          {
            year: "2008",

            title: "Company Founded",

            description:
              "Bellatrix was established with a vision to transform businesses through technology.",
          },

          {
            year: "2012",

            title: "First 100 Clients",

            description:
              "Reached our first major milestone of serving 100 satisfied clients.",
          },

          {
            year: "2016",

            title: "NetSuite Gold Partner",

            description:
              "Achieved NetSuite Gold Partner status, recognizing our expertise.",
          },

          {
            year: "2020",

            title: "Global Expansion",

            description:
              "Expanded operations to serve clients across multiple continents.",
          },

          {
            year: "2023",

            title: "500+ Projects",

            description:
              "Successfully completed over 500 implementation projects.",
          },

          {
            year: "2024",

            title: "AI Integration",

            description:
              "Pioneered AI-powered solutions for enhanced business intelligence.",
          },
        ],
      },

      AboutTeamSection: {
        title: "Meet Our Team",

        description: "Experienced professionals dedicated to your success",

        members: [
          {
            name: "Sarah Johnson",

            role: "Chief Executive Officer",

            image: "/images/ourteam/1.jpg",

            bio: "Visionary leader with 20+ years in enterprise software solutions.",

            expertise: [
              "Strategic Planning",

              "Business Development",

              "Leadership",
            ],
          },

          {
            name: "Michael Chen",

            role: "Chief Technology Officer",

            image: "/images/ourteam/2.jpg",

            bio: "Technology expert specializing in NetSuite implementations and cloud solutions.",

            expertise: [
              "NetSuite Development",

              "Cloud Architecture",

              "System Integration",
            ],
          },

          {
            name: "Emily Rodriguez",

            role: "Head of Operations",

            image: "/images/ourteam/3.jpg",

            bio: "Operations specialist ensuring seamless project delivery and client success.",

            expertise: [
              "Project Management",

              "Process Optimization",

              "Quality Assurance",
            ],
          },
        ],
      },

      AboutValuesSection: {
        title: "Our Values",

        description: "The principles that guide everything we do",

        items: [
          {
            title: "Innovation",

            description:
              "We embrace cutting-edge technologies and creative thinking to solve complex business challenges.",

            color: "from-blue-500 to-cyan-500",

            icon: "",
          },

          {
            title: "Excellence",

            description:
              "We deliver exceptional quality in every project, exceeding client expectations consistently.",

            color: "from-gray-400 to-gray-600",

            icon: "",
          },

          {
            title: "Integrity",

            description:
              "We act with honesty and transparency, building trust through ethical business practices.",

            color: "from-green-500 to-teal-500",

            icon: "",
          },
        ],
      },

      AboutDifferentiatorsSection: {
        title: "What Makes Us Different",

        description: "Key factors that set us apart from the competition",

        items: [
          {
            title: "Industry Expertise",

            description:
              "Deep understanding of various industries and their unique challenges.",

            stats: "15+ Industries",

            icon: "",
          },

          {
            title: "Proven Methodology",

            description:
              "Time-tested implementation methodology ensuring project success.",

            stats: "98% Success Rate",

            icon: "",
          },

          {
            title: "Ongoing Support",

            description:
              "24/7 support and maintenance services for continuous optimization.",

            stats: "24/7 Support",

            icon: "",
          },
        ],
      },

      // HR Components (from hr.json)

      HRHeroSection: {
        title: "HR, Payroll & People Management",

        subtitle:
          "Automate HR, empower employees, and stay compliant—on one secure platform designed for the future of work.",

        bgVideo: "/Videos/hrVideo.mp4",

        bgColor: "bg-gradient-to-br from-[#191970] via-black to-blue-700",
      },

      HRFeaturesSection: {
        title: "Why Choose Our HR Solution?",

        description:
          "Discover the key advantages that make our HR platform the smart choice for modern businesses of all sizes and industries.",

        items: [
          {
            icon: "",

            title: "Payroll Automation",

            desc: "Automate payroll processing, tax calculations, and compliance with built-in error checking and real-time updates.",
          },

          {
            icon: "",

            title: "Centralized Employee Data",

            desc: "All employee records, contracts, documents, and history in one secure, searchable cloud-based platform.",
          },

          {
            icon: "",

            title: "Digital Onboarding",

            desc: "Digitize onboarding with automated workflows, e-signatures, task assignments, and welcome packages.",
          },
        ],
      },

      HRModulesSection: {
        title: "Product Modules",

        description:
          "Our platform is built from modular components to cover every aspect of HR, payroll, and compliance.",

        modules: [
          {
            icon: "",

            title: "Employee Management",

            desc: "Complete employee lifecycle management from hiring to offboarding with customizable workflows.",
          },

          {
            icon: "",

            title: "Time & Attendance",

            desc: "Automated time tracking, shift planning, overtime management, and absence tracking.",
          },

          {
            icon: "",

            title: "Payroll & Compensation",

            desc: "End-to-end payroll processing, tax filing, benefits administration, and compensation planning.",
          },
        ],
      },

      HRPricingSection: {
        title: "HR Pricing Plans",

        description:
          "Choose the perfect plan for your organization's HR needs.",

        pricing: [
          {
            name: "Essential",

            description:
              "Perfect for small teams getting started with HR automation",

            price: "$2,500",

            priceNote: "one-time implementation",

            features: [
              "Core HR modules setup",

              "Employee data migration",

              "Basic payroll configuration",

              "User training for up to 5 administrators",
            ],

            ctaText: "Start with Essential",

            isPopular: false,
          },

          {
            name: "Professional",

            description: "Ideal for growing companies with complex HR needs",

            price: "$5,000",

            priceNote: "one-time implementation",

            isPopular: true,

            features: [
              "All Essential features",

              "Advanced reporting setup",

              "Custom workflow configuration",

              "Integration with 3rd party tools",
            ],

            ctaText: "Choose Professional",
          },
        ],
      },

      // Payroll Components (from payroll.json)

      PayrollHeroSection: {
        title: "Transform Your Payroll Process",

        subtitle:
          "Streamline operations with our intelligent, automated payroll system",
      },

      PayrollPainPointsSection: {
        title: "The Payroll Struggles We Eliminate",

        description:
          "Our system addresses the most common payroll challenges faced by consultancy firms:",

        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",

        items: [
          { text: "Delayed salary processing and errors", icon: "time" },

          {
            text: "Manual tax calculations and compliance risks",

            icon: "check",
          },

          {
            text: "Lack of visibility and transparency for employees",

            icon: "user",
          },

          {
            text: "Difficulty scaling payroll operations across geographies",

            icon: "globe",
          },
        ],
      },

      PayrollWorkflowSection: {
        title: "Payroll System Built for All Industries",

        description:
          "Streamline your entire payroll lifecycle — from onboarding to salary disbursement — with a secure, intuitive platform.",

        subtitle: "Core Workflow",

        steps: [
          {
            title: "Employee data import",

            desc: "Easily onboard and manage employee records in one place.",

            details:
              "Import employee data from spreadsheets or integrated HR systems. Supports bulk uploads and data validation with real-time error checking.",

            benefits: [
              "Bulk data import from Excel/CSV",

              "Real-time validation and error checking",

              "Integration with existing HR systems",

              "Automated employee record creation",
            ],
          },

          {
            title: "Time & attendance sync",

            desc: "Integrate timesheets and attendance for accurate payroll.",

            details:
              "Syncs with your time tracking tools to ensure accurate hours and leave data for every employee.",

            benefits: [
              "Automatic timesheet integration",

              "Leave balance calculations",

              "Overtime and holiday tracking",

              "Multi-location support",
            ],
          },
        ],
      },

      PayrollFeaturesSection: {
        title: "Key Features for Modern Consultancies",

        items: [
          {
            title: "Automated Calculations",

            description: "Smart payroll processing with tax compliance",

            icon: "lightning",
          },

          {
            title: "Multi-Currency Support",

            description: "Handle global payroll across different currencies",

            icon: "globe",
          },
        ],
      },

      // Implementation Components (from Implementation.json)

      ImplementationHeroSection: {
        backgroundVideo: "/Videos/HomeHeroSectionV.mp4",

        titleParts: ["Where", "Vision", "Meets", "Reality"],

        description:
          "We don't just implement solutions—we craft digital experiences that transform the way you do business",

        ctaButton: {
          text: "Start Implementation",

          icon: "M13 7l5 5m0 0l-5 5m5-5H6",
        },
      },

      ImplementationProcessSection: {
        title: "Our Implementation Process",

        subtitle: "A proven methodology for seamless business transformation",

        image: "/Videos/implementation/implementProcess.jpg",

        steps: [
          {
            number: 1,

            title: "Analysis & Planning",

            description: "System analysis and strategic roadmap creation",

            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
          },

          {
            number: 2,

            title: "Design & Development",

            description: "Custom solution design and development",

            icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
          },

          {
            number: 3,

            title: "Testing & Integration",

            description: "Quality assurance and system integration",

            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          },

          {
            number: 4,

            title: "Launch & Support",

            description: "Deployment and ongoing support",

            icon: "M13 10V3L4 14h7v7l9-11h-7z",
          },
        ],

        ctaButton: "Start Your Journey",
      },

      ImplementationWhyChooseSection: {
        title: "Why Choose Bellatrix for Implementation?",

        subtitle:
          "We bring years of expertise, proven methodologies, and cutting-edge solutions to ensure your implementation success",

        image: "/Videos/implementation/whyChoese.jpg",

        features: [
          {
            number: "01",

            title: "Proven Expertise",

            description: "500+ successful implementations across industries",
          },

          {
            number: "02",

            title: "Rapid Deployment",

            description: "50% faster implementation with proven tools",
          },

          {
            number: "03",

            title: "24/7 Support",

            description: "Round-the-clock technical support & monitoring",
          },
        ],
      },

      ImplementationPricingSection: {
        title: "Implementation Pricing",

        subtitle:
          "Choose the perfect implementation plan that fits your business needs and budget",

        plans: [
          {
            name: "Basic",

            description: "Perfect for small businesses",

            price: "$2,500",

            priceNote: "starting from",

            features: [
              "Standard NetSuite setup",

              "Basic data migration",

              "5 user accounts included",

              "2-week timeline",

              "Email support",
            ],

            ctaText: "Get Started",
          },

          {
            name: "Professional",

            description: "Ideal for growing companies",

            price: "$5,000",

            priceNote: "starting from",

            isPopular: true,

            features: [
              "Advanced configuration",

              "Complete data migration",

              "Up to 25 users",

              "Custom integrations",

              "Training sessions",
            ],

            ctaText: "Get Started",
          },

          {
            name: "Enterprise",

            description: "For large organizations",

            price: "Custom",

            priceNote: "pricing",

            features: [
              "Full customization",

              "Unlimited users",

              "Advanced integrations",

              "Dedicated support",

              "On-site training",
            ],

            ctaText: "Contact Sales",
          },
        ],
      },

      // Manufacturing Components (from manufacturing-data.json)

      ManufacturingHeroSection: {
        title: "Manufacturing Excellence",

        subtitle: "Powered by NetSuite",

        description:
          "Transform your manufacturing operations with integrated ERP solutions that streamline production, optimize inventory, and ensure quality compliance across your entire value chain.",

        backgroundImage:
          "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",

        ctaText: "Schedule Manufacturing Demo",
      },

      ManufacturingStatsSection: {
        items: [
          {
            value: "500+",

            label: "Manufacturing Clients",

            description: "Successful implementations",
          },

          {
            value: "40%",

            label: "Efficiency Gain",

            description: "Average improvement",
          },

          {
            value: "35%",

            label: "Cost Reduction",

            description: "In operational costs",
          },

          {
            value: "98%",

            label: "Client Satisfaction",

            description: "Success rate",
          },
        ],
      },

      ManufacturingChallengesSection: {
        title: "Manufacturing Challenges We Solve",

        subtitle: "Common pain points facing manufacturers",

        description:
          "Modern manufacturing faces complex challenges that require integrated solutions to optimize operations and maintain quality standards.",

        image:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",

        challenges: [
          {
            title: "Complex Production Planning",

            description:
              "Managing multi-level BOMs, work orders, and production schedules across multiple facilities",

            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",

            impact: "30% production delays",
          },

          {
            title: "Inventory Management Complexity",

            description:
              "Tracking raw materials, WIP, and finished goods across multiple locations with real-time visibility",

            icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",

            impact: "25% excess inventory costs",
          },

          {
            title: "Quality Control",

            description:
              "Maintaining consistent quality standards and compliance across all production processes and locations",

            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",

            impact: "15% quality issues",
          },
        ],
      },

      ManufacturingSolutionsSection: {
        title: "NetSuite Manufacturing Solutions",

        subtitle: "Comprehensive ERP solutions designed for manufacturers",

        description:
          "Comprehensive manufacturing solutions that streamline your operations from production planning to quality control.",

        image:
          "https://i.pinimg.com/1200x/19/e6/91/19e6918482b92f0f7e31e68d376bf711.jpg",

        solutions: [
          {
            title: "Advanced Manufacturing",

            description:
              "Complete production planning with work orders, routing, and capacity planning",

            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",

            features: [
              "Multi-level BOMs",

              "Work order management",

              "Capacity planning",

              "Production reporting",
            ],

            benefits: "40% improvement in production efficiency",
          },

          {
            title: "Inventory & Warehouse Management",

            description: "Real-time inventory visibility across all locations",

            icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",

            features: [
              "Multi-location inventory",

              "Serial/lot tracking",

              "Cycle counting",

              "Warehouse management",
            ],

            benefits: "35% reduction in inventory costs",
          },
        ],
      },

      // Retail Components (from retail-data.json)

      RetailHeroSection: {
        title: "Retail Excellence",

        description:
          "Transform your retail operations with integrated commerce solutions that unify online, mobile, and in-store experiences while optimizing inventory and enhancing customer satisfaction.",

        ctaText: "Talk to an Expert",
      },

      RetailStatsSection: {
        items: [
          {
            value: "300+",

            label: "Retail Clients",

            description: "Successful implementations",
          },

          {
            value: "50%",

            label: "Sales Growth",

            description: "Average improvement",
          },

          {
            value: "40%",

            label: "Cost Reduction",

            description: "In operational costs",
          },

          { value: "99%", label: "Uptime", description: "System availability" },
        ],
      },

      RetailChallengesSection: {
        title: "Retail Challenges",

        subtitle: "Understanding Modern Retail Obstacles",

        description:
          "Modern retail faces complex challenges that require integrated solutions to deliver exceptional customer experiences and maintain profitability.",

        image:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",

        retailChallenges: [
          {
            title: "Omnichannel Inventory Management",

            description:
              "Managing inventory across multiple sales channels while maintaining real-time visibility",

            icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",

            impact: "High",
          },

          {
            title: "Customer Experience Consistency",

            description:
              "Delivering consistent customer experience across online, mobile, and physical store touchpoints",

            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",

            impact: "High",
          },

          {
            title: "Data-Driven Decision Making",

            description:
              "Turning large volumes of retail data into actionable insights for smarter business decisions",

            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",

            impact: "Medium",
          },
        ],
      },

      // Training Components (from training.json)

      TrainingHeroSection: {
        heroContent: {
          title: "Professional Training Programs",

          subtitle: "Professional ERP Education & Skills Development",

          description:
            "Empower your team with comprehensive training solutions designed to enhance skills and drive success",
        },

        backgroundVideo: "/trainingHeroSectionTwo.mp4",

        ctaButton: {
          text: "Start Learning Today",

          link: "/training",

          variant: "primary",

          icon: "",
        },
      },

      TrainingProgramsSection: {
        title: "Our Training Programs",

        description:
          "Comprehensive training solutions designed to empower your team with the skills they need to excel",

        image: "/images/training.jpg",

        Professional_Badge: "Certified Training",

        programs: [
          {
            id: 1,

            title: "NetSuite Fundamentals",

            shortDescription: "Core concepts and navigation basics",
          },

          {
            id: 2,

            title: "Advanced Modules",

            shortDescription: "Financial management and reporting",
          },
        ],
      },

      TrainingFeaturesSection: {
        title: "Training Features",

        description: "What makes our training programs exceptional",

        features: [
          {
            id: 1,

            title: "Expert Instructors",

            shortDescription:
              "Certified professionals with years of experience",

            icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
          },

          {
            id: 2,

            title: "Hands-on Learning",

            shortDescription: "Practical exercises with real-world scenarios",

            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
          },
        ],
      },

      // Consulting Components (from netSuiteConsulting.json)

      ConsultingHeroSection: {
        title: "NetSuite Consulting",

        description:
          "Strategic guidance and expert consulting to maximize your NetSuite investment and transform your business operations.",

        ctaText: "Talk to an Expert",

        ctaIcon:
          "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      },

      ConsultingServicesSection: {
        title: "Our Consulting Services",

        description:
          "Comprehensive NetSuite consulting services designed to optimize your business processes and maximize your return on investment.",

        image: "/images/ourProServices.png",

        items: [
          {
            title: "NetSuite Implementation Strategy",

            description:
              "Comprehensive planning and roadmap development for successful NetSuite deployment",

            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",

            features: [
              "Business process analysis and optimization",

              "System architecture design",

              "Implementation timeline and milestones",
            ],
          },

          {
            title: "Business Process Optimization",

            description:
              "Streamline your operations with NetSuite's powerful automation capabilities",

            icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",

            features: [
              "Workflow automation design",

              "Process standardization",

              "Performance optimization",
            ],
          },
        ],
      },

      // Home Page Components (from homeData.json)

      HomeHeroSection: {
        slides: [
          {
            title: "Strategic Business Transformations",

            subtitle: "Bellatrix Consultancy",

            description:
              "Streamline operations and drive growth with our comprehensive NetSuite solutions.",

            video: "/Videos/HomeHeroSectionV.mp4",

            cta: "Explore Services",
          },

          {
            title: "Digital Optimization Experts",

            subtitle: "Cloud Solutions Specialists",

            description:
              "Enhance productivity with our tailored implementation and consulting services.",

            video: "/video2.mp4",

            cta: "View Case Studies",
          },
        ],

        stats: [
          { value: "200+", label: "Projects" },

          { value: "98%", label: "Satisfaction" },

          { value: "15+", label: "Years" },
        ],
      },

      HomeServicesSection: {
        sectionHeader: {
          title: "Our Professional Services",

          subtitle: "Comprehensive solutions tailored to your business needs",

          gradientText: "Professional Services",
        },

        services: [
          {
            title: "Strategic Consultation",

            description:
              "Expert analysis to optimize your NetSuite roadmap with actionable insights",

            icon: "LightbulbOutlined",

            color: "#10B981",

            details: [
              "Business process analysis",

              "ROI forecasting",

              "System architecture planning",
            ],

            stats: "92% client satisfaction rate",

            link: "/netsuite-consulting",
          },

          {
            title: "Implementation",

            description:
              "End-to-end deployment with minimal disruption to operations",

            icon: "BuildOutlined",

            color: "#0EA5E9",

            details: [
              "Phased rollout planning",

              "Data migration services",

              "Configuration best practices",
            ],

            stats: "40% faster than industry average",

            link: "/Implementation",
          },
        ],

        viewAllButton: {
          text: "View All Services",
        },
      },

      HomeTestimonialsSection: {
        sectionHeader: {
          title: "Trusted by Industry Leaders",

          subtitle:
            "Don't just take our word for it—here's what our clients say.",

          gradientText: "Trusted by Industry Leaders",
        },

        testimonials: [
          {
            name: "Ahmed Hassan",

            position: "CEO",

            company: "TechCorp Solutions",

            quote:
              "Bellatrix-iX transformed our business operations completely. Highly recommended!",

            rating: 5,

            image: "/images/testimonials/client1.jpg",
          },
        ],

        ctaButton: {
          text: "Contact This Client's Success Manager",
        },
      },

      HomeIndustriesSection: {
        sectionHeader: {
          chipLabel: "INDUSTRY SOLUTIONS",

          title: "Discover Modern Industry Solutions",

          highlightedWord: "Modern",

          description:
            "Explore how our blue-powered platform transforms your sector with interactive, tailored solutions.",
        },

        industries: [
          {
            title: "Manufacturing",

            subtitle: "Production Excellence",

            description:
              "Streamline manufacturing operations with integrated production planning, quality control, and supply chain management.",

            image: "/images/3.jpg",

            solutions: [
              "Production Planning",

              "Quality Control",

              "Inventory Management",
            ],

            link: "/industries/manufacturing",
          },

          {
            title: "Retail & E-commerce",

            subtitle: "Omnichannel Commerce",

            description:
              "Unify online and offline operations with comprehensive retail management and customer experience solutions.",

            image: "/images/6.jpg",

            solutions: [
              "POS Integration",

              "Inventory Sync",

              "Customer Analytics",
            ],

            link: "/industries/retail",
          },
        ],
      },

      // Generic Components

      TestimonialsSection: {
        title: "What Our Clients Say",

        description: "Real feedback from satisfied customers",

        testimonials: [
          {
            name: "Ahmed Hassan",

            position: "CEO",

            company: "TechCorp Solutions",

            quote:
              "Bellatrix-iX transformed our business operations completely. Highly recommended!",

            rating: 5,

            image: "/images/testimonials/client1.jpg",
          },

          {
            name: "Sarah Mohamed",

            position: "Operations Manager",

            company: "Global Enterprises",

            quote:
              "Outstanding service and support. The team exceeded our expectations.",

            rating: 5,

            image: "/images/testimonials/client2.jpg",
          },
        ],
      },

      FAQSection: {
        title: "Frequently Asked Questions",

        description: "Find answers to common questions about our services",

        faqs: [
          {
            question: "What is included in the ERP implementation?",

            answer:
              "Our ERP implementation includes system setup, data migration, user training, and ongoing support to ensure smooth operation.",
          },

          {
            question: "How long does the implementation process take?",

            answer:
              "Implementation timeline varies based on company size and complexity, typically ranging from 3-12 months.",
          },

          {
            question: "Do you provide training for our team?",

            answer:
              "Yes, we provide comprehensive training programs for all user levels, including administrators and end-users.",
          },
        ],
      },

      CTASection: {
        title: "Ready to Transform Your Business?",

        subtitle: "Let's work together to achieve your goals",

        description:
          "Get started with a free consultation today and discover how we can help you achieve your goals.",

        ctaText: "Get Started",

        ctaLink: "/contact",

        features: [
          {
            title: "Free Assessment",

            description: "Comprehensive evaluation of your current setup",

            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
          },

          {
            title: "Expert Consultation",

            description: "Work with certified professionals",

            icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
          },
        ],
      },

      PricingSection: {
        title: "Choose Your Plan",

        description: "Flexible pricing options for businesses of all sizes",

        plans: [
          {
            name: "Basic",

            price: "$99",

            period: "per month",

            description: "Perfect for small businesses",

            features: ["Up to 10 Users", "Basic Modules", "Email Support"],

            popular: false,

            ctaText: "Get Started",
          },

          {
            name: "Professional",

            price: "$299",

            period: "per month",

            description: "Ideal for growing companies",

            features: [
              "Up to 50 Users",

              "Advanced Modules",

              "Priority Support",

              "Custom Reports",
            ],

            popular: true,

            ctaText: "Choose Professional",
          },

          {
            name: "Enterprise",

            price: "Custom",

            period: "contact us",

            description: "For large organizations",

            features: [
              "Unlimited Users",

              "All Modules",

              "24/7 Support",

              "Custom Development",
            ],

            popular: false,

            ctaText: "Contact Sales",
          },
        ],
      },

      ContactSection: {
        title: "Get In Touch",

        subtitle: "Ready to transform your business? Contact us today!",

        description:
          "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",

        contactInfo: {
          phone: "+20 123 456 7890",

          email: "info@bellatrix-ix.com",

          address: "Cairo, Egypt",

          workingHours: "Sunday - Thursday: 9 AM - 6 PM",
        },

        socialLinks: [
          {
            platform: "LinkedIn",

            url: "https://linkedin.com/company/bellatrix-ix",

            icon: "linkedin",
          },

          {
            platform: "Facebook",

            url: "https://facebook.com/bellatrix-ix",

            icon: "facebook",
          },

          {
            platform: "Twitter",

            url: "https://twitter.com/bellatrix_ix",

            icon: "twitter",
          },
        ],

        formFields: [
          {
            name: "fullName",

            label: "Full Name",

            type: "text",

            required: true,
          },

          {
            name: "email",

            label: "Email Address",

            type: "email",

            required: true,
          },

          {
            name: "company",

            label: "Company Name",

            type: "text",

            required: false,
          },

          {
            name: "message",

            label: "Message",

            type: "textarea",

            required: true,
          },
        ],
      },

      FeaturesSection: {
        title: "Why Choose Our Solutions",

        subtitle: "Discover the advantages of our ERP platform",

        features: [
          {
            title: "Cloud-Based Architecture",

            description:
              "Secure, scalable cloud infrastructure for optimal performance",

            icon: "cloud",

            benefits: ["99.9% Uptime", "Auto Scaling", "Global Access"],
          },

          {
            title: "Advanced Analytics",

            description: "Real-time insights and comprehensive reporting tools",

            icon: "analytics",

            benefits: [
              "Real-time Dashboards",

              "Custom Reports",

              "Predictive Analytics",
            ],
          },

          {
            title: "Mobile Optimization",

            description: "Full mobile compatibility for on-the-go management",

            icon: "mobile",

            benefits: [
              "Responsive Design",

              "Native Apps",

              "Offline Capability",
            ],
          },
        ],
      },

      // Additional CTA and FAQ components can be mapped similarly...

      HRBenefitsSection: {
        title: "HR Benefits",

        subtitle: "Why choose our HR solutions",

        benefits: [
          {
            title: "Reduced Administrative Burden",

            description: "Automate routine HR tasks",

            icon: "",
          },

          {
            title: "Improved Compliance",

            description: "Stay compliant with labor laws",

            icon: "",
          },

          {
            title: "Better Employee Experience",

            description: "Self-service portal for employees",

            icon: "",
          },
        ],
      },

      HRUseCasesSection: {
        title: "HR Use Cases",

        subtitle: "Real-world applications",

        useCases: [
          {
            title: "Small Business",

            description: "Perfect for businesses with 10-100 employees",

            features: ["Basic HR", "Time tracking", "Simple reporting"],
          },

          {
            title: "Enterprise",

            description: "Comprehensive solution for large organizations",

            features: [
              "Advanced analytics",

              "Multi-location support",

              "Custom workflows",
            ],
          },
        ],
      },

      HRFAQSection: {
        title: "HR FAQ",

        subtitle: "Common questions about our HR solutions",

        faqs: [
          {
            question: "Can I integrate with existing systems?",

            answer:
              "Yes, we offer comprehensive integration capabilities with most HR and payroll systems.",
          },

          {
            question: "Is training included?",

            answer:
              "Yes, we provide comprehensive training for all users at no additional cost.",
          },

          {
            question: "What about data security?",

            answer:
              "We use enterprise-grade security with encryption and regular backups.",
          },
        ],
      },

      HRCTASection: {
        title: "Transform Your HR Today",

        subtitle: "Start your HR transformation journey",

        description: "Join leading companies using our HR solutions",

        ctaButton: {
          text: "Schedule Demo",

          link: "/hr/demo",

          variant: validateVariant("primary"),
        },
      },

      ImplementationWhyChooseSectionAlt: {
        title: "Why Choose Our Implementation",

        subtitle: "What sets us apart",

        points: [
          {
            title: "Certified Team",

            description: "Experienced consultants and PMs",

            icon: "",
          },

          {
            title: "Proven Methodology",

            description: "Repeatable, predictable delivery",

            icon: "",
          },

          {
            title: "Post Go‑Live Support",

            description: "We stay with you after launch",

            icon: "",
          },

          {
            title: "Industry Expertise",

            description: "Deep knowledge of your industry",

            icon: "",
          },
        ],
      },

      ImplementationPricingSectionAlt: {
        title: "Implementation Pricing",

        subtitle: "Transparent pricing for all project sizes",

        plans: [
          {
            name: "Starter",

            price: "$4,900",

            duration: "2 weeks",

            includes: ["Discovery", "Basic config", "Training"],

            cta: "Get Quote",
          },

          {
            name: "Pro",

            price: "$12,900",

            duration: "6 weeks",

            includes: ["Workshops", "Advanced config", "Data migration"],

            cta: "Get Quote",

            popular: true,
          },

          {
            name: "Enterprise",

            price: "Custom",

            duration: "8+ weeks",

            includes: ["Full customization", "Integration", "Ongoing support"],

            cta: "Contact Sales",
          },
        ],
      },

      // Service Grid

      ServiceGrid: {
        title: "Our Services",

        subtitle: "Professional solutions for your business",

        description: "Choose from our comprehensive range of services",

        services: [
          {
            name: "Consulting",

            description: "Expert business consulting services",

            icon: "",

            link: "/services/consulting",
          },

          {
            name: "Implementation",

            description: "Seamless system implementation",

            icon: "",

            link: "/services/implementation",
          },

          {
            name: "Training",

            description: "Comprehensive training programs",

            icon: "",

            link: "/services/training",
          },

          {
            name: "Support",

            description: "Ongoing support and maintenance",

            icon: "",

            link: "/services/support",
          },
        ],
      },

      // Training Sections

      TrainingProgramsSectionAlt: {
        programsSection: {
          title: "Our Training Programs",

          description:
            "Comprehensive training solutions designed to empower your team with the skills they need to excel",

          image: "/images/training.jpg",

          Professional_Badge: "Certified Training",
        },

        trainingPrograms: {
          programs: [
            {
              id: 1,

              title: "NetSuite Fundamentals",

              shortDescription: "Core concepts and navigation basics",

              longDescription:
                "This comprehensive fundamentals program introduces you to the core concepts of NetSuite, covering essential navigation, basic configuration, and understanding the platform's architecture.",
            },

            {
              id: 2,

              title: "Advanced Modules",

              shortDescription: "Financial management and reporting",

              longDescription:
                "Dive deep into NetSuite's advanced modules with focus on financial management, advanced reporting, and complex business processes.",
            },
          ],
        },
      },

      TrainingWhyChooseSection: {
        whyChooseSection: {
          title: "Why Choose Our Training?",

          description:
            "We provide world-class training solutions that combine expertise, innovation, and practical application to ensure your team's success",

          image: "/images/indleaders.jpg",

          Professional_Badge: "Excellence Training",
        },

        trainingFeatures: [
          {
            id: 1,

            title: "Expert Instructors",

            shortDescription:
              "Certified professionals with years of experience",

            detailedDescription:
              "Our instructors are certified NetSuite professionals with extensive real-world experience across various industries.",

            benefits: [
              "Industry-proven expertise with 10+ years of NetSuite experience",

              "Multiple NetSuite certifications (Administrator, Developer, Consultant)",

              "Real-world implementation experience across 500+ projects",
            ],
          },

          {
            id: 2,

            title: "Hands-on Learning",

            shortDescription: "Practical exercises with real-world scenarios",

            detailedDescription:
              "Our training methodology emphasizes practical, hands-on learning through real-world scenarios and interactive exercises.",

            benefits: [
              "Live NetSuite sandbox environments for each student",

              "Real business scenarios from actual client implementations",

              "Step-by-step guided exercises with immediate feedback",
            ],
          },
        ],
      },

      TrainingKeyModulesSection: {
        keyModulesSection: {
          title: "Key Training Modules",

          description:
            "Comprehensive curriculum designed to master NetSuite from foundation to advanced implementation",
        },

        keyModules: [
          {
            title: "System Architecture",

            description:
              "Core system structure, data flow, and integration patterns",

            duration: "8 hours",
          },

          {
            title: "Financial Management",

            description:
              "General ledger, budgeting, financial reporting, and analytics",

            duration: "12 hours",
          },
        ],
      },

      TrainingCTASection: {
        title: "Ready to Start Your Training Journey?",

        subtitle: "Transform your skills with our expert-led programs",

        description:
          "Join thousands of professionals who have enhanced their capabilities through our training programs",

        ctaButton: {
          text: "Enroll Now",

          link: "/contact",

          variant: validateVariant("primary"),
        },

        features: [
          "Flexible scheduling",

          "Expert instructors",

          "Hands-on learning",

          "Industry certification",
        ],

        backgroundImage: "/images/TrainingWhy.jpg",
      },

      TrainingPricingSection: {
        title: "Training Program Pricing",

        subtitle: "Choose the perfect training plan for your team",

        description:
          "Flexible pricing options to fit your learning needs and budget",

        plans: [
          {
            name: "Individual",

            price: "$299",

            period: "per person",

            description: "Perfect for individual learners",

            features: [
              "Access to all modules",

              "Self-paced learning",

              "Certificate of completion",

              "Email support",
            ],

            cta: "Get Started",

            popular: false,
          },

          {
            name: "Team",

            price: "$199",

            period: "per person",

            description: "Ideal for small teams (5-20 people)",

            features: [
              "Group discounts",

              "Team progress tracking",

              "Dedicated support",

              "Custom scheduling",
            ],

            cta: "Get Started",

            popular: true,
          },

          {
            name: "Enterprise",

            price: "Custom",

            period: "pricing",

            description: "For large organizations",

            features: [
              "Unlimited participants",

              "Custom curriculum",

              "On-site training",

              "24/7 support",

              "Dedicated account manager",
            ],

            cta: "Contact Sales",

            popular: false,
          },
        ],
      },

      TrainingFAQSection: {
        title: "Training Frequently Asked Questions",

        subtitle: "Everything you need to know about our training programs",

        description:
          "Find answers to common questions about our training services",

        faqs: [
          {
            question: "What is the duration of each training program?",

            answer:
              "Our training programs range from 1-5 days depending on the complexity and depth of the subject matter. Each program is designed to provide comprehensive coverage while respecting your time constraints.",
          },

          {
            question: "Do you provide certificates upon completion?",

            answer:
              "Yes, we provide industry-recognized certificates upon successful completion of our training programs. These certificates demonstrate your proficiency in the covered topics.",
          },

          {
            question: "Can training be customized for our specific needs?",

            answer:
              "Absolutely! We offer customized training programs tailored to your organization's specific requirements, industry, and skill levels. Our expert instructors can adapt content to match your business context.",
          },

          {
            question: "What learning formats do you offer?",

            answer:
              "We offer multiple learning formats including in-person workshops, virtual live sessions, self-paced online modules, and hybrid approaches to accommodate different learning preferences and schedules.",
          },
        ],
      },

      TrainingTestimonialsSection: {
        title: "What Our Participants Say",

        subtitle: "Success stories from our training graduates",

        description:
          "Hear from professionals who have transformed their careers through our training programs",

        testimonials: [
          {
            name: "Sarah Johnson",

            position: "IT Manager",

            company: "TechCorp Solutions",

            content:
              "The training program exceeded my expectations. The hands-on approach and real-world scenarios made learning both practical and engaging.",

            rating: 5,

            image: "/images/testimonials/sarah.jpg",
          },

          {
            name: "Michael Chen",

            position: "Senior Developer",

            company: "InnovateTech",

            content:
              "The expert instructors and comprehensive curriculum helped me advance my skills significantly. Highly recommended for anyone looking to upskill.",

            rating: 5,

            image: "/images/testimonials/michael.jpg",
          },
        ],
      },

      // Integration Sections

      IntegrationTypesSectionAlt: {
        title: "Integration Types",

        subtitle: "Multiple ways to connect",

        description: "Choose the integration method that best fits your needs",

        types: [
          {
            name: "REST APIs",

            description: "Modern API-based integration",

            icon: "",
          },

          {
            name: "iPaaS",

            description: "Integration Platform as a Service",

            icon: "",
          },

          {
            name: "File‑based",

            description: "Batch file processing",

            icon: "",
          },

          {
            name: "Webhooks",

            description: "Real-time event notifications",

            icon: "",
          },
        ],
      },

      IntegrationBenefitsSectionAlt: {
        title: "Integration Benefits",

        subtitle: "Why integrate with NetSuite",

        description: "Unlock the full potential of your business systems",

        benefits: [
          {
            title: "Fewer Manual Tasks",

            description: "Automate data entry and reduce errors",

            icon: "",
          },

          {
            title: "Real‑time Data",

            description: "Get instant updates across all systems",

            icon: "",
          },

          {
            title: "Higher Accuracy",

            description: "Eliminate data inconsistencies",

            icon: "",
          },

          {
            title: "Better Visibility",

            description: "Unified view of your business data",

            icon: "",
          },
        ],
      },

      // Customization Sections

      CustomizationServicesSectionAlt: {
        title: "What We Customize",

        subtitle: "Comprehensive customization services",

        description: "Tailor NetSuite to match your unique business processes",

        services: [
          {
            name: "Workflows",

            description: "Automate approvals and processes",

            icon: "",
          },

          {
            name: "Scripts",

            description: "Server and client logic",

            icon: "",
          },

          {
            name: "UI",

            description: "Forms, fields, and dashboards",

            icon: "",
          },

          {
            name: "Reports",

            description: "Custom reporting and analytics",

            icon: "",
          },
        ],
      },

      CustomizationProcessSectionAlt: {
        title: "Customization Process",

        subtitle: "Our proven approach",

        description: "A structured methodology for successful customization",

        steps: [
          {
            title: "Requirements",

            description: "Gather and analyze your needs",

            duration: "1 week",

            step: "01",
          },

          {
            title: "Design",

            description: "Create solution blueprint",

            duration: "1 week",

            step: "02",
          },

          {
            title: "Development",

            description: "Build and test customizations",

            duration: "2-4 weeks",

            step: "03",
          },

          {
            title: "Deployment",

            description: "Implement and train users",

            duration: "1 week",

            step: "04",
          },
        ],
      },

      // Manufacturing Sections

      ManufacturingChallengesSectionAlt: {
        title: "Manufacturing Challenges",

        subtitle: "Common pain points we solve",

        challenges: [
          {
            title: "Inventory Management",

            description: "Complex inventory tracking across multiple locations",

            impact: "High",
          },

          {
            title: "Production Planning",

            description: "Difficulty in planning and scheduling production",

            impact: "High",
          },

          {
            title: "Quality Control",

            description: "Maintaining consistent quality standards",

            impact: "Medium",
          },

          {
            title: "Compliance",

            description: "Meeting industry regulations and standards",

            impact: "High",
          },
        ],
      },

      ManufacturingSolutionsSectionAlt: {
        title: "Manufacturing Solutions",

        subtitle: "Comprehensive NetSuite solutions",

        description: "Tailored solutions for manufacturing businesses",

        solutions: [
          {
            title: "Production Management",

            description: "End-to-end production planning and execution",

            features: ["Work orders", "Routing", "Capacity planning"],
          },

          {
            title: "Inventory Control",

            description: "Advanced inventory management capabilities",

            features: ["Multi-location", "Serial tracking", "Cycle counting"],
          },

          {
            title: "Quality Management",

            description: "Built-in quality control processes",

            features: ["Inspections", "Non-conformance", "Corrective actions"],
          },
        ],
      },

      ManufacturingCTASection: {
        title: "Transform Your Manufacturing Operations",

        subtitle: "Get started with NetSuite for manufacturing",

        description: "Join leading manufacturers using NetSuite",

        ctaButton: {
          text: "Schedule Demo",

          link: "/manufacturing/demo",

          variant: validateVariant("primary"),
        },
      },

      // // Retail Sections

      RetailIndustryStatsSection: {
        title: "Retail Industry Stats",

        subtitle: "The evolving retail landscape",

        stats: [
          {
            label: "Omnichannel Growth",

            value: "85%",

            description:
              "of retailers are investing in omnichannel capabilities",
          },

          {
            label: "Customer Expectations",

            value: "78%",

            description: "expect seamless online and offline experiences",
          },

          {
            label: "Inventory Accuracy",

            value: "95%",

            description: "accuracy needed for successful omnichannel retail",
          },
        ],
      },

      RetailChallengesSectionAlt: {
        title: "Retail Challenges",

        subtitle: "Modern retail pain points",

        challenges: [
          {
            title: "Omnichannel Complexity",

            description: "Managing multiple sales channels effectively",

            impact: "High",
          },

          {
            title: "Inventory Visibility",

            description: "Real-time inventory across all channels",

            impact: "High",
          },

          {
            title: "Customer Experience",

            description: "Delivering consistent customer experience",

            impact: "High",
          },

          {
            title: "Seasonal Demand",

            description: "Managing fluctuating demand patterns",

            impact: "Medium",
          },
        ],
      },

      RetailSolutionsSection: {
        title: "NetSuite Solutions",

        subtitle: "Comprehensive Retail Solutions",

        description: "Comprehensive retail solutions that unify your commerce operations, from inventory management to customer experience optimization.",

        image: "https://i.pinimg.com/736x/5d/33/74/5d33743cd85ff60ff425a2614a87503f.jpg",

        netSuiteSolutions: [
          {
            title: "Omnichannel Commerce",

            description: "Unified commerce across all channels",

            icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",

            features: ["POS integration", "E-commerce", "Mobile commerce"],

            benefits: "50% increase in online sales",
          },

          {
            title: "Inventory Management",

            description: "Advanced inventory optimization",

            icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",

            features: [
              "Real-time tracking",

              "Demand forecasting",

              "Automated reordering",
            ],

            benefits: "30% reduction in stockouts",
          },

          {
            title: "Customer Management",

            description: "360-degree customer view",

            icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",

            features: [
              "Customer profiles",

              "Purchase history",

              "Loyalty programs",
            ],

            benefits: "40% improvement in satisfaction",
          },
        ],
      },

      RetailFeaturesSection: {
        title: "Retail Features",

        subtitle: "Key capabilities for retail success",

        retailFeatures: [
          {
            id: "feature-1",

            title: "Point of Sale",

            description: "Modern POS system with offline capability",

            icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",

            benefits: ["Faster checkout", "Offline mode", "Flexible payments"],
          },

          {
            id: "feature-2",

            title: "E-commerce Integration",

            description: "Seamless online and offline integration",

            icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",

            benefits: ["Unified inventory", "Real-time sync", "Multi-channel"],
          },

          {
            id: "feature-3",

            title: "Inventory Optimization",

            description: "AI-powered inventory management",

            icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",

            benefits: ["Reduce stockouts", "Demand forecasting", "Lower costs"],
          },

          {
            id: "feature-4",

            title: "Customer Analytics",

            description: "Advanced customer insights and reporting",

            icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",

            benefits: ["Unified profiles", "Purchase history", "Personalized offers"],
          },
        ],
      },

      RetailCaseStudiesSection: {
        title: "Retail Case Studies",

        subtitle: "Success stories from retail clients",

        caseStudies: [
          {
            company: "FashionForward",

            industry: "Fashion Retail",

            challenge: "Omnichannel inventory management",

            solution: "NetSuite retail implementation",

            results: "50% improvement in inventory accuracy",
          },

          {
            company: "ElectroMart",

            industry: "Electronics Retail",

            challenge: "Seasonal demand management",

            solution: "Advanced demand planning",

            results: "35% reduction in stockouts",
          },
        ],
      },

      // RetailImplementationSection: {

      //   title: "Retail Implementation",

      //   subtitle: "Specialized retail implementation",

      //   description: "Our retail-specific implementation approach",

      //   phases: [

      //     {

      //       title: "Retail Assessment",

      //       description: "Analyze current retail operations",

      //       duration: "2 weeks",

      //     },

      //     {

      //       title: "Channel Integration",

      //       description: "Integrate all sales channels",

      //       duration: "4 weeks",

      //     },

      //     {

      //       title: "Inventory Setup",

      //       description: "Configure inventory management",

      //       duration: "2 weeks",

      //     },

      //     {

      //       title: "Go-Live Support",

      //       description: "Launch and provide ongoing support",

      //       duration: "2 weeks",

      //     },

      //   ],

      // },

      RetailCTASection: {
        title: "Transform Your Retail Business",

        subtitle: "Get started with NetSuite for retail",

        description: "Join successful retailers using NetSuite",

        ctaButton: {
          text: "Schedule Demo",

          link: "/retail/demo",

          variant: validateVariant("primary"),
        },
      },

      // About Sections

      AboutMissionSectionAlt: {
        title: "",

        subtitle: "",

        description: "",

        vision: "",

        additionalContent: "",

        image: "",

        stats: [],

        missionPoints: [],
      },

      AboutValuesSectionAlt: {
        title: "Our Values",

        subtitle: "What drives us",

        description:
          "Our core values guide everything we do and shape our company culture",

        values: [
          {
            title: "Integrity",

            description:
              "We operate with honesty and transparency in all our interactions",

            icon: "",
          },

          {
            title: "Innovation",

            description:
              "We continuously seek new and better ways to solve problems",

            icon: "",
          },

          {
            title: "Customer Success",

            description: "Our success is measured by our customers' success",

            icon: "",
          },

          {
            title: "Collaboration",

            description: "We believe in the power of working together",

            icon: "",
          },
        ],
      },

      AboutTeamSectionAlt: {
        title: "Our Team",

        subtitle: "Meet the experts behind our success",

        description:
          "Our diverse team of professionals brings together decades of experience in technology and business transformation",

        teamMembers: [
          {
            name: "John Smith",

            position: "CEO & Founder",

            bio: "20+ years in technology leadership",

            image: "/images/team/john.jpg",

            linkedin: "https://linkedin.com/in/johnsmith",
          },

          {
            name: "Sarah Johnson",

            position: "CTO",

            bio: "Expert in enterprise architecture and cloud solutions",

            image: "/images/team/sarah.jpg",

            linkedin: "https://linkedin.com/in/sarahjohnson",
          },

          {
            name: "Mike Chen",

            position: "VP of Services",

            bio: "Specialist in implementation and project management",

            image: "/images/team/mike.jpg",

            linkedin: "https://linkedin.com/in/mikechen",
          },
        ],
      },

      AboutJourneySectionAlt: {
        title: "Our Journey",

        subtitle: "From startup to industry leader",

        description: "A timeline of our company's growth and key milestones",

        timeline: [
          {
            year: "2010",

            title: "Company Founded",

            description:
              "Started with a vision to transform business through technology",
          },

          {
            year: "2015",

            title: "First Major Client",

            description:
              "Successfully implemented NetSuite for Fortune 500 company",
          },

          {
            year: "2020",

            title: "Global Expansion",

            description: "Expanded operations to serve clients worldwide",
          },

          {
            year: "2024",

            title: "Industry Recognition",

            description: "Recognized as top NetSuite implementation partner",
          },
        ],
      },

      AboutMilestonesSection: {
        title: "Key Milestones",

        subtitle: "Our achievements over the years",

        description:
          "Significant milestones that mark our journey of growth and success",

        milestones: [
          {
            title: "500+ Projects",

            description: "Successfully completed implementations",

            icon: "",
          },

          {
            title: "50+ Team Members",

            description: "Growing team of certified professionals",

            icon: "",
          },

          {
            title: "15+ Countries",

            description: "Serving clients globally",

            icon: "",
          },

          {
            title: "99% Success Rate",

            description: "Project success rate",

            icon: "",
          },
        ],
      },

      AboutDifferentiatorsSectionAlt: {
        title: "What Sets Us Apart",

        subtitle: "Our competitive advantages",

        description:
          "The unique qualities that make us the preferred choice for NetSuite implementations",

        differentiators: [
          {
            title: "Deep Expertise",

            description:
              "Certified professionals with extensive NetSuite experience",

            icon: "",
          },

          {
            title: "Industry Focus",

            description: "Specialized knowledge across multiple industries",

            icon: "",
          },

          {
            title: "Proven Methodology",

            description: "Repeatable, predictable implementation process",

            icon: "",
          },

          {
            title: "Ongoing Support",

            description: "Comprehensive post-implementation support",

            icon: "",
          },
        ],
      },

      AboutCTASection: {
        title: "Ready to Work With Us?",

        subtitle: "Let's transform your business together",

        description:
          "Get in touch to discuss how we can help your business succeed",

        ctaButton: {
          text: "Contact Us",

          link: "/contact",

          variant: validateVariant("primary"),
        },
      },

      // Missing Implementation Components

      ImplementationCTASectionAlt: {
        title: "Ready for a Seamless NetSuite Implementation?",

        subtitle:
          "Transform your business operations with our expert NetSuite implementation services",

        description:
          "Get started with your NetSuite implementation today and transform your business operations",

        ctaButton: {
          text: "Get Started Today",

          link: "/implementation/contact",

          variant: "primary",
        },

        features: [
          {
            title: "Quick Response",

            description: "Get a detailed proposal within 24 hours",

            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          },

          {
            title: "Proven Success",

            description: "99.9% implementation success rate",

            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          },

          {
            title: "Expert Support",

            description: "Dedicated team of certified professionals",

            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          },
        ],
      },

      // Service Grid Component

      ServiceGridAlt: {
        title: "Our Professional Services",

        subtitle: "Comprehensive solutions for your business needs",

        description:
          "Choose from our wide range of professional services designed to help your business succeed",

        services: [
          {
            name: "NetSuite Implementation",

            description: "Complete NetSuite setup and configuration",

            icon: "",

            link: "/services/implementation",

            features: ["System setup", "Data migration", "User training"],

            price: "Starting at $4,900",
          },

          {
            name: "NetSuite Consulting",

            description: "Expert guidance and strategic planning",

            icon: "",

            link: "/services/consulting",

            features: [
              "Business analysis",

              "Process optimization",

              "Strategic planning",
            ],

            price: "Custom pricing",
          },

          {
            name: "NetSuite Integration",

            description: "Connect NetSuite with your existing systems",

            icon: "",

            link: "/services/integration",

            features: [
              "API integration",

              "Data synchronization",

              "System connectivity",
            ],

            price: "Starting at $2,500",
          },

          {
            name: "NetSuite Customization",

            description: "Tailor NetSuite to your specific needs",

            icon: "",

            link: "/services/customization",

            features: ["Custom fields", "Workflows", "Reports & dashboards"],

            price: "Starting at $1,500",
          },

          {
            name: "NetSuite Training",

            description: "Comprehensive training programs",

            icon: "",

            link: "/services/training",

            features: [
              "User training",

              "Admin training",

              "Certification programs",
            ],

            price: "Starting at $500",
          },

          {
            name: "NetSuite Support",

            description: "Ongoing support and maintenance",

            icon: "",

            link: "/services/support",

            features: [
              "24/7 support",

              "System maintenance",

              "Performance optimization",
            ],

            price: "Monthly plans",
          },
        ],
      },

      // Additional Missing Components

      PayrollCTASection: {
        title: "Ready to Streamline Your Payroll?",

        subtitle: "Transform your payroll operations with NetSuite",

        description: "Get started with automated payroll management today",

        ctaButton: {
          text: "Schedule Payroll Demo",

          link: "/payroll/demo",

          variant: "primary",
        },

        benefits: [
          "Reduce payroll processing time by 75%",

          "Ensure 100% compliance with regulations",

          "Automated tax calculations and filings",

          "Real-time payroll reporting",
        ],
      },

      ManufacturingCTASectionAlt: {
        title: "Ready to Transform Manufacturing?",

        subtitle: "Optimize your manufacturing operations with NetSuite",

        description: "Streamline production, inventory, and quality management",

        ctaButton: {
          text: "Schedule Manufacturing Demo",

          link: "/manufacturing/demo",

          variant: "primary",
        },

        benefits: [
          "Real-time production visibility",

          "Optimized inventory management",

          "Quality control automation",

          "Cost reduction strategies",
        ],
      },

      RetailCTASectionAlt: {
        title: "Ready to Revolutionize Retail?",

        subtitle: "Transform your retail operations with NetSuite",

        description: "Unify online and offline retail experiences",

        ctaButton: {
          text: "Schedule Retail Demo",

          link: "/retail/demo",

          variant: "primary",
        },

        benefits: [
          "Omnichannel retail management",

          "Real-time inventory tracking",

          "Customer experience optimization",

          "Sales performance analytics",
        ],
      },

      TrainingCTASectionAlt: {
        title: "Ready to Enhance Your Skills?",

        subtitle: "Master NetSuite with our comprehensive training",

        description: "Empower your team with expert-led training programs",

        ctaButton: {
          text: "Enroll in Training",

          link: "/training/enroll",

          variant: "primary",
        },

        benefits: [
          "Expert-led training sessions",

          "Hands-on practical experience",

          "Certification programs available",

          "Flexible learning schedules",
        ],
      },

      ConsultingCTASection: {
        title: "Ready for Expert Consultation?",

        subtitle: "Get strategic guidance for your NetSuite journey",

        description: "Work with certified NetSuite consultants",

        ctaButton: {
          text: "Book Consultation",

          link: "/consulting/book",

          variant: "primary",
        },

        benefits: [
          "Strategic business analysis",

          "Process optimization guidance",

          "Best practices implementation",

          "ROI maximization strategies",
        ],
      },
    };
  };

  const getDefaultDataForComponent = (componentType) => {
    // PRIORITY 1: Check if we have defaultData from the component registry (availableComponents)
    const registryComponent = availableComponents.find(
      (c) => c.componentType === componentType,
    );

    if (
      registryComponent?.defaultData &&
      Object.keys(registryComponent.defaultData).length > 0
    ) {
      console.log(
        ` [DEFAULT DATA] Using registry defaultData for ${componentType}:`,
        Object.keys(registryComponent.defaultData),
      );
      return registryComponent.defaultData;
    }

    // PRIORITY 2: Use the generated default data from JSON (legacy support)

    const defaultData = generateDefaultDataFromJSON();

    // Get component-specific data

    const componentData = defaultData[componentType];

    if (componentData) {
      console.log(
        ` [DEFAULT DATA] Using generateDefaultDataFromJSON for ${componentType}:`,
        Object.keys(componentData),
      );
      return componentData;
    }

    // PRIORITY 3: Use Support component schemas (richly defined defaults)
    const supportSchema = getSupportComponentSchema(componentType);
    if (supportSchema?.defaultData) {
      console.log(
        ` [DEFAULT DATA] Using Support schema defaults for ${componentType}:`,
        Object.keys(supportSchema.defaultData),
      );
      return supportSchema.defaultData;
    }

    // PRIORITY 4: Return placeholder data if nothing found
    console.warn(
      `No default data defined for component: ${componentType}. Available in registry:`,

      availableComponents.map((c) => c.componentType).slice(0, 10),
    );

    return {
      title: "New Component Title",

      description: "Component description - please configure this component",

      content: "This component needs to be configured with proper data.",

      _isPlaceholder: true,
    };
  };

  // Helper function to set nested object values

  const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");

    const lastKey = keys.pop();

    const target = keys.reduce((acc, key) => {
      // Handle array indices

      if (key.includes("[") && key.includes("]")) {
        const [arrayKey, indexStr] = key.split("[");

        const index = parseInt(indexStr.replace("]", ""));

        if (!acc[arrayKey]) acc[arrayKey] = [];

        if (!acc[arrayKey][index]) acc[arrayKey][index] = {};

        return acc[arrayKey][index];
      }

      if (!acc[key]) acc[key] = {};

      return acc[key];
    }, obj);

    if (lastKey.includes("[") && lastKey.includes("]")) {
      const [arrayKey, indexStr] = lastKey.split("[");

      const index = parseInt(indexStr.replace("]", ""));

      if (!target[arrayKey]) target[arrayKey] = [];

      target[arrayKey][index] = value;
    } else {
      target[lastKey] = value;
    }

    return obj;
  };

  // Dynamic Input Generator for component-specific data

  const renderDynamicInputs = (
    data,

    prefix = "",

    level = 0,

    componentIndex = null,
  ) => {
    if (!data || typeof data !== "object") return null;

    return Object.entries(data).map(([key, value]) => {
      const fieldPath = prefix ? `${prefix}.${key}` : key;

      const indentClass = level > 0 ? `ml-${level * 4}` : "";

      if (Array.isArray(value)) {
        return (
          <div key={fieldPath} className={`mb-4 ${indentClass}`}>
            <label className="block text-sm font-medium text-white mb-2">
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}{" "}
              (Array)
            </label>

            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              {value.map((item, index) => (
                <div
                  key={`${fieldPath}[${index}]`}
                  className="mb-3 p-2 border border-gray-100 rounded bg-white"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-600">
                      Item {index + 1}
                    </span>

                    <button
                      onClick={() =>
                        handleRemoveArrayItem(fieldPath, index, componentIndex)
                      }
                      className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                      type="button"
                    >
                      Remove
                    </button>
                  </div>

                  {renderDynamicInputs(
                    item,

                    `${fieldPath}[${index}]`,

                    level + 1,

                    componentIndex,
                  )}
                </div>
              ))}

              <button
                onClick={() =>
                  handleAddArrayItem(fieldPath, value[0] || {}, componentIndex)
                }
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                type="button"
              >
                Add {key.slice(0, -1)} {/* Remove 's' from plural */}
              </button>
            </div>
          </div>
        );
      }

      if (typeof value === "object" && value !== null) {
        return (
          <div key={fieldPath} className={`mb-4 ${indentClass}`}>
            <label className="block text-sm font-medium text-white mb-2">
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
            </label>

            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              {renderDynamicInputs(value, fieldPath, level + 1, componentIndex)}
            </div>
          </div>
        );
      }

      // Handle primitive values (string, number, boolean)

      return (
        <div key={fieldPath} className={`mb-4 ${indentClass}`}>
          <label className="block text-sm font-medium text-white mb-2">
            {key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1")}
          </label>

          {typeof value === "boolean" ? (
            <input
              type="checkbox"
              checked={value}
              onChange={(e) =>
                handleInputChange(fieldPath, e.target.checked, componentIndex)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          ) : value && typeof value === "string" && value.length > 100 ? (
            <textarea
              value={value}
              onChange={(e) =>
                handleInputChange(fieldPath, e.target.value, componentIndex)
              }
              text-black
              rows={3}
            />
          ) : (
            <input
              type={typeof value === "number" ? "number" : "text"}
              value={value || ""}
              onChange={(e) =>
                handleInputChange(
                  fieldPath,

                  typeof value === "number"
                    ? Number(e.target.value)
                    : e.target.value,

                  componentIndex,
                )
              }
              text-black
              placeholder={`Enter ${key

                .replace(/([A-Z])/g, " $1")

                .toLowerCase()}`}
            />
          )}
        </div>
      );
    });
  };

  // Handle input changes with real-time preview update

  const handleInputChange = (fieldPath, value, componentIndex) => {
    if (componentIndex !== null && pageData.components[componentIndex]) {
      const component = pageData.components[componentIndex];

      console.log(" [INPUT CHANGE]", {
        componentType: component.componentType,

        fieldPath,

        value,

        componentIndex,

        currentContentJson: component.contentJson,
      });

      // Parse current content data

      let currentData;

      try {
        const defaultData = generateDefaultDataFromJSON();

        currentData = component.contentJson
          ? JSON.parse(component.contentJson)
          : defaultData[component.componentType] || {};
      } catch {
        // ...existing code...

        const defaultData = generateDefaultDataFromJSON();

        currentData = defaultData[component.componentType] || {};
      }

      // Create updated data with the new value

      const updatedData = { ...currentData };

      setNestedValue(updatedData, fieldPath, value);

      console.log(" [INPUT CHANGE] Updated data:", updatedData);

      // Update the component with new data - using updateComponent function

      const updatedComponents = [...pageData.components];

      updatedComponents[componentIndex] = {
        ...updatedComponents[componentIndex],

        contentJson: JSON.stringify(updatedData, null, 2),
      };

      setPageData((prev) => ({
        ...prev,

        components: updatedComponents,
      }));
    }
  };

  // Handle adding new array items

  const handleAddArrayItem = (fieldPath, templateItem = {}, componentIndex) => {
    if (componentIndex !== null && pageData.components[componentIndex]) {
      const component = pageData.components[componentIndex];

      // Parse current content data

      let currentData;

      try {
        const defaultData = generateDefaultDataFromJSON();

        currentData = component.contentJson
          ? JSON.parse(component.contentJson)
          : defaultData[component.componentType] || {};
      } catch {
        const defaultData = generateDefaultDataFromJSON();

        currentData = defaultData[component.componentType] || {};
      }

      const updatedData = { ...currentData };

      const keys = fieldPath.split(".");

      const target = keys.reduce((acc, key) => {
        if (!acc[key]) acc[key] = [];

        return acc[key];
      }, updatedData);

      if (Array.isArray(target)) {
        target.push(
          typeof templateItem === "object" ? { ...templateItem } : templateItem,
        );
      }

      // Update the component with new data

      const updatedComponents = [...pageData.components];

      updatedComponents[componentIndex] = {
        ...updatedComponents[componentIndex],

        contentJson: JSON.stringify(updatedData, null, 2),
      };

      setPageData((prev) => ({
        ...prev,

        components: updatedComponents,
      }));
    }
  };

  // Handle removing array items

  const handleRemoveArrayItem = (fieldPath, index, componentIndex) => {
    if (componentIndex !== null && pageData.components[componentIndex]) {
      const component = pageData.components[componentIndex];

      // Parse current content data

      let currentData;

      try {
        const defaultData = generateDefaultDataFromJSON();

        currentData = component.contentJson
          ? JSON.parse(component.contentJson)
          : defaultData[component.componentType] || {};
      } catch {
        const defaultData = generateDefaultDataFromJSON();

        currentData = defaultData[component.componentType] || {};
      }

      const updatedData = { ...currentData };

      const keys = fieldPath.split(".");

      const target = keys.reduce((acc, key) => acc[key], updatedData);

      if (Array.isArray(target)) {
        target.splice(index, 1);
      }

      // Update the component with new data

      const updatedComponents = [...pageData.components];

      updatedComponents[componentIndex] = {
        ...updatedComponents[componentIndex],

        contentJson: JSON.stringify(updatedData, null, 2),
      };

      setPageData((prev) => ({
        ...prev,

        components: updatedComponents,
      }));
    }
  };

  const saveComponentData = (updatedData) => {
    const componentIndex = editingComponent.index;

    const updatedComponents = [...pageData.components];

    const currentComponent = updatedComponents[componentIndex];

    // Update the component with new content data

    updatedComponents[componentIndex] = {
      ...currentComponent,

      content: updatedData,

      contentJson: JSON.stringify(updatedData, null, 2), // Update contentJson for API
    };

    // Update local state immediately for responsive UI

    setPageData((prev) => ({
      ...prev,

      components: updatedComponents,
    }));

    // Make API call to persist changes if component has ID

    if (currentComponent?.id && pageData.id) {
      const updateData = {
        id: currentComponent.id,

        pageId: pageData.id,

        componentType: currentComponent.componentType,

        componentName: currentComponent.componentName || "",

        contentJson: JSON.stringify(updatedData, null, 2),

        orderIndex:
          currentComponent.orderIndex !== undefined
            ? currentComponent.orderIndex
            : componentIndex,

        isVisible: Boolean(
          currentComponent.isVisible === true ||
          currentComponent.isVisible === 1,
        ),

        theme: currentComponent.theme || 1,
      };

      console.log(
        ` [EDIT SAVE] Updating component ${currentComponent.id} with edited data:`,

        {
          componentId: currentComponent.id,

          updateData,

          originalData: updatedData,
        },
      );

      // Make async API call

      pagesAPI

        .updatePageComponent(currentComponent.id, updateData)

        .then(() => {
          console.log(
            ` [EDIT SAVE] Component ${currentComponent.id} updated successfully`,
          );

          showToast("Section data saved successfully", "success");
        })

        .catch((error) => {
          console.error(
            ` [EDIT SAVE] Failed to update component ${currentComponent.id}:`,

            error,
          );

          showToast(`Failed to save section data: ${error.message}`, "error");

          // Revert the local changes on API failure

          setPageData((prevData) => {
            const revertedComponents = [...prevData.components];

            revertedComponents[componentIndex] = currentComponent; // Revert to original component

            return {
              ...prevData,

              components: revertedComponents,
            };
          });
        });
    } else {
      console.log(
        ` [EDIT SAVE] Skipping API update for component without ID:`,

        {
          componentId: currentComponent?.id,

          pageId: pageData.id,

          reason: !currentComponent?.id
            ? "Component not saved to database yet"
            : "No page ID available",
        },
      );

      showToast(
        "Section data updated locally (will be saved when page is published)",

        "info",
      );
    }

    setShowSectionEditor(false);

    setEditingComponent(null);
  };

  // Function to open new input modal

  const openNewInputModal = (component, componentIndex) => {
    console.log(
      " [NEW MODAL] Opening new input modal for component:",

      component,
    );

    setCurrentComponent({
      ...component,

      type: component.componentType,

      index: componentIndex,
    });

    setShowNewInputModal(true);
  };

  // Function to handle delete confirmation

  const handleDeleteClick = async (componentIndex) => {
    console.log(" [DELETE CLICK] Component to delete:", componentIndex);

    const component = pageData.components[componentIndex];

    try {
      setLoading(true);

      console.log(" [DELETE API] Deleting component:", component);

      // Create updated components array without the deleted component

      const updatedComponents = pageData.components.filter(
        (_, index) => index !== componentIndex,
      );

      // Update order indices for remaining components

      const reorderedComponents = updatedComponents.map((comp, index) => ({
        ...comp,

        orderIndex: index + 1,
      }));

      // Update page data

      const updatedPageData = {
        ...pageData,

        components: reorderedComponents,
      };

      setPageData(updatedPageData);

      showToast("Component deleted successfully", "success");

      console.log(" [DELETE API] Component deleted successfully");
    } catch (error) {
      console.error(" [DELETE API] Error deleting component:", error);

      showToast("Failed to delete component", "error");
    } finally {
      setLoading(false);
    }
  };

  // Legacy removeComponent function for backward compatibility

  const removeComponent = (componentIndex) => {
    handleDeleteClick(componentIndex);
  };

  const duplicateComponent = (componentIndex) => {
    const componentToDuplicate = pageData.components[componentIndex];

    const newComponent = {
      ...componentToDuplicate,

      // Don't assign orderIndex here, as it will be handled during save
    };

    // Add to the components array

    setPageData((prev) => {
      const updatedComponents = [...prev.components, newComponent];

      // Re-assign all orderIndex values to ensure they're sequential

      return {
        ...prev,

        components: updatedComponents.map((component, index) => ({
          ...component,

          orderIndex: index + 1,
        })),
      };
    });

    showToast("Section duplicated successfully", "success");
  };

  const moveComponent = (fromIndex, toIndex) => {
    const components = [...pageData.components];

    const [movedComponent] = components.splice(fromIndex, 1);

    components.splice(toIndex, 0, movedComponent);

    // Always re-assign all orderIndex values after reordering to ensure they're sequential

    const reorderedComponents = components.map((component, index) => ({
      ...component,

      orderIndex: index + 1, // Ensure orderIndex values are sequential and 1-based
    }));

    setPageData((prev) => ({
      ...prev,

      components: reorderedComponents,
    }));
  };

  // Reorder components with a new array (used by drag and drop)

  const reorderComponents = (newComponentsArray) => {
    // Ensure orderIndex values are sequential

    const reorderedComponents = newComponentsArray.map((component, index) => ({
      ...component,

      orderIndex: index + 1,
    }));

    setPageData((prev) => ({
      ...prev,

      components: reorderedComponents,
    }));
  };

  const handleSave = async (status = "draft") => {
    // Prevent multiple simultaneous API calls

    if (isSavingRef.current) {
      console.log(
        "Save operation already in progress, ignoring duplicate call",
      );

      return;
    }

    try {
      // Mark that we're currently saving

      isSavingRef.current = true;

      // Set appropriate loading state

      if (status === "published") {
        setIsPublishing(true);
      } else {
        setLoading(true);
      }

      // Apply default values to ensure no null, undefined, or empty values

      let createPageDTO = applyDefaultValues(pageData, status);

      console.log(" Applied default values to pageData:", {
        name: createPageDTO.name,

        categoryId: createPageDTO.categoryId,

        slug: createPageDTO.slug,

        metaTitle: createPageDTO.metaTitle,

        metaDescription: createPageDTO.metaDescription,

        componentsCount: createPageDTO.components?.length,

        status: status,
      });

      // If saving as draft, force isPublished to false

      if (status === "draft") {
        createPageDTO = { ...createPageDTO, isPublished: false };

        console.log(" Saving as draft, isPublished set to false");
      }

      // Unified required fields check for publish

      console.log(" Checking required fields for publish status:", status);

      if (status === "published") {
        const missingFields = [];

        if (!createPageDTO.name || !createPageDTO.name.trim()) {
          missingFields.push("Page Name (اسم الصفحة)");
        }

        if (!createPageDTO.categoryId) {
          missingFields.push("Category (الفئة)");
        }

        if (!createPageDTO.metaTitle || !createPageDTO.metaTitle.trim()) {
          missingFields.push("SEO Meta Title (عنوان الميتا)");
        }

        if (
          !createPageDTO.metaDescription ||
          !createPageDTO.metaDescription.trim()
        ) {
          missingFields.push("SEO Meta Description (وصف الميتا)");
        }

        if (missingFields.length > 0) {
          console.error(" Required fields missing for publish:", {
            hasName: !!createPageDTO.name?.trim(),

            hasCategoryId: !!createPageDTO.categoryId,

            hasMetaTitle: !!createPageDTO.metaTitle?.trim(),

            hasMetaDescription: !!createPageDTO.metaDescription?.trim(),

            missingFields: missingFields,
          });

          const errorMessage = `Cannot publish. Missing required fields: ${missingFields.join(", ")}`;

          showToast(errorMessage, "error");

          setLoading(false);

          setIsPublishing(false);

          isSavingRef.current = false;

          return;
        }
      }

      console.log(" Required fields check passed");

      // Validate required fields - use helper function to ensure lock is reset on validation errors

      const validateAndReturn = (message) => {
        console.error(" Validation failed:", message);

        showToast(message, "error");

        // Reset states before returning from validation error

        setLoading(false);

        setIsPublishing(false);

        isSavingRef.current = false;

        return;
      };

      console.log(" Validating page name...");

      if (!createPageDTO.name || !createPageDTO.name.trim()) {
        return validateAndReturn("Page name is required - اسم الصفحة مطلوب");
      }

      if (createPageDTO.name.trim().length < 2) {
        return validateAndReturn(
          "Page name must be at least 2 characters - اسم الصفحة يجب أن يكون حرفين على الأقل",
        );
      }

      if (createPageDTO.name.trim().length > 100) {
        return validateAndReturn(
          "Page name must be 100 characters or less - اسم الصفحة يجب أن يكون 100 حرف أو أقل",
        );
      }

      console.log(" Page name validated");

      console.log(" Validating category...");

      if (!createPageDTO.categoryId) {
        return validateAndReturn("Please select a category - يرجى اختيار فئة");
      }

      console.log(" Category validated");

      // SEO Meta Title required validation

      console.log(" Validating SEO Meta Title...");

      if (!createPageDTO.metaTitle || !createPageDTO.metaTitle.trim()) {
        return validateAndReturn(
          "SEO Meta Title is required - عنوان الميتا مطلوب",
        );
      }

      if (createPageDTO.metaTitle.trim().length > 70) {
        return validateAndReturn(
          "SEO Meta Title must be 70 characters or less - عنوان الميتا يجب أن يكون 70 حرفاً أو أقل",
        );
      }

      console.log(" SEO Meta Title validated");

      // SEO Meta Description required validation

      console.log(" Validating SEO Meta Description...");

      if (
        !createPageDTO.metaDescription ||
        !createPageDTO.metaDescription.trim()
      ) {
        return validateAndReturn(
          "SEO Meta Description is required - وصف الميتا مطلوب",
        );
      }

      if (createPageDTO.metaDescription.trim().length > 200) {
        return validateAndReturn(
          "SEO Meta Description must be 200 characters or less - وصف الميتا يجب أن يكون 200 حرفاً أو أقل",
        );
      }

      console.log(" SEO Meta Description validated");

      // Validate slug format after applying defaults

      console.log(" Validating slug format:", createPageDTO.slug);

      if (!createPageDTO.slug || createPageDTO.slug.trim() === "") {
        return validateAndReturn("Page slug is required - الـ Slug مطلوب");
      }

      if (!/^[a-z0-9-]+$/.test(createPageDTO.slug)) {
        return validateAndReturn(
          "Slug contains invalid characters. Only lowercase letters, numbers, and dashes allowed - الـ Slug يحتوي على أحرف غير صحيحة",
        );
      }

      console.log(" Slug format validated");

      // Validate components and orderIndex uniqueness

      console.log(" Starting component validation...", {
        totalComponents: createPageDTO.components?.length || 0,
      });

      if (createPageDTO.components && createPageDTO.components.length > 0) {
        const orderIndexes = new Set();

        for (let i = 0; i < createPageDTO.components.length; i++) {
          const comp = createPageDTO.components[i];
          console.log(
            ` Validating component ${i + 1}/${createPageDTO.components.length}:`,
            {
              componentType: comp.componentType,
              componentName: comp.componentName,
              orderIndex: comp.orderIndex,
              hasContent: !!comp.content,
              contentType: typeof comp.content,
            },
          );

          // Check component type
          if (!comp.componentType?.trim()) {
            console.error(` Component ${i + 1} missing componentType`);
            return validateAndReturn(
              `Component #${i + 1} is missing component type - المكون ${i + 1} يفتقد نوع المكون`,
            );
          }

          // Check component name
          if (!comp.componentName?.trim()) {
            console.error(` Component ${i + 1} missing componentName`);
            return validateAndReturn(
              `Component #${i + 1} (${comp.componentType}) is missing component name - المكون ${i + 1} يفتقد اسم المكون`,
            );
          }

          // Check content - normalize to object, don't error on invalid types
          // First, check if content is missing or falsy (except for valid empty objects/arrays)
          if (
            comp.content === undefined ||
            comp.content === null ||
            comp.content === false ||
            comp.content === 0 ||
            comp.content === ""
          ) {
            console.warn(
              ` Component ${i + 1} has missing/falsy content (${typeof comp.content}), using empty object`,
            );
            comp.content = {};
          } else if (typeof comp.content === "string") {
            // Content might be a JSON string, try to parse it
            try {
              console.log(
                ` Component ${i + 1} has string content, attempting JSON parse`,
              );
              const parsed = JSON.parse(comp.content);
              // After parsing, ensure we have an object
              if (parsed && typeof parsed === "object") {
                comp.content = parsed;
                console.log(` Component ${i + 1} content parsed successfully`);
              } else {
                console.warn(
                  ` Component ${i + 1} parsed to non-object (${typeof parsed}), using empty object`,
                );
                comp.content = {};
              }
            } catch (parseError) {
              // If it's not valid JSON, treat it as empty content
              console.warn(
                ` Component ${i + 1} has invalid JSON string content, using empty object`,
                parseError,
              );
              comp.content = {};
            }
          } else if (typeof comp.content !== "object") {
            // For any other non-object types (number, boolean, etc.), convert to empty object
            console.warn(
              ` Component ${i + 1} has non-object content (${typeof comp.content}), converting to empty object`,
            );
            comp.content = {};
          }
          // At this point, comp.content should always be an object
          console.log(
            ` Component ${i + 1} content validation passed, content type: ${typeof comp.content}`,
          );

          // Check orderIndex uniqueness
          const orderIndex = comp.orderIndex;
          if (orderIndexes.has(orderIndex)) {
            console.error(
              ` Duplicate orderIndex ${orderIndex} found in component ${i + 1}`,
            );
            return validateAndReturn(
              `Duplicate order index found (${orderIndex}). Each component must have a unique order - فهرس الترتيب مكرر`,
            );
          }
          orderIndexes.add(orderIndex);
          console.log(` Component ${i + 1} validation passed`);
        }
        console.log(" All components validated successfully");
      } else {
        console.log("ℹ No components to validate");
      }

      console.log(" Final data being sent to API:", createPageDTO);
      console.log(" Component summary:", {
        totalComponents: createPageDTO.components?.length || 0,
        componentTypes:
          createPageDTO.components?.map((c) => c.componentType) || [],
        orderIndexes: createPageDTO.components?.map((c) => c.orderIndex) || [],
      });

      // Check if we're updating an existing page or creating a new one
      const isExistingPage = pageData.id && !isNaN(parseInt(pageData.id));

      let response;

      if (isExistingPage) {
        console.log(
          " About to call pagesAPI.updatePage for existing page ID:",
          pageData.id,
        );

        // First update the page metadata
        const updatePageData = {
          id: pageData.id,
          name: createPageDTO.name,
          categoryId: createPageDTO.categoryId,
          slug: createPageDTO.slug,
          metaTitle: createPageDTO.metaTitle,
          metaDescription: createPageDTO.metaDescription,
          isHomepage: createPageDTO.isHomepage || false,
          isPublished: status === "published",
        };

        response = await pagesAPI.updatePage(pageData.id, updatePageData);
        console.log(" Page metadata updated successfully:", response);

        // Then update each component individually
        if (createPageDTO.components && createPageDTO.components.length > 0) {
          console.log(" Updating components for existing page...");

          for (const component of createPageDTO.components) {
            if (component.id) {
              // Update existing component
              const updateData = {
                id: component.id,
                pageId: pageData.id,
                componentType: component.componentType,
                componentName: component.componentName,
                contentJson:
                  typeof component.content === "string"
                    ? component.content
                    : JSON.stringify(component.content || {}),
                orderIndex: component.orderIndex,
                isVisible:
                  component.isVisible !== undefined
                    ? component.isVisible
                    : true,
                theme: component.theme !== undefined ? component.theme : 1,
              };

              await pagesAPI.updatePageComponent(component.id, updateData);
              console.log(` Updated component ${component.id}`);
            } else {
              // Create new component for existing page
              const createData = {
                componentType: component.componentType,
                componentName: component.componentName,
                contentJson:
                  typeof component.content === "string"
                    ? component.content
                    : JSON.stringify(component.content || {}),
                orderIndex: component.orderIndex,
                isVisible:
                  component.isVisible !== undefined
                    ? component.isVisible
                    : true,
                theme: component.theme !== undefined ? component.theme : 1,
              };

              await pagesAPI.createPageComponent(pageData.id, createData);
              console.log(` Created new component for existing page`);
            }
          }
        }

        console.log(" Page and components updated successfully!");
      } else {
        console.log(" About to call pagesAPI.createPage for new page...");
        // Make the API call to create page with components
        response = await pagesAPI.createPage(createPageDTO);
        console.log(" Page created successfully! Response:", response);
      }

      // Show appropriate success message based on status and action
      if (isExistingPage) {
        if (status === "published") {
          showToast(
            "Page updated and published successfully! - تم تحديث ونشر الصفحة بنجاح",
            "success",
          );
        } else {
          showToast(
            `Page "${createPageDTO.name}" updated successfully! - تم تحديث الصفحة بنجاح`,
            "success",
          );
        }
      } else {
        if (status === "published") {
          showToast(
            "Page published successfully! - تم نشر الصفحة بنجاح",
            "success",
          );
        } else {
          showToast(
            `Page "${createPageDTO.name}" saved as draft successfully! - تم حفظ الصفحة كمسودة`,
            "success",
          );
        }
      }

      // Bust image cache to ensure updated images display immediately
      updateMediaVersion();
      console.log(" [CACHE-BUST] Media version updated after page save");

      // Navigate to pages management after a brief delay
      setTimeout(() => {
        router.push("/admin/pages");
      }, 1500);
    } catch (error) {
      console.error(" Failed to save page:", error);
      console.error(" Error details:", {
        message: error.message,
        // From api.js normalized error
        status: error.status,
      });
      // Stringify details to see the full server response
      console.error(
        " Error details (stringified):",
        JSON.stringify(error.details, null, 2),
      );
      if (error.details?.errors) {
        console.error(
          " Validation errors:",
          JSON.stringify(error.details.errors, null, 2),
        );
      }

      // Better error message extraction
      let errorMessage = "Failed to save page - فشل حفظ الصفحة";

      const details = error.details;

      if (details) {
        // Handle different API error formats (normalized details from backend)
        if (typeof details === "string") {
          errorMessage = details;
        } else if (details.message) {
          errorMessage = details.message;
        } else if (details.title) {
          errorMessage = details.title;
        } else if (details.errors) {
          // ASP.NET validation errors format
          const errorDetails = Object.entries(details.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`,
            )
            .join("; ");
          errorMessage = `Validation failed - فشل التحقق: ${errorDetails}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Check for specific error types using normalized status
      const status = error.status;

      if (
        status === 409 ||
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.includes("slug")
      ) {
        errorMessage =
          "This page slug already exists. Please use a different name - الـ Slug موجود مسبقاً، استخدم اسم مختلف";
      } else if (status === 400) {
        errorMessage = `Invalid request - طلب غير صحيح: ${errorMessage}`;
      } else if (status === 500) {
        errorMessage =
          "Server error occurred. Please try again - حدث خطأ في الخادم، يرجى المحاولة مرة أخرى";
      } else if (
        !status &&
        error.message &&
        error.message.includes("Network")
      ) {
        errorMessage =
          "Network error. Please check your connection - خطأ في الاتصال، تحقق من الشبكة";
      }

      showToast(errorMessage, "error");
    } finally {
      // Reset loading states and save lock
      setLoading(false);
      setIsPublishing(false);
      isSavingRef.current = false;
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        // Require category selection
        return (
          pageData.categoryId !== null && pageData.categoryId !== undefined
        );
      case 2:
        // Page details validation - require valid slug
        return (
          pageData.slug &&
          pageData.slug.trim() !== "" &&
          /^[a-z0-9-]+$/.test(pageData.slug) &&
          slugAvailable &&
          !slugChecking &&
          !slugError
        );
      case 3:
        // Sections optional
        return true;
      case 4:
        // Review step always valid
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white text-xl font-bold">
                Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategorySelector
                value={pageData.categoryId}
                onChange={(id) => handlePageDataChange("categoryId", id)}
              />
              {!pageData.categoryId && (
                <div className="mt-3 text-xs text-red-300">
                  Please select a category to continue.
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <PageDetailsStep
            pageData={pageData}
            onDataChange={handlePageDataChange}
            slugChecking={slugChecking}
            slugAvailable={slugAvailable}
            slugError={slugError}
          />
        );
      case 3:
        return (
          <SectionsStep
            pageData={pageData}
            availableComponents={availableComponents}
            onAddComponent={addComponent}
            onUpdateComponent={updateComponent}
            onRemoveComponent={removeComponent}
            onDuplicateComponent={duplicateComponent}
            onMoveComponent={moveComponent}
            onReorderComponents={reorderComponents}
            componentSchemas={componentSchemas}
            showNewInputModal={showNewInputModal}
            setShowNewInputModal={setShowNewInputModal}
            currentComponent={currentComponent}
            openNewInputModal={openNewInputModal}
            useNewInputSystemState={useNewInputSystemState}
            setUseNewInputSystemState={setUseNewInputSystemState}
          />
        );
      case 4:
        return (
          <ReviewStep
            pageData={pageData}
            onSave={handleSave}
            loading={loading}
            setPageData={setPageData}
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  return (
    <MediaInputDetector>
      <div
        className="admin-component min-h-screen bg-[var(--color-brand-dark-navy)] relative overflow-hidden"
        data-dashboard="true"
      >
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-inverse)] mb-4 tracking-tight">
              Enhanced Page Builder
            </h1>
            <p className="text-lg text-[var(--color-text-inverse)] leading-relaxed opacity-80">
              Create dynamic pages with customizable sections and rich content
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="w-full h-2 bg-[var(--color-text-secondary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-500"
                style={{
                  width: `${
                    ((currentStep - 1) / (steps.length - 1)) * 100 || 0
                  }%`,
                }}
              />
            </div>
            <div
              className="mt-4 grid"
              style={{
                gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
              }}
            >
              {steps.map((step) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const isFuture = step.id > currentStep;

                return (
                  <div
                    key={step.id}
                    className="flex items-start space-x-3 group"
                  >
                    {/* Interactive Step Circle */}
                    <button
                      onClick={() => handleStepClick(step.id)}
                      disabled={isFuture}
                      className={`
                        flex items-center justify-center w-9 h-9 rounded-full border-2 
                        transition-all duration-200 transform
                        ${
                          isCompleted
                            ? "bg-[var(--tw-green-500)] border-[var(--tw-green-500)] text-[var(--color-text-inverse)] cursor-pointer hover:bg-[var(--tw-green-600)] hover:border-[var(--tw-green-600)] hover:scale-110 shadow-lg shadow-[var(--tw-green-500)]/25"
                            : isCurrent
                              ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-text-inverse)] cursor-default shadow-lg shadow-[var(--color-primary)]/25"
                              : "bg-transparent border-[var(--color-ww-100)] text-white cursor-not-allowed"
                        }
                        group-hover:shadow-lg
                      `}
                      title={
                        isCompleted
                          ? `Go back to ${step.title}`
                          : isCurrent
                            ? `Current step: ${step.title}`
                            : `Complete current steps first`
                      }
                    >
                      {isCompleted ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        <span className="text-xs font-semibold">{step.id}</span>
                      )}
                    </button>

                    {/* Step Info with Enhanced Styling */}
                    <div className="flex-1 min-w-0 transition-all duration-200">
                      <div className="text-white text-sm font-semibold transition-colors duration-200">
                        {step.title}
                      </div>
                      <div className="text-white text-xs transition-colors duration-200">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="w-full">{renderStepContent()}</div>

          {/* Navigation */}
          <div className="flex items-center justify-between w-full mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="bg-[var(--color-white-10)] backdrop-blur-sm border-[var(--color-white-20)] text-[var(--color-text-inverse)] hover:bg-[var(--color-white-20)] hover:border-[var(--color-white-30)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/pages")}
                className="bg-[var(--color-white-10)] backdrop-blur-sm border-[var(--color-white-20)] text-[var(--color-text-inverse)] hover:bg-[var(--color-white-20)] hover:border-[var(--color-white-30)] transition-all duration-200"
              >
                Cancel
              </Button>

              {currentStep >= 2 && pageData.components.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowPagePreview(true)}
                  className="bg-[var(--color-white-10)] backdrop-blur-sm border-[var(--color-white-20)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary)]/20 hover:border-[var(--color-primary-light)] transition-all duration-200"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Preview Page
                </Button>
              )}

              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:from-[var(--color-primary-dark)] hover:to-[var(--color-active)] text-[var(--color-text-inverse)] shadow-lg shadow-[var(--color-primary)]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              ) : (
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSave("draft")}
                    loading={loading && !isPublishing}
                    disabled={
                      !isStepValid(currentStep) || isPublishing || loading
                    }
                    className="bg-[var(--color-white-10)] backdrop-blur-sm border-[var(--color-white-20)] text-[var(--color-text-inverse)] hover:bg-[var(--color-white-20)] hover:border-[var(--color-white-30)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && !isPublishing ? "Saving..." : "Save as Draft"}
                  </Button>
                  <Button
                    onClick={() => handleSave("published")}
                    loading={isPublishing}
                    disabled={
                      !isStepValid(currentStep) || isPublishing || loading
                    }
                    className="bg-gradient-to-r from-[var(--tw-green-500)] to-[var(--tw-green-600)] hover:from-[var(--tw-green-600)] hover:to-[var(--tw-green-700)] text-[var(--color-text-inverse)] shadow-lg shadow-[var(--tw-green-500)]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPublishing ? "Publishing..." : "Publish Page"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Data Editor Modal */}
        {showSectionEditor && editingComponent && (
          <Modal
            isOpen={showSectionEditor}
            onClose={() => {
              setShowSectionEditor(false);
              setEditingComponent(null);
            }}
            title={`Configure ${editingComponent.componentName}`}
            maxWidth="4xl"
          >
            <div className="p-6">
              {/* Toggle between old and new input system */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Input System
                    </h3>
                    <p className="text-sm text-gray-500">
                      Choose between legacy and new component-specific input
                      system
                    </p>
                  </div>
                  <button
                    onClick={() => setUseNewInputSystem(!useNewInputSystem)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      useNewInputSystem ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        useNewInputSystem ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-gray-600">
                    {useNewInputSystem
                      ? "Using New Component-Specific System"
                      : "Using Legacy System"}
                  </span>
                </div>
              </div>

              {/* Conditional rendering based on system choice */}
              {useNewInputSystem ? (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingComponent.componentName} Configuration
                    </h3>
                    <p className="text-sm text-gray-600">
                      Configure component-specific settings and data
                    </p>
                  </div>

                  {/* Dynamic inputs based on component data structure */}

                  <div className="max-h-96 overflow-y-auto">
                    {(() => {
                      try {
                        const componentData = editingComponent.contentJson
                          ? JSON.parse(editingComponent.contentJson)
                          : getDefaultDataForComponent(
                              editingComponent.componentType,
                            );

                        const componentIndex = pageData.components.findIndex(
                          (comp) => comp.id === editingComponent.id,
                        );

                        return renderDynamicInputs(
                          componentData,

                          "",

                          0,

                          componentIndex,
                        );
                      } catch (error) {
                        console.error("Error rendering dynamic inputs:", error);

                        const defaultData = getDefaultDataForComponent(
                          editingComponent.componentType,
                        );

                        const componentIndex = pageData.components.findIndex(
                          (comp) => comp.id === editingComponent.id,
                        );

                        return renderDynamicInputs(
                          defaultData,

                          "",

                          0,

                          componentIndex,
                        );
                      }
                    })()}
                  </div>
                </div>
              ) : (
                <SectionDataEditor
                  isOpen={true}
                  onClose={() => {}}
                  section={{
                    name: editingComponent.componentName,

                    componentId: editingComponent.componentType,

                    icon: editingComponent.componentInfo?.icon || "",

                    // Prefer explicit content, then parsed contentJson, then any enhanced schema defaultData

                    data:
                      editingComponent.content ||
                      (editingComponent.contentJson
                        ? JSON.parse(editingComponent.contentJson)
                        : componentSchemas[editingComponent.componentType]
                            ?.defaultData || {}),
                  }}
                  onSave={saveComponentData}
                />
              )}
            </div>

            <ModalFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowSectionEditor(false);

                  setEditingComponent(null);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  setShowSectionEditor(false);

                  setEditingComponent(null);
                }}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </Modal>
        )}

        {/* Page Preview Modal */}

        <PagePreview
          isOpen={showPagePreview}
          onClose={() => setShowPagePreview(false)}
          pageData={pageData}
          availableComponents={availableComponents}
        />

        {/* Toast Notification */}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </MediaInputDetector>
  );
};

// CategorySelector, PageDetailsStep, and ReviewStep are now imported from ./EnhancedPageBuilder/

// Old definitions removed - see src/components/Admin/EnhancedPageBuilder/ folder

// PageDetailsStep is now imported from ./EnhancedPageBuilder/

// Old definition removed - see src/components/Admin/EnhancedPageBuilder/PageDetailsStep.jsx

// SectionsStep is now imported from ./EnhancedPageBuilder/

// Old definition removed - see src/components/Admin/EnhancedPageBuilder/SectionsStep/

export default EnhancedPageBuilder;
