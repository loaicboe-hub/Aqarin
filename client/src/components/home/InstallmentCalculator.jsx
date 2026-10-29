import React, { useState } from 'react';
import { Calculator, MessageSquareShare, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SITE_CONFIG } from '../../config/siteConfig';

export default function InstallmentCalculator() {
  const { isRTL } = useLanguage();

  const [totalPrice, setTotalPrice] = useState(10000000); // 10M EGP default
  const [downPaymentPct, setDownPaymentPct] = useState(10); // 10% default
  const [years, setYears] = useState(7); // 7 years default

  const downPaymentAmount = Math.round(totalPrice * (downPaymentPct / 100));
  const remainingAmount = totalPrice - downPaymentAmount;
  const totalMonths = Math.max(1, years * 12);
  const monthlyInstallment = Math.round(remainingAmount / totalMonths);
  const quarterlyInstallment = monthlyInstallment * 3;

  const formatEGP = (num) => new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(num || 0);

  const whatsappMessage = isRTL
    ? `مرحباً عقار إن، أود الاستفسار عن وحدات مطابقة لحساباتي: سعر الوحدة ${formatEGP(totalPrice)} ج.م، مقدم ${downPaymentPct}% (${formatEGP(downPaymentAmount)} ج.م)، على ${years} سنوات بقسط شهري ${formatEGP(monthlyInstallment)} ج.م.`
    : `Hello AQAR IN, I want to inquire about properties matching my plan: Unit Price ${formatEGP(totalPrice)} EGP, Down payment ${downPaymentPct}% (${formatEGP(downPaymentAmount)} EGP), over ${years} years with monthly installment of ${formatEGP(monthlyInstallment)} EGP.`;

  return (
    <section className="py-14 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="bg-gradient-to-br from-[#0B1C3D] to-[#122B5C] rounded-3xl sm:rounded-[36px] p-6 sm:p-10 lg:p-12 text-white shadow-2xl overflow-hidden relative border border-white/10">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headline & Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'حاسبة الأقساط والتمويل الذكية' : 'Smart Installment Calculator'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {isRTL ? 'احسب قسط وحدتك القادمة في ثوانٍ' : 'Calculate Your Next Property Installment in Seconds'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {isRTL 
                    ? 'حدد سعر الوحدة والمقدم ونظام التقسيط المناسب لك لاكتشاف الوحدات المتاحة وحساب الأقساط بدقة.'
                    : 'Choose your desired price, down payment, and installment plan to discover matching units.'}
                </p>
              </div>

              {/* Slider 1: Total Price */}
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <span className="text-slate-300">{isRTL ? 'سعر الوحدة الإجمالي:' : 'Total Unit Price:'}</span>
                  <span className="font-mono text-base sm:text-lg text-amber-400 font-extrabold">
                    {formatEGP(totalPrice)} {isRTL ? 'ج.م' : 'EGP'}
                  </span>
                </div>
                <input
                  type="range"
                  min={3000000}
                  max={40000000}
                  step={500000}
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-white/20 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>3 {isRTL ? 'مليون' : 'M'}</span>
                  <span>20 {isRTL ? 'مليون' : 'M'}</span>
                  <span>40 {isRTL ? 'مليون' : 'M'}</span>
                </div>
              </div>

              {/* Control 2: Down Payment Percentage */}
              <div className="space-y-2">
                <div className="text-xs sm:text-sm font-bold text-slate-300 flex items-center justify-between">
                  <span>{isRTL ? 'نسبة المقدم (Down Payment):' : 'Down Payment:'}</span>
                  <span className="font-mono text-emerald-400">{downPaymentPct}% = {formatEGP(downPaymentAmount)} {isRTL ? 'ج.م' : 'EGP'}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDownPaymentPct(pct)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        downPaymentPct === pct
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-102'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 3: Installment Duration */}
              <div className="space-y-2">
                <div className="text-xs sm:text-sm font-bold text-slate-300 flex items-center justify-between">
                  <span>{isRTL ? 'مدة التقسيط (Years):' : 'Installment Period:'}</span>
                  <span className="font-mono text-sky-400">{years} {isRTL ? 'سنوات' : 'Years'} ({totalMonths} {isRTL ? 'شهر' : 'Months'})</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 7, 8].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setYears(yr)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        years === yr
                          ? 'bg-emerald-400 text-slate-950 font-black shadow-md scale-102'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {yr} {isRTL ? 'سنين' : 'Yrs'}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Calculated Results Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isRTL ? 'خطة السداد المقترحة' : 'Estimated Payment Plan'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {isRTL ? 'بدون فوائد بنكية' : '0% Interest Plan'}
                  </span>
                </div>

                {/* Primary Metric: Monthly Installment */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 block mb-1">
                    {isRTL ? 'القسط الشهري المتوقع:' : 'Estimated Monthly Installment:'}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#0B1C3D] tracking-tight font-mono">
                      {formatEGP(monthlyInstallment)}
                    </span>
                    <span className="text-xs font-bold text-sky-600">
                      {isRTL ? 'ج.م / شهرياً' : 'EGP / mo'}
                    </span>
                  </div>
                </div>

                {/* Secondary Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block text-[11px] font-semibold">{isRTL ? 'المقدم المطلوب:' : 'Down Payment:'}</span>
                    <span className="font-mono font-bold text-[#0B1C3D] text-sm">
                      {formatEGP(downPaymentAmount)} {isRTL ? 'ج.م' : 'EGP'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block text-[11px] font-semibold">{isRTL ? 'القسط الربع سنوي:' : 'Quarterly (3 Mo):'}</span>
                    <span className="font-mono font-bold text-[#0B1C3D] text-sm">
                      {formatEGP(quarterlyInstallment)} {isRTL ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-2">
                <a
                  href={SITE_CONFIG.getWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102"
                >
                  <MessageSquareShare className="w-4 h-4" />
                  <span>{isRTL ? 'طلب جدول السداد الرسمي عبر واتساب' : 'Request Official Plan on WhatsApp'}</span>
                </a>

                <p className="text-[10px] text-center text-slate-400 font-medium">
                  {isRTL 
                    ? 'الأسعار تقريبية وتعتمد على السياسات التمويلية لكل مطور عقاري.'
                    : 'Estimates based on certified master developer standard payment schedules.'}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
