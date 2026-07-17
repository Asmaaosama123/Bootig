import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BottomNav from './BottomNav';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
}

interface MyOrdersProps {
  onBack: () => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/orders/customer');
        setOrders(response.data || []);
      } catch (err: any) {
        console.error('Failed to fetch customer orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'In Transit';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending Payment';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-900 hover:text-gray-600 transition-colors p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-gray-900">My Orders</h1>
            <div className="w-9"></div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="w-full max-w-7xl mx-auto px-4 py-4 flex-1">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            <p className="text-sm text-gray-500">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center px-4">
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center mt-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">No orders yet</h3>
            <p className="text-sm text-gray-500">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl overflow-hidden border border-gray-150 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-gray-300">|</span>
                    <span className="text-xs text-gray-900 font-medium">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold uppercase ${
                    order.status === 'delivered' ? 'text-green-600' :
                    order.status === 'shipped' ? 'text-blue-600' :
                    order.status === 'processing' ? 'text-orange-600' :
                    'text-gray-605'
                  }`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={item.id}>
                      <div className="flex gap-3">
                        <img
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100 border border-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                            {item.name}
                          </h4>
                          {(item.color || item.size) && (
                            <p className="text-xs text-gray-500 mb-1">
                              {item.color && `Color: ${item.color}`}
                              {item.color && item.size && ' | '}
                              {item.size && `Size: ${item.size}`}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {item.price} MRU
                            </span>
                          </div>
                        </div>
                      </div>
                      {idx < order.items.length - 1 && (
                        <div className="border-t border-gray-100 mt-3"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 mr-2">Total:</span>
                      <span className="text-base font-bold text-gray-900">
                        {order.total} MRU
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default MyOrders;