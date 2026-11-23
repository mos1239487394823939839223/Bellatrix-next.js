/**

 * Component Schema Registry

 * Defines the default data structure and field configurations for each component type

 */



export const componentSchemas = {

  // Integration Components

  IntegrationHeroSection: {

    title: "Integration Services",

    subtitle: "Connect your ecosystem",

    description: "APIs, middleware, and data pipelines",

    imageUrl: "",

  },



  IntegrationTypesSection: {

    title: "Integration Types",

    types: ["REST APIs", "iPaaS", "File-based", "Webhooks"],

    items: [

      {

        title: "REST APIs",

        description: "Direct API integration with REST endpoints",

        icon: "",

      },

      {

        title: "iPaaS",

        description: "Integration Platform as a Service solutions",

        icon: "",

      },

      {

        title: "File-based",

        description: "File-based data exchange and processing",

        icon: "",

      },

      {

        title: "Webhooks",

        description: "Real-time event-driven integrations",

        icon: "",

      },

    ],

  },



  IntegrationBenefitsSection: {

    title: "Integration Benefits",

    benefits: [

      "Fewer manual tasks",

      "Real-time data",

      "Higher accuracy",

      "Better visibility",

      "Scalable solutions",

      "Cost savings",

    ],

    items: [

      {

        title: "Automated Data Sync",

        description:

          "Eliminate manual data entry with real-time synchronization",

      },

      {

        title: "Improved Accuracy",

        description: "Reduce errors caused by manual data transfer",

      },

      {

        title: "Enhanced Productivity",

        description: "Save time and resources with automated processes",

      },

      {

        title: "Better Visibility",

        description: "Get a complete view of your business across all systems",

      },

      {

        title: "Scalable Solutions",

        description: "Integrations that grow with your business needs",

      },

      {

        title: "Cost Savings",

        description: "Reduce operational costs through automation",

      },

    ],

  },



  IntegrationPopularSection: {

    title: "Popular Integrations",

    platforms: [

      "Shopify",

      "Magento",

      "Salesforce",

      "HubSpot",

      "PayPal",

      "Stripe",

      "Amazon",

      "eBay",

      "QuickBooks",

      "Xero",

      "Slack",

      "Microsoft Office",

    ],

  },



  IntegrationCtaSection: {

    title: "Ready to Integrate?",

    subtitle:

      "Let's connect your systems and streamline your business operations.",

    buttonText: "Start Integration",

    buttonUrl: "#contact",

  },



  // Generic Hero Components

  HeroSection: {

    title: "Welcome to Our Service",

    subtitle: "Your trusted partner for success",

    description: "We provide comprehensive solutions tailored to your needs",

    imageUrl: "",

    buttonText: "Learn More",

    buttonUrl: "#about",

  },



  // CTA Components

  CtaSection: {

    title: "Ready to Get Started?",

    subtitle: "Take the next step towards your goals",

    buttonText: "Contact Us",

    buttonUrl: "#contact",

    backgroundColor: "#3B82F6",

  },



  // Features Components

  FeaturesSection: {

    title: "Our Features",

    subtitle: "Discover what makes us different",

    features: [

      {

        title: "Feature 1",

        description: "Description of feature 1",

        icon: "",

      },

      {

        title: "Feature 2",

        description: "Description of feature 2",

        icon: "",

      },

      {

        title: "Feature 3",

        description: "Description of feature 3",

        icon: "",

      },

    ],

  },



  // Services Components

  ServicesSection: {

    title: "Our Services",

    subtitle: "Comprehensive solutions for your business",

    services: [

      {

        name: "Service 1",

        description: "Description of service 1",

        icon: "",

        link: "#service1",

      },

      {

        name: "Service 2",

        description: "Description of service 2",

        icon: "",

        link: "#service2",

      },

      {

        name: "Service 3",

        description: "Description of service 3",

        icon: "",

        link: "#service3",

      },

    ],

  },



  // Pricing Components

  PricingSection: {

    title: "Pricing Plans",

    subtitle: "Choose the plan that fits your needs",

    plans: [

      {

        name: "Basic",

        price: "$29",

        period: "per month",

        description: "Perfect for small businesses",

        features: ["Feature 1", "Feature 2", "Feature 3"],

        cta: "Get Started",

        popular: false,

      },

      {

        name: "Professional",

        price: "$79",

        period: "per month",

        description: "Ideal for growing companies",

        features: [

          "All Basic features",

          "Feature 4",

          "Feature 5",

          "Priority Support",

        ],

        cta: "Get Started",

        popular: true,

      },

      {

        name: "Enterprise",

        price: "$199",

        period: "per month",

        description: "For large organizations",

        features: [

          "All Professional features",

          "Feature 6",

          "Feature 7",

          "24/7 Support",

          "Custom Integration",

        ],

        cta: "Contact Sales",

        popular: false,

      },

    ],

  },



  // FAQ Components

  FAQSection: {

    title: "Frequently Asked Questions",

    subtitle: "Find answers to common questions",

    faqs: [

      {

        question: "What is your service about?",

        answer:

          "Our service provides comprehensive solutions to help your business grow and succeed.",

      },

      {

        question: "How do I get started?",

        answer:

          "Simply contact us through our contact form or give us a call to discuss your needs.",

      },

      {

        question: "Do you offer support?",

        answer:

          "Yes, we provide 24/7 customer support to help you with any questions or issues.",

      },

    ],

  },



  // About Components

  AboutSection: {

    title: "About Us",

    subtitle: "Learn more about our company",

    description:

      "We are a dedicated team of professionals committed to delivering exceptional results for our clients.",

    mission:

      "Our mission is to provide innovative solutions that drive business growth and success.",

    values: [

      {

        title: "Quality",

        description: "We maintain the highest standards in everything we do",

      },

      {

        title: "Innovation",

        description:

          "We continuously seek new and better ways to serve our clients",

      },

      {

        title: "Integrity",

        description: "We conduct business with honesty and transparency",

      },

    ],

  },



  // Team Components

  TeamSection: {

    title: "Our Team",

    subtitle: "Meet the people behind our success",

    members: [

      {

        name: "John Doe",

        position: "CEO & Founder",

        bio: "John has over 10 years of experience in the industry.",

        image: "",

        linkedin: "https://linkedin.com/in/johndoe",

      },

      {

        name: "Jane Smith",

        position: "CTO",

        bio:

          "Jane leads our technical team with expertise in modern technologies.",

        image: "",

        linkedin: "https://linkedin.com/in/janesmith",

      },

    ],

  },



  // Contact Components

  ContactSection: {

    title: "Contact Us",

    subtitle: "Get in touch with our team",

    description:

      "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",

    email: "contact@company.com",

    phone: "+1 (555) 123-4567",

    address: "123 Business St, City, State 12345",

    formFields: [

      { name: "name", label: "Full Name", type: "text", required: true },

      { name: "email", label: "Email Address", type: "email", required: true },

      { name: "message", label: "Message", type: "textarea", required: true },

    ],

  },



  // Training Components

  TrainingHeroSection: {

    heroContent: {

      title: "Professional Training Programs",

      subtitle: "Professional ERP Education & Skills Development",

      description:

        "Empower your team with comprehensive training solutions designed to enhance skills and drive success",

    },

    backgroundImage: "/images/training.jpg",

    ctaButton: {

      text: "Start Learning Today",

      link: "/training",

      variant: "primary",

      icon: "",

    },

  },



  TrainingProgramsSection: {

    programsSection: {

      title: "Our Training Programs",

      description:

        "Comprehensive training solutions designed to empower your team with the skills they need to excel",

      image: "/images/training.jpg",

      Professional_Badge: "Certified Training",

    },

    trainingPrograms: {

      programs: [

        {

          id: 1,

          title: "NetSuite Fundamentals",

          shortDescription: "Core concepts and navigation basics",

          icon:

            "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",

        },

        {

          id: 2,

          title: "Advanced Modules",

          shortDescription: "Financial management and reporting",

          icon:

            "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",

        },

      ],

    },

  },



  // Manufacturing Components

  ManufacturingHeroSection: {

    title: "Manufacturing Solutions",

    subtitle: "Streamline your manufacturing operations",

    description:

      "Comprehensive NetSuite solutions for manufacturing businesses",

    backgroundImage: "/images/manufacturing-hero.jpg",

    backgroundVideo: "",

    ctaButton: {

      text: "Learn More",

      link: "/manufacturing",

      variant: "primary",

    },

  },



  ManufacturingChallengesSection: {

    title: "Manufacturing Challenges",

    subtitle: "Common pain points we solve",

    challenges: [

      {

        title: "Complex Production Planning",

        description:

          "Managing multi-level BOMs, work orders, and production schedules",

        icon:

          "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",

        impact: "High",

      },

      {

        title: "Inventory Management",

        description: "Tracking raw materials, WIP, and finished goods",

        icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",

        impact: "Medium",

      },

    ],

  },



  ManufacturingSolutionsSection: {

    title: "Manufacturing Solutions",

    subtitle: "Comprehensive NetSuite solutions",

    description: "Tailored solutions for manufacturing businesses",

    solutions: [

      {

        title: "Production Management",

        description: "End-to-end production planning and execution",

        features: ["Work orders", "Routing", "Capacity planning"],

        benefits: "40% improvement in production efficiency",

      },

      {

        title: "Inventory Control",

        description: "Advanced inventory management capabilities",

        features: ["Multi-location", "Serial tracking", "Cycle counting"],

        benefits: "35% reduction in inventory costs",

      },

    ],

  },







  ManufacturingImplementationProcess: {

    title: "Manufacturing Implementation Process",

    description: "Our proven methodology for manufacturing implementations",

    processSteps: [

      {

        step: "Discovery",

        title: "Requirements Analysis",

        description: "Deep dive into your manufacturing processes",

        duration: "2-3 weeks",

        icon: "",

      },

      {

        step: "Design",

        title: "Solution Design",

        description: "Custom solution architecture for your needs",

        duration: "3-4 weeks",

        icon: "",

      },

      {

        step: "Build",

        title: "Configuration & Development",

        description: "System configuration and customization",

        duration: "6-8 weeks",

        icon: "",

      },

      {

        step: "Deploy",

        title: "Go-Live & Support",

        description: "Deployment and post-implementation support",

        duration: "2-3 weeks",

        icon: "",

      },

    ],

  },



  ManufacturingCaseStudies: {

    title: "Manufacturing Success Stories",

    description:

      "See how we've helped manufacturing companies transform their operations",

    caseStudies: [

      {

        title: "Automotive Parts Manufacturer",

        industry: "Automotive",

        challenge: "Complex multi-location inventory management",

        solution: "NetSuite Advanced Manufacturing with WMS",

        results: "40% reduction in inventory carrying costs",

        timeline: "6 months",

        image: "/images/case-study-1.jpg",

      },

      {

        title: "Electronics Manufacturer",

        industry: "Electronics",

        challenge: "Manual production planning and scheduling",

        solution: "NetSuite Manufacturing Edition with custom workflows",

        results: "60% improvement in on-time delivery",

        timeline: "4 months",

        image: "/images/case-study-2.jpg",

      },

    ],

  },



  ManufacturingCTASection: {

    title: "Ready to Transform Your Manufacturing Operations?",

    subtitle:

      "Let's discuss how NetSuite can streamline your manufacturing processes",

    description:

      "Our manufacturing experts are ready to help you optimize operations, reduce costs, and improve efficiency.",

    ctaButton: {

      text: "Schedule Manufacturing Consultation",

      link: "/contact",

      variant: "primary",

      icon: "",

    },

    features: [

      {

        title: "Free Assessment",

        description: "Comprehensive evaluation of your current processes",

      },

      {

        title: "Expert Guidance",

        description: "Work with certified NetSuite manufacturing specialists",

      },

      {

        title: "Proven ROI",

        description:

          "Join hundreds of successful manufacturing implementations",

      },

    ],

    backgroundImage: "/images/manufacturing-cta-bg.jpg",

  },



  // Implementation Service Components

  ImplementationProcessSection: {

    title: "Our Implementation Process",

    description:

      "A proven methodology that ensures successful NetSuite implementations every time",

    processData: {

      title: "Implementation Methodology",

      description: "Our step-by-step approach to NetSuite success",

      steps: [

        {

          phase: "Discovery",

          title: "Requirements Gathering",

          description:

            "We analyze your current processes and identify improvement opportunities",

          duration: "2-4 weeks",

          deliverables: [

            "Current state analysis",

            "Future state design",

            "Gap analysis",

            "Project roadmap",

          ],

          icon: "",

        },

        {

          phase: "Design",

          title: "Solution Architecture",

          description:

            "We design a tailored NetSuite solution that fits your unique needs",

          duration: "3-5 weeks",

          deliverables: [

            "System design document",

            "Integration architecture",

            "Data migration plan",

            "Testing strategy",

          ],

          icon: "",

        },

        {

          phase: "Build",

          title: "Configuration & Development",

          description:

            "We configure NetSuite and develop customizations based on your requirements",

          duration: "6-10 weeks",

          deliverables: [

            "Configured system",

            "Custom scripts",

            "Integrations",

            "Reports & dashboards",

          ],

          icon: "",

        },

        {

          phase: "Test",

          title: "Quality Assurance",

          description:

            "Rigorous testing ensures everything works perfectly before go-live",

          duration: "2-3 weeks",

          deliverables: [

            "Test scripts",

            "User acceptance testing",

            "Performance testing",

            "Security validation",

          ],

          icon: "",

        },

        {

          phase: "Deploy",

          title: "Go-Live & Support",

          description:

            "We manage your go-live and provide ongoing support for success",

          duration: "1-2 weeks",

          deliverables: [

            "Production deployment",

            "User training",

            "Go-live support",

            "Post-implementation review",

          ],

          icon: "",

        },

      ],

    },

  },



  ImplementationWhyChooseSection: {

    title: "Why Choose Our Implementation Services?",

    subtitle: "Experience the difference that expertise makes",

    description:

      "Our proven track record and deep NetSuite knowledge ensure your implementation succeeds",

    benefits: [

      {

        title: "Certified Expertise",

        description:

          "Our team includes NetSuite certified professionals with years of implementation experience",

        icon: "",

        stats: "50+ certified consultants",

      },

      {

        title: "Proven Methodology",

        description:

          "Time-tested implementation process that reduces risk and accelerates time-to-value",

        icon: "",

        stats: "500+ successful implementations",

      },

      {

        title: "Industry Specialization",

        description:

          "Deep knowledge across manufacturing, retail, services, and other key industries",

        icon: "",

        stats: "15+ industries served",

      },

      {

        title: "Ongoing Support",

        description:

          "Comprehensive post-implementation support to ensure long-term success",

        icon: "",

        stats: "24/7 support available",

      },

      {

        title: "Faster ROI",

        description:

          "Our efficient approach helps you realize NetSuite benefits quickly",

        icon: "",

        stats: "Average 6-month ROI",

      },

      {

        title: "Change Management",

        description:

          "We help your team adapt to new processes and maximize adoption",

        icon: "",

        stats: "95% user adoption rate",

      },

    ],

  },



  ImplementationPricingSection: {

    title: "Implementation Pricing Plans",

    subtitle: "Transparent pricing for every implementation size",

    description:

      "Choose the right implementation package for your business needs and budget",

    pricingData: {

      title: "Implementation Packages",

      plans: [

        {

          name: "Starter",

          price: "$25,000",

          period: "one-time",

          description:

            "Perfect for small businesses getting started with NetSuite",

          features: [

            "Basic NetSuite configuration",

            "Up to 5 user accounts",

            "Standard financial modules",

            "Basic reporting setup",

            "Email support",

            "2-day training session",

          ],

          cta: "Get Started",

          popular: false,

          timeline: "6-8 weeks",

          support: "Email & phone",

        },

        {

          name: "Professional",

          price: "$75,000",

          period: "one-time",

          description: "Comprehensive implementation for growing companies",

          features: [

            "Full NetSuite configuration",

            "Up to 25 user accounts",

            "Advanced modules included",

            "Custom reports & dashboards",

            "Priority support",

            "5-day training program",

            "Data migration assistance",

            "Basic integrations",

          ],

          cta: "Most Popular",

          popular: true,

          timeline: "10-12 weeks",

          support: "Priority support",

        },

        {

          name: "Enterprise",

          price: "Custom",

          period: "quote",

          description: "Tailored solutions for complex enterprise requirements",

          features: [

            "Custom NetSuite implementation",

            "Unlimited user accounts",

            "All NetSuite modules",

            "Custom development",

            "Dedicated support team",

            "Comprehensive training",

            "Complex data migrations",

            "Third-party integrations",

            "Change management",

          ],

          cta: "Contact Sales",

          popular: false,

          timeline: "12-16 weeks",

          support: "Dedicated team",

        },

      ],

    },

  },



  ImplementationCtaSection: {

    title: "Ready to Start Your NetSuite Implementation?",

    subtitle:

      "Join hundreds of successful companies that have transformed their operations with NetSuite",

    description:

      "Our implementation experts are ready to guide you through every step of your NetSuite journey.",

    ctaButton: {

      text: "Schedule Implementation Consultation",

      link: "/contact",

      variant: "primary",

      icon: "",

    },

    features: [

      {

        title: "Free Assessment",

        description: "Comprehensive evaluation of your implementation needs",

      },

      {

        title: "Expert Team",

        description: "Work with certified NetSuite implementation specialists",

      },

      {

        title: "Proven Success",

        description: "Join our track record of successful implementations",

      },

    ],

    testimonial: {

      quote:

        "The implementation team made our NetSuite rollout seamless. We went live on time and under budget.",

      author: "Sarah Johnson",

      company: "Manufacturing Solutions Inc.",

      image: "/images/testimonial-sarah.jpg",

    },

  },



  // Retail Industry Components

  RetailHeroSection: {

    title: "Retail Solutions",

    subtitle: "Transform your retail operations with NetSuite",

    description:

      "Comprehensive retail management solutions that unify online and offline operations",

    backgroundImage: "/images/retail-hero.jpg",

    backgroundVideo: "",

    ctaButton: {

      text: "Explore Retail Solutions",

      link: "/retail",

      variant: "primary",

    },

    stats: [

      { value: "200+", label: "Retail Clients" },

      { value: "50%", label: "Average Sales Increase" },

      { value: "99.9%", label: "Uptime Guarantee" },

    ],

  },



  // Common/Shared Components



  ContactForm: {

    title: "Contact Us",

    subtitle: "Get in touch with our team",

    description:

      "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",

    fields: [

      {

        name: "firstName",

        label: "First Name",

        type: "text",

        required: true,

        placeholder: "Enter your first name",

      },

      {

        name: "lastName",

        label: "Last Name",

        type: "text",

        required: true,

        placeholder: "Enter your last name",

      },

      {

        name: "email",

        label: "Email Address",

        type: "email",

        required: true,

        placeholder: "Enter your email",

      },

      {

        name: "company",

        label: "Company",

        type: "text",

        required: false,

        placeholder: "Enter your company name",

      },

      {

        name: "phone",

        label: "Phone Number",

        type: "tel",

        required: false,

        placeholder: "Enter your phone number",

      },

      {

        name: "subject",

        label: "Subject",

        type: "text",

        required: true,

        placeholder: "What can we help you with?",

      },

      {

        name: "message",

        label: "Message",

        type: "textarea",

        required: true,

        placeholder: "Tell us more about your needs...",

      },

    ],

    submitButton: {

      text: "Send Message",

      variant: "primary",

    },

    successMessage: "Thank you for your message! We'll get back to you soon.",

    errorMessage:

      "Sorry, there was an error sending your message. Please try again.",

  },



  Modal: {

    isOpen: false,

    title: "Modal Title",

    content:

      "This is the modal content. You can add any content here including text, forms, or other components.",

    closeButton: {

      text: "Close",

      variant: "secondary",

    },

    primaryButton: {

      text: "Confirm",

      variant: "primary",

    },

    size: "medium", // small, medium, large, fullscreen

    showCloseIcon: true,

    closable: true,

    backdrop: true,

  },



  CTAButton: {

    text: "Get Started Today",

    variant: "primary", // primary, secondary, outline, ghost

    size: "medium", // small, medium, large

    icon: "", // SVG path or icon name

    iconPosition: "left", // left, right, none

    disabled: false,

    loading: false,

    fullWidth: false,

    onClick: null, // function

    href: "", // for link buttons

    target: "_self", // _self, _blank

  },



  // HR Components

  HRBenefitsSection: {

    title: "Why Choose Our HR Solution?",

    description:

      "Discover the key advantages that make our HR platform the smart choice for modern businesses of all sizes and industries.",

    features: [

      {

        title: "Automated Workflows",

        description:

          "Streamline HR processes with intelligent automation that reduces manual work and improves accuracy",

        icon: "",

      },

      {

        title: "Employee Self-Service",

        description:

          "Empower employees with self-service capabilities for leave requests, benefits, and personal information updates",

        icon: "",

      },

      {

        title: "Compliance Management",

        description:

          "Stay compliant with automated reporting and tracking for labor laws and regulations",

        icon: "",

      },

      {

        title: "Performance Analytics",

        description:

          "Get insights into employee performance with comprehensive reporting and analytics",

        icon: "",

      },

      {

        title: "Scalable Platform",

        description:

          "Grow your business with a platform that scales from small teams to large enterprises",

        icon: "",

      },

      {

        title: "24/7 Support",

        description:

          "Get expert support whenever you need it with our dedicated customer success team",

        icon: "",

      },

    ],

  },



  HRModulesSection: {

    title: "Product Modules",

    description:

      "Our platform is built from modular components to cover every aspect of HR, payroll, and compliance—choose what fits your business best.",

    modules: [

      {

        icon: "",

        title: "Employee Management",

        desc:

          "Comprehensive employee records, profiles, and lifecycle management from onboarding to offboarding.",

      },

      {

        icon: "",

        title: "Payroll Processing",

        desc:

          "Automated payroll calculations, tax deductions, and salary disbursements with compliance features.",

      },

      {

        icon: "",

        title: "Performance Analytics",

        desc:

          "Track employee performance, KPIs, and generate insightful reports for better decision making.",

      },

      {

        icon: "",

        title: "Compliance Tracking",

        desc:

          "Stay compliant with labor laws, regulations, and industry standards with automated tracking.",

      },

      {

        icon: "",

        title: "Recruitment Management",

        desc:

          "Streamline your hiring process with applicant tracking and candidate management tools.",

      },

      {

        icon: "",

        title: "Training & Development",

        desc:

          "Manage employee training programs, certifications, and skill development initiatives.",

      },

    ],

  },



  HRUseCasesSection: {

    title: "HR Use Cases",

    description:

      "Explore how our HR solution addresses common business challenges and scenarios.",

    useCases: [

      {

        title: "Employee Onboarding",

        desc:

          "Streamline new hire processes with automated workflows, document collection, and structured orientation programs.",

      },

      {

        title: "Performance Management",

        desc:

          "Track employee performance with goal setting, regular reviews, and 360-degree feedback systems.",

      },

      {

        title: "Payroll Automation",

        desc:

          "Automate salary calculations, tax deductions, and compliance with labor regulations.",

      },

      {

        title: "Leave Management",

        desc:

          "Manage employee time-off requests, approvals, and tracking with automated policy enforcement.",

      },

      {

        title: "Compliance Reporting",

        desc:

          "Generate compliance reports for labor laws, tax regulations, and industry-specific requirements.",

      },

      {

        title: "Employee Development",

        desc:

          "Support career growth with training programs, skill assessments, and development planning.",

      },

    ],

  },



  HRPricingSection: {

    title: "HR Pricing Plans",

    description: "Choose the perfect plan for your organization's HR needs.",

    pricing: [

      {

        name: "Basic Plan",

        price: "$99",

        period: "per month",

        description: "Perfect for small businesses",

        features: [

          "Employee Management",

          "Basic Payroll",

          "Time Tracking",

          "Benefits Administration",

          "Email Support",

        ],

        isPopular: false,

      },

      {

        name: "Professional Plan",

        price: "$199",

        period: "per month",

        description: "Ideal for growing companies",

        features: [

          "Everything in Basic",

          "Advanced Analytics",

          "Performance Management",

          "Advanced Reporting",

          "Integration Support",

          "Phone Support",

        ],

        isPopular: true,

      },

      {

        name: "Enterprise Plan",

        price: "$399",

        period: "per month",

        description: "For large organizations",

        features: [

          "Everything in Professional",

          "Custom Integrations",

          "Advanced Security",

          "Dedicated Account Manager",

          "24/7 Priority Support",

          "Custom Training",

        ],

        isPopular: false,

      },

    ],

  },



  HRFAQSection: {

    title: "Frequently Asked Questions",

    description: "Find answers to common questions about our HR solution.",

    faq: {

      items: [

        {

          question: "What HR modules are included?",

          answer:

            "Our HR solution includes employee management, payroll processing, benefits administration, performance tracking, time & attendance, recruitment, and compliance reporting modules.",

        },

        {

          question: "How long does implementation take?",

          answer:

            "Typical implementation takes 4-8 weeks depending on your organization size and requirements. We provide dedicated support throughout the process.",

        },

        {

          question: "Is training provided?",

          answer:

            "Yes, we provide comprehensive training for all users including administrators and end-users. Training includes online sessions, documentation, and ongoing support.",

        },

        {

          question: "Can the system integrate with existing tools?",

          answer:

            "Yes, our HR platform offers extensive integration capabilities with popular business tools, accounting software, and other enterprise systems.",

        },

        {

          question: "What security measures are in place?",

          answer:

            "We implement enterprise-grade security including data encryption, multi-factor authentication, role-based access control, and regular security audits.",

        },

        {

          question: "Is there mobile access?",

          answer:

            "Yes, our platform includes mobile apps for both iOS and Android, allowing employees and managers to access HR functions on the go.",

        },

      ],

    },

  },



  HRCTASection: {

    title: "Ready to Transform Your HR?",

    subtitle:

      "Let's discuss your HR needs and find the perfect solution for your organization.",

    ctaButton: {

      text: "Get Started",

      link: "/contact",

      variant: "primary",

    },

    description:

      "Join thousands of companies that have streamlined their HR processes with our comprehensive solution.",

  },

};



