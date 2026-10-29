import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Inbox,
  Zap,
  ArrowLeftRight,
  Briefcase,
  Handshake,
  Sliders,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';

export const ADMIN_MENU_ITEMS = [
  {
    id: 'dashboard',
    labelEn: 'Dashboard',
    labelAr: 'لوحة التحكم',
    path: '/admin',
    icon: LayoutDashboard,
    end: true
  },
  {
    id: 'properties',
    labelEn: 'Properties',
    labelAr: 'العقارات',
    path: '/admin/properties',
    icon: Building2
  },
  {
    id: 'users',
    labelEn: 'Users',
    labelAr: 'المستخدمين',
    path: '/admin/users',
    icon: Users
  },
  {
    id: 'leads',
    labelEn: 'Leads & Inquiries',
    labelAr: 'الطلبات والاستفسارات',
    path: '/admin/leads',
    icon: Inbox
  },
  {
    id: 'fast-sell',
    labelEn: 'Fast Sell Requests',
    labelAr: 'طلبات البيع السريع',
    path: '/admin/fast-sell',
    icon: Zap
  },
  {
    id: 'exchange',
    labelEn: 'Property Exchange',
    labelAr: 'طلبات البدل العقاري',
    path: '/admin/exchange',
    icon: ArrowLeftRight
  },
  {
    id: 'management',
    labelEn: 'Property Management',
    labelAr: 'إدارة الأملاك',
    path: '/admin/management',
    icon: Briefcase
  },
  {
    id: 'partners',
    labelEn: 'Partner Applications',
    labelAr: 'طلبات الشركاء',
    path: '/admin/partners',
    icon: Handshake
  },
  {
    id: 'benchmarks',
    labelEn: 'Location Benchmarks',
    labelAr: 'مؤشرات الأسعار',
    path: '/admin/benchmarks',
    icon: Sliders
  },
  {
    id: 'reports',
    labelEn: 'Reports & Analytics',
    labelAr: 'التقارير والتحليلات',
    path: '/admin/reports',
    icon: BarChart3
  },
  {
    id: 'settings',
    labelEn: 'Settings',
    labelAr: 'الإعدادات',
    path: '/admin/settings',
    icon: Settings
  }
];

