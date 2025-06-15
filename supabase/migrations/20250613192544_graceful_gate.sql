/*
  # Complete E-commerce Database Rebuild

  1. New Tables
    - `users` - Complete user management with authentication
    - `categories` - Product categories
    - `products` - Complete product catalog
    - `cart_items` - User shopping cart
    - `wishlist_items` - User wishlist
    - `orders` - Order management
    - `order_items` - Order line items
    - `payments` - Payment history with Razorpay
    - `password_resets` - Password reset tokens

  2. Security
    - Enable RLS on all tables
    - Comprehensive policies for users and admins
    - Secure authentication flow

  3. Features
    - Complete CRUD operations
    - Admin panel functionality
    - Cart and wishlist persistence
    - Payment integration ready
    - Email verification system
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table for authentication and profiles
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  phone text,
  address text,
  city text,
  state text,
  postal_code text,
  country text DEFAULT 'India',
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  email_verified boolean DEFAULT false,
  email_verification_token text,
  is_active boolean DEFAULT true,
  avatar_url text,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  parent_id uuid REFERENCES categories(id),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  sku text UNIQUE,
  barcode text,
  price decimal(10,2) NOT NULL,
  compare_price decimal(10,2),
  cost_price decimal(10,2),
  category_id uuid REFERENCES categories(id),
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  weight decimal(8,2),
  length decimal(8,2),
  width decimal(8,2),
  height decimal(8,2),
  stock_quantity integer DEFAULT 0,
  low_stock_threshold integer DEFAULT 5,
  track_quantity boolean DEFAULT true,
  allow_backorder boolean DEFAULT false,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart items table
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Wishlist items table
CREATE TABLE wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partial')),
  subtotal decimal(10,2) NOT NULL,
  tax_amount decimal(10,2) DEFAULT 0,
  shipping_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'INR',
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_sku text,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Payments table for Razorpay integration
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
  payment_method text,
  gateway_response jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Password reset tokens table
CREATE TABLE password_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (id = current_setting('app.current_user_id')::uuid OR current_setting('app.user_role') = 'admin');

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = current_setting('app.current_user_id')::uuid);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (current_setting('app.user_role') = 'admin');

CREATE POLICY "Public registration" ON users
  FOR INSERT WITH CHECK (true);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (current_setting('app.user_role') = 'admin');

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (current_setting('app.user_role') = 'admin');

-- Cart items policies
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);

-- Wishlist items policies
CREATE POLICY "Users can manage own wishlist" ON wishlist_items
  FOR ALL USING (user_id = current_setting('app.current_user_id')::uuid);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = current_setting('app.current_user_id')::uuid OR current_setting('app.user_role') = 'admin');

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL USING (current_setting('app.user_role') = 'admin');

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = current_setting('app.current_user_id')::uuid OR current_setting('app.user_role') = 'admin')
    )
  );

CREATE POLICY "Users can create order items for own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = current_setting('app.current_user_id')::uuid
    )
  );

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (user_id = current_setting('app.current_user_id')::uuid OR current_setting('app.user_role') = 'admin');

CREATE POLICY "Users can create own payments" ON payments
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY "Admins can manage payments" ON payments
  FOR ALL USING (current_setting('app.user_role') = 'admin');

-- Password resets policies
CREATE POLICY "Password resets are public" ON password_resets
  FOR ALL USING (true);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id);

-- Insert default admin user
-- Email: admin@mrlion.com
-- Password: Admin@123
INSERT INTO users (
  email, 
  password_hash, 
  name, 
  role, 
  email_verified, 
  is_active
) VALUES (
  'admin@mrlion.com',
  crypt('Admin@123', gen_salt('bf')),
  'Admin User',
  'admin',
  true,
  true
);

-- Insert sample categories
INSERT INTO categories (name, slug, description, is_active) VALUES
  ('Kitchen Essentials', 'kitchen-essentials', 'Must-have tools for your culinary adventures', true),
  ('Cookware', 'cookware', 'Premium pots, pans, and bakeware', true),
  ('Appliances', 'appliances', 'Modern technology for your kitchen', true),
  ('Dining', 'dining', 'Elegant dining and serving accessories', true),
  ('Storage', 'storage', 'Smart storage solutions for your kitchen', true);

-- Insert sample products
INSERT INTO products (
  name, 
  slug, 
  description, 
  short_description,
  sku,
  price, 
  compare_price,
  category_id, 
  images, 
  stock_quantity,
  weight,
  length,
  width,
  height,
  is_active, 
  is_featured
) VALUES
  (
    'Premium Non-Stick Frying Pan',
    'premium-non-stick-frying-pan',
    'Professional-grade non-stick frying pan with ceramic coating. Perfect for healthy cooking with minimal oil. Features ergonomic handle and even heat distribution.',
    'Professional non-stick frying pan with ceramic coating',
    'PAN-001',
    2499.00,
    3499.00,
    (SELECT id FROM categories WHERE slug = 'cookware'),
    ARRAY['https://images.pexels.com/photos/6605308/pexels-photo-6605308.jpeg'],
    25,
    1.2,
    30.0,
    30.0,
    5.0,
    true,
    true
  ),
  (
    'Stainless Steel Cookware Set',
    'stainless-steel-cookware-set',
    'Complete 7-piece stainless steel cookware set including pots, pans, and lids. Dishwasher safe and compatible with all cooktops including induction.',
    '7-piece stainless steel cookware set',
    'SET-001',
    8999.00,
    12999.00,
    (SELECT id FROM categories WHERE slug = 'cookware'),
    ARRAY['https://images.pexels.com/photos/6996052/pexels-photo-6996052.jpeg'],
    15,
    5.5,
    45.0,
    35.0,
    25.0,
    true,
    true
  ),
  (
    'Digital Kitchen Scale',
    'digital-kitchen-scale',
    'Precision digital kitchen scale with LCD display. Weighs up to 5kg with 1g accuracy. Perfect for baking and portion control.',
    'Precision digital kitchen scale with LCD display',
    'SCALE-001',
    1299.00,
    1899.00,
    (SELECT id FROM categories WHERE slug = 'kitchen-essentials'),
    ARRAY['https://images.pexels.com/photos/4112715/pexels-photo-4112715.jpeg'],
    30,
    1.8,
    25.0,
    20.0,
    3.0,
    true,
    true
  ),
  (
    'Multi-Function Food Processor',
    'multi-function-food-processor',
    'Powerful 800W food processor with multiple attachments. Chop, slice, dice, and puree with ease. Large 2L capacity bowl.',
    'Powerful 800W food processor with multiple attachments',
    'PROC-001',
    5999.00,
    7999.00,
    (SELECT id FROM categories WHERE slug = 'appliances'),
    ARRAY['https://images.pexels.com/photos/6996085/pexels-photo-6996085.jpeg'],
    12,
    4.2,
    35.0,
    25.0,
    40.0,
    true,
    true
  ),
  (
    'Bamboo Cutting Board Set',
    'bamboo-cutting-board-set',
    'Eco-friendly bamboo cutting board set with 3 different sizes. Naturally antimicrobial and gentle on knives.',
    'Eco-friendly bamboo cutting board set',
    'BOARD-001',
    1599.00,
    2299.00,
    (SELECT id FROM categories WHERE slug = 'kitchen-essentials'),
    ARRAY['https://images.pexels.com/photos/6306087/pexels-photo-6306087.jpeg'],
    40,
    2.1,
    40.0,
    30.0,
    3.0,
    true,
    false
  );