// src/pages/OffersPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";
import FilterModal from "../components/FilterModal";
import { SlidersHorizontal } from "lucide-react";
import api from "../services/api";



const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // فلتر
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [selectedShipped, setSelectedShipped] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const storeOptions = [...new Set(offerProducts.map((p) => p.store))];
  const caseOptions = [...new Set(offerProducts.map((p) => p.caseType || "New"))];
  const shippedOptions = [...new Set(offerProducts.map((p) => p.shippedIn || "One Week"))];

  // Fetch all offers dynamically from API
  useEffect(() => {
    setLoading(true);
    api.get(`/getOffersByCategory/all`)
      .then((res) => {
        setOfferProducts(res.data.products || []);
      })
      .catch((err) => {
        console.error("Failed to fetch offers from API", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Client side search and filters
  useEffect(() => {
    let temp = offerProducts;

    if (searchTerm.trim()) {
      temp = temp.filter((p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStores.length > 0) {
      temp = temp.filter((p) => selectedStores.includes(p.store));
    }
    if (selectedCases.length > 0) {
      temp = temp.filter((p) => selectedCases.includes(p.caseType || "New"));
    }
    if (selectedShipped.length > 0) {
      temp = temp.filter((p) => selectedShipped.includes(p.shippedIn || "One Week"));
    }
    temp = temp.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(temp);
  }, [offerProducts, searchTerm, selectedStores, selectedCases, selectedShipped, priceRange]);

  const applyFilters = () => {
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setSelectedStores([]);
    setSelectedCases([]);
    setSelectedShipped([]);
    setPriceRange([0, 1000]);
  };

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      {/* Header */}
      <div className="sticky top-0 bg-white z-50 shadow-sm border-b">
        <div className="flex justify-between items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="font-semibold text-lg">Products on Offer</h1>

          <div className="w-9" />
        </div>
      </div>

      {/* Search + Filter Button */}
      <div className="px-4 mt-3 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-gray-200 outline-none"
        />
        <button
          onClick={() => setFilterOpen(true)}
          className="ml-3 flex items-center gap-1 px-3 py-2 bg-gray-900 text-white rounded-full shadow-sm hover:bg-gray-800 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filter</span>
        </button>
      </div>

      {/* Products */}
      <div className="px-4 py-6 grid grid-cols-2 gap-4">
        {loading && (
          <div className="col-span-2 flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
          </div>
        )}
        {!loading && filteredProducts.length === 0 && (
          <div className="col-span-2 text-center text-gray-400 py-8">
            لا توجد عروض في هذا القسم
          </div>
        )}
        {!loading && filteredProducts.map((p) => (
          <div
            key={p._id || p.id}
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate(`/product/${p._id || p.id}`)}
          >
            <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
              <img src={p.imageUrl || p.image} alt={p.name} className="w-full h-full object-cover" />
              {p.originalPrice && p.originalPrice > p.price && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
            <p className="text-sm mt-2 font-medium">{p.name}</p>
            <div className="flex items-center gap-2">
              {p.originalPrice && <span className="text-xs line-through text-gray-400">MRU {p.originalPrice}</span>}
              <span className="text-base font-semibold text-gray-900">MRU {p.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        onReset={resetFilters}
        stores={storeOptions}
        cases={caseOptions}
        shippedOptions={shippedOptions}
        selectedStores={selectedStores}
        selectedCases={selectedCases}
        selectedShipped={selectedShipped}
        priceRange={priceRange}
        onFilterChange={(field, value) => {
          if (field === "store") {
            setSelectedStores(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]);
          } else if (field === "case") {
            setSelectedCases(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]);
          } else if (field === "shipped") {
            setSelectedShipped(prev => prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]);
          } else if (field === "price") {
            setPriceRange(value);
          }
        }}
      />

      <BottomNav cartItemCount={state.items.reduce((total, item) => total + item.quantity, 0)} />
    </div>
  );
};

export default OffersPage;
