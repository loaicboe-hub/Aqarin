import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SITE_CONFIG } from '../../config/siteConfig';

export default function FloatingWhatsApp() {
  const { isRTL } = useLanguage();
  const [hovered, setHovered] = useState(false);

  return (
    <aside 
      aria-label="WhatsApp Support Contact"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group pointer-events-auto"
    >
      {/* Tooltip / Label */}
      <span
        className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-xl border border-white/10 transition-all duration-300 transform ${
          hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}
      >
        <span>{isRTL ? 'تحدث مع مستشارك العقاري' : 'Chat with Real Estate Advisor'}</span>
        <span className="font-mono text-emerald-400 font-bold">0100 449 1026</span>
      </span>

      {/* Floating WhatsApp Action Button */}
      <a
        href={SITE_CONFIG.getWhatsAppUrl(isRTL ? 'مرحباً، أود الاستفسار عن خدمات منصة عقار إن.' : 'Hello, I would like to inquire about AQAR IN services.')}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-2xl hover:shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 group"
        title="WhatsApp: +201004491026"
        aria-label="Chat on WhatsApp +201004491026"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10 group-hover:opacity-100"></span>

        {/* Official WhatsApp SVG Icon */}
        <svg 
          className="w-7 h-7 fill-white drop-shadow-sm transition-transform group-hover:rotate-6" 
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        {/* Online green indicator badge */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
      </a>
    </aside>
  );
}
