import React, { useState, useEffect } from "react";
import { staticContent } from "../../../services/StaticContentRepository";
import { Section, SectionHeader, Accordion } from "../../site";

const FAQSection = ({ data, openFAQ, setOpenFAQ }) => {
  // استخدم useState داخلي إذا لم يتم تمرير setOpenFAQ
  const [internalOpenFAQ, setInternalOpenFAQ] = useState(null);
  const isControlled = typeof setOpenFAQ === "function";
  const [defaultData, setDefaultData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await staticContent.load("hr");
        setDefaultData(jsonData.faq);
      } catch (error) {
        console.error("Failed to load HR data:", error);
        // Fallback data
        setDefaultData({
          title: "Frequently Asked Questions",
          items: [
            {
              q: "Is my employee data secure and compliant?",
              a:
                "Yes. We use enterprise-grade 256-bit encryption, regular security audits, and are fully GDPR, SOC 2, and ISO 27001 compliant.",
            },
            {
              q:
                "Can I integrate with my existing payroll and accounting software?",
              a:
                "Absolutely. We offer pre-built integrations with all major payroll providers and accounting software.",
            },
          ],
        });
      }
    };
    fetchData();
  }, []);

  // PRIORITIZE props data over default data for real-time preview
  // Handle different data structures from dynamic schema generator
  let faqData;

  if (data?.faq) {
    // Standard structure: { faq: { title, items } }
    faqData = data.faq;
  } else if (data?.title && data?.faqItems) {
    // Dynamic schema structure: { title, faqItems }
    faqData = {
      title: data.title,
      items: data.faqItems || [],
    };
  } else if (data?.items) {
    // Direct items structure: { items }
    faqData = {
      title: data.title || "Frequently Asked Questions",
      items: data.items || [],
    };
  } else if (defaultData) {
    // Use default data
    faqData = defaultData;
  } else {
    // Ultimate fallback
    faqData = {
      title: "Frequently Asked Questions",
      items: [],
    };
  }

  const displayData = { faq: faqData };

  // Debug logging for real-time updates
  console.log(" [HRFAQSection] Component received data:", {
    hasPropsData: !!(data && data.faq),
    propsData: data,
    hasDefaultData: !!defaultData,
    finalData: displayData,
    timestamp: new Date().toISOString(),
  });
  return (
    <Section tone="light" width="md" className="bg-[var(--color-bg-primary)]/90 animate-fade-in-up">
      <SectionHeader title={displayData.faq.title} titleClassName="text-3xl font-bold" />
      <Accordion
        variant="line"
        items={displayData.faq?.items || []}
        {...(isControlled
          ? { openIndex: openFAQ, onToggle: setOpenFAQ }
          : { openIndex: internalOpenFAQ, onToggle: setInternalOpenFAQ })}
      />
    </Section>
  );
};

export default FAQSection;
