import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  // `isFavorite` can be passed either as a boolean (pre-computed) or as a function that accepts an id
  isFavorite?: ((productId: string) => boolean) | boolean;
  onToggleFavorite?: (product: Product) => void;
  // new handler to view seller/store page
  onViewSeller?: (sellerId: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onAddToCart,
  cartItemCount = 0,
  onCartClick,
  isFavorite: isFavoriteProp,
  onToggleFavorite,
  onViewSeller
}) => {
  const [quantity, setQuantity] = useState(1);
  const productKey = product._id || product.id || '';
  // Handle both cases: consumer may pass a boolean or a function (App.tsx passes a boolean)
  let isProductFavorite = false;
  if (typeof isFavoriteProp === 'function') {
    try {
      isProductFavorite = Boolean(isFavoriteProp(productKey));
    } catch {
      // Defensive: avoid throwing inside render
      isProductFavorite = false;
    }
  } else {
    isProductFavorite = Boolean(isFavoriteProp);
  }

  // Normalize image and price values from backend shape using typed fields
  const mainImage = (product.images && product.images.length > 0) ? product.images[0] : (product.image ?? '');
  const priceNum = Number(product.price ?? 0);
  const originalPriceNum = typeof product.originalPrice === 'number' ? product.originalPrice : undefined;
  const description = product.description ?? product.name ?? '';
  const vendorId = product.vendor?._id || product.vendor?.id || '';

  return (
    <div className="min-h-screen bg-white">
      {/* Image-first view: image occupies the initial viewport height */}
      <div className="w-full h-screen bg-gray-50 overflow-hidden relative">
        <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4">
          <button onClick={onBack} className="bg-white/80 rounded-full p-2 shadow">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-3">
          <button onClick={() => onToggleFavorite?.(product)} className="bg-white/80 rounded-full p-2 shadow">
            <Heart className={`w-5 h-5 ${isProductFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button onClick={onCartClick} className="bg-white/80 rounded-full p-2 shadow relative">
            <ShoppingCart className="w-5 h-5 text-gray-900" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Details below the fold */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 pb-24">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h1 className="text-xl font-semibold text-gray-900">{product.name}</h1>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">${Number.isFinite(priceNum) ? priceNum.toFixed(2) : '0.00'}</div>
              {typeof originalPriceNum === 'number' && Number.isFinite(originalPriceNum) && (
                <div className="text-sm text-gray-500 line-through">${originalPriceNum.toFixed(2)}</div>
              )}
            </div>
            <div>
              {product.stock === 0 ? (
                <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">نفذت الكمية / Out of Stock</span>
              ) : (product.stock ?? 999) <= 5 ? (
                <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">متبقي {product.stock} فقط / Only {product.stock} left</span>
              ) : (
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-md">متوفر / In Stock</span>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-700">
            {description}
          </div>

          {/* Seller Information */}
          {product.vendor && (
            <div className="mt-6 border-t pt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => onViewSeller && onViewSeller(vendorId)}>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {/* vendor avatar placeholder: if vendor.user and vendor.user.avatar exist, show it. otherwise show initials */}
                  {product.vendor.user && product.vendor.user.avatar ? (
                    <img src={product.vendor.user.avatar} alt={product.vendor.storeName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm font-semibold text-gray-700">{(product.vendor.storeName || 'Seller').split(' ').map((s: string) => s[0]).slice(0,2).join('')}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{product.vendor.storeName}</div>
                  {product.vendor.storeDescription && (
                    <div className="text-xs text-gray-500">{product.vendor.storeDescription}</div>
                  )}
                </div>
              </div>
              <button className="text-sm text-primary font-medium" onClick={() => onViewSeller && onViewSeller(vendorId)}>View Store →</button>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="px-3 py-2"
                disabled={product.stock === 0}
              >-</button>
              <div className="px-4 py-2 border-x">{product.stock === 0 ? 0 : quantity}</div>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="px-3 py-2"
                disabled={product.stock === 0 || quantity >= (product.stock ?? 999)}
              >+</button>
            </div>
            <button 
              onClick={() => product.stock !== 0 && onAddToCart(product, quantity)} 
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                product.stock === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {product.stock === 0 ? 'نفذت الكمية / Out of Stock' : 'Add to Bag'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;