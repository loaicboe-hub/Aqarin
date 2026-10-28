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
  DollarSign,
  AlertCircle,
  Inbox,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AdminDashboardPage() {
  const { isRTL } = useLanguage();
  const [stats, setStats] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [savingId, setSavingId] = useState(null);

  // Load real administrative metrics & benchmarks from PostgreSQL API
  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, benchRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/benchmarks')
        ]);

        if (!statsRes.ok) throw new Error(`Stats API error (${statsRes.status})`);
        if (!benchRes.ok) throw new Error(`Benchmarks API error (${benchRes.status})`);

        const statsData = await statsRes.json();
        const benchData = await benchRes.json();

        if (statsData.success) {
          setStats(statsData.stats);
        } else {
          throw new Error(statsData.message || 'Failed to load stats');
        }

        if (benchData.success) {
          setBenchmarks(benchData.data || []);
        } else {
          throw new Error(benchData.message || 'Failed to load benchmarks');
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleSaveBenchmark = async (id) => {
    setSavingId(id);
    try {
      const benchmark = benchmarks.find(b => b.id === id);
      const res = await fetch(`/api/admin/benchmarks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avg_price_sqm: Number(editPrice),
          min_price_sqm: Math.round(Number(editPrice) * 0.88),
          max_price_sqm: Math.round(Number(editPrice) * 1.25),
          rental_yield_pct: Number(benchmark.rental_yield_pct),
          annual_growth_pct: Number(benchmark.annual_growth_pct)
        })
      });

      if (!res.ok) throw new Error('Failed to update benchmark price');
      
      setBenchmarks(prev => prev.map(b => b.id === id ? { ...b, avg_price_sqm: Number(editPrice) } : b));
      setEditingId(null);
    } catch (err) {
      alert(`Error updating benchmark: ${err.message}`);
    } finally {
      setSavingId(null);
    }
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
            <span>{isRTL ? 'قاعدة بيانات PostgreSQL 16 + PostGIS متصلة' : 'PostgreSQL 16 + PostGIS Active'}</span>
          </span>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">{isRTL ? 'خطأ في تحميل بيانات الإدارة' : 'Failed to connect to administrative data'}</p>
              <p className="text-xs text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {/* Real Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500">{isRTL ? 'العقارات النشطة' : 'Active Properties'}</span>
            <p className="text-2xl font-black text-[#0B1C3D] mt-1">
              {loading ? '...' : (stats?.totalProperties ?? 0)}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">100% Live DB</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500">{isRTL ? 'المستخدمين' : 'Registered Users'}</span>
            <p className="text-2xl font-black text-purple-600 mt-1">
              {loading ? '...' : (stats?.totalUsers ?? 0)}
            </p>
            <span className="text-[10px] text-purple-600 font-bold">Verified Accounts</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500">{isRTL ? 'التقييمات الذكية' : 'AI Valuations'}</span>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {loading ? '...' : (stats?.totalValuations ?? 0)}
            </p>
            <span className="text-[10px] text-amber-600 font-bold">PostgreSQL Logs</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500">{isRTL ? 'التمويل العقاري' : 'Mortgage Leads'}</span>
            <p className="text-2xl font-black text-sky-600 mt-1">
              {loading ? '...' : (stats?.totalMortgageInquiries ?? 0)}
            </p>
            <span className="text-[10px] text-sky-600 font-bold">Bank Applications</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500">{isRTL ? 'الاستفسارات' : 'Property Leads'}</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">
              {loading ? '...' : (stats?.totalLeads ?? 0)}
            </p>
            <span className="text-[10px] text-indigo-600 font-bold">Direct Buyer Leads</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500">{isRTL ? 'طلبات البيع السريع' : 'Fast Sell Deals'}</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {loading ? '...' : (stats?.totalFastSellRequests ?? 0)}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">Cash Liquidity Deals</span>
          </div>
        </div>

        {/* Benchmark Pricing Control Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-[#0B1C3D] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-600" />
                <span>{isRTL ? 'مؤشرات أسعار المتر الحية (قاعدة بيانات PostgreSQL)' : 'Live AI Benchmark Pricing by District (PostgreSQL)'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRTL ? 'تعديل متوسط سعر المتر ينعكس فوراً في قاعدة البيانات وعلى نتائج حاسبة التقييم.' : 'Updating benchmark price saves to PostgreSQL and immediately recalibrates AI valuation output across Egypt.'}
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
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-400 font-bold">
                      Loading benchmarks from PostgreSQL...
                    </td>
                  </tr>
                ) : benchmarks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-400 font-bold">
                      No location benchmarks found in database.
                    </td>
                  </tr>
                ) : (
                  benchmarks.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-[#0B1C3D]">
                        {isRTL ? b.district_ar : b.district_en}
                        {b.compound_en && <span className="block text-[10px] text-slate-400">{b.compound_en}</span>}
                      </td>
                      <td className="p-3.5 text-slate-500">{isRTL ? b.city_ar : b.city_en}</td>
                      <td className="p-3.5">
                        {editingId === b.id ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-28 p-1.5 rounded-lg bg-white border border-[#0B1C3D] text-slate-900 font-bold text-xs"
                          />
                        ) : (
                          <span className="font-extrabold text-[#0B1C3D]">{formatEGP(b.avg_price_sqm)} EGP/m²</span>
                        )}
                      </td>
                      <td className="p-3.5 text-emerald-600 font-bold">{b.rental_yield_pct}%</td>
                      <td className="p-3.5 text-sky-700 font-bold">+{b.annual_growth_pct}%</td>
                      <td className="p-3.5 text-right">
                        {editingId === b.id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveBenchmark(b.id)}
                              disabled={savingId === b.id}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold disabled:opacity-50"
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
                            onClick={() => { setEditingId(b.id); setEditPrice(b.avg_price_sqm); }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0B1C3D] text-xs font-bold inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
