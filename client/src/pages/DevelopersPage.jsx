import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Calendar, 
  Coins, 
  ArrowRight, 
  MessageSquareShare, 
  MapPin, 
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SITE_CONFIG } from '../config/siteConfig';

import rawNawyDevelopers from '../data/nawyDevelopers.json';

// Handcrafted enhancements for top tier master developers
const ENHANCEMENTS = {
  sodic: { established: '1996', badgeAr: 'رائد المجتمعات الراقية فئة أ', badgeEn: 'Integrated Living Pioneer Grade-A' },
  emaar_misr: { established: '1997', badgeAr: 'مطور معتمد فئة أ • عالمي', badgeEn: 'Grade-A Global Master Developer' },
  palm_hills_developments: { established: '2005', badgeAr: 'أكبر محفظة مجتمعات سكنية', badgeEn: 'Leading Residential Portfolio' },
  mountain_view: { established: '2005', badgeAr: 'رواد سعادة العيش واللاجون', badgeEn: 'Happiness & Lagoon Innovation' },
  ora_developers: { established: '2016', badgeAr: 'أبراج عالمية فاخرة • ساويرس', badgeEn: 'Ultra-Luxury Towers & Destinations' },
  hassan_allam_properties: { established: '1936', badgeAr: 'أعرق صرح عمراني مصري', badgeEn: 'Heritage & Legacy Builder' },
  tatweer_misr: { established: '2014', badgeAr: 'أيقونة المشروعات الجبلية والساحلية', badgeEn: 'Iconic Coastal & Mountain Living' },
  misr_italia_properties: { established: '1998', badgeAr: 'رواد الفكر الإيطالي المعاصر', badgeEn: 'Contemporary Italian Master Living' },
  talaat_moustafa_group__tmg_: { established: '1970', badgeAr: 'رائد المدن الذكية المليونية', badgeEn: 'Smart Megacity Master Developer' },
  the_waterway_developments: { established: '2008', badgeAr: 'عنوان الفخامة والرقي', badgeEn: 'Boutique Luxury Excellence' },
  hyde_park: { established: '2007', badgeAr: 'واحة الطبيعة والحدائق الكبرى', badgeEn: 'Green Sanctuary & Large Parks' },
  city_edge_developments: { established: '2017', badgeAr: 'المطور الوطني لأبراج العلمين', badgeEn: 'National Icon & Skyscraper Pioneer' },
  madinet_masr: { established: '1959', badgeAr: 'تاريخ عريق ورؤية مستقبلية', badgeEn: '65+ Years of Urban Excellence' },
  al_ahly_sabbour_developments: { established: '1994', badgeAr: 'أعرق استشارات وتطوير عقاري', badgeEn: 'Pioneer Engineering & Development' },
  la_vista_developments: { established: '1991', badgeAr: 'منتجعات شاطئية وبوتيك كومباوندز', badgeEn: 'Premier Coastal & Patio Resorts' },
  madaar_development: { established: '2015', badgeAr: 'وجهات شاطئية وبحيرات ساحرة', badgeEn: 'Waterfront Innovation & Lagoons' }
};

export const MASTER_DEVELOPERS = rawNawyDevelopers.map(dev => {
  const enh = ENHANCEMENTS[dev.id] || {};
  return {
    ...dev,
    established: enh.established || dev.established || '2010',
    badgeAr: enh.badgeAr || dev.badgeAr,
    badgeEn: enh.badgeEn || dev.badgeEn
  };
});

