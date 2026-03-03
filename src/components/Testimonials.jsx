import React, { useRef, useEffect } from "react";

import SEO from "./SEO";



const Testimonials = ({ testimonials: propsTestimonials = [], sectionHeader: propsSectionHeader = {}, data }) => {

  // PRIORITIZE props data over default data for real-time preview

  const testimonials = propsTestimonials.length > 0 ? propsTestimonials : (data?.testimonials || []);

  const sectionHeader = Object.keys(propsSectionHeader).length > 0 ? propsSectionHeader : (data?.sectionHeader || {});





  const videoRef = useRef(null);

  useEffect(() => {

    const setupVideo = async () => {

      if (videoRef.current) {

        videoRef.current.playbackRate = 0.7;

        // Try to play video with error handling

        try {

          await videoRef.current.play();

        } catch (error) {

          // Handle autoplay restrictions silently

          if (error.name === "AbortError" || error.name === "NotAllowedError") {

            // Autoplay blocked — expected on some browsers

          }

        }

      }

    };



    setupVideo();

  }, []);



  const renderStars = (rating) => {

    return [...Array(5)].map((_, i) => (

      <svg

        key={i}

        className={`w-4 h-4 ${

          i < rating

            ? "text-blue-400 fill-current"

            : "text-blue-200 fill-current"

        }`}

        viewBox="0 0 20 20"

      >

        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />

      </svg>

    ));

  };



  // Show only first 3 testimonials initially

  const displayedTestimonials = testimonials.slice(0, 3);



  return (

    <section

      className="py-12 relative overflow-hidden"

      style={{ backgroundColor: "#001038" }}

    >

      <SEO

        title="Client Testimonials & Success Stories | Bellatrix NetSuite Solutions"

        description="Read testimonials from industry leaders who trust Bellatrix for Bellatrix implementation and consulting. Real client success stories and reviews."

        keywords="client testimonials, NetSuite reviews, success stories, industry leaders, customer feedback, ERP implementation reviews, consulting testimonials"

        ogTitle="Trusted by Industry Leaders | Bellatrix Client Testimonials"

        ogDescription="See why industry leaders choose Bellatrix for Bellatrix solutions. Real testimonials and success stories from satisfied clients."

        ogImage="/images/client-testimonials.jpg"

        twitterCard="summary_large_image"

      />



      {/* Video Background */}

      <video

        ref={videoRef}

        className="absolute inset-0 w-full h-full object-cover z-0"

        src="/Videos/aesthetic.mp4"

        autoPlay

        loop

        muted

        playsInline

        preload="none"

        onLoadedData={() => {

          // Setup video playback rate and attempt to play

          if (videoRef.current) {

            videoRef.current.playbackRate = 0.7;

            videoRef.current.play().catch(() => {

              // Silently handle autoplay restrictions

            });

          }

        }}

        onError={() => {}}

      />

      {/* Very subtle overlay for slight readability */}

      <div className="absolute inset-0 bg-black/5 z-10" />

      <div className="container mx-auto px-6 relative z-20">

        {/* Section Header */}

        <header className="text-center mb-10">

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">

            <span className="text-white-400">

              {sectionHeader?.gradientText || "Trusted by Industry Leaders"}

            </span>

          </h2>

          <p className="text-lg text-white-200 leading-relaxed max-w-3xl mx-auto">

            {sectionHeader?.subtitle ||

              "Don't just take our word for it—here's what our clients say."}

          </p>

        </header>



        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* Testimonials Content - Left Side */}

          <div className="flex-1">

            <div className="bg-gray-800 rounded-3xl p-8 border border-gray-600/50 shadow-2xl hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group backdrop-blur-sm">

              {/* Creative Background Elements Removed */}

              <div className="relative z-10 space-y-6">

                {displayedTestimonials.map((testimonial, index) => (

                  <article

                    key={testimonial.id}

                    className="group/item hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-transparent rounded-xl p-4 transition-all duration-300 hover:transform hover:translate-x-2"

                  >

                    <div className="flex items-start">

                      <div className="relative mr-4">

                        <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-all duration-300">

                          <span className="text-white font-bold text-xs">

                            {String(index + 1).padStart(2, "0")}

                          </span>

                        </div>

                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-700 to-blue-900 rounded-lg blur opacity-30 group-hover/item:opacity-60 transition-opacity duration-300"></div>

                      </div>

                      <div className="flex-1">

                        <blockquote className="text-white text-sm mb-3 leading-relaxed group-hover/item:text-blue-100 transition-all duration-300">

                          <p>"{testimonial.quote}"</p>

                        </blockquote>

                        <div className="flex items-center justify-between">

                          <div className="flex items-center space-x-3">

                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">

                              {testimonial.avatar}

                            </div>

                            <div>

                              <div className="font-semibold text-white text-sm group-hover/item:text-blue-300 transition-all duration-300">

                                {testimonial.name}

                              </div>

                              <div className="text-gray-300 text-xs">

                                {testimonial.title}

                              </div>

                            </div>

                          </div>

                          <div className="flex space-x-1">

                            {renderStars(testimonial.rating)}

                          </div>

                        </div>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            </div>

          </div>

          {/* Image - Right Side */}

          <div className="flex-1 flex justify-center">

            <div className="relative group">

              {/* Glowing background effect and floating elements removed */}

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-2xl">

                <img

                  src="/images/indleaders.jpg"

                  alt="Industry Leaders - Digital Innovation & Technology"

                  className="w-full h-auto lg:max-w-md rounded-xl shadow-lg brightness-110 contrast-110 saturate-110 group-hover:scale-105 transition-all duration-500"

                />

                {/* Overlay gradient for better contrast */}

                <div className="absolute inset-4 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none"></div>

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

