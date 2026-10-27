import React from 'react';

export default function Badge({ children, variant = 'blue', className = '' }) {
  const variants = {
    blue: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    gold: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${variants[variant] || variants.blue} ${className}`}>
      {children}
    </span>
  );
}
