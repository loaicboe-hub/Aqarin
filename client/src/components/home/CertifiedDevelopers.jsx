import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Building, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function CertifiedDevelopers() {
  const { isRTL } = useLanguage();

  const developers = [
    {
      id: 'emaar',
      nameAr: 'إعمار مصر',
      nameEn: 'Emaar Misr',
      badgeAr: 'مطور معتمد فئة أ',
      badgeEn: 'Grade-A Developer',
      projectsAr: 'ميفيدا • أبتاون كايرو • مراسي • سولانا',
      projectsEn: 'Mivida • Uptown Cairo • Marassi • Soul',
      searchKey: 'Mivida',
      established: '1997'
    },
    {
      id: 'sodic',
      nameAr: 'سوديك العقارية',
      nameEn: 'SODIC Developments',
      badgeAr: 'رائد المشروعات المتكاملة',
      badgeEn: 'Integrated Master Developer',
      projectsAr: 'أليجريا • فيليت • كارميل • إيست تاون',
      projectsEn: 'Allegria • Villette • Karmell • Eastown',
      searchKey: 'Allegria',
      established: '1996'
    },
    {
      id: 'palmhills',
      nameAr: 'بالم هيلز للتعمير',
      nameEn: 'Palm Hills Developments',
      badgeAr: 'أكبر محفظة أراضي كمبوندات',
      badgeEn: 'Premier Residential Communities',
      projectsAr: 'بالم هيلز أكتوبر • باديا • نيو كايرو • هاسيندا',
      projectsEn: 'Palm Hills Oct • Badya • New Cairo • Hacienda',
      searchKey: 'Palm Hills',
      established: '2005'
    },
    {
      id: 'mountainview',
      nameAr: 'ماونتن فيو (DMG)',
      nameEn: 'Mountain View Egypt',
      badgeAr: 'رواد سعادة العيش واللاجون',
      badgeEn: 'Lagoon & Innovation Pioneer',
      projectsAr: 'آي سيتي التجمع • آي سيتي أكتوبر • رأس الحكمة',
      projectsEn: 'iCity New Cairo • iCity October • Ras El Hekma',
      searchKey: 'Mountain View',
      established: '2005'
    },
    {
      id: 'ora',
      nameAr: 'أورا للتطوير (ساويرس)',
      nameEn: 'Ora Developers (Sawiris)',
      badgeAr: 'أبراج فندقية عالمية',
      badgeEn: 'Luxury Towers & Destinations',
      projectsAr: 'أبراج زيد الشيخ زايد • زيد إيست • سيلفرساندز',
      projectsEn: 'Zed Towers Zayed • Zed East • Silversands',
      searchKey: 'Zed',
      established: '2016'
    },
    {
      id: 'tmg',
      nameAr: 'مجموعة طلعت مصطفى (TMG)',
      nameEn: 'Talaat Moustafa Group',
      badgeAr: 'أكبر مطور مدن ذكية متكاملة',
      badgeEn: 'Smart Cities Master Builder',
      projectsAr: 'مدينتي • الرحاب • نور سيتي • بنان',
      projectsEn: 'Madinaty • Al Rehab • Noor City • Banan',
      searchKey: 'Madinaty',
      established: '1970'
    },
    {
      id: 'hassanallam',
      nameAr: 'حسن علام العقارية',
      nameEn: 'Hassan Allam Properties',
      badgeAr: 'تراث معماري فاخر',
      badgeEn: 'Heritage Luxury Architecture',
      projectsAr: 'سوان ليك التجمع • سوان ليك الجونة • هاب تاون',
      projectsEn: 'Swan Lake New Cairo • Swan Lake Gouna • Haptown',
      searchKey: 'Swan Lake',
      established: '1936'
    },
    {
      id: 'misritalia',
      nameAr: 'مصر إيطاليا العقارية',
      nameEn: 'Misr Italia Properties',
      badgeAr: 'رواد العاصمة والساحل',
      badgeEn: 'Capital & Coastal Trailblazer',
      projectsAr: 'إل بوسكو العاصمة • فينشي • سولاري رأس الحكمة',
      projectsEn: 'IL Bosco • Vinci • Solare Ras El Hekma',
      searchKey: 'Bosco',
      established: '1998'
    }
  ];

  return (
    <section className="py-12 bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRTL ? 'شراكات رسمية معتمدة' : 'Verified Master Developers'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1C3D] tracking-tight">
              {isRTL ? 'كبار المطورين العقاريين في مصر' : 'Egypt’s Top Tier Developers'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              {isRTL 
                ? 'استكشف وحدات وكمبوندات موثقة من أكبر شركات التطوير العقاري ذات السجل الذهبي في مصر.'
                : 'Explore verified units and communities from Egypt’s most reputable developers with proven track records.'}
            </p>
          </div>

          <Link
            to="/buy"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1C3D] hover:text-sky-600 transition-colors"
          >
            <span>{isRTL ? 'استكشف كافة مشروعات المطورين' : 'View All Developer Projects'}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {developers.map((dev) => (
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
                    {isRTL ? `خبرة منذ ${dev.established}` : `Est. ${dev.established}`}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold line-clamp-1">
                    {isRTL ? dev.projectsAr : dev.projectsEn}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-[11px] font-bold text-sky-600 flex items-center justify-between">
                <span>{isRTL ? 'تصفح الوحدات المتاحة' : 'Browse Units'}</span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
