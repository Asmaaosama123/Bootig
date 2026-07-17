import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";

const categoryProducts: Record<string, any[]> = {
  woman: [
    {
      id: 1,
      name: "Elegant Floral Dress",
      price: 89.5,
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop",
    },
    {
      id: 2,
      name: "Casual Summer Dress",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop",
    },
  ],
  men: [
    {
      id: 3,
      name: "Classic Fit Shirt",
      price: 65.99,
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop",
    },
    {
      id: 4,
      name: "Casual Denim Jacket",
      price: 120.0,
      image:
        "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=600&h=600&fit=crop",
    },
  ],
  kids: [
    {
      id: 5,
      name: "Trendy Kids Sport Set",
      price: 85.5,
      image:
        "https://images.unsplash.com/photo-1520975918318-7adfa3c1b9a0?w=600&h=600&fit=crop",
    },
    {
      id: 6,
      name: "Kids Casual Outfit",
      price: 70.75,
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop",
    },
  ],
};

const BestSellersPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName?: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const { state, getCartTotal, dispatch } = useCart();

  const categoryKey = (categoryName || "woman").toLowerCase();
  const products = categoryProducts[categoryKey] || [];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              xmlns="http://www.w3.org/2000/svg"
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
        {filteredProducts.map((p) => {
          const [whole, decimal] = p.price.toFixed(2).split(".");
          return (
            <div
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              className="cursor-pointer overflow-hidden hover:scale-105 transition transform bg-transparent"
            >
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* الاسم والسعر */}
              <div className="text-left mt-2">
                <p className="text-sm font-medium text-gray-900">{p.name}</p>

                <div className="flex items-end gap-1 mt-1">
                  <span className="text-xl font-semibold text-gray-900 leading-none">
                    {whole}
                    <span className="text-xs align-top ml-0.5 text-gray-500">
                      {decimal}
                    </span>
                  </span>
                  <span className="text-[10px] text-gray-500 mb-[1px]">MRU</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav
            cartItemCount={state.items.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          />    </div>
  );
};

export default BestSellersPage;
