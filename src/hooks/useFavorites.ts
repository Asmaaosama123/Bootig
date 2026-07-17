import { useState } from 'react';
import { Product } from '../types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToFavorites = (product: Product) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setFavorites(prev => {
        const isAlreadyFavorite = prev.some(item => item.id === product.id);
        if (isAlreadyFavorite) {
          setIsLoading(false);
          return prev;
        }
        setIsLoading(false);
        return [...prev, product];
      });
    }, 200);
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  const toggleFavorite = (product: Product) => {
    const isAlreadyFavorite = favorites.some(item => item.id === product.id);
    
    if (isAlreadyFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    isLoading
  };
};