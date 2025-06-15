import { supabase } from '../lib/supabase'
import { User } from '../types'

export const login = async (email: string, password: string): Promise<User> => {
  try {
    console.log('Attempting login for:', email)
    
    // Query the users table directly
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()

    if (userError || !user) {
      throw new Error('Invalid email or password')
    }

    // Verify password using pgcrypto
    const { data: passwordCheck, error: passwordError } = await supabase
      .rpc('verify_password', {
        input_password: password,
        stored_hash: user.password_hash
      })

    if (passwordError || !passwordCheck) {
      throw new Error('Invalid email or password')
    }

    // Update last login time
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    // Store session in localStorage for demo
    const session = {
      user_id: user.id,
      user_role: user.role,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }
    localStorage.setItem('user_session', JSON.stringify(session))

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'user' | 'admin',
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw new Error(error.message || 'Login failed')
  }
}

export const register = async (name: string, email: string, password: string): Promise<void> => {
  try {
    console.log('Attempting registration for:', email)
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      throw new Error('An account with this email already exists')
    }

    // Hash password using pgcrypto
    const { data: hashedPassword, error: hashError } = await supabase
      .rpc('crypt_password', {
        password: password
      })

    if (hashError || !hashedPassword) {
      throw new Error('Failed to process password')
    }

    // Create new user
    const { error } = await supabase
      .from('users')
      .insert({
        name: name.trim(),
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        email_verified: true, // Auto-verify for demo
        role: 'user',
        is_active: true,
      })

    if (error) {
      console.error('Registration error:', error)
      throw new Error(error.message || 'Registration failed')
    }

    console.log('Registration successful for:', email)
  } catch (error: any) {
    console.error('Registration error:', error)
    throw new Error(error.message || 'Registration failed')
  }
}

export const logout = async (): Promise<void> => {
  try {
    // Clear local storage
    localStorage.removeItem('user_session')
  } catch (error: any) {
    console.error('Logout error:', error)
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check stored session
    const storedSession = localStorage.getItem('user_session')
    if (!storedSession) {
      return null
    }

    const session = JSON.parse(storedSession)
    
    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      localStorage.removeItem('user_session')
      return null
    }

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user_id)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      localStorage.removeItem('user_session')
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'user' | 'admin',
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  try {
    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()

    // Always return success message for security
    const message = 'If an account with that email exists, we have sent a password reset link.'

    if (error || !user) {
      return { message }
    }

    // Generate reset token
    const resetToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store reset request
    await supabase
      .from('password_resets')
      .insert({
        user_id: user.id,
        token: resetToken,
        expires_at: expiresAt.toISOString(),
      })

    // In a real application, you would send an email here
    // For demo purposes, we'll just log the reset link
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`
    console.log(`Password reset link for ${email}: ${resetLink}`)

    // TODO: Implement actual email sending here
    // await sendPasswordResetEmail(user.email, resetLink)

    return { message }
  } catch (error: any) {
    console.error('Password reset request error:', error)
    throw new Error(error.message || 'Password reset request failed')
  }
}

export const resetPassword = async (token: string, password: string): Promise<void> => {
  try {
    // Find and validate reset token
    const { data: resetRequest, error: tokenError } = await supabase
      .from('password_resets')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !resetRequest) {
      throw new Error('Invalid or expired reset token')
    }

    // Hash new password
    const { data: hashedPassword, error: hashError } = await supabase
      .rpc('crypt_password', {
        password: password
      })

    if (hashError || !hashedPassword) {
      throw new Error('Failed to process password')
    }

    // Update user password
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', resetRequest.user_id)

    if (updateError) {
      throw new Error('Failed to update password')
    }

    // Mark token as used
    await supabase
      .from('password_resets')
      .update({ used: true })
      .eq('id', resetRequest.id)

  } catch (error: any) {
    console.error('Password reset error:', error)
    throw new Error(error.message || 'Password reset failed')
  }
}