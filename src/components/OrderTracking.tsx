import React from 'react';
import { Check, Clock, Truck, MapPin } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingProps {
  order: Order;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const getStatusIcon = (status: string, currentStatus: string) => {
    const isCompleted = ['preparing', 'ready', 'out_for_delivery', 'delivered']
      .indexOf(status) <= ['preparing', 'ready', 'out_for_delivery', 'delivered']
      .indexOf(currentStatus);
    
    const isActive = status === currentStatus;

    if (isCompleted) {
      return <Check className="w-6 h-6 text-green-600" />;
    }
    if (isActive) {
      return <Clock className="w-6 h-6 text-orange-600 animate-pulse" />;
    }
    return <div className="w-6 h-6 rounded-full bg-gray-300" />;
  };

  const statusSteps = [
    { key: 'preparing', label: 'Preparing your order', icon: Clock },
    { key: 'ready', label: 'Ready for pickup', icon: Check },
    { key: 'out_for_delivery', label: 'Out for delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: MapPin },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
          <p className="text-gray-600">{order.restaurantName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Estimated delivery</p>
          <p className="font-semibold text-orange-600">{order.estimatedDelivery}</p>
        </div>
      </div>

      <div className="space-y-4">
        {statusSteps.map((step, index) => (
          <div key={step.key} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getStatusIcon(step.key, order.status)}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${
                step.key === order.status ? 'text-orange-600' : 
                statusSteps.findIndex(s => s.key === step.key) < 
                statusSteps.findIndex(s => s.key === order.status) ? 'text-green-600' : 'text-gray-400'
              }`}>
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <h4 className="font-medium mb-2">Order Items</h4>
        <div className="space-y-1 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;