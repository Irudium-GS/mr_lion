import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '../components/contact/ContactForm';

function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our products or services? We're here to help. Contact us using the form below or reach out through our contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Visit Us</h3>
                  <p className="text-gray-600 text-sm">
                    123 Kitchen Way<br />
                    Chennai, Tamil Nadu 600001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Call Us</h3>
                  <p className="text-gray-600 text-sm">
                    +91 44 1234 5678<br />
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Email Us</h3>
                  <p className="text-gray-600 text-sm">
                    info@mrlion.com<br />
                    support@mrlion.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Business Hours</h3>
                  <div className="text-gray-600 text-sm space-y-1">
                    <p className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>10:00 AM - 8:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Saturday:</span>
                      <span>10:00 AM - 6:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Closed</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-heading font-semibold mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-heading font-semibold mb-6">Our Location</h2>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src="https://images.pexels.com/photos/271795/pexels-photo-271795.jpeg"
              alt="Mr.Lion Store Location"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
                <h3 className="font-heading font-semibold mb-2">Mr.Lion - Vasanthamaaligai</h3>
                <p className="text-gray-600">
                  Visit our flagship store to experience our premium collection of kitchen and home products in person.
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-4"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;