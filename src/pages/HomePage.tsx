import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import TestimonialsSection from '../components/home/TestimonialsSection';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      
      {/* Promotional Banner */}
      <section className="bg-accent/10 py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                Special Offer This Week!
              </h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Get 20% off on all premium cookware sets. Enhance your kitchen with our exquisite collection.
              </p>
              <Link to="/products?category=cookware" className="btn btn-primary">
                Shop Cookware
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/6306087/pexels-photo-6306087.jpeg"
                  alt="Premium Cookware Set"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                  <p className="text-2xl font-bold text-accent">20% OFF</p>
                  <p className="text-sm">Limited time offer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <TestimonialsSection />
      
      {/* Newsletter Section */}
      <section className="bg-primary/5 py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for exclusive offers, cooking tips, and new product announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="form-input flex-grow"
                required
              />
              <button className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;