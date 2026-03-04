'use client'
import { lazy, Suspense } from 'react';
import Navbar from './Navbar';
import { NotificationContainer } from './NotificationToast';

// Footer is below the fold — lazy load so it doesn't block first paint
const Footer = lazy(() => import('./Footer'));

const Layout = ({ children }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Fixed Navbar - fetches its own categories from /api/Categories/navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer — deferred so it doesn't block first paint */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Notification System */}
      <NotificationContainer />
    </div>
  );
};

export default Layout;
