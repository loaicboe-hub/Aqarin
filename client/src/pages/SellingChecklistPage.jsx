import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SELLER_CHECKLIST } from '../data/mockData';

export default function SellingChecklistPage() {
  const { isRTL } = useLanguage();
  const [completedItems, setCompletedItems] = useState([2]);

  const toggleItem = (id) => {
    setCompletedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const progressPct = Math.round((completedItems.length / SELLER_CHECKLIST.length) * 100);

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <CheckSquare className="w-4 h-4 text-amber-600" />
            <span>{isRTL ? 'دليل وقائمة فحص البائعين' : 'Egyptian Seller Due Diligence Checklist'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1C3D]">
            {isRTL ? 'قائمة تجهيز وبيع عقارك بأعلى سعر وأسرع وقت' : 'Complete Guide to Sell Your Property in Egypt'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            {isRTL 
              ? 'خطوات عملية وقانونية مرتبة لتجهيز أوراق الملكية والمخالصات وتحديد السعر العادل.'
              : 'Step-by-step verified legal and marketing checklist to prepare title deeds, clearances, staging and pricing.'}
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {isRTL ? 'نسبة جاهزية عقارك للبيع' : 'Sale Readiness Progress'}
            </span>
            <span className="text-sm font-black text-[#0B1C3D]">{progressPct}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
            <div 
              className="h-full bg-[#0B1C3D] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-4">
          {SELLER_CHECKLIST.map((item) => {
            const isDone = completedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 flex items-start gap-4 ${
                  isDone 
                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all ${
                  isDone ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-500 font-bold'
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : item.id}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base font-bold ${isDone ? 'text-emerald-800 line-through' : 'text-[#0B1C3D]'}`}>
                      {isRTL ? item.titleAr : item.titleEn}
                    </h3>
                    <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isRTL ? item.descAr : item.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA bottom */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <h3 className="text-lg font-bold text-[#0B1C3D]">
            {isRTL ? 'جاهز لنشر عقارك على عقار إن (AQAR IN)؟' : 'Ready to List Your Property on AQAR IN?'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isRTL ? 'انشر وحدتك مجاناً واستقبل اتصالات ومحادثات واتساب مباشرة من مشترين جادين.' : 'Publish your listing for free and connect directly with verified buyers without broker commission.'}
          </p>
          <Link
            to="/add-property"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white font-bold text-xs shadow-sm transition-all"
          >
            <span>{isRTL ? 'أضف عقارك الآن مجاناً' : 'Add Property Listing Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
