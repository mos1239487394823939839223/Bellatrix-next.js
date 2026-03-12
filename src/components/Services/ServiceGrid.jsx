import React from 'react';
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {services.map((service, index) => (

            <div

              key={index}

              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-blue-300 group"

            >

              {/* Icon */}

              <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">

                {service.icon || ""}

              </div>



              {/* Title & Description */}

              <div className="text-center mb-6">

                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">

                  {service.title || "Service"}

                </h3>

                <p className="text-gray-600 leading-relaxed">

                  {service.description || "Service description"}

                </p>

              </div>



              {/* Features */}

              {service.features && service.features.length > 0 && (

                <div className="space-y-2">

                  {service.features.map((feature, idx) => (

                    <div key={idx} className="flex items-center text-sm text-gray-700">

                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />

                      </svg>

                      <span>{feature}</span>

                    </div>

                  ))}

                </div>

              )}



              {/* CTA Button */}

              <div className="mt-6 text-center">

                <CTAButton
                  variant="primary"
                  size="md"
                  className="rounded-lg transition-all duration-300 transform group-hover:scale-105"
                  modalConfig={{
                    title: service.title || "Learn More",
                    subtitle: service.description || "Let's discuss how we can help you",
                    icon: service.icon || ""
                  }}
                >
                  Learn More
                </CTAButton>

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
