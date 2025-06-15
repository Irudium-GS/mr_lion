import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div 
      className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-end p-4">
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="px-4 py-6">
        <nav className="flex flex-col space-y-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) => 
                `text-lg font-medium ${isActive ? 'text-primary' : 'text-text'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          
          {user?.role === 'admin' && (
            <NavLink
              to="/admin-panel"
              onClick={onClose}
              className={({ isActive }) => 
                `text-lg font-medium ${isActive ? 'text-primary' : 'text-text'}`
              }
            >
              Admin Panel
            </NavLink>
          )}
          
          <div className="border-t border-gray-200 pt-6">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={onClose}
                  className="block text-lg font-medium text-text mb-4"
                >
                  My Profile
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="block text-lg font-medium text-text"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={onClose}
                  className="block text-lg font-medium text-text mb-4"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={onClose}
                  className="block text-lg font-medium text-text"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default MobileMenu;