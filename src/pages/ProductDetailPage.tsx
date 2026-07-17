// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Heart,
  Share,
  ShoppingBag,
  Minus,
  Plus,
  Store,
  ShoppingCart,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";
import api from "../services/api";
import { toast } from "react-hot-toast";

const colorValueMap: Record<string, string> = {
  white: "#FFFFFF",
  black: "#000000",
  gray: "#808080",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#008000",
  pink: "#FFC0CB",
  yellow: "#FFFF00",
  navy: "#1E3A8A"
};

const getColorCode = (name: string) => {
  return colorValueMap[name.toLowerCase()] || "#CCCCCC";
};

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isAdding, setIsAdding] = useState(false);
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setQuantity(1);
    api.get(`/products/${productId}`)
      .then((res) => {
        const p = res.data;
        setProduct(p);
        if (p.sizes?.length) setSelectedSize(p.sizes[0]);
        if (p.colors?.length) {
          const firstColor = p.colors[0];
          setSelectedColor(typeof firstColor === "string" ? firstColor : firstColor.name);
        }

        // Fetch related offers dynamically
        if (p.category) {
          api.get(`/getOffersByCategory/${p.category.toLowerCase()}`)
            .then((offerRes) => {
              setOfferProducts(offerRes.data.products || []);
            })
            .catch((err) => console.error("Error fetching related offers:", err));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch product details:", err);
        toast.error("حدث خطأ أثناء تحميل تفاصيل المنتج");
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Loading product...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    const productImages = product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl || product.image || "https://via.placeholder.com/300"];

    const newItem = {
      id: `${product.id || product._id}-${selectedSize}-${selectedColor}`,
      product: {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        store: product.store,
        image: productImages[0],
        images: productImages,
        description: product.description,
        sizes: product.sizes || [],
        colors: product.colors || []
      },
      quantity,
      size: selectedSize || "Default",
      color: selectedColor || "Default",
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
    toast.success("تمت إضافة المنتج إلى السلة");
    setTimeout(() => setIsAdding(false), 1000);
  };

  const goToStore = () => {
    if (product.storeId) {
      navigate(`/store/${product.storeId}`);
    } else {
      toast.error("رابط المتجر غير متوفر");
    }
  };

  const goToOffers = () => navigate("/OffersPage");

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl || product.image || "https://via.placeholder.com/300"];

  return (
    <div className="flex flex-col min-h-screen bg-white relative pb-[120px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
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

        <h2 className="text-base font-semibold uppercase tracking-wide truncate max-w-[200px]">
          {product.name}
        </h2>

        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => toast.success("تم الحفظ في المفضلة")} />
          <Share className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("تم نسخ رابط المنتج");
          }} />
          <button
            onClick={() => navigate("/cart")}
            className="relative p-1 text-gray-600 hover:text-yellow-500 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            {state.items.reduce((total, item) => total + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold">
                {state.items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={productImages[activeImageIndex]}
          alt={product.name}
          className="w-full h-[350px] object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-yellow-600 font-bold text-2xl">{product.price} MRU</p>
          {product.originalPrice && (
            <p className="text-red-500 line-through text-sm">{product.originalPrice} MRU</p>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <h4 className="font-semibold mb-1 text-gray-700 text-sm uppercase">Description</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Color Selector */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-gray-700 text-sm uppercase">Color</h4>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.colors.map((c: any, index: number) => {
                const colorName = typeof c === "string" ? c : c.name;
                const isSelected = selectedColor === colorName;
                return (
                  <div key={colorName} className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        setSelectedColor(colorName);
                        setActiveImageIndex(index < productImages.length ? index : 0);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                        isSelected
                          ? "border-black scale-105"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: getColorCode(colorName) }}
                      title={colorName}
                    >
                      {isSelected && (
                        <span className={`w-2 h-2 rounded-full ${colorName.toLowerCase() === "white" ? "bg-black" : "bg-white"}`} />
                      )}
                    </button>
                    <span className="text-[10px] text-gray-500 mt-1 uppercase">{colorName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-gray-700 text-sm uppercase">Size</h4>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`border text-sm font-medium px-3 py-1 rounded-md transition ${
                    selectedSize === s
                      ? "border-yellow-500 bg-yellow-100 text-yellow-700"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 bg-gray-200 rounded-full"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 bg-gray-200 rounded-full"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Store Button */}
        <button
          onClick={goToStore}
          className="flex items-center justify-between w-full border-t border-b border-gray-200 py-3"
        >
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">{product.store}</span>
          </div>
          <span className="text-gray-400 font-bold text-lg">&gt;</span>
        </button>

        {/* Offers Section */}
        {offerProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-800">Hot Offers</h4>
              <button
                onClick={goToOffers}
                className="text-yellow-600 text-sm font-semibold"
              >
                View All
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {offerProducts.map((offer) => (
                <div
                  key={offer._id || offer.id}
                  onClick={() => navigate(`/product/${offer._id || offer.id}`)}
                  className="min-w-[160px] bg-gray-50 rounded-xl shadow-sm p-2 cursor-pointer hover:shadow-md transition"
                >
                  <img
                    src={offer.imageUrl || offer.image || "https://via.placeholder.com/300"}
                    alt={offer.name}
                    className="w-full h-[140px] object-cover rounded-lg"
                  />
                  <p className="font-semibold text-gray-800 mt-1 truncate">
                    {offer.name}
                  </p>
                  <div className="flex gap-2 items-center">
                    <span className="text-yellow-600 font-bold">
                      {offer.price} MRU
                    </span>
                    {offer.originalPrice && (
                      <span className="text-red-500 line-through text-xs">
                        {offer.originalPrice} MRU
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add to Cart */}
      <div className="fixed bottom-[60px] left-0 right-0 bg-white px-4 py-3 border-t border-gray-200 shadow-md">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-semibold text-white transition ${
            isAdding
              ? "bg-yellow-400 cursor-wait"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {isAdding ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              Adding...
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
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

export default ProductDetailPage;