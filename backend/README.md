# Mr.Lion E-commerce API

Laravel-based REST API for the Mr.Lion e-commerce application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
composer install
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

### 3. Database Setup
Update your `.env` file with MySQL database credentials:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mrlion_ecommerce
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 4. Run Migrations and Seeders
```bash
php artisan migrate
php artisan db:seed
```

### 5. Start the Server
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## Default Admin Credentials
- **Email**: admin@mrlion.com
- **Password**: Admin@123

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/admin/products` - Create product (Admin only)
- `PUT /api/admin/products/{id}` - Update product (Admin only)
- `DELETE /api/admin/products/{id}` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID

### Cart (Authenticated)
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Wishlist (Authenticated)
- `GET /api/wishlist` - Get wishlist items
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/{id}` - Remove wishlist item
- `GET /api/wishlist/check/{productId}` - Check if item is in wishlist

## Features
- JWT Authentication
- Role-based access control (User/Admin)
- Product management with categories
- Shopping cart functionality
- Wishlist functionality
- CORS enabled for frontend integration
- MySQL database with proper relationships
- Input validation and error handling