/**

 * Get default data for a component type

 * @param {string} componentType - The component type name

 * @returns {Object} Default data object for the component

 */

export const getDefaultDataForComponent = (componentType) => {

  return (

    componentSchemas[componentType] || {

      title: "New Component",

      description: "Component description",

      content: "Add your content here",

    }

  );

};



/**

 * Get field configuration for a component type

 * @param {string} componentType - The component type name

 * @returns {Object} Field configuration object

 */

export const getFieldConfigForComponent = (componentType) => {

  const defaultData = getDefaultDataForComponent(componentType);



  // Generate field configuration based on the data structure

  const fieldConfig = {};



  Object.keys(defaultData).forEach((key) => {

    const value = defaultData[key];



    if (Array.isArray(value)) {

      fieldConfig[key] = {

        type: "array",

        label: key.replace(/([A-Z])/g, " $1").trim(),

        items:

          value.length > 0 && typeof value[0] === "object"

            ? Object.keys(value[0]).map((subKey) => ({

              key: subKey,

              type: typeof value[0][subKey] === "string" ? "text" : "text",

              label: subKey.replace(/([A-Z])/g, " $1").trim(),

            }))

            : [{ key: "value", type: "text", label: "Value" }],

      };

    } else if (typeof value === "object" && value !== null) {

      fieldConfig[key] = {

        type: "object",

        label: key.replace(/([A-Z])/g, " $1").trim(),

        fields: Object.keys(value).map((subKey) => ({

          key: subKey,

          type: typeof value[subKey] === "string" ? "text" : "text",

          label: subKey.replace(/([A-Z])/g, " $1").trim(),

        })),

      };

    } else {

      fieldConfig[key] = {

        type: "text",

        label: key.replace(/([A-Z])/g, " $1").trim(),

        placeholder: `Enter ${key

          .replace(/([A-Z])/g, " $1")

          .trim()

          .toLowerCase()}`,

      };

    }

  });



  return fieldConfig;

};



export default componentSchemas;

