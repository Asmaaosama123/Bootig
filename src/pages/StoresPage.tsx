import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Search, ShoppingCart } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";
import api from "../services/api";

const StoresPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName?: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const { state } = useCart();

  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load active parent categories for filtering
  useEffect(() => {
    api.get("/getActiveCategories")
      .then((res) => {
        setCategories(res.data.categories || []);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch stores dynamically from API
  useEffect(() => {
    setLoading(true);
    api.get("/getStores")
      .then((res) => {
        setStores(res.data.stores || []);
      })
      .catch((err) => console.error("Error fetching stores:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredStores = stores.filter(
    (store) =>
      (!categoryName ||
        store.tagline.toLowerCase() === categoryName.toLowerCase()) &&
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (productId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="sticky top-0 bg-white z-50 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h1 className="text-base font-semibold uppercase tracking-wide">
            Stores
          </h1>

          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {state.items.reduce((total, item) => total + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {state.items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 flex items-center gap-3">
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 flex-1">
          <Search className="text-gray-400 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search stores..."
            className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={categoryName || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              navigate("/stores");
            } else {
              navigate(`/stores/${encodeURIComponent(val.toLowerCase())}`);
            }
          }}
          className="border border-gray-200 rounded-full bg-white text-sm px-3 py-2 outline-none text-gray-700 uppercase"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <main className="p-4 space-y-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div
              key={store.id}
              className="overflow-hidden cursor-pointer bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div
                className="flex items-center gap-4 p-4"
                onClick={() => navigate(`/store/${store.id}`)}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                  <img
                    src={store.image || "https://via.placeholder.com/150"}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-800 font-semibold leading-tight">
                      {store.name}
                    </p>
                    <p className="text-sm text-gray-400 leading-tight uppercase">
                      {store.tagline}
                    </p>
                  </div>
                  <ChevronRight className="text-gray-500 w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-4 border-t border-gray-100">
                {store.products && store.products.length > 0 ? (
                  store.products.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex flex-col items-center justify-start p-3 border-r border-gray-100 last:border-none hover:bg-gray-50 transition-colors"
                      onClick={(e) => handleProductClick(product.id, e)}
                    >
                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
                        <img
                          src={product.image || "https://via.placeholder.com/150"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mt-2 leading-none text-center">
                        {product.price} MRU
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 py-4 text-center text-xs text-gray-400">
                    لا توجد منتجات معروضة حاليًا
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No stores found.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                navigate("/stores");
              }}
              className="text-blue-600 text-sm mt-2 hover:text-blue-700"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      <BottomNav
        cartItemCount={state.items.reduce(
          (total, item) => total + item.quantity,
          0
        )}
      />
    </div>
  );
};

export default StoresPage;