export default function DevelopersPage() {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regions = [
    { id: 'all', nameAr: `كل المطورين (${MASTER_DEVELOPERS.length})`, nameEn: `All Developers (${MASTER_DEVELOPERS.length})` },
    { id: 'new_cairo', nameAr: 'القاهرة الجديدة والمستقبل', nameEn: 'New Cairo & Mostakbal' },
    { id: 'zayed_october', nameAr: 'الشيخ زايد و 6 أكتوبر', nameEn: 'Zayed & 6th October' },
    { id: 'north_coast', nameAr: 'الساحل الشمالي ورأس الحكمة', nameEn: 'North Coast & Ras El Hekma' },
    { id: 'capital', nameAr: 'العاصمة الإدارية', nameEn: 'New Administrative Capital' },
    { id: 'red_sea', nameAr: 'العين السخنة والجونة', nameEn: 'Ain Sokhna & El Gouna' }
  ];

  const filteredDevelopers = MASTER_DEVELOPERS.filter((dev) => {
    const matchesRegion = selectedRegion === 'all' || dev.region === selectedRegion;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesRegion;

    const matchesName = 
      dev.nameAr.toLowerCase().includes(query) ||
      dev.nameEn.toLowerCase().includes(query) ||
      dev.projectsAr.some((p) => p.toLowerCase().includes(query)) ||
      dev.projectsEn.some((p) => p.toLowerCase().includes(query));

    return matchesRegion && matchesName;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20 text-slate-900">
      
      {/* 1. Hero Banner */}
      <section className="bg-gradient-to-b from-[#0B1C3D] via-[#0F2752] to-[#0B1C3D] text-white pt-16 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sky-300 text-xs font-bold border border-white/15">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isRTL ? 'دليل كبار المطورين المعتمدين في مصر' : 'Egypt’s Verified Master Real Estate Developers'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isRTL ? 'استكشف وحدات البرايماري من كبار مطوري مصر' : 'Explore Primary Projects from Egypt’s Top Developers'}
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isRTL 
              ? 'تصفح أحدث المشروعات السكنية والتجارية والساحلية من المطور مباشرة. خطط سداد مريحة تصل إلى 10 سنوات وبدون أي عمولات سمسرة.'
              : 'Browse verified primary compounds and developer sales directly with zero brokerage fees and installment plans up to 10 years.'}
          </p>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
              <p className="text-2xl font-black text-amber-400">{MASTER_DEVELOPERS.length}+</p>
              <p className="text-[11px] text-slate-300 font-semibold">{isRTL ? 'مطور فئة أ معتمد' : 'Grade-A Developers'}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
              <p className="text-2xl font-black text-sky-400">460+</p>
              <p className="text-[11px] text-slate-300 font-semibold">{isRTL ? 'كمبوند ومدينة متكاملة' : 'Master Communities'}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
              <p className="text-2xl font-black text-emerald-400">10Y</p>
              <p className="text-[11px] text-slate-300 font-semibold">{isRTL ? 'أطول فترات تقسيط' : 'Up to 10Y Installments'}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
              <p className="text-2xl font-black text-teal-300">0%</p>
              <p className="text-[11px] text-slate-300 font-semibold">{isRTL ? 'بدون عمولة وساطة' : 'Zero Brokerage Fees'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/80 space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? 'ابحث باسم المطور (سوديك، إعمار، بالم هيلز) أو اسم الكمبوند (ميفيدا، باديا، مراسي)...' : 'Search by developer (SODIC, Emaar, Palm Hills) or compound (Mivida, Badya, Marassi)...'}
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {regions.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedRegion === reg.id
                    ? 'bg-[#0B1C3D] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isRTL ? reg.nameAr : reg.nameEn}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Developers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            {isRTL ? `عرض ${filteredDevelopers.length} من كبار المطورين المعتمدين` : `Showing ${filteredDevelopers.length} Verified Master Developers`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((dev) => (
            <div
              key={dev.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Card Top: Logo & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 p-1.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                    {dev.logo ? (
                      <img src={dev.logo} alt={dev.nameEn} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-[#0B1C3D] text-white flex items-center justify-center font-black text-xl">
                        {dev.nameEn.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                      {isRTL ? dev.badgeAr : dev.badgeEn}
                    </span>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">
                      {isRTL ? `تأسست عام ${dev.established}` : `Est. ${dev.established}`}
                    </p>
                  </div>
                </div>

                {/* Developer Name & Description */}
                <div>
                  <h3 className="text-lg font-black text-[#0B1C3D] group-hover:text-sky-600 transition-colors flex items-center gap-1.5">
                    <span>{isRTL ? dev.nameAr : dev.nameEn}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {isRTL ? dev.descriptionAr : dev.descriptionEn}
                  </p>
                </div>

                {/* Terms Pills */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">{isRTL ? 'المقدم يبدأ من' : 'Down Payment'}</span>
                      <strong className="text-slate-800">{dev.downPayment}</strong>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">{isRTL ? 'فترة التقسيط حتى' : 'Installments'}</span>
                      <strong className="text-slate-800">{dev.maxYears}</strong>
                    </div>
                  </div>
                </div>

                {/* Flagship Projects Pills */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    {isRTL ? 'أبرز الكمبوندات والمشروعات:' : 'Flagship Communities:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(isRTL ? dev.projectsAr : dev.projectsEn).map((proj, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                      >
                        {proj}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                <Link
                  to={`/search?search=${encodeURIComponent(dev.searchKey)}`}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B1C3D] hover:bg-[#122B5C] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>{isRTL ? 'تصفح وحدات المطور' : 'View Units'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>

                <a
                  href={SITE_CONFIG.getWhatsAppUrl(
                    isRTL
                      ? `مرحباً، أود الاستفسار عن مشروعات وأسعار مطور (${dev.nameAr}) وأنظمة السداد المتاحة.`
                      : `Hello, I want to inquire about projects by (${dev.nameEn}) and payment plans.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0 transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquareShare className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* 4. Consultation CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B1C3D] to-[#122B5C] p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              {isRTL ? 'تحتاج مساعدة في اختيار المطور أو المشروع الأنسب؟' : 'Need Guidance on Choosing the Right Developer?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              {isRTL
                ? 'مستشارونا العقاريون يساعدونك في مقارنة أسعار المتر، نسب التحميل، خطط السداد، وجدول تسليم الوحدات بدون أي مقابل.'
                : 'Our certified property advisors will help you compare price per sqm, payment plans, and delivery schedules for free.'}
            </p>
          </div>

          <a
            href={SITE_CONFIG.getWhatsAppUrl(
              isRTL 
                ? 'مرحباً، أود استشارة عقارية مجانية لمقارنة مشروعات كبار المطورين في مصر.' 
                : 'Hello, I would like a free consultation comparing top developer projects in Egypt.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg hover:scale-105 transition-all shrink-0"
          >
            <MessageSquareShare className="w-4 h-4" />
            <span>{isRTL ? 'تحدث مع مستشارك العقاري الآن' : 'Speak to Real Estate Advisor'}</span>
          </a>
        </div>
      </section>

    </div>
  );
}
