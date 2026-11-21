// components/Implementation/ProcessSection.jsx
import React, { useState, useEffect } from "react";
import CTAButton from "../../CTAButton";
import { loadImplementationData } from "../../../data/implementationDataLoader";

const ProcessSection = (props) => {
  const [defaultData, setDefaultData] = useState(null);

  // Extract direct props from Page Builder
  const {
    title: propTitle,
    subtitle: propSubtitle,
    image: propImage,
    steps: propSteps,
    ctaButton: propCtaButton,
    data: propsData,
  } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await loadImplementationData();
        setDefaultData(jsonData.processSection);
      } catch {
        setDefaultData({
          title: "Our Implementation Process",
          subtitle: "A proven methodology for seamless business transformation",
          image: "/Videos/implementation/implementProcess.jpg",
          steps: [],
          ctaButton: "Start Your Journey",
        });
      }
    };
    fetchData();
  }, []);

  // PRIORITIZE direct props > data prop > defaultData
  // Handle ctaButton as object or string
  const getCtaButton = () => {
    const btn = propCtaButton || propsData?.ctaButton || defaultData?.ctaButton;
    if (typeof btn === 'object' && btn !== null) {
      return btn;
    }
    // If it's a string, convert to object format
    return { text: btn || "Start Your Journey", link: "/contact", variant: "primary" };
  };

  const displayData = {
    title:
      propTitle ||
      propsData?.title ||
      defaultData?.title ||
      "Our Implementation Process",
    subtitle:
      propSubtitle ||
      propsData?.subtitle ||
      defaultData?.subtitle ||
      "A proven methodology for seamless business transformation",
    image:
      propImage ||
      propsData?.image ||
      defaultData?.image ||
      "/Videos/implementation/implementProcess.jpg",
    steps: propSteps || propsData?.steps || defaultData?.steps || [],
    ctaButton: getCtaButton(),
  };

  // Debug logging for real-time updates
  console.log(" [ImplementationProcessSection] Component received data:", {
    directProps: { propTitle, propSubtitle, propImage, propCtaButton },
    propsData,
    defaultData,
    finalData: displayData,
    timestamp: new Date().toISOString(),
  });

  return (
    <>
      <section className="bg-gray-50 py-12 light-section">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <header className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              {displayData.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {displayData.subtitle}
            </p>
          </header>

          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Process Animation - Left Side */}
            <div className="flex-1 flex justify-center">
              <div className="relative group max-w-lg">
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
                      src={displayData.image}
                      alt="NetSuite Implementation Process Flow - Strategic business transformation methodology with step-by-step ERP deployment and configuration guidance"
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Proven Process</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Content - Right Side */}
            <div className="flex-1">
              {/* Process Steps - Timeline Layout */}
              <div className="relative">
                {/* Central Timeline Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-300 via-blue-500 via-blue-700 to-blue-900"></div>

                <div className="space-y-6">
                  {(displayData.steps || []).map((step, index) => {
                    const bgColors = [
                      "bg-blue-300",
                      "bg-blue-500",
                      "bg-blue-700",
                      "bg-blue-900",
                    ];
                    return (
                      <article
                        key={index}
                        className="relative flex items-start group"
                      >
                        <div
                          className={`flex-shrink-0 w-12 h-12 ${bgColors[index]} rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 group-hover:scale-110 transition-all duration-300`}
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={step.icon}
                            />
                          </svg>
                        </div>
                        <div className="ml-6 flex-1">
                          <div className="bg-white p-4 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg">
                            <header className="flex items-center mb-2">
                              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mr-3">
                                Step {step.number}
                              </span>
                              <h3 className="text-lg font-bold text-gray-800">
                                {step.title}
                              </h3>
                            </header>
                            <p className="text-sm text-gray-600">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-6">
                <CTAButton
                  variant={displayData.ctaButton?.variant || "primary"}
                  size="lg"
                  className="w-full rounded-lg shadow-lg hover:shadow-xl"
                  modalConfig={{
                    title: "Start Your Implementation Journey",
                    subtitle:
                      "Let's discuss your NetSuite implementation needs and create a customized roadmap for your success",
                    icon: "",
                  }}
                >
                  {displayData.ctaButton?.text || "Start Your Journey"}
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProcessSection;
