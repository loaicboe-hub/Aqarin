import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Landmark, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  DollarSign, 
  Building2, 
  ArrowLeft 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { submitMortgageApplication } from '../services/api';

export default function MortgageApplyPage() {
  const { isRTL } = useLanguage();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    monthlyIncome: '',
    propertyPrice: searchParams.get('price') || '6500000',
    downPayment: searchParams.get('down') || '1300000',
    preferredBank: searchParams.get('bank') || 'CIB',
    workStatus: 'employed'
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await submitMortgageApplication(form);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Landmark className="w-4 h-4 text-amber-600" />
            <span>{isRTL ? 'طلب الموافقة المسبقة للتمويل العقاري' : 'Mortgage Pre-Approval Application'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1C3D]">
            {isRTL ? 'قدم الآن على التمويل العقاري في البنوك المصرية' : 'Apply for Egyptian Bank Mortgage'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            {isRTL ? 'خطوة واحدة وسيقوم مستشار تمويل عقاري مالي بمساعدتك في اختيار أفضل بنك وإتمام الإجراءات.' : 'Get pre-approved with top Egyptian banks without endless branch visits.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#0B1C3D]">
                {isRTL ? 'تم استلام طلب التمويل بنجاح!' : 'Application Submitted Successfully!'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isRTL ? 'سيتواصل معك مستشار التمويل العقاري خلال 24 ساعة لبدء إجراءات الموافقة وتجهيز المستندات.' : 'A dedicated mortgage specialist will contact you within 24 hours to review your eligibility.'}
              </p>
              <div className="pt-4">
                <Link to="/" className="px-6 py-2.5 rounded-full bg-[#0B1C3D] text-white font-bold text-xs">
                  {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'الاسم بالكامل' : 'Full Name'}</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder={isRTL ? 'أحمد سمير' : 'Ahmed Samir'}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ahmed@example.com"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'صافي الدخل الشهري (جنيه)' : 'Net Monthly Income (EGP)'}</label>
                  <input
                    type="number"
                    required
                    value={form.monthlyIncome}
                    onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })}
                    placeholder="e.g. 45000"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'سعر العقار المستهدف' : 'Property Value (EGP)'}</label>
                  <input
                    type="number"
                    value={form.propertyPrice}
                    onChange={(e) => setForm({ ...form, propertyPrice: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'جهة العمل' : 'Employment Type'}</label>
                  <select
                    value={form.workStatus}
                    onChange={(e) => setForm({ ...form, workStatus: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                  >
                    <option value="employed">{isRTL ? 'موظف قطاع خاص / حكومي' : 'Employed (Private/Gov)'}</option>
                    <option value="business">{isRTL ? 'صاحب عمل / سجل تجاري' : 'Business Owner'}</option>
                    <option value="expat">{isRTL ? 'مصري مغترب بالخارج' : 'Egyptian Expat'}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white font-bold text-sm shadow-md transition-all"
              >
                {loading ? (isRTL ? 'جاري الإرسال...' : 'Submitting...') : (isRTL ? 'إرسال طلب التمويل العقاري ⚡' : 'Submit Mortgage Application ⚡')}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

