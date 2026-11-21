import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";



const IndustryStats = (props) => {

  console.log(" [IndustryStats] ALL PROPS:", props);



  // Handle both flat and nested prop structures

  const title = props?.title || props?.data?.title;

  const subtitle = props?.subtitle || props?.data?.subtitle;

  const stats =

    props?.stats ||

    props?.items ||

    props?.data?.stats ||

    props?.data?.items ||

    [];



  console.log(" [IndustryStats] Using data:", {

    title,

    subtitle,

    statsCount: stats.length,

    hasTitle: !!title,

    hasSubtitle: !!subtitle,

    hasStats: stats.length > 0,

  });



  // Default data as fallback ONLY if no form data is provided

  const defaultData = {

    title: "Manufacturing Industry Stats",

    subtitle: "The state of manufacturing today",

    stats: [

      {

        label: "Manufacturing Clients",

        value: "500+",

        description: "Successful implementations",

      },

      {

        label: "Efficiency Gain",

        value: "40%",

        description: "Average improvement",

      },

      {

        label: "Cost Reduction",

        value: "35%",

        description: "In operational costs",

      },

      {

        label: "Client Satisfaction",

        value: "98%",

        description: "Success rate",

      },

    ],

  };



  // PRIORITIZE FORM DATA OVER DEFAULTS

  const finalTitle = title || defaultData.title;

  const finalSubtitle = subtitle || defaultData.subtitle;

  const finalStats =

    Array.isArray(stats) && stats.length > 0 ? stats : defaultData.stats || [];



  console.log(" [IndustryStats] FINAL DATA:", {

    finalTitle,

    finalSubtitle,

    finalStats,

    usingFormData: stats.length > 0 || !!title || !!subtitle,

  });



  return (

    <section className="manufacturing-stats bg-white py-16 light-section">




      <div className="container mx-auto px-6">

        {/* Title and Subtitle */}

        <header className="text-center mb-12">

          <h2 className="text-3xl font-bold text-gray-900 mb-4">

            {finalTitle}

          </h2>

          {finalSubtitle && (

            <p className="text-xl text-gray-600">

              {typeof finalSubtitle === 'string'

                ? finalSubtitle

                : finalSubtitle?.subtitle || finalSubtitle?.title || 'Subtitle'}

            </p>

          )}

        </header>



        {/* Stats Grid */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {finalStats.map((stat, index) => (

            <motion.article

              key={index}

              initial={{ opacity: 0, y: 20 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true, amount: 0.2 }}

              transition={{ delay: index * 0.1 }}

              className="text-center p-6 bg-white rounded-lg shadow-lg"

            >

              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">

                {stat.value}

              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">

                {typeof stat.label === 'string'

                  ? stat.label

                  : stat.label?.name || stat.label?.title || 'Stat Label'}

              </h3>

              <p className="text-gray-600">

                {typeof stat.description === 'string'

                  ? stat.description

                  : stat.description?.description || stat.description?.desc || 'Stat Description'}

              </p>

            </motion.article>

          ))}

        </div>



        {/* Empty State */}

        {finalStats.length === 0 && (

          <div className="text-center py-8">

            <p className="text-gray-500">No statistics data available</p>

          </div>

        )}

      </div>

    </section>

  );

};



export default IndustryStats;

