import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  Sparkles, 
  Heart, 
  PhoneCall, 
  MessageSquareShare, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  User,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchPropertyById, toggleFavorite, getFavorites } from '../services/api';
import PropertyMap from '../components/map/PropertyMap';
import PropertyCard from '../components/common/PropertyCard';

export default function PropertyDetailsPage() {
  const { isRTL } = useLanguage();
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lead modal state
  const [leadModal, setLeadModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPropertyById(id).then(({ property, similar }) => {
      setProperty(property);
      setSimilar(similar || []);
      setIsFav(getFavorites().includes(property?.id));
      setActiveImage(0);
      setLoading(false);
    });
  }, [id]);

  if (loading || !property) {
    return (
      <div className="bg-white min-h-screen py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#0B1C3D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm font-semibold">{isRTL ? 'جاري تحميل تفاصيل العقار...' : 'Loading property details...'}</p>
      </div>
    );
  }

  const formatEGP = (num) => new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(num || 0);
  const pricePerSqm = Math.round(property.price / Math.max(1, property.areaSqm));

  const handleFavorite = () => {
    const updated = toggleFavorite(property.id);
    setIsFav(updated.includes(property.id));
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    setLeadSubmitted(true);
    setTimeout(() => {
      setLeadModal(false);
      setLeadSubmitted(false);
    }, 2000);
  };

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                property.purpose === 'rent' ? 'bg-amber-400 text-slate-950' : 'bg-[#0B1C3D] text-white'
              }`}>
                {property.purpose === 'rent' ? (isRTL ? 'للإيجار' : 'For Rent') : (isRTL ? 'للبيع' : 'For Sale')}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-[#0B1C3D] capitalize">
                {property.propertyType}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aqar Score: {property.aqarScore || '9.4'}/10</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#0B1C3D]">
              {isRTL ? property.titleAr : property.titleEn}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>{property.address || `${property.compound ? property.compound + ', ' : ''}${property.district}, ${property.city}`}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left lg:text-right">
              <p className="text-xs text-slate-500 font-medium">{isRTL ? 'السعر' : 'Asking Price'}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#0B1C3D] tracking-tight">
                  {formatEGP(property.price)}
                </span>
                <span className="text-sm font-bold text-sky-600">{isRTL ? 'ج.م' : 'EGP'}</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {formatEGP(pricePerSqm)} {isRTL ? 'ج.م / م²' : 'EGP / SQM'}
              </p>
            </div>

            <button
              onClick={handleFavorite}
              className={`p-3 rounded-full border transition-all ${
                isFav ? 'bg-rose-500 text-white border-rose-500 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative h-[360px] sm:h-[480px] w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
            <img
              src={property.images?.[activeImage] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
              alt={property.titleEn}
              className="w-full h-full object-cover"
            />
          </div>

          {property.images && property.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-24 h-16 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === idx ? 'border-[#0B1C3D] scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Specs Matrix */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] mb-4">
                {isRTL ? 'مواصفات وتفاصيل العقار' : 'Key Specifications'}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-slate-500 flex items-center gap-1 mb-1">
                    <Maximize2 className="w-4 h-4 text-sky-600" />
                    {isRTL ? 'المساحة' : 'Area'}
                  </span>
                  <p className="text-base font-black text-[#0B1C3D]">{property.areaSqm} m²</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-slate-500 flex items-center gap-1 mb-1">
                    <Bed className="w-4 h-4 text-sky-600" />
                    {isRTL ? 'غرف النوم' : 'Bedrooms'}
                  </span>
                  <p className="text-base font-black text-[#0B1C3D]">{property.bedrooms} Beds</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-slate-500 flex items-center gap-1 mb-1">
                    <Bath className="w-4 h-4 text-sky-600" />
                    {isRTL ? 'الحمامات' : 'Bathrooms'}
                  </span>
                  <p className="text-base font-black text-[#0B1C3D]">{property.bathrooms} Baths</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-slate-500 flex items-center gap-1 mb-1">
                    <Layers className="w-4 h-4 text-sky-600" />
                    {isRTL ? 'التشطيب' : 'Finishing'}
                  </span>
                  <p className="text-xs font-black text-[#0B1C3D] capitalize">{property.finishingType?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-[#0B1C3D]">
                {isRTL ? 'وصف العقار' : 'Property Description'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {isRTL ? (property.descriptionAr || property.descriptionEn) : property.descriptionEn}
              </p>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>{isRTL ? 'الموقع على الخريطة' : 'Location Map'}</span>
              </h3>
              <div className="h-72 w-full rounded-2xl overflow-hidden border border-slate-200">
                <PropertyMap properties={[property]} center={[property.lat || 30.0444, property.lng || 31.2357]} zoom={13} />
              </div>
            </div>

          </div>

          {/* Right Sidebar: Contact */}
          <div className="space-y-6 sticky top-24">
            
            {/* Contact Box */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full bg-[#0B1C3D] text-white flex items-center justify-center font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#0B1C3D]">{property.owner?.name || (isRTL ? 'وكيل عقار إن المعتمد' : 'AQAR IN Verified Agent')}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isRTL ? 'بائع موثق' : 'Verified Seller'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`https://wa.me/201012345678?text=Hello,%20I%20am%20interested%20in%20property%20ID%20${property.id}:%20${encodeURIComponent(property.titleEn)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageSquareShare className="w-4 h-4" />
                  <span>{isRTL ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</span>
                </a>

                <a
                  href="tel:+201012345678"
                  className="w-full py-3 rounded-full bg-slate-200 hover:bg-slate-300 text-[#0B1C3D] font-bold text-xs text-center flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{isRTL ? 'اتصال هاتفي' : 'Call Directly'}</span>
                </a>

                <button
                  onClick={() => setLeadModal(true)}
                  className="w-full py-3 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white font-bold text-xs text-center transition-all"
                >
                  {isRTL ? 'طلب معاينة الوحدة' : 'Book Property Viewing'}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <h3 className="text-xl font-bold text-[#0B1C3D]">
              {isRTL ? 'عقارات مماثلة في نفس المنطقة' : 'Similar Properties in Same Area'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
