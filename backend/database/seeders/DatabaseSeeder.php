<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@mrlion.com',
            'password' => Hash::make('Admin@123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create categories
        $categories = [
            [
                'name' => 'Kitchen Essentials',
                'slug' => 'kitchen-essentials',
                'description' => 'Must-have tools for your culinary adventures',
                'is_active' => true,
            ],
            [
                'name' => 'Cookware',
                'slug' => 'cookware',
                'description' => 'Premium pots, pans, and bakeware',
                'is_active' => true,
            ],
            [
                'name' => 'Appliances',
                'slug' => 'appliances',
                'description' => 'Modern technology for your kitchen',
                'is_active' => true,
            ],
            [
                'name' => 'Dining',
                'slug' => 'dining',
                'description' => 'Elegant dining and serving accessories',
                'is_active' => true,
            ],
            [
                'name' => 'Storage',
                'slug' => 'storage',
                'description' => 'Smart storage solutions for your kitchen',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create sample products
        $cookwareCategory = Category::where('slug', 'cookware')->first();
        $kitchenCategory = Category::where('slug', 'kitchen-essentials')->first();
        $appliancesCategory = Category::where('slug', 'appliances')->first();

        $products = [
            [
                'name' => 'Premium Non-Stick Frying Pan',
                'slug' => 'premium-non-stick-frying-pan',
                'description' => 'Professional-grade non-stick frying pan with ceramic coating. Perfect for healthy cooking with minimal oil. Features ergonomic handle and even heat distribution.',
                'short_description' => 'Professional non-stick frying pan with ceramic coating',
                'sku' => 'PAN-001',
                'price' => 2499.00,
                'compare_price' => 3499.00,
                'category_id' => $cookwareCategory->id,
                'images' => ['https://images.pexels.com/photos/6605308/pexels-photo-6605308.jpeg'],
                'stock_quantity' => 25,
                'weight' => 1.2,
                'length' => 30.0,
                'width' => 30.0,
                'height' => 5.0,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'name' => 'Stainless Steel Cookware Set',
                'slug' => 'stainless-steel-cookware-set',
                'description' => 'Complete 7-piece stainless steel cookware set including pots, pans, and lids. Dishwasher safe and compatible with all cooktops including induction.',
                'short_description' => '7-piece stainless steel cookware set',
                'sku' => 'SET-001',
                'price' => 8999.00,
                'compare_price' => 12999.00,
                'category_id' => $cookwareCategory->id,
                'images' => ['https://images.pexels.com/photos/6996052/pexels-photo-6996052.jpeg'],
                'stock_quantity' => 15,
                'weight' => 5.5,
                'length' => 45.0,
                'width' => 35.0,
                'height' => 25.0,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'name' => 'Digital Kitchen Scale',
                'slug' => 'digital-kitchen-scale',
                'description' => 'Precision digital kitchen scale with LCD display. Weighs up to 5kg with 1g accuracy. Perfect for baking and portion control.',
                'short_description' => 'Precision digital kitchen scale with LCD display',
                'sku' => 'SCALE-001',
                'price' => 1299.00,
                'compare_price' => 1899.00,
                'category_id' => $kitchenCategory->id,
                'images' => ['https://images.pexels.com/photos/4112715/pexels-photo-4112715.jpeg'],
                'stock_quantity' => 30,
                'weight' => 1.8,
                'length' => 25.0,
                'width' => 20.0,
                'height' => 3.0,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'name' => 'Multi-Function Food Processor',
                'slug' => 'multi-function-food-processor',
                'description' => 'Powerful 800W food processor with multiple attachments. Chop, slice, dice, and puree with ease. Large 2L capacity bowl.',
                'short_description' => 'Powerful 800W food processor with multiple attachments',
                'sku' => 'PROC-001',
                'price' => 5999.00,
                'compare_price' => 7999.00,
                'category_id' => $appliancesCategory->id,
                'images' => ['https://images.pexels.com/photos/6996085/pexels-photo-6996085.jpeg'],
                'stock_quantity' => 12,
                'weight' => 4.2,
                'length' => 35.0,
                'width' => 25.0,
                'height' => 40.0,
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'name' => 'Bamboo Cutting Board Set',
                'slug' => 'bamboo-cutting-board-set',
                'description' => 'Eco-friendly bamboo cutting board set with 3 different sizes. Naturally antimicrobial and gentle on knives.',
                'short_description' => 'Eco-friendly bamboo cutting board set',
                'sku' => 'BOARD-001',
                'price' => 1599.00,
                'compare_price' => 2299.00,
                'category_id' => $kitchenCategory->id,
                'images' => ['https://images.pexels.com/photos/6306087/pexels-photo-6306087.jpeg'],
                'stock_quantity' => 40,
                'weight' => 2.1,
                'length' => 40.0,
                'width' => 30.0,
                'height' => 3.0,
                'is_active' => true,
                'is_featured' => false,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}