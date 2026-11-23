import React, { useState, useEffect } from "react";
import { staticContent } from "../../../services/StaticContentRepository";
import { Section, SectionHeader, Accordion } from "../../site";




const PayrollFAQ = ({ faqData = {} }) => {

  const [openIndex, setOpenIndex] = useState(null);

  const [defaultData, setDefaultData] = useState(null);



  // Default data for immediate display in live preview

  const staticDefaultData = {

    title: "Frequently Asked Questions",

    items: [

      {

        question: "How secure is my payroll data?",

        answer:

          "We use enterprise-grade security measures including 256-bit encryption, secure data centers, and compliance with SOC 2 standards to protect your sensitive payroll information.",

      },

      {

        question: "Can I integrate with my existing systems?",

        answer:

          "Yes, our payroll solution integrates with popular HR systems, accounting software, and time tracking tools through our robust API and pre-built connectors.",

      },

      {

        question: "How long does implementation take?",

        answer:

          "Most companies are onboarded in less than 2 weeks with our streamlined implementation process.",

      },

      {

        question: "Is the platform secure?",

        answer:

          "Yes, we use enterprise-grade security with SOC 2 compliance and 256-bit encryption.",

      },

      {

        question: "Can employees access their payroll information?",

        answer:

          "Absolutely! Employees can access their payslips, tax documents, and payroll history through our self-service portal.",

      },

    ],

  };



  useEffect(() => {

    // Only fetch additional data if no props data is provided

    if (!faqData || Object.keys(faqData).length === 0) {

      const fetchData = async () => {

        try {

          const data = await staticContent.load("payroll");

          setDefaultData(data.faqs);

        } catch (error) {

          console.error("Failed to load payroll data:", error);

          // Use static default data as fallback

          setDefaultData(staticDefaultData);

        }

      };

      fetchData();

    }

  }, [faqData]);



  // PRIORITIZE props data over default data for real-time preview

  const displayFaqData = {

    title: faqData.title || defaultData?.title || staticDefaultData.title,

    items: faqData.items || defaultData?.items || staticDefaultData.items,

  };



  // Ensure we always have data to display

  if (!displayFaqData.items || displayFaqData.items.length === 0) {

    displayFaqData.items = staticDefaultData.items;

  }



  // Debug logging for real-time updates

  console.log(" [PayrollFAQ] Component received data:", {

    hasPropsData: !!(faqData && Object.keys(faqData).length > 0),

    propsData: faqData,

    hasDefaultData: !!defaultData,

    finalData: displayFaqData,

    timestamp: new Date().toISOString()

  });






  return (
    <Section tone="muted" band={false} width="md" containerClassName="container px-6">
      <SectionHeader
        title={displayFaqData.title}
        className="mb-12"
        titleClassName="payroll-faq-title text-3xl md:text-4xl font-bold"
      />
      <Accordion variant="card" items={displayFaqData.items} openIndex={openIndex} onToggle={(i) => setOpenIndex(i)} />
    </Section>
  );
};



export default PayrollFAQ;

