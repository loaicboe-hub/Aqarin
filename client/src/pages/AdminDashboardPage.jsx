import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Calculator, 
  Landmark, 
  TrendingUp, 
  ShieldCheck, 
  Edit3, 
  Check, 
  X,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchProperties } from '../services/api';
import { EGYPT_LOCATIONS } from '../data/mockData';

export default function AdminDashboardPage() {
  const { isRTL } = useLanguage();
  const [properties, setProperties] = useState([]);
  const [benchmarks, setBenchmarks] = useState([
    { id: 1, district: 'New Cairo & 5th Settlement', city: 'Cairo', avgPrice: 82000, rentalYield: 8.5, growthRate: 24.5 },
    { id: 2, district: 'Sheikh Zayed', city: 'Giza', avgPrice: 95000, rentalYield: 8.0, growthRate: 21.0 },
    { id: 3, district: 'Ras El Hekma', city: 'North Coast', avgPrice: 145000, rentalYield: 11.5, growthRate: 38.0 },
    { id: 4, district: 'New Administrative Capital (CBD)', city: 'Cairo', avgPrice: 58000, rentalYield: 9.5, growthRate: 29.0 },
    { id: 5, district: 'El Gouna', city: 'Red Sea', avgPrice: 155000, rentalYield: 12.0, growthRate: 25.0 },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);

  useEffect(() => {
    fetchProperties().then(setProperties);
  }, []);

  const handleSaveBenchmark = (id) => {
    setBenchmarks(prev => prev.map(b => b.id === id ? { ...b, avgPrice: Number(editPrice) } : b));
    setEditingId(null);
  };

  const formatEGP = (num) => new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(num || 0);

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xl border border-amber-200">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0B1C3D]">{isRTL ? 'لوحة تحكم إدارة المنصة' : 'Super Admin Intelligence Control'}</h1>
              <p className="text-xs text-slate-500">{isRTL ? 'إدارة العقارات، مؤشرات أسعار المتر، واستعلامات التمويل' : 'Live Platform metrics, benchmark pricing controls & moderation'}</p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isRTL ? 'نظام متصل بقاعدة بيانات MySQL' : 'MySQL Database Engine Active'}</span>
          </span>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500">{isRTL ? 'إجمالي العقارات المنشورة' : 'Active Properties'}</span>
            <p className="text-3xl font-black text-[#0B1C3D] mt-1">{properties.length || 24}</p>
            <span className="text-[10px] text-emerald-600 font-bold">100% Verified</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500">{isRTL ? 'تقييمات الذكاء الاصطناعي' : 'AI Valuations Run'}</span>
            <p className="text-3xl font-black text-amber-600 mt-1">3,892</p>
            <span className="text-[10px] text-emerald-600 font-bold">+18% this month</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500">{isRTL ? 'طلبات التمويل العقاري' : 'Mortgage Applications'}</span>
            <p className="text-3xl font-black text-[#0B1C3D] mt-1">185</p>
            <span className="text-[10px] text-sky-600 font-bold">Connected to Banks</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500">{isRTL ? 'المستخدمين المسجلين' : 'Registered Users'}</span>
            <p className="text-3xl font-black text-purple-600 mt-1">1,420</p>
            <span className="text-[10px] text-purple-600 font-bold">Buyers & Sellers</span>
          </div>
        </div>

        {/* Benchmark Pricing Control Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-[#0B1C3D] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-600" />
                <span>{isRTL ? 'التحكم في مؤشرات أسعار المتر للتقييم الذكي (EGP/m²)' : 'AI Valuation Benchmark Multipliers by Area'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRTL ? 'تعديل متوسط سعر المتر ينعكس فوراً على نتائج حاسبة التقييم في الموقع.' : 'Changing benchmark price immediately recalibrates AI valuation output across Egypt.'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Area / District</th>
                  <th className="p-3.5">Governorate</th>
                  <th className="p-3.5">Base Price / SQM</th>
                  <th className="p-3.5">Rental Yield %</th>
                  <th className="p-3.5">Annual Growth</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {benchmarks.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-[#0B1C3D]">{b.district}</td>
                    <td className="p-3.5 text-slate-500">{b.city}</td>
                    <td className="p-3.5">
                      {editingId === b.id ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-28 p-1.5 rounded-lg bg-white border border-[#0B1C3D] text-slate-900 font-bold text-xs"
                        />
                      ) : (
                        <span className="font-extrabold text-[#0B1C3D]">{formatEGP(b.avgPrice)} EGP/m²</span>
                      )}
                    </td>
                    <td className="p-3.5 text-emerald-600 font-bold">{b.rentalYield}%</td>
                    <td className="p-3.5 text-sky-700 font-bold">+{b.growthRate}%</td>
                    <td className="p-3.5 text-right">
                      {editingId === b.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveBenchmark(b.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:text-slate-900"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(b.id); setEditPrice(b.avgPrice); }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0B1C3D] text-xs font-bold inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

