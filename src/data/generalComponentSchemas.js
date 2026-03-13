/**

 * General Component Schema Registry

 * Provides basic schemas for components that don't have specific schemas

 */

export const generalComponentSchemas = {
  // ============================================
  // ABOUT COMPONENTS
  // ============================================

  AboutMissionSection: {
    componentName: "AboutMissionSection",
    category: "about",
    icon: "",
    displayName: "About Mission Section",
    description: "Mission and vision statement with image and stats",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", label: "Section Title", placeholder: "Our Mission", formField: "text" },
        subtitle: { type: "string", label: "Subtitle", placeholder: "Transforming businesses", formField: "text" },
        description: { type: "string", label: "Description", placeholder: "Mission description", formField: "textarea" },
        vision: { type: "string", label: "Vision Statement", placeholder: "Our vision", formField: "textarea" },
        visionTitle: { type: "string", label: "Vision Title", placeholder: "Our Vision", formField: "text" },
        additionalContent: { type: "string", label: "Additional Content", placeholder: "More information", formField: "textarea" },
        image: { type: "string", label: "Section Image", placeholder: "/images/mission.jpg", formField: "media", mediaType: "image" },
        badgeText: { type: "string", label: "Badge Text", placeholder: "Industry Leader", formField: "text" },
        missionPointsTitle: { type: "string", label: "Key Focus Areas Title", placeholder: "Key Focus Areas", formField: "text" },
        stats: {
          type: "array",
          label: "Statistics",
          items: {
            type: "object",
            properties: {
              value: { type: "string", label: "Value (e.g. 500+)", placeholder: "500+", formField: "text" },
              label: { type: "string", label: "Label", placeholder: "Projects Completed", formField: "text" },
            },
          },
          formField: "array",
        },
        missionPoints: {
          type: "array",
          label: "Key Focus Areas",
          items: {
            type: "object",
            properties: {
              title: { type: "string", label: "Point Title", formField: "text" },
              description: { type: "string", label: "Description", formField: "textarea" },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      title: "Our Mission",
      subtitle: "Transforming businesses through technology",
      description: "To empower businesses with innovative technology solutions.",
      vision: "To be the global leader in business transformation consulting.",
      visionTitle: "Our Vision",
      additionalContent: "",
      image: "/images/ourProServices.png",
      badgeText: "Industry Leader",
      missionPointsTitle: "Key Focus Areas",
      stats: [
        { value: "500+", label: "Projects Completed" },
        { value: "98%", label: "Client Satisfaction" },
        { value: "15+", label: "Years Experience" },
        { value: "50+", label: "Expert Team" },
      ],
      missionPoints: [],
    },
  },

  AboutJourneySection: {
    componentName: "AboutJourneySection",
    category: "about",
    icon: "",
    displayName: "About Journey Section",
    description: "Company journey timeline with milestones",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", label: "Section Title", placeholder: "Our Journey", formField: "text" },
        description: { type: "string", label: "Description", placeholder: "From humble beginnings...", formField: "textarea" },
        beginningTitle: { type: "string", label: "Beginning Title", placeholder: "The Beginning", formField: "text" },
        beginningText: { type: "string", label: "Beginning Text", placeholder: "Founded in 2008...", formField: "textarea" },
        growthTitle: { type: "string", label: "Growth Title", placeholder: "Growth & Evolution", formField: "text" },
        growthText: { type: "string", label: "Growth Text", placeholder: "Over the years...", formField: "textarea" },
        todayTitle: { type: "string", label: "Today Title", placeholder: "Today", formField: "text" },
        todayText: { type: "string", label: "Today Text", placeholder: "We continue to innovate...", formField: "textarea" },
        imageUrl: { type: "string", label: "Journey Image", placeholder: "/images/journey.jpg", formField: "media", mediaType: "image" },
        milestones: {
          type: "array",
          label: "Milestones",
          items: {
            type: "object",
            properties: {
              year: { type: "string", label: "Year", formField: "text" },
              title: { type: "string", label: "Title", formField: "text" },
              description: { type: "string", label: "Description", formField: "textarea" },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      title: "Our Journey",
      description: "From humble beginnings to a trusted partner.",
      beginningTitle: "The Beginning",
      beginningText: "Founded with a vision to transform businesses.",
      growthTitle: "Growth & Evolution",
      growthText: "Evolved from a small firm to a comprehensive partner.",
      todayTitle: "Today",
      todayText: "We continue to innovate.",
      imageUrl: "/images/solution.jpg",
      milestones: [],
    },
  },

  AboutValuesSection: {
    componentName: "AboutValuesSection",
    category: "about",
    icon: "",
    displayName: "About Values Section",
    description: "Company core values with icons",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", label: "Section Title", placeholder: "Our Values", formField: "text" },
        description: { type: "string", label: "Description", placeholder: "These core values guide us", formField: "textarea" },
        items: {
          type: "array",
          label: "Values",
          items: {
            type: "object",
            properties: {
              title: { type: "string", label: "Value Title", formField: "text" },
              description: { type: "string", label: "Description", formField: "textarea" },
              icon: { type: "string", label: "Icon (Emoji)", formField: "text" },
              color: { type: "string", label: "Gradient Color", formField: "text" },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      title: "Our Values",
      description: "These core values guide everything we do.",
      items: [],
    },
  },

  AboutDifferentiatorsSection: {
    componentName: "AboutDifferentiatorsSection",
    category: "about",
    icon: "",
    displayName: "About Differentiators Section",
    description: "What sets us apart with stats",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", label: "Section Title", placeholder: "What Sets Us Apart", formField: "text" },
        description: { type: "string", label: "Description", placeholder: "Our unique combination...", formField: "textarea" },
        items: {
          type: "array",
          label: "Differentiators",
          items: {
            type: "object",
            properties: {
              title: { type: "string", label: "Title", formField: "text" },
              description: { type: "string", label: "Description", formField: "textarea" },
              stats: { type: "string", label: "Stats Badge", formField: "text" },
              icon: { type: "string", label: "Icon (Emoji)", formField: "text" },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      title: "What Sets Us Apart",
      description: "Our unique combination of expertise makes us the preferred choice.",
      items: [],
    },
  },

  // ============================================
  // IMPLEMENTATION COMPONENTS 
  // ============================================
  ImplementationModal: {
    componentName: "ImplementationModal",

    category: "implementation",

    icon: "",

    displayName: "Implementation Modal",

    description: "Contact modal for implementation service page",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Contact Us",

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Subtitle",

          placeholder: "Let's discuss your project",

          formField: "text",
        },
      },
    },

    defaultData: {
      title: "Contact Us",

      subtitle: "Let's discuss your project",
    },
  },

  // Implementation Components

  // Hero Section (Flat - matches ID 116)
  HeroSection: {
    componentName: "HeroSection",
    category: "general",
    icon: "",
    displayName: "Hero Section",
    description: "Standard Hero Section with video background",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Title",
          placeholder: "Enter title",
          formField: "text",
        },
        subtitle: {
          type: "string",
          label: "Subtitle",
          placeholder: "Enter subtitle",
          formField: "text"
        },
        description: {
          type: "string",
          label: "Description",
          placeholder: "Enter description",
          formField: "textarea",
        },
        backgroundVideo: {
          type: "string",
          label: "Background Video URL",
          placeholder: "/Videos/implementation/homepage_hero.mp4",
          formField: "media",
          mediaType: "video",
        },
        ctaButton: {
          type: "object",
          label: "CTA Button",
          properties: {
            text: { type: "string", label: "Text", formField: "text" },
            link: { type: "string", label: "Link", formField: "text" },
            variant: {
              type: "string",
              label: "Variant",
              formField: "select",
              options: [{ value: "primary", label: "Primary" }, { value: "secondary", label: "Secondary" }]
            }
          },
          formField: "object"
        }
      },
    },
    defaultData: {
      title: "Welcome",
      subtitle: "",
      description: "",
      backgroundVideo: "/Videos/implementation/homepage_hero.mp4",
      ctaButton: { text: "Get Started", variant: "primary" }
    },
  },

  Hero: {
    componentName: "Hero",
    category: "hero",
    icon: "",
    displayName: "Home Hero",
    description: "Main Home Hero with video slides",
    schema: {
      type: "object",
      properties: {
        slides: {
          type: "array",
          label: "Hero Slides",
          items: {
            type: "object",
            properties: {
              title: { type: "string", label: "Title", formField: "text" },
              subtitle: { type: "string", label: "Subtitle", formField: "text" },
              description: { type: "string", label: "Description", formField: "textarea" },
              video: { type: "string", label: "Video URL", formField: "media", mediaType: "video" },
            },
          },
          formField: "array",
        },
        stats: {
          type: "array",
          label: "Statistics",
          items: {
            type: "object",
            properties: {
              value: { type: "string", label: "Value", formField: "text" },
              label: { type: "string", label: "Label", formField: "text" },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      slides: [
        {
          title: "Strategic Business Transformation",
          subtitle: "Oracle NetSuite Consultancy",
          description: "Streamline operations and drive growth with our comprehensive NetSuite solutions.",
          video: "/Videos/implementation/homepage_hero.mp4",
        },
      ],
      stats: [
        { value: "500+", label: "Projects Completed" },
        { value: "15+", label: "Years Experience" },
      ],
    },
  },



  ProcessSection: {
    componentName: "ProcessSection",

    category: "implementation",

    icon: "",

    displayName: "Implementation Process Section",

    description: "Process section for implementation service page",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Our Implementation Process",

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Subtitle",

          placeholder:
            "A proven methodology for seamless business transformation",

          formField: "text",
        },

        image: {
          type: "string",

          label: "Image URL",

          placeholder: "/Videos/implementation/implementProcess.jpg",

          formField: "media",

          mediaType: "image",
        },

        steps: {
          type: "array",

          label: "Steps",

          items: {
            type: "object",

            properties: {
              title: { type: "string", label: "Step Title", formField: "text" },

              description: {
                type: "string",

                label: "Step Description",

                formField: "textarea",
              },
            },
          },

          formField: "array",
        },

        ctaButton: {
          type: "object",
          label: "CTA Button",
          properties: {
            text: {
              type: "string",
              label: "Button Text",
              placeholder: "Start Your Journey",
              formField: "text"
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/contact",
              formField: "text"
            },
            variant: {
              type: "string",
              label: "Button Style",
              formField: "select",
              options: [
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "outline", label: "Outline" }
              ]
            }
          },
          formField: "object"
        },
      },
    },

    defaultData: {
      title: "Our Implementation Process",

      subtitle: "A proven methodology for seamless business transformation",

      image: "/Videos/implementation/implementProcess.jpg",

      steps: [],

      ctaButton: { text: "Start Your Journey", link: "/contact", variant: "primary" },
    },
  },

  // Implementation Process Section Schema
  ImplementationProcessSection: {
    componentName: "ImplementationProcessSection",
    category: "implementation",
    icon: "",
    displayName: "Implementation Process Section",
    description: "Shows the implementation process with steps and image",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Our Implementation Process",
          formField: "text",
        },
        subtitle: {
          type: "string",
          label: "Section Subtitle",
          placeholder: "A proven methodology",
          formField: "text",
        },
        image: {
          type: "string",
          label: "Section Image",
          placeholder: "/images/implementation-process.jpg",
          formField: "media",
          mediaType: "image",
        },
        sectionTitle: {
          type: "string",
          label: "Stepper Section Title",
          placeholder: "Implementation Process",
          formField: "text",
        },
        keyDeliverablesTitle: {
          type: "string",
          label: "Key Deliverables Label",
          placeholder: "Key Deliverables",
          formField: "text",
        },
        implementationDetailsTitle: {
          type: "string",
          label: "Details Section Title",
          placeholder: "Implementation Details",
          formField: "text",
        },
        steps: {
          type: "array",
          label: "Process Steps",
          items: {
            type: "object",
            properties: {
              number: { type: "number", label: "Step Number", formField: "text" },
              title: { type: "string", label: "Step Title", formField: "text" },
              description: { type: "string", label: "Step Description", formField: "textarea" },
              duration: { type: "string", label: "Duration", placeholder: "2-3 weeks", formField: "text" },
              icon: { type: "string", label: "Icon (SVG Path)", formField: "text" },
              details: { type: "string", label: "Detailed Description", placeholder: "Comprehensive analysis...", formField: "textarea" },
              benefits: { type: "string", label: "Key Deliverables (comma separated)", placeholder: "Benefit 1, Benefit 2", formField: "textarea" },
              stats: {
                type: "array",
                label: "Stats Cards",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string", label: "Stat Title", placeholder: "Efficient", formField: "text" },
                    description: { type: "string", label: "Stat Description", placeholder: "Streamlined process", formField: "textarea" },
                    icon: { type: "string", label: "Icon Name", placeholder: "Bolt", formField: "text" },
                    color: { type: "string", label: "Color", placeholder: "blue", formField: "text" },
                  },
                },
                formField: "array",
              },
            },
          },
          formField: "array",
        },
        ctaButton: {
          type: "object",
          label: "CTA Button",
          properties: {
            text: { type: "string", label: "Button Text", formField: "text" },
            link: { type: "string", label: "Button Link", formField: "text" },
            variant: {
              type: "string",
              label: "Button Style",
              formField: "select",
              options: [
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
              ],
            },
          },
          formField: "object",
        },
      },
    },
    defaultData: {
      title: "Our Implementation Process",
      subtitle: "A proven methodology for seamless business transformation",
      image: "/Videos/implementation/implementProcess.jpg",
      sectionTitle: "Implementation Process",
      keyDeliverablesTitle: "Key Deliverables",
      implementationDetailsTitle: "Implementation Details",
      steps: [
        { number: 1, title: "Discovery", description: "Requirements analysis", duration: "2-3 weeks", icon: "", details: "Comprehensive analysis of your existing operations", benefits: "Current state assessment, Gap analysis, Requirements documentation", stats: [{ title: "Efficient", description: "Streamlined process with proven methodologies", icon: "Bolt", color: "blue" }, { title: "Proven", description: "Tested methodology with 98% success rate", icon: "CheckCircle", color: "green" }] },
        { number: 2, title: "Design", description: "Solution architecture", duration: "3-4 weeks", icon: "", details: "Create a detailed blueprint for your implementation", benefits: "System architecture, Process flows, Integration design", stats: [{ title: "Efficient", description: "Streamlined process with proven methodologies", icon: "Bolt", color: "blue" }, { title: "Proven", description: "Tested methodology with 98% success rate", icon: "CheckCircle", color: "green" }] },
        { number: 3, title: "Build", description: "Configuration & development", duration: "6-8 weeks", icon: "", details: "Implementation of configuration and custom development", benefits: "Configured system, Custom developments, Workflow automation", stats: [{ title: "Efficient", description: "Streamlined process with proven methodologies", icon: "Bolt", color: "blue" }, { title: "Proven", description: "Tested methodology with 98% success rate", icon: "CheckCircle", color: "green" }] },
        { number: 4, title: "Deploy", description: "Go-live & support", duration: "2-3 weeks", icon: "", details: "Carefully managed production deployment", benefits: "Live system, Support documentation, Performance monitoring", stats: [{ title: "Efficient", description: "Streamlined process with proven methodologies", icon: "Bolt", color: "blue" }, { title: "Proven", description: "Tested methodology with 98% success rate", icon: "CheckCircle", color: "green" }] },
      ],
      ctaButton: { text: "Start Your Journey", link: "/contact", variant: "primary" },
    },
  },

  // Implementation Pricing Section Schema
  ImplementationPricingSection: {
    componentName: "ImplementationPricingSection",
    category: "implementation",
    icon: "",
    displayName: "Implementation Pricing Section",
    description: "Pricing plans for implementation services",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Implementation Pricing",
          formField: "text",
        },
        subtitle: {
          type: "string",
          label: "Section Subtitle",
          placeholder: "Choose the plan that fits your needs",
          formField: "text",
        },
        plans: {
          type: "array",
          label: "Pricing Plans",
          items: {
            type: "object",
            properties: {
              name: { type: "string", label: "Plan Name", formField: "text" },
              description: { type: "string", label: "Plan Description", formField: "textarea" },
              price: { type: "string", label: "Price", formField: "text" },
              priceNote: { type: "string", label: "Price Note", formField: "text" },
              features: { type: "string", label: "Features (comma separated)", formField: "textarea" },
              ctaText: { type: "string", label: "CTA Button Text", formField: "text" },
              isPopular: { type: "boolean", label: "Is Popular?", formField: "checkbox" },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      title: "Implementation Pricing",
      subtitle: "Choose the perfect implementation plan for your business",
      plans: [
        { name: "Starter", description: "Basic implementation", price: "$15,000", priceNote: "one-time", features: "Basic setup, Training", ctaText: "Get Started", isPopular: false },
        { name: "Professional", description: "Full implementation", price: "$35,000", priceNote: "one-time", features: "Full setup, Customization, Training, Support", ctaText: "Get Started", isPopular: true },
      ],
    },
  },

  // Implementation Why Choose Section Schema
  ImplementationWhyChooseSection: {
    componentName: "ImplementationWhyChooseSection",
    category: "implementation",
    icon: "",
    displayName: "Why Choose Implementation Section",
    description: "Why choose us section with features and image",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Why Choose Bellatrix?",
          formField: "text",
        },
        subtitle: {
          type: "string",
          label: "Section Subtitle",
          placeholder: "Years of expertise",
          formField: "text",
        },
        image: {
          type: "string",
          label: "Section Image",
          placeholder: "/images/why-choose.jpg",
          formField: "media",
          mediaType: "image",
        },
        features: {
          type: "array",
          label: "Features",
          items: {
            type: "object",
            properties: {
              number: { type: "string", label: "Feature Number", placeholder: "01", formField: "text" },
              title: { type: "string", label: "Feature Title", formField: "text" },
              description: { type: "string", label: "Feature Description", formField: "textarea" },
              icon: { type: "string", label: "Icon", formField: "text" },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      title: "Why Choose Bellatrix for Implementation?",
      subtitle: "Years of expertise and proven methodologies",
      image: "/images/why-choose.jpg",
      features: [
        { number: "01", title: "Expert Team", description: "Certified professionals", icon: "" },
        { number: "02", title: "Proven Track Record", description: "500+ implementations", icon: "" },
        { number: "03", title: "Ongoing Support", description: "24/7 assistance", icon: "" },
      ],
    },
  },

  // WhyChooseSection: {
  //   componentName: "WhyChooseSection",
  //   category: "training",
  //   icon: "",
  //   displayName: "Why Choose Section",
  //   description: "Why choose us section for training service page",
  //   schema: {
  //     type: "object",
  //     properties: {
  //       whyChooseSection: {
  //         type: "object",
  //         label: "Why Choose Section",
  //         properties: {
  //           title: {
  //             type: "string",
  //             label: "Section Title",
  //             placeholder: "Why Choose Our Training",
  //             formField: "text",
  //           },
  //           description: {
  //             type: "string",
  //             label: "Section Description",
  //             placeholder: "Professional development excellence",
  //             formField: "textarea",
  //           },
  //           image: {
  //             type: "string",
  //             label: "Section Image",
  //             placeholder: "/images/training-why-choose.jpg",
  //             formField: "media",
  //             mediaType: "image",
  //           },
  //           badge: {
  //             type: "string",
  //             label: "Professional Badge Text",
  //             placeholder: "Professional Excellence",
  //             formField: "text",
  //           },
  //         },
  //         formField: "object",
  //       },
  //       trainingFeatures: {
  //         type: "array",
  //         label: "Training Features",
  //         items: {
  //           type: "object",
  //           properties: {
  //             id: {
  //               type: "string",
  //               label: "Feature ID",
  //               placeholder: "feature-1",
  //               formField: "text",
  //             },
  //             title: {
  //               type: "string",
  //               label: "Feature Title",
  //               placeholder: "Expert Instructors",
  //               formField: "text",
  //             },
  //             description: {
  //               type: "string",
  //               label: "Feature Description",
  //               placeholder: "Learn from certified professionals",
  //               formField: "textarea",
  //             },
  //             icon: {
  //               type: "string",
  //               label: "Feature Icon",
  //               placeholder: "M12 14l9-5-9-5-9 5 9 5z",
  //               formField: "text",
  //             },
  //           },
  //         },
  //         formField: "array",
  //       },
  //     },
  //   },
  //   defaultData: {
  //     whyChooseSection: {
  //       title: "Why Choose Our Training",
  //       description: "Professional development excellence with industry-leading programs",
  //       image: "/images/training-why-choose.jpg",
  //       badge: "Professional Excellence",
  //     },
  //     trainingFeatures: [
  //       {
  //         id: "feature-1",
  //         title: "Expert Instructors",
  //         description: "Learn from certified Oracle professionals with years of experience",
  //         icon: "M12 14l9-5-9-5-9 5 9 5z",
  //       },
  //       {
  //         id: "feature-2",
  //         title: "Hands-on Learning",
  //         description: "Practical exercises and real-world scenarios",
  //         icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  //       },
  //     ],
  //   },
  // },

  PricingSection: {
    componentName: "PricingSection",

    category: "implementation",

    icon: "",

    displayName: "Implementation Pricing Section",

    description: "Pricing section for implementation service page",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Implementation Pricing",

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Subtitle",

          placeholder:
            "Choose the perfect implementation plan that fits your business needs and budget",

          formField: "text",
        },

        plans: {
          type: "array",

          label: "Plans",

          items: {
            type: "object",

            properties: {
              name: { type: "string", label: "Plan Name", formField: "text" },

              description: {
                type: "string",

                label: "Plan Description",

                formField: "textarea",
              },

              price: { type: "string", label: "Price", formField: "text" },

              priceNote: {
                type: "string",

                label: "Price Note",

                formField: "text",
              },

              features: {
                type: "array",

                label: "Features",

                items: { type: "string", label: "Feature", formField: "text" },

                formField: "array-text",
              },

              isPopular: {
                type: "boolean",

                label: "Is Most Popular?",

                formField: "checkbox",
              },

              ctaText: {
                type: "string",

                label: "CTA Button Text",

                formField: "text",
              },
            },
          },

          formField: "array",
        },

        additionalInfo: {
          type: "object",

          label: "Additional Info",

          properties: {
            note: { type: "string", label: "Note", formField: "text" },

            contactText: {
              type: "string",

              label: "Contact Text",

              formField: "text",
            },
          },

          formField: "object",
        },
      },
    },

    defaultData: {
      title: "Implementation Pricing",

      subtitle:
        "Choose the perfect implementation plan that fits your business needs and budget",

      plans: [],

      additionalInfo: {
        note: "All plans include free consultation and project scoping",

        contactText:
          "Need a custom solution? Contact our team for personalized pricing",
      },
    },
  },

  CtaSection: {
    componentName: "CtaSection",

    category: "implementation",

    icon: "",

    displayName: "Implementation CTA Section",

    description: "Call-to-action section for implementation service page",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "CTA Title",

          placeholder: "Ready for a Seamless NetSuite Implementation?",

          formField: "text",

          required: true,
        },

        subtitle: {
          type: "string",

          label: "CTA Subtitle",

          placeholder:
            "Transform your business operations with our expert NetSuite implementation services.",

          formField: "text",
        },

        description: {
          type: "string",

          label: "CTA Description",

          placeholder:
            "Get a detailed proposal within 24 hours with 99.9% success rate.",

          formField: "textarea",
        },

        ctaButton: {
          type: "object",

          label: "Primary CTA Button",

          properties: {
            text: {
              type: "string",

              label: "Button Text",

              placeholder: "Get Started Today",

              formField: "text",
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/contact",
              formField: "text",
            },
            variant: {
              type: "string",
              label: "Button Style",
              formField: "select",
              options: [
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "outline", label: "Outline" }
              ]
            }
          },

          formField: "object",
        },

        features: {
          type: "array",

          label: "Features (Items)",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Feature Title",

                placeholder: "Quick Response",

                formField: "text",
              },

              description: {
                type: "string",

                label: "Feature Description",

                placeholder: "Get a detailed proposal within 24 hours",

                formField: "text",
              },

              icon: {
                type: "string",

                label: "Icon",

                placeholder: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",

                formField: "text",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 6,
        },

        trustedBy: {
          type: "array",

          label: "Trusted By",

          items: {
            type: "string",

            label: "Trusted By Name",

            formField: "text",
          },

          formField: "array-text",
        },
      },
    },

    defaultData: {
      title: "Ready for a Seamless NetSuite Implementation?",

      subtitle:
        "Transform your business operations with our expert NetSuite implementation services. Let's turn your vision into reality with proven methodologies and dedicated support.",

      description: "",

      ctaButton: { text: "Get Started Today" },

      features: [
        {
          title: "Quick Response",

          description: "Get a detailed proposal within 24 hours",

          icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        },

        {
          title: "Proven Success",

          description: "99.9% implementation success rate",

          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        },

        {
          title: "Expert Support",

          description: "Dedicated team of certified professionals",

          icon:
            "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        },
      ],

      trustedBy: [],
    },
  },

  // Implementation-specific CTA schema (matches naming pattern used across the app)

  ImplementationCtaSection: {
    componentName: "ImplementationCtaSection",

    category: "implementation",

    icon: "",

    displayName: "Implementation CTA Section",

    description:
      "Call-to-action section for implementation service page (ImplementationCtaSection)",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "CTA Title",

          placeholder: "Ready to Start Implementation?",

          formField: "text",

          required: true,
        },

        subtitle: {
          type: "string",

          label: "CTA Subtitle",

          placeholder: "Let's discuss your needs",

          formField: "text",
        },

        description: {
          type: "string",

          label: "CTA Description",

          placeholder:
            "Component description - please configure this component",

          formField: "textarea",
        },

        ctaButton: {
          type: "object",

          label: "Primary CTA Button",

          properties: {
            text: {
              type: "string",

              label: "Button Text",

              placeholder: "Get Started",

              formField: "text",
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/contact",
              formField: "text",
            },
            variant: {
              type: "string",
              label: "Button Style",
              formField: "select",
              options: [
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "outline", label: "Outline" }
              ]
            }
          },

          formField: "object",
        },

        // Theme: 1 = light, 2 = dark

        theme: {
          type: "number",

          label: "Theme",

          formField: "select",

          options: [
            { value: 1, label: "Light (1)" },

            { value: 2, label: "Dark (2)" },
          ],
        },

        isVisible: {
          type: "boolean",

          label: "Visible",

          formField: "checkbox",
        },
      },
    },

    defaultData: {
      title: "New Component Title",

      subtitle: "Let's discuss your needs",

      description: "Component description - please configure this component",

      ctaButton: { text: "Get Started" },

      theme: 1,

      isVisible: true,
    },
  },

  RetailCTASection: {
    componentName: "RetailCTA",

    category: "retail",

    icon: "",

    displayName: "Retail CTA Section",

    description: "Call-to-action section for retail services",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "CTA Title",

          placeholder: "Ready to Transform Your Retail Operations?",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "CTA Subtitle",

          placeholder: "Get started with NetSuite for retail",

          formField: "text",
        },

        description: {
          type: "string",

          label: "CTA Description",

          placeholder: "Join successful retailers using NetSuite",

          formField: "textarea",
        },

        features: {
          type: "array",

          label: "Features (Items)",

          items: {
            type: "object",

            properties: {
              icon: {
                type: "string",

                label: "Icon",

                placeholder: "",

                formField: "text",
              },

              title: {
                type: "string",

                label: "Feature Title",

                placeholder: "Free Assessment",

                formField: "text",
              },

              description: {
                type: "string",

                label: "Feature Description",

                placeholder:
                  "Comprehensive evaluation of your retail processes",

                formField: "text",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 6,
        },

        ctaButton: {
          type: "object",

          label: "Primary CTA Button",

          properties: {
            text: {
              type: "string",

              label: "Button Text",

              placeholder: "Schedule Retail Demo",

              formField: "text",
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/contact",
              formField: "text",
            },
            variant: {
              type: "string",
              label: "Button Style",
              formField: "select",
              options: [
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "outline", label: "Outline" }
              ]
            }
          },

          formField: "object",
        },
      },
    },

    defaultData: {
      title: "Transform Your Retail Businesseee",

      subtitle: "Get started with NetSuite for retailee",

      description: "Join successful retailers using NetSuitee",

      features: [
        {
          title: "Free Assessment",

          description: "Comprehensive evaluation of your retail processes",

          icon:
            "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
        },

        {
          title: "Rapid Implementation",

          description: "Get up and running faster with our proven methodology",

          icon: "M13 10V3L4 14h7v7l9-11h-7z",
        },

        {
          title: "Ongoing Support",

          description: "Continuous optimization and support for your success",

          icon:
            "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        },
      ],

      ctaButton: {
        text: "Schedule Demoee",
      },
    },
  },

  // Payroll Components

  PayrollHeroSection: {
    componentName: "PayrollHero",
    category: "payroll",
    icon: "",
    displayName: "Payroll Hero",
    description: "Hero section for payroll solution",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Title",
          placeholder: "Transform Your Payroll Process",
          formField: "text",
        },
        subtitle: {
          type: "string",
          label: "Subtitle",
          placeholder: "Streamline operations with our intelligent payroll system",
          formField: "text",
        },
        description: {
          type: "string",
          label: "Description",
          placeholder: "Our comprehensive payroll solution...",
          formField: "textarea",
        },
        ctaButton: {
          type: "object",
          label: "CTA Button",
          properties: {
            text: {
              type: "string",
              label: "Button Text",
              placeholder: "Get Started",
              formField: "text",
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/contact",
              formField: "text",
            },
          },
          formField: "object",
        },
        backgroundImage: {
          type: "string",
          label: "Background Image URL",
          placeholder: "/images/payroll-hero.jpg",
          formField: "media",
          mediaType: "image",
        },
      },
    },
    defaultData: {
      title: "Transform Your Payroll Process",
      subtitle: "Streamline operations with our intelligent payroll system",
      description: "Our comprehensive payroll solution automates complex processes and ensures accuracy.",
      ctaButton: {
        text: "Get Started",
        link: "/contact",
      },
      backgroundImage: "/images/payroll-hero.jpg",
    },
  },

  PayrollHowItWorksSection: {
    componentName: "PayrollHowItWorks",

    category: "payroll",

    icon: "",

    displayName: "Payroll How It Works",

    description: "How the payroll system works",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "How It Works",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Description",

          placeholder: "Our payroll process is simple and efficient",

          formField: "textarea",
        },

        steps: {
          type: "array",

          label: "Steps",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Step Title",

                formField: "text",
              },

              description: {
                type: "string",

                label: "Step Description",

                formField: "textarea",
              },

              icon: {
                type: "string",

                label: "Icon",

                formField: "text",
              },
            },
          },
        },
      },
    },

    defaultData: {
      title: "How It Works",

      description: "Our payroll process is simple and efficient",

      steps: [
        {
          title: "Data Input",

          description: "Enter employee data and hours",

          icon: "",
        },

        {
          title: "Processing",

          description: "System calculates payroll automatically",

          icon: "",
        },

        {
          title: "Approval",

          description: "Review and approve payroll",

          icon: "",
        },
      ],
    },
  },

  PayrollPainPointsSection: {
    componentName: "PayrollPainPoints",

    category: "payroll",

    icon: "",

    displayName: "Payroll Pain Points",

    description: "Common payroll pain points and how we solve them",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title (HTML allowed)",

          placeholder:
            'The Payroll <span class="text-[var(--color-primary)]">Struggles</span> We Eliminate',

          formField: "text",
        },

        description: {
          type: "string",

          label: "Description",

          placeholder:
            "Our system addresses the most common payroll challenges faced by consultancy firms:",

          formField: "textarea",
        },

        painPoints: {
          type: "array",

          label: "Pain Points",

          items: {
            type: "object",

            properties: {
              title: { type: "string", label: "Title", formField: "text" },

              description: {
                type: "string",

                label: "Description",

                formField: "textarea",
              },

              icon: { type: "string", label: "Icon", formField: "text" },
            },
          },

          formField: "array",
        },

        image: {
          type: "string",
          label: "Section Image",
          placeholder: "/images/payroll-challenges.jpg",
          formField: "media",
          mediaType: "image",
        },
      },
    },

    defaultData: {
      title:
        'The Payroll <span class="text-[var(--color-primary)]">Struggles</span> We Eliminate',

      description:
        "Our system addresses the most common payroll challenges faced by consultancy firms:",

      painPoints: [
        {
          title: "Data Accuracy",

          description: "Reduce manual errors in payroll calculations",

          icon: "",
        },

        {
          title: "Compliance",

          description: "Stay compliant with tax & labour laws",

          icon: "",
        },

        {
          title: "Time-consuming",

          description: "Automate repetitive payroll tasks",

          icon: "",
        },
      ],

      // `items` is included for backward-compatibility with older page data

      // (some page templates use `items` instead of `painPoints`). Provide

      // a clear default first item so the live preview shows content immediately

      items: [
        {
          text: "Delayed salary processing and errors",

          icon: "time",
        },
      ],
    },
  },

  PayrollWorkflowSection: {
    componentName: "PayrollWorkflow",

    category: "payroll",

    icon: "",

    displayName: "Payroll Workflow",

    description: "Payroll workflow process",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Workflow Process",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Description",

          placeholder: "Our streamlined workflow process",

          formField: "textarea",
        },

        workflowSteps: {
          type: "array",

          label: "Workflow Steps",

          items: {
            type: "object",

            properties: {
              stepTitle: {
                type: "string",

                label: "Step Title",

                formField: "text",
              },

              stepDescription: {
                type: "string",

                label: "Step Description",

                formField: "textarea",
              },

              features: {
                type: "array",

                label: "Key Features",

                items: {
                  type: "string",

                  label: "Feature",

                  formField: "text",
                },

                formField: "array-text",
              },

              automated: {
                type: "string",

                label: "Automated Info",

                placeholder: "Reduces manual work by 80%",

                formField: "text",
              },

              compliant: {
                type: "string",

                label: "Compliant Info",

                placeholder: "Built-in regulatory compliance",

                formField: "text",
              },

              automatedLabel: {
                type: "string",
                label: "Automated Label",
                placeholder: "Automated",
                formField: "text",
              },

              compliantLabel: {
                type: "string",
                label: "Compliant Label",
                placeholder: "Compliant",
                formField: "text",
              },
            },
          },
        },
      },
    },

    defaultData: {
      title: "Workflow Process",

      description: "Our streamlined workflow process",

      workflowSteps: [
        {
          stepTitle: "Data Collection",

          stepDescription: "Collect employee data and time records",
        },

        {
          stepTitle: "Calculation",

          stepDescription: "Calculate salaries and deductions",
        },

        {
          stepTitle: "Review",

          stepDescription: "Review and validate calculations",
        },
      ],
    },
  },

  PayrollStepperSection: {
    componentName: "PayrollStepper",

    category: "payroll",

    icon: "",

    displayName: "Payroll Stepper",

    description: "Payroll process steps",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Process Steps",

          formField: "text",
        },

        steps: {
          type: "array",

          label: "Steps",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Step Title",

                formField: "text",
              },

              description: {
                type: "string",

                label: "Step Description",

                formField: "textarea",
              },
            },
          },
        },
      },
    },

    defaultData: {
      title: "Process Steps",

      steps: [
        {
          title: "Step 1",

          description: "First step description",
        },

        {
          title: "Step 2",

          description: "Second step description",
        },
      ],
    },
  },

  PayrollFAQSection: {
    componentName: "PayrollFAQ",

    category: "payroll",

    icon: "",

    displayName: "Payroll FAQ",

    description: "Frequently asked questions",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Frequently Asked Questions",

          formField: "text",
        },

        faqItems: {
          type: "array",

          label: "FAQ Items",

          items: {
            type: "object",

            properties: {
              question: {
                type: "string",

                label: "Question",

                formField: "text",
              },

              answer: {
                type: "string",

                label: "Answer",

                formField: "textarea",
              },
            },
          },
        },
      },
    },

    defaultData: {
      title: "Frequently Asked Questions",

      faqItems: [
        {
          question: "How does the payroll system work?",

          answer: "Our system automates the entire payroll process...",
        },

        {
          question: "Is it secure?",

          answer: "Yes, we use enterprise-grade security...",
        },
      ],
    },
  },

  // Customization Process Section Schema
  CustomizationProcessSection: {
    componentName: "CustomizationProcessSection",
    category: "services",
    icon: "",
    displayName: "Customization Process Section",
    description: "Shows the customization process with steps",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Our Customization Process",
          formField: "text",
        },
        subtitle: {
          type: "string",
          label: "Section Subtitle",
          placeholder: "How we customize your solution",
          formField: "text",
        },
        description: {
          type: "string",
          label: "Section Description",
          placeholder: "A detailed description of our process",
          formField: "textarea",
        },
        steps: {
          type: "array",
          label: "Process Steps",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                label: "Step Title",
                placeholder: "Step Title",
                formField: "text",
              },
              description: {
                type: "string",
                label: "Step Description",
                placeholder: "Describe this step",
                formField: "textarea",
              },
              icon: {
                type: "string",
                label: "Step Icon",
                placeholder: "Icon name or SVG path",
                formField: "text",
              },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      title: "Our Customization Process",
      subtitle: "How we tailor solutions to your needs",
      description: "We follow a proven methodology to customize NetSuite for your business.",
      steps: [
        { title: "Analysis", description: "We analyze your requirements", icon: "" },
        { title: "Design", description: "We design the solution", icon: "" },
        { title: "Build", description: "We build and test", icon: "" },
        { title: "Deploy", description: "We deploy and support", icon: "" },
      ],
    },
  },

  // Training Hero Section Schema
  TrainingHeroSection: {
    componentName: "TrainingHeroSection",
    category: "hero",
    icon: "",
    displayName: "Training Hero Section",
    description: "Hero section for training pages with background image",
    schema: {
      type: "object",
      properties: {
        heroContent: {
          type: "object",
          label: "Hero Content",
          properties: {
            title: {
              type: "string",
              label: "Title",
              placeholder: "Professional Training Programs",
              formField: "text",
            },
            subtitle: {
              type: "string",
              label: "Subtitle",
              placeholder: "Professional ERP Education & Skills Development",
              formField: "text",
            },
            description: {
              type: "string",
              label: "Description",
              placeholder: "Empower your team with comprehensive training solutions",
              formField: "textarea",
            },
          },
          formField: "object",
        },
        backgroundImage: {
          type: "string",
          label: "Background Image",
          placeholder: "/images/training.jpg",
          formField: "media",
          mediaType: "image",
        },
        ctaButton: {
          type: "object",
          label: "CTA Button",
          properties: {
            text: {
              type: "string",
              label: "Button Text",
              placeholder: "Start Learning Today",
              formField: "text",
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/training",
              formField: "text",
            },
            variant: {
              type: "string",
              label: "Button Variant",
              placeholder: "primary",
              formField: "select",
              options: [
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "outline", label: "Outline" },
              ],
            },
            icon: {
              type: "string",
              label: "Button Icon",
              placeholder: "",
              formField: "text",
            },
          },
          formField: "object",
        },
      },
    },
    defaultData: {
      heroContent: {
        title: "Professional Training Programs",
        subtitle: "Professional ERP Education & Skills Development",
        description: "Empower your team with comprehensive training solutions designed to enhance skills and drive success",
      },
      backgroundImage: "/images/training.jpg",
      ctaButton: {
        text: "Start Learning Today",
        link: "/training",
        variant: "primary",
        icon: "",
      },
    },
  },

  // Programs Section Schema (Training Programs)
  TrainingProgramsSection: {
    componentName: "TrainingProgramsSection",
    category: "training",
    icon: "",
    displayName: "Programs Section",
    description: "Training programs section with program cards",
    schema: {
      type: "object",
      properties: {
        programsSection: {
          type: "object",
          label: "Section Header",
          properties: {
            title: {
              type: "string",
              label: "Section Title",
              placeholder: "Our Training Programs",
              formField: "text",
            },
            description: {
              type: "string",
              label: "Section Description",
              placeholder: "Comprehensive training solutions",
              formField: "textarea",
            },
            image: {
              type: "string",
              label: "Section Image",
              placeholder: "/images/training.jpg",
              formField: "media",
              mediaType: "image",
            },
          },
          formField: "object",
        },
        trainingPrograms: {
          type: "array",
          label: "Training Programs",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                label: "Program Title",
                placeholder: "NetSuite Fundamentals",
                formField: "text",
              },
              shortDescription: {
                type: "string",
                label: "Program Description",
                placeholder: "Learn the basics of NetSuite",
                formField: "textarea",
              },
              duration: {
                type: "string",
                label: "Duration",
                placeholder: "2 weeks",
                formField: "text",
              },
              level: {
                type: "string",
                label: "Level",
                placeholder: "Beginner",
                formField: "select",
                options: [
                  { value: "Beginner", label: "Beginner" },
                  { value: "Intermediate", label: "Intermediate" },
                  { value: "Advanced", label: "Advanced" },
                ],
              },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      programsSection: {
        title: "Our Training Programs",
        description: "Comprehensive training solutions to empower your team",
        image: "/images/training.jpg",
      },
      trainingPrograms: [
        { title: "NetSuite Fundamentals", shortDescription: "Core concepts and navigation", duration: "2 weeks", level: "Beginner" },
        { title: "Advanced NetSuite", shortDescription: "Advanced features and customization", duration: "3 weeks", level: "Advanced" },
      ],
    },
  },

  // Key Modules Section Schema (Training Key Modules)
  TrainingKeyModulesSection: {
    componentName: "TrainingKeyModulesSection",
    category: "training",
    icon: "",
    displayName: "Key Modules Section",
    description:
      "Key training modules grid with title, description and duration",
    schema: {
      type: "object",
      properties: {
        keyModulesSection: {
          type: "object",
          label: "Section Header",
          properties: {
            title: {
              type: "string",
              label: "Section Title",
              placeholder: "Key Training Modules",
              formField: "text",
            },
            description: {
              type: "string",
              label: "Section Description",
              placeholder:
                "Comprehensive curriculum designed to master NetSuite from foundation to advanced implementation",
              formField: "textarea",
            },
          },
          formField: "object",
        },
        keyModules: {
          type: "array",
          label: "Key Modules",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                label: "Module Title",
                placeholder: "System Architecture",
                formField: "text",
              },
              description: {
                type: "string",
                label: "Module Description",
                placeholder:
                  "Core system structure, data flow, and integration patterns",
                formField: "textarea",
              },
              duration: {
                type: "string",
                label: "Duration",
                placeholder: "8 hours",
                formField: "text",
              },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      keyModulesSection: {
        title: "Key Training Modules",
        description:
          "Comprehensive curriculum designed to master NetSuite from foundation to advanced implementation",
      },
      keyModules: [
        {
          title: "System Architecture",
          description:
            "Core system structure, data flow, and integration patterns",
          duration: "8 hours",
        },
        {
          title: "Financial Management",
          description:
            "General ledger, budgeting, financial reporting, and analytics",
          duration: "12 hours",
        },
      ],
    },
  },

  // Training Why Choose Section Schema
  TrainingWhyChooseSection: {
    componentName: "TrainingWhyChooseSection",
    category: "training",
    icon: "",
    displayName: "Training Why Choose Section",
    description:
      "Why choose our training section with feature cards and image",
    schema: {
      type: "object",
      properties: {
        whyChooseSection: {
          type: "object",
          label: "Section Header",
          properties: {
            title: {
              type: "string",
              label: "Section Title",
              placeholder: "Why Choose Our Training",
              formField: "text",
            },
            description: {
              type: "string",
              label: "Section Description",
              placeholder: "Professional development excellence",
              formField: "textarea",
            },
            image: {
              type: "string",
              label: "Section Image",
              placeholder: "/images/training-why-choose.jpg",
              formField: "media",
              mediaType: "image",
            },
            badge: {
              type: "string",
              label: "Professional Badge Text",
              placeholder: "Professional Excellence",
              formField: "text",
            },
          },
          formField: "object",
        },
        trainingFeatures: {
          type: "array",
          label: "Training Features",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                label: "Feature ID",
                placeholder: "feature-1",
                formField: "text",
              },
              title: {
                type: "string",
                label: "Feature Title",
                placeholder: "Expert Instructors",
                formField: "text",
              },
              shortDescription: {
                type: "string",
                label: "Short Description",
                placeholder: "Learn from certified professionals",
                formField: "textarea",
              },
              description: {
                type: "string",
                label: "Detailed Description (optional)",
                placeholder: "Add more detail about this feature",
                formField: "textarea",
              },
              icon: {
                type: "string",
                label: "Feature Icon (optional)",
                placeholder: "Icon path or SVG",
                formField: "text",
              },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      whyChooseSection: {
        title: "Why Choose Our Training",
        description:
          "Professional development excellence with industry-leading programs",
        image: "/images/training-why-choose.jpg",
        badge: "Professional Excellence",
      },
      trainingFeatures: [
        {
          id: "feature-1",
          title: "Expert Instructors",
          shortDescription:
            "Learn from certified Oracle professionals with years of experience",
        },
        {
          id: "feature-2",
          title: "Hands-on Learning",
          shortDescription: "Practical exercises and real-world scenarios",
        },
      ],
    },
  },

  PayrollCTASection: {
    componentName: "PayrollCTA",

    category: "payroll",

    icon: "",

    displayName: "Payroll CTA",

    description: "Call to action section",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Ready to Transform Your Payroll?",

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Subtitle",

          placeholder: "Get started today",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Description",

          placeholder: "Contact us to learn more",

          formField: "textarea",
        },



        ctaButton: {
          type: "object",
          label: "CTA Button",
          properties: {
            text: {
              type: "string",
              label: "Button Text",
              placeholder: "Get Started",
              formField: "text",
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/contact",
              formField: "text",
            },
          },
          formField: "object",
        },
      },
    },

    defaultData: {
      title: "Ready to Transform Your Payroll?",

      subtitle: "Get started today",

      description: "Contact us to learn more about our payroll solution",



      ctaButton: {
        text: "Get Started",
      },
    },
  },

  // HR Components

  HRHeroSection: {
    componentName: "HRHero",

    category: "hr",

    icon: "",

    displayName: "HR Hero",

    description: "Hero section for HR solution",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Modern HR, Payroll & People Management",

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Subtitle",

          placeholder: "Automate HR, empower employees, and stay compliant",

          formField: "textarea",
        },

        backgroundVideo: {
          type: "string",

          label: "Background Video URL",

          placeholder: "/Videos/hrVideo.mp4",

          formField: "media",

          mediaType: "video",
        },

        bgColor: {
          type: "string",

          label: "Background Color (CSS class)",

          placeholder: "bg-gradient-to-br from-[#191970] via-black to-blue-700",

          formField: "text",
        },
      },
    },

    defaultData: {
      title: "Modern HR, Payroll & People Management",

      subtitle:
        "Automate HR, empower employees, and stay compliant—on one secure platform designed for the future of work.",

      backgroundVideo: "/Videos/hrVideo.mp4",

      bgColor: "bg-gradient-to-br from-[#191970] via-black to-blue-700",
    },
  },

  HRModulesSection: {
    componentName: "HRModules",

    category: "hr",

    icon: "",

    displayName: "HR Modules",

    description: "HR system modules",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "HR Modules",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Description",

          placeholder: "Comprehensive HR modules",

          formField: "textarea",
        },

        modules: {
          type: "array",

          label: "Modules",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Module Title",

                formField: "text",
              },

              description: {
                type: "string",

                label: "Module Description",

                formField: "textarea",
              },

              icon: {
                type: "string",

                label: "Icon",

                formField: "text",
              },
            },
          },
        },
      },
    },

    defaultData: {
      title: "HR Modules",

      description: "Comprehensive HR modules",

      modules: [
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
      ],
    },
  },

  HRBenefitsSection: {
    componentName: "HRBenefits",
    category: "hr",
    icon: "",
    displayName: "HR Benefits",
    description: "HR system benefits section with features cards",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Why Choose Our HR Solution?",
          formField: "text",
        },
        description: {
          type: "string",
          label: "Section Description",
          placeholder: "Discover the key advantages that make our HR platform the smart choice",
          formField: "textarea",
        },
        ctaButton: {
          type: "object",
          label: "CTA Button",
          properties: {
            text: {
              type: "string",
              label: "Button Text",
              placeholder: "Contact Us",
              formField: "text",
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/contact",
              formField: "text",
            },
          },
          formField: "object",
        },
        features: {
          type: "array",
          label: "Benefit Features",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                label: "Feature Title",
                placeholder: "Automation",
                formField: "text",
              },
              desc: {
                type: "string",
                label: "Feature Description",
                placeholder: "Automate routine HR tasks and save time",
                formField: "textarea",
              },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      title: "Why Choose Our HR Solution?",
      description: "Discover the key advantages that make our HR platform the smart choice for modern businesses.",
      ctaButton: {
        text: "Contact Us",
        link: "/contact",
      },
      features: [
        {
          title: "Automation",
          desc: "Automate routine HR tasks and free up time for strategic initiatives",
        },
        {
          title: "Compliance",
          desc: "Ensure regulatory compliance with built-in compliance tracking",
        },
        {
          title: "Analytics",
          desc: "Gain insights with powerful HR analytics and reporting",
        },
        {
          title: "Employee Self-Service",
          desc: "Empower employees with self-service portals for common requests",
        },
      ],
    },
  },

  HRUseCasesSection: {
    componentName: "HRUseCases",

    category: "hr",

    icon: "",

    displayName: "HR Use Cases",

    description: "HR system use cases",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Use Cases",

          formField: "text",
        },

        useCases: {
          type: "array",

          label: "Use Cases",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Title",

                formField: "text",
              },

              description: {
                type: "string",

                label: "Description",

                formField: "textarea",
              },
            },
          },
        },
      },
    },

    defaultData: {
      title: "Use Cases",

      description: "Common use cases for our HR solution",

      useCases: [
        {
          title: "Small Business",

          description: "Perfect for small businesses",
        },

        {
          title: "Enterprise",

          description: "Scalable for large enterprises",
        },
      ],
    },
  },

  HRPricingSection: {
    componentName: "HRPricing",

    category: "hr",

    icon: "",

    displayName: "HR Pricing",

    description: "HR solution pricing",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Pricing Plans",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Description",

          placeholder: "Choose the right plan for your needs",

          formField: "textarea",
        },

        pricing: {
          type: "array",

          label: "Pricing Plans",

          items: {
            type: "object",

            properties: {
              name: {
                type: "string",

                label: "Plan Name",

                formField: "text",
              },

              price: {
                type: "string",

                label: "Price",

                formField: "text",
              },

              description: {
                type: "string",

                label: "Plan Description",

                formField: "textarea",
              },

              features: {
                type: "array",

                label: "Features",

                items: {
                  type: "string",

                  formField: "text",
                },
              },
            },
          },
        },
      },
    },

    defaultData: {
      title: "Pricing Plans",

      description: "Choose the right plan for your needs",

      pricing: [
        {
          name: "Basic",

          price: "$29/month",

          description: "Perfect for small teams",

          features: ["Up to 10 employees", "Basic features"],
        },

        {
          name: "Professional",

          price: "$59/month",

          description: "Ideal for growing businesses",

          features: ["Up to 50 employees", "Advanced features"],
        },
      ],
    },
  },

  HRFAQSection: {
    componentName: "HRFAQ",

    category: "hr",

    icon: "",

    displayName: "HR FAQ",

    description: "Frequently asked questions",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Frequently Asked Questions",

          formField: "text",
        },

        faq: {
          type: "object",

          label: "FAQ Data",

          properties: {
            title: {
              type: "string",

              label: "FAQ Title",

              formField: "text",
            },

            items: {
              type: "array",

              label: "FAQ Items",

              items: {
                type: "object",

                properties: {
                  question: {
                    type: "string",

                    label: "Question",

                    formField: "text",
                  },

                  answer: {
                    type: "string",

                    label: "Answer",

                    formField: "textarea",
                  },
                },
              },
            },
          },
        },
      },
    },

    defaultData: {
      title: "Frequently Asked Questions",

      faq: {
        title: "HR Solution FAQ",

        items: [
          {
            question: "How does the HR system work?",

            answer: "Our HR system automates employee management...",
          },

          {
            question: "Is it secure?",

            answer: "Yes, we use enterprise-grade security...",
          },
        ],
      },
    },
  },

  HRCTASection: {
    componentName: "HRCTA",

    category: "hr",

    icon: "",

    displayName: "HR CTA",

    description: "Call to action section",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Title",

          placeholder: "Ready to Transform Your HR?",

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Subtitle",

          placeholder: "Get started today",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Description",

          placeholder: "Contact us to learn more",

          formField: "textarea",
        },

        ctaButton: {
          type: "object",
          label: "CTA Button",
          properties: {
            text: {
              type: "string",
              label: "Button Text",
              placeholder: "Get Started",
              formField: "text",
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/contact",
              formField: "text",
            },
          },
          formField: "object",
        },
      },
    },

    defaultData: {
      title: "Ready to Transform Your HR?",

      subtitle: "Get started today",

      description: "Contact us to learn more about our HR solution",

      ctaButton: {
        text: "Get Started",
      },
    },
  },

  // Manufacturing Components

  ManufacturingIndustryStats: {
    componentName: "ManufacturingIndustryStats",

    category: "manufacturing",

    icon: "",

    displayName: "Manufacturing Industry Statistics",

    description: "Display key manufacturing performance metrics and statistics",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Section Title",

          placeholder: "Manufacturing Industry Stats",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Section Subtitle",

          placeholder: "The state of manufacturing today",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Section Description",

          placeholder:
            "Key metrics that demonstrate our manufacturing excellence",

          formField: "textarea",
        },

        stats: {
          type: "array",

          label: "Statistics",

          items: {
            type: "object",

            properties: {
              value: {
                type: "string",

                label: "Statistic Value",

                placeholder: "500+",

                required: true,

                formField: "text",
              },

              label: {
                type: "string",

                label: "Statistic Label",

                placeholder: "Manufacturing Clients",

                required: true,

                formField: "text",
              },

              description: {
                type: "string",

                label: "Statistic Description",

                placeholder: "Successful implementations",

                required: true,

                formField: "text",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 8,
        },

        backgroundImage: {
          type: "string",

          label: "Background Image (Optional)",

          placeholder: "/images/manufacturing-bg.jpg",

          formField: "media",

          mediaType: "image",
        },

        backgroundColor: {
          type: "string",

          label: "Background Color",

          placeholder: "Select Background Color",

          formField: "select",

          options: [
            { value: "white", label: "White" },

            { value: "light-gray", label: "Light Gray" },

            { value: "dark", label: "Dark" },

            { value: "blue", label: "Blue" },

            { value: "transparent", label: "Transparent" },
          ],
        },
      },
    },

    defaultData: {
      title: "New Component Title",

      subtitle: "Key industry metrics",

      description: "Component description - please configure this component",

      stats: [
        {
          value: "85%",

          label: "Efficiency Improvement",

          description: "Average efficiency gain",
        },

        {
          value: "60%",

          label: "Cost Reduction",

          description: "Operational cost savings",
        },

        {
          value: "90%",

          label: "Accuracy Rate",

          description: "Data accuracy improvement",
        },
      ],

      backgroundColor: "white",
    },
  },

  ManufacturingHeroSection: {
    componentName: "ManufacturingHero",

    category: "manufacturing",

    icon: "",

    displayName: "Manufacturing Hero Section",

    description: "Hero section for manufacturing industry pages",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Hero Title",

          placeholder: "Manufacturing Excellence",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Hero Subtitle",

          placeholder: "Powered by NetSuite",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Hero Description",

          placeholder:
            "Transform your manufacturing operations with integrated ERP solutions...",

          required: true,

          formField: "textarea",
        },

        backgroundImage: {
          type: "string",

          label: "Background Image URL",

          placeholder:
            "https://images.unsplash.com/photo-1581094794329-c8112a89af12",

          formField: "media",

          mediaType: "image",
        },

        ctaText: {
          type: "string",

          label: "CTA Button Text (Optional)",

          placeholder: "Schedule Manufacturing Demo",

          formField: "text",
        },
      },
    },

    defaultData: {
      title: "Manufacturing Excellence",

      subtitle: "Powered by NetSuite",

      description:
        "Transform your manufacturing operations with integrated ERP solutions that streamline production, optimize inventory, and ensure quality compliance across your entire value chain.",

      backgroundImage:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",

      ctaText: "Schedule Manufacturing Demo",
    },
  },

  ManufacturingChallengesSection: {
    componentName: "ManufacturingChallenges",

    category: "manufacturing",

    icon: "",

    displayName: "Manufacturing Challenges",

    description: "Display common manufacturing challenges and pain points",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Section Title",

          placeholder: "Manufacturing Challenges We Solve",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Section Subtitle",

          placeholder: "Common pain points facing manufacturers",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Section Description",

          placeholder:
            "We understand the unique challenges manufacturers face and provide targeted solutions",

          formField: "textarea",
        },

        challenges: {
          type: "array",

          label: "Challenges List",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Challenge Title",

                placeholder: "Inventory Management",

                required: true,

                formField: "text",
              },

              description: {
                type: "string",

                label: "Challenge Description",

                placeholder:
                  "Difficulty tracking inventory across multiple locations",

                required: true,

                formField: "textarea",
              },

              icon: {
                type: "string",

                label: "Icon SVG Path (Optional)",

                placeholder:
                  "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",

                formField: "text",
              },

              impact: {
                type: "string",

                label: "Business Impact",

                placeholder: "25% excess inventory costs",

                formField: "text",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 6,
        },

        image: {
          type: "string",

          label: "Section Image",

          placeholder:
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",

          formField: "media",

          mediaType: "image",
        },
      },
    },

    defaultData: {
      title: "Manufacturing Challenges We Solve",

      subtitle: "Common pain points facing manufacturers",

      description:
        "We understand the unique challenges manufacturers face in today's competitive landscape and provide targeted solutions to address them.",

      challenges: [
        {
          title: "Inventory Management",

          description:
            "Difficulty tracking inventory levels, managing stockouts, and optimizing inventory across multiple locations and warehouses",

          icon:
            "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",

          impact: "25% excess inventory costs",
        },

        {
          title: "Production Planning",

          description:
            "Complex scheduling, resource allocation, and demand forecasting leading to inefficient production cycles",

          icon:
            "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",

          impact: "20% production delays",
        },

        {
          title: "Quality Control",

          description:
            "Maintaining consistent quality standards and compliance across all production processes and locations",

          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",

          impact: "15% quality issues",
        },
      ],

      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  },

  ManufacturingSolutionsSection: {
    componentName: "ManufacturingSolutions",

    category: "manufacturing",

    icon: "",

    displayName: "Manufacturing Solutions",

    description: "NetSuite solutions for manufacturing challenges",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Section Title",

          placeholder: "NetSuite Manufacturing Solutions",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Section Subtitle",

          placeholder: "Comprehensive ERP solutions for manufacturers",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Section Description",

          placeholder:
            "Our NetSuite solutions are specifically designed to address manufacturing challenges",

          formField: "textarea",
        },

        solutions: {
          type: "array",

          label: "Solutions List",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Solution Title",

                placeholder: "Production Planning & Scheduling",

                required: true,

                formField: "text",
              },

              description: {
                type: "string",

                label: "Solution Description",

                placeholder:
                  "Advanced planning tools to optimize production schedules",

                required: true,

                formField: "textarea",
              },

              features: {
                type: "array",

                label: "Key Features",

                items: {
                  type: "string",

                  formField: "text",
                },

                formField: "array",
              },

              benefits: {
                type: "string",

                label: "Key Benefits",

                placeholder: "30% improvement in on-time delivery",

                formField: "text",
              },

              icon: {
                type: "string",

                label: "Icon SVG Path (Optional)",

                formField: "text",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 6,
        },

        image: {
          type: "string",

          label: "Section Image",

          placeholder:
            "https://i.pinimg.com/1200x/19/e6/91/19e6918482b92f0f7e31e68d376bf711.jpg",

          formField: "media",

          mediaType: "image",
        },
      },
    },

    defaultData: {
      title: "NetSuite Manufacturing Solutions",

      subtitle: "Comprehensive ERP solutions designed for manufacturers",

      description:
        "Our proven NetSuite solutions address the specific challenges facing manufacturers, providing integrated tools to optimize operations and drive growth.",

      solutions: [
        {
          title: "Production Planning & Scheduling",

          description:
            "Advanced planning tools to optimize production schedules, manage capacity, and coordinate resources across multiple facilities",

          features: [
            "Capacity planning",

            "Resource scheduling",

            "Demand forecasting",

            "Work order management",
          ],

          benefits: "30% improvement in on-time delivery",

          icon:
            "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2",
        },

        {
          title: "Inventory & Supply Chain Management",

          description:
            "Real-time inventory tracking, supplier management, and supply chain optimization to reduce costs and improve efficiency",

          features: [
            "Real-time inventory tracking",

            "Supplier management",

            "Purchase order automation",

            "Demand planning",
          ],

          benefits: "25% reduction in inventory costs",

          icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10",
        },

        {
          title: "Quality Management & Compliance",

          description:
            "Comprehensive quality control processes and compliance tracking to ensure product quality and regulatory adherence",

          features: [
            "Quality control workflows",

            "Compliance tracking",

            "Document management",

            "Audit trails",
          ],

          benefits: "50% reduction in quality issues",

          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        },
      ],

      image:
        "https://i.pinimg.com/1200x/19/e6/91/19e6918482b92f0f7e31e68d376bf711.jpg",
    },
  },

  ManufacturingCTASection: {
    componentName: "ManufacturingCTA",

    category: "manufacturing",

    icon: "",

    displayName: "Manufacturing CTA",

    description: "Call-to-action section for manufacturing services",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "CTA Title",

          placeholder: "Ready to Transform Your Manufacturing Operations?",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "CTA Subtitle",

          placeholder: "Get started with our manufacturing experts",

          formField: "text",
        },

        description: {
          type: "string",

          label: "CTA Description",

          placeholder:
            "Contact our manufacturing specialists to learn how NetSuite can optimize your operations",

          formField: "textarea",
        },

        features: {
          type: "array",

          label: "Features (Items)",

          items: {
            type: "object",

            properties: {
              icon: {
                type: "string",

                label: "Icon",

                placeholder: "",

                formField: "text",
              },

              title: {
                type: "string",

                label: "Feature Title",

                placeholder: "Streamlined Operations",

                formField: "text",
              },

              description: {
                type: "string",

                label: "Feature Description",

                placeholder: "Optimize your manufacturing processes",

                formField: "text",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 6,
        },

        ctaButton: {
          type: "object",

          label: "Primary CTA Button",

          properties: {
            text: {
              type: "string",

              label: "Button Text",

              placeholder: "Schedule Manufacturing Consultation",

              formField: "text",
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/contact",
              formField: "text",
            },
            variant: {
              type: "string",
              label: "Button Style",
              formField: "select",
              options: [
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "outline", label: "Outline" }
              ]
            }
          },

          formField: "object",
        },

        secondaryButton: {
          type: "object",

          label: "Secondary CTA Button (Optional)",

          properties: {
            text: {
              type: "string",

              label: "Button Text",

              placeholder: "Download Manufacturing Guide",

              formField: "text",
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/downloads/guide",
              formField: "text",
            },
            variant: {
              type: "string",
              label: "Button Style",
              formField: "select",
              options: [
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "outline", label: "Outline" }
              ]
            }
          },

          formField: "object",
        },

        backgroundImage: {
          type: "string",

          label: "Background Image (Optional)",

          placeholder: "/images/manufacturing-cta-bg.jpg",

          formField: "media",

          mediaType: "image",
        },
      },
    },

    defaultData: {
      title: "Ready to Transform Your Manufacturing Operations?",

      subtitle: "Get started with our manufacturing experts",

      description:
        "Contact our NetSuite manufacturing specialists to discover how we can optimize your operations, reduce costs, and improve efficiency across your entire value chain.",

      features: [
        {
          icon: "",

          title: "Streamlined Operations",

          description: "Optimize your manufacturing processes",
        },

        {
          icon: "",

          title: "Real-time Insights",

          description: "Get actionable data for better decisions",
        },

        {
          icon: "",

          title: "Expert Support",

          description: "24/7 support from industry experts",
        },
      ],

      ctaButton: {
        text: "Schedule Manufacturing Consultation",
      },

      secondaryButton: {
        text: "Download Manufacturing Guide",

        link: "/resources/manufacturing-guide",

        variant: "outline",
      },
    },
  },

  ManufacturingCaseStudies: {
    componentName: "ManufacturingCaseStudies",

    category: "manufacturing",

    icon: "",

    displayName: "Manufacturing Case Studies",

    description: "Success stories and case studies from manufacturing clients",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Section Title",

          placeholder: "Manufacturing Success Stories",

          required: true,

          formField: "text",
        },

        description: {
          type: "string",

          label: "Section Description",

          placeholder:
            "See how we've helped manufacturing companies transform their operations",

          formField: "textarea",
        },

        items: {
          type: "array",

          label: "Case Studies",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Case Study Title",

                placeholder: "Automotive Manufacturer",

                required: true,

                formField: "text",
              },

              company: {
                type: "string",

                label: "Company Name",

                placeholder: "ABC Motors",

                required: true,

                formField: "text",
              },

              industry: {
                type: "string",

                label: "Industry",

                placeholder: "Automotive",

                formField: "text",
              },

              challenge: {
                type: "string",

                label: "Challenge Description",

                placeholder: "Complex multi-location inventory management",

                formField: "textarea",
              },

              solution: {
                type: "string",

                label: "Solution Implemented",

                placeholder: "NetSuite Advanced Manufacturing with WMS",

                formField: "textarea",
              },

              results: {
                type: "string",

                label: "Results Achieved",

                placeholder: "40% reduction in inventory carrying costs",

                formField: "text",
              },

              timeline: {
                type: "string",

                label: "Implementation Timeline",

                placeholder: "6 months",

                formField: "text",
              },

              image: {
                type: "string",

                label: "Case Study Image",

                placeholder: "/images/case-study-1.jpg",

                formField: "media",

                mediaType: "image",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 6,
        },
      },
    },

    defaultData: {
      title: "Manufacturing Success Stories",

      description:
        "See how we've helped manufacturing companies transform their operations with NetSuite solutions.",

      items: [
        {
          title: "Automotive Parts Manufacturer",

          company: "ABC Motors",

          industry: "Automotive",

          challenge: "Complex multi-location inventory management",

          solution: "NetSuite Advanced Manufacturing with WMS",

          results: "40% reduction in inventory carrying costs",

          timeline: "6 months",

          image: "/images/case-study-1.jpg",
        },

        {
          title: "Electronics Manufacturer",

          company: "TechCorp",

          industry: "Electronics",

          challenge: "Manual production planning and scheduling",

          solution: "NetSuite Manufacturing Edition with custom workflows",

          results: "60% improvement in on-time delivery",

          timeline: "4 months",

          image: "/images/case-study-2.jpg",
        },

        {
          title: "Food & Beverage Producer",

          company: "FreshFoods Inc",

          industry: "Food & Beverage",

          challenge: "Quality control and compliance tracking",

          solution: "NetSuite Quality Management Suite",

          results: "99.5% quality achievement rate",

          timeline: "3 months",

          image: "/images/case-study-3.jpg",
        },
      ],
    },
  },

  ManufacturingImplementationProcess: {
    componentName: "ManufacturingImplementationProcess",

    category: "manufacturing",

    icon: "",

    displayName: "Manufacturing Implementation Process",

    description:
      "Step-by-step implementation process for manufacturing projects",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Section Title",

          placeholder: "Manufacturing Implementation Process",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Section Description",

          placeholder:
            "Our proven methodology for manufacturing implementations",

          formField: "textarea",
        },

        sectionTitle: {
          type: "string",
          label: "Stepper Section Title",
          placeholder: "Implementation Process",
          formField: "text",
        },

        keyDeliverablesTitle: {
          type: "string",
          label: "Key Deliverables Label",
          placeholder: "Key Deliverables",
          formField: "text",
        },

        implementationDetailsTitle: {
          type: "string",
          label: "Details Section Title",
          placeholder: "Implementation Details",
          formField: "text",
        },

        processSteps: {
          type: "array",

          label: "Process Steps",

          items: {
            type: "object",

            properties: {
              step: { type: "string", label: "Step ID", formField: "text" },

              title: { type: "string", label: "Step Title", formField: "text" },

              description: {
                type: "string",

                label: "Step Description",

                formField: "textarea",
              },

              duration: {
                type: "string",

                label: "Duration",

                formField: "text",
              },

              icon: { type: "string", label: "Icon", formField: "text" },

              details: { type: "string", label: "Detailed Description", formField: "textarea" },

              benefits: { type: "string", label: "Benefits (comma separated)", placeholder: "Benefit 1, Benefit 2", formField: "textarea" },

              stats: {
                type: "array",
                label: "Stats Cards",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string", label: "Stat Title", placeholder: "Efficient", formField: "text" },
                    description: { type: "string", label: "Stat Description", placeholder: "Streamlined process", formField: "textarea" },
                    icon: { type: "string", label: "Icon Name", placeholder: "Bolt", formField: "text" },
                    color: { type: "string", label: "Color", placeholder: "blue", formField: "text" },
                  },
                },
                formField: "array",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 12,
        },
      },
    },

    defaultData: {
      title: "Manufacturing Implementation Process",

      description: "Our proven methodology for manufacturing implementations",

      sectionTitle: "Implementation Process",

      keyDeliverablesTitle: "Key Deliverables",

      implementationDetailsTitle: "Implementation Details",

      processSteps: [
        {
          step: "Discovery",
          title: "Requirements Analysis",
          description: "Deep dive into your manufacturing processes",
          duration: "2-3 weeks",
          icon: "",
          details: "Comprehensive analysis of your existing manufacturing operations",
          benefits: "Current state assessment, Gap analysis, Requirements documentation",
          stats: [
            { title: "Efficient", description: "Streamlined process with proven methodologies", icon: "Bolt", color: "blue" },
            { title: "Proven", description: "Tested methodology with 98% success rate", icon: "CheckCircle", color: "green" }
          ]
        },
        {
          step: "Design",
          title: "Solution Design",
          description: "Custom solution architecture for your needs",
          duration: "3-4 weeks",
          icon: "",
          details: "Create a detailed blueprint for your implementation",
          benefits: "System architecture, Process flows, Integration design",
          stats: [
            { title: "Efficient", description: "Streamlined process with proven methodologies", icon: "Bolt", color: "blue" },
            { title: "Proven", description: "Tested methodology with 98% success rate", icon: "CheckCircle", color: "green" }
          ]
        },
        {
          step: "Build",
          title: "Configuration & Development",
          description: "System configuration and customization",
          duration: "6-8 weeks",
          icon: "",
          details: "Implementation of configuration and custom development",
          benefits: "Configured system, Custom developments, Workflow automation",
          stats: [
            { title: "Efficient", description: "Streamlined process with proven methodologies", icon: "Bolt", color: "blue" },
            { title: "Proven", description: "Tested methodology with 98% success rate", icon: "CheckCircle", color: "green" }
          ]
        },
        {
          step: "Deploy",
          title: "Go-Live & Support",
          description: "Deployment and post-implementation support",
          duration: "2-3 weeks",
          icon: "",
          details: "Carefully managed production deployment",
          benefits: "Live system, Support documentation, Performance monitoring",
          stats: [
            { title: "Efficient", description: "Streamlined process with proven methodologies", icon: "Bolt", color: "blue" },
            { title: "Proven", description: "Tested methodology with 98% success rate", icon: "CheckCircle", color: "green" }
          ]
        },
      ],
    },
  },

  // Retail Components

  RetailIndustryStats: {
    componentName: "RetailIndustryStats",

    category: "retail",

    icon: "",

    displayName: "Retail Industry Statistics",

    description: "Display key retail performance metrics and statistics",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Section Title",

          placeholder: "Retail Industry Stats",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Section Subtitle",

          placeholder: "The state of retail today",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Section Description",

          placeholder: "Key metrics that demonstrate our retail excellence",

          formField: "textarea",
        },

        stats: {
          type: "array",

          label: "Statistics",

          items: {
            type: "object",

            properties: {
              value: {
                type: "string",

                label: "Statistic Value",

                placeholder: "85%",

                required: true,

                formField: "text",
              },

              label: {
                type: "string",

                label: "Statistic Label",

                placeholder: "Efficiency Improvement",

                required: true,

                formField: "text",
              },

              description: {
                type: "string",

                label: "Statistic Description",

                placeholder: "Average efficiency gain",

                required: true,

                formField: "text",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 8,
        },
      },
    },

    defaultData: {
      title: "Retail Industry Stats",

      subtitle: "The state of retail today",

      description:
        "Key metrics that demonstrate our retail excellence and industry leadership",

      stats: [
        {
          value: "85%",

          label: "Efficiency Improvement",

          description: "Average efficiency gain",
        },

        {
          value: "60%",

          label: "Cost Reduction",

          description: "Operational cost savings",
        },

        {
          value: "90%",

          label: "Accuracy Rate",

          description: "Data accuracy improvement",
        },

        {
          value: "75%",

          label: "Time Savings",

          description: "Process automation benefits",
        },
      ],
    },
  },

  RetailHeroSection: {
    componentName: "RetailHero",

    category: "retail",

    icon: "",

    displayName: "Retail Hero Section",

    description: "Hero section for retail industry pages",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Hero Title",

          placeholder: "Retail Excellence",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Hero Subtitle",

          placeholder: "Powered by NetSuite",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Hero Description",

          placeholder:
            "Transform your retail operations with comprehensive ERP solutions...",

          required: true,

          formField: "textarea",
        },

        backgroundImage: {
          type: "string",

          label: "Background Image URL",

          placeholder:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8",

          formField: "media",

          mediaType: "image",
        },

        ctaText: {
          type: "string",

          label: "CTA Button Text (Optional)",

          placeholder: "Schedule Retail Demo",

          formField: "text",
        },
      },
    },

    defaultData: {
      title: "Retail Excellence",

      subtitle: "Powered by NetSuite",

      description:
        "Transform your retail operations with comprehensive ERP solutions that optimize inventory management, enhance customer experiences, and drive sales growth across all channels.",

      backgroundImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",

      ctaText: "Schedule Retail Demo",
    },
  },

  // Landing Page Components

  Hero: {
    componentName: "Hero",

    category: "landing",

    icon: "",

    displayName: "Landing Page Hero",

    description: "Main hero section with slides, videos, and statistics",

    schema: {
      type: "object",

      properties: {
        slides: {
          type: "array",

          label: "Hero Slides",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Slide Title",

                placeholder: "Strategic Business Transformation",

                required: true,

                formField: "text",
              },

              subtitle: {
                type: "string",

                label: "Slide Subtitle",

                placeholder: "Oracle NetSuite Consultancy",

                formField: "text",
              },

              description: {
                type: "string",

                label: "Slide Description",

                placeholder:
                  "Streamline operations and drive growth with our comprehensive NetSuite solutions.",

                required: true,

                formField: "textarea",
              },

              video: {
                type: "string",

                label: "Background Video URL",

                placeholder: "/Videos/implementation/homepage_hero.mp4",

                formField: "media",

                mediaType: "video",
              },

              backgroundImage: {
                type: "string",

                label: "Background Image (Fallback)",

                placeholder: "/images/hero-bg.jpg",

                formField: "media",

                mediaType: "image",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 5,
        },

        stats: {
          type: "array",

          label: "Statistics Display",

          items: {
            type: "object",

            properties: {
              value: {
                type: "string",

                label: "Statistic Value",

                placeholder: "500+",

                required: true,

                formField: "text",
              },

              label: {
                type: "string",

                label: "Statistic Label",

                placeholder: "Projects Completed",

                required: true,

                formField: "text",
              },
            },
          },

          formField: "array",

          minItems: 0,

          maxItems: 6,
        },
      },
    },

    defaultData: {
      slides: [
        {
          title: "Strategic Business Transformation",

          subtitle: "Oracle NetSuite Consultancy",

          description:
            "Streamline operations and drive growth with our comprehensive NetSuite solutions designed to optimize your business processes and enhance efficiency.",

          video: "/Videos/implementation/homepage_hero.mp4",

          backgroundImage: "/images/hero-bg.jpg",
        },
      ],

      stats: [
        { value: "500+", label: "Projects Completed" },

        { value: "15+", label: "Years Experience" },

        { value: "98%", label: "Client Satisfaction" },

        { value: "200+", label: "Happy Clients" },
      ],
    },
  },

  Services: {
    componentName: "Services",

    category: "landing",

    icon: "",

    displayName: "Services Grid Section",

    description: "Services grid with section header and view all button",

    schema: {
      type: "object",

      properties: {
        sectionHeader: {
          type: "object",

          label: "Section Header",

          properties: {
            title: {
              type: "string",

              label: "Section Title",

              placeholder: "Our Services",

              required: true,

              formField: "text",
            },

            subtitle: {
              type: "string",

              label: "Section Subtitle",

              placeholder: "Comprehensive NetSuite solutions for your business",

              formField: "text",
            },

            description: {
              type: "string",

              label: "Section Description",

              placeholder:
                "We provide end-to-end NetSuite consulting services to help businesses optimize their operations.",

              formField: "textarea",
            },
          },

          formField: "object",
        },

        services: {
          type: "array",

          label: "Services List",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Service Title",

                placeholder: "NetSuite Implementation",

                required: true,

                formField: "text",
              },

              description: {
                type: "string",

                label: "Service Description",

                placeholder:
                  "Complete NetSuite implementation and setup for your business",

                required: true,

                formField: "textarea",
              },

              icon: {
                type: "string",

                label: "Service Icon",

                placeholder: "",

                formField: "text",
              },

              link: {
                type: "string",

                label: "Service Link",

                placeholder: "/services/implementation",

                formField: "text",
              },

              image: {
                type: "string",

                label: "Service Image",

                placeholder: "/images/services/implementation.jpg",

                formField: "media",

                mediaType: "image",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 12,
        },

        viewAllButton: {
          type: "object",

          label: "View All Button (Optional)",

          properties: {
            text: {
              type: "string",

              label: "Button Text",

              placeholder: "View All Services",

              formField: "text",
            },
          },

          formField: "object",
        },
      },
    },

    defaultData: {
      sectionHeader: {
        title: "Our Services",

        subtitle: "Comprehensive NetSuite solutions for your business",

        description:
          "We provide end-to-end NetSuite consulting services designed to optimize your operations and drive sustainable growth.",
      },

      services: [
        {
          title: "NetSuite Implementation",

          description:
            "Complete NetSuite implementation and setup tailored to your business requirements",

          icon: "",

          link: "/services/implementation",

          image: "/images/services/implementation.jpg",
        },

        {
          title: "System Integration",

          description:
            "Seamlessly integrate NetSuite with your existing business systems and applications",

          icon: "",

          link: "/services/integration",

          image: "/images/services/integration.jpg",
        },

        {
          title: "Customization Services",

          description:
            "Custom development and configuration to meet your unique business needs",

          icon: "",

          link: "/services/customization",

          image: "/images/services/customization.jpg",
        },
      ],

      viewAllButton: {
        text: "View All Services",

        link: "/services",
      },
    },
  },

  Industries: {
    componentName: "Industries",

    category: "landing",

    icon: "",

    displayName: "Industries Section",

    description: "Industries we serve with expandable cards and links",

    schema: {
      type: "object",

      properties: {
        sectionHeader: {
          type: "object",

          label: "Section Header",

          properties: {
            title: {
              type: "string",

              label: "Section Title",

              placeholder: "Industries We Serve",

              required: true,

              formField: "text",
            },

            subtitle: {
              type: "string",

              label: "Section Subtitle",

              placeholder:
                "Specialized NetSuite solutions for various industries",

              formField: "text",
            },

            description: {
              type: "string",

              label: "Section Description",

              placeholder:
                "We understand the unique challenges of different industries and provide tailored NetSuite solutions.",

              formField: "textarea",
            },
          },

          formField: "object",
        },

        industries: {
          type: "array",

          label: "Industries List",

          items: {
            type: "object",

            properties: {
              id: {
                type: "string",

                label: "Industry ID",

                placeholder: "manufacturing",

                required: true,

                formField: "text",
              },

              label: {
                type: "string",

                label: "Industry Name",

                placeholder: "Manufacturing",

                required: true,

                formField: "text",
              },

              icon: {
                type: "string",

                label: "Industry Icon",

                placeholder: "Factory",

                formField: "text",
              },

              content: {
                type: "object",

                label: "Industry Content",

                properties: {
                  title: {
                    type: "string",

                    label: "Content Title",

                    placeholder: "Manufacturing Solutions",

                    formField: "text",
                  },

                  description: {
                    type: "string",

                    label: "Content Description",

                    placeholder: "Streamline your manufacturing operations...",

                    formField: "textarea",
                  },

                  features: {
                    type: "array",

                    label: "Key Features",

                    items: {
                      type: "string",

                      formField: "text",
                    },

                    formField: "array",
                  },

                  image: {
                    type: "string",

                    label: "Content Image",

                    placeholder:
                      "https://images.unsplash.com/photo-1581094794329-c8112a89af12",

                    formField: "media",

                    mediaType: "image",
                  },
                },

                formField: "object",
              },

              link: {
                type: "string",

                label: "Industry Page Link",

                placeholder: "/industries/manufacturing",

                formField: "text",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 8,
        },
      },
    },

    defaultData: {
      sectionHeader: {
        title: "Industries We Serve",

        subtitle: "Specialized NetSuite solutions for various industries",

        description:
          "We understand the unique challenges of different industries and provide tailored NetSuite solutions to drive growth and efficiency.",
      },

      industries: [
        {
          id: "manufacturing",

          label: "Manufacturing",

          icon: "Factory",

          content: {
            title: "Manufacturing Solutions",

            description:
              "Streamline your manufacturing operations with our comprehensive NetSuite solutions. From production planning to inventory management, we help you optimize every aspect of your manufacturing process.",

            features: [
              "Production planning and scheduling",

              "Inventory and supply chain management",

              "Quality control and compliance",

              "Cost accounting and analysis",

              "Shop floor control",
            ],

            image:
              "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          },

          link: "/industries/manufacturing",
        },

        {
          id: "retail",

          label: "Retail",

          icon: "Store",

          content: {
            title: "Retail Solutions",

            description:
              "Enhance your retail operations with integrated point-of-sale, inventory management, and customer relationship management solutions.",

            features: [
              "Point of sale integration",

              "Inventory optimization",

              "Customer relationship management",

              "E-commerce integration",

              "Multi-channel operations",
            ],

            image:
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          },

          link: "/industries/retail",
        },
      ],
    },

    // Retail Industry Components

    RetailFeaturesSection: {
      componentName: "RetailFeaturesSection",

      category: "retail",

      icon: "",

      displayName: "Retail Features",

      description:
        "Key retail features and value propositions with optional benefit lists",

      schema: {
        type: "object",

        properties: {
          title: {
            type: "string",

            label: "Title",

            placeholder: "Retail Features",

            formField: "text",
          },

          subtitle: {
            type: "string",

            label: "Subtitle",

            placeholder: "Solutions built for modern retail operations",

            formField: "text",
          },

          retailFeatures: {
            type: "array",

            label: "Features",

            items: {
              type: "object",

              properties: {
                id: { type: "string", label: "Feature ID", formField: "text" },

                title: {
                  type: "string",

                  label: "Feature Title",

                  formField: "text",
                },

                description: {
                  type: "string",

                  label: "Feature Description",

                  formField: "textarea",
                },

                icon: { type: "string", label: "Icon", formField: "text" },

                benefits: {
                  type: "array",

                  label: "Benefits",

                  items: { type: "string", formField: "text" },

                  formField: "array",
                },
              },
            },

            formField: "array",
          },
        },
      },

      defaultData: {
        title: "Retail Features",

        subtitle: "Solutions built for modern retail operations",

        retailFeatures: [
          {
            id: "feature-1",

            title: "Omnichannel POS",

            description:
              "Unified point-of-sale across online and in-store channels",

            icon: "",

            benefits: [
              "Faster checkout",

              "Inventory sync",

              "Flexible payments",
            ],
          },

          {
            id: "feature-2",

            title: "Inventory Optimization",

            description: "Real-time stock visibility across locations",

            icon: "",

            benefits: ["Reduce stockouts", "Lower carrying costs"],
          },
        ],
      },
    },

    RetailCaseStudies: {
      componentName: "RetailCaseStudies",

      category: "retail",

      icon: "",

      displayName: "Retail Case Studies",

      description: "Customer success stories and retail case studies",

      schema: {
        type: "object",

        properties: {
          title: {
            type: "string",

            label: "Title",

            placeholder: "Retail Case Studies",

            formField: "text",
          },

          description: {
            type: "string",

            label: "Description",

            placeholder: "How our solutions helped customers",

            formField: "textarea",
          },

          caseStudies: {
            type: "array",

            label: "Case Studies",

            items: {
              type: "object",

              properties: {
                id: { type: "string", label: "Case ID", formField: "text" },

                title: {
                  type: "string",

                  label: "Case Title",

                  formField: "text",
                },

                company: {
                  type: "string",

                  label: "Company",

                  formField: "text",
                },

                industry: {
                  type: "string",

                  label: "Industry",

                  formField: "text",
                },

                quote: {
                  type: "string",

                  label: "Quote",

                  formField: "textarea",
                },

                challenge: {
                  type: "string",

                  label: "Challenge",

                  formField: "textarea",
                },

                solution: {
                  type: "string",

                  label: "Solution",

                  formField: "textarea",
                },

                description: {
                  type: "string",

                  label: "Description",

                  formField: "textarea",
                },

                results: {
                  type: "array",

                  label: "Results",

                  items: { type: "string", formField: "text" },

                  formField: "array",
                },

                image: {
                  type: "string",

                  label: "Image URL",

                  formField: "media",

                  mediaType: "image",
                },
              },
            },

            formField: "array",
          },
        },
      },

      defaultData: {
        title: "Retail Success Stories",

        description:
          "Real-world examples of how we helped retail customers scale and optimize operations.",

        caseStudies: [
          {
            id: "case-1",

            title: "Modernizing Checkout for Local Retailer",

            company: "Corner Store Co.",

            industry: "Retail",

            quote:
              "We reduced checkout time by 40% and improved inventory accuracy.",

            challenge: "Slow checkout and inventory mismatches across stores.",

            solution:
              "Unified POS and real-time inventory synchronization across locations.",

            description:
              "Implemented unified POS and inventory sync across three stores.",

            results: ["40% faster checkout", "Improved inventory accuracy"],

            image:
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          },
        ],
      },
    },
  },
  // Retail Challenges Section
  RetailChallengesSection: {
    componentName: "RetailChallengesSection",
    category: "retail",
    icon: "",
    displayName: "Retail Challenges Section",
    description: "Display retail industry challenges with interactive cards",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Retail Challenges",
          required: true,
          formField: "text",
        },
        subtitle: {
          type: "string",
          label: "Section Subtitle",
          placeholder: "Understanding Modern Retail Obstacles",
          formField: "text",
        },
        description: {
          type: "string",
          label: "Section Description",
          placeholder:
            "Modern retail faces complex challenges that require integrated solutions",
          formField: "textarea",
        },
        retailChallenges: {
          type: "array",
          label: "Challenges",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                label: "Challenge Title",
                placeholder: "Omnichannel Complexity",
                required: true,
                formField: "text",
              },
              description: {
                type: "string",
                label: "Challenge Description",
                placeholder: "Managing multiple sales channels and touchpoints",
                required: true,
                formField: "textarea",
              },
              icon: {
                type: "string",
                label: "SVG Icon Path",
                placeholder: "M13 10V3L4 14h7v7l9-11h-7z",
                formField: "text",
              },
              impact: {
                type: "string",
                label: "Impact Level",
                placeholder: "High",
                formField: "select",
                options: [
                  { value: "High", label: "High Impact" },
                  { value: "Medium", label: "Medium Impact" },
                  { value: "Low", label: "Low Impact" },
                ],
              },
            },
          },
          formField: "array",
          minItems: 1,
          maxItems: 6,
        },
        image: {
          type: "string",
          label: "Section Image",
          placeholder:
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
          formField: "media",
          mediaType: "image",
        },
      },
    },
    defaultData: {
      title: "Retail Challenges",
      subtitle: "Understanding Modern Retail Obstacles",
      description:
        "Modern retail faces complex challenges that require integrated solutions to deliver exceptional customer experiences and maintain profitability.",
      retailChallenges: [
        {
          title: "Omnichannel Complexity",
          description:
            "Managing multiple sales channels and touchpoints while maintaining consistency",
          icon: "M13 10V3L4 14h7v7l9-11h-7z",
          impact: "High",
        },
        {
          title: "Inventory Management",
          description:
            "Real-time inventory tracking across all channels and locations",
          icon:
            "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
          impact: "High",
        },
        {
          title: "Customer Experience",
          description:
            "Delivering consistent and personalized experiences across all touchpoints",
          icon:
            "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
          impact: "Medium",
        },
      ],
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  },
  // Retail Solutions Section
  RetailSolutionsSection: {
    componentName: "RetailSolutionsSection",
    category: "retail",
    icon: "",
    displayName: "Retail Solutions Section",
    description: "Display NetSuite retail solutions with features and benefits",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "NetSuite Solutions",
          required: true,
          formField: "text",
        },
        subtitle: {
          type: "string",
          label: "Section Subtitle",
          placeholder: "Comprehensive Retail Solutions",
          formField: "text",
        },
        description: {
          type: "string",
          label: "Section Description",
          placeholder:
            "Comprehensive retail solutions that unify your commerce operations",
          formField: "textarea",
        },
        netSuiteSolutions: {
          type: "array",
          label: "Solutions",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                label: "Solution Title",
                placeholder: "E-commerce Platform",
                required: true,
                formField: "text",
              },
              description: {
                type: "string",
                label: "Solution Description",
                placeholder:
                  "Complete e-commerce solution with NetSuite integration",
                required: true,
                formField: "textarea",
              },
              icon: {
                type: "string",
                label: "SVG Icon Path",
                placeholder: "M13 10V3L4 14h7v7l9-11h-7z",
                formField: "text",
              },
              features: {
                type: "array",
                label: "Solution Features",
                items: {
                  type: "string",
                  formField: "text",
                },
                formField: "array",
                minItems: 1,
                maxItems: 8,
              },
              benefits: {
                type: "string",
                label: "Key Benefit/Result",
                placeholder: "50% increase in online sales",
                formField: "text",
              },
            },
          },
          formField: "array",
          minItems: 1,
          maxItems: 8,
        },
        image: {
          type: "string",
          label: "Section Image",
          placeholder:
            "https://i.pinimg.com/736x/5d/33/74/5d33743cd85ff60ff425a2614a87503f.jpg",
          formField: "media",
          mediaType: "image",
        },
      },
    },
    defaultData: {
      title: "NetSuite Solutions",
      subtitle: "Comprehensive Retail Solutions",
      description:
        "Comprehensive retail solutions that unify your commerce operations, from inventory management to customer experience optimization.",
      netSuiteSolutions: [
        {
          title: "E-commerce Platform",
          description:
            "Complete e-commerce solution with seamless NetSuite integration for unified operations",
          icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
          features: [
            "Online store management",
            "Payment processing",
            "Order management",
            "Shipping integration",
          ],
          benefits: "50% increase in online sales",
        },
        {
          title: "Inventory Management",
          description:
            "Advanced inventory control and real-time tracking across all locations",
          icon:
            "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
          features: [
            "Real-time tracking",
            "Multi-location support",
            "Automated reordering",
            "Demand forecasting",
          ],
          benefits: "30% reduction in stockouts",
        },
        {
          title: "Customer Experience",
          description:
            "Unified customer experience platform across all channels and touchpoints",
          icon:
            "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
          features: [
            "360 customer view",
            "Personalization engine",
            "Omnichannel support",
            "Loyalty programs",
          ],
          benefits: "40% improvement in customer satisfaction",
        },
      ],
      image:
        "https://i.pinimg.com/736x/5d/33/74/5d33743cd85ff60ff425a2614a87503f.jpg",
    },
  },

  // RetailImplementationSection removed

  // Testimonials Components

  Testimonials: {
    componentName: "Testimonials",

    category: "testimonials",

    icon: "",

    displayName: "Client Testimonials",

    description:
      "Customer testimonials and success stories",

    schema: {
      type: "object",

      properties: {
        sectionHeader: {
          type: "object",

          label: "Section Header",

          properties: {
            gradientText: {
              type: "string",

              label: "Header Title",

              placeholder: "Trusted by Industry Leaders",

              required: true,

              formField: "text",
            },

            subtitle: {
              type: "string",

              label: "Header Subtitle",

              placeholder:
                "Don't just take our word for it—here's what our clients say.",

              formField: "textarea",
            },
          },

          formField: "object",
        },

        testimonials: {
          type: "array",

          label: "Client Testimonials",

          items: {
            type: "object",

            properties: {
              id: {
                type: "string",

                label: "Testimonial ID",

                placeholder: "1",

                required: true,

                formField: "text",
              },

              quote: {
                type: "string",

                label: "Testimonial Quote",

                placeholder:
                  "Bellatrix transformed our business operations completely...",

                required: true,

                formField: "textarea",
              },

              name: {
                type: "string",

                label: "Client Name",

                placeholder: "Sarah Johnson",

                required: true,

                formField: "text",
              },

              title: {
                type: "string",

                label: "Client Title",

                placeholder: "CEO, TechCorp Inc.",

                required: true,

                formField: "text",
              },


              rating: {
                type: "number",

                label: "Rating (1-5 stars)",

                placeholder: "5",

                formField: "number",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 10,
        },

        sideImage: {
          type: "string",

          label: "Side Image URL",

          placeholder: "/images/indleaders.jpg",

          formField: "media",

          mediaType: "image",
        },
      },
    },

    defaultData: {
      sectionHeader: {
        gradientText: "Trusted by Industry Leaders",

        subtitle:
          "Don't just take our word for it—here's what our clients say.",
      },

      testimonials: [
        {
          id: "1",

          quote:
            "Bellatrix transformed our business operations completely. Their NetSuite expertise is unmatched.",

          name: "Sarah Johnson",

          title: "CEO, TechCorp Inc.",


          rating: 5,
        },

        {
          id: "2",

          quote:
            "The implementation was smooth and the support team is always available when needed.",

          name: "Michael Chen",

          title: "COO, Global Manufacturing",


          rating: 5,
        },

        {
          id: "3",

          quote:
            "Outstanding results! Our efficiency increased by 40% after the NetSuite implementation.",

          name: "Emily Rodriguez",

          title: "CFO, Retail Solutions",


          rating: 5,
        },
      ],

      sideImage: "/images/indleaders.jpg",
    },
  },


  ServiceGrid: {
    componentName: "ServiceGrid",

    category: "services",

    icon: "",

    displayName: "Service Grid Layout",

    description: "Grid layout of services with features and CTA buttons",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Section Title",

          placeholder: "Our Services",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Section Subtitle",

          placeholder:
            "Comprehensive NetSuite solutions to drive your business forward",

          formField: "textarea",
        },

        services: {
          type: "array",

          label: "Services List",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Service Title",

                placeholder: "NetSuite Implementation",

                required: true,

                formField: "text",
              },

              description: {
                type: "string",

                label: "Service Description",

                placeholder:
                  "Complete NetSuite setup and configuration tailored to your business needs.",

                required: true,

                formField: "textarea",
              },

              icon: {
                type: "string",

                label: "Service Icon",

                placeholder: "",

                formField: "text",
              },

              features: {
                type: "array",

                label: "Service Features",

                items: {
                  type: "string",

                  formField: "text",
                },

                formField: "array",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 12,
        },

        bottomCTA: {
          type: "object",

          label: "Bottom Call-to-Action",

          properties: {
            text: {
              type: "string",

              label: "CTA Text",

              placeholder: "Ready to transform your business with NetSuite?",

              formField: "textarea",
            },

            buttonText: {
              type: "string",

              label: "Button Text",

              placeholder: "Get Started Today",

              formField: "text",
            },
          },

          formField: "object",
        },
      },
    },

    defaultData: {
      title: "Our Services",

      subtitle:
        "Comprehensive NetSuite solutions to drive your business forward",

      services: [
        {
          title: "NetSuite Implementation",

          description:
            "Complete NetSuite setup and configuration tailored to your business needs.",

          icon: "",

          features: [
            "System Configuration",

            "Data Migration",

            "Custom Workflows",

            "User Training",
          ],
        },

        {
          title: "Training & Support",

          description:
            "Comprehensive training programs to maximize your NetSuite investment.",

          icon: "",

          features: [
            "User Training",

            "Admin Training",

            "Custom Reports",

            "Ongoing Support",
          ],
        },

        {
          title: "Customization",

          description:
            "Tailored solutions to meet your specific business requirements.",

          icon: "",

          features: ["Custom Fields", "Scripts", "Workflows", "Integrations"],
        },
      ],

      bottomCTA: {
        text: "Ready to transform your business with NetSuite?",

        buttonText: "Get Started Today",
      },
    },
  },

  // Services Implementation Components

  ImplementationHeroSection: {
    componentName: "ImplementationHero",

    category: "services",

    icon: "",

    displayName: "Implementation Hero Section",

    description: "Hero section for NetSuite implementation services",

    schema: {
      type: "object",

      properties: {
        titleParts: {
          type: "array",

          label: "Title Parts (4 words)",

          items: {
            type: "string",

            formField: "text",
          },

          formField: "array",

          minItems: 4,

          maxItems: 4,
        },

        title: {
          type: "string",

          label: "Alternative Title",

          placeholder: "Implementation Services Made Simple",

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Alternative Subtitle",

          placeholder: "Where Vision Meets Reality",

          formField: "text",
        },

        description: {
          type: "string",

          label: "Hero Description",

          placeholder:
            "We don't just implement solutions—we transform the way you do business",

          required: true,

          formField: "textarea",
        },

        backgroundVideo: {
          type: "string",

          label: "Background Video URL",

          placeholder: "/Videos/HomeHeroSectionV.mp4",

          formField: "media",

          mediaType: "video",
        },

        backgroundImage: {
          type: "string",

          label: "Background Image (Fallback)",

          placeholder: "/images/implementation-hero-bg.jpg",

          formField: "media",

          mediaType: "image",
        },

        ctaButton: {
          type: "object",

          label: "CTA Button Configuration",

          properties: {
            text: {
              type: "string",

              label: "Button Text",

              placeholder: "Start Implementation",

              formField: "text",
            },

            icon: {
              type: "string",

              label: "Button Icon SVG Path",

              placeholder: "M13 7l5 5m0 0l-5 5m5-5H6",

              formField: "text",
            },
          },

          formField: "object",
        },
      },
    },

    defaultData: {
      titleParts: ["Where", "Vision", "Meets", "Reality"],

      description:
        "We don't just implement solutions—we transform the way you do business",

      backgroundVideo: "/Videos/HomeHeroSectionV.mp4",

      ctaButton: {
        text: "Start Implementation",

        icon: "M13 7l5 5m0 0l-5 5m5-5H6",
      },
    },
  },

  // Common/Shared Components

  // Remaining Services Components

  Training: {
    componentName: "Training",

    category: "services",

    icon: "",

    displayName: "Training Services",

    description: "NetSuite training programs and certification courses",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Section Title",

          placeholder: "NetSuite Training Programs",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Section Subtitle",

          placeholder:
            "Comprehensive training to maximize your NetSuite investment",

          formField: "textarea",
        },

        trainingPrograms: {
          type: "array",

          label: "Training Programs",

          items: {
            type: "object",

            properties: {
              title: {
                type: "string",

                label: "Program Title",

                placeholder: "End User Training",

                required: true,

                formField: "text",
              },

              description: {
                type: "string",

                label: "Program Description",

                placeholder: "Comprehensive training for daily NetSuite users",

                required: true,

                formField: "textarea",
              },

              duration: {
                type: "string",

                label: "Duration",

                placeholder: "2-3 weeks",

                formField: "text",
              },

              level: {
                type: "string",

                label: "Skill Level",

                formField: "select",

                options: [
                  { value: "Beginner", label: "Beginner Level" },

                  { value: "Intermediate", label: "Intermediate Level" },

                  { value: "Advanced", label: "Advanced Level" },

                  { value: "Expert", label: "Expert Level" },
                ],
              },

              format: {
                type: "string",

                label: "Training Format",

                formField: "select",

                options: [
                  { value: "Online", label: "Online Training" },

                  { value: "On-site", label: "On-site Training" },

                  { value: "Hybrid", label: "Hybrid Training" },

                  { value: "Self-paced", label: "Self-paced Learning" },
                ],
              },

              modules: {
                type: "array",

                label: "Training Modules",

                items: {
                  type: "string",

                  formField: "text",
                },

                formField: "array",
              },

              certification: {
                type: "boolean",

                label: "Includes Certification",

                formField: "checkbox",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 10,
        },

        certifications: {
          type: "array",

          label: "Available Certifications",

          items: {
            type: "object",

            properties: {
              name: {
                type: "string",

                label: "Certification Name",

                placeholder: "NetSuite Administrator",

                required: true,

                formField: "text",
              },

              provider: {
                type: "string",

                label: "Certification Provider",

                placeholder: "Oracle",

                formField: "text",
              },

              difficulty: {
                type: "string",

                label: "Difficulty Level",

                formField: "select",

                options: ["Foundation", "Intermediate", "Advanced", "Expert"],
              },

              duration: {
                type: "string",

                label: "Preparation Time",

                placeholder: "4-6 weeks",

                formField: "text",
              },
            },
          },

          formField: "array",
        },
      },
    },

    defaultData: {
      title: "NetSuite Training Programs",

      subtitle: "Comprehensive training to maximize your NetSuite investment",

      trainingPrograms: [
        {
          title: "End User Training",

          description: "Comprehensive training for daily NetSuite users",

          duration: "2-3 weeks",

          level: "Beginner",

          format: "Online",

          modules: [
            "Navigation",

            "Basic Transactions",

            "Reporting",

            "Customer Management",
          ],

          certification: true,
        },

        {
          title: "Administrator Training",

          description: "Advanced training for NetSuite system administrators",

          duration: "4-6 weeks",

          level: "Advanced",

          format: "Hybrid",

          modules: [
            "System Setup",

            "User Management",

            "Customization",

            "Integration",
          ],

          certification: true,
        },
      ],

      certifications: [
        {
          name: "NetSuite Administrator",

          provider: "Oracle",

          difficulty: "Advanced",

          duration: "4-6 weeks",
        },

        {
          name: "NetSuite ERP Consultant",

          provider: "Oracle",

          difficulty: "Expert",

          duration: "8-12 weeks",
        },
      ],
    },
  },

  Migration: {
    componentName: "Migration",

    category: "services",

    icon: "",

    displayName: "Data Migration Services",

    description: "Seamless data migration from legacy systems to NetSuite",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Section Title",

          placeholder: "Data Migration Services",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Section Subtitle",

          placeholder:
            "Seamless migration from your current system to NetSuite",

          formField: "textarea",
        },

        migrationTypes: {
          type: "array",

          label: "Migration Services",

          items: {
            type: "object",

            properties: {
              fromSystem: {
                type: "string",

                label: "Source System",

                placeholder: "QuickBooks",

                required: true,

                formField: "text",
              },

              dataTypes: {
                type: "array",

                label: "Data Types",

                items: {
                  type: "string",

                  formField: "text",
                },

                formField: "array",
              },

              complexity: {
                type: "string",

                label: "Migration Complexity",

                formField: "select",

                options: [
                  { value: "Simple", label: "Simple Migration" },

                  { value: "Standard", label: "Standard Complexity" },

                  { value: "Complex", label: "Complex Migration" },

                  { value: "Enterprise", label: "Enterprise Level" },
                ],
              },

              timeline: {
                type: "string",

                label: "Migration Timeline",

                placeholder: "4-6 weeks",

                formField: "text",
              },

              dataVolume: {
                type: "string",

                label: "Typical Data Volume",

                placeholder: "Up to 100K records",

                formField: "text",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 10,
        },

        migrationProcess: {
          type: "object",

          label: "Migration Process",

          properties: {
            phases: {
              type: "array",

              label: "Process Phases",

              items: {
                type: "object",

                properties: {
                  phase: {
                    type: "string",

                    label: "Phase Name",

                    placeholder: "Data Assessment",

                    formField: "text",
                  },

                  description: {
                    type: "string",

                    label: "Phase Description",

                    placeholder: "Analyze source data quality and structure",

                    formField: "textarea",
                  },

                  duration: {
                    type: "string",

                    label: "Phase Duration",

                    placeholder: "1 week",

                    formField: "text",
                  },
                },
              },

              formField: "array",
            },

            tools: {
              type: "array",

              label: "Migration Tools",

              items: {
                type: "string",

                formField: "text",
              },

              formField: "array",
            },

            qualityChecks: {
              type: "array",

              label: "Quality Assurance Checks",

              items: {
                type: "string",

                formField: "text",
              },

              formField: "array",
            },
          },

          formField: "object",
        },

        supportedSystems: {
          type: "array",

          label: "Supported Source Systems",

          items: {
            type: "object",

            properties: {
              system: {
                type: "string",

                label: "System Name",

                placeholder: "QuickBooks Desktop",

                required: true,

                formField: "text",
              },

              category: {
                type: "string",

                label: "System Category",

                formField: "select",

                options: [
                  { value: "ERP", label: "ERP System" },

                  { value: "CRM", label: "CRM System" },

                  { value: "Accounting", label: "Accounting Software" },

                  { value: "E-commerce", label: "E-commerce Platform" },

                  { value: "Custom Database", label: "Custom Database" },
                ],
              },

              migrationComplexity: {
                type: "string",

                label: "Migration Complexity",

                formField: "select",

                options: [
                  { value: "Low", label: "Low Complexity" },

                  { value: "Medium", label: "Medium Complexity" },

                  { value: "High", label: "High Complexity" },
                ],
              },

              commonChallenges: {
                type: "array",

                label: "Common Challenges",

                items: {
                  type: "string",

                  formField: "text",
                },

                formField: "array",
              },
            },
          },

          formField: "array",
        },
      },
    },

    defaultData: {
      title: "Data Migration Services",

      subtitle: "Seamless migration from your current system to NetSuite",

      migrationTypes: [
        {
          fromSystem: "QuickBooks Desktop/Online",

          dataTypes: [
            "Chart of Accounts",

            "Customers",

            "Vendors",

            "Items",

            "Transactions",
          ],

          complexity: "Standard",

          timeline: "4-6 weeks",

          dataVolume: "Up to 100K records",
        },

        {
          fromSystem: "Excel/CSV Files",

          dataTypes: [
            "Master Data",

            "Historical Transactions",

            "Contact Lists",
          ],

          complexity: "Simple",

          timeline: "2-3 weeks",

          dataVolume: "Up to 50K records",
        },

        {
          fromSystem: "Legacy ERP Systems",

          dataTypes: ["Complete Business Data", "Workflows", "Custom Fields"],

          complexity: "Enterprise",

          timeline: "12-16 weeks",

          dataVolume: "1M+ records",
        },
      ],

      migrationProcess: {
        phases: [
          {
            phase: "Data Assessment",

            description: "Analyze source data quality and structure",

            duration: "1 week",
          },

          {
            phase: "Mapping & Design",

            description: "Map source fields to NetSuite structure",

            duration: "1-2 weeks",
          },

          {
            phase: "Data Cleansing",

            description: "Clean and prepare data for migration",

            duration: "1-2 weeks",
          },

          {
            phase: "Migration Testing",

            description: "Test migration with sample data",

            duration: "1 week",
          },

          {
            phase: "Production Migration",

            description: "Execute final data migration",

            duration: "1 week",
          },
        ],

        tools: [
          "CSV Import",

          "SuiteScript",

          "Third-party Connectors",

          "Custom ETL Scripts",
        ],

        qualityChecks: [
          "Data Validation",

          "Completeness Check",

          "Accuracy Verification",

          "Integrity Testing",
        ],
      },

      supportedSystems: [
        {
          system: "QuickBooks Desktop/Online",

          category: "Accounting",

          migrationComplexity: "Medium",

          commonChallenges: [
            "Chart of Account Mapping",

            "Transaction History",

            "Multi-currency",
          ],
        },

        {
          system: "Sage 50/100/300",

          category: "ERP",

          migrationComplexity: "High",

          commonChallenges: [
            "Complex Data Structure",

            "Custom Fields",

            "Multi-company",
          ],
        },

        {
          system: "Salesforce CRM",

          category: "CRM",

          migrationComplexity: "Medium",

          commonChallenges: [
            "Custom Objects",

            "Relationship Mapping",

            "Workflow Rules",
          ],
        },
      ],
    },
  },

  Analytics: {
    componentName: "Analytics",

    category: "services",

    icon: "",

    displayName: "Analytics & Reporting Services",

    description:
      "Advanced analytics and custom reporting solutions for NetSuite",

    schema: {
      type: "object",

      properties: {
        title: {
          type: "string",

          label: "Section Title",

          placeholder: "Analytics & Reporting Services",

          required: true,

          formField: "text",
        },

        subtitle: {
          type: "string",

          label: "Section Subtitle",

          placeholder: "Transform your data into actionable business insights",

          formField: "textarea",
        },

        analyticsServices: {
          type: "array",

          label: "Analytics Services",

          items: {
            type: "object",

            properties: {
              service: {
                type: "string",

                label: "Service Name",

                placeholder: "Custom Dashboard Development",

                required: true,

                formField: "text",
              },

              description: {
                type: "string",

                label: "Service Description",

                placeholder:
                  "Create interactive dashboards with key business metrics",

                required: true,

                formField: "textarea",
              },

              deliverables: {
                type: "array",

                label: "Key Deliverables",

                items: {
                  type: "string",

                  formField: "text",
                },

                formField: "array",
              },

              timeline: {
                type: "string",

                label: "Implementation Timeline",

                placeholder: "3-4 weeks",

                formField: "text",
              },

              tools: {
                type: "array",

                label: "Tools & Technologies",

                items: {
                  type: "string",

                  formField: "text",
                },

                formField: "array",
              },
            },
          },

          formField: "array",

          minItems: 1,

          maxItems: 8,
        },

        reportTypes: {
          type: "array",

          label: "Report Categories",

          items: {
            type: "object",

            properties: {
              category: {
                type: "string",

                label: "Report Category",

                placeholder: "Financial Reports",

                required: true,

                formField: "text",
              },

              reports: {
                type: "array",

                label: "Available Reports",

                items: {
                  type: "string",

                  formField: "text",
                },

                formField: "array",
              },

              businessValue: {
                type: "string",

                label: "Business Value",

                placeholder:
                  "Real-time financial insights for better decision making",

                formField: "textarea",
              },
            },
          },

          formField: "array",
        },

        dashboardFeatures: {
          type: "array",

          label: "Dashboard Features",

          items: {
            type: "object",

            properties: {
              feature: {
                type: "string",

                label: "Feature Name",

                placeholder: "Real-time KPI Monitoring",

                required: true,

                formField: "text",
              },

              description: {
                type: "string",

                label: "Feature Description",

                placeholder: "Monitor key performance indicators in real-time",

                formField: "textarea",
              },

              benefits: {
                type: "array",

                label: "Key Benefits",

                items: {
                  type: "string",

                  formField: "text",
                },

                formField: "array",
              },
            },
          },

          formField: "array",
        },
      },
    },

    defaultData: {
      title: "Analytics & Reporting Services",

      subtitle: "Transform your data into actionable business insights",

      analyticsServices: [
        {
          service: "Custom Dashboard Development",

          description:
            "Create interactive dashboards with key business metrics and KPIs",

          deliverables: [
            "Executive Dashboard",

            "Departmental Dashboards",

            "Mobile Dashboards",

            "Training Documentation",
          ],

          timeline: "3-4 weeks",

          tools: [
            "SuiteAnalytics",

            "SuiteScript",

            "Workbook Builder",

            "Custom Portlets",
          ],
        },

        {
          service: "Advanced Reporting Solutions",

          description:
            "Develop complex reports with drill-down capabilities and automated distribution",

          deliverables: [
            "Custom Reports",

            "Saved Searches",

            "Email Alerts",

            "Report Scheduling",
          ],

          timeline: "2-3 weeks",

          tools: [
            "Report Builder",

            "SuiteQL",

            "Saved Searches",

            "SuiteAnalytics Workbook",
          ],
        },

        {
          service: "KPI Monitoring Systems",

          description:
            "Set up automated KPI tracking with alerts and notifications",

          deliverables: [
            "KPI Framework",

            "Alert System",

            "Performance Metrics",

            "Trending Analysis",
          ],

          timeline: "4-5 weeks",

          tools: [
            "SuiteAnalytics",

            "Workflow Alerts",

            "Custom Records",

            "Portlets",
          ],
        },
      ],

      reportTypes: [
        {
          category: "Financial Reports",

          reports: [
            "P&L Analysis",

            "Cash Flow Reports",

            "Budget vs Actual",

            "Revenue Recognition",

            "Cost Analysis",
          ],

          businessValue:
            "Real-time financial insights for better decision making and compliance",
        },

        {
          category: "Sales Analytics",

          reports: [
            "Sales Performance",

            "Pipeline Analysis",

            "Customer Profitability",

            "Territory Analysis",

            "Forecasting",
          ],

          businessValue:
            "Optimize sales processes and improve revenue predictability",
        },

        {
          category: "Operations Reports",

          reports: [
            "Inventory Analysis",

            "Order Fulfillment",

            "Supplier Performance",

            "Production Metrics",

            "Quality Control",
          ],

          businessValue:
            "Streamline operations and reduce costs through data-driven insights",
        },
      ],

      dashboardFeatures: [
        {
          feature: "Real-time KPI Monitoring",

          description:
            "Monitor key performance indicators with live data updates",

          benefits: [
            "Immediate Issue Detection",

            "Proactive Decision Making",

            "Performance Tracking",
          ],
        },

        {
          feature: "Interactive Drill-down",

          description:
            "Click through summary data to detailed transaction information",

          benefits: [
            "Root Cause Analysis",

            "Detailed Investigation",

            "Enhanced Understanding",
          ],
        },

        {
          feature: "Mobile Accessibility",

          description: "Access dashboards and reports from any mobile device",

          benefits: [
            "Remote Monitoring",

            "On-the-go Insights",

            "Flexible Access",
          ],
        },
      ],
    },
  },
};

