import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Building, ShieldCheck, ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { MASTER_DEVELOPERS } from '../../pages/DevelopersPage';

export default function CertifiedDevelopers() {
  const { isRTL } = useLanguage();
  const [showAll, setShowAll] = useState(false);

  const displayedDevelopers = showAll ? MASTER_DEVELOPERS : MASTER_DEVELOPERS.slice(0, 8);

  return (
    <section className="py-12 bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRTL ? 'كبار المطورين المعتمدين في مصر' : 'Verified Master Developers'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1C3D] tracking-tight">
              {isRTL ? 'مشروعات البرايماري من المطور مباشرة' : 'Egypt’s Top Tier Primary Developers'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              {isRTL 
                ? 'استكشف وحدات وكمبوندات موثقة من أكبر 16 مطور عقاري في مصر بخطط سداد تصل إلى 10 سنوات وبدون عمولة.'
                : 'Explore verified primary communities and developer units across 16 top developers with up to 10Y installments.'}
            </p>
          </div>

          <Link
            to="/developers"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1C3D] hover:text-sky-600 transition-colors"
          >
            <span>{isRTL ? 'دليل كافة المطورين (16)' : 'View All Developers Directory (16)'}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedDevelopers.map((dev) => (
            <Link
              key={dev.id}
              to={`/search?search=${encodeURIComponent(dev.searchKey)}`}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1C3D] text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
                    {dev.nameEn.charAt(0)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {isRTL ? dev.badgeAr : dev.badgeEn}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#0B1C3D] group-hover:text-sky-600 transition-colors flex items-center gap-1">
                    <span>{isRTL ? dev.nameAr : dev.nameEn}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {isRTL ? `خبرة منذ ${dev.established}` : `Est. ${dev.established}`} • {isRTL ? `تقسيط حتى ${dev.maxYears}` : `Up to ${dev.maxYears}`}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold line-clamp-1">
                    {(isRTL ? dev.projectsAr : dev.projectsEn).join(' • ')}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[11px] font-bold text-sky-600 flex items-center justify-between">
                <span>{isRTL ? 'تصفح المشروعات والوحدات' : 'Browse Projects'}</span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More / Show Less Toggle Button */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0B1C3D] text-xs font-bold border border-slate-200 shadow-xs inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>
              {showAll
                ? (isRTL ? 'عرض أقل' : 'Show Less')
                : (isRTL ? `عرض باقي كبار المطورين (+${MASTER_DEVELOPERS.length - 8})` : `Show All Developers (+${MASTER_DEVELOPERS.length - 8})`)}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </div>
    </section>
  );
}
