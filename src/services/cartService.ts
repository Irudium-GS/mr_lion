import { supabase } from '../lib/supabase'
import { Product, CartItem } from '../types'

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
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
      console.error('Error fetching cart items:', error)
      return []
    }

    return data.map(item => ({
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
      quantity: item.quantity,
    }))
  } catch (error) {
    console.error('Error in getCartItems:', error)
    return []
  }
}

export const addToCart = async (userId: string, productId: string, quantity: number): Promise<void> => {
  try {
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()

    if (existingItem) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)

      if (error) {
        throw new Error('Failed to update cart item')
      }
    } else {
      // Add new item
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity: quantity,
        })

      if (error) {
        throw new Error('Failed to add item to cart')
      }
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number): Promise<void> => {
  try {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) {
        throw new Error('Failed to remove cart item')
      }
    } else {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: quantity,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) {
        throw new Error('Failed to update cart item')
      }
    }
  } catch (error) {
    console.error('Error updating cart item:', error)
    throw error
  }
}

export const removeFromCart = async (userId: string, productId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) {
      throw new Error('Failed to remove cart item')
    }
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

export const clearCart = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)

    if (error) {
      throw new Error('Failed to clear cart')
    }
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}