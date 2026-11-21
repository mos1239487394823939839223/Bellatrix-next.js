import React, { useState, useEffect } from "react";




const PayrollHowItWorks = ({ data }) => {

  const [defaultData, setDefaultData] = useState(null);



  useEffect(() => {

    const fetchData = async () => {

      try {

        const response = await fetch("/data/payroll.json");

        const jsonData = await response.json();

        setDefaultData(jsonData.howItWorks);

      } catch (error) {

        console.error("Failed to load payroll data:", error);

        setDefaultData({

          title: "How Our Payroll System Works",

          description: "Our payroll process is simple and automated.",

        });

      }

    };

    fetchData();

  }, []);



  // PRIORITIZE props data over default data for real-time preview

  const sectionData =

    data && typeof data === "object" ? data : defaultData || {};

  const steps = Array.isArray(sectionData.steps) ? sectionData.steps : [];



  // Debug logging for real-time updates

  console.log(" [PayrollHowItWorks] Component received data:", {

    hasPropsData: !!(data && typeof data === "object"),

    propsData: data,

    hasDefaultData: !!defaultData,

    finalData: sectionData,

    timestamp: new Date().toISOString()

  });



  return (

    <>


      <section

        className="py-20 relative overflow-hidden animate-background-glow"

        style={{

          backgroundColor: "var(--color-brand-dark-navy)",

        }}

      >

        {/* Decorative Background */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)]/10 via-transparent to-[var(--color-primary)]/10"></div>

        </div>



        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">

          {/* Title */}

          {sectionData.title && (

            <header className="text-center mb-10">

              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-inverse)]">

                {sectionData.title}

              </h2>

            </header>

          )}



          <div className="bg-gradient-to-br from-[var(--color-bg-dark)]/90 via-[var(--color-bg-dark)]/80 to-[var(--color-bg-dark)]/90 rounded-xl p-5 sm:p-8 md:p-12 shadow-2xl max-w-6xl mx-auto border border-[var(--color-primary)]/30 backdrop-blur-sm hover:shadow-[var(--color-primary)]/20 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">

            {/* Background Effects */}

            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/30 to-[var(--color-primary-light)]/30 rounded-full opacity-20 transform translate-x-16 -translate-y-16 group-hover:opacity-40 transition-opacity duration-500"></div>

            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[var(--color-primary-dark)]/30 to-[var(--color-primary)]/30 rounded-full opacity-20 transform -translate-x-10 translate-y-10 group-hover:opacity-40 transition-opacity duration-500"></div>

            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r from-[var(--color-primary-light)]/20 to-[var(--color-primary)]/20 rounded-full opacity-15 transform -translate-x-8 -translate-y-8 group-hover:opacity-30 transition-opacity duration-500"></div>



            {/* Floating Tech Elements */}

            <div className="absolute top-4 right-4">

              <div className="relative">

                <div className="w-3 h-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-full animate-pulse shadow-lg"></div>

                <div className="absolute inset-0 w-3 h-3 bg-[var(--color-primary)]/30 rounded-full animate-ping"></div>

              </div>

            </div>

            <div className="absolute bottom-4 left-4">

              <div className="relative">

                <div className="w-2 h-2 bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary)] rounded-full animate-pulse shadow-md"></div>

                <div className="absolute -inset-1 w-4 h-4 bg-[var(--color-primary-light)]/20 rounded-full animate-ping"></div>

              </div>

            </div>



            {/* Data visualization lines */}

            <div className="absolute top-6 left-1/4 w-16 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary-light)]/40 to-transparent"></div>

            <div className="absolute bottom-6 right-1/4 w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent"></div>



            <div className="relative z-10">

              {/* Description */}

              {sectionData.description && (

                <p className="text-xl text-[var(--color-text-inverse)] leading-relaxed mb-10">

                  {sectionData.description}

                </p>

              )}



              {/* Steps List */}

              {steps.length > 0 && (

                <div className="grid md:grid-cols-2 gap-8 mt-10">

                  {steps.map((step, idx) => (

                    <article

                      key={idx}

                      className="bg-[var(--color-background-dark)]/70 border border-[var(--color-text-secondary)]/50 p-5 sm:p-6 rounded-lg shadow-md hover:shadow-[var(--color-primary)]/20 transition"

                      role="article"

                      aria-label={`Payroll process step: ${

                        step.title || `Step ${idx + 1}`

                      }`}

                    >

                      <h3 className="text-xl font-semibold text-[var(--color-text-inverse)] mb-2">

                        {step.title || ""}

                      </h3>

                      <p className="text-[var(--color-text-light)] text-base">

                        {step.description || ""}

                      </p>

                    </article>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>

      </section>

    </>

  );

};



export default PayrollHowItWorks;