// About Page Components (added/updated)

generalComponentSchemas.AboutHero = {
  componentName: "AboutHero",

  category: "about",

  icon: "",

  displayName: "About Page Hero",

  description: "About page hero with background video, headline and stats",

  schema: {
    type: "object",

    properties: {
      backgroundVideo: {
        type: "string",

        label: "Background Video",

        formField: "media",

        mediaType: "video",

        placeholder: "/Videos/about-hero.mp4",
      },

      backgroundImage: {
        type: "string",

        label: "Background Image (fallback)",

        formField: "media",

        mediaType: "image",

        placeholder: "/images/about-hero.jpg",
      },

      title: {
        type: "string",

        label: "Title",

        formField: "text",

        placeholder: "About Our Company",
      },

      subtitle: {
        type: "string",

        label: "Subtitle",

        formField: "text",

        placeholder: "Who we are & what we do",
      },

      description: {
        type: "string",

        label: "Description",

        formField: "textarea",

        placeholder: "Short description...",
      },

      stats: {
        type: "array",

        label: "Stats",

        formField: "array",

        items: {
          type: "object",

          properties: {
            value: { type: "string", label: "Value", formField: "text" },

            label: { type: "string", label: "Label", formField: "text" },
          },
        },
      },
    },
  },

  defaultData: {
    backgroundVideo: "",

    backgroundImage: "/images/about-hero.jpg",

    title: "About Our Company",

    subtitle: "Who we are & what we do",

    description:
      "We deliver industry-leading solutions that help businesses grow.",

    stats: [
      { value: "200+", label: "Projects" },

      { value: "10+", label: "Years" },
    ],
  },
};

