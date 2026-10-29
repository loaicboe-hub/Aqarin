import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Calculator, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Layers, 
  Landmark, 
  Star, 
  Zap, 
  BarChart3,
  Compass,
  ArrowUpRight,
  ChevronRight,
  CheckSquare,
  HelpCircle,
  Phone,
  MessageSquareShare,
  SlidersHorizontal,
  Home as HomeIcon,
  Briefcase,
  Key,
  Award,
  ChevronDown,
  Bot,
  ArrowLeftRight,
  Paintbrush,
  Tag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchProperties } from '../services/api';
import PropertyCard from '../components/common/PropertyCard';
import { SITE_CONFIG } from '../config/siteConfig';
import MarketTicker from '../components/common/MarketTicker';
import CertifiedDevelopers from '../components/home/CertifiedDevelopers';
import InstallmentCalculator from '../components/home/InstallmentCalculator';
import LifestyleFilterChips from '../components/home/LifestyleFilterChips';

export default function HomePage() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  // Search State
  const [activeTab, setActiveTab] = useState('buy'); // 'buy' | 'rent'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [properties, setProperties] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);

  const searchBoxRef = useRef(null);

  useEffect(() => {
    fetchProperties({ limit: 6 }).then(setProperties);
  }, []);

  // Suggested Egyptian Hotspots
  const popularHotspots = [
    '5th Settlement',
    'New Cairo',
    'Mivida',
    'Sheikh Zayed',
    'Allegria Sodic',
    'Ras El Hekma',
    'New Administrative Capital',
    'El Gouna',
    'Zed Towers'
  ];

  const filteredHotspots = searchQuery.trim() === ''
    ? popularHotspots
    : popularHotspots.filter(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

  // 6 Core Services for Mobile & Desktop
  const serviceTabs = [
    { id: 'buy', labelAr: 'شراء', labelEn: 'Buy', icon: HomeIcon, path: '/buy' },
    { id: 'sell', labelAr: 'بيع', labelEn: 'Sell', icon: Tag, path: '/sell' },
    { id: 'rent', labelAr: 'إيجار', labelEn: 'Rent', icon: Key, path: '/rent' },
    { id: 'exchange', labelAr: 'تبادل عقاري', labelEn: 'Exchange', icon: ArrowLeftRight, path: '/exchange' },
    { id: 'management', labelAr: 'إدارة', labelEn: 'Management', icon: Briefcase, path: '/management' },
    { id: 'finishing', labelAr: 'تشطيبات', labelEn: 'Finishing', icon: Paintbrush, path: '/finishing' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'rent') {
      navigate(`/search?purpose=rent&search=${encodeURIComponent(searchQuery || 'Maadi')}`);
    } else if (activeTab === 'exchange') {
      navigate(`/exchange${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);
    } else if (activeTab === 'sell') {
      navigate(`/sell${searchQuery ? `?location=${encodeURIComponent(searchQuery)}` : ''}`);
    } else if (activeTab === 'management') {
      navigate('/management');
    } else if (activeTab === 'finishing') {
      navigate('/finishing');
    } else {
      navigate(`/search?purpose=sale&search=${encodeURIComponent(searchQuery || '5th Settlement')}`);
    }
  };

  const handleSelectHotspot = (item) => {
    setSearchQuery(item);
    setSearchFocused(false);
    if (activeTab === 'rent') {
      navigate(`/search?purpose=rent&search=${encodeURIComponent(item)}`);
    } else if (activeTab === 'exchange') {
      navigate(`/exchange?search=${encodeURIComponent(item)}`);
    } else if (activeTab === 'sell') {
      navigate(`/sell?location=${encodeURIComponent(item)}`);
    } else {
      navigate(`/search?purpose=sale&search=${encodeURIComponent(item)}`);
    }
  };

  const marketBenchmarks = [
    { nameEn: 'New Cairo & 5th Sett.', nameAr: 'التجمع الخامس', price: '82,000', growth: '+24.5%' },
    { nameEn: 'Sheikh Zayed', nameAr: 'الشيخ زايد', price: '95,000', growth: '+21.0%' },
    { nameEn: 'Ras El Hekma', nameAr: 'رأس الحكمة', price: '145,000', growth: '+38.0%' },
    { nameEn: 'New Capital (CBD)', nameAr: 'العاصمة الإدارية', price: '58,000', growth: '+29.0%' },
    { nameEn: 'El Gouna', nameAr: 'الجونة', price: '155,000', growth: '+25.0%' },
    { nameEn: 'Mostakbal City', nameAr: 'مدينة المستقبل', price: '54,000', growth: '+27.0%' },
  ];

  const faqs = [
    {
      qEn: 'How does AQAR IN Fast Sell work?',
      qAr: 'كيف تعمل خدمة البيع السريع (Fast Sell) على عقار إن؟',
      aEn: 'Fast Sell allows property owners to receive a direct cash purchase offer within 72 hours, eliminating the lengthy wait times of traditional brokerage.',
      aAr: 'تتيح خدمة البيع السريع لأصحاب العقارات الحصول على عرض شراء نقدي فوري خلال 72 ساعة وتخليص الإجراءات بسرعة وأمان بدون وسطاء.'
    },
    {
      qEn: 'How does Property Exchange work?',
      qAr: 'كيف تعمل خدمة تبادل العقارات (Property Exchange)؟',
      aEn: 'Our Property Exchange service matches verified property owners looking to swap homes, apartments, or villas with cash-differential settlement handled securely.',
      aAr: 'تتيح منصة عقار إن التوفيق بين ملاك العقارات الراغبين في استبدال عقار بآخر، مع تسوية فروق الأسعار النقدية بكل شفافية وضمانات قانونية.'
    },
    {
      qEn: 'How are properties verified on AQAR IN?',
      qAr: 'كيف يتم التحقق وتوثيق العقارات على منصة عقار إن؟',
      aEn: 'Every listing undergoes strict verification of title deed records, developer registration, and geospatial location validation using PostGIS mapping.',
      aAr: 'يخضع كل عقار معروض على المنصة لتدقيق دقيق لملكية العقار وترخيص المطور مع التوثيق الجغرافي الدقيق لموقع العقار على الخريطة.'
    }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20 relative">

      {/* Live Egypt Market Price Index Ticker */}
      <MarketTicker />

      {/* ==========================================================
          1. HERO CONTAINER (Exact match to screenshot)
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12">
        <div 
          className="relative w-full rounded-[36px] sm:rounded-[44px] overflow-hidden bg-cover bg-center shadow-2xl pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-8 text-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85')` 
          }}
        >
          {/* Vignette / Gradient Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/40 to-slate-950/60 pointer-events-none" />

          {/* Hero Content (Centered Headlines) */}
          <div className="relative z-20 max-w-3xl mx-auto space-y-4 mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              {isRTL ? (
                <>ابحث بذكاء.<br />قرر بثقة.</>
              ) : (
                <>Find smarter.<br />Decide with confidence.</>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-medium max-w-xl mx-auto">
              {isRTL 
                ? 'البحث عن العقارات، البيع السريع، التبادل وإدارة الأملاك — كل شيء في مكان واحد.'
                : 'Property search, fast sell, property exchange, and management — all in one place.'}
            </p>
          </div>

          {/* ==========================================================
              Hero Two-Tone Floating Search Card (Exact Match to Image)
          ========================================================== */}
          <div ref={searchBoxRef} className="relative z-30 w-full max-w-2xl mx-auto text-left shadow-2xl rounded-3xl overflow-hidden">
            
            {/* Top White Section */}
            <div className="bg-white p-4 sm:p-6 pb-6 space-y-4">
              
              {/* Service Tabs Row (Mobile Friendly & Native App Feel - Exactly 6 Services) */}
              <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-1 text-xs sm:text-sm font-bold text-slate-600 border-b border-slate-100">
                {serviceTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSearchFocused(false);
                      }}
                      className={`relative pb-2 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        isActive 
                          ? 'text-[#0B1C3D] font-extrabold' 
                          : 'hover:text-[#0B1C3D] text-slate-500'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0B1C3D]' : 'text-slate-400'}`} />
                      <span>{isRTL ? tab.labelAr : tab.labelEn}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B1C3D] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Interactive Box Content Based on Selected Tab */}
              
              {/* Tab 1, 2, 3: Search-Based (Buy, Rent, Exchange) */}
              {(activeTab === 'buy' || activeTab === 'rent' || activeTab === 'exchange') && (
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="flex items-center bg-white rounded-full border border-slate-200 focus-within:border-slate-400 pl-5 pr-2 py-1.5 shadow-sm transition-all">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      placeholder={
                        activeTab === 'rent'
                          ? (isRTL ? 'المعادي، التجمع، زايد... ابحث عن عقار للإيجار' : 'Maadi, 5th Settlement... search rentals')
                          : activeTab === 'exchange'
                          ? (isRTL ? 'ابحث في صفقات البدل (شقة بالتجمع، فيلا بزايد)...' : 'Search exchange deals (e.g. Villa in Zayed)...')
                          : (isRTL ? 'التجمع الخامس (5th Settlement)... أو ابحث عن عقار للشراء' : '5th Settlement... search properties for sale')
                      }
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                    />

                    {/* Red / Coral Circular Search Button (Exact Match) */}
                    <button
                      type="submit"
                      className="w-10 h-10 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105"
                      title={isRTL ? 'بحث' : 'Search'}
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown Auto-Suggestions */}
                  {searchFocused && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                        <span>{isRTL ? 'أشهر المناطق والكمبوندات' : 'Popular Locations'}</span>
                        <button type="button" onClick={() => setSearchFocused(false)}>✕</button>
                      </div>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {filteredHotspots.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectHotspot(item)}
                            className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center gap-2"
                          >
                            <MapPin className="w-3.5 h-3.5 text-sky-500" />
                            <span>{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* Tab 4: Sell (بيع) */}
              {activeTab === 'sell' && (
                <div className="space-y-3">
                  <div className="flex items-center bg-white rounded-full border border-slate-200 focus-within:border-slate-400 pl-4 pr-1.5 py-1.5 shadow-sm transition-all">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isRTL ? 'أدخل عنوان أو منطقة عقارك للبدء في عرضه للبيع...' : 'Enter your property area or address to list...'}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none px-2"
                    />
                    <Link
                      to={`/sell${searchQuery ? `?location=${encodeURIComponent(searchQuery)}` : ''}`}
                      className="h-10 px-5 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm transition-transform hover:scale-105"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>{isRTL ? 'اعرض للبيع' : 'List for Sale'}</span>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 px-2 pt-1 flex-wrap gap-2">
                    <span>{isRTL ? 'تريد كاش فوري وتخليص إجراءات سريعة؟' : 'Need instant cash offer within 72 hours?'}</span>
                    <Link to="/fast-sell" className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
                      <span>{isRTL ? 'بيع سريع كاش 72 ساعة' : 'Fast Sell Cash (72h)'}</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Tab 5: Management (إدارة) */}
              {activeTab === 'management' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-bold text-[#0B1C3D] flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      <span>{isRTL ? 'إدارة وتأجير أملاكك الاستثمارية' : 'Property Management & Rental Yield'}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500">
                      {isRTL ? 'عقود موثقة، فحص للمستأجرين، تحصيل دوري وصيانة بأعلى عائد استثماري.' : 'Certified contracts, tenant vetting, rent collection & full maintenance.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <Link
                      to="/management"
                      className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white text-xs font-bold text-center shadow-xs transition-transform hover:scale-105"
                    >
                      {isRTL ? 'استكشف الباقات' : 'Explore Plans'}
                    </Link>
                    <a
                      href={SITE_CONFIG.getWhatsAppUrl(isRTL ? 'مرحباً، أود الاستفسار عن باقات إدارة الأملاك.' : 'Hello, I want to inquire about Property Management.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors shrink-0"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{isRTL ? 'واتساب' : 'WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Tab 6: Finishing (تشطيبات) */}
              {activeTab === 'finishing' && (
                <div className="bg-teal-50/60 rounded-2xl p-4 border border-teal-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-bold text-teal-900 flex items-center gap-1.5">
                      <Paintbrush className="w-4 h-4 text-teal-600" />
                      <span>{isRTL ? 'حاسبة التشطيبات الذكية والديكور' : 'Smart Finishing Calculator & Interior'}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600">
                      {isRTL ? 'احسب تكلفة تشطيب وحدتك فورياً (لوكس، سوبر لوكس، ألترا) مع ضمان تنفيذ معتمد.' : 'Calculate finishing cost instantly with certified execution warranty.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <Link
                      to="/finishing"
                      className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold text-center shadow-xs transition-transform hover:scale-105"
                    >
                      {isRTL ? 'احسب التكلفة فوراً' : 'Calculate Cost'}
                    </Link>
                    <a
                      href={SITE_CONFIG.getWhatsAppUrl(isRTL ? 'مرحباً، أود الاستفسار عن باقات التشطيب والمعاينة.' : 'Hello, I want to inquire about Finishing Services.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-full bg-white text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1 hover:bg-teal-100 transition-colors shrink-0"
                    >
                      <span>{isRTL ? 'طلب معاينة' : 'Inspection'}</span>
                    </a>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Navy Section (Fast Sell Action Banner) */}
            <div className="bg-[#0B1C3D] p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {isRTL ? 'تريد بيع عقارك بأسرع وقت؟' : 'Need to Sell Your Property Fast?'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isRTL ? 'احصل على عرض شراء كاش مباشر خلال 72 ساعة بدون عمولات.' : 'Get a direct cash purchase offer within 72 hours with zero brokerage fees.'}
                </p>
              </div>

              {/* White Pill Button: Fast Sell */}
              <Link
                to="/fast-sell"
                className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0B1C3D] text-xs sm:text-sm font-extrabold shadow-sm shrink-0 transition-transform hover:scale-105"
              >
                {isRTL ? 'بيع عقارك كاش' : 'Sell Fast for Cash'}
              </Link>
            </div>

          </div>

          {/* Lifestyle & Investment Quick Filter Chips */}
          <LifestyleFilterChips />

        </div>
      </section>

      {/* ==========================================================
          2. EVERYTHING YOU NEED IN ONE PLACE (Exact Match to Screenshot)
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0B1C3D] tracking-tight">
            {isRTL ? 'كل ما تحتاجه في مكان واحد' : 'Everything You Need in One Place'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {isRTL 
              ? 'اكتشف أدوات وخدمات قوية صُممت لمساعدتك في الشراء، الإيجار، البيع السريع، تبادل العقارات وإدارة عقارك بكل ثقة.'
              : 'Discover powerful tools and services designed to help you buy, rent, fast sell, exchange, and manage property with confidence.'}
          </p>
        </div>

        {/* 2x2 Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: Fast Sell Cash Offer */}
          <Link
            to="/fast-sell"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 group text-left"
          >
            <div className="w-full sm:w-56 md:w-64 h-44 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                alt="Fast Sell Cash Offer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors">
                {isRTL ? 'البيع السريع الفوري (كاش)' : 'Fast Sell & Cash Offer'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'احصل على عرض شراء كاش فوري ومباشر لعقارك خلال 72 ساعة فقط وبدون عمولات وسيط.'
                  : 'Receive a guaranteed cash purchase offer for your property within 72 hours with zero brokerage hassle.'}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors pt-1">
                <span>{isRTL ? 'طلب بيع سريع' : 'Get Cash Offer'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          </Link>

          {/* Card 2: Verified Listings & Compounds */}
          <Link
            to="/buy"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 group text-left"
          >
            <div className="w-full sm:w-56 md:w-64 h-44 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                alt="Verified Listings"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors">
                {isRTL ? 'عقارات موثقة للبيع والإيجار' : 'Verified Properties & Communities'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'استكشف وحدات وفلل فاخرة موثقة في أرقى كمبوندات التجمع الخامس، الشيخ زايد والعاصمة الإدارية.'
                  : 'Explore verified luxury villas, apartments, and duplexes across Egypt’s premier compounds.'}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors pt-1">
                <span>{isRTL ? 'تصفح العقارات المتاحة' : 'Browse Available Properties'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          </Link>

          {/* Card 3: Property Management */}
          <Link
            to="/management"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 group text-left"
          >
            <div className="w-full sm:w-56 md:w-64 h-44 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                alt="Property Management"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors">
                {isRTL ? 'إدارة وتشغيل الأملاك' : 'Property Management'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'خدمات إدارة متكاملة تشمل تأجير الوحدات، تحصيل الإيجارات، والصيانة الدورية بأعلى عائد استثماري.'
                  : 'Full-service asset management covering tenant screening, rent collection, and periodic maintenance.'}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors pt-1">
                <span>{isRTL ? 'طلب إدارة أملاك' : 'Manage My Property'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          </Link>

          {/* Card 4: Property Exchange */}
          <Link
            to="/exchange"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 group text-left"
          >
            <div className="w-full sm:w-56 md:w-64 h-44 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
                alt="Property Exchange"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors">
                {isRTL ? 'خدمة تبادل العقارات' : 'Property Exchange'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'استبدل شقتك أو فيلتك بعقار آخر في منطقة جديدة تناسبك مع تسوية الفروق النقدية بأمان.'
                  : 'Swap your apartment or villa for a new property matching your needs with safe monetary difference settlement.'}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors pt-1">
                <span>{isRTL ? 'ابدأ التبادل العقاري' : 'Explore Exchange'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          </Link>

        </div>

      </section>

      {/* Certified Top Master Developers Showcase */}
      <CertifiedDevelopers />

      {/* ==========================================================
          3. LIVE MARKET REAL ESTATE BENCHMARKS INDEX
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            {isRTL ? 'متوسط سعر المتر المربع اليوم في مصر (2026 EGP/m²):' : 'Live Real Estate Price Index (2026 EGP/m²):'}
          </span>
          <Link to="/search" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
            <span>{isRTL ? 'استكشف كافة المناطق' : 'Explore All Hotspots'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {marketBenchmarks.map((b, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left hover:border-slate-300 transition-colors">
              <p className="text-xs font-semibold text-slate-500 truncate">{isRTL ? b.nameAr : b.nameEn}</p>
              <p className="text-base font-black text-[#0B1C3D] mt-1">{b.price} <span className="text-[10px] text-slate-400 font-normal">EGP</span></p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                {b.growth}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================================
          3. FEATURED VERIFIED PROPERTIES
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1C3D]">
              {isRTL ? 'أحدث العقارات المعتمدة للبيع والإيجار' : 'Featured Verified Properties'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isRTL ? 'عقارات موثقة ومقيمة بدرجة Aqar Score في أرقى كمبوندات مصر' : 'Curated listings with verified title deeds & high Aqar Score rating'}
            </p>
          </div>

          <Link
            to="/buy"
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-[#0B1C3D] flex items-center gap-1.5 transition-colors"
          >
            <span>{isRTL ? 'تصفح كل العقارات' : 'View All Properties'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* Smart Egyptian Installment & Payment Plan Calculator */}
      <InstallmentCalculator />

      {/* ==========================================================
          4. WHY AQAR IN (Value Props)
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B1C3D]">
              {isRTL ? 'لماذا تختار عقار إن (AQAR IN)؟' : 'Why Choose AQAR IN?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isRTL ? 'المنصة الأكثر شفافية وسرعة في المعاملات والخدمات العقارية الموثقة في مصر' : 'Empowering buyers, sellers, and investors with data-driven real estate intelligence'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C3D]">
                {isRTL ? 'بيع كاش فوري ومضمون' : 'Guaranteed Fast Cash Sell'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRTL ? 'شراء مباشر للعقارات وتخليص الإجراءات خلال 72 ساعة بدون انتظار أو عمولات سمسرة.' : 'Direct property purchasing and closing within 72 hours without waiting or brokerage fees.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C3D]">
                {isRTL ? 'عقارات موثقة ومفحوصة قانونياً' : 'Verified & Legally Audited'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRTL ? 'فحص كامل لسندات الملكية والموقف الإنشائي لضمان صفقات آمنة 100% لجميع الأطراف.' : 'Full verification of title deeds and structural status to guarantee 100% safe transactions.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C3D]">
                {isRTL ? 'تبادل وإدارة أملاك متكاملة' : 'Property Exchange & Management'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRTL ? 'خدمات تبادل العقارات الذكية وإدارة وتأجير وصيانة الوحدات للمستثمرين وأصحاب الأملاك.' : 'Smart property exchange and end-to-end leasing and asset management for investors.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          5. FAQ SECTION
      ========================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B1C3D]">
            {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRTL ? 'إجابات على أهم الاستفسارات حول الشراء والبيع والخدمات العقارية' : 'Everything you need to know about properties, buying & real estate services'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#0B1C3D]"
                >
                  <span>{isRTL ? faq.qAr : faq.qEn}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-sky-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60">
                    {isRTL ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
