/**
 * Settings Map - Fixed Footer Field Definitions
 * Each field maps to a setting key in the database
 */

export const FOOTER_SETTINGS_MAP = [
  {
    key: "siteTitle",
    label: "Site Title",
    placeholder: "Enter your site title",
    dataType: "string",
    category: "footer",
    isPublicDefault: true,
    description: "Main website title displayed in footer",
    validation: { required: true, minLength: 2, maxLength: 100 },
  },
  {
    key: "company_tagline",
    label: "Footer Text",
    placeholder: "Enter footer description or tagline",
    dataType: "text",
    category: "footer",
    isPublicDefault: true,
    description: "Footer description or company tagline",
    validation: { maxLength: 500 },
  },
  {
    key: "company_name",
    label: "Company Name",
    placeholder: "Your Company Name",
    dataType: "string",
    category: "footer",
    isPublicDefault: true,
    description: "Legal company name",
    validation: { required: true, minLength: 2, maxLength: 100 },
  },
  {
    key: "company_email",
    label: "Contact Email",
    placeholder: "contact@example.com",
    dataType: "email",
    category: "footer",
    isPublicDefault: true,
    description: "Primary contact email address",
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: "Please enter a valid email address",
    },
  },
  {
    key: "company_phone",
    label: "Contact Phones",
    placeholder: "+1 (555) 123-4567",
    dataType: "phone_array",
    category: "footer",
    isPublicDefault: true,
    description: "Contact phone numbers (you can add multiple)",
    validation: {
      pattern: /^[\d\s\-\+\(\)]+$/,
      errorMessage: "Please enter a valid phone number",
      minLength: 7,
      maxLength: 30,
    },
  },
  {
    key: "company_address",
    label: "Business Address",
    placeholder: "123 Main Street, City, State, ZIP",
    dataType: "text",
    category: "footer",
    isPublicDefault: true,
    description: "Physical business address",
    validation: { maxLength: 200 },
  },
  {
    key: "facebook_link",
    label: "Facebook URL",
    placeholder: "https://facebook.com/yourpage",
    dataType: "url",
    category: "footer",
    isPublicDefault: true,
    description: "Facebook profile or page URL",
    validation: {
      pattern: /^https?:\/\/.+/,
      errorMessage:
        "Please enter a valid URL starting with http:// or https://",
      maxLength: 200,
    },
  },

  {
    key: "twitter_link" ,
    label: "Twitter URL",
    placeholder: "https://twitter.com/yourhandle",
    dataType: "url",
    category: "footer",
    isPublicDefault: true,
    description: "Twitter profile URL",
    validation: {
      pattern: /^https?:\/\/.+/,
      errorMessage:
        "Please enter a valid URL starting with http:// or https://",
      maxLength: 200,
    },
  },
  {
    key: "social_linkedin",
    label: "LinkedIn URL",
    placeholder: "https://linkedin.com/company/yourcompany",
    dataType: "url",
    category: "footer",
    isPublicDefault: true,
    description: "LinkedIn company page URL",
    validation: {
      pattern: /^https?:\/\/.+/,
      errorMessage:
        "Please enter a valid URL starting with http:// or https://",
      maxLength: 200,
    },
  },
  {
    key: "social_instagram",
    label: "Instagram URL",
    placeholder: "https://instagram.com/youraccount",
    dataType: "url",
    category: "footer",
    isPublicDefault: true,
    description: "Instagram profile URL",
    validation: {
      pattern: /^https?:\/\/.+/,
      errorMessage:
        "Please enter a valid URL starting with http:// or https://",
      maxLength: 200,
    },
  },
  {
    key: "social_youtube",
    label: "YouTube URL",
    placeholder: "https://youtube.com/c/yourchannel",
    dataType: "url",
    category: "footer",
    isPublicDefault: true,
    description: "YouTube channel URL",
    validation: {
      pattern: /^https?:\/\/.+/,
      errorMessage:
        "Please enter a valid URL starting with http:// or https://",
      maxLength: 200,
    },
  },
  {
    key: "copyright_text",
    label: "Copyright Text",
    placeholder: "© 2025 Company Name. All rights reserved.",
    dataType: "string",
    category: "footer",
    isPublicDefault: true,
    description: "Copyright notice text",
    validation: { maxLength: 200 },
  },
  {
    key: "privacy_policy_url",
    label: "Privacy Policy URL",
    placeholder: "/privacy-policy",
    dataType: "url",
    category: "footer",
    isPublicDefault: true,
    description: "Link to privacy policy page",
    validation: { maxLength: 200 },
  },
  {
    key: "terms_of_service_url",
    label: "Terms of Service URL",
    placeholder: "/terms-of-service",
    dataType: "url",
    category: "footer",
    isPublicDefault: true,
    description: "Link to terms of service page",
    validation: { maxLength: 200 },
  },
];

