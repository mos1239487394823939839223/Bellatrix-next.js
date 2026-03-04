'use client'
import { lazy, Suspense } from 'react';
import Navbar from './Navbar';
import { NotificationContainer } from './NotificationToast';

// Footer is below the fold — lazy load so it doesn't block first paint
const Footer = lazy(() => import('./Footer'));

const Layout = ({ children, initialCategories = [] }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar initialCategories={initialCategories} />

      <main className="flex-1">
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
