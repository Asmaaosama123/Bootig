import React from 'react';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

interface SuccessPageProps {
  onGoHome: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-14">
            <h1 className="text-base font-semibold text-gray-900">
              Order Confirmation
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" strokeWidth={2} />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Order Placed Successfully
          </h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Thank you for your order! We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="w-full max-w-sm bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Order Number</p>
              <p className="text-sm font-semibold text-gray-900">#{Math.floor(Math.random() * 1000000)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={onGoHome}
            className="w-full bg-black text-white py-3 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            className="w-full bg-white text-gray-900 py-3 rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            View Order Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;