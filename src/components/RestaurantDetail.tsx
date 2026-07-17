import React from 'react';
import { ArrowLeft, Star, Clock, Truck, Plus } from 'lucide-react';
import { Restaurant, MenuItem } from '../types';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  onAddToCart: (item: MenuItem) => void;
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  restaurant,
  onBack,
  onAddToCart
}) => {
  const menuCategories = [...new Set(restaurant.menu.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg opacity-90 mb-2">{restaurant.description}</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-white text-white" />
              <span>{restaurant.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Truck className="w-4 h-4" />
              <span>${restaurant.deliveryFee}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {menuCategories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
            <div className="grid gap-4">
              {restaurant.menu
                .filter(item => item.category === category)
                .map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          {item.name}
                          {item.popular && (
                            <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                        <p className="text-lg font-bold text-gray-900 mt-2">${item.price}</p>
                      </div>
                      <button
                        onClick={() => onAddToCart(item)}
                        className="bg-orange-600 text-white rounded-full p-2 hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;