import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Waves, Calendar, TrendingUp, Gem, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LifestyleFilterChips() {
  const { isRTL } = useLanguage();

  const chips = [
    {
      id: 'ready',
      labelAr: 'استلام فوري 2026',
      labelEn: 'Ready to Move',
      icon: KeyRound,
      to: '/search?delivery=ready',
      color: 'hover:border-emerald-500 hover:text-emerald-700'
    },
    {
      id: 'lagoon',
      labelAr: 'مطل على لاجون وبحر',
      labelEn: 'Lagoon & Sea Views',
      icon: Waves,
      to: '/search?search=Lagoon',
      color: 'hover:border-sky-500 hover:text-sky-700'
    },
    {
      id: 'installments',
      labelAr: 'تقسيط حتى 8 سنوات',
      labelEn: 'Up to 8Y Installments',
      icon: Calendar,
      to: '/search?payment=installments',
      color: 'hover:border-amber-500 hover:text-amber-700'
    },
    {
      id: 'commercial',
      labelAr: 'استثمار تجاري وإداري',
      labelEn: 'Commercial & Offices',
      icon: TrendingUp,
      to: '/search?category=commercial',
      color: 'hover:border-indigo-500 hover:text-indigo-700'
    },
    {
      id: 'villas',
      labelAr: 'فلل وبنتهاوس',
      labelEn: 'Villas & Penthouses',
      icon: Gem,
      to: '/search?type=villa',
      color: 'hover:border-purple-500 hover:text-purple-700'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-5 px-2 sm:px-4 relative z-30">
      <div className="flex items-center justify-start md:justify-center md:flex-wrap gap-2 sm:gap-2.5 overflow-x-auto md:overflow-visible no-scrollbar py-1 px-1">
        <span className="text-xs font-extrabold text-amber-300 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shrink-0 flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isRTL ? 'تصفح سريع:' : 'Quick Filter:'}</span>
        </span>
        {chips.map((chip) => {
          const Icon = chip.icon;
          return (
            <Link
              key={chip.id}
              to={chip.to}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 text-xs font-bold border border-white/80 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap ${chip.color}`}
            >
              <Icon className="w-3.5 h-3.5 text-slate-500" />
              <span>{isRTL ? chip.labelAr : chip.labelEn}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
