import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import SearchBar from '../search/SearchBar';

interface NavbarProps {
  isScrolled: boolean;
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

function Navbar({ isScrolled, toggleMobileMenu, isMobileMenuOpen }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="mr-2 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
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
              <h1 className="text-xl font-heading font-bold text-primary">Mr.Lion</h1>
              <p className="text-[0.6rem] text-gold font-light tracking-wider">VASANTHAMAALIGAI</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {link.name}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin-panel"
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                Admin Panel
              </NavLink>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-text" />
            </button>
            
            <Link 
              to="/cart" 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="text-text" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="User Account"
                >
                  <User size={20} className="text-text" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {user?.role === 'admin' && (
                    <Link to="/admin-panel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <button 
                    onClick={() => logout()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Login"
              >
                <User size={20} className="text-text" />
              </Link>
            )}
            
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div 
          className={`overflow-hidden transition-all duration-300 ${
            isSearchOpen ? 'h-16 opacity-100 mt-2' : 'h-0 opacity-0'
          }`}
        >
          <SearchBar onClose={toggleSearch} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;