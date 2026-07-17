import { CategoryData } from '../types/category';

const mockCategoryData: Record<string, CategoryData> = {
  woman: {
    subcategories: [
      { id: 'dresses', name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop', productCount: 245 },
      { id: 'tops', name: 'Tops', image: 'https://images.unsplash.com/photo-1581047134771-2d4d0e7bf541?w=200&h=200&fit=crop', productCount: 189 },
      { id: 'shoes', name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop', productCount: 156 },
    ],
    stores: [
      { id: '1', name: 'Fashion Store', category: 'Women Fashion', rating: 4.8, reviewCount: 1247, isFeatured: true, isFavorite: true },
      { id: '2', name: 'Boutique Elegance', category: 'Luxury Fashion', rating: 4.9, reviewCount: 892, isFeatured: true, isFavorite: false },
    ],
    bestSellers: [
      { 
        id: '1', 
        name: 'Summer Floral Dress', 
        price: 89.99, 
        originalPrice: 120.00, 
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop', 
        store: 'Fashion Store', 
        isNew: true, 
        category: 'Dresses', 
        isFavorite: true, 
        rating: 4.8 
      },
    ],
    heroImages: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop',
    ]
  },
};

export const categoryService = {
  async getCategoryData(categoryName: string): Promise<CategoryData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const categoryKey = categoryName.toLowerCase();
    return mockCategoryData[categoryKey] || mockCategoryData.woman;
  },

  async toggleFavorite(itemId: string, type: 'store' | 'product'): Promise<boolean> {
    console.log(`Toggling favorite for ${type} with id: ${itemId}`);
    return true;
  }
};