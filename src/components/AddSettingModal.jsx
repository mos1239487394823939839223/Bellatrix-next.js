import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { XMarkIcon } from "@heroicons/react/24/outline";

import toast from "react-hot-toast";

import Button from "./UI/Button";

import { createSetting, getSettingByKey } from "../services/settingsApi";



/**

 * AddSettingModal Component

 * Modal for creating new settings dynamically

 */

const AddSettingModal = ({ isOpen, onClose, onSuccess }) => {

  const [key, setKey] = useState("");

  const [value, setValue] = useState("");

  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);



  /**

   * Reset form

   */

  const resetForm = () => {

    setKey("");

    setValue("");

    setDescription("");

  };



  /**

   * Handle form submission

   */

  const handleSubmit = async (e) => {

    e.preventDefault();



    // Validation

    if (!key.trim()) {

      toast.error("Setting key is required");

      return;

    }



    if (!value.trim()) {

      toast.error("Setting value is required");

      return;

    }



    // Validate key format (alphanumeric, underscores, hyphens)

    const keyRegex = /^[a-zA-Z0-9_-]+$/;

    if (!keyRegex.test(key)) {

      toast.error(

        "Invalid key format. Use only letters, numbers, underscores, and hyphens."

      );

      return;

    }



    setIsSubmitting(true);



    try {

      console.log(" [AddSettingModal] Checking if key exists:", key);



      // Check if key already exists

      const existsResponse = await getSettingByKey(key);



      if (existsResponse.success && existsResponse.data) {

        console.warn(" [AddSettingModal] Key already exists:", key);

        toast.error(

          `Setting with key "${key}" already exists. Please update the existing entry instead.`

        );

        setIsSubmitting(false);

        return;

      }



      console.log(" [AddSettingModal] Creating new setting:", key);



      // Create new setting with default metadata

      const payload = {

        key: key.trim(),

        value: value.trim(),

        description: description.trim(),

        category: "Footer",

        isPublic: true,

        dataType: "string",

      };



      const response = await createSetting(payload);



      if (response.success) {

        console.log(

          " [AddSettingModal] Setting created successfully:",

          response.data

        );

        toast.success(`Setting "${key}" created successfully`);

        resetForm();

        onClose();

        if (onSuccess) {

          onSuccess(response.data);

        }

      } else {

        console.error(

          " [AddSettingModal] Failed to create setting:",

          response.message

        );

        toast.error(response.message || "Failed to create setting");

      }

    } catch (error) {

      console.error(" [AddSettingModal] Exception:", error);

      toast.error(error.message || "An error occurred while creating setting");

    } finally {

      setIsSubmitting(false);

    }

  };



  /**

   * Handle modal close

   */

  const handleClose = () => {

    if (isSubmitting) return; // Prevent closing while submitting

    resetForm();

    onClose();

  };



  /**

   * Handle backdrop click

   */

  const handleBackdropClick = (e) => {

    if (e.target === e.currentTarget) {

      handleClose();

    }

  };



  return (

    <AnimatePresence>

      {isOpen && (

        <motion.div

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          exit={{ opacity: 0 }}

          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--adm-overlay)] backdrop-blur-[2px]"

          onClick={handleBackdropClick}

        >

          <motion.div

            initial={{ scale: 0.9, opacity: 0, y: 20 }}

            animate={{ scale: 1, opacity: 1, y: 0 }}

            exit={{ scale: 0.9, opacity: 0, y: 20 }}

            transition={{ type: "spring", duration: 0.3 }}

            className="bg-[var(--adm-surface)] rounded-2xl shadow-[var(--adm-shadow-lg)] max-w-md w-full border border-[var(--adm-border)] overflow-hidden"

            onClick={(e) => e.stopPropagation()}

          >

            {/* Modal Header */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--adm-border)]">

              <h3 className="text-base font-semibold text-[var(--adm-text)]">

                Add New Setting

              </h3>

              <button

                onClick={handleClose}

                disabled={isSubmitting}

                className="text-[var(--adm-text-subtle)] hover:text-[var(--adm-text)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

                aria-label="Close modal"

              >

                <XMarkIcon className="w-6 h-6" />

              </button>

            </div>



            {/* Modal Body */}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Key Input */}

              <div>

                <label

                  htmlFor="setting-key"

                  className="block text-sm font-medium text-[var(--adm-text)] mb-2"

                >

                  Setting Key <span className="text-red-500">*</span>

                </label>

                <input

                  id="setting-key"

                  type="text"

                  value={key}

                  onChange={(e) => setKey(e.target.value)}

                  placeholder="e.g., company_motto"

                  disabled={isSubmitting}

                  className="w-full px-4 py-2 bg-[var(--adm-input-bg)] border border-[var(--adm-border-strong)] rounded-lg text-[var(--adm-text)] placeholder-[var(--adm-text-subtle)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"

                  autoFocus

                />

                <p className="mt-1 text-xs text-[var(--adm-text-muted)]">

                  Use lowercase letters, numbers, underscores, or hyphens.

                </p>

              </div>



              {/* Value Input */}

              <div>

                <label

                  htmlFor="setting-value"

                  className="block text-sm font-medium text-[var(--adm-text)] mb-2"

                >

                  Setting Value <span className="text-red-500">*</span>

                </label>

                <textarea

                  id="setting-value"

                  value={value}

                  onChange={(e) => setValue(e.target.value)}

                  placeholder="Enter the setting value..."

                  rows={3}

                  disabled={isSubmitting}

                  className="w-full px-4 py-2 bg-[var(--adm-input-bg)] border border-[var(--adm-border-strong)] rounded-lg text-[var(--adm-text)] placeholder-[var(--adm-text-subtle)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"

                />

              </div>



              {/* Description Input */}

              <div>

                <label

                  htmlFor="setting-description"

                  className="block text-sm font-medium text-[var(--adm-text)] mb-2"

                >

                  Description{" "}

                  <span className="text-[var(--adm-text-subtle)] text-xs">(Optional)</span>

                </label>

                <textarea

                  id="setting-description"

                  value={description}

                  onChange={(e) => setDescription(e.target.value)}

                  placeholder="Add a description for this setting..."

                  rows={2}

                  disabled={isSubmitting}

                  className="w-full px-4 py-2 bg-[var(--adm-input-bg)] border border-[var(--adm-border-strong)] rounded-lg text-[var(--adm-text)] placeholder-[var(--adm-text-subtle)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"

                />

              </div>



              {/* Default Values Info */}

              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">

                <p className="text-xs text-blue-300 font-medium mb-1">

                  Auto-filled defaults:

                </p>

                <ul className="text-xs text-[var(--adm-text-muted)] space-y-1">

                  <li>

                    • Category: <span className="text-[var(--adm-text)]">Footer</span>

                  </li>

                  <li>

                    • Is Public: <span className="text-[var(--adm-text)]">true</span>

                  </li>

                  <li>

                    • Data Type: <span className="text-[var(--adm-text)]">string</span>

                  </li>

                </ul>

              </div>



              {/* Modal Footer */}

              <div className="flex items-center justify-end gap-3 pt-4">

                <Button

                  type="button"

                  onClick={handleClose}

                  disabled={isSubmitting}

                  className="px-4 py-2 bg-[var(--adm-surface)] border border-[var(--adm-border-strong)] hover:bg-[var(--adm-surface-2)] text-[var(--adm-text)] rounded-lg transition-colors disabled:opacity-50"

                >

                  Cancel

                </Button>

                <Button

                  type="submit"

                  disabled={isSubmitting || !key.trim() || !value.trim()}

                  className="px-4 py-2 bg-[var(--adm-accent)] hover:bg-[var(--adm-accent-hover)] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

                >

                  {isSubmitting ? (

                    <span className="flex items-center gap-2">

                      <svg

                        className="animate-spin h-4 w-4"

                        xmlns="http://www.w3.org/2000/svg"

                        fill="none"

                        viewBox="0 0 24 24"

                      >

                        <circle

                          className="opacity-25"

                          cx="12"

                          cy="12"

                          r="10"

                          stroke="currentColor"

                          strokeWidth="4"

                        />

                        <path

                          className="opacity-75"

                          fill="currentColor"

                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"

                        />

                      </svg>

                      Creating...

                    </span>

                  ) : (

                    "Create Setting"

                  )}

                </Button>

              </div>

            </form>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

};



export default AddSettingModal;

