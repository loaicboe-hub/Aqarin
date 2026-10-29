import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard,
  Zap,
  Rocket,
  ArrowLeftRight,
  Paintbrush,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import BrandLogo from './BrandLogo';
import { SITE_CONFIG } from '../../config/siteConfig';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { lang, toggleLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo (AQAR IN - عقار إن) */}
          <Link to="/" className="group shrink-0">
            <BrandLogo />
          </Link>

          {/* Center Navigation Links: The 7 Core Services Requested */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-[13px] font-bold text-[#0B1C3D]">
            
            {/* 1. Fast Buy (شراء سريع) */}
            <Link
              to="/fast-buy"
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-2xs ${
                isActive('/fast-buy')
                  ? 'bg-amber-500 text-white font-black shadow-sm'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 hover:scale-105'
              }`}
              title="Fast Buy"
            >
              <Zap className={`w-3.5 h-3.5 ${isActive('/fast-buy') ? 'text-white' : 'text-amber-500 fill-current'}`} />
              <span>{isRTL ? 'شراء سريع' : 'Fast Buy'}</span>
            </Link>

            {/* 2. Fast Sell (بيع سريع) */}
            <Link
              to="/fast-sell"
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-2xs ${
                isActive('/fast-sell')
                  ? 'bg-rose-600 text-white font-black shadow-sm'
                  : 'text-rose-800 bg-rose-50 hover:bg-rose-100 hover:scale-105'
              }`}
              title="Fast Sell"
            >
              <Rocket className={`w-3.5 h-3.5 ${isActive('/fast-sell') ? 'text-white' : 'text-rose-500'}`} />
              <span>{isRTL ? 'بيع سريع' : 'Fast Sell'}</span>
            </Link>

            {/* 3. Buy (شراء) */}
            <Link
              to="/buy"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                isActive('/buy') ? 'text-sky-700 bg-sky-50 font-black' : 'hover:text-sky-600 text-[#0B1C3D]'
              }`}
            >
              {isRTL ? 'شراء' : 'Buy'}
            </Link>

            {/* 4. Sell (بيع) */}
            <Link
              to="/sell"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                isActive('/sell') ? 'text-sky-700 bg-sky-50 font-black' : 'hover:text-sky-600 text-[#0B1C3D]'
              }`}
            >
              {isRTL ? 'بيع' : 'Sell'}
            </Link>

            {/* 5. Rent (إيجار) */}
            <Link
              to="/rent"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                isActive('/rent') ? 'text-sky-700 bg-sky-50 font-black' : 'hover:text-sky-600 text-[#0B1C3D]'
              }`}
            >
              {isRTL ? 'إيجار' : 'Rent'}
            </Link>

            {/* 6. Exchange (تبادل عقاري) */}
            <Link
              to="/exchange"
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                isActive('/exchange')
                  ? 'text-sky-700 bg-sky-100/80 font-black'
                  : 'hover:text-sky-600 text-[#0B1C3D]'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-sky-600" />
              <span>{isRTL ? 'تبادل عقاري' : 'Exchange'}</span>
            </Link>

            {/* Developers (المطورين) */}
            <Link
              to="/developers"
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                isActive('/developers')
                  ? 'text-sky-700 bg-sky-100/80 font-black'
                  : 'hover:text-sky-600 text-[#0B1C3D]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              <span>{isRTL ? 'المطورين' : 'Developers'}</span>
            </Link>

            {/* 7. تشطيبات (Finishing) */}
            <Link
              to="/finishing"
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                isActive('/finishing')
                  ? 'bg-teal-600 text-white font-black shadow-sm'
                  : 'text-teal-800 bg-teal-50 hover:bg-teal-100 hover:scale-105'
              }`}
            >
              <Paintbrush className={`w-3.5 h-3.5 ${isActive('/finishing') ? 'text-white' : 'text-teal-600'}`} />
              <span>{isRTL ? 'تشطيبات' : 'Finishing'}</span>
            </Link>

            {/* 8. Management (إدارة الأملاك) */}
            <Link
              to="/management"
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                isActive('/management')
                  ? 'bg-indigo-600 text-white font-black shadow-sm'
                  : 'text-indigo-800 bg-indigo-50 hover:bg-indigo-100 hover:scale-105'
              }`}
            >
              <Briefcase className={`w-3.5 h-3.5 ${isActive('/management') ? 'text-white' : 'text-indigo-600'}`} />
              <span>{isRTL ? 'إدارة الأملاك' : 'Management'}</span>
            </Link>

          </nav>

          {/* Right Actions (Language, Auth, + Add Property CTA) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="text-xs font-bold text-slate-600 hover:text-[#0B1C3D] px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-[#0B1C3D] flex items-center gap-1.5 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{user?.fullName?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B1C3D] hover:bg-[#122B5C] transition-colors shadow-sm"
              >
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="p-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-200"
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-[#0B1C3D]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-3 shadow-xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-bold text-[#0B1C3D]">
            {/* 1. Fast Buy */}
            <Link 
              to="/fast-buy" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-3 bg-amber-50 text-amber-800 rounded-xl flex items-center gap-2 border border-amber-100"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-current" />
              <span>{isRTL ? '1. شراء سريع' : '1. Fast Buy'}</span>
            </Link>

            {/* 2. Fast Sell */}
            <Link 
              to="/fast-sell" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-3 bg-rose-50 text-rose-800 rounded-xl flex items-center gap-2 border border-rose-100"
            >
              <Rocket className="w-4 h-4 text-rose-500" />
              <span>{isRTL ? '2. بيع سريع' : '2. Fast Sell'}</span>
            </Link>

            {/* 3. Buy */}
            <Link 
              to="/buy" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-3 bg-slate-50 rounded-xl flex items-center gap-2"
            >
              <span>{isRTL ? '3. شراء' : '3. Buy'}</span>
            </Link>

            {/* 4. Sell */}
            <Link 
              to="/sell" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-3 bg-slate-50 rounded-xl flex items-center gap-2"
            >
              <span>{isRTL ? '4. بيع' : '4. Sell'}</span>
            </Link>

            {/* 5. Rent */}
            <Link 
              to="/rent" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-3 bg-slate-50 rounded-xl flex items-center gap-2"
            >
              <span>{isRTL ? '5. إيجار' : '5. Rent'}</span>
            </Link>

            {/* 6. Exchange */}
            <Link 
              to="/exchange" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-3 bg-sky-50 text-sky-800 rounded-xl flex items-center gap-2 border border-sky-100"
            >
              <ArrowLeftRight className="w-4 h-4 text-sky-600" />
              <span>{isRTL ? '6. تبادل عقاري' : '6. Exchange'}</span>
            </Link>

            {/* 7. تشطيبات */}
            <Link 
              to="/finishing" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-3 bg-teal-50 text-teal-800 rounded-xl flex items-center gap-2 border border-teal-100"
            >
              <Paintbrush className="w-4 h-4 text-teal-600" />
              <span>{isRTL ? '7. تشطيبات' : '7. Finishing'}</span>
            </Link>

            {/* 8. Management */}
            <Link 
              to="/management" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-3 bg-indigo-50 text-indigo-800 rounded-xl flex items-center gap-2 border border-indigo-100"
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>{isRTL ? '8. إدارة الأملاك' : '8. Management'}</span>
            </Link>

            {/* Developers */}
            <Link 
              to="/developers" 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-3 bg-sky-50 text-sky-900 rounded-xl flex items-center gap-2 border border-sky-100 font-bold"
            >
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>{isRTL ? '9. كبار المطورين في مصر' : '9. Master Developers'}</span>
            </Link>

            {/* Direct WhatsApp Call/Chat */}
            <a
              href={SITE_CONFIG.getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-between font-bold border border-emerald-200 mt-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isRTL ? 'تواصل معنا واتساب' : 'WhatsApp Support'}</span>
              </div>
              <span className="font-mono text-xs" dir="ltr" style={{ unicodeBidi: 'isolate' }}>{SITE_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
