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
  Zap,
  ArrowLeftRight,
  Briefcase,
  Paintbrush,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getFavorites, fetchProperties, fetchUserProperties, fetchUserSubmissions } from '../services/api';
import PropertyCard from '../components/common/PropertyCard';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'saved' | 'submissions'
  const [favoriteProps, setFavoriteProps] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [mySubmissions, setMySubmissions] = useState({
    fastSell: [],
    exchange: [],
    management: [],
    finishing: []
  });
  const [loading, setLoading] = useState(true);

  const formatEGP = (num) => new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(num || 0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadDashboardData = async () => {
      try {
        const favIds = getFavorites();
        const [allProps, userProps, userSubs] = await Promise.all([
          fetchProperties().catch(() => []),
          user?.id ? fetchUserProperties(user.id).catch(() => []) : Promise.resolve([]),
          user?.id ? fetchUserSubmissions(user.id).catch(() => ({ fastSell: [], exchange: [], management: [], finishing: [] })) : Promise.resolve({ fastSell: [], exchange: [], management: [], finishing: [] })
        ]);

        if (isMounted) {
          setFavoriteProps(allProps.filter(p => favIds.includes(p.id)));
          setMyProperties(userProps);
          setMySubmissions(userSubs);
        }
      } catch (err) {
        console.error('Failed to load user dashboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();
    return () => { isMounted = false; };
  }, [user]);

  const totalSubmissions = (mySubmissions.fastSell?.length || 0) + 
                           (mySubmissions.exchange?.length || 0) + 
                           (mySubmissions.management?.length || 0) + 
                           (mySubmissions.finishing?.length || 0);

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'published':
      case 'active':
      case 'accepted':
      case 'approved':
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">{status}</span>;
      case 'offer_made':
      case 'matched':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 border border-sky-200">{status}</span>;
      case 'pending':
      case 'pending_review':
      case 'evaluating':
      case 'review':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">{status}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">{status || 'pending'}</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Header Banner */}
        <div className="bg-gradient-to-r from-[#0B1C3D] to-[#162F5E] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700/40">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-2xl border border-white/20 shadow-inner">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {isRTL ? `أهلاً بك، ${user?.fullName || 'عزيزي العميل'}` : `Welcome, ${user?.fullName || 'Valued User'}`}
                </h1>
                {user?.role === 'admin' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 text-[10px] font-bold">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                {user?.email || 'Authenticated User'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/add-property"
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isRTL ? 'إضافة عقار جديد' : 'List Property'}</span>
            </Link>
            <Link
              to="/fast-sell"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0B1C3D] font-black text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{isRTL ? 'بيع كاش فوري' : 'Fast Sell'}</span>
            </Link>
          </div>
        </div>

        {/* 3-Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'bg-[#0B1C3D] text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{isRTL ? `عقاراتي المعروضة (${myProperties.length})` : `My Listings (${myProperties.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-[#0B1C3D] text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{isRTL ? `المفضلة والمحفوظات (${favoriteProps.length})` : `Saved Properties (${favoriteProps.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'bg-[#0B1C3D] text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-500" />
            <span>{isRTL ? `طلباتي وعملياتي (${totalSubmissions})` : `My Submissions (${totalSubmissions})`}</span>
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div>
            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
              </div>
            ) : myProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 shadow-xs">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">
                  {isRTL ? 'لم تقم بإضافة أي عقارات حتى الآن' : 'You have not listed any properties yet'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isRTL 
                    ? 'اعرض وحدتك العقارية للبيع أو الإيجار وستصل إلى آلاف المشترين والمستثمرين فوراً.'
                    : 'List your property for sale or rent to reach thousands of buyers and verified investors.'}
                </p>
                <Link
                  to="/add-property"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B1C3D] hover:bg-[#162F5E] text-white rounded-full font-bold text-xs shadow-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isRTL ? 'إضافة عقار جديد' : 'List Property Now'}</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties.map((p) => (
                  <div key={p.id} className="relative group">
                    <PropertyCard property={p} />
                    <div className="absolute top-3 end-3 z-20">
                      {renderStatusBadge(p.status || 'published')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Properties */}
        {activeTab === 'saved' && (
          <div>
            {favoriteProps.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 shadow-xs">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">
                  {isRTL ? 'لم تقم بحفظ أي عقارات بعد' : 'No saved properties yet'}
                </h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  {isRTL 
                    ? 'اضغط على أيقونة القلب في أي عقار لإضافته إلى قائمة المفضلة ومتابعته لاحقاً.' 
                    : 'Click the heart icon on any property to save it to your dashboard favorites.'}
                </p>
                <Link 
                  to="/buy" 
                  className="inline-block px-6 py-2.5 bg-[#0B1C3D] hover:bg-[#162F5E] text-white rounded-full font-bold text-xs shadow-sm transition-colors"
                >
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

        {/* Tab 3: My Submissions */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {totalSubmissions === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 shadow-xs">
                <Clock className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">
                  {isRTL ? 'لا توجد طلبات خدمات مسجلة لحسابك حالياً' : 'No service requests recorded for your account'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isRTL 
                    ? 'يمكنك التقدم بطلب بيع سريع، أو مقايضة وبدل عقاري، أو إدارة أملاك، ومتابعة ردود الإدارة هنا مباشرة.'
                    : 'Submit Fast Sell offers, Exchange requests, or Property Management plans and track progress in real-time.'}
                </p>
              </div>
            ) : (
              <>
                {/* 1. Fast Sell Requests */}
                {mySubmissions.fastSell?.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-[#0B1C3D] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>{isRTL ? 'طلبات البيع السريع والعروض النقدية' : 'Fast Sell Applications'}</span>
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">{isRTL ? 'الوحدة' : 'Property'}</th>
                            <th className="p-3">{isRTL ? 'الموقع' : 'Location'}</th>
                            <th className="p-3">{isRTL ? 'السعر المطلوب' : 'Asking Price'}</th>
                            <th className="p-3">{isRTL ? 'العرض النقدي من عقار إن' : 'Cash Offer'}</th>
                            <th className="p-3">{isRTL ? 'الحالة' : 'Status'}</th>
                            <th className="p-3">{isRTL ? 'التاريخ' : 'Date'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {mySubmissions.fastSell.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/60">
                              <td className="p-3 font-mono text-slate-400">#{item.id}</td>
                              <td className="p-3 font-bold text-[#0B1C3D] capitalize">{item.property_type} ({item.area_sqm} m²)</td>
                              <td className="p-3 text-slate-600">{item.city} {item.district ? `• ${item.district}` : ''}</td>
                              <td className="p-3 font-bold text-slate-800">{formatEGP(item.asking_price)} EGP</td>
                              <td className="p-3">
                                {item.cash_offer_amount ? (
                                  <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                                    {formatEGP(item.cash_offer_amount)} EGP
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">{isRTL ? 'قيد التقييم' : 'Under Review'}</span>
                                )}
                              </td>
                              <td className="p-3">{renderStatusBadge(item.status)}</td>
                              <td className="p-3 text-slate-400 font-mono text-[11px]">{new Date(item.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. Exchange Requests */}
                {mySubmissions.exchange?.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-[#0B1C3D] flex items-center gap-2">
                      <ArrowLeftRight className="w-4 h-4 text-sky-600" />
                      <span>{isRTL ? 'طلبات البدل والمقايضة العقارية' : 'Exchange & Swap Requests'}</span>
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">{isRTL ? 'العقار المعروض' : 'Offering'}</th>
                            <th className="p-3">{isRTL ? 'العقار المطلوب' : 'Desired'}</th>
                            <th className="p-3">{isRTL ? 'أقصى فارق نقدي' : 'Max Cash Diff'}</th>
                            <th className="p-3">{isRTL ? 'الحالة' : 'Status'}</th>
                            <th className="p-3">{isRTL ? 'التاريخ' : 'Date'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {mySubmissions.exchange.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/60">
                              <td className="p-3 font-mono text-slate-400">#{item.id}</td>
                              <td className="p-3">
                                <p className="font-bold text-[#0B1C3D] capitalize">{item.current_property_type}</p>
                                <p className="text-[11px] text-slate-500">{item.current_city} • {formatEGP(item.current_est_value)} EGP</p>
                              </td>
                              <td className="p-3">
                                <p className="font-bold text-sky-700 capitalize">{item.desired_property_type || 'Any'}</p>
                                <p className="text-[11px] text-slate-500">{item.desired_city}</p>
                              </td>
                              <td className="p-3 font-bold font-mono">{formatEGP(item.max_cash_difference)} EGP</td>
                              <td className="p-3">{renderStatusBadge(item.status)}</td>
                              <td className="p-3 text-slate-400 font-mono text-[11px]">{new Date(item.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. Management Requests */}
                {mySubmissions.management?.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-[#0B1C3D] flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      <span>{isRTL ? 'عقود إدارة الأملاك' : 'Property Management Plans'}</span>
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">{isRTL ? 'الباقة' : 'Plan'}</th>
                            <th className="p-3">{isRTL ? 'الوحدة' : 'Property'}</th>
                            <th className="p-3">{isRTL ? 'المدينة' : 'City'}</th>
                            <th className="p-3">{isRTL ? 'الحالة' : 'Status'}</th>
                            <th className="p-3">{isRTL ? 'التاريخ' : 'Date'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {mySubmissions.management.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/60">
                              <td className="p-3 font-mono text-slate-400">#{item.id}</td>
                              <td className="p-3 font-bold text-indigo-700 uppercase">{item.plan_name}</td>
                              <td className="p-3 capitalize">{item.property_type} ({item.area_sqm} m²)</td>
                              <td className="p-3">{item.city}</td>
                              <td className="p-3">{renderStatusBadge(item.status)}</td>
                              <td className="p-3 text-slate-400 font-mono text-[11px]">{new Date(item.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Finishing Requests */}
                {mySubmissions.finishing?.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-sm font-black text-[#0B1C3D] flex items-center gap-2">
                      <Paintbrush className="w-4 h-4 text-purple-600" />
                      <span>{isRTL ? 'طلبات عروض أسعار التشطيب' : 'Finishing Quotes'}</span>
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">{isRTL ? 'الباقة' : 'Package'}</th>
                            <th className="p-3">{isRTL ? 'المساحة' : 'Area'}</th>
                            <th className="p-3">{isRTL ? 'الميزانية التقديرية' : 'Estimated Cost'}</th>
                            <th className="p-3">{isRTL ? 'الحالة' : 'Status'}</th>
                            <th className="p-3">{isRTL ? 'التاريخ' : 'Date'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {mySubmissions.finishing.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/60">
                              <td className="p-3 font-mono text-slate-400">#{item.id}</td>
                              <td className="p-3 font-bold text-purple-700 capitalize">{item.package_type}</td>
                              <td className="p-3">{item.area_sqm} m²</td>
                              <td className="p-3 font-bold font-mono text-slate-800">{formatEGP(item.estimated_cost)} EGP</td>
                              <td className="p-3">{renderStatusBadge(item.status)}</td>
                              <td className="p-3 text-slate-400 font-mono text-[11px]">{new Date(item.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
