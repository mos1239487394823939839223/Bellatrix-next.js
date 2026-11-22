import React, { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  Bars3BottomLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  getComponentPathFromId as getSharedComponentPath,
  loadComponent as loadSharedComponent,
} from "../../componentMap";

const PageBuilder = ({ category, selectedPage, sections, onSectionsUpdate }) => {
  const [availableComponents, setAvailableComponents] = useState([]);
  const [existingPageData, setExistingPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loadedPreviewComponent, setLoadedPreviewComponent] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchAvailableComponents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Define available components based on category
      const componentLibrary = {
        services: [
          {
            id: "hero-section",
            name: "Hero Section",
            description: "Main banner with title and call-to-action",
            icon: "",
            componentId: "HeroSection",
            category: "layout",
            preview: "/images/HeroSection.png",
          },
          {
            id: "service-grid",
            name: "Service Grid",
            description: "Grid layout for service offerings",
            icon: "",
            componentId: "ServiceGrid",
            category: "content",
            preview: "/images/ourProServices.png",
          },
          {
            id: "testimonials",
            name: "Testimonials",
            description: "Customer testimonials and reviews",
            icon: "",
            componentId: "Testimonials",
            category: "social",
            preview: "/images/about.jpg",
          },
          {
            id: "contact-form",
            name: "Contact Form",
            description: "Contact form for inquiries",
            icon: "",
            componentId: "ContactForm",
            category: "form",
            preview: "/images/about.jpg",
          },
        ],
        solutions: [
          {
            id: "solution-hero",
            name: "Solution Hero",
            description: "Hero section for solution pages",
            icon: "",
            componentId: "SolutionHero",
            category: "layout",
            preview: "/images/solution.jpg",
          },
          {
            id: "feature-list",
            name: "Feature List",
            description: "List of key features and benefits",
            icon: "",
            componentId: "FeatureList",
            category: "content",
            preview: "/images/solution.jpg",
          },
          {
            id: "pricing-table",
            name: "Pricing Table",
            description: "Pricing comparison table",
            icon: "",
            componentId: "PricingTable",
            category: "commerce",
            preview: "/images/solution.jpg",
          },
        ],
        industries: [
          {
            id: "industry-hero",
            name: "Industry Hero",
            description: "Industry-specific hero section",
            icon: "",
            componentId: "IndustryHero",
            category: "layout",
            preview: "/images/indleaders.jpg",
          },
          {
            id: "case-studies",
            name: "Case Studies",
            description: "Industry case studies and success stories",
            icon: "",
            componentId: "CaseStudies",
            category: "content",
            preview: "/images/indleaders.jpg",
          },
          {
            id: "industry-stats",
            name: "Industry Statistics",
            description: "Key industry statistics and metrics",
            icon: "",
            componentId: "IndustryStats",
            category: "data",
            preview: "/images/indleaders.jpg",
          },
        ],
        about: [
          {
            id: "about-hero",
            name: "About Hero",
            description: "Company introduction hero section",
            icon: "",
            componentId: "AboutHero",
            category: "layout",
            preview: "/images/about.jpg",
          },
          {
            id: "team-grid",
            name: "Team Grid",
            description: "Team member showcase grid",
            icon: "",
            componentId: "TeamGrid",
            category: "content",
            preview: "/images/about.jpg",
          },
          {
            id: "company-timeline",
            name: "Company Timeline",
            description: "Company history and milestones",
            icon: "",
            componentId: "CompanyTimeline",
            category: "content",
            preview: "/images/about.jpg",
          },
          {
            id: "values-section",
            name: "Values Section",
            description: "Company values and mission",
            icon: "",
            componentId: "ValuesSection",
            category: "content",
            preview: "/images/about.jpg",
          },
        ],
      };

      const components = componentLibrary[category?.id] || componentLibrary.services;
      setAvailableComponents(components);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Dynamic component loader (same as DynamicPageRenderer)
  const loadComponent = async (componentPath) => {
    try {
      const componentMap = {
        'solution/payroll/PayrollHero': () => import('../../solution/payroll/PayrollHero'),
        'solution/payroll/PayrollHowItWorks': () => import('../../solution/payroll/PayrollHowItWorks'),
        'solution/payroll/PayrollWorkflow': () => import('../../solution/payroll/PayrollWorkflow'),
        'solution/payroll/PayrollStepper': () => import('../../solution/payroll/PayrollStepper'),
        'solution/payroll/PayrollPainPoints': () => import('../../solution/payroll/PayrollPainPoints'),
        'solution/payroll/PayrollFAQ': () => import('../../solution/payroll/PayrollFAQ'),
        'solution/payroll/PayrollCTA': () => import('../../solution/payroll/PayrollCTA'),
        'solution/hr/HeroSection': () => import('../../solution/hr/HeroSection'),

        'solution/hr/ModulesSection': () => import('../../solution/hr/ModulesSection'),

        'solution/hr/BenefitsSection': () => import('../../solution/hr/BenefitsSection'),

        'solution/hr/UseCasesSection': () => import('../../solution/hr/UseCasesSection'),

        'solution/hr/PricingSection': () => import('../../solution/hr/PricingSection'),

        'solution/hr/FAQSection': () => import('../../solution/hr/FAQSection'),

        'solution/hr/CTASection': () => import('../../solution/hr/CTASection'),

        'Services/Implementation/HeroSection': () => import('../../Services/Implementation/HeroSection'),

        'Services/Implementation/ProcessSection': () => import('../../Services/Implementation/ProcessSection'),

        'Services/Implementation/WhyChooseSection': () => import('../../Services/Implementation/WhyChooseSection'),

        'Services/Implementation/PricingSection': () => import('../../Services/Implementation/PricingSection'),

        'Services/Implementation/CtaSection': () => import('../../Services/Implementation/CtaSection'),

        'Services/Implementation/ImplementationModal': () => import('../../Services/Implementation/ImplementationModal'),

        'Services/training/HeroSection': () => import('../../Services/training/HeroSection'),

        'Services/training/TrainingPrograms': () => import('../../Services/training/TrainingPrograms'),

        'Services/training/WhyChooseSection': () => import('../../Services/training/WhyChooseSection'),

        'About/AboutHero': () => import('../../About/AboutHero'),

        'About/AboutMission': () => import('../../About/AboutMission'),

        'About/AboutValues': () => import('../../About/AboutValues'),

        'About/AboutTeam': () => import('../../About/AboutTeam'),

        'About/AboutJourney': () => import('../../About/AboutJourney'),

        'About/AboutMilestones': () => import('../../About/AboutMilestones'),

        'About/AboutDifferentiators': () => import('../../About/AboutDifferentiators'),

        'About/AboutCTA': () => import('../../About/AboutCTA'),

      };

      

      const componentLoader = componentMap[componentPath];

      if (componentLoader) {

        const module = await componentLoader();

        return module;

      }

      // Not in this builder's own list: use the shared section registry, so
      // every section the site can render (incl. newly added ones) previews here.
      const shared = await loadSharedComponent(componentPath);
      if (shared) return { default: shared };

      throw new Error(`Component not found: ${componentPath}`);

    } catch (error) {

      console.error('Error loading component:', error);

      throw error;

    }

  };



  const fetchExistingPageData = useCallback(async () => {

    if (!selectedPage) return;

    

    try {

      setLoading(true);

      const response = await fetch(`/data/${selectedPage.file}`);

      if (!response.ok) {

        throw new Error(`Failed to fetch ${selectedPage.file}`);

      }

      const data = await response.json();

      setExistingPageData(data);

    } catch (err) {

      setError(`Error loading page data: ${err.message}`);

    } finally {

      setLoading(false);

    }

  }, [selectedPage]);



  useEffect(() => {

    fetchAvailableComponents();

    if (selectedPage) {

      fetchExistingPageData();

    }

  }, [fetchAvailableComponents, selectedPage, fetchExistingPageData]);





  const addSection = (component) => {

    const newSection = {

      uid: `section-${Date.now()}`,

      name: component.name,

      componentId: component.componentId,

      icon: component.icon,

      category: component.category,

      order_index: sections.length,

      data: {

        title: component.name,

        content: `This is a ${component.name.toLowerCase()} section.`,

        ...getDefaultDataForComponent(component.componentId),

      },

    };



    onSectionsUpdate([...sections, newSection]);

  };



  const addSectionFromExisting = (sectionKey, sectionData) => {

    // Map section key to component ID

    const componentId = getComponentIdFromSectionKey(sectionKey);

    

    const newSection = {

      uid: `section-${Date.now()}`,

      name: sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),

      componentId: componentId,

      componentPath: getComponentPathFromId(componentId),

      icon: getIconForSection(sectionKey),

      category: "content",

      order_index: sections.length,

      props: transformDataToProps(sectionKey, sectionData),

    };



    onSectionsUpdate([...sections, newSection]);

  };



  // Map section keys to component IDs

  const getComponentIdFromSectionKey = (sectionKey) => {

    const sectionToComponentMap = {

      'hero': 'HRHeroSection',

      'heroSection': 'HRHeroSection',

      'features': 'HRModulesSection',

      'mission': 'AboutMissionSection',

      'team': 'AboutTeamSection',

      'testimonials': 'AboutCTASection',

      'contact': 'AboutCTASection',

      'pricing': 'HRPricingSection',

      'process': 'ImplementationProcessSection',

      'whyChoose': 'ImplementationWhyChooseSection',

      'trainingPrograms': 'TrainingProgramsSection',

      'trainingFeatures': 'TrainingWhyChooseSection',

      'painPoints': 'PayrollPainPointsSection',

      'howItWorks': 'PayrollHowItWorksSection',

      'coreWorkflow': 'PayrollWorkflowSection',

      'faq': 'PayrollFAQSection',

      'cta': 'PayrollCTASection',

      'journey': 'AboutJourneySection',

      'values': 'AboutValuesSection',

      'milestones': 'AboutMilestonesSection',

      'differentiators': 'AboutDifferentiatorsSection',

      

      // Implementation specific sections

      'processSection': 'ImplementationProcessSection',

      'whyChooseSection': 'ImplementationWhyChooseSection',

      'pricingSection': 'ImplementationPricingSection',

      'ctaSection': 'ImplementationCtaSection',

      'modalContent': 'ImplementationModal'

    };

    return sectionToComponentMap[sectionKey] || 'AboutCTASection';

  };



  // Map componentId to componentPath (same as DynamicPageRenderer)

  const getComponentPathFromId = (componentId) => {

    const idToPathMap = {

      'PayrollHeroSection': 'solution/payroll/PayrollHero',

      'PayrollHowItWorksSection': 'solution/payroll/PayrollHowItWorks',

      'PayrollWorkflowSection': 'solution/payroll/PayrollWorkflow',

      'PayrollStepperSection': 'solution/payroll/PayrollStepper',

      'PayrollPainPointsSection': 'solution/payroll/PayrollPainPoints',

      'PayrollFAQSection': 'solution/payroll/PayrollFAQ',

      'PayrollCTASection': 'solution/payroll/PayrollCTA',

      'HRHeroSection': 'solution/hr/HeroSection',

      'HRModulesSection': 'solution/hr/ModulesSection',

      'HRBenefitsSection': 'solution/hr/BenefitsSection',

      'HRUseCasesSection': 'solution/hr/UseCasesSection',

      'HRPricingSection': 'solution/hr/PricingSection',

      'HRFAQSection': 'solution/hr/FAQSection',

      'HRCTASection': 'solution/hr/CTASection',

      'ServiceGrid': 'Services/ServiceGrid',

      'ImplementationHeroSection': 'Services/Implementation/HeroSection',

      'ImplementationProcessSection': 'Services/Implementation/ProcessSection',

      'ImplementationWhyChooseSection': 'Services/Implementation/WhyChooseSection',

      'ImplementationPricingSection': 'Services/Implementation/PricingSection',

      'ImplementationCtaSection': 'Services/Implementation/CtaSection',

      'TrainingHeroSection': 'Services/training/HeroSection',

      'TrainingProgramsSection': 'Services/training/TrainingPrograms',

      'TrainingWhyChooseSection': 'Services/training/WhyChooseSection',

      'AboutHeroSection': 'About/AboutHero',

      'AboutMissionSection': 'About/AboutMission',

      'AboutValuesSection': 'About/AboutValues',

      'AboutTeamSection': 'About/AboutTeam',

      'AboutJourneySection': 'About/AboutJourney',

      'AboutMilestonesSection': 'About/AboutMilestones',

      'AboutDifferentiatorsSection': 'About/AboutDifferentiators',

      'AboutCTASection': 'About/AboutCTA',

    };

    return idToPathMap[componentId] || getSharedComponentPath(componentId) || null;

  };



  // Transform data to props format expected by components

  const transformDataToProps = (sectionKey, sectionData) => {

    switch (sectionKey) {

      case 'hero':
      case 'heroSection':

        return {

          data: {

            hero: {

              title: sectionData.title || 'Modern HR, Payroll & People Management',

              subtitle: sectionData.subtitle || 'Automate HR, empower employees, and stay compliant—on one secure platform designed for the future of work.',

              bgVideo: sectionData.bgVideo || sectionData.backgroundVideo || '/Videos/hrVideo.mp4',

              bgColor: sectionData.bgColor || 'bg-gradient-to-br from-[#191970] via-black to-blue-700'

            }

          }

        };

      case 'features':

        return {

          data: {

            features: {

              title: sectionData.title || 'Features',

              description: sectionData.description || 'Features description',

              items: sectionData.items || [],

            }

          }

        };

      case 'mission':

        return {

          data: {

            mission: {

              title: sectionData.title || 'Our Mission',

              description: sectionData.description || 'Mission description',

              vision: sectionData.vision,

            }

          }

        };

      case 'team':

        return {

          data: {

            team: {

              title: sectionData.title || 'Our Team',

              description: sectionData.description || 'Team description',

              members: sectionData.members || [],

            }

          }

        };

      case 'testimonials':

        return {

          data: {

            testimonials: {

              title: sectionData.title || 'Testimonials',

              description: sectionData.description || 'Testimonials description',

              testimonials: sectionData.testimonials || [],

            }

          }

        };

      case 'pricing':

        return {

          data: {

            pricing: {

              title: sectionData.title || 'Pricing Plans',

              description: sectionData.description || 'Pricing description',

              plans: sectionData.plans || [],

            }

          }

        };

      case 'contact':

        return {

          data: {

            contact: {

              title: sectionData.title || 'Contact Us',

              description: sectionData.description || 'Contact description',

              contactInfo: sectionData.contactInfo || {},

            }

          }

        };

      case 'whyChooseSection':

        return {

          data: {

            title: sectionData.title || 'Why Choose Us',

            subtitle: sectionData.subtitle || sectionData.description || 'Why choose description',

            features: sectionData.features || [],

            image: sectionData.image

          }

        };

      case 'processSection':

        return {

          data: {

            title: sectionData.title || 'Our Implementation',

            subtitle: sectionData.subtitle || sectionData.description || 'A proven methodology for seamless business transformation',

            steps: sectionData.steps || [],

            image: sectionData.image,

            ctaButton: sectionData.ctaButton

          }

        };

      case 'pricingSection':

        return {

          data: {

            title: sectionData.title || 'Implementation Pricing',

            subtitle: sectionData.subtitle || sectionData.description || 'Choose the perfect implementation plan that fits your business needs and budget',

            plans: sectionData.plans || [],

            additionalInfo: sectionData.additionalInfo || {

              note: 'All plans include free consultation and project scoping',

              contactText: 'Need a custom solution? Contact our team for personalized pricing'

            }

          }

        };

      case 'ctaSection':

        return {

          data: {

            title: sectionData.title || 'Ready for a Seamless NetSuite Implementation?',

            subtitle: sectionData.subtitle || sectionData.description || 'Take the next step',

            ctaButton: sectionData.ctaButton

          }

        };

      case 'serviceGrid':

        return {

          data: {

            title: sectionData.title || 'Our Services',

            subtitle: sectionData.subtitle || sectionData.description || 'Comprehensive NetSuite solutions to drive your business forward',

            services: sectionData.services || []

          }

        };

      default:

        return {

          title: sectionData.title || sectionKey,

          description: sectionData.description || `${sectionKey} description`,

          ...sectionData,

        };

    }

  };



  const getIconForSection = (sectionKey) => {

    const iconMap = {

      // Implementation sections

      heroSection: "",

      processSection: "",

      whyChooseSection: "",

      pricingSection: "",

      ctaSection: "",

      modalContent: "",

      

      // HR sections

      hero: "",

      features: "",

      modules: "",

      benefits: "",

      useCases: "",

      pricing: "",

      faq: "",

      cta: "",

      

      // About sections

      mission: "",

      journey: "",

      team: "",

      testimonials: "",

      contact: "",

      values: "",

      milestones: "",

      differentiators: "",

      

      // Training sections

      trainingPrograms: "",

      trainingFeatures: "",

      

      // Payroll sections

      painPoints: "",

      howItWorks: "",

      coreWorkflow: "",

      

      // Generic

      process: "",

      whyChoose: ""

    };

    return iconMap[sectionKey] || "";

  };



  const getDefaultDataForComponent = (componentId) => {

    const defaultData = {

      HeroSection: {

        title: "Welcome to Our Services",

        subtitle: "Professional solutions for your business",

        buttonText: "Get Started",

        backgroundImage: "/images/HeroSection.png",

      },

      ServiceGrid: {

        title: "Our Services",

        services: [

          { name: "Service 1", description: "Description for service 1" },

          { name: "Service 2", description: "Description for service 2" },

        ],

      },

      Testimonials: {

        title: "What Our Clients Say",

        testimonials: [

          { name: "Client 1", quote: "Great service!", company: "Company 1" },

        ],

      },

      ContactForm: {

        title: "Get In Touch",

        fields: ["name", "email", "message"],

      },

    };



    return defaultData[componentId] || {};

  };



  const duplicateSection = (sectionUid) => {

    const sectionToDuplicate = sections.find(section => section.uid === sectionUid);

    if (sectionToDuplicate) {

      const newSection = {

        ...sectionToDuplicate,

        uid: `section-${Date.now()}`,

        order_index: sections.length,

      };

      onSectionsUpdate([...sections, newSection]);

    }

  };



  const removeSection = (sectionUid) => {

    const updatedSections = sections.filter(section => section.uid !== sectionUid);

    const reorderedSections = updatedSections.map((section, index) => ({

      ...section,

      order_index: index,

    }));

    onSectionsUpdate(reorderedSections);

  };





  const handleDragStart = (event) => {

    setActiveId(event.active.id);

  };



  const handleDragEnd = (event) => {

    const { active, over } = event;

    setActiveId(null);



    if (active.id !== over.id) {

      const oldIndex = sections.findIndex(section => section.uid === active.id);

      const newIndex = sections.findIndex(section => section.uid === over.id);



      const reorderedSections = arrayMove(sections, oldIndex, newIndex).map((section, index) => ({

        ...section,

        order_index: index,

      }));



      onSectionsUpdate(reorderedSections);

    }

  };



  if (loading) {

    return (

      <div className="flex items-center justify-center h-64">

        <div className="flex items-center space-x-2">

          <ArrowPathIcon className="h-5 w-5 animate-spin text-blue-400" />

          <span className="text-white">

            {selectedPage ? `Loading sections from "${selectedPage.name}"...` : "Loading components..."}

          </span>

        </div>

      </div>

    );

  }



  if (error) {

    return (

      <div className="flex items-center justify-center h-64">

        <div className="text-center">

          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />

          <h3 className="text-lg font-medium text-white mb-2">

            Error Loading {selectedPage ? "Page Data" : "Components"}

          </h3>

          <p className="text-gray-300 mb-4">{error}</p>

          <Button 

            onClick={selectedPage ? fetchExistingPageData : fetchAvailableComponents} 

            variant="outline"

            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30"

          >

            <ArrowPathIcon className="h-4 w-4 mr-2" />

            Retry

          </Button>

        </div>

      </div>

    );

  }



  return (

    <div className="space-y-8">

      <div className="text-center">

        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">

          Build Your Page

        </h2>

        <p className="text-lg text-gray-300 leading-relaxed">

          {selectedPage ? 

            `Customize sections from "${selectedPage.name}" to build your new ${category?.name?.toLowerCase() || "page"}` :

            `Drag and drop components to build your ${category?.name?.toLowerCase() || "page"}`

          }

        </p>

        {selectedPage && (

          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-lg">

            <span className="text-blue-300 text-sm">

              Based on: <span className="font-semibold text-blue-400">{selectedPage.name}</span>

            </span>

          </div>

        )}

      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Available Components */}

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">

          <CardHeader>

            <CardTitle className="text-white text-xl font-bold">

              {selectedPage ? `Sections from "${selectedPage.name}"` : "Available Components"}

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="space-y-4">

              {selectedPage && existingPageData ? (

                // Show sections from existing page

                Object.entries(existingPageData).map(([sectionKey, sectionData], index) => (

                  <motion.div

                    key={sectionKey}

                    initial={{ opacity: 0, y: 15 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ delay: index * 0.1, duration: 0.3 }}

                  >

                    <div

                      className="p-4 border border-white/20 rounded-xl cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all duration-200 group"

                      onClick={() => addSectionFromExisting(sectionKey, sectionData)}

                    >

                        <div className="flex items-center space-x-4">

                          <div className="text-3xl group-hover:scale-110 transition-transform duration-200">{getIconForSection(sectionKey)}</div>

                          <div className="flex-1">

                            <h4 className="text-base font-semibold text-white mb-1">

                              {sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}

                            </h4>

                            <p className="text-sm text-gray-300 leading-relaxed">

                              {sectionKey} - Click to add to your page

                            </p>

                          </div>

                          <div className="flex items-center space-x-2">

                            <Button

                              size="sm"

                              variant="outline"

                              onClick={async (e) => {

                                e.stopPropagation();

                                const componentId = getComponentIdFromSectionKey(sectionKey);

                                const componentPath = getComponentPathFromId(componentId);

                                const props = transformDataToProps(sectionKey, sectionData);

                                

                                setPreviewSection({ 

                                  key: sectionKey, 

                                  data: sectionData,

                                  componentId,

                                  componentPath,

                                  props

                                });

                                

                                // Load the actual component

                                if (componentPath) {

                                  try {

                                    const Component = await loadComponent(componentPath);

                                    setLoadedPreviewComponent(Component);

                                  } catch (error) {

                                    console.error('Error loading component:', error);

                                    setLoadedPreviewComponent(null);

                                  }

                                }

                                

                                setShowPreview(true);

                              }}

                              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-200"

                            >

                              <EyeIcon className="h-4 w-4" />

                            </Button>

                            <PlusIcon className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />

                          </div>

                        </div>

                    </div>

                  </motion.div>

                ))

              ) : (

                // Show available components

                availableComponents.map((component, index) => (

                <motion.div

                  key={component.id}

                    initial={{ opacity: 0, y: 15 }}

                  animate={{ opacity: 1, y: 0 }}

                    transition={{ delay: index * 0.1, duration: 0.3 }}

                >

                  <div

                      className="p-4 border border-white/20 rounded-xl cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all duration-200 group"

                    onClick={() => addSection(component)}

                  >

                        <div className="flex items-center space-x-4">

                          <div className="text-3xl group-hover:scale-110 transition-transform duration-200">{component.icon}</div>

                      <div className="flex-1">

                            <h4 className="text-base font-semibold text-white mb-1">

                          {component.name}

                        </h4>

                            <p className="text-sm text-gray-300 leading-relaxed">

                          {component.description}

                        </p>

                      </div>

                          <div className="flex items-center space-x-2">

                            <Button

                              size="sm"

                              variant="outline"

                              onClick={(e) => {

                                e.stopPropagation();

                                setPreviewSection({ key: component.componentId, data: getDefaultDataForComponent(component.componentId) });

                                setShowPreview(true);

                              }}

                              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-blue-500/20 hover:border-blue-400 transition-all duration-200"

                            >

                              <EyeIcon className="h-4 w-4" />

                            </Button>

                            <PlusIcon className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />

                          </div>

                    </div>

                  </div>

                </motion.div>

                ))

              )}

            </div>

          </CardContent>

        </Card>



        {/* Page Sections */}

        <div className="lg:col-span-2">

          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">

            <CardHeader>

              <CardTitle className="text-white text-xl font-bold">

                Page Sections ({sections.length})

              </CardTitle>

            </CardHeader>

            <CardContent>

              {sections.length === 0 ? (

                <div className="text-center py-16">

                  <DocumentTextIcon className="h-20 w-20 text-white/40 mx-auto mb-6" />

                  <h3 className="text-xl font-semibold text-white mb-3">

                    No sections added yet

                  </h3>

                  <p className="text-gray-300 text-base leading-relaxed">

                    Click on components from the left to start building your page

                  </p>

                </div>

              ) : (

                <DndContext

                  sensors={sensors}

                  collisionDetection={closestCenter}

                  onDragStart={handleDragStart}

                  onDragEnd={handleDragEnd}

                >

                  <SortableContext

                    items={sections.map(section => section.uid)}

                    strategy={verticalListSortingStrategy}

                  >

                    <div className="space-y-3">

                      {sections.map((section, index) => (

                        <SortableSectionItem

                          key={section.uid}

                          section={section}

                          index={index}

                          onDuplicate={() => duplicateSection(section.uid)}

                          onRemove={() => removeSection(section.uid)}

                        />

                      ))}

                    </div>

                  </SortableContext>

                  <DragOverlay>

                    {activeId ? (

                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-2xl">

                        <div className="flex items-center space-x-4">

                          <div className="text-xl">

                            {sections.find(s => s.uid === activeId)?.icon || ""}

                          </div>

                          <div>

                            <h4 className="text-base font-semibold text-white">

                              {sections.find(s => s.uid === activeId)?.name}

                            </h4>

                          </div>

                        </div>

                      </div>

                    ) : null}

                  </DragOverlay>

                </DndContext>

              )}

            </CardContent>

          </Card>

        </div>

      </div>



      {/* Section Preview Modal */}

      {showPreview && previewSection && (

        <div 

          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"

          onClick={() => setShowPreview(false)}

        >

          <motion.div 

            initial={{ opacity: 0, scale: 0.9 }}

            animate={{ opacity: 1, scale: 1 }}

            exit={{ opacity: 0, scale: 0.9 }}

            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"

            onClick={(e) => e.stopPropagation()}

          >

            {/* Modal Header */}

            <div className="flex items-center justify-between p-6 border-b border-white/20">

              <div>

                <h3 className="text-2xl font-bold text-white">

                  {previewSection.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Preview

                </h3>

                <p className="text-gray-300 mt-1">

                  Section design preview

                </p>

              </div>

              <div className="flex items-center space-x-3">

                <Button

                  variant="outline"

                  onClick={() => {

                    addSectionFromExisting(previewSection.key, previewSection.data);

                    setShowPreview(false);

                    setLoadedPreviewComponent(null);

                  }}

                  className="bg-green-500/20 backdrop-blur-sm border-green-400/30 text-green-400 hover:bg-green-500/30 hover:border-green-400/50"

                >

                  <PlusIcon className="h-4 w-4 mr-2" />

                  Add to Page

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowPreview(false)}

                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30"

                >

                  <XMarkIcon className="h-5 w-5" />

                </Button>

              </div>

            </div>



            {/* Modal Content */}

            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">

              {loadedPreviewComponent ? (

                <Suspense fallback={

                  <div className="flex items-center justify-center h-64">

                    <div className="flex items-center space-x-2">

                      <ArrowPathIcon className="h-5 w-5 animate-spin text-blue-400" />

                      <span className="text-white">Loading component...</span>

                    </div>

                  </div>

                }>

                  <div className="min-h-[400px]">

                    {loadedPreviewComponent?.default ? (

                      React.createElement(loadedPreviewComponent.default, { 

                        ...previewSection.props,

                        data: previewSection.data || {},

                        programsSection: previewSection.data || {},

                        trainingPrograms: previewSection.data?.programs || [],

                        openProgramModal: () => {},

                        openModal: () => {},

                        // حماية إضافية لضمان عدم وجود undefined

                        title: previewSection.data?.title || 'Default Title',

                        subtitle: previewSection.data?.subtitle || 'Default Subtitle',

                        features: previewSection.data?.features || [],

                        image: previewSection.data?.image || '/Videos/implementation/whyChoese.jpg'

                      })

                    ) : (

                      <div className="flex items-center justify-center h-64">

                        <div className="text-center">

                          <div className="text-red-400 text-6xl mb-4"></div>

                          <h3 className="text-lg font-medium text-white mb-2">Component Not Found</h3>

                          <p className="text-gray-300">The component for this section could not be loaded.</p>

                        </div>

                      </div>

                    )}

                  </div>

                </Suspense>

              ) : (

                <div className="p-6">

                  <SectionPreview sectionKey={previewSection.key} sectionData={previewSection.data} />

                </div>

              )}

            </div>

          </motion.div>

        </div>

      )}

    </div>

  );

};



