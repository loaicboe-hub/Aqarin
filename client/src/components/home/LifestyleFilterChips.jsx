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
      color: 'hover:border-emerald-400 hover:text-emerald-700'
    },
    {
      id: 'lagoon',
      labelAr: 'مطل على لاجون وبحر',
      labelEn: 'Lagoon & Sea Views',
      icon: Waves,
      to: '/search?search=Lagoon',
      color: 'hover:border-sky-400 hover:text-sky-700'
    },
    {
      id: 'installments',
      labelAr: 'تقسيط مريح حتى 8 سنوات',
      labelEn: 'Up to 8Y Installments',
      icon: Calendar,
      to: '/search?payment=installments',
      color: 'hover:border-amber-400 hover:text-amber-700'
    },
    {
      id: 'commercial',
      labelAr: 'استثمار تجاري وإداري',
      labelEn: 'Commercial & High Yield',
      icon: TrendingUp,
      to: '/search?category=commercial',
      color: 'hover:border-indigo-400 hover:text-indigo-700'
    },
    {
      id: 'villas',
      labelAr: 'فلل مستقلة وبنتهاوس',
      labelEn: 'Signature Villas & Penthouses',
      icon: Gem,
      to: '/search?type=villa',
      color: 'hover:border-purple-400 hover:text-purple-700'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-2">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{isRTL ? 'تصفح سريع:' : 'Quick Filter:'}</span>
        </span>
        {chips.map((chip) => {
          const Icon = chip.icon;
          return (
            <Link
              key={chip.id}
              to={chip.to}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs transition-all hover:scale-105 hover:bg-white ${chip.color}`}
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
