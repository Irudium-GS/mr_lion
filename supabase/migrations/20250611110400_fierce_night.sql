/*
  # Complete E-commerce Database Schema

  1. New Tables
    - `categories` - Product categories with hierarchical support
    - `products` - Main products table with full e-commerce fields
    - `profiles` - User profiles linked to auth.users
    - `orders` - Customer orders
    - `order_items` - Individual items within orders
    - `password_reset_tokens` - Secure password reset functionality

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for authenticated users
    - Add trigger for automatic profile creation

  3. Features
    - Automatic profile creation on user signup
    - Full product catalog with categories
    - Order management system
    - Secure password reset tokens
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  parent_id uuid REFERENCES categories(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  price decimal(10,2) NOT NULL,
  compare_price decimal(10,2),
  cost_price decimal(10,2),
  sku text UNIQUE,
  barcode text,
  track_quantity boolean DEFAULT true,
  quantity integer DEFAULT 0,
  allow_backorder boolean DEFAULT false,
  weight decimal(8,2),
  length decimal(8,2),
  width decimal(8,2),
  height decimal(8,2),
  category_id uuid REFERENCES categories(id),
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  avatar_url text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  payment_id text,
  subtotal decimal(10,2) NOT NULL,
  tax_amount decimal(10,2) DEFAULT 0,
  shipping_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Products policies (public read, admin write)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles can be created by system"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Order items policies
CREATE POLICY "Users can view own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Password reset tokens policies
CREATE POLICY "Users can view own reset tokens"
  ON password_reset_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create reset tokens"
  ON password_reset_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update reset tokens"
  ON password_reset_tokens
  FOR UPDATE
  TO authenticated
  USING (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO categories (name, slug, description, is_active) VALUES
  ('Electronics', 'electronics', 'Electronic devices and gadgets', true),
  ('Clothing', 'clothing', 'Fashion and apparel', true),
  ('Home & Garden', 'home-garden', 'Home improvement and gardening supplies', true),
  ('Books', 'books', 'Books and literature', true),
  ('Sports', 'sports', 'Sports and outdoor equipment', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, price, category_id, images, is_active, is_featured) VALUES
  (
    'Wireless Bluetooth Headphones',
    'wireless-bluetooth-headphones',
    'High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals.',
    'Premium wireless headphones with noise cancellation',
    199.99,
    (SELECT id FROM categories WHERE slug = 'electronics'),
    ARRAY['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'],
    true,
    true
  ),
  (
    'Smart Fitness Watch',
    'smart-fitness-watch',
    'Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone connectivity.',
    'Smart watch with fitness tracking and GPS',
    299.99,
    (SELECT id FROM categories WHERE slug = 'electronics'),
    ARRAY['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'],
    true,
    true
  ),
  (
    'Organic Cotton T-Shirt',
    'organic-cotton-tshirt',
    'Comfortable and sustainable organic cotton t-shirt available in multiple colors and sizes.',
    'Eco-friendly organic cotton t-shirt',
    29.99,
    (SELECT id FROM categories WHERE slug = 'clothing'),
    ARRAY['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'],
    true,
    true
  ),
  (
    'Professional Coffee Maker',
    'professional-coffee-maker',
    'High-end coffee maker with programmable settings and thermal carafe for the perfect brew every time.',
    'Premium coffee maker with thermal carafe',
    149.99,
    (SELECT id FROM categories WHERE slug = 'home-garden'),
    ARRAY['https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg'],
    true,
    true
  ),
  (
    'Yoga Mat Premium',
    'yoga-mat-premium',
    'Non-slip premium yoga mat made from eco-friendly materials. Perfect for all types of yoga practice.',
    'Premium eco-friendly yoga mat',
    49.99,
    (SELECT id FROM categories WHERE slug = 'sports'),
    ARRAY['https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg'],
    true,
    true
  ),
  (
    'Programming Fundamentals Book',
    'programming-fundamentals-book',
    'Comprehensive guide to programming fundamentals covering multiple languages and best practices.',
    'Complete programming guide for beginners',
    39.99,
    (SELECT id FROM categories WHERE slug = 'books'),
    ARRAY['https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'],
    true,
    true
  ),
  (
    'Wireless Gaming Mouse',
    'wireless-gaming-mouse',
    'High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons.',
    'Professional wireless gaming mouse',
    79.99,
    (SELECT id FROM categories WHERE slug = 'electronics'),
    ARRAY['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg'],
    true,
    false
  ),
  (
    'Denim Jacket Classic',
    'denim-jacket-classic',
    'Timeless denim jacket made from premium denim fabric. A wardrobe essential for any season.',
    'Classic premium denim jacket',
    89.99,
    (SELECT id FROM categories WHERE slug = 'clothing'),
    ARRAY['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'],
    true,
    false
  )
ON CONFLICT (slug) DO NOTHING;