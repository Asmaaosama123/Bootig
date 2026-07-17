import React from 'react';
import ProductGrid from './ProductGrid';
import { Product } from '../types';

interface ProductSectionProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isInCart: (productId: string) => boolean;
  isFavorite: (productId: string) => boolean;
  isLoading?: boolean;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onProductClick?: (product: Product) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  onAddToCart,
  onToggleFavorite,
  isInCart,
  isFavorite,
  isLoading = false,
  showViewAll = false,
  onViewAll,
  onProductClick
}) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
        {showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-gray-700 hover:text-black transition flex items-center gap-1"
          >
            View All
            <span className="text-lg">→</span>
          </button>
        )}
      </div>
      <ProductGrid
        products={products}
        onAddToCart={onAddToCart}
        onToggleFavorite={onToggleFavorite}
        isInCart={isInCart}
        isFavorite={isFavorite}
        isLoading={isLoading}
        onProductClick={onProductClick || (() => {})}
      />
    </div>
  );
};