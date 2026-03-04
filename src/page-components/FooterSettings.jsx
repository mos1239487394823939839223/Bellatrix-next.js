import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Button from "../components/UI/Button";
import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/UI/Card";
import SettingField from "../components/SettingField";
import AddSettingModal from "../components/AddSettingModal";
import useSettingsSync from "../hooks/useSettingsSync";
import { FOOTER_SETTINGS_MAP } from "../constants/settingsMap";
import {
  bulkUpdateSettings,
  createSetting,
  getPublicSettings,
  getSettingByKey,
} from "../services/settingsApi";

/**
 * FooterSettings Component
 * Main page for managing footer settings with tabs and bulk operations
 */
const FooterSettings = () => {
  // Add Setting Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Custom hook for settings management
  const {
    loading,
    getAllFieldSettings,
    updateLocalSetting,
    removeLocalSetting,
    refresh,
    clearDirty,
    dirtyFields,
    markDirty,
  } = useSettingsSync();

  // Footer settings with current values
  const [footerSettings, setFooterSettings] = useState([]);

  // Bulk save state
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  /**
   * Load footer settings when data changes
   */
  useEffect(() => {
    if (!loading) {
      const settings = getAllFieldSettings();
      setFooterSettings(settings);
    }
  }, [loading, getAllFieldSettings]);

  /**
   * Handle single field save success
   */
  const handleFieldSaveSuccess = (updatedSetting) => {
    console.log(" [FooterSettings] Received save success:", updatedSetting);

    // updatedSetting is the SettingDTO returned from API
    if (updatedSetting && updatedSetting.key) {
      updateLocalSetting(updatedSetting.key, updatedSetting);
      // Refresh footer settings
      const settings = getAllFieldSettings();
      setFooterSettings(settings);
      console.log(" [FooterSettings] Field saved and UI refreshed");
    } else {
      console.error(
        " [FooterSettings] Invalid updatedSetting received:",
        updatedSetting
      );
    }
  };

  /**
   * Handle bulk save
   * - Items with ID → PUT /api/Settings/bulk
   * - Items without ID → POST /api/Settings (individually)
   */
  const handleBulkSave = async () => {
    const dirtyKeysArray = Array.from(dirtyFields);

    if (dirtyKeysArray.length === 0) {
      toast.error("No changes to save");
      return;
    }

    setIsBulkSaving(true);

    try {
      const itemsToUpdate = [];
      const itemsToCreate = [];

      // Categorize dirty items
      footerSettings.forEach((item) => {
        if (dirtyKeysArray.includes(item.fieldDef.key)) {
          const fieldDef = item.fieldDef;
          const currentValue = item.existingValue || "";

          if (item.existingId) {
            // Has ID → update
            itemsToUpdate.push({
              id: item.existingId,
              key: fieldDef.key,
              value: currentValue,
              description: fieldDef.description || "",
              category: fieldDef.category || "footer",
              isPublic:
                fieldDef.isPublicDefault !== undefined
                  ? fieldDef.isPublicDefault
                  : true,
              dataType: fieldDef.dataType || "string",
            });
          } else {
            // No ID → create
            itemsToCreate.push({
              key: fieldDef.key,
              value: currentValue,
              description: fieldDef.description || "",
              category: fieldDef.category || "footer",
              isPublic:
                fieldDef.isPublicDefault !== undefined
                  ? fieldDef.isPublicDefault
                  : true,
              dataType: fieldDef.dataType || "string",
            });
          }
        }
      });

      let successCount = 0;
      let failCount = 0;

      // 1⃣ Bulk update existing items
      if (itemsToUpdate.length > 0) {
        try {
          const bulkResponse = await bulkUpdateSettings(itemsToUpdate);
          if (bulkResponse.success) {
            successCount += itemsToUpdate.length;
          } else {
            failCount += itemsToUpdate.length;
            toast.error(`Bulk update failed: ${bulkResponse.message}`);
          }
        } catch (err) {
          console.error("Bulk update error:", err);
          failCount += itemsToUpdate.length;
          toast.error("Bulk update failed");
        }
      }

      // 2⃣ Create new items individually (or update if they exist)
      if (itemsToCreate.length > 0) {
        for (const payload of itemsToCreate) {
          try {
            // First check if key exists in database
            console.log(
              ` [FooterSettings] Checking if key "${payload.key}" exists...`
            );
            const existingSettingResponse = await getSettingByKey(payload.key);

            if (
              existingSettingResponse.success &&
              existingSettingResponse.data
            ) {
              // Key exists - UPDATE instead of CREATE
              console.warn(
                ` [FooterSettings] Key "${payload.key}" already exists. Performing UPDATE.`
              );

              const existingSetting = existingSettingResponse.data;
              const updatePayload = {
                id: existingSetting.id,
                key: payload.key,
                value: payload.value,
                description:
                  payload.description || existingSetting.description || "",
                category:
                  payload.category || existingSetting.category || "footer",
                isPublic:
                  payload.isPublic !== undefined
                    ? payload.isPublic
                    : existingSetting.isPublic !== undefined
                    ? existingSetting.isPublic
                    : true,
                dataType:
                  payload.dataType || existingSetting.dataType || "string",
              };

              // Add to bulk update instead
              const updateResponse = await bulkUpdateSettings([updatePayload]);
              if (updateResponse.success) {
                successCount++;
                updateLocalSetting(payload.key, existingSetting);
              } else {
                failCount++;
                console.error(
                  `Update failed for ${payload.key}:`,
                  updateResponse.message
                );
              }
            } else {
              // Key doesn't exist - CREATE new
              const createResponse = await createSetting(payload);
              if (createResponse.success && createResponse.data) {
                successCount++;
                updateLocalSetting(
                  createResponse.data.key,
                  createResponse.data
                );
              } else {
                failCount++;
              }
            }
          } catch (err) {
            console.error(`Error processing ${payload.key}:`, err);
            failCount++;
          }
        }
      }

      // 3⃣ Refresh data from API
      await refresh();

      // 4⃣ Clear dirty flags
      clearDirty();

      // 5⃣ Show result
      if (failCount === 0) {
        toast.success(
          `Successfully saved ${successCount} ${
            successCount === 1 ? "setting" : "settings"
          }`
        );
      } else {
        toast.error(
          `Saved ${successCount}, failed ${failCount}. Check console for details.`
        );
      }

      // Reload footer settings
      const settings = getAllFieldSettings();
      setFooterSettings(settings);
    } catch (err) {
      console.error("Bulk save error:", err);
      toast.error("An error occurred during bulk save");
    } finally {
      setIsBulkSaving(false);
    }
  };

  /**
   * Handle refresh button
   */
  const handleRefresh = async () => {
    await refresh();
    const settings = getAllFieldSettings();
    setFooterSettings(settings);
    toast.success("Settings refreshed");
  };

  /**
   * Handle new setting created
   */
  const handleNewSettingCreated = async (newSetting) => {
    console.log(" [FooterSettings] New setting created:", newSetting);

    // Update local setting
    if (newSetting && newSetting.key) {
      updateLocalSetting(newSetting.key, newSetting);
    }

    // Refresh all settings
    await refresh();
    const settings = getAllFieldSettings();
    setFooterSettings(settings);

    toast.success("Settings list updated with new entry");
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="admin-component flex items-center justify-center h-64" data-dashboard="true">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-[var(--color-primary)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-ww-100)] text-lg">Loading footer settings...</p>
        </div>
      </div>
    );
  }

  /**
   * Main render
   */
  return (
    <div className="admin-component space-y-6 text-[var(--color-text-inverse)]" data-dashboard="true">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-inverse)] mb-1">
            Footer Settings
          </h2>
          <p className="text-[var(--color-ww-100)]">
            Manage footer content, contact information, and social media links
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleRefresh}
            className="border border-[var(--color-white-20)] hover:border-[var(--color-white-30)] !text-white hover:!text-white hover:bg-[var(--color-white-10)]"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </Button>

          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[var(--tw-green-600)] hover:bg-[var(--tw-green-700)] text-[var(--color-text-inverse)] shadow-lg hover:shadow-[var(--tw-green-500)]/25"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New
          </Button>

          <Button
            onClick={handleBulkSave}
            disabled={dirtyFields.size === 0 || isBulkSaving}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text-inverse)] shadow-lg hover:shadow-[var(--color-primary)]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBulkSaving ? (
              <>
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Save All ({dirtyFields.size})
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-[var(--color-white-10)] border border-[var(--color-white-20)] shadow-lg">
          <CardHeader className="border-b border-[var(--color-white-10)] pb-4">
            <CardTitle className="text-[var(--color-text-inverse)] text-xl font-semibold">
              Footer Field Settings
            </CardTitle>
            <p className="text-[var(--color-ww-100)] mt-2 text-sm">
              Configure individual footer settings. Changes are tracked and
              can be saved all at once.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {footerSettings.map((item) => (
                <SettingField
                  key={item.fieldDef.key}
                  fieldDef={item.fieldDef}
                  existingValue={item.existingValue}
                  existingId={item.existingId}
                  onSaveSuccess={handleFieldSaveSuccess}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Setting Modal */}
      <AddSettingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleNewSettingCreated}
      />
    </div>
  );
};

export default FooterSettings;
