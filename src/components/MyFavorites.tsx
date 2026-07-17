import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MyFavoritesProps {
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  favorites?: Product[];
  onRemoveFavorite?: (productId: string) => void;
  onClearAllFavorites?: () => void;
}

const MyFavorites: React.FC<MyFavoritesProps> = ({ 
  onBack, 
  onAddToCart, 
  favorites = [],
  onRemoveFavorite,
  onClearAllFavorites
}) => {
  const { t, isRTL } = useLanguage();

  const removeFavorite = (productId: string) => {
    if (onRemoveFavorite) {
      onRemoveFavorite(productId);
    }
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    // Show success feedback
    const button = document.querySelector(`[data-product-id="${product.id}"] .add-to-cart-btn`);
    if (button) {
      button.textContent = 'Added!';
      setTimeout(() => {
        button.textContent = 'Add to Cart';
      }, 2000);
    }
  };

  const handleClearAll = () => {
    if (onClearAllFavorites && favorites.length > 0) {
      if (confirm('Are you sure you want to clear all favorites?')) {
        onClearAllFavorites();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              <span className="hidden sm:inline">{t('common.back')}</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">{t('favorites.title')}</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('favorites.empty')}</h3>
            <p className="text-gray-600">{t('favorites.emptyDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div key={product.id} data-product-id={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500 font-bold">
                        {product.price} MRU
                      </span>
                      {product.originalPrice && (
                        <span className="text-red-500 text-sm line-through">
                          {product.originalPrice} MRU
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-btn flex-1 bg-primary hover:bg-primary/90 text-black py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{t('cart.addToCart')}</span>
                    </button>
                    <button
                      onClick={() => removeFavorite(product.id)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {favorites.length > 0 && (
          <div className="mt-8 text-center">
            <button 
              onClick={handleClearAll}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-8 rounded-lg font-medium transition-colors"
            >
              {t('favorites.clearAll')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;