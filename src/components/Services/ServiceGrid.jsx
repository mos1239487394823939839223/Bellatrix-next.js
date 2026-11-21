import React from 'react';
import Link from 'next/link';
import CTAButton from '../CTAButton';



const ServiceGrid = ({ data = {} }) => {

  const defaultServices = [

    {

      title: "NetSuite Implementation",

      description: "Complete NetSuite setup and configuration tailored to your business needs.",

      icon: "",

      features: ["System Configuration", "Data Migration", "Custom Workflows", "User Training"]

    },

    {

      title: "Training & Support",

      description: "Comprehensive training programs to maximize your NetSuite investment.",

      icon: "",

      features: ["User Training", "Admin Training", "Custom Reports", "Ongoing Support"]

    },

    {

      title: "Customization",

      description: "Tailored solutions to meet your specific business requirements.",

      icon: "",

      features: ["Custom Fields", "Scripts", "Workflows", "Integrations"]

    },

    {

      title: "Integration Services",

      description: "Seamlessly connect NetSuite with your existing business systems.",

      icon: "",

      features: ["API Integration", "Data Sync", "Third-party Apps", "Legacy Systems"]

    },

    {

      title: "Consulting",

      description: "Expert guidance for optimizing your NetSuite implementation.",

      icon: "",

      features: ["Best Practices", "Process Optimization", "Strategy Planning", "ROI Analysis"]

    },

    {

      title: "Support & Maintenance",

      description: "Ongoing support to ensure your NetSuite runs smoothly.",

      icon: "",

      features: ["24/7 Support", "System Updates", "Performance Monitoring", "Issue Resolution"]

    }

  ];
  // Enhanced dynamic data handling
  
  const hasData = data && Object.keys(data).length > 0;
  const services = (hasData && data.services) ? data.services : defaultServices;
  const title = (hasData && data.title) ? data.title : "Our Services";
  const subtitle = (hasData && data.subtitle) ? data.subtitle : "Comprehensive NetSuite solutions to drive your business forward";
  
  // const bottomCTA = (hasData && data.bottomCTA) ? data.bottomCTA : {
  //   text: "Ready to transform your business with NetSuite?",
  //   buttonText: "Get Started Today"
  // };



  return (

    <section className="py-20 bg-gray-50">

      <div className="container mx-auto px-6">

        {/* Header */}

        <div className="text-center mb-16">

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">

            {title}

          </h2>

          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">

            {subtitle}

          </p>

        </div>



        {/* Services Grid */}

        {/* Phones: one swipeable row with the next card peeking in (instead of ~3000px of stacked cards).
            md+: regular grid. */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 md:auto-rows-fr gap-4 md:gap-8 max-w-7xl mx-auto overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-4 -mx-4 px-4 md:mx-auto md:px-0 pb-4 md:pb-0 [scrollbar-width:thin]">

          {services.map((service, index) => (

            <div

              key={index}

              // flex column + mt-auto on the CTA keeps buttons aligned across a row
              className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-auto flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 md:p-8 border border-gray-200 hover:border-blue-300 group"

            >

              {/* Icon (only when set — avoids an empty gap above the title) */}
              {service.icon && (
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                  {service.icon}
                </div>
              )}



              {/* Title & Description */}

              <div className="mb-5">

                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">

                  {service.title || "Service"}

                </h3>

                <p className="text-gray-600 leading-relaxed">

                  {service.description || "Service description"}

                </p>

              </div>



              {/* Features */}

              {service.features && service.features.length > 0 && (

                <ul className="space-y-2.5 border-t border-gray-100 pt-5">

                  {service.features.map((feature, idx) => (

                    <li key={idx} className="flex items-start text-sm text-gray-700">

                      <svg aria-hidden="true" className="w-4 h-4 text-green-500 mr-2.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />

                      </svg>

                      <span>{String(feature).trim()}</span>

                    </li>

                  ))}

                </ul>

              )}



              {/* CTA Button */}

              <div className="mt-auto pt-7">
                {service.link || service.href ? (
                  // CMS supplied a page for this service — navigate there
                  <Link
                    href={service.link || service.href}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    {service.ctaText || "Learn more"}
                    <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                ) : (
                  // No page to link to — the button opens the contact form, so say so
                  <CTAButton
                    variant="primary"
                    size="md"
                    className="w-full rounded-lg transition-all duration-300"
                    modalConfig={{
                      title: service.title || "Talk to an expert",
                      subtitle: service.description || "Let's discuss how we can help you",
                      icon: service.icon || ""
                    }}
                  >
                    {service.ctaText || "Talk to an expert"}
                  </CTAButton>
                )}
              </div>

            </div>

          ))}

        </div>



        {/* Bottom CTA */}

        {/* <div className="text-center mt-16"> */}

          {/* <p className="text-gray-600 mb-6">

            {bottomCTA.text}

          </p> */}

          {/* <CTAButton
            variant="primary"
            size="lg"
            className="rounded-lg shadow-lg hover:shadow-xl"
            modalConfig={{
              title: "Get Started with NetSuite",
              subtitle: "Let's discuss how we can help transform your business",
              icon: ""
            }}
          >
            {bottomCTA.buttonText}
          </CTAButton> */}

        </div>

      {/* </div> */}

    </section>

  );

};



export default ServiceGrid;
