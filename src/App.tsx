import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './contexts/CartContext';
import { useAuth } from './contexts/AuthContext';

import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import HeroSection from './components/HeroSection';
import { ProductSection } from './components/ProductSection';
import Cart from './components/Cart';
import BottomNav from './components/BottomNav';
import EditProduct from './pages/EditProduct';

import LoginPage from './components/LoginPage';
import VendorLoginPage from './components/VendorLoginPage';
import UserProfile from './components/UserProfile';
import MyStore from './components/MyStore';
import CheckoutPage, { OrderData as CheckoutOrderData } from './components/CheckoutPage';
import SuccessPage from './components/SuccessPage';

import BestSellersPage from './pages/BestSellersPage';
import StoresPage from './pages/StoresPage';
import OffersPage from './pages/OffersPage';
import AddProduct from './pages/AddProduct';
import AddOffer from './pages/AddOffer';
import StorePage from './pages/StoreDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CategoryHierarchyPage from './pages/CategoryHierarchyPage';
import SubcategoryHierarchyPage from './pages/SubcategoryHierarchyPage';
import AdminSellers from './pages/AdminSellers';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import MyOrders from './components/MyOrders';
import { categories, mockProducts } from './data/products';
import { Product } from './types';
import { useFavorites } from './hooks/useFavorites';

function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // const { isFavorite, toggleFavorite, isLoading: favoritesLoading } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    setProductsLoading(true);
    setTimeout(() => {
      setAllProducts(mockProducts);
      setProductsLoading(false);
    }, 600);
  }, []);

  // Cart dummy functions
  const cartItems: Product[] = [];
  const addToCart = () => {};
  const removeFromCart = () => {};
  const updateQuantity = () => {};
  const getCartItemCount = () => 0;
  const getCartTotal = () => 0;
  const isInCart = () => false;
  const clearCart = () => {};
  const cartLoading = false;

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Header
        cartItemCount={getCartItemCount()}
        onCartClick={() => setIsCartOpen(true)}
        onLogoClick={() => navigate('/')}
      />

      <CategoryNav
        categories={categories}
        selectedCategory="all"
        onCategorySelect={(slug) => navigate(`/category/${slug}`)}
      />

      <main className="bg-white">
        <HeroSection onShopNowClick={() => navigate('/best-sellers')} />
      </main>
    </div>
  );
}

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    // ✅ لودنج screen لحد ما يتحقق من localStorage
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const getHomeRedirect = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'vendor') return '/my-store';
    return '/category/woman';
  };

  return (
    <CartProvider>
      <Toaster position="top-right" />
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/vendor/login" element={<VendorLoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            {/* Redirect تلقائي حسب الدور */}
            <Route path="/" element={
              <Navigate
                to={getHomeRedirect()}
                replace
              />
            } />

            {/* إذا كان مسجل دخول وحاول يفتح صفحة اللوجن، نوجهه للرئيسية/الداشبورد */}
            <Route path="/login" element={
              <Navigate
                to={getHomeRedirect()}
                replace
              />
            } />
            <Route path="/vendor/login" element={
              <Navigate
                to={getHomeRedirect()}
                replace
              />
            } />

            {/* كل الرودز الحالية */}
            <Route path="/category/:categoryName" element={<CategoryHierarchyPage />} />
            <Route path="/category/:categoryName/:subcategoryName" element={<SubcategoryHierarchyPage />} />
            <Route path="/offers/:categoryName" element={<OffersPage />} />
            <Route path="/OffersPage" element={<OffersPage />} />
            <Route path="/best-sellers" element={<BestSellersPage />} />
            <Route path="/stores/:categoryName?" element={<StoresPage />} />
            <Route path="/store/:storeId" element={<StorePage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/profile" element={<UserProfile user={user} logout={logout} />} />
            <Route path="/orders" element={<MyOrders onBack={() => navigate('/')} />} />
            <Route path="/my-store" element={<MyStore />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/add-offer" element={<AddOffer />} />

            {/* Admin Routes */}
            {user.role === 'admin' ? (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/sellers" element={<AdminSellers />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
              </>
            ) : (
              <>
                <Route path="/admin/dashboard" element={<Navigate to={getHomeRedirect()} replace />} />
                <Route path="/admin/sellers" element={<Navigate to={getHomeRedirect()} replace />} />
                <Route path="/admin/products" element={<Navigate to={getHomeRedirect()} replace />} />
                <Route path="/admin/categories" element={<Navigate to={getHomeRedirect()} replace />} />
              </>
            )}

            {/* توجيه أي مسار غير معروف للرئيسية/الداشبورد لمنع الصفحة البيضاء */}
            <Route path="*" element={
              <Navigate
                to={getHomeRedirect()}
                replace
              />
            } />
          </>
        )}
      </Routes>
    </CartProvider>
  );
}

export default App;
