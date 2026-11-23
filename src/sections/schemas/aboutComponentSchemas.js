/**
 * About Components Schemas
 * Comprehensive schemas for all About page components
 * Each schema defines all dynamic fields with proper formField types
 */

export const aboutComponentSchemas = {
  // ============================================
  // 1. AboutCTASection
  // ============================================
  AboutCTASection: {
    componentName: "AboutCTASection",
    category: "about",
    icon: "",
    displayName: "About CTA Section",
    description: "Call-to-action section with title, description, features, and button",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Title",
          placeholder: "Ready to Build Something Great?",
          required: true,
          formField: "text"
        },
        subtitle: {
          type: "string",
          label: "Subtitle",
          placeholder: "Let's collaborate to transform your business",
          formField: "textarea"
        },
        description: {
          type: "string",
          label: "Description",
          placeholder: "Contact us today to discuss how we can help you",
          formField: "textarea"
        },
        ctaButton: {
          type: "object",
          label: "CTA Button",
          properties: {
            text: {
              type: "string",
              label: "Button Text",
              placeholder: "Start Consultation",
              formField: "text"
            },
            link: {
              type: "string",
              label: "Button Link",
              placeholder: "/contact",
              formField: "text"
            }
          },
          formField: "object"
        },
        features: {
          type: "array",
          label: "Features",
          formField: "array",
          items: {
            type: "object",
            properties: {
              icon: {
                type: "string",
                label: "Icon (Emoji)",
                placeholder: "",
                formField: "text"
              },
              title: {
                type: "string",
                label: "Feature Title",
                placeholder: "Expert Team",
                required: true,
                formField: "text"
              },
              description: {
                type: "string",
                label: "Feature Description",
                placeholder: "Certified professionals with deep industry knowledge",
                formField: "textarea"
              }
            }
          }
        }
      }
    },
    defaultData: {
      title: "Ready to Build Something Great?",
      subtitle: "Let's collaborate to transform your business with innovative solutions that drive growth, efficiency, and success.",
      description: "Contact us today to discuss how we can help you optimize your operations and drive growth.",
      ctaButton: {
        text: "Start Consultation",
        link: "/contact"
      },
      features: [
        {
          icon: "",
          title: "Expert Team",
          description: "Certified professionals with deep industry knowledge"
        },
        {
          icon: "",
          title: "Proven Track Record",
          description: "Hundreds of successful implementations"
        },
        {
          icon: "",
          title: "Ongoing Support",
          description: "24/7 support to ensure your success"
        }
      ]
    }
  },

  // ============================================
  // 2. AboutDifferentiatorsSection
  // ============================================
  AboutDifferentiatorsSection: {
    componentName: "AboutDifferentiatorsSection",
    category: "about",
    icon: "",
    displayName: "About Differentiators Section",
    description: "Section showcasing what sets the company apart with stats",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "What Sets Us Apart",
          required: true,
          formField: "text"
        },
        description: {
          type: "string",
          label: "Section Description",
          placeholder: "Our unique combination of expertise and commitment to excellence",
          formField: "textarea"
        },
        items: {
          type: "array",
          label: "Differentiators",
          formField: "array",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                label: "Differentiator Title",
                placeholder: "Industry Expertise",
                required: true,
                formField: "text"
              },
              description: {
                type: "string",
                label: "Differentiator Description",
                placeholder: "Deep knowledge across multiple industries",
                formField: "textarea"
              },
              icon: {
                type: "string",
                label: "Icon (Emoji)",
                placeholder: "",
                formField: "text"
              }
            }
          }
        }
      }
    },
    defaultData: {
      title: "What Sets Us Apart",
      description: "Our unique combination of expertise, methodology, and commitment to excellence makes us the preferred choice for Oracle NetSuite implementations.",
      items: [
        {
          title: "Industry Expertise",
          description: "Deep knowledge across multiple industries and business models",
          icon: ""
        },
        {
          title: "Certified Team",
          description: "Oracle certified professionals with proven track records",
          icon: ""
        },
        {
          title: "Global Reach",
          description: "Serving clients across the globe with local expertise",
          icon: ""
        },
        {
          title: "Success Rate",
          description: "Consistently delivering successful implementations",
          icon: ""
        }
      ]
    }
  },

  // ============================================
  // 3. AboutHeroSection
  // ============================================
  AboutHeroSection: {
    componentName: "AboutHeroSection",
    category: "about",
    icon: "",
    displayName: "About Hero Section",
    description: "Hero section with video background, title, and stats",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Hero Title",
          placeholder: "About Bellatrix",
          required: true,
          formField: "text"
        },
        subtitle: {
          type: "string",
          label: "Hero Subtitle",
          placeholder: "Your trusted partner in digital transformation",
          formField: "text"
        },
        description: {
          type: "string",
          label: "Hero Description",
          placeholder: "We are a leading consultancy firm specializing in NetSuite implementations",
          formField: "textarea"
        },
        backgroundVideo: {
          type: "string",
          label: "Background Video",
          placeholder: "/Videos/about-hero.mp4",
          formField: "media",
          mediaType: "video"
        },
        backgroundImage: {
          type: "string",
          label: "Background Image (Fallback)",
          placeholder: "/images/about-hero.jpg",
          formField: "media",
          mediaType: "image"
        },
        ctaButtonText: {
          type: "string",
          label: "CTA Button Text",
          placeholder: "Discover Our Story",
          formField: "text"
        },
        ctaButtonLink: {
          type: "string",
          label: "CTA Button Link",
          placeholder: "/about",
          formField: "text"
        },
        ctaButtonVariant: {
          type: "string",
          label: "CTA Button Style",
          formField: "select",
          options: [
            { value: "primary", label: "Primary" },
            { value: "secondary", label: "Secondary" },
            { value: "outline", label: "Outline" }
          ]
        },
        stats: {
          type: "array",
          label: "Hero Stats",
          formField: "array",
          items: {
            type: "object",
            properties: {
              value: {
                type: "string",
                label: "Stat Value",
                placeholder: "500+",
                required: true,
                formField: "text"
              },
              label: {
                type: "string",
                label: "Stat Label",
                placeholder: "Projects Completed",
                required: true,
                formField: "text"
              }
            }
          }
        }
      }
    },
    defaultData: {
      title: "About Bellatrix",
      subtitle: "Your trusted partner in digital transformation",
      description: "We are a leading consultancy firm specializing in NetSuite implementations, business process optimization, and technology solutions that drive growth and efficiency.",
      backgroundVideo: "/Videos/about-hero.mp4",
      backgroundImage: "",
      ctaButtonText: "Discover Our Story",
      ctaButtonLink: "/about",
      ctaButtonVariant: "primary",
      stats: [
        { value: "500+", label: "Projects Completed" },
        { value: "15+", label: "Years Experience" },
        { value: "98%", label: "Client Satisfaction" },
        { value: "200+", label: "Happy Clients" }
      ]
    }
  },

  // ============================================
  // 4. AboutJourneySection
  // ============================================
  AboutJourneySection: {
    componentName: "AboutJourneySection",
    category: "about",
    icon: "",
    displayName: "About Journey Section",
    description: "Company journey timeline with beginning, growth, and today sections",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Our Journey",
          required: true,
          formField: "text"
        },
        description: {
          type: "string",
          label: "Section Description",
          placeholder: "From humble beginnings to becoming a trusted Oracle NetSuite partner",
          formField: "textarea"
        },
        beginningTitle: {
          type: "string",
          label: "Beginning Section Title",
          placeholder: "The Beginning",
          formField: "text"
        },
        beginningText: {
          type: "string",
          label: "Beginning Section Text",
          placeholder: "Founded in 2008 with a vision to bridge the gap between complex enterprise software and real business needs.",
          formField: "textarea"
        },
        growthTitle: {
          type: "string",
          label: "Growth Section Title",
          placeholder: "Growth & Evolution",
          formField: "text"
        },
        growthText: {
          type: "string",
          label: "Growth Section Text",
          placeholder: "Over the years, we've evolved from a small consulting firm to a comprehensive digital transformation partner.",
          formField: "textarea"
        },
        todayTitle: {
          type: "string",
          label: "Today Section Title",
          placeholder: "Today",
          formField: "text"
        },
        todayText: {
          type: "string",
          label: "Today Section Text",
          placeholder: "We continue to innovate and expand our services, staying at the forefront of technology trends.",
          formField: "textarea"
        },
        imageUrl: {
          type: "string",
          label: "Journey Image",
          placeholder: "/images/journey.jpg",
          formField: "media",
          mediaType: "image"
        },
        milestones: {
          type: "array",
          label: "Timeline Milestones",
          formField: "array",
          items: {
            type: "object",
            properties: {
              year: {
                type: "string",
                label: "Year",
                placeholder: "2008",
                formField: "text"
              },
              title: {
                type: "string",
                label: "Milestone Title",
                placeholder: "Company Founded",
                formField: "text"
              },
              description: {
                type: "string",
                label: "Milestone Description",
                placeholder: "Started with a vision to transform businesses",
                formField: "textarea"
              }
            }
          }
        }
      }
    },
    defaultData: {
      title: "Our Journey",
      description: "From humble beginnings to becoming a trusted Oracle NetSuite partner, our journey has been marked by innovation, growth, and unwavering commitment to excellence.",
      beginningTitle: "The Beginning",
      beginningText: "Founded in 2008 with a vision to bridge the gap between complex enterprise software and real business needs. Our founders recognized that many businesses were struggling to fully leverage their technology investments.",
      growthTitle: "Growth & Evolution",
      growthText: "Over the years, we've evolved from a small consulting firm to a comprehensive digital transformation partner, helping hundreds of organizations across various industries unlock their full potential.",
      todayTitle: "Today",
      todayText: "We continue to innovate and expand our services, staying at the forefront of technology trends while maintaining our core values of excellence and integrity.",
      imageUrl: "/images/solution.jpg",
      milestones: [
        { year: "2008", title: "Company Founded", description: "Started with a vision to transform businesses" },
        { year: "2012", title: "NetSuite Partnership", description: "Became an official Oracle NetSuite partner" },
        { year: "2018", title: "Global Expansion", description: "Expanded operations to serve clients worldwide" },
        { year: "2023", title: "500+ Projects", description: "Reached milestone of 500+ successful implementations" }
      ]
    }
  },

  // ============================================
  // 5. AboutMilestonesSection
  // ============================================
  AboutMilestonesSection: {
    componentName: "AboutMilestonesSection",
    category: "about",
    icon: "",
    displayName: "About Milestones Section",
    description: "Key milestones and achievements in numbers",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Our Journey in Numbers",
          required: true,
          formField: "text"
        },
        description: {
          type: "string",
          label: "Section Description",
          placeholder: "Key milestones that mark our growth and success",
          formField: "textarea"
        },
        items: {
          type: "array",
          label: "Milestones",
          formField: "array",
          items: {
            type: "object",
            properties: {
              number: {
                type: "string",
                label: "Number/Value",
                placeholder: "500+",
                required: true,
                formField: "text"
              },
              title: {
                type: "string",
                label: "Milestone Title",
                placeholder: "Projects Completed",
                required: true,
                formField: "text"
              },
              description: {
                type: "string",
                label: "Milestone Description",
                placeholder: "Successfully delivered implementations across industries",
                formField: "textarea"
              }
            }
          }
        }
      }
    },
    defaultData: {
      title: "Our Journey in Numbers",
      description: "Key milestones that mark our growth and success in delivering exceptional Oracle NetSuite solutions.",
      items: [
        {
          number: "500+",
          title: "Projects Completed",
          description: "Successfully delivered implementations across industries"
        },
        {
          number: "50+",
          title: "Team Members",
          description: "Growing team of certified professionals"
        },
        {
          number: "15+",
          title: "Countries",
          description: "Serving clients globally"
        },
        {
          number: "99%",
          title: "Success Rate",
          description: "Project success rate"
        },
        {
          number: "24/7",
          title: "Support",
          description: "Round-the-clock customer support"
        },
        {
          number: "200+",
          title: "Happy Clients",
          description: "Trusted by businesses worldwide"
        }
      ]
    }
  },

  // ============================================
  // 6. AboutMissionSection
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
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Our Mission",
          required: true,
          formField: "text"
        },
        subtitle: {
          type: "string",
          label: "Section Subtitle",
          placeholder: "Transforming businesses through technology",
          formField: "text"
        },
        description: {
          type: "string",
          label: "Mission Description",
          placeholder: "To empower businesses with innovative technology solutions that transform operations and drive growth.",
          required: true,
          formField: "textarea"
        },
        vision: {
          type: "string",
          label: "Vision Statement",
          placeholder: "To be the global leader in business transformation consulting",
          formField: "textarea"
        },
        additionalContent: {
          type: "string",
          label: "Additional Content",
          placeholder: "Additional information about your mission",
          formField: "textarea"
        },
        image: {
          type: "string",
          label: "Mission Image",
          placeholder: "/images/mission.jpg",
          formField: "media",
          mediaType: "image"
        },
        stats: {
          type: "array",
          label: "Statistics",
          formField: "array",
          items: {
            type: "object",
            properties: {
              value: {
                type: "string",
                label: "Stat Value",
                placeholder: "500+",
                required: true,
                formField: "text"
              },
              label: {
                type: "string",
                label: "Stat Label",
                placeholder: "Projects Completed",
                required: true,
                formField: "text"
              }
            }
          }
        },
        missionPoints: {
          type: "array",
          label: "Key Focus Areas",
          formField: "array",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                label: "Point Title",
                placeholder: "Digital Excellence",
                required: true,
                formField: "text"
              },
              description: {
                type: "string",
                label: "Point Description",
                placeholder: "Driving digital transformation with cutting-edge solutions",
                formField: "textarea"
              }
            }
          }
        }
      }
    },
    defaultData: {
      title: "Our Mission",
      subtitle: "Transforming businesses through technology",
      description: "To empower businesses with innovative technology solutions that transform operations, enhance productivity, and drive sustainable growth.",
      vision: "To be the global leader in business transformation consulting, helping organizations achieve their full potential through technology excellence.",
      additionalContent: "",
      image: "/images/ourProServices.png",
      stats: [
        { value: "500+", label: "Projects Completed" },
        { value: "98%", label: "Client Satisfaction" },
        { value: "15+", label: "Years Experience" },
        { value: "50+", label: "Expert Team" }
      ],
      missionPoints: [
        {
          title: "Digital Excellence",
          description: "Driving digital transformation with cutting-edge solutions"
        },
        {
          title: "Customer Success",
          description: "Ensuring our clients achieve their business objectives"
        },
        {
          title: "Innovation First",
          description: "Continuously innovating to stay ahead of industry trends"
        },
        {
          title: "Quality Delivery",
          description: "Delivering high-quality implementations on time and within budget"
        }
      ]
    }
  },

  // ============================================
  // 7. AboutTeamSection
  // ============================================
  AboutTeamSection: {
    componentName: "AboutTeamSection",
    category: "about",
    icon: "",
    displayName: "About Team Section",
    description: "Team members carousel with photos and bios",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Meet Our Team",
          required: true,
          formField: "text"
        },
        description: {
          type: "string",
          label: "Section Description",
          placeholder: "Our diverse team of experts brings together decades of experience",
          formField: "textarea"
        },
        members: {
          type: "array",
          label: "Team Members",
          formField: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                label: "Member Name",
                placeholder: "Sarah Johnson",
                required: true,
                formField: "text"
              },
              role: {
                type: "string",
                label: "Role/Position",
                placeholder: "CEO & Founder",
                required: true,
                formField: "text"
              },
              bio: {
                type: "string",
                label: "Bio",
                placeholder: "15+ years of experience in enterprise software and business transformation.",
                formField: "textarea"
              },
              image: {
                type: "string",
                label: "Member Photo",
                placeholder: "/images/team/member.jpg",
                formField: "media",
                mediaType: "image"
              },
              expertise: {
                type: "array",
                label: "Expertise Tags",
                formField: "array",
                items: {
                  type: "string",
                  label: "Skill",
                  placeholder: "Leadership",
                  formField: "text"
                }
              }
            }
          }
        }
      }
    },
    defaultData: {
      title: "Meet Our Team",
      description: "Our diverse team of experts brings together decades of experience in enterprise software, business consulting, and digital transformation.",
      members: [
        {
          name: "Sarah Johnson",
          role: "CEO & Founder",
          bio: "15+ years of experience in enterprise software and business transformation.",
          image: "/images/team/sarah-johnson.jpg",
          expertise: ["Leadership", "Strategy", "Enterprise Solutions"]
        },
        {
          name: "Michael Chen",
          role: "CTO",
          bio: "Expert in cloud architecture and scalable software solutions.",
          image: "/images/team/michael-chen.jpg",
          expertise: ["Cloud Architecture", "Software Engineering", "DevOps"]
        },
        {
          name: "Emily Rodriguez",
          role: "VP of Customer Success",
          bio: "Passionate about helping businesses achieve their digital transformation goals.",
          image: "/images/team/emily-rodriguez.jpg",
          expertise: ["Customer Success", "Business Consulting", "Project Management"]
        }
      ]
    }
  },

  // ============================================
  // 8. AboutValuesSection
  // ============================================
  AboutValuesSection: {
    componentName: "AboutValuesSection",
    category: "about",
    icon: "",
    displayName: "About Values Section",
    description: "Company core values with icons and descriptions",
    schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          label: "Section Title",
          placeholder: "Our Values",
          required: true,
          formField: "text"
        },
        description: {
          type: "string",
          label: "Section Description",
          placeholder: "These core values guide everything we do",
          formField: "textarea"
        },
        items: {
          type: "array",
          label: "Values",
          formField: "array",
          items: {
            type: "object",
            properties: {
              icon: {
                type: "string",
                label: "Icon (Emoji)",
                placeholder: "",
                formField: "text"
              },
              title: {
                type: "string",
                label: "Value Title",
                placeholder: "Excellence",
                required: true,
                formField: "text"
              },
              description: {
                type: "string",
                label: "Value Description",
                placeholder: "We strive for excellence in everything we do",
                formField: "textarea"
              },
              color: {
                type: "string",
                label: "Gradient Color",
                placeholder: "from-blue-500 to-cyan-500",
                formField: "text"
              }
            }
          }
        }
      }
    },
    defaultData: {
      title: "Our Values",
      description: "These core values guide everything we do and shape how we interact with our clients, partners, and each other.",
      items: [
        {
          icon: "",
          title: "Excellence",
          description: "We strive for excellence in everything we do, delivering high-quality solutions that exceed expectations.",
          color: "from-blue-500 to-cyan-500"
        },
        {
          icon: "",
          title: "Integrity",
          description: "We conduct business with honesty, transparency, and ethical practices in all our relationships.",
          color: "from-gray-400 to-gray-600"
        },
        {
          icon: "",
          title: "Innovation",
          description: "We embrace new technologies and creative approaches to solve complex business challenges.",
          color: "from-green-500 to-teal-500"
        },
        {
          icon: "",
          title: "Customer Focus",
          description: "We put our customers at the center of everything we do, ensuring their success is our success.",
          color: "from-orange-500 to-red-500"
        }
      ]
    }
  }
};

/**
 * Get schema for a specific About component
 * @param {string} componentType - The component type name
 * @returns {Object|null} - The schema object or null if not found
 */
export const getAboutComponentSchema = (componentType) => {
  return aboutComponentSchemas[componentType] || null;
};

/**
 * Get all About component schemas
 * @returns {Object} - All About component schemas
 */
export const getAllAboutSchemas = () => {
  return aboutComponentSchemas;
};

/**
 * Get default data for a specific About component
 * @param {string} componentType - The component type name
 * @returns {Object} - The default data object or empty object if not found
 */
export const getAboutDefaultData = (componentType) => {
  return aboutComponentSchemas[componentType]?.defaultData || {};
};

export default aboutComponentSchemas;
