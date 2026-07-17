import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Store,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import BottomNav from "../components/BottomNav";
import toast from "react-hot-toast";
import { stores } from "../data/storesData";


const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch, getCartTotal } = useCart();

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch({ type: "REMOVE_ITEM", payload: productId });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, quantity: newQuantity },
      });
      toast.success("تم تحديث الكمية 🛍️", { duration: 1000 });
    }
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
    toast.error("تم حذف المنتج ❌", { duration: 1000 });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast("تم حذف جميع المنتجات 🧺", {
      icon: "🗑️",
      duration: 1200,
    });
  };

  const proceedToCheckout = () => {
    if (state.items.length === 0) {
      toast.error("سلتك فارغة 😅");
      return;
    }
    navigate("/checkout");
  };

  const continueShopping = () => {
    navigate("/category/women");
  };

  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const total = getCartTotal();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="flex items-center p-4 bg-white shadow-sm sticky top-0 z-50">
        <button
  onClick={() => navigate(-1)}
  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
>
  <svg
    className="w-5 h-5 text-gray-700"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
</button>

          <h1 className="flex-1 text-center font-semibold text-lg">
            Shopping Cart
          </h1>
          <div className="w-10"></div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button
            onClick={continueShopping}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
          >
            Start Shopping
          </button>
        </div>

        <BottomNav cartItemCount={itemCount} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="flex items-center p-4 bg-white shadow-sm sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center font-semibold text-lg">
          Shopping Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="p-4 space-y-4">
        {Array.from(new Set(state.items.map((item) => item.product.store))).map(
          (store) => (
            <div
              key={store}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* ✅ متجر قابل للضغط + سهم */}
              <div
                className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                  const targetStore = stores.find((s) => s.name === store);
                  if (targetStore) navigate(`/store/${targetStore.id}`);
                }}
                                >
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">{store}</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* ✅ منتجات المتجر */}
              <div className="divide-y divide-gray-200">
                {state.items
                  .filter((item) => item.product.store === store)
                  .map((item) => (
                    <div key={item.id} className="p-3">
                      <div className="flex gap-3">
                        <div
                          className="flex-shrink-0 cursor-pointer"
                          onClick={() => navigate(`/product/${item.product.id}`)}
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3
                              className="font-medium text-gray-900 text-sm line-clamp-2 flex-1 mr-2 cursor-pointer hover:text-gray-700 transition"
                              onClick={() =>
                                navigate(`/product/${item.product.id}`)
                              }
                            >
                              {item.product.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 p-1 transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <span className="text-base font-bold text-black">
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}
                                <span className="p-1 text-base font-semibold text-gray-500">
                                  MRU
                                </span>
                              </span>
                            </div>

                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="px-2 py-1 hover:bg-gray-50 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 py-1 text-sm font-medium border-x border-gray-300 min-w-[30px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="px-2 py-1 hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        )}
      </div>

      <div className="bg-white border-t border-gray-200 mt-6 sticky bottom-0">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <div className="text-right">
              <div className="text-xl font-bold text-black">
                {total.toFixed(2)}
                <span className="text-base font-semibold text-gray-500"> MRU</span>
              </div>
            </div>
          </div>

          <button
            onClick={proceedToCheckout}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-all transform active:scale-98 shadow-md"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <BottomNav cartItemCount={itemCount} />
    </div>
  );
};

export default CartPage;
