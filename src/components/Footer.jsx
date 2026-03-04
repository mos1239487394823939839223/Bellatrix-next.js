import {
  Facebook,
  Twitter,
  LinkedIn,
  Email,
  ArrowUpward,
  Instagram,
  YouTube,
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

    color: #8b95a1 !important; /* silver-400 - medium silver */

    opacity: 1 !important;

  }

  [data-theme="purple"] .footer-contact-text {

    color: #b0b8c1 !important; /* silver-300 - same as quick links */

  }

`;

const Footer = ({ initialCategories = [] }) => {
  const [showTop, setShowTop] = useState(false);

  const [categories, setCategories] = useState(initialCategories);

  const [loading, setLoading] = useState(initialCategories.length === 0);

  const [error, setError] = useState(null);

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

  // Fetch categories for Quick Links — skip if SSR data already provided
  useEffect(() => {
    if (initialCategories.length > 0) return;
    const fetchCategories = async () => {
      try {
        setLoading(true);

        setError(null);

        const res = await fetch(`${getApiBaseUrlWithApi()}/Categories/navbar`);

        if (!res.ok) throw new Error("Failed to fetch categories");

        const json = await res.json();

        setCategories(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        setError(err.message || "Error loading categories");
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Brand Column */}

          <div className="flex flex-col items-center lg:items-start gap-4">
            <h3
              className="text-3xl font-extrabold tracking-tight drop-shadow"
              style={{ color: "var(--color-text-inverse)" }}
            >
              {footerSettings.companyName}
            </h3>

            <p
              className="text-center lg:text-left max-w-xs"
              style={{ color: "var(--color-text-inverse)", opacity: 0.8 }}
            >
              {footerSettings.companyDescription}
            </p>

            <div className="flex space-x-4 mt-2">
              {[
                {
                  icon: <Twitter fontSize="medium" />,

                  href: footerSettings.twitter,

                  label: "Twitter",
                },

                {
                  icon: <LinkedIn fontSize="medium" />,

                  href: footerSettings.linkedin,

                  label: "LinkedIn",
                },

                {
                  icon: <Facebook fontSize="medium" />,

                  href: footerSettings.facebook,

                  label: "Facebook",
                },

                {
                  icon: <Instagram fontSize="medium" />,

                  href: footerSettings.instagram,

                  label: "Instagram",
                },

                {
                  icon: <YouTube fontSize="medium" />,

                  href: footerSettings.youtube,

                  label: "YouTube",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link group p-2 rounded-full transition-colors duration-300 shadow hover:scale-110"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  aria-label={item.label}
                >
                  <span className="transition-colors duration-300">
                    {item.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}

          <div className="flex flex-col items-center lg:items-start gap-3">
            <h4
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--color-text-inverse)" }}
            >
              Quick Links
            </h4>

            <ul className="flex flex-col gap-2" style={{ color: "#ffffff" }}>
              {loading ? (
                <li style={{ color: "var(--color-text-muted)" }}>Loading...</li>
              ) : error ? (
                <li style={{ color: "var(--color-error)" }}>{error}</li>
              ) : categories.length === 0 ? (
                <li style={{ color: "var(--color-text-muted)" }}>
                  No links available
                </li>
              ) : (
                categories.map((cat) => {
                  // Check if category is Home or About (case-insensitive)
                  const isHomeOrAbout = ["home", "about"].includes(
                    cat.name?.toLowerCase(),
                  );

                  // Get main page URL from category data
                  const nameSlug = cat.name?.toLowerCase().replace(/\s+/g, "-");
                  const mainPageUrl = cat.mainPageSlug
                    ? `/${cat.mainPageSlug}`
                    : cat.pages && cat.pages.length > 0
                    ? cat.pages[0].slug
                      ? `/${cat.pages[0].slug}`
                      : `/${cat.pages[0].id}`
                    : `/${nameSlug || ""}`;

                  // For Home/About categories - direct link to main page
                  if (isHomeOrAbout) {
                    return (
                      <li key={cat.id}>
                        <a
                          href={mainPageUrl}
                          className="footer-link transition-colors duration-300 cursor-pointer"
                        >
                          {cat.name}
                        </a>
                      </li>
                    );
                  }

                  // For other categories - check for homepage in pages
                  const homePage = Array.isArray(cat.pages)
                    ? cat.pages.find((p) => p.isHomepage)
                    : null;

                  if (homePage) {
                    return (
                      <li key={cat.id}>
                        <a
                          href={`/${homePage.slug}`}
                          className="footer-link transition-colors duration-300 cursor-pointer"
                        >
                          {cat.name}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={cat.id}>
                      {cat.pages && cat.pages.length > 0 ? (
                        (() => {
                          const homePage = cat.pages.find((p) => p.isHomepage);

                          return homePage ? (
                            <a
                              href={`/pages/${homePage.slug}`}
                              className="footer-link transition duration-200 cursor-pointer"
                            >
                              {cat.name}
                            </a>
                          ) : (
                            <span style={{ color: "#ffffff", opacity: 0.9 }}>
                              {cat.name}
                            </span>
                          );
                        })()
                      ) : (
                        <span style={{ color: "#ffffff", opacity: 0.9 }}>
                          {cat.name}
                        </span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Our Services Column */}

          <div className="flex flex-col items-center lg:items-start gap-3">
            <h4
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--color-text-inverse)" }}
            >
              Our Services
            </h4>

            <div
              style={{ color: "var(--color-text-inverse)", opacity: 0.8 }}
            >
              {loading ? (
                <span style={{ color: "var(--color-text-muted)" }}>Loading...</span>
              ) : (
                (() => {
                  const servicePages = categories
                    .filter(cat => !["home", "about"].includes(cat.name?.toLowerCase()))
                    .flatMap(cat =>
                      (cat.pages || [])
                        .filter(page => page.isPublished === true)
                        .map(page => ({
                          id: page.id,
                          title: page.title,
                          href: page.slug ? `/${page.slug}` : `/${page.id}`,
                        }))
                    );

                  if (servicePages.length === 0) {
                    return <span style={{ opacity: 0.6 }}>No services available</span>;
                  }

                  const useGrid = servicePages.length > 6;

                  return (
                    <div
                      className={
                        useGrid
                          ? "grid grid-cols-2 gap-x-6 gap-y-2"
                          : "flex flex-col gap-2"
                      }
                    >
                      {servicePages.map(page => (
                        <a
                          key={page.id}
                          href={page.href}
                          className="footer-link transition-colors duration-300"
                          style={{ color: "inherit" }}
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
            className="flex flex-col items-center lg:items-start gap-3 text-sm footer-contact-text"
            style={{ color: "var(--color-text-inverse)", opacity: 0.9 }}
          >
            <h4
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--color-text-inverse)" }}
            >
              Contact Us
            </h4>

            <div className="flex flex-col gap-2 footer-contact-text">
              <div className="flex items-center gap-2">
                <Email fontSize="small" />

                <span>{footerSettings.contactEmail}</span>
              </div>

              <div>{footerSettings.contactAddress}</div>

              <div>
                <span>Phone: </span>
                {(() => {
                  // Try to parse as JSON array for multiple phones
                  let phones = [];
                  try {
                    const parsed = JSON.parse(footerSettings.contactPhone);
                    phones = Array.isArray(parsed)
                      ? parsed
                      : [footerSettings.contactPhone];
                  } catch {
                    phones = [footerSettings.contactPhone];
                  }

                  const filteredPhones = phones.filter(
                    (p) => p && p.trim && p.trim(),
                  );

                  // Single phone - display inline
                  if (filteredPhones.length === 1) {
                    return <span>{filteredPhones[0]}</span>;
                  }

                  // Multiple phones - display stacked
                  return (
                    <div className="mt-1 space-y-1 pl-6">
                      {filteredPhones.map((phone, index) => (
                        <div key={index}>{phone}</div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        <div
          className="text-center pt-6 text-xs"
          style={{
            color: "var(--color-text-inverse)",

            opacity: 0.7,

            borderTop: "1px solid",

            borderColor: "var(--color-border-primary)",

            borderTopOpacity: 0.4,
          }}
        >
          <p>
            {footerSettings.copyrightText ||
              `© ${new Date().getFullYear()} ${
                footerSettings.companyName
              }. All rights reserved.`}
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
