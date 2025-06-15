import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  // Get success message from location state (from registration)
  const successMessage = location.state?.message

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setServerError('')
      
      await login(data.email, data.password)
      
      // Clear any success message from state
      window.history.replaceState({}, document.title)
      navigate('/')
    } catch (error: any) {
      setServerError(error.message || 'An error occurred during login. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {successMessage && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      
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
      
      <div>
        <label htmlFor="password" className="form-label">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register('password')}
            className="form-input pr-10"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <Link 
          to="/forgot-password" 
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          Forgot password?
        </Link>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn btn-primary py-3"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary/80">
            Create an account
          </Link>
        </p>
      </div>
    </form>
  )
}

export default LoginForm