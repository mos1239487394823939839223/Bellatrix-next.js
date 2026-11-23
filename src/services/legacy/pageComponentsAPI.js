import api from "./api.js";

/**
 * Page Components API service for handling component-related operations
 */
const pageComponentsAPI = {
  /**
   * Get all components for a specific page
   * @param {number} pageId - The page ID
   * @returns {Promise<Array>} Array of page components
   */
  async getPageComponents(pageId) {
    try {
      const response = await api.get(`/Pages/${pageId}/components`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching components for page ${pageId}:`, error);
      throw error;
    }
  },

  /**
   * Add a component to a page
   * @param {number} pageId - The page ID
   * @param {Object} componentData - Component data
   * @returns {Promise<Object>} Created component data
   */
  async addComponent(pageId, componentData) {
    try {
      // First, get existing components to determine the next orderIndex
      const existingComponents = await this.getPageComponents(pageId);

      // Find the maximum orderIndex value
      const maxOrderIndex =
        existingComponents.length > 0
          ? Math.max(...existingComponents.map((c) => c.orderIndex || 0))
          : -1;

      // Assign the next orderIndex (max + 1) if not provided
      const updatedComponentData = {
        ...componentData,
        orderIndex:
          componentData.orderIndex !== undefined
            ? componentData.orderIndex
            : maxOrderIndex + 1,
      };

      // Make sure contentJson is a string
      if (
        updatedComponentData.contentJson &&
        typeof updatedComponentData.contentJson !== "string"
      ) {
        updatedComponentData.contentJson = JSON.stringify(
          updatedComponentData.contentJson
        );
      }

      const response = await api.post(
        `/Pages/${pageId}/components`,
        updatedComponentData
      );
      return response.data;
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("duplicate key")
      ) {
        throw new Error(
          "Duplicate order index. Please reorder your components."
        );
      }
      console.error(`Error adding component to page ${pageId}:`, error);
      throw error;
    }
  },

  /**
   * Update a component
   * @param {number} componentId - The component ID
   * @param {Object} componentData - Updated component data
   * @returns {Promise<Object>} Updated component data
   */
  async updateComponent(componentId, componentData) {
    try {
      // Make sure contentJson is a string
      const updatedComponentData = { ...componentData };
      if (
        updatedComponentData.contentJson &&
        typeof updatedComponentData.contentJson !== "string"
      ) {
        updatedComponentData.contentJson = JSON.stringify(
          updatedComponentData.contentJson
        );
      }

      const response = await api.put(
        `/Components/${componentId}`,
        updatedComponentData
      );
      return response.data;
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("duplicate key")
      ) {
        throw new Error(
          "Duplicate order index. Please reorder your components."
        );
      }
      console.error(`Error updating component ${componentId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a component
   * @param {number} componentId - The component ID
   * @returns {Promise<void>}
   */
  async deleteComponent(componentId) {
    try {
      await api.delete(`/Components/${componentId}`);
    } catch (error) {
      console.error(`Error deleting component ${componentId}:`, error);
      throw error;
    }
  },

  /**
   * Reorder components for a page
   * @param {number} pageId - The page ID
   * @param {Array} componentIds - Array of component IDs in desired order
   * @returns {Promise<Object>} Response data
   */
  async reorderComponents(pageId, componentIds) {
    try {
      const response = await api.put(`/Pages/${pageId}/reorder-components`, {
        componentIds,
      });
      return response.data;
    } catch (error) {
      console.error(`Error reordering components for page ${pageId}:`, error);
      throw error;
    }
  },
};

export default pageComponentsAPI;
