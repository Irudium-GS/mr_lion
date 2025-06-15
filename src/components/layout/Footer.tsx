import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

function Footer() {
  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { label: 'Kitchen Essentials', href: '/products?category=essentials' },
        { label: 'Cookware', href: '/products?category=cookware' },
        { label: 'Appliances', href: '/products?category=appliances' },
      ],
    },
    {
      title: 'Information',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { label: 'Shipping Policy', href: '/shipping' },
        { label: 'Returns & Refunds', href: '/returns' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Customer Support', href: '/support' },
      ],
    },
  ];

  return (
    <footer className="bg-primary/10 pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Information */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <div className="mr-2 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3h8a2 2 0 0 1 2 2v5.5a2.5 2.5 0 0 1-2.5 2.5H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                  <path d="M12 13v8" />
                  <path d="M8 13h8" />
                  <path d="M2 13h2" />
                  <path d="M20 13h2" />
                  <path d="m8 21 4-4 4 4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-primary">Mr.Lion</h2>
                <p className="text-[0.6rem] text-gold font-light tracking-wider">VASANTHAMAALIGAI</p>
              </div>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Bringing royal elegance to every home with our premium kitchen and home appliances.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/80 transition-colors"
                aria-label="Facebook"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/80 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 6.5H17.51"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/80 transition-colors"
                aria-label="Twitter"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.95729 14.8821 3.28445C14.0247 3.61161 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-md font-heading font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h3 className="text-md font-heading font-semibold mb-4">Subscribe to our Emails</h3>
            <p className="text-sm text-gray-600 mb-4">
              Join our email list for exclusive offers and the latest news.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="form-input rounded-r-none"
                required
              />
              <button
                type="submit"
                className="px-4 bg-primary text-white rounded-r-md hover:bg-primary/90 transition-colors"
                aria-label="Subscribe"
              >
                <Mail size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-10 pt-6">
          <p className="text-sm text-center text-gray-600">
            &copy; {new Date().getFullYear()} Mr.Lion - Vasanthamaaligai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;