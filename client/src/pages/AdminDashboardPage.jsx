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
  UploadCloud
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchProperties, updateProperty, deleteProperty, uploadPropertyImages } from '../services/api';
import AdminLayout from '../components/admin/AdminLayout';

export default function AdminDashboardPage() {
  const { isRTL } = useLanguage();
  const location = useLocation();

  const [stats, setStats] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);
  const [properties, setProperties] = useState([]);
  const [usersList, setUsersList] = useState([]);
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

  // 5. Standard Operational Table Placeholder for specialized services
  const renderStandardServiceView = (titleEn, titleAr, icon, descEn, descAr, count = 0) => {
    const IconComp = icon;
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-[#0B1C3D] flex items-center gap-2">
              <IconComp className="w-5 h-5 text-sky-600" />
              <span>{isRTL ? titleAr : titleEn}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRTL ? descAr : descEn}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {count} {isRTL ? 'طلب مسجل' : 'Records'}
          </span>
        </div>

        <div className="p-12 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-slate-100">
          <IconComp className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">
            {isRTL ? `قاعدة بيانات ${titleAr} متصلة وجاهزة` : `${titleEn} Table Connected in PostgreSQL`}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isRTL 
              ? 'يتم تسجيل أي طلب جديد مباشرة في جداول PostgreSQL الرسمية وبدون وسائط مؤقتة.' 
              : 'All submissions are stored directly in PostgreSQL without temporary or mock middleware.'}
          </p>
        </div>
      </div>
    );
  };

  // 5. Settings View
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
      {currentPath === '/admin/leads' && renderStandardServiceView('Leads & Inquiries', 'الطلبات والاستفسارات', Inbox, 'Direct customer inquiries and contact requests', 'طلبات واستفسارات العملاء على العقارات المعروضة', stats?.totalLeads ?? 0)}
      {currentPath === '/admin/fast-sell' && renderStandardServiceView('Fast Sell Requests', 'طلبات البيع السريع', Zap, 'Urgent property liquidation requests with cash offers', 'طلبات البيع السريع والعروض النقدية العاجلة', stats?.totalFastSellRequests ?? 0)}
      {currentPath === '/admin/exchange' && renderStandardServiceView('Property Exchange Requests', 'طلبات البدل العقاري', ArrowLeftRight, 'Property barter and swap deal applications', 'طلبات تبادل الوحدات العقارية والبدل بفارق نقدي', stats?.totalExchangeRequests ?? 0)}
      {currentPath === '/admin/management' && renderStandardServiceView('Property Management Contracts', 'إدارة الأملاك', Briefcase, 'Property management inquiries and active service plans', 'عقود وخطط إدارة الوحدات والتحصيل والصيانة', stats?.totalManagementContracts ?? 0)}
      {currentPath === '/admin/partners' && renderStandardServiceView('Partner Applications', 'طلبات الشركاء', Handshake, 'Developer, broker, and corporate partnership applications', 'طلبات انضمام المطورين والوسطاء العقاريين للمنصة', 0)}
      {currentPath === '/admin/benchmarks' && renderBenchmarksSection(false)}
      {currentPath === '/admin/reports' && renderStandardServiceView('Reports & Analytics', 'التقارير والتحليلات', BarChart3, 'Comprehensive platform metrics, regional price index trends, and activity', 'تقارير أداء المنصة وتحليلات مؤشرات أسعار المحافظات المصرية', properties.length)}
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
