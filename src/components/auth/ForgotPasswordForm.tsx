import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)
      setServerError('')
      
      await requestPasswordReset(data.email)
      setSuccess(true)
    } catch (error) {
      setServerError('An error occurred. Please try again.')
      console.error('Password reset error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-heading font-bold mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            If an account with that email exists, we have sent a password reset link to your email address.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center text-primary hover:text-primary/80"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          to="/login" 
          className="inline-flex items-center text-gray-600 hover:text-primary mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Login
        </Link>
        <h2 className="text-2xl font-heading font-bold mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {serverError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {serverError}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="form-input"
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary py-3"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordForm