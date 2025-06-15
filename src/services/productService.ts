import { supabase } from '../lib/supabase'
import { Product, ProductFilter, Category } from '../types'

export const getProducts = async (filters?: ProductFilter): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)

    if (filters?.category) {
      // Handle category filter by slug
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.category)
        .single()
      
      if (category) {
        query = query.eq('category_id', category.id)
      }
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }

    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || product.short_description || '',
      price: product.price,
      category: product.categories?.name || 'Uncategorized',
      categoryId: product.category_id,
      image: product.images && product.images.length > 0 ? product.images[0] : 'https://images.pexels.com/photos/6996052/pexels-photo-6996052.jpeg',
      stock: product.stock_quantity || 0,
      rating: 4.5,
      ratingCount: 100,
      discountPercentage: product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0,
      features: product.tags || [],
      sku: product.sku || '',
      weight: product.weight || 0,
      dimensions: {
        length: product.length || 0,
        width: product.width || 0,
        height: product.height || 0,
      },
      isFeatured: product.is_featured || false,
    }))
  } catch (error) {
    console.error('Error in getProducts:', error)
    return []
  }
}

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all products:', error)
      throw new Error('Failed to fetch products')
    }

    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || product.short_description || '',
      price: product.price,
      category: product.categories?.name || 'Uncategorized',
      categoryId: product.category_id,
      image: product.images && product.images.length > 0 ? product.images[0] : 'https://images.pexels.com/photos/6996052/pexels-photo-6996052.jpeg',
      stock: product.stock_quantity || 0,
      rating: 4.5,
      ratingCount: 100,
      discountPercentage: product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0,
      features: product.tags || [],
      sku: product.sku || '',
      weight: product.weight || 0,
      dimensions: {
        length: product.length || 0,
        width: product.width || 0,
        height: product.height || 0,
      },
      isFeatured: product.is_featured || false,
    }))
  } catch (error) {
    console.error('Error in getAllProducts:', error)
    return []
  }
}

export const getFeaturedProducts = async (category?: string): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .eq('is_featured', true)

    if (category && category !== 'all') {
      // Handle category filter by slug
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(8)

    if (error) {
      console.error('Error fetching featured products:', error)
      throw new Error('Failed to fetch featured products')
    }

    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || product.short_description || '',
      price: product.price,
      category: product.categories?.name || 'Uncategorized',
      categoryId: product.category_id,
      image: product.images && product.images.length > 0 ? product.images[0] : 'https://images.pexels.com/photos/6996052/pexels-photo-6996052.jpeg',
      stock: product.stock_quantity || 0,
      rating: 4.5,
      ratingCount: 100,
      discountPercentage: product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0,
      features: product.tags || [],
      sku: product.sku || '',
      weight: product.weight || 0,
      dimensions: {
        length: product.length || 0,
        width: product.width || 0,
        height: product.height || 0,
      },
      isFeatured: product.is_featured || false,
    }))
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error)
    return []
  }
}

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching product:', error)
      throw new Error('Failed to fetch product')
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || data.short_description || '',
      price: data.price,
      category: data.categories?.name || 'Uncategorized',
      categoryId: data.category_id,
      image: data.images && data.images.length > 0 ? data.images[0] : 'https://images.pexels.com/photos/6996052/pexels-photo-6996052.jpeg',
      stock: data.stock_quantity || 0,
      rating: 4.5,
      ratingCount: 100,
      discountPercentage: data.compare_price ? Math.round(((data.compare_price - data.price) / data.compare_price) * 100) : 0,
      features: data.tags || [],
      sku: data.sku || '',
      weight: data.weight || 0,
      dimensions: {
        length: data.length || 0,
        width: data.width || 0,
        height: data.height || 0,
      },
      isFeatured: data.is_featured || false,
    }
  } catch (error) {
    console.error('Error in getProductById:', error)
    return null
  }
}

export const createProduct = async (productData: any): Promise<Product> => {
  try {
    console.log('Creating product with data:', productData)
    
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const insertData = {
      name: productData.name,
      slug: slug,
      description: productData.description || '',
      short_description: productData.description?.substring(0, 100) || '',
      price: parseFloat(productData.price),
      compare_price: productData.comparePrice ? parseFloat(productData.comparePrice) : null,
      cost_price: productData.costPrice ? parseFloat(productData.costPrice) : null,
      sku: productData.sku || null,
      barcode: productData.barcode || null,
      stock_quantity: parseInt(productData.stock) || 0,
      weight: productData.weight ? parseFloat(productData.weight) : null,
      length: productData.length ? parseFloat(productData.length) : null,
      width: productData.width ? parseFloat(productData.width) : null,
      height: productData.height ? parseFloat(productData.height) : null,
      category_id: productData.categoryId || null,
      images: productData.image ? [productData.image] : [],
      tags: productData.features || [],
      is_featured: productData.isFeatured || false,
      is_active: true,
    }

    console.log('Insert data:', insertData)
    
    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw new Error(`Failed to create product: ${error.message}`)
    }

    console.log('Product created successfully:', data)

    return {
      id: data.id,
      name: data.name,
      description: data.description || data.short_description || '',
      price: data.price,
      category: data.categories?.name || 'Uncategorized',
      categoryId: data.category_id,
      image: data.images && data.images.length > 0 ? data.images[0] : '',
      stock: data.stock_quantity || 0,
      rating: 4.5,
      ratingCount: 100,
      discountPercentage: data.compare_price ? Math.round(((data.compare_price - data.price) / data.compare_price) * 100) : 0,
      features: data.tags || [],
      sku: data.sku || '',
      weight: data.weight || 0,
      dimensions: {
        length: data.length || 0,
        width: data.width || 0,
        height: data.height || 0,
      },
      isFeatured: data.is_featured || false,
    }
  } catch (error) {
    console.error('Error in createProduct:', error)
    throw error
  }
}

export const updateProduct = async (id: string, productData: any): Promise<void> => {
  try {
    console.log('Updating product with data:', productData)
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (productData.name !== undefined) {
      updateData.name = productData.name
      updateData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    if (productData.description !== undefined) {
      updateData.description = productData.description
      updateData.short_description = productData.description.substring(0, 100)
    }
    if (productData.price !== undefined) updateData.price = parseFloat(productData.price)
    if (productData.comparePrice !== undefined) updateData.compare_price = productData.comparePrice ? parseFloat(productData.comparePrice) : null
    if (productData.costPrice !== undefined) updateData.cost_price = productData.costPrice ? parseFloat(productData.costPrice) : null
    if (productData.sku !== undefined) updateData.sku = productData.sku
    if (productData.barcode !== undefined) updateData.barcode = productData.barcode
    if (productData.stock !== undefined) updateData.stock_quantity = parseInt(productData.stock)
    if (productData.weight !== undefined) updateData.weight = productData.weight ? parseFloat(productData.weight) : null
    if (productData.length !== undefined) updateData.length = productData.length ? parseFloat(productData.length) : null
    if (productData.width !== undefined) updateData.width = productData.width ? parseFloat(productData.width) : null
    if (productData.height !== undefined) updateData.height = productData.height ? parseFloat(productData.height) : null
    if (productData.categoryId !== undefined) updateData.category_id = productData.categoryId
    if (productData.image !== undefined) updateData.images = productData.image ? [productData.image] : []
    if (productData.features !== undefined) updateData.tags = productData.features
    if (productData.isFeatured !== undefined) updateData.is_featured = productData.isFeatured

    console.log('Update data:', updateData)

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Error updating product:', error)
      throw new Error(`Failed to update product: ${error.message}`)
    }

    console.log('Product updated successfully')
  } catch (error) {
    console.error('Error in updateProduct:', error)
    throw error
  }
}

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    console.log('Deleting product:', id)
    
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw new Error(`Failed to delete product: ${error.message}`)
    }

    console.log('Product deleted successfully')
  } catch (error) {
    console.error('Error in deleteProduct:', error)
    throw error
  }
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getCategories:', error)
    return []
  }
}