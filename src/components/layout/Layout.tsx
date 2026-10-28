import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileTabBar from './MobileTabBar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#FAF9F6] selection:bg-[#DAA520]/25 selection:text-[#1A1A1A] transition-colors duration-200">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 lg:pb-12">
        <Outlet />
      </main>

      {/* Cultural Heritage Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Navigation */}
      <MobileTabBar />
    </div>
  );
};

export default Layout;
