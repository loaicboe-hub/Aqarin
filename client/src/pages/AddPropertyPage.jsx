import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Building2, 
  MapPin, 
  DollarSign, 
  Layers, 
  Image 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { createProperty } from '../services/api';

export default function AddPropertyPage() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setFormData] = useState({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    purpose: 'sale',
    category: 'residential',
    property_type: 'apartment',
    price: '',
    area_sqm: '',
    bedrooms: 3,
    bathrooms: 2,
    floor_level: 2,
    finishing_type: 'fully_finished',
    delivery_status: 'ready',
    delivery_year: 2026,
    payment_type: 'installments',
    down_payment: '',
    installment_years: 6,
    monthly_installment: '',
    city: 'Cairo',
    district: 'New Cairo',
    compound: 'Mivida',
    address: '',
    lat: 30.0167,
    lng: 31.4833,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['24/7 Security', 'Underground Parking', 'Elevator']
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  const updateField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (idx) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        titleEn: form.title_en,
        titleAr: form.title_ar || form.title_en,
        descriptionEn: form.description_en,
        descriptionAr: form.description_ar || form.description_en,
        propertyType: form.property_type,
        price: Number(form.price),
        areaSqm: Number(form.area_sqm),
        downPayment: Number(form.down_payment || 0),
        monthlyInstallment: Number(form.monthly_installment || 0),
        installmentYears: Number(form.installment_years || 0),
        finishingType: form.finishing_type,
        deliveryStatus: form.delivery_status
      };

      const res = await createProperty(payload);
      setLoading(false);
      navigate(`/property/${res.propertyId || res.id || 1}`);
    } catch (err) {
      setLoading(false);
      alert('Error creating listing: ' + err.message);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>{isRTL ? 'إضافة عقار مجاناً' : 'List Property For Free'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1C3D]">
            {isRTL ? 'انشر إعلان عقارك واصل للمشترين المباشرين' : 'Publish Your Property Listing'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            {isRTL 
              ? 'سجل مواصفات وحدتك وسيتم فحصها ونشرها فوراً على خريطة ومحرك بحث عقار إن (AQAR IN).'
              : 'Fill in your property specifications to publish it immediately on Egypt\'s premier AQAR IN intelligence network.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>{isRTL ? '1. البيانات الأساسية' : '1. Basic Information'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'عنوان الإعلان (بالإنجليزية)' : 'Title (English)'}</label>
                <input
                  type="text"
                  required
                  value={form.title_en}
                  onChange={(e) => updateField('title_en', e.target.value)}
                  placeholder="e.g. Modern 3BR Apartment in Mivida"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'عنوان الإعلان (بالعربية)' : 'Title (Arabic)'}</label>
                <input
                  type="text"
                  required
                  value={form.title_ar}
                  onChange={(e) => updateField('title_ar', e.target.value)}
                  placeholder="مثال: شقة فاخرة 3 غرف في ميفيدا"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#0B1C3D] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'الغرض' : 'Purpose'}</label>
                <select
                  value={form.purpose}
                  onChange={(e) => updateField('purpose', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  <option value="sale">For Sale (بيع)</option>
                  <option value="rent">For Rent (إيجار)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'القسم' : 'Category'}</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  <option value="residential">Residential (سكني)</option>
                  <option value="commercial">Commercial (تجاري/إداري)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'نوع العقار' : 'Property Type'}</label>
                <select
                  value={form.property_type}
                  onChange={(e) => updateField('property_type', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  <option value="apartment">Apartment (شقة)</option>
                  <option value="villa">Villa (فيلا)</option>
                  <option value="twin_house">Twin House</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="duplex">Duplex</option>
                  <option value="chalet">Chalet</option>
                  <option value="office">Office</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Specs */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>{isRTL ? '2. السعر والمواصفات' : '2. Pricing & Specs'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'السعر المطلوب (جنيه)' : 'Price (EGP)'}</label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="8500000"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'المساحة (م²)' : 'Area (SQM)'}</label>
                <input
                  type="number"
                  required
                  value={form.area_sqm}
                  onChange={(e) => updateField('area_sqm', e.target.value)}
                  placeholder="175"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'نوع التشطيب' : 'Finishing'}</label>
                <select
                  value={form.finishing_type}
                  onChange={(e) => updateField('finishing_type', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  <option value="fully_finished">Fully Finished (تشطيب كامل)</option>
                  <option value="ultra_lux">Ultra Lux (الترا سوبر لوكس)</option>
                  <option value="semi_finished">Semi-Finished (نصف تشطيب)</option>
                  <option value="core_shell">Core & Shell (طوب أحمر/محارة)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'غرف النوم' : 'Bedrooms'}</label>
                <select
                  value={form.bedrooms}
                  onChange={(e) => updateField('bedrooms', Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Beds</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'الحمامات' : 'Bathrooms'}</label>
                <select
                  value={form.bathrooms}
                  onChange={(e) => updateField('bathrooms', Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Baths</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'طريقة السداد' : 'Payment Type'}</label>
                <select
                  value={form.payment_type}
                  onChange={(e) => updateField('payment_type', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  <option value="installments">Installments (تقسيط)</option>
                  <option value="cash">Cash (كاش)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{isRTL ? '3. الموقع' : '3. Location'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'المدينة' : 'City'}</label>
                <select
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                >
                  <option value="Cairo">Cairo (القاهرة)</option>
                  <option value="Giza">Giza (الجيزة)</option>
                  <option value="Matrouh">North Coast (الساحل الشمالي)</option>
                  <option value="Red Sea">El Gouna (الجونة)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'المنطقة' : 'District'}</label>
                <input
                  type="text"
                  required
                  value={form.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="New Cairo"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'الكمبوند' : 'Compound'}</label>
                <input
                  type="text"
                  value={form.compound}
                  onChange={(e) => updateField('compound', e.target.value)}
                  placeholder="Mivida"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#0B1C3D] hover:bg-[#122B5C] text-white font-bold text-sm shadow-md transition-all"
          >
            {loading ? (isRTL ? 'جاري النشر...' : 'Publishing...') : (isRTL ? 'نشر العقار الآن على المنصة' : 'Publish Property Listing')}
          </button>

        </form>

      </div>
    </div>
  );
}
