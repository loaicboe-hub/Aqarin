import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLayout({ children }) {
  const { isRTL } = useLanguage();
  
  // Persist desktop sidebar collapsed state
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('aqarin_admin_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('aqarin_admin_collapsed', collapsed ? 'true' : 'false');
    } catch (e) {}
  }, [collapsed]);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 flex ${isRTL ? 'font-sans' : 'font-sans'}`}>
      {/* 1. Dedicated Admin Sidebar (Desktop & Mobile Drawer) */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* 2. Main Administration Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Admin Header */}
        <AdminHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />

        {/* Dynamic Admin Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
