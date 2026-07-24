import api from './api';
import { CategoryData } from '../types/category';

export const categoryService = {
  async getCategoryData(categoryName: string): Promise<CategoryData> {
    const res = await api.get(`/category/${categoryName.toLowerCase()}`);
    return res.data;
  },

  async toggleFavorite(itemId: string, type: 'store' | 'product'): Promise<boolean> {
    await api.post(`/favorites/toggle`, { itemId, type });
    return true;
  }
};