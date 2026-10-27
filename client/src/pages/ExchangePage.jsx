import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  HelpCircle,
  Repeat,
  Scale
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ExchangePage() {
  const { isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'submit'
  const [submitted, setSubmitted] = useState(false);

  // Sample active exchange opportunities
  const sampleExchanges = [
    {
      id: 1,
      offering: {
        titleAr: 'شقة 180م كاملة التشطيب في ميفيدا التجمع الخامس',
        titleEn: '180m Fully Finished in Mivida, New Cairo',
        value: '14,000,000 ج.م',
        type: 'Apartment'
      },
      seeking: {
        titleAr: 'تاون هاوس أو فيلا في الشيخ زايد (سوديك أو إعمار)',
        titleEn: 'Townhouse or Villa in Sheikh Zayed (Sodic/Emaar)',
        diffAction: 'مستعد لدفع فرق السعر كاش (Pay Delta)'
      },
      owner: 'د. ممدوح الشريف',
      verified: true,
      date: 'منذ يومين'
    },
    {
      id: 2,
      offering: {
        titleAr: 'شاليه أرضي بجاردن 120م في هاسيندا باي الساحل',
        titleEn: '120m Ground Chalet with Garden in Hacienda Bay',
        value: '18,500,000 ج.م',
        type: 'Chalet'
      },
      seeking: {
        titleAr: 'مكتب إداري أو عيادة في التجمع الخامس (شارع التسعين)',
        titleEn: 'Commercial Office/Clinic in 90th St, New Cairo',
        diffAction: 'بدل رأس برأس أو مع استلام فرق (Receive Delta)'
      },
      owner: 'م. أحمد توفيق',
      verified: true,
      date: 'منذ 4 أيام'
    },
    {
      id: 3,
      offering: {
        titleAr: 'دوبلكس 260م في زايد ديونز الشيخ زايد',
        titleEn: '260m Duplex in Zayed Dunes, Sheikh Zayed',
        value: '11,200,000 ج.م',
        type: 'Duplex'
      },
      seeking: {
        titleAr: 'شقة 150م في العاصمة الإدارية (منطقة الـ R7 أو الحي المالي)',
        titleEn: '150m Apartment in New Capital (R7 / Financial Dist)',
        diffAction: 'مع استلام فرق السعر كاش'
      },
      owner: 'أ. طارق عبد الرحمن',
      verified: true,
      date: 'منذ أسبوع'
    }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0B1C3D] via-[#102A56] to-[#0A1833] text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
            <ArrowLeftRight className="w-4 h-4 text-sky-400" />
            <span>{isRTL ? 'خدمة التبادل العقاري الذكي في مصر' : 'Smart Property Swap & Exchange'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isRTL ? (
              <>بدّل عقارك بعقار آخر،<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-300 to-amber-300">بدون عمولات وبتقييم عادل للطرفين</span></>
            ) : (
              <>Swap Your Property for Another<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-300 to-amber-300">With Fair Valuation & Direct Legal Escrow</span></>
            )}
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            {isRTL 
              ? 'هل ترغب في الانتقال من التجمع لزايد؟ أو تبديل شاليه صيفي بشقة سكنية أو مكتب تجاري؟ منصة عقار إن توفر لك آلية التبادل المباشر مع حساب الفارق المالي بدقة.'
              : 'Looking to relocate from New Cairo to Zayed? Or swap a vacation chalet for a prime office? AQAR IN matches owners directly with precise cash delta calculations.'}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'browse' ? 'bg-white text-[#0B1C3D] shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isRTL ? 'تصفح طلبات التبادل المتاحة' : 'Browse Exchange Requests'}
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'submit' ? 'bg-white text-[#0B1C3D] shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isRTL ? '+ أضف عقارك للبدل' : '+ List Your Unit for Swap'}
            </button>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'browse' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1C3D]">
                  {isRTL ? 'طلبات تبادل عقاري نشطة' : 'Active Exchange Listings'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isRTL ? 'مالكون موثقون يبحثون عن تبادل فوري مع إمكانية دفع أو استلام فرق السعر' : 'Verified property owners ready for immediate swap transactions'}
                </p>
              </div>

              <button
                onClick={() => setActiveTab('submit')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white text-xs font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{isRTL ? 'طلب تبادل جديد' : 'New Swap Request'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleExchanges.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
                  {/* Offering Block */}
                  <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-600 text-white">
                      {isRTL ? 'العقار المعروض' : 'Offering'}
                    </span>
                    <h3 className="text-sm font-bold text-[#0B1C3D] leading-snug">
                      {isRTL ? item.offering.titleAr : item.offering.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{isRTL ? 'القيمة التقديرية:' : 'Estimated Value:'} <span className="text-sky-700 font-bold">{item.offering.value}</span></p>
                  </div>

                  {/* Swap Icon */}
                  <div className="flex items-center justify-center -my-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-[#0B1C3D] flex items-center justify-center border border-slate-200">
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Seeking Block */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-600 text-white">
                      {isRTL ? 'المطلوب للبدل' : 'Seeking in Return'}
                    </span>
                    <h4 className="text-sm font-bold text-[#0B1C3D] leading-snug">
                      {isRTL ? item.seeking.titleAr : item.seeking.titleEn}
                    </h4>
                    <p className="text-[11px] text-amber-800 font-bold">{item.seeking.diffAction}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{item.owner}</span>
                    <a
                      href={`https://wa.me/201012345678?text=Hello,%20I%20am%20interested%20in%20Exchange%20deal%20%23${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white text-[11px] font-bold"
                    >
                      {isRTL ? 'تواصل للبدل' : 'Inquire for Swap'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            <h2 className="text-xl font-black text-[#0B1C3D]">
              {isRTL ? 'سجل عقارك في خدمة التبادل العقاري' : 'Submit Your Property for Swap'}
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'مواصفات عقارك الحالي' : 'Your Current Property'}</label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'شقة 160م، ميفيدا، التجمع الخامس' : 'e.g. 160m Apartment, Mivida, New Cairo'}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'المواصفات المطلوبة في العقار البديل' : 'Desired Target Property'}</label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'فيلا أو تاون هاوس في الشيخ زايد أو أكتوبر' : 'e.g. Townhouse or Villa in Sheikh Zayed'}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'رقم الهاتف' : 'Phone'}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+2010..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'رقم واتساب' : 'WhatsApp'}</label>
                  <input
                    type="tel"
                    placeholder="+2010..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white font-bold text-xs shadow-md"
              >
                {submitted ? (isRTL ? '✓ تم إرسال طلب التبادل بنجاح' : '✓ Request Submitted') : (isRTL ? 'نشر طلب التبادل العقاري' : 'Publish Exchange Request')}
              </button>
            </form>
          </div>
        )}
      </section>

    </div>
  );
}
