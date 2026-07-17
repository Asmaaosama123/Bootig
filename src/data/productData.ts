export interface ProductData {
    id: number;
    name: string;
    images: string[];
    currentPrice: number;
    oldPrice: number;
    colors: string[];
    sizes: string[];
    description: string;
    storeName: string;
    rating: number;
    reviewsCount: number;
  }
  
  export const productData: ProductData = {
    id: 1,
    name: "Elegant Summer Dress",
    images: [
      "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/10026490/pexels-photo-10026490.jpeg?auto=compress&cs=tinysrgb&w=600"
    ],
    currentPrice: 199,
    oldPrice: 299,
    colors: ["#FF6B6B", "#4ECDC4", "#1A535C"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "This elegant summer dress is made from breathable cotton, perfect for hot days. Designed for comfort and style.",
    storeName: "Fashion Hub",
    rating: 4.5,
    reviewsCount: 134
  };
  