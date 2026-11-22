/**
 * Section registry — the single list of page sections the CMS can use.
 *
 * Each entry: the component path (also the chunk key), a lazy loader, and
 * the section type names saved in the CMS that render it (`types`, offered in
 * the admin catalog) and older alternative names that still render but are
 * not offered (`aliases`). The live renderer
 * (client + server), the admin preview and the page builders all read from
 * here, so adding a section means adding one entry.
 *
 * Schemas (admin form fields) and prop normalizers stay keyed by type in
 * src/data/*Schemas.js and src/utils/normalizeProps.js.
 */

export const SECTIONS = [
  { path: "About/AboutHero", types: ["AboutHeroSection"], load: () => import("../components/About/AboutHero") },
  { path: "About/AboutMission", types: ["AboutMissionSection"], load: () => import("../components/About/AboutMission") },
  { path: "About/AboutTeam", types: ["AboutTeamSection"], load: () => import("../components/About/AboutTeam") },
  { path: "About/AboutValues", types: ["AboutValuesSection"], load: () => import("../components/About/AboutValues") },
  { path: "About/AboutJourney", types: ["AboutJourneySection"], load: () => import("../components/About/AboutJourney") },
  { path: "About/AboutMilestones", types: ["AboutMilestonesSection"], load: () => import("../components/About/AboutMilestones") },
  { path: "About/AboutDifferentiators", types: ["AboutDifferentiatorsSection"], load: () => import("../components/About/AboutDifferentiators") },
  { path: "About/AboutCTA", types: ["AboutCTASection"], load: () => import("../components/About/AboutCTA") },
  { path: "solution/payroll/PayrollHero", types: ["PayrollHeroSection"], load: () => import("../components/solution/payroll/PayrollHero") },
  { path: "solution/payroll/PayrollHowItWorks", types: ["PayrollHowItWorksSection"], load: () => import("../components/solution/payroll/PayrollHowItWorks") },
  { path: "solution/payroll/PayrollWorkflow", types: ["PayrollWorkflowSection"], load: () => import("../components/solution/payroll/PayrollWorkflow") },
  { path: "solution/payroll/PayrollPainPoints", types: ["PayrollPainPointsSection"], load: () => import("../components/solution/payroll/PayrollPainPoints") },
  { path: "solution/payroll/PayrollFAQ", types: ["PayrollFAQSection"], load: () => import("../components/solution/payroll/PayrollFAQ") },
  { path: "solution/payroll/PayrollCTA", types: ["PayrollCTASection"], load: () => import("../components/solution/payroll/PayrollCTA") },
  { path: "solution/hr/HeroSection", types: ["HRHeroSection"], load: () => import("../components/solution/hr/HeroSection") },
  { path: "solution/hr/ModulesSection", types: ["HRModulesSection"], load: () => import("../components/solution/hr/ModulesSection") },
  { path: "solution/hr/BenefitsSection", types: ["HRBenefitsSection"], load: () => import("../components/solution/hr/BenefitsSection") },
  { path: "solution/hr/UseCasesSection", types: ["HRUseCasesSection"], load: () => import("../components/solution/hr/UseCasesSection") },
  { path: "solution/hr/PricingSection", types: ["HRPricingSection"], load: () => import("../components/solution/hr/PricingSection") },
  { path: "solution/hr/FAQSection", types: ["HRFAQSection"], load: () => import("../components/solution/hr/FAQSection") },
  { path: "solution/hr/CTASection", types: ["HRCTASection"], load: () => import("../components/solution/hr/CTASection") },
  { path: "Hero", types: ["Hero", "HeroSection"], load: () => import("../components/Hero") },
  { path: "Testimonials", types: ["Testimonials", "TestimonialsSection"], load: () => import("../components/Testimonials") },
  { path: "Services/ServiceGrid", types: ["ServiceGrid"], aliases: ["ServiceGridSection"], load: () => import("../components/Services/ServiceGrid") },
  { path: "Services/Implementation/HeroSection", types: ["ImplementationHeroSection"], load: () => import("../components/Services/Implementation/HeroSection") },
  { path: "Services/Implementation/ProcessSection", types: ["ImplementationProcessSection"], load: () => import("../components/Services/Implementation/ProcessSection") },
  { path: "Services/Implementation/WhyChooseSection", types: ["ImplementationWhyChooseSection"], load: () => import("../components/Services/Implementation/WhyChooseSection") },
  { path: "Services/Implementation/PricingSection", types: ["ImplementationPricingSection"], load: () => import("../components/Services/Implementation/PricingSection") },
  { path: "Services/Implementation/CtaSection", types: ["ImplementationCtaSection"], load: () => import("../components/Services/Implementation/CtaSection") },
  { path: "Services/training/HeroSection", types: ["TrainingHeroSection"], load: () => import("../components/Services/training/HeroSection") },
  { path: "Services/training/TrainingPrograms", types: ["TrainingProgramsSection"], load: () => import("../components/Services/training/TrainingPrograms") },
  { path: "Services/training/KeyModulesSection", types: ["TrainingKeyModulesSection", "KeyModulesSection"], load: () => import("../components/Services/training/KeyModulesSection") },
  { path: "Services/training/WhyChooseSection", types: ["TrainingWhyChooseSection"], aliases: ["WhyChooseSection"], load: () => import("../components/Services/training/WhyChooseSection") },
  { path: "Services/training/ProgramsSection", types: ["ProgramsSection"], aliases: ["ProgramsSectionSection"], load: () => import("../components/Services/training/ProgramsSection") },
  { path: "industries/Manufacturing/HeroSection", types: ["ManufacturingHeroSection"], load: () => import("../components/industries/Manufacturing/HeroSection") },
  { path: "industries/Manufacturing/IndustryStats", types: ["ManufacturingIndustryStats"], load: () => import("../components/industries/Manufacturing/IndustryStats") },
  { path: "industries/Manufacturing/ChallengesSection", types: ["ManufacturingChallengesSection"], load: () => import("../components/industries/Manufacturing/ChallengesSection") },
  { path: "industries/Manufacturing/SolutionsSection", types: ["ManufacturingSolutionsSection"], load: () => import("../components/industries/Manufacturing/SolutionsSection") },
  { path: "industries/Manufacturing/CaseStudies", types: ["ManufacturingCaseStudies"], load: () => import("../components/industries/Manufacturing/CaseStudies") },
  { path: "industries/Manufacturing/ImplementationProcess", types: ["ManufacturingImplementationProcess"], load: () => import("../components/industries/Manufacturing/ImplementationProcess") },
  { path: "industries/Manufacturing/CTASection", types: ["ManufacturingCTASection"], load: () => import("../components/industries/Manufacturing/CTASection") },
  { path: "industries/retail/HeroSection", types: ["RetailHeroSection"], load: () => import("../components/industries/retail/HeroSection") },
  { path: "industries/retail/IndustryStats", types: ["RetailIndustryStats"], load: () => import("../components/industries/retail/IndustryStats") },
  { path: "industries/retail/ChallengesSection", types: ["RetailChallengesSection"], load: () => import("../components/industries/retail/ChallengesSection") },
  { path: "industries/retail/SolutionsSection", types: ["RetailSolutionsSection"], load: () => import("../components/industries/retail/SolutionsSection") },
  { path: "industries/retail/FeaturesSection", types: ["RetailFeaturesSection"], load: () => import("../components/industries/retail/FeaturesSection") },
  { path: "industries/retail/CaseStudiesSection", types: ["RetailCaseStudiesSection"], aliases: ["RetailCaseStudies"], load: () => import("../components/industries/retail/CaseStudiesSection") },
  { path: "industries/retail/ImplementationSection", types: ["RetailImplementationSection"], load: () => import("../components/industries/retail/ImplementationSection") },
  { path: "industries/retail/CTASection", types: ["RetailCTASection"], load: () => import("../components/industries/retail/CTASection") },
  { path: "Support/BellatrixSupportHero", types: ["SupportHeroSection"], load: () => import("../components/Support/BellatrixSupportHero") },
  { path: "Support/SupportSecondSec", types: ["SupportSecondSection"], load: () => import("../components/Support/SupportSecondSec") },
  { path: "Support/SupportServices", types: ["SupportSherpaCareSection"], load: () => import("../components/Support/SupportServices") },
  { path: "Support/WhatWeOfferSection", types: ["SupportWhatWeOfferSection"], load: () => import("../components/Support/WhatWeOfferSection") },
  { path: "Support/DedicatedTeamSection", types: ["SupportDedicatedTeamSection"], load: () => import("../components/Support/DedicatedTeamSection") },
  { path: "Support/PrePackagedSection", types: ["SupportPrePackagedSection"], load: () => import("../components/Support/PrePackagedSection") },
  { path: "Support/BellatrixSupportSection", types: ["SupportBellatrixSection"], load: () => import("../components/Support/BellatrixSupportSection") },
  { path: "Support/PayPerUseSection", types: ["SupportPayPerUseSection"], load: () => import("../components/Support/PayPerUseSection") },
  { path: "Support/CustomerSupport", types: ["SupportCustomerSection"], load: () => import("../components/Support/CustomerSupport") },
  { path: "Support/WhyChoeseBellatrix", types: ["SupportWhyChooseSection"], load: () => import("../components/Support/WhyChoeseBellatrix") },
  { path: "SolutionsGallery", types: ["SolutionsGallery"], load: () => import("../components/SolutionsGallery") },
  { path: "CertificationSection", types: ["CertificationSection"], load: () => import("../components/CertificationSection") },
  { path: "solution/SolutionShowcase", types: ["SolutionShowcase"], load: () => import("../components/solution/SolutionShowcase") },
  { path: "solution/payroll/PayrollStepper", types: [], aliases: ["PayrollStepperSection"], load: () => import("../components/solution/payroll/PayrollStepper") },
  { path: "Services", types: [], aliases: ["Services", "ServicesSection"], load: () => import("../components/Services") },
  { path: "Industries", types: [], aliases: ["Industries", "IndustriesSection"], load: () => import("../components/Industries") },
  { path: "CTAButton", types: [], aliases: ["CTAButton"], load: () => import("../components/CTAButton") },
];
