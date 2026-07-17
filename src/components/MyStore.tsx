// MyStore.tsx
import React, { useEffect, useState } from "react";
import { ChevronLeft, Trash2, LogOut, Settings, Camera, Upload } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

type ProductType = {
  _id: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  isOffer?: boolean;
  images?: string[];
  image?: string;
  imageUrl?: string;
  description?: string;
  sizes?: string[];
  colors?: string[] | { name: string }[];
  subcategory?: string;
  status?: string;
  stock?: number;
};

const MyStore: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("offers");
  const [stats, setStats] = useState({ products: 0, sales: 0, profits: 0 });
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showLowStockSheet, setShowLowStockSheet] = useState(false);

  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  const [editStoreName, setEditStoreName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editLogo, setEditLogo] = useState<string | null>(null);
  const [editCover, setEditCover] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("تم تسجيل الخروج بنجاح");
  };
  const newProduct: ProductType | undefined = (location.state as any)?.newProduct;
  const updatedProduct: ProductType | undefined = (location.state as any)?.updatedProduct;
  const initialTab = (location.state as any)?.selectedTab || "offers";

  // set initial tab if navigated with one
  useEffect(() => {
    if (initialTab) setSelectedTab(initialTab);
  }, [initialTab]);

  // fetch products and stats from API
  const fetchStoreData = async () => {
    try {
      const productsRes = await api.get('/products/myproducts');
      const fetchedProducts = productsRes.data.products || [];
      setAllProducts(fetchedProducts);
      setProducts(filterByTab(fetchedProducts, selectedTab));

      const statsRes = await api.get('/vendor/stats');
      setStats(statsRes.data);

      await fetchProfile();
    } catch (err) {
      console.error('Error fetching store data:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/vendor/profile');
      setEditStoreName(res.data.storeName || "");
      setEditDescription(res.data.storeDescription || "");
      setEditUsername(res.data.username || "");
      setEditPhone(res.data.phone || "");
      setEditLogo(res.data.logoUrl || null);
      setEditCover(res.data.coverUrl || null);
    } catch (err) {
      console.error("Error fetching vendor profile:", err);
    }
  };

  const startEditProfile = async () => {
    setShowSettingsDropdown(false);
    setIsEditingProfile(true);
    setLoadingProfile(true);
    try {
      await fetchProfile();
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          setEditLogo(reader.result as string);
        } else {
          setEditCover(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProfile(true);
    try {
      await api.put('/vendor/profile', {
        storeName: editStoreName,
        storeDescription: editDescription,
        username: editUsername,
        phone: editPhone,
        logoUrl: editLogo,
        coverUrl: editCover
      });
      toast.success("تم حفظ الملف الشخصي بنجاح");
      setIsEditingProfile(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حفظ الملف الشخصي");
    } finally {
      setSubmittingProfile(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  // handle incoming new product (from AddProduct)
  useEffect(() => {
    if (newProduct) {
      fetchStoreData();
      // clean state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [newProduct]);

  // handle incoming updated product (from EditProduct)
  useEffect(() => {
    if (updatedProduct) {
      fetchStoreData();
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedProduct]);

  // --- handle tab change ---
  useEffect(() => {
    setProducts(filterByTab(allProducts, selectedTab));
  }, [selectedTab, allProducts]);

  function filterByTab(list: ProductType[], tab: string) {
    const isOffer = (p: ProductType) => p.isOffer === true || (p.originalPrice != null && Number(p.originalPrice) > Number(p.price));
    
    if (tab === "offers") {
      return list.filter(isOffer);
    }
    
    // For other tabs, exclude offers and filter by category
    const baseList = list.filter((p) => !isOffer(p));
    return baseList.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      // Normalize: women/woman, men/man match the same tab
      const tabNorm = tab.toLowerCase();
      if (tabNorm === "women") return cat === "woman" || cat === "women";
      if (tabNorm === "men") return cat === "man" || cat === "men";
      return cat === tabNorm;
    });
  }

  // Compute dynamic tabs: always "offers" first, then unique categories from products
  const dynamicTabs = React.useMemo(() => {
    const catSet = new Set<string>();
    allProducts.forEach((p) => {
      const isOffer = p.isOffer === true || (p.originalPrice != null && Number(p.originalPrice) > Number(p.price));
      if (!isOffer && p.category) {
        // Normalize women/woman → women, men/man → men
        const cat = p.category.toLowerCase();
        if (cat === "woman" || cat === "women") catSet.add("women");
        else if (cat === "man" || cat === "men") catSet.add("men");
        else catSet.add(cat);
      }
    });
    return ["offers", ...Array.from(catSet)];
  }, [allProducts]);

  // --- Step 1: show confirmation modal ---
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPendingDeleteId(id);
  };

  // --- Step 2: confirmed delete ---
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await api.delete(`/products/${id}`);
      setDeletedId(id);
      toast.success("تم حذف المنتج بنجاح");

      setTimeout(() => {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setAllProducts((prev) => prev.filter((p) => p._id !== id));
        setDeletedId(null);
        setStats((prev) => ({ ...prev, products: Math.max(0, prev.products - 1) }));
      }, 300);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حذف المنتج");
    }
  };

  // navigate to edit page
  const goToEdit = (product: ProductType) => {
    navigate(`/edit-product/${product._id}`, { state: { product } });
  };
  

  if (isEditingProfile) {
    return (
      <div className="min-h-screen bg-white flex flex-col px-6 pt-10 pb-24 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <ChevronLeft
            className="w-6 h-6 cursor-pointer text-gray-700"
            onClick={() => setIsEditingProfile(false)}
          />
          <h1 className="text-base font-bold mx-auto font-sans tracking-wide">EDITE PROFILE</h1>
        </div>

        {loadingProfile ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 py-20">
            <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
            <span className="text-sm">جاري جلب البيانات...</span>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            {/* Images section */}
            <div className="relative mb-10">
              {/* Cover Upload */}
              <label className="relative border border-dashed border-gray-300 flex flex-col items-center justify-center h-36 overflow-hidden cursor-pointer bg-gray-50/50">
                {editCover ? (
                  <img src={editCover} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-gray-400">
                    <div className="w-10 h-10 border border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                      <span className="text-lg font-bold">+</span>
                    </div>
                    <span className="text-[10px] font-bold font-sans">UPLOAD COVER IMAGE</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e, 'cover')} className="hidden" />
              </label>

              {/* Logo Upload - Overlayed bottom-left */}
              <div className="absolute -bottom-6 left-4 z-10">
                <label className="relative border border-dashed border-gray-300 flex flex-col items-center justify-center h-16 w-16 overflow-hidden cursor-pointer bg-white shadow-sm">
                  {editLogo ? (
                    <img src={editLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-8 h-8 border border-dashed border-gray-300 flex items-center justify-center rounded-lg">
                        <span className="text-sm font-bold">+</span>
                      </div>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e, 'logo')} className="hidden" />
                </label>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4 mt-2">
              <h2 className="text-xs font-bold text-gray-400 tracking-wider">DETAILS</h2>
              
              <div className="flex flex-col gap-1.5 text-right" dir="rtl">
                <label className="text-xs font-semibold text-gray-500">اسم المتجر (STORE NAME)</label>
                <input 
                  value={editStoreName} 
                  onChange={(e) => setEditStoreName(e.target.value)} 
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black text-right" 
                  placeholder="STORE NAME"
                  required 
                />
              </div>

              <div className="flex flex-col gap-1.5 text-right" dir="rtl">
                <label className="text-xs font-semibold text-gray-500">الوصف (DESCRIPTION)</label>
                <textarea 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm h-24 resize-none focus:outline-none focus:border-black text-right" 
                  placeholder="DESCRIPTION (OPTIONAL)"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-right" dir="rtl">
                <label className="text-xs font-semibold text-gray-500">اسم المستخدم (USERNAME)</label>
                <input 
                  value={editUsername} 
                  onChange={(e) => setEditUsername(e.target.value)} 
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black text-right" 
                  placeholder="USERNAME"
                  required 
                />
              </div>

              <div className="flex flex-col gap-1.5 text-right" dir="rtl">
                <label className="text-xs font-semibold text-gray-500">رقم الهاتف (PHONE)</label>
                <input 
                  value={editPhone} 
                  onChange={(e) => setEditPhone(e.target.value)} 
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black text-right" 
                  placeholder="PHONE"
                  required 
                />
              </div>
            </div>

            <button type="submit" disabled={submittingProfile} className="w-full bg-black text-white py-3.5 text-sm font-bold disabled:bg-gray-400 transition-all mt-4">
              {submittingProfile ? "SAVING..." : "SAVE"}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-10 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <ChevronLeft
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-bold">DASHBOARD</h1>
        <div className="relative">
          <button
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            className="p-1 text-gray-700 hover:text-black transition-colors"
            title="الإعدادات"
          >
            <Settings className="w-5 h-5" />
          </button>

          {showSettingsDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-xl rounded-lg py-1 z-50 text-right">
              <button
                onClick={startEditProfile}
                className="w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 justify-end font-semibold"
              >
                <span>تعديل الحساب</span>
              </button>
              <button
                onClick={() => {
                  setShowSettingsDropdown(false);
                  handleLogout();
                }}
                className="w-full px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 justify-end font-semibold border-t border-gray-100"
              >
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 overflow-hidden mb-5 border border-black">
        <div className="bg-white py-6 px-4 text-center border-r border-black">
          <p className="text-sm font-medium text-gray-500 mb-1 tracking-wide">PRODUCTS</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.products}</p>
          <p className="text-xs text-gray-400">ITEMS</p>
        </div>

        <div className="bg-white py-6 px-4 text-center border-r border-black">
          <p className="text-sm font-medium text-gray-500 mb-1 tracking-wide">SALES</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.sales}</p>
          <p className="text-xs text-gray-400">MRU</p>
        </div>

        {/* LOW STOCK — clickable */}
        <button
          onClick={() => setShowLowStockSheet(true)}
          className="bg-white py-6 px-4 text-center w-full transition-colors hover:bg-orange-50 active:bg-orange-100"
        >
          <p className="text-sm font-medium text-orange-500 mb-1 tracking-wide">LOW STOCK</p>
          <p className={`text-2xl font-bold mb-1 ${
            allProducts.filter(p => (p.stock ?? 999) <= 5).length > 0 ? 'text-orange-600' : 'text-gray-900'
          }`}>
            {allProducts.filter(p => (p.stock ?? 999) <= 5).length}
          </p>
          <p className="text-xs text-orange-400">ITEMS</p>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-5">
        <button
          onClick={() => navigate("/add-product")}
          className="w-1/2 border border-black py-3 text-sm font-semibold"
        >
          ADD NEW PRODUCT
        </button>
        <button
          onClick={() => navigate("/add-offer")}
          className="w-1/2 border border-black py-3 text-sm font-semibold"
        >
          ADD NEW OFFER
        </button>
      </div>

      {/* Tabs — dynamic based on store's actual products */}
      <div className="flex gap-3 mb-10 overflow-x-auto no-scrollbar">
        {dynamicTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-10 py-2 text-sm font-medium whitespace-nowrap ${
              selectedTab === tab ? "bg-black text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-3 justify-start mb-6 px-1">
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-100/80 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>نشط</span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-100/80 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>غير نشط</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-y-12 gap-x-6">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => goToEdit(product)}
            className={`flex flex-col product-card cursor-pointer transition-all duration-300 ${
              deletedId === product._id ? "opacity-0 scale-90" : ""
            }`}
          >
            <div className="bg-gray-100 rounded-xl w-full h-44 mb-4 overflow-hidden relative">
              <img
                src={product.imageUrl || product.image || (product.images && product.images[0]) || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div 
                className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-sm border ${
                  product.status === 'available'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                }`}
                title={product.status === 'available' ? 'نشط' : 'غير نشط'}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[10px] font-sans font-semibold tracking-normal">{product.status === 'available' ? 'ACTIVE' : 'INACTIVE'}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700 truncate">
                {product.name || "PRODUCT NAME"}
              </p>
              <button
                onClick={(e) => handleDeleteClick(e, product._id)}
                className="bg-red-600 text-white p-2 rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm font-semibold mt-1 text-gray-800">
              {product.price ?? 0} MRU
            </p>
          </div>
        ))}
      </div>
      {/* Premium Animated Delete Confirmation Modal */}
      <AnimatePresence>
        {pendingDeleteId && (
          <motion.div
            key="delete-backdrop"
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setPendingDeleteId(null)}
          >
            {/* Blurred dark overlay */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Bottom sheet card */}
            <motion.div
              className="relative w-full max-w-sm bg-white rounded-t-3xl overflow-hidden shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Red accent top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-red-400 via-red-600 to-red-400" />

              {/* Drag handle */}
              <div className="flex justify-center pt-4 pb-1">
                <div className="w-10 h-[3px] rounded-full bg-gray-200" />
              </div>

              <div className="px-7 pt-4 pb-8">
                {/* Icon */}
                <motion.div
                  className="flex justify-center mb-4"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                      <Trash2 className="w-7 h-7 text-red-500" />
                    </div>
                    {/* pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-red-300"
                      animate={{ scale: [1, 1.18, 1], opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                    />
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div
                  className="text-center mb-6"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-2">حذف المنتج</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    هل أنت متأكد من حذف هذا المنتج؟
                    <br />
                    <span className="text-red-400 font-medium">لا يمكن التراجع عن هذا الإجراء.</span>
                  </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                  className="flex gap-3"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    onClick={() => setPendingDeleteId(null)}
                    className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    إلغاء
                  </button>
                  <motion.button
                    onClick={confirmDelete}
                    className="flex-1 py-3.5 rounded-xl bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors"
                    whileTap={{ scale: 0.96 }}
                  >
                    حذف
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Low Stock Bottom Sheet */}
      <AnimatePresence>
        {showLowStockSheet && (
          <motion.div
            key="lowstock-backdrop"
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setShowLowStockSheet(false)}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative w-full max-w-sm bg-white rounded-t-3xl overflow-hidden shadow-2xl max-h-[75vh] flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Orange accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300" />

              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-[3px] rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                <span className="text-xs text-orange-400 font-semibold tracking-widest">LOW STOCK</span>
                <h2 className="text-base font-bold text-gray-900">منتجات قاربت تخلص</h2>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {allProducts.filter(p => (p.stock ?? 999) <= 5).length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-3xl mb-2">✅</p>
                    <p className="text-sm font-semibold">كل المنتجات مخزونها كويس!</p>
                  </div>
                ) : (
                  allProducts
                    .filter(p => (p.stock ?? 999) <= 5)
                    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
                    .map(product => (
                      <button
                        key={product._id}
                        onClick={() => {
                          setShowLowStockSheet(false);
                          goToEdit(product);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-orange-100 bg-orange-50/50 hover:bg-orange-100 transition-colors text-right"
                      >
                        {/* Product image */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={product.imageUrl || product.image || (product.images && product.images[0]) || "https://via.placeholder.com/100"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate text-right">{product.name || "منتج"}</p>
                          <p className="text-xs text-gray-500 text-right">{product.price ?? 0} MRU</p>
                        </div>

                        {/* Stock badge */}
                        <div className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
                          (product.stock ?? 0) === 0
                            ? 'bg-red-100 text-red-600'
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {(product.stock ?? 0) === 0 ? 'نفذ' : `${product.stock ?? 0} متبقي`}
                        </div>
                      </button>
                    ))
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => setShowLowStockSheet(false)}
                  className="w-full py-3 bg-black text-white text-sm font-bold rounded-xl"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyStore;
