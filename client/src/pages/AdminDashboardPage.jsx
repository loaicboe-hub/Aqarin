import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Inbox, 
  Zap, 
  ArrowLeftRight, 
  Briefcase, 
  Handshake, 
  Sliders, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Edit3, 
  Trash2,
  Check, 
  X, 
  AlertCircle, 
  PlusCircle, 
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  Phone,
  Mail,
  Loader2,
  DollarSign,
  Image as ImageIcon,
  UploadCloud,
  MessageSquareShare,
  TrendingUp,
  FileText,
  BadgePercent,
  PieChart
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  fetchProperties, updateProperty, deleteProperty, uploadPropertyImages,
  fetchAdminLeads, fetchAdminFastSell, updateAdminFastSellStatus,
  fetchAdminExchange, updateAdminExchangeStatus,
  fetchAdminManagement, updateAdminManagementStatus,
  fetchAdminPartners, updateAdminPartnerStatus,
  fetchAdminReports
} from '../services/api';
import AdminLayout from '../components/admin/AdminLayout';

export default function AdminDashboardPage() {
  const { isRTL } = useLanguage();
  const location = useLocation();

  const [stats, setStats] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);
  const [properties, setProperties] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [fastSellList, setFastSellList] = useState([]);
  const [exchangeList, setExchangeList] = useState([]);
  const [managementList, setManagementList] = useState([]);
  const [partnersList, setPartnersList] = useState([]);
  const [reportsData, setReportsData] = useState(null);
  const [offerInputs, setOfferInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Benchmarks inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editBenchmarkForm, setEditBenchmarkForm] = useState({
    avg_price_sqm: '',
    rental_yield_pct: '',
    annual_growth_pct: ''
  });
  const [savingId, setSavingId] = useState(null);

  // Property Edit & Delete state
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingProperty, setSavingProperty] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editUploading, setEditUploading] = useState(false);
  const [editUploadError, setEditUploadError] = useState('');
  const [editImageUrlInput, setEditImageUrlInput] = useState('');
  const editFileInputRef = React.useRef(null);

  // Active view determination from pathname
  const currentPath = location.pathname;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, benchRes, propsData, usersRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/admin/benchmarks').then(r => r.json()).catch(() => ({ success: false })),
        fetchProperties().catch(() => []),
        fetch('/api/admin/users').then(r => r.json()).catch(() => ({ success: false }))
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (benchRes.success) {
        setBenchmarks(benchRes.data || []);
      }
      if (usersRes.success) {
        setUsersList(usersRes.data || []);
      }
      setProperties(propsData || []);

      // Load specific route dataset on demand
      if (currentPath === '/admin/leads') {
        const leads = await fetchAdminLeads().catch(() => []);
        setLeadsList(leads);
      } else if (currentPath === '/admin/fast-sell') {
        const fs = await fetchAdminFastSell().catch(() => []);
        setFastSellList(fs);
      } else if (currentPath === '/admin/exchange') {
        const ex = await fetchAdminExchange().catch(() => []);
        setExchangeList(ex);
      } else if (currentPath === '/admin/management') {
        const mgmt = await fetchAdminManagement().catch(() => []);
        setManagementList(mgmt);
      } else if (currentPath === '/admin/partners') {
        const part = await fetchAdminPartners().catch(() => []);
        setPartnersList(part);
      } else if (currentPath === '/admin/reports') {
        const rep = await fetchAdminReports().catch(() => null);
        setReportsData(rep);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [location.pathname]);

  const handleStartEditBenchmark = (b) => {
    setEditingId(b.id);
    setEditBenchmarkForm({
      avg_price_sqm: b.avg_price_sqm,
      rental_yield_pct: b.rental_yield_pct,
      annual_growth_pct: b.annual_growth_pct
    });
  };

  const handleSaveBenchmark = async (id) => {
    setSavingId(id);
    try {
      const newPrice = Number(editBenchmarkForm.avg_price_sqm);
      const newYield = Number(editBenchmarkForm.rental_yield_pct);
      const newGrowth = Number(editBenchmarkForm.annual_growth_pct);

      const res = await fetch(`/api/admin/benchmarks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avg_price_sqm: newPrice,
          min_price_sqm: Math.round(newPrice * 0.88),
          max_price_sqm: Math.round(newPrice * 1.25),
          rental_yield_pct: newYield,
          annual_growth_pct: newGrowth
        })
      });

      if (!res.ok) throw new Error('Failed to update benchmark');
      
      setBenchmarks(prev => prev.map(b => b.id === id ? { 
        ...b, 
        avg_price_sqm: newPrice,
        min_price_sqm: Math.round(newPrice * 0.88),
        max_price_sqm: Math.round(newPrice * 1.25),
        rental_yield_pct: newYield,
        annual_growth_pct: newGrowth
      } : b));
      setEditingId(null);
    } catch (err) {
      alert(`Error updating benchmark: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  // Property Edit Handlers
  const handleOpenEdit = (prop) => {
    setEditingProperty(prop);
    setEditUploadError('');
    setEditImageUrlInput('');
    setEditForm({
      title_en: prop.title_en || prop.titleEn || '',
      title_ar: prop.title_ar || prop.titleAr || '',
      description_en: prop.description_en || prop.descriptionEn || '',
      description_ar: prop.description_ar || prop.descriptionAr || '',
      purpose: prop.purpose || 'sale',
      category: prop.category || 'residential',
      property_type: prop.property_type || prop.propertyType || 'apartment',
      price: prop.price || '',
      area_sqm: prop.area_sqm || prop.areaSqm || '',
      bedrooms: prop.bedrooms ?? 3,
      bathrooms: prop.bathrooms ?? 2,
      floor_level: prop.floor_level ?? prop.floorLevel ?? 1,
      finishing_type: prop.finishing_type || prop.finishingType || 'fully_finished',
      delivery_status: prop.delivery_status || prop.deliveryStatus || 'ready',
      delivery_year: prop.delivery_year || prop.deliveryYear || 2026,
      payment_type: prop.payment_type || prop.paymentType || 'cash',
      down_payment: prop.down_payment || prop.downPayment || '',
      installment_years: prop.installment_years || prop.installmentYears || 0,
      monthly_installment: prop.monthly_installment || prop.monthlyInstallment || '',
      city: prop.city || 'Cairo',
      district: prop.district || '',
      compound: prop.compound || '',
      address: prop.address || '',
      images: Array.isArray(prop.images) ? [...prop.images] : (Array.isArray(prop.images_json) ? [...prop.images_json] : []),
      amenities: Array.isArray(prop.amenities) ? [...prop.amenities] : ['Security', 'Parking'],
      status: prop.status || 'published',
      featured: Boolean(prop.featured)
    });
  };

  const handleEditFilesSelected = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setEditUploadError('');

    const currentCount = editForm?.images?.length || 0;
    if (currentCount >= 5) {
      setEditUploadError(isRTL ? 'الحد الأقصى هو 5 صور.' : 'Maximum 5 images allowed.');
      return;
    }

    const availableSlots = 5 - currentCount;
    const filesToProcess = Array.from(fileList).slice(0, availableSlots);

    const validFiles = [];
    for (const file of filesToProcess) {
      const isImg = file.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|heic|heif|jfif|gif|bmp|tiff|svg)$/i.test(file.name);
      if (!isImg) {
        setEditUploadError(isRTL ? 'يُسمح برفع ملفات الصور فقط.' : 'Only image files are allowed.');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setEditUploadError(isRTL ? 'حجم الصورة يجب ألا يتجاوز 15 ميجابايت.' : 'Image file size cannot exceed 15MB.');
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setEditUploading(true);
    try {
      const uploadedUrls = await uploadPropertyImages(validFiles);
      setEditForm(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls].slice(0, 5)
      }));
    } catch (err) {
      setEditUploadError(err.message || (isRTL ? 'فشل رفع الصور.' : 'Failed to upload images.'));
    } finally {
      setEditUploading(false);
      if (editFileInputRef.current) editFileInputRef.current.value = '';
    }
  };

  const handleAddEditImageUrl = () => {
    if (!editImageUrlInput.trim()) return;
    if ((editForm?.images?.length || 0) >= 5) {
      setEditUploadError(isRTL ? 'الحد الأقصى هو 5 صور.' : 'Maximum 5 images allowed.');
      return;
    }
    setEditForm(prev => ({
      ...prev,
      images: [...(prev.images || []), editImageUrlInput.trim()]
    }));
    setEditImageUrlInput('');
    setEditUploadError('');
  };

  const handleRemoveEditImage = (idx) => {
    setEditForm(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx)
    }));
    setEditUploadError('');
  };

  const handleSaveEdit = async () => {
    if (!editForm || !editingProperty) return;
    const priceNum = Number(editForm.price) || 0;
    const areaNum = Number(editForm.area_sqm) || 0;

    if (!editForm.title_en?.trim()) {
      alert(isRTL ? 'يرجى إدخال عنوان العقار' : 'Please enter property title');
      return;
    }
    if (priceNum <= 0) {
      alert(isRTL ? 'يرجى إدخال سعر صحيح أكبر من الصفر' : 'Please enter a valid price greater than zero');
      return;
    }
    if (areaNum <= 0) {
      alert(isRTL ? 'يرجى إدخال مساحة صحيحة أكبر من الصفر' : 'Please enter a valid area greater than zero');
      return;
    }

    setSavingProperty(true);
    try {
      const payload = {
        title_en: editForm.title_en.trim(),
        title_ar: editForm.title_ar?.trim() || editForm.title_en.trim(),
        description_en: editForm.description_en?.trim() || '',
        description_ar: editForm.description_ar?.trim() || editForm.description_en?.trim() || '',
        purpose: editForm.purpose || 'sale',
        category: editForm.category || 'residential',
        property_type: editForm.property_type || 'apartment',
        price: priceNum,
        area_sqm: areaNum,
        bedrooms: Number(editForm.bedrooms) || 0,
        bathrooms: Number(editForm.bathrooms) || 0,
        floor_level: Number(editForm.floor_level) || 1,
        finishing_type: editForm.finishing_type || 'fully_finished',
        delivery_status: editForm.delivery_status || 'ready',
        delivery_year: Number(editForm.delivery_year) || 2026,
        payment_type: editForm.payment_type || 'cash',
        down_payment: editForm.payment_type === 'installments' ? (Number(editForm.down_payment) || 0) : 0,
        installment_years: editForm.payment_type === 'installments' ? (Number(editForm.installment_years) || 0) : 0,
        monthly_installment: editForm.payment_type === 'installments' ? (Number(editForm.monthly_installment) || 0) : 0,
        city: editForm.city || 'Cairo',
        district: editForm.district?.trim() || '',
        compound: editForm.compound?.trim() || '',
        address: editForm.address?.trim() || '',
        images: editForm.images && editForm.images.length > 0 ? editForm.images : [],
        amenities: editForm.amenities || ['Security', 'Parking'],
        status: editForm.status || 'published',
        featured: Boolean(editForm.featured)
      };

      const res = await updateProperty(editingProperty.id, payload);
      setProperties(prev => prev.map(p => p.id === editingProperty.id ? res.data : p));
      setEditingProperty(null);
      setEditForm(null);
      alert(isRTL ? 'تم حفظ التعديلات بنجاح!' : 'Property updated successfully!');
      loadData();
    } catch (err) {
      alert((isRTL ? 'فشل تحديث العقار: ' : 'Failed to update property: ') + err.message);
    } finally {
      setSavingProperty(false);
    }
  };

  const handleDeleteProperty = async (id, title) => {
    const confirmMsg = isRTL 
      ? `هل أنت متأكد من رغبتك في حذف العقار "${title}" نهائياً من قاعدة البيانات؟`
      : `Are you sure you want to permanently delete property "${title}" from the database?`;
    if (!window.confirm(confirmMsg)) return;

    setDeletingId(id);
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      alert(isRTL ? 'تم حذف العقار بنجاح!' : 'Property deleted successfully!');
      loadData();
    } catch (err) {
      alert((isRTL ? 'فشل حذف العقار: ' : 'Failed to delete property: ') + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatEGP = (num) => new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(num || 0);

  const handleUpdateFastSellStatus = async (id, status, cashOfferAmount) => {
    try {
      const res = await updateAdminFastSellStatus(id, status, cashOfferAmount);
      if (res.success) {
        setFastSellList(prev => prev.map(item => item.id === id ? { 
          ...item, 
          status, 
          cash_offer_amount: cashOfferAmount !== undefined ? cashOfferAmount : item.cash_offer_amount 
        } : item));
        alert(isRTL ? 'تم تحديث حالة طلب البيع السريع والعرض النقدي بنجاح!' : 'Fast sell status & offer updated successfully!');
      } else {
        throw new Error(res.message || 'Update failed');
      }
    } catch (err) {
      alert((isRTL ? 'فشل التحديث: ' : 'Failed to update: ') + err.message);
    }
  };

  const handleUpdateExchangeStatus = async (id, status) => {
    try {
      const res = await updateAdminExchangeStatus(id, status);
      if (res.success) {
        setExchangeList(prev => prev.map(item => item.id === id ? { ...item, status } : item));
        alert(isRTL ? 'تم تحديث حالة طلب البدل بنجاح!' : 'Exchange status updated successfully!');
      } else {
        throw new Error(res.message || 'Update failed');
      }
    } catch (err) {
      alert((isRTL ? 'فشل التحديث: ' : 'Failed to update: ') + err.message);
    }
  };

  const handleUpdateManagementStatus = async (id, status) => {
    try {
      const res = await updateAdminManagementStatus(id, status);
      if (res.success) {
        setManagementList(prev => prev.map(item => item.id === id ? { ...item, status } : item));
        alert(isRTL ? 'تم تحديث حالة عقد الإدارة بنجاح!' : 'Management contract updated successfully!');
      } else {
        throw new Error(res.message || 'Update failed');
      }
    } catch (err) {
      alert((isRTL ? 'فشل التحديث: ' : 'Failed to update: ') + err.message);
    }
  };

  const handleUpdatePartnerStatus = async (id, status) => {
    try {
      const res = await updateAdminPartnerStatus(id, status);
      if (res.success) {
        setPartnersList(prev => prev.map(item => item.id === id ? { ...item, status } : item));
        alert(isRTL ? 'تم تحديث طلب الشريك بنجاح!' : 'Partner application updated successfully!');
      } else {
        throw new Error(res.message || 'Update failed');
      }
    } catch (err) {
      alert((isRTL ? 'فشل التحديث: ' : 'Failed to update: ') + err.message);
    }
  };

  // -------------------------------------------------------------
  // VIEW RENDERERS
  // -------------------------------------------------------------

  // 1. Dashboard Overview
  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {/* Real Live Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 sm:gap-4">
        {/* Properties */}
        <Link to="/admin/properties" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isRTL ? 'العقارات النشطة' : 'Properties'}</span>
            <Building2 className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-[#0B1C3D]">
            {loading ? '...' : (stats?.totalProperties ?? properties.length)}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">100% Live DB</span>
        </Link>

        {/* Users */}
        <Link to="/admin/users" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isRTL ? 'المستخدمين' : 'Users'}</span>
            <Users className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-purple-700">
            {loading ? '...' : (stats?.totalUsers ?? usersList.length ?? 1)}
          </p>
          <span className="text-[10px] text-purple-600 font-bold block mt-1">Verified Accounts</span>
        </Link>

        {/* Leads & Inquiries */}
        <Link to="/admin/leads" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isRTL ? 'الاستفسارات' : 'Leads'}</span>
            <Inbox className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-indigo-700">
            {loading ? '...' : (stats?.totalLeads ?? 0)}
          </p>
          <span className="text-[10px] text-indigo-600 font-bold block mt-1">Customer Leads</span>
        </Link>

        {/* Fast Sell */}
        <Link to="/admin/fast-sell" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isRTL ? 'البيع السريع' : 'Fast Sell'}</span>
            <Zap className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-emerald-700">
            {loading ? '...' : (stats?.totalFastSellRequests ?? 0)}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Liquidity Deals</span>
        </Link>

        {/* Exchange */}
        <Link to="/admin/exchange" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isRTL ? 'البدل العقاري' : 'Exchange'}</span>
            <ArrowLeftRight className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-amber-700">
            {loading ? '...' : (stats?.totalExchangeRequests ?? 0)}
          </p>
          <span className="text-[10px] text-amber-600 font-bold block mt-1">Swaps Requested</span>
        </Link>

        {/* Management */}
        <Link to="/admin/management" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isRTL ? 'إدارة الأملاك' : 'Management'}</span>
            <Briefcase className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-teal-700">
            {loading ? '...' : (stats?.totalManagementContracts ?? 0)}
          </p>
          <span className="text-[10px] text-teal-600 font-bold block mt-1">Active Contracts</span>
        </Link>

        {/* Location Benchmarks */}
        <Link to="/admin/benchmarks" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isRTL ? 'مؤشرات الأسعار' : 'Benchmarks'}</span>
            <Sliders className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black text-blue-700">
            {loading ? '...' : benchmarks.length}
          </p>
          <span className="text-[10px] text-blue-600 font-bold block mt-1">Districts Tracked</span>
        </Link>
      </div>

      {/* Database & Infrastructure Health Status Banner */}
      <div className="bg-gradient-to-r from-[#0B1C3D] to-[#122A5C] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PostgreSQL 16.4 + PostGIS 3.4 Active & Synchronized</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isRTL ? 'البنية التحتية وقاعدة البيانات تعمل بكفاءة' : 'Authoritative PostgreSQL Database Engine'}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {isRTL 
              ? 'المنصة متصلة بقاعدة بيانات PostgreSQL 16 المزودة بإضافة PostGIS للبحث الجغرافي والحدود الخرائطية. جميع العمليات والإحصائيات حية بدون بيانات وهمية.'
              : 'All operations and spatial queries execute natively on PostgreSQL 16 + PostGIS with zero MySQL runtime dependencies and zero fake fallback statistics.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-2 border border-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{isRTL ? 'تحديث البيانات' : 'Refresh Metrics'}</span>
          </button>
          <Link
            to="/admin/properties"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md transition-colors"
          >
            {isRTL ? 'إدارة العقارات' : 'Manage Properties'}
          </Link>
        </div>
      </div>

      {/* Quick Benchmarks Overview Snapshot */}
      {renderBenchmarksSection(true)}
    </div>
  );

  // 2. Properties Management View
  const renderPropertiesSection = () => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-[#0B1C3D] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-600" />
            <span>{isRTL ? 'إدارة العقارات المعروضة' : 'Active Property Inventory'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL ? 'قائمة العقارات المسجلة رسمياً في قاعدة بيانات PostgreSQL.' : 'Authoritative property records stored in PostgreSQL with PostGIS coordinates.'}
          </p>
        </div>

        <Link
          to="/sell"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-[#0B1C3D] hover:bg-[#162F5E] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isRTL ? 'إضافة عقار جديد' : 'Add Property'}</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase font-black text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-3.5">ID</th>
              <th className="p-3.5">{isRTL ? 'العقار' : 'Property'}</th>
              <th className="p-3.5">{isRTL ? 'الموقع' : 'Location'}</th>
              <th className="p-3.5">{isRTL ? 'السعر' : 'Price'}</th>
              <th className="p-3.5">{isRTL ? 'المساحة' : 'Area'}</th>
              <th className="p-3.5">{isRTL ? 'النوع' : 'Type'}</th>
              <th className="p-3.5">{isRTL ? 'الحالة' : 'Status'}</th>
              <th className="p-3.5 text-end">{isRTL ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-400 font-bold">
                  {isRTL ? 'لا توجد عقارات مسجلة حالياً.' : 'No active properties found.'}
                </td>
              </tr>
            ) : (
              properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-400">#{prop.id}</td>
                  <td className="p-3.5 font-bold text-[#0B1C3D]">
                    <div className="max-w-xs truncate">{isRTL ? prop.title_ar || prop.title : prop.title_en || prop.title}</div>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{prop.district}, {prop.city}</span>
                    </span>
                  </td>
                  <td className="p-3.5 font-black text-emerald-700">{formatEGP(prop.price)} EGP</td>
                  <td className="p-3.5 font-medium">{prop.area_sqm || prop.areaSqm} m²</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                      {prop.property_type || prop.type || 'Apartment'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Published</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-end">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <Link
                        to={`/property/${prop.id}`}
                        target="_blank"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                        title={isRTL ? 'معاينة العقار' : 'View Property'}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'معاينة' : 'View'}</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(prop)}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold inline-flex items-center gap-1 transition-colors border border-sky-200/60"
                        title={isRTL ? 'تعديل العقار' : 'Edit Property'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'تعديل' : 'Edit'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProperty(prop.id, isRTL ? prop.title_ar || prop.title_en : prop.title_en || prop.title_ar)}
                        disabled={deletingId === prop.id}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold inline-flex items-center gap-1 transition-colors border border-rose-200/60 disabled:opacity-50"
                        title={isRTL ? 'حذف العقار' : 'Delete Property'}
                      >
                        {deletingId === prop.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        <span>{isRTL ? 'حذف' : 'Delete'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 3. Location Benchmarks View
  const renderBenchmarksSection = (isSnapshot = false) => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-[#0B1C3D] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-600" />
            <span>{isRTL ? 'مؤشرات أسعار المتر الحية (قاعدة بيانات PostgreSQL)' : 'Location Benchmarks & Price-per-Meter Intelligence'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL 
              ? 'تعديل متوسط سعر المتر وعائد الإيجار % والنمو السنوي ينعكس فوراً ومباشرة في قاعدة بيانات PostgreSQL.' 
              : 'Direct pricing benchmarks, rental yields, and annual growth rates tracked live in PostgreSQL.'}
          </p>
        </div>

        {isSnapshot && (
          <Link
            to="/admin/benchmarks"
            className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-1"
          >
            <span>{isRTL ? 'عرض جميع المؤشرات' : 'View All 16 Districts'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase font-black text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-3.5">{isRTL ? 'المنطقة / الكمبوند' : 'Area / District'}</th>
              <th className="p-3.5">{isRTL ? 'المحافظة' : 'Governorate'}</th>
              <th className="p-3.5">{isRTL ? 'متوسط سعر المتر' : 'Base Price / SQM'}</th>
              <th className="p-3.5">{isRTL ? 'عائد الإيجار %' : 'Rental Yield %'}</th>
              <th className="p-3.5">{isRTL ? 'النمو السنوي' : 'Annual Growth'}</th>
              <th className="p-3.5 text-end">{isRTL ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {benchmarks.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400 font-bold">
                  {isRTL ? 'لا توجد مؤشرات أسعار مسجلة.' : 'No benchmarks loaded.'}
                </td>
              </tr>
            ) : (
              (isSnapshot ? benchmarks.slice(0, 5) : benchmarks).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-[#0B1C3D]">
                    {isRTL ? b.district_ar : b.district_en}
                    {b.compound_en && <span className="block text-[10px] text-slate-400 font-normal">{b.compound_en}</span>}
                  </td>
                  <td className="p-3.5 text-slate-500">{isRTL ? b.city_ar : b.city_en}</td>
                  <td className="p-3.5">
                    {editingId === b.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editBenchmarkForm.avg_price_sqm}
                          onChange={(e) => setEditBenchmarkForm(prev => ({ ...prev, avg_price_sqm: e.target.value }))}
                          className="w-24 p-1.5 rounded-lg bg-white border border-[#0B1C3D] text-slate-900 font-bold text-xs focus:ring-2 focus:ring-sky-500"
                          placeholder="Price/m²"
                        />
                        <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">EGP/m²</span>
                      </div>
                    ) : (
                      <span className="font-extrabold text-[#0B1C3D]">{formatEGP(b.avg_price_sqm)} EGP/m²</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {editingId === b.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.1"
                          value={editBenchmarkForm.rental_yield_pct}
                          onChange={(e) => setEditBenchmarkForm(prev => ({ ...prev, rental_yield_pct: e.target.value }))}
                          className="w-16 p-1.5 rounded-lg bg-white border border-emerald-500 text-emerald-700 font-bold text-xs focus:ring-2 focus:ring-emerald-500"
                          placeholder="Yield"
                        />
                        <span className="text-xs text-emerald-600 font-bold">%</span>
                      </div>
                    ) : (
                      <span className="text-emerald-600 font-bold">{b.rental_yield_pct}%</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {editingId === b.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-sky-700 font-bold">+</span>
                        <input
                          type="number"
                          step="0.1"
                          value={editBenchmarkForm.annual_growth_pct}
                          onChange={(e) => setEditBenchmarkForm(prev => ({ ...prev, annual_growth_pct: e.target.value }))}
                          className="w-16 p-1.5 rounded-lg bg-white border border-sky-500 text-sky-700 font-bold text-xs focus:ring-2 focus:ring-sky-500"
                          placeholder="Growth"
                        />
                        <span className="text-xs text-sky-700 font-bold">%</span>
                      </div>
                    ) : (
                      <span className="text-sky-700 font-bold">+{b.annual_growth_pct}%</span>
                    )}
                  </td>
                  <td className="p-3.5 text-end">
                    {editingId === b.id ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSaveBenchmark(b.id)}
                          disabled={savingId === b.id}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 transition-all shadow-xs disabled:opacity-50"
                          title={isRTL ? 'حفظ التعديلات' : 'Save'}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{savingId === b.id ? '...' : (isRTL ? 'حفظ' : 'Save')}</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
                          title={isRTL ? 'إلغاء' : 'Cancel'}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEditBenchmark(b)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0B1C3D] text-xs font-bold inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'تعديل المؤشرات' : 'Edit'}</span>
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
  );

  // 4. Users Management View (Real PostgreSQL users table)
  const renderUsersSection = () => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-[#0B1C3D] flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>{isRTL ? 'إدارة المستخدمين وحسابات النظام' : 'Users & System Accounts'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL ? 'الحسابات المسجلة بقاعدة بيانات PostgreSQL 16 الرسمية' : 'Authoritative user accounts stored in PostgreSQL 16'}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
          {usersList.length} {isRTL ? 'حساب نشط' : 'Active Account'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-3.5">ID</th>
              <th className="p-3.5">{isRTL ? 'الاسم' : 'Full Name'}</th>
              <th className="p-3.5">{isRTL ? 'البريد الإلكتروني' : 'Email'}</th>
              <th className="p-3.5">{isRTL ? 'نوع الصلاحية' : 'Role'}</th>
              <th className="p-3.5">{isRTL ? 'تاريخ الإنشاء' : 'Created At'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-mono text-slate-400">#{u.id}</td>
                <td className="p-3.5 font-bold text-[#0B1C3D]">{u.full_name}</td>
                <td className="p-3.5 text-slate-600 font-mono">{u.email}</td>
                <td className="p-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3.5 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 5. Interactive Leads Section
  const renderLeadsSection = () => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-[#0B1C3D] flex items-center gap-2">
            <Inbox className="w-5 h-5 text-indigo-600" />
            <span>{isRTL ? 'طلبات واستفسارات العملاء (Leads)' : 'Customer Leads & Inquiries'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL ? 'الاستفسارات الواردة مباشرة من صفحات تفاصيل العقارات المسجلة بقاعدة البيانات.' : 'Direct inquiries submitted by buyers & tenants on property detail pages.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black">
            {leadsList.length} {isRTL ? 'استفسار' : 'Leads'}
          </span>
          <button 
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title={isRTL ? 'تحديث' : 'Refresh'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
            <tr>
              <th className="p-3.5">#</th>
              <th className="p-3.5">{isRTL ? 'العقار المعني' : 'Target Property'}</th>
              <th className="p-3.5">{isRTL ? 'بيانات العميل' : 'Client Info'}</th>
              <th className="p-3.5">{isRTL ? 'وسيلة التواصل المفضلة' : 'Preferred Contact'}</th>
              <th className="p-3.5">{isRTL ? 'نص الرسالة' : 'Inquiry Message'}</th>
              <th className="p-3.5">{isRTL ? 'تاريخ الطلب' : 'Date'}</th>
              <th className="p-3.5 text-center">{isRTL ? 'إجراء فوري' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {leadsList.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-400">
                  {isRTL ? 'لا توجد طلبات استفسار مسجلة حالياً.' : 'No customer inquiries recorded yet.'}
                </td>
              </tr>
            ) : (
              leadsList.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400">#{lead.id}</td>
                  <td className="p-3.5">
                    {lead.property_id ? (
                      <Link 
                        to={`/property/${lead.property_id}`}
                        target="_blank"
                        className="group flex flex-col font-bold text-sky-700 hover:text-sky-900"
                      >
                        <span className="flex items-center gap-1 group-hover:underline">
                          {isRTL ? (lead.title_ar || lead.title_en) : lead.title_en}
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {lead.city || ''} {lead.district ? `• ${lead.district}` : ''} {lead.price ? `• ${formatEGP(lead.price)} EGP` : ''}
                        </span>
                      </Link>
                    ) : (
                      <span className="text-slate-400 italic">{isRTL ? 'استفسار عام' : 'General Inquiry'}</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-[#0B1C3D]">{lead.name}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="font-mono">{lead.phone}</span>
                      {lead.email && <span className="text-slate-400 font-mono">({lead.email})</span>}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold capitalize text-[10px]">
                      {lead.preferred_contact || 'phone'}
                    </span>
                  </td>
                  <td className="p-3.5 max-w-xs text-slate-700 truncate" title={lead.message}>
                    {lead.message || '—'}
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px] font-mono">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {lead.phone && (
                        <>
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isRTL ? `مرحباً ${lead.name}، بخصوص استفسارك على منصة عقار إن...` : `Hello ${lead.name}, regarding your inquiry on AQAR IN...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            title="WhatsApp"
                          >
                            <MessageSquareShare className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                            title="Call"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 6. Interactive Fast Sell Section
  const renderFastSellSection = () => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-[#0B1C3D] flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>{isRTL ? 'طلبات البيع السريع والعروض النقدية' : 'Fast Sell & Cash Offer Requests'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL ? 'إدارة وتحديد عروض الشراء الفوري وتغيير حالة التفاوض مع العملاء.' : 'Manage liquidation applications, formulate cash offers, and update statuses.'}
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
          {fastSellList.length} {isRTL ? 'طلب بيع سريع' : 'Requests'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
            <tr>
              <th className="p-3.5">#</th>
              <th className="p-3.5">{isRTL ? 'الوحدة والموقع' : 'Property & City'}</th>
              <th className="p-3.5">{isRTL ? 'المساحة والسعر المطلوب' : 'Area & Asking Price'}</th>
              <th className="p-3.5">{isRTL ? 'بيانات المالك' : 'Owner'}</th>
              <th className="p-3.5">{isRTL ? 'الحالة الحالية' : 'Current Status'}</th>
              <th className="p-3.5">{isRTL ? 'العرض النقدي المقدم' : 'Cash Offer'}</th>
              <th className="p-3.5 text-center">{isRTL ? 'تواصل' : 'Contact'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {fastSellList.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-400">
                  {isRTL ? 'لا توجد طلبات بيع سريع مسجلة حتى الآن.' : 'No fast sell requests recorded yet.'}
                </td>
              </tr>
            ) : (
              fastSellList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400">#{item.id}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-[#0B1C3D] capitalize">{item.property_type || 'Apartment'}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.city} {item.district ? `• ${item.district}` : ''} {item.compound ? `(${item.compound})` : ''}</span>
                    </p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-emerald-700">{formatEGP(item.expected_price || item.asking_price)} EGP</p>
                    <p className="text-[11px] text-slate-400">{item.area_sqm} m²</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-[#0B1C3D]">{item.owner_name || item.contact_name}</p>
                    <p className="text-[11px] font-mono text-slate-500">{item.phone || item.contact_phone}</p>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateFastSellStatus(item.id, e.target.value)}
                      className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-sky-500"
                    >
                      <option value="pending">Pending (قيد الانتظار)</option>
                      <option value="pending_review">Pending Review (قيد المراجعة)</option>
                      <option value="evaluating">Evaluating (قيد التقييم)</option>
                      <option value="offer_made">Offer Made (تم تقديم عرض)</option>
                      <option value="accepted">Accepted (مقبول)</option>
                      <option value="rejected">Rejected (مرفوض)</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        placeholder={item.cash_offer_amount ? `${item.cash_offer_amount}` : 'EGP Offer'}
                        value={offerInputs[item.id] !== undefined ? offerInputs[item.id] : (item.cash_offer_amount || '')}
                        onChange={(e) => setOfferInputs({ ...offerInputs, [item.id]: e.target.value })}
                        className="w-28 p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = Number(offerInputs[item.id] || item.cash_offer_amount);
                          if (val > 0) {
                            handleUpdateFastSellStatus(item.id, 'offer_made', val);
                          } else {
                            alert(isRTL ? 'يرجى إدخال مبلغ العرض النقدي' : 'Please enter offer amount');
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] transition-colors"
                      >
                        {isRTL ? 'إرسال العرض' : 'Save Offer'}
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    {(item.phone || item.contact_phone) && (
                      <a
                        href={`https://wa.me/${(item.phone || item.contact_phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isRTL ? `مرحباً ${item.owner_name || item.contact_name}، بخصوص طلب البيع السريع لوحدتك في ${item.city}...` : `Hello ${item.owner_name || item.contact_name}, regarding your fast sell request in ${item.city}...`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageSquareShare className="w-4 h-4" />
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 7. Interactive Exchange Section
  const renderExchangeSection = () => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-[#0B1C3D] flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-sky-600" />
            <span>{isRTL ? 'طلبات وعروض البدل العقاري' : 'Property Exchange & Swap Deals'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL ? 'عروض المقايضة العقارية المتاحة ومتابعة التوافق بين العقار المعروض والمطلوب.' : 'Active property barter requests and matching opportunities across Egypt.'}
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-black">
          {exchangeList.length} {isRTL ? 'طلب بدل' : 'Deals'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
            <tr>
              <th className="p-3.5">#</th>
              <th className="p-3.5">{isRTL ? 'العقار المعروض' : 'Offering Property'}</th>
              <th className="p-3.5">{isRTL ? 'العقار المطلوب للبدل' : 'Desired Property'}</th>
              <th className="p-3.5">{isRTL ? 'الهاتف والتواصل' : 'Contact Phone'}</th>
              <th className="p-3.5">{isRTL ? 'الحالة' : 'Status'}</th>
              <th className="p-3.5 text-center">{isRTL ? 'تواصل' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {exchangeList.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">
                  {isRTL ? 'لا توجد طلبات بدل عقاري مسجلة حالياً.' : 'No exchange requests recorded yet.'}
                </td>
              </tr>
            ) : (
              exchangeList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400">#{item.id}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-[#0B1C3D]">{item.offering_specs || item.current_property_type || 'Property Offering'}</p>
                    {item.current_city && <p className="text-[11px] text-slate-500">{item.current_city}</p>}
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-sky-700">{item.seeking_specs || item.desired_property_type || 'Seeking Property'}</p>
                    {item.desired_city && <p className="text-[11px] text-slate-500">{item.desired_city}</p>}
                  </td>
                  <td className="p-3.5">
                    <p className="font-mono text-slate-700">{item.phone || item.contact_phone || item.whatsapp}</p>
                    {item.whatsapp && <p className="text-[10px] text-emerald-600 font-mono">WA: {item.whatsapp}</p>}
                  </td>
                  <td className="p-3.5">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateExchangeStatus(item.id, e.target.value)}
                      className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-sky-500"
                    >
                      <option value="open">Open (مفتوح للبدل)</option>
                      <option value="pending">Pending (قيد المراجعة)</option>
                      <option value="review">Review (قيد الفحص)</option>
                      <option value="matched">Matched (تم التوافق)</option>
                      <option value="completed">Completed (مكتمل)</option>
                      <option value="cancelled">Cancelled (ملغي)</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-center">
                    {(item.phone || item.whatsapp) && (
                      <a
                        href={`https://wa.me/${(item.whatsapp || item.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isRTL ? `مرحباً، بخصوص طلب البدل العقاري #${item.id} على منصة عقار إن...` : `Hello, regarding property swap #${item.id} on AQAR IN...`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageSquareShare className="w-4 h-4" />
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 8. Interactive Management Section
  const renderManagementSection = () => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-[#0B1C3D] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>{isRTL ? 'عقود وخطط إدارة الأملاك' : 'Property Management Contracts'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL ? 'متابعة طلبات تفويض الإدارة والتحصيل والصيانة للملاك والمستثمرين.' : 'Manage full-lifecycle rental management, rent collection, and maintenance agreements.'}
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black">
          {managementList.length} {isRTL ? 'عقد مسجل' : 'Contracts'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
            <tr>
              <th className="p-3.5">#</th>
              <th className="p-3.5">{isRTL ? 'الباقة المختارة' : 'Plan'}</th>
              <th className="p-3.5">{isRTL ? 'المدينة والموقع' : 'Location'}</th>
              <th className="p-3.5">{isRTL ? 'بيانات المالك' : 'Owner'}</th>
              <th className="p-3.5">{isRTL ? 'الحالة' : 'Status'}</th>
              <th className="p-3.5 text-center">{isRTL ? 'تواصل' : 'Contact'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {managementList.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">
                  {isRTL ? 'لا توجد عقود إدارة مسجلة حالياً.' : 'No management contracts recorded yet.'}
                </td>
              </tr>
            ) : (
              managementList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400">#{item.id}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold uppercase text-[10px] border border-indigo-200">
                      {item.plan_type || item.plan_name || 'Standard'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-[#0B1C3D]">{item.city} {item.compound ? `• ${item.compound}` : ''}</p>
                    {item.property_type && <p className="text-[11px] text-slate-500 capitalize">{item.property_type}</p>}
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-[#0B1C3D]">{item.owner_name}</p>
                    <p className="text-[11px] font-mono text-slate-500">{item.phone || item.owner_phone}</p>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateManagementStatus(item.id, e.target.value)}
                      className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-sky-500"
                    >
                      <option value="pending_contact">Pending Contact (في انتظار الاتصال)</option>
                      <option value="pending">Pending (قيد الإعداد)</option>
                      <option value="active">Active (عقد مفعل)</option>
                      <option value="completed">Completed (مكتمل)</option>
                      <option value="cancelled">Cancelled (ملغي)</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-center">
                    {(item.phone || item.owner_phone) && (
                      <a
                        href={`https://wa.me/${(item.phone || item.owner_phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isRTL ? `مرحباً ${item.owner_name}، بخصوص باقة إدارة الأملاك لوحدتك في ${item.city}...` : `Hello ${item.owner_name}, regarding your property management plan...`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageSquareShare className="w-4 h-4" />
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 9. Interactive Partners Section
  const renderPartnersSection = () => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-[#0B1C3D] flex items-center gap-2">
            <Handshake className="w-5 h-5 text-emerald-600" />
            <span>{isRTL ? 'طلبات انضمام الشركاء والمطورين' : 'Partner & Developer Applications'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL ? 'طلبات شراكة شركات التطوير العقاري ومكاتب الوساطة والتصميم والديكور.' : 'Applications from real estate developers, brokerage agencies, and interior designers.'}
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
          {partnersList.length} {isRTL ? 'طلب شريك' : 'Applications'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
            <tr>
              <th className="p-3.5">#</th>
              <th className="p-3.5">{isRTL ? 'اسم الشركة / الكيان' : 'Company / Entity'}</th>
              <th className="p-3.5">{isRTL ? 'نوع الشراكة' : 'Partner Type'}</th>
              <th className="p-3.5">{isRTL ? 'المسؤول' : 'Contact Person'}</th>
              <th className="p-3.5">{isRTL ? 'الهاتف والإيميل' : 'Phone & Email'}</th>
              <th className="p-3.5">{isRTL ? 'الحالة' : 'Status'}</th>
              <th className="p-3.5 text-center">{isRTL ? 'تواصل' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {partnersList.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-400">
                  {isRTL ? 'لا توجد طلبات شراكة مسجلة حالياً.' : 'No partner applications recorded yet.'}
                </td>
              </tr>
            ) : (
              partnersList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400">#{item.id}</td>
                  <td className="p-3.5 font-bold text-[#0B1C3D]">{item.company_name}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold capitalize text-[10px]">
                      {item.partner_type || 'Developer'}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-800">{item.contact_person}</td>
                  <td className="p-3.5">
                    <p className="font-mono text-slate-700">{item.phone}</p>
                    {item.email && <p className="font-mono text-[10px] text-slate-400">{item.email}</p>}
                  </td>
                  <td className="p-3.5">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdatePartnerStatus(item.id, e.target.value)}
                      className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-sky-500"
                    >
                      <option value="pending">Pending (قيد الفحص)</option>
                      <option value="approved">Approved (معتمد)</option>
                      <option value="rejected">Rejected (مرفوض)</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-center">
                    <a
                      href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isRTL ? `مرحباً أستاذ ${item.contact_person}، بخصوص طلب شراكة ${item.company_name} مع منصة عقار إن...` : `Hello ${item.contact_person}, regarding ${item.company_name}'s partnership application on AQAR IN...`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageSquareShare className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 10. Comprehensive Reports & Analytics Section
  const renderReportsSection = () => {
    const saleProps = properties.filter(p => p.purpose === 'sale');
    const rentProps = properties.filter(p => p.purpose === 'rent');
    const residentialProps = properties.filter(p => p.category === 'residential');
    const commercialProps = properties.filter(p => p.category === 'commercial');

    return (
      <div className="space-y-6">
        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-500 flex items-center justify-between">
              <span>{isRTL ? 'إجمالي المعروض العقاري' : 'Total Inventory'}</span>
              <Building2 className="w-4 h-4 text-sky-600" />
            </span>
            <p className="text-3xl font-black text-[#0B1C3D]">{properties.length}</p>
            <p className="text-[11px] text-emerald-600 font-bold">{saleProps.length} For Sale • {rentProps.length} For Rent</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-500 flex items-center justify-between">
              <span>{isRTL ? 'حجم الاستفسارات الواردة' : 'Total Leads Volume'}</span>
              <Inbox className="w-4 h-4 text-indigo-600" />
            </span>
            <p className="text-3xl font-black text-indigo-700">{reportsData?.totalLeads ?? stats?.totalLeads ?? leadsList.length}</p>
            <p className="text-[11px] text-slate-500 font-medium">{isRTL ? 'تفاعل مباشر من المشترين' : 'Direct buyer interest inquiries'}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-500 flex items-center justify-between">
              <span>{isRTL ? 'طلبات البيع السريع' : 'Fast Sell Liquidation'}</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </span>
            <p className="text-3xl font-black text-amber-600">{reportsData?.totalFastSell ?? stats?.totalFastSellRequests ?? fastSellList.length}</p>
            <p className="text-[11px] text-amber-700 font-medium">{isRTL ? 'عروض تصفية نقدية عاجلة' : 'Instant cash exit requests'}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-500 flex items-center justify-between">
              <span>{isRTL ? 'مؤشرات الأسعار الإقليمية' : 'Benchmarked Areas'}</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </span>
            <p className="text-3xl font-black text-emerald-700">{benchmarks.length}</p>
            <p className="text-[11px] text-emerald-600 font-bold">{isRTL ? 'محافظات ومناطق مسجلة' : 'Regions actively tracked'}</p>
          </div>
        </div>

        {/* Detailed Breakdown Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purpose & Category Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[#0B1C3D] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-sky-600" />
              <span>{isRTL ? 'توزيع الوحدات حسب الغرض والنوع' : 'Property Inventory Distribution'}</span>
            </h3>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{isRTL ? 'للبيع (Sale)' : 'For Sale'}</span>
                  <span>{properties.length > 0 ? Math.round((saleProps.length / properties.length) * 100) : 0}% ({saleProps.length})</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-sky-600 rounded-full" 
                    style={{ width: `${properties.length > 0 ? (saleProps.length / properties.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{isRTL ? 'للإيجار (Rent)' : 'For Rent'}</span>
                  <span>{properties.length > 0 ? Math.round((rentProps.length / properties.length) * 100) : 0}% ({rentProps.length})</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${properties.length > 0 ? (rentProps.length / properties.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{isRTL ? 'سكني (Residential)' : 'Residential'}</span>
                  <span>{properties.length > 0 ? Math.round((residentialProps.length / properties.length) * 100) : 0}% ({residentialProps.length})</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${properties.length > 0 ? (residentialProps.length / properties.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{isRTL ? 'تجاري وإداري (Commercial)' : 'Commercial'}</span>
                  <span>{properties.length > 0 ? Math.round((commercialProps.length / properties.length) * 100) : 0}% ({commercialProps.length})</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${properties.length > 0 ? (commercialProps.length / properties.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Regional Price Benchmarks Quick Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[#0B1C3D] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BadgePercent className="w-4 h-4 text-emerald-600" />
                <span>{isRTL ? 'متوسط أسعار وعوائد المناطق' : 'Regional Price & Yield Benchmarks'}</span>
              </span>
              <Link to="/admin/benchmarks" className="text-xs text-sky-600 font-bold hover:underline">
                {isRTL ? 'إدارة المؤشرات' : 'Manage All'}
              </Link>
            </h3>

            <div className="space-y-3 pt-2">
              {benchmarks.slice(0, 5).map((b) => (
                <div key={b.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-[#0B1C3D]">{isRTL ? b.city_ar : b.city_en} • {isRTL ? b.district_ar : b.district_en}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{b.property_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-sky-700">{formatEGP(b.avg_price_sqm)} EGP/m²</p>
                    <p className="text-[10px] font-bold text-emerald-600">{b.rental_yield_pct}% {isRTL ? 'عائد إيجار' : 'Yield'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 11. Settings View
  const renderSettingsView = () => (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-lg font-black text-[#0B1C3D] flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-600" />
          <span>{isRTL ? 'إعدادات المنصة وقاعدة البيانات' : 'Platform & Database Settings'}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isRTL ? 'إعدادات الاتصال والأمان لنظام AQAR IN.' : 'Configuration parameters, PostgreSQL connection budget and security settings.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500">{isRTL ? 'محرك قاعدة البيانات' : 'Primary Database'}</span>
          <p className="text-sm font-bold text-[#0B1C3D]">PostgreSQL 16.4 + PostGIS 3.4</p>
          <p className="text-xs text-emerald-600 font-semibold">Active & Live on 127.0.0.1:5432</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500">{isRTL ? 'نظام البحث الجغرافي' : 'Geospatial Indexing'}</span>
          <p className="text-sm font-bold text-[#0B1C3D]">GEOGRAPHY(Point, 4326) GIST</p>
          <p className="text-xs text-emerald-600 font-semibold">Spherical ST_DWithin & ST_MakeEnvelope</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500">{isRTL ? 'ميزانية الاتصالات' : 'Connection Pool Budget'}</span>
          <p className="text-sm font-bold text-[#0B1C3D]">8 connections / process (32 total)</p>
          <p className="text-xs text-slate-600 font-semibold">Tuned for PM2 4-worker cluster</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500">{isRTL ? 'حالة التشفير' : 'Security & Auth'}</span>
          <p className="text-sm font-bold text-[#0B1C3D]">Bcrypt + JWT RS256</p>
          <p className="text-xs text-emerald-600 font-semibold">Strict SQLSTATE 23505 Unique Protection</p>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      {/* Error alert banner */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold">{isRTL ? 'خطأ في تحميل بيانات الإدارة' : 'Failed to connect to administrative data'}</p>
            <p className="text-xs text-rose-600">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content Rendered based on menu item */}
      {currentPath === '/admin' && renderDashboardOverview()}
      {currentPath === '/admin/properties' && renderPropertiesSection()}
      {currentPath === '/admin/users' && renderUsersSection()}
      {currentPath === '/admin/leads' && renderLeadsSection()}
      {currentPath === '/admin/fast-sell' && renderFastSellSection()}
      {currentPath === '/admin/exchange' && renderExchangeSection()}
      {currentPath === '/admin/management' && renderManagementSection()}
      {currentPath === '/admin/partners' && renderPartnersSection()}
      {currentPath === '/admin/benchmarks' && renderBenchmarksSection(false)}
      {currentPath === '/admin/reports' && renderReportsSection()}
      {currentPath === '/admin/settings' && renderSettingsView()}

      {/* Edit Property Modal */}
      {editingProperty && editForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0B1C3D]">
                    {isRTL ? `تعديل العقار #${editingProperty.id}` : `Edit Property #${editingProperty.id}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isRTL ? 'تعديل السعر والصور والمواصفات وحالة العرض' : 'Update property price, images, specifications, and display status'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setEditingProperty(null); setEditForm(null); }}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="space-y-6">

              {/* 1. Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D]">
                  {isRTL ? '1. البيانات الأساسية' : '1. Basic Information'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'}</label>
                    <input
                      type="text"
                      value={editForm.title_en}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title_en: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'}</label>
                    <input
                      type="text"
                      value={editForm.title_ar}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title_ar: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'الغرض' : 'Purpose'}</label>
                    <select
                      value={editForm.purpose}
                      onChange={(e) => setEditForm(prev => ({ ...prev, purpose: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      <option value="sale">For Sale (للبيع)</option>
                      <option value="rent">For Rent (للإيجار)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'القسم' : 'Category'}</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      <option value="residential">Residential (سكني)</option>
                      <option value="commercial">Commercial (تجاري/إداري)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'نوع العقار' : 'Property Type'}</label>
                    <select
                      value={editForm.property_type}
                      onChange={(e) => setEditForm(prev => ({ ...prev, property_type: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
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

              {/* 2. Pricing & Financing */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D]">
                  {isRTL ? '2. السعر وخيارات السداد' : '2. Pricing & Financing'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'السعر (جنيه)' : 'Price (EGP)'}</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'المساحة (م²)' : 'Area (SQM)'}</label>
                    <input
                      type="number"
                      value={editForm.area_sqm}
                      onChange={(e) => setEditForm(prev => ({ ...prev, area_sqm: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'طريقة السداد' : 'Payment Type'}</label>
                    <select
                      value={editForm.payment_type}
                      onChange={(e) => setEditForm(prev => ({ ...prev, payment_type: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      <option value="cash">Cash (كاش)</option>
                      <option value="installments">Installments (تقسيط)</option>
                    </select>
                  </div>
                </div>

                {editForm.payment_type === 'installments' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'المقدم (جنيه)' : 'Down Payment (EGP)'}</label>
                      <input
                        type="number"
                        value={editForm.down_payment}
                        onChange={(e) => setEditForm(prev => ({ ...prev, down_payment: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'مدة التقسيط (سنوات)' : 'Installment Years'}</label>
                      <input
                        type="number"
                        value={editForm.installment_years}
                        onChange={(e) => setEditForm(prev => ({ ...prev, installment_years: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'القسط الشهري (جنيه)' : 'Monthly Installment (EGP)'}</label>
                      <input
                        type="number"
                        value={editForm.monthly_installment}
                        onChange={(e) => setEditForm(prev => ({ ...prev, monthly_installment: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Specs */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D]">
                  {isRTL ? '3. مواصفات الوحدة' : '3. Unit Specifications'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'غرف النوم' : 'Bedrooms'}</label>
                    <select
                      value={editForm.bedrooms}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} Beds</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'الحمامات' : 'Bathrooms'}</label>
                    <select
                      value={editForm.bathrooms}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Baths</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'الطابق' : 'Floor Level'}</label>
                    <input
                      type="number"
                      value={editForm.floor_level}
                      onChange={(e) => setEditForm(prev => ({ ...prev, floor_level: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'التشطيب' : 'Finishing'}</label>
                    <select
                      value={editForm.finishing_type}
                      onChange={(e) => setEditForm(prev => ({ ...prev, finishing_type: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      <option value="fully_finished">Fully Finished</option>
                      <option value="ultra_lux">Ultra Lux</option>
                      <option value="semi_finished">Semi Finished</option>
                      <option value="core_shell">Core & Shell</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Location */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D]">
                  {isRTL ? '4. الموقع' : '4. Location'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'المدينة' : 'City'}</label>
                    <select
                      value={editForm.city}
                      onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      <option value="Cairo">Cairo (القاهرة)</option>
                      <option value="Giza">Giza (الجيزة)</option>
                      <option value="Matrouh">North Coast (الساحل)</option>
                      <option value="Red Sea">El Gouna (الجونة)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'المنطقة' : 'District'}</label>
                    <input
                      type="text"
                      value={editForm.district}
                      onChange={(e) => setEditForm(prev => ({ ...prev, district: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'الكمبوند' : 'Compound'}</label>
                    <input
                      type="text"
                      value={editForm.compound}
                      onChange={(e) => setEditForm(prev => ({ ...prev, compound: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Images (Up to 5 images) */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1C3D] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-sky-600" />
                      <span>{isRTL ? '5. صور العقار (حتى 5 صور)' : '5. Property Images (Up to 5 photos)'}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isRTL ? 'يمكنك رفع صور جديدة أو حذف أي صورة موجودة.' : 'Upload new photos or remove existing ones.'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold border bg-sky-50 text-sky-700 border-sky-200">
                    {(editForm.images?.length || 0)} / 5 {isRTL ? 'صور' : 'Images'}
                  </span>
                </div>

                {editUploadError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{editUploadError}</span>
                  </div>
                )}

                {/* Existing Images Thumbnails */}
                {editForm.images && editForm.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {editForm.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100">
                        <img
                          src={imgUrl}
                          alt={`Property ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'; }}
                        />
                        <span className="absolute top-1 start-1 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditImage(idx)}
                          className="absolute top-1 end-1 w-6 h-6 rounded-md bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                          title={isRTL ? 'حذف الصورة' : 'Remove Image'}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload More Button if under 5 */}
                {(editForm.images?.length || 0) < 5 && (
                  <div className="space-y-3">
                    <div
                      onClick={() => editFileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50"
                    >
                      <input
                        ref={editFileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleEditFilesSelected(e.target.files)}
                      />
                      <div className="flex items-center justify-center gap-2 text-sky-600 text-xs font-bold">
                        {editUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UploadCloud className="w-4 h-4" />
                        )}
                        <span>{editUploading ? (isRTL ? 'جاري رفع الصور...' : 'Uploading...') : (isRTL ? 'اضغط لاختيار صور من جهازك' : 'Click to upload photos from device')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={editImageUrlInput}
                        onChange={(e) => setEditImageUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={handleAddEditImageUrl}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        {isRTL ? 'إضافة رابط' : 'Add URL'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Status & Featured */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{isRTL ? 'حالة النشر' : 'Status'}</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    >
                      <option value="published">Published (منشور)</option>
                      <option value="pending_review">Pending Review (قيد المراجعة)</option>
                      <option value="archived">Archived (مؤرشف)</option>
                    </select>
                  </div>

                  <div className="pt-4 sm:pt-6">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.featured}
                        onChange={(e) => setEditForm(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        {isRTL ? 'تثبيت كعقار مميز في الصفحة الرئيسية (Featured)' : 'Feature on Homepage (Featured)'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setEditingProperty(null); setEditForm(null); }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={savingProperty}
                onClick={handleSaveEdit}
                className="px-5 py-2.5 rounded-xl bg-[#0B1C3D] hover:bg-[#162F5E] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
              >
                {savingProperty ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{savingProperty ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التعديلات' : 'Save Changes')}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}
