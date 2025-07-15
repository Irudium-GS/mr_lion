-- Mr.Lion E-commerce Database Schema
-- Complete MySQL Database Structure

-- Create Database
CREATE DATABASE IF NOT EXISTS mrlion_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mrlion_ecommerce;

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    postal_code VARCHAR(20) NULL,
    country VARCHAR(100) DEFAULT 'India',
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url VARCHAR(500) NULL,
    last_login_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);

-- =============================================
-- 2. CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    image_url VARCHAR(500) NULL,
    parent_id BIGINT UNSIGNED NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order)
);

-- =============================================
-- 3. PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    short_description TEXT NULL,
    sku VARCHAR(100) UNIQUE NULL,
    barcode VARCHAR(100) NULL,
    price DECIMAL(10, 2) NOT NULL,
    compare_price DECIMAL(10, 2) NULL,
    cost_price DECIMAL(10, 2) NULL,
    category_id BIGINT UNSIGNED NULL,
    images JSON NULL,
    tags JSON NULL,
    weight DECIMAL(8, 2) NULL,
    length DECIMAL(8, 2) NULL,
    width DECIMAL(8, 2) NULL,
    height DECIMAL(8, 2) NULL,
    stock_quantity INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    track_quantity BOOLEAN DEFAULT TRUE,
    allow_backorder BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255) NULL,
    meta_description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_sku (sku),
    INDEX idx_category_id (category_id),
    INDEX idx_price (price),
    INDEX idx_stock_quantity (stock_quantity),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    FULLTEXT idx_search (name, description, short_description)
);

-- =============================================
-- 4. CART ITEMS TABLE
-- =============================================
CREATE TABLE cart_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
);

-- =============================================
-- 5. WISHLIST ITEMS TABLE
-- =============================================
CREATE TABLE wishlist_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
);

-- =============================================
-- 6. ORDERS TABLE
-- =============================================
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'partial') DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    shipping_address JSON NULL,
    billing_address JSON NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- 7. ORDER ITEMS TABLE
-- =============================================
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- =============================================
-- 8. PAYMENTS TABLE
-- =============================================
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    razorpay_order_id VARCHAR(100) NULL,
    razorpay_payment_id VARCHAR(100) NULL,
    razorpay_signature VARCHAR(255) NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status ENUM('pending', 'success', 'failed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50) NULL,
    gateway_response JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_razorpay_order_id (razorpay_order_id),
    INDEX idx_razorpay_payment_id (razorpay_payment_id),
    INDEX idx_status (status)
);

-- =============================================
-- 9. PASSWORD RESETS TABLE
-- =============================================
CREATE TABLE password_resets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- =============================================
-- 10. COUPONS TABLE (Optional)
-- =============================================
CREATE TABLE coupons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    type ENUM('fixed', 'percentage') NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    minimum_amount DECIMAL(10, 2) DEFAULT 0.00,
    maximum_discount DECIMAL(10, 2) NULL,
    usage_limit INT NULL,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_expires_at (expires_at)
);

-- =============================================
-- 11. REVIEWS TABLE (Optional)
-- =============================================
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NULL,
    comment TEXT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_product_order (user_id, product_id, order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_rating (rating),
    INDEX idx_is_approved (is_approved)
);

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert Admin User
INSERT INTO users (name, email, password, role, is_active) VALUES
('Admin User', 'admin@mrlion.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- Insert Categories
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
('Kitchen Essentials', 'kitchen-essentials', 'Must-have tools for your culinary adventures', TRUE, 1),
('Cookware', 'cookware', 'Premium pots, pans, and bakeware', TRUE, 2),
('Appliances', 'appliances', 'Modern technology for your kitchen', TRUE, 3),
('Dining', 'dining', 'Elegant dining and serving accessories', TRUE, 4),
('Storage', 'storage', 'Smart storage solutions for your kitchen', TRUE, 5);

-- Insert Sample Products
INSERT INTO products (name, slug, description, short_description, sku, price, compare_price, category_id, images, stock_quantity, weight, length, width, height, is_active, is_featured) VALUES
('Premium Non-Stick Frying Pan', 'premium-non-stick-frying-pan', 'Professional-grade non-stick frying pan with ceramic coating. Perfect for healthy cooking with minimal oil. Features ergonomic handle and even heat distribution.', 'Professional non-stick frying pan with ceramic coating', 'PAN-001', 2499.00, 3499.00, 2, '["https://images.pexels.com/photos/6605308/pexels-photo-6605308.jpeg"]', 25, 1.2, 30.0, 30.0, 5.0, TRUE, TRUE),

('Stainless Steel Cookware Set', 'stainless-steel-cookware-set', 'Complete 7-piece stainless steel cookware set including pots, pans, and lids. Dishwasher safe and compatible with all cooktops including induction.', '7-piece stainless steel cookware set', 'SET-001', 8999.00, 12999.00, 2, '["https://images.pexels.com/photos/6996052/pexels-photo-6996052.jpeg"]', 15, 5.5, 45.0, 35.0, 25.0, TRUE, TRUE),

('Digital Kitchen Scale', 'digital-kitchen-scale', 'Precision digital kitchen scale with LCD display. Weighs up to 5kg with 1g accuracy. Perfect for baking and portion control.', 'Precision digital kitchen scale with LCD display', 'SCALE-001', 1299.00, 1899.00, 1, '["https://images.pexels.com/photos/4112715/pexels-photo-4112715.jpeg"]', 30, 1.8, 25.0, 20.0, 3.0, TRUE, TRUE),

('Multi-Function Food Processor', 'multi-function-food-processor', 'Powerful 800W food processor with multiple attachments. Chop, slice, dice, and puree with ease. Large 2L capacity bowl.', 'Powerful 800W food processor with multiple attachments', 'PROC-001', 5999.00, 7999.00, 3, '["https://images.pexels.com/photos/6996085/pexels-photo-6996085.jpeg"]', 12, 4.2, 35.0, 25.0, 40.0, TRUE, TRUE),

('Bamboo Cutting Board Set', 'bamboo-cutting-board-set', 'Eco-friendly bamboo cutting board set with 3 different sizes. Naturally antimicrobial and gentle on knives.', 'Eco-friendly bamboo cutting board set', 'BOARD-001', 1599.00, 2299.00, 1, '["https://images.pexels.com/photos/6306087/pexels-photo-6306087.jpeg"]', 40, 2.1, 40.0, 30.0, 3.0, TRUE, FALSE);

-- Insert Sample Coupon
INSERT INTO coupons (code, name, description, type, value, minimum_amount, is_active, expires_at) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 1000.00, TRUE, DATE_ADD(NOW(), INTERVAL 30 DAY));

-- =============================================
-- USEFUL VIEWS
-- =============================================

-- View for Product Details with Category
CREATE VIEW product_details AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    (SELECT AVG(rating) FROM reviews WHERE product_id = p.id AND is_approved = TRUE) as avg_rating,
    (SELECT COUNT(*) FROM reviews WHERE product_id = p.id AND is_approved = TRUE) as review_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE;

-- View for Order Summary
CREATE VIEW order_summary AS
SELECT 
    o.*,
    u.name as customer_name,
    u.email as customer_email,
    COUNT(oi.id) as item_count,
    SUM(oi.quantity) as total_quantity
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- =============================================
-- STORED PROCEDURES
-- =============================================

DELIMITER //

-- Procedure to update product stock after order
CREATE PROCEDURE UpdateProductStock(
    IN p_product_id BIGINT,
    IN p_quantity INT
)
BEGIN
    UPDATE products 
    SET stock_quantity = stock_quantity - p_quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_product_id;
END //

-- Procedure to calculate order total
CREATE PROCEDURE CalculateOrderTotal(
    IN p_order_id BIGINT,
    OUT p_total DECIMAL(10,2)
)
BEGIN
    SELECT SUM(total_price) INTO p_total
    FROM order_items
    WHERE order_id = p_order_id;
END //

DELIMITER ;

-- =============================================
-- TRIGGERS
-- =============================================

DELIMITER //

-- Trigger to update product updated_at when stock changes
CREATE TRIGGER update_product_timestamp
    BEFORE UPDATE ON products
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

-- Trigger to validate stock before adding to cart
CREATE TRIGGER check_stock_before_cart
    BEFORE INSERT ON cart_items
    FOR EACH ROW
BEGIN
    DECLARE available_stock INT;
    SELECT stock_quantity INTO available_stock
    FROM products
    WHERE id = NEW.product_id AND is_active = TRUE;
    
    IF available_stock < NEW.quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock available';
    END IF;
END //

DELIMITER ;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Additional performance indexes
CREATE INDEX idx_products_price_range ON products(price, is_active);
CREATE INDEX idx_orders_date_status ON orders(created_at, status);
CREATE INDEX idx_cart_items_user_created ON cart_items(user_id, created_at);
CREATE INDEX idx_wishlist_user_created ON wishlist_items(user_id, created_at);

-- =============================================
-- GRANTS AND PERMISSIONS
-- =============================================

-- Create application user (replace with your actual credentials)
-- CREATE USER 'mrlion_app'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON mrlion_ecommerce.* TO 'mrlion_app'@'localhost';
-- FLUSH PRIVILEGES;

-- =============================================
-- BACKUP AND MAINTENANCE
-- =============================================

-- Example backup command (run from command line):
-- mysqldump -u root -p mrlion_ecommerce > mrlion_backup_$(date +%Y%m%d).sql

-- Example restore command:
-- mysql -u root -p mrlion_ecommerce < mrlion_backup_20241201.sql