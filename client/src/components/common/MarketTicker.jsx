import React from 'react';
import { TrendingUp, Flame, Activity } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function MarketTicker() {
  const { isRTL } = useLanguage();

  const marketData = [
    { cityAr: 'التجمع الخامس', cityEn: 'New Cairo (5th Sett.)', price: '85,000', growth: '+24.5%', highDemand: true },
    { cityAr: 'الشيخ زايد', cityEn: 'Sheikh Zayed', price: '98,000', growth: '+21.0%', highDemand: true },
    { cityAr: 'رأس الحكمة', cityEn: 'Ras El Hekma (North Coast)', price: '160,000', growth: '+38.0%', hotDeal: true },
    { cityAr: 'العاصمة الإدارية (CBD)', cityEn: 'New Capital (CBD)', price: '65,000', growth: '+29.0%', highDemand: true },
    { cityAr: 'الجونة', cityEn: 'El Gouna (Red Sea)', price: '175,000', growth: '+25.0%', hotDeal: true },
    { cityAr: 'المستقبل سيتي', cityEn: 'Mostakbal City', price: '56,000', growth: '+27.0%', highDemand: false },
    { cityAr: 'الزمالك وكورنيش النيل', cityEn: 'Zamalek & Nile View', price: '120,000', growth: '+19.5%', hotDeal: true },
  ];

  return (
    <div className="w-full bg-[#0B1C3D] text-white py-2.5 px-4 overflow-hidden border-y border-white/10 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Label Badge */}
        <div className="flex items-center gap-2 shrink-0 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-amber-400">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span className="hidden sm:inline">{isRTL ? 'مؤشر أسعار المتر في مصر (Aqar Intelligence™):' : 'Egypt Market Index (Aqar Intelligence™):'}</span>
          <span className="sm:hidden">{isRTL ? 'مؤشر الأسعار:' : 'Market Index:'}</span>
        </div>

        {/* Scrolling Ticker */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 text-xs whitespace-nowrap">
          {marketData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg transition-colors">
              <span className="font-bold text-slate-200">
                {isRTL ? item.cityAr : item.cityEn}:
              </span>
              <span className="font-mono text-white font-extrabold">
                {item.price} <span className="text-[10px] text-slate-400 font-normal">{isRTL ? 'ج/م²' : 'EGP/m²'}</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold flex items-center gap-0.5 text-[11px]">
                <TrendingUp className="w-3 h-3" />
                {item.growth}
              </span>
              {item.hotDeal && (
                <span className="inline-flex items-center gap-0.5 text-[9px] bg-rose-500/30 text-rose-300 px-1.5 py-0.5 rounded font-black">
                  <Flame className="w-2.5 h-2.5" />
                  {isRTL ? 'طلب قياسي' : 'Hot'}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
