/**
 * Component JSON Defaults
 * Provides default JSON structures for different component types
 */

import { generalComponentSchemas } from "../sections/schemas/generalComponentSchemas";
import { aboutComponentSchemas } from "../sections/schemas/aboutComponentSchemas";

export const getBasicJsonForComponent = (componentType) => {
  // First, check if we have a specific schema for this component type in generalComponentSchemas
  const generalSchema = generalComponentSchemas[componentType];
  if (generalSchema && generalSchema.defaultData) {
    console.log(`[getBasicJsonForComponent] Found general schema for ${componentType}:`, generalSchema.defaultData);
    return { ...generalSchema.defaultData };
  }

  // Then, check in aboutComponentSchemas
  const aboutSchema = aboutComponentSchemas[componentType];
  if (aboutSchema && aboutSchema.defaultData) {
    console.log(`[getBasicJsonForComponent] Found about schema for ${componentType}:`, aboutSchema.defaultData);
    return { ...aboutSchema.defaultData };
  }

  // Fallback to pattern matching for components not in schemas
  const type = componentType.toLowerCase();

  if (type.includes("hero")) {
    return {
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      buttonText: "",
      buttonUrl: "",
    };
  } else if (type.includes("cta")) {
    return {
      title: "",
      description: "",
      buttonText: "",
      buttonUrl: "",
      backgroundColor: "",
    };
  } else if (type.includes("pricing")) {
    return {
      title: "",
      subtitle: "",
      plans: [
        {
          name: "Basic",
          price: "",
          features: [],
          buttonText: "Get Started",
          buttonUrl: "",
        },
      ],
    };
  } else if (type.includes("faq")) {
    return {
      title: "",
      subtitle: "",
      questions: [{ question: "", answer: "" }],
    };
  } else if (type.includes("about") || type.includes("team")) {
    return {
      title: "",
      subtitle: "",
      description: "",
      members: [{ name: "", role: "", image: "", bio: "" }],
    };
  } else if (type.includes("feature") || type.includes("benefit")) {
    return {
      title: "",
      subtitle: "",
      features: [{ title: "", description: "", icon: "" }],
    };
  } else if (type.includes("testimonial")) {
    return {
      title: "",
      subtitle: "",
      testimonials: [
        { name: "", role: "", company: "", content: "", image: "" },
      ],
    };
  } else if (type.includes("solution") || type.includes("service")) {
    return {
      title: "",
      subtitle: "",
      description: "",
      features: [],
      benefits: [],
    };
  } else if (type.includes("industry")) {
    return {
      title: "",
      subtitle: "",
      description: "",
      challenges: [],
      solutions: [],
    };
  } else if (type.includes("image") || type.includes("gallery")) {
    return {
      imageUrl: "",
      alt: "",
      caption: "",
      width: "",
      height: "",
    };
  } else if (type.includes("form") || type.includes("contact")) {
    return {
      title: "",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          required: true,
        },
      ],
    };
  } else if (type.includes("text") || type.includes("content")) {
    return {
      title: "",
      content: "",
      alignment: "left",
    };
  } else {
    return {
      title: "",
      content: "",
    };
  }
};

