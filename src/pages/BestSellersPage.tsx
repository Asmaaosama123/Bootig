import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";
import api from "../services/api";

const BestSellersPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName?: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const { state } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const cat = (categoryName || "woman").toLowerCase();
    api.get(`/products/category/${cat}`)
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .catch((err) => console.error("Error fetching best sellers:", err))
      .finally(() => setLoading(false));
  }, [categoryName]);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/70 rounded-lg shadow-sm hover:shadow-md transition flex items-center justify-center"
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

          <h1 className="text-lg font-semibold capitalize">
            {categoryName ? `${categoryName} Best Sellers` : "Best Sellers"}
          </h1>

          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 bg-white/70 rounded-lg shadow-sm hover:shadow-md transition flex items-center justify-center"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {state.items.reduce((total, item) => total + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {state.items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-white/60 backdrop-blur-sm px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <svg
            className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z"
            />
          </svg>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-4 flex justify-center py-8">
            <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((p) => {
            const priceNum = Number(p.price || 0);
            const [whole, decimal] = priceNum.toFixed(2).split(".");
            return (
              <div
                key={p.id || p._id}
                onClick={() => navigate(`/product/${p.id || p._id}`)}
                className="cursor-pointer overflow-hidden hover:scale-105 transition transform bg-transparent"
              >
                <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
                  <img
                    src={p.imageUrl || p.image || "https://via.placeholder.com/300"}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-left mt-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>

                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-xl font-semibold text-gray-900 leading-none">
                      {whole}
                      <span className="text-xs align-top ml-0.5 text-gray-500">
                        .{decimal}
                      </span>
                    </span>
                    <span className="text-[10px] text-gray-500 mb-[1px]">MRU</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-4 text-center text-gray-400 py-8">
            لا توجد منتجات حالياً
          </div>
        )}
      </div>

      <BottomNav
        cartItemCount={state.items.reduce(
          (total, item) => total + item.quantity,
          0
        )}
      />
    </div>
  );
};

export default BestSellersPage;
