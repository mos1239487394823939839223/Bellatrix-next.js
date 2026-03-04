'use client'
import { useState, useEffect, useRef, lazy, Suspense } from "react";

import SEO from "./SEO";

// Lazy-loaded — only needed on first Contact button click
const LazyModal = lazy(() => import("./Modal"));
const LazyContactForm = lazy(() => import("./ContactForm"));

// Inline SVGs replace @heroicons/react (removes 34 kB gzip from critical-path JS)
const Bars3 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
const XMark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);
const ChevronDown = ({ className = "ml-1 h-4 w-4 shrink-0" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

import Link from "next/link";

import { useTheme } from "../context/ThemeContext";

import { setupSectionThemeDetection } from "../utils/sectionThemeDetection";

import { getApiBaseUrlWithApi } from "../config/api.js";
import { cachedFetch } from "../lib/apiCache.js";

const Navbar = ({ initialCategories = [] }) => {
  // Dynamic navbar categories — use SSR-provided data if available
  const [categories, setCategories] = useState(initialCategories);
  const [loadingCategories, setLoadingCategories] = useState(initialCategories.length === 0);

  // Fetch navbar categories from API only when not provided server-side
  useEffect(() => {
    if (initialCategories.length > 0) return; // already have data from SSR
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await cachedFetch(
          'navbar:categories',
          async () => {
            const res = await fetch(`${getApiBaseUrlWithApi()}/Categories/navbar`);
            return res.json();
          },
          5 * 60 * 1000 // 5 minutes
        );

        let cats = [];
        if (Array.isArray(data)) {
          cats = data;
        } else if (Array.isArray(data.data)) {
          cats = data.data;
        } else if (Array.isArray(data.result)) {
          cats = data.result;
        }

        setCategories(cats);
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [initialCategories]);
  const { theme, toggleTheme } = useTheme();
  const [navbarTheme, setNavbarTheme] = useState("dark");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  // Track whether contact modal has been opened at least once so we can keep
  // LazyModal/LazyContactForm mounted after first open (avoids re-loading chunk)
  const [hasOpenedContact, setHasOpenedContact] = useState(false);
  const timeoutRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  useEffect(() => {
    // Set up section theme detection with improved logic
    const cleanup = setupSectionThemeDetection((newTheme) => {
      setNavbarTheme(newTheme);
    }, 60); // 60px navbar height

    return cleanup;
  }, []);
  // Contact form modal functions
  const openContactModal = () => { setHasOpenedContact(true); setIsContactModalOpen(true); };
  const closeContactModal = () => setIsContactModalOpen(false);

  // Contact form data
  const modalContent = {
    title: "Contact Us",
    subtitle: "Let's discuss your project",
    formFields: {
      contactInfo: {
        title: "Contact Information",
        fields: [
          {
            label: "Full Name *",
            type: "text",
            placeholder: "John Doe",
            required: true,
          },
          {
            label: "Email Address *",
            type: "email",
            placeholder: "john@company.com",
            required: true,
          },
          {
            label: "Phone Number",
            type: "tel",
            placeholder: "+1 (555) 123-4567",
          },
        ],
      },
      companyInfo: {
        title: "Company Details",
        fields: [
          {
            label: "Company Name",
            type: "text",
            placeholder: "Your Company Inc.",
          },
          {
            label: "Industry",
            type: "select",
            options: [
              "Select Industry",
              "Manufacturing",
              "Retail & E-commerce",
              "Healthcare",
              "Finance & Banking",
              "Technology",
              "Professional Services",
              "Non-Profit",
              "Other",
            ],
          },
          {
            label: "Country",
            type: "select",
            options: [
              "Select Country",
              "United States",
              "Canada",
              "United Kingdom",
              "Australia",
              "Germany",
              "France",
              "United Arab Emirates",
              "Saudi Arabia",
              "Egypt",
              "Other",
            ],
          },
        ],
      },
      message: {
        label: "Message",
        placeholder: "Tell us about your project requirements...",
      },
      submitNote: " 24hr response",
      submitText: "Send Message",
    },
  };

  // New Services structure
  // ...removed unused servicesStructure...

  // Industries data
  // ...removed unused industriesData...

  const handleMenuEnter = (dropdown) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(dropdown);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setOpenSubDropdown(null);
    }, 200);
  };

  // ...removed unused handleSubMenuEnter and handleSubMenuLeave...

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setOpenSubDropdown(null);
      }
    };

    if (openDropdown || openSubDropdown) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [openDropdown, openSubDropdown]);

  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  return (
    <>
      <SEO
        title="Bellatrix Navigation | Bellatrix Consulting Services"
        description="Navigate Bellatrix's comprehensive Bellatrix services including implementation, training, support, and industry-specific solutions."
        keywords="NetSuite navigation, Oracle consulting menu, implementation services, training programs, technical support, industry solutions"
        ogTitle="Bellatrix Services Navigation | Bellatrix Solutions"
        ogDescription="Explore Bellatrix's full range of Bellatrix consulting services, training programs, and industry-specific solutions."
        ogImage="/images/bellatrix-services-navigation.jpg"
        twitterCard="summary_large_image"
      />

      <nav
        className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-gray-900/10 shadow-2xl backdrop-blur-md"
          : "bg-transparent backdrop-blur-md"
          }`}
      >
        {/* Floating Geometric Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-1/4 w-2 h-2 bg-gradient-to-r from-[var(--color-primary)]/60 to-[var(--color-primary-light)]/60 rounded-full animate-pulse"></div>
          <div className="absolute top-4 right-1/3 w-1.5 h-1.5 bg-gradient-to-r from-[var(--color-primary-light)]/50 to-[var(--color-primary)]/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-2/3 w-1 h-1 bg-[var(--color-white)]/40 rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Premium Logo */}
            <a href="/" className="flex items-center group">
              <div className="flex items-center justify-center h-32 w-32 md:h-56 md:w-56 mr-2 relative">
                <div className="absolute top-0 left-0 h-full w-full">
                  <img
                    src={
                      navbarTheme === "light"
                        ? "/images/logoThree.png"
                        : scrolled
                          ? "/images/logoTwo.png"
                          : "/images/logoOne.png"
                    }
                    alt="Bellatrix Logo"
                    className={`absolute top-1/2 left-1/2 object-contain -translate-x-1/2 -translate-y-1/2 transition-all duration-250 ${navbarTheme === "light"
                      ? "h-16 w-16 md:h-24 md:w-24"
                      : scrolled
                        ? "h-16 w-16 md:h-24 md:w-24"
                        : "h-28 w-28 md:h-36 md:w-36"
                      }`}
                  />
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Dynamic Categories Dropdowns */}
              {loadingCategories ? (
                <span className="px-5 py-3 text-sm text-gray-400">
                  Loading...
                </span>
              ) : Array.isArray(categories) && categories.length > 0 ? (
                (() => {
                  // 1. Separate Home and About from the rest
                  const homeCategory = categories.find(cat => cat.name?.toLowerCase() === "home");
                  const aboutCategory = categories.find(cat => cat.name?.toLowerCase() === "about");
                  const otherCategories = categories.filter(cat =>
                    cat.id !== homeCategory?.id && cat.id !== aboutCategory?.id
                  );

                  // 2. Define limit for main display (items between Home and More/About)
                  const DISPLAY_LIMIT = 3;
                  const mainOtherCategories = otherCategories.slice(0, DISPLAY_LIMIT);
                  const moreCategories = otherCategories.slice(DISPLAY_LIMIT);

                  // Helper to render a direct link (for Home/About)
                  const renderDirectLink = (cat) => {
                    const nameSlug = cat.name?.toLowerCase().replace(/\s+/g, '-');
                    const mainPageUrl = cat.mainPageSlug
                      ? `/${cat.mainPageSlug}`
                      : cat.pages && cat.pages.length > 0
                        ? cat.pages[0].slug
                          ? `/${cat.pages[0].slug}`
                          : `/${cat.pages[0].id}`
                        : `/${nameSlug || ""}`;

                    return (
                      <Link
                        key={cat.id}
                        href={mainPageUrl}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-300 border ${navbarTheme === "light"
                          ? "text-black hover:text-[var(--color-primary)] border-transparent hover:border-black/20"
                          : "text-white hover:text-[var(--color-primary-light)] border-transparent hover:border-white/20"
                          }`}
                      >
                        <span className="truncate max-w-[100px] xl:max-w-none">
                          {cat.name}
                        </span>
                      </Link>
                    );
                  };

                  // Helper to render a dropdown link
                  const renderDropdownLink = (cat) => (
                    <div
                      className="relative"
                      key={cat.id}
                      onMouseEnter={() => handleMenuEnter(cat.id)}
                      onMouseLeave={handleMenuLeave}
                    >
                      <button
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-300 border ${openDropdown === cat.id
                          ? navbarTheme === "light" ? "text-black border-blue-400/20 shadow" : "text-white border-blue-400/20 shadow"
                          : navbarTheme === "light" ? "text-black hover:text-[var(--color-primary)] border-transparent hover:border-black/20" : "text-white hover:text-[var(--color-primary-light)] border-transparent hover:border-white/20"
                          }`}
                        onClick={() => toggleDropdown(cat.id)}
                        aria-expanded={openDropdown === cat.id}
                        aria-haspopup="true"
                      >
                        <span className="truncate max-w-[100px] xl:max-w-none">
                          {cat.name}
                        </span>
                        {cat.pages && cat.pages.length > 0 && (
                          <ChevronDown />
                        )}
                      </button>
                      {openDropdown === cat.id && cat.pages && cat.pages.length > 0 && (
                        <div
                          className="absolute left-0 mt-2 w-56 bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg z-50 py-2 animate-fade-slide"
                          onMouseEnter={() => handleMenuEnter(cat.id)}
                          onMouseLeave={handleMenuLeave}
                        >
                          {cat.pages
                            ?.filter((page) => page.isPublished === true)
                            .map((page) => (
                              <Link
                                key={page.id}
                                href={page.slug ? `/${page.slug}` : `/${page.id}`}
                                className="block px-5 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-150 text-base font-medium"
                              >
                                {page.title}
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  );

                  return (
                    <>
                      {/* 1. Home always first */}
                      {homeCategory && renderDirectLink(homeCategory)}

                      {/* 2. Main other categories */}
                      {mainOtherCategories.map(cat => renderDropdownLink(cat))}

                      {/* 3. More dropdown before About */}
                      {moreCategories.length > 0 && (
                        <div
                          className="relative"
                          onMouseEnter={() => handleMenuEnter("more")}
                          onMouseLeave={handleMenuLeave}
                        >
                          <button
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-300 border ${openDropdown === "more"
                              ? navbarTheme === "light" ? "text-black border-blue-400/20 shadow" : "text-white border-blue-400/20 shadow"
                              : navbarTheme === "light" ? "text-black hover:text-[var(--color-primary)] border-transparent hover:border-black/20" : "text-white hover:text-[var(--color-primary-light)] border-transparent hover:border-white/20"
                              }`}
                            onClick={() => toggleDropdown("more")}
                          >
                            <span>More</span>
                            <ChevronDown />
                          </button>
                          {openDropdown === "more" && (
                            <div
                              className="absolute right-0 mt-2 w-72 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg z-50 py-2 overflow-hidden animate-fade-slide"
                              onMouseEnter={() => handleMenuEnter("more")}
                              onMouseLeave={handleMenuLeave}
                            >
                              <div className="max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                                {moreCategories.map((cat) => (
                                  <div key={cat.id} className="mb-2 last:mb-0">
                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                      {cat.name}
                                    </div>
                                    {cat.pages && cat.pages.length > 0 ? (
                                      cat.pages
                                        .filter((page) => page.isPublished === true)
                                        .map((page) => (
                                          <Link
                                            key={page.id}
                                            href={page.slug ? `/${page.slug}` : `/${page.id}`}
                                            className="block px-5 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-150 text-sm font-medium ml-2"
                                          >
                                            {page.title}
                                          </Link>
                                        ))
                                    ) : (
                                      <span className="block px-5 py-2 text-gray-400 text-sm italic ml-2">
                                        No pages
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. About always last */}
                      {aboutCategory && renderDirectLink(aboutCategory)}
                    </>
                  );
                })()
              ) : (
                <span style={{ display: "none" }} />
              )}

              {/* Theme Toggle Button */}
              <button
                onClick={() =>
                  toggleTheme(theme === "default" ? "purple" : "default")
                }
                className="relative ml-2 px-3 py-3 bg-[var(--color-white)]/10 hover:bg-[var(--color-white)]/20 text-[var(--color-white)] text-sm font-medium rounded-xl transition-all duration-300 border border-[var(--color-white)]/10 backdrop-blur-sm cursor-pointer"
                title={`Switch to ${theme === "default" ? "Dark Mode" : "Light Mode"
                  } theme`}
              >
                <span className="text-lg">{theme === "default" ? "" : ""}</span>
              </button>

              {/* Premium Contact button */}
              <button
                onClick={openContactModal}
                className="relative ml-2 px-6 py-3 flex items-center justify-center bg-gradient-to-r from-[var(--tw-blue-200)] to-[var(--tw-blue-900)] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/40 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm group overflow-hidden cursor-pointer"
              >
                <span className="relative z-10">Contact</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`inline-flex items-center justify-center p-3 rounded-xl hover:bg-white/10 focus:outline-none border border-white/10 backdrop-blur-sm transition-colors duration-300 ${navbarTheme === "light"
                  ? "text-[var(--color-text-dark)]/90 hover:text-[var(--color-primary)]"
                  : "text-[var(--color-text-light)]/90 hover:text-[var(--color-text-light)]"
                  }`}
              >
                {mobileMenuOpen ? <XMark /> : <Bars3 />}
              </button>
            </div>
          </div>
        </div>

        {/* Premium Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-900/40 backdrop-blur-2xl border-t border-white/10 animate-fade-slide">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {/* Dynamic Mobile Categories Dropdowns */}
              {loadingCategories ? (
                <span className="block px-4 py-3 text-base text-gray-400">
                  Loading...
                </span>
              ) : Array.isArray(categories) && categories.length > 0 ? (
                (() => {
                  const homeCategory = categories.find(cat => cat.name?.toLowerCase() === "home");
                  const aboutCategory = categories.find(cat => cat.name?.toLowerCase() === "about");
                  const otherCategories = categories.filter(cat =>
                    cat.id !== homeCategory?.id && cat.id !== aboutCategory?.id
                  );

                  const renderMobileDirectLink = (cat) => {
                    const nameSlug = cat.name?.toLowerCase().replace(/\s+/g, '-');
                    const mainPageUrl = cat.mainPageSlug
                      ? `/${cat.mainPageSlug}`
                      : cat.pages && cat.pages.length > 0
                        ? cat.pages[0].slug
                          ? `/${cat.pages[0].slug}`
                          : `/${cat.pages[0].id}`
                        : `/${nameSlug || ""}`;

                    return (
                      <Link
                        key={cat.id}
                        href={mainPageUrl}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full flex justify-between items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-white/10 transition-colors duration-300 border border-white/10 text-white`}
                      >
                        <span>{cat.name}</span>
                      </Link>
                    );
                  };

                  const renderMobileDropdownLink = (cat) => (
                    <div className="relative" key={cat.id}>
                      <button
                        onClick={() => toggleDropdown(cat.id)}
                        className={`w-full flex justify-between items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-white/10 transition-colors duration-300 border border-white/10 text-white`}
                      >
                        <span>{cat.name}</span>
                        {cat.pages && cat.pages.length > 0 && (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {openDropdown === cat.id &&
                        cat.pages &&
                        cat.pages.length > 0 && (
                          <div className="mt-2 ml-4 space-y-2 animate-fade-slide">
                            {cat.pages.map((page) => (
                              <Link
                                key={page.id}
                                href={page.slug ? `/${page.slug}` : `/${page.id}`}
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setOpenDropdown(null);
                                }}
                                className="block px-4 py-3 text-sm text-white/70 rounded-lg hover:bg-white/5 hover:text-white border border-white/5 backdrop-blur-sm transition-all duration-300"
                              >
                                {page.title}
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  );

                  return (
                    <>
                      {homeCategory && renderMobileDirectLink(homeCategory)}
                      {otherCategories.map(cat => renderMobileDropdownLink(cat))}
                      {aboutCategory && renderMobileDirectLink(aboutCategory)}
                    </>
                  );
                })()
              ) : (
                <span className="block px-4 py-3 text-base text-gray-400">
                  No categories
                </span>
              )}

              {/* Mobile Theme Toggle */}

              <button
                onClick={() =>
                  toggleTheme(theme === "default" ? "purple" : "default")
                }
                className="block w-full px-4 py-3 mt-4 text-center bg-[var(--color-white)]/10 hover:bg-[var(--color-white)]/20 text-[var(--color-white)] font-medium rounded-xl border border-[var(--color-white)]/10 transition-all duration-300"
              >
                {theme === "default" ? " Switch to Dark Mode" : " Switch to Light Mode"}
              </button>

              {/* Mobile Contact button */}

              <button
                onClick={openContactModal}
                className="block w-full px-4 py-3 mt-4 text-center bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-primary-dark)] text-[var(--color-white)] font-medium rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/25 transition-all duration-300 cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Contact Modal — lazy loaded; chunks only fetched on first Contact click */}
      {hasOpenedContact && (
        <Suspense fallback={null}>
          <LazyModal
            isOpen={isContactModalOpen}
            onClose={closeContactModal}
            title={modalContent.title}
            subtitle={modalContent.subtitle}
          >
            <div className="p-2">
              <LazyContactForm onSuccess={closeContactModal} />
            </div>
          </LazyModal>
        </Suspense>
      )}

      <style>{`

        @keyframes fade-slide {

          0% { opacity: 0; transform: translateY(10px) scale(0.98); }

          100% { opacity: 1; transform: translateY(0) scale(1); }

        }

        .animate-fade-slide {

          animation: fade-slide 0.22s cubic-bezier(.4,2,.6,1);

        }

      `}</style>
    </>
  );
};

export default Navbar;
