import { useState, useEffect, useCallback } from "react";

import toast from "react-hot-toast";

import {

  getPublicSettings,

  getPublicDictionary,

} from "../services/legacy/settingsApi";

import { FOOTER_SETTINGS_MAP } from "../config/settingsMap";



/**

 * useSettingsSync Hook

 * Manages settings fetch, dirty tracking, and synchronization

 */

const useSettingsSync = () => {

  const [settings, setSettings] = useState({}); // { key: { id, value, ...SettingDTO } }

  const [dirtyFields, setDirtyFields] = useState(new Set());

  const [loading, setLoading] = useState(true);

  const [initialLoad, setInitialLoad] = useState(true);

  const [lastFetchTime, setLastFetchTime] = useState(null);



  /**

   * Fetch settings from API

   */

  const fetchSettings = useCallback(async (showToast = false) => {

    setLoading(true);



    try {

      // Fetch both public settings and dictionary in parallel

      const [settingsResponse, dictionaryResponse] = await Promise.all([

        getPublicSettings(),

        getPublicDictionary(),

      ]);



      if (settingsResponse.success && settingsResponse.data) {

        // Build settings map: { key: SettingDTO }

        const settingsMap = {};



        settingsResponse.data.forEach((setting) => {

          if (setting.key) {

            settingsMap[setting.key] = {

              id: setting.id,

              value: setting.value,

              description: setting.description,

              category: setting.category,

              isPublic: setting.isPublic,

              dataType: setting.dataType,

              createdAt: setting.createdAt,

              updatedAt: setting.updatedAt,

            };

          }

        });



        setSettings(settingsMap);

        setLastFetchTime(new Date());



        if (showToast) {

          toast.success("Settings refreshed successfully");

        }

      } else {

        throw new Error(settingsResponse.message || "Failed to fetch settings");

      }

    } catch (error) {

      console.error("Error fetching settings:", error);

      toast.error(error.message || "Failed to load settings");

    } finally {

      setLoading(false);

      setInitialLoad(false);

    }

  }, []);



  /**

   * Load settings on mount

   */

  useEffect(() => {

    fetchSettings(false);

  }, [fetchSettings]);



  /**

   * Get setting value by key

   */

  const getValue = useCallback(

    (key) => {

      return settings[key]?.value || "";

    },

    [settings]

  );



  /**

   * Get setting ID by key

   */

  const getId = useCallback(

    (key) => {

      return settings[key]?.id || null;

    },

    [settings]

  );



  /**

   * Get full setting object by key

   */

  const getSetting = useCallback(

    (key) => {

      return settings[key] || null;

    },

    [settings]

  );



  /**

   * Mark field as dirty

   */

  const markDirty = useCallback((key) => {

    setDirtyFields((prev) => new Set([...prev, key]));

  }, []);



  /**

   * Mark field as clean

   */

  const markClean = useCallback((key) => {

    setDirtyFields((prev) => {

      const next = new Set(prev);

      next.delete(key);

      return next;

    });

  }, []);



  /**

   * Clear all dirty flags

   */

  const clearDirty = useCallback(() => {

    setDirtyFields(new Set());

  }, []);



  /**

   * Check if field is dirty

   */

  const isDirty = useCallback(

    (key) => {

      return dirtyFields.has(key);

    },

    [dirtyFields]

  );



  /**

   * Check if any field is dirty

   */

  const hasAnyDirty = useCallback(() => {

    return dirtyFields.size > 0;

  }, [dirtyFields]);



  /**

   * Update local settings cache after save

   */

  const updateLocalSetting = useCallback(

    (key, settingData) => {

      console.log(

        ` [useSettingsSync] Updating local setting for "${key}":`,

        settingData

      );



      if (!key) {

        console.error(

          " [useSettingsSync] Cannot update setting - key is missing"

        );

        return;

      }



      if (!settingData) {

        console.error(

          ` [useSettingsSync] Cannot update setting for "${key}" - settingData is missing`

        );

        return;

      }



      setSettings((prev) => ({

        ...prev,

        [key]: {

          id: settingData.id,

          value: settingData.value,

          description: settingData.description,

          category: settingData.category,

          isPublic: settingData.isPublic,

          dataType: settingData.dataType,

          createdAt: settingData.createdAt,

          updatedAt: settingData.updatedAt,

        },

      }));

      markClean(key);

      console.log(` [useSettingsSync] Successfully updated "${key}"`);

    },

    [markClean]

  );



  /**

   * Remove setting from local cache after delete

   */

  const removeLocalSetting = useCallback(

    (key) => {

      setSettings((prev) => {

        const next = { ...prev };

        delete next[key];

        return next;

      });

      markClean(key);

    },

    [markClean]

  );



  /**

   * Get all field keys from settings map

   */

  const getAllKeys = useCallback(() => {

    return FOOTER_SETTINGS_MAP.map((field) => field.key);

  }, []);



  /**

   * Get settings for all defined fields + dynamic settings

   */

  const getAllFieldSettings = useCallback(() => {

    // Start with predefined fields from FOOTER_SETTINGS_MAP

    const predefinedFields = FOOTER_SETTINGS_MAP.map((field) => ({

      fieldDef: field,

      existingValue: getValue(field.key),

      existingId: getId(field.key),

      isDirty: isDirty(field.key),

    }));



    // Find dynamic settings (settings not in FOOTER_SETTINGS_MAP)

    const predefinedKeys = new Set(FOOTER_SETTINGS_MAP.map((f) => f.key));

    const dynamicSettings = Object.keys(settings)

      .filter((key) => !predefinedKeys.has(key))

      .map((key) => {

        const setting = settings[key];

        return {

          fieldDef: {

            key: key,

            label: key

              .split("_")

              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))

              .join(" "),

            placeholder: `Enter ${key}...`,

            dataType: setting.dataType || "string",

            category: setting.category || "footer",

            isPublicDefault:

              setting.isPublic !== undefined ? setting.isPublic : true,

            description: setting.description || `Dynamic setting: ${key}`,

            validation: {},

          },

          existingValue: setting.value || "",

          existingId: setting.id || null,

          isDirty: isDirty(key),

        };

      });



    // Combine predefined and dynamic settings

    return [...predefinedFields, ...dynamicSettings];

  }, [getValue, getId, isDirty, settings]);



  /**

   * Refresh settings

   */

  const refresh = useCallback(async () => {

    await fetchSettings(true);

    clearDirty();

  }, [fetchSettings, clearDirty]);



  return {

    // State

    settings,

    loading,

    initialLoad,

    lastFetchTime,

    dirtyFields,



    // Getters

    getValue,

    getId,

    getSetting,

    getAllKeys,

    getAllFieldSettings,



    // Dirty tracking

    markDirty,

    markClean,

    clearDirty,

    isDirty,

    hasAnyDirty,



    // Local cache updates

    updateLocalSetting,

    removeLocalSetting,



    // Actions

    fetchSettings,

    refresh,

  };

};



export default useSettingsSync;

