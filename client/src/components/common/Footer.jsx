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
import { SITE_CONFIG } from '../../config/siteConfig';

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

            <div className="space-y-1.5 text-xs text-slate-500 pt-1">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <a 
                  href={`tel:${SITE_CONFIG.phone}`} 
                  dir="ltr" 
                  className="font-mono hover:text-sky-700 inline-block text-left"
                  style={{ unicodeBidi: 'isolate' }}
                >
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <a 
                  href={SITE_CONFIG.getWhatsAppUrl()} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  {isRTL ? 'محادثة واتساب مباشرة' : 'Direct WhatsApp Chat'}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="font-mono hover:text-sky-700">{SITE_CONFIG.email}</a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{isRTL ? SITE_CONFIG.addressAr : SITE_CONFIG.addressEn}</span>
              </p>
            </div>

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
                <Link to="/developers" className="hover:text-sky-600 transition-colors font-medium text-emerald-700 font-bold">
                  {isRTL ? 'كبار المطورين في مصر (16)' : 'Master Developers (16)'}
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
