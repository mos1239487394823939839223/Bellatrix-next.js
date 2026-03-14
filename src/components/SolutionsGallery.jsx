'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ContactModal from "./ContactModal";

export const DEFAULT_SOLUTIONS = [
  {
    id: "netsuite",
    category: "ERP",
    title: "NetSuite ERP",
    subtitle: "Implementation & Customization",
    description:
      "End-to-end NetSuite setup tailored to your business — financials, inventory, custom workflows, and seamless third-party integrations.",
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
    description:
      "Streamline hiring, onboarding, performance reviews, and employee records in one unified system built for growing teams.",
    features: ["Recruitment Pipeline", "Employee Onboarding", "Performance Reviews", "Org Charts"],
    accentColor: "#a855f7",
    image: "/images/Hr/hrS1.png",
    href: "/hr",
  },
  {
    id: "payroll",
    category: "Finance",
    title: "Payroll Solutions",
    subtitle: "Automated & Compliant",
    description:
      "Automate payroll calculations, multi-currency pay runs, and tax compliance with complete audit trails and payslip generation.",
    features: ["Multi-currency Payroll", "Tax Compliance", "Automated Pay Runs", "Payslip Generation"],
    accentColor: "#22c55e",
    image: "/images/payrollFinal.jpeg",
    href: "/payroll",
  },
  {
    id: "manufacturing",
    category: "Industry",
    title: "Manufacturing Ops",
    subtitle: "Production & Quality Control",
    description:
      "Manage work orders, BOMs, production schedules, and quality control workflows for complex manufacturing environments.",
    features: ["Work Order Management", "Bill of Materials", "Production Scheduling", "Quality Control"],
    accentColor: "#f97316",
    image: "/images/indleaders.jpg",
    href: "/manufacturing",
  },
  {
    id: "retail",
    category: "Industry",
    title: "Retail Commerce",
    subtitle: "Omnichannel & POS",
    description:
      "Unite your online and in-store operations with real-time inventory visibility, POS integration, and deep customer analytics.",
    features: ["Omnichannel Sales", "Real-time Inventory", "POS Integration", "Customer Analytics"],
    accentColor: "#06b6d4",
    image: "/images/ourProServices.png",
    href: "/retail",
  },
  {
    id: "support",
    category: "Support",
    title: "24/7 Support",
    subtitle: "Dedicated Expert Team",
    description:
      "Round-the-clock technical support, proactive system monitoring, and dedicated consultants to keep your operations running.",
    features: ["24/7 Helpdesk", "System Monitoring", "Dedicated Consultant", "SLA Guarantee"],
    accentColor: "#eab308",
    image: "/images/Support/HeroSection.png",
    href: "/support",
  },
];

// Static fallback — replaced at runtime by dynamic `categories` derived from the solutions list

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

