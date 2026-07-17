import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
  category: string;
}

interface CollectionsListProps {
  onCollectionClick: (collection: Collection) => void;
}

const collections: Collection[] = [
  {
    id: '1',
    name: 'Summer Collection',
    slug: 'summer-collection',
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400',
    itemCount: 24,
    category: 'woman'
  },
  {
    id: '2',
    name: 'Tech Essentials',
    slug: 'tech-essentials',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    itemCount: 18,
    category: 'electronics'
  },
  {
    id: '3',
    name: 'Men\'s Casual',
    slug: 'mens-casual',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    itemCount: 32,
    category: 'man'
  },
  {
    id: '4',
    name: 'Beauty Favorites',
    slug: 'beauty-favorites',
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400',
    itemCount: 15,
    category: 'beauty'
  },
  {
    id: '5',
    name: 'Kids Playground',
    slug: 'kids-playground',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    itemCount: 20,
    category: 'kids'
  },
  {
    id: '6',
    name: 'Luxury Accessories',
    slug: 'luxury-accessories',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',
    itemCount: 12,
    category: 'woman'
  }
];

export default function CollectionsList({ onCollectionClick }: CollectionsListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Shop by Collection</h2>
        <div className="hidden md:flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-sm bg-white hover:bg-gray-100 transition border border-gray-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-sm bg-white hover:bg-gray-100 transition border border-gray-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => onCollectionClick(collection)}
            className="group relative overflow-hidden bg-white hover:shadow-sm transition-all flex-shrink-0 w-[140px] md:w-[160px] lg:w-[180px] snap-start"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
              <div className="text-left">
                <h3 className="font-semibold text-xs mb-0.5 leading-tight">{collection.name}</h3>
                <p className="text-[10px] text-gray-200">{collection.itemCount} items</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
