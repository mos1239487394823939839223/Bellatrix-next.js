import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("default");
  const [isDark, setIsDark] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("bellatrix-theme");
    const savedDarkMode = localStorage.getItem("bellatrix-dark-mode");

    // Accept both "dark" and legacy "purple" theme names
    if (savedTheme && (savedTheme === "default" || savedTheme === "dark" || savedTheme === "purple")) {
      // Normalize purple to dark
      setTheme(savedTheme === "purple" ? "dark" : savedTheme);
    }

    if (savedDarkMode) {
      setIsDark(savedDarkMode === "true");
    } else {
      // Check system preference for dark mode
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  // Update document data-theme attribute and localStorage when theme changes.
  // Skipped on the very first run: the inline script in app/layout.jsx already
  // applied the saved theme before first paint, and running here with the
  // initial "default" state would briefly strip it (light flash for dark users)
  // and overwrite the saved preference.
  const themeSynced = useRef(false);
  useEffect(() => {
    if (!themeSynced.current) {
      themeSynced.current = true;
      return;
    }
    // Note: Still using "purple" as the data-theme attribute for CSS compatibility
    if (theme === "dark" || theme === "purple") {
      document.documentElement.setAttribute("data-theme", "purple");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("bellatrix-theme", theme);
  }, [theme]);

  // Update document dark class and localStorage when dark mode changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("bellatrix-dark-mode", isDark.toString());
  }, [isDark]);

  // Colour cross-fade only while switching (see html.theme-switching in theme-dark.css)
  const markSwitching = () => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    window.clearTimeout(markSwitching.t);
    markSwitching.t = window.setTimeout(() => root.classList.remove("theme-switching"), 420);
  };

  const toggleTheme = (newTheme) => {
    markSwitching();
    if (
      typeof newTheme === "string" &&
      (newTheme === "default" || newTheme === "dark" || newTheme === "purple")
    ) {
      // Normalize purple to dark
      setTheme(newTheme === "purple" ? "dark" : newTheme);
    } else {
      // Legacy toggle for dark/light mode
      setIsDark(!isDark);
    }
  };

  const toggleColorTheme = () => {
    setTheme(theme === "default" ? "dark" : "default");
  };

  const value = {
    theme,
    isDark,
    toggleTheme,
    toggleColorTheme,
    setTheme,
    isDarkTheme: theme === "dark" || theme === "purple", // Helper for dark theme detection
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
