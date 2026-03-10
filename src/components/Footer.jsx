import {
  Facebook,
  Twitter,
  LinkedIn,
  Email,
  ArrowUpward,
  Instagram,
  YouTube,
  KeyboardArrowDown,
} from "@mui/icons-material";

import { useState, useEffect } from "react";

import SEO from "./SEO";

import { getPublicDictionary } from "../services/settingsApi";

import { getApiBaseUrlWithApi } from "../config/api.js";

// Add inline styles for hover effects

const footerStyles = `

  .footer-social-link:hover {
    background-color: var(--color-hover) !important;
  }

  .footer-social-link:hover span {
    color: #ffffff !important;
  }

  .footer-social-link span {
    color: #ffffff !important;
    opacity: 0.9;
  }

  /* Silver Theme - White icons */
  [data-theme="purple"] .footer-social-link span {
    color: #ffffff !important;
    opacity: 0.9;
  }

  [data-theme="purple"] .footer-social-link:hover span {
    color: #ffffff !important;
    opacity: 1;
  }

  [data-theme="purple"] .footer-social-link:hover {
    background-color: #6c757d !important;
  }

  .footer-link:hover {
    color: var(--color-primary) !important;
    opacity: 1 !important;
  }

  .footer-scroll-btn:hover {
    background-color: var(--color-hover) !important;
  }

  /* Quick Links - White text in both themes */
  .footer-link {
    color: #ffffff !important;
    opacity: 0.9;
  }

  .footer-link:hover {
    color: var(--color-primary) !important;
    opacity: 1 !important;
  }

  /* Silver Theme - White text for footer links */
  [data-theme="purple"] .footer-link {
    color: #ffffff !important;
    opacity: 0.9;
  }

  [data-theme="purple"] .footer-link:hover {
    color: #8b95a1 !important;
    opacity: 1 !important;
  }

  [data-theme="purple"] .footer-contact-text {
    color: #ffffff !important;
  }

  /* Mobile accordion chevron animation */
  .footer-chevron {
    transition: transform 0.3s ease;
  }

  .footer-chevron.open {
    transform: rotate(180deg);
  }

  /* Mobile section dividers */
  @media (max-width: 767px) {
    .footer-mobile-section {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .footer-mobile-section:last-child {
      border-bottom: none;
    }
  }

`;

