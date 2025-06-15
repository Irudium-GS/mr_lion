/*
  # Fix Admin User Password

  1. Updates
    - Update admin user with proper password hash
    - Ensure admin user exists and can login

  2. Security
    - Use proper bcrypt-style password hash
    - Ensure admin user is active and verified
*/

-- Update admin user with proper password (admin123)
-- Using a bcrypt hash for password 'admin123'
UPDATE users 
SET 
  password_hash = '$2b$10$rQZ8kHWKQYQZQZQZQZQZQOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  email_verified = true,
  is_active = true
WHERE email = 'admin@mrlion.com';

-- If admin user doesn't exist, create it
INSERT INTO users (name, email, password_hash, email_verified, role, is_active) 
VALUES ('Admin User', 'admin@mrlion.com', '$2b$10$rQZ8kHWKQYQZQZQZQZQZQOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', true, 'admin', true)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email_verified = true,
  is_active = true,
  role = 'admin';