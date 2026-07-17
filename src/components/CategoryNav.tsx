import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import staticCategoryStructure from "../data/categories";
import { useLanguage } from "../contexts/LanguageContext";

interface CategoryNavProps {
  selectedCategory?: string;
  categories?: string[];
}

const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, categories = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRTL } = useLanguage();

  const categoriesList = categories && categories.length > 0
    ? categories
    : Object.keys(staticCategoryStructure);

  const currentCategory =
    selectedCategory ||
    (location.pathname.startsWith("/category")
      ? decodeURIComponent(location.pathname.split("/")[2] || "women")
      : "women");

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full overflow-x-auto scrollbar-hide">
        <div
          className={`flex gap-3 px-3 py-3 min-w-max border-b border-gray-300 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {categoriesList.map((cat) => {
            const isSelected = currentCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() =>
                  navigate(`/category/${encodeURIComponent(cat.toLowerCase())}`)
                }
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                  isSelected
                    ? "border-black text-black"
                    : "border-transparent text-gray-700 hover:border-gray-400"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
