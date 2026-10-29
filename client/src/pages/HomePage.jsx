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
  Bot
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchProperties } from '../services/api';
import PropertyCard from '../components/common/PropertyCard';
import { EGYPT_LOCATIONS } from '../data/mockData';

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?purpose=${activeTab === 'rent' ? 'rent' : 'sale'}&search=${encodeURIComponent(searchQuery || '5th Settlement')}`);
  };

  const handleSelectHotspot = (item) => {
    setSearchQuery(item);
    setSearchFocused(false);
    navigate(`/search?purpose=${activeTab === 'rent' ? 'rent' : 'sale'}&search=${encodeURIComponent(item)}`);
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

      {/* ==========================================================
          1. HERO CONTAINER (Exact match to screenshot)
      ========================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12">
        <div 
          className="relative w-full rounded-[36px] sm:rounded-[44px] overflow-hidden bg-cover bg-center shadow-2xl pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-8 text-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2000&q=80')` 
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
            <div className="bg-white p-5 sm:p-6 pb-6 space-y-4">
              
              {/* Tabs Row */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                
                {/* Left Tabs: Buy / Rent */}
                <div className="flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setActiveTab('buy')}
                    className={`relative pb-1.5 transition-colors ${
                      activeTab === 'buy' ? 'text-[#0B1C3D] font-extrabold' : 'hover:text-[#0B1C3D]'
                    }`}
                  >
                    <span>{isRTL ? 'شراء' : 'Buy'}</span>
                    {activeTab === 'buy' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B1C3D] rounded-full" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('rent')}
                    className={`relative pb-1.5 transition-colors ${
                      activeTab === 'rent' ? 'text-[#0B1C3D] font-extrabold' : 'hover:text-[#0B1C3D]'
                    }`}
                  >
                    <span>{isRTL ? 'إيجار' : 'Rent'}</span>
                    {activeTab === 'rent' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B1C3D] rounded-full" />
                    )}
                  </button>
                </div>

              </div>

              {/* Main Search Input with Coral/Red Circular Search Button */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center bg-white rounded-full border border-slate-200 focus-within:border-slate-400 pl-5 pr-2 py-1.5 shadow-sm transition-all">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    placeholder={isRTL ? 'التجمع الخامس (5th Settlement)...' : '5th Settlement'}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                  />

                  {/* Red / Coral Circular Search Button (Exact Match) */}
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105"
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
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
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
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
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
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80"
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
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
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

      {/* ==========================================================
          6. FLOATING ACTION BUTTON
          - WhatsApp Floating Button
      ========================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        
        {/* WhatsApp Circular Floating Button */}
        <a
          href="https://wa.me/201012345678?text=Hello,%20I%20have%20an%20inquiry%20about%20AQAR%20IN"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          title="Chat on WhatsApp"
        >
          <MessageSquareShare className="w-6 h-6" />
        </a>
      </div>

    </div>
  );
}
