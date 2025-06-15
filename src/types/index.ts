export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  categoryId?: string
  image: string
  stock: number
  rating: number
  ratingCount: number
  discountPercentage: number
  features: string[]
  sku?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  isFeatured?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: string
  name: string
  email: string
  role?: 'user' | 'admin'
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  role: 'user' | 'admin'
}

export interface ProductFilter {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  limit?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  shipping_address: any | null
  billing_address: any | null
  notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
  payments?: Payment[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_sku: string | null
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  products?: Product
}

export interface Payment {
  id: string
  order_id: string
  user_id: string
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  payment_method: string | null
  gateway_response: any | null
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}