generalComponentSchemas.AboutMission = {
  componentName: "AboutMission",

  category: "about",

  icon: "",

  displayName: "About Mission",

  description: "Mission statement with vision and supporting image",

  schema: {
    type: "object",

    properties: {
      headline: { type: "string", label: "Headline", formField: "text" },

      missionText: {
        type: "string",

        label: "Mission Text",

        formField: "textarea",
      },

      visionText: {
        type: "string",

        label: "Vision Text",

        formField: "textarea",
      },

      image: {
        type: "string",

        label: "Image",

        formField: "media",

        mediaType: "image",
      },
    },
  },

  defaultData: {
    headline: "Our Mission",

    missionText: "To empower businesses with modern digital tools.",

    visionText: "To be the trusted partner for digital transformation.",

    image: "",
  },
};

generalComponentSchemas.AboutJourney = {
  componentName: "AboutJourney",

  category: "about",

  icon: "",

  displayName: "About Journey",

  description: "Company journey timeline with milestones",

  schema: {
    type: "object",

    properties: {
      title: { type: "string", label: "Title", formField: "text" },

      timeline: {
        type: "array",

        label: "Timeline",

        formField: "array",

        items: {
          type: "object",

          properties: {
            year: { type: "string", label: "Year", formField: "text" },

            headline: { type: "string", label: "Headline", formField: "text" },

            details: {
              type: "string",

              label: "Details",

              formField: "textarea",
            },

            image: {
              type: "string",

              label: "Image",

              formField: "media",

              mediaType: "image",
            },
          },
        },
      },
    },
  },

  defaultData: {
    title: "Our Journey",

    timeline: [
      {
        year: "2010",

        headline: "Founded",

        details: "Company founded",

        image: "",
      },

      {
        year: "2015",

        headline: "Growth",

        details: "Reached 100 customers",

        image: "",
      },

      {
        year: "2023",

        headline: "Today",

        details: "Industry leader",

        image: "",
      },
    ],
  },
};

