import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  FileText, 
  PhoneCall, 
  MessageSquareShare,
  Banknote,
  Send
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { submitFastSell } from '../services/api';

export default function FastSellPage() {
  const { isRTL } = useLanguage();

  const [form, setForm] = useState({
    city: 'Cairo',
    district: 'New Cairo',
    compound: '',
    propertyType: 'apartment',
    areaSqm: '',
    finishing: 'super_lux',
    expectedPrice: '',
    ownerName: '',
    phone: '',
    whatsapp: '',
    urgentReason: 'cash_liquidity'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submitFastSell({
        city: form.city,
        district: form.district,
        compound: form.compound,
        propertyType: form.propertyType,
        areaSqm: Number(form.areaSqm),
        finishingType: form.finishing,
        expectedPrice: Number(form.expectedPrice),
        ownerName: form.ownerName,
        phone: form.phone,
        whatsapp: form.whatsapp,
        urgentReason: form.urgentReason
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B1C3D] via-[#102A56] to-[#08152D] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold tracking-wide">
            <Rocket className="w-4 h-4 text-rose-400" />
            <span>{isRTL ? 'خدمة البيع السريع — عرض كاش خلال 48 ساعة' : 'Fast Sell — Instant Cash Offer in 48h'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            {isRTL ? (
              <>بيع عقارك فوراً وبأمان،<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-amber-300 to-sky-300">واحصل على عرض كاش بدون انتظار شهور</span></>
            ) : (
              <>Sell Your Property Fast with<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-amber-300 to-sky-300">Instant Cash Offers in 48 Hours</span></>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isRTL 
              ? 'تخطي المماطلات وعشرات المعاينات غير الجادة. شبكتنا تضم أكثر من 40 صندوق استثمار عقاري ومشتري كاش معتمد مستعدين لشراء وحدتك فوراً.'
              : 'Skip endless viewings and delayed deals. Connect directly with institutional real estate funds and verified cash investors ready to close within days.'}
          </p>

          {/* Steps Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-black flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-white">{isRTL ? 'سجل مواصفات عقارك' : 'Submit Property Specs'}</h3>
              <p className="text-xs text-slate-300">{isRTL ? 'بيانات الوحدة والمساحة والكمبوند في دقيقة واحدة' : 'Details, area & compound in 60 seconds'}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-sky-500 text-white font-black flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-white">{isRTL ? 'دراسة وعرض كاش 48h' : '48h Cash Offer'}</h3>
              <p className="text-xs text-slate-300">{isRTL ? 'دراسة السوق ومراجعة الوحدة لتقديم عرض شراء كاش ملزم' : 'Market analysis + binding cash offer'}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-white">{isRTL ? 'توقيع واستلام المبلغ' : 'Legal Closing & Payout'}</h3>
              <p className="text-xs text-slate-300">{isRTL ? 'إنهاء العقود والتوكيل في الشهر العقاري واستلام شيك معتمد' : 'Escrow contract signing & bank payout'}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Submission Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#0B1C3D]">
              {isRTL ? 'تم استلام طلب البيع السريع بنجاح!' : 'Fast Sell Request Received!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {isRTL 
                ? 'فريق الاستثمار في عقار إن يراجع بيانات وحدتك حالياً. سنتواصل معك هاتفياً وعلى واتساب بعرض الشراء الكاش خلال 24 إلى 48 ساعة.'
                : 'AQAR IN investment team is analyzing your property specs. You will receive your binding cash offer via WhatsApp and phone within 24-48 hours.'}
            </p>
            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                to="/"
                className="px-6 py-3 rounded-full bg-[#0B1C3D] text-white font-bold text-xs shadow-md"
              >
                {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-[#0B1C3D]">
                {isRTL ? 'استمارة طلب عرض شراء كاش فوري' : 'Request Instant Cash Purchase Offer'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isRTL ? 'املأ التفاصيل التالية بدقة لحساب أعلى عرض مالي ممكن لوحدتك' : 'Fill in unit details accurately for maximum cash offer'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'المدينة' : 'City'}</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                >
                  <option value="Cairo">{isRTL ? 'القاهرة' : 'Cairo'}</option>
                  <option value="Giza">{isRTL ? 'الجيزة' : 'Giza'}</option>
                  <option value="North Coast">{isRTL ? 'الساحل الشمالي' : 'North Coast'}</option>
                  <option value="Red Sea">{isRTL ? 'البحر الأحمر' : 'Red Sea'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'الحي / المنطقة' : 'District'}</label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'مثال: التجمع الخامس، زايد' : 'e.g. 5th Settlement, Zayed'}
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'الكمبوند / المشروع' : 'Compound Name'}</label>
                <input
                  type="text"
                  placeholder={isRTL ? 'مثال: ميفيدا، مدينتي، سوديك' : 'e.g. Mivida, Madinaty, Sodic'}
                  value={form.compound}
                  onChange={(e) => setForm({ ...form, compound: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'المساحة (م²)' : 'Area (SQM)'}</label>
                <input
                  type="number"
                  required
                  placeholder="180"
                  value={form.areaSqm}
                  onChange={(e) => setForm({ ...form, areaSqm: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'مستوى التشطيب' : 'Finishing'}</label>
                <select
                  value={form.finishing}
                  onChange={(e) => setForm({ ...form, finishing: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                >
                  <option value="core_shell">{isRTL ? 'نصف تشطيب / محارة وحلوق' : 'Core & Shell'}</option>
                  <option value="finished">{isRTL ? 'تشطيب كامل / لوكس' : 'Finished'}</option>
                  <option value="super_lux">{isRTL ? 'سوبر لوكس' : 'Super Lux'}</option>
                  <option value="ultra_lux">{isRTL ? 'ألترا لوكس فاخر' : 'Ultra Lux'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'السعر الكاش المتوقع (ج.م)' : 'Expected Cash Price (EGP)'}</label>
                <input
                  type="number"
                  placeholder="5000000"
                  value={form.expectedPrice}
                  onChange={(e) => setForm({ ...form, expectedPrice: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                />
              </div>
            </div>

            {/* Owner Info */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold text-[#0B1C3D] uppercase tracking-wider">
                {isRTL ? 'بيانات التواصل واستلام العرض' : 'Contact Information'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'الاسم بالكامل' : 'Full Name'}</label>
                  <input
                    type="text"
                    required
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+2010..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'رقم واتساب' : 'WhatsApp Number'}</label>
                  <input
                    type="tel"
                    placeholder="+2010..."
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{isRTL ? 'جاري إرسال الطلب...' : 'Submitting Request...'}</span>
              ) : (
                <>
                  <Banknote className="w-4 h-4" />
                  <span>{isRTL ? 'طلب عرض الشراء الكاش خلال 48 ساعة' : 'Request 48h Cash Purchase Offer'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </section>

    </div>
  );
}
