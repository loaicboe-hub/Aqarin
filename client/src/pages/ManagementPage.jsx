import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  Key, 
  Clock, 
  FileCheck, 
  Banknote, 
  Building2, 
  Wrench, 
  Users, 
  MessageSquareShare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ManagementPage() {
  const { isRTL } = useLanguage();

  const [form, setForm] = useState({
    ownerName: '',
    phone: '',
    city: 'Cairo',
    district: 'New Cairo',
    compound: '',
    propertyType: 'apartment',
    unitsCount: '1',
    managementType: 'long_term'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const PLANS = [
    {
      id: 'residential',
      nameAr: 'باقة التأجير السكني طويل المدى',
      nameEn: 'Residential Long-Term Lease',
      fee: '8%',
      period: isRTL ? 'من قيمة الإيجار الشهري' : 'of monthly collected rent',
      popular: true,
      featuresAr: [
        'فحص واختيار المستأجرين الجادين والتحقق الجنائي والمالي',
        'صياغة وتوثيق عقود الإيجار الرسمية وفق القانون المصري',
        'تحصيل الإيجارات شهرياً وتحويلها مباشرة لحسابك البنكي',
        'متابعة وسداد فواتير الكهرباء والمياه ووديعة الصيانة',
        'فحص دوري لحالة الوحدة مع تقرير مصور كل 6 أشهر'
      ],
      featuresEn: [
        'Rigorous tenant vetting with background & financial checks',
        'Standard Egyptian law lease drafting & official notarization',
        'Automated monthly rent collection with direct bank deposit',
        'Utility bill handling & compound maintenance fee oversight',
        'Semi-annual property inspection report with high-res photos'
      ]
    },
    {
      id: 'short_term',
      nameAr: 'باقة الإدارة الفندقية والساحل (Airbnb)',
      nameEn: 'Vacation Homes & Short-Term Stay',
      fee: '15%',
      period: isRTL ? 'من إجمالي إيراد الحجوزات' : 'of gross booking revenue',
      featuresAr: [
        'تسويق الوحدة على Airbnb و Booking و VRBO بأعلى تسعير ديناميكي',
        'خدمات الاستقبال الفندقي وتسليم واستلام المفاتيح 24/7',
        'نظافة فندقية وتغيير المفارش والتعقيم بعد كل نزيل',
        'صيانة طوارئ فورية 24 ساعة لجميع مرافق الوحدة',
        'لوحة تحكم للمالك لمتابعة نسب الإشغال والأرباح لحظياً'
      ],
      featuresEn: [
        'Dynamic multi-channel listing on Airbnb, Booking.com & VRBO',
        '24/7 guest check-in, key exchange, and concierge assistance',
        'Hotel-grade cleaning, linen sanitization & restock after each checkout',
        '24/7 rapid emergency maintenance response team',
        'Live owner portal showing occupancy rates & net yield dashboard'
      ]
    },
    {
      id: 'commercial',
      nameAr: 'باقة إدارة المقار الإدارية والتجارية',
      nameEn: 'Commercial & Retail Asset Management',
      fee: '7%',
      period: isRTL ? 'عقود مؤسسية سنوية' : 'corporate annual contracts',
      featuresAr: [
        'استقطاب شركات محلية ودولية وبنوك ومقرات سفارات',
        'إدارة مرافق متكاملة (أمن، كاميرات، تكييف مركزي، ومصاعد)',
        'تحصيل خطابات الضمان والشيكات البنكية الآجلة',
        'إدارة التراخيص البلدية والاشتراطات الهندسية للمبنى',
        'إشراف كامل على عقود الصيانة الدورية وأنظمة الإطفاء'
      ],
      featuresEn: [
        'Sourcing multinational corporate tenants & institutional banks',
        'Full facility management (security, CCTV, central HVAC, elevators)',
        'Managing bank letters of guarantee & post-dated lease checks',
        'Municipal licensing & commercial building compliance support',
        'Annual preventive maintenance supervision & fire safety systems'
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0B1C3D] via-[#102A56] to-[#0A1833] text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>{isRTL ? 'خدمات إدارة الأملاك والأصول العقارية' : 'Smart Property Asset Management'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isRTL ? (
              <>استثمر في عقارك ببال مرتاح،<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300">واترك إدارة المستأجرين والصيانة والتحصيل بالكامل لـ عقار إن</span></>
            ) : (
              <>Hands-Free Property Management<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300">We Handle Tenants, Rent Collection & Maintenance</span></>
            )}
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isRTL 
              ? 'سواء كنت تعيش داخل مصر أو مغترباً بالخارج، نضمن لك أعلى عائد إيجاري شهري وحماية كاملة لقيمة عقارك مع تحويل الإيجار لحسابك بانتظام.'
              : 'Whether you live in Egypt or abroad, AQAR IN maximizes your rental yield, vets top-tier tenants, and deposits your rent on time, every month.'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 text-left">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <Banknote className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
              <h4 className="text-xs font-bold">{isRTL ? 'تحصيل إيجار منتظم' : 'Guaranteed Collection'}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <Users className="w-6 h-6 text-sky-400 mx-auto mb-1.5" />
              <h4 className="text-xs font-bold">{isRTL ? 'فحص دقيق للمستأجر' : 'Vetted Tenants'}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <Wrench className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
              <h4 className="text-xs font-bold">{isRTL ? 'صيانة طوارئ 24/7' : '24/7 Repairs'}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <FileCheck className="w-6 h-6 text-purple-400 mx-auto mb-1.5" />
              <h4 className="text-xs font-bold">{isRTL ? 'عقود موثقة ومحمية' : 'Legal Compliance'}</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B1C3D]">
            {isRTL ? 'باقات إدارة الأملاك المتخصصة' : 'Turnkey Asset Management Plans'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isRTL ? 'اختر الباقة المناسبة لطبيعة عقارك واستمتع بدخل شهري ثابت دون أي صداع' : 'Tailored packages for residential apartments, vacation homes, and commercial offices'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition-all ${
                plan.popular 
                  ? 'border-indigo-500 bg-white shadow-xl ring-2 ring-indigo-500/20' 
                  : 'border-slate-200 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                {plan.popular && (
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-600 text-white mb-4">
                    {isRTL ? 'الأكثر طلباً' : 'Most Popular'}
                  </span>
                )}
                <h3 className="text-lg font-black text-[#0B1C3D]">
                  {isRTL ? plan.nameAr : plan.nameEn}
                </h3>
                
                <div className="my-4">
                  <span className="text-4xl font-black text-[#0B1C3D]">{plan.fee}</span>
                  <span className="text-xs text-slate-500 font-semibold block mt-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  {(isRTL ? plan.featuresAr : plan.featuresEn).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <a
                  href={`https://wa.me/201012345678?text=Hello,%20I%20am%20interested%20in%20Property%20Management%20for%20my%20unit%20with%20${plan.id}%20plan.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-full text-xs font-bold text-center block transition-all ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#0B1C3D]'
                  }`}
                >
                  {isRTL ? 'اختر هذه الباقة' : 'Select Plan'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Onboarding Request Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-[#0B1C3D]">
              {isRTL ? 'اطلب استشارة وإدارة عقارك الآن' : 'Hand Over Your Property to AQAR IN'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isRTL ? 'سجل بيانات وحدتك وسيتواصل معك مستشار إدارة الأملاك لتنسيق المعاينة وتوقيع عقد الإدارة' : 'Submit your property details and our asset manager will contact you within 24h'}
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-100 border border-emerald-300 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-base">{isRTL ? 'تم استلام طلب إدارة العقار بنجاح!' : 'Management Request Submitted!'}</h4>
              <p className="text-xs text-emerald-800">{isRTL ? 'سيتواصل معك مدير محفظة الأملاك خلال 24 ساعة لجدولة المعاينة.' : 'Our property manager will reach out within 24 hours to schedule unit inspection.'}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'الاسم بالكامل' : 'Full Name'}</label>
                  <input
                    type="text"
                    required
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+2010..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'المنطقة / الحي' : 'Location / District'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isRTL ? 'التجمع، زايد، العاصمة، الساحل' : 'e.g. New Cairo, Zayed, North Coast'}
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'اسم الكمبوند أو البرج' : 'Compound or Tower Name'}</label>
                  <input
                    type="text"
                    placeholder={isRTL ? 'مثال: ميفيدا، زد، بالم هيلز' : 'e.g. Mivida, Zed, Palm Hills'}
                    value={form.compound}
                    onChange={(e) => setForm({ ...form, compound: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>{isRTL ? 'جاري الإرسال...' : 'Submitting...'}</span>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>{isRTL ? 'طلب تسليم العقار للإدارة' : 'Submit Property for Management'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
