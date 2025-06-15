import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { createPaymentOrder, verifyPayment, OrderItem } from '../services/paymentService'

declare global {
  interface Window {
    Razorpay: any
  }
}

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }

    try {
      setIsCheckingOut(true)

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.')
        return
      }

      const orderItems: OrderItem[] = cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.discountPercentage > 0
          ? item.product.price * (1 - item.product.discountPercentage / 100)
          : item.product.price
      }))

      const paymentOrder = await createPaymentOrder(total, orderItems)

      const options = {
        key: paymentOrder.key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'Mr.Lion - Vasanthamaaligai',
        description: 'Purchase from Mr.Lion',
        order_id: paymentOrder.order_id,
        handler: async function (response: any) {
          try {
            await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )
            
            // Clear cart and redirect to success page
            clearCart()
            navigate('/order-success', { 
              state: { 
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id 
              }
            })
          } catch (error) {
            console.error('Payment verification failed:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#CBBD93'
        },
        modal: {
          ondismiss: function() {
            setIsCheckingOut(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to initiate payment. Please try again.')
      setIsCheckingOut(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag size={64} className="mx-auto text-gray-400" />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getCartTotal()
  const shipping = subtotal > 5000 ? 0 : 299
  const total = subtotal + shipping

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Continue Shopping
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <h1 className="text-2xl font-heading font-bold mb-6">Shopping Cart</h1>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="w-24 h-24">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.product.id, parseInt(e.target.value))
                          }
                          className="form-input w-20"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-red-500 hover:text-red-600"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="text-right">
                        {item.product.discountPercentage > 0 ? (
                          <div>
                            <span className="text-primary font-medium">
                              ₹{((item.product.price * (1 - item.product.discountPercentage / 100)) * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-primary font-medium">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-heading font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Free shipping on orders above ₹5000
                  </p>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full btn btn-primary mt-6"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Secure checkout powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage