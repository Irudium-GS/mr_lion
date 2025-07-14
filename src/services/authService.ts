import { api } from './api';
import { User } from '../types';

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await api.auth.login({ email, password });
    
    if (response.success) {
      // Store token in localStorage
      localStorage.setItem('auth_token', response.token);
      
      return {
        id: response.user.id.toString(),
        name: response.user.name,
        email: response.user.email,
        role: response.user.role as 'user' | 'admin',
      };
    } else {
      throw new Error(response.message || 'Login failed');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

export const register = async (name: string, email: string, password: string): Promise<void> => {
  try {
    const response = await api.auth.register({ name, email, password });
    
    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.auth.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage
    localStorage.removeItem('auth_token');
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }

    const response = await api.auth.me();
    
    if (response.success) {
      return {
        id: response.user.id.toString(),
        name: response.user.name,
        email: response.user.email,
        role: response.user.role as 'user' | 'admin',
      };
    } else {
      // Token might be invalid, remove it
      localStorage.removeItem('auth_token');
      return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    localStorage.removeItem('auth_token');
    return null;
  }
};

export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  // This would be implemented when you add password reset functionality
  return { message: 'Password reset functionality will be implemented soon.' };
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  // This would be implemented when you add password reset functionality
  throw new Error('Password reset functionality will be implemented soon.');
};