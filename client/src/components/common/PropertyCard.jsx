import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  Sparkles, 
  Heart, 
  MessageSquareShare 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { toggleFavorite, getFavorites } from '../../services/api';

export default function PropertyCard({ property }) {
  const { isRTL } = useLanguage();
  const [isFav, setIsFav] = useState(() => getFavorites().includes(property.id));

  const formatEGP = (num) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(num || 0);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleFavorite(property.id);
    setIsFav(updated.includes(property.id));
  };

  const area = property.areaSqm || property.area_sqm || 1;
  const price = property.price || 0;
  const pricePerSqm = Math.round(price / Math.max(1, area));

  const title = isRTL 
    ? (property.titleAr || property.title_ar || '') 
    : (property.titleEn || property.title_en || '');

  return (
    <div className="bg-white rounded-3xl overflow-hidden flex flex-col group relative border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300">
      
      {/* Image & Badges Container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide shadow-sm ${
              property.purpose === 'rent' ? 'bg-amber-400 text-slate-950' : 'bg-[#0B1C3D] text-white'
            }`}>
              {property.purpose === 'rent' ? (isRTL ? 'للإيجار' : 'For Rent') : (isRTL ? 'للبيع' : 'For Sale')}
            </span>
          </div>

          <button
            onClick={handleFavorite}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFav ? 'bg-rose-500 text-white shadow-md' : 'bg-white/80 text-slate-700 hover:text-rose-500 hover:bg-white'
            }`}
            title="Save Property"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Score Badge */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-[#0B1C3D] text-xs font-extrabold shadow-sm backdrop-blur-md">
          <span className="text-[10px] text-emerald-700 font-bold">{isRTL ? 'مؤشر عقار' : 'Aqar Score'}</span>
          <span className="text-emerald-600">{property.aqarScore || property.aqar_score || '9.4'}</span>
          <span className="text-[10px] text-slate-400 font-normal">/10</span>
        </div>

        {/* Location Badge */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-xs text-slate-800 font-bold bg-white/95 px-3 py-1 rounded-full shadow-sm backdrop-blur-md">
          <MapPin className="w-3.5 h-3.5 text-sky-600" />
          <span className="truncate max-w-[150px]">{property.compound ? `${property.compound}, ` : ''}{property.district}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-2xl font-black text-[#0B1C3D] tracking-tight">
                {formatEGP(property.price)}
              </span>
              <span className="text-xs font-bold text-sky-600 ml-1">
                {isRTL ? 'ج.م' : 'EGP'}
              </span>
              {property.purpose === 'rent' && (
                <span className="text-xs text-slate-500">/{isRTL ? 'شهر' : 'mo'}</span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {formatEGP(pricePerSqm)} {isRTL ? 'ج.م/م²' : 'EGP/m²'}
            </span>
          </div>

          {/* Title */}
          <Link to={`/property/${property.id}`} className="block group-hover:text-sky-600 transition-colors">
            <h3 className="text-sm font-bold text-slate-800 line-clamp-1 leading-snug mb-3">
              {title}
            </h3>
          </Link>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-sky-600" />
              <span>{property.bedrooms} {isRTL ? 'غرف' : 'Beds'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-sky-600" />
              <span>{property.bathrooms} {isRTL ? 'حمامات' : 'Baths'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-sky-600" />
              <span>{area} {isRTL ? 'م²' : 'm²'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-2 flex items-center gap-2">
          <Link
            to={`/property/${property.id}`}
            className="flex-1 py-2.5 rounded-xl text-center text-xs font-bold bg-[#0B1C3D] hover:bg-[#122B5C] text-white transition-all shadow-sm"
          >
            {isRTL ? 'عرض التفاصيل' : 'View Details'}
          </Link>

          <a
            href={`https://wa.me/201012345678?text=Hello,%20I%20am%20interested%20in%20property%20ID%20${property.id}:%20${encodeURIComponent(property.titleEn)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 transition-all"
            title="Chat on WhatsApp"
          >
            <MessageSquareShare className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
