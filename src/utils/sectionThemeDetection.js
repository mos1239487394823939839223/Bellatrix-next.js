/**
 * Section Theme Detection Utility
 * 
 * This utility provides functions to detect the current visible section's theme
 * and synchronize the navbar theme accordingly.
 * 
 * Works with sections that have data-theme attributes:
 * - data-theme="light" for light sections
 * - data-theme="dark" for dark sections
 */

/**
 * Detects the theme of the currently visible section under the navbar
 * @param {number} navbarHeight - Height of the navbar in pixels (default: 60)
 * @returns {string} - "light" or "dark" based on the visible section
 */
export const detectCurrentSectionTheme = (navbarHeight = 60) => {
  const checkY = navbarHeight + 10; // Add a small buffer below the navbar
  // Only page sections — not <html data-theme="purple"> (the site dark theme),
  // which covers the whole page and would always win.
  const sections = Array.from(document.querySelectorAll("body [data-theme]"));
  
  // Default to dark theme if no sections found
  let foundTheme = "dark";
  
  for (let section of sections) {
    const rect = section.getBoundingClientRect();
    
    // Check if this section is currently visible under the navbar
    if (rect.top <= checkY && rect.bottom > checkY) {
      foundTheme = section.getAttribute("data-theme") || "dark";
      break;
    }
  }
  
  return foundTheme;
};

/**
 * Sets up theme detection with scroll and mutation observers
 * @param {Function} onThemeChange - Callback function when theme changes
 * @param {number} navbarHeight - Height of the navbar in pixels
 * @returns {Function} - Cleanup function to remove listeners
 */
export const setupSectionThemeDetection = (onThemeChange, navbarHeight = 60) => {
  let currentTheme = "dark";
  
  const handleThemeDetection = () => {
    const newTheme = detectCurrentSectionTheme(navbarHeight);
    if (newTheme !== currentTheme) {
      currentTheme = newTheme;
      onThemeChange(newTheme);
    }
  };
  
  // Initial detection
  handleThemeDetection();
  
  // Scroll detection
  const handleScroll = () => {
    handleThemeDetection();
  };
  
  // Mutation observer for dynamic content changes
  const observer = new MutationObserver((mutationsList) => {
    let shouldUpdate = false;
    
    for (const mutation of mutationsList) {
      // Check for data-theme attribute changes
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-theme"
      ) {
        shouldUpdate = true;
        break;
      }
      
      // Check for new sections being added/removed
      if (mutation.type === "childList") {
        const addedNodes = Array.from(mutation.addedNodes);
        const removedNodes = Array.from(mutation.removedNodes);
        
        const hasThemeNodes = [
          ...addedNodes,
          ...removedNodes
        ].some(node => 
          node.nodeType === Node.ELEMENT_NODE && (
            node.hasAttribute?.('data-theme') ||
            node.querySelector?.('[data-theme]')
          )
        );
        
        if (hasThemeNodes) {
          shouldUpdate = true;
          break;
        }
      }
    }
    
    if (shouldUpdate) {
      // Use setTimeout to allow DOM to settle
      setTimeout(handleThemeDetection, 10);
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ["data-theme"],
    childList: true,
  });
  
  // Event listeners
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
  
  // Cleanup function
  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleScroll);
  };
};

/**
 * Checks if the current page is in edit/admin mode
 * @returns {boolean} - true if in admin/edit mode
 */
export const isEditMode = () => {
  return (
    window.location.pathname.includes("/admin") ||
    window.location.pathname.includes("/edit") ||
    window.location.pathname.includes("/page-editor") ||
    document.querySelector(".admin-interface") !== null ||
    document.querySelector("[data-admin-mode]") !== null
  );
};

/**
 * Checks if the current page is in view/public mode
 * @returns {boolean} - true if in public view mode
 */
export const isViewMode = () => {
  return !isEditMode();
};

/**
 * Maps component theme values to theme strings
 * @param {number} themeValue - Theme value from component (1 = light, 2 = dark)
 * @returns {string} - "light" or "dark"
 */
export const mapThemeValue = (themeValue) => {
  return themeValue === 1 ? "light" : "dark";
};
