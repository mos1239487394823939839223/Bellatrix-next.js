import React, { useState, useEffect, useMemo } from "react";

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

import { EyeIcon } from "@heroicons/react/24/outline";

import Card, { CardContent, CardHeader, CardTitle } from "../UI/Card";

import { componentRegistry } from "../../config/previewComponentRegistry";

import PreviewError from "./LivePreview/PreviewError";

import ComponentNotFound from "./LivePreview/ComponentNotFound";

import ErrorBoundaryWrapper from "./LivePreview/ErrorBoundaryWrapper";

/**

 * Real-time Component Preview System

 * Renders components with live data updates while maintaining original styling

 */

const ComponentPreview = ({
  componentType,

  componentData = {},

  theme = 1,

  isVisible = true,

  className = "",
}) => {
  const [error, setError] = useState(null);

  // Transform data to component props format

  // Create a stable JSON snapshot of componentData so nested/mutated fields

  // trigger the useMemo recompute when their values change (not only object ref)

  // Compute a JSON snapshot every render (avoid relying on object identity)

  const componentDataString = (() => {
    try {
      return JSON.stringify(componentData || {});
    } catch {
      return String(componentData);
    }
  })();

  // We intentionally depend on `componentDataString` (a JSON snapshot) in order

  // to detect deep changes; include componentData as well to satisfy hooks linter.

  const transformedProps = useMemo(() => {
    // reference the JSON snapshot so it's treated as a real dependency

    const _componentDataSnapshot = componentDataString;

    if (!componentData) return {};

    try {
      // Transform based on component type

      switch (componentType) {
        case "PayrollHowItWorksSection": {
          {
            console.log(
              " [PayrollHowItWorksSection TRANSFORM] Input data:",

              componentData,
            );

            const transformedPayrollHowItWorksData = {
              data: {
                title: componentData.title || "How Our Payroll System Works",

                description:
                  componentData.description ||
                  "Our payroll process is simple: upload employee and contract details, sync timesheets and leave data, let the system run payroll automatically on schedule, approve via role-based access, execute payments through integrated bank APIs, and download payslips & compliance-ready reports—all in one platform.",

                steps: Array.isArray(componentData.steps)
                  ? componentData.steps
                  : [],
              },
            };

            console.log(
              " [PayrollHowItWorksSection TRANSFORM] Output data:",

              transformedPayrollHowItWorksData,
            );

            return transformedPayrollHowItWorksData;
          }
        }

        case "Hero":
        case "HeroSection": {
          if (showDebugInfo)
            console.log(" [Hero/HeroSection TRANSFORM] Input:", componentData);
          const baseData = componentData.data || componentData;

          // If slides exist, use them. Otherwise create one slide from flat props.
          let slides = baseData.slides;
          if (!slides || !Array.isArray(slides) || slides.length === 0) {
            slides = [
              {
                title: baseData.title || "Welcome",
                subtitle: baseData.subtitle || "",
                description: baseData.description || baseData.content || "",
                video:
                  baseData.video ||
                  baseData.backgroundVideo ||
                  "/Videos/implementation/homepage_hero.mp4",
              },
            ];
          }

          const transformedData = {
            slides,
            stats: baseData.stats || [],
            data: baseData,
          };

          if (showDebugInfo)
            console.log(" [Hero/HeroSection TRANSFORM] Output:", transformedData);
          return transformedData;
        }

        case "AboutTeam":
        case "AboutTeamSection": {
          console.log(" [AboutTeam TRANSFORM] Input:", componentData);
          const baseData = componentData.data || componentData;
          const members =
            baseData.members || baseData.items || baseData.teamMembers || [];

          return {
            teamMembers: members,
            data: {
              title: baseData.title || "Meet Our Team",
              description: baseData.description || "",
              members: members,
            },
          };
        }

        case "AboutHeroSection":
          return {
            title: componentData.title || "About Bellatrix",
            subtitle:
              componentData.subtitle ||
              "Your trusted partner in digital transformation",
            description: componentData.description || "",
            backgroundVideo:
              componentData.backgroundVideo || "/Videos/about-hero.mp4",
            backgroundImage: componentData.backgroundImage || "",
            ctaButtonText: componentData.ctaButtonText || "Discover Our Story",
            ctaButtonLink: componentData.ctaButtonLink || "/about",
            ctaButtonVariant: componentData.ctaButtonVariant || "primary",
            stats: componentData.stats || [],
          };

        case "AboutMissionSection": {
          console.log(
            " [AboutMissionSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedMissionData = {
            data: {
              title: componentData.title || "",

              subtitle: componentData.subtitle || "",

              description: componentData.description || "",

              vision: componentData.vision || "",

              additionalContent: componentData.additionalContent || "",

              image: componentData.image || "/images/ourProServices.png",

              imageAlt:
                componentData.imageAlt ||
                "About Bellatrix - Professional Services",

              stats: Array.isArray(componentData.stats)
                ? componentData.stats
                : [],

              missionPoints: Array.isArray(componentData.missionPoints)
                ? componentData.missionPoints
                : [],
            },
          };

          console.log(
            " [AboutMissionSection TRANSFORM] Output data:",

            transformedMissionData,
          );

          return transformedMissionData;
        }

        case "AboutJourneySection": {
          console.log(
            " [AboutJourneySection TRANSFORM] Input data:",
            componentData,
          );

          // AboutJourney component expects { data: { title, description, imageUrl, ... } }
          const transformedJourneyData = {
            data: {
              title: componentData.title || "Our Journey",
              description:
                componentData.description ||
                "From humble beginnings to becoming a trusted Bellatrix partner.",
              beginningTitle: componentData.beginningTitle || "The Beginning",
              beginningText: componentData.beginningText || "",
              growthTitle: componentData.growthTitle || "Growth & Evolution",
              growthText: componentData.growthText || "",
              todayTitle: componentData.todayTitle || "Today",
              todayText: componentData.todayText || "",
              imageUrl:
                componentData.imageUrl ||
                componentData.image ||
                "/images/solution.jpg",
              milestones: componentData.milestones || [],
              timeline: componentData.timeline || [],
            },
          };

          console.log(
            " [AboutJourneySection TRANSFORM] Output data:",
            transformedJourneyData,
          );
          return transformedJourneyData;
        }

        // Manufacturing Case Studies Section
        case "ManufacturingCaseStudiesSection":
        case "CaseStudiesSection": {
          console.log(
            " [ManufacturingCaseStudies TRANSFORM] Input:",
            componentData,
          );
          const baseData = componentData.data || componentData;
          const items = baseData.items || baseData.caseStudies || [];

          return {
            title: baseData.title || "Success Stories",
            description: baseData.description || "",
            items: items,
            caseStudies: items,
            data: {
              title: baseData.title || "Success Stories",
              description: baseData.description || "",
              items: items,
              caseStudies: items,
            },
          };
        }

        case "AboutValuesSection": {
          console.log(
            " [AboutValuesSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedValuesData = {
            values: componentData.items || [],

            data: {
              title: componentData.title || "Our Values",

              description:
                componentData.description ||
                "These core values guide everything we do and shape how we interact with our clients, partners, and each other.",
            },
          };

          console.log(
            " [AboutValuesSection TRANSFORM] Output data:",

            transformedValuesData,
          );

          return transformedValuesData;
        }

        // AboutJourneySection case already defined earlier in the switch at line ~163

        case "AboutMilestonesSection": {
          console.log(
            " [AboutMilestonesSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedMilestonesData = {
            milestones:
              componentData.milestones ||
              componentData.items ||
              [],

            data: {
              title: componentData.title || "Our Milestones",

              description:
                componentData.description ||
                "Key achievements and milestones that mark our journey of growth, innovation, and commitment to excellence.",
            },
          };

          console.log(
            " [AboutMilestonesSection TRANSFORM] Output data:",

            transformedMilestonesData,
          );

          return transformedMilestonesData;
        }

        case "AboutDifferentiatorsSection": {
          console.log(
            " [AboutDifferentiatorsSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedDifferentiatorsData = {
            differentiators: componentData.items || [],

            data: {
              title: componentData.title || "What Sets Us Apart",

              description:
                componentData.description ||
                "Our unique combination of expertise, methodology, and commitment to excellence makes us the preferred choice for Bellatrix implementations.",
            },
          };

          console.log(
            " [AboutDifferentiatorsSection TRANSFORM] Output data:",

            transformedDifferentiatorsData,
          );

          return transformedDifferentiatorsData;
        }

        // General Components

        case "PayrollHeroSection": {
          console.log(
            " [PayrollHeroSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedPayrollHeroData = {
            title: componentData.title || "Transform Your Payroll Process",

            subtitle:
              componentData.subtitle ||
              "Streamline operations with our intelligent, automated payroll system",

            description: componentData.description || "",

            ctaButton: {
              text: componentData.ctaButton?.text || "Get Started",
              link: null, // Force modal opening
              variant: componentData.ctaButton?.variant || "primary",
            },

            backgroundImage:
              componentData.backgroundImage || "/images/payrollFinal.jpeg",

            bgColor: componentData.bgColor || "",

            bgVideo: componentData.bgVideo || "",

            data: componentData,
          };

          console.log(
            " [PayrollHeroSection TRANSFORM] Output data:",

            transformedPayrollHeroData,
          );

          return transformedPayrollHeroData;
        }

        case "HRHeroSection": {
          console.log(" [HRHeroSection TRANSFORM] Input data:", componentData);

          const transformedHRHeroData = {
            // Direct props for component compatibility
            title:
              componentData.title || "Modern HR, Payroll & People Management",
            subtitle:
              componentData.subtitle ||
              "Automate HR, empower employees, and stay compliant—on one secure platform designed for the future of work.",
            bgVideo:
              componentData.bgVideo ||
              componentData.backgroundImage ||
              "/Videos/hrVideo.mp4",
            bgColor:
              componentData.bgColor ||
              "bg-gradient-to-br from-[#191970] via-black to-blue-700",
            // Nested structure for data prop
            data: {
              hero: {
                title:
                  componentData.title ||
                  "Modern HR, Payroll & People Management",
                subtitle:
                  componentData.subtitle ||
                  "Automate HR, empower employees, and stay compliant—on one secure platform designed for the future of work.",
                bgVideo:
                  componentData.bgVideo ||
                  componentData.backgroundImage ||
                  "/Videos/hrVideo.mp4",
                bgColor:
                  componentData.bgColor ||
                  "bg-gradient-to-br from-[#191970] via-black to-blue-700",
              },
            },
          };

          console.log(
            " [HRHeroSection TRANSFORM] Output data:",
            transformedHRHeroData,
          );

          return transformedHRHeroData;
        }

        // PayrollWorkflowSection case moved to line ~2502 for better organization with payroll components

        case "PayrollStepperSection": {
          console.log(
            " [PayrollStepperSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedPayrollStepperData = {
            steps: componentData.steps || [],

            title: componentData.title || "Payroll Process Steps",
          };

          console.log(
            " [PayrollStepperSection TRANSFORM] Output data:",

            transformedPayrollStepperData,
          );

          return transformedPayrollStepperData;
        }

        // PayrollPainPointsSection case moved to line ~2357 for better organization with payroll components

        case "PayrollFAQSection": {
          {
            console.log(
              " [PayrollFAQSection TRANSFORM] Input data:",

              componentData,
            );

            // Accept multiple possible shapes saved by the builder:

            // - items: [{ question, answer }]

            // - faqItems: [{ question, answer }]

            // - faq: { items: [...] }

            // Normalize each entry to { question, answer }

            const rawItems =
              componentData.items ||
              componentData.faqs ||
              componentData.faqItems ||
              componentData.data?.items ||
              componentData.data?.faqs ||
              componentData.data?.faqItems ||
              (componentData.faq &&
                (componentData.faq.items || componentData.faq.faqs)) ||
              [];

            const items = Array.isArray(rawItems)
              ? rawItems.map((it) => ({
                  question:
                    it.question || it.q || it.title || it.questionText || "",

                  answer:
                    it.answer ||
                    it.a ||
                    it.aText ||
                    it.answerText ||
                    it.description ||
                    "",
                }))
              : [];

            const transformedPayrollFAQData = {
              faqData: {
                title:
                  componentData.title ||
                  componentData.faq?.title ||
                  "Frequently Asked Questions",

                items,
              },
            };

            console.log(
              " [PayrollFAQSection TRANSFORM] Output data:",

              transformedPayrollFAQData,
            );

            return transformedPayrollFAQData;
          }
        }

        case "PayrollCTASection": {
          {
            console.log(
              " [PayrollCTASection TRANSFORM] Input data:",

              componentData,
            );

            // Normalize features into array of strings to avoid runtime errors

            const rawFeatures =
              componentData.features ||
              componentData.items ||
              componentData.data?.features ||
              componentData.data?.items ||
              [];

            const features = Array.isArray(rawFeatures)
              ? rawFeatures.map((f) => {
                  if (typeof f === "string") return f;

                  if (!f) return "";

                  // common object shapes: { title }, { text }, { description }

                  return f.title || f.text || f.description || String(f);
                })
              : typeof rawFeatures === "string"
                ? rawFeatures

                    .split(/[;\n,]+/)

                    .map((s) => s.trim())

                    .filter(Boolean)
                : [];

            const transformedPayrollCTAData = {
              title: componentData.title || "Ready to Transform Your Payroll?",

              subtitle:
                componentData.subtitle || "Let's discuss your payroll needs",

              description: componentData.description || "",

              features:
                features.length > 0
                  ? features
                  : [
                      "No setup fees",

                      "30-day money back guarantee",

                      "24/7 customer support",
                    ],

              trustedBy: componentData.trustedBy || [],

              ctaButton: {
                text: componentData.ctaButton?.text || "Get Started",
                link: null, // Force modal opening
                variant: componentData.ctaButton?.variant || "primary",
              },

              data: componentData,
            };

            console.log(
              " [PayrollCTASection TRANSFORM] Output data:",

              transformedPayrollCTAData,
            );

            return transformedPayrollCTAData;
          }
        }

        case "HRModulesSection": {
          console.log(
            " [HRModulesSection TRANSFORM] Input data:",

            componentData,
          );

          // Ensure all fields are passed and use correct keys

          const transformedHRModulesData = {
            data: {
              title: componentData.title || "Product Modules",

              description: componentData.description || "",

              modules: Array.isArray(componentData.modules)
                ? componentData.modules.map((mod) => ({
                    ...mod,

                    description:
                      mod.description || mod.desc || "Module description",
                  }))
                : [],
            },
          };

          console.log(
            " [HRModulesSection TRANSFORM] Output data:",

            transformedHRModulesData,
          );

          return transformedHRModulesData;
        }

        case "HRBenefitsSection": {
          console.log(
            " [HRBenefitsSection TRANSFORM] Input data:",
            componentData,
          );

          const transformedHRBenefitsData = {
            title: componentData.title || "Why Choose Our HR Solution?",
            description:
              componentData.description ||
              "Discover the key advantages that make our HR platform the smart choice for modern businesses of all sizes and industries.",
            ctaButton: componentData.ctaButton || {
              text: "Contact Us",
              link: "/contact",
            },
            features:
              componentData.features ||
              componentData.benefits ||
              componentData.items ||
              [],
          };

          console.log(
            " [HRBenefitsSection TRANSFORM] Output data:",
            transformedHRBenefitsData,
          );

          return transformedHRBenefitsData;
        }

        case "HRUseCasesSection": {
          console.log(
            " [HRUseCasesSection TRANSFORM] Input data:",

            componentData,
          );

          // Handle nested data structure - check both componentData and componentData.data
          const rawData = componentData.data || componentData;

          // Ensure all fields are passed and use correct keys
          const transformedHRUseCasesData = {
            data: {
              title: rawData.title || componentData.title || "Who Is It For?",

              description:
                rawData.description || componentData.description || "",

              useCases: Array.isArray(rawData.useCases)
                ? rawData.useCases.map((uc) => ({
                    ...uc,
                    description:
                      uc.description || uc.desc || "Use case description",
                  }))
                : Array.isArray(componentData.useCases)
                  ? componentData.useCases.map((uc) => ({
                      ...uc,
                      description:
                        uc.description || uc.desc || "Use case description",
                    }))
                  : Array.isArray(rawData.items)
                    ? rawData.items.map((uc) => ({
                        ...uc,
                        description:
                          uc.description || uc.desc || "Use case description",
                      }))
                    : [],
            },
          };

          console.log(
            " [HRUseCasesSection TRANSFORM] Output data:",

            transformedHRUseCasesData,
          );

          return transformedHRUseCasesData;
        }

        case "HRPricingSection": {
          console.log(
            " [HRPricingSection TRANSFORM] Input data:",

            componentData,
          );

          // Normalize incoming component data: support stringified contentJson, nested data, or direct pricing array

          const effectiveData = (() => {
            try {
              // If the component was saved with a stringified contentJson

              if (
                componentData &&
                typeof componentData.contentJson === "string"
              ) {
                const parsed = JSON.parse(componentData.contentJson || "{}");

                return { ...componentData, ...parsed };
              }

              // If componentData itself is a string (rare), try to parse it

              if (typeof componentData === "string") {
                return JSON.parse(componentData || "{}");
              }

              // If the saved structure wraps real payload under `data` or `pricing`

              if (componentData && componentData.data) {
                return { ...componentData, ...componentData.data };
              }

              return componentData || {};
            } catch (err) {
              console.warn(
                " [HRPricingSection] Failed to parse componentData:",

                err,

                componentData,
              );

              return componentData || {};
            }
          })();

          const transformedHRPricingData = {
            data: {
              title:
                effectiveData.title ||
                componentData.title ||
                "Implementation Pricing",

              description:
                effectiveData.description ||
                componentData.description ||
                "Choose the perfect implementation plan that fits your business needs and budget",

              pricing: effectiveData.pricing || [
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
                  ],

                  isPopular: true,
                },
              ],
            },
          };

          console.log(
            " [HRPricingSection TRANSFORM] Output data:",

            transformedHRPricingData,
          );

          return transformedHRPricingData;
        }

        case "HRFAQSection": {
          console.log(" [HRFAQSection TRANSFORM] Input data:", componentData);

          const rawItems =
            componentData.items ||
            componentData.faqs ||
            componentData.faqItems ||
            componentData.data?.items ||
            componentData.data?.faqs ||
            componentData.data?.faqItems ||
            componentData.faq?.items ||
            componentData.faq?.faqs ||
            [];

          let items = [];

          if (Array.isArray(rawItems) && rawItems.length > 0) {
            items = rawItems.map((f) => ({
              q: f.q || f.question || f.title || "",
              a: f.a || f.answer || f.description || "",
            }));
          } else {
            items = [
              {
                q: "What HR modules are included?",

                a: "Our HR solution includes employee management, payroll processing, benefits administration, and performance tracking modules.",
              },

              {
                q: "How long does implementation take?",

                a: "Typical implementation takes 4-8 weeks depending on your organization size and requirements.",
              },

              {
                q: "Is training provided?",

                a: "Yes, we provide comprehensive training for all users including administrators and end-users.",
              },
            ];
          }

          const transformedHRFAQData = {
            data: {
              faq: {
                items,

                title:
                  componentData.title ||
                  componentData.faq?.title ||
                  "Frequently Asked Questions",
              },

              faqItems: items,

              title:
                componentData.title ||
                componentData.faq?.title ||
                "Frequently Asked Questions",
            },
          };

          console.log(
            " [HRFAQSection TRANSFORM] Output data:",

            transformedHRFAQData,
          );

          return transformedHRFAQData;
        }

        // Landing Page Components

        case "ServicesSection": {
          console.log(
            " [ServicesSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedServicesData = {
            services: componentData.services || [],

            sectionHeader: componentData.sectionHeader || {},

            viewAllButton: componentData.viewAllButton || {},

            data: componentData,
          };

          console.log(
            " [ServicesSection TRANSFORM] Output data:",

            transformedServicesData,
          );

          return transformedServicesData;
        }

        case "Testimonials":
        case "TestimonialsSection": {
          const sourceTestimonials = Array.isArray(componentData.testimonials)
            ? componentData.testimonials
            : [];

          const transformedTestimonialsData = {
            testimonials: sourceTestimonials.map((item, index) => ({
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
              image: item.image || "",
              rating:
                typeof item.rating === "number" && !Number.isNaN(item.rating)
                  ? item.rating
                  : 5,
            })),
            sectionHeader: {
              ...(componentData.sectionHeader || {}),
              gradientText:
                componentData.sectionHeader?.gradientText ||
                componentData.sectionHeader?.title ||
                componentData.title ||
                "Trusted by Industry Leaders",
              subtitle:
                componentData.sectionHeader?.subtitle ||
                componentData.description ||
                componentData.subtitle ||
                "Don't just take our word for it—here's what our clients say.",
            },
            sideImage: componentData.sideImage || componentData.image || "",
            data: {
              ...componentData,
              sideImage: componentData.sideImage || componentData.image || "",
            },
          };

          return transformedTestimonialsData;
        }

        case "IndustriesSection": {
          console.log(
            " [IndustriesSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedIndustriesData = {
            industries: componentData.industries || [],

            sectionHeader: componentData.sectionHeader || {},

            data: componentData,
          };

          console.log(
            " [IndustriesSection TRANSFORM] Output data:",

            transformedIndustriesData,
          );

          return transformedIndustriesData;
        }

        // Services Components

        case "ImplementationHeroSection": {
          console.log(
            " [ImplementationHeroSection TRANSFORM] Input data:",
            componentData,
          );

          const transformedImplementationHeroData = {
            data: {
              backgroundVideo:
                componentData.backgroundVideo || "/Videos/HomeHeroSectionV.mp4",
              titleParts: componentData.titleParts ||
                componentData.title?.split(" ") || [
                  "Implementation",
                  "Services",
                ],
              description:
                componentData.description ||
                "We don't just implement solutions—we craft digital experiences that transform the way you do business",
              ctaButton: {
                text:
                  componentData.ctaButton?.text ||
                  componentData.ctaText ||
                  "Start Implementation",
                link: null,
                variant: "primary",
              },
            },
          };

          console.log(
            " [ImplementationHeroSection TRANSFORM] Output data:",
            transformedImplementationHeroData,
          );

          return transformedImplementationHeroData;
        }

        case "TrainingHeroSection": {
          console.log(
            " [TrainingHeroSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedTrainingHeroData = {
            heroContent: componentData.heroContent || {
              title: "Transform Your Career with Bellatrix Training",

              subtitle: "Professional ERP Education & Skills Development",

              description:
                "Master Bellatrix with comprehensive training programs designed for professionals at all levels.",
            },

            backgroundImage:
              componentData.backgroundImage || "/images/training.jpg",

            backgroundVideo: componentData.backgroundVideo || null,

            ctaButton: componentData.ctaButton || {
              text: "Start Learning",

              variant: "primary",
            },

            data: componentData,
          };

          console.log(
            " [TrainingHeroSection TRANSFORM] Output data:",

            transformedTrainingHeroData,
          );

          return transformedTrainingHeroData;
        }

        // Support both saved componentType aliases: "TrainingProgramsSection" and "ProgramsSection"

        case "TrainingProgramsSection":
        case "ProgramsSection": {
          console.log(
            " [TrainingProgramsSection/ProgramsSection TRANSFORM] Input data:",

            componentData,
          );

          // Normalize section metadata (programsSection) and the list of programs

          const section =
            componentData.programsSection ||
            componentData.data?.programsSection ||
            componentData.section ||
            {};

          // trainingPrograms may be provided in multiple shapes: { programs: [...] } or an array directly

          const rawPrograms =
            componentData.trainingPrograms?.programs ||
            componentData.trainingPrograms ||
            componentData.programs ||
            componentData.items ||
            [];

          const programs = Array.isArray(rawPrograms)
            ? rawPrograms
            : typeof rawPrograms === "string"
              ? rawPrograms

                  .split(/[;\n,]+/)

                  .map((s, i) => ({ id: i, title: s.trim() }))

                  .filter(Boolean)
              : [];

          const transformedProgramsData = {
            programsSection: {
              title:
                section.title ||
                componentData.title ||
                componentData.data?.title ||
                "Training Programs",

              description:
                section.description ||
                componentData.description ||
                componentData.data?.description ||
                "Comprehensive training programs to upskill your team.",

              image:
                section.image ||
                componentData.image ||
                componentData.data?.image ||
                "/images/training.jpg",

              Professional_Badge:
                section.Professional_Badge ||
                componentData.Professional_Badge ||
                "Professional",
            },

            trainingPrograms: {
              programs,
            },

            // helper props expected by the component

            openProgramModal:
              componentData.openProgramModal ||
              (() => console.log("Open program modal")),

            renderIcon: componentData.renderIcon || undefined,
          };

          console.log(
            " [TrainingProgramsSection/ProgramsSection TRANSFORM] Output data:",

            transformedProgramsData,
          );

          return transformedProgramsData;
        }

        // Key Modules Section (Training)

        case "TrainingKeyModulesSection":
        case "KeyModulesSection": {
          console.log(
            " [TrainingKeyModulesSection TRANSFORM] Input data:",

            componentData,
          );

          const section = componentData.keyModulesSection ||
            componentData.section || {
              title: componentData.title || "Key Training Modules",
              description:
                componentData.description ||
                componentData.content ||
                "Comprehensive curriculum designed to master NetSuite from foundation to advanced implementation",
            };

          const rawModules =
            componentData.keyModules ||
            componentData.modules ||
            componentData.items ||
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

          const transformedKeyModulesData = {
            keyModulesSection: section,
            keyModules,
            data: componentData,
          };

          console.log(
            " [TrainingKeyModulesSection TRANSFORM] Output data:",

            transformedKeyModulesData,
          );

          return transformedKeyModulesData;
        }

        // Why Choose Section (Training)

        case "TrainingWhyChooseSection":
        case "WhyChooseSection": {
          console.log(
            " [TrainingWhyChooseSection TRANSFORM] Input data:",

            componentData,
          );

          const baseData = componentData.data || componentData;
          const existingSection = baseData.whyChooseSection || {};

          // Merge existing section with safe defaults for every property
          const section = {
            title:
              existingSection.title ||
              baseData.title ||
              "Why Choose Our Training?",
            description:
              existingSection.description ||
              baseData.description ||
              baseData.content ||
              "Professional development excellence",
            image:
              existingSection.image ||
              baseData.image ||
              "/images/indleaders.jpg",
            Professional_Badge:
              existingSection.Professional_Badge ||
              existingSection.badge ||
              baseData.Professional_Badge ||
              baseData.badge ||
              "Excellence Training",
          };

          const rawFeatures =
            baseData.trainingFeatures ||
            baseData.features ||
            baseData.items ||
            [];

          const trainingFeatures = Array.isArray(rawFeatures)
            ? rawFeatures.map((f, i) => ({
                ...f,
                id: f.id || f.featureId || `feature-${i}`,
              }))
            : typeof rawFeatures === "string"
              ? rawFeatures

                  .split(/[;\n,]+/)

                  .map((s, i) => ({
                    id: `feature-${i}`,
                    title: s.trim(),
                    description: "",
                  }))

                  .filter((f) => f.title)
              : [];

          const transformedWhyChooseData = {
            whyChooseSection: section,
            trainingFeatures,
            openFeatureModal:
              baseData.openFeatureModal ||
              (() => console.log("Open feature modal")),
            data: baseData,
          };

          console.log(
            " [TrainingWhyChooseSection TRANSFORM] Output data:",

            transformedWhyChooseData,
          );

          return transformedWhyChooseData;
        }

        // Industries Components

        case "ManufacturingHeroSection": {
          console.log(
            " [ManufacturingHeroSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedManufacturingHeroData = {
            title: componentData.title || "Manufacturing Solutions",

            subtitle:
              componentData.subtitle ||
              "Streamline your manufacturing operations",

            description:
              componentData.description ||
              "Comprehensive NetSuite solutions for manufacturing businesses",

            backgroundImage:
              componentData.backgroundImage || "/images/manufacturing-hero.jpg",

            backgroundVideo: componentData.backgroundVideo || "",

            ctaButton: {
              text:
                componentData.ctaText ||
                componentData.ctaButton?.text ||
                "Learn More",

              link: null,

              variant: componentData.ctaButton?.variant || "primary",
            },

            data: componentData,
          };

          console.log(
            " [ManufacturingHeroSection TRANSFORM] Output data:",

            transformedManufacturingHeroData,
          );

          return transformedManufacturingHeroData;
        }

        case "RetailHeroSection": {
          console.log(
            " [RetailHeroSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedRetailHeroData = {
            title: componentData.title || "Retail Solutions",

            subtitle:
              componentData.subtitle || "Transform your retail operations",

            description:
              componentData.description ||
              "Comprehensive NetSuite solutions for retail businesses",

            backgroundImage: componentData.backgroundImage || "",

            ctaText: componentData.ctaText || "Request Info",

            ctaLink: componentData.ctaLink || "/contact",
          };

          console.log(
            " [RetailHeroSection TRANSFORM] Output data:",

            transformedRetailHeroData,
          );

          return transformedRetailHeroData;
        }

        // Implementation Service Components

        case "ImplementationProcessSection": {
          console.log(
            " [ImplementationProcessSection TRANSFORM] Input data:",
            componentData,
          );

          const transformedData = {
            title: componentData.title || "Implementation Process",
            subtitle:
              componentData.subtitle ||
              "A proven methodology for seamless business transformation",
            image:
              componentData.image ||
              "/Videos/implementation/implementProcess.jpg",
            steps: componentData.steps || [],
            ctaButton: componentData.ctaButton || "Start Your Journey",
          };

          console.log(
            " [ImplementationProcessSection TRANSFORM] Output data:",
            transformedData,
          );

          return transformedData;
        }

        case "ImplementationWhyChooseSection": {
          console.log(
            " [ImplementationWhyChooseSection TRANSFORM] Input data:",

            componentData,
          );

          // Normalize features/benefits into `data.features` as array of objects

          const rawFeatures =
            componentData.features ||
            componentData.items ||
            componentData.benefits ||
            [];

          const normalizedFeatures = (() => {
            if (Array.isArray(rawFeatures)) {
              return rawFeatures.map((f, idx) => {
                if (!f) return { number: idx + 1, title: "", description: "" };

                if (typeof f === "string") {
                  return { number: idx + 1, title: f, description: "" };
                }

                return {
                  number: f.number || f.id || idx + 1,

                  title: f.title || f.name || f.heading || "",

                  description: f.description || f.desc || f.subtitle || "",

                  icon: f.icon || f.iconName || f.iconClass || undefined,
                };
              });
            }

            if (typeof rawFeatures === "string") {
              return rawFeatures

                .split(/[;,\n]+/)

                .map((s, i) => ({
                  number: i + 1,

                  title: s.trim(),

                  description: "",
                }))

                .filter((x) => x.title);
            }

            return [];
          })();

          const transformedData = {
            title:
              componentData.title ||
              componentData.data?.title ||
              "Why Choose Bellatrix for Implementation?",
            subtitle:
              componentData.subtitle ||
              componentData.data?.subtitle ||
              "We bring years of expertise, proven methodologies, and cutting-edge solutions to ensure your implementation success",
            image:
              componentData.image ||
              componentData.data?.image ||
              "/Videos/implementation/whyChoese.jpg",
            features: normalizedFeatures,
          };

          console.log(
            " [ImplementationWhyChooseSection TRANSFORM] Output data:",
            transformedData,
          );

          return transformedData;
        }

        case "ImplementationPricingSection": {
          console.log(
            " [ImplementationPricingSection TRANSFORM] Input data:",
            componentData,
          );

          // Normalize plans and ensure each plan.features is an array
          const rawPlans = componentData.plans || [];
          const normalizedPlans = Array.isArray(rawPlans)
            ? rawPlans.map((p) => {
                const plan = { ...(p || {}) };
                let features = plan.features;
                // If features is a comma/semicolon/newline separated string, split it
                if (typeof features === "string") {
                  features = features
                    .split(/[;,\n]+/)
                    .map((s) => s.trim())
                    .filter(Boolean);
                }
                // Ensure features is an array
                if (!Array.isArray(features)) {
                  features = [];
                }
                return { ...plan, features };
              })
            : [];

          const transformedData = {
            title: componentData.title || "Implementation Pricing",
            subtitle:
              componentData.subtitle ||
              "Choose the perfect implementation plan that fits your business needs and budget",
            plans: normalizedPlans,
            additionalInfo: componentData.additionalInfo || {},
          };

          console.log(
            " [ImplementationPricingSection TRANSFORM] Output data:",
            transformedData,
          );

          return transformedData;
        }

        case "ServiceGrid":
        case "ServiceGridSection": {
          if (showDebugInfo)
            console.log(" [ServiceGrid TRANSFORM] Input data:", componentData);

          // Normalize to { data: { services: [...] , title, subtitle } }

          const services =
            Array.isArray(componentData.services) &&
            componentData.services.length
              ? componentData.services
              : componentData.data?.services || componentData.items || [];

          const normalizedServices = services.map((s) => {
            // If a service features field is a string, split into array

            const featuresRaw = s?.features || s?.items || [];

            let features = featuresRaw;

            if (typeof featuresRaw === "string") {
              features = featuresRaw

                .split(/[;,\n]+/)

                .map((x) => x.trim())

                .filter(Boolean);
            }

            return {
              title: s?.title || s?.name || "Service",

              description: s?.description || s?.desc || "",

              icon: s?.icon || "",

              features: Array.isArray(features) ? features : [],
            };
          });

          const transformedData = {
            data: {
              services: normalizedServices,

              title:
                componentData.title ||
                componentData.data?.title ||
                "Our Services",

              subtitle:
                componentData.subtitle ||
                componentData.data?.subtitle ||
                "Comprehensive NetSuite solutions to drive your business forward",
            },
          };

          if (showDebugInfo)
            console.log(" [ServiceGrid TRANSFORM] Output data:", transformedData);

          return transformedData;
        }

        // Manufacturing Industry Components

        case "ManufacturingSolutionsSection": {
          console.log(
            " [ManufacturingSolutionsSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedData = {
            title: componentData.title || "NetSuite Manufacturing Solutions",

            subtitle:
              componentData.subtitle ||
              "Comprehensive ERP solutions for manufacturers",

            description:
              componentData.description ||
              "Our NetSuite solutions are specifically designed to address manufacturing challenges and streamline your operations.",

            solutions: componentData.solutions ||
              componentData.items || [
                {
                  title: "Production Management",

                  description: "End-to-end production planning and execution",

                  features: ["Work orders", "Routing", "Capacity planning"],

                  benefits: "40% improvement in production efficiency",
                },

                {
                  title: "Inventory Control",

                  description: "Advanced inventory management capabilities",

                  features: [
                    "Multi-location",

                    "Serial tracking",

                    "Cycle counting",
                  ],

                  benefits: "30% reduction in inventory costs",
                },

                {
                  title: "Quality Assurance",

                  description: "Comprehensive quality control systems",

                  features: [
                    "Quality gates",

                    "Defect tracking",

                    "Compliance reporting",
                  ],

                  benefits: "99.5% quality achievement rate",
                },
              ],

            image:
              componentData.image ||
              "https://i.pinimg.com/1200x/19/e6/91/19e6918482b92f0f7e31e68d376bf711.jpg",
          };

          console.log(
            " [ManufacturingSolutionsSection TRANSFORM] Output data:",

            transformedData,
          );

          return transformedData;
        }

        case "ManufacturingChallengesSection": {
          console.log(
            " [ManufacturingChallengesSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedData = {
            title: componentData.title || "Manufacturing Challenges",

            subtitle: componentData.subtitle || "Common pain points we solve",

            description:
              componentData.description ||
              "We understand the unique challenges manufacturers face and provide targeted solutions.",

            challenges: componentData.challenges ||
              componentData.items || [
                {
                  title: "Complex Production Planning",

                  description:
                    "Difficulty in coordinating multiple production lines and resources",

                  icon: "",
                  impact: "High",
                },

                {
                  title: "Inventory Management",

                  description:
                    "Challenges in tracking inventory across multiple locations",

                  icon: "",
                  impact: "High",
                },
              ],

            image:
              componentData.image ||
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          };

          console.log(
            " [ManufacturingChallengesSection TRANSFORM] Output data:",

            transformedData,
          );

          return transformedData;
        }

        case "ManufacturingIndustryStats": {
          console.log(
            " [ManufacturingIndustryStats TRANSFORM] Input data:",

            componentData,
          );

          const transformedData = {
            title: componentData.title || "Manufacturing Industry Statistics",

            subtitle: componentData.subtitle || "Key industry metrics",

            description:
              componentData.description ||
              "Key metrics that demonstrate our manufacturing excellence",

            stats: componentData.stats ||
              componentData.items || [
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
          };

          console.log(
            " [ManufacturingIndustryStats TRANSFORM] Output data:",

            transformedData,
          );

          return transformedData;
        }

        case "ManufacturingImplementationProcess": {
          console.log(
            " [ManufacturingImplementationProcess TRANSFORM] Input data:",

            componentData,
          );

          const transformedData = {
            processSteps: componentData.processSteps ||
              componentData.data?.processSteps ||
              componentData.steps ||
              componentData.data?.steps ||
              componentData.items || [
                {
                  title: "Analysis",

                  description: "Analyze current processes",

                  step: "01",
                },

                {
                  title: "Design",

                  description: "Design new processes",

                  step: "02",
                },

                {
                  title: "Implementation",

                  description: "Implement new processes",

                  step: "03",
                },

                { title: "Training", description: "Train users", step: "04" },
              ],

            title:
              componentData.title ||
              componentData.data?.title ||
              "Manufacturing Implementation Built for All Industries",

            subtitle:
              componentData.subtitle ||
              componentData.data?.subtitle ||
              "A proven methodology for manufacturing implementations",

            description:
              componentData.description ||
              componentData.data?.description ||
              "Streamline your entire NetSuite implementation lifecycle — from discovery to go-live — with a proven, secure methodology.",
          };

          console.log(
            " [ManufacturingImplementationProcess TRANSFORM] Output data:",

            transformedData,
          );

          return transformedData;
        }

        case "ManufacturingCaseStudies": {
          console.log(
            " [ManufacturingCaseStudies TRANSFORM] Input data:",

            componentData,
          );

          const transformedData = {
            title: componentData.title || "Manufacturing Success Stories",

            description:
              componentData.description ||
              "See how we've helped manufacturing companies transform their operations with NetSuite solutions.",

            items: componentData.items ||
              componentData.caseStudies || [
                {
                  title: "Automotive Parts Manufacturer",

                  company: "ABC Motors",

                  industry: "Automotive",

                  challenge: "Complex multi-location inventory management",

                  solution: "NetSuite Advanced Manufacturing with WMS",

                  results: ["40% reduction in inventory carrying costs"],

                  timeline: "6 months",

                  image: "/images/case-study-1.jpg",
                },

                {
                  title: "Electronics Manufacturer",

                  company: "TechCorp",

                  industry: "Electronics",

                  challenge: "Manual production planning and scheduling",

                  solution:
                    "NetSuite Manufacturing Edition with custom workflows",

                  results: ["60% improvement in on-time delivery"],

                  timeline: "4 months",

                  image: "/images/case-study-2.jpg",
                },

                {
                  title: "Food & Beverage Producer",

                  company: "FreshFoods Inc",

                  industry: "Food & Beverage",

                  challenge: "Quality control and compliance tracking",

                  solution: "NetSuite Quality Management Suite",

                  results: ["99.5% quality achievement rate"],

                  timeline: "3 months",

                  image: "/images/case-study-3.jpg",
                },
              ],
          };

          console.log(
            " [ManufacturingCaseStudies TRANSFORM] Output data:",

            transformedData,
          );

          console.log(
            " [ManufacturingCaseStudies DEBUG] Title/Description:",

            {
              inputTitle: componentData.title,

              inputDescription: componentData.description,

              outputTitle: transformedData.title,

              outputDescription: transformedData.description,
            },
          );

          return transformedData;
        }

        case "RetailFeaturesSection": {
          console.log(
            " [RetailFeaturesSection TRANSFORM] Input data:",
            componentData,
          );

          let rawFeatures =
            componentData.retailFeatures ||
            componentData.features ||
            componentData.items ||
            componentData.data?.retailFeatures ||
            componentData.data?.features ||
            componentData.data?.items ||
            [];

          if (!Array.isArray(rawFeatures)) rawFeatures = [];

          const retailFeatures = rawFeatures.map((f, idx) => {
            let benefits = f.benefits;
            if (typeof benefits === "string") {
              benefits = benefits
                .split(",")
                .map((b) => b.trim())
                .filter((b) => b);
            }
            return {
              id: f.id || `feature-${idx + 1}`,
              title: f.title || "",
              description: f.description || "",
              icon: f.icon || "",
              benefits: Array.isArray(benefits) ? benefits : [],
            };
          });

          const transformedData = {
            data: {
              title: componentData.title || "Retail Features",
              subtitle: componentData.subtitle || "Comprehensive features",
              retailFeatures,
            },
          };
          return transformedData;
        }

        case "RetailSolutionsSection": {
          console.log(
            " [RetailSolutionsSection TRANSFORM] Input data:",
            componentData,
          );

          const rawSolutions =
            componentData.netSuiteSolutions ||
            componentData.solutions ||
            componentData.items ||
            componentData.data?.netSuiteSolutions ||
            componentData.data?.solutions ||
            [];

          const netSuiteSolutions = Array.isArray(rawSolutions)
            ? rawSolutions.map((sol) => {
                let features = sol.features;
                if (typeof features === "string") {
                  features = features.split(",").map((f) => f.trim()).filter((f) => f);
                }
                return {
                  title:       sol.title       || "",
                  description: sol.description || "",
                  icon:        sol.icon        || "",
                  features:    Array.isArray(features) ? features : [],
                  benefits:    sol.benefits    || "",
                };
              })
            : [];

          const transformedData = {
            title:       componentData.title       || "NetSuite Solutions",
            subtitle:    componentData.subtitle    || "Comprehensive Retail Solutions",
            description: componentData.description || "Comprehensive retail solutions that unify your commerce operations.",
            image:       componentData.image       || "https://i.pinimg.com/736x/5d/33/74/5d33743cd85ff60ff425a2614a87503f.jpg",
            netSuiteSolutions: netSuiteSolutions.length > 0 ? netSuiteSolutions : [
              {
                title: "E-commerce Platform",
                description: "Complete e-commerce solution with NetSuite integration",
                icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
                features: ["Online store", "Payment processing", "Order management"],
                benefits: "50% increase in online sales",
              },
              {
                title: "Inventory Management",
                description: "Advanced inventory control and tracking",
                icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                features: ["Real-time tracking", "Multi-location", "Automated reordering"],
                benefits: "30% reduction in stockouts",
              },
            ],
          };

          console.log(
            " [RetailSolutionsSection TRANSFORM] Output data:",

            transformedData,
          );

          return transformedData;
        }

        case "RetailChallengesSection": {
          console.log(
            " [RetailChallengesSection TRANSFORM] Input data:",
            componentData,
          );

          const rawChallenges =
            componentData.retailChallenges ||
            componentData.challenges ||
            componentData.items ||
            componentData.data?.retailChallenges ||
            componentData.data?.challenges ||
            [];

          const retailChallenges = (Array.isArray(rawChallenges) ? rawChallenges : []).map((c) => ({
            title:       c.title       || "",
            description: c.description || "",
            icon:        c.icon        || "",
            impact:      c.impact      || "High",
          }));

          const transformedData = {
            title:       componentData.title       || "Retail Challenges",
            subtitle:    componentData.subtitle    || "Understanding Modern Retail Obstacles",
            description: componentData.description || "Modern retail faces complex challenges that require integrated solutions.",
            image:       componentData.image       || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            retailChallenges,
          };

          console.log(
            " [RetailChallengesSection TRANSFORM] Output data:",
            transformedData,
          );

          return transformedData;
        }

        case "RetailCaseStudies": {
          console.log(
            " [RetailCaseStudies TRANSFORM] Input data:",

            componentData,
          );

          const transformedData = {
            title: componentData.title || "Retail Success Stories",

            description:
              componentData.description || "See how we've helped others",

            caseStudies: componentData.caseStudies || componentData.items || [],
          };

          console.log(
            " [RetailCaseStudies TRANSFORM] Output data:",

            transformedData,
          );

          return transformedData;
        }

        case "RetailCaseStudiesSection": {
          console.log(
            " [RetailCaseStudiesSection TRANSFORM] Input data:",

            componentData,
          );

          const transformedData = {
            title: componentData.title || "Retail Success Stories",

            description:
              componentData.description || "See how we've helped others",

            caseStudies: componentData.caseStudies || componentData.items || [],
          };

          console.log(
            " [RetailCaseStudiesSection TRANSFORM] Output data:",

            transformedData,
          );

          return transformedData;
        }

        case "RetailIndustryStats": {
          console.log(
            " [RetailIndustryStats TRANSFORM] Input data:",

            componentData,
          );

          const transformedData = {
            title: componentData.title || "Retail Industry Statistics",

            subtitle: componentData.subtitle || "The state of retail today",

            description:
              componentData.description ||
              "Key metrics that demonstrate our retail excellence",

            stats: componentData.stats || componentData.items || [],
          };

          console.log(
            " [RetailIndustryStats TRANSFORM] Output data:",

            transformedData,
          );

          return transformedData;
        }

        case "CtaSection":
        case "ImplementationCtaSection":
        case "AboutCTASection":
        case "HRCTASection":
        case "ManufacturingCTASection":
        case "CustomizationCTASection":
        case "RetailCTASection": {
          console.log(
            " [GenericCTASection TRANSFORM] Input data:",
            componentData,
          );

          const baseData = componentData.data || componentData;

          const features =
            baseData.features ||
            baseData.items ||
            componentData.features ||
            componentData.items ||
            [];

          // Button logic: check multiple sources
          const btnText =
            baseData.buttonText ||
            baseData.ctaButton?.text ||
            (typeof baseData.ctaButton === "string"
              ? baseData.ctaButton
              : null) ||
            componentData.buttonText ||
            componentData.ctaButton?.text ||
            "Get Started";

          const transformedData = {
            title:
              baseData.title || componentData.title || "Ready to Transform?",
            subtitle:
              baseData.subtitle ||
              componentData.subtitle ||
              "Let's discuss your needs",
            description:
              baseData.description ||
              componentData.description ||
              "Join hundreds of companies that have unified their operations. Get started with a free consultation today.",
            features: features,
            ctaButton: {
              text: btnText,
              link: baseData.ctaButton?.link || baseData.buttonLink || null, // Force modal opening usually
              variant:
                baseData.ctaButton?.variant ||
                componentData.ctaButton?.variant ||
                "primary",
            },
            // Pass through any other props just in case
            ...baseData,
          };

          console.log(
            " [GenericCTASection TRANSFORM] Output data:",
            transformedData,
          );

          return transformedData;
        }

        case "CTAButton": {
          console.log(" [CTAButton TRANSFORM] Input data:", componentData);

          const transformedData = {
            text: componentData.text || "Click Here",

            variant: componentData.variant || "primary",

            icon: componentData.icon || "",

            onClick: componentData.onClick || (() => {}),
          };

          console.log(" [CTAButton TRANSFORM] Output data:", transformedData);

          return transformedData;
        }

        case "PayrollWorkflowSection": {
          console.log(
            " [PayrollWorkflowSection TRANSFORM] Input data:",
            componentData,
          );

          // Extract steps from various possible field names
          const stepsArray =
            componentData.workflowSteps ||
            componentData.steps ||
            componentData.workflow?.steps ||
            [];

          // Process steps — support all field-name variants
          const processedSteps = stepsArray.map((step, index) => {
            const description = step.description || step.stepDescription || step.desc || "";
            let features = step.features;
            if (!features || (Array.isArray(features) && features.length === 0)) {
              features = step.benefits;
            }
            if (typeof features === "string") {
              features = features.split(",").map((f) => f.trim()).filter(Boolean);
            }
            if (!Array.isArray(features)) features = [];
            return {
              title:           step.title           || step.stepTitle || `Step ${index + 1}`,
              stepTitle:       step.stepTitle       || step.title     || `Step ${index + 1}`,
              description,
              stepDescription: step.stepDescription || description,
              details:         step.details         || "",
              features,
              automated:       step.automated       || "",
              compliant:       step.compliant       || "",
              automatedLabel:  step.automatedLabel  || "Automated",
              compliantLabel:  step.compliantLabel  || "Compliant",
            };
          });

          // Build workflowData object that component expects
          const transformedData = {
            workflowData: {
              title:
                componentData.title ||
                "Payroll System Built for All Industries",
              description:
                componentData.description ||
                "Streamline your entire payroll lifecycle",
              steps: processedSteps,
            },
          };

          console.log(
            " [PayrollWorkflowSection TRANSFORM] Output data:",
            transformedData,
          );
          return transformedData;
        }

        // AboutMissionSection case already defined earlier in the switch at line ~121

        case "PayrollPainPointsSection": {
          console.log(
            " [PayrollPainPointsSection TRANSFORM] Input data:",
            componentData,
          );

          const painPointsArray =
            componentData.painPoints?.painPoints ||
            componentData.painPoints?.items ||
            (Array.isArray(componentData.painPoints)
              ? componentData.painPoints
              : null) ||
            componentData.items ||
            [];

          const transformedData = {
            painPoints: {
              title:
                componentData.title ||
                componentData.painPoints?.title ||
                "Common Payroll Pain Points",
              description:
                componentData.description ||
                componentData.painPoints?.description ||
                "Problems we solve",
              painPoints: painPointsArray,
              image:
                componentData.image || componentData.painPoints?.image || "",
            },
          };

          console.log(
            " [PayrollPainPointsSection TRANSFORM] Output data:",
            transformedData,
          );
          return transformedData;
        }

        case "SolutionsGallery": {
          const solutions = Array.isArray(componentData.solutions)
            ? componentData.solutions
            : [];
          return {
            title: componentData.title || "",
            subtitle: componentData.subtitle || "",
            ctaButtonText: componentData.ctaButtonText || "",
            solutions: solutions.map((s) => ({
              id: s.id || s.title?.toLowerCase().replace(/\s+/g, "-") || "",
              title: s.title || "",
              subtitle: s.subtitle || "",
              category: s.category || "",
              description: s.description || "",
              image: s.image || "",
              href: s.href || "",
              accentColor: s.accentColor || "#6366f1",
              featured: !!s.featured,
              features: Array.isArray(s.features) ? s.features : [],
            })),
          };
        }

        default:
          // Generic prop structure for unknown components
          console.log(" [DEFAULT TRANSFORM] Input data:", componentData);
          return componentData;
      }
    } catch (error) {
      console.error(`Error transforming props for ${componentType}:`, error);

      setError(`Failed to transform component props: ${error.message}`);

      return {};
    }
  }, [componentType, componentDataString, componentData]);

  // Get component from registry with tolerant alias resolution

  const resolveComponentFromRegistry = (type) => {
    // direct match

    if (componentRegistry[type]) return componentRegistry[type];

    // common alias fixes

    const candidates = [];

    // normalize CTA casing differences

    candidates.push(type.replace(/CTA/g, "Cta"));

    candidates.push(type.replace(/Cta/g, "CTA"));

    // strip trailing 'Section'

    candidates.push(type.replace(/Section$/, ""));

    // try singular/plural fallback

    candidates.push(type.replace(/sSection$/, "Section"));

    // lowercase key

    candidates.push(type.charAt(0).toUpperCase() + type.slice(1));

    for (const c of candidates) {
      if (componentRegistry[c]) return componentRegistry[c];
    }

    return null;
  };

  const Component = resolveComponentFromRegistry(componentType);

  // Error boundary wrapper

  // ErrorBoundaryWrapper is now imported from ./LivePreview/ErrorBoundaryWrapper

  if (!Component) {
    return <ComponentNotFound componentType={componentType} />;
  }

  if (error) {
    return <PreviewError error={error} componentType={componentType} />;
  }

  return (
    <div className={`component-preview ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${componentType}-${componentDataString}`}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isVisible ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
          style={{
            filter: isVisible ? "none" : "grayscale(50%)",
          }}
        >
          <ErrorBoundaryWrapper
            componentType={componentType}
            componentData={componentData}
          >
            {/* Wrap component in section with theme attribute for proper styling */}

            <section data-theme={theme === 1 ? "light" : "dark"}>
              <Component {...transformedProps} />
            </section>
          </ErrorBoundaryWrapper>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/**

 * Live Preview Container

 * Handles multiple component previews with real-time updates

 */

const LivePreview = ({
  components = [],

  previewMode = "desktop",

  showDebugInfo = false,

  className = "",
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter visible components

  const visibleComponents = components.filter(
    (component) => component.isVisible === true || component.isVisible === 1,
  );

  if (showDebugInfo) {
    console.log(" [LIVE PREVIEW] Received components:", {
      total: components.length,
      visible: visibleComponents.length,
      hidden: components.length - visibleComponents.length,
      components: components.map((c) => ({
        type: c.componentType,
        hasContentJson: !!c.contentJson,
        contentJsonLength: c.contentJson?.length || 0,
        isVisible: c.isVisible,
      })),
    });
  }

  // Only reload preview when contentJson (inputs data) changes

  const contentJsonString = useMemo(() => {
    return components.map((comp) => comp.contentJson).join("|");
  }, [components]);

  useEffect(() => {
    // Only reload when contentJson changes (inputs data)

    const timeout = setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
    }, 80);

    return () => clearTimeout(timeout);
  }, [contentJsonString]);

  const previewClasses = {
    desktop: "max-w-none",

    tablet: "max-w-4xl mx-auto",

    mobile: "max-w-sm mx-auto",
  };

  return (
    <Card
      className={`bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl ${className}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-xl font-bold flex items-center space-x-2">
            <EyeIcon className="h-5 w-5" />

            <span>Live Preview</span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {previewMode.charAt(0).toUpperCase() + previewMode.slice(1)} View
            </span>

            <span className="text-xs text-gray-500">
              ({components.length} component{components.length !== 1 ? "s" : ""}
              )
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div
          className={`bg-white dark:bg-gray-900 rounded-lg min-h-[400px] ${previewClasses[previewMode]}`}
        >
          {visibleComponents.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <EyeIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />

                <p className="text-lg font-medium">No components to preview</p>

                <p className="text-sm">Add components to see them here</p>
              </div>
            </div>
          ) : (
            <div key={refreshKey} className="space-y-0">
              {visibleComponents.map((component, index) => {
                // Enhanced real-time data extraction

                const extractComponentData = (component) => {
                  if (showDebugInfo) {
                    console.log(" [REALTIME EXTRACTION] Component data:", {
                      componentType: component.componentType,
                      contentJson: component.contentJson,
                      hasContentJson: !!component.contentJson,
                      contentJsonType: typeof component.contentJson,
                      contentJsonLength: component.contentJson?.length || 0,
                    });
                  }

                  let rawData = {};

                  // Always use the latest content from form.

                  // Accept both stringified JSON (contentJson) and already-parsed objects

                  // Also fall back to `content` field when available.

                  if (component.contentJson) {
                    if (typeof component.contentJson === "string") {
                      try {
                        rawData = JSON.parse(component.contentJson);

                        if (showDebugInfo) {
                          console.log(
                            " [REALTIME EXTRACTION] Parsed contentJson string for",
                            component.componentType,
                            ":",
                            rawData,
                          );
                        }
                      } catch (err) {
                        console.error(
                          " [REALTIME EXTRACTION] JSON parse error for contentJson:",

                          err,
                        );

                        rawData = {};
                      }
                    } else if (typeof component.contentJson === "object") {
                      // contentJson already parsed by other parts of the app

                      rawData = component.contentJson;

                      console.log(
                        "ℹ [REALTIME EXTRACTION] Using parsed contentJson object for",

                        component.componentType,

                        ":",

                        rawData,
                      );
                    } else {
                      console.warn(
                        " [REALTIME EXTRACTION] Unsupported contentJson type for",

                        component.componentType,

                        typeof component.contentJson,
                      );
                    }
                  } else if (component.content) {
                    // Some code paths use `content` instead of contentJson

                    if (typeof component.content === "string") {
                      try {
                        rawData = JSON.parse(component.content);

                        console.log(
                          " [REALTIME EXTRACTION] Parsed content string fallback for",

                          component.componentType,

                          ":",

                          rawData,
                        );
                      } catch (err) {
                        console.error(
                          " [REALTIME EXTRACTION] JSON parse error for content fallback:",

                          err,
                        );

                        rawData = {};
                      }
                    } else if (typeof component.content === "object") {
                      rawData = component.content;

                      console.log(
                        "ℹ [REALTIME EXTRACTION] Using content object fallback for",

                        component.componentType,

                        ":",

                        rawData,
                      );
                    }
                  } else {
                    console.warn(
                      " [REALTIME EXTRACTION] No contentJson or content found for",

                      component.componentType,
                    );
                  }

                  // Enhanced debugging for AboutMissionSection

                  if (component.componentType === "AboutMissionSection") {
                    console.log(
                      " [AboutMissionSection EXTRACTION] Debug data:",

                      {
                        rawContentJson: component.contentJson,

                        parsedData: rawData,

                        fieldAnalysis: {
                          hasTitle: !!rawData.title,

                          hasSubtitle: !!rawData.subtitle,

                          hasDescription: !!rawData.description,

                          hasVision: !!rawData.vision,

                          hasAdditionalContent: !!rawData.additionalContent,

                          hasImage: !!rawData.image,

                          hasStats: Array.isArray(rawData.stats),

                          statsCount: rawData.stats?.length || 0,

                          hasMissionPoints: Array.isArray(
                            rawData.missionPoints,
                          ),

                          missionPointsCount:
                            rawData.missionPoints?.length || 0,
                        },

                        timestamp: new Date().toISOString(),
                      },
                    );
                  }

                  // Enhanced debugging for AboutJourneySection
                  if (component.componentType === "AboutJourneySection") {
                    console.log(
                      " [AboutJourneySection EXTRACTION] Debug data:",
                      {
                        rawContentJson: component.contentJson,
                        parsedData: rawData,
                        fieldAnalysis: {
                          hasTitle: !!rawData.title,
                          hasDescription: !!rawData.description,
                          hasBeginningTitle: !!rawData.beginningTitle,
                          hasBeginningText: !!rawData.beginningText,
                          hasGrowthTitle: !!rawData.growthTitle,
                          hasGrowthText: !!rawData.growthText,
                          hasTodayTitle: !!rawData.todayTitle,
                          hasTodayText: !!rawData.todayText,
                          hasImageUrl: !!rawData.imageUrl,
                          hasImage: !!rawData.image,
                        },
                        timestamp: new Date().toISOString(),
                      },
                    );
                  }

                  // Merge top-level component fields (some parts of the app

                  // update fields directly on the component instead of

                  // serializing them into `contentJson`). This ensures the

                  // live preview sees edits whether they're saved to

                  // `contentJson` or to top-level props like `caseStudies`.

                  const mergedData = {
                    ...rawData,

                    // top-level simple fields

                    ...(component.title ? { title: component.title } : {}),

                    ...(component.subtitle
                      ? { subtitle: component.subtitle }
                      : {}),

                    ...(component.description
                      ? { description: component.description }
                      : {}),

                    // common list keys used by case studies / lists

                    ...(component.caseStudies
                      ? { caseStudies: component.caseStudies }
                      : {}),

                    ...(component.items ? { items: component.items } : {}),

                    ...(component.data && typeof component.data === "object"
                      ? component.data
                      : {}),
                  };

                  if (
                    Object.keys(mergedData).length !==
                    Object.keys(rawData).length
                  ) {
                    console.log(
                      " [REALTIME EXTRACTION] Merged top-level component fields for",

                      component.componentType,

                      {
                        rawKeys: Object.keys(rawData),

                        mergedKeys: Object.keys(mergedData),
                      },
                    );
                  }

                  return mergedData;
                };

                let componentData = extractComponentData(component);

                // Debug logging for all About components

                if (component.componentType?.includes("About")) {
                  console.log(
                    ` [LIVE PREVIEW] Rendering ${component.componentType}:`,

                    {
                      componentIndex: index,

                      hasContentJson: !!component.contentJson,

                      contentJsonLength: component.contentJson?.length || 0,

                      parsedData: componentData,

                      extractedKeys: Object.keys(componentData),

                      timestamp: new Date().toISOString(),
                    },
                  );
                }

                return (
                  <div
                    key={`${component.id || index}-${
                      component.componentType
                    }-${refreshKey}-${component.contentJson?.slice(0, 50)}`}
                    className="relative"
                  >
                    {showDebugInfo && (
                      <div className="absolute top-2 right-2 z-10 bg-black/70 text-white text-xs p-2 rounded max-w-xs">
                        <div>
                          <strong>Type:</strong> {component.componentType}
                        </div>

                        <div>
                          <strong>Theme:</strong>{" "}
                          {component.theme === 1 ? "Light" : "Dark"}
                        </div>

                        <div>
                          <strong>Visible:</strong>{" "}
                          {component.isVisible ? "Yes" : "No"}
                        </div>

                        <div>
                          <strong>Order:</strong>{" "}
                          {component.orderIndex || index + 1}
                        </div>

                        <div>
                          <strong>Data Keys:</strong>{" "}
                          {Object.keys(componentData).join(", ")}
                        </div>
                      </div>
                    )}

                    <ComponentPreview
                      componentType={component.componentType}
                      componentData={componentData}
                      theme={component.theme}
                      isVisible={component.isVisible}
                      key={`preview-${
                        component.id || index
                      }-${refreshKey}-${JSON.stringify(componentData).slice(
                        0,

                        100,
                      )}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**

 * Split-Screen Preview with Form

 * Shows form and preview side-by-side

 */

const SplitScreenPreview = ({
  componentType,

  componentData,

  formComponent,

  theme = 1,

  className = "",
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Form Side */}

      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg font-bold">
            Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="max-h-96 overflow-y-auto">
          {formComponent}
        </CardContent>
      </Card>

      {/* Preview Side */}

      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-lg font-bold">
            Preview
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
            <ComponentPreview
              componentType={componentType}
              componentData={componentData}
              theme={theme}
              isVisible={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ComponentPreview, LivePreview, SplitScreenPreview };

export default LivePreview;
