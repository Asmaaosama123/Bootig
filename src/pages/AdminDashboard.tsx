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
  Bell,
  ChevronDown,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Loader2,
  Calendar
} from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

interface Stats {
  totalSellers: number;
  totalOrders: number;
  totalSales: number;
  totalProducts: number;
  totalCustomers: number;
  totalProfits: number;
  shippedOrders: number;
  cancelledOrders: number;
  lastOrders: Order[];
}

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Stats>('/admin/dashboard-stats');
        setStats(data);
      } catch (err: any) {
        toast.error('حدث خطأ أثناء تحميل بيانات لوحة التحكم');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('تم تسجيل الخروج بنجاح');
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
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-zinc-950 text-white rounded-lg shadow-sm">
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
            <h1 className="text-2xl font-bold text-zinc-900 font-sans">Dashboard</h1>
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center gap-4">
            {/* Date display picker style placeholder matching design */}
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-700 font-medium">
                <Calendar size={16} className="text-zinc-400" />
                <span>اليوم</span>
                <ChevronDown size={14} className="text-zinc-500" />
              </div>
            </div>

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

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
            <Loader2 className="animate-spin text-zinc-900" size={32} />
            <span className="text-sm">جاري تحميل بيانات لوحة التحكم...</span>
          </div>
        ) : stats ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-800 mb-1">مرحباً بك مجدداً، {user?.name || 'Admin'}</h2>
              <p className="text-sm text-zinc-400">إليك نظرة عامة على متجرك</p>
            </div>

            {/* ─── Metrics Cards (8 Cards) ─── */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {/* Card 1: Total Sellers */}
              <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-zinc-400 block">إجمالي البائعين</span>
                  <span className="text-3xl font-bold text-zinc-900 block font-sans">{stats.totalSellers || 0}</span>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Users size={24} />
                </div>
              </div>

              {/* Card 2: Total Orders */}
              <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-zinc-400 block">إجمالي الطلبات</span>
                  <span className="text-3xl font-bold text-zinc-900 block font-sans">
                    {stats.totalOrders ? stats.totalOrders.toLocaleString('en-US') : 0}
                  </span>
                </div>
                <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                  <ShoppingCart size={24} />
                </div>
              </div>

              {/* Card 3: Total Sales */}
              <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-zinc-400 block">إجمالي المبيعات</span>
                  <span className="text-2xl font-bold text-zinc-900 block font-sans">
                    SAR {stats.totalSales ? stats.totalSales.toLocaleString('en-US') : 0}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign size={24} />
                </div>
              </div>

              {/* Card 4: Total Products */}
              <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-zinc-400 block">المنتجات</span>
                  <span className="text-3xl font-bold text-zinc-900 block font-sans">
                    {stats.totalProducts ? stats.totalProducts.toLocaleString('en-US') : 0}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Package size={24} />
                </div>
              </div>

              {/* Card 5: Total Customers */}
              <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-zinc-400 block">العملاء</span>
                  <span className="text-3xl font-bold text-zinc-900 block font-sans">
                    {stats.totalCustomers ? stats.totalCustomers.toLocaleString('en-US') : 0}
                  </span>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Users size={24} />
                </div>
              </div>

              {/* Card 6: Total Profits */}
              <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-zinc-400 block">الأرباح</span>
                  <span className="text-2xl font-bold text-zinc-900 block font-sans">
                    SAR {stats.totalProfits ? stats.totalProfits.toLocaleString('en-US') : 0}
                  </span>
                </div>
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                  <TrendingUp size={24} />
                </div>
              </div>

              {/* Card 7: Shipped Orders (Hardcoded to 0) */}
              <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-zinc-400 block">الطلبات قيد الشحن</span>
                  <span className="text-3xl font-bold text-zinc-900 block font-sans">0</span>
                </div>
                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                  <ShoppingCart size={24} />
                </div>
              </div>

              {/* Card 8: Cancelled Orders (Hardcoded to 0) */}
              <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-zinc-400 block">الطلبات الملغاة</span>
                  <span className="text-3xl font-bold text-zinc-900 block font-sans">0</span>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <LogOut size={24} />
                </div>
              </div>
            </div>

            {/* ─── Last Orders Table ─── */}
            <div className="bg-white rounded-xl border border-zinc-150 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-white">
                <h3 className="text-base font-bold text-zinc-800">آخر الطلبات</h3>
                <button onClick={() => navigate('/admin/orders')} className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors font-medium">عرض الكل</button>
              </div>

              {stats.lastOrders.length === 0 ? (
                <div className="p-10 text-center text-zinc-400">لا توجد طلبات لعرضها حالياً.</div>
              ) : (
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-xs font-semibold text-zinc-400 bg-zinc-50/50">
                      <th className="px-6 py-4">رقم الطلب</th>
                      <th className="px-6 py-4">العميل</th>
                      <th className="px-6 py-4">المبلغ</th>
                      <th className="px-6 py-4">الحالة</th>
                      <th className="px-6 py-4">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {stats.lastOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-50/30 transition-colors text-sm text-zinc-700">
                        {/* Order ID */}
                        <td className="px-6 py-4 font-sans font-semibold text-zinc-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        {/* Customer */}
                        <td className="px-6 py-4 font-medium text-zinc-800">{order.customer}</td>
                        {/* Amount */}
                        <td className="px-6 py-4 font-sans font-semibold text-zinc-900">
                          SAR {order.amount.toFixed(2)}
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {order.status}
                          </span>
                        </td>
                        {/* Date */}
                        <td className="px-6 py-4 font-sans text-zinc-500">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <div className="p-10 text-center text-zinc-400">فشل في تحميل البيانات</div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
