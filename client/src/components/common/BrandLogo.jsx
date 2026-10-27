import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function BrandLogo({ variant = 'default', showTagline = true, className = '' }) {
  const { isRTL } = useLanguage();
  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Modern Architectural Icon Badge */}
      <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-sm ${
        isWhite 
          ? 'bg-gradient-to-br from-white/15 to-white/5 border border-white/20 text-white' 
          : 'bg-gradient-to-br from-[#0B1C3D] to-[#162F5E] text-white shadow-sky-900/10'
      }`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
          {/* Main Building / A-Frame Silhouette */}
          <path 
            d="M16 4L6 14V26C6 26.5523 6.44772 27 7 27H13V19C13 18.4477 13.4477 18 14 18H18C18.5523 18 19 18.4477 19 19V27H25C25.5523 27 26 26.5523 26 26V14L16 4Z" 
            fill="currentColor" 
            opacity="0.9"
          />
          {/* Inner Accent Line / Roof Apex */}
          <path 
            d="M16 8L22 14H10L16 8Z" 
            fill="#38BDF8" 
          />
          {/* "IN" Dot / Smart Beacon */}
          <circle 
            cx="16" 
            cy="13" 
            r="2" 
            fill="#F59E0B" 
          />
        </svg>
        
        {/* Subtle Pulse Glow */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      </div>

      {/* Typography Block */}
      <div className="flex flex-col text-left leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`text-lg sm:text-xl font-black tracking-tight ${
            isWhite ? 'text-white' : 'text-[#0B1C3D]'
          }`}>
            AQAR
          </span>
          <span className="text-xs font-black uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xs">
            IN
          </span>
          <span className={`text-xs font-bold mr-1 ${
            isWhite ? 'text-slate-300' : 'text-slate-500'
          }`}>
            عقار إن
          </span>
        </div>

        {showTagline && (
          <span className={`text-[10px] font-medium tracking-wide ${
            isWhite ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {isRTL ? 'المنصة الذكية للتقييم والعقارات' : 'Smart Property Intelligence'}
          </span>
        )}
      </div>
    </div>
  );
}
