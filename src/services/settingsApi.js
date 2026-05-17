/**

 * Settings API Service

 * Complete implementation of all Settings API endpoints

 * Base URL: http://bellatrix.runasp.net/api (configured in api.js)

 */



import api from "../lib/api";



/**

 * GET /api/Settings/public

 * Fetch all public settings with full metadata

 * @returns {Promise<Object>} { success, data: SettingDTO[], message }

 */

export const getPublicSettings = async () => {

  try {

    const response = await api.get("/Settings/public");



    // The interceptor already unwraps response.data.data to response.data

    // So we need to wrap it back in the expected format

    return {

      success: true,

      data: response.data,

      message: "Settings retrieved successfully",

    };

  } catch (error) {

    console.error(" [Settings API] Error fetching public settings:", error);

    return {

      success: false,

      data: null,

      message: error.message || "Failed to fetch public settings",

    };

  }

};



/**

 * GET /api/Settings/public/dictionary

 * Fetch public settings as key-value dictionary

 * @returns {Promise<Object>} { success, data: { [key]: value }, message }

 */

export const getPublicDictionary = async () => {

  try {

    const response = await api.get("/Settings/public/dictionary");



    return {

      success: true,

      data: response.data,

      message: "Dictionary retrieved successfully",

    };

  } catch (error) {

    console.error(" [Settings API] Error fetching public dictionary:", error);

    return {

      success: false,

      data: null,

      message: error.message || "Failed to fetch dictionary",

    };

  }

};



/**

 * GET /api/Settings

 * Fetch all settings (admin access)

 * @returns {Promise<Object>} { success, data: SettingDTO[], message }

 */

export const getAllSettings = async () => {

  try {

    const response = await api.get("/Settings");

    return {

      success: true,

      data: response.data,

      message: "Settings retrieved successfully",

    };

  } catch (error) {

    console.error(" [Settings API] Error fetching all settings:", error);

    return {

      success: false,

      data: null,

      message: error.message || "Failed to fetch settings",

    };

  }

};



/**

 * GET /api/Settings/grouped

 * Fetch settings grouped by category

 * @returns {Promise<Object>} { success, data: SettingsByCategoryDTO[], message }

 */

export const getSettingsGrouped = async () => {

  try {

    const response = await api.get("/Settings/grouped");

    return {

      success: true,

      data: response.data,

      message: "Grouped settings retrieved successfully",

    };

  } catch (error) {

    console.error(" [Settings API] Error fetching grouped settings:", error);

    return {

      success: false,

      data: null,

      message: error.message || "Failed to fetch grouped settings",

    };

  }

};



/**

 * GET /api/Settings/dictionary

 * Fetch all settings as key-value dictionary (admin access)

 * @returns {Promise<Object>} { success, data: Record<string,string>, message }

 */

export const getSettingsDictionary = async () => {

  try {

    const response = await api.get("/Settings/dictionary");

    return {

      success: true,

      data: response.data,

      message: "Settings dictionary retrieved successfully",

    };

  } catch (error) {

    console.error(

      " [Settings API] Error fetching settings dictionary:",

      error

    );

    return {

      success: false,

      data: null,

      message: error.message || "Failed to fetch settings dictionary",

    };

  }

};



/**

 * GET /api/Settings/key/{key}

 * Fetch a single setting by key

 * @param {string} key - Setting key

 * @returns {Promise<Object>} { success, data: SettingDTO, message }

 */

export const getSettingByKey = async (key) => {

  try {

    const response = await api.get(`/Settings/key/${encodeURIComponent(key)}`);

    return {

      success: true,

      data: response.data,

      message: "Setting retrieved successfully",

    };

  } catch (error) {

    console.error(

      ` [Settings API] Error fetching setting by key '${key}':`,

      error

    );

    return {

      success: false,

      data: null,

      message: error.message || `Failed to fetch setting with key '${key}'`,

    };

  }

};



/**

 * GET /api/Settings/{id}

 * Fetch a single setting by ID

 * @param {number} id - Setting ID

 * @returns {Promise<Object>} { success, data: SettingDTO, message }

 */

export const getSettingById = async (id) => {

  try {

    const response = await api.get(`/Settings/${id}`);

    return {

      success: true,

      data: response.data,

      message: "Setting retrieved successfully",

    };

  } catch (error) {

    console.error(

      ` [Settings API] Error fetching setting by ID ${id}:`,

      error

    );

    return {

      success: false,

      data: null,

      message: error.message || `Failed to fetch setting with ID ${id}`,

    };

  }

};



/**

 * GET /api/Settings/search?searchTerm=...

 * Search settings by term

 * @param {string} searchTerm - Search query

 * @returns {Promise<Object>} { success, data: SettingDTO[], message }

 */

export const searchSettings = async (searchTerm) => {

  try {

    const response = await api.get("/Settings/search", {

      params: { searchTerm },

    });

    return {

      success: true,

      data: response.data,

      message: "Search completed successfully",

    };

  } catch (error) {

    console.error(

      ` [Settings API] Error searching settings with term '${searchTerm}':`,

      error

    );

    return {

      success: false,

      data: null,

      message: error.message || "Failed to search settings",

    };

  }

};



