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
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface Product {
  id: string;
  _id: string;
  name: string;
  store: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  category: string;
  createdAt: string;
}

// Category English to Arabic mapping
const CATEGORY_MAP: { [key: string]: string } = {
  dresses: "فساتين",
  tops: "بلوزات",
  shoes: "أحذية",
  shirts: "قمصان",
  accessories: "إكسسوارات",
  clothes: "ملابس",
  toys: "ألعاب",
  women: "نسائي",
  men: "رجالي",
  kids: "أطفال"
};

const AdminProducts: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState<'الكل' | 'نشط' | 'غير نشط' | 'منخفضة المخزون' | 'نفدت الكمية'>('الكل');

  const [currentPage, setCurrentPage] = useState(1);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => setActiveDropdownId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Product[]>('/admin/products');
      setProducts(data);
    } catch (err: any) {
      toast.error('حدث خطأ أثناء تحميل المنتجات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const handleUpdateStatus = async (productId: string, newStatus: 'available' | 'pending') => {
    try {
      await api.put(`/admin/products/${productId}/status`, { status: newStatus });
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, status: newStatus } : p));
      toast.success('تم تحديث حالة المنتج بنجاح');
    } catch (err: any) {
      toast.error('حدث خطأ أثناء تحديث حالة المنتج');
      console.error(err);
    }
  };

  // Filter products list
  const filteredProducts = products.filter((p) => {
    // Status Filter
    let matchesStatus = true;
    if (statusFilter === 'نشط') {
      matchesStatus = p.status === 'available' && p.stock > 0;
    } else if (statusFilter === 'غير نشط') {
      matchesStatus = p.status !== 'available';
    } else if (statusFilter === 'منخفضة المخزون') {
      matchesStatus = p.stock < 5 && p.stock > 0 && p.status === 'available';
    } else if (statusFilter === 'نفدت الكمية') {
      matchesStatus = p.stock === 0;
    }

    // Search term
    const activeSearch = searchTerm || headerSearchTerm;
    const matchesSearch = !activeSearch ||
      p.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      p.store.toLowerCase().includes(activeSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(activeSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(activeSearch.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Stats calculation
  const totalProductsCount = products.length;
  const activeProductsCount = products.filter(p => p.status === 'available' && p.stock > 0).length;
  const inactiveProductsCount = products.filter(p => p.status !== 'available').length;
  const lowStockProductsCount = products.filter(p => p.stock < 5 && p.stock > 0 && p.status === 'available').length;
  const outOfStockProductsCount = products.filter(p => p.stock === 0).length;

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper to format date in Arabic
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  // Helper to get translated category
  const translateCategory = (cat: string) => {
    if (!cat) return '—';
    const lower = cat.toLowerCase();
    return CATEGORY_MAP[lower] || cat;
  };

  // Status Badge Renderer matching the design exactly
  const getStatusBadge = (product: Product) => {
    if (product.stock === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          نفدت الكمية
        </span>
      );
    }
    if (product.status !== 'available') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-50 text-gray-700 border border-gray-100">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          غير نشط
        </span>
      );
    }
    if (product.stock < 5) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          منخفضة المخزون
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        نشط
      </span>
    );
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
            <button
              onClick={() => navigate('/admin/orders')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg"
            >
              <ShoppingBag size={18} />
              <span>الطلبات</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-zinc-950 text-white rounded-lg shadow-sm">
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
            <h1 className="text-2xl font-bold text-zinc-900 font-sans">المنتجات</h1>
          </div>

          {/* Search bar inside header */}
          <div className="flex-1 max-w-md mx-8 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              value={headerSearchTerm}
              onChange={(e) => setHeaderSearchTerm(e.target.value)}
              placeholder="بحث عن منتج..."
              className="w-full pr-10 pl-4 py-2 border border-zinc-200 bg-white rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 font-sans text-right"
            />
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-600 hover:text-zinc-950 bg-white rounded-full border border-zinc-200">
              <Bell size={18} />
              <span className="absolute -top-1 -left-1 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                2
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

        {/* ─── Metrics Cards (5 Cards) ─── */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {/* Total Products */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">إجمالي المنتجات</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{totalProductsCount}</span>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package size={20} />
            </div>
          </div>

          {/* Active Products */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">نشطة</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{activeProductsCount}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
          </div>

          {/* Inactive Products */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">غير نشطة</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{inactiveProductsCount}</span>
            </div>
            <div className="p-3 bg-gray-550 text-zinc-500 bg-zinc-50 rounded-xl">
              <Clock size={20} />
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">منخفضة المخزون</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{lowStockProductsCount}</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle size={20} />
            </div>
          </div>

          {/* Out Of Stock Products */}
          <div className="bg-white p-5 rounded-xl border border-zinc-100 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-400 block">نفدت الكمية</span>
              <span className="text-2xl font-bold text-zinc-900 block font-sans">{outOfStockProductsCount}</span>
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
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="appearance-none pr-3 pl-8 py-2 border border-zinc-200 bg-white rounded-lg text-sm text-zinc-700 focus:outline-none hover:bg-zinc-50 transition-colors font-medium"
              >
                <option value="الكل">الفئات: الكل</option>
                <option value="نشط">نشط</option>
                <option value="غير نشط">غير نشط</option>
                <option value="منخفضة المخزون">منخفضة المخزون</option>
                <option value="نفدت الكمية">نفدت الكمية</option>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث عن منتج..."
              className="w-full pr-9 pl-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 font-sans text-right"
            />
          </div>
        </div>

        {/* ─── Table ─── */}
        <div className="bg-white rounded-xl border border-zinc-150 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-zinc-400 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm">جاري تحميل المنتجات...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-20 text-center text-zinc-400">
              لا يوجد منتجات تطابق خيارات البحث.
            </div>
          ) : (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-xs font-semibold text-zinc-400 bg-zinc-50/50">
                  <th className="px-6 py-4">المنتج</th>
                  <th className="px-6 py-4">الفئة</th>
                  <th className="px-6 py-4">السعر</th>
                  <th className="px-6 py-4">المخزون</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4">البائع</th>
                  <th className="px-6 py-4">تاريخ الإضافة</th>
                  <th className="px-6 py-4 w-20 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {paginatedProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-zinc-50/30 transition-colors text-sm text-zinc-700">
                    {/* Product details */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-900 block font-sans truncate max-w-xs">{product.name}</span>
                        <span className="text-xs text-zinc-400 font-sans block mt-0.5">SKU: {product._id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-6 py-4 font-medium text-zinc-500">{translateCategory(product.category)}</td>
                    {/* Price */}
                    <td className="px-6 py-4 font-sans text-zinc-900 font-semibold">{product.price} MRU</td>
                    {/* Stock */}
                    <td className="px-6 py-4 font-sans">{product.stock}</td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(product)}
                    </td>
                    {/* Seller */}
                    <td className="px-6 py-4 font-medium text-zinc-800">{product.store}</td>
                    {/* Date Added */}
                    <td className="px-6 py-4 font-sans text-zinc-500">{formatDate(product.createdAt)}</td>
                    {/* Actions */}
                    <td className="px-6 py-4 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(activeDropdownId === product._id ? null : product._id);
                        }}
                        className="p-1 hover:bg-zinc-100 rounded-md text-zinc-400 hover:text-zinc-700 transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {activeDropdownId === product._id && (
                        <div className="absolute left-6 top-10 w-36 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-20 font-sans text-right">
                          <button
                            onClick={() => handleUpdateStatus(product._id, 'available')}
                            className="w-full px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>نشط</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(product._id, 'pending')}
                            className="w-full px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center justify-between transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span>غير نشط</span>
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
                  className={`h-7 w-7 rounded font-bold text-xs flex items-center justify-center transition-colors ${currentPage === pageNum
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
    </div>
  );
};

export default AdminProducts;
