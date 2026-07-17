import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Settings } from 'lucide-react';
import api from '../services/api';
import { Product } from '../types';

interface SellerPageProps {
  sellerId: string;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  onOpenSettings?: () => void;
  isOwner?: boolean;
}

const SellerPage: React.FC<SellerPageProps> = ({
  sellerId,
  onBack,
  onAddToCart,
  onToggleFavorite,
  onOpenSettings,
  isOwner = false
}) => {
  // tabs were present in the original design; currently omitted for simplicity
  const [vendor, setVendor] = useState<{ storeName?: string; storeDescription?: string } | null>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sellerId) return;
    setLoading(true);
    setError(null);
    api.get(`/api/products/vendor/${sellerId}`)
      .then((res) => {
        setVendor(res.data.vendor || null);
        setSellerProducts(res.data.products || []);
      })
      .catch((err) => {
        console.error('Failed to load seller data', err);
        setError('Failed to load seller data');
        setVendor(null);
        setSellerProducts([]);
      })
      .finally(() => setLoading(false));
  }, [sellerId]);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={onBack}
              className="flex items-center text-gray-900 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-gray-900">{vendor?.storeName || 'Store'}</h1>
            {isOwner && onOpenSettings ? (
              <button
                onClick={onOpenSettings}
                className="flex items-center text-gray-900 hover:text-gray-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-5"></div>
            )}
          </div>
        </div>
      </div>
        <div className="relative h-32 bg-gray-200">
          {/* Use a cover image from the first product if available, otherwise fallback */}
          <img
            src={sellerProducts[0]?.images?.[0] || '/src/assets/cover-placeholder.png'}
            alt="Store cover"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm -mt-8 relative z-10 p-4">
            <div className="flex items-start gap-4">
              <img
                src={sellerProducts[0]?.images?.[0] || '/src/assets/avatar-placeholder.png'}
                alt={vendor?.storeName || 'store'}
                className="w-20 h-20 rounded-xl border-4 border-white shadow-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900">{vendor?.storeName || 'Store'}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-primary fill-current" />
                    <span className="text-sm font-semibold text-gray-900 ml-1">{/* rating placeholder */}4.8</span>
                  </div>
                  <span className="text-xs text-gray-500">{/* reviews placeholder */}(120 reviews)</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">{vendor?.storeDescription}</div>
              </div>
              <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                +Follow
              </button>
            </div>
          </div>

          <div className="mt-6">
            {loading && <div className="text-center py-6">Loading...</div>}
            {error && <div className="text-center text-red-500 py-6">{error}</div>}

            {!loading && !error && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {sellerProducts.map((product) => (
                    <div key={product._id || product.id} className="bg-white overflow-hidden">
                      <div className="relative" style={{ aspectRatio: '3 / 4' }}>
                        <img src={product.images?.[0] || product.image || ''} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="pt-2 pb-3 px-2">
                        <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                        <div className="text-xs text-gray-500 mt-1">${product.price?.toFixed?.(2) ?? product.price}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <button onClick={() => onAddToCart(product)} className="px-2 py-1 bg-gray-100 rounded text-xs">Add</button>
                          <button onClick={() => onToggleFavorite(product)} className="px-2 py-1 text-xs text-gray-500">♡</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default SellerPage;
