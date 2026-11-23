'use client'
import React, { useEffect, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initCacheManager } from '../utils/cacheManager.js';

// Lazy load DevTools to avoid including it in production bundles or causing resolution issues
const ReactQueryDevtools = React.lazy(() =>
  import('@tanstack/react-query-devtools').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes — don't refetch data that was just fetched
      gcTime: 15 * 60 * 1000,      // 15 minutes in cache after unmount (was cacheTime)
      refetchOnWindowFocus: false,  // don't refetch every time user clicks back to the tab
      refetchOnReconnect: true,     // do refetch when internet reconnects
      retry: 1,                     // one retry is enough; 2 doubles failure wait time
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

const DataProvider = ({ children }) => {
  // Initialize cache manager
  useEffect(() => {
    initCacheManager(queryClient);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Enable React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
};

export default DataProvider;
