import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'
import { 
  login as apiLogin, 
  register as apiRegister, 
  logout as apiLogout,
  getCurrentUser,
  requestPasswordReset as apiRequestPasswordReset,
  resetPassword as apiResetPassword
} from '../services/authService'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ message: string; resetLink?: string }>
  resetPassword: (token: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await apiLogin(email, password)
      setUser(userData)
      
      // Store session for demo purposes
      const session = {
        user_id: userData.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }
      localStorage.setItem('user_session', JSON.stringify(session))
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await apiRegister(name, email, password)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await apiLogout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const requestPasswordReset = async (email: string): Promise<{ message: string; resetLink?: string }> => {
    return await apiRequestPasswordReset(email)
  }

  const resetPassword = async (token: string, password: string): Promise<void> => {
    await apiResetPassword(token, password)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}