import React from 'react';
import { Star } from 'lucide-react';

function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      text: 'The quality of Mr.Lion products exceeded my expectations. My kitchen looks completely transformed with these beautiful appliances.',
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      rating: 5,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      text: 'Incredible customer service and the products are top-notch. I especially love my new coffee maker - it\'s elegant and works perfectly.',
    },
    {
      id: 3,
      name: 'Anjali Patel',
      rating: 4,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      text: 'The cookware set I purchased has made cooking so much more enjoyable. These products truly combine functionality with beautiful design.',
    },
  ];

  return (
    <section className="py-16 bg-primary/5">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Hear from our satisfied customers about their experience with Mr.Lion products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-6 rounded-lg shadow-md fade-in"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <div className="flex text-gold mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < testimonial.rating ? "currentColor" : "none"} 
                        className={i < testimonial.rating ? "" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;