import React from "react";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, onClick, onAddToCart }) => {
  return (
    <div
      onClick={onClick}
      className="relative bg-white/70 backdrop-blur-lg rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 group"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 ${
            product.stock === 0 ? "opacity-60" : ""
          }`}
        />
        {/* Out of Stock Label */}
        {product.stock === 0 ? (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            نفذت الكمية / Out of Stock
          </span>
        ) : (product.stock ?? 999) <= 5 ? (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            متبقي {product.stock} فقط / Only {product.stock} left
          </span>
        ) : null}
        
        {/* Top Label */}
        {product.label && (
          <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {product.label}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {product.name}
        </h3>

        {/* Bestseller Tag */}
        {product.isBestseller && (
          <p className="text-xs text-yellow-600 font-semibold mt-1">
            #1 Bestseller in {product.category}
          </p>
        )}

        {/* Price & Sales */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-900 font-bold text-base">
            ج.م {product.price.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">{product.sold || 0}+ sold</p>
        </div>
      </div>

      {/* Add to cart icon */}
      {product.stock !== 0 ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-3 right-3 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition shadow"
        >
          <ShoppingCart size={18} />
        </button>
      ) : (
        <div className="absolute bottom-3 right-3 bg-gray-200 text-gray-400 p-2 rounded-full cursor-not-allowed">
          <ShoppingCart size={18} />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
