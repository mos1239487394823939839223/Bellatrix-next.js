'use client'
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useParams, usePathname } from 'next/navigation';

import { getApiBaseUrlWithApi } from "../config/api.js";

// Base API configuration

const API_BASE_URL = getApiBaseUrlWithApi();



// Utility function to fetch page data

export const fetchPageData = async (pageName) => {

  if (!pageName) {

    throw new Error("Page name is required");

  }



  // Add timestamp to prevent caching

  const timestamp = Date.now();

  const response = await fetch(`${API_BASE_URL}/${pageName}?_t=${timestamp}`);



  if (!response.ok) {

    throw new Error(

      `Failed to fetch ${pageName}: ${response.status} ${response.statusText}`

    );

  }



  const data = await response.json();

  console.log(

    ` Fresh data fetched for ${pageName}:`,

    data.hero?.title || "No hero title"

  );

  return data;

};



// Map route paths to JSON Server endpoints

const routeToEndpointMap = {

  "/": "home",

  "/home": "home",

  "/hr": "hr",

  "/hrsolution": "hr",

  "/payroll": "payroll",

  "/about": "home", // About might use home data or separate endpoint

  "/implementation": "Implementation",

  "/training": "training",

  "/netsuite-consulting": "netsuite-consulting",

  "/customization": "customization",

  "/integration": "integration",

  "/support": "home", // Assuming support uses home data

  "/industries/manufacturing": "manufacturing",

  "/industries/retail": "retail",

  // Add more mappings as needed

};



// Function to get endpoint name from route

export const getEndpointFromRoute = (pathname) => {

  // Direct mapping

  if (routeToEndpointMap[pathname.toLowerCase()]) {

    return routeToEndpointMap[pathname.toLowerCase()];

  }



  // Try to extract from path

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0) {

    const lastSegment = segments[segments.length - 1];

    // Check if it matches any known endpoints

    const knownEndpoints = [

      "home",

      "hr",

      "payroll",

      "implementation",

      "training",

      "netsuite-consulting",

      "customization",

      "integration",

      "manufacturing",

      "retail",

    ];



    if (knownEndpoints.includes(lastSegment.toLowerCase())) {

      return lastSegment.toLowerCase();

    }

  }



  // Default fallback

  return "home";

};



// Custom hook for fetching page data based on current route

export const usePageData = (pageName = null, options = {}) => {

  const pathname = usePathname();

  const params = useParams();



  // Determine the endpoint to use

  let endpoint = pageName;



  if (!endpoint) {

    // Try to get from URL params first

    if (params.slug || params.pageId) {

      endpoint = params.slug || params.pageId;

    } else {

      // Get from current route

      endpoint = getEndpointFromRoute(pathname);

    }

  }



  const {

    enabled = true,

    staleTime = 5 * 60 * 1000, // 5 minutes

    cacheTime = 10 * 60 * 1000, // 10 minutes

    refetchOnWindowFocus = true,

    refetchInterval = false, // Can be set to enable polling

    ...restOptions

  } = options;



  return useQuery({

    queryKey: ["pageData", endpoint], // Remove timestamp to prevent infinite refetching

    queryFn: () => fetchPageData(endpoint),

    enabled: enabled && !!endpoint,

    staleTime,

    cacheTime,

    refetchOnWindowFocus,

    refetchInterval,

    retry: 2,

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    ...restOptions,

  });

};



// Custom hook for dynamic page data based on route parameters

export const useDynamicPageData = (options = {}) => {

  const { slug } = useParams();

  const pathname = usePathname();



  // Get endpoint from slug or location

  const endpoint = slug || getEndpointFromRoute(pathname);



  return usePageData(endpoint, options);

};



// Custom hook for specific page data (when you know the exact endpoint)

export const useSpecificPageData = (endpointName, options = {}) => {

  return usePageData(endpointName, options);

};



// Utility hook for prefetching page data

export const usePrefetchPageData = () => {

  const queryClient = useQueryClient();



  const prefetchPage = (pageName) => {

    queryClient.prefetchQuery({

      queryKey: ["pageData", pageName],

      queryFn: () => fetchPageData(pageName),

      staleTime: 5 * 60 * 1000,

    });

  };



  return { prefetchPage };

};



// Utility hook for invalidating and refetching data

export const useRefreshPageData = () => {

  const queryClient = useQueryClient();



  const refreshPage = (pageName) => {

    queryClient.invalidateQueries({

      queryKey: ["pageData", pageName],

    });

  };



  const refreshAllPages = () => {

    queryClient.invalidateQueries({

      queryKey: ["pageData"],

    });

  };



  return { refreshPage, refreshAllPages };

};



// Error boundary helper

export const PageDataErrorBoundary = ({ children }) => {

  return children; // For now, basic implementation

};



// Loading component helper

export const PageDataLoader = ({ children, loading, error, data }) => {

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>

      </div>

    );

  }



  if (error) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <h2 className="text-2xl font-bold text-red-600 mb-2">

            Error Loading Page

          </h2>

          <p className="text-gray-600">{error.message}</p>

          <button

            onClick={() => window.location.reload()}

            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"

          >

            Retry

          </button>

        </div>

      </div>

    );

  }



  if (!data) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-gray-600">No data available</div>

      </div>

    );

  }



  return children;

};

