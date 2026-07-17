import React from "react";
import { Home, Store, User, ClipboardList } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

interface BottomNavProps {
  cartItemCount?: number; // kept for compatibility if passed in other files, though not rendered in bottom nav
  onCartClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onStoresClick?: () => void;
  onOrdersClick?: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({
  cartItemCount = 0,
  onCartClick,
  onProfileClick,
  onHomeClick,
  onStoresClick,
  onOrdersClick,
}) => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath.startsWith(path);

  const handleProfileClick = () => {
    onProfileClick?.();
    navigate("/profile");
  };

  const handleHomeClick = () => {
    onHomeClick?.();
    navigate("/category/women");
  };

  const handleStoresClick = () => {
    onStoresClick?.();
    navigate("/stores");
  };

  const handleOrdersClick = () => {
    onOrdersClick?.();
    navigate("/orders");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-sm">
      <div
        className={`w-full max-w-7xl mx-auto flex items-center justify-around py-2 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center p-2 transition-colors ${
            currentPath === "/" || isActive("/category") ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
        >
          <Home className="w-6 h-6" />
        </button>

        {/* Stores */}
        <button
          onClick={handleStoresClick}
          className={`flex flex-col items-center p-2 transition-colors ${
            isActive("/stores") || isActive("/store") ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
        >
          <Store className="w-6 h-6" />
        </button>

        {/* Orders */}
        <button
          onClick={handleOrdersClick}
          className={`flex flex-col items-center p-2 transition-colors ${
            isActive("/orders") ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
        >
          <ClipboardList className="w-6 h-6" />
        </button>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center p-2 transition-colors ${
            isActive("/profile") ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
        >
          <User className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
