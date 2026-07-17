import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import {
  Home,
  ShoppingBag,
  Package,
  Users,
  Layers,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Filter,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2
} from 'lucide-react';

interface Vendor {
  id: number;
  dbId: string;
  name: string;
  store: string;
  username: string;
  phone: string;
  registrationDate: string;
  status: 'نشط' | 'قيد المراجعة' | 'موقوف';
  initials: string;
  avatarBg: string;
  logoUrl?: string | null;
}

const AdminSellers: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'الكل' | 'نشط' | 'قيد المراجعة' | 'موقوف'>('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingVendor, setSubmittingVendor] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    storeName: '',
    storeDescription: '',
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const handleOutsideClick = () => setActiveDropdownId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Vendor[]>('/admin/vendors');
        setVendors(data);
      } catch (err: any) {
        toast.error('حدث خطأ أثناء تحميل بيانات البائعين');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const handleUpdateStatus = async (dbId: string, newStatus: 'نشط' | 'قيد المراجعة' | 'موقوف') => {
    try {
      await api.put(`/admin/vendors/${dbId}/status`, { status: newStatus });
      setVendors(prev => prev.map(v => v.dbId === dbId ? { ...v, status: newStatus } : v));
      toast.success('تم تحديث حالة البائع بنجاح');
    } catch (err: any) {
      toast.error('حدث خطأ أثناء تحديث حالة البائع');
      console.error(err);
    }
  };

  const handleAddVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newVendorData.password !== newVendorData.confirmPassword) {
      toast.error('كلمة المرور وتأكيدها غير متطابقتين');
      return;
    }
    try {
      setSubmittingVendor(true);
      await api.post('/auth/register-vendor', newVendorData);
      toast.success('تم إضافة البائع بنجاح كحساب نشط');
      setShowAddModal(false);
      // Clear form
      setNewVendorData({
        storeName: '',
        storeDescription: '',
        username: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
      });
      // Refresh vendor list
      const { data } = await api.get<Vendor[]>('/admin/vendors');
      setVendors(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'حدث خطأ أثناء إضافة البائع';
      toast.error(msg);
      console.error(err);
    } finally {
      setSubmittingVendor(false);
    }
  };

  // Filter vendors list
  const filteredVendors = vendors.filter((v) => {
    const matchesStatus = statusFilter === 'الكل' || v.status === statusFilter;
    
    // Header search or main search
    const activeSearch = searchTerm || headerSearchTerm;
    const matchesSearch = !activeSearch || 
      v.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      v.store.toLowerCase().includes(activeSearch.toLowerCase()) ||
      v.username.toLowerCase().includes(activeSearch.toLowerCase()) ||
      v.phone.includes(activeSearch);

    return matchesStatus && matchesSearch;
  });

  // Stats calculation dynamically from database vendors
  const totalSellers = vendors.length;
  const activeSellers = vendors.filter(v => v.status === 'نشط').length;
  const pendingSellers = vendors.filter(v => v.status === 'قيد المراجعة').length;
  const suspendedSellers = vendors.filter(v => v.status === 'موقوف').length;

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / itemsPerPage));
  const paginatedVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      
      {/* ─── Sidebar ─── */}
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col justify-between p-6">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10 px-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
              bootig<span className="text-yellow-400">.</span>
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg"
            >
              <Home size={18} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg"
            >
              <ShoppingBag size={18} />
              <span>الطلبات</span>
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg"
            >
              <Package size={18} />
              <span>المنتجات</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-zinc-950 text-white rounded-lg shadow-sm">
              <Users size={18} />
              <span>البائعون</span>
            </button>
            <button 
              onClick={() => navigate('/admin/categories')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg"
            >
              <Layers size={18} />
              <span>الفئات</span>
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all rounded-lg"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 font-sans">البائعون</h1>
          </div>

          {/* Search bar inside header */}
          <div className="flex-1 max-w-md mx-8 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              value={headerSearchTerm}
              onChange={(e) => setHeaderSearchTerm(e.target.value)}
              placeholder="بحث عن بائع..."
              className="w-full pr-10 pl-4 py-2 border border-zinc-200 bg-white rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 font-sans text-right"
            />
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-600 hover:text-zinc-950 bg-white rounded-full border border-zinc-200">
              <Bell size={18} />
              <span className="absolute -top-1 -left-1 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors"
              >
                <span className="h-6 w-6 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                  A
                </span>
                <span className="text-sm font-medium text-zinc-800 font-sans">Admin</span>
                <ChevronDown size={14} className="text-zinc-500" />
              </button>

              {showProfileDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-zinc-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-zinc-100">
                    <p className="text-xs text-zinc-400">مسجل كـ</p>
                    <p className="text-sm font-semibold text-zinc-700">{user?.name || 'المدير'}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut size={14} />
                    <span>تسجيل خروج</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Seller Button Row */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-zinc-950 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-zinc-800 transition-colors"
          >
            <Plus size={16} />
            <span>إضافة بائع</span>
          </button>
        </div>

        {/* ─── Metrics Cards ─── */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Sellers */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">إجمالي البائعين</span>
              <span className="text-3xl font-bold text-zinc-900 block font-sans">{totalSellers}</span>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users size={24} />
            </div>
          </div>

          {/* Active */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">نشط</span>
              <span className="text-3xl font-bold text-zinc-900 block font-sans">{activeSellers}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">قيد المراجعة</span>
              <span className="text-3xl font-bold text-zinc-900 block font-sans">{pendingSellers}</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={24} />
            </div>
          </div>

          {/* Suspended */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">موقوف</span>
              <span className="text-3xl font-bold text-zinc-900 block font-sans">{suspendedSellers}</span>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle size={24} />
            </div>
          </div>
        </div>

        {/* ─── Filters & Search ─── */}
        <div className="bg-white p-4 rounded-xl border border-zinc-150 shadow-sm flex items-center justify-between gap-4 mb-6">
          {/* Action buttons (Right in RTL layout) */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 border border-zinc-200 px-4 py-2 rounded-lg text-sm text-zinc-700 bg-white hover:bg-zinc-50 transition-colors font-medium">
              <Filter size={16} />
              <span>تصفية</span>
            </button>

            {/* Date Select */}
            <div className="relative">
              <select className="appearance-none pr-9 pl-8 py-2 border border-zinc-200 bg-white rounded-lg text-sm text-zinc-700 focus:outline-none hover:bg-zinc-50 transition-colors font-medium">
                <option>تاريخ التسجيل</option>
              </select>
              <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>

            {/* Status Select */}
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="appearance-none pr-3 pl-8 py-2 border border-zinc-200 bg-white rounded-lg text-sm text-zinc-700 focus:outline-none hover:bg-zinc-50 transition-colors font-medium"
              >
                <option value="الكل">الحالة: الكل</option>
                <option value="نشط">نشط</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="موقوف">موقوف</option>
              </select>
              <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>

          {/* Filter Search Input (Left in RTL layout) */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث عن بائع بالاسم أو المتجر أو البريد..."
              className="w-full pr-9 pl-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 font-sans text-right"
            />
          </div>
        </div>

        {/* ─── Table ─── */}
        <div className="bg-white rounded-xl border border-zinc-150 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm">جاري تحميل بيانات البائعين...</span>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="p-20 text-center text-zinc-400">
              لا يوجد بائعون يطابقون خيارات البحث.
            </div>
          ) : (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-xs font-semibold text-zinc-400 bg-zinc-50/50">
                  <th className="px-6 py-4">البائع</th>
                  <th className="px-6 py-4">المتجر</th>
                  <th className="px-6 py-4">اسم المستخدم</th>
                  <th className="px-6 py-4">الهاتف</th>
                  <th className="px-6 py-4">تاريخ التسجيل</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4 w-20 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {paginatedVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-zinc-50/30 transition-colors text-sm text-zinc-700">
                    {/* Seller details */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      {vendor.logoUrl ? (
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-200 shadow-sm flex-shrink-0">
                          <img
                            src={vendor.logoUrl}
                            alt={vendor.store}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`h-10 w-10 rounded-full ${vendor.avatarBg} flex items-center justify-center font-bold text-xs font-sans shadow-sm flex-shrink-0`}>
                          {vendor.initials}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-zinc-900 block font-sans">{vendor.name}</span>
                        <span className="text-xs text-zinc-400 font-sans block mt-0.5">ID: {vendor.id}</span>
                      </div>
                    </td>
                    {/* Store */}
                    <td className="px-6 py-4 font-medium text-zinc-800">{vendor.store}</td>
                    {/* Username */}
                    <td className="px-6 py-4 font-sans font-medium text-zinc-600">{vendor.username}</td>
                    {/* Phone */}
                    <td className="px-6 py-4 font-sans text-zinc-600">{vendor.phone}</td>
                    {/* Registration Date */}
                    <td className="px-6 py-4 font-sans text-zinc-500">{vendor.registrationDate}</td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        vendor.status === 'نشط' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : vendor.status === 'قيد المراجعة'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4 text-center relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(activeDropdownId === vendor.id ? null : vendor.id);
                        }}
                        className="p-1 hover:bg-zinc-100 rounded-md text-zinc-400 hover:text-zinc-700 transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {activeDropdownId === vendor.id && (
                        <div className="absolute left-6 top-10 w-36 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-20 font-sans text-right">
                          <button
                            onClick={() => handleUpdateStatus(vendor.dbId, 'نشط')}
                            className="w-full px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>نشط</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(vendor.dbId, 'موقوف')}
                            className="w-full px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span>موقوف</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ─── Pagination ─── */}
          <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            {/* Show page sizes */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select className="appearance-none pr-3 pl-8 py-1.5 border border-zinc-200 bg-white rounded-lg text-xs text-zinc-700 focus:outline-none hover:bg-zinc-50 font-medium">
                  <option>10 عرض</option>
                </select>
                <ChevronDown size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1 font-sans text-sm" dir="ltr">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-7 w-7 rounded font-bold text-xs flex items-center justify-center transition-colors ${
                    currentPage === pageNum 
                      ? "bg-zinc-950 text-white shadow-sm" 
                      : "hover:bg-zinc-150 text-zinc-700 font-semibold hover:bg-zinc-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 hover:bg-zinc-100 rounded text-zinc-400 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-2xl max-w-md w-full p-6 relative overflow-hidden flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200 text-right">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors text-xl font-sans"
              >
                &times;
              </button>
              <h3 className="text-lg font-bold text-zinc-900">إضافة بائع جديد</h3>
            </div>

            <form onSubmit={handleAddVendorSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-zinc-500">اسم المتجر</label>
                <input 
                  type="text" 
                  required
                  value={newVendorData.storeName}
                  onChange={e => setNewVendorData(prev => ({ ...prev, storeName: e.target.value }))}
                  placeholder="مثال: متجر الأناقة"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-800 focus:outline-none focus:border-zinc-950 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-zinc-500">اسم المستخدم (لتسجيل الدخول)</label>
                <input 
                  type="text" 
                  required
                  value={newVendorData.username}
                  onChange={e => setNewVendorData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="مثال: elegant_store"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-800 focus:outline-none focus:border-zinc-950 transition-colors font-sans text-left"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-zinc-500">رقم الهاتف (الواتساب)</label>
                <input 
                  type="text" 
                  required
                  value={newVendorData.phoneNumber}
                  onChange={e => setNewVendorData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="مثال: +966500000000"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-800 focus:outline-none focus:border-zinc-950 transition-colors font-sans text-left"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-zinc-500">وصف المتجر (اختياري)</label>
                <textarea 
                  value={newVendorData.storeDescription}
                  onChange={e => setNewVendorData(prev => ({ ...prev, storeDescription: e.target.value }))}
                  placeholder="أكتب وصفاً قصيراً للمتجر..."
                  rows={2}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-800 focus:outline-none focus:border-zinc-950 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-zinc-500">كلمة المرور</label>
                  <input 
                    type="password" 
                    required
                    value={newVendorData.password}
                    onChange={e => setNewVendorData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-800 focus:outline-none focus:border-zinc-950 transition-colors font-sans text-left"
                    dir="ltr"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-zinc-500">تأكيد كلمة المرور</label>
                  <input 
                    type="password" 
                    required
                    value={newVendorData.confirmPassword}
                    onChange={e => setNewVendorData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-800 focus:outline-none focus:border-zinc-950 transition-colors font-sans text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-3 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  disabled={submittingVendor}
                  className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                >
                  {submittingVendor && <Loader2 size={14} className="animate-spin" />}
                  <span>إضافة البائع</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSellers;
