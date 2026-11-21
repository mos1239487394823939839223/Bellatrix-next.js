/**
 * Utility functions for CTA button detection and conversion
 */

// Explicit CTA button texts that should ALWAYS open contact modal
// These are matched exactly (case-insensitive)
export const EXPLICIT_CTA_TEXTS = [
  'start implementation',
  'start your journey',
  'start you journey',  // typo variant
  'get started today',
  'get started',
  'contact us',
  'start now',
  'start with essential',
  'choose professional',
  'contact enterprise sales',
  'start learning today',
  'schedule manufacturing demo',
  'schedule payroll demo',
  'schedule demo',
  'request demo',
  'request a demo',
  'request now',
  'request consultation',
  'book a consultation',
  'book consultation',
  'get in touch',
  'reach out',
  'let\'s talk',
  'talk to us',
  'contact sales',
  'schedule a call',
  'book a call',
  'free consultation',
  'start your project',
  'begin your journey',
  'transform your business',
  'get a quote',
  'request quote',
  'request info',
  'request information',
];

// Common CTA button text patterns (regex-based for flexibility)
export const CTA_PATTERNS = {
  getStarted: /^(get started|start now|begin|launch|start)/i,
  contact: /^(contact|reach out|get in touch|connect)/i,
  request: /^(request|ask for|inquire)/i,
  demo: /^(demo|show me|see how|trial)/i,
  quote: /^(quote|estimate|pricing|cost)/i,
  learn: /^(learn more|find out|explore)/i,
  book: /^(book|reserve|appoint)/i,
  schedule: /^(schedule)/i,
  download: /^(download|obtain|acquire)/i,
  subscribe: /^(subscribe|join|sign up|register)/i,
  buy: /^(buy|purchase|order|shop)/i,
  choose: /^(choose|select)/i,
};

// Default modal configurations for different CTA types
export const DEFAULT_MODAL_CONFIGS = {
  // Specific, plain copy in sentence case. No icons: the dialog doesn't render them.
  getStarted: { title: "Start your project", subtitle: "Share a few details about your business and we'll suggest the next steps." },
  contact: { title: "Contact Bellatrix", subtitle: "Tell us about your ERP project. A consultant will reply within one business day." },
  request: { title: "Request information", subtitle: "Tell us what you'd like to know about NetSuite or Odoo and we'll send you the details." },
  demo: { title: "Request a demo", subtitle: "We'll walk you through NetSuite or Odoo set up for a business like yours." },
  quote: { title: "Get a quote", subtitle: "Describe your requirements and we'll send you an estimate." },
  learn: { title: "Talk to a consultant", subtitle: "Ask us anything about this service. A consultant will reply within one business day." },
  book: { title: "Book a meeting", subtitle: "Tell us when suits you and what you'd like to cover." },
  schedule: { title: "Schedule a demo", subtitle: "Tell us about your business and we'll arrange a time for a walkthrough." },
  download: { title: "Request resources", subtitle: "Tell us what you need and we'll email the documents to you." },
  subscribe: { title: "Stay in touch", subtitle: "Leave your details and we'll keep you posted on NetSuite and Odoo updates." },
  buy: { title: "Get started", subtitle: "Tell us about your business and we'll prepare the next steps." },
  choose: { title: "Choose a plan", subtitle: "Tell us about your business and we'll recommend the right plan." },
  default: { title: "Contact Bellatrix", subtitle: "Tell us about your ERP project. A consultant will reply within one business day." },
};

/**
 * Check if text exactly matches any explicit CTA text
 * @param {string} text - The button text to check
 * @returns {boolean} - Whether the text is an explicit CTA
 */
export const isExplicitCTAText = (text) => {
  if (!text) return false;
  const normalizedText = text.toLowerCase().trim();
  return EXPLICIT_CTA_TEXTS.some(ctaText => 
    normalizedText === ctaText || 
    normalizedText.includes(ctaText)
  );
};

/**
 * Check if text matches CTA patterns that should open contact modal
 * @param {string} text - The button text to check
 * @returns {boolean} - Whether the text should trigger contact modal
 */
export const shouldOpenContactModal = (text) => {
  if (!text) return false;
  
  // First check explicit texts
  if (isExplicitCTAText(text)) return true;
  
  // Then check patterns
  const normalizedText = text.toLowerCase().trim();
  
  // Check against all patterns
  for (const pattern of Object.values(CTA_PATTERNS)) {
    if (pattern.test(normalizedText)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Detects the type of CTA based on button text
 * @param {string} text - The button text
 * @returns {string} - The detected CTA type
 */
export const detectCTAType = (text) => {
  if (!text) return 'default';
  
  for (const [type, pattern] of Object.entries(CTA_PATTERNS)) {
    if (pattern.test(text)) {
      return type;
    }
  }
  
  return 'default';
};

/**
 * Gets the appropriate modal configuration for a CTA type
 * @param {string} ctaType - The CTA type
 * @param {object} customConfig - Custom configuration to override defaults
 * @returns {object} - The modal configuration
 */
export const getModalConfig = (ctaType, customConfig = {}) => {
  const defaultConfig = DEFAULT_MODAL_CONFIGS[ctaType] || DEFAULT_MODAL_CONFIGS.default;
  return {
    ...defaultConfig,
    ...customConfig
  };
};

/**
 * Automatically generates modal configuration based on button text
 * @param {string} buttonText - The button text
 * @param {object} customConfig - Custom configuration to override defaults
 * @returns {object} - The modal configuration
 */
export const autoGenerateModalConfig = (buttonText, customConfig = {}) => {
  const ctaType = detectCTAType(buttonText);
  return getModalConfig(ctaType, customConfig);
};

/**
 * Checks if a button should be treated as a CTA
 * @param {object} props - Button props
 * @returns {boolean} - Whether the button should be a CTA
 */
export const isCTAButton = (props) => {
  const { children, className, onClick, href } = props;
  
  // If it has an href, it's likely a navigation link, not a CTA
  if (href) return false;
  
  // If it has a custom onClick that doesn't prevent default, it might be a CTA
  if (onClick && typeof onClick === 'function') {
    // Check if the onClick is just opening a modal (common pattern)
    const onClickString = onClick.toString();
    if (onClickString.includes('modal') || onClickString.includes('open')) {
      return true;
    }
  }
  
  // Check button text for CTA patterns
  if (children) {
    const text = typeof children === 'string' ? children : children.toString();
    return shouldOpenContactModal(text);
  }
  
  // Check className for CTA indicators
  if (className) {
    const ctaClassPatterns = [
      /cta/i,
      /contact.*modal/i,
      /button.*primary/i,
      /get.*started/i,
      /request.*demo/i
    ];
    return ctaClassPatterns.some(pattern => pattern.test(className));
  }
  
  return false;
};
