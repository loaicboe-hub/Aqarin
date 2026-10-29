import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  Filter, 
  MessageSquareShare, 
  PhoneCall, 
  MapPin,
  Tag,
  BadgePercent
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchProperties } from '../services/api';
import PropertyCard from '../components/common/PropertyCard';

export default function FastBuyPage() {
  const { isRTL } = useLanguage();
  const [properties, setProperties] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState('all');

  useEffect(() => {
    fetchProperties({ purpose: 'sale', limit: 6 }).then(data => {
      // Add fast buy promotional attributes to existing properties
      const fastBuyList = data.map((p, idx) => ({
        ...p,
        fastBuyBadge: idx % 2 === 0 ? (isRTL ? 'استلام فوري كاش' : 'Immediate Delivery Cash') : (isRTL ? 'خصم تصفية 15%' : '15% Liquidation Deal'),
        discountPct: idx % 2 === 0 ? 12 : 18,
        urgentSeller: true
      }));
      setProperties(fastBuyList);
    });
  }, [isRTL]);

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B1C3D] via-[#102A56] to-[#0B1C3D] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
            <Zap className="w-4 h-4 fill-current text-amber-400" />
            <span>{isRTL ? 'خدمة الشراء السريع — صفقات كاش حصرية' : 'Fast Buy Service — Exclusive Cash Deals'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            {isRTL ? (
              <>اشتري عقارك بأسرع وقت،<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-300">وبأعلى خصم كاش مباشر في مصر</span></>
            ) : (
              <>Fast Buy Properties with<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-300">Instant Delivery & Maximum Cash Discounts</span></>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isRTL 
              ? 'وحدات معتمدة ومفحوصة قانونياً من بائعين ومطورين جادين يبحثون عن سيولة سريعة بأسعار أقل من متوسط سعر السوق الحالي بـ 10% إلى 25%.'
              : 'Verified title-deed properties from motivated sellers and developers seeking fast cash closure at 10% - 25% below market price benchmarks.'}
          </p>

          {/* Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 text-left">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold">{isRTL ? 'إنهاء خلال 72 ساعة' : 'Closure in 72h'}</h3>
              <p className="text-[11px] text-slate-300 mt-1">{isRTL ? 'إجراءات نقل ملكية فورية' : 'Express legal closing'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <BadgePercent className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold">{isRTL ? 'خصومات تصل لـ 25%' : 'Up to 25% Off'}</h3>
              <p className="text-[11px] text-slate-300 mt-1">{isRTL ? 'أقل من سعر المتر بالسوق' : 'Below market price'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <ShieldCheck className="w-6 h-6 text-sky-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold">{isRTL ? 'فحص قانوني معتمد' : 'Title Deed Verified'}</h3>
              <p className="text-[11px] text-slate-300 mt-1">{isRTL ? 'خالية من أي نزاعات' : '100% clean title'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold">{isRTL ? 'مؤشر Aqar Score' : 'Aqar Score Certified'}</h3>
              <p className="text-[11px] text-slate-300 mt-1">{isRTL ? 'مؤشر سعر موثق' : 'Data-backed value'}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Instant Deals Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B1C3D]">
                {isRTL ? 'صفقات الشراء السريع المتاحة اليوم' : 'Live Fast Buy Opportunities'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isRTL ? 'وحدات جاهزة للتعاقد الفوري في التجمع، الشيخ زايد، والساحل الشمالي' : 'Prime units ready for immediate closing in New Cairo, Zayed & North Coast'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/201012345678?text=Hello,%20I%20am%20interested%20in%20Fast%20Buy%20deals%20on%20AQAR%20IN"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-transform hover:scale-105"
            >
              <MessageSquareShare className="w-4 h-4" />
              <span>{isRTL ? 'تنبيهات الصفقات على واتساب' : 'Get WhatsApp Alerts'}</span>
            </a>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div key={prop.id} className="relative group">
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-extrabold shadow-md">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{prop.fastBuyBadge}</span>
              </div>
              <PropertyCard property={prop} />
            </div>
          ))}
        </div>
      </section>

      {/* Fast Buy Assistance Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-slate-900 to-[#0B1C3D] text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              {isRTL ? 'لم تجد الوحدة المناسبة لطلبك السريع؟' : 'Haven\'t Found the Right Fast Deal Yet?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              {isRTL ? 'سجل مواصفات الوحدة والميزانية، وسيقوم فريق عقار إن بتوفير 3 صفقات كاش حصرية خلال 24 ساعة.' : 'Specify your desired compound and budget, and our team will source 3 verified cash deals within 24 hours.'}
            </p>
          </div>

          <Link
            to="/buy"
            className="px-6 py-3.5 rounded-full bg-white text-[#0B1C3D] hover:bg-slate-100 font-bold text-xs shrink-0 shadow-md transition-all flex items-center gap-2"
          >
            <span>{isRTL ? 'طلب صفقة مخصصة' : 'Request Custom Deal'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
