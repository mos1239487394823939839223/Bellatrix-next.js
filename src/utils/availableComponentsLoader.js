import { getGeneralComponentSchema } from "../sections/schemas/generalComponentSchemas";
import { getAboutComponentSchema } from "../sections/schemas/aboutComponentSchemas";
import { getSupportComponentSchema } from "../sections/schemas/supportComponentSchemas";
import { categorizeComponent, getComponentIcon } from "./componentHelpers";

/**
 * Load the unified list of available components for the builders.
 * This mirrors the logic used by the Enhanced Page Builder so that
 * new page creation and existing page editing share the exact same
 * component catalogue.
 */
export const loadAvailableComponents = async () => {
    try {
        const { getAllComponents } = await import("../sections/schemas/componentRegistry");

        const registryComponents = getAllComponents();

        // Base list from the registry, enriched with general schemas
        const formattedComponents = registryComponents.map((comp) => {
            const generalSchema = getGeneralComponentSchema(comp.componentType);

            return {
                id: comp.componentType,
                name:
                    comp.componentName ||
                    generalSchema?.displayName ||
                    comp.componentType.replace(/([A-Z])/g, " $1").trim(),
                description: comp.description || generalSchema?.description,
                componentType: comp.componentType,
                componentName: comp.componentName,
                category: comp.category,
                hasEnhancedSchema: !!(
                    comp.defaultData ||
                    generalSchema?.defaultData ||
                    comp.schema ||
                    generalSchema?.schema
                ),
                schema: comp.schema || generalSchema?.schema,
                defaultData: comp.defaultData || generalSchema?.defaultData,
                filePath: comp.filePath,
                pageType: comp.pageType,
                dataStructure: comp.dataStructure,
            };
        });

        // Also include any components from the legacy componentMap
        // that are not already covered by the registry
        const { idToPathMap } = await import("../sections/componentMap");

        const registryComponentTypes = new Set(
            formattedComponents.map((c) => c.componentType),
        );

        const additionalItems = Object.keys(idToPathMap)
            .filter((componentType) => !registryComponentTypes.has(componentType))
            .map((componentType) => {
                const path = idToPathMap[componentType];
                const category = categorizeComponent(componentType, path);

                // Support-page specific enhanced schemas
                const supportSchema = getSupportComponentSchema(componentType);
                if (supportSchema) {
                    return {
                        id: componentType,
                        name: supportSchema.displayName,
                        description: supportSchema.description,
                        componentType,
                        componentName: supportSchema.componentName,
                        category: supportSchema.category,
                        hasEnhancedSchema: true,
                        schema: supportSchema.schema,
                        defaultData: supportSchema.defaultData,
                    };
                }

                // About-page specific enhanced schemas
                const aboutSchema = getAboutComponentSchema(componentType);
                if (aboutSchema) {
                    return {
                        id: componentType,
                        name: aboutSchema.displayName,
                        description: aboutSchema.description,
                        componentType,
                        componentName: aboutSchema.componentName,
                        category: aboutSchema.category,
                        hasEnhancedSchema: true,
                        schema: aboutSchema.schema,
                        defaultData: aboutSchema.defaultData,
                    };
                }

                // General enhanced schemas
                const generalSchema = getGeneralComponentSchema(componentType);
                if (generalSchema) {
                    return {
                        id: componentType,
                        name: generalSchema.displayName,
                        description: generalSchema.description,
                        componentType,
                        componentName: generalSchema.componentName,
                        category: generalSchema.category,
                        hasEnhancedSchema: true,
                        schema: generalSchema.schema,
                        defaultData: generalSchema.defaultData,
                    };
                }

                // Fallback component definition
                return {
                    id: componentType,
                    name: componentType.replace(/([A-Z])/g, " $1").trim(),
                    description: `Component: ${componentType}`,
                    componentType,
                    componentName: componentType,
                    category,
                    hasEnhancedSchema: false,
                    icon: getComponentIcon(componentType, category),
                };
            });

        const allComponents = [...formattedComponents, ...additionalItems];

        // Filter out specific components we never want to expose
        const excludedComponentTypes = [
            "RetailImplementationSection",
            "RetailIndustryStats",
        ];

        const filteredComponents = allComponents.filter(
            (comp) => !excludedComponentTypes.includes(comp.componentType),
        );

        return filteredComponents;
    } catch (e) {
        console.error("Failed to load component registry", e);
        return [];
    }
};
