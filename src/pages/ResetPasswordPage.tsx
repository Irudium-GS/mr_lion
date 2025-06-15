import React from 'react'
import ResetPasswordForm from '../components/auth/ResetPasswordForm'

function ResetPasswordPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage