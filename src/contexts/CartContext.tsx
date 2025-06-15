import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { getCartItems, addToCart as addToCartDB, updateCartItemQuantity, removeFromCart as removeFromCartDB, clearCart as clearCartDB } from '../services/cartService';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  loading: boolean;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart from database when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromDatabase();
    } else {
      // Load from localStorage for non-authenticated users
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated, user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const items = await getCartItems(user.id);
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart from database:', error);
      // Fallback to localStorage
      loadCartFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  };

  const saveCartToLocalStorage = (items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const refreshCart = () => {
    if (isAuthenticated && user) {
      loadCartFromDatabase();
    } else {
      loadCartFromLocalStorage();
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    if (isAuthenticated && user) {
      try {
        await addToCartDB(user.id, product.id, quantity);
        await loadCartFromDatabase();
      } catch (error) {
        console.error('Error adding to cart in database:', error);
        // Fallback to localStorage
        addToCartLocalStorage(product, quantity);
      }
    } else {
      addToCartLocalStorage(product, quantity);
    }
  };

  const addToCartLocalStorage = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        newItems = [...prevItems, { product, quantity }];
      }
      
      saveCartToLocalStorage(newItems);
      return newItems;
    });
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated && user) {
      try {
        await removeFromCartDB(user.id, productId);
        await loadCartFromDatabase();
      } catch (error) {
        console.error('Error removing from cart in database:', error);
        // Fallback to localStorage
        removeFromCartLocalStorage(productId);
      }
    } else {
      removeFromCartLocalStorage(productId);
    }
  };

  const removeFromCartLocalStorage = (productId: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.product.id !== productId);
      saveCartToLocalStorage(newItems);
      return newItems;
    });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (isAuthenticated && user) {
      try {
        await updateCartItemQuantity(user.id, productId, quantity);
        await loadCartFromDatabase();
      } catch (error) {
        console.error('Error updating cart quantity in database:', error);
        // Fallback to localStorage
        updateQuantityLocalStorage(productId, quantity);
      }
    } else {
      updateQuantityLocalStorage(productId, quantity);
    }
  };

  const updateQuantityLocalStorage = (productId: string, quantity: number) => {
    setCartItems(prevItems => {
      const newItems = prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      );
      saveCartToLocalStorage(newItems);
      return newItems;
    });
  };

  const clearCart = async () => {
    if (isAuthenticated && user) {
      try {
        await clearCartDB(user.id);
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing cart in database:', error);
        // Fallback to localStorage
        clearCartLocalStorage();
      }
    } else {
      clearCartLocalStorage();
    }
  };

  const clearCartLocalStorage = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discountPercentage > 0
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price;
      
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        loading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}