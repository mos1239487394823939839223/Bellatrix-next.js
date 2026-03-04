'use client'
import React, { useEffect, useState } from "react";

import { usePathname } from 'next/navigation';

import MainManufacturing from "./Manufacturing/MainManufacturing";

import Retail from "./retail/Retail";

// import Healthcare from "./healthcare/Healthcare"; // Uncomment and import when Healthcare is available



const IndustryMain = ({ data: propsData = null }) => {

  const pathname = usePathname();

  const [industryData, setIndustryData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  useEffect(() => {

    if (propsData) {

      setIndustryData(propsData);

      setLoading(false);

      console.log(" [IndustryMain] Using props data:", propsData);

      return;

    }



    // Determine which industry to fetch based on the route

    let dataFile = null;

    if (pathname.toLowerCase().includes("manufacturing")) {

      dataFile = "/data/manufacturing-data.json";

    } else if (pathname.toLowerCase().includes("retail")) {

      dataFile = "/data/retail-data.json";

    } else if (pathname.toLowerCase().includes("healthcare")) {

      dataFile = "/data/healthcare-data.json";

    }

    // Add more conditions for other industries as needed



    if (!dataFile) {

      setError("No matching industry found for this route.");

      setLoading(false);

      return;

    }



    setLoading(true);

    setError(null);

    fetch(dataFile)

      .then((res) => {

        if (!res.ok) throw new Error("Failed to fetch industry data");

        return res.json();

      })

      .then((data) => setIndustryData(data))

      .catch((err) => setError(err.message))

      .finally(() => setLoading(false));

  }, [pathname, propsData]);



  if (loading) {

    return (

      <div className="flex justify-center items-center min-h-screen">

        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>

      </div>

    );

  }



  if (error) {

    return (

      <div className="flex justify-center items-center min-h-screen">

        <div className="text-red-500">Error: {error}</div>

      </div>

    );

  }



  // Render the correct industry component with its data

  if (pathname.toLowerCase().includes("manufacturing")) {

    return <MainManufacturing data={industryData} />;

  }

  if (pathname.toLowerCase().includes("retail")) {

    return <Retail data={industryData} />;

  }

  // if (pathname.toLowerCase().includes("healthcare")) {

  //   return <Healthcare data={industryData} />;

  // }



  return (

    <div className="flex justify-center items-center min-h-screen">

      <div>No matching industry found.</div>

    </div>

  );

};



export default IndustryMain;

