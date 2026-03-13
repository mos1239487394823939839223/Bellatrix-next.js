import { validateVariant } from "./variantSystem";

/**
 * Helper function to clean corrupted data that has numeric string keys
 * This happens when a string is accidentally spread into an object
 * Example: {...componentType} where componentType = "ManufacturingCaseStudies"
 * Results in: {"0": "M", "1": "a", "2": "n", ...}
 */
const cleanCorruptedData = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return data;
  }

  const cleaned = {};
  for (const key in data) {
    // Skip numeric string keys that come from spread strings
    if (/^\d+$/.test(key)) {
      continue;
    }
    cleaned[key] = data[key];
  }
  return cleaned;
};

// Ensure upload URLs use the HTTPS public domain (avoid browser mixed-content blocks)
const rewriteUploadsUrl = (url) => {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("http://68.178.169.236:5000/uploads/")) {
    return url.replace(
      "http://68.178.169.236:5000",
      "https://www.bellatrixinc.com"
    );
  }
  return url;
};
/**
 * Recursively walk any value and rewrite every string that contains the
 * raw backend IP so it becomes a proper HTTPS domain URL.
 * This sanitises the entire component data tree in one pass, regardless of
 * how deeply the URL is nested.
 */
const deepRewriteUploadsUrls = (value) => {
  if (!value) return value;
  if (typeof value === "string") return rewriteUploadsUrl(value);
  if (Array.isArray(value)) return value.map(deepRewriteUploadsUrls);
  if (typeof value === "object") {
    const result = {};
    for (const key of Object.keys(value)) {
      result[key] = deepRewriteUploadsUrls(value[key]);
    }
    return result;
  }
  return value;
};

// Basic check to confirm a URL is an image (file extension or data URI)
const isLikelyImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  return (
    lower.startsWith("data:image") ||
    /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/.test(lower)
  );
};

/**

 * Normalizes JSON data to match component prop expectations

 * This function maps JSON stru      ctaButton: data.ctaButton || data.hero?.ctaButton || {

        text: "Get Started",

        link: "/training",

        variant: validateVariant("primary")

      }, keys to the correct prop names that components expect

 */

const normalizeGenericCTA = (data, defaultTitle) => {
  const baseData = data.data || data;
  const features = baseData.features || baseData.items || data.features || data.items || [];

  const btnText =
    baseData.buttonText ||
    baseData.ctaButton?.text ||
    (typeof baseData.ctaButton === 'string' ? baseData.ctaButton : null) ||
    data.buttonText ||
    data.ctaButton?.text ||
    "Get Started";

  return {
    ...baseData,
    title: baseData.title || data.title || defaultTitle || "Ready to Transform?",
    subtitle: baseData.subtitle || data.subtitle || "Let's discuss your needs",
    description: baseData.description || data.description || "",
    features: Array.isArray(features) ? features : [],
    ctaButton: {
      text: btnText,
      link: baseData.ctaButton?.link || baseData.buttonLink || null,
      variant: baseData.ctaButton?.variant || "primary"
    },
    // Include data wrapper for compatibility and pass through original fields
    data: { ...baseData, features: Array.isArray(features) ? features : [] }
  };
};

/**

 * Normalizes props for different component types based on their expected prop structure

 * @param {string} componentType - The type of component (e.g., 'IntegrationTypesSection')

 * @param {Object} contentJson - The parsed JSON data from the backend

 * @returns {Object} - Normalized props that match component expectations

 */

