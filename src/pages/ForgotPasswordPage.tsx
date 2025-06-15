import React from 'react'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage