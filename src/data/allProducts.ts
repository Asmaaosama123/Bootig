// src/data/allProducts.ts
import { Product } from "../contexts/CartContext";

export const allProducts: Record<string, Product> = {
  "1": {
    id: "1",
    name: "Summer Floral Dress",
    price: 49.99,
    originalPrice: 69.99,
    store: "Elegant Boutique",
    image:
      "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=600",
    description:
      "Lightweight floral dress perfect for summer outings. Made with breathable fabric for ultimate comfort.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Pink", value: "#FFC0CB" },
      { name: "Blue", value: "#87CEEB" },
      { name: "White", value: "#FFFFFF" },
    ],
    images: [
      "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    rating: 4.6,
    reviewCount: 214,
    inStock: true,
    features: [
      "Soft and breathable material",
      "Perfect for casual wear",
      "Machine washable",
    ],
    category: "Dresses",
    isNew: true,
  },

  "2": {
    id: "2",
    name: "Men's Classic Denim Jacket",
    price: 89.99,
    originalPrice: 109.99,
    store: "Urban Style",
    image:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600",
    description:
      "Timeless denim jacket made with durable cotton and modern cut for a sleek, urban look.",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Light Blue", value: "#87CEEB" },
      { name: "Dark Blue", value: "#1E3A8A" },
    ],
    images: [
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600",
    ],
    rating: 4.8,
    reviewCount: 97,
    inStock: true,
    features: [
      "100% Cotton",
      "Durable Stitching",
      "Stylish Fit",
      "All-Season Wear",
    ],
    category: "Men's Jackets",
    isNew: false,
  },
};
