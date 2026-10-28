import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Landmark, 
  Calculator, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { calculateMortgage, fetchMortgageBanks } from '../services/api';
import { EGYPT_BANKS } from '../data/mockData';

export default function MortgageCalculatorPage() {
  const { isRTL } = useLanguage();
  const [searchParams] = useSearchParams();

  const [price, setPrice] = useState(Number(searchParams.get('price')) || 6500000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [tenureYears, setTenureYears] = useState(15);
  const [interestRate, setInterestRate] = useState(18.5);
  const [selectedBank, setSelectedBank] = useState('cib');
  const [banksList, setBanksList] = useState(EGYPT_BANKS);

  const [calcResult, setCalcResult] = useState(null);

  useEffect(() => {
    fetchMortgageBanks()
      .then(banks => {
        if (banks && banks.length > 0) setBanksList(banks);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    calculateMortgage({
      propertyPrice: price,
      downPaymentPct,
      tenureYears,
      interestRate
    }).then(setCalcResult);
  }, [price, downPaymentPct, tenureYears, interestRate]);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank.id);
    setInterestRate(bank.rate);
  };

  const formatEGP = (num) => new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(num || 0);

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Landmark className="w-4 h-4 text-amber-600" />
            <span>{isRTL ? 'حاسبة التمويل العقاري للبنوك المصرية' : 'Egyptian Real Estate Mortgage Engine'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1C3D]">
            {isRTL ? 'احسب تمويل وحدتك وقارن عروض البنوك' : 'Calculate Your Mortgage & Compare Bank Rates'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            {isRTL 
              ? 'احسب قيمة القسط الشهري، الفوائد الإجمالية، والحد الأدنى للراتب المطلوب مع مقارنة بين مبادرات البنك المركزي 8% وتمويل البنوك التجارية.'
              : 'Estimate monthly installments, total interest, and required monthly salary across major Egyptian banks.'}
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#0B1C3D] flex items-center gap-2 pb-3 border-b border-slate-100">
              <Calculator className="w-5 h-5 text-sky-600" />
              <span>{isRTL ? 'مدخلات التمويل العقاري' : 'Mortgage Loan Parameters'}</span>
            </h2>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">{isRTL ? 'سعر العقار' : 'Property Price'}</label>
                <div className="flex items-center gap-1 font-bold text-[#0B1C3D] text-sm">
                  <span>{formatEGP(price)}</span>
                  <span className="text-xs">EGP</span>
                </div>
              </div>
              <input
                type="range"
                min="1000000"
                max="30000000"
                step="250000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-[#0B1C3D] cursor-pointer"
              />
            </div>

            {/* Down Payment Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  {isRTL ? 'المقدم' : 'Down Payment'} ({downPaymentPct}%)
                </label>
                <div className="flex items-center gap-1 font-bold text-[#0B1C3D] text-sm">
                  <span>{formatEGP(Math.round(price * (downPaymentPct / 100)))}</span>
                  <span className="text-xs">EGP</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                className="w-full accent-[#0B1C3D] cursor-pointer"
              />
            </div>

            {/* Tenure Years */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">{isRTL ? 'المدة' : 'Tenure'}</label>
                <span className="font-bold text-[#0B1C3D] text-sm">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[#0B1C3D] cursor-pointer"
              />
            </div>

            {/* Bank Cards */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 block">{isRTL ? 'اختر البنك' : 'Select Bank'}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {banksList.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => handleBankSelect(bank)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      selectedBank === bank.id
                        ? 'bg-[#0B1C3D] text-white border-[#0B1C3D] shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{isRTL ? bank.nameAr : bank.name}</p>
                      <span className={`text-[11px] font-extrabold ${selectedBank === bank.id ? 'text-amber-300' : 'text-amber-600'}`}>{bank.rate}% Interest</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            <div className="bg-[#0B1C3D] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">{isRTL ? 'القسط الشهري المتوقع' : 'Estimated Monthly Payment'}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-amber-400 tracking-tight">
                    {formatEGP(calcResult?.monthlyInstallment)}
                  </span>
                  <span className="text-xs font-bold text-slate-200">EGP/mo</span>
                </div>
              </div>

              <div className="space-y-3 text-xs border-y border-slate-700 py-4">
                <div className="flex justify-between text-slate-300">
                  <span>{isRTL ? 'قيمة القرض' : 'Loan Amount'}:</span>
                  <span className="font-bold text-white">{formatEGP(calcResult?.loanAmount)} EGP</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{isRTL ? 'المقدم' : 'Down Payment'}:</span>
                  <span className="font-bold text-white">{formatEGP(calcResult?.downPayment)} EGP</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{isRTL ? 'إجمالي الفوائد' : 'Total Interest'}:</span>
                  <span className="font-bold text-white">{formatEGP(calcResult?.totalInterest)} EGP</span>
                </div>
                <div className="flex justify-between text-emerald-300 font-semibold bg-emerald-500/20 p-2 rounded-xl">
                  <span>{isRTL ? 'الحد الأدنى للراتب' : 'Min. Monthly Income'}:</span>
                  <span className="font-bold">{formatEGP(calcResult?.minRequiredIncome)} EGP</span>
                </div>
              </div>

              <Link
                to={`/mortgage/apply?price=${price}&loan=${calcResult?.loanAmount}&down=${calcResult?.downPayment}&bank=${selectedBank}`}
                className="w-full py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#0B1C3D] font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.02]"
              >
                <span>{isRTL ? 'قدم الآن للحصول على الموافقة' : 'Apply for Pre-Approval'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <p>
                {isRTL 
                  ? 'الحسابات استرشادية وتخضع لشروط البنك المركزي المصري والائتمان البنكي.'
                  : 'Estimates are indicative and subject to individual bank underwriting and CBE regulations.'}
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