const SolutionsGallery = ({ title, subtitle, solutions: propSolutions, ctaButtonText }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [imageOverrides, setImageOverrides] = useState({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sg_image_overrides");
      if (stored) setImageOverrides(JSON.parse(stored));
    } catch {/* ignore */}
  }, []);

  // Use page-builder-configured solutions if provided, otherwise fall back to defaults
  // Merge in any image overrides set via the admin Solutions Gallery page
  const baseSolutions =
    Array.isArray(propSolutions) && propSolutions.length > 0
      ? propSolutions
      : DEFAULT_SOLUTIONS;

  const SOLUTIONS = Object.keys(imageOverrides).length
    ? baseSolutions.map((s) => imageOverrides[s.id] ? { ...s, image: imageOverrides[s.id] } : s)
    : baseSolutions;

  // Derive filter categories dynamically from the active solution list
  const categories = ["All", ...Array.from(new Set(SOLUTIONS.map((s) => s.category).filter(Boolean)))];

  const filtered =
    activeCategory === "All"
      ? SOLUTIONS
      : SOLUTIONS.filter((s) => s.category === activeCategory);

  const featured = filtered.length > 1 ? filtered.find((s) => s.featured) : null;
  const rest = featured ? filtered.filter((s) => s !== featured) : filtered;

  return (
    <section
      className="py-20 md:py-28 px-4 md:px-6 overflow-hidden"
      style={{ background: "var(--color-brand-dark-navy, #0f172a)" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ── */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{
              background: "rgba(99,102,241,0.15)",
              color: "var(--color-primary, #6366f1)",
              border: "1px solid rgba(99,102,241,0.25)",
            }}
          >
            Our Solutions
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            style={{ color: "var(--color-text-inverse, #fff)" }}
          >
            {title || "Powerful Solutions, Built for Your Business"}
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--color-text-inverse, #fff)", opacity: 0.6 }}
          >
            {subtitle ||
              "From ERP to industry-specific platforms — discover how Bellatrix drives operational excellence across every function."}
          </p>
        </div>

        {/* ── Category Filter Pills ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
              style={
                activeCategory === cat
                  ? {
                      background: "var(--color-primary, #6366f1)",
                      color: "#fff",
                      boxShadow: "0 0 18px rgba(99,102,241,0.4)",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.65)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Gallery Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {/* ── Featured Card (spans 2 cols on lg) ── */}
            {featured && (
              <motion.article
                key={featured.id}
                custom={0}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2 rounded-2xl overflow-hidden flex flex-col cursor-pointer group"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    hoveredId === featured.id
                      ? featured.accentColor + "55"
                      : "rgba(255,255,255,0.09)"
                  }`,
                  boxShadow:
                    hoveredId === featured.id
                      ? `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${featured.accentColor}33`
                      : "0 4px 24px rgba(0,0,0,0.2)",
                  transition: "border 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={() => setHoveredId(featured.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                onClick={() => (window.location.href = featured.href)}
              >
                {/* Image + text side by side on md+ */}
                <div className="flex flex-col md:flex-row flex-1">

                  {/* Image pane */}
                  <div className="relative md:w-1/2 h-56 md:h-auto overflow-hidden flex-shrink-0">
                    {featured.image ? (
                      <Image
                        src={featured.image}
                        alt={featured.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized={featured.image.startsWith('/uploads/')}
                      />
                    ) : (
                      <div className="absolute inset-0" style={{ background: `${featured.accentColor}22` }} />
                    )}
                    {/* Gradient overlay on image edge */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to right, transparent 60%, rgba(15,23,42,0.85))",
                      }}
                    />
                    {/* Accent top bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px]"
                      style={{
                        background: `linear-gradient(90deg, ${featured.accentColor}, ${featured.accentColor}00)`,
                      }}
                    />
                    {/* Category badge over image */}
                    <span
                      className="absolute top-4 left-4 text-xs font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full backdrop-blur-sm"
                      style={{
                        background: `${featured.accentColor}22`,
                        color: featured.accentColor,
                        border: `1px solid ${featured.accentColor}44`,
                      }}
                    >
                      {featured.category}
                    </span>
                  </div>

                  {/* Text pane */}
                  <div className="flex-1 p-7 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-2xl md:text-3xl font-bold mb-1 text-white leading-tight"
                      >
                        {featured.title}
                      </h3>
                      <p
                        className="text-sm font-medium mb-4"
                        style={{ color: featured.accentColor }}
                      >
                        {featured.subtitle}
                      </p>
                      <p
                        className="text-sm md:text-base leading-relaxed mb-6"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        {featured.description}
                      </p>

                      {/* Feature chips */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {featured.features.map((f, i) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1 rounded-full"
                            style={{
                              background: `${featured.accentColor}15`,
                              color: "rgba(255,255,255,0.8)",
                              border: `1px solid ${featured.accentColor}30`,
                            }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a
                      href={featured.href}
                      className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-300"
                      style={{ color: featured.accentColor }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Explore Solution <ArrowRight />
                    </a>
                  </div>
                </div>
              </motion.article>
            )}

            {/* ── Regular Cards ── */}
            {rest.map((solution, i) => (
              <motion.article
                key={solution.id || solution.title || i}
                custom={featured ? i + 1 : i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-2xl overflow-hidden flex flex-col cursor-pointer group"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    hoveredId === solution.id
                      ? solution.accentColor + "55"
                      : "rgba(255,255,255,0.09)"
                  }`,
                  boxShadow:
                    hoveredId === solution.id
                      ? `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${solution.accentColor}33`
                      : "0 4px 20px rgba(0,0,0,0.2)",
                  transition: "border 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={() => setHoveredId(solution.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                onClick={() => (window.location.href = solution.href)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  {solution.image ? (
                    <Image
                      src={solution.image}
                      alt={solution.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={solution.image.startsWith('/uploads/')}
                    />
                  ) : (
                    <div className="absolute inset-0" style={{ background: `${solution.accentColor}22` }} />
                  )}
                  {/* Dark gradient at bottom of image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 40%, rgba(15,23,42,0.9))",
                    }}
                  />
                  {/* Accent top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{
                      background: `linear-gradient(90deg, ${solution.accentColor}, ${solution.accentColor}00)`,
                    }}
                  />
                  {/* Category badge */}
                  <span
                    className="absolute top-3 right-3 text-xs font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full backdrop-blur-sm"
                    style={{
                      background: `${solution.accentColor}22`,
                      color: solution.accentColor,
                      border: `1px solid ${solution.accentColor}44`,
                    }}
                  >
                    {solution.category}
                  </span>
                  {/* Title overlaid at image bottom */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {solution.title}
                    </h3>
                    <p
                      className="text-xs font-medium"
                      style={{ color: solution.accentColor }}
                    >
                      {solution.subtitle}
                    </p>
                  </div>
                </div>

                {/* Text body */}
                <div className="p-5 flex flex-col flex-1">
                  <p
                    className="text-sm leading-relaxed mb-4 flex-1"
                    style={{ color: "rgba(255,255,255,0.62)" }}
                  >
                    {solution.description}
                  </p>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {solution.features.map((f, fi) => (
                      <span
                        key={fi}
                        className="text-xs px-2.5 py-0.5 rounded-full"
                        style={{
                          background: `${solution.accentColor}12`,
                          color: "rgba(255,255,255,0.75)",
                          border: `1px solid ${solution.accentColor}28`,
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <a
                    href={solution.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-3 transition-all duration-300"
                    style={{ color: solution.accentColor }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Explore Solution <ArrowRight />
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom CTA ── */}
        <div className="text-center mt-16">
          <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
            Not sure which solution fits your needs?
          </p>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105 hover:brightness-110 cursor-pointer"
            style={{
              background: "var(--color-primary, #6366f1)",
              boxShadow: "0 0 28px rgba(99,102,241,0.35)",
              border: "none",
            }}
          >
            {ctaButtonText || "Talk to an Expert"} <ArrowRight />
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
};

export default SolutionsGallery;