export default function AdminSidebar({
  collapsed = false,
  setCollapsed = () => {},
  isMobileOpen = false,
  setIsMobileOpen = () => {}
}) {
  const { isRTL } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Prevent background scrolling while mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Close mobile drawer on route transition
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const renderNavLinks = () => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/50">
      <div className={`px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 ${collapsed ? 'text-center' : ''}`}>
        {collapsed ? '•••' : (isRTL ? 'إدارة المنصة' : 'Platform Management')}
      </div>

      {ADMIN_MENU_ITEMS.map((item) => {
        const IconComponent = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.end}
            title={collapsed ? (isRTL ? item.labelAr : item.labelEn) : undefined}
            className={({ isActive }) => `
              group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200
              ${collapsed ? 'justify-center px-2' : ''}
              ${isActive 
                ? 'bg-gradient-to-r from-sky-500/20 to-sky-600/10 text-sky-300 shadow-xs border-s-4 border-sky-400 font-extrabold' 
                : 'text-slate-300 hover:text-white hover:bg-white/6'}
            `}
          >
            <IconComponent className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110`} />

            {!collapsed && (
              <span className="truncate tracking-wide">
                {isRTL ? item.labelAr : item.labelEn}
              </span>
            )}

            {/* Hover Tooltip for collapsed desktop mode */}
            {collapsed && (
              <div className={`
                pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 border border-slate-700
                ${isRTL ? 'right-full mr-2' : 'left-full ml-2'}
              `}>
                {isRTL ? item.labelAr : item.labelEn}
              </div>
            )}
          </NavLink>
        );
      })}

      <div className="pt-4 mt-4 border-t border-slate-800/80">
        <div className={`px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '•••' : (isRTL ? 'إجراءات النظام' : 'System Actions')}
        </div>

        {/* 12. View Website */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? (isRTL ? 'عرض الموقع' : 'View Website') : undefined}
          className={`
            group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/6 transition-all duration-200
            ${collapsed ? 'justify-center px-2' : ''}
          `}
        >
          <ExternalLink className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 text-emerald-400" />
          {!collapsed && (
            <span className="truncate flex-1 flex items-center justify-between">
              <span>{isRTL ? 'عرض الموقع' : 'View Website'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono">Live</span>
            </span>
          )}
          {collapsed && (
            <div className={`
              pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 border border-slate-700
              ${isRTL ? 'right-full mr-2' : 'left-full ml-2'}
            `}>
              {isRTL ? 'عرض الموقع' : 'View Website'}
            </div>
          )}
        </Link>

        {/* 13. Logout */}
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? (isRTL ? 'تسجيل الخروج' : 'Logout') : undefined}
          className={`
            w-full group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-all duration-200
            ${collapsed ? 'justify-center px-2' : ''}
          `}
        >
          <LogOut className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 text-rose-400" />
          {!collapsed && (
            <span className="truncate">
              {isRTL ? 'تسجيل الخروج' : 'Logout'}
            </span>
          )}
          {collapsed && (
            <div className={`
              pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 border border-slate-700
              ${isRTL ? 'right-full mr-2' : 'left-full ml-2'}
            `}>
              {isRTL ? 'تسجيل الخروج' : 'Logout'}
            </div>
          )}
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* ============================================================== */}
      {/* 1. Mobile Backdrop Overlay                                      */}
      {/* ============================================================== */}
      <div
        className={`
          fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 transition-opacity duration-300 lg:hidden
          ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ============================================================== */}
      {/* 2. Mobile Drawer (Slide-in from right in RTL, left in LTR)     */}
      {/* ============================================================== */}
      <aside
        className={`
          fixed inset-y-0 z-50 w-72 max-w-[85vw] bg-[#071329] border-slate-800 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden
          ${isRTL ? 'right-0 border-s' : 'left-0 border-e'}
          ${isMobileOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
        `}
        aria-label="Mobile Admin Navigation"
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-[#0B1C3D]">
          <BrandLogo variant="white" />
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database indicator */}
        <div className="px-5 py-2.5 bg-emerald-950/40 border-b border-emerald-900/40 flex items-center gap-2 text-[11px] font-bold text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">PostgreSQL 16 + PostGIS Active</span>
        </div>

        {/* Navigation items */}
        {renderNavLinks()}

        {/* User Card at bottom */}
        <div className="p-4 border-t border-slate-800/80 bg-[#061022]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center font-bold text-white text-xs border border-white/10 shadow-xs">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.fullName || 'AQAR IN Admin'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@aqarin.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 3. Desktop Collapsible Sidebar (Screens >= 1024px)              */}
      {/* ============================================================== */}
      <aside
        className={`
          hidden lg:flex flex-col shrink-0 bg-[#071329] text-white border-slate-800 transition-all duration-300 ease-in-out sticky top-0 h-screen z-30 select-none
          ${isRTL ? 'border-s' : 'border-e'}
          ${collapsed ? 'w-20' : 'w-64'}
        `}
        aria-label="Desktop Admin Navigation"
      >
        {/* Desktop Header */}
        <div className={`
          flex items-center justify-between px-4 py-4 border-b border-slate-800/80 bg-[#0B1C3D]
          ${collapsed ? 'justify-center px-2' : ''}
        `}>
          {!collapsed ? (
            <BrandLogo variant="white" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#122A5C] to-[#162F5E] flex items-center justify-center text-white border border-white/20 shadow-xs font-black text-sm">
              AQ
            </div>
          )}
        </div>

        {/* PostgreSQL 16 + PostGIS Active Indicator */}
        {!collapsed && (
          <div className="px-4 py-2 bg-emerald-950/30 border-b border-emerald-900/30 flex items-center gap-2 text-[10px] font-bold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">PostgreSQL 16 + PostGIS</span>
          </div>
        )}

        {/* Navigation Links */}
        {renderNavLinks()}

        {/* Footer / Collapse Toggle & User Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-[#061022] space-y-2">
          {/* User Preview */}
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Super Admin'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@aqarin.com'}</p>
              </div>
            </div>
          )}

          {/* Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/6 transition-colors
              ${collapsed ? 'justify-center px-1' : 'justify-between'}
            `}
            title={collapsed ? (isRTL ? 'توسيع القائمة' : 'Expand Sidebar') : (isRTL ? 'طي القائمة' : 'Collapse Sidebar')}
          >
            {!collapsed && (
              <span className="text-[11px] font-semibold">
                {isRTL ? 'طي القائمة الجانبية' : 'Collapse Sidebar'}
              </span>
            )}
            {isRTL ? (
              collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