// Sortable Section Item Component

const SortableSectionItem = ({ section, index, onDuplicate, onRemove }) => {

  const {

    attributes,

    listeners,

    setNodeRef,

    transform,

    transition,

    isDragging,

  } = useSortable({ id: section.uid });



  const style = {

    transform: CSS.Transform.toString(transform),

    transition,

    opacity: isDragging ? 0.5 : 1,

  };



  return (

    <motion.div

      ref={setNodeRef}

      style={style}

      initial={{ opacity: 0, y: 10 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ delay: index * 0.1 }}

      className={`bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/20 ${

        isDragging ? "shadow-2xl ring-2 ring-blue-400" : ""

      }`}

    >

      <div className="flex items-center justify-between">

        <div className="flex items-center space-x-4">

          <div

            {...attributes}

            {...listeners}

            className="cursor-grab hover:cursor-grabbing p-2 hover:bg-white/10 rounded-lg transition-colors"

          >

            <Bars3BottomLeftIcon className="h-5 w-5 text-white/60" />

          </div>

          <div className="text-2xl">{section.icon}</div>

          <div>

            <h4 className="text-base font-semibold text-white">

              {section.name}

            </h4>

            <p className="text-sm text-gray-300">

              {section.componentId}

            </p>

          </div>

        </div>

        <div className="flex items-center space-x-2">

          <Button

            size="sm"

            variant="outline"

            onClick={onDuplicate}

            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-green-500/20 hover:border-green-400 transition-all duration-200"

          >

            <DocumentDuplicateIcon className="h-4 w-4" />

          </Button>

          <Button

            size="sm"

            variant="outline"

            onClick={onRemove}

            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-red-500/20 hover:border-red-400 transition-all duration-200"

          >

            <TrashIcon className="h-4 w-4" />

          </Button>

        </div>

      </div>

    </motion.div>

  );

};



