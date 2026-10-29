import React, { useState, useEffect } from 'react';
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
  Scale,
  Loader2,
  AlertCircle,
  MessageSquareShare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { submitPropertyExchange, fetchExchanges } from '../services/api';
import { SITE_CONFIG } from '../config/siteConfig';

export default function ExchangePage() {
  const { isRTL } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'submit'
  const [liveExchanges, setLiveExchanges] = useState([]);
  const [loadingExchanges, setLoadingExchanges] = useState(true);

  // Submit Form State
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [offering, setOffering] = useState('');
  const [seeking, setSeeking] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [whatsapp, setWhatsapp] = useState(user?.phone || '');

  // Sample fallback exchanges
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
      verified: true
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
      verified: true
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
      verified: true
    }
  ];

  const loadExchangeFeed = async () => {
    setLoadingExchanges(true);
    try {
      const data = await fetchExchanges();
      setLiveExchanges(data || []);
    } catch (err) {
      console.error('Failed to load exchanges:', err);
    } finally {
      setLoadingExchanges(false);
    }
  };

  useEffect(() => {
    loadExchangeFeed();
  }, []);

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitPropertyExchange({
        offeringSpecs: offering,
        seekingSpecs: seeking,
        phone,
        whatsapp: whatsapp || phone,
        userId: user?.id || null
      });
      setSubmitted(true);
      loadExchangeFeed();
    } catch (err) {
      setError(err.message || (isRTL ? 'فشل إرسال طلب البدل' : 'Failed to submit exchange'));
    } finally {
      setSubmitting(false);
    }
  };

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
              <>بدّل عقارك بعقار آخر،<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-300 to-amber-300">بدون عمولات وبسعر عادل للطرفين</span></>
            ) : (
              <>Swap Your Property for Another<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-300 to-amber-300">With Fair Market Pricing & Direct Legal Escrow</span></>
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

            {loadingExchanges ? (
              <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Live Exchange Listings from Database */}
                {liveExchanges.map((item) => (
                  <div key={`live-${item.id}`} className="bg-white rounded-3xl p-6 border-2 border-sky-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                        {isRTL ? 'طلب حي ومباشر' : 'Live Opportunity'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">#{item.id}</span>
                    </div>

                    {/* Offering Block */}
                    <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-600 text-white">
                        {isRTL ? 'العقار المعروض' : 'Offering'}
                      </span>
                      <h3 className="text-sm font-bold text-[#0B1C3D] leading-snug">
                        {item.offering_specs}
                      </h3>
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
                        {item.seeking_specs}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium font-mono">{item.phone ? `${item.phone.slice(0, 7)}***` : 'Verified'}</span>
                      <a
                        href={SITE_CONFIG.getWhatsAppUrl(`Hello, I am interested in property exchange deal #${item.id}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <MessageSquareShare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isRTL ? 'تواصل للبدل' : 'Inquire for Swap'}</span>
                      </a>
                    </div>
                  </div>
                ))}

                {/* 2. Sample Opportunities */}
                {sampleExchanges.map((item) => (
                  <div key={`sample-${item.id}`} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
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
                        href={SITE_CONFIG.getWhatsAppUrl(`Hello, I am interested in Exchange deal #${item.id}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <MessageSquareShare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isRTL ? 'تواصل للبدل' : 'Inquire for Swap'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            <h2 className="text-xl font-black text-[#0B1C3D]">
              {isRTL ? 'سجل عقارك في خدمة التبادل العقاري' : 'Submit Your Property for Swap'}
            </h2>
            <p className="text-xs text-slate-500">
              {isRTL 
                ? 'يتم فحص ومراجعة طلبك وإدراجه فوراً في جدول التبادل المباشر بقاعدة بيانات عقار إن.'
                : 'Your submission will be immediately recorded in AQAR IN live PostgreSQL database.'}
            </p>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">
                  {isRTL ? 'تم تسجيل ونشر طلب التبادل بنجاح!' : 'Exchange Request Successfully Published!'}
                </h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  {isRTL 
                    ? 'سيتم التواصل معك فور توفر فرصة تطابق ملائمة مع طلبك. يمكنك متابعة طلبك من لوحة تحكم حسابك.' 
                    : 'We will notify you once a suitable matching swap property is found. You can track this in your User Dashboard.'}
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setActiveTab('browse'); }}
                    className="px-5 py-2.5 rounded-full bg-[#0B1C3D] text-white text-xs font-bold"
                  >
                    {isRTL ? 'تصفح العروض الحالية' : 'Browse All Deals'}
                  </button>
                  <Link
                    to="/dashboard"
                    className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50"
                  >
                    {isRTL ? 'لوحة التحكم الخاصة بي' : 'My Dashboard'}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExchangeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'مواصفات عقارك الحالي' : 'Your Current Property'}</label>
                  <input
                    type="text"
                    required
                    value={offering}
                    onChange={(e) => setOffering(e.target.value)}
                    placeholder={isRTL ? 'شقة 160م، ميفيدا، التجمع الخامس (القيمة 12 مليون)' : 'e.g. 160m Apartment, Mivida, New Cairo (Est 12M)'}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'المواصفات المطلوبة في العقار البديل' : 'Desired Target Property'}</label>
                  <input
                    type="text"
                    required
                    value={seeking}
                    onChange={(e) => setSeeking(e.target.value)}
                    placeholder={isRTL ? 'فيلا أو تاون هاوس في الشيخ زايد أو أكتوبر (مستعد لدفع الفرق)' : 'e.g. Townhouse in Sheikh Zayed (Ready to pay delta)'}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'رقم الهاتف' : 'Phone'}</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+2010..."
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'رقم واتساب' : 'WhatsApp'}</label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+2010..."
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isRTL ? 'نشر طلب التبادل العقاري' : 'Publish Exchange Request'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </section>

    </div>
  );
}
