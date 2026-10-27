import React, { useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Printer, 
  Building2, 
  Landmark, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getSavedValuations } from '../services/api';

export default function ValuationResultPage() {
  const { isRTL } = useLanguage();
  const { id } = useParams();
  const location = useLocation();

  let valuation = location.state?.valuation;
  if (!valuation) {
    const saved = getSavedValuations();
    valuation = saved.find(v => v.valuationCode === id) || saved[0];
  }

  useEffect(() => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  }, []);

  const formatEGP = (num) => new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(num || 0);

  if (!valuation) {
    return (
      <div className="bg-white min-h-screen py-20 text-center">
        <h2 className="text-2xl font-bold text-[#0B1C3D] mb-4">
          {isRTL ? 'لم يتم العثور على التقييم' : 'Valuation Not Found'}
        </h2>
        <Link to="/valuation/instant" className="px-6 py-3 bg-[#0B1C3D] text-white rounded-full font-bold text-sm">
          {isRTL ? 'ابدأ تقييم جديد' : 'Start New Valuation'}
        </Link>
      </div>
    );
  }

  const { minEstimate, midEstimate, maxEstimate, pricePerSqm, areaSqm, confidenceScore, estRentalMonthly, historyChart, specs } = valuation;

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-[#0B1C3D]">
                  {isRTL ? 'شهادة التقييم العقاري الذكي' : 'Certified AI Valuation Report'}
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-[#0B1C3D]">
                  {valuation.valuationCode || id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isRTL ? 'صادرة ومطابقة لمؤشرات السوق المصري 2026' : 'Verified against Egyptian Real Estate Market 2026'}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0B1C3D] text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-sky-600" />
            <span>{isRTL ? 'طباعة التقرير PDF' : 'Print / Export PDF'}</span>
          </button>
        </div>

        {/* Main Estimation Card */}
        <div className="bg-[#0B1C3D] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-700">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>{isRTL ? `نسبة الثقة في التقييم: ${confidenceScore}%` : `Confidence Score: ${confidenceScore}%`}</span>
              </div>
              <p className="text-xs text-slate-300 uppercase tracking-wider font-semibold mb-1">
                {isRTL ? 'القيمة السوقية العادلة المقدرة' : 'Estimated Fair Market Value'}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                  {formatEGP(midEstimate)}
                </span>
                <span className="text-lg font-bold text-amber-400">{isRTL ? 'جنيه مصري' : 'EGP'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 text-left md:text-right">
              <p className="text-xs text-slate-400 font-medium">{isRTL ? 'متوسط سعر المتر' : 'Calculated Price / SQM'}</p>
              <p className="text-2xl font-black text-sky-400">{formatEGP(pricePerSqm)} <span className="text-xs text-slate-300 font-normal">EGP/m²</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700">
              <span className="text-xs text-slate-400 font-medium">{isRTL ? 'الحد الأدنى' : 'Conservative (Min)'}</span>
              <p className="text-lg font-bold text-slate-200 mt-1">{formatEGP(minEstimate)} EGP</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40">
              <span className="text-xs text-amber-300 font-bold">{isRTL ? 'السعر العادل المستهدف' : 'Median Target'}</span>
              <p className="text-xl font-black text-white mt-1">{formatEGP(midEstimate)} EGP</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700">
              <span className="text-xs text-slate-400 font-medium">{isRTL ? 'الحد الأقصى' : 'Optimistic (Max)'}</span>
              <p className="text-lg font-bold text-slate-200 mt-1">{formatEGP(maxEstimate)} EGP</p>
            </div>
          </div>
        </div>

        {/* Growth Chart & Rental Yield */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-[#0B1C3D]">
                  {isRTL ? 'تطور سعر المتر التاريخي وتوقعات النمو (5 Years)' : 'Historical Price Trend & 5-Year Forecast'}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                +{valuation.annualGrowthPct || 22.5}% {isRTL ? 'نمو سنوي' : 'Annual Growth'}
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyChart || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B1C3D" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0B1C3D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', color: '#0B1C3D' }}
                    formatter={(value) => [`${formatEGP(value)} EGP/m²`, 'Price / SQM']}
                  />
                  <Area type="monotone" dataKey="pricePerSqm" stroke="#0B1C3D" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0B1C3D] flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>{isRTL ? 'العائد الإيجاري والاستثماري' : 'Rental Yield Insights'}</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500">{isRTL ? 'الإيجار الشهري المتوقع' : 'Estimated Monthly Rent'}</span>
                  <p className="text-xl font-black text-emerald-600 mt-1">
                    {formatEGP(estRentalMonthly)} <span className="text-xs text-slate-500 font-normal">EGP/{isRTL ? 'شهر' : 'mo'}</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500">{isRTL ? 'العائد الإيجاري السنوي' : 'Annual Rental Yield'}</span>
                  <p className="text-xl font-black text-[#0B1C3D] mt-1">
                    {valuation.rentalYieldEst || 8.4}% <span className="text-xs text-slate-500 font-normal">/ year</span>
                  </p>
                </div>
              </div>
            </div>

            <Link
              to={`/mortgage/calculator?price=${midEstimate}`}
              className="w-full py-3 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white font-bold text-xs text-center flex items-center justify-center gap-2 transition-colors"
            >
              <Landmark className="w-4 h-4" />
              <span>{isRTL ? 'احسب تمويل هذه الوحدة' : 'Mortgage This Property'}</span>
            </Link>
          </div>
        </div>

        {/* Next Actions CTA Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/add-property"
            className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between group"
          >
            <div>
              <h4 className="text-sm font-bold text-[#0B1C3D]">
                {isRTL ? 'اعرض وحدتك للبيع بهذا السعر' : 'List Property for Sale at This Value'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {isRTL ? 'انشر إعلانك ووصل لمشترين جادين' : 'Reach verified buyers directly'}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#0B1C3D] group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/valuation/professional"
            className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-between group"
          >
            <div>
              <h4 className="text-sm font-bold text-[#0B1C3D]">
                {isRTL ? 'اطلب معاينة مهندس معتمد (Due Diligence)' : 'Book On-Site Certified Appraiser'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {isRTL ? 'تقرير فحص هندسي وقانوني معتمد للبنوك' : 'Official bank-approved physical inspection'}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#0B1C3D] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
