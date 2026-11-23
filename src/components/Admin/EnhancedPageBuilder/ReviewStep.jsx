import { useState } from "react";

import {

  ExclamationTriangleIcon,

} from "@heroicons/react/24/outline";

import { DndContext } from "@dnd-kit/core";

import {

  SortableContext,

  verticalListSortingStrategy,

} from "@dnd-kit/sortable";

import Card, { CardContent, CardHeader, CardTitle } from "../../UI/Card";

import { DraggableComponent } from "../DraggableComponent";

import pagesAPI from "../../../services/legacy/pagesAPI";



const ReviewStep = ({ pageData, setPageData, showToast }) => {

  const [isEditMode, setIsEditMode] = useState(true);

  const [availableComponents] = useState([

    { componentType: "HeroSection", icon: "" },

    { componentType: "HRHeroSection", icon: "" },

    { componentType: "PayrollHeroSection", icon: "" },

    { componentType: "HRModulesSection", icon: "" },

    { componentType: "ServiceGrid", icon: "" },

    { componentType: "ImplementationProcessSection", icon: "" },

    { componentType: "HRPricingSection", icon: "" },

    { componentType: "PayrollFAQSection", icon: "" },

    { componentType: "PayrollCTASection", icon: "" },

    { componentType: "AboutMissionSection", icon: "" },

    { componentType: "AboutTeamSection", icon: "" },

  ]);



  const getVisibleComponents = (components, isEditing = isEditMode) => {

    if (!Array.isArray(components)) return [];

    if (isEditing) return components;

    return components.filter(

      (component) =>

        component.isVisible === true || component.isVisible === 1

    );

  };



  const getComponentIcon = (componentType) => {

    return (

      availableComponents.find((c) => c.componentType === componentType)

        ?.icon || ""

    );

  };



  return (

    <div className="space-y-6">

      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">

        <CardHeader>

          <CardTitle className="text-white text-xl font-bold">

            Page Summary

          </CardTitle>

        </CardHeader>

        <CardContent className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-gray-400 mb-1">

                Page Name

              </label>

              <p className="text-white font-semibold">{pageData.name}</p>

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-400 mb-1">

                URL Slug

              </label>

              <p className="text-white font-semibold">/{pageData.slug}</p>

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-400 mb-1">

                Category ID

              </label>

              <p className="text-white font-semibold">{pageData.categoryId}</p>

            </div>

            <div>

              <label className="block text-sm font-medium text-gray-400 mb-1">

                Homepage

              </label>

              <p className="text-white font-semibold">

                {pageData.isHomepage ? "Yes" : "No"}

              </p>

            </div>

          </div>



          {pageData.metaTitle && (

            <div>

              <label className="block text-sm font-medium text-gray-400 mb-1">

                SEO Meta Title

              </label>

              <p className="text-white">{pageData.metaTitle}</p>

            </div>

          )}



          {pageData.metaDescription && (

            <div>

              <label className="block text-sm font-medium text-gray-400 mb-1">

                SEO Meta Description

              </label>

              <p className="text-white">{pageData.metaDescription}</p>

            </div>

          )}

        </CardContent>

      </Card>



      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">

        <CardHeader>

          <div className="flex justify-between items-center">

            <CardTitle className="text-white text-xl font-bold">

              Components ({getVisibleComponents(pageData.components).length}

              {!isEditMode &&

              pageData.components.length >

                getVisibleComponents(pageData.components).length

                ? ` of ${pageData.components.length}`

                : ""}

              )

            </CardTitle>

          </div>

        </CardHeader>

        <CardContent>

          {pageData.components.length === 0 ? (

            <div className="text-center py-8">

              <ExclamationTriangleIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />

              <p className="text-yellow-300">

                No components added to this page

              </p>

            </div>

          ) : (

            <DndContext

              onDragEnd={async ({ active, over }) => {

                if (!over || active.id === over.id) return;



                const ids = pageData.components.map((c, i) =>

                  c && c.id ? String(c.id) : `idx-${i}`

                );



                const oldIndex = ids.indexOf(String(active.id));

                const newIndex = ids.indexOf(String(over.id));

                if (oldIndex === -1 || newIndex === -1) return;



                const newComponents = [...pageData.components];

                const [moved] = newComponents.splice(oldIndex, 1);

                newComponents.splice(newIndex, 0, moved);



                const reordered = newComponents.map((c, idx) => ({

                  ...c,

                  orderIndex: idx + 1,

                }));



                setPageData((prev) => ({ ...prev, components: reordered }));



                try {

                  if (pageData && pageData.id) {

                    await pagesAPI.reorderPageComponents(

                      pageData.id,

                      reordered

                    );

                    if (typeof showToast === "function") {

                      showToast("Components reordered", "success");

                    }

                  }

                } catch (err) {

                  console.error(" [REORDER] Failed to persist component order:", err);

                  if (typeof showToast === "function") {

                    showToast("Failed to persist component order", "error");

                  }

                }

              }}

            >

              <SortableContext

                items={pageData.components.map((c, idx) =>

                  c && c.id ? String(c.id) : `idx-${idx}`

                )}

                strategy={verticalListSortingStrategy}

              >

                {pageData.components.map((component, index) => {

                  const isVisible =

                    component.isVisible === true || component.isVisible === 1;

                  const themeClass = component.theme === 1 ? "light" : "dark";

                  const itemId =

                    component && component.id

                      ? String(component.id)

                      : `idx-${index}`;



                  return (

                    <DraggableComponent key={itemId} id={itemId}>

                      <div

                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${

                          !isVisible

                            ? "bg-red-500/10 border-red-400/30 opacity-60"

                            : component.theme === 1

                            ? "bg-yellow-500/10 border-yellow-400/30"

                            : "bg-gray-500/10 border-gray-400/30"

                        }`}

                        style={{ display: isVisible ? "flex" : "none" }}

                        data-theme={themeClass}

                      >

                        <div

                          className="text-xl cursor-move"

                          title="Drag to reorder"

                        >

                          {getComponentIcon(component.componentType)}

                        </div>

                        <div className="flex-1">

                          <h4 className="text-white font-medium">

                            {component.componentName}

                          </h4>

                          <p className="text-gray-400 text-sm">

                            {component.componentType}

                          </p>

                        </div>

                        <div className="text-gray-400 text-sm">

                          Order: {component.orderIndex}

                        </div>

                      </div>

                    </DraggableComponent>

                  );

                })}

              </SortableContext>

            </DndContext>

          )}

        </CardContent>

      </Card>

    </div>

  );

};



export default ReviewStep;



