import { api } from './api';
import { Product, CartItem } from '../types';

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    const response = await api.cart.getItems();
    
    if (response.success) {
      return response.data.map((item: any) => ({
        product: transformProduct(item.product),
        quantity: item.quantity,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

export const addToCart = async (userId: string, productId: string, quantity: number): Promise<void> => {
  try {
    const response = await api.cart.addItem(productId, quantity);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to add item to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number): Promise<void> => {
  try {
    if (quantity <= 0) {
      await removeFromCart(userId, productId);
      return;
    }

    const response = await api.cart.updateItem(productId, quantity);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update cart item');
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (userId: string, productId: string): Promise<void> => {
  try {
    const response = await api.cart.removeItem(productId);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to remove cart item');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async (userId: string): Promise<void> => {
  try {
    const response = await api.cart.clear();
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to clear cart');
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
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