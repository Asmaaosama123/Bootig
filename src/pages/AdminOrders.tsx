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
  Filter,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  ShoppingCart,
  MoreHorizontal,
} from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  storeName?: string;
}

interface Order {
  id: string;
  totalPrice: number;
  paymentMethod: string;
  shippingAddress: string;
  status: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    whatsapp?: string;
  };
  orderItems: OrderItem[];
}

const STATUS_MAP: { [key: string]: { label: string; bg: string; text: string; border: string; dot: string } } = {
  pending:    { label: 'مكتمل',         bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-100',dot: 'bg-emerald-500' },
  processing: { label: 'جاري التجهيز', bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-100',   dot: 'bg-blue-500'    },
  shipped:    { label: 'قيد الشحن',     bg: 'bg-sky-50',     text: 'text-sky-700',    border: 'border-sky-100',    dot: 'bg-sky-500'     },
  delivered:  { label: 'مكتمل',         bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-100',dot: 'bg-emerald-500' },
  cancelled:  { label: 'ملغي',          bg: 'bg-rose-50',    text: 'text-rose-700',   border: 'border-rose-100',   dot: 'bg-rose-500'    },
};

const getStatusInfo = (status: string) => {
  const key = status?.toLowerCase() || 'pending';
  return STATUS_MAP[key] || { label: status, bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100', dot: 'bg-gray-400' };
};

const ALLOWED_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownId(null);
      setShowProfileDropdown(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Order[]>('/orders');
      setOrders(data);
    } catch (err: any) {
      toast.error('حدث خطأ أثناء تحميل الطلبات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('تم تحديث حالة الطلب بنجاح');
      setActiveDropdownId(null);
    } catch (err: any) {
      toast.error('حدث خطأ أثناء تحديث حالة الطلب');
      console.error(err);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'الكل' || o.status?.toLowerCase() === statusFilter.toLowerCase();
    const activeSearch = searchTerm || headerSearchTerm;
    const matchesSearch = !activeSearch ||
      o.id.toLowerCase().includes(activeSearch.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(activeSearch.toLowerCase()) ||
      o.shippingAddress?.toLowerCase().includes(activeSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = 0;
  const processingOrders = orders.filter(o => o.status?.toLowerCase() === 'processing').length;
  const shippedOrders = orders.filter(o => o.status?.toLowerCase() === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status?.toLowerCase() === 'delivered' || o.status?.toLowerCase() === 'pending').length;
  const cancelledOrders = orders.filter(o => o.status?.toLowerCase() === 'cancelled').length;

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

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
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-zinc-950 text-white rounded-lg shadow-sm">
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
            <button
              onClick={() => navigate('/admin/sellers')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg"
            >
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
            <h1 className="text-2xl font-bold text-zinc-900 font-sans">الطلبات</h1>
          </div>

          {/* Search bar inside header */}
          <div className="flex-1 max-w-md mx-8 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              value={headerSearchTerm}
              onChange={(e) => setHeaderSearchTerm(e.target.value)}
              placeholder="بحث برقم الطلب أو اسم العميل..."
              className="w-full pr-10 pl-4 py-2 border border-zinc-200 bg-white rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 font-sans text-right"
            />
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-600 hover:text-zinc-950 bg-white rounded-full border border-zinc-200">
              <Bell size={18} />
              <span className="absolute -top-1 -left-1 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {pendingOrders > 9 ? '9+' : pendingOrders || 0}
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowProfileDropdown(!showProfileDropdown); }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors"
              >
                <span className="h-6 w-6 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                  A
                </span>
                <span className="text-sm font-medium text-zinc-800 font-sans font-semibold">Admin</span>
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

        {/* ─── Metrics Cards (6 Cards) ─── */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">الإجمالي</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{totalOrders}</span>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShoppingCart size={20} />
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">انتظار</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{pendingOrders}</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={20} />
            </div>
          </div>

          {/* Processing */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">تجهيز</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{processingOrders}</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Package size={20} />
            </div>
          </div>

          {/* Shipped */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">شحن</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{shippedOrders}</span>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
              <Truck size={20} />
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">مكتمل</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{deliveredOrders}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">ملغي</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{cancelledOrders}</span>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <XCircle size={20} />
            </div>
          </div>
        </div>

        {/* ─── Filters & Search ─── */}
        <div className="bg-white p-4 rounded-xl border border-zinc-150 shadow-sm flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 border border-zinc-200 px-4 py-2 rounded-lg text-sm text-zinc-700 bg-white hover:bg-zinc-50 transition-colors font-medium">
              <Filter size={16} />
              <span>تصفية</span>
            </button>

            {/* Status Select */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none pr-3 pl-8 py-2 border border-zinc-200 bg-white rounded-lg text-sm text-zinc-700 focus:outline-none hover:bg-zinc-50 transition-colors font-medium"
              >
                <option value="الكل">الحالة: الكل</option>
                <option value="pending">قيد الانتظار</option>
                <option value="processing">جاري التجهيز</option>
                <option value="shipped">قيد الشحن</option>
                <option value="delivered">مكتمل</option>
                <option value="cancelled">ملغي</option>
              </select>
              <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>

          {/* Filter Search Input */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="بحث برقم الطلب أو اسم العميل..."
              className="w-full pr-9 pl-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 font-sans text-right"
            />
          </div>
        </div>

        {/* ─── Table ─── */}
        <div className="bg-white rounded-xl border border-zinc-150 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm">جاري تحميل الطلبات...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-20 text-center text-zinc-400">
              لا يوجد طلبات تطابق خيارات البحث.
            </div>
          ) : (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-xs font-semibold text-zinc-400 bg-zinc-50/50">
                  <th className="px-6 py-4">رقم الطلب</th>
                  <th className="px-6 py-4">العميل</th>
                  <th className="px-6 py-4">المنتجات</th>
                  <th className="px-6 py-4">المبلغ</th>
                  <th className="px-6 py-4">طريقة الدفع</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4">التاريخ</th>
                  <th className="px-6 py-4 w-20 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {paginatedOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const isExpanded = expandedOrderId === order.id;
                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        className="hover:bg-zinc-50/30 transition-colors text-sm text-zinc-700 cursor-pointer"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4 font-sans font-semibold text-zinc-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        {/* Customer */}
                        <td className="px-6 py-4">
                          <span className="font-medium text-zinc-800 block">{order.user?.name || '—'}</span>
                          {order.user?.whatsapp && (
                            <span className="text-xs text-zinc-400 font-sans">{order.user.whatsapp}</span>
                          )}
                        </td>
                        {/* Products count */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full font-sans">
                            {order.orderItems?.length || 0} منتج
                          </span>
                        </td>
                        {/* Amount */}
                        <td className="px-6 py-4 font-sans font-semibold text-zinc-900">
                          {Number(order.totalPrice).toFixed(2)} MRU
                        </td>
                        {/* Payment Method */}
                        <td className="px-6 py-4 text-zinc-500 font-sans text-xs font-medium">
                          {order.paymentMethod || '—'}
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                            {statusInfo.label}
                          </span>
                        </td>
                        {/* Date */}
                        <td className="px-6 py-4 font-sans text-zinc-500">{formatDate(order.createdAt)}</td>
                        {/* Actions */}
                        <td className="px-6 py-4 text-center relative" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(activeDropdownId === order.id ? null : order.id);
                            }}
                            className="p-1 hover:bg-zinc-100 rounded-md text-zinc-400 hover:text-zinc-700 transition-colors"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {activeDropdownId === order.id && (
                            <div className="absolute left-6 top-10 w-40 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-20 font-sans text-right">
                              {ALLOWED_STATUSES.map((s) => {
                                const info = getStatusInfo(s);
                                return (
                                  <button
                                    key={s}
                                    onClick={() => handleUpdateStatus(order.id, s)}
                                    className="w-full px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                                  >
                                    <span className={`w-2 h-2 rounded-full ${info.dot}`}></span>
                                    <span>{info.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Expanded Order Items Row */}
                      {isExpanded && order.orderItems && order.orderItems.length > 0 && (
                        <tr className="bg-zinc-50/60">
                          <td colSpan={8} className="px-8 py-4">
                            <div className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wide">تفاصيل المنتجات</div>
                            <div className="space-y-2">
                              {order.orderItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-white px-4 py-2.5 rounded-lg border border-zinc-100 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-400">
                                      <Package size={14} />
                                    </div>
                                    <div>
                                      <span className="font-semibold text-zinc-800 block text-sm">{item.name}</span>
                                      {item.storeName && (
                                        <span className="text-xs text-zinc-400">المتجر: {item.storeName}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-6 font-sans text-xs text-zinc-500">
                                    {item.selectedSize && (
                                      <span className="bg-zinc-100 px-2 py-0.5 rounded font-medium">مقاس: {item.selectedSize}</span>
                                    )}
                                    {item.selectedColor && (
                                      <span className="bg-zinc-100 px-2 py-0.5 rounded font-medium">لون: {item.selectedColor}</span>
                                    )}
                                    <span>الكمية: <span className="font-bold text-zinc-700">{item.qty || item.quantity}</span></span>
                                    <span className="font-bold text-zinc-900">{Number(item.price).toFixed(2)} MRU</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {order.shippingAddress && (
                              <div className="mt-3 text-xs text-zinc-500">
                                <span className="font-bold text-zinc-700">عنوان الشحن: </span>
                                {order.shippingAddress}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* ─── Pagination ─── */}
          {!loading && filteredOrders.length > 0 && (
            <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select className="appearance-none pr-3 pl-8 py-1.5 border border-zinc-200 bg-white rounded-lg text-xs text-zinc-700 focus:outline-none hover:bg-zinc-50 font-medium">
                    <option>10 عرض</option>
                  </select>
                  <ChevronDown size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

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
                        ? 'bg-zinc-950 text-white shadow-sm'
                        : 'hover:bg-zinc-100 text-zinc-700 font-semibold'
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
          )}
        </div>

      </main>
    </div>
  );
};

export default AdminOrders;