// Section Preview Component

const SectionPreview = ({ sectionKey, sectionData }) => {

  const getIconForSection = (sectionKey) => {

    const iconMap = {

      // Implementation sections

      heroSection: "",

      processSection: "",

      whyChooseSection: "",

      pricingSection: "",

      ctaSection: "",

      modalContent: "",

      

      // HR sections

      hero: "",

      features: "",

      modules: "",

      benefits: "",

      useCases: "",

      pricing: "",

      faq: "",

      cta: "",

      

      // About sections

      mission: "",

      journey: "",

      team: "",

      testimonials: "",

      contact: "",

      values: "",

      milestones: "",

      differentiators: "",

      

      // Training sections

      trainingPrograms: "",

      trainingFeatures: "",

      

      // Payroll sections

      painPoints: "",

      howItWorks: "",

      coreWorkflow: "",

      

      // Generic

      process: "",

      whyChoose: ""

    };

    return iconMap[sectionKey] || "";

  };



  const renderSectionPreview = () => {

    switch (sectionKey) {

      case 'hero':
      case 'heroSection':

        return (

          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-8 text-white">

            <h1 className="text-4xl font-bold mb-4">

              {sectionData.title || sectionData.titleParts?.join(' ') || 'Hero Section'}

            </h1>

            <p className="text-xl mb-6 opacity-90">

              {sectionData.subtitle || sectionData.description || 'This is a hero section preview'}

            </p>

            {sectionData.ctaButton && (

              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">

                {sectionData.ctaButton.text || 'Get Started'}

              </button>

            )}

          </div>

        );



      case 'features':

        return (

          <div className="space-y-6">

            <div className="text-center">

              <h2 className="text-3xl font-bold text-white mb-4">

                {sectionData.title || 'Features'}

              </h2>

              <p className="text-gray-300">

                {sectionData.description || 'Key features and benefits'}

              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {(sectionData.items || []).slice(0, 3).map((feature, index) => (

                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">

                  <div className="text-3xl mb-4">{feature.icon}</div>

                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>

                  <p className="text-gray-300">{feature.desc}</p>

                </div>

              ))}

            </div>

          </div>

        );



      case 'mission':

        return (

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8">

            <h2 className="text-3xl font-bold text-white mb-4">

              {sectionData.title || 'Our Mission'}

            </h2>

            <p className="text-gray-300 text-lg mb-6">

              {sectionData.description || 'Mission description goes here'}

            </p>

            {sectionData.vision && (

              <div className="border-l-4 border-blue-400 pl-6">

                <h3 className="text-xl font-semibold text-blue-400 mb-2">Vision</h3>

                <p className="text-gray-300">{sectionData.vision}</p>

              </div>

            )}

          </div>

        );



      case 'team':

        return (

          <div className="space-y-6">

            <div className="text-center">

              <h2 className="text-3xl font-bold text-white mb-4">

                {sectionData.title || 'Our Team'}

              </h2>

              <p className="text-gray-300">

                {sectionData.description || 'Meet our amazing team'}

              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {(sectionData.members || []).slice(0, 3).map((member, index) => (

                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">

                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">

                    <span className="text-2xl font-bold text-white">{member.name?.charAt(0) || 'T'}</span>

                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{member.name || 'Team Member'}</h3>

                  <p className="text-blue-400 mb-2">{member.position || 'Position'}</p>

                  <p className="text-gray-300 text-sm">{member.bio || 'Team member bio'}</p>

                </div>

              ))}

            </div>

          </div>

        );



      case 'testimonials':

        return (

          <div className="space-y-6">

            <div className="text-center">

              <h2 className="text-3xl font-bold text-white mb-4">

                {sectionData.title || 'Testimonials'}

              </h2>

              <p className="text-gray-300">

                {sectionData.description || 'What our clients say about us'}

              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {(sectionData.testimonials || []).slice(0, 2).map((testimonial, index) => (

                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">

                  <p className="text-gray-300 mb-4 italic">"{testimonial.quote || 'Great service!'}"</p>

                  <div className="flex items-center">

                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">

                      <span className="text-white font-bold">{testimonial.name?.charAt(0) || 'C'}</span>

                    </div>

                    <div>

                      <h4 className="text-white font-semibold">{testimonial.name || 'Client Name'}</h4>

                      <p className="text-gray-400 text-sm">{testimonial.company || 'Company'}</p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        );



      case 'pricing':

        return (

          <div className="space-y-6">

            <div className="text-center">

              <h2 className="text-3xl font-bold text-white mb-4">

                {sectionData.title || 'Pricing Plans'}

              </h2>

              <p className="text-gray-300">

                {sectionData.description || 'Choose the perfect plan for your needs'}

              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {['Basic', 'Pro', 'Enterprise'].map((plan, index) => (

                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">

                  <h3 className="text-xl font-semibold text-white mb-4">{plan}</h3>

                  <div className="text-3xl font-bold text-blue-400 mb-4">

                    ${index === 0 ? '99' : index === 1 ? '199' : '399'}/mo

                  </div>

                  <ul className="text-gray-300 space-y-2 mb-6">

                    <li>Feature 1</li>

                    <li>Feature 2</li>

                    <li>Feature 3</li>

                  </ul>

                  <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">

                    Get Started

                  </button>

                </div>

              ))}

            </div>

          </div>

        );



      case 'contact':

        return (

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8">

            <h2 className="text-3xl font-bold text-white mb-6">

              {sectionData.title || 'Contact Us'}

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div>

                <h3 className="text-xl font-semibold text-white mb-4">Get in Touch</h3>

                <div className="space-y-4">

                  <div className="flex items-center">

                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">

                      <span className="text-white"></span>

                    </div>

                    <div>

                      <p className="text-white font-semibold">Email</p>

                      <p className="text-gray-300">info@company.com</p>

                    </div>

                  </div>

                  <div className="flex items-center">

                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">

                      <span className="text-white"></span>

                    </div>

                    <div>

                      <p className="text-white font-semibold">Phone</p>

                      <p className="text-gray-300">+1 (555) 123-4567</p>

                    </div>

                  </div>

                </div>

              </div>

              <div>

                <h3 className="text-xl font-semibold text-white mb-4">Send Message</h3>

                <div className="space-y-4">

                  <input 

                    type="text" 

                    placeholder="Your Name" 

                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"

                  />

                  <input 

                    type="email" 

                    placeholder="Your Email" 

                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"

                  />

                  <textarea 

                    placeholder="Your Message" 

                    rows={3}

                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"

                  />

                  <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">

                    Send Message

                  </button>

                </div>

              </div>

            </div>

          </div>

        );



      default:

        return (

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">

            <div className="text-6xl mb-4">{getIconForSection(sectionKey)}</div>

            <h2 className="text-2xl font-bold text-white mb-4">

              {sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}

            </h2>

            <p className="text-gray-300 mb-6">

              This is a preview of the {sectionKey} section. The actual content will be displayed here.

            </p>

            <div className="bg-white/10 rounded-lg p-4">

              <h3 className="text-lg font-semibold text-white mb-2">Section Data:</h3>

              <pre className="text-sm text-gray-300 text-left overflow-auto">

                {JSON.stringify(sectionData, null, 2)}

              </pre>

            </div>

          </div>

        );

    }

  };



  return (

    <div className="min-h-[400px]">

      {renderSectionPreview()}

    </div>

  );

};



export default PageBuilder;

