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
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Edit2,
  Folder,
  Sparkles,
  Shirt,
  Smile,
  Footprints,
  Laptop,
  Briefcase
} from 'lucide-react';

interface CategoryNode {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  parentCategoryId?: string;
  heroImages?: string[];
  subcategories: CategoryNode[];
}

// Map english or specific categories to Lucide Icons dynamically
const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("woman") || lower.includes("women") || lower.includes("نساء")) {
    return <Sparkles className="w-5 h-5 text-purple-600" />;
  }
  if (lower.includes("man") || lower.includes("men") || lower.includes("رجال")) {
    return <Shirt className="w-5 h-5 text-blue-600" />;
  }
  if (lower.includes("kid") || lower.includes("أطفال") || lower.includes("طفل")) {
    return <Smile className="w-5 h-5 text-amber-600" />;
  }
  if (lower.includes("shoe") || lower.includes("أحذية") || lower.includes("حذاء")) {
    return <Footprints className="w-5 h-5 text-emerald-600" />;
  }
  if (lower.includes("bag") || lower.includes("حقائب") || lower.includes("إكسسوار") || lower.includes("accessories")) {
    return <Briefcase className="w-5 h-5 text-rose-600" />;
  }
  if (lower.includes("beauty") || lower.includes("جمال") || lower.includes("صحة")) {
    return <Sparkles className="w-5 h-5 text-pink-600" />;
  }
  if (lower.includes("home") || lower.includes("منزل") || lower.includes("مطبخ")) {
    return <Home className="w-5 h-5 text-teal-600" />;
  }
  if (lower.includes("elect") || lower.includes("إلكترو") || lower.includes("audio") || lower.includes("phone")) {
    return <Laptop className="w-5 h-5 text-indigo-600" />;
  }
  return <Folder className="w-5 h-5 text-gray-600" />;
};

// Translate seeded category names to Arabic for visual matching
const translateCategoryName = (name: string) => {
  const lower = name.toLowerCase();
  const maps: { [key: string]: string } = {
    woman: "النساء",
    women: "النساء",
    man: "الرجال",
    men: "الرجال",
    kids: "الأطفال",
    dresses: "الملابس والفساتين",
    tops: "بلوزات وقمصان",
    shoes: "أحذية وحقائب",
    shirts: "قمصان رجالية",
    accessories: "إكسسوارات وساعات",
    clothes: "ملابس أطفال",
    toys: "ألعاب أطفال"
  };
  return maps[lower] || name;
};

