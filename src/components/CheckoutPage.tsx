// src/components/CheckoutPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import BottomNav from "../components/BottomNav";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { ShoppingBag, ArrowRight } from "lucide-react";

export interface OrderData {
  shippingAddress: {
    address: string;
    city: string;
  };
}

// -------- Success Screen --------
const SuccessScreen: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const [show, setShow] = useState(false);
  const [ring1, setRing1] = useState(false);
  const [ring2, setRing2] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    setTimeout(() => setRing1(true), 400);
    setTimeout(() => setRing2(true), 700);
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 px-6">
      {/* Animated rings */}
      <div className="relative flex items-center justify-center mb-8">
        <span
          className={`absolute rounded-full border-4 border-green-100 transition-all duration-700 ${
            ring2 ? "w-40 h-40 opacity-100" : "w-0 h-0 opacity-0"
          }`}
        />
        <span
          className={`absolute rounded-full border-4 border-green-200 transition-all duration-700 ${
            ring1 ? "w-28 h-28 opacity-100" : "w-0 h-0 opacity-0"
          }`}
        />
        <div
          className={`relative w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg transition-all duration-500 ${
            show ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div
        className={`text-center transition-all duration-700 delay-500 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">تم الطلب بنجاح! 🎉</h1>
        <p className="text-gray-500 text-sm mb-1">Order placed successfully</p>
        <p className="text-gray-400 text-xs">سيتواصل معك فريقنا قريباً لتأكيد طلبك</p>
      </div>

      <div
        className={`flex gap-6 my-8 transition-all duration-700 delay-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center"
            style={{ animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite` }}
          >
            <ShoppingBag className="w-5 h-5 text-yellow-500" />
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className={`flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-semibold text-sm shadow-lg hover:bg-gray-800 transition-all duration-700 delay-1000 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        متابعة التسوق
        <ArrowRight className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

// -------- Main Checkout --------
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, getCartTotal, dispatch } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState("");
  const [promo, setPromo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = 100;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please fill in your address");
      return;
    }
    if (state.items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = state.items.map((item) => ({
        productId: item.product.id || item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        selectedSize: item.size || null,
        selectedColor: item.color || null,
      }));

      const payload = {
        orderItems,
        shippingAddress: {
          address: address.trim(),
          city: address.trim(),
        },
        paymentMethod: "CASH ON DELIVERY",
        totalPrice: total,
      };

      await api.post("/orders", payload);
      dispatch({ type: "CLEAR_CART" });
      setOrderSuccess(true);
    } catch (error: any) {
      console.error("Failed to place order:", error);
      const errorMsg = error.response?.data?.message || "Failed to place order. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return <SuccessScreen onContinue={() => navigate("/category/woman")} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-2 bg-white shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-sm font-bold text-gray-900">PAYMENT</h1>
        <div className="w-6" />
      </header>

      {/* Main Content */}
      <div className="flex-1 px-3 py-2 space-y-2 text-xs overflow-auto">
        {/* Address Section - address only */}
        <section className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">ADDRESS</h2>
          <input
            type="text"
            placeholder="ADDRESS"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 p-1.5 rounded-md focus:ring-1 focus:ring-yellow-400 outline-none text-xs"
          />
        </section>

        {/* Payment Method */}
        <section className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">PAYMENT METHOD</h2>
          <div className="flex items-center justify-between border border-gray-300 rounded-md p-2 cursor-pointer hover:border-yellow-400 transition text-xs">
            <span className="font-semibold text-gray-900">CASH ON DELIVERY</span>
            <span className="w-3.5 h-3.5 rounded-sm bg-yellow-400 border border-yellow-500" />
          </div>
        </section>

        {/* Summary */}
        <section className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm space-y-1 text-xs">
          <div className="flex justify-between font-semibold text-gray-900">
            <span>SUBTOTAL:</span>
            <span>{subtotal} MRU</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900">
            <span>DELIVERY:</span>
            <span>{deliveryFee} MRU</span>
          </div>
          <div className="flex justify-between font-bold text-green-600 text-sm">
            <span>TOTAL:</span>
            <span>{total} MRU</span>
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="CODE PROMO"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              className="flex-1 bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 p-1.5 rounded-md focus:ring-1 focus:ring-yellow-400 outline-none text-xs"
            />
            <button className="px-3 py-1.5 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition text-xs">
              APPLY
            </button>
          </div>
        </section>
      </div>

      {/* Confirm Button + BottomNav */}
      <div className="relative">
        <div className="px-3 py-2 bg-gray-50">
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full bg-yellow-400 text-black font-bold text-xs py-2 rounded-lg hover:bg-yellow-500 transition-all mb-14 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "PROCESSING..." : "CONFIRM"}
          </button>
        </div>

        <div className="fixed bottom-0 left-0 w-full z-50">
          <BottomNav
            cartItemCount={state.items.reduce((total, item) => total + item.quantity, 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
