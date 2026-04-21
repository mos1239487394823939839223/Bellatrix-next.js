'use client'
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  ViewColumnsIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  PowerIcon,
  ChatBubbleLeftRightIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  ViewColumnsIcon as ViewColumnsIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
} from "@heroicons/react/24/solid";
import Button from "../UI/Button";
import { Input } from "../UI/Input";
import { useTheme } from "../../context/ThemeContext";
import { useMessageNotifications } from "../../hooks/useMessageNotifications";
import MessageNotification from "./MessageNotification";

const ModernAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, theme, toggleTheme, toggleColorTheme } = useTheme();
  const { logout } = useAuth();
  const isEnhancedCreate = pathname.startsWith(
    "/admin/pages/enhanced-create"
  );
  const {
    notifications: messageNotifications,
    unreadCount,
    removeNotification,
    markAsRead,
  } = useMessageNotifications();
  const [notificationsViewed, setNotificationsViewed] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/admin",
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      description: "Overview & Analytics",
    },
    {
      id: "pages",
      name: "Pages",
      path: "/admin/pages",
      icon: DocumentTextIcon,
      iconSolid: DocumentTextIconSolid,
      description: "Content Management",
    },
    {
      id: "categories",
      name: "Categories",
      path: "/admin/categories",
      icon: ViewColumnsIcon,
      iconSolid: ViewColumnsIconSolid,
      description: "Manage Categories",
    },
    {
      id: "messages",
      name: "Messages",
      path: "/admin/messages",
      icon: ChatBubbleLeftRightIcon,
      iconSolid: ChatBubbleLeftRightIconSolid,
      description: "Contact Messages",
    },
    {
      id: "settings",
      name: "Settings",
      path: "/admin/settings",
      icon: Cog6ToothIcon,
      iconSolid: Cog6ToothIconSolid,
      description: "System Configuration",
    },
  ];

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(
      (item) =>
        item.path === pathname ||
        pathname.startsWith(item.path + "/")
    );
    return currentItem?.name || "Dashboard";
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    return pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setSidebarOpen(false);
  };

  // Legacy notifications for the dropdown (can be removed if not needed)
  const legacyNotifications = [
    {
      id: 1,
      title: "New page created",
      message: "Homepage has been updated",
      time: "5m ago",
      unread: true,
    },

    {
      id: 3,
      title: "Settings updated",
      message: "System configuration changed",
      time: "2h ago",
      unread: false,
    },
  ];

  const legacyUnreadCount = legacyNotifications.filter((n) => n.unread).length;

  return (
    <div
      className="admin-layout dark flex min-h-screen"
      data-dashboard="true"
      style={{ backgroundColor: "var(--color-brand-dark-navy)" }}
    >
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-[var(--color-ww-100)] opacity-75" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 shadow-xl transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--color-brand-variant)" }}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-[var(--color-white-10)]">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center shadow">
                <span className="text-[var(--color-text-inverse)] font-bold text-sm">
                  B
                </span>
              </div>
              <span className="text-xl font-bold text-[var(--color-text-inverse)]">
                Bellatrix
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[var(--color-text-inverse)] hover:bg-[var(--color-white-10)]"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const IconComponent = isActive(item.path)
                ? item.iconSolid
                : item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-[var(--color-primary)]/30 text-[var(--color-text-inverse)] border border-[var(--color-primary)]/30 shadow"
                      : "text-[var(--color-ww-100)] hover:bg-[var(--color-white-10)] hover:text-[var(--color-text-inverse)]"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconComponent
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.path)
                        ? "text-[var(--color-primary-light)]"
                        : "text-[var(--color-text-light)]"
                    }`}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div
                      className={`text-xs ${
                        isActive(item.path)
                          ? "text-[var(--color-primary-light)]"
                          : "text-[var(--color-text-light)]"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </nav>

          {/* Bottom section with Change Password and Logout */}
          <div className="border-t border-[var(--color-white-10)] p-4 space-y-2">
            <button
              onClick={() => router.push('/admin/change-password')}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 group"
            >
              <KeyIcon className="mr-3 h-5 w-5" />
              <span>Change Password</span>
            </button>
            <button
              onClick={() => {
                logout();
                router.push('/auth/login');
              }}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300 group"
            >
              <PowerIcon className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
            <div className="flex items-center space-x-3 text-sm text-gray-400 pt-2">
              <div className="h-2 w-2 bg-[var(--tw-green-400)] rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header
          className="sticky top-0 z-30 shadow border-b border-[var(--color-border-secondary)]"
          style={{ backgroundColor: "var(--color-brand-dark-navy)" }}
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-white hover:bg-white/20 transition-colors duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-5 w-5" />
              </Button>

              {/* Page title */}
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text-inverse)]">
                  {getCurrentPageTitle()}
                </h1>
                <p className="text-sm text-[var(--color-admin-text-secondary)]">
                  {menuItems.find((item) => isActive(item.path))?.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Icons removed as requested */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className={`flex-1 ${
            isEnhancedCreate ? "p-0" : "p-4 sm:p-6 lg:p-8"
          } overflow-auto`}
        >
          {children}
        </main>
      </div>

      {/* Message Notifications */}
      {messageNotifications.map((notification) => (
        <MessageNotification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
          onReply={() => router.push("/admin/messages")}
          onView={() => router.push("/admin/messages")}
        />
      ))}
    </div>
  );
};

export default ModernAdminLayout;
