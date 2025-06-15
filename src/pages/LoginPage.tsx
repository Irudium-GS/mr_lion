import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-heading font-bold text-center mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-center mb-8">
              Sign in to your account to continue shopping
            </p>

            {message && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
                {message}
              </div>
            )}

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;