generalComponentSchemas.AboutTeam = {
  componentName: "AboutTeam",

  category: "about",

  icon: "",

  displayName: "About Team",

  description: "Team members showcase with bios and expertise",

  schema: {
    type: "object",

    properties: {
      title: { type: "string", label: "Title", formField: "text" },

      members: {
        type: "array",

        label: "Team Members",

        formField: "array",

        items: {
          type: "object",

          properties: {
            name: { type: "string", label: "Name", formField: "text" },

            role: { type: "string", label: "Role", formField: "text" },

            photo: {
              type: "string",

              label: "Photo",

              formField: "media",

              mediaType: "image",
            },

            bio: { type: "string", label: "Bio", formField: "textarea" },
          },
        },
      },
    },
  },

  defaultData: {
    title: "Meet the Team",

    members: [
      { name: "Jane Doe", role: "CEO", photo: "", bio: "Founder and CEO" },

      { name: "John Smith", role: "CTO", photo: "", bio: "Technology lead" },
    ],
  },
};

generalComponentSchemas.AboutValues = {
  componentName: "AboutValues",

  category: "about",

  icon: "",

  displayName: "About Values",

  description: "Core values with icons and descriptions",

  schema: {
    type: "object",

    properties: {
      title: { type: "string", label: "Title", formField: "text" },

      values: {
        type: "array",

        label: "Values",

        formField: "array",

        items: {
          type: "object",

          properties: {
            icon: {
              type: "string",

              label: "Icon (emoji or name)",

              formField: "text",
            },

            title: { type: "string", label: "Value Title", formField: "text" },

            description: {
              type: "string",

              label: "Description",

              formField: "textarea",
            },
          },
        },
      },
    },
  },

  defaultData: {
    title: "Our Values",

    values: [
      { icon: "", title: "Integrity", description: "We act honestly." },

      { icon: "", title: "Innovation", description: "We push boundaries." },
    ],
  },
};

generalComponentSchemas.SupportDedicatedTeamSection = {
  componentName: "SupportDedicatedTeamSection",

  category: "support",

  icon: "👥",

  displayName: "Dedicated Team Section",

  description: "Your Own Dedicated Team of Bellatrix — bullet points + image",

  schema: {
    type: "object",

    properties: {
      title: {
        type: "string",

        label: "Section Title",

        formField: "text",

        placeholder: "Your Own Dedicated Team of Bellatrix",
      },

      items: {
        type: "array",

        label: "Bullet Points",

        formField: "array",

        items: {
          type: "string",

          label: "Bullet Point",

          formField: "text",

          placeholder: "Enter bullet point text…",
        },
      },

      image: {
        type: "string",

        label: "Section Image",

        formField: "media",

        mediaType: "image",

        placeholder: "/images/Support/team.jpeg",
      },
    },
  },

  defaultData: {
    title: "Your Own Dedicated Team of Bellatrix",

    items: [
      "A team will be assigned to you that is familiar with your organization, how you do things, and most importantly, your goals for your Bellatrix system",
      "A committed team familiar with your Bellatrix environment",
      "Experienced professionals, including a project lead and solution consultants",
      "Structured collaboration to avoid knowledge silos",
      "Access to the collective expertise of a broad team of Bellatrix specialists",
    ],

    image: "/images/Support/team.jpeg",
  },
};

generalComponentSchemas.SupportPayPerUseSection = {
  componentName: "SupportPayPerUseSection",

  category: "support",

  icon: "💳",

  displayName: "Pay Per Use Section",

  description: "Only Pay for the Hours you Use — title, image and two description paragraphs",

  schema: {
    type: "object",

    properties: {
      title: {
        type: "string",

        label: "Section Title",

        formField: "text",

        placeholder: "Only Pay for the Hours you Use",
      },

      image: {
        type: "string",

        label: "Section Image",

        formField: "media",

        mediaType: "image",

        placeholder: "/images/Support/pay2.jpeg",
      },

      description1: {
        type: "string",

        label: "First Paragraph",

        formField: "textarea",

        placeholder: "Stop paying a lot of money for support that you may not use!",
      },

      description2: {
        type: "string",

        label: "Second Paragraph",

        formField: "textarea",

        placeholder: "Our approach is different. Our monthly reviews focus on…",
      },
    },
  },

  defaultData: {
    title: "Only Pay for the Hours you Use",

    image: "/images/Support/pay2.jpeg",

    description1:
      "Stop paying a lot of money for support that you may not use! How many real hours do you get to take advantage of in your support contract? If you don't use them, do you lose them?",

    description2:
      "Our approach is different. Our monthly reviews focus on the realignment of time/hours not used and outlines new ways to leverage unused support hours in order to optimize your system.",
  },
};

generalComponentSchemas.SupportBellatrixSection = {
  componentName: "SupportBellatrixSection",
  category: "support",
  icon: "🛡️",
  displayName: "Bellatrix Support Excellence",
  description: "Your One-Stop-Shop for Bellatrix Support — title, two paragraphs, and three support card lists",
  schema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        label: "Section Title",
        formField: "text",
        placeholder: "Your One-Stop-Shop for Bellatrix Support",
      },
      description1: {
        type: "string",
        label: "First Paragraph",
        formField: "textarea",
        placeholder: "Your business, and how you run it, is very unique…",
      },
      description2: {
        type: "string",
        label: "Second Paragraph",
        formField: "textarea",
        placeholder: "Whether you're in need of functional support…",
      },
      adminSupportTitle: {
        type: "string",
        label: "Admin Card Title",
        formField: "text",
        placeholder: "Admin Support",
      },
      adminSupport: {
        type: "array",
        label: "Admin Support Items",
        formField: "array",
        items: { type: "string", label: "Item", formField: "text" },
      },
      functionalSupportTitle: {
        type: "string",
        label: "Functional Card Title",
        formField: "text",
        placeholder: "Functional Support",
      },
      functionalSupport: {
        type: "array",
        label: "Functional Support Items",
        formField: "array",
        items: { type: "string", label: "Item", formField: "text" },
      },
      developmentSupportTitle: {
        type: "string",
        label: "Development Card Title",
        formField: "text",
        placeholder: "Development Support",
      },
      developmentSupport: {
        type: "array",
        label: "Development Support Items",
        formField: "array",
        items: { type: "string", label: "Item", formField: "text" },
      },
    },
  },
  defaultData: {
    title: "Your One-Stop-Shop for Bellatrix Support",
    description1:
      "Your business, and how you run it, is very unique. So is your Bellatrix instance and required support. Our consultants are well versed in a multitude of different areas to ensure that regardless of the level of support that you require, we can assist you.",
    description2:
      "Whether you're in need of functional support, administrator support, development support, or all the above, SherpaCare is the answer.",
    adminSupportTitle: "Admin Support",
    functionalSupportTitle: "Functional Support",
    developmentSupportTitle: "Development Support",
    adminSupport: [
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
    ],
    functionalSupport: [
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
    ],
    developmentSupport: [
      "Create New reports",
      "Create New dashboards",
      "Create or manage automated processes with Bellatrix SuiteFlows",
      "Enhance Bellatrix functionality with scripting using Bellatrix SuiteScripts",
      "Create Forms",
      "Integrations",
      "Installation of Suite Bundle as required",
    ],
  },

  SolutionsGallery: {
    componentName: "SolutionsGallery",
    category: "solution",
    icon: "🖼️",
    displayName: "Solutions Gallery",
    description: "Image gallery showcasing solution cards with category filters",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", label: "Section Title", placeholder: "Powerful Solutions, Built for Your Business", formField: "text" },
        subtitle: { type: "string", label: "Section Subtitle", placeholder: "Discover how Bellatrix drives operational excellence", formField: "textarea" },
        ctaButtonText: { type: "string", label: "CTA Button Text", placeholder: "Talk to an Expert", formField: "text" },
        solutions: {
          type: "array",
          label: "Solution Cards",
          items: {
            type: "object",
            properties: {
              id: { type: "string", label: "Solution ID", placeholder: "netsuite", formField: "text" },
              title: { type: "string", label: "Solution Title", placeholder: "NetSuite ERP", formField: "text" },
              subtitle: { type: "string", label: "Subtitle / Tagline", placeholder: "Implementation & Customization", formField: "text" },
              category: { type: "string", label: "Category (used for filter pill)", placeholder: "ERP", formField: "text" },
              description: { type: "string", label: "Description", placeholder: "End-to-end setup tailored to your business…", formField: "textarea" },
              image: { type: "string", label: "Card Image", placeholder: "/images/solution.jpg", formField: "media", mediaType: "image" },
              href: { type: "string", label: "Link URL", placeholder: "/netsuite", formField: "text" },
              accentColor: { type: "string", label: "Accent Color (hex)", placeholder: "#6366f1", formField: "text" },
              featured: { type: "boolean", label: "Featured card (wide layout)", formField: "checkbox" },
              features: {
                type: "array",
                label: "Feature Chips",
                items: { type: "string", label: "Feature", formField: "text" },
                formField: "array",
              },
            },
          },
          formField: "array",
        },
      },
    },
    defaultData: {
      title: "Powerful Solutions, Built for Your Business",
      subtitle: "From ERP to industry-specific platforms — discover how Bellatrix drives operational excellence across every function.",
      ctaButtonText: "Talk to an Expert",
      solutions: [
        {
          id: "netsuite",
          category: "ERP",
          title: "NetSuite ERP",
          subtitle: "Implementation & Customization",
          description: "End-to-end NetSuite setup tailored to your business — financials, inventory, custom workflows, and seamless integrations.",
          features: ["Financial Management", "Inventory & Supply Chain", "Custom Workflows", "API Integrations"],
          accentColor: "#6366f1",
          image: "/images/solution.jpg",
          href: "/netsuite",
          featured: true,
        },
        {
          id: "hr",
          category: "HR",
          title: "HR Management",
          subtitle: "People & Talent Platform",
          description: "Streamline hiring, onboarding, performance reviews, and employee records in one unified system.",
          features: ["Recruitment Pipeline", "Employee Onboarding", "Performance Reviews", "Org Charts"],
          accentColor: "#a855f7",
          image: "/images/Hr/hrS1.png",
          href: "/hr",
          featured: false,
        },
        {
          id: "payroll",
          category: "Finance",
          title: "Payroll Solutions",
          subtitle: "Automated & Compliant",
          description: "Automate payroll calculations, multi-currency pay runs, and tax compliance with complete audit trails.",
          features: ["Multi-currency Payroll", "Tax Compliance", "Automated Pay Runs", "Payslip Generation"],
          accentColor: "#22c55e",
          image: "/images/payrollFinal.jpeg",
          href: "/payroll",
          featured: false,
        },
        {
          id: "manufacturing",
          category: "Industry",
          title: "Manufacturing Ops",
          subtitle: "Production & Quality Control",
          description: "Manage work orders, BOMs, production schedules, and quality control for complex manufacturing environments.",
          features: ["Work Order Management", "Bill of Materials", "Production Scheduling", "Quality Control"],
          accentColor: "#f97316",
          image: "/images/indleaders.jpg",
          href: "/manufacturing",
          featured: false,
        },
        {
          id: "retail",
          category: "Industry",
          title: "Retail Commerce",
          subtitle: "Omnichannel & POS",
          description: "Unite online and in-store operations with real-time inventory, POS integration, and customer analytics.",
          features: ["Omnichannel Sales", "Real-time Inventory", "POS Integration", "Customer Analytics"],
          accentColor: "#06b6d4",
          image: "/images/ourProServices.png",
          href: "/retail",
          featured: false,
        },
        {
          id: "support",
          category: "Support",
          title: "24/7 Support",
          subtitle: "Dedicated Expert Team",
          description: "Round-the-clock technical support, proactive monitoring, and dedicated consultants.",
          features: ["24/7 Helpdesk", "System Monitoring", "Dedicated Consultant", "SLA Guarantee"],
          accentColor: "#eab308",
          image: "/images/Support/HeroSection.png",
          href: "/support",
          featured: false,
        },
      ],
    },
  },
};

/**

 * Get schema for a specific general component

 * @param {string} componentType - The component type name

 * @returns {Object} Component schema with metadata

 */

export const getGeneralComponentSchema = (componentType) => {
  return generalComponentSchemas[componentType] || null;
};

/**

 * Get all general components for the registry

 * @returns {Array} Array of component definitions

 */

export const getAllGeneralComponents = () => {
  return Object.entries(generalComponentSchemas).map(
    ([componentType, schema]) => ({
      id: componentType,

      name: schema.displayName,

      description: schema.description,

      icon: schema.icon,

      componentType,

      componentName: schema.componentName,

      category: schema.category,

      hasEnhancedSchema: true,

      schema: schema.schema,

      defaultData: schema.defaultData,
    })
  );
};
