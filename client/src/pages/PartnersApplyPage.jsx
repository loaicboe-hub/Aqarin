import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Handshake, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Mail, 
  Phone 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PartnersApplyPage() {
  const { isRTL } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    partnerType: 'broker',
    city: 'Cairo',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>{isRTL ? 'برنامج الشركاء والمطورين' : 'Partnership & Developer Program'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B1C3D]">
            {isRTL ? 'انضم إلى شبكة شركاء عقار إن (AQAR IN)' : 'Partner with AQAR IN'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            {isRTL 
              ? 'فرص شراكة للمطورين العقاريين، شركات البروكريدج، مكاتب التقييم العقاري المعتمدة، والمؤسسات المصرفية.'
              : 'Grow your real estate transactions with AI intelligence, certified leads, and integrated mortgage solutions.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Partner Benefits */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-[#0B1C3D] uppercase tracking-wider">
                {isRTL ? 'مزايا الشراكة' : 'Partnership Benefits'}
              </h3>
              
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'عملاء جادين موثقين يبحثون عن شراء وتمويل عقاري' : 'High-intent verified buyer & investor leads'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'ربط مباشر عبر API مع نظام التقييم الذكي' : 'Direct API integration with our valuation engine'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'لوحة تحكم خاصة ومخصصة لإدارة المشاريع والمبيعات' : 'Dedicated B2B developer & brokerage portal'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Partner Form */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-3 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#0B1C3D]">{isRTL ? 'تم استلام طلب الشراكة بنجاح!' : 'Partnership Application Received!'}</h3>
                <p className="text-xs text-slate-500">{isRTL ? 'سيتواصل معك فريق تطوير الأعمال لمناقشة أوجه التعاون.' : 'Our B2B partnership team will contact you shortly.'}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'اسم المسؤول' : 'Contact Person'}</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'اسم الشركة / المؤسسة' : 'Company Name'}</label>
                    <input
                      type="text"
                      required
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'البريد الإلكتروني للعمل' : 'Corporate Email'}</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'نوع النشاط' : 'Partner Type'}</label>
                  <select
                    value={form.partnerType}
                    onChange={(e) => setForm({ ...form, partnerType: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  >
                    <option value="developer">{isRTL ? 'مطور عقاري (Real Estate Developer)' : 'Real Estate Developer'}</option>
                    <option value="broker">{isRTL ? 'شركة تسويق وبروكر (Brokerage Firm)' : 'Brokerage Agency'}</option>
                    <option value="valuer">{isRTL ? 'مكتب تقييم عقاري معتمد (Certified Appraiser)' : 'Certified Appraisal Firm'}</option>
                    <option value="bank">{isRTL ? 'مؤسسة مالية / بنك (Financial / Bank)' : 'Financial Institution / Bank'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'رسالة أو مقترح الشراكة' : 'Message / Proposal'}</label>
                  <textarea
                    rows="3"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={isRTL ? 'أخبرنا عن عدد الوحدات والمشاريع التي تديرها...' : 'Tell us about your portfolio and goals...'}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  {loading ? (isRTL ? 'جاري الإرسال...' : 'Submitting...') : (isRTL ? 'تقديم طلب الشراكة' : 'Submit Partner Application')}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

