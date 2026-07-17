export interface Subcategory {
    id: string;
    name: string;
    image: string;
    productCount: number;
  }
  
  export interface Store {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    isFeatured: boolean;
    isFavorite?: boolean;
  }
  
  export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    store: string;
    isNew: boolean;
    category: string;
    isFavorite?: boolean;
    rating: number;
    description?: string;
    images?: string[];
  }
  
  export interface CategoryData {
    subcategories: Subcategory[];
    stores: Store[];
    bestSellers: Product[];
    heroImages: string[];
  }