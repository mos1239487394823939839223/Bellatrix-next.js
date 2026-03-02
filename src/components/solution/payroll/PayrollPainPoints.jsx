import React from "react";
import SEO from "../../SEO";

const PayrollPainPoints = ({ painPoints, image }) => {
  // اعتمد فقط على البيانات القادمة من props
  const title =
    painPoints?.title ||
    'The Payroll <span class="text-[var(--color-primary)]">Struggles</span> We Eliminate';
  const description =
    painPoints?.description ||
    "Our system addresses the most common payroll challenges faced by consultancy firms:";
  const items = Array.isArray(painPoints?.painPoints)
    ? painPoints.painPoints
    : [];
  // Get image from props (painPoints.image or direct image prop)
  const sectionImage = painPoints?.image || image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

  // Debug logging for real-time updates
  console.log(" [PayrollPainPoints] Component received data:", {
    hasPropsData: !!painPoints,
    propsData: painPoints,
    sectionImage: sectionImage,
    timestamp: new Date().toISOString(),
  });

  return (
    <>
      <SEO
        title={title.replace(/<[^>]+>/g, "")}
        description={description}
        keywords="NetSuite payroll challenges, payroll problems solutions, Oracle ERP payroll issues, automated payroll benefits, payroll compliance solutions"
        ogTitle={title.replace(/<[^>]+>/g, "")}
        ogDescription={description}
        ogImage="/images/netsuite-payroll-challenges.jpg"
      />
      <section className="bg-[var(--color-bg-secondary)] py-20 light-section">
        <div className="container mx-auto px-6 max-w-6xl">
          <header className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]"
              dangerouslySetInnerHTML={{ __html: title }}
            ></h2>
          </header>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <strong className="text-xl text-[var(--color-text-primary)] block mb-6">
                {description}
              </strong>
              <ul className="space-y-5">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div>
                      <span className="text-lg text-[var(--color-text-secondary)]">
                        {item.title || item.text}
                      </span>
                      {item.description && (
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative group max-w-lg">
                {/* Background Effects */}
                <div className="absolute -inset-8 opacity-30 group-hover:opacity-60 transition-all duration-700">
                  <div className="absolute -inset-6 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary-light)]/30 to-[var(--color-primary)]/20 rounded-3xl blur-2xl"></div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-primary)]/15 via-[var(--color-primary-dark)]/20 to-[var(--color-primary-light)]/15 rounded-2xl blur-xl"></div>
                </div>

                <div className="relative bg-[var(--color-bg-primary)] rounded-3xl p-6 backdrop-blur-md border border-[var(--color-border-primary)] shadow-2xl">
                  <div className="bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary)]/10 rounded-2xl p-4 border border-[var(--color-primary)]/20">
                    <img
                      src={sectionImage}
                      alt="Bellatrix Payroll Management Dashboard - Professional ERP payroll automation interface"
                      className="w-full h-auto rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PayrollPainPoints;