/**

 * GET /api/Settings/exists?key=...&excludeId=...

 * Check if a setting key exists

 * @param {string} key - Setting key to check

 * @param {number} [excludeId] - Optional ID to exclude from check

 * @returns {Promise<Object>} { success, data: boolean, message }

 */

export const checkKeyExists = async (key, excludeId = null) => {

  try {

    const params = { key };

    if (excludeId !== null) {

      params.excludeId = excludeId;

    }

    const response = await api.get("/Settings/exists", { params });

    return {

      success: true,

      data: response.data,

      message: "Key existence checked successfully",

    };

  } catch (error) {

    console.error(

      ` [Settings API] Error checking existence of key '${key}':`,

      error

    );

    return {

      success: false,

      data: null,

      message: error.message || "Failed to check key existence",

    };

  }

};



/**

 * POST /api/Settings

 * Create a new setting

 * @param {Object} payload - CreateSettingDTO

 * @param {string} payload.key - Setting key (2-100 chars)

 * @param {string} payload.value - Setting value (required)

 * @param {string} [payload.description] - Description (0-500 chars)

 * @param {string} [payload.category] - Category (0-50 chars)

 * @param {boolean} [payload.isPublic] - Is public (default: false)

 * @param {string} [payload.dataType] - Data type (0-50 chars)

 * @returns {Promise<Object>} { success, data: SettingDTO, message }

 */

export const createSetting = async (payload) => {

  try {

    console.log(" [Settings API] Creating setting:", payload);

    const response = await api.post("/Settings", payload);

    console.log(" [Settings API] Setting created:", response.data);

    return {

      success: true,

      data: response.data,

      message: "Setting created successfully",

    };

  } catch (error) {

    console.error(" [Settings API] Error creating setting:", error);

    return {

      success: false,

      data: null,

      message: error.message || "Failed to create setting",

    };

  }

};



/**

 * PUT /api/Settings

 * Update an existing setting

 * @param {Object} payload - UpdateSettingDTO

 * @param {number} payload.id - Setting ID (required)

 * @param {string} payload.key - Setting key (2-100 chars)

 * @param {string} payload.value - Setting value (required)

 * @param {string} [payload.description] - Description (0-500 chars)

 * @param {string} [payload.category] - Category (0-50 chars)

 * @param {boolean} [payload.isPublic] - Is public

 * @param {string} [payload.dataType] - Data type (0-50 chars)

 * @returns {Promise<Object>} { success, data: SettingDTO, message }

 */

export const updateSetting = async (payload) => {

  try {

    console.log(" [Settings API] Updating setting:", payload);

    const response = await api.put("/Settings", payload);

    console.log(" [Settings API] Setting updated:", response.data);

    return {

      success: true,

      data: response.data,

      message: "Setting updated successfully",

    };

  } catch (error) {

    console.error(" [Settings API] Error updating setting:", error);

    return {

      success: false,

      data: null,

      message: error.message || "Failed to update setting",

    };

  }

};



/**

 * PUT /api/Settings/bulk

 * Bulk update multiple settings

 * @param {Array<Object>} payload - Array of UpdateSettingDTO

 * @returns {Promise<Object>} { success, data: boolean, message }

 */

export const bulkUpdateSettings = async (payload) => {

  try {

    console.log(

      " [Settings API] Bulk updating settings:",

      payload.length,

      "items"

    );

    const response = await api.put("/Settings/bulk", payload);

    console.log(" [Settings API] Bulk update completed");

    return {

      success: true,

      data: response.data,

      message: "Bulk update completed successfully",

    };

  } catch (error) {

    console.error(" [Settings API] Error bulk updating settings:", error);

    return {

      success: false,

      data: null,

      message: error.message || "Failed to bulk update settings",

    };

  }

};



/**

 * DELETE /api/Settings/{id}

 * Delete a setting by ID

 * @param {number} id - Setting ID

 * @returns {Promise<Object>} { success, data: boolean, message }

 */

export const deleteSetting = async (id) => {

  try {

    console.log(" [Settings API] Deleting setting ID:", id);

    const response = await api.delete(`/Settings/${id}`);

    console.log(" [Settings API] Setting deleted");

    return {

      success: true,

      data: response.data,

      message: "Setting deleted successfully",

    };

  } catch (error) {

    console.error(` [Settings API] Error deleting setting ID ${id}:`, error);

    return {

      success: false,

      data: null,

      message: error.message || "Failed to delete setting",

    };

  }

};



/**

 * GET /api/Settings/category/{category}

 * Fetch settings by category

 * @param {string} category - Category name

 * @returns {Promise<Object>} { success, data: SettingDTO[], message }

 */

export const getSettingsByCategory = async (category) => {

  try {

    const response = await api.get(

      `/Settings/category/${encodeURIComponent(category)}`

    );

    return {

      success: true,

      data: response.data,

      message: "Settings retrieved successfully",

    };

  } catch (error) {

    console.error(

      ` [Settings API] Error fetching settings for category '${category}':`,

      error

    );

    return {

      success: false,

      data: null,

      message:

        error.message || `Failed to fetch settings for category '${category}'`,

    };

  }

};

