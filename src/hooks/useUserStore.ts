import { useState, useEffect } from 'react';
import { StoreProduct, Product } from '../types';

export const useUserStore = () => {
  const [userProducts, setUserProducts] = useState<StoreProduct[]>([
    {
      id: 'user-1',
      name: 'Premium Wireless Headphones',
      price: 199,
      originalPrice: 299,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'electronics',
      storeQuantity: 25,
      isActive: true,
      dateAdded: '2024-01-15',
      offers: [
        {
          id: 'off1',
          type: 'percentage',
          value: 20,
          startDate: '2024-01-01',
          endDate: '2024-02-01',
          isActive: true
        }
      ]
    },
    {
      id: 'user-2',
      name: 'Designer Handbag',
      price: 199,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'woman',
      storeQuantity: 12,
      isActive: true,
      dateAdded: '2024-01-10'
    },
    {
      id: 'user-3',
      name: 'Smart Watch Pro',
      price: 199,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
      category: 'electronics',
      storeQuantity: 0,
      isActive: false,
      dateAdded: '2024-01-05'
    }
  ]);

  // Convert store products to regular products for display
  const getActiveProducts = (): Product[] => {
    return userProducts
      .filter(product => product.isActive && product.storeQuantity > 0)
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        isNew: isNewProduct(product.dateAdded),
        discount: product.originalPrice ? 
          Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 
          undefined
      }));
  };

  const isNewProduct = (dateAdded: string): boolean => {
    const addedDate = new Date(dateAdded);
    const now = new Date();
    const daysDiff = (now.getTime() - addedDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 30; // Consider products new for 30 days
  };

  const addProduct = (product: Omit<StoreProduct, 'id' | 'dateAdded'>) => {
    const newProduct: StoreProduct = {
      ...product,
      id: `user-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setUserProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (productId: string, updates: Partial<StoreProduct>) => {
    setUserProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (productId: string) => {
    setUserProducts(prev => prev.filter(product => product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setUserProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedProduct = { ...product, storeQuantity: Math.max(0, newQuantity) };
        // Auto-deactivate if quantity reaches 0
        if (updatedProduct.storeQuantity === 0) {
          updatedProduct.isActive = false;
        }
        return updatedProduct;
      }
      return product;
    }));
  };

  const toggleProductStatus = (productId: string) => {
    setUserProducts(prev => prev.map(product => {
      if (product.id === productId) {
        // Can't activate if quantity is 0
        if (product.storeQuantity === 0 && !product.isActive) {
          return product;
        }
        return { ...product, isActive: !product.isActive };
      }
      return product;
    }));
  };

  const decreaseQuantityOnPurchase = (productId: string, quantity: number = 1) => {
    setUserProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newQuantity = Math.max(0, product.storeQuantity - quantity);
        return {
          ...product,
          storeQuantity: newQuantity,
          isActive: newQuantity > 0 ? product.isActive : false
        };
      }
      return product;
    }));
  };

  const addOffer = (productId: string, offer: Omit<StoreProduct['offers'][0], 'id'>) => {
    const newOffer = {
      ...offer,
      id: Date.now().toString()
    };

    setUserProducts(prev => prev.map(product => 
      product.id === productId
        ? { 
            ...product, 
            offers: product.offers ? [...product.offers, newOffer] : [newOffer]
          }
        : product
    ));
  };

  return {
    userProducts,
    getActiveProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateQuantity,
    toggleProductStatus,
    decreaseQuantityOnPurchase,
    addOffer
  };
};