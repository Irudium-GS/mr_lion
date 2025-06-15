import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

function OrderSuccessPage() {
  const location = useLocation()
  const { orderId, paymentId } = location.state || {}

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-heading font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>
          </div>

          {orderId && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono">{orderId}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono">{paymentId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Package className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <p className="text-gray-600 text-sm">
                We'll send you a confirmation email with tracking details once your order ships.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ArrowRight className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Estimated Delivery</h3>
              <p className="text-gray-600 text-sm">
                Your order will be delivered within 3-5 business days.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            <div>
              <Link to="/profile" className="text-primary hover:text-primary/80">
                View Order History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage