import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid, 
  Map as MapIcon, 
  X 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchProperties } from '../services/api';
import PropertyCard from '../components/common/PropertyCard';
import PropertyMap from '../components/map/PropertyMap';

export default function SearchPage() {
  const { isRTL } = useLanguage();
  const [searchParams] = useSearchParams();

  // Filters State
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'sale');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'all');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [developer, setDeveloper] = useState(searchParams.get('developer') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'all');
  const [finishing, setFinishing] = useState(searchParams.get('finishing') || 'all');
  const [sort, setSort] = useState('featured');

  const [viewMode, setViewMode] = useState(searchParams.get('view') === 'map' ? 'split' : 'grid');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchProperties({
      purpose: purpose === 'all' ? undefined : purpose,
      category: category === 'all' ? undefined : category,
      propertyType: propertyType === 'all' ? undefined : propertyType,
      city: city || undefined,
      district: district || undefined,
      developer: developer || undefined,
      search: search || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      bedrooms: bedrooms === 'all' ? undefined : bedrooms,
      finishing: finishing === 'all' ? undefined : finishing,
      sort
    });
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [purpose, category, propertyType, city, district, developer, search, minPrice, maxPrice, bedrooms, finishing, sort]);

  const resetFilters = () => {
    setPurpose('sale');
    setCategory('all');
    setPropertyType('all');
    setCity('');
    setDistrict('');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('all');
    setFinishing('all');
    setSort('featured');
  };

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Controls Bar */}
        <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          
          {/* Purpose Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-slate-200 w-full sm:w-auto overflow-x-auto shadow-sm">
            <button
              onClick={() => setPurpose('sale')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                purpose === 'sale' ? 'bg-[#0B1C3D] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isRTL ? 'للبيع' : 'For Sale'}
            </button>
            <button
              onClick={() => setPurpose('rent')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                purpose === 'rent' ? 'bg-[#0B1C3D] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isRTL ? 'للإيجار' : 'For Rent'}
            </button>
            <button
              onClick={() => { setCategory('commercial'); setPurpose('all'); }}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                category === 'commercial' ? 'bg-[#0B1C3D] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isRTL ? 'تجاري وإداري' : 'Commercial'}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRTL ? 'ابحث بالكمبوند أو المنطقة...' : 'Search compound or district...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:border-[#0B1C3D] outline-none shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Switcher (Grid vs Map) */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-[#0B1C3D] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>{isRTL ? 'شبكة' : 'Grid'}</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'split' ? 'bg-[#0B1C3D] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>{isRTL ? 'خريطة' : 'Map'}</span>
            </button>
          </div>

        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Filters Sidebar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-sky-600" />
                {isRTL ? 'تصفية النتائج' : 'Filter Properties'}
              </span>
              <button onClick={resetFilters} className="text-[11px] text-sky-600 font-bold hover:underline">
                {isRTL ? 'إعادة ضبط' : 'Reset All'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">{isRTL ? 'نوع العقار' : 'Property Type'}</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
              >
                <option value="all">{isRTL ? 'جميع الأنواع' : 'All Types'}</option>
                <option value="apartment">{isRTL ? 'شقة' : 'Apartment'}</option>
                <option value="villa">{isRTL ? 'فيلا مستقلة' : 'Villa'}</option>
                <option value="twin_house">{isRTL ? 'توين هاوس' : 'Twin House'}</option>
                <option value="townhouse">{isRTL ? 'تاون هاوس' : 'Townhouse'}</option>
                <option value="chalet">{isRTL ? 'شاليه' : 'Chalet'}</option>
                <option value="penthouse">{isRTL ? 'بنتهاوس' : 'Penthouse'}</option>
                <option value="office">{isRTL ? 'مكتب إداري' : 'Office'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">{isRTL ? 'عدد الغرف' : 'Bedrooms'}</label>
              <div className="grid grid-cols-5 gap-1">
                {['all', '1', '2', '3', '4+'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBedrooms(b === '4+' ? '4' : b)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      (bedrooms === b || (b === '4+' && bedrooms === '4'))
                        ? 'bg-[#0B1C3D] text-white border-[#0B1C3D]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {b === 'all' ? (isRTL ? 'الكل' : 'All') : b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">{isRTL ? 'السعر (جنيه مصري)' : 'Price Range (EGP)'}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Results List / Split View */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-bold">
                {isRTL ? `تم العثور على ${properties.length} عقار` : `Found ${properties.length} matching properties`}
              </p>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:border-[#0B1C3D] outline-none"
              >
                <option value="featured">{isRTL ? 'المميزة أولاً' : 'Featured First'}</option>
                <option value="price_asc">{isRTL ? 'السعر: الأقل أولاً' : 'Price: Low to High'}</option>
                <option value="price_desc">{isRTL ? 'السعر: الأعلى أولاً' : 'Price: High to Low'}</option>
                <option value="rating_desc">{isRTL ? 'أعلى مؤشر عقار (Aqar Score)' : 'Highest Aqar Score'}</option>
              </select>
            </div>

            {viewMode === 'split' ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[720px]">
                <div className="overflow-y-auto space-y-4 pr-1">
                  {properties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>

                <div className="h-full rounded-3xl overflow-hidden sticky top-24 border border-slate-200 shadow-md">
                  <PropertyMap
                    properties={properties}
                    selectedProperty={selectedProperty}
                    onSelectProperty={(p) => setSelectedProperty(p)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
