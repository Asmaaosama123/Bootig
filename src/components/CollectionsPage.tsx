import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BottomNav from './BottomNav';
import ProductGrid from './ProductGrid';
import { Product } from '../types';

interface Collection {
  id: string;
  name: string;
  image: string;
  category: string;
}

interface CollectionsPageProps {
  onBack: () => void;
  category: string;
  onCollectionSelect: (collection: Collection) => void;
  cartItemCount: number;
  onCartClick: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
  onMenuClick: () => void;
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: (productId: string) => boolean;
  isInCart?: (productId: string) => boolean;
}

const CollectionsPage: React.FC<CollectionsPageProps> = ({
  onBack,
  category,
  onCollectionSelect,
  cartItemCount,
  onCartClick,
  onProfileClick,
  onHomeClick,
  onMenuClick,
  allProducts,
  onAddToCart,
  onToggleFavorite,
  isFavorite = () => false,
  isInCart = () => false
}) => {
  const { t, isRTL } = useLanguage();
  const [bannerSlide, setBannerSlide] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [topSellersSlide, setTopSellersSlide] = useState(0);

  const categories = [
    { id: 'all', name: 'ALL' },
    { id: 'woman', name: 'WOMAN' },
    { id: 'man', name: 'MAN' },
    { id: 'kids', name: 'KIDS' },
    { id: 'beauty', name: 'BEAUTY' },
    { id: 'electronics', name: 'ELECTRONICS' }
  ];

  const categoryBanners: Record<string, Array<{ image: string; title: string; subtitle: string }>> = {
    woman: [
      {
        image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Women\'s New Collection',
        subtitle: 'Discover the latest fashion trends'
      },
      {
        image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Up to 50% Off',
        subtitle: 'Women\'s clothing & accessories'
      },
      {
        image: 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Summer Essentials',
        subtitle: 'Light & breezy styles for her'
      }
    ],
    man: [
      {
        image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Men\'s Fashion',
        subtitle: 'Sharp styles for every occasion'
      },
      {
        image: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'New Arrivals',
        subtitle: 'Fresh looks for modern men'
      },
      {
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Best Sellers',
        subtitle: 'Most popular men\'s items'
      }
    ],
    kids: [
      {
        image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Kids Collection',
        subtitle: 'Playful styles for little ones'
      },
      {
        image: 'https://images.pexels.com/photos/8363030/pexels-photo-8363030.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Back to School',
        subtitle: 'Comfortable & durable clothing'
      },
      {
        image: 'https://images.pexels.com/photos/5623112/pexels-photo-5623112.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Fun & Colorful',
        subtitle: 'Kids love these designs'
      }
    ],
    beauty: [
      {
        image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Beauty Essentials',
        subtitle: 'Your daily skincare routine'
      },
      {
        image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Makeup Must-Haves',
        subtitle: 'Professional quality products'
      },
      {
        image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Natural Beauty',
        subtitle: 'Organic & cruelty-free options'
      }
    ],
    electronics: [
      {
        image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Latest Tech',
        subtitle: 'Cutting-edge electronics'
      },
      {
        image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Smart Devices',
        subtitle: 'Connect your world'
      },
      {
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Top Brands',
        subtitle: 'Quality you can trust'
      }
    ]
  };

  const bannerImages = categoryBanners[selectedCategory] || categoryBanners.woman;

  // Define collections for each category
  const collections: Record<string, Collection[]> = {
    woman: [
      { id: '1', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'woman' },
      { id: '2', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'woman' },
      { id: '3', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'woman' },
      { id: '4', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'woman' },
      { id: '5', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'woman' },
      { id: '6', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'woman' },
      { id: '7', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'woman' },
      { id: '8', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'woman' }
    ],
    man: [
      { id: '9', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'man' },
      { id: '10', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'man' },
      { id: '11', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'man' },
      { id: '12', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'man' },
      { id: '13', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'man' },
      { id: '14', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'man' },
      { id: '15', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'man' },
      { id: '16', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'man' }
    ],
    kids: [
      { id: '17', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'kids' },
      { id: '18', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'kids' },
      { id: '19', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'kids' },
      { id: '20', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'kids' },
      { id: '21', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'kids' },
      { id: '22', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'kids' },
      { id: '23', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'kids' },
      { id: '24', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'kids' }
    ],
    beauty: [
      { id: '25', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'beauty' },
      { id: '26', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'beauty' },
      { id: '27', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'beauty' },
      { id: '28', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'beauty' },
      { id: '29', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'beauty' },
      { id: '30', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'beauty' },
      { id: '31', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'beauty' },
      { id: '32', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'beauty' }
    ],
    electronics: [
      { id: '33', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'electronics' },
      { id: '34', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'electronics' },
      { id: '35', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'electronics' },
      { id: '36', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'electronics' },
      { id: '37', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'electronics' },
      { id: '38', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'electronics' },
      { id: '39', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'electronics' },
      { id: '40', name: 'COLLECTION NAME', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300', category: 'electronics' }
    ]
  };

  const currentCollections = collections[selectedCategory] || collections.woman;
  const totalSlides = Math.ceil(currentCollections.length / 8); // 8 items per slide (4x2 grid)

  // Get products for current category
  const categoryProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return allProducts;
    }
    return allProducts.filter(product => product.category === selectedCategory);
  }, [selectedCategory, allProducts]);

  const topSellers = categoryProducts.slice(0, 4);
  const recommendedProducts = categoryProducts.slice(0, 12);

  // Create top sellers data with more items for sliding
  const topSellersData = [
    { id: 1, name: 'Brand A', logo: 'Logo' },
    { id: 2, name: 'Brand B', logo: 'Logo' },
    { id: 3, name: 'Brand C', logo: 'Logo' },
    { id: 4, name: 'Brand D', logo: 'Logo' },
    { id: 5, name: 'Brand E', logo: 'Logo' },
    { id: 6, name: 'Brand F', logo: 'Logo' },
    { id: 7, name: 'Brand G', logo: 'Logo' },
    { id: 8, name: 'Brand H', logo: 'Logo' },
  ];

  const topSellersPerSlide = 4;
  const totalTopSellersSlides = Math.ceil(topSellersData.length / topSellersPerSlide);

  const getCurrentTopSellers = () => {
    const startIndex = topSellersSlide * topSellersPerSlide;
    return topSellersData.slice(startIndex, startIndex + topSellersPerSlide);
  };

  const nextTopSellersSlide = () => {
    setTopSellersSlide((prev) => (prev + 1) % totalTopSellersSlides);
  };

  const prevTopSellersSlide = () => {
    setTopSellersSlide((prev) => (prev - 1 + totalTopSellersSlides) % totalTopSellersSlides);
  };

  const getCurrentSlideCollections = () => {
    const startIndex = currentSlide * 8;
    return currentCollections.slice(startIndex, startIndex + 8);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'all') {
      // Navigate back to home page when ALL is selected
      onHomeClick();
      return;
    }

    setSelectedCategory(categoryId);
    setBannerSlide(0); // Reset banner slideshow when changing category
    setCurrentSlide(0); // Reset to first slide when changing category
    setTopSellersSlide(0); // Reset top sellers slide when changing category
  };

  // Auto-advance banner slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerSlide((prev) => (prev + 1) % bannerImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-3">
          <button
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-sm font-semibold uppercase">
            {selectedCategory}
          </h1>

          <div className="flex items-center gap-2">
            <button className="p-2">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onCartClick}
              className="relative p-2"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex px-3 py-2.5 gap-5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`whitespace-nowrap text-xs font-medium transition-colors pb-2 relative ${
                  selectedCategory === cat.id
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {cat.name}
                {selectedCategory === cat.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        {/* Hero Slideshow */}
        <div className="relative bg-gray-100">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${bannerSlide * 100}%)` }}
            >
              {bannerImages.map((banner, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <h2 className="text-white text-lg sm:text-2xl font-bold mb-1">{banner.title}</h2>
                      <p className="text-white/90 text-xs sm:text-sm">{banner.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slideshow Navigation Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setBannerSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === bannerSlide
                    ? 'w-6 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Collections Grid */}
        <div className="px-3 py-4">
          <div className="grid grid-cols-4 gap-3">
            {getCurrentSlideCollections().map((collection) => (
              <button
                key={collection.id}
                onClick={() => onCollectionSelect(collection)}
                className="flex flex-col items-center"
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-1.5">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-medium text-gray-800 text-center line-clamp-2 leading-tight">
                  {collection.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-1 py-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'w-4 h-1.5 bg-black'
                    : 'w-1.5 h-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top Sellers Section */}
        <div className="bg-gray-50 py-4">
          <div className="px-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-gray-900 uppercase">
                TOP SELLERS
              </h2>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {topSellersData.map((seller) => (
                <div
                  key={seller.id}
                  className="min-w-[100px] flex-shrink-0 bg-white rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer border border-gray-200 hover:shadow-md transition-shadow gap-1 p-2"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-base">
                    {seller.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700 text-center truncate w-full text-center">
                    {seller.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        <div className="py-4 px-3">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Recommended
            </h2>
          </div>

          <ProductGrid
            products={recommendedProducts}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
            isInCart={isInCart}
            isFavorite={isFavorite}
          />
        </div>
      </div>

      <BottomNav
        cartItemCount={cartItemCount}
        onCartClick={onCartClick}
        onProfileClick={onProfileClick}
        onHomeClick={onHomeClick}
        onMenuClick={onMenuClick}
      />
    </div>
  );
};

export default CollectionsPage;