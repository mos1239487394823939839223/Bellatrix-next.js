'use client'
import { useState } from "react";
import SEO from "./SEO";
import Link from "next/link";

import {

  LightbulbOutlined,

  BuildOutlined,

  SchoolOutlined,

  SettingsOutlined,

  LinkOutlined,

  ArrowForward,

  CheckCircle,

  TrendingUp,

} from "@mui/icons-material";

import ContactForm from "./ContactForm";

import Modal from "./Modal";

import CTAButton from "./CTAButton";



// Icon mapping for dynamic icon rendering

const iconMap = {

  LightbulbOutlined: <LightbulbOutlined fontSize="large" />,

  BuildOutlined: <BuildOutlined fontSize="large" />,

  SchoolOutlined: <SchoolOutlined fontSize="large" />,

  SettingsOutlined: <SettingsOutlined fontSize="large" />,

  LinkOutlined: <LinkOutlined fontSize="large" />,

};



const Services = ({

  services: propsServices = [],

  sectionHeader: propsSectionHeader = {},

  viewAllButton: propsViewAllButton = {},

  data,

}) => {

  // PRIORITIZE props data over default data for real-time preview

  const services = propsServices.length > 0 ? propsServices : (data?.services || []);

  const sectionHeader = Object.keys(propsSectionHeader).length > 0 ? propsSectionHeader : (data?.sectionHeader || {});

  const viewAllButton = Object.keys(propsViewAllButton).length > 0 ? propsViewAllButton : (data?.viewAllButton || {});





  const [showAllServices, setShowAllServices] = useState(false);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [selectedService, setSelectedService] = useState(null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);



  const openServiceModal = (service) => {

    setSelectedService(service);

    setIsServiceModalOpen(true);

  };



  const closeServiceModal = () => {

    setIsServiceModalOpen(false);

    setSelectedService(null);

  };



  const openContactModal = () => {

    setIsContactModalOpen(true);

  };



  const closeContactModal = () => {

    setIsContactModalOpen(false);

  };





  // Show only first 4 services initially, or all if showAllServices is true

  const displayedServices = showAllServices ? services : services.slice(0, 4);



  return (

    <section className="bg-gray-50 py-12 light-section">

      <SEO

        title="Bellatrix Services | Implementation, Training & Support | Bellatrix"

        description="Comprehensive Bellatrix services including implementation, customization, training, and technical support. Expert consulting for digital transformation."

        keywords="NetSuite services, Oracle implementation, ERP training, NetSuite customization, technical support, business consulting, integration services"

        ogTitle="Bellatrix Services | Implementation & Consulting | Bellatrix"

        ogDescription="Expert Bellatrix services: implementation, training, support, and customization. Transform your business with our comprehensive consulting solutions."

        ogImage="/images/netsuite-services.jpg"

        twitterCard="summary_large_image"

      />



      <div className="container mx-auto px-6">

        {/* Section Header */}

        <header className="text-center mb-10">

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">

            {sectionHeader?.title ? (

              <>

                {sectionHeader.title

                  .split(sectionHeader.gradientText || "")

                  .map((part, i, arr) => (

                    <span key={i}>

                      {part}

                      {i < arr.length - 1 && sectionHeader.gradientText && (

                        <span className="text-blue-600">

                          {sectionHeader.gradientText}

                        </span>

                      )}

                    </span>

                  ))}

              </>

            ) : (

              <>

                Our <span className="text-blue-600">Professional Services</span>

              </>

            )}

          </h2>

          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">

            {sectionHeader?.subtitle ||

              "Comprehensive solutions designed to empower your business with the expertise you need to excel"}

          </p>

        </header>



        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* Image - Left Side */}

          <div className="flex-1 flex justify-center">

            <div className="relative group max-w-2xl">

              {/* Advanced Background Effects */}

              <div className="absolute -inset-8 opacity-30 group-hover:opacity-60 transition-all duration-700">

                {/* Multiple layered glows */}

                <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/20 via-cyan-500/30 to-blue-600/20 rounded-3xl blur-2xl"></div>

                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/15 via-purple-500/20 to-cyan-500/15 rounded-2xl blur-xl"></div>

                <div className="absolute -inset-2 bg-gradient-to-tr from-white/10 via-blue-300/20 to-white/10 rounded-xl blur-lg"></div>

              </div>



              {/* Professional Container with Multi-layer Design */}

              <div className="relative bg-gradient-to-br from-gray-900/10 via-blue-900/5 to-gray-900/10 rounded-3xl p-6 backdrop-blur-md border border-white/30 shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500">

                {/* Inner glow container */}

                <div className="relative bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 rounded-2xl p-4 border border-white/20">

                  <img

                    src="/images/ourProServices.png"

                    alt="Professional Services - Advanced NetSuite Solutions"

                    className="w-full h-auto rounded-xl shadow-2xl brightness-105 contrast-110 saturate-105 group-hover:brightness-110 group-hover:contrast-115 group-hover:saturate-110 transition-all duration-500 filter drop-shadow-xl"

                  />



                  {/* Professional overlay effects */}

                  <div className="absolute inset-4 rounded-xl bg-gradient-to-tr from-blue-500/5 via-transparent via-transparent to-cyan-400/5 pointer-events-none"></div>

                  <div className="absolute inset-4 rounded-xl bg-gradient-to-bl from-transparent via-white/3 to-transparent pointer-events-none"></div>

                </div>



                {/* Advanced Floating Tech Elements */}

                <div className="absolute top-3 right-3">

                  <div className="relative">

                    <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse shadow-lg"></div>

                    <div className="absolute inset-0 w-4 h-4 bg-blue-400/30 rounded-full animate-ping"></div>

                  </div>

                </div>



                <div className="absolute bottom-6 left-6">

                  <div className="relative">

                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full animate-pulse shadow-md"></div>

                    <div className="absolute -inset-1 w-5 h-5 bg-cyan-400/20 rounded-full animate-ping"></div>

                  </div>

                </div>



                <div className="absolute top-1/2 right-6">

                  <div className="relative">

                    <div className="w-2 h-2 bg-white/90 rounded-full animate-pulse shadow-sm"></div>

                    <div className="absolute -inset-1 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>

                  </div>

                </div>



                <div className="absolute top-1/4 left-8">

                  <div className="w-2 h-2 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full animate-pulse opacity-70"></div>

                </div>



                <div className="absolute bottom-1/3 right-12">

                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-white to-blue-200 rounded-full animate-pulse opacity-80"></div>

                </div>



                {/* Professional corner accents */}

                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400/40 rounded-tl-3xl"></div>

                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-3xl"></div>

                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400/40 rounded-bl-3xl"></div>

                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/40 rounded-br-3xl"></div>



                {/* Data visualization lines */}

                <div className="absolute top-4 left-1/4 w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>

                <div className="absolute bottom-8 right-1/4 w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent"></div>

                <div className="absolute top-1/3 right-2 w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-300/50 to-transparent"></div>

              </div>



              {/* Professional Badge */}

              <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold opacity-90 group-hover:opacity-100 transition-opacity duration-300">

                <div className="flex items-center space-x-2">

                  <svg

                    className="w-4 h-4"

                    fill="none"

                    stroke="currentColor"

                    viewBox="0 0 24 24"

                  >

                    <path

                      strokeLinecap="round"

                      strokeLinejoin="round"

                      strokeWidth={2}

                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"

                    />

                  </svg>

                  <span>Expert Solutions</span>

                </div>

              </div>

            </div>

          </div>



          {/* Services Content - Right Side */}

          <div className="flex-1">

            {/* Professional Services Cards - Compact Version */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {displayedServices.map((service, index) =>

                service.link && service.link !== "#" ? (

                  <Link

                    key={service.title}

                    to={service.link}

                    className="text-center p-5 bg-white rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group transform hover:scale-105 block"

                  >

                    <article>
                      {/* Show image if available, otherwise show icon */}
                      {service.image ? (
                        <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${
                            index === 0
                              ? "from-blue-400 to-blue-600"
                              : index === 1
                              ? "from-blue-500 to-blue-700"
                              : index === 2
                              ? "from-blue-600 to-blue-800"
                              : index === 3
                              ? "from-blue-800 to-blue-900"
                              : "from-blue-700 to-blue-900"
                          } rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <div className="text-white">
                            {iconMap[service.icon] || (
                              <SettingsOutlined fontSize="large" />
                            )}
                          </div>
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {service.description}
                      </p>
                      <div className="mt-3">
                        <span className="text-s text-blue-600 font-medium">
                          Click to learn more
                        </span>
                      </div>
                    </article>
                  </Link>
                ) : (
                  <div
                    key={service.title}
                    onClick={() => openServiceModal(service)}
                    className="text-center p-5 bg-white rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group transform hover:scale-105"
                  >
                    <article>
                      {/* Show image if available, otherwise show icon */}
                      {service.image ? (
                        <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${
                            index === 0
                              ? "from-blue-400 to-blue-600"
                              : index === 1
                              ? "from-blue-500 to-blue-700"
                              : index === 2
                              ? "from-blue-600 to-blue-800"
                              : index === 3
                              ? "from-blue-800 to-blue-900"
                              : "from-blue-700 to-blue-900"
                          } rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <div className="text-white">
                            {iconMap[service.icon] || (
                              <SettingsOutlined fontSize="large" />
                            )}
                          </div>
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {service.description}
                      </p>
                      <div className="mt-3">
                        <span className="text-s text-blue-600 font-medium">
                          Click to learn more
                        </span>
                      </div>
                    </article>
                  </div>

                )

              )}

            </div>



            {/* View all button - only show if there are more than 4 services */}

            {services.length > 4 && (

              <div className="mt-6">

                <button

                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"

                  onClick={() => setShowAllServices(!showAllServices)}

                >

                  <span>

                    {showAllServices

                      ? "Show Less Services"

                      : viewAllButton?.text || "View All Services"}

                  </span>

                  <ArrowForward className="ml-2" fontSize="small" />

                </button>

              </div>

            )}

          </div>

        </div>

      </div>



      {/* Service Modal */}

      <Modal

        isOpen={isServiceModalOpen && selectedService}

        onClose={closeServiceModal}

        icon={iconMap[selectedService?.icon]}

        title={selectedService?.title}

        subtitle={selectedService?.description}

      >

        <div className="mb-6">

          <h4 className="text-lg font-bold text-gray-800 mb-3">

            Service Overview

          </h4>

          <p className="text-gray-700 leading-relaxed">

            {selectedService?.longDescription || selectedService?.description}

          </p>

        </div>

        {/* Service Features */}

        <div className="mb-6">

          <h4 className="text-lg font-bold text-gray-800 mb-3">

            What We Offer

          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {selectedService?.details &&

              selectedService.details.map((detail, index) => (

                <div key={index} className="flex items-start space-x-3">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span className="text-gray-700 leading-relaxed text-sm">

                    {detail}

                  </span>

                </div>

              ))}

          </div>

        </div>

        {/* Service Details */}

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">

          <h4 className="text-base font-bold text-gray-800 mb-3">

            Service Details

          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="text-center">

              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">

                <svg

                  className="w-5 h-5 text-blue-400"

                  fill="none"

                  stroke="currentColor"

                  viewBox="0 0 24 24"

                >

                  <path

                    strokeLinecap="round"

                    strokeLinejoin="round"

                    strokeWidth={2}

                    d="M13 10V3L4 14h7v7l9-11h-7z"

                  />

                </svg>

              </div>

              <h5 className="font-semibold text-gray-800 mb-1 text-xs">

                Delivery

              </h5>

              <p className="text-xs text-blue-400 font-bold">Fast & Reliable</p>

            </div>

            <div className="text-center">

              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">

                <svg

                  className="w-5 h-5 text-blue-400"

                  fill="none"

                  stroke="currentColor"

                  viewBox="0 0 24 24"

                >

                  <path

                    strokeLinecap="round"

                    strokeLinejoin="round"

                    strokeWidth={2}

                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"

                  />

                </svg>

              </div>

              <h5 className="font-semibold text-gray-800 mb-1 text-xs">

                Quality

              </h5>

              <p className="text-xs text-blue-400 font-bold">

                Professional Grade

              </p>

            </div>

            <div className="text-center">

              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">

                <svg

                  className="w-5 h-5 text-blue-400"

                  fill="none"

                  stroke="currentColor"

                  viewBox="0 0 24 24"

                >

                  <path

                    strokeLinecap="round"

                    strokeLinejoin="round"

                    strokeWidth={2}

                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"

                  />

                </svg>

              </div>

              <h5 className="font-semibold text-gray-800 mb-1 text-xs">

                Support

              </h5>

              <p className="text-xs text-blue-400 font-bold">24/7 Available</p>

            </div>

          </div>

        </div>

        {/* CTA Button */}

        <div className="text-center">

          <CTAButton

            variant="primary"

            size="md"

            className="hover:scale-105 hover:shadow-lg"

            modalConfig={{

              title: "Service Consultation Request",

              subtitle: "Let's discuss your service requirements and how we can help",

              icon: ""

            }}

          >

            Contact Us for This Service

          </CTAButton>

        </div>

      </Modal>



      {/* Contact Modal */}

      <Modal

        isOpen={isContactModalOpen}

        onClose={closeContactModal}

        title="Contact Us"

        subtitle="Let's discuss your project needs"

      >

        <div className="p-2">

          <ContactForm onSuccess={closeContactModal} />

        </div>

      </Modal>

    </section>

  );

};



export default Services;

