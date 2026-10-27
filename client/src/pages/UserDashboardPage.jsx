import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Heart, 
  Calculator, 
  Building2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Trash2, 
  PlusCircle, 
  Landmark 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getFavorites, getSavedValuations, fetchProperties } from '../services/api';
import PropertyCard from '../components/common/PropertyCard';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState('favorites');
  const [favoriteProps, setFavoriteProps] = useState([]);
  const [savedValuations, setSavedValuations] = useState([]);

  useEffect(() => {
    const favIds = getFavorites();
    fetchProperties().then(all => {
      setFavoriteProps(all.filter(p => favIds.includes(p.id)));
    });
    setSavedValuations(getSavedValuations());
  }, []);

  const formatEGP = (num) => new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(num || 0);

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-[#0B1C3D] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-2xl border border-white/20">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {isRTL ? `أهلاً بك، ${user?.fullName || 'عزيزي المستخدم'}` : `Welcome, ${user?.fullName || 'User'}`}
              </h1>
              <p className="text-xs text-slate-300">
                {user?.email || 'Logged in account'} • {user?.role || 'Buyer / Investor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/add-property"
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isRTL ? 'إضافة عقار جديد' : 'List Property'}</span>
            </Link>
            <Link
              to="/valuation/instant"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0B1C3D] font-black text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#0B1C3D]" />
              <span>{isRTL ? 'تقييم فوري' : 'New Valuation'}</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'favorites' ? 'bg-[#0B1C3D] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{isRTL ? `العقارات المحفوظة (${favoriteProps.length})` : `Saved Properties (${favoriteProps.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('valuations')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'valuations' ? 'bg-[#0B1C3D] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{isRTL ? `سجل التقييمات الذكية (${savedValuations.length})` : `Valuation History (${savedValuations.length})`}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteProps.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-12 text-center space-y-4 border border-slate-200">
                <Heart className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-slate-500 text-xs">{isRTL ? 'لم تقم بحفظ أي عقارات بعد.' : 'No saved properties yet.'}</p>
                <Link to="/buy" className="inline-block px-6 py-2.5 bg-[#0B1C3D] text-white rounded-full font-bold text-xs shadow-sm">
                  {isRTL ? 'تصفح العقارات الآن' : 'Browse Properties'}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProps.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'valuations' && (
          <div className="space-y-4">
            {savedValuations.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-12 text-center space-y-4 border border-slate-200">
                <Calculator className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-slate-500 text-xs">{isRTL ? 'لا يوجد تقييمات محفوظة.' : 'No valuation reports yet.'}</p>
                <Link to="/valuation/instant" className="inline-block px-6 py-2.5 bg-[#0B1C3D] text-white rounded-full font-bold text-xs shadow-sm">
                  {isRTL ? 'احسب أول تقييم لعقارك' : 'Run First AI Valuation'}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedValuations.map((val, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-slate-100 text-[#0B1C3D] px-2 py-0.5 rounded">{val.valuationCode || 'VAL-REPORT'}</span>
                      <span className="text-[11px] font-semibold text-slate-500">{val.areaSqm} m² • {val.specs?.propertyType || 'Apartment'}</span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-500">{val.specs?.compound ? `${val.specs.compound}, ` : ''}{val.specs?.district || 'New Cairo'}</span>
                      <p className="text-xl font-black text-[#0B1C3D] mt-0.5">{formatEGP(val.midEstimate)} EGP</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-emerald-600 font-bold">{formatEGP(val.pricePerSqm)} EGP/m²</span>
                      <Link
                        to={`/valuation/result/${val.valuationCode}`}
                        state={{ valuation: val }}
                        className="text-xs font-bold text-[#0B1C3D] hover:underline flex items-center gap-1"
                      >
                        <span>{isRTL ? 'عرض الشهادة' : 'View Report'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

