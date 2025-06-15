import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user exists
    const { data: user, error: userError } = await supabaseClient.auth.admin.getUserByEmail(email)
    
    if (userError || !user) {
      // Don't reveal if user exists or not for security
      return new Response(
        JSON.stringify({ message: 'If an account with that email exists, we have sent a password reset link.' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate reset token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store reset token in database
    const { error: tokenError } = await supabaseClient
      .from('password_reset_tokens')
      .insert({
        user_id: user.user.id,
        token,
        expires_at: expiresAt.toISOString()
      })

    if (tokenError) {
      console.error('Error storing reset token:', tokenError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate reset token' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // In a real application, you would send an email here
    // For now, we'll just return the token (remove this in production)
    const resetLink = `${req.headers.get('origin')}/reset-password?token=${token}`
    
    console.log(`Password reset link for ${email}: ${resetLink}`)

    return new Response(
      JSON.stringify({ 
        message: 'If an account with that email exists, we have sent a password reset link.',
        // Remove this in production - only for testing
        resetLink: resetLink
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-reset-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})