import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ChevronDown, 
  Menu, 
  X, 
  Plus, 
  LogOut, 
  LayoutDashboard,
  Calculator,
  ShieldCheck,
  Landmark,
  Compass,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [valuationOpen, setValuationOpen] = useState(false);
  const [commercialOpen, setCommercialOpen] = useState(false);
  const [mortgageOpen, setMortgageOpen] = useState(false);

  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { lang, toggleLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo (AQAR IN - عقار إن) */}
          <Link to="/" className="group">
            <BrandLogo />
          </Link>

          {/* Center Navigation Links (Exact Match) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#0B1C3D]">
            
            {/* Valuation Dropdown */}
            <div className="relative">
              <button
                onClick={() => setValuationOpen(!valuationOpen)}
                onBlur={() => setTimeout(() => setValuationOpen(false), 200)}
                className={`flex items-center gap-1 hover:text-sky-600 transition-colors ${
                  isActive('/valuation') ? 'text-sky-600 font-bold' : ''
                }`}
              >
                <span>{isRTL ? 'التقييم' : 'Valuation'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {valuationOpen && (
                <div className="absolute top-full mt-2 w-56 bg-white rounded-2xl p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    to="/valuation/instant"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0B1C3D] transition-colors"
                  >
                    {isRTL ? 'التقييم الذكي الفوري' : 'Instant AI Valuation'}
                  </Link>
                  <Link
                    to="/valuation/professional"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0B1C3D] transition-colors"
                  >
                    {isRTL ? 'طلب معاينة مهندس معتمد' : 'Certified Appraiser Visit'}
                  </Link>
                </div>
              )}
            </div>

            {/* Buy */}
            <Link
              to="/buy"
              className={`hover:text-sky-600 transition-colors ${
                location.pathname === '/buy' ? 'text-sky-600 font-bold' : ''
              }`}
            >
              {isRTL ? 'شراء' : 'Buy'}
            </Link>

            {/* Rent */}
            <Link
              to="/rent"
              className={`hover:text-sky-600 transition-colors ${
                location.pathname === '/rent' ? 'text-sky-600 font-bold' : ''
              }`}
            >
              {isRTL ? 'إيجار' : 'Rent'}
            </Link>

            {/* Commercial Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCommercialOpen(!commercialOpen)}
                onBlur={() => setTimeout(() => setCommercialOpen(false), 200)}
                className={`flex items-center gap-1 hover:text-sky-600 transition-colors ${
                  isActive('/commercial') ? 'text-sky-600 font-bold' : ''
                }`}
              >
                <span>{isRTL ? 'تجاري وإداري' : 'Commercial'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {commercialOpen && (
                <div className="absolute top-full mt-2 w-56 bg-white rounded-2xl p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    to="/commercial?type=sale"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0B1C3D]"
                  >
                    {isRTL ? 'مكاتب ومحلات للبيع' : 'Commercial for Sale'}
                  </Link>
                  <Link
                    to="/commercial?type=rent"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0B1C3D]"
                  >
                    {isRTL ? 'مكاتب ومحلات للإيجار' : 'Commercial for Rent'}
                  </Link>
                </div>
              )}
            </div>

            {/* Mortgage Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMortgageOpen(!mortgageOpen)}
                onBlur={() => setTimeout(() => setMortgageOpen(false), 200)}
                className={`flex items-center gap-1 hover:text-sky-600 transition-colors ${
                  isActive('/mortgage') ? 'text-sky-600 font-bold' : ''
                }`}
              >
                <span>{isRTL ? 'تمويل عقاري' : 'Mortgage'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {mortgageOpen && (
                <div className="absolute top-full mt-2 w-60 bg-white rounded-2xl p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    to="/mortgage/calculator"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0B1C3D]"
                  >
                    {isRTL ? 'حاسبة التمويل العقاري' : 'Mortgage Calculator'}
                  </Link>
                  <Link
                    to="/mortgage/banks"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0B1C3D]"
                  >
                    {isRTL ? 'مقارنة عروض البنوك المصرية' : 'Compare Egyptian Banks'}
                  </Link>
                  <Link
                    to="/mortgage/apply"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0B1C3D]"
                  >
                    {isRTL ? 'طلب الموافقة المسبقة' : 'Apply for Pre-Approval'}
                  </Link>
                </div>
              )}
            </div>

          </nav>

          {/* Right Actions (Sign In & + Add Property Button) */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="text-xs font-bold text-slate-500 hover:text-[#0B1C3D] px-2 py-1 rounded-md border border-slate-200"
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-[#0B1C3D] flex items-center gap-1.5 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{user?.fullName?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-slate-400 hover:text-rose-500"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="text-sm font-bold text-[#0B1C3D] hover:text-sky-600 transition-colors px-2 py-1"
              >
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </Link>
            )}

            {/* + Add Property Pill Button (Exact Match: Navy background, rounded-full) */}
            <Link
              to="/add-property"
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#0B1C3D] hover:bg-[#122B5C] flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? 'إضافة عقار' : 'Add Property'}</span>
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="p-1.5 rounded-md text-xs font-bold text-slate-600 border border-slate-200"
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
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-3 shadow-xl">
          <Link
            to="/add-property"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-3 rounded-full text-center font-bold text-white bg-[#0B1C3D] flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{isRTL ? 'أضف عقارك الآن' : 'Add Property'}</span>
          </Link>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-bold text-[#0B1C3D]">
            <Link to="/valuation/instant" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-slate-50 rounded-xl">
              {isRTL ? 'التقييم الفوري' : 'Instant Valuation'}
            </Link>
            <Link to="/buy" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-slate-50 rounded-xl">
              {isRTL ? 'شراء' : 'Buy'}
            </Link>
            <Link to="/rent" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-slate-50 rounded-xl">
              {isRTL ? 'إيجار' : 'Rent'}
            </Link>
            <Link to="/mortgage/calculator" onClick={() => setMobileMenuOpen(false)} className="p-3 bg-slate-50 rounded-xl">
              {isRTL ? 'تمويل عقاري' : 'Mortgage'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
