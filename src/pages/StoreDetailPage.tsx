import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Share2, Search, ShoppingCart } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";
import api from "../services/api";
import { toast } from "react-hot-toast";

const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useCart();

  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!storeId) return;
    setLoading(true);
    api.get(`/products/vendor/${storeId}`)
      .then((res) => {
        setStore(res.data.vendor || {});
        const prods = res.data.products || [];
        setProducts(prods);

        // Dynamically compute unique categories/subcategories
        const uniqueCats = [...new Set(prods.map((p: any) => p.subcategory || p.category || "General"))] as string[];
        if (uniqueCats.length > 0) {
          setSelectedCategory(uniqueCats[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch store details:", err);
        toast.error("حدث خطأ أثناء تحميل بيانات المتجر");
      })
      .finally(() => setLoading(false));
  }, [storeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="p-4 text-center text-gray-500">Store not found</div>
    );
  }

  // Get dynamic categories list
  const categoriesList = [...new Set(products.map((p: any) => p.subcategory || p.category || "General"))] as string[];

  // Filter products by selectedCategory and searchTerm
  const filteredProducts = products.filter((p) => {
    const catMatch = !selectedCategory || (p.subcategory || p.category || "General") === selectedCategory;
    const searchMatch = !searchTerm.trim() || p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return catMatch && searchMatch;
  });

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const newItem = {
      id: `${product.id || product._id}-default-default`,
      product: {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        store: store.storeName,
        image: product.imageUrl || product.image,
        images: product.images && product.images.length > 0 ? product.images : [product.imageUrl || product.image],
        description: product.description,
        sizes: product.sizes || [],
        colors: product.colors || []
      },
      quantity: 1,
      size: product.sizes?.[0] || "Default",
      color: typeof product.colors?.[0] === "string" ? product.colors[0] : (product.colors?.[0]?.name || "Default")
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
    toast.success("تمت إضافة المنتج إلى السلة");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 🏪 Cover section */}
      <div className="relative w-full h-52 md:h-60">
        <img
          src={store.coverUrl || "https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=800"}
          alt={store.storeName}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Top Bar */}
        <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          {/* Search */}
          <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full px-3 py-2 w-2/3 shadow-sm">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search in store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 ml-2"
            />
          </div>

          <button className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("تم نسخ رابط المتجر");
          }}>
            <Share2 className="w-5 h-5 text-gray-800" />
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm relative"
          >
            <ShoppingCart className="w-5 h-5 text-gray-850" />
            {state.items.reduce((total, item) => total + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {state.items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Store info */}
        <div className="absolute bottom-3 left-4 flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden border-2 border-white shadow-lg">
            <img
              src={store.logoUrl || "https://via.placeholder.com/150"}
              alt={store.storeName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight drop-shadow">
              {store.storeName}
            </h2>
            <p className="text-gray-200 text-xs mt-0.5">
              {products.length} products
            </p>
          </div>
        </div>
      </div>

      {/* 🧩 Category bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto gap-3 px-4 py-3 scrollbar-hide">
          {categoriesList.map((cat, idx) => {
            const firstCatProduct = products.find((p: any) => (p.subcategory || p.category || "General") === cat);
            const catImg = firstCatProduct?.imageUrl || firstCatProduct?.image || "https://via.placeholder.com/100";
            return (
              <div
                key={idx}
                className="flex-shrink-0 w-16 text-center cursor-pointer"
                onClick={() => setSelectedCategory(cat)}
              >
                <div
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                    selectedCategory === cat
                      ? "border-black"
                      : "border-gray-200"
                  } bg-gray-100 mb-1`}
                >
                  <img
                    src={catImg}
                    alt={cat}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className={`text-[10px] font-semibold uppercase truncate ${
                    selectedCategory === cat
                      ? "text-black"
                      : "text-gray-600"
                  }`}
                >
                  {cat}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🛍️ Products grid */}
      <div className="px-3 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p.id || p._id}
              onClick={() => navigate(`/product/${p.id || p._id}`)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="aspect-[4/5] bg-gray-100 relative">
                <img
                  src={p.imageUrl || p.image || "https://via.placeholder.com/300"}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-700 line-clamp-2">{p.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm font-semibold text-gray-900">
                    {p.price} MRU
                  </span>
                  <button 
                    onClick={(e) => handleAddToCart(e, p)}
                    className="bg-black text-white p-1.5 rounded-md hover:bg-gray-800 transition"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            لا توجد منتجات في هذا القسم.
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        cartItemCount={state.items.reduce(
          (total, item) => total + item.quantity,
          0
        )}
      />
    </div>
  );
};

export default StoreDetailPage;
