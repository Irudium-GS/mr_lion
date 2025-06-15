import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface ForgotPasswordRequest {
  email: string
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

    const { email }: ForgotPasswordRequest = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required', success: false }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user exists in custom users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()

    // Always return success message for security (don't reveal if email exists)
    const successMessage = 'If an account with that email exists, we have sent a password reset link.'

    if (userError || !user) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: successMessage 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store reset request
    const { error: resetError } = await supabase
      .from('password_reset_requests')
      .insert({
        user_id: user.id,
        reset_token: resetToken,
        expires_at: expiresAt.toISOString(),
      })

    if (resetError) {
      console.error('Error storing reset request:', resetError)
      return new Response(
        JSON.stringify({ error: 'Failed to process password reset request', success: false }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // In a real application, you would send an email here
    // For now, we'll return the reset link for testing
    const resetLink = `${req.headers.get('origin')}/reset-password?token=${resetToken}`
    
    console.log(`Password reset link for ${email}: ${resetLink}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: successMessage,
        // Remove this in production - only for testing
        resetLink: resetLink,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in auth-forgot-password function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', success: false }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})