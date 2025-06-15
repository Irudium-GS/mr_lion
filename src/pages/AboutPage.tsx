import React from 'react';
import { Award, Users, Clock, Truck } from 'lucide-react';

function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-primary/10 py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Our Story
              </h1>
              <p className="text-gray-600 mb-4">
                Mr.Lion was founded with a passion for bringing elegant, high-quality kitchen and home appliances to discerning customers. Our name "Vasanthamaaligai" translates to "palace of spring," symbolizing freshness, renewal, and the royal elegance we bring to every home.
              </p>
              <p className="text-gray-600">
                Since our inception in 2015, we've been dedicated to curating products that combine functionality with beautiful design, making everyday cooking and home tasks more enjoyable.
              </p>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <img
                src="https://images.pexels.com/photos/7045482/pexels-photo-7045482.jpeg"
                alt="Mr.Lion Store Interior"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Our Mission & Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe that quality kitchen tools and appliances should be accessible to everyone who appreciates fine craftsmanship and thoughtful design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-secondary/10 rounded-lg p-6 shadow-sm fade-in">
              <h3 className="text-xl font-heading font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To enrich everyday life by providing beautifully designed, high-quality kitchen and home products that inspire creativity and make daily tasks a pleasure. We aim to be your trusted partner in creating a home that reflects your style and meets your needs.
              </p>
            </div>
            
            <div className="bg-accent/10 rounded-lg p-6 shadow-sm fade-in">
              <h3 className="text-xl font-heading font-semibold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the premier destination for home and kitchen essentials, known for our curated selection, exceptional quality, and outstanding customer service. We envision homes transformed by our products, where cooking and homemaking become joyful experiences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100 text-center fade-in">
              <Award className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-medium mb-2">Quality</h4>
              <p className="text-sm text-gray-600">We never compromise on materials, craftsmanship, or performance.</p>
            </div>
            
            <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100 text-center fade-in">
              <Users className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-medium mb-2">Community</h4>
              <p className="text-sm text-gray-600">We build relationships with our customers and support local artisans.</p>
            </div>
            
            <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100 text-center fade-in">
              <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-medium mb-2">Innovation</h4>
              <p className="text-sm text-gray-600">We embrace new technologies that enhance home experiences.</p>
            </div>
            
            <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100 text-center fade-in">
              <Truck className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-medium mb-2">Service</h4>
              <p className="text-sm text-gray-600">We provide exceptional support and stand behind every product.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our passionate team of experts is dedicated to bringing you the finest selection of home and kitchen products.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md fade-in">
              <img 
                src="https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg"
                alt="Raj Mehta - Founder & CEO" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-5">
                <h3 className="font-heading font-semibold text-lg mb-1">Raj Mehta</h3>
                <p className="text-primary text-sm mb-3">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  With over 15 years in culinary design, Raj founded Mr.Lion to share his passion for kitchen excellence with the world.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md fade-in">
              <img 
                src="https://images.pexels.com/photos/3727468/pexels-photo-3727468.jpeg"
                alt="Ananya Desai - Head of Design" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-5">
                <h3 className="font-heading font-semibold text-lg mb-1">Ananya Desai</h3>
                <p className="text-primary text-sm mb-3">Head of Design</p>
                <p className="text-gray-600 text-sm">
                  Ananya brings her artistic vision to our product curation, ensuring each item meets our aesthetic standards.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md fade-in">
              <img 
                src="https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg"
                alt="Karthik Raman - Customer Experience" 
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-5">
                <h3 className="font-heading font-semibold text-lg mb-1">Karthik Raman</h3>
                <p className="text-primary text-sm mb-3">Customer Experience</p>
                <p className="text-gray-600 text-sm">
                  Karthik ensures every customer interaction with Mr.Lion is positive, helpful, and memorable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Location */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                Visit Our Store
              </h2>
              <p className="text-gray-600 mb-4">
                Experience our products in person at our flagship store. Our knowledgeable staff will help you find the perfect items for your home.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Store Hours</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>10:00 AM - 8:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 9:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>11:00 AM - 6:00 PM</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Address</h4>
                <address className="text-gray-600 text-sm not-italic">
                  123 Kitchen Way<br />
                  Chennai, Tamil Nadu 600001<br />
                  India
                </address>
                <p className="text-gray-600 text-sm mt-2">
                  Phone: +91 44 1234 5678<br />
                  Email: info@mrlion.com
                </p>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="rounded-lg overflow-hidden shadow-md">
                {/* Placeholder for a map - in a real application, this would be an actual map */}
                <div className="bg-gray-200 h-72 flex items-center justify-center">
                  <img
                    src="https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg"
                    alt="Mr.Lion Store Location"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;