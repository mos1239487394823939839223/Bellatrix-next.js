import React from "react";

import SEO from "../../SEO";



const ModulesSection = ({ data = {} }) => {

  // اعتمد فقط على البيانات القادمة من props

  const title = data.title || "Product Modules";

  const description = data.description || "";

  const modules = Array.isArray(data.modules)

    ? data.modules.map((m) => ({

        ...m,

        description: m.description || m.desc || "Module description",

      }))

    : [];



  // Debug logging for real-time updates

  console.log(" [HRModulesSection] Component received data:", {

    hasPropsData: !!(data && data.modules),

    propsData: data,

    finalData: modules,

    timestamp: new Date().toISOString(),

  });

  return (

    <>

      <SEO

        title={title}

        description={description}

        keywords="Bellatrix HR modules, HR platform components, employee management module, payroll processing, HR compliance, NetSuite HR features"

        ogTitle={title}

        ogDescription={description}

        ogImage="/images/netsuite-hr-modules.jpg"

      />

      <section

        className="py-20 animate-fade-in-up relative"

        style={{ backgroundColor: "var(--color-brand-dark-navy)" }}

      >

        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)]/10 via-transparent to-[var(--color-primary)]/10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">

          <header className="text-center mb-10">

            <h2 className="text-3xl font-bold mb-6 text-[var(--color-text-inverse)]">

              {title}

            </h2>

            {description && (

              <p className="text-lg text-[var(--color-white)] max-w-2xl mx-auto">

                {description}

              </p>

            )}

          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

            {modules.map((m, idx) => (

              <article

                key={idx}

                className="bg-[var(--color-text-inverse)]/5 backdrop-blur-sm rounded-2xl shadow-2xl p-10 flex flex-col items-center text-center border border-[var(--color-text-inverse)]/10 hover:border-[var(--color-primary)] hover:shadow-[var(--color-primary)]/20 hover:shadow-2xl transition-all duration-300 animate-fade-in-up"

                role="article"

                aria-label={`HR Module: ${m.title || "Module"}`}

              >
                <h3 className="font-bold text-xl text-[var(--color-text-inverse)] mb-3">

                  {m.title || "Module"}

                </h3>

                <p className="text-[var(--color-text-light)] text-base">

                  {m.description}

                </p>

              </article>

            ))}

          </div>

        </div>

      </section>

    </>

  );

};



export default ModulesSection;

