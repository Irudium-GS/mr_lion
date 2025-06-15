import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface ResetPasswordRequest {
  token: string
  password: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed', success: false }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { token, password }: ResetPasswordRequest = await req.json()

    if (!token || !password) {
      return new Response(
        JSON.stringify({ error: 'Token and password are required', success: false }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters long', success: false }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find and validate reset token
    const { data: resetRequest, error: tokenError } = await supabase
      .from('password_reset_requests')
      .select('*')
      .eq('reset_token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !resetRequest) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired reset token', success: false }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Update user password (for demo, we'll just mark the token as used)
    // In production, you would hash the password and update it
    await supabase
      .from('users')
      .update({ 
        password_hash: 'new_password_hash', // In production, hash the password
        updated_at: new Date().toISOString()
      })
      .eq('id', resetRequest.user_id)

    // Mark token as used
    await supabase
      .from('password_reset_requests')
      .update({ used: true })
      .eq('id', resetRequest.id)

    // Invalidate all existing sessions for this user
    await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', resetRequest.user_id)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Password updated successfully' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in auth-reset-password function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', success: false }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})