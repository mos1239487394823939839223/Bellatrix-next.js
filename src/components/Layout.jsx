'use client'
import { lazy, Suspense } from 'react';
import Navbar from './Navbar';
import { NotificationContainer } from './NotificationToast';

// Footer is below the fold — lazy load so it doesn't block first paint
const Footer = lazy(() => import('./Footer'));

const Layout = ({ children, initialCategories = [] }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* First Tab stop: lets keyboard users jump past the navigation */}
      <a
        href="#main-content"
        data-no-cta-intercept
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-blue-700 focus:shadow-lg"
      >
        Skip to content
      </a>
      <Navbar initialCategories={initialCategories} />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      <Suspense fallback={null}>
        <Footer initialCategories={initialCategories} />
      </Suspense>

      <NotificationContainer />
    </div>
  );
};

export default Layout;
