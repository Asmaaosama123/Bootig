// src/pages/OffersPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";
import FilterModal from "../components/FilterModal";
import { SlidersHorizontal } from "lucide-react";
import api from "../services/api";

const offerProducts: Record<string, any[]> = {
  woman: [
    {
      id: 1,
      name: "Floral Maxi Dress",
      price: 89.99,
      originalPrice: 120.0,
      store: "Zara",
      caseType: "New",
      shippedIn: "One Week",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop",
    },
    {
      id: 2,
      name: "Casual Linen Dress",
      price: 79.5,
      originalPrice: 99.0,
      store: "H&M",
      caseType: "Used",
      shippedIn: "One Day",
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=600&fit=crop",
    },
  ],
  men: [
    {
      id: 3,
      name: "Denim Jacket",
      price: 95.99,
      originalPrice: 130.0,
      store: "Pull&Bear",
      caseType: "New",
      shippedIn: "Three Weeks",
      image:
        "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=600&h=600&fit=crop",
    },
    {
      id: 4,
      name: "Cotton Polo Shirt",
      price: 59.99,
      originalPrice: 85.0,
      store: "H&M",
      caseType: "Used",
      shippedIn: "One Month",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop",
    },
  ],
  kids: [
    {
      id: 5,
      name: "Kids Sport Set",
      price: 75.5,
      originalPrice: 95.0,
      store: "Zara Kids",
      caseType: "New",
      shippedIn: "One Week",
      image:
        "https://images.unsplash.com/photo-1520975918318-7adfa3c1b9a0?w=600&h=600&fit=crop",
    },
    {
      id: 6,
      name: "Kids Summer Outfit",
      price: 65.0,
      originalPrice: 85.0,
      store: "Mango Kids",
      caseType: "Used",
      shippedIn: "One Day",
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop",
    },
  ],
};

const categories = [
  { name: "Woman", img: "https://images.unsplash.com/photo-1520975918318-7adfa3c1b9a0?w=400" },
  { name: "Men", img: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=400" },
  { name: "Kids", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400" },
  { name: "Shoes", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400" },
];

const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName?: string }>();
  const { state } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryName || "woman");
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

  // Fetch offers dynamically from API
  useEffect(() => {
    setLoading(true);
    // Convert e.g. "Woman" -> "woman", "Men" -> "men", "Kids" -> "kids"
    const cat = selectedCategory.toLowerCase();
    api.get(`/getOffersByCategory/${cat}`)
      .then((res) => {
        setOfferProducts(res.data.products || []);
      })
      .catch((err) => {
        console.error("Failed to fetch offers from API", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory]);

  // Reset filters when category changes
  useEffect(() => {
    setSelectedStores([]);
    setSelectedCases([]);
    setSelectedShipped([]);
    setPriceRange([0, 1000]);
  }, [selectedCategory]);

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
    // Handled dynamically by useEffect above
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

          <h1 className="font-semibold text-lg capitalize">{selectedCategory}</h1>

          <button></button>
        </div>

        {/* Category Scroll */}
        <div className="flex overflow-x-auto gap-4 px-4 pb-3">
          {categories.map((c, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedCategory(c.name);
                navigate(`/offers/${c.name.toLowerCase()}`);
              }}
              className={`flex-shrink-0 cursor-pointer text-center ${
                selectedCategory.toLowerCase() === c.name.toLowerCase()
                  ? "opacity-100"
                  : "opacity-60"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${
                  selectedCategory.toLowerCase() === c.name.toLowerCase()
                    ? "border-black"
                    : "border"
                }`}
              >
                <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <p
                className={`text-xs mt-1 ${
                  selectedCategory.toLowerCase() === c.name.toLowerCase()
                    ? "text-black font-semibold"
                    : "text-gray-600"
                }`}
              >
                {c.name}
              </p>
            </div>
          ))}
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
