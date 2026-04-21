import { useState, useEffect } from "react";
import { getPublicDictionary } from "../services/settingsApi";
import { getApiBaseUrlWithApi } from "../config/api.js";

// Inline SVGs — replaces @mui/icons-material (removes Emotion/MUI from footer chunk)
const IconTwitter = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconYouTube = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
);
const IconEmail = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconArrowUp = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);
const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

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

  // Show scroll-to-top button on scroll — passive listener with proper cleanup
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch footer settings and quick links in a single parallel call
  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const res = await getPublicDictionary();
        if (!res.success || !res.data) return;
        const apiData = res.data;

        setFooterSettings({
          companyName: apiData.company_name || apiData.siteTitle || "Bellatrix",
          companyDescription: apiData.company_tagline || "Empowering your business with next-gen enterprise software solutions.",
          contactEmail: apiData.company_email || "info@bellatrix.com",
          contactPhone: apiData.company_phone || "(555) 123-4567",
          contactAddress: apiData.company_address || "123 Business Avenue, Suite 500",
          facebook: apiData.facebook_link || "#",
          linkedin: apiData.social_linkedin || "#",
          instagram: apiData.social_instagram || "#",
          youtube: apiData.social_youtube || "#",
          twitter: apiData.twitter_link || "#",
          copyrightText: apiData.copyright_text || "",
        });

        if (apiData.footer_quick_links) {
          try {
            const parsed = JSON.parse(apiData.footer_quick_links);
            setQuickLinks(Array.isArray(parsed) ? parsed : []);
          } catch { /* malformed JSON — keep empty */ }
        }
      } catch { /* keep defaults */ } finally {
        setQuickLinksLoading(false);
      }
    };
    loadFooterData();
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
                              { icon: <IconTwitter />, href: footerSettings.twitter, label: "Twitter" },
                { icon: <IconLinkedIn />, href: footerSettings.linkedin, label: "LinkedIn" },
                { icon: <IconFacebook />, href: footerSettings.facebook, label: "Facebook" },
                { icon: <IconInstagram />, href: footerSettings.instagram, label: "Instagram" },
                { icon: <IconYouTube />, href: footerSettings.youtube, label: "YouTube" },
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
          <div className="footer-mobile-section md:flex md:flex-col md:items-start md:gap-3 order-3 md:order-2">
            {/* Mobile: collapsible header */}
            <button
              className="md:hidden w-full flex items-center justify-between py-4"
              onClick={() => toggleSection("quickLinks")}
              aria-expanded={openSections.quickLinks}
            >
              <h4 className="text-lg font-semibold" style={{ color: "var(--color-text-inverse)" }}>
                Quick Links
              </h4>
              <IconChevronDown
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
          <div className="footer-mobile-section md:flex md:flex-col md:items-start md:gap-3 order-4 md:order-3">
            {/* Mobile: collapsible header */}
            <button
              className="md:hidden w-full flex items-center justify-between py-4"
              onClick={() => toggleSection("services")}
              aria-expanded={openSections.services}
            >
              <h4 className="text-lg font-semibold" style={{ color: "var(--color-text-inverse)" }}>
                Our Services
              </h4>
              <IconChevronDown
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
            className="footer-mobile-section flex flex-col items-start gap-3 text-sm footer-contact-text py-6 md:py-0 order-2 md:order-4"
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
                <IconEmail fontSize="small" style={{ marginTop: 2, flexShrink: 0 }} />
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
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="footer-scroll-btn fixed bottom-8 right-8 z-50 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform animate-bounce"
            style={{ backgroundColor: "var(--color-primary)" }}
            aria-label="Scroll to top"
          >
            <IconArrowUp />
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
