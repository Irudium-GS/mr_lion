import { supabase } from '../lib/supabase'
import { Product, WishlistItem } from '../types'

export const getWishlistItems = async (userId: string): Promise<WishlistItem[]> => {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          description,
          price,
          compare_price,
          images,
          stock_quantity,
          sku,
          weight,
          length,
          width,
          height,
          is_featured,
          categories (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching wishlist items:', error)
      return []
    }

    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      created_at: item.created_at,
      product: {
        id: item.products.id,
        name: item.products.name,
        description: item.products.description || '',
        price: item.products.price,
        category: item.products.categories?.name || 'Uncategorized',
        categoryId: '',
        image: item.products.images && item.products.images.length > 0 ? item.products.images[0] : 'https://images.pexels.com/photos/6996052/pexels-photo-6996052.jpeg',
        stock: item.products.stock_quantity || 0,
        rating: 4.5,
        ratingCount: 100,
        discountPercentage: item.products.compare_price ? Math.round(((item.products.compare_price - item.products.price) / item.products.compare_price) * 100) : 0,
        features: [],
        sku: item.products.sku || '',
        weight: item.products.weight || 0,
        dimensions: {
          length: item.products.length || 0,
          width: item.products.width || 0,
          height: item.products.height || 0,
        },
        isFeatured: item.products.is_featured || false,
      },
    }))
  } catch (error) {
    console.error('Error in getWishlistItems:', error)
    return []
  }
}

export const addToWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: productId,
      })

    if (error) {
      throw new Error('Failed to add item to wishlist')
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw error
  }
}

export const removeFromWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) {
      throw new Error('Failed to remove item from wishlist')
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    throw error
  }
}

export const isInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking wishlist:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error in isInWishlist:', error)
    return false
  }
}