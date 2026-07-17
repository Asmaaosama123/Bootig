import { mockProducts, collections } from './products';
import { heroImages, collectionData } from './heroImages';
import staticCategoryStructure from './categories';

export const mockApi = {
  getProducts: async (filters?: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    let filteredProducts = [...mockProducts];
    
    if (filters?.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    if (filters?.subcategory) {
      filteredProducts = filteredProducts.filter(p => 
        p.subcategory?.toLowerCase() === filters.subcategory.toLowerCase()
      );
    }
    if (filters?.productType) {
      filteredProducts = filteredProducts.filter(p => 
        p.productType?.toLowerCase() === filters.productType.toLowerCase()
      );
    }
    if (filters?.collection) {
      filteredProducts = collections[filters.collection as keyof typeof collections] || [];
    }
    
    return { products: filteredProducts };
  },

  getProduct: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { categories: staticCategoryStructure };
  },

  getCollections: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const collectionsData = Object.keys(collections).map(collectionName => ({
      name: collectionName,
      description: collectionData[collectionName as keyof typeof collectionData]?.description || '',
      heroImage: heroImages[collectionName as keyof typeof heroImages] || '',
      season: collectionData[collectionName as keyof typeof collectionData]?.season || '',
      itemCount: collectionData[collectionName as keyof typeof collectionData]?.items || '',
      products: collections[collectionName as keyof typeof collections]
    }));
    return { collections: collectionsData };
  },

  getCollection: async (collectionName: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const collection = collections[collectionName as keyof typeof collections];
    if (!collection) throw new Error('Collection not found');
    return {
      name: collectionName,
      description: collectionData[collectionName as keyof typeof collectionData]?.description || '',
      heroImage: heroImages[collectionName as keyof typeof heroImages] || '',
      season: collectionData[collectionName as keyof typeof collectionData]?.season || '',
      itemCount: collectionData[collectionName as keyof typeof collectionData]?.items || '',
      products: collection
    };
  }
};