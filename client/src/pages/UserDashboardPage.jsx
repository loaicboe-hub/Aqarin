import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Heart, 
  Building2, 
  Clock, 
  ArrowRight, 
  Trash2, 
  PlusCircle, 
  Zap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getFavorites, fetchProperties } from '../services/api';
import PropertyCard from '../components/common/PropertyCard';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { isRTL } = useLanguage();

  const [favoriteProps, setFavoriteProps] = useState([]);

  useEffect(() => {
    const favIds = getFavorites();
    fetchProperties().then(all => {
      setFavoriteProps(all.filter(p => favIds.includes(p.id)));
    });
  }, []);

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
              to="/fast-sell"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0B1C3D] font-black text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{isRTL ? 'بيع كاش فوري' : 'Fast Sell'}</span>
            </Link>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <div className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#0B1C3D] text-white shadow-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>{isRTL ? `العقارات المحفوظة (${favoriteProps.length})` : `Saved Properties (${favoriteProps.length})`}</span>
          </div>
        </div>

        {/* Saved Properties Content */}
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

      </div>
    </div>
  );
}

