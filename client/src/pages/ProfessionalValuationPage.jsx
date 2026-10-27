import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Clock 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProfessionalValuationPage() {
  const { isRTL } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: 'Apartment',
    city: 'Cairo',
    district: 'New Cairo',
    address: '',
    preferredDate: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isRTL ? 'معاينة هندسية وتقييم معتمد' : 'Certified On-Site Property Due Diligence'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1C3D]">
            {isRTL ? 'طلب معاينة وتقييم عقاري معتمد في مصر' : 'Book a Certified Physical Inspection & Appraisal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            {isRTL 
              ? 'يقوم مهندس استشاري وخبير تقييم معتمد بزيارة موقع العقار وفحص الهيكل الإنشائي والتشطيبات والتحقق من الأوراق القانونية وإصدار تقرير رسمي معتمد للبنوك والشركات.'
              : 'A certified structural engineer and accredited real estate appraiser visits your property to conduct structural, legal, and valuation audits.'}
          </p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Features Checklist */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-[#0B1C3D] uppercase tracking-wider">
                {isRTL ? 'ماذا يشمل التقرير المعتمد؟' : 'What is Included?'}
              </h3>
              
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'فحص السلامة الإنشائية والخرسانية والعيوب المخفية' : 'Structural integrity & hidden defects audit'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'مراجعة الموقف القانوني وتراخيص البناء' : 'Full legal due diligence & municipal licenses check'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'تقييم تسعيري معتمد ومقبول لدى البنوك المصرية' : 'Bank-approved accredited appraisal certificate'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'تسليم التقرير الشامل خلال 48 ساعة' : 'Comprehensive report delivered in 48 hours'}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-center gap-3">
              <Clock className="w-5 h-5 text-sky-600 shrink-0" />
              <span>{isRTL ? 'تغطية فورية لجميع مناطق القاهرة الكبرى والساحل' : 'Immediate coverage across Greater Cairo & North Coast'}</span>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-3 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#0B1C3D]">
                  {isRTL ? 'تم استلام طلب المعاينة بنجاح!' : 'Request Received Successfully!'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {isRTL 
                    ? 'سيتواصل معك مهندس التقييم المعتمد هاتفياً لتأكيد موعد الزيارة.'
                    : 'Our certified appraiser will contact you by phone shortly to confirm the visit.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-[#0B1C3D] mb-2">
                  {isRTL ? 'بيانات حجز المعاينة' : 'Inspection Booking Details'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'الاسم بالكامل' : 'Full Name'}</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Mohamed Ahmed"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'رقم الهاتف' : 'Phone'}</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+20 100 000 0000"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'المدينة' : 'City'}</label>
                    <select
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                    >
                      <option value="Cairo">Cairo (القاهرة)</option>
                      <option value="Giza">Giza (الجيزة)</option>
                      <option value="North Coast">North Coast (الساحل الشمالي)</option>
                      <option value="Red Sea">Red Sea (الجونة)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'الموعد المفضل' : 'Preferred Date'}</label>
                    <input
                      type="date"
                      required
                      value={form.preferredDate}
                      onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'عنوان الوحدة والكمبوند' : 'Property Address & Compound'}</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Mivida, New Cairo, Building 12"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'ملاحظات إضافية' : 'Notes'}</label>
                  <textarea
                    rows="3"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  {loading ? (isRTL ? 'جاري الإرسال...' : 'Submitting...') : (isRTL ? 'تأكيد حجز المعاينة المعتمدة' : 'Confirm Inspection Booking')}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
