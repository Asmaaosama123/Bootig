// src/data/storesData.ts

export const stores = [
    {
      categories: [
        { name: "Shoes", image: "https://images.unsplash.com/photo-1589187155478-6cc0d5c9c95f?w=200" },
        { name: "Bags", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200" },
        { name: "Accessories", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=200" },
        { name: "Jackets", image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=200" },
        { name: "Jackets", image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=200" },
        { name: "Jackets", image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=200" },
        { name: "Jackets", image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=200" },
      ],
      
      id: 1,
      name: "Easithlete",
      tagline: "trends",
      followers: "Follower surge 59%",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      products: [
        {
          id: "easithlete-1",
          name: "Smart Running Shoes",
          price: 31.7,
          originalPrice: 39.99,
          store: "Easithlete",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
          description:
            "High-performance running shoes with advanced cushioning technology for maximum comfort during long runs.",
          sizes: ["38", "39", "40", "41", "42", "43"],
          colors: [
            { name: "Black", value: "#000000" },
            { name: "Blue", value: "#2563EB" },
            { name: "Red", value: "#DC2626" },
          ],
          rating: 4.4,
          reviewCount: 89,
          discount: 3, // نسبة الخصم
          category: "Shoes", // القسم
          inStock: true,
          features: ["Lightweight", "Breathable", "Shock Absorption", "Durable"],
        },
        {
          id: "easithlete-2",
          name: "Sports Watch",
          price: 10.93,
          store: "Easithlete",
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
          description:
            "Feature-packed sports watch with heart rate monitoring and GPS tracking.",
          rating: 4.2,
          reviewCount: 67,
          inStock: true,
          discount: 3, // نسبة الخصم
          category: "Bags", // القسم
        },
        {
          id: "easithlete-3",
          name: "Wireless Earbuds",
          price: 22.4,
          originalPrice: 29.99,
          store: "Easithlete",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
          description:
            "Premium wireless earbuds with noise cancellation and superior sound quality.",
          rating: 4.6,
          reviewCount: 124,
          inStock: true,
          discount: 3, // نسبة الخصم
          category: "Tracksuit", // القسم
        },

        {
          id: "easithlete-4",
          name: "Fitness Tracker",
          price: 9.6,
          store: "Easithlete",
          image:
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
          description:
            "Compact fitness tracker with step counting and sleep monitoring features.",
          rating: 4.1,
          reviewCount: 56,
          inStock: true,
          discount: 3, // نسبة الخصم
          category: "Tracksuit", // القسم
        },
      ],
    },
    {
      id: 2,
      name: "Urban Wear",
      tagline: "fashion",
      followers: "Follower surge 42%",
      image:
        "https://images.unsplash.com/photo-1588099768531-a72d4a198538?auto=format&fit=crop&w=600&q=80",
      products: [
        {
          id: "urban-1",
          name: "Denim Jacket",
          price: 25.99,
          originalPrice: 34.99,
          store: "Urban Wear",
          image:
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
          description:
            "Classic denim jacket with modern fit and vintage wash for timeless style.",
          rating: 4.3,
          reviewCount: 78,
          inStock: true,
          discount: 3, // نسبة الخصم
          category: "Bags", // القسم
        },
        {
          id: "urban-2",
          name: "Casual T-Shirt",
          price: 18.5,
          store: "Urban Wear",
          image:
            "https://images.unsplash.com/photo-1588099768531-a72d4a198538?auto=format&fit=crop&w=600&q=80",
          description:
            "Comfortable cotton t-shirt perfect for everyday wear and casual outings.",
          rating: 4.0,
          reviewCount: 45,
          inStock: true,
          discount: 3, // نسبة الخصم
          category: "Tracksuit", // القسم
        },
        {
          id: "urban-3",
          name: "Slim Fit Chinos",
          price: 32.75,
          store: "Urban Wear",
          image:
            "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80",
          description:
            "Versatile slim fit chinos that bridge the gap between casual and formal wear.",
          rating: 4.5,
          reviewCount: 92,
          inStock: true,
          discount: 3, // نسبة الخصم
          category: "Tracksuit", // القسم
        },
        {
          id: "urban-4",
          name: "Canvas Sneakers",
          price: 12.25,
          store: "Urban Wear",
          image:
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
          description:
            "Classic canvas sneakers for comfortable everyday wear with timeless style.",
          rating: 4.2,
          reviewCount: 67,
          inStock: true,
          discount: 3, // نسبة الخصم
          category: "Tracksuit", // القسم

        },
      ],
    },
  ];
  
  