import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllComponents,
  componentCategories,
} from "../../data/componentRegistry";
import { loadComponent } from "../../components/componentMap";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/UI/Card";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

/**
 * Components Showcase Page
 * Displays all available components from the Enhanced Page Builder
 * as if they were rendered from backend data
 */
const ComponentsShowcase = () => {
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [expandedComponent, setExpandedComponent] = useState(null);
  const [previewComponent, setPreviewComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadedComponents, setLoadedComponents] = useState({});

  // Load all components on mount
  useEffect(() => {
    const loadAllComponents = async () => {
      try {
        setLoading(true);
        const allComponents = getAllComponents();
        console.log(" [ComponentsShowcase] Loaded components:", allComponents.length);
        setComponents(allComponents);
        setFilteredComponents(allComponents);
      } catch (error) {
        console.error(" [ComponentsShowcase] Error loading components:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllComponents();
  }, []);

  // Filter components based on category and search
  useEffect(() => {
    let filtered = [...components];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((comp) => comp.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (comp) =>
          comp.componentName?.toLowerCase().includes(term) ||
          comp.componentType?.toLowerCase().includes(term) ||
          comp.description?.toLowerCase().includes(term) ||
          comp.category?.toLowerCase().includes(term)
      );
    }

    setFilteredComponents(filtered);
  }, [components, selectedCategory, searchTerm]);

  // Dynamically load component for preview
  const loadComponentForPreview = async (componentType) => {
    if (loadedComponents[componentType]) {
      return loadedComponents[componentType];
    }

    try {
      const ComponentModule = await loadComponent(componentType);
      const Component = ComponentModule?.default || ComponentModule;
      setLoadedComponents((prev) => ({
        ...prev,
        [componentType]: Component,
      }));
      return Component;
    } catch (error) {
      console.error(`Failed to load component ${componentType}:`, error);
      return null;
    }
  };

  // Handle component preview
  const handlePreview = async (component) => {
    const Component = await loadComponentForPreview(component.componentType);
    if (Component) {
      setPreviewComponent({
        ...component,
        Component,
      });
    }
  };

  // Copy component JSON to clipboard
  const copyToClipboard = (component) => {
    const json = JSON.stringify(
      {
        componentType: component.componentType,
        componentName: component.componentName,
        category: component.category,
        defaultData: component.defaultData || {},
        dataStructure: component.dataStructure || {},
      },
      null,
      2
    );
    navigator.clipboard.writeText(json);
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      hero: "from-purple-500 to-indigo-600",
      content: "from-blue-500 to-cyan-600",
      features: "from-emerald-500 to-teal-600",
      benefits: "from-green-500 to-lime-600",
      pricing: "from-yellow-500 to-amber-600",
      process: "from-orange-500 to-red-600",
      team: "from-pink-500 to-rose-600",
      testimonials: "from-violet-500 to-purple-600",
      "social-proof": "from-fuchsia-500 to-pink-600",
      faq: "from-cyan-500 to-blue-600",
      cta: "from-red-500 to-orange-600",
      stats: "from-teal-500 to-emerald-600",
      timeline: "from-indigo-500 to-violet-600",
      "case-studies": "from-slate-500 to-gray-600",
      challenges: "from-amber-500 to-yellow-600",
      solutions: "from-lime-500 to-green-600",
    };
    return colors[category] || "from-gray-500 to-slate-600";
  };

  // Get category icon - icons removed
  const getCategoryIcon = (category) => {
    return "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Components Showcase
              </h1>
              <p className="text-gray-400 mt-1">
                {filteredComponents.length} components available • Enhanced Page Builder
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-cyan-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                <ViewColumnsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer min-w-[180px]"
              >
                <option value="all" className="bg-slate-800">All Categories</option>
                {componentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-800">
                    {cat.label}
                  </option>
                ))}
              </select>
              <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto px-4 py-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            All ({components.length})
          </button>
          {componentCategories.map((cat) => {
            const count = components.filter((c) => c.category === cat.id).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${getCategoryColor(cat.id)} text-white shadow-lg`
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <span>{getCategoryIcon(cat.id)}</span>
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Components Grid/List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredComponents.map((component, index) => (
                <ComponentCard
                  key={component.componentType}
                  component={component}
                  index={index}
                  onPreview={() => handlePreview(component)}
                  onCopy={() => copyToClipboard(component)}
                  getCategoryColor={getCategoryColor}
                  getCategoryIcon={getCategoryIcon}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredComponents.map((component, index) => (
                <ComponentListItem
                  key={component.componentType}
                  component={component}
                  index={index}
                  isExpanded={expandedComponent === component.componentType}
                  onToggle={() =>
                    setExpandedComponent(
                      expandedComponent === component.componentType
                        ? null
                        : component.componentType
                    )
                  }
                  onPreview={() => handlePreview(component)}
                  onCopy={() => copyToClipboard(component)}
                  getCategoryColor={getCategoryColor}
                  getCategoryIcon={getCategoryIcon}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredComponents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No components found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewComponent && (
          <PreviewModal
            component={previewComponent}
            onClose={() => setPreviewComponent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Component Card for Grid View
 */
const ComponentCard = ({
  component,
  index,
  onPreview,
  onCopy,
  getCategoryColor,
  getCategoryIcon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Card className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300">
        {/* Category Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(
            component.category
          )} text-white shadow-lg`}
        >
          {getCategoryIcon(component.category)} {component.category}
        </div>

        <CardContent className="p-6">
          {/* Component Type */}
          <div className="text-cyan-400 text-sm font-mono mb-2">
            {component.componentType}
          </div>

          {/* Component Name */}
          <h3 className="text-xl font-bold text-white mb-3">
            {component.componentName}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {component.description || "No description available"}
          </p>

          {/* Page Type */}
          {component.pageType && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg mb-4">
              {component.pageType}
            </div>
          )}

          {/* Default Data Indicator */}
          {component.defaultData && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-lg mb-4 ml-2">
              Has Default Data
            </div>
          )}

          {/* Data Structure Preview */}
          {component.dataStructure && (
            <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-500 mb-2">Data Structure:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(component.dataStructure).map(([key, type]) => (
                  <span
                    key={key}
                    className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded"
                  >
                    {key}: <span className="text-cyan-400">{type}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={onPreview}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <EyeIcon className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={onCopy}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              title="Copy JSON"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * Component List Item for List View
 */
const ComponentListItem = ({
  component,
  index,
  isExpanded,
  onToggle,
  onPreview,
  onCopy,
  getCategoryColor,
  getCategoryIcon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all"
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          {/* Category Icon */}
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryColor(
              component.category
            )} flex items-center justify-center text-2xl`}
          >
            {getCategoryIcon(component.category)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">
                {component.componentName}
              </h3>
              <span className="text-cyan-400 text-xs font-mono">
                {component.componentType}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              {component.description || "No description"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            <DocumentDuplicateIcon className="w-5 h-5" />
          </button>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Component Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Component Details
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Page Type:</span>
                    <span className="text-purple-300">
                      {component.pageType || "General"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Category:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs bg-gradient-to-r ${getCategoryColor(
                        component.category
                      )} text-white`}
                    >
                      {component.category}
                    </span>
                  </div>
                  {component.filePath && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">File:</span>
                      <span className="text-cyan-400 text-xs font-mono">
                        {component.filePath}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Structure */}
              {component.dataStructure && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Data Structure
                  </h4>
                  <pre className="bg-slate-800 rounded-lg p-3 text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(component.dataStructure, null, 2)}
                  </pre>
                </div>
              )}

              {/* Default Data */}
              {component.defaultData && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Default Data
                  </h4>
                  <pre className="bg-slate-800 rounded-lg p-3 text-xs text-gray-300 overflow-x-auto max-h-48">
                    {JSON.stringify(component.defaultData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Preview Modal
 */
const PreviewModal = ({ component, onClose }) => {
  const { Component, defaultData = {} } = component;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">
              {component.componentName}
            </h3>
            <p className="text-sm text-gray-400">{component.componentType}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="overflow-auto max-h-[calc(90vh-80px)]">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
                />
              </div>
            }
          >
            {Component ? (
              <div className="bg-white">
                <Component data={defaultData} {...defaultData} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <CodeBracketIcon className="w-16 h-16 mb-4" />
                <p>Component could not be loaded</p>
              </div>
            )}
          </Suspense>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ComponentsShowcase;
