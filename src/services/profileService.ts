import { supabase } from '../lib/supabase'
import { UserProfile } from '../types'

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      postal_code: user.postal_code || '',
      country: user.country || 'India',
      role: user.role as 'user' | 'admin',
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>): Promise<void> => {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (profile.name !== undefined) updateData.name = profile.name
    if (profile.phone !== undefined) updateData.phone = profile.phone
    if (profile.address !== undefined) updateData.address = profile.address
    if (profile.city !== undefined) updateData.city = profile.city
    if (profile.state !== undefined) updateData.state = profile.state
    if (profile.postal_code !== undefined) updateData.postal_code = profile.postal_code
    if (profile.country !== undefined) updateData.country = profile.country

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)

    if (error) {
      console.error('Error updating user profile:', error)
      throw new Error('Failed to update user profile')
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}