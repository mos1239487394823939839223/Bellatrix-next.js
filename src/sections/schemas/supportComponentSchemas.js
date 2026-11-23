/**
 * Support Components Schemas
 * Comprehensive schemas for all Support page components
 * Each schema defines all dynamic fields with proper formField types
 */

export const supportComponentSchemas = {
    // ============================================
    // 1. SupportHeroSection (BellatrixSupportHero)
    // ============================================
    SupportHeroSection: {
        componentName: "SupportHeroSection",
        category: "support",
        icon: "🎯",
        displayName: "Support Hero Section",
        description: "Hero section for Support page with title, description, and CTA",
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    label: "Title",
                    placeholder: "Bellatrix Support",
                    required: true,
                    formField: "text"
                },
                description: {
                    type: "string",
                    label: "Description",
                    placeholder: "Get access to expert knowledge and ongoing NetSuite support",
                    formField: "textarea"
                },
                ctaButton: {
                    type: "object",
                    label: "CTA Button",
                    properties: {
                        text: {
                            type: "string",
                            label: "Button Text",
                            placeholder: "Talk to an Expert",
                            formField: "text"
                        },
                        modalTitle: {
                            type: "string",
                            label: "Modal Title",
                            placeholder: "NetSuite Support Request",
                            formField: "text"
                        },
                        modalSubtitle: {
                            type: "string",
                            label: "Modal Subtitle",
                            placeholder: "Let's discuss your support needs",
                            formField: "text"
                        }
                    },
                    formField: "object"
                }
            }
        },
        defaultData: {
            title: "Bellatrix Support",
            description: "Get access to expert knowledge and ongoing NetSuite support after your initial go-live phase.",
            ctaButton: {
                text: "Talk to an Expert",
                modalTitle: "NetSuite Support Request",
                modalSubtitle: "Let's discuss your support needs"
            }
        }
    },

    // ============================================
    // 2. SupportSecondSection
    // ============================================
    SupportSecondSection: {
        componentName: "SupportSecondSection",
        category: "support",
        icon: "💼",
        displayName: "Support Second Section",
        description: "Section highlighting Bellatrix support team expertise",
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    label: "Title",
                    placeholder: "Empower Your Business with Bellatrix Support",
                    required: true,
                    formField: "text"
                },
                description1: {
                    type: "string",
                    label: "First Paragraph",
                    placeholder: "Our Bellatrix Support service was built to empower...",
                    formField: "textarea"
                },
                description2: {
                    type: "string",
                    label: "Second Paragraph",
                    placeholder: "With hands-on experience implementing...",
                    formField: "textarea"
                },
                image: {
                    type: "string",
                    label: "Section Image",
                    placeholder: "/images/Support/HeroSection.png",
                    formField: "media",
                    mediaType: "image"
                }
            }
        },
        defaultData: {
            title: "Empower Your Business with Bellatrix Support",
            description1: "Our Bellatrix Support service was built to empower your organization to use your ERP with confidence. Our in-house team of certified Oracle NetSuite and Odoo consultants is ready to support you to maximize the return on your ERP investment.",
            description2: "With hands-on experience implementing, customizing and developing Oracle NetSuite and Odoo, we don't just answer your questions — we proactively improve your system.",
            image: "/images/Support/HeroSection.png"
        }
    },

    // ============================================
    // 3. SupportSherpaCareSection
    // ============================================
    SupportSherpaCareSection: {
        componentName: "SupportSherpaCareSection",
        category: "support",
        icon: "🛠️",
        displayName: "Support Services Section",
        description: "Section showcasing comprehensive support services",
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    label: "Title",
                    placeholder: "No matter what kind of assistance you are looking for...",
                    required: true,
                    formField: "text"
                },
                subtitle: {
                    type: "string",
                    label: "Subtitle",
                    placeholder: "Here are some of the ways Bellatrix helped...",
                    formField: "textarea"
                },
                column1: {
                    type: "array",
                    label: "Column 1 Services",
                    formField: "array",
                    items: {
                        type: "string",
                        formField: "text"
                    }
                },
                column2: {
                    type: "array",
                    label: "Column 2 Services",
                    formField: "array",
                    items: {
                        type: "string",
                        formField: "text"
                    }
                },
                column3: {
                    type: "array",
                    label: "Column 3 Services",
                    formField: "array",
                    items: {
                        type: "string",
                        formField: "text"
                    }
                }
            }
        },
        defaultData: {
            title: "No matter what kind of assistance you are looking for, our team can help you.",
            subtitle: "Here are some of the ways Bellatrix helped other organizations:",
            column1: [
                "Ad hoc assistance",
                "Solution design",
                "Updates assistance",
                "Integrating your ERP with other tools",
                "Implementing eCommerce applications"
            ],
            column2: [
                "Creating workflows & process mapping",
                "Developing custom KPI",
                "Writing custom scripts",
                "Designing portals and their modification",
                "Advanced module implementation"
            ],
            column3: [
                "Customizing Bellatrix dashboards",
                "Customizing business processes",
                "Building reports and visualizations"
            ]
        }
    },

    // ============================================
    // 4. SupportWhatWeOfferSection
    // ============================================
    SupportWhatWeOfferSection: {
        componentName: "SupportWhatWeOfferSection",
        category: "support",
        icon: "✨",
        displayName: "What We Offer Section",
        description: "Section highlighting key offerings and value propositions",
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    label: "Title",
                    placeholder: "What We Offer",
                    required: true,
                    formField: "text"
                },
                subtitle: {
                    type: "string",
                    label: "Subtitle",
                    placeholder: "Comprehensive support solutions designed...",
                    formField: "textarea"
                },
                cards: {
                    type: "array",
                    label: "Offering Cards",
                    formField: "array",
                    items: {
                        type: "object",
                        properties: {
                            image: {
                                type: "string",
                                label: "Card Image",
                                placeholder: "/supoortWhatWeOffer.png",
                                formField: "media",
                                mediaType: "image"
                            },
                            title: {
                                type: "string",
                                label: "Card Title",
                                placeholder: "Dedicated Team",
                                required: true,
                                formField: "text"
                            },
                            description: {
                                type: "string",
                                label: "Card Description",
                                placeholder: "A dedicated team of experts...",
                                formField: "textarea"
                            }
                        }
                    }
                }
            }
        },
        defaultData: {
            title: "What We Offer",
            subtitle: "Comprehensive support solutions designed to maximize your success",
            cards: [
                {
                    image: "/supoortWhatWeOffer.png",
                    title: "Dedicated Team",
                    description: "A dedicated team of Bellatrix experts that know your instance will be assigned to you."
                },
                {
                    image: "/supoortWhatWeOffer2.png",
                    title: "Stop Anytime",
                    description: "You can stop the service whenever your team feels confident running the system on its own."
                },
                {
                    image: "/supoortWhatWeOffer3.png",
                    title: "Certified ERP Consultants",
                    description: "Work with certified Oracle NetSuite and Odoo consultants you can rely on."
                }
            ]
        }
    },

    // ============================================
    // 5. SupportDedicatedTeamSection
    // ============================================
    SupportDedicatedTeamSection: {
        componentName: "SupportDedicatedTeamSection",
        category: "support",
        icon: "👥",
        displayName: "Dedicated Team Section",
        description: "Section explaining dedicated team benefits",
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    label: "Title",
                    placeholder: "Your Own Dedicated Team of Bellatrix",
                    required: true,
                    formField: "text"
                },
                items: {
                    type: "array",
                    label: "Bullet Points",
                    formField: "array",
                    items: {
                        type: "string",
                        label: "Point",
                        placeholder: "Dedicated support team",
                        formField: "text"
                    }
                },
                image: {
                    type: "string",
                    label: "Section Image",
                    placeholder: "/images/Support/team.jpeg",
                    formField: "media",
                    mediaType: "image"
                }
            }
        },
        defaultData: {
            title: "Your Own Dedicated Team of Bellatrix",
            items: [
                "A team will be assigned to you that is familiar with your organization, how you do things, and most importantly, your goals for your ERP system",
                "A committed team familiar with your ERP environment",
                "Experienced professionals, including a project lead and solution consultants",
                "Structured collaboration to avoid knowledge silos",
                "Access to the collective expertise of a broad team of Bellatrix specialists"
            ],
            image: "/images/Support/team.jpeg"
        }
    },

    // ============================================
    // 6. SupportPrePackagedSection
    // ============================================
    SupportPrePackagedSection: {
        componentName: "SupportPrePackagedSection",
        category: "support",
        icon: "📦",
        displayName: "Pre-Packaged Support Section",
        description: "Section showing pre-packaged support options",
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    label: "Title",
                    placeholder: "Pre-Packaged Support Solutions",
                    required: true,
                    formField: "text"
                },
                subtitle: {
                    type: "string",
                    label: "Subtitle",
                    placeholder: "An optional subtitle below the title",
                    formField: "text"
                },
                description: {
                    type: "string",
                    label: "Description",
                    placeholder: "Choose from our pre-packaged support options",
                    formField: "textarea"
                },
                packages: {
                    type: "array",
                    label: "Support Packages",
                    formField: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                label: "Package Name",
                                placeholder: "Basic Support",
                                required: true,
                                formField: "text"
                            },
                            description: {
                                type: "string",
                                label: "Package Description",
                                placeholder: "Essential support for small businesses",
                                formField: "textarea"
                            },
                            features: {
                                type: "array",
                                label: "Features",
                                formField: "array",
                                items: {
                                    type: "string",
                                    formField: "text"
                                }
                            },
                            price: {
                                type: "string",
                                label: "Price",
                                placeholder: "$999/month",
                                formField: "text"
                            }
                        }
                    }
                }
            }
        },
        defaultData: {
            title: "Pre-Packaged Support Solutions",
            description: "Choose from our pre-packaged support options designed for businesses of all sizes",
            packages: [
                {
                    name: "Basic Support",
                    description: "Essential support for small businesses",
                    features: ["Email support", "Business hours coverage", "Monthly check-ins"],
                    price: "$999/month"
                },
                {
                    name: "Premium Support",
                    description: "Comprehensive support for growing businesses",
                    features: ["24/7 support", "Dedicated account manager", "Priority response", "Quarterly reviews"],
                    price: "$2,499/month"
                }
            ]
        }
    },

    // ============================================
    // 7. SupportBellatrixSection
    // ============================================
    SupportBellatrixSection: {
        componentName: "SupportBellatrixSection",
        category: "support",
        icon: "⚡",
        displayName: "Bellatrix Support Section",
        description: "General Bellatrix support information section",
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    label: "Title",
                    placeholder: "Bellatrix Support Excellence",
                    required: true,
                    formField: "text"
                },
                description: {
                    type: "string",
                    label: "Description",
                    placeholder: "Comprehensive Bellatrix support services",
                    formField: "textarea"
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
                                placeholder: "🚀",
                                formField: "text"
                            },
                            title: {
                                type: "string",
                                label: "Feature Title",
                                placeholder: "Expert Support",
                                required: true,
                                formField: "text"
                            },
                            description: {
                                type: "string",
                                label: "Feature Description",
                                placeholder: "Get help from certified experts",
                                formField: "textarea"
                            }
                        }
                    }
                }
            }
        },
        defaultData: {
            title: "Bellatrix Support Excellence",
            description: "Comprehensive Bellatrix support services tailored to your needs",
            features: [
                {
                    icon: "🚀",
                    title: "Expert Support",
                    description: "Get help from certified ERP consultants"
                },
                {
                    icon: "⚡",
                    title: "Fast Response",
                    description: "Quick turnaround times for all support requests"
                },
                {
                    icon: "🔧",
                    title: "Proactive Solutions",
                    description: "We identify and fix issues before they impact your business"
                }
            ]
        }
    },

    // ============================================
    // 8. SupportPayPerUseSection
    // ============================================
    SupportPayPerUseSection: {
        componentName: "SupportPayPerUseSection",
        category: "support",
        icon: "💳",
        displayName: "Pay Per Use Section",
        description: "Section explaining pay-per-use pricing model",
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    label: "Title",
                    placeholder: "Pay Per Use Support",
                    required: true,
                    formField: "text"
                },
                description: {
                    type: "string",
                    label: "Description",
                    placeholder: "Flexible pricing based on your actual usage",
                    formField: "textarea"
                },
                benefits: {
                    type: "array",
                    label: "Benefits",
                    formField: "array",
                    items: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string",
                                label: "Benefit Title",
                                placeholder: "No Commitment",
                                required: true,
                                formField: "text"
                            },
                            description: {
                                type: "string",
                                label: "Benefit Description",
                                placeholder: "Pay only for what you use",
                                formField: "textarea"
                            }
                        }
                    }
                },
                pricing: {
                    type: "object",
                    label: "Pricing Details",
                    properties: {
                        hourlyRate: {
                            type: "string",
                            label: "Hourly Rate",
                            placeholder: "$150/hour",
                            formField: "text"
                        },
                        minimumHours: {
                            type: "string",
                            label: "Minimum Hours",
                            placeholder: "4 hours",
                            formField: "text"
                        }
                    },
                    formField: "object"
                }
            }
        },
        defaultData: {
            title: "Pay Per Use Support",
            description: "Flexible pricing based on your actual usage - no long-term commitments required",
            benefits: [
                {
                    title: "No Commitment",
                    description: "Pay only for the support you actually use"
                },
                {
                    title: "Transparent Pricing",
                    description: "Know exactly what you're paying for each time"
                },
                {
                    title: "Scale Up or Down",
                    description: "Use as much or as little support as needed"
                }
            ],
            pricing: {
                hourlyRate: "$150/hour",
                minimumHours: "4 hours"
            }
        }
    },

    // ============================================
    // 9. SupportCustomerSection
    // ============================================
    SupportCustomerSection: {
        componentName: "SupportCustomerSection",
        category: "support",
        icon: "🌟",
        displayName: "Customer Support Section",
        description: "Section highlighting customer support features",
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    label: "Title",
                    placeholder: "Customer Support Excellence",
                    required: true,
                    formField: "text"
                },
                description: {
                    type: "string",
                    label: "Description",
                    placeholder: "Dedicated to your success",
                    formField: "textarea"
                },
                supportChannels: {
                    type: "array",
                    label: "Support Channels",
                    formField: "array",
                    items: {
                        type: "object",
                        properties: {
                            channel: {
                                type: "string",
                                label: "Channel Name",
                                placeholder: "Email",
                                required: true,
                                formField: "text"
                            },
                            description: {
                                type: "string",
                                label: "Channel Description",
                                placeholder: "24/7 email support",
                                formField: "textarea"
                            },
                            icon: {
                                type: "string",
                                label: "Icon (Emoji)",
                                placeholder: "📧",
                                formField: "text"
                            }
                        }
                    }
                }
            }
        },
        defaultData: {
            title: "Customer Support Excellence",
            description: "Multiple channels to get the help you need, when you need it",
            supportChannels: [
                {
                    channel: "Email",
                    description: "24/7 email support with response within 4 hours",
                    icon: "📧"
                },
                {
                    channel: "Phone",
                    description: "Direct phone support during business hours",
                    icon: "📞"
                },
                {
                    channel: "Live Chat",
                    description: "Instant chat support for quick questions",
                    icon: "💬"
                }
            ]
        }
    },

    // ============================================
    // 10. SupportWhyChooseSection
    // ============================================
    SupportWhyChooseSection: {
        componentName: "SupportWhyChooseSection",
        category: "support",
        icon: "🏆",
        displayName: "Why Choose Bellatrix Section",
        description: "Section explaining why to choose Bellatrix support",
        schema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    label: "Title",
                    placeholder: "Why Choose Bellatrix",
                    required: true,
                    formField: "text"
                },
                description: {
                    type: "string",
                    label: "Description",
                    placeholder: "Discover what makes Bellatrix support different",
                    formField: "textarea"
                },
                reasons: {
                    type: "array",
                    label: "Reasons",
                    formField: "array",
                    items: {
                        type: "object",
                        properties: {
                            icon: {
                                type: "string",
                                label: "Icon (Emoji)",
                                placeholder: "🏆",
                                formField: "text"
                            },
                            title: {
                                type: "string",
                                label: "Reason Title",
                                placeholder: "Industry Leader",
                                required: true,
                                formField: "text"
                            },
                            description: {
                                type: "string",
                                label: "Reason Description",
                                placeholder: "Hands-on ERP support experience",
                                formField: "textarea"
                            }
                        }
                    }
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
                                placeholder: "e.g. 50+",
                                required: true,
                                formField: "text"
                            },
                            label: {
                                type: "string",
                                label: "Stat Label",
                                placeholder: "Certified Professionals",
                                formField: "text"
                            }
                        }
                    }
                }
            }
        },
        defaultData: {
            title: "Why Choose Bellatrix",
            description: "Discover what makes Bellatrix support the trusted choice for businesses worldwide",
            reasons: [
                {
                    icon: "🏆",
                    title: "Industry Leader",
                    description: "Hands-on experience in ERP implementation and support"
                },
                {
                    icon: "👥",
                    title: "Expert Team",
                    description: "Certified ERP consultants at your service"
                },
                {
                    icon: "⚡",
                    title: "Proven Track Record",
                    description: "Hundreds of successful implementations and satisfied clients"
                },
                {
                    icon: "🔧",
                    title: "Proactive Approach",
                    description: "We identify and solve problems before they impact your business"
                }
            ],
            stats: [
                { value: "24/7", label: "Support coverage" },
                { value: "18", label: "Years Experience" },
                { value: "500+", label: "Successful Projects" },
                { value: "98%", label: "Client Satisfaction" }
            ]
        }
    }
};

/**
 * Helper function to get a specific support component schema
 * @param {string} componentName - The name of the component
 * @returns {object|null} - The component schema or null if not found
 */
export const getSupportComponentSchema = (componentName) => {
    return supportComponentSchemas[componentName] || null;
};

/**
 * Get all support component names
 * @returns {string[]} - Array of all support component names
 */
export const getSupportComponentNames = () => {
    return Object.keys(supportComponentSchemas);
};

/**
 * Check if a component is a support component
 * @param {string} componentName - The name of the component
 * @returns {boolean} - True if it's a support component
 */
export const isSupportComponent = (componentName) => {
    return componentName in supportComponentSchemas;
};
