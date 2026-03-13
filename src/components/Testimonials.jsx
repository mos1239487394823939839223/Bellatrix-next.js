import React, { useEffect, useState } from "react";
import SEO from "./SEO";

// Only treat a value as an image URL if it looks like a real path/URL
const isValidImageSrc = (src) => {
  if (!src || typeof src !== "string" || src.trim().length < 4) return false;
  const lower = src.toLowerCase().trim();
  return (
    lower.startsWith("/") ||
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("data:image")
  );
};

const Testimonials = ({
  testimonials: propsTestimonials = [],
  sectionHeader: propsSectionHeader = {},
  sideImage: propsSideImage,
  data,
}) => {
  const testimonials =
    propsTestimonials.length > 0
      ? propsTestimonials
      : data?.testimonials || [];
  const sectionHeader =
    Object.keys(propsSectionHeader).length > 0
      ? propsSectionHeader
      : data?.sectionHeader || {};
  const rawSideImage = propsSideImage || data?.sideImage || "/images/indleaders.jpg";
  const sideImage = isValidImageSrc(rawSideImage) ? rawSideImage : "/images/indleaders.jpg";

  const [activeIndex, setActiveIndex] = useState(0);


  const normalizedTestimonials = testimonials.map((item, index) => ({
    ...item,
    id: item.id || `${index + 1}`,
    quote: item.quote || item.content || item.description || "",
    name: item.name || item.clientName || "",
    title: item.title || item.position || "",
    company: item.company || "",
    avatar: undefined,
    image: undefined,
    rating:
      typeof item.rating === "number" && !Number.isNaN(item.rating)
        ? item.rating
        : 5,
  }));

  // Auto-rotate testimonials when there are multiple
  useEffect(() => {
    if (normalizedTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % normalizedTestimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [normalizedTestimonials.length]);

  useEffect(() => {
    if (activeIndex >= normalizedTestimonials.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, normalizedTestimonials.length]);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-amber-400" : "text-gray-200"
          } fill-current`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));

  const activeTestimonial = normalizedTestimonials[activeIndex];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="Client Testimonials & Success Stories | Bellatrix NetSuite Solutions"
        description="Read testimonials from industry leaders who trust Bellatrix for NetSuite implementation and consulting. Real client success stories and reviews."
        keywords="client testimonials, NetSuite reviews, success stories, industry leaders, customer feedback, ERP implementation reviews, consulting testimonials"
        ogTitle="Trusted by Industry Leaders | Bellatrix Client Testimonials"
        ogDescription="See why industry leaders choose Bellatrix for NetSuite solutions. Real testimonials and success stories from satisfied clients."
        ogImage="/images/client-testimonials.jpg"
        twitterCard="summary_large_image"
      />

      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100/40 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100/30 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Client Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {sectionHeader?.gradientText || "Trusted by Industry Leaders"}
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            {sectionHeader?.subtitle ||
              "Don't just take our word for it \u2014 here's what our clients say."}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Testimonial Card - Left */}
          <div className="flex-1 w-full">
            {activeTestimonial ? (
              <div className="relative">
                {/* Large quote mark */}
                <svg
                  className="absolute -top-4 -left-2 w-16 h-16 text-blue-100 opacity-80"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                </svg>

                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 relative">
                  <blockquote className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 relative z-10">
                    &ldquo;{activeTestimonial.quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold text-gray-900 text-base">
                          {activeTestimonial.name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {activeTestimonial.title}
                        </div>
                        {activeTestimonial.company && (
                          <div className="text-gray-500 text-xs">
                            {activeTestimonial.company}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {renderStars(activeTestimonial.rating)}
                    </div>
                  </div>
                </div>

                {/* Dots navigation — only show when multiple testimonials */}
                {normalizedTestimonials.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    {normalizedTestimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`rounded-full transition-all duration-300 ${i === activeIndex
                          ? "w-8 h-2.5 bg-blue-600"
                          : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                          }`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center text-gray-400">
                No testimonials yet.
              </div>
            )}
          </div>

          {/* Side Image - Right */}
          <div className="flex-1 flex justify-center w-full">
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={sideImage}
                  alt="Industry Leaders - Digital Innovation & Technology"
                  className="w-full h-auto lg:max-w-md object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>

              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white text-gray-900 px-5 py-2.5 rounded-xl shadow-lg border border-gray-100 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                  <span>Industry Leaders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

