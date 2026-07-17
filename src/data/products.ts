import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1', name: 'Floral Summer Maxi Dress', price: 89.99, originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop',
    category: 'WOMAN', subcategory: 'DRESSES', productType: 'SUMMER DRESSES',
    description: 'Beautiful floral print maxi dress perfect for summer occasions.',
    isNew: true, rating: 4.8, reviewCount: 124, colors: ['Pink', 'White', 'Blue'],
    sizes: ['S', 'M', 'L', 'XL'], inStock: true, featured: true, trending: true
  },
  {
    id: '2', name: 'Elegant Evening Gown', price: 199.99, originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=600&fit=crop',
    category: 'WOMAN', subcategory: 'DRESSES', productType: 'EVENING DRESSES',
    description: 'Stunning evening gown for special occasions.', isNew: false,
    rating: 4.9, reviewCount: 89, colors: ['Black', 'Navy', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L'], inStock: true, featured: true
  },
  {
    id: '3', name: 'Organic Cotton T-Shirt', price: 29.99, originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
    category: 'WOMAN', subcategory: 'TOPS', productType: 'T-SHIRTS',
    description: 'Soft organic cotton t-shirt for everyday comfort.', isNew: true,
    rating: 4.7, reviewCount: 312, colors: ['White', 'Black', 'Gray', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'], inStock: true, trending: true
  },
  {
    id: '4', name: 'Classic Dress Shirt', price: 59.99, originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=500&h=600&fit=crop',
    category: 'MEN', subcategory: 'SHIRTS', productType: 'DRESS SHIRTS',
    description: 'Premium quality dress shirt for formal occasions.', isNew: true,
    rating: 4.5, reviewCount: 234, colors: ['White', 'Light Blue', 'Pink'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], inStock: true
  },
  {
    id: '5', name: 'Smartphone Pro Max', price: 999.99, originalPrice: 1199.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=600&fit=crop',
    category: 'ELECTRONICS', subcategory: 'PHONES', productType: 'SMARTPHONES',
    description: 'Latest smartphone with advanced features.', isNew: true,
    rating: 4.8, reviewCount: 456, colors: ['Black', 'Silver', 'Gold'],
    sizes: ['128GB', '256GB', '512GB'], inStock: true, featured: true, trending: true
  }
];

export const collections = {
  'Summer': [mockProducts[0], mockProducts[2], mockProducts[3]],
  'T-Shirts': [mockProducts[2], mockProducts[3]],
  'Evening': [mockProducts[1], mockProducts[0]],
  'New Arrivals': [mockProducts[0], mockProducts[2], mockProducts[4]],
  'Trending': [mockProducts[0], mockProducts[4], mockProducts[1]]
};

export const categories = [
  { id: 'woman', name: 'WOMAN', count: 45 }, { id: 'man', name: 'MEN', count: 32 },
  { id: 'kids', name: 'KIDS', count: 28 }, { id: 'beauty', name: 'BEAUTY', count: 67 },
  { id: 'electronics', name: 'ELECTRONICS', count: 54 }
];