// في ملف src/pages/CartPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
import { useCart, CartItem } from "../contexts/CartContext";
import BottomNav from "../components/BottomNav";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch, getCartTotal } = useCart();

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // إذا كانت الكمية 0، احذف المنتج
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity: newQuantity } });
    }
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const proceedToCheckout = () => {
    if (state.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  const continueShopping = () => {
    navigate("/");
  };

  // حساب التوفير
  const calculateSavings = () => {
    return state.items.reduce((total, item) => {
      if (item.product.originalPrice) {
        return total + ((item.product.originalPrice - item.product.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  const savings = calculateSavings();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const total = getCartTotal();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="flex items-center p-4 bg-white shadow-sm sticky top-0 z-50">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-lg">Shopping Cart</h1>
          <div className="w-10"></div>
        </div>

        {/* Empty Cart */}
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
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
      {/* Header */}
      <div className="flex items-center p-4 bg-white shadow-sm sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center font-semibold text-lg">Shopping Cart</h1>
        <button 
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {savings > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-red-600" />
              <span className="text-xs font-semibold text-red-900">
                You're saving {savings.toFixed(2)} MRU on this order!
              </span>
            </div>
          </div>
        )}

        {/* Group items by store */}
        {Array.from(new Set(state.items.map(item => item.product.store))).map(store => (
          <div key={store} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Store Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm">{store}</h3>
            </div>

            {/* Store Items */}
            <div className="divide-y divide-gray-200">
              {state.items.filter(item => item.product.store === store).map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Size and Color */}
                      {(item.size || item.color) && (
                        <div className="flex gap-2 mb-3">
                          {item.size && (
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium border-x border-gray-300 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="flex items-center gap-1.5">
                            {item.product.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                ${(item.product.originalPrice * item.quantity).toFixed(2)}
                              </span>
                            )}
                            <span className="font-bold text-black text-base">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ${item.product.price} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white border-t border-gray-200 mt-6 sticky bottom-0">
        <div className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
          </div>
          
          {savings > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Savings</span>
              <span className="font-medium text-green-600">-${savings.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm border-t pt-3">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-green-600">FREE</span>
          </div>

          <div className="flex justify-between items-center border-t pt-3">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <div className="text-right">
              <div className="text-xl font-bold text-black">${total.toFixed(2)}</div>
              {savings > 0 && (
                <div className="text-xs text-gray-500">
                  Original: ${(total + savings).toFixed(2)}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={proceedToCheckout}
            className="w-full bg-black hover:bg-gray-800 text-white py-3.5 rounded-lg font-semibold transition-all transform active:scale-98 shadow-md mt-4"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <BottomNav cartItemCount={itemCount} />
    </div>
  );
};

export default Cart;