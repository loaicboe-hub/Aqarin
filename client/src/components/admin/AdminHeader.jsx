import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  ShieldCheck,
  Globe,
  Bell,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_MENU_ITEMS } from './AdminSidebar';

export default function AdminHeader({
  collapsed,
  setCollapsed,
  onOpenMobileSidebar
}) {
  const { lang, toggleLanguage, isRTL } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  // Find active menu item label
  const currentItem = ADMIN_MENU_ITEMS.find(item => 
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
  ) || ADMIN_MENU_ITEMS[0];

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all duration-200">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Hamburger & Desktop Collapse Toggle & Current Page Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-[#0B1C3D] hover:bg-slate-100 transition-colors border border-slate-200/80 shadow-xs"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 rounded-xl text-slate-600 hover:text-[#0B1C3D] hover:bg-slate-100 transition-colors border border-slate-200/80 shadow-xs"
            title={collapsed ? (isRTL ? 'توسيع القائمة' : 'Expand Sidebar') : (isRTL ? 'طي القائمة' : 'Collapse Sidebar')}
            aria-label="Toggle Desktop Sidebar"
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Title & Section Indicator */}
          <div>
            <h1 className="text-base sm:text-lg font-black text-[#0B1C3D] flex items-center gap-2">
              <span>{isRTL ? currentItem.labelAr : currentItem.labelEn}</span>
            </h1>
            <p className="text-[11px] text-slate-600 hidden sm:block">
              {isRTL ? 'بوابة إدارة منصة عقار إن الموحدة' : 'AQAR IN Unified Administration Portal'}
            </p>
          </div>
        </div>

        {/* Right Side: Database Badge, Language Switcher, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Database Live Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">PostgreSQL 16 + PostGIS</span>
            <span className="md:hidden">PostgreSQL</span>
          </div>

          {/* Language Switcher Button (En / العربية) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#0B1C3D] text-xs font-bold transition-colors shadow-xs"
            title={isRTL ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>{isRTL ? 'English' : 'عربي'}</span>
          </button>

          {/* User Avatar & Name */}
          <div className="flex items-center gap-2 ps-2 border-s border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B1C3D] to-[#1d3d7a] text-white flex items-center justify-center font-black text-xs shadow-xs border border-slate-300">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden xl:block text-start">
              <p className="text-xs font-bold text-[#0B1C3D] leading-tight">{user?.fullName || 'Super Admin'}</p>
              <p className="text-[10px] text-slate-600 leading-tight">admin@aqarin.com</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
