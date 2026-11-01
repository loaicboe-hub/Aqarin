import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function MarketTicker() {
  return (
    <div className="w-full bg-[#0B1C3D] text-white py-2 sm:py-2.5 px-4 overflow-hidden border-y border-white/10 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base font-black tracking-widest uppercase">
          <Zap className="w-4 h-4 text-amber-400 fill-current animate-pulse shrink-0" />
          <Link 
            to="/fast-buy" 
            className="text-white hover:text-amber-400 transition-colors"
          >
            buy fast
          </Link>
          <span className="text-amber-400/80 font-black px-1 sm:px-2">-</span>
          <Link 
            to="/fast-sell" 
            className="text-white hover:text-emerald-400 transition-colors"
          >
            sell fast
          </Link>
          <Zap className="w-4 h-4 text-emerald-400 fill-current animate-pulse shrink-0" />
        </div>
      </div>
    </div>
  );
}

