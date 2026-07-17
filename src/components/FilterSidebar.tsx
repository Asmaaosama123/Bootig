import React from 'react';
import { Star, X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  brands: string[];
  selectedCategory: string;
  selectedBrand: string;
  priceRange: [number, number];
  minRating: number;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  priceRange,
  minRating,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onRatingChange,
  onClearFilters
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      <div className="absolute inset-0 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />

      <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl lg:relative lg:w-full lg:shadow-none">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b lg:hidden">
            <h2 className="text-base font-semibold">Filters</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Clear Filters */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 lg:hidden">
              <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
              <button
                onClick={onClearFilters}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="border-b">
              <h4 className="text-sm font-semibold text-gray-900 px-4 py-3 bg-gray-50">Category</h4>
              <div className="px-4 py-3 space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-sm text-gray-700">{category}</span>
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-1"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="border-b">
              <h4 className="text-sm font-semibold text-gray-900 px-4 py-3 bg-gray-50">Brand</h4>
              <div className="px-4 py-3 space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-sm text-gray-700">{brand}</span>
                    <input
                      type="radio"
                      name="brand"
                      value={brand}
                      checked={selectedBrand === brand}
                      onChange={(e) => onBrandChange(e.target.value)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-1"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-b">
              <h4 className="text-sm font-semibold text-gray-900 px-4 py-3 bg-gray-50">Price Range</h4>
              <div className="px-4 py-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-medium">${priceRange[0]}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-900 font-medium">${priceRange[1]}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    [0, 50],
                    [50, 100],
                    [100, 500],
                    [500, 1000],
                    [1000, 2000]
                  ].map(([min, max]) => (
                    <button
                      key={`${min}-${max}`}
                      onClick={() => onPriceRangeChange([min, max])}
                      className={`px-3 py-1.5 text-xs border rounded-full transition-colors ${
                        priceRange[0] === min && priceRange[1] === max
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      ${min} - ${max}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="border-b">
              <h4 className="text-sm font-semibold text-gray-900 px-4 py-3 bg-gray-50">Customer Rating</h4>
              <div className="px-4 py-3 space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center justify-between cursor-pointer py-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-700 ml-2">& up</span>
                    </div>
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={minRating === rating}
                      onChange={(e) => onRatingChange(Number(e.target.value))}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-1"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;