const AdminCategories: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [categoriesTree, setCategoriesTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Selections
  const [selectedMainId, setSelectedMainId] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formLevel, setFormLevel] = useState<1 | 2 | 3>(1); // 1 = Main, 2 = Sub, 3 = Child Category
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formHeroImages, setFormHeroImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load Categories tree on load
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<CategoryNode[]>('/categories/tree');
      setCategoriesTree(data);
    } catch (err: any) {
      toast.error('حدث خطأ أثناء تحميل شجرة الفئات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('تم تسجيل الخروج بنجاح');
  };

  // Image base64 conversion
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة كبير جداً، الحد الأقصى 2 ميجابايت');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Hierarchy navigation
  const mainCategories = categoriesTree;
  const selectedMain = mainCategories.find(c => c.id === selectedMainId);
  const subCategories = selectedMain ? selectedMain.subcategories : [];
  const selectedSub = subCategories.find(c => c.id === selectedSubId);
  const childCategories = selectedSub ? selectedSub.subcategories : [];

  // Reset form when main category selection changes
  useEffect(() => {
    setFormOpen(false);
    setFormHeroImages([]);
    setFormImageUrl('');
    setFormName('');
    setFormDescription('');
    setSelectedSubId(null);
    setSelectedChildId(null);
  }, [selectedMainId]);

  // Trigger form opening for specific level
  const triggerAddForm = (level: 1 | 2 | 3) => {
    // Check parent constraints
    if (level === 2 && !selectedMainId) {
      toast.error('يرجى اختيار فئة رئيسية أولاً');
      return;
    }
    if (level === 3 && !selectedSubId) {
      toast.error('يرجى اختيار فئة فرعية أولاً');
      return;
    }

    setFormOpen(true);
    setFormMode('add');
    setFormLevel(level);
    setEditingCategoryId(null);
    setFormName('');
    setFormDescription('');
    setFormImageUrl('');
    setFormHeroImages([]);
  };

  const triggerEditForm = (category: CategoryNode, level: 1 | 2 | 3) => {
    setFormOpen(true);
    setFormMode('edit');
    setFormLevel(level);
    setEditingCategoryId(category.id);
    setFormName(category.name);
    setFormDescription(category.description || '');
    setFormImageUrl(category.imageUrl || '');
    setFormHeroImages(category.heroImages || []);
  };

  // Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('اسم الفئة مطلوب');
      return;
    }

    setIsSaving(true);
    try {
      if (formMode === 'add') {
        let parentCategoryId: string | null = null;
        if (formLevel === 2) parentCategoryId = selectedMainId;
        if (formLevel === 3) parentCategoryId = selectedSubId;

        const payload = {
          name: formName.trim(),
          description: formDescription.trim(),
          imageUrl: formImageUrl,
          parentCategoryId,
          heroImages: formLevel === 1 ? formHeroImages : undefined
        };

        await api.post('/categories', payload);
        toast.success('تم إضافة الفئة بنجاح');
      } else {
        const payload = {
          name: formName.trim(),
          description: formDescription.trim(),
          imageUrl: formImageUrl,
          heroImages: formLevel === 1 ? formHeroImages : undefined
        };

        await api.put(`/categories/${editingCategoryId}`, payload);
        toast.success('تم تعديل الفئة بنجاح');
      }

      setFormOpen(false);
      fetchCategories();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'حدث خطأ أثناء حفظ الفئة';
      toast.error(errMsg);
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success('تم حذف الفئة بنجاح');

      // Reset selections if deleted
      if (selectedMainId === id) {
        setSelectedMainId(null);
        setSelectedSubId(null);
        setSelectedChildId(null);
      } else if (selectedSubId === id) {
        setSelectedSubId(null);
        setSelectedChildId(null);
      } else if (selectedChildId === id) {
        setSelectedChildId(null);
      }

      fetchCategories();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'لا يمكن حذف هذه الفئة لوجود عناصر مرتبطة بها';
      toast.error(errMsg);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans" dir="rtl">

      {/* ─── Sidebar (Left) ─── */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6 shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10 px-2 justify-end">
            <span className="text-2xl font-bold tracking-tight text-zinc-950 font-sans">
              bootig<span className="text-yellow-400">.</span>
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg"
            >
              <span className="flex items-center gap-3">
                <Home size={18} />
                <span>Dashboard</span>
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag size={18} />
                <span>الطلبات</span>
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/products')}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg"
            >
              <span className="flex items-center gap-3">
                <Package size={18} />
                <span>المنتجات</span>
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/sellers')}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg"
            >
              <span className="flex items-center gap-3">
                <Users size={18} />
                <span>البائعون</span>
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-zinc-950 text-white rounded-lg shadow-sm">
              <span className="flex items-center gap-3">
                <Layers size={18} />
                <span>الفئات</span>
              </span>
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all rounded-lg"
          >
            <span className="flex items-center gap-3">
              <LogOut size={18} />
              <span>تسجيل الخروج</span>
            </span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
          <div>
            {/* Breadcrumbs */}
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1.5 justify-end">
              <span>الفئات</span>
              <ChevronLeft size={12} />
              <span>الرئيسية</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">الفئات</h1>
          </div>

          {/* Search inside header */}
          <div className="flex-1 max-w-md mx-8 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="بحث..."
              className="w-full pr-10 pl-4 py-2 border border-zinc-200 bg-white rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 text-right"
            />
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-600 hover:text-zinc-950 bg-white rounded-full border border-zinc-200">
              <Bell size={18} />
              <span className="absolute -top-1 -left-1 bg-rose-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                1
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
                <span className="text-sm font-medium text-zinc-800">Admin</span>
                <ChevronDown size={14} className="text-zinc-500" />
              </button>

              {showProfileDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-zinc-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-zinc-100">
                    <p className="text-xs text-gray-400">مسجل كـ</p>
                    <p className="text-sm font-semibold text-zinc-700">{user?.name || 'المدير'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center justify-end gap-2 font-medium"
                  >
                    <span>تسجيل خروج</span>
                    <LogOut size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tree Columns & Form Container */}
        <div className="flex-1 flex overflow-hidden">

          {/* Columns Section */}
          <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-y-auto">

            {/* 1. Main Category Column */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[70vh]">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                <h3 className="font-bold text-zinc-900 text-sm">Main Category</h3>
                <button
                  onClick={() => triggerAddForm(1)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 text-white hover:bg-zinc-800 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <Plus size={14} />
                  <span>إضافة</span>
                </button>
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center text-zinc-400">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : mainCategories.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs">
                  لا يوجد فئات رئيسية.
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {mainCategories.map((cat) => {
                    const isSelected = selectedMainId === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedMainId(cat.id);
                          setSelectedSubId(null);
                          setSelectedChildId(null);
                        }}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isSelected ? 'bg-zinc-50 border-r-4 border-zinc-950' : 'hover:bg-gray-50/50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(cat.name)}
                          <span className="text-sm font-semibold text-zinc-800">
                            {translateCategoryName(cat.name)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => triggerEditForm(cat, 1)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-zinc-900"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={12} />
                          </button>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold ml-1">
                            {cat.subcategories.length}
                          </span>
                          <ChevronLeft className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Sub Category Column */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[70vh]">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                <h3 className="font-bold text-zinc-900 text-sm">Sub Category</h3>
                <button
                  onClick={() => triggerAddForm(2)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 text-white hover:bg-zinc-800 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <Plus size={14} />
                  <span>إضافة</span>
                </button>
              </div>

              {!selectedMainId ? (
                <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs text-center p-4">
                  يرجى اختيار فئة رئيسية لعرض الفئات الفرعية
                </div>
              ) : subCategories.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs">
                  لا يوجد فئات فرعية.
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {subCategories.map((cat) => {
                    const isSelected = selectedSubId === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedSubId(cat.id);
                          setSelectedChildId(null);
                        }}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isSelected ? 'bg-zinc-50 border-r-4 border-zinc-950' : 'hover:bg-gray-50/50'
                          }`}
                      >
                        <span className="text-sm font-semibold text-zinc-800">
                          {translateCategoryName(cat.name)}
                        </span>

                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => triggerEditForm(cat, 2)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-zinc-900"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={12} />
                          </button>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-bold ml-1">
                            {cat.subcategories.length}
                          </span>
                          <ChevronLeft className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Child Category Column */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[70vh]">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                <h3 className="font-bold text-zinc-900 text-sm">Category</h3>
                <button
                  onClick={() => triggerAddForm(3)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 text-white hover:bg-zinc-800 rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <Plus size={14} />
                  <span>إضافة</span>
                </button>
              </div>

              {!selectedSubId ? (
                <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs text-center p-4">
                  يرجى اختيار فئة فرعية لعرض الفئات
                </div>
              ) : childCategories.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs">
                  لا يوجد فئات أخيرة.
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {childCategories.map((cat) => {
                    const isSelected = selectedChildId === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedChildId(cat.id)}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isSelected ? 'bg-zinc-50 border-r-4 border-zinc-950' : 'hover:bg-gray-50/50'
                          }`}
                      >
                        <span className="text-sm font-semibold text-zinc-800">
                          {translateCategoryName(cat.name)}
                        </span>

                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => triggerEditForm(cat, 3)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-zinc-900"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Form Panel (Right Side, floating or inline drawer) */}
          {formOpen && (
            <div className="w-80 border-r border-gray-200 bg-white shadow-lg overflow-y-auto flex flex-col p-6 animate-in slide-in-from-left duration-250">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                <button
                  onClick={() => setFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  &times;
                </button>
                <h3 className="font-bold text-zinc-900 text-base">
                  {formLevel === 1 ? 'Main Category' : formLevel === 2 ? 'Sub Category' : 'Category'}
                </h3>
              </div>

              <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col gap-5 justify-between">
                <div className="flex flex-col gap-4">
                  {/* Name field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500">
                      {formLevel === 1 ? 'اسم الفئة الرئيسية' : formLevel === 2 ? 'اسم الفئة الفرعية' : 'اسم الفئة'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      placeholder={formLevel === 1 ? 'أدخل اسم الفئة الرئيسية' : formLevel === 2 ? 'أدخل اسم الفئة الفرعية' : 'أدخل اسم الفئة'}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-zinc-800 focus:outline-none focus:border-zinc-950 text-right"
                    />
                  </div>

                  {/* Description field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500">الوصف (اختياري)</label>
                    <textarea
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      placeholder={formLevel === 1 ? 'أدخل وصف الفئة الرئيسية' : formLevel === 2 ? 'أدخل وصف الفئة الفرعية' : 'أدخل وصف الفئة'}
                      rows={3}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-zinc-800 focus:outline-none focus:border-zinc-950 text-right resize-none"
                    />
                  </div>

                  {/* Image upload field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500">الصورة (اختياري)</label>
                    <label className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors gap-2 min-h-[140px] relative overflow-hidden">
                      {formImageUrl ? (
                        <>
                          <img src={formImageUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-xs text-white font-bold bg-zinc-900/60 px-3 py-1.5 rounded-full">تغيير الصورة</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                          <p className="text-center text-[10px] text-gray-400 font-semibold leading-tight">
                            اختر صورة (JPG, PNG) <br />
                            (الحد الأقصى 2MB)
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Hero Images for Super Hero Section (Only for Main Categories / Level 1) */}
                  {formLevel === 1 && (
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="text-xs font-bold text-gray-500">
                        صور السوبر هيرو سكشن (Super Hero Images)
                      </label>
                      
                      {/* Grid of current hero images */}
                      {formHeroImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 border border-gray-150 p-2 rounded-xl bg-gray-50 max-h-[140px] overflow-y-auto">
                          {formHeroImages.map((img, index) => (
                            <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                              <img src={img} alt="Hero" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setFormHeroImages(prev => prev.filter((_, idx) => idx !== index))}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                              >
                                حذف
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add new image URL or upload */}
                      <div className="flex flex-col gap-1">
                        <label className="border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors gap-1 text-[11px] text-gray-400 font-semibold">
                          <Plus className="w-4 h-4 text-gray-400" />
                          <span>إضافة صورة هيرو جديدة</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 2 * 1024 * 1024) {
                                toast.error('حجم الصورة كبير جداً، الحد الأقصى 2 ميجابايت');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormHeroImages(prev => [...prev, reader.result as string]);
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 border-t border-gray-100 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:text-zinc-900 font-bold transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    <span>حفظ</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default AdminCategories;
