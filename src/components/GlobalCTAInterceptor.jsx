'use client'
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCTAModal } from '../contexts/CTAModalContext';
import { shouldOpenContactModal, autoGenerateModalConfig } from '../utils/ctaUtils';

/**
 * Global CTA Interceptor Component
 * 
 * This component intercepts clicks on any button, link, or element
 * that contains CTA text patterns (like "Get Started", "Contact Us", etc.)
 * and opens the contact modal instead of navigating or doing nothing.
 * 
 * This ensures consistent behavior across:
 * - Dynamically created buttons by admins
 * - Static buttons in the codebase
 * - Links that should open contact modal
 */
const GlobalCTAInterceptor = ({ children }) => {
  const { openCTAModal } = useCTAModal();
  const pathname = usePathname();

  useEffect(() => {
    /**
     * Extract text content from an element
     */
    const getElementText = (element) => {
      // Try different ways to get the button text
      const text = element.textContent || 
                   element.innerText || 
                   element.getAttribute('aria-label') ||
                   element.getAttribute('title') ||
                   element.value || // for input buttons
                   '';
      return text.trim();
    };

    /**
     * Check if element is a clickable CTA element
     */
    const isClickableCTAElement = (element) => {
      // Check if it's a button or link
      const tagName = element.tagName.toLowerCase();
      const isButton = tagName === 'button';
      const isLink = tagName === 'a';
      const isInputButton = tagName === 'input' && 
                           (element.type === 'button' || element.type === 'submit');
      
      // Check for button-like roles
      const role = element.getAttribute('role');
      const isButtonRole = role === 'button' || role === 'link';
      
      // Check for CTA-related classes
      const className = element.className || '';
      const hasCTAClass = /cta|btn|button/i.test(className);
      
      return isButton || isLink || isInputButton || isButtonRole || hasCTAClass;
    };

    /**
     * Find the closest clickable parent element
     */
    const findClickableParent = (element, maxDepth = 5) => {
      let current = element;
      let depth = 0;
      
      while (current && depth < maxDepth) {
        if (isClickableCTAElement(current)) {
          return current;
        }
        current = current.parentElement;
        depth++;
      }
      
      return null;
    };

    /**
     * Global click handler
     */
    const handleGlobalClick = (event) => {
      // Find the clickable element (might be a child of the button)
      const clickedElement = event.target;
      const ctaElement = findClickableParent(clickedElement);
      
      if (!ctaElement) return;

      // Skip interception on Admin routes
      if (pathname.toLowerCase().startsWith('/admin')) {
        return;
      }

      // Skip interception if manually disabled
      if (ctaElement.hasAttribute('data-no-cta-intercept') || ctaElement.closest('[data-no-cta-intercept]')) {
        return;
      }
      
      // Get the text content
      const buttonText = getElementText(ctaElement);
      
      // Check if this text should open the contact modal
      if (shouldOpenContactModal(buttonText)) {
        // Prevent default navigation/action
        event.preventDefault();
        event.stopPropagation();
        
        // Generate modal config based on button text
        const modalConfig = autoGenerateModalConfig(buttonText);
        
        // Open the contact modal
        openCTAModal(modalConfig);
        
        console.log('[GlobalCTAInterceptor] Intercepted CTA click:', buttonText);
      }
    };

    // Add global click listener (capture phase to intercept before other handlers)
    document.addEventListener('click', handleGlobalClick, true);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [openCTAModal, pathname]); // Re-bind if pathname changes

  return children;
};


export default GlobalCTAInterceptor;
