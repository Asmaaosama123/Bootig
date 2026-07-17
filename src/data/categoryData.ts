// src/data/categoryData.ts

export type Subcategory = {
  id: string;
  name: string;
  image: string;
  productCount?: number;
};

export type Store = {
  id: string;
  name: string;
  rating?: number;
};

export type Product = {
  id: string;
  name: string;
  price?: number;
  image: string;
  store?: string;
};

export type CategoryData = {
  heroImages: string[];
  subcategories: Subcategory[];
  stores: Store[];
  bestSellers: Product[];
};

export const categoryData: Record<string, CategoryData> = {
  woman: {
    heroImages: [
      "https://images.unsplash.com/photo-1520975698519-59c85f86d1a4?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop",
    ],
    subcategories: [
    
      { id: "bags", name: "Bags", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop", productCount: 160 },
      { id: "bags", name: "Bags", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop", productCount: 160 },
      { id: "bags", name: "Bags", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop", productCount: 160 },
      { id: "bags", name: "Bags", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop", productCount: 160 },
      { id: "bags", name: "Bags", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop", productCount: 160 },
    ],
    stores: [
      { id: "1", name: "Zara", rating: 4.8 },
      { id: "2", name: "H&M", rating: 4.7 },
    ],
    bestSellers: [
      { id: "1", name: "Summer Floral Dress", price: 89.99, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop", store: "Zara" },
      { id: "2", name: "Leather Handbag", price: 199.99, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop", store: "H&M" },
    ],
  },

  men: {
    heroImages: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1521334884684-d80222895322?w=1200&h=600&fit=crop",
    ],
    subcategories: [
      { id: "shirts", name: "Shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop", productCount: 187 },
      { id: "pants", name: "Pants", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop", productCount: 143 },
      { id: "jackets", name: "Jackets", image: "https://images.unsplash.com/photo-1591047139828-3d4d6d0a00d5?w=800&h=800&fit=crop", productCount: 90 },
    ],
    stores: [
      { id: "3", name: "Nike", rating: 4.9 },
      { id: "4", name: "Adidas", rating: 4.7 },
    ],
    bestSellers: [
      { id: "3", name: "Classic White Shirt", price: 59.99, image: "https://images.unsplash.com/photo-1600181952880-7a10a4f4f77f?w=600&h=600&fit=crop", store: "Zara" },
      { id: "4", name: "Running Sneakers", price: 129.99, image: "https://images.unsplash.com/photo-1600180758890-6b945e3e5af8?w=600&h=600&fit=crop", store: "Nike" },
    ],
  },

  kids: {
    heroImages: ["https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=1200&h=600&fit=crop"],
    subcategories: [
      { id: "toys", name: "Toys", image: "https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=800&h=800&fit=crop", productCount: 120 },
      { id: "clothes", name: "Clothes", image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=800&h=800&fit=crop", productCount: 95 },
    ],
    stores: [
      { id: "5", name: "Kids Store", rating: 4.6 },
      { id: "6", name: "Little Fashion", rating: 4.5 },
    ],
    bestSellers: [
      { id: "5", name: "Toy Car", price: 15.99, image: "https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=600&h=600&fit=crop", store: "Kids Store" },
    ],
  },

  electronics: {
    heroImages: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop"],
    subcategories: [
      { id: "phones", name: "Phones", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=800&fit=crop", productCount: 200 },
      { id: "laptops", name: "Laptops", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=800&fit=crop", productCount: 150 },
    ],
    stores: [
      { id: "7", name: "Tech World", rating: 4.8 },
      { id: "8", name: "Gadget Shop", rating: 4.7 },
    ],
    bestSellers: [
      { id: "6", name: "Smartphone X", price: 799.99, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=600&fit=crop", store: "Tech World" },
    ],
  },

  shoes: {
    heroImages: ["https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=1200&h=600&fit=crop"],
    subcategories: [
      { id: "sneakers", name: "Sneakers", image: "https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=800&h=800&fit=crop", productCount: 130 },
    ],
    stores: [
      { id: "9", name: "Shoe Hub", rating: 4.6 },
    ],
    bestSellers: [],
  },

  accessories: {
    heroImages: ["https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=1200&h=600&fit=crop"],
    subcategories: [
      { id: "bags", name: "Bags", image: "https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=800&h=800&fit=crop", productCount: 100 },
      { id: "jewelry", name: "Jewelry", image: "https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=800&h=800&fit=crop", productCount: 85 },
    ],
    stores: [
      { id: "10", name: "Bag Store", rating: 4.5 },
    ],
    bestSellers: [],
  },

  beauty: {
    heroImages: ["https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=1200&h=600&fit=crop"],
    subcategories: [
      { id: "makeup", name: "Makeup", image: "https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=800&h=800&fit=crop", productCount: 75 },
      { id: "skincare", name: "Skincare", image: "https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=800&h=800&fit=crop", productCount: 65 },
    ],
    stores: [
      { id: "11", name: "Beauty Store", rating: 4.7 },
    ],
    bestSellers: [],
  },

  sports: {
    heroImages: ["https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=1200&h=600&fit=crop"],
    subcategories: [
      { id: "fitness", name: "Fitness", image: "https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=800&h=800&fit=crop", productCount: 90 },
      { id: "outdoor", name: "Outdoor", image: "https://images.unsplash.com/photo-1520975698510-0d9a2458e8c2?w=800&h=800&fit=crop", productCount: 70 },
    ],
    stores: [
      { id: "12", name: "Sport Store", rating: 4.6 },
    ],
    bestSellers: [],
  },
  
};
