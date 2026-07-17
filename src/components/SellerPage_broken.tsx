import React, { useState } from 'react';
import { ArrowLeft, Search, Star, MapPin, Clock, Phone, MessageCircle, Store, ChevronRight, Grid, Folder, Settings, TrendingUp, Package, Zap, MoreHorizontal, ChevronDown, ShoppingCart } from 'lucide-react';

interface SellerPageProps {
  sellerId: string;
  onBack: () => void;
  onAddToCart: (product: any) => void;
  onToggleFavorite: (product: any) => void;
  isFavorite: (productId: string) => boolean;
  onOpenSettings?: () => void;
  isOwner?: boolean;
}

const SellerPage: React.FC<SellerPageProps> = ({
  sellerId,
  onBack,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  onOpenSettings,
  isOwner = false
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'item' | 'promo' | 'review'>('item');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const seller = {
    id: sellerId,
    name: 'Fashion Paradise Store',
    avatar: 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    totalReviews: 2456,
    followers: 15420,
    totalProducts: 328,
    responseRate: 98,
    responseTime: '2 hours',
    location: 'Nouakchott, Mauritania',
    phoneNumber: '+222 12 34 56 78',
    description: 'Welcome to Fashion Paradise! We offer the latest fashion trends at unbeatable prices. Quality guaranteed on all products.',
    joinedDate: 'January 2023'
  };

  const sellerProducts = [
    {
      id: 'seller-1',
      name: 'Summer Floral Dress',
      price: 2500,
      image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'woman',
      rating: 4.7,
      sold: 234
    },
    {
      id: 'seller-2',
      name: 'Casual Denim Jacket',
      price: 3200,
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'woman',
      rating: 4.9,
      sold: 567
    },
    {
      id: 'seller-3',
      name: 'Elegant Evening Gown',
      price: 4800,
      image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'woman',
      rating: 4.8,
      sold: 189
    },
    {
      id: 'seller-4',
      name: 'Comfortable Sneakers',
      price: 2800,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'woman',
      rating: 4.6,
      sold: 432
    }
  ];

  const collections = [
    {
      id: 'col-1',
      name: 'Summer Collection',
      image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=300',
      productCount: 45,
      description: 'Bright and breezy summer styles'
    },
    {
      id: 'col-2',
      name: 'Winter Essentials',
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=300',
      productCount: 38,
      description: 'Cozy winter fashion'
    },
    {
      id: 'col-3',
      name: 'Evening Wear',
      image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=300',
      productCount: 28,
      description: 'Elegant outfits for special occasions'
    },
    {
      id: 'col-4',
      name: 'Casual Comfort',
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300',
      productCount: 52,
      description: 'Everyday comfort and style'
    }
  ];

  const reviews = [
    {
      id: 1,
      userName: 'Sarah M.',
      rating: 5,
      comment: 'Great seller! Fast shipping and excellent quality products.',
      date: '2 days ago'
    },
    {
      id: 2,
      userName: 'Mohamed A.',
      rating: 4,
      comment: 'Good service and responsive to messages. Will buy again.',
      date: '1 week ago'
    }
  ];

  const displayedProducts = selectedCollection
    ? sellerProducts.filter(p => {
        if (selectedCollection === 'col-1') return ['seller-1'].includes(p.id);
        if (selectedCollection === 'col-2') return ['seller-2'].includes(p.id);
        if (selectedCollection === 'col-3') return ['seller-3'].includes(p.id);
        if (selectedCollection === 'col-4') return ['seller-4'].includes(p.id);
        return true;
      })
    : sellerProducts;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-gray-50 rounded-sm transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 mx-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="women shorts"
                  className="w-full px-4 py-2 pr-10 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-black rounded-full">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <button className="p-1.5 hover:bg-gray-50 rounded-sm transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">{seller.name}</h2>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center">
                  <Star className="w-3.5 h-3.5 text-orange-400 fill-current" />
                  <span className="text-xs font-semibold text-gray-900 ml-0.5">{seller.rating}</span>
                </div>
                <span className="text-xs text-gray-600">{seller.followers.toLocaleString()} Followers</span>
              </div>
            </div>
          </div>
          <button className="px-4 py-1.5 bg-black text-white rounded-sm text-xs font-medium hover:bg-gray-800 transition-colors">
            +Follow
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 px-2 py-1 bg-white rounded text-xs whitespace-nowrap">
            <Package className="w-3 h-3 text-green-600" />
            <span className="text-gray-700">Free Return</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white rounded text-xs whitespace-nowrap">
            <Zap className="w-3 h-3 text-blue-600" />
            <span className="text-gray-700">QuickShip</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white rounded text-xs whitespace-nowrap">
            <TrendingUp className="w-3 h-3 text-orange-600" />
            <span className="text-gray-700">99K+ repurchase</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white rounded text-xs whitespace-nowrap">
            <span className="text-gray-700">Sales surge 21%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded text-xs">
          <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
          <span className="text-gray-700">This store is selected as a</span>
          <span className="font-bold text-orange-700">[Trends Store]</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-500 ml-auto" />
        </div>
      </div>


        <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
          <div className="flex px-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'home'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('item');
                setSelectedCollection(null);
              }}
              className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'item'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Item
            </button>
            <button
              onClick={() => setActiveTab('promo')}
              className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'promo'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Promo
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'review'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Review
            </button>
          </div>

        </div>

        <div className="px-4 py-3">
          {activeTab === 'item' && (
              <div>
                {selectedCollection && (
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {collections.find(c => c.id === selectedCollection)?.name}
                    </h3>
                    <button
                      onClick={() => setSelectedCollection(null)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      View All
                    </button>
                  </div>
                )}
                <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded text-xs font-medium whitespace-nowrap border border-green-200">
                    <Zap className="w-3 h-3" />
                    QuickShip
                  </button>
                  <button className="px-3 py-1.5 bg-white text-gray-700 rounded text-xs font-medium whitespace-nowrap border border-gray-300">
                    Category
                    <ChevronDown className="w-3 h-3 inline ml-1" />
                  </button>
                  <button className="px-3 py-1.5 bg-white text-gray-700 rounded text-xs font-medium whitespace-nowrap border border-gray-300">
                    Style
                    <ChevronDown className="w-3 h-3 inline ml-1" />
                  </button>
                  <button className="px-3 py-1.5 bg-white text-gray-700 rounded text-xs font-medium whitespace-nowrap border border-gray-300">
                    Pattern Type
                    <ChevronDown className="w-3 h-3 inline ml-1" />
                  </button>
                  <button className="px-3 py-1.5 bg-white text-gray-700 rounded text-xs font-medium whitespace-nowrap border border-gray-300">
                    Color
                    <ChevronDown className="w-3 h-3 inline ml-1" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {displayedProducts.map((product) => {
                    return (
                  <div
                    key={product.id}
                    className="bg-white overflow-hidden group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-0 bg-black text-white px-2 py-0.5 text-[10px] font-semibold">
                        CHOICE
                      </div>
                      <button className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        </svg>
                      </button>
                    </div>
                    <div className="pt-2">
                      <div className="text-[10px] text-gray-600 mb-1">#Gleam Sequin &rsaquo;</div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-red-500 font-bold text-sm line-through">-25%</span>
                        <span className="text-black font-bold text-base">${product.price}</span>
                        <span className="text-gray-400 line-through text-xs">${product.price + 10}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-orange-600 text-[10px] font-medium">#1 Bestseller</span>
                        <span className="text-gray-500 text-[10px]">in All Over Print</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5 bg-orange-50 px-1.5 py-0.5 rounded">
                          <span className="text-orange-600 text-[10px] font-bold">$12.40</span>
                          <span className="text-gray-600 text-[10px]">6.2k+ sold</span>
                        </div>
                        <button className="ml-auto p-1 bg-gray-100 rounded-full hover:bg-gray-200">
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                    );
                  })}
                </div>
              </div>
            )}

          {activeTab === 'promo' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      onClick={() => {
                        setSelectedCollection(collection.id);
                        setActiveTab('item');
                      }}
                      className="bg-white rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <h4 className="text-sm font-semibold mb-1">{collection.name}</h4>
                          <p className="text-xs opacity-90">{collection.productCount} items</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-600">{collection.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {activeTab === 'review' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">About the Store</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {seller.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Store Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Response Time</p>
                        <p className="text-sm text-gray-900">{seller.responseTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Store className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Member Since</p>
                        <p className="text-sm text-gray-900">{seller.joinedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="text-sm text-gray-900">{seller.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Customer Reviews</h3>
                    <button className="text-xs text-gray-500">
                      View All <ChevronRight className="w-3 h-3 inline" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{review.userName}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{review.comment}</p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
