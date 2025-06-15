import { supabase } from '../lib/supabase'

export interface PaymentOrder {
  order_id: string
  amount: number
  currency: string
  key: string
}

export interface OrderItem {
  product_id: string
  quantity: number
  price: number
}

export const createPaymentOrder = async (
  amount: number,
  items: OrderItem[]
): Promise<PaymentOrder> => {
  try {
    // Get user session
    const storedSession = localStorage.getItem('user_session')
    if (!storedSession) {
      throw new Error('Authentication required')
    }

    const session = JSON.parse(storedSession)

    // Create order in database first
    const orderNumber = `ORD-${Date.now()}-${session.user_id.slice(0, 8)}`
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session.user_id,
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending',
        subtotal: amount,
        total_amount: amount,
        currency: 'INR'
      })
      .select()
      .single()

    if (orderError) {
      throw new Error('Failed to create order')
    }

    // Add order items
    if (items && items.length > 0) {
      const orderItems = await Promise.all(
        items.map(async (item) => {
          // Get product details
          const { data: product } = await supabase
            .from('products')
            .select('name, sku')
            .eq('id', item.product_id)
            .single()

          return {
            order_id: order.id,
            product_id: item.product_id,
            product_name: product?.name || 'Unknown Product',
            product_sku: product?.sku || '',
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity
          }
        })
      )

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Error storing order items:', itemsError)
      }
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        user_id: session.user_id,
        amount: amount,
        currency: 'INR',
        status: 'pending'
      })
      .select()
      .single()

    if (paymentError) {
      throw new Error('Failed to create payment record')
    }

    // For demo purposes, return mock Razorpay order
    // In production, you would call Razorpay API here
    return {
      order_id: `razorpay_order_${order.id}`,
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      key: 'rzp_test_demo_key' // This will be replaced with actual key
    }
  } catch (error: any) {
    console.error('Error creating payment order:', error)
    throw new Error(error.message || 'Failed to create payment order')
  }
}

export const verifyPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): Promise<void> => {
  try {
    // Get user session
    const storedSession = localStorage.getItem('user_session')
    if (!storedSession) {
      throw new Error('Authentication required')
    }

    const session = JSON.parse(storedSession)

    // Find the order by razorpay order id
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, orders(*)')
      .eq('user_id', session.user_id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (paymentError || !payment) {
      throw new Error('Payment record not found')
    }

    // Update payment record
    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'success',
        payment_method: 'razorpay',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id)

    if (updatePaymentError) {
      throw new Error('Failed to update payment record')
    }

    // Update order status
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.order_id)

    if (updateOrderError) {
      throw new Error('Failed to update order status')
    }

  } catch (error: any) {
    console.error('Error verifying payment:', error)
    throw new Error(error.message || 'Failed to verify payment')
  }
}

export const getUserOrders = async () => {
  try {
    // Get user session
    const storedSession = localStorage.getItem('user_session')
    if (!storedSession) {
      throw new Error('Authentication required')
    }

    const session = JSON.parse(storedSession)

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        payments (*)
      `)
      .eq('user_id', session.user_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      throw new Error('Failed to fetch orders')
    }

    return data
  } catch (error: any) {
    console.error('Error in getUserOrders:', error)
    throw new Error(error.message || 'Failed to fetch orders')
  }
}