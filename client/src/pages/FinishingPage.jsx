import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Paintbrush, 
  Sparkles, 
  Calculator, 
  CheckCircle2, 
  ShieldCheck, 
  Ruler, 
  HardHat, 
  Layers, 
  PhoneCall, 
  MessageSquareShare,
  ArrowRight,
  Palette,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { submitFinishingQuote } from '../services/api';
import { SITE_CONFIG } from '../config/siteConfig';

export default function FinishingPage() {
  const { isRTL } = useLanguage();
  const { user } = useAuth();

  // Calculator State
  const [area, setArea] = useState(150);
  const [selectedTier, setSelectedTier] = useState('super_lux');
  const [unitType, setUnitType] = useState('apartment');
  const [city, setCity] = useState('Cairo');
  
  // Modal / Quote Submission State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    phone: user?.phone || '',
    notes: ''
  });

  const TIERS = [
    {
      id: 'standard_lux',
      nameAr: 'باقة لوكس عصرية (Standard Lux)',
      nameEn: 'Standard Lux Package',
      pricePerSqm: 6500,
      badge: isRTL ? 'اقتصادي وعملي' : 'Best Value',
      featuresAr: ['تأسيس سباكة BR ألماني مع ضمان 10 سنوات', 'تأسيس كهرباء السويدي الأصلي مع لوحة شنايدر', 'سيراميك فرز أول كليوباترا أو الجوهرة', 'دهانات جوتن أو سايبس أصلية 3 أوجه', 'أبواب خشب موسكي وأطقم حمامات ديورافيت'],
      featuresEn: ['German BR certified plumbing with 10y warranty', 'El Sewedy genuine wiring & Schneider breakers', 'First-grade Cleopatra or Gemma porcelain tiles', 'Jotun 3-coat washable anti-bacterial paint', 'Duravit sanitation sets & solid pine doors']
    },
    {
      id: 'super_lux',
      nameAr: 'باقة سوبر لوكس (Super Lux)',
      nameEn: 'Super Lux Package',
      pricePerSqm: 9800,
      badge: isRTL ? 'الأكثر طلباً' : 'Most Popular',
      popular: true,
      featuresAr: ['بورسلين هندي أو إسباني مستورد مقاسات كبيرة', 'جبسوم بورد كناوف كامل مع بيوت نور LED', 'أطقم حمامات وخلاطات جروهي Grohe الأصلية', 'دهانات جوتن فينوماستيك الفاخرة', 'أبواب أرو ماسيف مصفحة وشبابيك ألوميتال جامبو'],
      featuresEn: ['Imported Spanish / Indian large format porcelain', 'Full Knauf suspended ceilings with indirect LED lighting', 'Genuine Grohe concealed mixers and hanging toilet sets', 'Jotun Fenomastic luxury finish', 'Massive oak veneer doors & Jumbo aluminum soundproof windows']
    },
    {
      id: 'ultra_lux',
      nameAr: 'باقة ألترا لوكس سمارت (Ultra Lux Smart)',
      nameEn: 'Ultra Lux Smart Package',
      pricePerSqm: 14500,
      badge: isRTL ? 'منازل ذكية وفخامة' : 'Smart Luxury',
      featuresAr: ['رخام مستورد كرارا أو تريستا للأرضيات والصالون', 'نظام سمارت هوم متكامل للتحكم بالإضاءة والتكييف', 'أرضيات HDF بلجيكي أو ألماني لغرف النوم', 'ديكورات وتجاليد خشبية وبديل رخام وشاشات جدارية', 'تكييف كونسيلد مخفي وتصميم 3D مجاني'],
      featuresEn: ['Imported Carrara or Triesta Italian marble in living areas', 'Full Smart Home automation (Tuya / KNX) for lights & AC', 'German / Belgian AC5 high-traffic HDF in bedrooms', '3D Wood paneling, fluted panels & backlit stone accents', 'Concealed central AC preparation + free 3D interior renders']
    }
  ];

  const currentTier = TIERS.find(t => t.id === selectedTier) || TIERS[1];
  const estimatedTotal = area * currentTier.pricePerSqm;

  const handleOpenQuoteModal = () => {
    setQuoteError('');
    setSubmitted(false);
    setIsModalOpen(true);
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setQuoteError(isRTL ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Please provide name and phone number');
      return;
    }

    setSubmitting(true);
    setQuoteError('');
    try {
      await submitFinishingQuote({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        areaSqm: area,
        tier: currentTier.id,
        unitType,
        city,
        notes: formData.notes?.trim() || '',
        userId: user?.id || null
      });
      setSubmitted(true);
    } catch (err) {
      setQuoteError(err.message || (isRTL ? 'فشل إرسال طلب المقايسة' : 'Failed to submit quote'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0B1C3D] via-[#102A56] to-[#0A1833] text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
            <Paintbrush className="w-4 h-4 text-teal-400" />
            <span>{isRTL ? 'خدمات التشطيبات والديكور الهندسي المعتمد' : 'Turnkey Finishing & Interior Architecture'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isRTL ? (
              <>شطب عقارك بأعلى جودة،<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300">وبجدول زمني مضمون ومقايسة محددة بالسنتيمتر</span></>
            ) : (
              <>Turnkey Luxury Finishing<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-300 to-amber-300">With Guaranteed Timeline & Transparent Pricing</span></>
            )}
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            {isRTL 
              ? 'باقات تشطيب متكاملة من المحارة حتى الفرش، تحت إشراف مهندسين نقابيين معتمدين وضمان كتابي يصل إلى 10 سنوات على أعمال التأسيس.'
              : 'Complete interior design and architectural finishing from core & shell to turnkey luxury, supervised by certified engineers with up to 10 years structural warranty.'}
          </p>
        </div>
      </section>

      {/* Interactive Finishing Calculator */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B1C3D]">
                {isRTL ? 'حاسبة تكلفة التشطيب الفورية' : 'Instant Finishing Cost Calculator'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRTL ? 'حدد مساحة وحدتك والباقة المناسبة لمعرفة التكلفة التقديرية الفورية' : 'Select unit area and package tier to calculate estimated cost'}
              </p>
            </div>
          </div>

          {/* Calculator Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {isRTL ? 'المساحة (م²):' : 'Area (SQM):'} <span className="text-teal-600 font-black">{area} م²</span>
              </label>
              <input
                type="range"
                min="50"
                max="600"
                step="5"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>50 م²</span>
                <span>300 م²</span>
                <span>600 م²</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {isRTL ? 'نوع الوحدة' : 'Unit Type'}
              </label>
              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
              >
                <option value="apartment">{isRTL ? 'شقة سكنية' : 'Apartment'}</option>
                <option value="duplex">{isRTL ? 'دوبلكس / بنتهاوس' : 'Duplex / Penthouse'}</option>
                <option value="townhouse">{isRTL ? 'تاون هاوس / توين فيلا' : 'Townhouse / Twinhouse'}</option>
                <option value="standalone">{isRTL ? 'فيلا مستقلة' : 'Standalone Villa'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {isRTL ? 'المدينة' : 'City'}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
              >
                <option value="Cairo">{isRTL ? 'القاهرة الجديدة / التجمع' : 'New Cairo'}</option>
                <option value="Giza">{isRTL ? 'الشيخ زايد / 6 أكتوبر' : 'Sheikh Zayed / 6th October'}</option>
                <option value="New Capital">{isRTL ? 'العاصمة الإدارية' : 'New Administrative Capital'}</option>
                <option value="North Coast">{isRTL ? 'الساحل الشمالي' : 'North Coast'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {isRTL ? 'اختيار باقة التشطيب' : 'Finishing Package'}
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
              >
                {TIERS.map(t => (
                  <option key={t.id} value={t.id}>
                    {isRTL ? t.nameAr : t.nameEn} ({t.pricePerSqm.toLocaleString()} ج.م/م²)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calculator Output Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wide">
                {isRTL ? 'التكلفة الإجمالية التقديرية للتشطيب' : 'Estimated Total Finishing Cost'}
              </span>
              <div className="text-2xl sm:text-4xl font-black text-[#0B1C3D] mt-1">
                {estimatedTotal.toLocaleString()} <span className="text-base font-bold text-slate-500">{isRTL ? 'جنيه مصري' : 'EGP'}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isRTL ? `محسوبة على سعر ${currentTier.pricePerSqm.toLocaleString()} ج.م للمتر المربع لمساحة ${area} م²` : `Based on ${currentTier.pricePerSqm.toLocaleString()} EGP/sqm for ${area} sqm`}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleOpenQuoteModal}
                className="px-6 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>{isRTL ? 'طلب مقايسة ومعاينة رسمية' : 'Request Official Quote'}</span>
              </button>
              <a
                href={SITE_CONFIG.getWhatsAppUrl(`Hello, I want a finishing quote for ${area} sqm (${unitType}) with ${currentTier.nameEn} tier.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-full bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 transition-colors shadow-xs"
                title="WhatsApp Direct"
              >
                <MessageSquareShare className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Finishing Packages Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B1C3D]">
            {isRTL ? 'باقات التشطيب الهندسية المعتمدة' : 'Standardized Finishing Packages'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isRTL ? 'تشطيب دقيق بمواصفات وأسماء خامات واضحة وبنود محددة في العقد' : 'Engineered finishing with verified brand specifications and binding warranties'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TIERS.map((tier) => (
            <div 
              key={tier.id}
              className={`rounded-3xl p-6 sm:p-8 border transition-all ${
                tier.popular 
                  ? 'border-teal-500 bg-white shadow-xl ring-2 ring-teal-500/20' 
                  : 'border-slate-200 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                  tier.popular ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tier.badge}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{isRTL ? 'تسليم على المفتاح' : 'Turnkey'}</span>
              </div>

              <h3 className="text-lg font-black text-[#0B1C3D]">
                {isRTL ? tier.nameAr : tier.nameEn}
              </h3>

              <div className="my-4">
                <span className="text-3xl font-black text-[#0B1C3D]">
                  {tier.pricePerSqm.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-bold ml-1">{isRTL ? 'ج.م / م²' : 'EGP / m²'}</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                {(isRTL ? tier.featuresAr : tier.featuresEn).map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTier(tier.id);
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className={`w-full py-3 rounded-full text-xs font-bold transition-all ${
                    tier.popular
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#0B1C3D]'
                  }`}
                >
                  {isRTL ? 'احسب تكلفة وحدتك بهذه الباقة' : 'Calculate Unit With This Tier'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Paintbrush className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0B1C3D]">
                    {isRTL ? 'طلب مقايسة ومعاينة تشطيب' : 'Request Finishing Inspection'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {area} م² • {isRTL ? currentTier.nameAr : currentTier.nameEn}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {quoteError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{quoteError}</span>
              </div>
            )}

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">
                  {isRTL ? 'تم تسجيل طلب المقايسة بنجاح!' : 'Finishing Quote Received!'}
                </h4>
                <p className="text-xs text-emerald-700">
                  {isRTL 
                    ? 'تم حفظ طلبك في قاعدة بيانات عقار إن. سيتواصل معك مهندس الديكور المختص لتحديد موعد المعاينة على أرض الواقع.'
                    : 'Our certified interior architect will contact you to coordinate on-site measurement and 3D design schedule.'}
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <a
                    href={SITE_CONFIG.getWhatsAppUrl(`Hello, I just submitted finishing request for ${area} sqm in ${city}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                  >
                    <MessageSquareShare className="w-4 h-4" />
                    <span>{isRTL ? 'تواصل عبر واتساب فوراً' : 'Connect on WhatsApp'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold"
                  >
                    {isRTL ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'الاسم بالكامل' : 'Full Name'}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isRTL ? 'أحمد محمد' : 'e.g. John Doe'}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'رقم الهاتف (واتساب)' : 'Phone Number'}</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+2010..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-teal-600 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'ملاحظات إضافية أو موعد الاستلام المستهدف' : 'Additional Notes / Handover Target'}</label>
                  <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={isRTL ? 'الوحدة على المحارة أو نصف تشطيب، الاستلام المطلوب خلال 4 أشهر...' : 'e.g. Core & shell unit, handover within 4 months...'}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:border-teal-600 outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isRTL ? 'تأكيد إرسال الطلب' : 'Submit Quote Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
