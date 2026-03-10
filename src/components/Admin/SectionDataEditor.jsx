import React, { useState, useEffect, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {

  XMarkIcon,

  CheckIcon,

  ExclamationTriangleIcon,

  DocumentTextIcon,

  PhotoIcon,

  LinkIcon,

  Bars3Icon,

  PlusIcon,

  TrashIcon,

} from "@heroicons/react/24/outline";

import Button from "../UI/Button";

import { Input } from "../UI/Input";

import Card, { CardContent, CardHeader, CardTitle } from "../UI/Card";

import Modal, { ModalFooter } from "../UI/Modal";

import MediaInputDetector from "../UI/MediaInputDetector";



const SectionDataEditor = ({

  isOpen,

  onClose,

  section,

  onSave,

  availableComponents = [],

}) => {

  const [formData, setFormData] = useState({});

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);



  useEffect(() => {

    if (section && isOpen) {

      // Initialize form data with section data or default values

      const initialData =

        section.data || getDefaultDataForComponent(section.componentId);

      setFormData(initialData);

      setErrors({});

    }

  }, [section, isOpen]);



  const getDefaultDataForComponent = (componentId) => {

    const defaultData = {

      // Hero Sections

      HeroSection: {

        title: "Welcome to Our Services",

        subtitle: "Professional solutions for your business",

        description: "Transform your business with our expert services",

        ctaButton: {

          text: "Get Started",

          link: null,

          variant: "primary",

        },

        backgroundImage: "/images/HeroSection.png",

        backgroundVideo: null,

      },

      HRHeroSection: {

        titleParts: ["HR Management", "Made Simple"],

        description:

          "Streamline your human resources with our comprehensive HR solutions",

        ctaButton: {

          text: "Learn More",

          link: "/hr",

          variant: "primary",

        },

        backgroundVideo: "/Videos/hrVideo.mp4",

      },

      PayrollHeroSection: {

        title: "Automated Payroll Solutions",

        subtitle: "Simplify payroll processing with our advanced system",

        description:

          "Reduce errors and save time with automated payroll management",

        ctaButton: {

          text: "Get Started",

          link: "/payroll",

          variant: "primary",

        },

        backgroundImage: "/images/payrollHeroSection.jpg",

      },



      // Features/Modules Sections

      HRModulesSection: {

        title: "HR Modules",

        subtitle: "Comprehensive HR management tools",

        description: "Everything you need to manage your workforce effectively",

        features: [

          {

            title: "Employee Management",

            description: "Complete employee lifecycle management",

            icon: "",

          },

          {

            title: "Time Tracking",

            description: "Accurate time and attendance tracking",

            icon: "⏰",

          },

          {

            title: "Performance Reviews",

            description: "Streamlined performance evaluation process",

            icon: "",

          },

        ],

      },

      ServiceGrid: {

        title: "Our Services",

        subtitle: "Professional solutions for your business",

        description: "Choose from our comprehensive range of services",

        services: [

          {

            name: "Consulting",

            description: "Expert business consulting services",

            icon: "",

            link: "/services/consulting",

          },

          {

            name: "Implementation",

            description: "Seamless system implementation",

            icon: "",

            link: "/services/implementation",

          },

        ],

      },



      // Process Sections

      ImplementationProcessSection: {

        title: "Our Implementation Process",

        subtitle: "A proven methodology for seamless business transformation",

        description:

          "We follow a structured approach to ensure successful implementation",

        steps: [

          {

            title: "Discovery & Planning",

            description: "Understanding your business requirements",

            icon: "",

            duration: "1-2 weeks",

          },

          {

            title: "Design & Configuration",

            description: "Customizing the system to your needs",

            icon: "",

            duration: "2-4 weeks",

          },

          {

            title: "Testing & Training",

            description: "Ensuring everything works perfectly",

            icon: "",

            duration: "1-2 weeks",

          },

          {

            title: "Go-Live & Support",

            description: "Launching and ongoing support",

            icon: "",

            duration: "Ongoing",

          },

        ],

        image: "/images/ProcessImplementattion.png",

        ctaButton: {

          text: "Start Your Implementation",

          link: null,

          variant: "primary",

        },

      },



      // Pricing Sections

      HRPricingSection: {

        title: "HR Solution Pricing",

        subtitle: "Choose the perfect plan for your organization",

        description:

          "Flexible pricing options to fit your business size and needs",

        plans: [

          {

            name: "Starter",

            price: "$99",

            period: "per month",

            description: "Perfect for small businesses",

            features: [

              "Up to 50 employees",

              "Basic HR modules",

              "Email support",

              "Standard reporting",

            ],

            cta: "Get Started",

            popular: false,

          },

          {

            name: "Professional",

            price: "$199",

            period: "per month",

            description: "Ideal for growing companies",

            features: [

              "Up to 200 employees",

              "Advanced HR modules",

              "Priority support",

              "Advanced reporting",

              "Custom integrations",

            ],

            cta: "Get Started",

            popular: true,

          },

          {

            name: "Enterprise",

            price: "Custom",

            period: "pricing",

            description: "For large organizations",

            features: [

              "Unlimited employees",

              "All HR modules",

              "24/7 support",

              "Custom reporting",

              "Full customization",

              "Dedicated account manager",

            ],

            cta: "Contact Sales",

            popular: false,

          },

        ],

      },



      // FAQ Sections

      PayrollFAQSection: {

        title: "Frequently Asked Questions",

        subtitle: "Everything you need to know about our payroll solutions",

        description:

          "Find answers to common questions about our payroll services",

        faqs: [

          {

            question: "How does automated payroll work?",

            answer:

              "Our automated payroll system calculates salaries, taxes, and deductions automatically based on your company's policies and employee data.",

          },

          {

            question: "Can I integrate with existing HR systems?",

            answer:

              "Yes, our payroll solution integrates seamlessly with most popular HR systems and accounting software.",

          },

          {

            question: "What kind of support do you provide?",

            answer:

              "We provide comprehensive support including setup assistance, training, and ongoing technical support.",

          },

        ],

      },



      // CTA Sections

      PayrollCTASection: {

        title: "Ready to Streamline Your Payroll?",

        subtitle:

          "Join thousands of businesses that trust our payroll solutions",

        description:

          "Get started today and experience the benefits of automated payroll management",

        ctaButton: {

          text: "Start Free Trial",

          link: null,

          variant: "primary",

        },

        features: [

          "30-day free trial",

          "No setup fees",

          "Expert onboarding",

          "24/7 support",

        ],

      },



      // About Sections

      AboutMissionSection: {

        title: "Our Mission",

        subtitle: "Empowering businesses through technology",

        description:

          "We believe in the power of technology to transform businesses and create opportunities for growth and success.",

        mission:

          "To provide innovative, reliable, and user-friendly business solutions that help organizations thrive in the digital age.",

        vision:

          "To be the leading provider of business technology solutions, recognized for our excellence, innovation, and commitment to customer success.",

        values: [

          {

            title: "Innovation",

            description:

              "We continuously innovate to provide cutting-edge solutions",

          },

          {

            title: "Reliability",

            description: "We deliver dependable, high-quality services",

          },

          {

            title: "Customer Focus",

            description: "Our customers' success is our primary goal",

          },

        ],

      },



      // Team Sections

      AboutTeamSection: {

        title: "Meet Our Team",

        subtitle: "The experts behind your success",

        description:

          "Our experienced team is dedicated to helping you achieve your business goals",

        members: [

          {

            name: "John Smith",

            position: "CEO & Founder",

            bio:

              "With over 15 years of experience in business technology, John leads our vision for innovation.",

            image: "/images/ourteam/team1.jpg",

            linkedin: "https://linkedin.com/in/johnsmith",

          },

          {

            name: "Sarah Johnson",

            position: "CTO",

            bio:

              "Sarah oversees our technical operations and ensures our solutions meet the highest standards.",

            image: "/images/ourteam/team2.jpg",

            linkedin: "https://linkedin.com/in/sarahjohnson",

          },

          {

            name: "Mike Davis",

            position: "Head of Implementation",

            bio:

              "Mike leads our implementation team, ensuring smooth project delivery for our clients.",

            image: "/images/ourteam/team3.jpg",

            linkedin: "https://linkedin.com/in/mikedavis",

          },

        ],

      },

    };



    return (

      defaultData[componentId] || {

        title: "Section Title",

        description: "Section description",

        content: "Section content",

      }

    );

  };



  const validateField = (fieldPath, value) => {

    const fieldErrors = { ...errors };



    // Remove existing error for this field

    delete fieldErrors[fieldPath];



    // Basic validation rules

    if (fieldPath.includes("title") && (!value || value.trim().length === 0)) {

      fieldErrors[fieldPath] = "Title is required";

    }



    if (fieldPath.includes("email") && value && !/\S+@\S+\.\S+/.test(value)) {

      fieldErrors[fieldPath] = "Please enter a valid email address";

    }



    if (fieldPath.includes("url") && value && !/^https?:\/\/.+/.test(value)) {

      fieldErrors[fieldPath] =

        "Please enter a valid URL starting with http:// or https://";

    }



    setErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;

  };



  const handleFieldChange = (fieldPath, value) => {

    setFormData((prev) => {

      const newData = { ...prev };

      const keys = fieldPath.split(".");

      let current = newData;



      // Navigate to the nested field

      for (let i = 0; i < keys.length - 1; i++) {

        if (!(keys[i] in current)) {

          current[keys[i]] = {};

        }

        current = current[keys[i]];

      }



      // Set the final value

      current[keys[keys.length - 1]] = value;

      return newData;

    });



    // Validate the field

    validateField(fieldPath, value);

  };



  const handleArrayItemChange = (arrayPath, index, field, value) => {

    setFormData((prev) => {

      const newData = { ...prev };

      const keys = arrayPath.split(".");

      let current = newData;



      // Navigate to the array

      for (const key of keys) {

        if (!(key in current)) {

          current[key] = [];

        }

        current = current[key];

      }



      // Update the specific item

      if (current[index]) {

        current[index] = { ...current[index], [field]: value };

      }

      return newData;

    });

  };



  const addArrayItem = (arrayPath, defaultItem = {}) => {

    setFormData((prev) => {

      const newData = { ...prev };

      const keys = arrayPath.split(".");

      let current = newData;



      // Navigate to the array

      for (const key of keys) {

        if (!(key in current)) {

          current[key] = [];

        }

        current = current[key];

      }



      // Add new item

      current.push({ ...defaultItem });

      return newData;

    });

  };



  const removeArrayItem = (arrayPath, index) => {

    setFormData((prev) => {

      const newData = { ...prev };

      const keys = arrayPath.split(".");

      let current = newData;



      // Navigate to the array

      for (const key of keys) {

        current = current[key];

      }



      // Remove the item

      current.splice(index, 1);

      return newData;

    });

  };



  const handleSave = async () => {

    // Validate all required fields

    const requiredFields = getRequiredFieldsForComponent(section.componentId);

    const newErrors = {};



    requiredFields.forEach((fieldPath) => {

      const value = getNestedValue(formData, fieldPath);

      if (!value || (typeof value === "string" && value.trim().length === 0)) {

        newErrors[fieldPath] = "This field is required";

      }

    });



    if (Object.keys(newErrors).length > 0) {

      setErrors(newErrors);

      return;

    }



    setLoading(true);

    try {

      await onSave(formData);

      onClose();

    } catch (error) {

      console.error("Error saving section data:", error);

    } finally {

      setLoading(false);

    }

  };



  const getRequiredFieldsForComponent = (componentId) => {

    const requiredFields = {

      HeroSection: ["title", "subtitle"],

      HRHeroSection: ["titleParts.0", "description"],

      PayrollHeroSection: ["title", "subtitle"],

      HRModulesSection: ["title", "features.0.title"],

      ServiceGrid: ["title", "services.0.name"],

      ImplementationProcessSection: ["title", "steps.0.title"],

      HRPricingSection: ["title", "plans.0.name"],

      PayrollFAQSection: ["title", "faqs.0.question"],

      PayrollCTASection: ["title", "ctaButton.text"],

      AboutMissionSection: ["title", "mission"],

      AboutTeamSection: ["title", "members.0.name"],

    };



    return requiredFields[componentId] || ["title"];

  };



  const getNestedValue = (obj, path) => {

    return path.split(".").reduce((current, key) => current?.[key], obj);

  };



  const renderField = (key, value, path = "", level = 0) => {

    const fieldPath = path ? `${path}.${key}` : key;

    const fieldError = errors[fieldPath];

    const indentClass = `ml-${level * 4}`;



    if (typeof value === "object" && value !== null && !Array.isArray(value)) {

      return (

        <div key={fieldPath} className={`${indentClass} space-y-4`}>

          <div className="flex items-center space-x-2">

            <Bars3Icon className="h-4 w-4 text-gray-400" />

            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">

              {key.replace(/([A-Z])/g, " $1").trim()}

            </h4>

          </div>

          <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-3">

            {Object.entries(value).map(([subKey, subValue]) =>

              renderField(subKey, subValue, fieldPath, level + 1)

            )}

          </div>

        </div>

      );

    }



    if (Array.isArray(value)) {

      return (

        <div key={fieldPath} className={`${indentClass} space-y-4`}>

          <div className="flex items-center justify-between">

            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">

              {key.replace(/([A-Z])/g, " $1").trim()} ({value.length})

            </h4>

            <Button

              size="sm"

              variant="outline"

              onClick={() => addArrayItem(fieldPath, getDefaultArrayItem(key))}

              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"

            >

              <PlusIcon className="h-4 w-4 mr-1" />

              Add

            </Button>

          </div>



          <div className="space-y-3">

            {value.map((item, index) => (

              <div

                key={index}

                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"

              >

                <div className="flex items-center justify-between mb-3">

                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">

                    Item {index + 1}

                  </span>

                  <Button

                    size="sm"

                    variant="outline"

                    onClick={() => removeArrayItem(fieldPath, index)}

                    className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"

                  >

                    <TrashIcon className="h-4 w-4" />

                  </Button>

                </div>



                <div className="space-y-3">

                  {typeof item === "object" && item !== null ? (

                    Object.entries(item).map(([itemKey, itemValue]) => (

                      <div key={itemKey}>

                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">

                          {itemKey.replace(/([A-Z])/g, " $1").trim()}

                        </label>

                        {renderField(

                          itemKey,

                          itemValue,

                          `${fieldPath}.${index}`,

                          level + 1

                        )}

                      </div>

                    ))

                  ) : (

                    <Input

                      value={item}

                      onChange={(e) =>

                        handleArrayItemChange(

                          fieldPath,

                          index,

                          "value",

                          e.target.value

                        )

                      }

                      placeholder={`Enter ${key.slice(0, -1)}`}

                    />

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      );

    }



    // Render different input types based on field name and value

    const renderInput = () => {

      if (key.toLowerCase().includes("email")) {

        return (

          <Input

            type="email"

            value={value}

            onChange={(e) => handleFieldChange(fieldPath, e.target.value)}

            placeholder="Enter email address"

            className={fieldError ? "border-red-300 focus:border-red-500" : ""}

          />

        );

      }



      if (

        key.toLowerCase().includes("url") ||

        key.toLowerCase().includes("link")

      ) {

        return (

          <Input

            type="url"

            value={value}

            onChange={(e) => handleFieldChange(fieldPath, e.target.value)}

            placeholder="https://example.com"

            className={fieldError ? "border-red-300 focus:border-red-500" : ""}

          />

        );

      }



      if (

        key.toLowerCase().includes("image") ||

        key.toLowerCase().includes("photo")

      ) {

        return (

          <div className="space-y-2">

            <Input

              data-media="true"

              data-media-type="image"

              value={value}

              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}

              placeholder="/images/example.jpg"

              className={

                fieldError ? "border-red-300 focus:border-red-500" : ""

              }

            />

            {value && (

              <div className="text-xs text-gray-500">

                Preview: <span className="font-mono">{value}</span>

              </div>

            )}

          </div>

        );

      }



      if (key.toLowerCase().includes("video")) {

        return (

          <div className="space-y-2">

            <Input

              data-media="true"

              data-media-type="video"

              value={value}

              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}

              placeholder="/videos/example.mp4"

              className={

                fieldError ? "border-red-300 focus:border-red-500" : ""

              }

            />

            {value && (

              <div className="text-xs text-gray-500">

                Preview: <span className="font-mono">{value}</span>

              </div>

            )}

          </div>

        );

      }



      if (key.toLowerCase().includes("background")) {

        return (

          <div className="space-y-2">

            <Input

              data-media="true"

              data-media-type="all"

              value={value}

              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}

              placeholder="/images/background.jpg or /videos/background.mp4"

              className={

                fieldError ? "border-red-300 focus:border-red-500" : ""

              }

            />

            {value && (

              <div className="text-xs text-gray-500">

                Preview: <span className="font-mono">{value}</span>

              </div>

            )}

          </div>

        );

      }



      if (

        key.toLowerCase().includes("description") ||

        key.toLowerCase().includes("content") ||

        key.toLowerCase().includes("bio")

      ) {

        return (

          <textarea

            value={value}

            onChange={(e) => handleFieldChange(fieldPath, e.target.value)}

            placeholder={`Enter ${key.toLowerCase()}`}

            rows={3}

            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${

              fieldError ? "border-red-300 focus:border-red-500" : ""

            }`}

          />

        );

      }



      if (typeof value === "boolean") {

        return (

          <div className="flex items-center">

            <input

              type="checkbox"

              checked={value}

              onChange={(e) => handleFieldChange(fieldPath, e.target.checked)}

              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"

            />

            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">

              Enable {key.replace(/([A-Z])/g, " $1").trim()}

            </label>

          </div>

        );

      }



      if (typeof value === "number") {

        return (

          <Input

            type="number"

            value={value}

            onChange={(e) =>

              handleFieldChange(fieldPath, parseFloat(e.target.value) || 0)

            }

            placeholder="Enter number"

            className={fieldError ? "border-red-300 focus:border-red-500" : ""}

          />

        );

      }



      return (

        <Input

          value={value}

          onChange={(e) => handleFieldChange(fieldPath, e.target.value)}

          placeholder={`Enter ${key

            .replace(/([A-Z])/g, " $1")

            .trim()

            .toLowerCase()}`}

          className={fieldError ? "border-red-300 focus:border-red-500" : ""}

        />

      );

    };



    return (

      <div key={fieldPath} className={`${indentClass} space-y-2`}>

        <label className="block text-sm font-medium text-gray-700 dark:text-[var(--color-white)]">

          {key.replace(/([A-Z])/g, " $1").trim()}

          {getRequiredFieldsForComponent(section.componentId).includes(

            fieldPath

          ) && <span className="text-red-500 ml-1">*</span>}

        </label>

        {renderInput()}

        {fieldError && (

          <div className="flex items-center space-x-1 text-red-600 text-sm">

            <ExclamationTriangleIcon className="h-4 w-4" />

            <span>{fieldError}</span>

          </div>

        )}

      </div>

    );

  };



  const getDefaultArrayItem = (arrayKey) => {

    const defaults = {

      features: { title: "", description: "", icon: "" },

      services: { name: "", description: "", icon: "", link: "" },

      steps: { title: "", description: "", icon: "", duration: "" },

      plans: {

        name: "",

        price: "",

        period: "",

        description: "",

        features: [],

        cta: "",

        popular: false,

      },

      faqs: { question: "", answer: "" },

      members: { name: "", position: "", bio: "", image: "", linkedin: "" },

      values: { title: "", description: "" },

    };



    return defaults[arrayKey] || { value: "" };

  };



  if (!section) return null;



  return (

    <MediaInputDetector containerRef={containerRef}>

      <Modal

        isOpen={isOpen}

        onClose={onClose}

        title={`Edit ${section.name} Data`}

        size="xl"

      >

        <div ref={containerRef} className="space-y-6">

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">

            <div className="flex items-center space-x-3">

              <div className="text-2xl">{section.icon}</div>

              <div>

                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">

                  {section.name}

                </h3>

                <p className="text-sm text-blue-700 dark:text-blue-300">

                  Component: {section.componentId}

                </p>

              </div>

            </div>

          </div>



          <div className="max-h-96 overflow-y-auto space-y-4">

            {Object.entries(formData).map(([key, value]) =>

              renderField(key, value)

            )}

          </div>



          {Object.keys(errors).length > 0 && (

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">

              <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">

                <ExclamationTriangleIcon className="h-5 w-5" />

                <span className="font-medium">

                  Please fix the following errors:

                </span>

              </div>

              <ul className="mt-2 text-sm text-red-700 dark:text-red-300">

                {Object.entries(errors).map(([field, error]) => (

                  <li key={field}>

                    • {field}: {error}

                  </li>

                ))}

              </ul>

            </div>

          )}

        </div>



        <ModalFooter>

          <Button variant="outline" onClick={onClose} disabled={loading}>

            Cancel

          </Button>

          <Button onClick={handleSave} loading={loading}>

            {loading ? "Saving..." : "Save Section Data"}

          </Button>

        </ModalFooter>

      </Modal>

    </MediaInputDetector>

  );

};



export default SectionDataEditor;

