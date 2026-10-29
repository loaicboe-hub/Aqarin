import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck,
  ExternalLink,
  Heart,
  Zap,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { isRTL } = useLanguage();

  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 pt-16 pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <BrandLogo />
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              {isRTL 
                ? 'عقار إن (AQAR IN) — المنصة الرائدة للخدمات والاستخبارات العقارية في مصر. عقارات موثقة، بيع سريع، تبادل عقارات، وإدارة أملاك متكاملة للمشترين والمستثمرين.'
                : 'AQAR IN — Egypt\'s premier smart property intelligence platform. Verified properties, fast sell, property exchange, and comprehensive asset management across Egypt.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-sky-700 font-bold flex items-center gap-2 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {isRTL ? 'بيانات معتمدة ومحدثة 2026' : 'Verified 2026 Intelligence'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] mb-4">
              {isRTL ? 'خدمات العقارات' : 'Property Services'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/fast-sell" className="hover:text-sky-600 transition-colors font-medium">
                  {isRTL ? 'البيع السريع (كاش)' : 'Fast Sell Cash Offer'}
                </Link>
              </li>
              <li>
                <Link to="/buy" className="hover:text-sky-600 transition-colors font-medium">
                  {isRTL ? 'عقارات للبيع في مصر' : 'Properties for Sale'}
                </Link>
              </li>
              <li>
                <Link to="/rent" className="hover:text-sky-600 transition-colors font-medium">
                  {isRTL ? 'عقارات للإيجار' : 'Properties for Rent'}
                </Link>
              </li>
              <li>
                <Link to="/commercial" className="hover:text-sky-600 transition-colors font-medium">
                  {isRTL ? 'المكاتب والمحلات التجارية' : 'Commercial & Retail'}
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-sky-600 transition-colors font-medium">
                  {isRTL ? 'محرك البحث المتقدم' : 'Advanced Search'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialized Services & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] mb-4">
              {isRTL ? 'حلول وخدمات متخصصة' : 'Specialized Services'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/exchange" className="hover:text-sky-600 transition-colors font-medium">
                  {isRTL ? 'خدمة تبادل العقارات' : 'Property Exchange'}
                </Link>
              </li>
              <li>
                <Link to="/management" className="hover:text-sky-600 transition-colors font-medium">
                  {isRTL ? 'إدارة وتشغيل الأملاك' : 'Property Management'}
                </Link>
              </li>
              <li>
                <Link to="/finishing" className="hover:text-sky-600 transition-colors font-medium">
                  {isRTL ? 'باقات التشطيب والديكور' : 'Finishing & Renovation'}
                </Link>
              </li>
              <li>
                <Link to="/selling-checklist" className="hover:text-sky-600 transition-colors font-medium">
                  {isRTL ? 'قائمة فحص البائعين' : 'Seller Due Diligence'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Hotspots */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] mb-4">
              {isRTL ? 'أهم المناطق والكمبوندات' : 'Top Egyptian Hotspots'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{isRTL ? 'التجمع الخامس والمربع الذهبي' : 'New Cairo & 5th Settlement'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{isRTL ? 'الشيخ زايد وأكتوبر' : 'Sheikh Zayed & 6th of October'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{isRTL ? 'العاصمة الإدارية الجديدة' : 'New Administrative Capital'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{isRTL ? 'الساحل الشمالي ورأس الحكمة' : 'North Coast & Ras El Hekma'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{isRTL ? 'الجونة وسوما باي' : 'El Gouna & Red Sea'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © {new Date().getFullYear()} AQAR IN (عقار إن) Egypt. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-500">
            <Link to="/terms" className="hover:text-slate-800 transition-colors">
              {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </Link>
            <Link to="/privacy" className="hover:text-slate-800 transition-colors">
              {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <Link to="/partners/apply" className="hover:text-sky-700 font-bold text-[#0B1C3D]">
              {isRTL ? 'انضم كشريك' : 'Partner with Us'}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
