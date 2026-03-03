import { useState } from "react";

import SEO from "./SEO";
import CTAButton from "./CTAButton";

import {

  Factory,

  Store,

  Work as Briefcase,

  LocalShipping as Package,

  ArrowRightAlt,

  CheckCircle,

  ExpandMore,

  ExpandLess,

} from "@mui/icons-material";



// Icon mapping for dynamic icon rendering

const iconMap = {

  Factory: <Factory className="w-7 h-7" />,

  Store: <Store className="w-7 h-7" />,

  Briefcase: <Briefcase className="w-7 h-7" />,

  Package: <Package className="w-7 h-7" />,

};



const Industries = ({ industries: propsIndustries = [], sectionHeader: propsSectionHeader = {}, data }) => {

  // PRIORITIZE props data over default data for real-time preview

  const industries = propsIndustries.length > 0 ? propsIndustries : (data?.industries || []);

  const sectionHeader = Object.keys(propsSectionHeader).length > 0 ? propsSectionHeader : (data?.sectionHeader || {});





  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalIndustry, setModalIndustry] = useState(null);



  const openModal = (industry) => {

    setModalIndustry(industry);

    setIsModalOpen(true);

  };



  const closeModal = () => {

    setIsModalOpen(false);

    setModalIndustry(null);

  };



  return (

    <section className="bg-gray-50 py-20 light-section">

      <SEO

        title="Industry-Specific NetSuite Solutions | Manufacturing, Retail & More | Bellatrix"

        description="Specialized Bellatrix solutions for manufacturing, retail, e-commerce, and other industries. Tailored ERP implementations for sector-specific needs."

        keywords="industry NetSuite solutions, manufacturing ERP, retail NetSuite, e-commerce solutions, sector-specific implementation, industry consulting"

        ogTitle="Industry Solutions | NetSuite for Manufacturing, Retail & More | Bellatrix"

        ogDescription="Discover industry-specific Bellatrix solutions tailored for manufacturing, retail, e-commerce and other sectors. Expert implementation and consulting."

        ogImage="/images/industry-solutions.jpg"

        twitterCard="summary_large_image"

      />



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}

        <header className="text-center mb-16">

          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-6">

            {sectionHeader?.chipLabel || "INDUSTRY SOLUTIONS"}

          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">

            {sectionHeader?.title ? (

              <>

                {sectionHeader.title

                  .split(sectionHeader.highlightedWord || "")

                  .map((part, i, arr) => (

                    <span key={i}>

                      {part}

                      {i < arr.length - 1 && sectionHeader.highlightedWord && (

                        <span className="text-blue-600">

                          {sectionHeader.highlightedWord}

                        </span>

                      )}

                    </span>

                  ))}

              </>

            ) : (

              <>

                Discover <span className="text-blue-600">Modern</span> Industry

                Solutions

              </>

            )}

          </h2>

          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">

            {sectionHeader?.description ||

              "Explore how our platform transforms your sector with tailored solutions."}

          </p>

        </header>



        {/* Main Content - Image on left, Industries on right */}

        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Left Side - Enhanced Image */}

          <div className="flex-1 flex justify-center">

            <div className="relative group max-w-xl">

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

                    src="/images/solution.jpg"

                    alt="Industry Solutions - Modern Business Technology"

                    className="w-full h-auto rounded-xl shadow-2xl brightness-105 contrast-110 saturate-105 group-hover:brightness-110 group-hover:contrast-115 group-hover:saturate-110 transition-all duration-500 filter drop-shadow-xl"

                  />



                  {/* Professional overlay effects */}

                  <div className="absolute inset-4 rounded-xl bg-gradient-to-tr from-blue-500/5 via-transparent to-cyan-400/5 pointer-events-none"></div>

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

                  <span>Industry Leader</span>

                </div>

              </div>

            </div>

          </div>



          {/* Right Side - Industries List */}

          <div className="flex-1">

            <h3 className="text-2xl font-bold text-gray-800 mb-6">

              Our Industry Expertise

            </h3>

            {/* Industries Accordion */}

            <div className="space-y-3">

              {industries.map((industry) => {

                const isOpen = selectedIndustry?.id === industry.id;

                return (

                  <article

                    key={industry.id}

                    className="border rounded-xl bg-white shadow-sm transition-all duration-300"

                  >

                    <button

                      className="w-full flex items-center justify-between px-4 py-3 focus:outline-none group"

                      onClick={() =>

                        setSelectedIndustry(isOpen ? null : industry)

                      }

                    >

                      <div className="flex items-center space-x-3">

                        <span className="text-blue-600">

                          {iconMap[industry.icon] || null}

                        </span>

                        <span className="font-semibold text-base text-gray-800">

                          {industry.label}

                        </span>

                      </div>

                      <span className="text-gray-400 group-hover:text-blue-600 transition-colors">

                        {isOpen ? <ExpandLess /> : <ExpandMore />}

                      </span>

                    </button>

                    {isOpen && (

                      <div className="px-6 pb-4 pt-1 animate-fade-in">

                        <div className="text-sm text-gray-700 mb-2 font-medium">

                          {industry.content.title}

                        </div>

                        <div className="text-xs text-gray-500 mb-3">

                          {industry.content.description?.slice(0, 120)}...

                        </div>

                        <button

                          className="inline-flex items-center px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-all duration-300 shadow"

                          onClick={() => {

                            openModal(industry);

                          }}

                        >

                          Learn More

                        </button>

                      </div>

                    )}

                  </article>

                );

              })}

            </div>

          </div>

        </div>

      </div>



      {/* Modal */}

      {isModalOpen && modalIndustry && (

        <div

          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4"

          onClick={closeModal}

        >

          <div

            className="bg-white rounded-3xl w-full max-w-xl relative shadow-2xl border-0 overflow-hidden animate-fade-in-up"

            onClick={(e) => e.stopPropagation()}

          >

            {/* Header */}

            <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-t-3xl p-7 text-white relative flex items-center gap-4">

              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shadow">

                <div className="text-white text-3xl">

                  {iconMap[modalIndustry.icon] || (

                    <Factory className="w-8 h-8" />

                  )}

                </div>

              </div>

              <div className="flex-1">

                <h3 className="text-2xl font-bold mb-1 leading-tight">

                  {modalIndustry.content.title}

                </h3>

                <p className="text-gray-200 text-sm">

                  {modalIndustry.label} Solutions

                </p>

              </div>

              <button

                onClick={closeModal}

                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"

                aria-label="Close"

              >

                <svg

                  className="w-6 h-6"

                  fill="none"

                  stroke="currentColor"

                  viewBox="0 0 24 24"

                >

                  <path

                    strokeLinecap="round"

                    strokeLinejoin="round"

                    strokeWidth={2}

                    d="M6 18L18 6M6 6l12 12"

                  />

                </svg>

              </button>

            </div>

            {/* Content */}

            <div className="p-7 bg-white rounded-b-3xl">

              <div className="mb-5">

                <p className="text-gray-700 leading-relaxed text-base">

                  {modalIndustry.content.description}

                </p>

              </div>

              {/* Features */}

              <div className="mb-6">

                <h4 className="text-lg font-semibold text-gray-800 mb-3">

                  Key Features & Benefits

                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {modalIndustry.content.features.map((feature, index) => (

                    <div

                      key={index}

                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 border border-gray-100"

                    >

                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />

                      <span className="text-gray-700 text-sm">{feature}</span>

                    </div>

                  ))}

                </div>

              </div>

              {/* CTA Buttons */}

              <div className="flex flex-col sm:flex-row gap-3 mt-2">

                <CTAButton
                  variant="primary"
                  size="lg"
                  className="flex-1 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center group"
                  modalConfig={{
                    title: `Get Started with ${modalIndustry.label}`,
                    subtitle: modalIndustry.content.description || "Let's discuss your industry requirements",
                    icon: ""
                  }}
                >
                  <span>Get Started with {modalIndustry.label}</span>

                  <ArrowRightAlt className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />

                </CTAButton>

                <button

                  onClick={closeModal}

                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-300 border border-gray-200"

                >

                  Close

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </section>

  );

};



export default Industries;

