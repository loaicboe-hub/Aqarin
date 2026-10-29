import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Building2, 
  MapPin, 
  DollarSign, 
  Layers, 
  Image as ImageIcon,
  UploadCloud,
  X,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { createProperty, uploadPropertyImages } from '../services/api';

export default function AddPropertyPage() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
    images: [],
    amenities: ['24/7 Security', 'Underground Parking', 'Elevator']
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  const updateField = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  // File selection & upload handler (up to 5 images max)
  const handleFilesSelected = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError('');

    const currentCount = form.images.length;
    const availableSlots = 5 - currentCount;

    if (availableSlots <= 0) {
      setUploadError(isRTL ? 'لقد وصلت بالفعل للحد الأقصى (5 صور).' : 'Maximum 5 images allowed per property.');
      return;
    }

    const filesToProcess = Array.from(fileList).slice(0, availableSlots);
    if (fileList.length > availableSlots) {
      setUploadError(isRTL ? `تم قبول أول ${availableSlots} صور فقط للوصول للحد الأقصى المسموح (5 صور).` : `Only ${availableSlots} images accepted to maintain the 5-image limit.`);
    }

    // Validate mime types and sizes
    const validFiles = [];
    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        setUploadError(isRTL ? 'يُسمح برفع ملفات الصور فقط (JPG, PNG, WEBP, AVIF).' : 'Only image files are allowed (JPG, PNG, WEBP, AVIF).');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setUploadError(isRTL ? 'حجم الصورة يجب ألا يتجاوز 15 ميجابايت.' : 'Image file size cannot exceed 15MB.');
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = await uploadPropertyImages(validFiles);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls].slice(0, 5)
      }));
    } catch (err) {
      setUploadError(err.message || (isRTL ? 'فشل رفع الصور، يرجى المحاولة مرة أخرى.' : 'Failed to upload images.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (idx) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
    setUploadError('');
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (form.images.length >= 5) {
      setUploadError(isRTL ? 'الحد الأقصى هو 5 صور.' : 'Maximum 5 images allowed.');
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
    setUploadError('');
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

          {/* Section 4: Property Images (Up to 5 images) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sky-600" />
                  <span>{isRTL ? '4. صور العقار (حتى 5 صور)' : '4. Property Images (Up to 5 photos)'}</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isRTL ? 'ارفع حتى 5 صور عالية الجودة للعقار لإبراز التفاصيل للمشترين.' : 'Upload up to 5 high-resolution photos showcasing interior and exterior features.'}
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                form.images.length === 5 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-sky-50 text-sky-700 border-sky-200'
              }`}>
                {form.images.length} / 5 {isRTL ? 'صور مرفوعة' : 'Images Uploaded'}
              </span>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Drag & Drop Upload Zone (Shown if less than 5 images) */}
            {form.images.length < 5 && (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all
                  ${dragActive 
                    ? 'border-sky-500 bg-sky-50/50 scale-[1.01]' 
                    : 'border-slate-200 hover:border-sky-400 hover:bg-slate-50/50 bg-slate-50/30'}
                  ${uploading ? 'pointer-events-none opacity-60' : ''}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif,image/jpg"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />

                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-sky-600">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-sky-600" />
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {uploading 
                      ? (isRTL ? 'جاري رفع الصور ومعالجتها...' : 'Uploading and optimizing photos...')
                      : (isRTL ? 'اضغط لاختيار الصور أو اسحبها وأفلتها هنا' : 'Click to upload photos or drag & drop here')}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {isRTL 
                      ? `يمكنك رفع حتى ${5 - form.images.length} صور إضافية (PNG, JPG, WEBP بحد أقصى 15MB لكل صورة)` 
                      : `You can add up to ${5 - form.images.length} more images (PNG, JPG, WEBP up to 15MB each)`}
                  </p>
                </div>
              </div>
            )}

            {/* Uploaded Images Preview Grid */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                {form.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-2xs hover:shadow-md transition-all"
                  >
                    <img
                      src={imgUrl}
                      alt={`Property image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Image Order Badge */}
                    <span className={`absolute top-1.5 start-1.5 px-1.5 py-0.5 rounded text-[10px] font-black ${
                      idx === 0 ? 'bg-[#0B1C3D] text-white shadow-xs' : 'bg-slate-900/70 text-white backdrop-blur-xs'
                    }`}>
                      {idx === 0 ? (isRTL ? 'الرئيسية ★' : 'Main ★') : `#${idx + 1}`}
                    </span>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute top-1.5 end-1.5 p-1 rounded-full bg-rose-600 text-white opacity-90 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-xs"
                      title={isRTL ? 'حذف الصورة' : 'Remove photo'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Optional URL Adder Fallback */}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder={isRTL ? 'أو أدخل رابط صورة مباشر (https://...)' : 'Or paste a direct image URL (https://...)'}
                  className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold placeholder:text-slate-400"
                  disabled={form.images.length >= 5}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={!imageUrlInput.trim() || form.images.length >= 5}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold transition-colors shrink-0"
                >
                  {isRTL ? 'إضافة رابط' : 'Add URL'}
                </button>
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
