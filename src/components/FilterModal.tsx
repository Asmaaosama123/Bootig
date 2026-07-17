// src/components/FilterModal.tsx
import React from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  stores: string[];
  cases: string[];
  shippedOptions: string[];
  selectedStores: string[];
  selectedCases: string[];
  selectedShipped: string[];
  priceRange: [number, number];
  onFilterChange: (field: string, value: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  stores,
  cases,
  shippedOptions,
  selectedStores,
  selectedCases,
  selectedShipped,
  priceRange,
  onFilterChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
      <div className="w-4/5 max-w-xs bg-white h-full p-4 overflow-y-auto shadow-xl rounded-l-2xl">
        <h2 className="text-lg font-semibold mb-3">Filter Options</h2>

        {/* Stores */}
        <div className="mb-4">
          <p className="font-medium mb-2">Stores</p>
          {stores.map((store) => (
            <label key={store} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectedStores.includes(store)}
                onChange={() => onFilterChange("store", store)}
              />
              {store}
            </label>
          ))}
        </div>

        {/* Case */}
        <div className="mb-4">
          <p className="font-medium mb-2">Condition</p>
          {cases.map((c) => (
            <label key={c} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectedCases.includes(c)}
                onChange={() => onFilterChange("case", c)}
              />
              {c}
            </label>
          ))}
        </div>

        {/* Shipping */}
        <div className="mb-4">
          <p className="font-medium mb-2">Shipping Time</p>
          {shippedOptions.map((s) => (
            <label key={s} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectedShipped.includes(s)}
                onChange={() => onFilterChange("shipped", s)}
              />
              {s}
            </label>
          ))}
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <p className="font-medium mb-2">Price Range</p>
          <input
            type="range"
            min={0}
            max={1000}
            value={priceRange[1]}
            onChange={(e) => onFilterChange("price", [0, +e.target.value])}
          />
          <p className="text-sm text-gray-600">Up to {priceRange[1]} MRU</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onReset}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Apply
          </button>
        </div>

        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 text-lg">
          ✕
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
