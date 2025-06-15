import React from 'react'
import { Navigate } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'
import { useAuth } from '../contexts/AuthContext'

function RegisterPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-heading font-bold text-center mb-2">Create Account</h1>
            <p className="text-gray-600 text-center mb-8">
              Join Mr.Lion to start shopping for premium kitchen products
            </p>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage