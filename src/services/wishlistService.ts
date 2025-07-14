import { api } from './api';
import { Product, WishlistItem } from '../types';

export const getWishlistItems = async (userId: string): Promise<WishlistItem[]> => {
  try {
    const response = await api.wishlist.getItems();
    
    if (response.success) {
      return response.data.map((item: any) => ({
        id: item.id.toString(),
        user_id: item.user_id.toString(),
        product_id: item.product_id.toString(),
        created_at: item.created_at,
        product: transformProduct(item.product),
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    return [];
  }
};

export const addToWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    const response = await api.wishlist.addItem(productId);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to add item to wishlist');
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    const response = await api.wishlist.removeItem(productId);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to remove item from wishlist');
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const isInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const response = await api.wishlist.checkItem(productId);
    
    if (response.success) {
      return response.in_wishlist;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

// Transform API product data to frontend format
const transformProduct = (apiProduct: any): Product => {
  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    description: apiProduct.description || '',
    price: parseFloat(apiProduct.price),
    category: apiProduct.category?.name || 'Uncategorized',
    categoryId: apiProduct.category_id?.toString() || '',
    image: apiProduct.images && apiProduct.images.length > 0 
      ? apiProduct.images[0] 
      : 'https://images.pexels.com/photos/6996052/pexels-photo-6996052.jpeg',
    stock: apiProduct.stock_quantity || 0,
    rating: 4.5,
    ratingCount: 100,
    discountPercentage: apiProduct.compare_price 
      ? Math.round(((apiProduct.compare_price - apiProduct.price) / apiProduct.compare_price) * 100)
      : 0,
    features: apiProduct.tags || [],
    sku: apiProduct.sku || '',
    weight: parseFloat(apiProduct.weight) || 0,
    dimensions: {
      length: parseFloat(apiProduct.length) || 0,
      width: parseFloat(apiProduct.width) || 0,
      height: parseFloat(apiProduct.height) || 0,
    },
    isFeatured: apiProduct.is_featured || false,
  };
};