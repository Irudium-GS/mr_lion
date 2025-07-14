import { api } from './api';
import { Product, ProductFilter, Category } from '../types';

export const getProducts = async (filters?: ProductFilter): Promise<Product[]> => {
  try {
    const params: Record<string, any> = {};
    
    if (filters?.category) params.category = filters.category;
    if (filters?.search) params.search = filters.search;
    if (filters?.minPrice !== undefined) params.min_price = filters.minPrice;
    if (filters?.maxPrice !== undefined) params.max_price = filters.maxPrice;
    if (filters?.limit) params.limit = filters.limit;

    const response = await api.products.getAll(params);
    
    if (response.success) {
      return response.data.map(transformProduct);
    } else {
      throw new Error(response.message || 'Failed to fetch products');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.products.getAll();
    
    if (response.success) {
      return response.data.map(transformProduct);
    } else {
      throw new Error(response.message || 'Failed to fetch products');
    }
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.products.getFeatured();
    
    if (response.success) {
      return response.data.map(transformProduct);
    } else {
      throw new Error(response.message || 'Failed to fetch featured products');
    }
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await api.products.getById(id);
    
    if (response.success) {
      return transformProduct(response.data);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const createProduct = async (productData: any): Promise<Product> => {
  try {
    const response = await api.products.create({
      name: productData.name,
      description: productData.description,
      short_description: productData.description?.substring(0, 100) || '',
      price: parseFloat(productData.price),
      compare_price: productData.comparePrice ? parseFloat(productData.comparePrice) : null,
      cost_price: productData.costPrice ? parseFloat(productData.costPrice) : null,
      sku: productData.sku || null,
      category_id: productData.categoryId || null,
      images: productData.image ? [productData.image] : [],
      tags: productData.features || [],
      stock_quantity: parseInt(productData.stock) || 0,
      weight: productData.weight ? parseFloat(productData.weight) : null,
      length: productData.dimensions?.length || null,
      width: productData.dimensions?.width || null,
      height: productData.dimensions?.height || null,
      is_featured: productData.isFeatured || false,
    });
    
    if (response.success) {
      return transformProduct(response.data);
    } else {
      throw new Error(response.message || 'Failed to create product');
    }
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: any): Promise<void> => {
  try {
    const response = await api.products.update(id, {
      name: productData.name,
      description: productData.description,
      short_description: productData.description?.substring(0, 100) || '',
      price: parseFloat(productData.price),
      compare_price: productData.comparePrice ? parseFloat(productData.comparePrice) : null,
      cost_price: productData.costPrice ? parseFloat(productData.costPrice) : null,
      sku: productData.sku || null,
      category_id: productData.categoryId || null,
      images: productData.image ? [productData.image] : [],
      tags: productData.features || [],
      stock_quantity: parseInt(productData.stock) || 0,
      weight: productData.weight ? parseFloat(productData.weight) : null,
      length: productData.dimensions?.length || null,
      width: productData.dimensions?.width || null,
      height: productData.dimensions?.height || null,
      is_featured: productData.isFeatured || false,
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update product');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await api.products.delete(id);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.categories.getAll();
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch categories');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
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
    rating: 4.5, // Default rating
    ratingCount: 100, // Default rating count
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