/**
 * Get field definition by key
 * @param {string} key - Field key
 * @returns {Object|undefined} Field definition
 */
export const getFieldDefinition = (key) => {
  return FOOTER_SETTINGS_MAP.find((field) => field.key === key);
};

/**
 * Validate field value against its definition
 * @param {string} key - Field key
 * @param {string} value - Field value
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateField = (key, value) => {
  const field = getFieldDefinition(key);
  if (!field) {
    return { isValid: true, error: null };
  }

  const { validation, dataType } = field;
  if (!validation) {
    return { isValid: true, error: null };
  }

  // Handle phone_array type separately
  if (dataType === "phone_array") {
    if (!Array.isArray(value)) {
      return { isValid: true, error: null };
    }

    // Support both plain strings and {flag, number} objects
    const extractNumber = (item) =>
      typeof item === "string" ? item : (item?.number || "");

    // Filter out empty values
    const nonEmptyPhones = value.filter((item) => {
      const num = extractNumber(item);
      return num && num.trim() !== "";
    });

    // Required validation for arrays
    if (validation.required && nonEmptyPhones.length === 0) {
      return { isValid: false, error: `${field.label} is required` };
    }

    // Validate each phone number
    for (let i = 0; i < nonEmptyPhones.length; i++) {
      const phone = extractNumber(nonEmptyPhones[i]).trim();

      if (validation.minLength && phone.length < validation.minLength) {
        return {
          isValid: false,
          error: `Phone ${i + 1} must be at least ${validation.minLength} characters`,
        };
      }

      if (validation.maxLength && phone.length > validation.maxLength) {
        return {
          isValid: false,
          error: `Phone ${i + 1} must not exceed ${validation.maxLength} characters`,
        };
      }

      if (validation.pattern && !validation.pattern.test(phone)) {
        return {
          isValid: false,
          error: validation.errorMessage || `Phone ${i + 1} format is invalid`,
        };
      }
    }

    return { isValid: true, error: null };
  }

  // Standard string validation
  const stringValue = typeof value === 'string' ? value : '';

  // Required validation
  if (validation.required && (!stringValue || stringValue.trim() === "")) {
    return { isValid: false, error: `${field.label} is required` };
  }

  // Skip other validations if value is empty and not required
  if (!stringValue || stringValue.trim() === "") {
    return { isValid: true, error: null };
  }

  // Min length validation
  if (validation.minLength && stringValue.length < validation.minLength) {
    return {
      isValid: false,
      error: `${field.label} must be at least ${validation.minLength} characters`,
    };
  }

  // Max length validation
  if (validation.maxLength && stringValue.length > validation.maxLength) {
    return {
      isValid: false,
      error: `${field.label} must not exceed ${validation.maxLength} characters`,
    };
  }

  // Pattern validation
  if (validation.pattern && !validation.pattern.test(stringValue)) {
    return {
      isValid: false,
      error: validation.errorMessage || `${field.label} format is invalid`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Get all field keys
 * @returns {Array<string>} Array of field keys
 */
export const getAllFieldKeys = () => {
  return FOOTER_SETTINGS_MAP.map((field) => field.key);
};