const Footer = ({ initialCategories = [] }) => {
  const [showTop, setShowTop] = useState(false);

  const [categories, setCategories] = useState(initialCategories);

  const [loading, setLoading] = useState(initialCategories.length === 0);


  // Mobile accordion state
  const [openSections, setOpenSections] = useState({ quickLinks: false, services: false });
  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // Quick links from settings API
  const [quickLinks, setQuickLinks] = useState([]);
  const [quickLinksLoading, setQuickLinksLoading] = useState(true);


  // Footer settings from API

  const [footerSettings, setFooterSettings] = useState({
    companyName: "Bellatrix",

    companyDescription:
      "Empowering your business with next-gen enterprise software solutions.",

    contactEmail: "info@bellatrix.com",

    contactPhone: "(555) 123-4567",

    contactAddress: "123 Business Avenue, Suite 500",

    facebook: "#",

    linkedin: "#",

    instagram: "#",

    youtube: "#",

    twitter: "#",

    copyrightText: "",
  });

  // Scroll to top handler

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show scroll-to-top button on scroll

  if (typeof window !== "undefined") {
    window.onscroll = () => {
      setShowTop(window.scrollY > 200);
    };
  }

  // Fetch footer settings from API

  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        console.log(" [Footer] Fetching settings from /api/Settings/public");

        const response = await getPublicDictionary();

        if (response.success && response.data) {
          console.log(" [Footer] Settings loaded:", response.data);

          // Map API keys to footer settings

          const apiData = response.data;

          const newSettings = {
            companyName:
              apiData.company_name || apiData.siteTitle || "Bellatrix",

            companyDescription:
              apiData.company_tagline ||
              "Empowering your business with next-gen enterprise software solutions.",

            contactEmail: apiData.company_email || "info@bellatrix.com",

            contactPhone: apiData.company_phone || "(555) 123-4567",

            contactAddress:
              apiData.company_address || "123 Business Avenue, Suite 500",

            facebook: apiData.facebook_link || "#",

            linkedin: apiData.social_linkedin || "#",

            instagram: apiData.social_instagram || "#",

            youtube: apiData.social_youtube || "#",

            twitter: apiData.twitter_link || "#",

            copyrightText: apiData.copyright_text || "",
          };

          setFooterSettings(newSettings);

          console.log(" [Footer] Settings applied:", newSettings);
        } else {
          console.warn(" [Footer] Failed to load settings, using defaults");
        }
      } catch (err) {
        console.error(" [Footer] Error loading settings:", err);

        // Keep default values on error
      }
    };

    fetchFooterSettings();
  }, []);

  // Fetch quick links from settings API
  useEffect(() => {
    const fetchQuickLinks = async () => {
      setQuickLinksLoading(true);
      try {
        const res = await getPublicDictionary();
        if (res.success && res.data && res.data.footer_quick_links) {
          const parsed = JSON.parse(res.data.footer_quick_links);
          setQuickLinks(Array.isArray(parsed) ? parsed : []);
        }
      } catch {
        // keep empty
      } finally {
        setQuickLinksLoading(false);
      }
    };
    fetchQuickLinks();
  }, []);

  // Fetch categories for Services column — skip if SSR data already provided
  useEffect(() => {
    if (initialCategories.length > 0) return;
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${getApiBaseUrlWithApi()}/Categories/navbar`);

        if (!res.ok) throw new Error("Failed to fetch categories");

        const json = await res.json();

        setCategories(Array.isArray(json.data) ? json.data : []);
      } catch {
        // categories unavailable — services column will show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [initialCategories]);

  return (
    <footer
      className="relative text-white pt-0 pb-8 px-0 overflow-hidden border-t-4 shadow-inner"
      style={{
        backgroundColor: "var(--color-brand-dark-navy)",

        borderTopColor: "var(--color-border-secondary)",
      }}
    >
      <style>{footerStyles}</style>

      <SEO
        title="Contact Bellatrix | Bellatrix Consulting & Support Information"
        description="Get in touch with Bellatrix for Bellatrix consulting, implementation, and support services. Contact information and company details."
        keywords="contact Bellatrix, NetSuite support contact, Oracle consulting contact, business hours, company information, get in touch"
        ogTitle="Contact Bellatrix | Bellatrix Consulting Company"
        ogDescription="Contact Bellatrix for expert Bellatrix consulting and implementation services. Get in touch with our team of specialists."
        ogImage="/images/bellatrix-contact-footer.jpg"
        twitterCard="summary_large_image"
      />

      {/* Top border glow */}

      <div
        className="absolute top-0 left-0 w-full h-2 blur-lg opacity-60 z-0"
        style={{
          background:
            "linear-gradient(to right, var(--color-border-secondary), var(--color-primary), var(--color-border-secondary))",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-8 md:py-12">

          {/* Brand Column */}
          <div className="footer-mobile-section flex flex-col items-center lg:items-start gap-4 py-8 md:py-0">
            <h3
              className="text-3xl font-extrabold tracking-tight drop-shadow"
              style={{ color: "var(--color-text-inverse)" }}
            >
              {footerSettings.companyName}
            </h3>

            <p
              className="text-center lg:text-left max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--color-white)" }}
            >
              {footerSettings.companyDescription}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-1">
              {[
                { icon: <Twitter />, href: footerSettings.twitter, label: "Twitter" },
                { icon: <LinkedIn />, href: footerSettings.linkedin, label: "LinkedIn" },
                { icon: <Facebook />, href: footerSettings.facebook, label: "Facebook" },
                { icon: <Instagram />, href: footerSettings.instagram, label: "Instagram" },
                { icon: <YouTube />, href: footerSettings.youtube, label: "YouTube" },
              ]
                .filter((item) => item.href && item.href.trim() !== "" && item.href !== "#")
                .map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link p-2.5 rounded-full transition-all duration-300 shadow hover:scale-110 active:scale-95"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}
                    aria-label={item.label}
                  >
                    <span className="transition-colors duration-300 flex items-center justify-center">
                      {item.icon}
                    </span>
                  </a>
                ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-mobile-section md:flex md:flex-col md:items-start md:gap-3">
            {/* Mobile: collapsible header */}
            <button
              className="md:hidden w-full flex items-center justify-between py-4"
              onClick={() => toggleSection("quickLinks")}
              aria-expanded={openSections.quickLinks}
            >
              <h4 className="text-lg font-semibold" style={{ color: "var(--color-text-inverse)" }}>
                Quick Links
              </h4>
              <KeyboardArrowDown
                className={`footer-chevron ${openSections.quickLinks ? "open" : ""}`}
                style={{ color: "var(--color-text-inverse)", opacity: 0.7 }}
              />
            </button>

            {/* Desktop: static header */}
            <h4
              className="hidden md:block text-xl font-semibold mb-2"
              style={{ color: "var(--color-text-inverse)" }}
            >
              Quick Links
            </h4>

            <ul
              className={`flex-col gap-2 pb-4 md:pb-0 ${openSections.quickLinks ? "flex" : "hidden"} md:flex`}
              style={{ color: "var(--color-text-inverse)" }}
            >
              {quickLinksLoading ? (
                <li style={{ opacity: 0.6 }}>Loading...</li>
              ) : quickLinks.length === 0 ? (
                <li style={{ opacity: 0.6 }}>No links available</li>
              ) : (
                quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.url}
                      className="footer-link transition-colors duration-300 cursor-pointer text-sm md:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Our Services Column */}
          <div className="footer-mobile-section md:flex md:flex-col md:items-start md:gap-3">
            {/* Mobile: collapsible header */}
            <button
              className="md:hidden w-full flex items-center justify-between py-4"
              onClick={() => toggleSection("services")}
              aria-expanded={openSections.services}
            >
              <h4 className="text-lg font-semibold" style={{ color: "var(--color-text-inverse)" }}>
                Our Services
              </h4>
              <KeyboardArrowDown
                className={`footer-chevron ${openSections.services ? "open" : ""}`}
                style={{ color: "var(--color-text-inverse)", opacity: 0.7 }}
              />
            </button>

            {/* Desktop: static header */}
            <h4
              className="hidden md:block text-xl font-semibold mb-2"
              style={{ color: "var(--color-text-inverse)" }}
            >
              Our Services
            </h4>

            <div
              className={`pb-4 md:pb-0 ${openSections.services ? "block" : "hidden"} md:block`}
              style={{ color: "var(--color-text-inverse)" }}
            >
              {loading ? (
                <span style={{ opacity: 0.6 }}>Loading...</span>
              ) : (
                (() => {
                  const servicesCategory = categories.find(
                    (cat) => cat.name?.toLowerCase() === "services"
                  );

                  const servicePages = servicesCategory
                    ? (servicesCategory.pages || [])
                        .filter((page) => page.isPublished === true)
                        .map((page) => ({
                          id: page.id,
                          title: page.title,
                          href: page.slug ? `/${page.slug}` : `/${page.id}`,
                        }))
                    : [];

                  if (servicePages.length === 0) {
                    return <span style={{ opacity: 0.6 }}>No services available</span>;
                  }

                  const useGrid = servicePages.length > 6;

                  return (
                    <div className={useGrid ? "grid grid-cols-2 gap-x-6 gap-y-2" : "flex flex-col gap-2"}>
                      {servicePages.map((page) => (
                        <a
                          key={page.id}
                          href={page.href}
                          className="footer-link transition-colors duration-300 text-sm md:text-base"
                        >
                          {page.title}
                        </a>
                      ))}
                    </div>
                  );
                })()
              )}
            </div>
          </div>

          {/* Contact Column */}
          <div
            className="footer-mobile-section flex flex-col items-start gap-3 text-sm footer-contact-text py-6 md:py-0"
            style={{ color: "var(--color-text-inverse)" }}
          >
            <h4
              className="text-lg md:text-xl font-semibold mb-1"
              style={{ color: "var(--color-text-inverse)" }}
            >
              Contact Us
            </h4>

            <div className="flex flex-col gap-3 footer-contact-text w-full">
              <div className="flex items-start gap-2">
                <Email fontSize="small" style={{ marginTop: 2, flexShrink: 0 }} />
                <span className="break-all">{footerSettings.contactEmail}</span>
              </div>

              <div className="leading-snug" style={{ color: "var(--color-white)" }}>
                {footerSettings.contactAddress}
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-medium" style={{ color: "var(--color-white)" }}>Phone</span>
                {(() => {
                  let phones = [];
                  try {
                    const parsed = JSON.parse(footerSettings.contactPhone);
                    phones = Array.isArray(parsed) ? parsed : [footerSettings.contactPhone];
                  } catch {
                    phones = [footerSettings.contactPhone];
                  }

                  const normalised = phones
                    .map((p) =>
                      typeof p === "string"
                        ? { flag: "", number: p }
                        : { flag: p.flag || "", number: p.number || "" }
                    )
                    .filter((p) => p.number && p.number.trim());

                  if (normalised.length === 0) return null;

                  return (
                    <div className="flex flex-col gap-1">
                      {normalised.map((p, index) => (
                        <span key={index}>
                          {p.flag ? `${p.flag} ` : ""}{p.number}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        <div
          className="text-center py-5 text-xs px-4"
          style={{
            color: "var(--color-text-inverse)",
            opacity: 0.65,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p>
            {footerSettings.copyrightText ||
              `© ${new Date().getFullYear()} ${footerSettings.companyName}. All rights reserved.`}
          </p>
        </div>

        {/* Scroll to Top Button */}

        {showTop && (
          <button
            onClick={handleScrollTop}
            className="footer-scroll-btn fixed bottom-8 right-8 z-50 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform animate-bounce"
            style={{
              backgroundColor: "var(--color-primary)",
            }}
            aria-label="Scroll to top"
          >
            <ArrowUpward />
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
