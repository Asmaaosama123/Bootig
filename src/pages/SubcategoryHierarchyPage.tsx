// src/pages/SubcategoryHierarchyPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, SlidersHorizontal, ShoppingCart } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useCart } from "../contexts/CartContext";
import FilterModal from "../components/FilterModal";
import api from "../services/api";

const SubcategoryHierarchyPage: React.FC = () => {
  const { categoryName, subcategoryName } = useParams<{ categoryName?: string; subcategoryName?: string }>();
  const navigate = useNavigate();
  const { state } = useCart();

  const [subcategories, setSubcategories] = useState<{ name: string; imageUrl: string }[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [subSubcategories, setSubSubcategories] = useState<{ name: string; imageUrl: string }[]>([]);
  const [selectedSubSub, setSelectedSubSub] = useState<string>("");
  const [allSubProducts, setAllSubProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [selectedShipped, setSelectedShipped] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Load subcategories under the main active category
  useEffect(() => {
    if (!categoryName) return;
    const cat = categoryName.toLowerCase();
    api.get(`/getSubCategories/${cat}`)
      .then((res) => {
        const subs = res.data.subcategories || [];
        setSubcategories(subs);
        if (subcategoryName) {
          const matched = subs.find(
            (s: any) => s.name.toLowerCase() === subcategoryName.toLowerCase()
          );
          if (matched) {
            setSelectedSubcategory(matched.name);
            return;
          }
        }
        if (subs.length > 0) {
          setSelectedSubcategory(subs[0].name);
        }
      })
      .catch((err) => console.error("Error fetching subcategories:", err));
  }, [categoryName, subcategoryName]);

  // Load sub-sub-categories when selected subcategory changes
  useEffect(() => {
    if (!categoryName || !selectedSubcategory) return;
    const cat = categoryName.toLowerCase();
    api.get(`/getSubSubCategories/${cat}/${selectedSubcategory}`)
      .then((res) => {
        const subs = res.data.subcategories || [];
        setSubSubcategories(subs);
        setSelectedSubSub(""); // reset sub-sub selection
      })
      .catch(() => {
        setSubSubcategories([]);
        setSelectedSubSub("");
      });
  }, [categoryName, selectedSubcategory]);

  // Fetch products when selected subcategory changes
  useEffect(() => {
    if (!categoryName || !selectedSubcategory) return;
    setLoading(true);
    const cat = categoryName.toLowerCase();
    api.get(`/products/category/${cat}?subcategoryName=${selectedSubcategory}`)
      .then((res) => {
        const prods = res.data.products || [];
        setAllSubProducts(prods);
        setFilteredProducts(prods);
      })
      .catch((err) => console.error("Error fetching subcategory products:", err))
      .finally(() => setLoading(false));

    // Reset filters
    setSelectedStores([]);
    setSelectedCases([]);
    setSelectedShipped([]);
    setPriceRange([0, 1000]);
    setSelectedSubSub("");
  }, [categoryName, selectedSubcategory]);

  const storeOptions = [...new Set(allSubProducts.map((p) => p.store || "Zara"))];
  const caseOptions = ["New", "Used"];
  const shippedOptions = ["One Day", "One Week", "Three Weeks"];

  // Filter products locally
  useEffect(() => {
    let temp = [...allSubProducts];

    if (selectedSubSub.trim()) {
      temp = temp.filter(p => (p.subSubcategory || p.subsubcategory || "").toLowerCase() === selectedSubSub.toLowerCase());
    }
    if (searchTerm.trim()) {
      temp = temp.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedStores.length > 0) {
      temp = temp.filter(p => selectedStores.includes(p.store));
    }
    if (selectedCases.length > 0) {
      temp = temp.filter(p => selectedCases.includes(p.caseType || "New"));
    }
    if (selectedShipped.length > 0) {
      temp = temp.filter(p => selectedShipped.includes(p.shippedIn || "One Week"));
    }
    temp = temp.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(temp);
  }, [allSubProducts, selectedSubSub, searchTerm, selectedStores, selectedCases, selectedShipped, priceRange]);

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
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white z-50 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-semibold uppercase tracking-wide">{selectedSubcategory || categoryName || "Collection"}</h1>
          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {state.items.reduce((total, item) => total + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {state.items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Subcategories Slider */}
        <div className="flex gap-4 overflow-x-auto px-4 pb-3 scrollbar-hide bg-white">
          {subcategories.map((sub) => (
            <div key={sub.name} onClick={() => setSelectedSubcategory(sub.name)} className="flex flex-col items-center cursor-pointer flex-shrink-0">
              <div className={`w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition ${selectedSubcategory === sub.name ? "border-black" : "border-gray-200"}`}>
                <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" />
              </div>
              <p className={`text-[11px] mt-1.5 text-center uppercase font-semibold w-[72px] truncate ${selectedSubcategory === sub.name ? "text-black" : "text-gray-500"}`}>{sub.name}</p>
            </div>
          ))}
        </div>

        {/* Sub-Sub-Categories Row (only shown if they exist) */}
        {subSubcategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => setSelectedSubSub("")}
              className={`flex-shrink-0 px-3 py-1 text-[11px] font-semibold uppercase border transition ${
                selectedSubSub === ""
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              الكل
            </button>
            {subSubcategories.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedSubSub(s.name)}
                className={`flex-shrink-0 px-3 py-1 text-[11px] font-semibold uppercase border transition ${
                  selectedSubSub === s.name
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search + Filter Button */}
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-100">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setFilterOpen(true)}
          className="ml-3 flex items-center gap-1 px-3 py-2 bg-gray-900 text-white rounded-full shadow-sm hover:bg-gray-800 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filter</span>
        </button>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        onReset={resetFilters}
        stores={storeOptions || []}
        cases={caseOptions || []}
        shippedOptions={shippedOptions || []}
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

      {/* Products */}
      <div className="px-4 py-5 grid grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 flex justify-center py-8">
            <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id || p._id} className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate(`/product/${p.id || p._id}`)}
            >
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-xl">
                <img src={p.imageUrl || p.image || "https://via.placeholder.com/300"} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-medium mt-2 truncate w-full">{p.name}</p>
              <p className="text-sm font-semibold">{p.price} MRU</p>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-400 py-8">
            لا توجد منتجات في هذا القسم حاليًا
          </div>
        )}
      </div>

      <BottomNav cartItemCount={state.items.reduce((total, item) => total + item.quantity, 0)} />
    </div>
  );
};

export default SubcategoryHierarchyPage;
