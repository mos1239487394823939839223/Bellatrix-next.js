import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Toast from "../UI/Toast";
import FooterSettings from "../../page-components/FooterSettings";

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState("footer");
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const tabs = [
    {
      id: "footer",
      name: "Footer Settings",
      description: "Manage footer content and links",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <div 
      className="admin-component space-y-6 text-[var(--color-text-inverse)]" 
      data-dashboard="true"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-inverse)]">
            Settings Management
          </h1>
          <p className="text-[var(--color-ww-100)] mt-2">
            Configure system preferences
          </p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="border-b border-[var(--color-white-10)]">
        <nav className="flex gap-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 rounded-t-lg ${
                  isActive
                    ? "text-[var(--color-primary-light)] bg-[var(--color-white-5)]"
                    : "text-[var(--color-ww-100)] hover:text-[var(--color-text-inverse)] hover:bg-[var(--color-white-5)]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeSettingsTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="[&_input]:bg-[var(--color-white-5)] [&_input]:border-[var(--color-white-20)] [&_input]:text-[var(--color-text-inverse)] [&_textarea]:bg-[var(--color-white-5)] [&_textarea]:border-[var(--color-white-20)] [&_textarea]:text-[var(--color-text-inverse)]">
          {activeTab === "footer" && <FooterSettings />}
        </div>
      </motion.div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: "", message: "" })}
        />
      )}
    </div>
  );
};

export default SettingsManagement;
