import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Eye
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { calculateInstantValuation } from '../services/api';
import { EGYPT_LOCATIONS } from '../data/mockData';

export default function InstantValuationWizard() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    city: 'Cairo',
    district: 'New Cairo',
    compound: 'Mivida',
    propertyType: 'apartment',
    areaSqm: 165,
    bedrooms: 3,
    bathrooms: 2,
    finishing: 'fully_finished',
    floorLevel: 2,
    viewType: 'Garden',
    hasGarden: false,
    hasRoof: false,
    deliveryYear: 2026
  });

  const selectedCityData = EGYPT_LOCATIONS.find(c => c.cityEn === formData.city) || EGYPT_LOCATIONS[0];
  const selectedDistrictData = selectedCityData.districts.find(d => d.nameEn === formData.district) || selectedCityData.districts[0];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCityChange = (cityEn) => {
    const cityObj = EGYPT_LOCATIONS.find(c => c.cityEn === cityEn);
    const firstDistrict = cityObj?.districts[0];
    setFormData(prev => ({
      ...prev,
      city: cityEn,
      district: firstDistrict?.nameEn || '',
      compound: firstDistrict?.compounds[0] || ''
    }));
  };

  const handleDistrictChange = (districtEn) => {
    const distObj = selectedCityData.districts.find(d => d.nameEn === districtEn);
    setFormData(prev => ({
      ...prev,
      district: districtEn,
      compound: distObj?.compounds[0] || ''
    }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const result = await calculateInstantValuation(formData);
      setTimeout(() => {
        setLoading(false);
        navigate(`/valuation/result/${result.valuationCode}`, { state: { valuation: result } });
      }, 1000);
    } catch (err) {
      setLoading(false);
      alert('Error calculating valuation: ' + err.message);
    }
  };

  const propertyTypes = [
    { id: 'apartment', labelEn: 'Apartment', labelAr: 'شقة سكنية', icon: '🏢' },
    { id: 'villa', labelEn: 'Standalone Villa', labelAr: 'فيلا مستقلة', icon: '🏰' },
    { id: 'twin_house', labelEn: 'Twin House', labelAr: 'توين هاوس', icon: '🏡' },
    { id: 'townhouse', labelEn: 'Townhouse', labelAr: 'تاون هاوس', icon: '🏘️' },
    { id: 'duplex', labelEn: 'Duplex', labelAr: 'دوبلكس', icon: '🏙️' },
    { id: 'penthouse', labelEn: 'Penthouse', labelAr: 'بنتهاوس', icon: '🌆' },
    { id: 'chalet', labelEn: 'Chalet', labelAr: 'شاليه مصيفي', icon: '🏖️' },
    { id: 'office', labelEn: 'Commercial Office', labelAr: 'مكتب إداري', icon: '💼' }
  ];

  const finishingOptions = [
    { id: 'core_shell', labelEn: 'Core & Shell (محارة وطوب)', labelAr: 'طوب أحمر ومحارة', desc: 'No internal finishes' },
    { id: 'semi_finished', labelEn: 'Semi-Finished (نصف تشطيب)', labelAr: 'نصف تشطيب', desc: 'Plastered with basic wiring' },
    { id: 'fully_finished', labelEn: 'Fully Finished (تشطيب كامل)', labelAr: 'تشطيب سوبر لوكس', desc: 'Ready to furnish & live' },
    { id: 'ultra_lux', labelEn: 'Ultra-Lux / Hotel Grade', labelAr: 'الترا سوبر لوكس / فندقي', desc: 'Imported marble, smart automation' },
  ];

  const viewOptions = [
    { id: 'Garden', labelEn: 'Garden / Landscape View', labelAr: 'إطلالة لاندسكيب وحديقة' },
    { id: 'Lagoon', labelEn: 'Crystal Lagoon / Pool View', labelAr: 'إطلالة لاجون ومسبح' },
    { id: 'Golf', labelEn: 'Golf Course View', labelAr: 'إطلالة ملعب جولف' },
    { id: 'Sea', labelEn: 'Direct Seafront View', labelAr: 'إطلالة بحر مباشرة' },
    { id: 'Nile', labelEn: 'Panoramic Nile View', labelAr: 'إطلالة بانوراما على النيل' },
    { id: 'MainStreet', labelEn: 'Main Street / Open City', labelAr: 'شارع رئيسي ومفتوح' },
  ];

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{isRTL ? 'معالج التقييم الفوري الذكي 2026' : 'Instant AI Valuation Wizard 2026'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B1C3D]">
            {isRTL ? 'تقييم دقيق لعقارك في ثوانٍ' : 'Accurate Property Valuation in Seconds'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            {isRTL 
              ? 'حدد بيانات وحدتك بدقة ليقوم الذكاء الاصطناعي بمطابقتها مع مؤشرات السوق الحية للكمبوند والمنطقة.'
              : 'Fill in your property specifications to generate instant market price estimation, rental yields, and comps.'}
          </p>
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
          
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  step === s 
                    ? 'bg-[#0B1C3D] text-white shadow-md scale-110' 
                    : step > s 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${
                  step === s ? 'text-[#0B1C3D]' : 'text-slate-400'
                }`}>
                  {s === 1 && (isRTL ? 'المنطقة والكمبوند' : 'Location')}
                  {s === 2 && (isRTL ? 'النوع والمساحة' : 'Type & Area')}
                  {s === 3 && (isRTL ? 'التشطيب والمواصفات' : 'Finishing & Specs')}
                  {s === 4 && (isRTL ? 'الإطلالة والمميزات' : 'View & Extras')}
                </span>
              </div>
            ))}
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4 text-center p-6">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-300 text-amber-600 flex items-center justify-center animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1C3D]">
                {isRTL ? 'جاري تحليل الصفقات ومؤشرات السوق...' : 'AI Processing Market Intelligence...'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                {isRTL 
                  ? 'نقوم الآن بمطابقة العقار مع أسعار كمبوند ' + (formData.compound || formData.district) + ' وحساب سعر المتر العادل.'
                  : 'Comparing against recent verified transactions for ' + (formData.compound || formData.district) + '.'}
              </p>
            </div>
          )}

          {/* STEP 1: Location & Compound */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#0B1C3D] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                <span>{isRTL ? 'الخطوة 1: أين يقع عقارك؟' : 'Step 1: Where is your property located?'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">{isRTL ? 'المحافظة / المدينة' : 'City / Governorate'}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {EGYPT_LOCATIONS.map((loc) => (
                      <button
                        key={loc.cityEn}
                        type="button"
                        onClick={() => handleCityChange(loc.cityEn)}
                        className={`p-3 rounded-2xl text-xs font-bold text-left border transition-all ${
                          formData.city === loc.cityEn
                            ? 'bg-[#0B1C3D] text-white border-[#0B1C3D] shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isRTL ? loc.cityAr : loc.cityEn}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">{isRTL ? 'المنطقة / الحي' : 'District / Area'}</label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:border-[#0B1C3D] outline-none"
                  >
                    {selectedCityData.districts.map((d) => (
                      <option key={d.nameEn} value={d.nameEn}>
                        {isRTL ? d.nameAr : d.nameEn} (avg {new Intl.NumberFormat().format(d.avgSqm)} EGP/m²)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedDistrictData.compounds && selectedDistrictData.compounds.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    {isRTL ? 'الكمبوند / المشروع' : 'Compound / Project Name'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedDistrictData.compounds.map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => updateField('compound', comp)}
                        className={`p-2.5 rounded-xl text-xs font-bold truncate border transition-all ${
                          formData.compound === comp
                            ? 'bg-[#0B1C3D] text-white border-[#0B1C3D] shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Property Type & Area */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#0B1C3D] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-600" />
                <span>{isRTL ? 'الخطوة 2: نوع العقار والمساحة' : 'Step 2: Property Type & SQM Area'}</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">{isRTL ? 'اختر نوع الوحدة' : 'Select Property Type'}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {propertyTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateField('propertyType', t.id)}
                      className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                        formData.propertyType === t.id
                          ? 'bg-[#0B1C3D] text-white border-[#0B1C3D] shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-xs font-bold">{isRTL ? t.labelAr : t.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">{isRTL ? 'المساحة الإجمالية (م²)' : 'Total Area (SQM)'}</label>
                  <div className="flex items-center gap-1 font-bold text-[#0B1C3D] text-sm">
                    <input
                      type="number"
                      value={formData.areaSqm}
                      onChange={(e) => updateField('areaSqm', Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded-lg bg-white border border-slate-300 text-right font-bold text-sm"
                    />
                    <span className="text-xs">m²</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="30"
                  max="800"
                  step="5"
                  value={formData.areaSqm}
                  onChange={(e) => updateField('areaSqm', Number(e.target.value))}
                  className="w-full accent-[#0B1C3D] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Finishing & Specs */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#0B1C3D] flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-600" />
                <span>{isRTL ? 'الخطوة 3: مستوى التشطيب والغرف' : 'Step 3: Finishing Grade & Specifications'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {finishingOptions.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateField('finishing', f.id)}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      formData.finishing === f.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{isRTL ? f.labelAr : f.labelEn}</p>
                      <p className={`text-[11px] ${formData.finishing === f.id ? 'text-slate-300' : 'text-slate-500'}`}>{f.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'غرف النوم' : 'Bedrooms'}</label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => updateField('bedrooms', Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {isRTL ? 'غرف' : 'Beds'}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'الحمامات' : 'Bathrooms'}</label>
                  <select
                    value={formData.bathrooms}
                    onChange={(e) => updateField('bathrooms', Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {isRTL ? 'حمامات' : 'Baths'}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{isRTL ? 'الدور' : 'Floor Level'}</label>
                  <select
                    value={formData.floorLevel}
                    onChange={(e) => updateField('floorLevel', Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold"
                  >
                    <option value={0}>Ground Floor (أرضي)</option>
                    <option value={1}>1st Floor (أول)</option>
                    <option value={2}>2nd Floor (ثاني)</option>
                    <option value={3}>3rd Floor (ثالث)</option>
                    <option value={4}>4th+ Floor (متكرر)</option>
                    <option value={10}>Penthouse / Roof</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: View & Extras */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#0B1C3D] flex items-center gap-2">
                <Eye className="w-5 h-5 text-sky-600" />
                <span>{isRTL ? 'الخطوة 4: الإطلالة والمميزات الإضافية' : 'Step 4: View & Extra Amenities'}</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {viewOptions.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => updateField('viewType', v.id)}
                    className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition-all ${
                      formData.viewType === v.id
                        ? 'bg-[#0B1C3D] text-white border-[#0B1C3D] shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isRTL ? v.labelAr : v.labelEn}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.hasGarden ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div>
                    <p className="text-xs font-bold">{isRTL ? 'حديقة خاصة (Private Garden)' : 'Private Garden'}</p>
                    <p className="text-[11px] text-slate-500">{isRTL ? 'تزيد من قيمة العقار' : 'Boosts valuation'}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.hasGarden}
                    onChange={(e) => updateField('hasGarden', e.target.checked)}
                    className="w-5 h-5 accent-emerald-600"
                  />
                </label>

                <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.hasRoof ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div>
                    <p className="text-xs font-bold">{isRTL ? 'تراس روف خاص (Private Roof)' : 'Private Roof Terrace'}</p>
                    <p className="text-[11px] text-slate-500">{isRTL ? 'مساحة خارجية إضافية' : 'Extra outdoor living'}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.hasRoof}
                    onChange={(e) => updateField('hasRoof', e.target.checked)}
                    className="w-5 h-5 accent-amber-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isRTL ? 'السابق' : 'Previous'}</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-3 rounded-full text-xs font-extrabold text-white bg-[#0B1C3D] hover:bg-[#122B5C] flex items-center gap-2 shadow-sm"
              >
                <span>{isRTL ? 'التالي' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCalculate}
                className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-black text-white bg-[#0B1C3D] hover:bg-[#122B5C] flex items-center gap-2 shadow-md transition-transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isRTL ? 'احسب التقييم الذكي الفوري ⚡' : 'Calculate Instant Valuation ⚡'}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