export const normalizeProps = (componentType, contentJson) => {

  if (!contentJson || typeof contentJson !== "object") {

    console.warn(

      `normalizeProps: Invalid contentJson for ${componentType}:`,

      contentJson

    );

    return {};

  }

  // Clean corrupted data (numeric keys from spread strings)
  const cleanedData = cleanCorruptedData(contentJson);

  // Recursively rewrite any raw backend IP URLs to the HTTPS domain so they
  // never reach the browser as http://68.178.169.236:5000/... (mixed-content).
  const sanitizedData = deepRewriteUploadsUrls(cleanedData);

  console.log(

    ` [normalizeProps] Processing ${componentType} with data:`,

    sanitizedData

  );



  // Component-specific normalization mappings

  const componentMappings = {

    // Home Hero Section
    HeroSection: (data) => {
      console.log(" [HeroSection] Raw form data:", data);

      let slides = data.slides;
      if (!slides || !Array.isArray(slides) || slides.length === 0) {
        slides = [{
          title: data.title || "Welcome",
          subtitle: data.subtitle || "",
          description: data.description || data.content || "",
          video: data.video || data.backgroundVideo || "/Videos/implementation/homepage_hero.mp4"
        }];
      }

      return {
        slides: slides,
        stats: Array.isArray(data.stats) ? data.stats : [],
        data: { ...data, slides }
      };
    },


    // HR Hero Section
    HRHeroSection: (data) => {
      const video = data.backgroundVideo || data.bgVideo || data.backgroundImage || "/Videos/hrVideo.mp4";
      return {
        // Direct props for component compatibility
        title: data.title || "Modern HR, Payroll & People Management",
        subtitle: data.subtitle || "Automate HR, empower employees, and stay compliant—on one secure platform designed for the future of work.",
        bgVideo: video,
        bgColor: data.bgColor || "bg-gradient-to-br from-[#191970] via-black to-blue-700",
        // Nested structure for data prop
        data: {
          hero: {
            title: data.title || "Modern HR, Payroll & People Management",
            subtitle: data.subtitle || "Automate HR, empower employees, and stay compliant—on one secure platform designed for the future of work.",
            bgVideo: video,
            bgColor: data.bgColor || "bg-gradient-to-br from-[#191970] via-black to-blue-700",
          }
        }
      };
    },

    // About Team Section
    AboutTeam: (data) => {
      const members = data.members || data.items || data.teamMembers || [];
      return {
        teamMembers: members,
        data: {
          title: data.title || "Meet Our Team",
          description: data.description || "",
          members: members
        }
      };
    },
    AboutTeamSection: (data) => {
      const members = data.members || data.items || data.teamMembers || [];
      return {
        teamMembers: members,
        data: {
          title: data.title || "Meet Our Team",
          description: data.description || "",
          members: members
        }
      };
    },

    Testimonials: (data) => {
      const sourceTestimonials = Array.isArray(data.testimonials)
        ? data.testimonials
        : [];

      const sectionHeader = {
        ...(data.sectionHeader || {}),
        gradientText:
          data.sectionHeader?.gradientText ||
          data.sectionHeader?.title ||
          data.title ||
          "Trusted by Industry Leaders",
        subtitle:
          data.sectionHeader?.subtitle ||
          data.description ||
          data.subtitle ||
          "Don't just take our word for it—here's what our clients say.",
      };

      const testimonials = sourceTestimonials.map((item, index) => ({
        ...item,
        id: item.id || `${index + 1}`,
        quote: item.quote || item.content || item.description || "",
        name: item.name || item.clientName || "",
        title: item.title || item.position || "",
        position: item.position || item.title || "",
        company: item.company || "",
        avatar:
          item.avatar ||
          (item.name || item.clientName || "")
            .split(" ")
            .map((part) => part[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase(),
        image: (() => {
          const raw = item.image || "";
          if (!raw || raw.trim().length < 4) return "";
          const lower = raw.toLowerCase().trim();
          if (!lower.startsWith("/") && !lower.startsWith("http://") && !lower.startsWith("https://") && !lower.startsWith("data:image")) return "";
          return rewriteUploadsUrl(raw);
        })(),
        rating:
          typeof item.rating === "number" && !Number.isNaN(item.rating)
            ? item.rating
            : 5,
      }));

      const sideImage = rewriteUploadsUrl(data.sideImage || data.image || "");

      return {
        sectionHeader,
        testimonials,
        sideImage,
        title: sectionHeader.gradientText,
        description: sectionHeader.subtitle,
        data: {
          ...data,
          sectionHeader,
          testimonials,
          sideImage,
        },
      };
    },

    TestimonialsSection: (data) => componentMappings.Testimonials(data),

    // Manufacturing Case Studies Section
    ManufacturingCaseStudiesSection: (data) => {
      const items = data.items || data.caseStudies || [];
      return {
        title: data.title || "Success Stories",
        description: data.description || "",
        items: items,
        caseStudies: items,
        data: {
          title: data.title || "Success Stories",
          description: data.description || "",
          items: items,
          caseStudies: items
        }
      };
    },
    // Alias for ManufacturingCaseStudies (without Section suffix) - matches componentMap.js
    ManufacturingCaseStudies: (data) => {
      const items = data.items || data.caseStudies || [];
      return {
        title: data.title || "Success Stories",
        description: data.description || "",
        items: items,
        caseStudies: items,
        data: {
          title: data.title || "Success Stories",
          description: data.description || "",
          items: items,
          caseStudies: items
        }
      };
    },
    CaseStudiesSection: (data) => {
      const items = data.items || data.caseStudies || [];
      return {
        title: data.title || "Success Stories",
        description: data.description || "",
        items: items,
        caseStudies: items,
        data: {
          title: data.title || "Success Stories",
          description: data.description || "",
          items: items,
          caseStudies: items
        }
      };
    },

    // Retail Challenges Section
    RetailChallengesSection: (data) => {
      const rawChallenges = data.retailChallenges || data.challenges || data.items || [];

      const retailChallenges = (Array.isArray(rawChallenges) ? rawChallenges : []).map((c) => ({
        title: c.title || "",
        description: c.description || "",
        icon: c.icon || "",
        impact: c.impact || "High",
      }));

      return {
        title: data.title || "Retail Challenges",
        subtitle: data.subtitle || "Understanding Modern Retail Obstacles",
        description: data.description || "",
        image: data.image || "",
        retailChallenges,
        data: {
          title: data.title || "Retail Challenges",
          subtitle: data.subtitle || "Understanding Modern Retail Obstacles",
          description: data.description || "",
          image: data.image || "",
          retailChallenges,
        },
      };
    },

    // Manufacturing Challenges Section
    ManufacturingChallengesSection: (data) => {
      const challenges = data.challenges || data.items || [];
      return {
        title: data.title || "Manufacturing Challenges",
        subtitle: data.subtitle || "",
        description: data.description || "",
        challenges: challenges,
        image: data.image || "",
        data: {
          title: data.title || "Manufacturing Challenges",
          subtitle: data.subtitle || "",
          description: data.description || "",
          challenges: challenges,
          image: data.image || ""
        }
      };
    },

    // Manufacturing Solutions Section
    ManufacturingSolutionsSection: (data) => {
      const solutions = data.solutions || data.items || [];
      // Normalize features in each solution
      const normalizedSolutions = solutions.map(sol => {
        let features = sol.features;
        if (typeof features === 'string') {
          features = features.split(',').map(f => f.trim()).filter(f => f);
        }
        return {
          ...sol,
          features: Array.isArray(features) ? features : []
        };
      });
      return {
        title: data.title || "NetSuite Solutions",
        subtitle: data.subtitle || "",
        description: data.description || "",
        solutions: normalizedSolutions,
        image: data.image || "",
        data: {
          title: data.title || "NetSuite Solutions",
          subtitle: data.subtitle || "",
          description: data.description || "",
          solutions: normalizedSolutions,
          image: data.image || ""
        }
      };
    },

    // Manufacturing Industry Stats
    ManufacturingIndustryStats: (data) => {
      const stats = data.stats || data.items || [];
      return {
        title: data.title || "Industry Stats",
        subtitle: data.subtitle || "",
        description: data.description || "",
        stats: stats,
        backgroundImage: data.backgroundImage || "",
        data: {
          title: data.title || "Industry Stats",
          subtitle: data.subtitle || "",
          description: data.description || "",
          stats: stats,
          backgroundImage: data.backgroundImage || ""
        }
      };
    },

    // Retail Case Studies Section
    RetailCaseStudiesSection: (data) => {
      const caseStudies = data.caseStudies || data.items || [];
      return {
        title: data.title || "Success Stories",
        subtitle: data.subtitle || "",
        description: data.description || "",
        caseStudies: caseStudies,
        items: caseStudies,
        data: {
          title: data.title || "Success Stories",
          subtitle: data.subtitle || "",
          description: data.description || "",
          caseStudies: caseStudies
        }
      };
    },

    // HR Use Cases Section
    HRUseCasesSection: (data) => {
      const useCases = data.useCases || data.items || [];
      return {
        title: data.title || "HR Use Cases",
        description: data.description || "",
        useCases: useCases,
        data: {
          title: data.title || "HR Use Cases",
          description: data.description || "",
          useCases: useCases
        }
      };
    },

    // About Milestones Section
    AboutMilestonesSection: (data) => {
      const milestones = data.milestones || [];
      const items = data.items || [];
      return {
        title: data.title || "Our Journey",
        subtitle: data.subtitle || "",
        description: data.description || "",
        milestones: milestones,
        items: items,
        data: {
          title: data.title || "Our Journey",
          subtitle: data.subtitle || "",
          description: data.description || "",
          milestones: milestones,
          items: items
        }
      };
    },

    // Service Grid Section
    ServiceGrid: (data) => {
      const services = data.services || data.items || [];
      // Normalize features in each service
      const normalizedServices = services.map(svc => {
        let features = svc.features;
        if (typeof features === 'string') {
          features = features.split(',').map(f => f.trim()).filter(f => f);
        }
        return {
          ...svc,
          features: Array.isArray(features) ? features : []
        };
      });
      return {
        title: data.title || "Our Services",
        subtitle: data.subtitle || "",
        services: normalizedServices,
        bottomCTA: data.bottomCTA || {},
        data: {
          title: data.title || "Our Services",
          subtitle: data.subtitle || "",
          services: normalizedServices,
          bottomCTA: data.bottomCTA || {}
        }
      };
    },

    // Programs Section (Training)
    ProgramsSection: (data) => {
      const programs = data.trainingPrograms || data.programs || data.items || [];
      const programsSection = data.programsSection || {};
      return {
        programsSection: {
          title: programsSection.title || data.title || "Training Programs",
          description: programsSection.description || data.description || "",
          image: programsSection.image || data.image || ""
        },
        trainingPrograms: programs,
        data: {
          programsSection: {
            title: programsSection.title || data.title || "Training Programs",
            description: programsSection.description || data.description || "",
            image: programsSection.image || data.image || ""
          },
          trainingPrograms: programs
        }
      };
    },

    // Implementation Process Section
    ImplementationProcessSection: (data) => {
      const steps = data.steps || data.items || [];
      const defaultStats = data.defaultStats || [
        { title: "Efficient", description: "Streamlined process with proven methodologies", icon: "Bolt", color: "blue" },
        { title: "Proven", description: "Tested methodology with 98% success rate", icon: "CheckCircle", color: "green" }
      ];
      return {
        title: data.title || "Implementation Process",
        subtitle: data.subtitle || "",
        image: data.image || "",
        sectionTitle: data.sectionTitle || "Implementation Process",
        keyDeliverablesTitle: data.keyDeliverablesTitle || "Key Deliverables",
        implementationDetailsTitle: data.implementationDetailsTitle || "Implementation Details",
        defaultStats: defaultStats,
        steps: steps,
        ctaButton: data.ctaButton || "",
        data: {
          title: data.title || "Implementation Process",
          subtitle: data.subtitle || "",
          image: data.image || "",
          sectionTitle: data.sectionTitle || "Implementation Process",
          keyDeliverablesTitle: data.keyDeliverablesTitle || "Key Deliverables",
          implementationDetailsTitle: data.implementationDetailsTitle || "Implementation Details",
          defaultStats: defaultStats,
          steps: steps,
          ctaButton: data.ctaButton || ""
        }
      };
    },

    // Payroll How It Works Section
    PayrollHowItWorksSection: (data) => {
      const steps = data.steps || data.items || [];
      return {
        title: data.title || "How It Works",
        description: data.description || "",
        content: data.content || "",
        steps: steps,
        data: {
          title: data.title || "How It Works",
          description: data.description || "",
          content: data.content || "",
          steps: steps
        }
      };
    },

    // Manufacturing Implementation Process
    ManufacturingImplementationProcess: (data) => {
      const processSteps = data.processSteps || data.steps || data.items || [];
      const defaultStats = data.defaultStats || [
        { title: "Efficient", description: "Streamlined process with proven methodologies", icon: "Bolt", color: "blue" },
        { title: "Proven", description: "Tested methodology with 98% success rate", icon: "CheckCircle", color: "green" }
      ];
      return {
        title: data.title || "Manufacturing Implementation Process",
        description: data.description || "",
        sectionTitle: data.sectionTitle || "Implementation Process",
        keyDeliverablesTitle: data.keyDeliverablesTitle || "Key Deliverables",
        implementationDetailsTitle: data.implementationDetailsTitle || "Implementation Details",
        defaultStats: defaultStats,
        processSteps: processSteps,
        steps: processSteps,
        data: {
          title: data.title || "Manufacturing Implementation Process",
          description: data.description || "",
          sectionTitle: data.sectionTitle || "Implementation Process",
          keyDeliverablesTitle: data.keyDeliverablesTitle || "Key Deliverables",
          implementationDetailsTitle: data.implementationDetailsTitle || "Implementation Details",
          defaultStats: defaultStats,
          processSteps: processSteps
        }
      };
    },

    // Customization Process Section
    CustomizationProcessSection: (data) => {
      const steps = data.steps || data.items || [];
      return {
        title: data.title || "Customization Process",
        steps: steps,
        data: {
          title: data.title || "Customization Process",
          steps: steps
        }
      };
    },

    // Implementation Why Choose Section
    ImplementationWhyChooseSection: (data) => {
      const features = data.features || data.items || [];
      return {
        title: data.title || "Why Choose Us",
        subtitle: data.subtitle || "",
        image: data.image || "",
        features: features,
        data: {
          title: data.title || "Why Choose Us",
          subtitle: data.subtitle || "",
          image: data.image || "",
          features: features
        }
      };
    },

    // Why Choose Section (Generic)
    WhyChooseSection: (data) => {
      const features = data.features || data.trainingFeatures || data.items || [];
      const whyChooseSection = data.whyChooseSection || {};
      return {
        title: whyChooseSection.title || data.title || "Why Choose Us",
        subtitle: data.subtitle || "",
        description: whyChooseSection.description || data.description || "",
        features: features,
        trainingFeatures: features,
        whyChooseSection: {
          title: whyChooseSection.title || data.title || "Why Choose Us",
          description: whyChooseSection.description || data.description || ""
        },
        data: {
          title: whyChooseSection.title || data.title || "Why Choose Us",
          subtitle: data.subtitle || "",
          description: whyChooseSection.description || data.description || "",
          features: features
        }
      };
    },

    // HR Benefits Section
    HRBenefitsSection: (data) => {
      const benefits = data.benefits || data.items || [];
      const features = data.features || [];
      return {
        title: data.title || "Benefits",
        subtitle: data.subtitle || "",
        description: data.description || "",
        benefits: benefits,
        features: features,
        data: {
          title: data.title || "Benefits",
          subtitle: data.subtitle || "",
          description: data.description || "",
          benefits: benefits,
          features: features
        }
      };
    },

    // Implementation Pricing Section
    ImplementationPricingSection: (data) => {
      const plans = data.plans || data.pricing || data.items || [];
      // Normalize features in each plan
      const normalizedPlans = plans.map(plan => {
        let features = plan.features;
        if (typeof features === 'string') {
          features = features.split(',').map(f => f.trim()).filter(f => f);
        }
        return {
          ...plan,
          features: Array.isArray(features) ? features : []
        };
      });
      return {
        title: data.title || "Pricing",
        subtitle: data.subtitle || "",
        plans: normalizedPlans,
        data: {
          title: data.title || "Pricing",
          subtitle: data.subtitle || "",
          plans: normalizedPlans
        }
      };
    },

    // Retail Features Section
    RetailFeaturesSection: (data) => {
      let rawFeatures = data.retailFeatures || data.features || data.items || [];
      if (!Array.isArray(rawFeatures)) rawFeatures = [];

      // Normalize each feature — ensure id, icon present and benefits is always an array
      const retailFeatures = rawFeatures.map((f, idx) => {
        let benefits = f.benefits;
        if (typeof benefits === "string") {
          benefits = benefits.split(",").map((b) => b.trim()).filter((b) => b);
        }
        return {
          id: f.id || `feature-${idx + 1}`,
          title: f.title || "",
          description: f.description || "",
          icon: f.icon || "",
          benefits: Array.isArray(benefits) ? benefits : [],
        };
      });

      return {
        title: data.title || "Retail Features",
        subtitle: data.subtitle || "",
        retailFeatures,
        data: {
          title: data.title || "Retail Features",
          subtitle: data.subtitle || "",
          retailFeatures,
        },
      };
    },

    // Retail CTA Section
    RetailCTASection: (data) => normalizeGenericCTA(data, "Ready to Transform Your Retail Operations?"),

    // Other CTA Sections
    AboutCTASection: (data) => normalizeGenericCTA(data, "Ready to Build Something Great?"),
    HRCTASection: (data) => normalizeGenericCTA(data, "Ready to Transform Your HR?"),
    ManufacturingCTASection: (data) => normalizeGenericCTA(data, "Ready to Transform Your Manufacturing Operations?"),
    CustomizationCTASection: (data) => normalizeGenericCTA(data, "Ready to Customize?"),

    // Retail Solutions Section
    RetailSolutionsSection: (data) => {
      console.log(" [RetailSolutionsSection] Raw form data:", data);

      const rawSolutions =
        Array.isArray(data.netSuiteSolutions) ? data.netSuiteSolutions :
          Array.isArray(data.solutions) ? data.solutions :
            Array.isArray(data.items) ? data.items : [];

      // Normalize each solution — ensure features is always an array
      const netSuiteSolutions = rawSolutions.map((sol) => {
        let features = sol.features;
        if (typeof features === "string") {
          features = features.split(",").map((f) => f.trim()).filter((f) => f);
        }
        return {
          title: sol.title || "",
          description: sol.description || "",
          icon: sol.icon || "",
          features: Array.isArray(features) ? features : [],
          benefits: sol.benefits || "",
        };
      });

      return {
        title: data.title || "NetSuite Solutions",
        subtitle: data.subtitle || "Comprehensive Retail Solutions",
        description: data.description || "",
        image: data.image || "",
        netSuiteSolutions,
        data: {
          title: data.title || "NetSuite Solutions",
          subtitle: data.subtitle || "Comprehensive Retail Solutions",
          description: data.description || "",
          image: data.image || "",
          netSuiteSolutions,
        },
      };
    },

    // Integration Components

    IntegrationTypesSection: (data) => {

      console.log(" [INTEGRATION TYPES DEBUG] Raw form data:", data);

      console.log(" [INTEGRATION TYPES DEBUG] Data structure analysis:", {

        hasIntegrationTypes: !!data.integrationTypes,

        hasItems: !!data.items,

        hasTypes: !!data.types,

        integrationTypesItems: data.integrationTypes?.items,

        directItems: data.items,

        directTypes: data.types,

        allDataKeys: Object.keys(data),

      });



      // PRIORITY: Direct form data OVERRIDES everything

      const itemsSource =

        data.items || // Direct items from form

        data.integrationTypes?.items || // Nested in integrationTypes

        data.types || // Alternative types array

        []; // Empty array fallback



      console.log(" [INTEGRATION TYPES DEBUG] Items source decision:", {

        source: data.items

          ? "directItems"

          : data.integrationTypes?.items

            ? "nestedItems"

            : data.types

              ? "types"

              : "empty",

        finalItems: itemsSource,

        itemsCount: itemsSource.length,

      });



      // FIX: Ensure proper property mapping for each item

      const normalizedItems = itemsSource.map((item, index) => {

        console.log(` [INTEGRATION TYPES DEBUG] Processing item ${index}:`, {

          originalItem: item,

          hasName: !!item.name,

          hasTitle: !!item.title,

          hasDescription: !!item.description,

          hasIcon: !!item.icon,

        });



        const normalizedItem = {

          title: item.title || item.name || `Integration ${index + 1}`, // Use title as primary (matches component)

          description:

            item.description || item.desc || "Integration description",

          icon: item.icon || "",

        };



        console.log(

          ` [INTEGRATION TYPES DEBUG] Normalized item ${index}:`,

          normalizedItem

        );

        return normalizedItem;

      });



      const normalized = {

        title:

          data.integrationTypes?.title || data.title || "Integration Solutions",

        items: normalizedItems,

      };



      console.log(

        " [INTEGRATION TYPES DEBUG] Final normalized data:",

        normalized

      );

      console.log(

        " [INTEGRATION TYPES DEBUG] Final items array with titles:",

        normalizedItems

      );

      return normalized;

    },



    IntegrationBenefitsSection: (data) => {

      console.log(" [INTEGRATION BENEFITS DEBUG] Raw form data:", data);

      console.log(" [INTEGRATION BENEFITS DEBUG] Data structure:", {

        hasBenefits: !!data.benefits,

        hasItems: !!data.items,

        benefitsType: Array.isArray(data.benefits)

          ? "array"

          : typeof data.benefits,

        itemsType: Array.isArray(data.items) ? "array" : typeof data.items,

        allKeys: Object.keys(data),

      });



      // Handle multiple possible data structures

      let benefitsArray = [];



      if (Array.isArray(data.benefits)) {

        // Direct benefits array from form

        benefitsArray = data.benefits;

        console.log(

          " [INTEGRATION BENEFITS DEBUG] Using direct benefits array:",

          benefitsArray

        );

      } else if (Array.isArray(data.items)) {

        // Items array from form

        benefitsArray = data.items;

        console.log(

          " [INTEGRATION BENEFITS DEBUG] Using items array:",

          benefitsArray

        );

      } else if (data.benefits && Array.isArray(data.benefits.items)) {

        // Nested benefits.items structure

        benefitsArray = data.benefits.items;

        console.log(

          " [INTEGRATION BENEFITS DEBUG] Using nested benefits.items:",

          benefitsArray

        );

      }



      console.log(

        " [INTEGRATION BENEFITS DEBUG] Benefits array:",

        benefitsArray

      );



      // Normalize each benefit item

      const normalizedBenefits = benefitsArray.map((item, index) => {

        console.log(

          ` [INTEGRATION BENEFITS DEBUG] Processing benefit ${index}:`,

          {

            originalItem: item,

            hasTitle: !!item.title,

            hasName: !!item.name,

            hasDescription: !!item.description,

            hasIcon: !!item.icon,

          }

        );



        const normalizedItem = {

          title: item.title || item.name || `Benefit ${index + 1}`,

          description: item.description || item.desc || "Benefit description",

          icon: item.icon || "",

        };



        console.log(

          ` [INTEGRATION BENEFITS DEBUG] Normalized benefit ${index}:`,

          normalizedItem

        );

        return normalizedItem;

      });



      const normalized = {

        title: data.benefits?.title || data.title || "Integration Benefits",

        items: normalizedBenefits,

        benefits: normalizedBenefits, // Support both prop names

      };



      console.log(

        " [INTEGRATION BENEFITS DEBUG] Final normalized data:",

        normalized

      );

      return normalized;

    },



    // Customization Components

    CustomizationServicesSection: (data) => {

      console.log(" [CUSTOMIZATION SERVICES DEBUG] Raw form data:", data);

      console.log(" [CUSTOMIZATION SERVICES DEBUG] Data structure:", {

        hasServices: !!data.services,

        hasItems: !!data.items,

        hasCustomizationServices: !!data.customizationServices,

        servicesType: Array.isArray(data.services)

          ? "array"

          : typeof data.services,

        itemsType: Array.isArray(data.items) ? "array" : typeof data.items,

        allKeys: Object.keys(data),

      });



      // Handle multiple data structures

      const servicesSource =

        data.services ||

        data.items ||

        data.customizationServices?.services ||

        [];



      console.log(

        " [CUSTOMIZATION SERVICES DEBUG] Services source:",

        servicesSource

      );



      // Normalize each service item

      const normalizedServices = servicesSource.map((service, index) => {

        console.log(

          ` [CUSTOMIZATION SERVICES DEBUG] Processing service ${index}:`,

          {

            originalService: service,

            hasName: !!service.name,

            hasTitle: !!service.title,

            hasDescription: !!service.description,

            hasIcon: !!service.icon,

          }

        );



        const normalizedService = {

          name: service.name || service.title || `Service ${index + 1}`,

          description:

            service.description || service.desc || "Service description",

          icon: service.icon || "",

        };



        console.log(

          ` [CUSTOMIZATION SERVICES DEBUG] Normalized service ${index}:`,

          normalizedService

        );

        return normalizedService;

      });



      const normalized = {

        title:

          data.title ||

          data.customizationServices?.title ||

          "What We Customize",

        subtitle:

          data.subtitle ||

          data.customizationServices?.subtitle ||

          "Comprehensive customization services",

        description:

          data.description ||

          data.customizationServices?.description ||

          "Tailor NetSuite to match your unique business processes",

        services: normalizedServices,

        items: normalizedServices, // Support both prop names

      };



      console.log(

        " [CUSTOMIZATION SERVICES DEBUG] Final normalized data:",

        normalized

      );

      return normalized;

    },



    PopularIntegrationsSection: (data) => ({

      title:

        data.popularIntegrations?.title || data.title || "Popular Integrations",

      platforms: data.popularIntegrations?.platforms || data.platforms || [],

    }),



    // Payroll Components

    PayrollHeroSection: (data) => ({

      title: data.title || "Automated Payroll Solutions",

      subtitle:

        data.subtitle || "Simplify payroll processing with our advanced system",

      description:

        data.description ||

        "Reduce errors and save time with automated payroll management",

      ctaButton: data.ctaButton || {

        text: "Get Started",

        link: "/payroll",

        variant: validateVariant("primary"),

      },

      backgroundImage: data.backgroundImage,

      bgVideo: data.bgVideo,

      bgColor: data.bgColor,

    }),



    PayrollPainPointsSection: (data) => {
      console.log(" [PayrollPainPointsSection] Raw form data:", data);

      // Extract painPoints array from various possible locations
      const painPointsArray =
        data.painPoints?.painPoints ||
        data.painPoints?.items ||
        (Array.isArray(data.painPoints) ? data.painPoints : null) ||
        data.items ||
        [];

      // Build the painPoints object that the component expects
      const painPointsData = {
        title: data.title || data.painPoints?.title || "Common Payroll Pain Points",
        description: data.description || data.painPoints?.description || "Problems we solve",
        painPoints: painPointsArray,
        image: data.image || data.painPoints?.image || "",
      };

      return {
        // Component expects a `painPoints` prop
        painPoints: painPointsData,
        // Also spread at top level for compatibility
        title: painPointsData.title,
        description: painPointsData.description,
        image: painPointsData.image,
      };
    },



    PayrollBenefitsSection: (data) => ({

      title: data.benefits?.title || data.title || "Payroll Benefits",

      items: data.benefits?.items || data.items || [],

      benefits: data.benefits?.items || data.benefits || data.items || [],

    }),



    PayrollWorkflowSection: (data) => {
      console.log(" [PayrollWorkflowSection] Raw form data:", data);

      // Extract steps from various possible locations
      const stepsArray =
        data.workflowSteps ||
        data.steps ||
        data.workflow?.steps ||
        [];

      // Process steps — support all field-name variants used across EB, schema, and DB
      const processedSteps = stepsArray.map((step, index) => {
        // description: step.description (schema) | step.stepDescription | step.desc (EnhancedPageBuilder)
        const description = step.description || step.stepDescription || step.desc || "";
        // features: step.features (schema/DB) | step.benefits[] (EnhancedPageBuilder) | step.details (free text)
        let features = step.features;
        if (!features || (Array.isArray(features) && features.length === 0)) {
          features = step.benefits;
        }
        if (typeof features === "string") {
          features = features.split(",").map((f) => f.trim()).filter(Boolean);
        }
        if (!Array.isArray(features)) features = [];
        return {
          title: step.title || step.stepTitle || `Step ${index + 1}`,
          stepTitle: step.stepTitle || step.title || `Step ${index + 1}`,
          description,
          stepDescription: step.stepDescription || description,
          details: step.details || "",
          features,
          automated: step.automated || "",
          compliant: step.compliant || "",
          automatedLabel: step.automatedLabel || "Automated",
          compliantLabel: step.compliantLabel || "Compliant",
        };
      });

      // Build workflowData object that component expects
      const workflowData = {
        title: data.title || data.workflow?.title || "Payroll System Built for All Industries",
        description: data.description || data.workflow?.description || "Streamline your entire payroll lifecycle",
        steps: processedSteps,
      };

      return {
        workflowData,
        title: workflowData.title,
        description: workflowData.description,
        steps: workflowData.steps,
      };
    },



    PayrollStepperSection: (data) => ({

      title:

        data.coreWorkflow?.title ||

        data.stepper?.title ||

        data.title ||

        "Payroll Process Steps",

      steps:

        data.coreWorkflow?.steps ||

        data.stepper?.steps ||

        data.steps ||

        data.stepper ||

        [],

    }),



    PayrollFAQSection: (data) => {
      console.log(" [PayrollFAQSection] Raw form data:", data);

      const items = data.faqItems || data.faq?.items || data.faq?.faqs || data.faqs || data.items || [];

      return {
        faqData: {
          title: data.faq?.title || data.title || "Payroll FAQ",
          subtitle: data.faq?.subtitle || data.subtitle || "Frequently asked questions",
          items: items
        }
      };
    },



    PayrollCTASection: (data) => {

      console.log(" [PayrollCTASection] Raw form data:", data);



      // SIMPLIFIED APPROACH: Use form data directly, minimal defaults

      const normalized = {

        // DIRECT FORM DATA MAPPING - no complex fallbacks

        title: data.title || "Ready to Simplify Your Payroll?",

        subtitle: data.subtitle || "",

        description: data.description || "",



        // CTA Button - simple structure

        ctaButton: {

          text: data.ctaButton?.text || data.buttonText || "Start Free Trial",

          link: data.ctaButton?.link || data.link || "/payroll/trial",

          variant: data.ctaButton?.variant || "primary",

        },



        // Features - only include if provided

        ...(data.features && { features: data.features }),

        ...(data.trustedBy && { trustedBy: data.trustedBy }),

      };



      console.log(" [PayrollCTASection] Normalized data:", normalized);

      return normalized;

    },



    PayrollFeaturesSection: (data) => ({

      title: data.features?.title || data.title || "Key Features",

      description:

        data.features?.description || data.subtitle || data.description,

      items: data.features?.items || data.features || data.items || [],

    }),



    PayrollWhyPerfectSection: (data) => ({

      title: data.whyPerfect?.title || data.title || "Why It's Perfect",

      items: data.whyPerfect?.items || data.whyPerfect || data.items || [],

    }),



    // About Components

    AboutMissionSection: (data) => {
      console.log(" [AboutMissionSection] Raw form data:", data);

      return {
        data: {
          title: data.title || "Our Mission",
          subtitle: data.subtitle || "",
          description: data.description || "To empower businesses with innovative technology solutions.",
          vision: data.vision || "",
          additionalContent: data.additionalContent || "",
          image: data.image || "/images/ourProServices.png",
          imageAlt: data.imageAlt || "About Bellatrix - Professional Services",
          stats: Array.isArray(data.stats) ? data.stats : [],
          missionPoints: Array.isArray(data.missionPoints) ? data.missionPoints : [],
        },
      };
    },

    AboutJourneySection: (data) => {
      console.log(" [AboutJourneySection] Raw form data:", data);

      return {
        data: {
          title: data.title || "Our Journey",
          description: data.description || "From humble beginnings to becoming a trusted Oracle NetSuite partner.",
          beginningTitle: data.beginningTitle || "The Beginning",
          beginningText: data.beginningText || "",
          growthTitle: data.growthTitle || "Growth & Evolution",
          growthText: data.growthText || "",
          todayTitle: data.todayTitle || "Today",
          todayText: data.todayText || "",
          imageUrl: data.imageUrl || data.image || "/images/solution.jpg",
          milestones: Array.isArray(data.milestones) ? data.milestones : [],
          timeline: Array.isArray(data.timeline) ? data.timeline : [],
        },
      };
    },

    AboutValuesSection: (data) => {
      console.log(" [AboutValuesSection] Raw form data:", data);

      return {
        data: {
          title: data.title || "Our Values",
          description: data.description || "",
          items: Array.isArray(data.items) ? data.items : (Array.isArray(data.values) ? data.values : []),
        },
        values: Array.isArray(data.items) ? data.items : (Array.isArray(data.values) ? data.values : []),
      };
    },

    AboutDifferentiatorsSection: (data) => {
      console.log(" [AboutDifferentiatorsSection] Raw form data:", data);

      return {
        data: {
          title: data.title || "What Makes Us Different",
          description: data.description || "",
          items: Array.isArray(data.items) ? data.items : [],
        },
        items: Array.isArray(data.items) ? data.items : [],
      };
    },



    // HR Components





    HRModulesSection: (data) => ({

      data: {

        title: data.title || "HR Modules",

        subtitle: data.subtitle || "Comprehensive HR solutions",

        description: data.description || "",

        modules: (data.features || data.modules || data.items || []).map(

          (item) => ({

            ...item,

            desc: item.description || item.desc || "Module description",

          })

        ),

      },

    }),


    // NOTE: HRBenefitsSection is defined above at line ~517

    HRPricingSection: (data) => {
      console.log(" [HRPricingSection] Raw form data:", data);

      return {
        data: {
          title: data.title || "Implementation Pricing",
          description: data.description || "Choose the perfect implementation plan that fits your business needs and budget",
          pricing: Array.isArray(data.pricing) ? data.pricing : (Array.isArray(data.items) ? data.items : []),
        }
      };
    },

    HRFAQSection: (data) => {
      console.log(" [HRFAQSection] Raw form data:", data);

      const items = data.faq?.items || data.faq?.faqs || data.faqs || data.items || [];

      return {
        data: {
          faq: {
            title: data.faq?.title || data.title || "Frequently Asked Questions",
            items: items.map(item => ({
              q: item.question || item.q,
              a: item.answer || item.a
            }))
          }
        }
      };
    },

    // Training Components

    TrainingHeroSection: (data) => {

      console.log(" [TrainingHeroSection] Raw form data:", data);

      console.log(" [TRAINING HERO DEBUG] CTA Button data:", {

        hasCtaButton: !!data.ctaButton,

        ctaButtonData: data.ctaButton,

        hasButtonText: !!data.buttonText,

        hasLink: !!data.link,

        hasVariant: !!data.variant,

      });



      const buttonVariant = validateVariant(

        data.ctaButton?.variant || data.variant || "primary"

      );



      console.log(" [TrainingHeroSection] Variant Processing:", {

        originalVariant: data.ctaButton?.variant || data.variant,

        processedVariant: buttonVariant,

        variantType: typeof buttonVariant,

      });



      const normalized = {

        heroContent: {

          title:

            data.heroContent?.title ||

            data.hero?.title ||

            data.title ||

            "Professional Training Programs",

          subtitle:

            data.heroContent?.subtitle ||

            data.hero?.subtitle ||

            data.subtitle ||

            "Professional ERP Education & Skills Development",

          description:

            data.heroContent?.description ||

            data.hero?.description ||

            data.description ||

            "Empower your team with comprehensive training solutions designed to enhance skills and drive success",

        },

        backgroundImage:

          data.backgroundImage ||

          data.bgImage ||

          data.heroContent?.backgroundImage ||

          "/images/training.jpg",

        backgroundVideo:

          data.backgroundVideo ||

          data.bgVideo ||

          null,

        // Proper CTA button handling with form data

        ctaButton: data.ctaButton

          ? {

            text: data.ctaButton.text || "Start Learning Today",

            link: data.ctaButton.link || "/training",

            variant: buttonVariant,

            icon: data.ctaButton.icon,

          }

          : {

            text: data.buttonText || "Start Learning Today",

            link: data.link || "/training",

            variant: buttonVariant,

          },

      };



      console.log(

        " [TrainingHeroSection] Normalized data with CTA:",

        normalized

      );

      return normalized;

    },



    TrainingProgramsSection: (data) => {

      console.log(" [NORMALIZE DEBUG] TrainingProgramsSection RAW DATA:", {

        directImage: data.image,

        programsSectionImage: data.programsSection?.image,

        allDataKeys: Object.keys(data),

        fullData: data,

      });



      // PRIORITY: Direct form data OVERRIDES everything

      const imageSource =

        data.image || // Direct image from form

        data.programsSection?.image || // Nested in programsSection

        data.programsSection?.image || // From existing programsSection

        "/images/training.jpg"; // Final fallback



      console.log(" [NORMALIZE DEBUG] Final image decision:", {

        source: data.image

          ? "direct"

          : data.programsSection?.image

            ? "nested"

            : "fallback",

        finalImage: imageSource,

        imageSources: {

          directImage: data.image,

          programsSectionImage: data.programsSection?.image,

          fallbackImage: "/images/training.jpg",

        },

      });



      const normalized = {

        programsSection: {

          title:

            data.title ||

            data.programsSection?.title ||

            "Our Training Programs",

          description:

            data.description ||

            data.programsSection?.description ||

            "Comprehensive training solutions designed to empower your team with the skills they need to excel",

          image: imageSource, // USE THE RESOLVED IMAGE

          Professional_Badge:

            data.badge ||

            data.programsSection?.Professional_Badge ||

            "Certified Training",

        },

        trainingPrograms: {

          programs:

            data.trainingPrograms?.programs ||

            data.programs ||

            data.trainingPrograms ||

            [],

        },

      };



      console.log(" [NORMALIZE DEBUG] Final normalized data:", normalized);

      console.log(

        " [NORMALIZE DEBUG] Final image URL:",

        normalized.programsSection.image

      );

      return normalized;

    },

    TrainingKeyModulesSection: (data) => {
      console.log(
        " [NORMALIZE DEBUG] TrainingKeyModulesSection RAW DATA:",
        data,
      );

      const section =
        data.keyModulesSection ||
        data.section || {
          title:
            data.title ||
            "Key Training Modules",
          description:
            data.description ||
            data.content ||
            "Comprehensive curriculum designed to master NetSuite from foundation to advanced implementation",
        };

      const rawModules =
        data.keyModules ||
        data.modules ||
        data.items ||
        [];

      const keyModules = Array.isArray(rawModules)
        ? rawModules
        : typeof rawModules === "string"
          ? rawModules

            .split(/[;\n,]+/)

            .map((s, i) => ({
              id: i,
              title: s.trim(),
              description: "",
            }))

            .filter((m) => m.title)
          : [];

      const normalized = {
        keyModulesSection: section,
        keyModules,
      };

      console.log(
        " [NORMALIZE DEBUG] TrainingKeyModulesSection normalized data:",
        normalized,
      );

      return normalized;
    },



    TrainingWhyChooseSection: (data) => {
      const existingSection = data.whyChooseSection || {};

      return {
        whyChooseSection: {
          title:
            existingSection.title ||
            data.title ||
            "Why Choose Our Training?",
          description:
            existingSection.description ||
            data.description ||
            data.subtitle ||
            "We provide world-class training solutions",
          image:
            existingSection.image ||
            data.image ||
            "/images/indleaders.jpg",
          Professional_Badge:
            existingSection.Professional_Badge ||
            existingSection.badge ||
            data.Professional_Badge ||
            data.badge ||
            "Excellence Training",
        },
        trainingFeatures: (data.trainingFeatures || data.features || []).map(
          (f, i) => ({
            ...f,
            id: f.id || f.featureId || `feature-${i}`,
          })
        ),
      };
    },



    // Implementation Components

    ImplementationHeroSection: (data) => {

      console.log(" [ImplementationHeroSection] Raw form data:", data);



      // FIX: Use validateVariant to convert string to proper variant

      const ctaVariant = validateVariant(

        data.ctaButton?.variant || data.variant || "primary"

      );



      const normalized = {

        data: {

          backgroundVideo:

            data.backgroundVideo ||

            data.backgroundImage ||

            "/Videos/HomeHeroSectionV.mp4",

          backgroundImage:

            data.backgroundImage ||

            data.backgroundVideo ||

            "/Videos/HomeHeroSectionV.mp4",

          title: data.title || "Implementation Services",

          subtitle: data.subtitle || "Seamless deployments by experts",

          titleParts:

            data.titleParts ||

            (data.title && data.subtitle

              ? [data.title, data.subtitle]

              : ["Implementation", "Services", "Made", "Simple"]),

          description:

            data.description ||

            "We plan, configure, and launch with zero downtime",

          ctaButton: {

            text:

              data.ctaButton?.text || data.buttonText || "Talk to an expert",

            link: data.ctaButton?.link || data.link || null,

            variant: ctaVariant, // Now this is a validated variant string

            icon:

              data.ctaButton?.icon || data.icon || "M13 7l5 5m0 0l-5 5m5-5H6",

          },

        },

      };



      console.log(

        " [ImplementationHeroSection] Normalized data:",

        normalized

      );

      console.log(" [ImplementationHeroSection] CTA Variant:", ctaVariant);

      return normalized;

    },

    // NOTE: ImplementationPricingSection is defined above at line ~537
    // NOTE: ImplementationProcessSection is defined above at line ~412



    // Manufacturing-specific implementation process: Some builders save the

    // steps under different keys (processSteps, steps, items). The

    // manufacturing component expects a `data` prop with a `steps` array

    // (see `ImplementationProcess.jsx` -> useComponentData('implementationProcess', data, ...)).





    ImplementationBenefitsSection: (data) => ({

      title: data.benefits?.title || data.title || "Implementation Benefits",

      items: data.benefits?.items || data.items || [],

      benefits: data.benefits?.items || data.benefits || data.items || [],

    }),



    // About Components
    AboutHeroSection: (data) => {

      console.log(" [AboutHeroSection] Raw form data:", data);



      return {
        title: data.title || "About Us",
        subtitle: data.subtitle || "Your trusted partner",
        description: data.description || "We help businesses transform",
        backgroundVideo: data.backgroundVideo || "",
        backgroundImage: data.backgroundImage || "",
        image: data.image || "",
        stats: data.stats || [],

        data: {

          title: data.title || "About Us",

          subtitle: data.subtitle || "Your trusted partner",

          description: data.description || "We help businesses transform",

          backgroundVideo: data.backgroundVideo || "",

          stats: data.stats || [],

        },

      };

    },


    // NOTE: AboutMissionSection, AboutJourneySection, AboutValuesSection, 
    // AboutDifferentiatorsSection, and AboutMilestonesSection are defined earlier in the file
    // Do not add duplicate definitions here.

    // Support Components
    SupportHeroSection: (data) => {
      // DB stores ctaButton as an object {text, link} or ctaButtonText as string
      const ctaButtonText = typeof data.ctaButton === 'object'
        ? data.ctaButton?.text || data.ctaButton?.label || ""
        : data.ctaButtonText || data.ctaButton || "";
      return {
        title: data.title || "Bellatrix Support",
        description: data.description || "Get access to expert knowledge and ongoing NetSuite support after your initial go-live phase.",
        ctaButtonText: ctaButtonText,
        backgroundImage: data.backgroundImage || data.image || "/images/Support/HeroSection.png",
        data: {
          title: data.title || "Bellatrix Support",
          description: data.description || "Get access to expert knowledge and ongoing NetSuite support after your initial go-live phase.",
          ctaButtonText: ctaButtonText,
          backgroundImage: data.backgroundImage || data.image || "/images/Support/HeroSection.png",
        },
      };
    },

    SupportCustomerSection: (data) => {
      const items = data.items || [];
      return {
        title: data.title || "Bellatrix Customer Support",
        subtitle: data.subtitle || "When and How You Need It",
        description: data.description || "Our dedicated support team is here to ensure your success with comprehensive assistance and expert guidance.",
        image: data.image || "https://i.pinimg.com/1200x/c4/3b/47/c43b47b28329114afa50028b00c829b8.jpg",
        items: items,
        contentDescription: data.contentDescription || "For Bellatrix technical support concerning unexpected ERP implementation issues or keeping an eye on customizations and configurations, our team of Bellatrix consultants are available for as much or as little support as you need.",
        supportInfoTitle: data.supportInfoTitle || "24/7 Support Available",
        supportInfoDescription: data.supportInfoDescription || "Our support team is available around the clock to ensure your business operations run smoothly without interruption.",
        data: {
          title: data.title || "Bellatrix Customer Support",
          subtitle: data.subtitle || "When and How You Need It",
          description: data.description || "Our dedicated support team is here to ensure your success with comprehensive assistance and expert guidance.",
          image: data.image || "https://i.pinimg.com/1200x/c4/3b/47/c43b47b28329114afa50028b00c829b8.jpg",
          items: items,
          contentDescription: data.contentDescription,
          supportInfoTitle: data.supportInfoTitle || "24/7 Support Available",
          supportInfoDescription: data.supportInfoDescription,
        },
      };
    },

    SupportSecondSection: (data) => {
      // DB stores description1, description2 as separate fields
      return {
        title: data.title || "",
        description1: data.description1 || data.description || "",
        description2: data.description2 || "",
        image: data.image || data.backgroundImage || "",
        items: data.items || [],
        data: { ...data },
      };
    },

    SupportSherpaCareSection: (data) => {
      return {
        title: data.title || "",
        subtitle: data.subtitle || "",
        description: data.description || "",
        items: data.items || data.services || [],
        data: { ...data, items: data.items || data.services || [] },
      };
    },

    SupportWhatWeOfferSection: (data) => {
      // DB stores cards array with {image, title, description} objects
      const cards = data.cards || data.items || data.offerings || [];
      // Fix wrong /public/ prefix in card image paths stored in DB
      const fixedCards = cards.map(card => ({
        ...card,
        image: card.image ? card.image.replace(/^\/public\//, '/') : card.image,
      }));
      return {
        title: data.title || "",
        subtitle: data.subtitle || "",
        description: data.description || "",
        cards: fixedCards,
        items: fixedCards,
        data: { ...data, cards: fixedCards, items: fixedCards },
      };
    },

    SupportDedicatedTeamSection: (data) => {
      const defaultTitle = "Your Own Dedicated Team of Bellatrix";
      const defaultImage = "/images/Support/team.jpeg";
      const defaultItems = [
        "A team will be assigned to you that is familiar with your organization, how you do things, and most importantly, your goals for your Bellatrix system",
        "A committed team familiar with your Bellatrix environment",
        "Experienced professionals, including a project lead and solution consultants",
        "Structured collaboration to avoid knowledge silos",
        "Access to the collective expertise of a broad team of Bellatrix specialists",
      ];

      // Image: top-level > members[0].image > backgroundImage > default
      const sectionImage =
        data.image ||
        data.members?.[0]?.image ||
        data.backgroundImage ||
        defaultImage;

      // Items: from items[] > from bulletPoints[] > from members[].bio/text > defaults
      let rawItems = [];
      if (data.items?.length) {
        rawItems = data.items;
      } else if (data.bulletPoints?.length) {
        rawItems = data.bulletPoints.map((b) =>
          typeof b === "string" ? b : b.text || b.label || ""
        ).filter(Boolean);
      } else if (data.members?.length) {
        rawItems = data.members
          .map((m) => m.bio || m.text || m.description || "")
          .filter(Boolean);
      }
      const sectionItems = rawItems.length ? rawItems : defaultItems;

      return {
        title: data.title || defaultTitle,
        image: sectionImage,
        items: sectionItems,
        members: data.members || [],
        data: { ...data, title: data.title || defaultTitle, image: sectionImage, items: sectionItems },
      };
    },

    SupportPrePackagedSection: (data) => {
      const packages = data.packages || data.items || [];
      return {
        title: data.title || "",
        subtitle: data.subtitle || "",
        description: data.description || "",
        // Keep `packages` as the canonical key to match the schema field name
        // so the admin form and the client component both use the same key.
        packages,
        // Also expose as `items` for components that reference it that way
        items: packages,
        data: { ...data, packages, items: packages },
      };
    },

    SupportBellatrixSection: (data) => {
      const defaultAdminSupport = [
        "Ongoing Bellatrix administration",
        "Maintain secure access",
        "Data cleansing and upload",
        "Data administration & maintenance",
        "Help with optimizing the usage of Bellatrix",
        "Monitor usage & transactions",
        "Provide support for your IT team on technical issues",
        "Create new users, roles",
        "Create Saved searches",
        "General support, analytics",
        "Upgrades and testing",
      ];
      const defaultFunctionalSupport = [
        "End User Support",
        "Answer How To Questions",
        "Provide solutions for business requirements",
        "Train new users",
        "Help in performing functional tasks and transactions",
        "Help your IT team in resolving end user requests",
        "Help in running reports/ dashboards",
        "Help with using best practices of Bellatrix",
        "Monitor functional usage and transactions",
        "Year and month end processes",
      ];
      const defaultDevelopmentSupport = [
        "Create New reports",
        "Create New dashboards",
        "Create or manage automated processes with Bellatrix SuiteFlows",
        "Enhance Bellatrix functionality with scripting using Bellatrix SuiteScripts",
        "Create Forms",
        "Integrations",
        "Installation of Suite Bundle as required",
      ];

      const resolveArray = (val, fallback) => {
        if (Array.isArray(val) && val.length > 0)
          return val.map((i) => (typeof i === "string" ? i : i.text || i.label || "")).filter(Boolean);
        return fallback;
      };

      return {
        title: data.title || "Your One-Stop-Shop for Bellatrix Support",
        description1: data.description1 || "Your business, and how you run it, is very unique. So is your Bellatrix instance and required support. Our consultants are well versed in a multitude of different areas to ensure that regardless of the level of support that you require, we can assist you.",
        description2: data.description2 || "Whether you're in need of functional support, administrator support, development support, or all the above, SherpaCare is the answer.",
        adminSupportTitle: data.adminSupportTitle || "Admin Support",
        functionalSupportTitle: data.functionalSupportTitle || "Functional Support",
        developmentSupportTitle: data.developmentSupportTitle || "Development Support",
        adminSupport: resolveArray(data.adminSupport, defaultAdminSupport),
        functionalSupport: resolveArray(data.functionalSupport, defaultFunctionalSupport),
        developmentSupport: resolveArray(data.developmentSupport, defaultDevelopmentSupport),
        data: { ...data },
      };
    },

    SupportPayPerUseSection: (data) => {
      const defaultTitle = "Only Pay for the Hours you Use";
      const defaultImage = "/images/Support/pay2.jpeg";
      const defaultDescription1 =
        "Stop paying a lot of money for support that you may not use! How many real hours do you get to take advantage of in your support contract? If you don't use them, do you lose them?";
      const defaultDescription2 =
        "Our approach is different. Our monthly reviews focus on the realignment of time/hours not used and outlines new ways to leverage unused support hours in order to optimize your system.";

      const items = data.items || data.benefits || data.features || [];
      const rawImage = rewriteUploadsUrl(
        data.image || data.backgroundImage || defaultImage
      );
      const resolvedImage = isLikelyImageUrl(rawImage)
        ? rawImage
        : defaultImage;
      return {
        title: data.title || defaultTitle,
        image: resolvedImage,
        description1: data.description1 || defaultDescription1,
        description2: data.description2 || defaultDescription2,
        items: items,
        benefits: data.benefits || [],
        pricing: data.pricing || {},
        data: { ...data, items: items, image: resolvedImage },
      };
    },

    SupportWhyChooseSection: (data) => {
      return {
        title: data.title || "",
        subtitle: data.subtitle || "",
        description: data.description || "",
        items: data.items || data.reasons || [],
        data: { ...data, items: data.items || data.reasons || [] },
      };
    },

    SolutionsGallery: (data) => {
      const solutions = Array.isArray(data.solutions) ? data.solutions : [];
      return {
        title: data.title || "",
        subtitle: data.subtitle || "",
        ctaButtonText: data.ctaButtonText || "",
        solutions: solutions.map((s) => ({
          id: s.id || s.title?.toLowerCase().replace(/\s+/g, "-") || "",
          title: s.title || "",
          subtitle: s.subtitle || "",
          category: s.category || "",
          description: s.description || "",
          image: s.image ? rewriteUploadsUrl(s.image) : "",
          href: s.href || "",
          accentColor: s.accentColor || "#6366f1",
          featured: !!s.featured,
          features: Array.isArray(s.features) ? s.features : [],
        })),
        data: data,
      };
    },




    // Generic fallback for unknown components

    default: (data) => {

      // Try to extract common patterns

      const normalized = {};



      // Common title patterns

      if (data.title) normalized.title = data.title;

      if (data.subtitle) normalized.subtitle = data.subtitle;

      if (data.description) normalized.description = data.description;

      // Hero component specific patterns
      if (data.slides) normalized.slides = data.slides;
      if (data.stats) normalized.stats = data.stats;
      if (data.video) normalized.video = data.video;
      if (data.backgroundVideo) normalized.backgroundVideo = data.backgroundVideo;
      if (data.backgroundImage)
        normalized.backgroundImage = rewriteUploadsUrl(data.backgroundImage);
      if (data.image) normalized.image = rewriteUploadsUrl(data.image);
      if (data.imageUrl) normalized.imageUrl = rewriteUploadsUrl(data.imageUrl);
      if (data.sideImage) normalized.sideImage = rewriteUploadsUrl(data.sideImage);
      // Also try to extract image from nested section objects
      if (!normalized.image && data.programsSection?.image) normalized.image = data.programsSection.image;
      if (!normalized.image && data.heroSection?.image) normalized.image = data.heroSection.image;

      // Common object patterns - pass through nested sections
      if (data.ctaButton) normalized.ctaButton = data.ctaButton;
      if (data.sectionHeader) normalized.sectionHeader = data.sectionHeader;
      if (data.programsSection) normalized.programsSection = data.programsSection;
      if (data.trainingPrograms) normalized.trainingPrograms = data.trainingPrograms;
      if (data.features) normalized.features = data.features;
      if (data.data) normalized.data = data.data;



      // Common array patterns - try to find the most relevant array

      const arrayKeys = [

        "items",

        "list",

        "steps",

        "benefits",

        "features",

        "modules",

        "programs",

        "faqs",

        "painPoints",

        "slides",

        "stats",

        "testimonials",

        "industries",

        "services",

        "values",

        "members",

        "milestones",

        "useCases",

      ];

      for (const key of arrayKeys) {

        if (data[key] && Array.isArray(data[key])) {

          normalized[key] = data[key];

          // Also set as 'items' for components that expect it

          if (!normalized.items) normalized.items = data[key];

        }

      }



      return normalized;

    },

  };



  // Get the specific mapping function or use default

  const mappingFunction =

    componentMappings[componentType] ||
    (componentType?.endsWith("Section")
      ? componentMappings[componentType.replace(/Section$/, "")]
      : null) ||
    componentMappings["default"];



  if (!mappingFunction) {

    console.warn(

      `normalizeProps: No mapping function found for ${componentType}`

    );

    return {};

  }



  try {

    const normalizedProps = mappingFunction(sanitizedData);



    // Enhanced logging to verify form data is being used

    console.log(` [normalizeProps] Successfully normalized ${componentType}`);

    console.log(

      ` [normalizeProps] Input data keys:`,

      Object.keys(sanitizedData)

    );

    console.log(

      ` [normalizeProps] Output props keys:`,

      Object.keys(normalizedProps)

    );



    // Check if form data was actually used (not just defaults)

    const hasFormData = Object.keys(sanitizedData).length > 0;

    if (hasFormData) {

      console.log(

        ` [normalizeProps] Form data detected and processed for ${componentType}`

      );

    } else {

      console.log(

        ` [normalizeProps] No form data found for ${componentType}, using defaults`

      );

    }



    return normalizedProps;

  } catch (error) {

    console.error(

      ` [normalizeProps] Error normalizing props for ${componentType}:`,

      error

    );

    return {};

  }

};



/**

 * Helper function to safely extract data from nested JSON structures

 * @param {Object} data - The data object

 * @param {string} path - Dot notation path (e.g., 'integrationTypes.items')

 * @param {*} defaultValue - Default value if path not found

 * @returns {*} - The value at the path or default value

 */

export const safeGet = (data, path, defaultValue = null) => {

  if (!data || typeof data !== "object") return defaultValue;



  const keys = path.split(".");

  let current = data;



  for (const key of keys) {

    if (current && typeof current === "object" && key in current) {

      current = current[key];

    } else {

      return defaultValue;

    }

  }



  return current !== undefined ? current : defaultValue;

};



/**

 * Validates that required props are present for a component

 * @param {string} componentType - The component type

 * @param {Object} props - The props to validate

 * @returns {Object} - Validation result with isValid and missingProps

 */

export const validateProps = (componentType, props) => {

  const requiredProps = {

    IntegrationTypesSection: ["title", "items"],

    IntegrationBenefitsSection: ["title", "items"],

    CustomizationServicesSection: ["title", "items"],

    PopularIntegrationsSection: ["title", "platforms"],

    PayrollHeroSection: ["title", "subtitle"],

    PayrollPainPointsSection: ["title", "painPoints"],

    PayrollBenefitsSection: ["title", "items"],

    PayrollWorkflowSection: ["title", "steps"],

    PayrollStepperSection: ["steps"],

    PayrollFAQSection: ["title", "faqs"],

    PayrollCTASection: ["title", "cta"],

    HRHeroSection: ["data"],

    HRModulesSection: ["data"],

    HRBenefitsSection: ["title", "items"],

    ImplementationHeroSection: ["data"],

    TrainingHeroSection: ["heroContent"],

    TrainingProgramsSection: ["programsSection", "trainingPrograms"],

    TrainingWhyChooseSection: ["whyChooseSection", "trainingFeatures"],

  };



  const required = requiredProps[componentType] || [];

  const missingProps = required.filter((prop) => {

    if (prop.includes(".")) {

      // Handle nested props like 'data.hero'

      return !safeGet(props, prop);

    }

    return (

      !props[prop] || (Array.isArray(props[prop]) && props[prop].length === 0)

    );

  });



  return {

    isValid: missingProps.length === 0,

    missingProps,

  };

};



export default normalizeProps;

