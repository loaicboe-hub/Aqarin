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
  const [activeTab, setActiveTab] = useState('buy'); // 'buy' | 'rent' | 'valuation'
  const [searchMode, setSearchMode] = useState('classic'); // 'classic' | 'ai'
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
    if (activeTab === 'valuation') {
      navigate(`/valuation/instant?district=${encodeURIComponent(searchQuery || '5th Settlement')}`);
    } else {
      navigate(`/search?purpose=${activeTab === 'rent' ? 'rent' : 'sale'}&search=${encodeURIComponent(searchQuery || '5th Settlement')}`);
    }
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
      qEn: 'How does AQAR IN calculate property valuation?',
      qAr: 'كيف تحسب منصة عقار إن (AQAR IN) القيمة السوقية للعقار؟',
      aEn: 'Our proprietary valuation algorithm analyzes live transaction benchmarks across 150+ Egyptian compounds, integrating variables such as location, developer tier, floor level, view (Garden/Lagoon/Golf), and finishing quality (Core & Shell to Ultra-Lux).',
      aAr: 'تعتمد خوارزمية التقييم على تحليل آلاف الصفقات ومؤشرات الأسعار الحية في أكثر من 150 كمبوند مصري، مع الأخذ بالاعتبار المنطقة، الدور، نوع الإطلالة ومستوى التشطيب.'
    },
    {
      qEn: 'Is the instant valuation acceptable for Egyptian bank mortgages?',
      qAr: 'هل التقييم الفوري معتمد لدى البنوك المصرية للتمويل العقاري؟',
      aEn: 'The instant AI valuation provides an accurate market benchmark. For official bank financing approvals, you can book an on-site Certified Engineering Due Diligence report directly from our platform.',
      aAr: 'التقييم الفوري يقدم سعراً استرشادياً فائق الدقة، كما يمكنك من خلال المنصة طلب معاينة مهندس وخبير معتمد لإصدار تقرير رسمي مقبول لدى جميع البنوك.'
    },
    {
      qEn: 'What are the current mortgage interest rates in Egypt?',
      qAr: 'ما هي أسعار فائدة التمويل العقاري الحالية في مصر؟',
      aEn: 'Mortgage rates range from Central Bank of Egypt (CBE) subsidized initiatives (8% & 3%) to commercial bank rates (17.5% - 19.5%) with repayment tenures up to 20 years.',
      aAr: 'تتراوح الفائدة بين مبادرات البنك المركزي المدعومة (8% و 3%) والتمويل البنكي التجاري (17.5% - 19.5%) بفترات سداد تصل إلى 20 سنة.'
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
                ? 'البحث عن العقارات، التقييم، وحلول التمويل العقاري — كل شيء في مكان واحد.'
                : 'Property search, valuation, and mortgage solutions — all in one place.'}
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
                
                {/* Left Tabs: Buy / Rent / Instant valuation */}
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

                  <button
                    type="button"
                    onClick={() => setActiveTab('valuation')}
                    className={`relative pb-1.5 transition-colors ${
                      activeTab === 'valuation' ? 'text-[#0B1C3D] font-extrabold' : 'hover:text-[#0B1C3D]'
                    }`}
                  >
                    <span>{isRTL ? 'التقييم الفوري' : 'Instant valuation'}</span>
                    {activeTab === 'valuation' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B1C3D] rounded-full" />
                    )}
                  </button>
                </div>

                {/* Right Switcher Pill: Classic vs AI Search */}
                <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSearchMode('classic')}
                    className={`px-3.5 py-1 rounded-full transition-all ${
                      searchMode === 'classic' ? 'bg-white text-[#0B1C3D] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Classic
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchMode('ai')}
                    className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                      searchMode === 'ai' ? 'bg-white text-[#0B1C3D] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-sky-500" />
                    <span>AI Search</span>
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

            {/* Bottom Navy Section (Exact Match to Image) */}
            <div className="bg-[#0B1C3D] p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isRTL ? 'اعرف القيمة الحقيقية لعقارك' : "Know Your Property's True Value"}
                </h3>
                <p className="text-xs text-slate-300">
                  {isRTL ? 'اكتشف سعر عقارك في دقائق معدودة بالذكاء الاصطناعي.' : 'Discover your latest property value in just a few minutes.'}
                </p>
              </div>

              {/* White Pill Button: Get an Instant valuation */}
              <Link
                to="/valuation/instant"
                className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0B1C3D] text-xs sm:text-sm font-extrabold shadow-sm shrink-0 transition-transform hover:scale-105"
              >
                {isRTL ? 'ابدأ التقييم الفوري' : 'Get an Instant valuation'}
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
              ? 'اكتشف أدوات وخدمات قوية صُممت لمساعدتك في الشراء، الإيجار، التقييم، التمويل العقاري وإدارة عقارك بكل ثقة.'
              : 'Discover powerful tools and services designed to help you buy, rent, value, mortgage, and manage property with confidence.'}
          </p>
        </div>

        {/* 2x2 Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: Instant & Professional Valuation */}
          <Link
            to="/valuation/instant"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 group text-left"
          >
            <div className="w-full sm:w-56 md:w-64 h-44 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                alt="Instant & Professional Valuation"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors">
                {isRTL ? 'التقييم الفوري والمعتمد' : 'Instant & Professional Valuation'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'تقدير فوري لسعر عقارك أو طلب تقرير معاينة وفحص هندسي معتمد — في أي وقت.'
                  : 'Instant property estimates or certified professional valuations — whenever you need them.'}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors pt-1">
                <span>{isRTL ? 'ابدأ الآن' : 'Start'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          </Link>

          {/* Card 2: AI Property Search */}
          <Link
            to="/help-me-choose"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 group text-left"
          >
            <div className="w-full sm:w-56 md:w-64 h-44 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
                alt="AI Property Search"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors">
                {isRTL ? 'البحث الذكي بالذكاء الاصطناعي' : 'AI Property Search'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'صف ما تبحث عنه باللغة الطبيعية ودع الذكاء الاصطناعي يجد العقار والمشروع المثالي لك.'
                  : "Describe what you're looking for in natural language and let AI find the perfect match."}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 group-hover:text-sky-600 transition-colors pt-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>{isRTL ? 'استكشف البحث الذكي' : 'AI Search available'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          </Link>

          {/* Card 3: Smart Map Search */}
          <Link
            to="/search?view=map"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 group text-left"
          >
            <div className="w-full sm:w-56 md:w-64 h-44 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                alt="Smart Map Search"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors">
                {isRTL ? 'البحث الذكي بالخريطة' : 'Smart Map Search'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'حدد نطاق بحثك على الخريطة واكتشف العقارات المتاحة في الأماكن التي تريد السكن فيها.'
                  : 'Draw your search area on the map and discover properties exactly where you want to live.'}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors pt-1">
                <span>{isRTL ? 'استكشف بحث الخريطة' : 'Explore Map Search'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          </Link>

          {/* Card 4: Mortgage Solutions */}
          <Link
            to="/mortgage/calculator"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 group text-left"
          >
            <div className="w-full sm:w-56 md:w-64 h-44 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
                alt="Mortgage Solutions"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors">
                {isRTL ? 'حلول التمويل العقاري' : 'Mortgage Solutions'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'قارن خيارات التمويل، قدم عبر البنوك المعتمدة، واحسب قسطك الشهري بدقة.'
                  : 'Compare financing options, apply through trusted banks, and estimate your monthly mortgage payments.'}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1C3D] group-hover:text-sky-600 transition-colors pt-1">
                <span>{isRTL ? 'استكشف التمويل العقاري' : 'Explore Mortgage'}</span>
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
          <Link to="/valuation" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
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
              {isRTL ? 'المنصة الأكثر شفافية ودقة في التقييم والتمويل العقاري في مصر' : 'Empowering buyers, sellers, and investors with data-driven real estate intelligence'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C3D]">
                {isRTL ? 'تقييم ذكي فوري بدقة 95%+' : 'Instant AI Property Valuation'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRTL ? 'حساب دقيق للقيمة السوقية وسعر المتر بناءً على صفقات حقيقية في كمبوندات التجمع وزايد والساحل.' : 'Statistical pricing engine benchmarking live transaction prices across 150+ Egyptian compounds.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white text-[#0B1C3D]">
                {isRTL ? 'معاينة وفحص هندسي معتمد' : 'Certified On-Site Due Diligence'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRTL ? 'إمكانية حجز خبير تقييم معتمد لفحص الحالة الإنشائية والأوراق القانونية وتقديم تقرير رسمي للبنوك.' : 'Accredited structural & legal audit visits delivering bank-approved valuation certificates.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C3D]">
                {isRTL ? 'حلول التمويل العقاري للبنوك' : 'Integrated Egyptian Mortgage Hub'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRTL ? 'حاسبة فورية ومقارنة بين بنوك CIB والأهلي وبنك مصر مع استخراج الموافقة المسبقة في خطوات بسيطة.' : 'Direct installment calculators and rate comparisons across leading Egyptian commercial banks.'}
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
            {isRTL ? 'إجابات على أهم الاستفسارات حول التقييم والشراء والتمويل العقاري' : 'Everything you need to know about valuations, discovery & mortgages'}
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
          6. FLOATING ACTION BUTTONS (Exact Match to Image)
          - Green WhatsApp Button
          - "✨ Ask AI" Pill Button
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

        {/* "✨ Ask AI" Floating Pill Button */}
        <Link
          to="/help-me-choose"
          className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-[#0B1C3D] font-bold text-xs shadow-xl border border-slate-200 flex items-center gap-1.5 transition-transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span>Ask AI</span>
        </Link>

      </div>

    </div>
  );
}
