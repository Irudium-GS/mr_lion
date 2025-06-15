import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { WishlistProvider } from './contexts/WishlistContext'
import Layout from './components/layout/Layout'
import Loading from './components/ui/Loading'
import ProtectedRoute from './components/auth/ProtectedRoute'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage'))
const AddProductPage = lazy(() => import('./pages/AddProductPage'))
const EditProductPage = lazy(() => import('./pages/EditProductPage'))

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Layout>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/order-success" 
                  element={
                    <ProtectedRoute>
                      <OrderSuccessPage />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/admin-panel"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminPanelPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/products/new"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AddProductPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/products/:id/edit"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <EditProductPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}

export default App